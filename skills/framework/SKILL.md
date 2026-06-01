---
name: framework
description: HTTP and cross-cutting behavior for the CDA SDK — request.js, fetch retries, plugins, runtime http/localstorage.
---

# Framework skill — HTTP / transport / runtime

The SDK isolates networking and retries in **`src/core/lib/request.js`**, with platform-specific **`fetch`** and storage under **`src/runtime/`**.

## Key modules

| File / area | Responsibility |
|-------------|----------------|
| **`src/core/lib/request.js`** | Builds query string from stack **`requestParams`**, sets headers (**`X-User-Agent`**, content type), **`fetchRetry`**, integrates **`stack.plugins`** (`onRequest` / `onResponse`), parses JSON, maps HTTP errors to rejection objects |
| **`src/core/lib/utils.js`** | Merge/deep helpers and shared utilities used by stack and modules |
| **`src/core/stack.js`** | Default **`fetchOptions`** (retry policy, **`logHandler`**), merges user options, constructs **`requestParams`** for calls |
| **`src/runtime/node/http.js`**, **`web/http.js`**, etc. | Platform **`fetch`** implementation wired via webpack alias **`runtime/http.js`** |
| **`src/runtime/*/localstorage.js`** | Cache provider storage for each target |

## When to change this layer

- **Retry policy**, status-based retry, timeout defaults → **`request.js`** / **`stack.js`** (`fetchOptions`) and JSDoc on **`Stack`**.
- **Headers**, user-agent format, query serialization → **`request.js`** (keep backward compatible for CDN query shapes).
- **New global hook** → extend **plugin** contract consistently in **`request.js`**.
- **New platform** → add **`src/runtime/<platform>/`**, webpack config, and package **entry** fields if needed.

## Tests

- Extend **`test/`** or **`test/typescript/`** when changing request behavior; many suites load **`dist/node/contentstack.js`** — run **`npm run build`** after `src/` edits.

## Rule shortcut

- `.cursor/rules/javascript.mdc` for style; CDA semantics in `.cursor/rules/contentstack-javascript-cda.mdc`
