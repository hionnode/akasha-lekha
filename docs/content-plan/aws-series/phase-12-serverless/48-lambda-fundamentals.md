# Part 48: Lambda Fundamentals

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/48-lambda-fundamentals.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Lambda Fundamentals: Functions That Scale to Zero"
description: "AWS Lambda execution model, pricing, cold starts, and the agent mistakes that 4x your serverless bill. Foundation for serverless deployment."
excerpt: "Functions that scale to zero. Lambda fundamentals — execution model, pricing, and the agent mistakes that quadruple your serverless bill."
date: "2026-07-10"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "lambda", "serverless", "terraform"]
series: "AWS From Zero to Production"
seriesPart: 48
featured: false
draft: true
---
```

## Section Outline
### 1. Why This Matters — Pay per invocation, scale to zero, no servers
### 2. Execution Model — Cold start, warm start, execution environment lifecycle
### 3. Pricing — Request count + duration + memory, cost optimization
### 4. Memory and Timeout — Right-sizing (128MB default, profile before increasing)
### 5. Reserved Concurrency — Protecting shared resources
### 6. Dead Letter Queues — Failed invocation handling
### 7. AGENT-INSTRUCTIONS.md Addition — Lambda rules (6 lines)

## The Fine Line
| | |
|---|---|
| ❌ Under | No timeout set, no DLQ, default memory |
| ✅ Right | Explicit timeout, 128MB default (profile to increase), reserved concurrency, DLQ configured |
| ❌ Over | Provisioned concurrency, SnapStart, before measuring cold start impact |
| 🤖 Agent Trap | Agent sets 512MB memory (4x cost) and forgets timeout (defaults to 3s which may be too short or too long) |

## Thread Progression
- **AGENT-INSTRUCTIONS.md:** Lambda section added (6 lines). Cumulative: 77 lines.
- **Scorecard:** No new panels
- **Eval:** No changes
- **MCP:** No changes

## Key Takeaways
1. Lambda pricing is memory x duration — setting 512MB when 128MB works costs 4x more.
2. Always set explicit timeouts. The 3-second default is wrong for almost every use case.
3. Dead Letter Queues are non-negotiable — failed invocations must go somewhere.

## Lead Magnet
- **Name:** Lambda Cold Start Cheatsheet
- **Format:** PDF
- **Contents:** Cold start by runtime/memory, optimization strategies, provisioned concurrency decision tree, cost calculator.
