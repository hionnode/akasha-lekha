# Part 1: Your First 60 Minutes in AWS

> Status: PLANNED (stale MDX exists — rewrite needed)
> Blog file: `apps/web/src/content/blog/aws-for-startups/01-your-first-60-minutes-in-aws.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Your First 60 Minutes in AWS: What Everyone Skips and Regrets Later"
description: "Set up your AWS account securely in 60 minutes. MFA, CloudTrail, billing alerts, and tagging from day one — without enterprise overhead."
excerpt: "What everyone skips and regrets later. Set up your AWS account the right way — secure enough to sleep at night, without the enterprise overhead that kills velocity."
date: "2026-01-08"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "security", "iam", "cloudtrail"]
series: "AWS From Zero to Production"
seriesPart: 1
featured: false
draft: true
---
```

## Component Imports

```mdx
import GuideStep from '../../../components/shared/GuideStep.astro';
import Command from '../../../components/shared/Command.astro';
import TerminalOutput from '../../../components/shared/TerminalOutput.astro';
import EnvVars from '../../../components/shared/EnvVars.astro';
import EnvVar from '../../../components/shared/EnvVar.astro';
import Alert from '../../../components/shared/Alert.astro';
import AwsRegionLatency from '../../../components/shared/AwsRegionLatency.astro';
import ValidationChecklist from '../../../components/shared/ValidationChecklist.astro';
```

## Opening Hook

Vivid scenario: reader creates AWS account, shares root keys on Slack, three months later wakes up to a $47,000 bill from cryptominers. CloudTrail wasn't enabled so there's no audit trail. This happens constantly — not from carelessness but because AWS security docs assume enterprise resources.

Time promise: 60 minutes.
Outcome promise: Secure enough to sleep at night, without the enterprise overhead.

## Section Outline

### 1. Why This Matters
- The $47K bill story (vivid, specific)
- AWS shared responsibility model (ASCII diagram in Alert)
- What we're preventing: credential theft, bill shock, invisible breaches, single point of failure

### 2. Root Account Lockdown
- What root is and why it's dangerous
- Components: GuideStep sequence for MFA setup
- ASCII diagram: root vs IAM admin access levels

### 3. MFA Everywhere
- Enable MFA on root
- Hardware key vs authenticator app comparison (table)
- Components: GuideStep, Command

### 4. CloudTrail — Your Audit Log
- What CloudTrail captures
- Enable in all regions
- Components: Command, TerminalOutput showing trail verification

### 5. Billing Alerts — No Surprise Bills
- Budget setup ($10, $50, $100 thresholds)
- Cost anomaly detection
- Components: GuideStep sequence

### 6. Tagging Strategy
- Four required tags: Environment, Project, Owner, ManagedBy
- Why tagging matters for cost tracking and agent attribution
- Table: tag key/value examples

### 7. Region Selection
- Components: AwsRegionLatency (interactive latency checker)
- Table: common regions with use cases

### 8. Create AGENT-INSTRUCTIONS.md
- The very first file in the repo
- Empty except for header: `# Agent Instructions for AWS Mastery`
- "This file will grow with every lesson. By Part 62, it'll be the most important file in your repo."

## The Fine Line

| | |
|---|---|
| ❌ Under | Using root account daily, no MFA, no billing alerts |
| ✅ Right | Root locked, IAM admin with MFA, billing alerts at $10/$50/$100 |
| ❌ Over | Complex AWS Organizations with SCPs for a solo founder |
| 🤖 Agent Trap | Agent creates IAM user with `AdministratorAccess` "to avoid permission errors" |

## Agent Trap

Not applicable for Part 1 (no agent usage yet). The Agent Trap in the Fine Line box foreshadows Part 2.

## Thread Progression

- **AGENT-INSTRUCTIONS.md:** File created with header only (`# Agent Instructions for AWS Mastery`, 1 line)
- **Scorecard:** Not yet deployed
- **Eval:** Not yet started
- **MCP:** Not yet introduced

## Validation Checklist Items

- **Security:** MFA enabled on root account; Root access keys deleted; IAM admin user created; CloudTrail enabled in all regions
- **Billing:** Budget alerts at $10, $50, $100; Cost anomaly detection enabled
- **Foundation:** Tagging strategy documented; Region selected; AGENT-INSTRUCTIONS.md created in repo root

## Key Takeaways

1. The root account is for emergencies only — lock it down and never use it for daily work.
2. CloudTrail is free for management events — there's no excuse not to enable it in all regions.
3. Billing alerts at $10, $50, and $100 catch problems before they become disasters.
4. Your AGENT-INSTRUCTIONS.md file starts empty today — by Part 62, it'll be the most important file in your repo.

## Lead Magnet

- **Name:** AWS Account Security Checklist
- **Format:** PDF
- **Contents:** Printable checklist covering root lockdown, MFA, CloudTrail, billing alerts, tagging, and region selection. Includes "first 60 minutes" timeline.

## ASCII Diagrams Spec

1. **AWS Shared Responsibility Model** — Placement: Why This Matters section. Two-tier box: your responsibility (customer data, IAM, app security, OS config, firewall rules) / AWS responsibility (physical security, hardware, network, virtualization, managed services).
2. **Root vs IAM Admin** — Placement: Root Account Lockdown section. Shows root (god mode, break-glass only) vs IAM admin (daily driver, scoped, audited).

## Cross-References

- Forward: "Coming in Part 2: we'll set up IAM properly — users, groups, roles, and a dedicated agent execution role."
- Forward: "Coming in Part 3: you'll install your coding agents and give them their first AWS task."

## Writer Notes

- This is the first post in a 70-part series. The opening paragraphs are the first impression.
- The $47K bill story is the hook — make it vivid and specific.
- Don't overwhelm with IAM detail — that's Part 2. Just create the admin user.
- The AGENT-INSTRUCTIONS.md creation is the symbolic start of the agent journey. Make it feel significant.
- Existing stale MDX should be rewritten from scratch to match this plan.
