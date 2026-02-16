# Phase 9: Database (Parts 35-38)

## Phase Goal

Deploy managed database services: RDS PostgreSQL for relational data, Secrets Manager for credential rotation, and ElastiCache Redis for caching. Establish database operations patterns.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| AGENT-INSTRUCTIONS.md | 64 lines (through Human Judgment) | 64 lines (no additions) |
| Agent Scorecard | 17 panels | 17 panels (no additions) |
| Model Eval Framework | Recalibration 2 done | No changes |
| MCP Integration | terraform-mcp in CI | No changes |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 35 | RDS PostgreSQL | Managed PostgreSQL with proper sizing | None | 3,000-3,500 |
| 36 | Database Operations | Backups, monitoring, maintenance windows | None | 2,500-3,000 |
| 37 | Secrets Manager | Automated credential rotation | None | 2,500-3,000 |
| 38 | ElastiCache Redis | Redis for caching and sessions | None | 2,500-3,000 |

## Dependencies

- **Requires:** Phase 7 (backends running), Phase 5 (VPC with private subnets)
- **Unlocks:** Phase 10 (Containers — database connectivity from ECS)

## Writer Notes

- RDS is the most expensive agent mistake territory: oversized instances, Multi-AZ in dev, no deletion protection.
- Secrets Manager integrates with the secrets patterns from Part 12.
- All databases deploy to private subnets (per Part 20 networking rules).
