---
name: code-review
description: Use when reviewing PRs for contentstack-javascript—API compatibility, bundles, Jest, and npm/CDN impact.
---

# Code review – contentstack-javascript

## When to use

- Reviewing SDK or Webpack changes
- Assessing dependency bumps (`@contentstack/utils`, Babel, Webpack, Jest)

## Instructions

### Checklist

- **Semver**: Breaking changes for npm and **jsDelivr** consumers called out with major bump and release notes.
- **Bundles**: Each target still builds; `package.json` entry points remain valid.
- **Tests**: `npm test` and `npm run lint` succeed for the change set.
- **Docs**: README or JSDoc updated for user-visible behavior.
- **Security**: No API keys in tests or docs.

### Severity hints

- **Blocker**: Broken `dist/` layout, failing CI, or regression in core `Stack` flow.
- **Major**: Missing tests for new API surface or cross-environment behavior.
- **Minor**: Internal refactors with full green tests.
