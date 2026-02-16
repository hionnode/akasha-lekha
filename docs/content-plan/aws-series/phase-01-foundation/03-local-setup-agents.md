# Part 3: Your Local Setup — CLI, Agents, and Working Like a Professional

> Status: PLANNED (stale MDX exists — rewrite needed)
> Blog file: `apps/web/src/content/blog/aws-for-startups/03-local-setup-agents.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "Your Local Setup: CLI, Agents, and Working Like a Professional"
description: "Configure AWS CLI v2, install coding agents (Claude Code, Cursor, or your choice), and run your first agent-assisted AWS task. Model-agnostic from day one."
excerpt: "AWS CLI, coding agents, and the tools that multiply your output. Set up at least two models — you'll discover why in Part 4."
date: "2026-01-16"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "ai-agents", "security"]
series: "AWS From Zero to Production"
seriesPart: 3
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
import PanelSwitcher from '../../../components/shared/PanelSwitcher.astro';
import Panel from '../../../components/shared/Panel.astro';
import FileTree from '../../../components/shared/FileTree.astro';
```

## Opening Hook

Scenario: You're copying AWS commands from a blog post, pasting into terminal, fixing typos, googling error messages. Meanwhile, your agent could generate, explain, and iterate in seconds — if it were set up properly.

Time promise: 30 minutes for CLI, 20 minutes for agents.
Outcome promise: AWS CLI with named profiles, aws-vault for credential security, and 2-3 coding agents ready for their first task.

## Section Outline

### 1. Why This Matters
- Manual CLI work vs agent-assisted workflow
- The "confidently wrong 15% of the time" mental model
- Why multiple models from day one

### 2. AWS CLI v2
- Installation (PanelSwitcher: macOS/Linux/Windows)
- Configuration: named profiles for dev, staging, prod
- Components: PanelSwitcher + Panel, Command, TerminalOutput

### 3. Credential Security with aws-vault
- Why not plaintext in `~/.aws/credentials`
- aws-vault installation and configuration
- Components: Command, TerminalOutput

### 4. Coding Agent Setup
- Model-agnostic approach: install your choice
- Minimum: 2 models (for comparison in Part 4)
- Agent categories: CLI agents (Claude Code, Aider, Amazon Q CLI), Editor agents (Cursor, Windsurf, Cline), Chat (Claude.ai, ChatGPT)
- ASCII diagram: Agent Selection Guide (task type → best agent mode)
- Components: PanelSwitcher for different agent install methods

### 5. Agent Mental Model
- "Fast, tireless junior engineers who are confidently wrong 15% of the time"
- Your job: architecture + review + measurement
- This is NOT about AI hype — it's about measurable productivity with guardrails

### 6. Your First Agent Task
- "Set up my AWS CLI with named profiles for dev, staging, prod"
- Run on 2 models, observe the differences (don't evaluate yet — that's Part 4)
- Show real agent output from two different models

### 7. Agent Tool Comparison
- CLI agents vs Editor agents vs Chat
- When to use which (table)
- The verification principle: "the easy part is generating; the hard part is knowing it's right"

## The Fine Line

| | |
|---|---|
| ❌ Under | No agents, manual everything, or one model for all tasks |
| ✅ Right | 2-3 models configured, agent mental model understood, aws-vault for credentials |
| ❌ Over | 7 different agents, custom keybindings, before writing any infrastructure |
| 🤖 Agent Trap | Agent embeds access keys directly in `~/.aws/credentials` instead of using aws-vault |

## Agent Trap

Agents will generate AWS CLI configuration with plaintext access keys in `~/.aws/credentials`. They don't know about aws-vault or IAM Identity Center because their training data is full of the insecure pattern. Always review credential handling in agent output.

## Thread Progression

- **AGENT-INSTRUCTIONS.md:** No additions (agent setup, not a rule-earning part)
- **Scorecard:** Not yet deployed
- **Eval:** Not yet started (comparison happens in Part 4)
- **MCP:** Not yet introduced

## Validation Checklist Items

- **CLI Setup:** AWS CLI v2 installed and configured; Named profiles working (dev, staging, prod); aws-vault protecting credentials
- **Agent Setup:** At least 2 coding agents installed and working; First agent task completed on both models; Agent output differences observed
- **Security:** No plaintext credentials in `~/.aws/credentials`; aws-vault or IAM Identity Center configured

## Key Takeaways

1. Agents are fast, tireless junior engineers who are confidently wrong 15% of the time — your job is architecture, review, and measurement.
2. Always have at least two models — you'll discover why they produce different output in Part 4.
3. aws-vault is non-negotiable — never store credentials in plaintext, especially when agents can access them.
4. The agent tool (CLI vs editor vs chat) matters as much as the model — match the tool to the task.

## Lead Magnet

- **Name:** Agent Setup Guide
- **Format:** PDF + shell scripts
- **Contents:** Multi-model quickstart covering Claude Code, Cursor, Windsurf, Aider, Amazon Q. Includes aws-vault setup scripts for macOS/Linux.

## ASCII Diagrams Spec

1. **Agent Selection Guide** — Placement: Coding Agent Setup section. Table-style: Task Type (Terraform/IaC, App code, Architecture, CI/CD, Debugging, Code review, Verification) → Best Agent Mode (CLI, Editor, Chat).

## Cross-References

- Back: "In [Part 2](/blog/aws-for-startups/02-iam-key-to-everything), we created an agent execution role with scoped permissions. Your agents will use this role."
- Forward: "Coming in Part 4: the Terraform Taste Test. Same prompt, multiple models, mechanical rubric. You'll see exactly why we set up multiple models today."

## Writer Notes

- This is the series' agent thesis statement. The mental model ("confidently wrong 15%") sets the tone for 67 more parts.
- Be model-agnostic throughout. Never say "use Claude" or "use GPT-4" — say "your preferred CLI agent" or "your editor agent."
- The first agent task output should be real and unedited. Show that two models produce different results.
- Existing stale MDX should be rewritten from scratch.
