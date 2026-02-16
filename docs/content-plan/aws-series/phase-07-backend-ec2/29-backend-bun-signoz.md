# Part 29: Backend on EC2 — Bun.js API with SigNoz Traces

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/29-backend-bun-signoz.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "Backend on EC2: Bun.js API with Real Traces"
description: "Deploy a Bun.js API on EC2 with OpenTelemetry instrumentation. First real application traces in SigNoz — the empty dashboard from Part 5 gets its data."
excerpt: "Bun.js API with real traces. Deploy to EC2, instrument with OpenTelemetry, and watch SigNoz light up — the empty dashboard from Part 5 finally earns its keep."
date: "2026-04-26"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "ec2", "backend", "opentelemetry", "observability"]
series: "AWS From Zero to Production"
seriesPart: 29
featured: false
draft: true
---
```

## Component Imports

```mdx
import GuideStep from '../../../components/shared/GuideStep.astro';
import Command from '../../../components/shared/Command.astro';
import CommandSequence from '../../../components/shared/CommandSequence.astro';
import TerminalOutput from '../../../components/shared/TerminalOutput.astro';
import Alert from '../../../components/shared/Alert.astro';
import ValidationChecklist from '../../../components/shared/ValidationChecklist.astro';
import FileTree from '../../../components/shared/FileTree.astro';
```

## Opening Hook

Your SigNoz dashboard has been empty since Part 5. Twenty-four parts of setup, and the traces panel shows nothing. Today it lights up. A real API, handling real requests, with every operation traced end-to-end. You'll see exactly where time is spent — database queries, external calls, middleware. The whiteboard gets its first writing.

## Section Outline

### 1. Why This Matters — First real traces in SigNoz (Part 5 payoff)
### 2. Bun.js API Setup — Hono or Elysia framework, project structure
### 3. OpenTelemetry Instrumentation — Auto + manual spans, trace propagation
### 4. Deploy to EC2 — Behind ALB, in private subnet, systemd service
### 5. SigNoz Dashboard — First traces visible, service map, latency distribution
### 6. Agent-Assisted OTel Setup — Agent generates instrumentation, review for over-instrumentation

## The Fine Line

| | |
|---|---|
| ❌ Under | No instrumentation, console.log debugging in production |
| ✅ Right | OTel auto-instrumentation + key manual spans, traces in SigNoz, service map |
| ❌ Over | Custom spans on every function, 100% trace sampling, before you have traffic |
| 🤖 Agent Trap | Agent instruments everything with 100% sampling — SigNoz storage fills up, traces become noise |

## Thread Progression

- All threads: No changes (SigNoz was deployed in Part 5, now receiving data)

## Validation Checklist Items

- **Backend:** Bun.js API running on EC2; Accessible through ALB; Health check passing
- **Observability:** Traces visible in SigNoz; Service map showing the API; Latency distribution rendering; Sampling rate appropriate (not 100%)

## Key Takeaways

1. SigNoz gets its first real application data — 24 parts after deployment, the empty dashboard proves its worth.
2. Auto-instrumentation gets you 80% of observability. Manual spans get the remaining 20% for business-critical paths.
3. Always configure sampling — agents default to 100% which floods your observability backend.
