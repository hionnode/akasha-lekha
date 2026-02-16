# Part 19: Preview Environments — First Scripted Pipeline + terraform-mcp + Recalibration Checkpoint 1

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/19-preview-environments.mdx`
> Estimated word count: 4,500-6,000

## Frontmatter

```yaml
---
title: "Preview Environments: Your First Real Pipeline"
description: "Build preview environments with S3 per PR and your first scripted Generate → Verify → Explain pipeline. Plus: terraform-mcp server and Recalibration Checkpoint 1."
excerpt: "Your first real Generate → Verify → Explain pipeline, your first MCP server, and your first trust recalibration. The manual verification from Parts 13-18 gets automated."
date: "2026-03-20"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "terraform", "ai-agents", "mcp", "model-eval"]
series: "AWS From Zero to Production"
seriesPart: 19
featured: true
draft: true
---
```

## Component Imports

```mdx
import GuideStep from '../../../components/shared/GuideStep.astro';
import Command from '../../../components/shared/Command.astro';
import CommandSequence from '../../../components/shared/CommandSequence.astro';
import TerminalOutput from '../../../components/shared/TerminalOutput.astro';
import Alert from '../../../components/shared/Alert.astro';
import ValidationChecklist from '../../../components/shared/ValidationChecklist.astro';
import FileTree from '../../../components/shared/FileTree.astro';
import ResourceStatus from '../../../components/shared/ResourceStatus.astro';
```

## Opening Hook

Scenario: For the last 6 parts, you've been verifying agent output manually. Run terraform validate. Run tflint. Run checkov. Check the output. Fix. Repeat. It works, but it's slow and you skip steps when you're in a hurry. Today, the pipeline does it for you — with an iterative fix loop that gives the agent 3 chances to get it right before escalating to you.

Time promise: 2 hours (substantial part — pipeline + MCP + recalibration).
Outcome promise: Scripted DGVE pipeline, first custom MCP server, preview environments per PR, and data-driven trust adjustment.

## Section Outline

### 1. Why This Matters
- Manual verification doesn't scale — you'll skip steps
- The pipeline automates what you've been doing manually since Part 13

### 2. Design: Preview Environment Architecture
- S3 bucket per PR, wildcard CloudFront, PR-scoped DNS
- ASCII diagram: PR → GitHub Actions → Terraform → S3 bucket → CloudFront → preview.domain.com/pr-N

### 3. Generate: Agent Produces Full Terraform + GitHub Actions
- Full prompt with AGENT-INSTRUCTIONS.md context
- Agent generates Terraform modules for preview environments + GitHub Actions workflow
- Show unedited output

### 4. Verify Loop (Scripted)
- `scripts/pipeline/verify.sh` — automated verification with iterative fix loop
- Max 3 iterations: verify → if failures → agent fixes → re-verify → repeat
- Tools: terraform validate, tflint, checkov, infracost, instruction compliance check
- Output: structured pass/fail with severity
- Iterations logged, feeds Scorecard's "iterations-to-clean" metric
- Components: code block showing script, TerminalOutput showing iteration output

### 5. Explain (Scripted)
- `scripts/pipeline/explain.sh` — uses cheapest model via `invoke_model`
- Summarizes: what was generated, what was flagged, iterations needed, what human should review
- Components: code block showing script, TerminalOutput showing explain output

### 6. terraform-mcp Server
- First custom MCP server: terraform-plan, terraform-validate, compliance-check
- Why MCP over shell: structured input/output, typed tools, permission scoping
- Server setup, tool definitions, agent configuration
- Components: FileTree showing MCP server structure, code blocks

### 7. Scorecard: New Panels (8-11)
- Panel 8: Terraform plan diff summary (resources add/change/destroy per session)
- Panel 9: Infracost estimate per PR (agent-generated vs human-generated)
- Panel 10: Cost trend over time
- Panel 11: Verification Overhead Ratio (verify+explain time / generate time)
- Components: Alert (important) describing each panel

### 8. Recalibration Checkpoint 1
- First data-driven trust adjustment
- Run eval-models.sh (compare to Part 9 results)
- Check Scorecard panels (agent quality metrics)
- Review AGENT-INSTRUCTIONS.md (rules working? need changes?)
- Adjust pipeline intensity
- Update cost budget
- Components: GuideStep sequence for recalibration procedure

## The Fine Line

| | |
|---|---|
| ❌ Under | Manual verification forever, no preview environments |
| ✅ Right | Scripted DGVE pipeline with fix loop, MCP server, preview envs per PR, data-driven recalibration |
| ❌ Over | Full multi-agent orchestration with parallel generators before testing single pipeline |
| 🤖 Agent Trap | Agent generates preview infrastructure without cleanup — orphaned S3 buckets accumulate costs |

## Thread Progression

- **AGENT-INSTRUCTIONS.md:** No additions (pipeline and MCP are tools, not rules)
- **Scorecard:** Panels 8-11 go live (plan diff, infracost per PR, cost trend, verification overhead). Cumulative: 11 panels.
- **Eval:** Expanded eval-models.sh (+ infracost scoring, + instruction compliance, + time metric, + multi-file project eval). Recalibration Checkpoint 1 completed.
- **MCP:** terraform-mcp server built. Tools: terraform-plan, terraform-validate, compliance-check.

## Validation Checklist Items

- **Preview Environments:** S3 bucket per PR working; CloudFront serving preview URLs; Cleanup on PR close
- **Pipeline:** verify.sh running all checks; Fix loop working (max 3 iterations); explain.sh producing summaries; Pipeline metrics logging to Loki
- **MCP:** terraform-mcp server running; All 3 tools callable from agent; Structured output returning correctly
- **Scorecard:** Panels 8-11 visible with data; Verification Overhead Ratio calculating correctly
- **Recalibration:** eval-models.sh re-run and compared to Part 9; AGENT-INSTRUCTIONS.md reviewed; Pipeline intensity adjusted based on data

## Key Takeaways

1. The manual verification you've been doing since Part 13 is now a script — `verify.sh` runs every check and gives the agent 3 chances to fix before escalating.
2. The fix loop's "iterations-to-clean" metric tells you how good your generator is — consistently >2 means improve your prompts, not add more verification.
3. MCP turns CLI commands into typed tools — agents call `terraform-plan` with structured input and get structured output instead of parsing shell text.
4. Recalibration Checkpoint 1 is your first data-driven trust adjustment. The pipeline is not set-and-forget — it adapts to your data.
5. Preview environments per PR are table stakes for professional development — every PR gets a live URL.

## Lead Magnet

- **Name:** Generate → Verify → Explain Pipeline Templates + terraform-mcp Server Template
- **Format:** Git repo / zip
- **Contents:** verify.sh, explain.sh, pipeline runner, terraform-mcp server code, Grafana panel JSON for panels 8-11, recalibration checklist.

## Code Examples Spec

1. **verify.sh** — Language: bash. Purpose: automated verification with iterative fix loop.
2. **explain.sh** — Language: bash. Purpose: model-based summarization of verification results.
3. **terraform-mcp server** — Language: TypeScript/Python. Purpose: MCP server exposing terraform-plan, terraform-validate, compliance-check.
4. **Preview Terraform module** — Language: HCL. Purpose: S3 bucket + CloudFront for per-PR preview.

## ASCII Diagrams Spec

1. **Preview Environment Architecture** — Placement: Design section. Shows PR → GitHub Actions → Terraform → S3/CloudFront → preview URL.
2. **Verify Fix Loop** — Placement: Verify Loop section. Shows verify → findings? → yes: agent fix → re-verify (max 3) → no: pass → explain.
3. **MCP vs Shell** — Placement: MCP section. Shows Agent → MCP (structured) vs Agent → Shell (fragile parsing).

## Cross-References

- Back: "The manual verification you've been running since [Part 13](/blog/aws-for-startups/13-s3-static-hosting) — terraform validate, tflint, checkov — is now automated."
- Back: "The MCP concept from [Part 9](/blog/aws-for-startups/09-monorepo-context-evals) becomes real. Your first custom server."
- Back: "Compare your Recalibration 1 eval results against [Part 9](/blog/aws-for-startups/09-monorepo-context-evals) — are your models improving?"
- Forward: "Coming in Part 27: MCP in CI. The terraform-mcp server runs headlessly in GitHub Actions."
- Forward: "Coming in Part 43: the full multi-agent pipeline with parallel generators and unified MCP verification."

## Writer Notes

- This is a KEY part (`featured: true`). Three major systems introduced. Needs careful pacing.
- The verify fix loop is the heart of the DGVE pipeline. Make the iteration output tangible — show iteration 1 (3 findings), iteration 2 (1 finding), iteration 3 (clean).
- MCP should feel like an upgrade, not a burden. Show the before (parsing shell output) and after (structured response).
- Recalibration is a checkpoint, not a deep dive. 15-20 minutes for the reader. Quick data check, adjustments, move on.
- This is one of the 5 KEY parts — budget extra writing and review time.
