# Part 10: Docker Compose — Local Development Environment

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/10-docker-compose-local.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Docker Compose: Because Localhost Isn't Production"
description: "Build a complete local development environment with Docker Compose. Agent-generated configs with health checks, volume mounts, and networking that mirrors production."
excerpt: "Because localhost isn't production. Build a complete local dev stack with Docker Compose — agent-generated, human-reviewed, production-mirroring."
date: "2026-02-12"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "docker"]
series: "AWS From Zero to Production"
seriesPart: 10
featured: false
draft: true
---
```

## Component Imports

```mdx
import Command from '../../../components/shared/Command.astro';
import CommandSequence from '../../../components/shared/CommandSequence.astro';
import TerminalOutput from '../../../components/shared/TerminalOutput.astro';
import Alert from '../../../components/shared/Alert.astro';
import ValidationChecklist from '../../../components/shared/ValidationChecklist.astro';
import FileTree from '../../../components/shared/FileTree.astro';
```

## Opening Hook

Scenario: "It works on my machine." The most expensive sentence in software. Your API connects to localhost PostgreSQL. Your teammate's connects to a Docker container. Production uses RDS. Three environments, three behaviors, three sets of bugs.

Time promise: 45 minutes.
Outcome promise: Docker Compose stack mirroring production — PostgreSQL, Redis, your API — with health checks that prevent the "service started but not ready" race condition.

## Section Outline

### 1. Why This Matters
- Local ≠ production without containerization
- Docker Compose as the local equivalent of your AWS infrastructure

### 2. Agent Generates docker-compose.yml
- Prompt: "Generate a docker-compose for local dev with PostgreSQL, Redis, and a Node.js API"
- Show agent output unedited
- Review: what it got right, what it missed

### 3. Health Checks
- Why they matter (race conditions on startup)
- PostgreSQL health check, Redis health check
- depends_on with condition: service_healthy

### 4. Volume Mounts
- Database persistence across restarts
- Code hot-reloading with bind mounts

### 5. Networking
- Internal network mirroring VPC concepts from Part 20
- Service discovery via container names

### 6. Environment Variables
- .env file for local overrides
- Composing with production-like variable names

## The Fine Line

| | |
|---|---|
| ❌ Under | No containers, raw localhost services, "it works on my machine" |
| ✅ Right | Docker Compose with health checks, volumes, networking, mirroring production |
| ❌ Over | Kubernetes locally (minikube/kind) for a 3-service stack |
| 🤖 Agent Trap | Agent forgets health checks on database services — API starts before PostgreSQL is ready |

## Thread Progression

- **AGENT-INSTRUCTIONS.md:** No additions
- **Scorecard:** No new panels
- **Eval:** No changes
- **MCP:** No changes

## Validation Checklist Items

- **Docker Compose:** All services start with `docker compose up`; Health checks passing for PostgreSQL and Redis; API waits for healthy dependencies; Volumes persist data across restarts
- **Development:** Hot-reload working for application code; Services accessible from host machine; `.env` file configured with local overrides

## Key Takeaways

1. Docker Compose bridges the gap between "works on my machine" and production — every service runs the same way everywhere.
2. Health checks are the single most important thing agents forget in docker-compose files — always verify `depends_on` conditions.
3. Your local Docker Compose stack should mirror your AWS architecture: same services, same networking concepts, same environment variables.

## Lead Magnet

- **Name:** Docker Compose Development Templates
- **Format:** docker-compose files
- **Contents:** Templates for PostgreSQL+Redis+API stacks in Bun, Python, Go. All include health checks, volumes, and production-like networking.
