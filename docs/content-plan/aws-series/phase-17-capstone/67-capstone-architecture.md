# Part 67: Capstone — Architecture

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/67-capstone-architecture.mdx`
> Estimated word count: 3,500-4,500

## Frontmatter

```yaml
---
title: "Capstone Architecture: Designing the Whole System"
description: "Design a multi-tenant SaaS application using every AWS service and pattern from the series. Architecture decisions, trade-offs, and the complete AGENT-INSTRUCTIONS.md."
excerpt: "Designing the whole system. A multi-tenant SaaS application using every service and pattern from 66 parts — with the complete AGENT-INSTRUCTIONS.md guiding every decision."
date: "2026-10-02"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "terraform"]
series: "AWS From Zero to Production"
seriesPart: 67
featured: false
draft: true
---
```

## Section Outline
### 1. The Capstone Application — Multi-tenant SaaS, what it does, why this design
### 2. Architecture Overview — Full ASCII diagram with every AWS service
### 3. Compute Strategy — Which services use EC2/ECS/Lambda and why
### 4. Data Layer — RDS, ElastiCache, S3, DynamoDB decisions
### 5. Event Architecture — SQS, SNS, EventBridge event flows
### 6. Networking — VPC, ALB, CloudFront, API Gateway
### 7. Security — IAM, Secrets Manager, WAF, Security Hub
### 8. Observability — SigNoz + Grafana Scorecard, alerting
### 9. The Complete AGENT-INSTRUCTIONS.md — All 96 lines, annotated

## The Fine Line
| | |
|---|---|
| ❌ Under | Jumping into code without architecture |
| ✅ Right | Full architecture design with documented decisions before any code generation |
| ❌ Over | Spending weeks on architecture without deploying |
| 🤖 Agent Trap | Agent designs architecture optimized for its training data patterns, not your specific requirements |

## Key Takeaways
1. Architecture is a Design phase — the one step agents can't do well. Humans decide, agents implement.
2. The complete AGENT-INSTRUCTIONS.md (96 lines) represents 66 parts of earned knowledge — every rule has a story.
3. Trade-off documentation (WHY this approach, not just WHAT) is what makes architecture decisions durable.
