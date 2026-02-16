# Part 11: Database Migrations

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/11-database-migrations.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Database Migrations: Schema Changes Without the 3 AM Panic"
description: "Set up database migrations with Prisma, Alembic, and golang-migrate. Learn what agents miss: down migrations, data backfill, and zero-downtime patterns."
excerpt: "Schema changes without the 3 AM panic. Migrations with Prisma, Alembic, and golang-migrate — and the critical patterns agents always miss."
date: "2026-02-16"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "database"]
series: "AWS From Zero to Production"
seriesPart: 11
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

Scenario: You need to add a `role` column to your users table. Your agent generates `ALTER TABLE users ADD COLUMN role VARCHAR(50)`. Deployed. Works in staging. In production, the table has 2 million rows and the ALTER locks the table for 45 seconds. Your API returns 500s. Users see errors. The agent didn't know about zero-downtime migrations.

Time promise: 45 minutes.
Outcome promise: Migration workflows in your language of choice, with the patterns agents consistently miss — down migrations, data backfill, and zero-downtime strategies.

## Section Outline

### 1. Why This Matters
- Schema changes are the most dangerous routine operation
- Agents generate migrations that work in dev and break in production

### 2. Migration Tools by Language
- Prisma (Bun/TypeScript), Alembic (Python), golang-migrate (Go)
- Components: PanelSwitcher with Panel for each language
- Setup, first migration, workflow

### 3. What Agents Miss: Down Migrations
- Every up migration needs a corresponding down
- Agents almost never generate down migrations
- Components: DiffViewer showing agent output (no down) vs corrected (with down)

### 4. What Agents Miss: Data Backfill
- Adding NOT NULL column to existing data
- Agent generates column + constraint but no backfill step
- Pattern: add nullable → backfill → add constraint

### 5. What Agents Miss: Zero-Downtime Patterns
- Table locks on large tables
- Expand-contract pattern
- Blue-green for schema changes

### 6. Migration in Docker Compose
- Running migrations on container startup
- Wait-for-it patterns

## The Fine Line

| | |
|---|---|
| ❌ Under | Manual SQL scripts, no migration history, no rollback capability |
| ✅ Right | Migration tool per language, down migrations, data backfill awareness, tested in Docker |
| ❌ Over | Custom migration framework, automated rollback on every failure |
| 🤖 Agent Trap | Agent generates ALTER TABLE without considering table size, locking, or zero-downtime |

## Thread Progression

- **AGENT-INSTRUCTIONS.md:** No additions
- **Scorecard:** No new panels
- **Eval:** No changes
- **MCP:** No changes

## Validation Checklist Items

- **Migrations:** Migration tool configured for primary language; First migration created and applied; Down migration tested (rollback works); Migrations run in Docker Compose on startup
- **Patterns:** Zero-downtime migration pattern documented; Data backfill pattern documented

## Key Takeaways

1. Every up migration needs a down migration — agents almost never generate these.
2. Migrations that work on an empty dev database can lock production tables with millions of rows — always consider table size.
3. The expand-contract pattern (add nullable → backfill → add constraint) is the safe path for schema changes on live data.
