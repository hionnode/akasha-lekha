# Part 13: S3 — Static Hosting

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/13-s3-static-hosting.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "S3 Static Hosting: Your First Real AWS Deployment"
description: "Deploy a static website to S3 with Terraform. Bucket policies, website configuration, and the agent-assisted workflow for your first real AWS resource."
excerpt: "Your first real AWS deployment. S3 static hosting with Terraform — agent-generated, human-reviewed, actually deployed."
date: "2026-02-24"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "s3", "terraform", "frontend"]
series: "AWS From Zero to Production"
seriesPart: 13
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
import FileTree from '../../../components/shared/FileTree.astro';
import ResourceStatus from '../../../components/shared/ResourceStatus.astro';
```

## Opening Hook

Scenario: You've been writing Terraform locally for weeks. Today, something actually deploys to AWS. A real S3 bucket, serving a real website, accessible from any browser. The gap between "learning" and "building" closes right here.

Time promise: 45 minutes.
Outcome promise: Static website deployed on S3, accessible via the S3 website endpoint, with Terraform managing the entire thing.

## Section Outline

### 1. Why This Matters
- First real deployment — everything before was local setup
- S3 as the simplest possible hosting (no servers, no scaling concerns)

### 2. Design: S3 Website Architecture
- ASCII diagram: Browser → S3 Website Endpoint → HTML/CSS/JS
- Bucket policy for public read access
- Index and error document configuration

### 3. Generate: Agent Builds Terraform
- Prompt agent with S3 website requirements + AGENT-INSTRUCTIONS.md context
- Show unedited agent output
- Review: tags, naming, bucket policy scope

### 4. Verify: Terraform Validation
- terraform validate, tflint, checkov
- Common findings on agent output
- Manual verify step (not scripted yet — that's Part 19)

### 5. Deploy and Test
- terraform plan → review → apply
- Upload sample site files
- Verify website endpoint works
- Components: Command, TerminalOutput, ResourceStatus

## The Fine Line

| | |
|---|---|
| ❌ Under | Manual S3 bucket creation via console, no Terraform |
| ✅ Right | Terraform-managed S3 with website config, bucket policy, versioning |
| ❌ Over | CloudFront + Route53 + ACM before testing basic S3 hosting (that's Parts 14-15) |
| 🤖 Agent Trap | Agent makes bucket publicly readable with `s3:*` instead of scoped `s3:GetObject` on website paths only |

## Thread Progression

- **AGENT-INSTRUCTIONS.md:** No additions
- **Scorecard:** No new panels
- **Eval:** No changes
- **MCP:** No changes

## Validation Checklist Items

- **S3:** Bucket created with Terraform; Website hosting enabled; Index and error documents configured; Bucket policy scoped to `s3:GetObject` only
- **Terraform:** All resources tagged per conventions; terraform plan shows expected resources; Deployed successfully
- **Verification:** Website accessible via S3 endpoint; Sample HTML renders correctly

## Key Takeaways

1. S3 static hosting is the simplest deployment on AWS — no servers, no scaling, no maintenance.
2. Bucket policies should be scoped to `s3:GetObject` for website content only — agents default to broader permissions.
3. This is your first real deployment. Everything before was setup. From here on, we're building production infrastructure.
