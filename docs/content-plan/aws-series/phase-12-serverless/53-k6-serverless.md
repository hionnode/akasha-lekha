# Part 53: K6 Load Testing — Serverless

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/53-k6-serverless.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "K6 Load Testing: Serverless Under Pressure"
description: "Load test Lambda + API Gateway with K6. Cold start analysis, concurrency limits, cost-per-request at scale, and comparison with container baselines."
excerpt: "Serverless under pressure. K6 against Lambda + API Gateway — cold starts, concurrency, and cost-per-request at scale."
date: "2026-07-30"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "lambda", "serverless", "testing"]
series: "AWS From Zero to Production"
seriesPart: 53
featured: false
draft: true
---
```

## Section Outline
### 1. K6 Against API Gateway + Lambda — Test configuration for serverless
### 2. Cold Start Analysis — Measuring cold vs warm request latency
### 3. Concurrency Testing — Hitting Lambda concurrency limits
### 4. Cost Analysis — Cost-per-request at different traffic levels
### 5. Serverless vs Containers Comparison — EC2 vs Fargate vs Lambda cost and performance

## The Fine Line
| | |
|---|---|
| ❌ Under | No serverless load testing |
| ✅ Right | K6 with cold start analysis, concurrency testing, cost-per-request calculation |
| ❌ Over | Continuous serverless load testing, provisioned concurrency tuning before traffic |
| 🤖 Agent Trap | Agent doesn't account for cold starts in test assertions — first requests always fail thresholds |

## Thread Progression
- All threads: No changes

## Key Takeaways
1. Serverless load testing must account for cold starts — warm-up phase before measuring steady-state.
2. Cost-per-request is the key serverless metric: Lambda is cheaper at low traffic, containers win at scale.
3. The three compute models (EC2, Fargate, Lambda) each have different sweet spots — your K6 data tells you which to use.
