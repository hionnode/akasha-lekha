# Part 41: ECS Fargate — Bun.js

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/41-ecs-fargate-bun.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "ECS Fargate: Bun.js API Without Managing Servers"
description: "Deploy Bun.js API on ECS Fargate. Task definitions, service configuration, ALB integration, and auto-scaling — serverless containers with full control."
excerpt: "Bun.js API without managing servers. ECS Fargate — the sweet spot between EC2 (manage everything) and Lambda (control nothing)."
date: "2026-06-12"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "ecs", "docker", "terraform", "backend"]
series: "AWS From Zero to Production"
seriesPart: 41
featured: false
draft: true
---
```

## Section Outline

### 1. Why This Matters — EC2 vs ECS Fargate vs Lambda tradeoffs
### 2. Task Definitions — Container definitions, resource allocation, environment variables
### 3. Service Configuration — Desired count, deployment configuration, circuit breaker
### 4. ALB Integration — Target group, health checks, path-based routing
### 5. Auto-Scaling — Target tracking on CPU/memory, service auto-scaling
### 6. Logging — CloudWatch Logs, structured logging with trace IDs

## The Fine Line

| | |
|---|---|
| ❌ Under | Running containers on EC2 with manual orchestration |
| ✅ Right | ECS Fargate with ALB, auto-scaling, structured logging, health checks |
| ❌ Over | EKS for a handful of services |
| 🤖 Agent Trap | Agent allocates 2 vCPU / 4GB memory when 0.25 vCPU / 0.5GB handles the load — 8x cost |

## Thread Progression

- All threads: No changes

## Key Takeaways

1. ECS Fargate is the sweet spot: no server management (like Lambda) with full container control (like EC2).
2. Start with 0.25 vCPU / 0.5 GB. Agents default to much larger allocations.
3. Always enable deployment circuit breaker — it prevents bad deployments from taking down your service.

## Lead Magnet

- **Name:** ECS Task Definition Templates
- **Format:** JSON + Terraform
- **Contents:** Task definition templates for Bun, Python, Go with proper resource allocation, logging, health checks.
