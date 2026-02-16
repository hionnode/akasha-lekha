# Phase 2: Developer Workflow (Parts 6-9)

## Phase Goal

Establish professional development workflows that work for both humans and AI agents. Git conventions, branch protection, automated code quality gates via pre-commit hooks, and the series' most important part (Part 9) — agent context management, prompt engineering, and the model evaluation framework.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| AGENT-INSTRUCTIONS.md | 15 lines (Header + IAM + Terraform) | 32 lines (+ Git Conventions + Code Quality + Context Management) |
| Agent Scorecard | Empty shell (Grafana running) | 7 panels (Pre-commit + Model performance + Prompt sensitivity) |
| Model Eval Framework | Guided Taste Test done | eval-models.sh running, 11 prompts, prompt sensitivity metric |
| MCP Integration | None | Concept introduced (Part 9) |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 6 | Git & GitHub — Professional Workflow With Agents | Git conventions, agent commit hygiene, agent attribution | Git Conventions in AGENT-INSTRUCTIONS.md | 2,500-3,000 |
| 7 | Branch Protection & PR Workflow | Branch protection, PR templates with agent-review sections | None | 2,500-3,000 |
| 8 | Pre-Commit Hooks & Code Quality | Automated verification, first Scorecard data | Code Quality in AGENT-INSTRUCTIONS.md; Scorecard panels 1-2 | 3,000-3,500 |
| 9 | Monorepo, Agent Context, Prompts & Evals | eval-models.sh, prompt engineering, context mgmt, MCP concept | Context Mgmt in AGENT-INSTRUCTIONS.md; Scorecard panels 3-7; eval framework; MCP concept | 4,500-6,000 |

## Dependencies

- **Requires:** Phase 1 complete (agents configured, Terraform basics, Grafana running)
- **Unlocks:** Phase 3 (Local Development), Phase 4 (Frontend — uses pre-commit and pipeline concepts)

## Writer Notes

- Part 9 is the KEY part of Phase 2 and arguably the most important in the entire series. It has six major deliverables. Budget extra time.
- Parts 6-8 build toward Part 9. Each adds a piece: git workflow → quality gates → full agent context and evaluation.
- The pre-commit hooks in Part 8 are "Agent 2 in automated form" — make this connection explicit.
- Part 9 introduces MCP as a concept only. No server built yet (that's Part 19).
