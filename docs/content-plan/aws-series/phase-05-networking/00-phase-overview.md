# Phase 5: Networking (Parts 20-22)

## Phase Goal

Build the VPC networking foundation for backend deployment. Subnets, security groups, and application load balancer — the networking layer that everything from Phase 7 onward depends on.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| AGENT-INSTRUCTIONS.md | 43 lines | 48 lines (+ Networking rules) |
| Agent Scorecard | 11 panels | 11 panels (no additions) |
| Model Eval Framework | Expanded eval + Recalibration 1 done | No changes |
| MCP Integration | terraform-mcp built | No changes |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 20 | VPC — Networking Fundamentals | Production VPC with public/private subnets | Networking rules in AGENT-INSTRUCTIONS.md | 3,000-3,500 |
| 21 | Security Groups — Stateful Firewalls | Layered security group architecture | None | 2,500-3,000 |
| 22 | ALB — Application Load Balancer | ALB with HTTPS, health checks, target groups | None | 2,500-3,000 |

## Dependencies

- **Requires:** Phase 4 complete (S3/CloudFront deployed, pipeline scripted)
- **Unlocks:** Phase 7 (Backend on EC2 — needs VPC, security groups, ALB)

## Writer Notes

- Networking is dry but critical. The agent traps are where the excitement lives — agents make dangerous networking mistakes.
- Part 20 has the most impactful Agent Trap in the series: databases in public subnets + missing VPC endpoints ($100+/mo in wasted NAT costs).
- The VPC architecture established here is referenced by every subsequent phase. Get it right.
- Use ASCII diagrams extensively — networking is visual.
