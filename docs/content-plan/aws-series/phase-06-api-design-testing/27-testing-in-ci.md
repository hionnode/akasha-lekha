# Part 27: Testing in CI — With Agent-in-CI, CI-Integrated Evals, and MCP in CI

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/27-testing-in-ci.mdx`
> Estimated word count: 3,500-4,000

## Frontmatter

```yaml
---
title: "Testing in CI: Agents in Your Pipeline"
description: "Complete CI pipeline with agent-assisted triage, monthly model evaluation in GitHub Actions, and MCP tools replacing raw CLI commands for structured verification."
excerpt: "Agents in your pipeline. CI with agent-assisted failure triage, monthly model evaluation, and MCP tools for structured verification output."
date: "2026-04-18"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "ci-cd", "ai-agents", "mcp", "model-eval"]
series: "AWS From Zero to Production"
seriesPart: 27
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

CI fails. Red X on the PR. You open the logs, scroll through 200 lines of output, find the error, realize it's a missing environment variable. Fifteen minutes wasted on a two-second fix. Now imagine an agent that reads the CI failure, identifies the root cause, and tells you "Missing DATABASE_URL in the test environment — add it to .github/workflows/ci.yml line 47."

Time promise: 1 hour.
Outcome promise: CI pipeline with unit/integration/E2E tests, agent-assisted failure triage, monthly model eval in GitHub Actions, and MCP tools replacing raw CLI in CI.

## Section Outline

### 1. Why This Matters — CI as the final quality gate, agent-assisted triage saves time
### 2. Complete CI Pipeline — Unit → Integration → E2E → Terraform validate → Security scan
### 3. Agent-Assisted CI Triage — Agent reads failure logs, identifies root cause, suggests fix
### 4. Monthly Model Eval in CI — `.github/workflows/model-eval.yml` running eval-models.sh monthly
### 5. MCP in CI — terraform-mcp tools in GitHub Actions (structured output feeds Scorecard directly)
### 6. Scorecard: New Panels (12-14) — CI pass rate (agent vs human), Agent triage accuracy, Model eval trend

## The Fine Line

| | |
|---|---|
| ❌ Under | No CI, manual testing, deploy without checks |
| ✅ Right | Full CI pipeline, agent triage, monthly model eval, MCP in CI |
| ❌ Over | AI-powered CI that auto-fixes and auto-deploys without human review |
| 🤖 Agent Trap | Agent triage suggests wrong root cause when error spans multiple services |

## Thread Progression

- **AGENT-INSTRUCTIONS.md:** No additions
- **Scorecard:** Panels 12-14 go live (CI pass rate agent vs human, Agent triage accuracy, Model eval trend). Cumulative: 14 panels.
- **Eval:** CI-integrated monthly eval. `.github/workflows/model-eval.yml` runs eval-models.sh, detects regressions, posts results.
- **MCP:** terraform-mcp running in CI. Tools called headlessly in GitHub Actions. Structured output feeds Scorecard directly.

## Validation Checklist Items

- **CI Pipeline:** All test types running in CI; Tests parallelized where possible; Artifacts captured on failure
- **Agent Triage:** Agent reads CI failure logs; Root cause identification tested against known failures; Accuracy tracked
- **Model Eval:** Monthly eval workflow configured; Regression detection working; Results posted to Scorecard
- **MCP in CI:** terraform-mcp tools callable in GitHub Actions; Structured output logged correctly
- **Scorecard:** Panels 12-14 visible with data

## Key Takeaways

1. Agent-assisted CI triage turns 15-minute debugging sessions into 30-second root cause identification.
2. Monthly model evaluation in CI catches regressions before they hit your workflow — models change, your standards shouldn't.
3. MCP in CI replaces raw CLI parsing with structured tool calls — the Scorecard gets clean data directly.
4. Track CI pass rate by author type (agent vs human) — the data tells you if agents are improving your code quality.

## Lead Magnet

- **Name:** CI Pipeline Templates
- **Format:** GitHub Actions YAML + scripts
- **Contents:** Complete CI workflow, agent triage script, model eval workflow, MCP CI integration.
