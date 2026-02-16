# Part 4: Terraform Fundamentals — With Agent-Assisted IaC

> Status: PLANNED (stale MDX exists — rewrite needed)
> Blog file: `apps/web/src/content/blog/aws-for-startups/04-terraform-fundamentals.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "Terraform Fundamentals: Why Clicking Is Technical Debt"
description: "Learn Terraform fundamentals with agent-assisted IaC. HCL basics, S3 state backend, project structure, and your first model comparison with the Terraform Taste Test."
excerpt: "Why clicking is technical debt, and how agents write your infrastructure. Terraform basics, state management, and your first taste test comparing AI models."
date: "2026-01-20"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "terraform", "iac", "model-eval"]
series: "AWS From Zero to Production"
seriesPart: 4
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
import ComparisonTable from '../../../components/shared/ComparisonTable.astro';
```

## Opening Hook

Scenario: You need to spin up a staging environment. You click through the AWS console for an hour, configuring S3, IAM, CloudFront. Next week, you need to do it again for production. Was that security group 443 or 8443? Did you enable versioning? You don't remember, and there's no record.

Time promise: 60 minutes for Terraform setup + 15 minutes for the Taste Test.
Outcome promise: Terraform project with S3 state backend, your first agent-generated infrastructure, and hard data on how different AI models perform.

## Section Outline

### 1. Why This Matters (IaC Philosophy)
- Console clicking is undocumented, unrepeatable, unauditable
- Terraform: reproducible, reviewable, version-controlled infrastructure
- "Code review for infrastructure" concept

### 2. HCL Basics
- Providers, resources, variables, outputs
- Minimal examples showing each concept
- Components: code blocks with `title="main.tf"`, `title="variables.tf"`, etc.

### 3. State Management
- What Terraform state is and why it matters
- S3 backend + DynamoDB locking setup
- Components: GuideStep sequence, Command, TerminalOutput
- ASCII diagram: state flow (local → S3 with DynamoDB lock)

### 4. Project Structure
- Modules, environments layout
- Components: FileTree showing terraform directory structure
- Naming conventions: `{project}-{env}-{resource}`

### 5. AGENT-INSTRUCTIONS.md for Terraform
- Add Terraform Conventions section (10 lines)
- Explain each rule: WHY it matters
- This is the second earned section — reader now knows enough HCL to understand the rules

### 6. Agent-Assisted Workflow
- The prompt → plan → review → fix → apply cycle
- Show a real prompt, real agent output, manual review
- Components: code blocks showing prompt and output

### 7. The Terraform Taste Test (Guided)
- Same prompt → 2-3 models → mechanical rubric
- The S3 bucket prompt (versioning, KMS, public access blocked, Glacier lifecycle, tags per conventions)
- 5-point rubric: terraform validate, no hardcoded region, no IAM wildcards, tags present, terraform fmt
- Results recording table
- Components: Alert (important) for rubric, table for results
- "This is NOT a real evaluation. Save your results — in Part 9, you'll compare against the automated eval."

## The Fine Line

| | |
|---|---|
| ❌ Under | Console clicking, no state management, no conventions |
| ✅ Right | Terraform with S3 state, naming conventions, agent-generated with human review |
| ❌ Over | Custom Terraform provider, complex module registry, before deploying anything |
| 🤖 Agent Trap | Agent generates `terraform apply` without `-out` plan file; creates resources in wrong region |

## Agent Trap

Two common traps in Part 4:
1. Agent generates `terraform apply` without saving a plan file first. Always: `terraform plan -out=plan.tfplan` → review → `terraform apply plan.tfplan`.
2. Agent creates resources in `us-west-2` when AGENT-INSTRUCTIONS.md says `us-east-1`. Run the Taste Test with and without instructions to see the difference.

## Thread Progression

- **AGENT-INSTRUCTIONS.md:** Terraform Conventions section added (10 lines: provider/region, state, naming, tags, plan-before-apply, no hardcoded AMIs/IDs/regions, no inline policies, modules, variables). Cumulative: 15 lines.
- **Scorecard:** Not yet deployed
- **Eval:** Guided Taste Test completed. Reader has first hard data on model differences.
- **MCP:** Not yet introduced

## Validation Checklist Items

- **Terraform:** Terraform installed; S3 backend configured with DynamoDB locking; Project structure follows conventions; At least one resource deployed successfully
- **AGENT-INSTRUCTIONS.md:** Terraform Conventions section added (10 rules)
- **Taste Test:** Same prompt run on 2-3 models; Results recorded (validate, region, wildcards, tags, fmt); Results saved for Part 9 comparison

## Key Takeaways

1. Console clicking is technical debt — Terraform makes infrastructure reproducible, reviewable, and version-controlled.
2. Always save a terraform plan before applying — never let agents (or yourself) skip this step.
3. Different AI models produce measurably different Terraform output — the Taste Test proves this with data, not opinion.
4. AGENT-INSTRUCTIONS.md conventions only work if the agent reads them — test with and without to see the difference.
5. Save your Taste Test results — in Part 9, you'll compare your manual scoring against an automated evaluation framework.

## Lead Magnet

- **Name:** Terraform Starter Template + AGENT-INSTRUCTIONS.md Seed File
- **Format:** Git repo / zip
- **Contents:** Terraform project structure, S3 backend config, variables template, AGENT-INSTRUCTIONS.md with Parts 1-4 content, .gitignore, Makefile.

## ASCII Diagrams Spec

1. **Terraform State Flow** — Placement: State Management section. Shows: terraform plan → S3 state read → diff → plan output → human review → terraform apply → S3 state write + DynamoDB lock.
2. **Taste Test Rubric** — Placement: Taste Test section. The 5-check rubric in a box diagram.

## Code Examples Spec

1. **S3 Taste Test Prompt** — Language: plaintext. Purpose: the exact prompt given to all models. Key points: versioning, KMS encryption, block public access, Glacier lifecycle 90 days, tags per conventions.
2. **Terraform S3 Backend Config** — Language: HCL, title: `backend.tf`. Purpose: S3 + DynamoDB state configuration.
3. **Basic Resource Example** — Language: HCL, title: `main.tf`. Purpose: show provider, resource, variables, outputs in minimal example.

## Cross-References

- Back: "The IAM rules we added in [Part 2](/blog/aws-for-startups/02-iam-key-to-everything) — no wildcards, least privilege — are now in our AGENT-INSTRUCTIONS.md. Watch what happens when agents read them."
- Forward: "Coming in Part 9: the full model evaluation framework. Your Taste Test was 5 checks and 3 models. The eval framework is 11 prompts, N models, and automated scoring."

## Writer Notes

- The Taste Test is the highlight of this part. It should feel like a discovery moment.
- Don't explain HCL exhaustively — cover enough for the reader to understand agent output and the Taste Test.
- The "with and without AGENT-INSTRUCTIONS.md" comparison is a key insight. Show both outputs.
- Existing stale MDX should be rewritten from scratch.
