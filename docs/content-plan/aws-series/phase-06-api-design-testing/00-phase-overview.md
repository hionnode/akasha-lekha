# Phase 6: API Design & Testing (Parts 23-27)

## Phase Goal

Design REST APIs with consistent error handling, implement request validation with OpenAPI, build comprehensive testing (mocking, E2E, CI), and integrate agents into the CI pipeline with model evaluation and MCP.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| AGENT-INSTRUCTIONS.md | 48 lines (through Networking) | 53 lines (+ API Design rules) |
| Agent Scorecard | 11 panels | 14 panels (+ CI pass rate, Agent triage accuracy, Model eval trend) |
| Model Eval Framework | Expanded eval | CI-integrated monthly eval with regression detection |
| MCP Integration | terraform-mcp built | terraform-mcp running in CI |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 23 | API Design — REST Best Practices | API contracts, error format, pagination | API Design in AGENT-INSTRUCTIONS.md | 2,500-3,000 |
| 24 | Request Validation & OpenAPI | OpenAPI spec as source of truth, Zod/Pydantic validation | None | 2,500-3,000 |
| 25 | Mocking External Services | MSW, responses/httpx-mock, testify/gomock | None | 2,500-3,000 |
| 26 | E2E Testing with Playwright | Cross-browser testing, CI-ready test suites | None | 2,500-3,000 |
| 27 | Testing in CI + Agent-in-CI + MCP in CI | Agent triage, monthly model eval, MCP in GitHub Actions | Scorecard panels 12-14; CI-integrated eval; MCP in CI | 3,500-4,000 |

## Dependencies

- **Requires:** Phase 5 complete (VPC, security groups, ALB)
- **Unlocks:** Phase 7 (Backend on EC2 — APIs designed, tests ready)

## Writer Notes

- Part 23 is a design phase — agents assist but humans decide API contracts. Emphasize this distinction.
- Parts 24-26 are testing-focused. Use PanelSwitcher for language-specific testing tools.
- Part 27 brings agents into CI for the first time — significant milestone.
- MCP in CI means terraform-mcp tools replace raw CLI commands in GitHub Actions workflows.
