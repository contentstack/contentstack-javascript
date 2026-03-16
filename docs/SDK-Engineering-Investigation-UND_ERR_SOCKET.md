# SDK Engineering Investigation: Connection Drops / UND_ERR_SOCKET Handling

**Context:** Customer (Berlitz) experienced intermittent Node.js build crashes when the Contentstack SDK (v3.17.1) fetched from the CDA during AWS CodeBuild. The process terminated with `TypeError: terminated` and `[cause]: SocketError: other side closed (code: UND_ERR_SOCKET)`.

**Scope:** Investigate how the Contentstack SDK and Node 22’s undici fetch layer handle connection drops/socket closures, and whether the SDK can catch these errors to retry or return a formatted error and prevent process crash.

---

## 1. Request Flow: SDK → Fetch → Undici

| Layer | Component | Role |
|-------|-----------|------|
| App | Customer code (e.g. Astro build) | Calls `Stack.ContentType(...).Query().find()` or `.fetch()` |
| SDK | `src/core/lib/request.js` → `fetchRetry()` | Builds URL/options, calls `fetch()`, handles response and retries |
| Runtime | `src/runtime/node/http.js` | Re-exports global `fetch` (Node 18+ built-in) |
| Node | Built-in `fetch` | Implemented by **undici** (bundled in Node 18+) |
| Undici | Fetch / TLSSocket | Performs HTTP, surfaces errors via rejected promise and `error.cause` |

- In **Node 22**, the global `fetch` is provided by Node’s bundled **undici**. The SDK does not import undici directly; it uses whatever `fetch` the Node runtime exposes (`runtime/http.js` → global `fetch`).
- When the **remote server closes the TLS connection** (e.g. CDN/edge closes the socket), undici:
  - Emits the error internally (e.g. `Fetch.onAborted`, `Fetch.terminate`).
  - Rejects the **fetch promise** with a `TypeError('terminated', { cause: SocketError })`, where `cause.code === 'UND_ERR_SOCKET'`.
  - Alternatively, if the connection closes **after** the response object is returned but **during** body consumption, the promise returned by **`response.json()`** (or `response.text()` / body read) rejects with the same kind of error.

So:
- **Fetch-level:** The `fetch(url, options)` promise rejects with `TypeError: terminated` and `error.cause.code === 'UND_ERR_SOCKET'` (or `UND_ERR_ABORTED`).
- **Body-read-level:** The `response.json()` promise rejects with the same when the socket is closed while reading the body.

---

## 2. Previous SDK Behavior (Gaps)

### 2.1 Where the crash came from

- **Unhandled rejection in the 200 branch**  
  For `response.ok && response.status === 200`, the SDK did:
  - `const data = response.json();`
  - `data.then(json => { ... resolve(json); });`
  - **No `.catch()`** on that `data` promise.  
  If the remote closed the connection **during** body read, `response.json()` rejected with `TypeError: terminated`. That rejection was **unhandled** and could trigger Node’s unhandled-rejection behavior and **terminate the process**.

- **Fetch-level rejection was caught but not retried**  
  The outer `fetch(...).catch((error) => { reject(error); })` did catch fetch-level errors (e.g. connection closed before/during response). So the **fetch** rejection itself did not leave an unhandled rejection. However:
  - Socket/abort errors were **not** retried; only HTTP status–based retries (e.g. 408, 429) were done via `retryCondition`.
  - So a single UND_ERR_SOCKET led to one rejected promise. If the **caller** did not handle that rejection (e.g. missing `.catch()` on a parallel or fire-and-forget call), it could still crash the process.

- **Non-200 branch**  
  The non-200 path had `.catch(() => reject({ status, statusText }))` on `data.then(...)`, so body-read failures were caught, but:
  - The real error was discarded (no retry for socket/abort, and the rejected value was a generic `{ status, statusText }`).

### 2.2 Summary of previous behavior

| Scenario | Handled? | Retried? | Result |
|----------|----------|----------|--------|
| Fetch rejects (e.g. socket closed before/during response) | Yes (outer .catch) | No | Reject once → crash if caller doesn’t handle |
| `response.json()` rejects in 200 branch (socket closed during body) | **No** | No | **Unhandled rejection → process crash** |
| `response.json()` rejects in non-200 branch | Yes | No | Reject with generic object |

