# Part 69: Capstone — Operations

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/69-capstone-operations.mdx`
> Estimated word count: 3,500-4,500

## Frontmatter

```yaml
---
title: "Capstone Operations: Running What You Built"
description: "Agent-assisted operations: runbooks, multi-agent debugging, continuous model evaluation, and full Scorecard monitoring for the capstone application."
excerpt: "Running what you built. Agent-assisted operations runbooks, multi-agent debugging workflows, and the Scorecard that tells you everything is working."
date: "2026-10-10"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "observability", "ai-agents"]
series: "AWS From Zero to Production"
seriesPart: 69
featured: false
draft: true
---
```

## Section Outline
### 1. Operations Runbooks — Agent-generated from documentation, human-reviewed
### 2. Multi-Agent Debugging — Using observability MCP for production issues
### 3. Continuous Model Evaluation — Monthly eval in CI, regression detection
### 4. Full Scorecard Monitoring — All 29 panels, Trust Score tracking
### 5. Day-to-Day Operations — What the daily workflow looks like with agents

## The Fine Line
| | |
|---|---|
| ❌ Under | No runbooks, ad-hoc operations |
| ✅ Right | Agent-assisted runbooks, structured debugging, continuous eval, full monitoring |
| ❌ Over | Full SRE team processes for a startup-scale application |
| 🤖 Agent Trap | Agent-generated runbook assumes infrastructure state that has drifted since generation |

## Key Takeaways
1. Operations runbooks should be generated from your documentation and infrastructure state — agents draft, humans validate.
2. Continuous model evaluation catches regressions before they hit your workflow — models change quarterly.
3. The Trust Score trend over time tells the real story — is your agent workflow improving or degrading?

## Lead Magnet
- **Name:** Production Readiness Checklist
- **Format:** PDF
- **Contents:** Operations checklist covering monitoring, runbooks, eval schedule, backup verification, security review cadence.
