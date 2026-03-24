---
name: testing
description: How to run and extend tests — Jest e2e (test/*.js), TypeScript tests, test/config.js env, dist build.
---

# Testing skill — `contentstack` (CDA)

## Commands (from `package.json`)

| Goal | Command |
|------|---------|
| Lint | `npm run lint` |
| Full test (includes build) | `npm test` — runs **`pretest`** → **`npm run build`**, then **`test:e2e`** + **`test:typescript`** |
| JS Jest suite only | `npm run test:e2e` — config: **`jest.js.config.js`** |
| TypeScript / Jest | `npm run test:typescript` — config: **`jest.config.js`** |
| Build | `npm run build` — required before trusting **`dist/`** against updated `src/` |

## JS tests (`test/**/*.js`)

- Wired from **`test/index.js`** via `require(...)`.
- **`jest.js.config.js`** sets `testEnvironment: node`, HTML reporters, and **ignore patterns** for `test/index.js`, `test/config.js`, `test/sync_config.js`, and certain `utils.js` paths — check the config when adding files.

## Environment variables (live stack)

**Authoritative validation:** **`test/config.js`** (uses **dotenv**).

**Required** when importing `test/config.js` (used by tests that need stack credentials):

- **`HOST`** — delivery API host for your region/stack
- **`API_KEY`**
- **`DELIVERY_TOKEN`**
- **`ENVIRONMENT`**

If any are missing, the process throws on import. Use a local **`.env`**; never commit real tokens.

## TypeScript tests (`test/typescript/`)

- **`jest.config.js`**: **ts-jest**, transforms for TS/JS; HTML report under **`typescript-html-report/`** per config.
- Use for type-level and behavioral checks against the public SDK shape; keep assertions aligned with **`index.d.ts`**.

## Hygiene

- No committed **`only`** / **`skip`** for CI-mandatory tests.
- Prefer stable ordering and avoid time-dependent assertions unless unavoidable.

## References

- `.cursor/rules/testing.mdc`
- `test/README.md`
