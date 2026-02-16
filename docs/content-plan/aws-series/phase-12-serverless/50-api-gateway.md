# Part 50: API Gateway

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/50-api-gateway.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "API Gateway: The Serverless Front Door"
description: "Configure API Gateway (HTTP API) with Lambda integration. Routes, stages, throttling, and custom domains — the serverless equivalent of your ALB."
excerpt: "The serverless front door. API Gateway with Lambda — routes, throttling, and custom domains for your serverless APIs."
date: "2026-07-18"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "api-gateway", "lambda", "serverless", "terraform"]
series: "AWS From Zero to Production"
seriesPart: 50
featured: false
draft: true
---
```

## Section Outline
### 1. Why This Matters — API Gateway as serverless ALB
### 2. REST API vs HTTP API — Feature comparison, cost comparison (HTTP API is cheaper)
### 3. Routes and Integrations — Lambda proxy integration
### 4. Stages — Dev, staging, production stage variables
### 5. Throttling and Quotas — Rate limiting, burst capacity
### 6. Custom Domains — Route53 + ACM + API Gateway

## The Fine Line
| | |
|---|---|
| ❌ Under | Lambda function URLs (no throttling, no routing) |
| ✅ Right | HTTP API Gateway with routes, throttling, custom domain |
| ❌ Over | REST API with request/response transformations, API keys, usage plans, before you need them |
| 🤖 Agent Trap | Agent creates REST API (more expensive) when HTTP API has everything you need |

## Thread Progression
- All threads: No changes

## Key Takeaways
1. HTTP API is cheaper and simpler than REST API — use HTTP API unless you specifically need REST API features.
2. API Gateway + Lambda is the serverless equivalent of ALB + ECS — different compute model, same API patterns.
3. Always configure throttling — without it, a traffic spike becomes a cost spike.
