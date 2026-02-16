# Phase 7: Backend on EC2 (Parts 28-33)

## Phase Goal

Deploy backend APIs on EC2 instances across three languages (Bun.js, Python FastAPI, Go), implement authentication with Clerk, and configure auto-scaling. First real SigNoz traces from application code.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| AGENT-INSTRUCTIONS.md | 53 lines (through API Design) | 53 lines (no additions) |
| Agent Scorecard | 14 panels | 14 panels (no additions) |
| Model Eval Framework | CI-integrated eval | No changes |
| MCP Integration | terraform-mcp in CI | No changes |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 28 | EC2 — Compute Fundamentals | EC2 instance with user data, AMI selection | None | 2,500-3,000 |
| 29 | Backend — Bun.js API + SigNoz | Bun API on EC2 with OpenTelemetry traces in SigNoz | None | 3,000-3,500 |
| 30 | Authentication with Clerk | Clerk integration for auth | None | 2,500-3,000 |
| 31 | Backend — Python FastAPI | FastAPI on EC2 with OTel | None | 2,500-3,000 |
| 32 | Backend — Go API | Go API on EC2 with OTel | None | 2,500-3,000 |
| 33 | Auto Scaling Groups | ASG with launch templates, scaling policies | None | 2,500-3,000 |

## Dependencies

- **Requires:** Phase 5 (VPC, security groups, ALB) and Phase 6 (API design, testing)
- **Unlocks:** Phase 8 (Load Testing), Phase 9 (Database)

## Writer Notes

- Part 29 is a milestone: first real application traces in SigNoz (deployed empty in Part 5).
- Parts 29, 31, 32 follow the same pattern across languages. Use consistent structure.
- Part 30 (Clerk auth) is framework-agnostic. Show integration for all three languages.
- This phase has no thread additions — it's pure application development using established patterns.
