# Part 8: Pre-Commit Hooks & Code Quality — The First Automated Verifier

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/08-pre-commit-code-quality.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "Pre-Commit Hooks & Code Quality: Your Agents' First Guardrail"
description: "Set up pre-commit hooks that catch agent mistakes automatically. Linting, secrets detection, Terraform validation, and your Scorecard's first live data."
excerpt: "Your agents' first guardrail, and your Scorecard's first data source. Pre-commit hooks that catch what human review misses — especially from AI-generated code."
date: "2026-02-04"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "ci-cd", "terraform"]
series: "AWS From Zero to Production"
seriesPart: 8
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
import ComparisonTable from '../../../components/shared/ComparisonTable.astro';
```

## Opening Hook

Scenario: Your agent generates a Terraform module. Looks clean. You commit. Next morning, gitleaks alerts you that the agent embedded an example API key that matches the AWS key pattern. The commit is in git history forever. Pre-commit hooks would have caught this before it happened.

Time promise: 40 minutes.
Outcome promise: Pre-commit hooks that catch IAM wildcards, leaked secrets, wrong Docker tags, and missing tags — with results flowing to your Agent Scorecard.

## Section Outline

### 1. Why This Matters
- Pre-commit hooks are "Agent 2 in automated form"
- The Verifier concept: hooks verify what agents generate
- First automated verification in the DGVE pipeline

### 2. Pre-commit Framework
- Installation, .pre-commit-config.yaml setup
- Components: Command, FileTree

### 3. Language-Specific Linting
- Biome (Bun/JS/TS), Ruff (Python), golangci-lint (Go)
- Components: PanelSwitcher or code-switcher for different language configs

### 4. Secrets Detection (gitleaks)
- Why agents embed credentials (training data patterns)
- gitleaks configuration
- Components: Command, TerminalOutput showing caught secret

### 5. Terraform Validation
- tflint: catches provider-specific issues
- checkov: catches security misconfigurations (IAM wildcards!)
- Components: Command, TerminalOutput showing caught IAM wildcard

### 6. Agent-Specific Hooks (Custom)
- Wildcard IAM detection
- Missing required tags
- `:latest` Docker tag detection
- Hardcoded region detection
- Components: code blocks showing hook scripts

### 7. Scorecard Integration
- Hook results logged to Loki
- First Agent Scorecard panels go live:
  - Panel 1: Pre-commit pass/fail rate (agent commits vs human commits)
  - Panel 2: Top blocked violations by category
- Components: Alert (important) showing panel descriptions

### 8. AGENT-INSTRUCTIONS.md Addition
- Code Quality section (4 lines)

## The Fine Line

| | |
|---|---|
| ❌ Under | No pre-commit hooks, manual code review only |
| ✅ Right | Pre-commit with linting, secrets detection, Terraform validation, Scorecard logging |
| ❌ Over | 30+ hooks that take 5 minutes per commit, blocking developer flow |
| 🤖 Agent Trap | Agent disables pre-commit hooks "for speed" or adds `--no-verify` to commits |

## Thread Progression

- **AGENT-INSTRUCTIONS.md:** Code Quality section added (4 lines). Cumulative: 25 lines.
- **Scorecard:** Panels 1-2 go live (pre-commit pass/fail, top violations). Cumulative: 2 panels.
- **Eval:** No changes
- **MCP:** No changes

## Validation Checklist Items

- **Pre-commit:** Framework installed and configured; Hooks run on every commit; gitleaks catching secrets
- **Terraform Quality:** tflint configured; checkov configured; IAM wildcards caught
- **Agent Scorecard:** Panel 1: Pre-commit pass/fail rate visible in Grafana; Panel 2: Top blocked violations visible; Data flowing from Loki
- **AGENT-INSTRUCTIONS.md:** Code Quality section added (4 rules)

## Key Takeaways

1. Pre-commit hooks are your first automated verifier — they're "Agent 2 in automated form" for the DGVE pipeline.
2. gitleaks is essential when agents write code — agents embed credentials from training patterns without realizing it.
3. The Agent Scorecard just got its first real data. Two panels. 27 more to come.
4. Never let agents (or yourself) skip pre-commit with `--no-verify` — the whole point is catching mistakes before they enter history.

## Lead Magnet

- **Name:** Pre-commit Config Templates
- **Format:** YAML configs + hook scripts
- **Contents:** .pre-commit-config.yaml with agent guardrail hooks, gitleaks config, tflint rules, checkov config, Loki logging script for Scorecard integration.
