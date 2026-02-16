# Part 59: Debugging Production Issues — With Agent-Assisted Triage + Observability MCP

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/59-debugging-production.mdx`
> Estimated word count: 3,500-4,000

## Frontmatter

```yaml
---
title: "Debugging Production: Agents Assist, Humans Decide"
description: "Production debugging workflow with SigNoz + Grafana dual surfaces and agent-assisted triage via the observability MCP server. Alert to resolution."
excerpt: "Agents assist, humans decide. Production debugging with the SigNoz + Grafana dual-surface workflow and a new observability MCP server."
date: "2026-08-24"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "observability", "ai-agents", "mcp", "incident-response"]
series: "AWS From Zero to Production"
seriesPart: 59
featured: false
draft: true
---
```

## Section Outline
### 1. Why This Matters — Production issues need both observability surfaces
### 2. The Debugging Workflow — Alert → SigNoz (traces, logs) → Grafana (deploy correlation) → agent triage → human decision
### 3. Observability MCP Server — Tools: query-traces, get-deployment-history, correlate-error-with-deploy
### 4. Agent-Assisted Triage — Agent correlates data, human decides action
### 5. Scorecard: Panel 26 — Incidents within 2h of deploy (agent vs human)

## The Fine Line
| | |
|---|---|
| ❌ Under | Log-grepping, manual correlation, no structured debugging process |
| ✅ Right | Dual-surface debugging, observability MCP for agent-assisted triage, structured workflow |
| ❌ Over | Automated incident response, auto-rollback on any anomaly |
| 🤖 Agent Trap | Agent suggests adding a database index when the real issue is a connection pool misconfiguration |

## Thread Progression
- **AGENT-INSTRUCTIONS.md:** No additions
- **Scorecard:** Panel 26 (Incidents within 2h of deploy, agent vs human). Cumulative: 26 panels.
- **Eval:** No changes
- **MCP:** observability-mcp server built. Tools: query-traces, deployment-history, correlate-error.

## Key Takeaways
1. Two observability surfaces: SigNoz answers "what's wrong with my app," Grafana answers "did an agent deploy cause this."
2. The observability MCP server lets agents query traces and correlate errors — structured investigation, not log grepping.
3. Agents excel at data correlation but fail at judgment calls — the human decides rollback vs hotfix.
