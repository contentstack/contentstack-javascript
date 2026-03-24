# Cursor Rules Documentation

This directory contains **Cursor AI rules** for the **Contentstack JavaScript Content Delivery SDK** (`contentstack` on npm) — CDA client development in this repository.

## Rules overview

| Rule | Role |
|------|------|
| [`dev-workflow.md`](dev-workflow.md) | Branches, lint/tests before PR, build + version bump guidance, links to skills |
| [`javascript.mdc`](javascript.mdc) | JavaScript / TypeScript declaration style: `src/`, `webpack/`, root `index.d.ts` |
| [`contentstack-javascript-cda.mdc`](contentstack-javascript-cda.mdc) | CDA SDK patterns: `Stack`, delivery token, host/region, request/cache/live preview |
| [`testing.mdc`](testing.mdc) | Jest e2e (`test/**/*.js`) and TypeScript tests; `test/config.js` env |
| [`code-review.mdc`](code-review.mdc) | PR checklist: JSDoc, `index.d.ts`, compat, errors, tests, CDA semantics (**always applied**) |

## Rule application

Rules load from **globs** and **`alwaysApply`** in each file’s frontmatter.

| Context | Typical rules |
|---------|----------------|
| **Every chat / session** | [`code-review.mdc`](code-review.mdc) (`alwaysApply: true`) |
| **Most project files** | [`dev-workflow.md`](dev-workflow.md) — `**/*.js`, `**/*.ts`, `**/*.json` |
| **SDK implementation** | [`javascript.mdc`](javascript.mdc) + [`contentstack-javascript-cda.mdc`](contentstack-javascript-cda.mdc) for `src/**/*.js` |
| **Build config** | [`javascript.mdc`](javascript.mdc) for `webpack/**/*.js` |
| **Public types** | [`javascript.mdc`](javascript.mdc) for `index.d.ts` |
| **Tests** | [`testing.mdc`](testing.mdc) for `test/**/*.js`, `test/**/*.ts` |

Overlaps are expected (e.g. editing `src/core/stack.js` can match `dev-workflow`, `javascript`, and `contentstack-javascript-cda`).

## Usage

- Rules load automatically when opened files match their globs (`code-review` is always in context).
- You can **@ mention** rule files in chat when supported.

## Quick reference table

| File | `alwaysApply` | Globs (summary) |
|------|---------------|-----------------|
| `dev-workflow.md` | no | `**/*.js`, `**/*.ts`, `**/*.json` |
| `javascript.mdc` | no | `src/**/*.js`, `webpack/**/*.js`, `index.d.ts` |
| `contentstack-javascript-cda.mdc` | no | `src/**/*.js` |
| `testing.mdc` | no | `test/**/*.js`, `test/**/*.ts` |
| `code-review.mdc` | **yes** | — |

## Skills & maintenance

- Deeper playbooks: [`skills/README.md`](../../skills/README.md).
- Repo agent entry: [`AGENTS.md`](../../AGENTS.md).
- When directories change, update **globs** in rule frontmatter; keep rules short and put detail in `skills/*/SKILL.md`.
