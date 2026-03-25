---
description: "Branches, tests, and PR expectations for contentstack-javascript (CDA SDK)"
globs: ["**/*.js", "**/*.ts", "**/*.json"]
alwaysApply: false
---

# Development workflow — Contentstack JavaScript CDA SDK

## Branches

- Follow team Git conventions (e.g. feature branches off the repo’s default integration branch).
- Do not commit permanent `test.only`, `it.only`, `describe.only`, or skipped tests meant for CI.

## Before opening a PR

1. **`npm run lint`** — ESLint must pass on `src` and `test`.
2. **`npm test`** — Runs **`pretest`** → **`npm run build`**, then **`test:e2e`** and **`test:typescript`**. For live stack tests, set env vars (see **`test/config.js`**: `HOST`, `API_KEY`, `DELIVERY_TOKEN`, `ENVIRONMENT`). Never commit secrets or `.env` with real tokens.
3. **Version bump** — When the PR introduces **user-visible or release-worthy** SDK behavior (new API, bug fix shipped to npm, or a **breaking** change), update **`version`** in `package.json` per **semver** (patch / minor / major). Docs-only or test-only changes may omit a bump per team practice; match sibling PRs when unsure.

## PR expectations (summary)

- **User-facing changes** — JSDoc on public methods; update **`index.d.ts`** when the public TypeScript surface changes.
- **Behavior** — Preserve backward compatibility unless the change is explicitly breaking and documented.
- **Errors** — Keep rejection shapes consistent with **`src/core/lib/request.js`** (`error_message`, `error_code`, `errors`, `status`, `statusText` where applicable). Do not log full **delivery_token** or **management_token** / **preview_token** values in new code.
- **Tests** — Add or adjust Jest tests under **`test/`** for new behavior; live tests require the env contract in **`test/config.js`**.

## Quick links

- Agent overview: repo root `AGENTS.md`
- CDA patterns: `skills/contentstack-javascript-cda/SKILL.md`
- HTTP / retries / plugins: `skills/framework/SKILL.md`
