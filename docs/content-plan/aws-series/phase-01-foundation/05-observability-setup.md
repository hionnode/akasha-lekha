# Part 5: SigNoz + Grafana Setup — Dual Observability

> Status: PLANNED (stale MDX exists — rewrite needed)
> Blog file: `apps/web/src/content/blog/aws-for-startups/05-observability-setup.mdx`
> Estimated word count: 1,500-2,000

## Frontmatter

```yaml
---
title: "SigNoz + Grafana Setup: You'll Thank Me in 25 Parts. Twice."
description: "Deploy SigNoz and Grafana in 30 minutes. Dual observability surfaces — application health and agent workflow health — ready for data before you need them."
excerpt: "You'll thank me in 25 parts. Twice. Deploy dual observability now, understand it later. SigNoz for your app, Grafana for your agent workflow."
date: "2026-01-24"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "observability"]
series: "AWS From Zero to Production"
seriesPart: 5
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

Scenario: "Deploy first, understand later." Two observability surfaces: SigNoz tells you if your app is working. Grafana tells you if your agent workflow is working. Both deployed now, empty, waiting. Like mounting a whiteboard in your office before you have anything to write on it.

Time promise: 30 minutes.
Outcome promise: Both stacks running, empty Agent Scorecard dashboard created, verified and ready for data.

## Section Outline

### 1. Why This Matters
- "Deploy First, Earn Later" philosophy
- Two surfaces: app health (SigNoz) vs agent/process health (Grafana)
- Why Grafana alongside SigNoz (data source flexibility for agent metrics)
- This is the shortest part in the series. Deploy, verify, move on.

### 2. SigNoz Deployment
- Agent generates docker-compose
- Run, verify traces endpoint at localhost:3301
- Components: Command, TerminalOutput

### 3. Grafana Stack Deployment
- Grafana + Loki + Prometheus + Pushgateway
- Agent generates docker-compose
- Run, verify dashboard at localhost:3000
- Components: Command, TerminalOutput, FileTree (for docker-compose structure)

### 4. Agent Scorecard — Empty Dashboard
- Create empty "Agent Scorecard" dashboard in Grafana
- Provisioned via JSON (no manual clicking — IaC principles from Part 4)
- Verify Loki and Prometheus data sources are reachable
- Components: Command, TerminalOutput

### 5. What We Don't Do
- No metrics/traces/logs theory yet
- No Grafana query language
- No SigNoz deep dive
- That all comes later (Parts 29, 58-61)

## The Fine Line

| | |
|---|---|
| ❌ Under | No observability until something breaks |
| ✅ Right | Both stacks running, empty dashboards, ready for data |
| ❌ Over | Custom OpenTelemetry collectors, advanced alerting, before deploying any application |
| 🤖 Agent Trap | Agent forgets resource limits on containers (Grafana + Loki + Prometheus can eat all your RAM) |

## Agent Trap

Agent-generated docker-compose files almost always omit resource limits (CPU and memory constraints). Without limits, the observability stack can consume all available RAM during data ingestion spikes. Always review agent-generated docker-compose for `deploy.resources.limits`.

## Thread Progression

- **AGENT-INSTRUCTIONS.md:** No additions
- **Scorecard:** Empty dashboard shell deployed in Grafana. 0 panels. First data arrives in Part 8.
- **Eval:** No changes
- **MCP:** No changes

## Validation Checklist Items

- **SigNoz:** Accessible at localhost:3301; Sample trace visible in UI
- **Grafana:** Accessible at localhost:3000; Loki data source reachable (Explore → Loki); Prometheus data source reachable (Explore → Prometheus)
- **Agent Scorecard:** Empty "Agent Scorecard" dashboard visible in Grafana; Dashboard provisioned via JSON (not manual creation)
- **Infrastructure:** Resource limits set on all containers; docker-compose.yml committed to repo

## Key Takeaways

1. Deploy observability before you need it — the cost of running empty dashboards is near zero, the cost of not having them when you need them is hours of debugging.
2. Two surfaces: SigNoz for "is my app working?" and Grafana for "is my agent workflow working?" — different questions, different tools.
3. The Agent Scorecard starts empty today. By Part 62, it will have 29 panels and a composite trust score.

## Lead Magnet

- **Name:** Dual Observability Stack Templates
- **Format:** docker-compose files + Grafana dashboard JSON
- **Contents:** Production-ready docker-compose for SigNoz and Grafana+Loki+Prometheus, empty Agent Scorecard dashboard JSON, resource limits included.

## Cross-References

- Back: "Like our Terraform conventions in [Part 4](/blog/aws-for-startups/04-terraform-fundamentals), the Scorecard dashboard is provisioned as code — JSON, not clicks."
- Forward: "Coming in Part 8: the Agent Scorecard gets its first real data. Pre-commit hook results — agent commits vs human commits — become the first panels."
- Forward: "Coming in Part 29: SigNoz gets its first real traces from your Bun.js backend."

## Writer Notes

- This is deliberately the shortest part in the series. Resist the urge to explain observability theory.
- The "whiteboard analogy" is key: mounting a whiteboard costs nothing and has no downside. Same with deploying empty dashboards.
- Emphasize that the Agent Scorecard will grow throughout the series. Make the reader curious about what fills it.
- The agent-generated docker-compose should be shown unedited, including the missing resource limits, then fixed.
- Existing stale MDX should be rewritten from scratch.
