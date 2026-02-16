# Part 15: CloudFront — CDN

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/15-cloudfront-cdn.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "CloudFront CDN: Global Performance Without the Complexity"
description: "Deploy CloudFront as CDN for your S3 static site. Origin access control, cache behaviors, custom error pages, and SSL termination — all Terraform-managed."
excerpt: "Global performance without the complexity. CloudFront CDN in front of S3 — because your users are everywhere and latency matters."
date: "2026-03-04"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "cloudfront", "s3", "terraform", "frontend"]
series: "AWS From Zero to Production"
seriesPart: 15
featured: false
draft: true
---
```

## Component Imports

```mdx
import GuideStep from '../../../components/shared/GuideStep.astro';
import Command from '../../../components/shared/Command.astro';
import TerminalOutput from '../../../components/shared/TerminalOutput.astro';
import Alert from '../../../components/shared/Alert.astro';
import ValidationChecklist from '../../../components/shared/ValidationChecklist.astro';
import ResourceStatus from '../../../components/shared/ResourceStatus.astro';
```

## Opening Hook

Your S3 site works, but it's serving from a single region. A user in Mumbai waits 800ms for your landing page while someone in Virginia gets it in 50ms. CloudFront puts your content on 400+ edge locations worldwide. Same effort, global performance.

Time promise: 40 minutes.
Outcome promise: CloudFront distribution serving your S3 site globally with proper caching, SSL termination, and Origin Access Control.

## Section Outline

### 1. Why This Matters — Single-region latency vs global CDN
### 2. Design: CloudFront + S3 Architecture — ASCII diagram showing Browser → CloudFront Edge → S3 Origin
### 3. Origin Access Control — Replace public bucket policy with OAC (modern pattern, not OAI)
### 4. Cache Behaviors — Default behavior, cache policies, compression
### 5. Custom Error Pages — 404 handling for SPA routing
### 6. SSL Termination — Connect ACM certificate from Part 14
### 7. Agent-Assisted Terraform — Full CloudFront distribution resource

## The Fine Line

| | |
|---|---|
| ❌ Under | No CDN, serving directly from S3 in one region |
| ✅ Right | CloudFront with OAC, proper cache behaviors, SSL termination |
| ❌ Over | Lambda@Edge functions, geo-restrictions, WAF, before you have traffic |
| 🤖 Agent Trap | Agent uses deprecated Origin Access Identity (OAI) instead of Origin Access Control (OAC) |

## Thread Progression

- All threads: No changes

## Validation Checklist Items

- **CloudFront:** Distribution deployed; OAC configured (not OAI); Cache behaviors correct; Custom error pages for SPA routing; SSL certificate attached
- **Performance:** Content served from edge locations; Compression enabled

## Key Takeaways

1. CloudFront is the difference between 800ms and 50ms for global users — and it costs pennies for static content.
2. Use Origin Access Control (OAC), not the deprecated Origin Access Identity (OAI) — agents often generate the old pattern.
3. Custom error pages are essential for SPAs — without them, direct URL access returns S3 404 XML.
