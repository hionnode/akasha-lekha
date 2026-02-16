# Phase 13: Event-Driven (Parts 54-57)

## Phase Goal

Build event-driven architectures with SQS, SNS, EventBridge, WebSockets, and SES. Establish patterns for asynchronous processing, message routing, and real-time communication.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| AGENT-INSTRUCTIONS.md | 77 lines (through Lambda) | 83 lines (+ Event-Driven Architecture rules) |
| Agent Scorecard | 25 panels | 25 panels (no additions) |
| Model Eval Framework | Recalibration 3 done | No changes |
| MCP Integration | infra-verify-mcp | No changes |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 54 | SQS — Message Queues | SQS queues with DLQ, consumer patterns | Event-Driven rules in AGENT-INSTRUCTIONS.md | 3,000-3,500 |
| 55 | SNS + EventBridge | Pub/sub and event routing | None | 2,500-3,000 |
| 56 | WebSockets | Real-time communication with API Gateway WebSocket | None | 2,500-3,000 |
| 57 | SES — Email | Transactional email with SES | None | 2,000-2,500 |

## Dependencies

- **Requires:** Phase 12 (Lambda + API Gateway)
- **Unlocks:** Phase 14 (Observability Deep Dive — event-driven patterns need tracing)

## Writer Notes

- SQS is the most critical part: DLQ, idempotency, visibility timeout are all common agent mistakes.
- Event-driven architecture rules in AGENT-INSTRUCTIONS.md are among the most important for production safety.
- Trace context propagation across async boundaries is essential — connect to SigNoz traces from Part 29.
