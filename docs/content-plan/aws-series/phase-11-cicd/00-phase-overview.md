# Phase 11: CI/CD (Parts 45-47)

## Phase Goal

Build a complete CI/CD pipeline with GitHub Actions, OIDC authentication for AWS, and agent-guarded production deployment. Third Recalibration Checkpoint.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| AGENT-INSTRUCTIONS.md | 71 lines (through Docker) | 71 lines (no additions) |
| Agent Scorecard | 21 panels | 25 panels (+ Lead time, Rollback rate, Deploy frequency, Post-deploy error) |
| Model Eval Framework | Pipeline eval done | Recalibration Checkpoint 3 completed |
| MCP Integration | infra-verify-mcp (unified) | No changes |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 45 | GitHub Actions — Complete CI Pipeline | Full CI with test/lint/build/scan | None | 3,000-3,500 |
| 46 | GitHub Actions + OIDC | Secure AWS authentication without stored credentials | None | 2,500-3,000 |
| 47 | Production Deployment Pipeline + Recalibration 3 | Agent-guarded deploy with human approval gate | Scorecard panels 22-25; Recalibration 3 | 3,500-4,000 |

## Dependencies

- **Requires:** Phase 10 (containers on ECS), Phase 6 (testing in CI)
- **Unlocks:** Phase 12 (Serverless — deployment pipeline ready)

## Writer Notes

- Part 46 (OIDC) eliminates stored AWS credentials in GitHub — significant security improvement.
- Part 47 has a non-negotiable human approval gate for production deployment. Emphasize this.
- The agent-assisted deployment flow: agent creates PR → CI → verify loop → explain → staging → validation → HUMAN APPROVES → production → agent monitors 15 min.
