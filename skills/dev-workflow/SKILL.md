---
name: dev-workflow
description: Use for npm scripts, Husky, CI, and branch workflow in contentstack-javascript.
---

# Development workflow – contentstack-javascript

## When to use

- Running builds or tests before a PR
- Aligning with GitHub Actions (branch checks, publish, SCA)

## Instructions

### Branches

- Default branch is **`master`** (`origin/HEAD`); **`development`** and **`next`** also exist—confirm PR target with the team.

### Commands

- **`npm run build`** — all Webpack targets (node, web, react-native, native-script).
- **`npm test`** — runs **`pretest`** (which builds) then **`test:e2e`** and **`test:typescript`**.
- **`npm run lint`** — ESLint on `src` and `test`.

### Hooks

- **`prepare`** runs **`build`** on install—expect compile time after dependency changes.
- **`husky-check`** script wires Husky for pre-commit hooks when used.

### CI

- Workflows under **`.github/workflows/`** include npm publish, CodeQL, SCA, policy scans, and link checks.
