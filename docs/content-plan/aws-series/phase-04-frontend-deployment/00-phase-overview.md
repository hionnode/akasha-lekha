# Phase 4: Frontend Deployment (Parts 13-19)

## Phase Goal

Deploy static frontends to AWS using S3, Route53, ACM, and CloudFront. Cover user uploads, multiple frontend frameworks, and culminate in Part 19 — the first scripted Generate → Verify → Explain pipeline, the first custom MCP server, and the first Recalibration Checkpoint.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| AGENT-INSTRUCTIONS.md | 43 lines (through Agent Execution Security) | 43 lines (no additions this phase) |
| Agent Scorecard | 7 panels | 11 panels (+ Plan diff, Infracost, Cost trend, Verification Overhead) |
| Model Eval Framework | eval-models.sh running | Expanded eval + Recalibration Checkpoint 1 completed |
| MCP Integration | Concept introduced | terraform-mcp server built (Part 19) |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 13 | S3 — Static Hosting | S3 bucket for static site hosting | None | 2,500-3,000 |
| 14 | Route53 + ACM — DNS & SSL | Custom domain with HTTPS | None | 2,500-3,000 |
| 15 | CloudFront — CDN | CDN distribution with S3 origin | None | 2,500-3,000 |
| 16 | User Uploads to S3 | Presigned URLs, upload patterns | None | 2,500-3,000 |
| 17 | Frontend — React + Astro | OTel browser SDK, Web Vitals in SigNoz | None | 2,500-3,000 |
| 18 | Frontend — SvelteKit + SolidStart | Alternative framework deployments | None | 2,500-3,000 |
| 19 | Preview Environments + First Pipeline + MCP | Scripted DGVE pipeline, terraform-mcp, Recalibration 1 | Scorecard panels 8-11; Expanded eval; terraform-mcp | 4,500-6,000 |

## Dependencies

- **Requires:** Phase 3 complete (Docker Compose, secrets management)
- **Unlocks:** Phase 5 (Networking — VPC for backend deployment)

## Writer Notes

- Parts 13-16 follow a natural progression: S3 → DNS → CDN → Uploads. Each builds on the previous.
- Parts 17-18 are framework-specific. Use PanelSwitcher for framework variations where possible.
- Part 19 is a KEY part — the culmination of the frontend phase and the introduction of three major systems (scripted pipeline, MCP, recalibration).
- The DGVE pipeline sections in Parts 13-18 are manual (Design → prompt agent → review → fix → apply). Part 19 scripts it.
