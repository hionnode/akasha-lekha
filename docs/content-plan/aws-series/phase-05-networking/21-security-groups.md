# Part 21: Security Groups — Stateful Firewalls

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/21-security-groups.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Security Groups: The Firewall Rules That Actually Matter"
description: "Design layered security groups for your VPC. ALB, application, and database tiers with least-privilege ingress — and the agent mistakes that expose everything."
excerpt: "The firewall rules that actually matter. Layered security groups — ALB, application, database — with the least-privilege ingress that agents consistently get wrong."
date: "2026-03-28"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "vpc", "networking", "security", "terraform"]
series: "AWS From Zero to Production"
seriesPart: 21
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
import ComparisonTable from '../../../components/shared/ComparisonTable.astro';
```

## Opening Hook

You've seen security group rules like `0.0.0.0/0` on port `0-65535`. "Allow all traffic from everywhere." It's the networking equivalent of leaving your front door open because you got tired of using your key. Agents love this pattern because it eliminates connectivity errors. Your job: narrow it down to exactly what's needed.

Time promise: 35 minutes.
Outcome promise: Three-tier security group architecture (ALB, application, database) with least-privilege ingress.

## Section Outline

### 1. Why This Matters — Security groups as defense layer, stateful vs stateless
### 2. Three-Tier Architecture — ALB tier (443 from internet), App tier (from ALB only), DB tier (from App only)
### 3. Security Group Design Patterns — Reference by security group ID (not CIDR), chain references
### 4. Agent-Assisted Terraform — Agent generates security groups, review for 0.0.0.0/0 violations
### 5. Common Patterns — SSH access (bastion only), egress rules, ephemeral ports

## The Fine Line

| | |
|---|---|
| ❌ Under | Single security group, 0.0.0.0/0 everywhere, no tier separation |
| ✅ Right | Three-tier security groups, reference by SG ID, only ALB allows 443 from internet |
| ❌ Over | Network ACLs + security groups + WAF rules at every tier, for an internal application |
| 🤖 Agent Trap | Agent sets ingress to 0.0.0.0/0 on all ports to "make things work" |

## Thread Progression

- All threads: No changes

## Validation Checklist Items

- **Security Groups:** ALB security group allows 443 from 0.0.0.0/0 only; App security group allows traffic from ALB SG only; DB security group allows traffic from App SG only; No security groups with 0.0.0.0/0 on all ports
- **Terraform:** Security groups reference each other by ID, not CIDR

## Key Takeaways

1. Security groups should reference other security groups by ID, not CIDR blocks — this creates a chain of trust.
2. Only the ALB security group should allow 0.0.0.0/0, and only on port 443 — everything else is scoped.
3. Agents default to open security groups because it eliminates connectivity errors — always check ingress rules.

## Lead Magnet

- **Name:** Security Group Patterns
- **Format:** PDF + Terraform
- **Contents:** Three-tier security group Terraform module, common patterns (bastion, RDS, ElastiCache), anti-patterns to avoid.
