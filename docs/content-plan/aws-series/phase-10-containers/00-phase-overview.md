# Phase 10: Containers (Parts 39-44)

## Phase Goal

Containerize applications with production Docker patterns, push to ECR, deploy on ECS Fargate, and build the full multi-agent pipeline with unified MCP verification. Part 43 is a KEY part.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| AGENT-INSTRUCTIONS.md | 64 lines | 71 lines (+ Docker rules) |
| Agent Scorecard | 17 panels | 21 panels (+ Pipeline time, iterations-to-clean, conflict rate, model combos) |
| Model Eval Framework | Recalibration 2 done | Pipeline eval (model combinations) |
| MCP Integration | terraform-mcp in CI | infra-verify-mcp (unified plan+validate+checkov+infracost+compliance) |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 39 | Docker — Production Dockerfiles | Multi-stage builds, security scanning | Docker rules in AGENT-INSTRUCTIONS.md | 2,500-3,000 |
| 40 | ECR — Container Registry | Private registry, image lifecycle | None | 2,000-2,500 |
| 41 | ECS Fargate — Bun.js | Fargate task definitions, service deployment | None | 3,000-3,500 |
| 42 | ECS Fargate — Python + Go | Multi-language Fargate deployment | None | 2,500-3,000 |
| 43 | Full-Stack Preview + Multi-Agent Pipeline + Unified MCP | Full DGVE pipeline, parallel generation, unified verify MCP, pipeline eval | Scorecard panels 18-21; Pipeline eval; infra-verify-mcp | 4,500-6,000 |
| 44 | K6 Load Testing — Containers | K6 against containerized services | None | 2,500-3,000 |

## Dependencies

- **Requires:** Phase 7 (backends), Phase 9 (databases)
- **Unlocks:** Phase 11 (CI/CD — containers ready for deployment pipeline)

## Writer Notes

- Part 39 (Docker) has some of the most common agent mistakes: single-stage, :latest, root user.
- Part 43 is a KEY part — the culmination of the pipeline journey. Full multi-agent, parallel generation, unified MCP.
- The pipeline eval discovery in Part 43 is important: "cheaper generator + strong verifier can win."
