---
name: javascript
description: Use for Webpack configs, multi-target dist outputs, and Babel/loader setup in contentstack-javascript.
---

# JavaScript tooling – contentstack-javascript

## When to use

- Editing **`webpack/*.js`** or changing how `src` is bundled per platform
- Debugging path or env differences between **node**, **web**, **react-native**, and **nativescript** builds

## Instructions

### Webpack

- Each target has its own config (`webpack.node.js`, `webpack.web.js`, etc.)—keep shared options consistent via **`webpack-merge`** where the repo already does.

### Outputs

- Artifacts land under **`dist/`**—verify **`package.json`** `main` / `browser` / `react-native` fields after changing filenames or folders.

### Types

- **`index.d.ts`** ships typings—update when public JS exports or options change.
