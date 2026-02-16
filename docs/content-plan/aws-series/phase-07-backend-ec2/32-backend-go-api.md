# Part 32: Backend on EC2 — Go API

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/32-backend-go-api.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Backend on EC2: Go API with Traces"
description: "Deploy a Go API on EC2 with OpenTelemetry. Static binary, minimal memory footprint, and the same infrastructure pipeline as Bun and Python."
excerpt: "Go API with traces. Static binary, tiny memory footprint, same infrastructure — the third language on the same pipeline."
date: "2026-05-08"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "ec2", "backend", "opentelemetry"]
series: "AWS From Zero to Production"
seriesPart: 32
featured: false
draft: true
---
```

## Section Outline

### 1. Why This Matters — Go's strengths: static binary, low memory, fast startup
### 2. Go API Setup — net/http or chi router, project structure
### 3. OpenTelemetry for Go — otel-go SDK, middleware, propagation
### 4. Deploy to EC2 — Single binary, systemd, behind ALB
### 5. Three-Language Comparison — SigNoz traces across Bun, Python, Go

## The Fine Line

| | |
|---|---|
| ❌ Under | Custom deployment per language |
| ✅ Right | Same pipeline for all three languages, Go's binary simplifies deployment |
| ❌ Over | Go-specific optimizations (goroutine tuning, GC tweaking) before profiling |
| 🤖 Agent Trap | Agent generates Go code with improper error handling (ignoring returned errors) |

## Thread Progression

- All threads: No changes

## Key Takeaways

1. Go's static binary is the simplest deployment: copy one file, run it. No runtime, no dependencies.
2. Three languages, one infrastructure pipeline, one observability surface — the pattern works.
3. Agent-generated Go code frequently ignores error returns. Always check.

## Lead Magnet

- **Name:** Backend Language Comparison
- **Format:** PDF
- **Contents:** Bun vs FastAPI vs Go comparison: startup time, memory usage, request throughput, OTel integration complexity, deployment simplicity.
