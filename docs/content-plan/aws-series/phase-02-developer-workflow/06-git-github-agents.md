# Part 6: Git & GitHub — Professional Workflow With Agents

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/06-git-github-agents.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Git & GitHub: The Foundation Your Whole Team Builds On"
description: "Set up Git workflows that work for humans and AI agents. Branching strategy, conventional commits, agent attribution, and reviewing agent-generated PRs."
excerpt: "The foundation your whole team — humans and agents — builds on. Git conventions, agent commit hygiene, and attribution that tracks who wrote what."
date: "2026-01-28"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "git"]
series: "AWS From Zero to Production"
seriesPart: 6
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

Scenario: Your agent commits a massive change with the message "updated files". It includes unrelated changes, a debug log, and an API key. `git add .` strikes again. When agents write code, your git hygiene matters more, not less.

Time promise: 30 minutes.
Outcome promise: Git workflow that distinguishes agent work from human work, with conventions both can follow.

## Section Outline

### 1. Why This Matters
- Agents amplify bad git habits — `git add .` becomes catastrophic at agent speed
- Attribution matters: knowing which commits are agent-generated feeds the Scorecard later

### 2. Branching Strategy
- Trunk-based development with short-lived feature branches
- Branch naming: `feature/`, `fix/`, `chore/`
- Agent branches: same naming, flagged in PR

### 3. Conventional Commits
- Format: `type(scope): description`
- Types: feat, fix, chore, docs, refactor, test
- Why: automated changelogs, Scorecard tracking

### 4. Agent Commit Hygiene
- NEVER `git add .` or `git add -A` — always specific files
- Agent attribution: `Co-Authored-By` trailer
- Commit scope: one logical change per commit

### 5. Reviewing Agent PRs
- Agent PRs get a different review lens than human PRs
- Check: IAM permissions, resource naming, hardcoded values, missing tags
- The future: Scorecard will track agent PR pass rates (Part 27)

### 6. AGENT-INSTRUCTIONS.md Addition
- Git Conventions section (6 lines)

## The Fine Line

| | |
|---|---|
| ❌ Under | No conventions, `git add .`, meaningless commit messages |
| ✅ Right | Conventional commits, specific file staging, agent attribution |
| ❌ Over | Commit signing with GPG for every agent commit, automated squash policies |
| 🤖 Agent Trap | Agent uses `git add .` sweeping unrelated changes, debug logs, and credentials |

## Thread Progression

- **AGENT-INSTRUCTIONS.md:** Git Conventions added (6 lines). Cumulative: 21 lines.
- **Scorecard:** No new panels
- **Eval:** No changes
- **MCP:** No changes

## Validation Checklist Items

- **Git Setup:** Conventional commits configured; Branch naming follows convention; `.gitignore` comprehensive
- **Agent Workflow:** Agent attribution configured (Co-Authored-By); Agent commits use specific file staging; PR template includes "Generation Method" section
- **AGENT-INSTRUCTIONS.md:** Git Conventions section added (6 rules)

## Key Takeaways

1. `git add .` is the most dangerous command when agents write your code — always stage specific files.
2. Conventional commits aren't bureaucracy — they're data that feeds your Scorecard and changelogs.
3. Agent attribution (`Co-Authored-By`) isn't just for credit — it's for tracking agent quality over time.
4. Review agent commits with a different lens: focus on permissions, naming, hardcoded values, and missing tags.

## Lead Magnet

- **Name:** .gitignore Templates + Agent Git Rules
- **Format:** Config files + README
- **Contents:** .gitignore for Terraform/Node/Python/Go, .gitattributes, conventional commit config, agent attribution template.
