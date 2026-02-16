# Part 35: RDS PostgreSQL

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/35-rds-postgres.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "RDS PostgreSQL: Managed Database Done Right"
description: "Deploy RDS PostgreSQL with Terraform. Instance sizing, parameter groups, backups, and the agent mistakes that double your database bill."
excerpt: "Managed database done right. RDS PostgreSQL with proper sizing, backups, and security — and the agent mistakes that double your bill."
date: "2026-05-20"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "rds", "database", "terraform"]
series: "AWS From Zero to Production"
seriesPart: 35
featured: false
draft: true
---
```

## Section Outline

### 1. Why This Matters — Managed vs self-managed databases
### 2. Instance Sizing — db.t3.micro for dev, db.t3.small for prod start, right-sizing methodology
### 3. Parameter Groups — PostgreSQL tuning basics, connection limits
### 4. Subnet Groups — Private subnets only (per Part 20)
### 5. Security — Encryption at rest, SSL connections, security group from Part 21
### 6. Backup Configuration — Automated backups, retention period, snapshot strategy

## The Fine Line

| | |
|---|---|
| ❌ Under | PostgreSQL on EC2 (unmanaged), no backups, public subnet |
| ✅ Right | RDS in private subnet, appropriate sizing, automated backups, encryption |
| ❌ Over | Multi-AZ in dev ($200+/mo extra), provisioned IOPS, read replicas, for pre-launch |
| 🤖 Agent Trap | Agent enables Multi-AZ in all environments (doubles cost in dev/staging) and over-provisions instance size |

## Thread Progression

- All threads: No changes

## Key Takeaways

1. RDS manages what you don't want to: patching, backups, failover. Pay for the service, not the ops burden.
2. Start with db.t3.micro in dev, db.t3.small in production. Agents always over-provision by 2-4x.
3. Multi-AZ is for production high availability. In dev and staging, it doubles cost for zero benefit.

## Lead Magnet

- **Name:** RDS Sizing Guide
- **Format:** PDF
- **Contents:** Instance comparison, cost calculator, parameter group templates, backup strategy guide.
