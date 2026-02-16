# Part 9: Monorepo Structure, Agent Context, Prompt Engineering & Model Evals — THE KEY PART

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/09-monorepo-context-evals.mdx`
> Estimated word count: 4,500-6,000

## Frontmatter

```yaml
---
title: "Agent Context, Prompt Engineering & Model Evals: Making Your Repo Agent-Ready"
description: "The most important part in the series. Monorepo structure, AGENT-INSTRUCTIONS.md architecture, prompt engineering for IaC, model evaluation framework, and the MCP concept."
excerpt: "Making your repo agent-ready, mastering prompt quality, and measuring which agents deserve your trust. Six major deliverables in one part."
date: "2026-02-08"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "ai-agents", "model-eval", "mcp"]
series: "AWS From Zero to Production"
seriesPart: 9
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
import ComparisonTable from '../../../components/shared/ComparisonTable.astro';
import CodeSwitcher from '../../../components/shared/CodeSwitcher.astro';
```

## Opening Hook

Scenario: You've been using agents for a few weeks. Some outputs are great, others are subtly wrong. You can't explain why. Is it the model? The prompt? The context? You're flying blind — generating infrastructure with no way to measure quality. Today that changes.

Time promise: This is the longest part. Budget 2-3 hours for the full experience (reading + setting up eval framework + running first eval).
Outcome promise: Six deliverables that transform your agent workflow from "hope it works" to "measure and verify."

## Section Outline

### 1. Directory Structure
- Complete monorepo layout with agent context files
- Components: FileTree (comprehensive project structure)

### 2. AGENT-INSTRUCTIONS.md Architecture
- How the progressive file works
- Per-directory overrides for specific contexts
- The canonical source of truth concept

### 3. sync-agent-config.sh
- Model-agnostic: one file generates configs for Claude Code, Cursor, Windsurf, Aider, Amazon Q
- Components: code block with script, Command to run

### 4. Model Invocation Abstraction
- `scripts/lib/model-invoke.sh` — single function for calling any model
- Supports Anthropic (Claude CLI), OpenAI, open-source (ollama/vllm)
- Components: code block showing the abstraction, usage examples

### 5. Context Window Management
- The budget mental model (context is a backpack with a weight limit)
- What fits: AGENT-INSTRUCTIONS.md (~2K tokens), single TF files (500-2K), modules (5-15K cherry-picked)
- The "lost in the middle" problem: instructions at start, task at end
- When to split tasks: >5 files = task too large
- Components: Alert (important) with context budget diagram

### 6. Prompt Engineering for Infrastructure
- Four-layer prompt anatomy: CONTEXT, TASK, STRUCTURE, ANTI-PATTERNS
- Templates for common infrastructure prompts
- Structured output prompting for Verify and Explain steps
- Prompt sensitivity metric: bare vs four-layer prompts
- Components: code blocks showing prompt templates, ComparisonTable for bare vs structured results

### 7. Skills & Prompt Templates
- On-demand context loading
- Reusable across models (not tool-specific)
- Components: FileTree showing skills directory

### 8. Decision Log
- `decisions/` directory — agents need WHY, not just WHAT
- Template: context, decision, alternatives, consequences
- Components: code block showing decision template

### 9. eval-models.sh — The Model Evaluation Framework
- 11 Terraform prompts (including long-context test)
- N models, automated scoring: fmt, validate, tflint, checkov, instruction compliance, cost, time
- Prompt sensitivity metric (bare vs four-layer for same prompts)
- Results: CSV → personal model leaderboard
- Components: Command to run, TerminalOutput showing results, table showing leaderboard format

### 10. First Two-Agent Pattern (Manual)
- Generator in Terminal 1, Verifier in Terminal 2 with fresh context
- Why fresh context matters: eliminates anchoring bias
- Components: Alert (important) with two-terminal diagram

### 11. MCP Concept Introduction
- Mental model: infrastructure as an API agents call, not a CLI they shell out to
- Install one MCP server (filesystem or GitHub) to see the pattern
- Components: Alert (important) with MCP concept diagram

### 12. Makefile
- Common commands across all services
- Components: code block showing Makefile

### 13. AGENT-INSTRUCTIONS.md Addition
- Context Management section (7 lines)

## The Fine Line

| | |
|---|---|
| ❌ Under | No agent context, ad-hoc prompts, one model for everything, no measurement |
| ✅ Right | Progressive AGENT-INSTRUCTIONS.md, four-layer prompts, eval framework, model-agnostic invocation |
| ❌ Over | Custom fine-tuned models, complex RAG pipelines, before deploying any real infrastructure |
| 🤖 Agent Trap | Agent ignores AGENT-INSTRUCTIONS.md when context window is full — silently drops conventions |

## Agent Trap

Two traps in Part 9:
1. Context overflow: when context is too large, models silently drop content from the middle. AGENT-INSTRUCTIONS.md conventions get "forgotten" because they're sandwiched between files. Put instructions at the START of context, task at the END.
2. Prompt sensitivity: same task, different prompt quality, wildly different output. The eval framework measures this. Some models need detailed prompts (cheap models), others handle ambiguity well (expensive models).

## Thread Progression

- **AGENT-INSTRUCTIONS.md:** Context Management section added (7 lines). Cumulative: 32 lines.
- **Scorecard:** Panels 3-7 go live (model eval scores, validate rate by model, checkov findings by model, instruction compliance by model, prompt sensitivity by model). Cumulative: 7 panels.
- **Eval:** eval-models.sh framework operational. 11 prompts, N models, automated scoring, prompt sensitivity metric. Reader has personal model leaderboard.
- **MCP:** Concept introduced. One third-party MCP server installed (filesystem or GitHub).

## Validation Checklist Items

- **Repository Structure:** Monorepo layout follows convention; AGENT-INSTRUCTIONS.md at repo root; sync-agent-config.sh working for all installed agents
- **Model Invocation:** model-invoke.sh working with at least 2 providers; invoke_model function tested
- **Prompt Engineering:** Four-layer prompt template created; At least one infrastructure prompt tested in bare vs structured format
- **Eval Framework:** eval-models.sh running successfully; All 11 prompts scored across 2+ models; Prompt sensitivity metric calculated; Results in CSV; Personal leaderboard generated
- **Agent Scorecard:** Panels 3-7 visible in Grafana with eval data
- **MCP:** One MCP server installed and working
- **AGENT-INSTRUCTIONS.md:** Context Management section added (7 rules)

## Key Takeaways

1. AGENT-INSTRUCTIONS.md is the most important file in your repo — it's the bridge between your knowledge and your agent's behavior.
2. Prompt quality is the single biggest lever on output quality — the four-layer anatomy (Context, Task, Structure, Anti-Patterns) is your template.
3. Never trust a single model — eval-models.sh gives you data, not opinions, on which models work best for your infrastructure.
4. Context is a backpack with a weight limit — put instructions at the start, the task at the end, and cherry-pick everything in between.
5. MCP is the future of agent-infrastructure interaction: structured tools, not shell commands. The concept starts here, the first server comes in Part 19.

## Lead Magnet

- **Name:** Agent Context Starter Kit
- **Format:** Git repo / zip (largest lead magnet in the series)
- **Contents:** AGENT-INSTRUCTIONS.md with Parts 1-9 content, sync-agent-config.sh, model-invoke.sh, eval-models.sh framework, 11 eval prompts, 4-layer prompt templates, decision log template, Makefile.

## Code Examples Spec

1. **sync-agent-config.sh** — Language: bash. Purpose: generate tool-specific configs from AGENT-INSTRUCTIONS.md.
2. **model-invoke.sh** — Language: bash. Purpose: model invocation abstraction supporting multiple providers.
3. **Four-layer prompt** — Language: plaintext. Purpose: show the CONTEXT/TASK/STRUCTURE/ANTI-PATTERNS anatomy.
4. **eval-models.sh** — Language: bash. Purpose: automated model evaluation framework. Key points: 11 prompts, scoring pipeline, CSV output.

## ASCII Diagrams Spec

1. **Context Budget** — Placement: Context Window Management. Shows context window as a box with labeled sections: AGENT-INSTRUCTIONS.md (start, always), task (end, always), files (middle, cherry-picked), conversation history (grows, summarize).
2. **Two-Agent Pattern** — Placement: First Two-Agent Pattern. Shows Terminal 1 (Generator) and Terminal 2 (Verifier with fresh context), arrows showing output → review flow.
3. **MCP Concept** — Placement: MCP introduction. Shows Agent → MCP Server → Structured Tools (plan, validate, check) vs Agent → Shell → Raw CLI Output (fragile).

## Cross-References

- Back: "Your Taste Test results from [Part 4](/blog/aws-for-startups/04-terraform-fundamentals) were 5 checks and 3 models. Compare them against the automated eval."
- Back: "The pre-commit hooks from [Part 8](/blog/aws-for-startups/08-pre-commit-code-quality) are the first piece of the Verify step. Today we build the rest."
- Forward: "Coming in Part 19: your first custom MCP server. The concept you learned today becomes a real tool."
- Forward: "Coming in Part 19: the first scripted Generate → Verify → Explain pipeline."

## Writer Notes

- This is the most important part in the series. It needs to be comprehensive but not overwhelming.
- Six deliverables is a lot. Consider clear section breaks and a "what we'll cover" roadmap at the top.
- The eval framework should feel empowering, not academic. The reader should be excited to see their personal leaderboard.
- MCP is introduced conceptually. Don't overwhelm with protocol details — save that for Part 19.
- The prompt sensitivity metric is a novel concept for most readers. Explain it clearly: "How much does prompt quality affect this model's output?"
- `featured: true` — this is one of the 5 KEY parts in the series.
