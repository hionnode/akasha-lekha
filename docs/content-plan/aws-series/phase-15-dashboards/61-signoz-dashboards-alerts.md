# Part 61: SigNoz Dashboards & Alerts

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/61-signoz-dashboards-alerts.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "SigNoz Dashboards & Alerts: The Panels That Wake You Up"
description: "Build production SigNoz dashboards with Golden Signals, custom alerting rules, and SLO tracking. The application observability surface, fully operational."
excerpt: "The panels that wake you up (and the ones that let you sleep). SigNoz dashboards with Golden Signals, alerting, and SLOs."
date: "2026-09-08"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "observability"]
series: "AWS From Zero to Production"
seriesPart: 61
featured: false
draft: true
---
```

## Section Outline
### 1. Why This Matters — Empty dashboards → production dashboards
### 2. Golden Signals — Latency, traffic, errors, saturation dashboards
### 3. Custom Dashboards — Service-specific panels, business metrics
### 4. Alerting Rules — What to alert on, severity levels, routing
### 5. SLOs — Service Level Objectives, error budgets, burn rate alerts
### 6. Alert Fatigue Prevention — Meaningful alerts only

## The Fine Line
| | |
|---|---|
| ❌ Under | No dashboards, no alerts, check SigNoz manually when things feel slow |
| ✅ Right | Golden Signals dashboards, SLOs with error budgets, tiered alerting |
| ❌ Over | Alert on every metric deviation, 50+ dashboard panels, before you have traffic patterns |
| 🤖 Agent Trap | Agent creates alerts on every metric with tight thresholds — alert fatigue within a week |

## Thread Progression
- All threads: No changes

## Key Takeaways
1. Golden Signals (latency, traffic, errors, saturation) are the four dashboards that matter most.
2. SLOs with error budgets tell you "how reliable do we need to be" — not "is anything broken right now."
3. Alert fatigue is worse than no alerts — only alert on actionable conditions.

## Lead Magnet
- **Name:** SigNoz Dashboard Templates
- **Format:** JSON + configuration
- **Contents:** Golden Signals dashboard, service dashboard template, alerting rule templates, SLO configuration guide.
