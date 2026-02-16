# Part 26: E2E Testing with Playwright

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/26-e2e-testing-playwright.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "E2E Testing with Playwright: Confidence Before You Deploy"
description: "Set up cross-browser E2E tests with Playwright. Test your frontend + API integration, visual regression, and CI-ready test configuration."
excerpt: "Confidence before you deploy. Playwright E2E tests across Chromium, Firefox, and Safari — because unit tests don't catch integration bugs."
date: "2026-04-14"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "testing"]
series: "AWS From Zero to Production"
seriesPart: 26
featured: false
draft: true
---
```

## Component Imports

```mdx
import Command from '../../../components/shared/Command.astro';
import CommandSequence from '../../../components/shared/CommandSequence.astro';
import TerminalOutput from '../../../components/shared/TerminalOutput.astro';
import Alert from '../../../components/shared/Alert.astro';
import ValidationChecklist from '../../../components/shared/ValidationChecklist.astro';
import FileTree from '../../../components/shared/FileTree.astro';
```

## Opening Hook

All unit tests pass. All integration tests pass. You deploy. The login button doesn't work because a CSS change moved it behind the cookie banner. E2E tests catch what unit and integration tests can't — the full user journey through the real browser.

Time promise: 40 minutes.
Outcome promise: Playwright test suite covering critical user journeys across three browsers, ready for CI.

## Section Outline

### 1. Why This Matters — The gap between unit tests and real user experience
### 2. Playwright Setup — Installation, configuration, browsers
### 3. Test Patterns — Page objects, fixtures, assertions
### 4. Critical Path Tests — Login flow, core CRUD operations, error states
### 5. Visual Regression — Screenshot comparison
### 6. CI Configuration — Headless browsers, artifacts, parallelization

## The Fine Line

| | |
|---|---|
| ❌ Under | No E2E tests, manual testing only |
| ✅ Right | Playwright with critical path coverage, 3 browsers, CI-ready |
| ❌ Over | 100% E2E coverage, visual regression on every component |
| 🤖 Agent Trap | Agent generates E2E tests with hardcoded selectors that break on any UI change |

## Thread Progression

- All threads: No changes

## Validation Checklist Items

- **Playwright:** Installed with Chromium, Firefox, WebKit; Critical path tests passing; Tests run headlessly for CI
- **Test Quality:** Page objects used (not hardcoded selectors); Tests isolated and independent; Artifacts (screenshots, traces) captured on failure

## Key Takeaways

1. E2E tests catch what unit tests can't — real browser interactions, CSS issues, integration bugs.
2. Test critical paths only (login, core flows, errors) — don't try to E2E test everything.
3. Agent-generated Playwright tests use hardcoded selectors — refactor to page objects immediately.

## Lead Magnet

- **Name:** Playwright Test Templates
- **Format:** TypeScript/JavaScript files
- **Contents:** Page object patterns, fixture setup, CI configuration, common assertion helpers.