---

## 3. Current SDK Behavior (After Fix)

The following is implemented in **`src/core/lib/request.js`** (same behavior for SDK versions that include this fix).

### 3.1 Detecting socket/abort errors

The SDK treats an error as a **socket/abort** error when:

- `error.message === 'terminated'`, or  
- `error.cause && (error.cause.code === 'UND_ERR_SOCKET' || error.cause.code === 'UND_ERR_ABORTED')`

This matches how Node 22 / undici surface connection drops and aborts.

### 3.2 Catching and handling

- **200 branch**
  - `data.then(...).catch((err) => { ... })` is attached to the promise from `response.json()`.
  - If that promise rejects (e.g. UND_ERR_SOCKET during body read):
    - The error is **caught** (no unhandled rejection).
    - If it is a socket/abort error and `retryLimit > 0`, the SDK calls `onError(err)` and **retries** with the existing backoff.
    - Otherwise it **rejects** the Request promise with the same `err`, so the caller gets a proper rejection they can handle.

- **Non-200 branch**
  - `.catch((err) => { ... })` is used on the `data.then(...)` chain.
  - Same logic: socket/abort → retry when `retryLimit > 0`, else reject with `err` (or `{ status, statusText }` if `err` is missing).

- **Fetch-level**
  - The outer `fetch(...).catch((error) => { ... })` still catches when the **fetch** promise rejects (e.g. connection closed before or during response).
  - If the error is socket/abort and `retryLimit > 0`, the SDK calls `onError(error)` and **retries**.
  - Otherwise it **rejects** with the same `error`.

### 3.3 Retry behavior

- Retries use the existing **fetchOptions**: `retryLimit` (default 5), `retryDelay` (default 300 ms), and optional `retryDelayOptions` (e.g. base or customBackoff).
- No change to the existing retry contract; socket/abort errors are now **eligible** for the same retry path as other retriable failures.

---

## 4. Conclusion

| Question | Answer |
|----------|--------|
| How does the SDK interact with undici? | Via the global `fetch` in Node (Node runtime). The SDK does not use undici directly. |
| How does Node 22 / undici surface connection drops? | By rejecting the `fetch` promise or the `response.json()` (body) promise with `TypeError('terminated', { cause: SocketError })` and `cause.code === 'UND_ERR_SOCKET'` (or `UND_ERR_ABORTED`). |
| Can the SDK catch Fetch.onAborted / UND_ERR_SOCKET? | **Yes.** Both the fetch-level rejection and the body-read (e.g. `response.json()`) rejection are caught in `request.js`. |
| Does the SDK initiate a retry for these errors? | **Yes.** When the error is identified as socket/abort and `retryLimit > 0`, the SDK uses the existing `onError()` path and retries with the configured delay/backoff. |
| Does the SDK return a formatted error instead of crashing? | **Yes.** If retries are exhausted or the error is not socket/abort, the SDK **rejects** the Request promise with the same error object (so the caller can inspect `error.message`, `error.cause`, and `error.cause.code`). The process does not crash from an unhandled rejection in the SDK. |

**Summary:** The SDK now catches connection drops and socket closures (Fetch.onAborted / UND_ERR_SOCKET) at both fetch and body-read level, retries them when possible using the existing retry mechanism, and otherwise rejects the returned promise with the underlying error. This prevents unhandled exceptions from crashing the user’s Node.js build process while keeping errors identifiable (e.g. for logging or 422 handling).

---

## 5. References

- **Request implementation:** `src/core/lib/request.js` (fetchRetry, 200/non-200 branches, outer fetch .catch).
- **Node runtime:** `src/runtime/node/http.js` (re-exports global `fetch`).
- **Customer error:** `TypeError: terminated` with `[cause]: SocketError: other side closed`, `code: 'UND_ERR_SOCKET'` (e.g. from Node `internal/deps/undici`).
- **Node 22:** Uses bundled undici for `fetch`; socket errors are surfaced as above.
