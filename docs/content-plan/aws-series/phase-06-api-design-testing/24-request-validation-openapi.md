# Part 24: Request Validation & OpenAPI

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/24-request-validation-openapi.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Request Validation & OpenAPI: The Spec That Keeps Everyone Honest"
description: "Implement request validation with OpenAPI spec, Zod, and Pydantic. Agents generate from spec, not ad hoc — consistent APIs by construction."
excerpt: "The spec that keeps everyone honest. OpenAPI as source of truth — agents generate from it, validation enforces it, and your API stays consistent."
date: "2026-04-08"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "api-gateway"]
series: "AWS From Zero to Production"
seriesPart: 24
featured: false
draft: true
---
```

## Component Imports

```mdx
import GuideStep from '../../../components/shared/GuideStep.astro';
import Command from '../../../components/shared/Command.astro';
import TerminalOutput from '../../../components/shared/TerminalOutput.astro';
import Alert from '../../../components/shared/Alert.astro';
import ValidationChecklist from '../../../components/shared/ValidationChecklist.astro';
import PanelSwitcher from '../../../components/shared/PanelSwitcher.astro';
import Panel from '../../../components/shared/Panel.astro';
```

## Opening Hook

Your agent generates an endpoint that accepts any JSON body. No validation. A user sends `{name: 123}` instead of `{name: "Alice"}` and your database stores a number where a string should be. Three months of bad data before anyone notices. OpenAPI + validation schemas prevent this by construction.

Time promise: 40 minutes.
Outcome promise: OpenAPI spec as source of truth, request validation in your language of choice (Zod/Pydantic/Go struct tags), agents generating from spec instead of ad hoc.

## Section Outline

### 1. Why This Matters — No validation = garbage in, garbage stored
### 2. OpenAPI Spec — Writing the spec, spec-first vs code-first
### 3. Validation by Language — Zod (Bun), Pydantic (Python), struct tags (Go)
### 4. Agent Workflow — Agents generate handlers FROM the spec, not ad hoc
### 5. Generated Documentation — Auto-generated API docs from OpenAPI

## The Fine Line

| | |
|---|---|
| ❌ Under | No validation, accept any input, hope for the best |
| ✅ Right | OpenAPI spec as source of truth, language-native validation, agents generate from spec |
| ❌ Over | Custom validation framework, JSON Schema + OpenAPI + Zod redundancy |
| 🤖 Agent Trap | Agent generates validation inline instead of from the OpenAPI spec — drift between spec and implementation |

## Thread Progression

- All threads: No changes

## Validation Checklist Items

- **OpenAPI:** Spec written for all current endpoints; Validation schemas generated from spec; At least one endpoint fully validated
- **Agent Workflow:** Agent prompt includes OpenAPI spec as context; Generated handlers match spec

## Key Takeaways

1. OpenAPI spec is the single source of truth — agents generate FROM the spec, not alongside it.
2. Validation happens at the API boundary, not deep in business logic — validate early, trust internally.
3. Spec-first means your API contract exists before implementation — agents implement, they don't design.
