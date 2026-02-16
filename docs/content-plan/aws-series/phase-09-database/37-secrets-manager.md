# Part 37: Secrets Manager

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/37-secrets-manager.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Secrets Manager: Credentials That Rotate Themselves"
description: "AWS Secrets Manager for database credentials with automatic rotation. Terraform-managed secrets, Lambda rotation functions, and application integration."
excerpt: "Credentials that rotate themselves. Secrets Manager with automatic rotation — because remembering to change passwords quarterly doesn't scale."
date: "2026-05-28"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "secrets-manager", "security", "terraform"]
series: "AWS From Zero to Production"
seriesPart: 37
featured: false
draft: true
---
```

## Section Outline

### 1. Why This Matters — Manual credential rotation doesn't happen
### 2. Storing Secrets — Terraform resource, versioning, encryption
### 3. Automatic Rotation — Lambda rotation function for RDS credentials
### 4. Application Integration — SDK-based secret retrieval, caching patterns
### 5. Connection to Part 12 — Secrets management strategy evolution

## The Fine Line

| | |
|---|---|
| ❌ Under | Hardcoded credentials, manual rotation, .env files in production |
| ✅ Right | Secrets Manager with automatic rotation for RDS, SDK retrieval in application |
| ❌ Over | HashiCorp Vault cluster for a single database |
| 🤖 Agent Trap | Agent stores secrets in Terraform state (plaintext) instead of using Secrets Manager |

## Thread Progression

- All threads: No changes

## Key Takeaways

1. Secrets Manager with automatic rotation means credentials change without human intervention.
2. Never store secrets in Terraform state — use Secrets Manager and reference by ARN.
3. Cache retrieved secrets in application memory — don't call Secrets Manager on every request.
