# Part 51: API Gateway — Python + Go

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/51-api-gateway-python-go.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "API Gateway: Python + Go Lambda Backends"
description: "Python and Go Lambda functions behind API Gateway. Same infrastructure, different runtimes — completing the serverless language comparison."
excerpt: "Python + Go behind API Gateway. Same routes, same throttling, different runtimes — your serverless pipeline is language-agnostic too."
date: "2026-07-22"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "api-gateway", "lambda", "serverless"]
series: "AWS From Zero to Production"
seriesPart: 51
featured: false
draft: true
---
```

## Section Outline
### 1. Python Lambda Functions — Handler pattern, dependencies with layers
### 2. Go Lambda Functions — Compiled binary, minimal cold start
### 3. Multi-Runtime API — Same API Gateway, different Lambda runtimes per route
### 4. Cold Start Comparison — Bun vs Python vs Go cold start measurements

## The Fine Line
| | |
|---|---|
| ❌ Under | Different API Gateways per language |
| ✅ Right | Same API Gateway, different Lambda runtimes per route, cold start data |
| ❌ Over | Optimizing runtime choice before measuring real cold starts |
| 🤖 Agent Trap | Agent installs massive dependency layers for Python, inflating cold start by 5-10x |

## Thread Progression
- All threads: No changes

## Key Takeaways
1. Go has the fastest Lambda cold starts (compiled binary). Python is slowest (dependency loading). Bun is competitive.
2. Same API Gateway can route to different runtimes — choose per route based on cold start requirements.

## Lead Magnet
- **Name:** Serverless Language Comparison
- **Format:** PDF
- **Contents:** Cold start by language, memory optimization, dependency management, cost comparison.
