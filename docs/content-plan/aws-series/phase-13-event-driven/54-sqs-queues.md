# Part 54: SQS — Message Queues

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/54-sqs-queues.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "SQS: Message Queues That Don't Lose Your Data"
description: "Deploy SQS queues with Dead Letter Queues, idempotent consumers, and proper visibility timeouts. The event-driven patterns agents consistently get wrong."
excerpt: "Message queues that don't lose your data. SQS with DLQ, idempotency, and visibility timeouts — the patterns agents consistently get wrong."
date: "2026-08-02"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "sqs", "serverless", "terraform"]
series: "AWS From Zero to Production"
seriesPart: 54
featured: false
draft: true
---
```

## Section Outline
### 1. Why This Matters — Synchronous vs asynchronous processing
### 2. SQS Fundamentals — Standard vs FIFO, visibility timeout, retention
### 3. Dead Letter Queues — Configuration, monitoring, reprocessing
### 4. Consumer Patterns — Lambda trigger, polling, batch processing
### 5. Idempotency — Why messages can be delivered more than once
### 6. Visibility Timeout — Must exceed max processing time by 2x
### 7. Trace Propagation — Passing trace context through SQS messages
### 8. AGENT-INSTRUCTIONS.md Addition — Event-Driven Architecture (6 lines)

## The Fine Line
| | |
|---|---|
| ❌ Under | No queue, synchronous processing for everything |
| ✅ Right | SQS with DLQ, idempotent consumers, proper visibility timeout, trace propagation |
| ❌ Over | FIFO queues everywhere, exactly-once processing attempts |
| 🤖 Agent Trap | No DLQ configured, non-idempotent handlers, visibility timeout shorter than processing time |

## Thread Progression
- **AGENT-INSTRUCTIONS.md:** Event-Driven Architecture section added (6 lines). Cumulative: 83 lines.
- **Scorecard:** No new panels
- **Eval:** No changes
- **MCP:** No changes

## Key Takeaways
1. Every SQS queue MUST have a Dead Letter Queue — failed messages need somewhere to go.
2. Every message handler MUST be idempotent — SQS delivers at-least-once, not exactly-once.
3. Visibility timeout must be at least 2x your maximum processing time — agents set it too low.
4. Trace context propagation across SQS bridges your distributed traces in SigNoz.

## Lead Magnet
- **Name:** SQS Patterns Cheatsheet
- **Format:** PDF
- **Contents:** Standard vs FIFO decision tree, DLQ configuration, idempotency patterns, visibility timeout calculator.
