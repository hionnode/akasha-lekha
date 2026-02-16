# Part 31: Backend on EC2 — Python FastAPI

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/31-backend-python-fastapi.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Backend on EC2: Python FastAPI with Traces"
description: "Deploy a Python FastAPI backend on EC2 with OpenTelemetry. Same infrastructure, different language — proving your pipeline is language-agnostic."
excerpt: "Python FastAPI with traces. Same EC2, same ALB, same SigNoz — different language, same deployment pipeline."
date: "2026-05-04"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "ec2", "backend", "opentelemetry"]
series: "AWS From Zero to Production"
seriesPart: 31
featured: false
draft: true
---
```

## Section Outline

### 1. Why This Matters — Language-agnostic infrastructure
### 2. FastAPI Setup — Project structure, Pydantic models, async routes
### 3. OpenTelemetry for Python — opentelemetry-instrument auto, manual spans
### 4. Deploy to EC2 — Gunicorn + uvicorn, systemd, behind ALB
### 5. SigNoz — Python traces alongside Bun traces, cross-service comparison

## The Fine Line

| | |
|---|---|
| ❌ Under | Different deployment process per language |
| ✅ Right | Same Terraform, same ALB, same OTel pipeline — different runtime |
| ❌ Over | Python-specific infrastructure optimizations before proving the pattern |
| 🤖 Agent Trap | Agent generates synchronous FastAPI without async — defeats the purpose of using FastAPI |

## Thread Progression

- All threads: No changes

## Key Takeaways

1. Same infrastructure pattern, different language — your Terraform and ALB don't care what runtime is behind them.
2. FastAPI's async support is its main advantage — agents often generate synchronous handlers by default.
3. SigNoz shows Bun and Python traces side by side — compare latency characteristics across languages.
