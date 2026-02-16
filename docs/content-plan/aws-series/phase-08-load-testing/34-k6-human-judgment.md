# Part 34: K6 Load Testing — Human Judgment Required + Recalibration Checkpoint 2

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/34-k6-human-judgment.mdx`
> Estimated word count: 4,000-5,000

## Frontmatter

```yaml
---
title: "K6 Load Testing: Know Your Limits Before Production"
description: "Performance baselines with K6, the Agent Delegation Matrix for when AI helps vs hurts, and Recalibration Checkpoint 2. Human judgment required."
excerpt: "Know your limits before production — agents can't do this for you. K6 load testing, the Agent Delegation Matrix, and your second trust recalibration."
date: "2026-05-16"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "testing", "ai-agents", "model-eval"]
series: "AWS From Zero to Production"
seriesPart: 34
featured: true
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
import ComparisonTable from '../../../components/shared/ComparisonTable.astro';
```

## Opening Hook

An agent generates a K6 script. Runs it. Reports "All checks passed, p95 = 250ms." You deploy to production. Under real load, p95 hits 2 seconds. The agent set the threshold at 500ms because it had no context for what "acceptable" means for your users. Performance thresholds are human decisions. Full stop.

## Section Outline

### 1. Why This Matters — Performance thresholds are human decisions
### 2. K6 Basics — Virtual users, duration, checks, test types (smoke, load, stress, soak)
### 3. Writing K6 Scripts — Agent generates scripts from API specs, human sets thresholds
### 4. K6 + SigNoz — Correlating load tests with distributed traces
### 5. The Agent Delegation Matrix — Systematic framework: what agents handle vs what requires human judgment
### 6. AGENT-INSTRUCTIONS.md Additions — Performance rules + Human Judgment Boundaries (11 lines)
### 7. Scorecard: New Panels (15-17) — p95 latency trend, cost-per-request, load test history
### 8. Recalibration Checkpoint 2 — Second data-driven trust adjustment

## The Fine Line

| | |
|---|---|
| ❌ Under | No load testing, deploy and hope |
| ✅ Right | K6 with human-set thresholds, SigNoz correlation, Agent Delegation Matrix |
| ❌ Over | Continuous load testing in production, chaos engineering, before you have users |
| 🤖 Agent Trap | Agent sets performance thresholds based on training data defaults, not your application's actual requirements |

## Agent Trap

The agent sets K6 thresholds to "reasonable defaults" from its training data. These defaults have no relationship to YOUR application's performance requirements. A p95 of 200ms might be great for an API but unacceptable for a real-time game server, or luxurious for a batch processor. Thresholds are business decisions.

## Thread Progression

- **AGENT-INSTRUCTIONS.md:** Performance section (5 lines) + Human Judgment Boundaries (6 lines). Cumulative: 64 lines.
- **Scorecard:** Panels 15-17 go live (p95 latency with deploy markers, cost-per-request trend, load test pass/fail history). Cumulative: 17 panels.
- **Eval:** Recalibration Checkpoint 2 completed. Data-driven trust adjustment.
- **MCP:** No changes.

## Validation Checklist Items

- **Load Testing:** K6 installed; Smoke, load, and stress test scripts written; Thresholds set by human (documented); K6 results correlated with SigNoz traces
- **Agent Delegation:** Matrix documented; Applied to at least one real decision; Team agrees on boundaries
- **Scorecard:** Panels 15-17 visible with load test data; p95 latency baseline established
- **Recalibration:** eval-models.sh re-run; Scorecard reviewed; Pipeline adjusted based on data
- **AGENT-INSTRUCTIONS.md:** Performance section (5 rules) + Human Judgment Boundaries (6 rules) added

## Key Takeaways

1. Performance thresholds are human decisions — agents can generate scripts and calculate metrics but cannot decide what's "acceptable."
2. The Agent Delegation Matrix: agents handle *what* and *how*, humans handle *why* and *whether*.
3. K6 + SigNoz shows you not just what's slow, but why — traces reveal the bottleneck behind the latency number.
4. Human Judgment Boundaries in AGENT-INSTRUCTIONS.md: agents NEVER set thresholds, make rollback decisions, or determine acceptable risk levels.
5. Recalibration Checkpoint 2: your trust data is growing. Adjust the pipeline based on reality, not assumptions.

## Lead Magnet

- **Name:** K6 Test Templates + Agent Delegation Matrix
- **Format:** JavaScript files + PDF
- **Contents:** K6 test templates (smoke, load, stress, soak), threshold guide, Agent Delegation Matrix poster, SigNoz correlation setup.

## ASCII Diagrams Spec

1. **Agent Delegation Matrix** — Placement: Section 5. Table showing Task Dimension -> Agent-Safe / Human-Required / Why.
