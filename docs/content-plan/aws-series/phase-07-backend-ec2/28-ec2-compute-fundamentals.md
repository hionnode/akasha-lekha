# Part 28: EC2 — Compute Fundamentals

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/28-ec2-compute-fundamentals.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "EC2 Compute Fundamentals: Your First Server on AWS"
description: "Launch EC2 instances with Terraform. Instance types, AMI selection, user data scripts, and the agent-assisted workflow for compute provisioning."
excerpt: "Your first server on AWS. EC2 with Terraform — instance types, AMIs, user data, and why agents always pick the wrong instance size."
date: "2026-04-22"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "ec2", "terraform", "backend"]
series: "AWS From Zero to Production"
seriesPart: 28
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
import ResourceStatus from '../../../components/shared/ResourceStatus.astro';
```

## Opening Hook

Your VPC is ready, ALB is waiting. Time to put something behind it. EC2 is AWS's oldest and most flexible compute service — and the one agents over-provision the most. That t3.xlarge "for safety" is $120/month when a t3.micro at $7.50/month would handle your traffic just fine.

## Section Outline

### 1. Why This Matters — EC2 as compute foundation
### 2. Instance Types — t3/t4g family for startups, burstable vs standard, ARM vs x86
### 3. AMI Selection — Amazon Linux 2023, Ubuntu, why not to hardcode AMI IDs
### 4. User Data Scripts — Bootstrap on launch, agent-generated startup scripts
### 5. Key Pairs and SSH — SSH access through bastion only (per VPC design)
### 6. EC2 in Private Subnet — Connected to ALB target group from Part 22

## The Fine Line

| | |
|---|---|
| ❌ Under | Manual EC2 launch via console, no Terraform, public subnet |
| ✅ Right | Terraform-managed EC2 in private subnet, right-sized instance, user data bootstrap |
| ❌ Over | Custom AMI pipeline, placement groups, dedicated hosts, for a single API |
| 🤖 Agent Trap | Agent provisions t3.xlarge ($120/mo) when t3.micro ($7.50/mo) handles your traffic |

## Thread Progression

- All threads: No changes

## Validation Checklist Items

- **EC2:** Instance launched in private subnet; Connected to ALB target group; User data script runs on boot; Instance accessible via bastion/SSM only
- **Cost:** Instance type appropriate for workload; No hardcoded AMI IDs

## Key Takeaways

1. Start with the smallest instance that works (t3.micro/t3.small) — scaling up is easy, scaling your bill down is hard.
2. Never hardcode AMI IDs — use data sources. Agents always hardcode them.
3. EC2 lives in private subnets, accessed through the ALB — never give an EC2 instance a public IP for an API.

## Lead Magnet

- **Name:** EC2 Instance Type Cheatsheet
- **Format:** PDF
- **Contents:** Instance family comparison, burstable credits explained, ARM vs x86 benchmarks, right-sizing guide.
