# Part 44: K6 Load Testing — Containers

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/44-k6-containers.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "K6 Load Testing: Containers Under Pressure"
description: "Load test your containerized services with K6. Compare EC2 baselines with ECS Fargate performance, identify container-specific bottlenecks."
excerpt: "Containers under pressure. K6 load testing against ECS Fargate — comparing containerized performance to your EC2 baselines."
date: "2026-06-24"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "ecs", "testing"]
series: "AWS From Zero to Production"
seriesPart: 44
featured: false
draft: true
---
```

## Section Outline

### 1. Why This Matters — Container overhead, baseline comparison
### 2. K6 Against Fargate — Testing containerized services
### 3. EC2 vs Fargate Comparison — Latency, throughput, cost comparison with K6 data
### 4. Container-Specific Bottlenecks — Task resource limits, ENI allocation, container startup
### 5. Auto-Scaling Under Load — Testing Fargate auto-scaling behavior

## The Fine Line

| | |
|---|---|
| ❌ Under | No load testing of containerized services |
| ✅ Right | K6 against Fargate with EC2 baseline comparison, scaling behavior tested |
| ❌ Over | Continuous load testing, chaos engineering on containers |
| 🤖 Agent Trap | Agent uses EC2 thresholds for container tests — different infrastructure, different baselines |

## Thread Progression

- All threads: No changes

## Key Takeaways

1. Containerized services have different performance characteristics than EC2 — re-baseline with K6.
2. Fargate auto-scaling takes longer than EC2 ASG — account for cold-start when setting scaling policies.
3. Your Part 34 thresholds may need adjustment for containerized services — use data, not assumptions.
