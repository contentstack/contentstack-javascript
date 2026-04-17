---
name: contentstack-javascript-sdk
description: Use for the contentstack npm package API—Stack, regions, queries, and @contentstack/utils usage.
---

# JavaScript Delivery SDK – contentstack-javascript

## When to use

- Changing how consumers call **`Contentstack.Stack(...)`** or Delivery API wrappers
- Updating **`@contentstack/utils`** or cross-runtime behavior (browser vs Node vs RN)

## Instructions

### Package surface

- Published as **`contentstack`** on npm; entry fields in **`package.json`** point to **`dist/node`**, **`dist/web`**, **`dist/react-native`**, etc.

### API stability

- This SDK has a long-lived **3.x** line—treat breaking changes as **semver major** and document migration for CDN and npm users.

### Boundaries

- Keep browser bundles free of Node-only APIs; keep Node builds free of DOM assumptions unless guarded.
- Align behavior with other CDA SDKs where features overlap (regions, preview, sync) and update **`README.md`** examples when user-facing options change.
