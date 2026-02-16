# Part 62: Feature Flags + Agent Guardrails + Full Scorecard + MCP Governance — KEY PART + Recalibration 4

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/62-feature-flags-guardrails.mdx`
> Estimated word count: 4,500-6,000

## Frontmatter

```yaml
---
title: "Agent Guardrails: Ship Safely, Measure Everything, Trust the Data"
description: "Feature flags, OPA policies from AGENT-INSTRUCTIONS.md, composite Trust Score, prompt injection defense, MCP governance, and the final Recalibration Checkpoint."
excerpt: "Ship safely, measure everything, trust the data. OPA guardrails, Trust Score, prompt injection defense, and MCP governance — the final systems that make agent-assisted infrastructure production-safe."
date: "2026-09-12"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "security", "ai-agents", "mcp", "model-eval", "appconfig"]
series: "AWS From Zero to Production"
seriesPart: 62
featured: true
draft: true
---
```

## Section Outline
### 1. Why This Matters — From guidelines to enforcement
### 2. Feature Flags — AWS AppConfig, percentage rollouts, kill switches
### 3. Agent Blast Radius — Isolated environments, never direct production access
### 4. Agent Credential Scoping — Separate IAM roles, ReadOnly for prod
### 5. Agent Cost Guardrails — SCPs to hard-limit provisioning, CreatedBy=agent tags
### 6. OPA/Rego Policies — Auto-generated from AGENT-INSTRUCTIONS.md rules
### 7. Prompt Injection Defense — Config validation, suspicious pattern detection
### 8. MCP Governance — Environment-scoped tool permissions, production read-only, audit logging
### 9. Full Agent Scorecard — Composite Trust Score (0-100), all 29 panels live
### 10. Trust Score Calculation — Weighted: security 30%, compliance 25%, CI 20%, cost 15%, deploy 10%
### 11. Production Eval — Drift rate, incident correlation, cost accuracy
### 12. Recalibration Checkpoint 4 — Final data-driven trust adjustment, permanent operating mode
### 13. AGENT-INSTRUCTIONS.md Final Additions — Agent Operations (8 lines) + Prompt Injection Defense (5 lines)

## The Fine Line
| | |
|---|---|
| ❌ Under | No guardrails, agents with full production access, no measurement |
| ✅ Right | OPA policies, Trust Score, MCP governance, prompt injection defense, production read-only for agents |
| ❌ Over | Custom agent orchestration platform, ML-based anomaly detection on agent behavior |
| 🤖 Agent Trap | Agent processes untrusted .tfvars files as instructions — prompt injection via config |

## Thread Progression
- **AGENT-INSTRUCTIONS.md:** Agent Operations (8 lines) + Prompt Injection Defense (5 lines). FINAL addition. Cumulative: 96 lines.
- **Scorecard:** Panels 27-29 (Trust Score gauge, Trust Score trend, Model drift detection). FINAL panels. Cumulative: 29 panels.
- **Eval:** Production eval (drift rate, incident correlation, cost accuracy) + Recalibration Checkpoint 4. FINAL eval addition.
- **MCP:** Full governance (environment-scoped permissions, production read-only, audit logging). FINAL MCP addition.

## Key Takeaways
1. AGENT-INSTRUCTIONS.md reaches 96 lines — from empty header in Part 1 to comprehensive governance in Part 62.
2. OPA policies are AGENT-INSTRUCTIONS.md rules in executable form — guidelines become enforcement.
3. Trust Score (0-100) answers the series' central question: "How much should I trust my agents?" Trust is a number.
4. Prompt injection via config files is a real threat — validate before processing, scan for suspicious patterns.
5. MCP governance means production is read-only for agents, always — no exceptions, full audit trail.

## Lead Magnet
- **Name:** Agent Guardrails + OPA Policies + Trust Score Dashboard + MCP Governance Templates
- **Format:** Git repo / zip (second-largest lead magnet)
- **Contents:** OPA policy set, Trust Score Grafana dashboard JSON, prompt injection pre-commit hook, MCP governance server, production eval scripts.
