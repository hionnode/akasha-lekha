# Part 2: IAM — The Key to Everything

> Status: PLANNED (stale MDX exists — rewrite needed)
> Blog file: `apps/web/src/content/blog/aws-for-startups/02-iam-key-to-everything.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "IAM — The Key to Everything: Least Privilege Without Losing Your Mind"
description: "Master AWS IAM for startups. Users, groups, roles, policies, and a dedicated agent execution role — least privilege without the enterprise complexity."
excerpt: "Least privilege without losing your mind. Set up IAM the right way — users, groups, roles, and agent-scoped permissions that scale with your team."
date: "2026-01-12"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "security", "iam"]
series: "AWS From Zero to Production"
seriesPart: 2
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
import ComparisonTable from '../../../components/shared/ComparisonTable.astro';
import FileTree from '../../../components/shared/FileTree.astro';
```

## Opening Hook

Scenario: reader's first hire starts Monday. Do you share your AWS password? Create another root account? Copy-paste your access keys into a shared .env file? Every option feels wrong because you skipped IAM setup.

Time promise: 45 minutes.
Outcome promise: Clean IAM setup with developer group, CI/CD role, and agent execution role — all following least privilege.

## Section Outline

### 1. Why This Matters
- The "shared credentials" horror story
- IAM is AWS's most important service — it gates access to everything else
- ASCII diagram: IAM entity relationships (users, groups, roles, policies)

### 2. Core Concepts
- Users: human identities
- Groups: permission bundles for humans
- Roles: permission bundles for services/agents
- Policies: JSON documents defining permissions
- Table: when to use each

### 3. Practical Setup
- Developer group with scoped permissions
- CI/CD role (for GitHub Actions in Part 46)
- Service roles (for EC2, ECS, Lambda later)
- Components: GuideStep sequence, Command, TerminalOutput

### 4. Agent IAM — Separate Role for Agent Execution
- Why agents get their own role (audit trail, blast radius, scoped permissions)
- Agent role: more restricted than developer, broader than CI/CD
- Never give agents your admin credentials
- Components: Alert (important), code block with IAM policy JSON

### 5. Policy Patterns
- Managed vs inline policies (table comparison)
- Policy simulator walkthrough
- Components: ComparisonTable, Command

### 6. Common Mistakes
- Wildcard permissions (`Action: "*"`, `Resource: "*"`)
- Embedded credentials in code
- Overly broad service roles
- Components: Alert (caution) for each

### 7. First AGENT-INSTRUCTIONS.md Addition
- Add IAM Rules section
- Explain WHY each rule matters (reader just learned what `*` does)
- Show the verbatim addition

## The Fine Line

| | |
|---|---|
| ❌ Under | Everyone uses root, shared credentials, wildcard policies |
| ✅ Right | Developer group, CI/CD role, agent role, least privilege policies |
| ❌ Over | AWS SSO with SAML federation for a 3-person team |
| 🤖 Agent Trap | Agent defaults to `*` permissions because it eliminates errors during generation |

## Agent Trap

Agents default to wildcard IAM because it's the path of least resistance during generation. When an agent generates a Terraform IAM policy, it will almost always start with `Action: "*"` because that produces zero permission errors. The AGENT-INSTRUCTIONS.md rule now explicitly forbids this. Agents that read the instructions will comply. Agents that don't get caught by checkov in Part 8.

## Thread Progression

- **AGENT-INSTRUCTIONS.md:** IAM Rules section added (4 lines: no wildcards, no AdministratorAccess, least privilege, separate agent roles). Cumulative: 5 lines.
- **Scorecard:** Not yet deployed
- **Eval:** Not yet started
- **MCP:** Not yet introduced

## Validation Checklist Items

- **IAM Setup:** Developer group created with scoped permissions; CI/CD role created; Agent execution role created with scoped permissions; No users have console access with access keys
- **Security:** No wildcard IAM policies exist; No inline policies on roles; Policy simulator tested for developer group
- **AGENT-INSTRUCTIONS.md:** IAM Rules section added with 4 rules

## Key Takeaways

1. IAM is the most important AWS service — every security failure traces back to IAM misconfiguration.
2. Agents get their own IAM role, separate from developers, with narrower permissions and full audit trail.
3. Wildcard permissions (`*`) are the single most common agent-generated security flaw — your AGENT-INSTRUCTIONS.md now catches this.
4. The first rule you add to AGENT-INSTRUCTIONS.md should feel visceral — you just saw why it matters.

## Lead Magnet

- **Name:** IAM Policy Templates for Startups
- **Format:** JSON files + README
- **Contents:** Developer group policy, CI/CD role policy, agent execution role policy (scoped), service role templates. Ready to use, least privilege.

## ASCII Diagrams Spec

1. **IAM Entity Relationships** — Placement: Core Concepts section. Shows Users → Groups → Policies, Roles → Policies, Services → AssumeRole → Roles flow.

## Cross-References

- Back: "In [Part 1](/blog/aws-for-startups/01-your-first-60-minutes-in-aws), we created our IAM admin user. Now we'll set up the full IAM structure."
- Forward: "Coming in Part 3: you'll install your coding agents and they'll use this agent role for their first AWS task."

## Writer Notes

- IAM is dry — the opening hook needs to make it feel urgent.
- The agent role concept is this series' unique angle. Spend time on WHY agents need separate roles.
- The first AGENT-INSTRUCTIONS.md addition is a milestone — make it ceremonial. The reader just learned what `*` does and now they're writing a rule to prevent it.
- Existing stale MDX should be rewritten from scratch.
