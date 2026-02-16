# Phase 3: Local Development (Parts 10-12)

## Phase Goal

Build a complete local development environment with Docker Compose, database migrations, and secure secrets management. Introduce agent execution security — sandboxing levels, credential scoping, and audit logging. The reader exits this phase with a reproducible local stack and clear boundaries for agent access.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| AGENT-INSTRUCTIONS.md | 32 lines (through Context Management) | 43 lines (+ Secrets & Credentials + Agent Execution Security) |
| Agent Scorecard | 7 panels | 7 panels (no additions this phase) |
| Model Eval Framework | eval-models.sh running | No changes |
| MCP Integration | Concept introduced | No changes |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 10 | Docker Compose — Local Development Environment | Full local dev stack with health checks | None | 2,500-3,000 |
| 11 | Database Migrations | Migration workflows for Prisma, Alembic, golang-migrate | None | 2,500-3,000 |
| 12 | Environment Variables, Secrets & Agent Execution Security | Secrets management + agent sandboxing levels | Secrets & Credentials + Agent Execution Security in AGENT-INSTRUCTIONS.md | 3,000-3,500 |

## Dependencies

- **Requires:** Phase 2 complete (pre-commit hooks, eval framework, agent context)
- **Unlocks:** Phase 4 (Frontend Deployment — docker-compose for local testing)

## Writer Notes

- Part 10 is the first time agents generate docker-compose. Classic agent trap: missing health checks on database services.
- Part 11 covers three languages (Prisma/Bun, Alembic/Python, golang-migrate/Go). Use PanelSwitcher or code-switcher for language variations.
- Part 12 is the security-heavy part. Agent execution security (sandboxing levels) is unique to this series — spend time on it.
- No Scorecard additions this phase. The next Scorecard growth is Part 19.
