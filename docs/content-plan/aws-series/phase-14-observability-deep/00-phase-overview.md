# Phase 14: Observability Deep Dive (Parts 58-59B)

## Phase Goal

Deep dive into event-driven patterns, production debugging with dual observability surfaces, and the debugging decision tree for when agents help vs hurt. Introduction of the observability MCP server.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| AGENT-INSTRUCTIONS.md | 83 lines | 83 lines (no additions) |
| Agent Scorecard | 25 panels | 26 panels (+ Incident correlation with agent deploys) |
| Model Eval Framework | Recalibration 3 done | No changes |
| MCP Integration | infra-verify-mcp | + observability-mcp (query-traces, deployment-history, correlate-error) |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 58 | Event-Driven Patterns | Idempotency, correlation IDs, saga pattern | None | 3,000-3,500 |
| 59 | Debugging Production Issues + Observability MCP | Agent-assisted triage with SigNoz + Grafana, observability MCP | Scorecard panel 26; observability-mcp | 3,500-4,000 |
| 59B | The Debugging Decision Tree | When agents help vs hurt in debugging | None | 3,000-3,500 |

## Dependencies

- **Requires:** Phase 13 (event-driven services running), all observability from Phase 1/7
- **Unlocks:** Phase 15 (Dashboards — advanced OTel and SigNoz)

## Writer Notes

- Part 58 is about distributed system patterns, not new AWS services.
- Part 59 introduces the observability MCP server — agents can query traces and correlate errors.
- Part 59B is the debugging philosophy part. The worked example (subtle memory leak) is key.
- Part 63 (Incident Response) builds on 59/59B — forward-reference it.
