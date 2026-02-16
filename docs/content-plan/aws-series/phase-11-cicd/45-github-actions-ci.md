# Part 45: GitHub Actions — Complete CI Pipeline

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/45-github-actions-ci.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "GitHub Actions CI: The Pipeline That Guards Your Main Branch"
description: "Complete CI pipeline with GitHub Actions. Test, lint, build, scan, and deploy preview — every PR verified before merge."
excerpt: "The pipeline that guards your main branch. GitHub Actions CI with every quality gate — tests, linting, builds, security scans, preview deploys."
date: "2026-06-28"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "ci-cd"]
series: "AWS From Zero to Production"
seriesPart: 45
featured: false
draft: true
---
```

## Section Outline
### 1. Why This Matters — Automated quality gates
### 2. Workflow Structure — Jobs, steps, dependencies, matrix strategy
### 3. Test Job — Unit, integration, E2E tests
### 4. Lint Job — Code quality, Terraform validation
### 5. Build Job — Docker builds, artifact caching
### 6. Security Scan Job — Trivy, gitleaks, checkov
### 7. Preview Deploy Job — Trigger preview environment from Part 19/43

## The Fine Line
| | |
|---|---|
| ❌ Under | No CI, manual testing, merge without checks |
| ✅ Right | Full CI with test/lint/build/scan/preview, matrix for multi-language |
| ❌ Over | 30-minute CI pipeline blocking every PR |
| 🤖 Agent Trap | Agent generates CI that runs all steps sequentially instead of parallelizing independent jobs |

## Thread Progression
- All threads: No changes

## Key Takeaways
1. Parallelize independent CI jobs — test, lint, and scan don't need to wait for each other.
2. Cache Docker layers and dependencies — CI speed determines developer velocity.
3. Every PR gets automated quality gates regardless of author (human or agent).
