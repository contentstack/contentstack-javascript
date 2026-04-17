# Contentstack JavaScript Delivery SDK – Agent guide

**Universal entry point** for contributors and AI agents. Detailed conventions live in **`skills/*/SKILL.md`**.

## What this repo is

| Field | Detail |
|--------|--------|
| **Name:** | [contentstack-javascript](https://github.com/contentstack/contentstack-javascript) (npm package **`contentstack`**) |
| **Purpose:** | Legacy **JavaScript** Content Delivery SDK for browsers, Node.js, React Native, and NativeScript—stack initialization, queries, entries, assets. |
| **Out of scope:** | Not the TypeScript-first **`@contentstack/delivery-sdk`** (`contentstack-typescript`); new TypeScript projects should prefer that package when appropriate. |

## Tech stack (at a glance)

| Area | Details |
|------|---------|
| Language | JavaScript in **`src/`**; TypeScript tests via Jest (`test/typescript`) |
| Build | Webpack configs under **`webpack/`**; outputs under **`dist/`** per target (`npm run build`) |
| Tests | Jest: **`test:e2e`** (`jest.js.config.js`) and **`test:typescript`** (`jest.config.js`); **`pretest`** runs **`build`** first |
| Lint / coverage | ESLint on `src` and `test` (`npm run lint`) |
| CI | `.github/workflows/check-branch.yml`, `npm-publish.yml`, `sca-scan.yml`, `policy-scan.yml`, `codeql-analysis.yml`, `link-check.yml`, `issues-jira.yml` |

## Commands (quick reference)

| Command type | Command |
|--------------|---------|
| Build | `npm run build` |
| Test | `npm test` (build via `pretest`, then e2e + TypeScript Jest suites) |
| Lint | `npm run lint` |

## Where the documentation lives: skills

| Skill | Path | What it covers |
|-------|------|----------------|
| **Development workflow** | [`skills/dev-workflow/SKILL.md`](skills/dev-workflow/SKILL.md) | Branches, npm scripts, Husky, CI |
| **JavaScript SDK** | [`skills/contentstack-javascript-sdk/SKILL.md`](skills/contentstack-javascript-sdk/SKILL.md) | Public API (`Stack`, regions), `@contentstack/utils` |
| **JavaScript tooling** | [`skills/javascript/SKILL.md`](skills/javascript/SKILL.md) | Webpack targets, `dist/` layout, Babel |
| **Testing** | [`skills/testing/SKILL.md`](skills/testing/SKILL.md) | Jest configs, e2e vs TypeScript tests |
| **Code review** | [`skills/code-review/SKILL.md`](skills/code-review/SKILL.md) | PR checklist |

## Using Cursor (optional)

If you use **Cursor**, [`.cursor/rules/README.md`](.cursor/rules/README.md) only points to **`AGENTS.md`**—same docs as everyone else.
