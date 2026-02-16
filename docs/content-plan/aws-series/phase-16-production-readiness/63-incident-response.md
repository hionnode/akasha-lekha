# Part 63: Incident Response — The Entirely Human Process

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/63-incident-response.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "Incident Response: The Entirely Human Process"
description: "On-call setup, severity levels, runbooks, and blameless post-mortems. Where agents assist with data and timeline construction — never with decisions."
excerpt: "The entirely human process. On-call, severity levels, post-mortems — where agents assist with data, not decisions."
date: "2026-09-16"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "incident-response", "observability"]
series: "AWS From Zero to Production"
seriesPart: 63
featured: false
draft: true
---
```

## Section Outline
### 1. Why This Part Has No Agent Trap Box — Incident response is human-led
### 2. Severity Levels — P1-P4 with agent involvement inversely proportional to severity
### 3. On-Call Setup — Rotation, escalation, communication
### 4. Runbooks — Structured response procedures, agent-generated draft from documentation
### 5. Post-Mortem Template — Agent drafts timeline, human writes root cause and lessons learned
### 6. AGENT-INSTRUCTIONS.md Growth Mechanism — Post-mortem gaps → new instructions + verify checks

## The Fine Line
| | |
|---|---|
| ❌ Under | No incident process, ad-hoc response, no post-mortems |
| ✅ Right | Severity levels, runbooks, blameless post-mortems, agent-assisted data gathering |
| ❌ Over | Automated incident response, ChatOps bots making decisions |

Note: No Agent Trap in this Fine Line — intentional. This is the one domain where agent involvement is limited.

## Thread Progression
- All threads: No changes

## Key Takeaways
1. Agent involvement scales inversely with severity: P1 = agents fetch data only. P4 = agents generate fix PR.
2. Post-mortem gaps feed back into AGENT-INSTRUCTIONS.md — every incident makes the instructions file better.
3. Blameless post-mortems focus on systems, not people. "Why did our system allow this?" not "Who broke this?"

## Lead Magnet
- **Name:** Incident Response Playbook
- **Format:** PDF + templates
- **Contents:** Severity level guide, on-call rotation templates, runbook templates, post-mortem template with Agent Involvement Assessment.
