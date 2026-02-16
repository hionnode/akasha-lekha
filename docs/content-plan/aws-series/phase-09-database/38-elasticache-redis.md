# Part 38: ElastiCache Redis

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/38-elasticache-redis.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "ElastiCache Redis: Caching and Sessions"
description: "Deploy ElastiCache Redis for application caching and session storage. Terraform-managed, in private subnets, with proper connection patterns."
excerpt: "Caching and sessions with Redis. ElastiCache in private subnets — because round-trips to RDS for session data shouldn't be your bottleneck."
date: "2026-06-01"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "elasticache", "database", "terraform"]
series: "AWS From Zero to Production"
seriesPart: 38
featured: false
draft: true
---
```

## Section Outline

### 1. Why This Matters — Database round-trips for cacheable data
### 2. ElastiCache Setup — Instance type, subnet group, parameter group
### 3. Caching Patterns — Cache-aside, write-through, TTL strategy
### 4. Session Storage — Redis-backed sessions across instances
### 5. Connection Patterns — Connection pooling, retry with backoff

## The Fine Line

| | |
|---|---|
| ❌ Under | No caching layer, every request hits RDS |
| ✅ Right | ElastiCache Redis in private subnet for caching + sessions |
| ❌ Over | Redis Cluster with sharding for a startup-scale application |
| 🤖 Agent Trap | Agent provisions cache.r6g.large ($250+/mo) when cache.t3.micro ($12/mo) is fine for early traffic |

## Thread Progression

- All threads: No changes

## Key Takeaways

1. Redis eliminates database round-trips for cacheable data — sessions, frequently-read configs, rate limiting.
2. Start with cache.t3.micro. Agents over-provision Redis instances as aggressively as they over-provision RDS.
3. Set TTLs on everything — agents often set keys without expiration, leading to unbounded memory growth.
