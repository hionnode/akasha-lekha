# Phase 12: Serverless (Parts 48-53)

## Phase Goal

Deploy serverless functions with Lambda and API Gateway across three languages. Understand serverless patterns, cold starts, and cost optimization.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| AGENT-INSTRUCTIONS.md | 71 lines | 77 lines (+ Lambda rules) |
| Agent Scorecard | 25 panels | 25 panels (no additions) |
| Model Eval Framework | Recalibration 3 done | No changes |
| MCP Integration | infra-verify-mcp | No changes |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 48 | Lambda Fundamentals | Lambda concepts, execution model, pricing | Lambda rules in AGENT-INSTRUCTIONS.md | 2,500-3,000 |
| 49 | Lambda — Bun Runtime | Bun.js Lambda functions with OTel | None | 2,500-3,000 |
| 50 | API Gateway | REST and HTTP API Gateway configuration | None | 3,000-3,500 |
| 51 | API Gateway — Python + Go | Multi-language API Gateway backends | None | 2,500-3,000 |
| 52 | Serverless Patterns | Common patterns: fan-out, step functions, DLQ | None | 2,500-3,000 |
| 53 | K6 Load Testing — Serverless | Load testing Lambda with cold start analysis | None | 2,500-3,000 |

## Dependencies

- **Requires:** Phase 11 (CI/CD pipeline), Phase 5 (VPC for VPC-connected Lambdas)
- **Unlocks:** Phase 13 (Event-Driven — Lambda as event consumers)

## Writer Notes

- Lambda is the most common agent over-provisioning target: 512MB default when 128MB works.
- Cold starts are the key Lambda topic. Measure, don't guess.
- API Gateway has two flavors (REST vs HTTP). HTTP API is cheaper and simpler for most use cases.
