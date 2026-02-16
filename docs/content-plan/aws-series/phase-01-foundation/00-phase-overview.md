# Phase 1: Foundation (Parts 1-5)

## Phase Goal

Establish a secure AWS account, configure local development tooling with AI coding agents, introduce Infrastructure as Code with Terraform, and deploy dual observability surfaces (SigNoz + Grafana). The reader ends this phase with a production-ready account foundation, agent-assisted workflow habits, and empty dashboards ready to receive data.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| AGENT-INSTRUCTIONS.md | 0 lines | 15 lines (Header + IAM Rules + Terraform Conventions) |
| Agent Scorecard | Not deployed | Empty shell deployed (Grafana + Loki + Prometheus running) |
| Model Eval Framework | None | Guided Taste Test completed (Part 4) |
| MCP Integration | None | None |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 1 | Your First 60 Minutes in AWS | Secured AWS account (MFA, CloudTrail, billing alerts) | AGENT-INSTRUCTIONS.md created (header only) | 2,500-3,000 |
| 2 | IAM — The Key to Everything | IAM users, groups, roles, agent-scoped role | IAM Rules added to AGENT-INSTRUCTIONS.md | 2,500-3,000 |
| 3 | Your Local Setup — CLI, Agents, and Working Like a Professional | AWS CLI, 2-3 coding agents installed, first agent task | None (agent setup, no instructions yet) | 3,000-3,500 |
| 4 | Terraform Fundamentals — With Agent-Assisted IaC | Terraform project with S3 backend, first Taste Test | Terraform Conventions added; Guided Taste Test | 3,000-3,500 |
| 5 | SigNoz + Grafana Setup — Dual Observability | Both observability stacks running, empty Scorecard | Empty Scorecard dashboard deployed | 1,500-2,000 |

## Dependencies

- **Requires:** AWS account creation (reader does this before Part 1)
- **Unlocks:** Phase 2 (Developer Workflow) — agents configured, Terraform ready, dashboards waiting for data

## Writer Notes

- Parts 1-5 already exist as stale MDX files in `apps/web/src/content/blog/aws-for-startups/`. They should be rewritten from scratch to match the new curriculum direction.
- This phase establishes the voice and sets expectations. The opening of Part 1 is the first impression of the entire series.
- Keep Part 5 short — it's deliberately a "deploy and verify" part, not a deep dive.
- The Terraform Taste Test in Part 4 is the reader's first hands-on comparison of AI models. Make it feel exciting, not academic.
- Agent adoption is model-agnostic from day one. Never recommend specific models — the reader discovers strengths through evaluation.
