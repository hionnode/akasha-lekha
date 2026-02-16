# Part 49: Lambda — Bun Runtime

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/49-lambda-bun.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Lambda with Bun: Fast Functions, Real Traces"
description: "Deploy Bun.js Lambda functions with OpenTelemetry. Custom runtime, cold start optimization, and traces in SigNoz for serverless observability."
excerpt: "Bun on Lambda. Custom runtime, fast cold starts, real traces — serverless with the observability you already have."
date: "2026-07-14"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "lambda", "serverless", "opentelemetry"]
series: "AWS From Zero to Production"
seriesPart: 49
featured: false
draft: true
---
```

## Section Outline
### 1. Bun Custom Runtime — Lambda layers, runtime bootstrap
### 2. Function Implementation — Handler pattern, context, response format
### 3. OTel Instrumentation — Traces from Lambda to SigNoz
### 4. Cold Start Optimization — Bundle size, lazy loading
### 5. Deployment with Terraform — Lambda function, layers, IAM role

## The Fine Line
| | |
|---|---|
| ❌ Under | Node.js runtime when Bun offers faster cold starts |
| ✅ Right | Bun custom runtime with OTel, optimized bundle, proper IAM |
| ❌ Over | Custom Lambda extensions, performance tuning before baseline |
| 🤖 Agent Trap | Agent bundles unnecessary dependencies, bloating cold start time |

## Thread Progression
- All threads: No changes

## Key Takeaways
1. Bun's custom runtime on Lambda offers competitive cold starts with TypeScript native support.
2. Bundle size directly impacts cold start — strip unnecessary dependencies.
3. Lambda OTel traces integrate seamlessly with your existing SigNoz setup from Part 5/29.
