# Part 17: Frontend Deployment — React + Astro

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/17-frontend-react-astro.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Frontend Deployment: React + Astro on AWS"
description: "Deploy React and Astro frontends to S3 + CloudFront with OpenTelemetry browser SDK. Web Vitals in SigNoz for real user performance monitoring."
excerpt: "React + Astro on AWS with real user monitoring. Deploy to S3 + CloudFront and see Web Vitals in SigNoz — because 'it loads fast on my machine' isn't data."
date: "2026-03-12"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "frontend", "opentelemetry", "s3", "cloudfront"]
series: "AWS From Zero to Production"
seriesPart: 17
featured: false
draft: true
---
```

## Component Imports

```mdx
import GuideStep from '../../../components/shared/GuideStep.astro';
import Command from '../../../components/shared/Command.astro';
import CommandSequence from '../../../components/shared/CommandSequence.astro';
import TerminalOutput from '../../../components/shared/TerminalOutput.astro';
import Alert from '../../../components/shared/Alert.astro';
import ValidationChecklist from '../../../components/shared/ValidationChecklist.astro';
import PanelSwitcher from '../../../components/shared/PanelSwitcher.astro';
import Panel from '../../../components/shared/Panel.astro';
```

## Opening Hook

"It loads fast on my machine" is not performance data. Your SigNoz instance from Part 5 has been sitting empty. Today it gets its first real data: Web Vitals from actual browser sessions. Deploy React or Astro to your S3+CloudFront stack and see how real users experience your site.

Time promise: 45 minutes.
Outcome promise: Frontend deployed to AWS with OpenTelemetry browser SDK sending Web Vitals to SigNoz.

## Section Outline

### 1. Why This Matters — Real user monitoring vs local testing
### 2. Build Configuration — React (Vite) and Astro build outputs for S3
### 3. Deployment Script — S3 sync with cache invalidation
### 4. OTel Browser SDK — Agent generates OpenTelemetry setup, sends Web Vitals to SigNoz
### 5. SigNoz Dashboard — First real traces in SigNoz (deployed in Part 5)
### 6. Cache Invalidation Strategy — When and how to invalidate CloudFront cache

## The Fine Line

| | |
|---|---|
| ❌ Under | Deploy without monitoring, no cache invalidation strategy |
| ✅ Right | S3+CloudFront deployment with OTel browser SDK, Web Vitals in SigNoz, cache invalidation |
| ❌ Over | Custom RUM solution, A/B testing infrastructure, before you have users |
| 🤖 Agent Trap | Agent generates OTel config that sends all events (not sampled), flooding SigNoz with data |

## Thread Progression

- All threads: No changes

## Validation Checklist Items

- **Deployment:** Frontend built and deployed to S3; CloudFront serving the application; Cache invalidation working
- **Monitoring:** OTel browser SDK configured; Web Vitals visible in SigNoz; Sampling rate appropriate

## Key Takeaways

1. SigNoz gets its first real data today — the empty dashboard from Part 5 starts earning its keep.
2. Web Vitals (LCP, FID, CLS) are the metrics that matter for user experience — not your local Lighthouse score.
3. Always configure sampling on browser telemetry — agents default to sending everything.

## Lead Magnet

- **Name:** Frontend Deployment Checklist
- **Format:** PDF
- **Contents:** Build config checklist, S3 deployment script, OTel browser SDK setup, cache invalidation patterns, Web Vitals targets.
