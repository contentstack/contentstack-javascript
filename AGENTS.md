# AGENTS.md — AI / automation context

## Project

| | |
|---|---|
| **Name** | **`contentstack`** (npm) — **Contentstack JavaScript Content Delivery SDK** |
| **Purpose** | Client for the **Content Delivery API (CDA)**: read published content, assets, taxonomies, sync, and live preview from a stack. *(This is not the Content Management API / CMA client — see `@contentstack/management`.)* |
| **Repository** | [contentstack/contentstack-javascript](https://github.com/contentstack/contentstack-javascript.git) |

## Tech stack

| Area | Details |
|------|---------|
| **Language** | JavaScript **ES modules** in `src/core/` and `src/runtime/`; public types in root **`index.d.ts`** |
| **Runtime** | Node `>= 10.14.2` per `package.json` `engines` |
| **Build** | **Webpack** bundles for `node`, `web`, `react-native`, `nativescript` → `dist/` (`npm run build`) |
| **Lint / style** | **ESLint** with `eslint-config-standard`, **`@babel/eslint-parser`**; **semicolons required** (see `.eslintrc.js`) |
| **Tests** | **Jest**: JS e2e-style suite (`jest.js.config.js`, `test/**/*.js`) and **TypeScript** tests (`jest.config.js`, `test/typescript/**/*.test.ts`) |
| **HTTP** | Platform **`fetch`** via webpack alias `runtime/http.js` and `runtime/localstorage.js` (Node / web / React Native / NativeScript) |
| **Helpers** | **`@contentstack/utils`** re-exported on the `Contentstack` instance |

## Source layout & public entrypoints

| Path | Role |
|------|------|
| `src/core/contentstack.js` | Package facade: `Stack()`, `CachePolicy`, `Region`, `Utils` |
| `src/core/stack.js` | `Stack` class: delivery config, queries, sync, plugins, `fetchOptions` |
| `src/core/lib/request.js` | CDA requests: query serialization, retries, plugins `onRequest` / `onResponse` |
| `src/core/lib/utils.js` | Shared helpers |
| `src/core/modules/*` | Entry, Query, Assets, Taxonomy, Result, etc. |
| `src/core/cache*.js`, `src/core/cache-provider/` | Cache policies and providers |
| `src/runtime/**` | Per-platform `http` and `localstorage` implementations |
| `config.js` | Default CDN host, API version, URL paths (imported by `stack.js`) |
| `webpack/` | Build configs per target |
| `dist/**` | Built artifacts (`package.json` `main` / `browser` / `react-native`) |

## Common commands

```bash
npm install
npm run build          # all webpack targets (also runs on prepare / pretest)
npm run lint           # eslint src test
npm run format         # eslint src test --fix
npm run test           # test:e2e + test:typescript (pretest runs build)
npm run test:e2e       # Jest JS tests under test/ (see jest.js.config.js)
npm run test:typescript # Jest + ts-jest for test/typescript
npm run generate-docs  # JSDoc (docs-config.json)
```

**Live API tests**

- **`test/config.js`** loads **`.env`** and **requires** `HOST`, `API_KEY`, `DELIVERY_TOKEN`, `ENVIRONMENT`. Without them, importing `test/config.js` throws.
- Jest e2e tests use **`dist/node/contentstack.js`** (built output). Run **`npm run build`** (or `npm test`, which runs `pretest`) before relying on fresh `src/` changes.

## Further guidance

- **Cursor rules:** [`.cursor/rules/README.md`](.cursor/rules/README.md)
- **Deeper playbooks:** [`skills/README.md`](skills/README.md)

When unsure about API behavior, prefer the official [Content Delivery API](https://www.contentstack.com/docs/developers/apis/content-delivery-api/) documentation and existing JSDoc in `src/core/`.
