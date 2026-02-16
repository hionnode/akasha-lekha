# Part 43: Full-Stack Preview + Multi-Agent Pipeline + Unified MCP — KEY PART

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/43-full-stack-preview.mdx`
> Estimated word count: 4,500-6,000

## Frontmatter

```yaml
---
title: "Full-Stack Preview: The Complete Pipeline"
description: "Complete preview environments with ECS, the full multi-agent Generate → Verify → Explain pipeline with parallel generation, unified MCP verification, and pipeline model evaluation."
excerpt: "The complete pipeline. Full-stack preview environments, multi-agent parallel generation, unified MCP verification, and the discovery that changes how you think about model selection."
date: "2026-06-20"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "ecs", "ai-agents", "mcp", "docker"]
series: "AWS From Zero to Production"
seriesPart: 43
featured: true
draft: true
---
```

## Section Outline

### 1. Why This Matters — From scripted pipeline (Part 19) to full multi-agent pipeline
### 2. Design: Full-Stack Preview Architecture — ECS services per PR with database schema isolation
### 3. Full Pipeline (`scripts/pipeline/full-pipeline.sh`) — Configurable generator/verifier/explainer models, iterative fix loop, metric logging
### 4. Parallel Generation — Multiple generators with git worktrees, concurrent output
### 5. Unified Verify MCP Server (infra-verify-mcp) — Single MCP server: plan + validate + checkov + infracost + compliance
### 6. Pipeline Model Evaluation — Eval model combinations: "Generator A + Verifier B" vs "Generator C + Verifier D"
### 7. Scorecard: Panels 18-21 — Pipeline time, iterations-to-clean, merge conflict rate, model combination effectiveness
### 8. The Discovery — Sometimes cheaper generator + strong verifier beats expensive generator alone

## The Fine Line

| | |
|---|---|
| ❌ Under | Single-agent, single-pass verification |
| ✅ Right | Multi-agent pipeline with parallel generation, unified MCP verify, pipeline eval |
| ❌ Over | Auto-deploying from pipeline without human review |
| 🤖 Agent Trap | Parallel generators create conflicting resource names — merge conflicts on Terraform state |

## Thread Progression

- **AGENT-INSTRUCTIONS.md:** No additions
- **Scorecard:** Panels 18-21 go live (pipeline time, iterations-to-clean, conflict rate, model combination effectiveness). Cumulative: 21 panels.
- **Eval:** Pipeline eval — evaluating model combinations, not just single models.
- **MCP:** infra-verify-mcp server built. Unified: plan + validate + checkov + infracost + compliance as one tool call.

## Key Takeaways

1. The full pipeline automates what you've been building since Part 8: generate → verify loop → explain → human review.
2. Pipeline eval tests model COMBINATIONS — the verifier matters as much as the generator.
3. The discovery: sometimes a cheaper generator + strong verifier beats an expensive generator alone. Data decides.
4. Unified MCP verification means the entire Verify step is one structured tool call returning a comprehensive report.
5. Iterations-to-clean is the key metric: consistently >2 means improve prompts, not add more verification.

## Lead Magnet

- **Name:** Multi-Agent Pipeline Cookbook
- **Format:** Git repo / zip
- **Contents:** full-pipeline.sh, infra-verify-mcp server, pipeline eval framework, Grafana panels 18-21 JSON, model combination comparison templates.
