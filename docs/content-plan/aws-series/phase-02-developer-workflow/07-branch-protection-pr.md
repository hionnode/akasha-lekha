# Part 7: Branch Protection & PR Workflow

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/07-branch-protection-pr.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Branch Protection & PR Workflow: Quality Gates for Humans and Agents"
description: "Configure branch protection rules and PR templates that catch mistakes from both human developers and AI coding agents. CODEOWNERS, required reviews, and agent-specific checklists."
excerpt: "Quality gates that catch both human and agent mistakes. Branch protection, PR templates with agent-review sections, and CODEOWNERS for your growing team."
date: "2026-02-01"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "git"]
series: "AWS From Zero to Production"
seriesPart: 7
featured: false
draft: true
---
```

## Component Imports

```mdx
import GuideStep from '../../../components/shared/GuideStep.astro';
import Command from '../../../components/shared/Command.astro';
import TerminalOutput from '../../../components/shared/TerminalOutput.astro';
import Alert from '../../../components/shared/Alert.astro';
import ValidationChecklist from '../../../components/shared/ValidationChecklist.astro';
import FileTree from '../../../components/shared/FileTree.astro';
import DiffViewer from '../../../components/shared/DiffViewer.astro';
import DiffBlock from '../../../components/shared/DiffBlock.astro';
```

## Opening Hook

Scenario: Agent generates a PR that passes all automated checks. You merge it without reviewing because "CI passed." Two days later, the agent's Terraform change depletes your NAT Gateway quota and you're paying $200/day in unexpected charges. CI doesn't check business logic or cost implications.

Time promise: 25 minutes.
Outcome promise: Branch protection that requires human review on critical paths, PR templates that prompt the right questions for agent-generated code.

## Section Outline

### 1. Why This Matters
- CI passing ≠ safe to merge
- Agent PRs need different review criteria than human PRs
- Protection rules are the same for everyone — agents don't get special treatment

### 2. Branch Protection Rules
- Required reviews, status checks, no force push to main
- Components: GuideStep sequence

### 3. PR Templates
- Standard template with "Generation Method" section (human, agent-assisted, fully agent-generated)
- Agent-specific review checklist: IAM scope, cost impact, naming conventions, tags, hardcoded values
- Components: code blocks showing PR template markdown

### 4. CODEOWNERS
- Path-based ownership
- Infrastructure paths require senior review
- Components: FileTree showing CODEOWNERS location, code block showing rules

### 5. Agent PR Labels
- Labels: `agent-generated`, `agent-assisted`, `human`
- Separate review workflows per label
- Future: Scorecard tracks pass rates by label (Part 27)

## The Fine Line

| | |
|---|---|
| ❌ Under | No branch protection, direct push to main, no PR reviews |
| ✅ Right | Required reviews, PR templates with agent checklist, CODEOWNERS for infra |
| ❌ Over | 3 required approvers, mandatory pairing, for a 2-person team |
| 🤖 Agent Trap | Agent creates PR with description "Updated infrastructure" — no context on what changed or why |

## Thread Progression

- **AGENT-INSTRUCTIONS.md:** No additions (workflow tooling, not earned rules)
- **Scorecard:** No new panels (PR tracking comes in Part 27)
- **Eval:** No changes
- **MCP:** No changes

## Validation Checklist Items

- **Branch Protection:** Main branch protected; Required review before merge; Status checks required; Force push disabled
- **PR Workflow:** PR template with Generation Method section; Agent-review checklist in template; CODEOWNERS configured for infrastructure paths
- **Labels:** Agent-generated, agent-assisted, human labels created

## Key Takeaways

1. CI passing doesn't mean safe to merge — especially for agent-generated infrastructure changes with cost implications.
2. PR templates should ask different questions for agent-generated code: IAM scope, cost impact, naming, tags.
3. CODEOWNERS ensures infrastructure changes always get human review, regardless of who (or what) wrote them.

## Lead Magnet

- **Name:** PR Template Collection
- **Format:** Markdown files
- **Contents:** Standard PR template, agent-review PR template, CODEOWNERS examples, label configuration guide.
