# Part 47: Production Deployment Pipeline + Recalibration Checkpoint 3

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/47-production-deployment.mdx`
> Estimated word count: 3,500-4,000

## Frontmatter

```yaml
---
title: "Production Deployment: The Pipeline With a Human Gate"
description: "Agent-assisted production deployment with non-negotiable human approval. Staging validation, deployment summary, monitoring, and Recalibration Checkpoint 3."
excerpt: "The pipeline with a human gate. Agent-assisted deployment to production — staging validation, explain summary, and a non-negotiable human approval step."
date: "2026-07-06"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "ci-cd", "ai-agents"]
series: "AWS From Zero to Production"
seriesPart: 47
featured: false
draft: true
---
```

## Section Outline
### 1. Why This Matters — Production deployment is where trust is tested
### 2. Deployment Flow — Agent PR → CI → verify loop → explain → staging → validation → HUMAN APPROVES → production → 15-min monitor
### 3. Staging Validation — Automated smoke tests, K6 quick load test, diff from production
### 4. Explain Summary for Deployment — What changed, what was verified, risk assessment
### 5. Human Approval Gate — Non-negotiable. GitHub Environments with required reviewers
### 6. Post-Deploy Monitoring — Agent monitors metrics for 15 minutes, alerts on anomalies
### 7. Rollback Strategy — When and how to rollback (human decision)
### 8. Scorecard: Panels 22-25 — Lead time, rollback rate, deploy frequency, post-deploy error rate
### 9. Recalibration Checkpoint 3

## The Fine Line
| | |
|---|---|
| ❌ Under | Manual deployment via SSH, no staging, no approval process |
| ✅ Right | Automated pipeline with staging, explain summary, human approval gate, post-deploy monitoring |
| ❌ Over | Canary deployments, blue-green with traffic shifting, for pre-scale traffic |
| 🤖 Agent Trap | Agent configures auto-deploy to production without human approval gate |

## Thread Progression
- **AGENT-INSTRUCTIONS.md:** No additions
- **Scorecard:** Panels 22-25 (lead time, rollback rate, deploy frequency, post-deploy error). Cumulative: 25 panels.
- **Eval:** Recalibration Checkpoint 3 completed.
- **MCP:** No changes.

## Key Takeaways
1. Human approval for production deployment is non-negotiable — agents assist, humans decide.
2. The explain summary is the deployment briefing: what changed, what was verified, what the risks are.
3. Post-deploy monitoring (15 minutes) catches issues while the context is fresh and rollback is cheap.
4. Rollback decisions are always human — agents monitor, surface data, and wait for the call.
5. Recalibration Checkpoint 3: deployment data is now flowing. Adjust pipeline based on rollback rates and lead times.
