# Part 18: Frontend Deployment — SvelteKit + SolidStart

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/18-frontend-svelte-solid.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Frontend Deployment: SvelteKit + SolidStart on AWS"
description: "Deploy SvelteKit and SolidStart frontends to S3 + CloudFront. Alternative framework patterns for the same AWS infrastructure stack."
excerpt: "SvelteKit + SolidStart on AWS. Same infrastructure, different frameworks — because your deployment pipeline shouldn't care which framework you chose."
date: "2026-03-16"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "frontend", "s3", "cloudfront"]
series: "AWS From Zero to Production"
seriesPart: 18
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
import PanelSwitcher from '../../../components/shared/PanelSwitcher.astro';
import Panel from '../../../components/shared/Panel.astro';
import ComparisonTable from '../../../components/shared/ComparisonTable.astro';
```

## Opening Hook

You picked React in Part 17. Your co-founder swears by Svelte. The new hire loves Solid. Here's the thing: your AWS deployment pipeline doesn't care. Same S3 bucket, same CloudFront distribution, same Terraform. The framework is a build step. The infrastructure is the constant.

Time promise: 30 minutes.
Outcome promise: SvelteKit and SolidStart deployed to the same S3+CloudFront stack, proving that your infrastructure is framework-agnostic.

## Section Outline

### 1. Why This Matters — Framework-agnostic infrastructure
### 2. SvelteKit Static Adapter — Build config for S3 deployment
### 3. SolidStart Static Export — Build config for S3 deployment
### 4. Framework Comparison — Bundle size, build time, hydration strategy
### 5. Shared Deployment Pipeline — Same S3 sync, same CloudFront invalidation

## The Fine Line

| | |
|---|---|
| ❌ Under | Different deployment pipeline per framework |
| ✅ Right | Framework-agnostic pipeline, same infrastructure, framework is a build step |
| ❌ Over | Universal adapter supporting every framework before you've committed to one |
| 🤖 Agent Trap | Agent generates framework-specific deployment that only works for that framework |

## Thread Progression

- All threads: No changes

## Validation Checklist Items

- **Deployment:** SvelteKit or SolidStart deployed to S3; CloudFront serving correctly; Same pipeline works for both frameworks
- **Comparison:** Build size and time recorded for each framework

## Key Takeaways

1. Your deployment pipeline should be framework-agnostic — the framework is a build step, the infrastructure is the constant.
2. SvelteKit and SolidStart both produce static output that deploys identically to React — your S3+CloudFront stack doesn't change.

## Lead Magnet

- **Name:** Frontend Framework Comparison
- **Format:** PDF
- **Contents:** React vs Svelte vs Solid comparison for AWS deployment: bundle size, build time, hydration strategy, OTel integration complexity.
