# Phase 8: Load Testing & Human Judgment (Part 34)

## Phase Goal

Establish performance baselines with K6 load testing and introduce the Agent Delegation Matrix — a systematic framework for when agents help vs when human judgment is required. Second Recalibration Checkpoint.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| AGENT-INSTRUCTIONS.md | 53 lines | 64 lines (+ Performance + Human Judgment Boundaries) |
| Agent Scorecard | 14 panels | 17 panels (+ p95 latency, cost-per-request, load test history) |
| Model Eval Framework | CI-integrated eval | Recalibration Checkpoint 2 completed |
| MCP Integration | terraform-mcp in CI | No changes |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 34 | K6 Load Testing — Human Judgment Required | Performance baselines, Agent Delegation Matrix, Recalibration 2 | Performance + Human Judgment in AGENT-INSTRUCTIONS.md; Scorecard panels 15-17 | 4,000-5,000 |

## Dependencies

- **Requires:** Phase 7 complete (backend APIs running on EC2)
- **Unlocks:** Phase 9 (Database — needs performance baselines before adding database layer)

## Writer Notes

- This is a KEY part. Single-part phase with three major deliverables.
- The Agent Delegation Matrix is one of the series' most important conceptual contributions.
- Human Judgment Boundaries in AGENT-INSTRUCTIONS.md is the most philosophical addition — agents can calculate but not decide.
- Performance thresholds are SET BY HUMANS. This is non-negotiable and should be emphatic.
