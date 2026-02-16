# Part 12: Environment Variables, Secrets & Agent Execution Security

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/12-env-vars-secrets-security.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "Secrets & Agent Security: Drawing the Line Between Helpful and Dangerous"
description: "Secure your environment variables, integrate secrets management, and establish agent execution security. Four sandboxing levels from scoped IAM to VM isolation."
excerpt: "Drawing the line between helpful and dangerous. dotenv patterns, secrets management, and the four levels of agent execution security."
date: "2026-02-20"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "security", "secrets-manager"]
series: "AWS From Zero to Production"
seriesPart: 12
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
import EnvVars from '../../../components/shared/EnvVars.astro';
import EnvVar from '../../../components/shared/EnvVar.astro';
import ComparisonTable from '../../../components/shared/ComparisonTable.astro';
import FileTree from '../../../components/shared/FileTree.astro';
```

## Opening Hook

Scenario: Your agent needs database credentials to generate a migration script. Do you paste them into the chat? Set them as environment variables the agent can read? What if the agent logs them in its output? What if it writes them to a file that gets committed?

Time promise: 45 minutes.
Outcome promise: Secure secrets management with AWS Secrets Manager, .env patterns that prevent leaks, and four levels of agent sandboxing — from minimum viable to production-grade.

## Section Outline

### 1. Why This Matters
- Agents process everything in their context — including credentials
- The credential exposure surface area multiplies with agent usage

### 2. dotenv Patterns
- .env is gitignored, .env.example is committed with placeholders
- Components: EnvVars + EnvVar showing example patterns, FileTree

### 3. AWS Secrets Manager Integration
- Storing and retrieving secrets
- Rotating credentials automatically
- Components: Command, code blocks showing SDK usage

### 4. 1Password CLI Integration
- Alternative for local development
- op run for injecting secrets without env files

### 5. Agent Credential Scoping
- NEVER pass production credentials to agent sessions
- aws-vault exec for scoped credential injection
- Read-only credentials for production queries

### 6. Agent Execution Security — Four Sandboxing Levels
- Level 1: Scoped IAM only (minimum, Part 2 level)
- Level 2: Directory restriction + scoped IAM (minimum for curriculum)
- Level 3: Container execution + scoped IAM (recommended for CI)
- Level 4: VM execution + scoped IAM (production agent ops)
- Components: ComparisonTable comparing levels, Alert (important) with decision guide

### 7. AGENT-INSTRUCTIONS.md Additions
- Secrets & Credentials section (5 lines)
- Agent Execution Security section (6 lines)
- Total addition: 11 lines

## The Fine Line

| | |
|---|---|
| ❌ Under | Hardcoded credentials, .env committed to git, agents with full access |
| ✅ Right | Secrets Manager, .env.example pattern, Level 2+ agent sandboxing, aws-vault |
| ❌ Over | HashiCorp Vault cluster, Level 4 sandboxing, for a solo developer |
| 🤖 Agent Trap | Agent writes credentials to a config file, logs them in output, or requests production access "for testing" |

## Thread Progression

- **AGENT-INSTRUCTIONS.md:** Secrets & Credentials (5 lines) + Agent Execution Security (6 lines) added. Cumulative: 43 lines.
- **Scorecard:** No new panels
- **Eval:** No changes
- **MCP:** No changes

## Validation Checklist Items

- **Secrets:** .env gitignored; .env.example committed with placeholders; AWS Secrets Manager configured; No hardcoded credentials in codebase
- **Agent Security:** Agent sandboxing at Level 2+; aws-vault configured for agent credential injection; Agent sessions cannot access production credentials
- **AGENT-INSTRUCTIONS.md:** Secrets & Credentials section added (5 rules); Agent Execution Security section added (6 rules)

## Key Takeaways

1. Agents process everything in their context — never paste production credentials into an agent session.
2. aws-vault exec is the safest way to give agents AWS access — scoped, temporary, auditable.
3. Agent sandboxing has four levels. Level 2 (directory restriction) is the minimum. Level 3 (container) is recommended for CI.
4. .env files are gitignored. .env.example files are committed. This is non-negotiable when agents can access your filesystem.

## Lead Magnet

- **Name:** Secrets Management Starter Kit
- **Format:** Config files + scripts
- **Contents:** .env.example templates, AWS Secrets Manager setup scripts, aws-vault configuration, agent sandboxing guides for Level 2-4.
