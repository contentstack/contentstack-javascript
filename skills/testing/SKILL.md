---
name: testing
description: Use for Jest e2e and TypeScript test suites, jest configs, and test layout in contentstack-javascript.
---

# Testing – contentstack-javascript

## When to use

- Adding tests under **`test/`** or adjusting **`jest.js.config.js`** / **`jest.config.js`**
- Debugging failures that only appear after **`pretest` / build**

## Instructions

### Suites

- **`npm run test:e2e`** — Jest with **`jest.js.config.js`**.
- **`npm run test:typescript`** — Jest with **`jest.config.js`**, limited to **`test/typescript`** paths.

### Order

- Full **`npm test`** runs e2e then TypeScript tests; both assume a fresh **`build`** (via **`pretest`**).

### Hygiene

- Do not commit stack secrets; use fixtures or env patterns documented for this repo.
