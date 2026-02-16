# Part 25: Mocking External Services

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/25-mocking-external-services.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Mocking External Services: Testing Without the Real World"
description: "Mock external APIs and AWS services in tests with MSW, responses/httpx-mock, and testify/gomock. Reliable tests that don't depend on third-party uptime."
excerpt: "Testing without the real world. Mock external APIs and AWS services — because your tests shouldn't fail when Stripe is down."
date: "2026-04-11"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "testing"]
series: "AWS From Zero to Production"
seriesPart: 25
featured: false
draft: true
---
```

## Component Imports

```mdx
import Command from '../../../components/shared/Command.astro';
import TerminalOutput from '../../../components/shared/TerminalOutput.astro';
import Alert from '../../../components/shared/Alert.astro';
import ValidationChecklist from '../../../components/shared/ValidationChecklist.astro';
import PanelSwitcher from '../../../components/shared/PanelSwitcher.astro';
import Panel from '../../../components/shared/Panel.astro';
```

## Opening Hook

Your tests call Stripe's API. Stripe has a 15-minute outage. Your CI pipeline fails. Your deploy is blocked. Not because your code is broken, but because a third-party service is temporarily unavailable. Mocking fixes this.

Time promise: 35 minutes.
Outcome promise: Mocked external services in your test suite (MSW for JS, responses for Python, gomock for Go), with patterns for mocking AWS SDK calls.

## Section Outline

### 1. Why This Matters — External dependencies in tests
### 2. Mocking by Language — MSW (Bun), responses/httpx-mock (Python), testify/gomock (Go)
### 3. Mocking AWS SDK Calls — DynamoDB, S3, SES mock patterns
### 4. Agent-Generated Mocks — Agent generates mock setups from API specs
### 5. Test Isolation Patterns — Reset between tests, factory functions

## The Fine Line

| | |
|---|---|
| ❌ Under | Tests hit real external services, flaky CI |
| ✅ Right | Mocked external services, mocked AWS SDK, isolated tests |
| ❌ Over | Mock everything including your own internal services |
| 🤖 Agent Trap | Agent mocks at the wrong level (mocking HTTP when you should mock the SDK client) |

## Thread Progression

- All threads: No changes

## Validation Checklist Items

- **Mocking:** External API calls mocked in test suite; AWS SDK calls mocked; Tests pass without network access; Mocks match real API contracts

## Key Takeaways

1. Mock external services and AWS SDK calls — your tests should never depend on third-party uptime.
2. Mock at the right level: HTTP mocking for external APIs, SDK client mocking for AWS services.
3. Agents generate good mock setups when given the API spec as context — include it in the prompt.
