# Part 39: Docker — Production Dockerfiles

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/39-docker-production.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Docker for Production: Dockerfiles That Aren't Security Liabilities"
description: "Write production Dockerfiles with multi-stage builds, non-root users, and security scanning. The agent mistakes that turn containers into vulnerabilities."
excerpt: "Dockerfiles that aren't security liabilities. Multi-stage builds, non-root users, pinned versions — because agents generate every Docker anti-pattern."
date: "2026-06-04"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "docker", "security"]
series: "AWS From Zero to Production"
seriesPart: 39
featured: false
draft: true
---
```

## Section Outline

### 1. Why This Matters — Development Dockerfiles ≠ production Dockerfiles
### 2. Multi-Stage Builds — Build stage vs runtime stage, image size reduction
### 3. Security — Non-root USER directive, .dockerignore, no secrets in layers
### 4. Version Pinning — Specific image tags, never :latest
### 5. Health Checks — HEALTHCHECK directive in Dockerfile
### 6. Trivy Scanning — Container vulnerability scanning
### 7. AGENT-INSTRUCTIONS.md Addition — Docker rules (7 lines)

## The Fine Line

| | |
|---|---|
| ❌ Under | Single-stage Dockerfile, root user, :latest tags, no .dockerignore |
| ✅ Right | Multi-stage build, non-root user, pinned versions, .dockerignore, health checks, Trivy scan |
| ❌ Over | Distroless images, custom base images, for early-stage development |
| 🤖 Agent Trap | Agent generates single-stage Dockerfile with root user, :latest base, no .dockerignore — every Docker anti-pattern in one file |

## Thread Progression

- **AGENT-INSTRUCTIONS.md:** Docker section added (7 lines). Cumulative: 71 lines.
- **Scorecard:** No new panels
- **Eval:** No changes
- **MCP:** No changes

## Key Takeaways

1. Agent-generated Dockerfiles contain every anti-pattern: single-stage, root user, :latest tags, no .dockerignore.
2. Multi-stage builds reduce image size by 10x+ — build dependencies don't ship to production.
3. Non-root USER directive is a one-line security improvement that agents never include.

## Lead Magnet

- **Name:** Dockerfile Templates
- **Format:** Dockerfiles + .dockerignore
- **Contents:** Production Dockerfiles for Bun, Python, Go with multi-stage builds, non-root user, health checks.
