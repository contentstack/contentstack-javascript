---
name: code-review
description: Use when reviewing PRs or before opening a PR — API design, errors, backward compatibility, dependencies, security, and test quality for the CDA SDK.
---

# Code review — Contentstack JavaScript CDA SDK

Use this skill for pull request review or self-review of the **`contentstack`** package (**Content Delivery API** client — not `@contentstack/management` / CMA).

## When to use

- Reviewing someone else’s PR.
- Self-reviewing before submission.
- Checking API, error, compatibility, tests, and security expectations.

## Instructions

Work through the checklist. Optionally tag severity: **Blocker**, **Major**, **Minor**.

### 1. API design and stability

- [ ] **Public API:** New or changed exports are documented with **JSDoc**, consistent with `src/core/contentstack.js` and `src/core/stack.js`.
- [ ] **TypeScript surface:** **`index.d.ts`** updated when consumers would see new or changed signatures.
- [ ] **Backward compatibility:** No breaking changes to public signatures, option objects, or defaults without an agreed major bump.
- [ ] **Naming:** Consistent with **CDA** concepts (stack, entry, query, asset, taxonomy, sync, environment).

**Severity:** Breaking public API without approval = **Blocker**. Missing JSDoc or types on new public API = **Major**.

### 2. Error handling and robustness

- [ ] **Errors:** Rejections align with **`src/core/lib/request.js`** patterns (`error_message`, `error_code`, `errors`, `status`, `statusText` when JSON is available).
- [ ] **Null safety:** Guard optional nested fields from API responses.
- [ ] **Secrets:** No logging of full **delivery_token**, **preview_token**, **management_token**, or **api_key**.

**Severity:** Missing or inconsistent error handling on new paths = **Major**.

### 3. Dependencies and security

- [ ] **Dependencies:** New or upgraded packages are justified; lockfile changes are intentional.
- [ ] **SCA:** Address or explicitly track security findings from org tooling (Snyk, Dependabot, etc.).

**Severity:** Unaddressed critical/high issues in scope = **Blocker**.

### 4. Testing

- [ ] **Jest:** New or changed behavior has coverage under **`test/`** (JS and/or **`test/typescript/`**).
- [ ] **Live tests:** If tests hit the network, they respect **`test/config.js`** (`HOST`, `API_KEY`, `DELIVERY_TOKEN`, `ENVIRONMENT`); no committed secrets.
- [ ] **Build:** Fresh `src/` changes are validated against **`dist/node/contentstack.js`** after **`npm run build`** when tests import dist.

**Severity:** No tests for new behavior = **Blocker** (unless truly docs-only). Flaky tests = **Major**.

### 5. Optional severity summary

- **Blocker:** Must fix before merge.
- **Major:** Should fix before or soon after merge.
- **Minor:** Nice to fix.

## References

- `.cursor/rules/code-review.mdc`
- `.cursor/rules/dev-workflow.md`
- `skills/testing/SKILL.md`
