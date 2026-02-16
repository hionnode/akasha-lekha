# Part 59B: The Debugging Decision Tree — When Agents Help vs Hurt

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/59b-debugging-decision-tree.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "The Debugging Decision Tree: When to Reach for an Agent"
description: "Building your instinct for when agents help vs hurt in debugging. Seven debugging phases, the subtle memory leak worked example, and the judgment that can't be automated."
excerpt: "Building your instinct for when to reach for an agent and when to rely on your own judgment. Seven debugging phases and a worked example."
date: "2026-09-01"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "incident-response", "ai-agents", "observability"]
series: "AWS From Zero to Production"
seriesPart: 59
featured: false
draft: true
---
```

Note: seriesPart is set to 59 (59B is a sub-part, not a separate series number). The filename handles the distinction.

## Section Outline
### 1. The Seven Debugging Phases — Detection, Triage, Investigation, Decision, Execution, Verification, Post-mortem
### 2. Agent Role per Phase — Table: agents excel at 1,3,5,7 (data processing); humans essential at 2,4,6 (judgment)
### 3. Worked Example: The Subtle Memory Leak — Full walkthrough from alert to post-mortem
### 4. The Judgment That Can't Be Automated — Why agents suggest indexes when the problem is connection pools
### 5. Building Your Debugging Instinct — Pattern recognition that improves with experience

## The Fine Line
| | |
|---|---|
| ❌ Under | No structured debugging process, ad-hoc investigation |
| ✅ Right | Seven-phase debugging workflow with clear agent/human responsibilities per phase |
| ❌ Over | Fully automated incident response that removes human judgment |
| 🤖 Agent Trap | Agent identifies the symptom correctly but misattributes the root cause because it lacks deployment context |

## Thread Progression
- All threads: No changes

## Key Takeaways
1. Agents excel at data phases (detection, investigation, execution, post-mortem) and humans are essential at judgment phases (triage, decision, verification).
2. The subtle memory leak example shows why: the agent correctly identified high memory but suggested the wrong fix (query optimization vs base image change).
3. Human debugging instinct — connecting symptoms to context the agent doesn't have — is the skill that separates operators from users.
4. Post-mortem gaps feed back into AGENT-INSTRUCTIONS.md — every production incident makes the instructions file better.
