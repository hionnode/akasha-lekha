# Part 22: ALB — Application Load Balancer

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/22-alb-load-balancer.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "ALB: The Front Door to Your Backend"
description: "Deploy an Application Load Balancer with HTTPS termination, health checks, and target groups. The entry point for EC2, ECS, and Lambda backends."
excerpt: "The front door to your backend. ALB with HTTPS, health checks, and target groups — ready for EC2, ECS, or Lambda behind it."
date: "2026-04-01"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "alb", "networking", "terraform"]
series: "AWS From Zero to Production"
seriesPart: 22
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
import ResourceStatus from '../../../components/shared/ResourceStatus.astro';
```

## Opening Hook

Your VPC is ready. Security groups are locked down. Now you need a front door — something that accepts HTTPS traffic, checks if your backend is healthy, and routes requests to the right place. That's the ALB. Every backend deployment pattern in this series (EC2, ECS, Lambda) connects through it.

Time promise: 40 minutes.
Outcome promise: ALB deployed with HTTPS listener, ACM certificate, health checks, and a target group ready for your first backend.

## Section Outline

### 1. Why This Matters — Single entry point, HTTPS termination, health checking
### 2. Design: ALB Architecture — ASCII diagram: Internet → ALB (public subnet) → Target Group → EC2/ECS (private subnet)
### 3. ALB Setup — Terraform for ALB, listeners, target groups
### 4. HTTPS Termination — ACM certificate (from Part 14), HTTP→HTTPS redirect
### 5. Health Checks — Path, interval, thresholds, importance for zero-downtime deploys
### 6. Path-Based Routing — Foundation for multiple services behind one ALB

## The Fine Line

| | |
|---|---|
| ❌ Under | Direct EC2 access via public IP, no load balancer, no health checks |
| ✅ Right | ALB with HTTPS, health checks, target groups, ready for multiple backends |
| ❌ Over | NLB + ALB combination, weighted routing, before you have multiple services |
| 🤖 Agent Trap | Agent creates ALB in private subnets (unreachable) or forgets HTTP→HTTPS redirect |

## Thread Progression

- All threads: No changes

## Validation Checklist Items

- **ALB:** Deployed in public subnets; HTTPS listener on 443 with ACM cert; HTTP→HTTPS redirect on 80; Health check configured; Target group created
- **Networking:** ALB security group allows 443; Target group in correct VPC

## Key Takeaways

1. The ALB is the single entry point for all backend traffic — HTTPS termination, health checks, and routing happen here.
2. ALB must be in public subnets (agents sometimes put it in private subnets, making it unreachable).
3. Health checks are critical for zero-downtime deployments — the ALB only routes to healthy targets.
4. Every backend pattern from here on (EC2, ECS, Lambda) connects through this ALB.
