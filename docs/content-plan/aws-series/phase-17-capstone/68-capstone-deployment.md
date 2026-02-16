# Part 68: Capstone — Deployment

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/68-capstone-deployment.mdx`
> Estimated word count: 3,500-4,500

## Frontmatter

```yaml
---
title: "Capstone Deployment: From Zero to Production"
description: "Deploy the complete multi-tenant SaaS application using the full Generate → Verify → Explain pipeline. Terraform from zero to production in one part."
excerpt: "From zero to production. The full pipeline deploys the capstone application — Terraform, containers, serverless, databases, all in one coordinated deployment."
date: "2026-10-06"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "terraform", "ai-agents"]
series: "AWS From Zero to Production"
seriesPart: 68
featured: false
draft: true
---
```

## Section Outline
### 1. Deployment Strategy — Order of operations for full-stack deployment
### 2. Pipeline in Action — full-pipeline.sh deploys the capstone, human reviews explain summaries
### 3. VPC + Networking — First deployment phase
### 4. Database + Cache — Second deployment phase
### 5. Backend Services — ECS + Lambda deployment
### 6. Frontend + CDN — S3 + CloudFront deployment
### 7. DNS + SSL — Final connectivity
### 8. Smoke Tests — Automated verification of full deployment

## The Fine Line
| | |
|---|---|
| ❌ Under | Manual deployment, one resource at a time |
| ✅ Right | Full pipeline-driven deployment, phased, with explain summaries at each phase |
| ❌ Over | Blue-green full-stack deployment for the first deploy |
| 🤖 Agent Trap | Agent deploys all resources simultaneously — dependency failures cascade |

## Key Takeaways
1. The pipeline that took 62 parts to build now deploys an entire SaaS application. That's the payoff.
2. Phased deployment (network → data → compute → frontend → DNS) prevents dependency cascades.
3. The explain summary at each phase is your deployment briefing — read it before approving the next phase.
