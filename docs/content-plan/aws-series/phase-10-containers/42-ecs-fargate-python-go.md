# Part 42: ECS Fargate — Python + Go

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/42-ecs-fargate-python-go.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "ECS Fargate: Python + Go APIs"
description: "Deploy Python FastAPI and Go APIs on ECS Fargate. Same infrastructure pattern, different runtimes — proving the container pipeline is language-agnostic."
excerpt: "Python + Go on ECS Fargate. Same infrastructure, different runtimes — your container pipeline doesn't care which language is inside."
date: "2026-06-16"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "ecs", "docker", "terraform", "backend"]
series: "AWS From Zero to Production"
seriesPart: 42
featured: false
draft: true
---
```

## Section Outline

### 1. Why This Matters — Language-agnostic container deployment
### 2. Python FastAPI on Fargate — Task definition, Gunicorn configuration
### 3. Go API on Fargate — Task definition, binary optimization
### 4. Multi-Service Architecture — Multiple services behind ALB with path-based routing
### 5. Service Discovery — Container-to-container communication

## The Fine Line

| | |
|---|---|
| ❌ Under | Different infrastructure per language |
| ✅ Right | Same Fargate pattern for all languages, path-based routing on ALB |
| ❌ Over | Service mesh, sidecar proxies, for three services |
| 🤖 Agent Trap | Agent creates separate ALBs per service instead of path-based routing on one ALB |

## Thread Progression

- All threads: No changes

## Key Takeaways

1. Containers make deployment language-agnostic — the same Terraform works for Bun, Python, and Go.
2. Use path-based routing on a single ALB, not separate ALBs per service.
3. Go's static binary makes the smallest, fastest container — useful benchmark for right-sizing.
