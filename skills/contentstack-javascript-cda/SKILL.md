---
name: contentstack-js-cda
description: Contentstack Content Delivery (CDA) JavaScript SDK — Stack, tokens, regions, queries, sync, live preview in src/core/.
---

# Contentstack JavaScript CDA SDK skill

This repository ships **`contentstack`**, the **Content Delivery API** read client. It is **not** the Content Management API client (`@contentstack/management`).

## Mental model

1. **`Contentstack.Stack(options)`** (`src/core/stack.js`) configures the stack (**`api_key`**, **`delivery_token`**, **`environment`**, optional **`region`**, **`branch`**, **`host`**, **`live_preview`**, **`plugins`**, **`fetchOptions`**).
2. **Modules** under **`src/core/modules/`** implement **entries**, **assets**, **queries**, **taxonomy**, **results**, etc., composed from the stack instance.
3. **`src/core/lib/request.js`** performs **`fetch`**, query string building, retries, and **plugin** hooks.
4. **`src/runtime/*`** provides platform-specific **`http`** and **localstorage** implementations selected at build time.

## Configuration (see JSDoc on `Stack`)

- **`region`** / **`host`** — CDN / API host selection (see `stack.js` and **`config.js`** defaults).
- **`fetchOptions`** — **`timeout`**, **`retryLimit`**, **`retryDelay`**, **`retryCondition`** (defaults include **408** / **429**), **`retryDelayOptions`**, **`debug`**, **`logHandler`**.
- **`live_preview`** — enable flag, **`host`**, **`management_token`** or **`preview_token`**; affects which host serves preview vs delivery.
- **`plugins`** — `{ onRequest, onResponse }` hooks invoked from `request.js`.

## Implementing features

- Follow neighbors in **`src/core/modules/`** for method chaining, URL construction, and parameter passing into **`Request`**.
- Consider **cache policy** and **sync** behaviors when changing read paths.
- Multi-platform: verify **webpack** entries for **node**, **web**, **react-native**, **nativescript** if adding runtime dependencies.

## Docs

- Product: [Content Delivery API](https://www.contentstack.com/docs/developers/apis/content-delivery-api/)
- Types: root **`index.d.ts`**

## Rule shortcut

- `.cursor/rules/contentstack-javascript-cda.mdc` when editing `src/**/*.js`
