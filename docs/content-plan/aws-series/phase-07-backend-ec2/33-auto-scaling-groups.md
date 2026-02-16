# Part 33: Auto Scaling Groups

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/33-auto-scaling-groups.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Auto Scaling Groups: Servers That Scale Themselves"
description: "Configure EC2 Auto Scaling Groups with launch templates, scaling policies, and health checks. Terraform-managed, agent-generated, human-reviewed."
excerpt: "Servers that scale themselves. Auto Scaling Groups with launch templates and scaling policies — because manually provisioning EC2 at 3 AM isn't a strategy."
date: "2026-05-12"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "ec2", "terraform", "backend"]
series: "AWS From Zero to Production"
seriesPart: 33
featured: false
draft: true
---
```

## Section Outline

### 1. Why This Matters — Manual scaling doesn't work at 3 AM
### 2. Launch Templates — AMI, instance type, user data, security groups
### 3. ASG Configuration — Min/max/desired, health check type (ELB), cooldown
### 4. Scaling Policies — Target tracking (CPU, request count), step scaling
### 5. ALB Integration — Health check-based instance replacement
### 6. Cost Awareness — Right-sizing minimum capacity

## The Fine Line

| | |
|---|---|
| ❌ Under | Single EC2, manual scaling, no health check recovery |
| ✅ Right | ASG with launch template, target tracking scaling, ALB health checks |
| ❌ Over | Predictive scaling, scheduled actions, before you have traffic patterns |
| 🤖 Agent Trap | Agent sets minimum capacity to 3 "for high availability" when 1 is fine for early traffic |

## Thread Progression

- All threads: No changes

## Key Takeaways

1. Auto Scaling Groups replace manual instance management — instances are cattle, not pets.
2. Start with min=1, desired=1. Scale based on actual data, not agent-suggested "best practices."
3. ALB health checks + ASG = automatic instance replacement when things go wrong.
