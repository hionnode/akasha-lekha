# Part 40: ECR — Container Registry

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/40-ecr-container-registry.mdx`
> Estimated word count: 2,000-2,500

## Frontmatter

```yaml
---
title: "ECR: Your Private Container Registry"
description: "Set up Amazon ECR for private container storage. Lifecycle policies, vulnerability scanning, and Terraform-managed registry configuration."
excerpt: "Your private container registry. ECR with lifecycle policies and vulnerability scanning — because Docker Hub rate limits aren't a deployment strategy."
date: "2026-06-08"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "ecr", "docker", "terraform"]
series: "AWS From Zero to Production"
seriesPart: 40
featured: false
draft: true
---
```

## Section Outline

### 1. Why This Matters — Private registry vs Docker Hub
### 2. ECR Setup — Repository creation with Terraform
### 3. Image Lifecycle — Retention policies, cleanup untagged images
### 4. Vulnerability Scanning — ECR Basic/Enhanced scanning
### 5. Push/Pull Workflow — Docker login, push, pull commands

## The Fine Line

| | |
|---|---|
| ❌ Under | Using Docker Hub for production images (rate limits, public exposure) |
| ✅ Right | ECR with lifecycle policies, vulnerability scanning, Terraform-managed |
| ❌ Over | Multi-region replication, cross-account access, for a single-region app |
| 🤖 Agent Trap | Agent creates ECR repository without lifecycle policy — images accumulate, storage costs grow |

## Thread Progression

- All threads: No changes

## Key Takeaways

1. ECR eliminates Docker Hub rate limits and keeps your images private.
2. Lifecycle policies prevent image accumulation — agents never create them unprompted.
3. Enable vulnerability scanning — it's free for basic scans and catches known CVEs.
