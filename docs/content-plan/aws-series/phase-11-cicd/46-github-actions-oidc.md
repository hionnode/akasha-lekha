# Part 46: GitHub Actions + OIDC

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/46-github-actions-oidc.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "GitHub Actions + OIDC: AWS Access Without Stored Credentials"
description: "Configure OIDC authentication between GitHub Actions and AWS. No more stored access keys — temporary credentials scoped to each workflow run."
excerpt: "AWS access without stored credentials. OIDC gives GitHub Actions temporary, scoped AWS credentials — because long-lived secrets in CI are a breach waiting to happen."
date: "2026-07-02"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "ci-cd", "security", "iam"]
series: "AWS From Zero to Production"
seriesPart: 46
featured: false
draft: true
---
```

## Section Outline
### 1. Why This Matters — Long-lived credentials in CI are a top breach vector
### 2. OIDC Concept — Trust relationship between GitHub and AWS
### 3. AWS IAM Role Setup — OIDC provider, role with conditions
### 4. GitHub Actions Configuration — aws-actions/configure-aws-credentials
### 5. Scoped Permissions — Different roles for preview vs production

## The Fine Line
| | |
|---|---|
| ❌ Under | Stored AWS access keys in GitHub Secrets |
| ✅ Right | OIDC with scoped IAM roles, different roles per environment |
| ❌ Over | Custom STS assume-role chains, per-job roles |
| 🤖 Agent Trap | Agent uses stored credentials pattern because it's more common in training data than OIDC |

## Thread Progression
- All threads: No changes

## Key Takeaways
1. OIDC eliminates stored AWS credentials in CI — temporary, scoped, automatically rotated.
2. Scope IAM roles per environment: preview gets limited deploy, production gets tightly scoped.
3. Agents generate the stored-credentials pattern by default — OIDC is newer and less represented in training data.

## Lead Magnet
- **Name:** GitHub Actions + OIDC Templates
- **Format:** YAML + Terraform
- **Contents:** OIDC provider Terraform, IAM role templates, workflow configuration, multi-environment setup.
