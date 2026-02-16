# Part 52: Serverless Patterns

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/52-serverless-patterns.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Serverless Patterns: Beyond Request-Response"
description: "Common serverless patterns: fan-out with SNS, step functions for workflows, DLQ error handling, and the architectural patterns that make serverless production-ready."
excerpt: "Beyond request-response. Serverless patterns — fan-out, step functions, DLQ handling — the architectural patterns that make Lambda production-ready."
date: "2026-07-26"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "lambda", "serverless"]
series: "AWS From Zero to Production"
seriesPart: 52
featured: false
draft: true
---
```

## Section Outline
### 1. Fan-Out Pattern — SNS → multiple Lambda functions
### 2. Step Functions — Workflow orchestration, error handling, retries
### 3. DLQ Patterns — Handling failed invocations systematically
### 4. Event Filtering — Processing only relevant events
### 5. Idempotency — Lambda retry behavior and idempotent handlers

## The Fine Line
| | |
|---|---|
| ❌ Under | Lambda as simple HTTP handlers only |
| ✅ Right | Event-driven patterns, DLQ handling, idempotent handlers, step functions for workflows |
| ❌ Over | Complex step function workflows, event sourcing, before you need them |
| 🤖 Agent Trap | Agent generates non-idempotent Lambda handlers — retries cause duplicate processing |

## Thread Progression
- All threads: No changes

## Key Takeaways
1. Lambda retries failed invocations — your handlers MUST be idempotent.
2. Step Functions replace custom orchestration code — let AWS manage the workflow state machine.
3. DLQ is the safety net for every Lambda function — failed events go somewhere, not into the void.
