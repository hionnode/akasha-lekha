# Part 55: SNS + EventBridge

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/55-sns-eventbridge.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "SNS + EventBridge: Pub/Sub and Event Routing"
description: "Implement pub/sub with SNS and event routing with EventBridge. Fan-out patterns, event rules, and choosing between the two services."
excerpt: "Pub/sub and event routing. SNS for fan-out, EventBridge for smart routing — and when to use which."
date: "2026-08-06"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "sns", "eventbridge", "serverless"]
series: "AWS From Zero to Production"
seriesPart: 55
featured: false
draft: true
---
```

## Section Outline
### 1. SNS — Topics, subscriptions, fan-out to SQS/Lambda/email
### 2. EventBridge — Event bus, rules, patterns, targets
### 3. SNS vs EventBridge — When to use which (comparison table)
### 4. Event Patterns — Content-based filtering, schema registry
### 5. Cross-Service Events — S3 events, CloudWatch Events via EventBridge

## The Fine Line
| | |
|---|---|
| ❌ Under | Direct service-to-service calls for everything |
| ✅ Right | SNS for simple fan-out, EventBridge for content-based routing |
| ❌ Over | EventBridge schema registry, event replay, before you have complex event flows |
| 🤖 Agent Trap | Agent uses SNS when EventBridge's content filtering would eliminate unnecessary Lambda invocations |

## Thread Progression
- All threads: No changes

## Key Takeaways
1. SNS is simple fan-out (publish to topic, all subscribers get it). EventBridge is smart routing (rules filter events).
2. EventBridge's content-based filtering prevents unnecessary invocations — cheaper than SNS + Lambda filtering.

## Lead Magnet
- **Name:** Event Patterns Cheatsheet
- **Format:** PDF
- **Contents:** SNS vs EventBridge decision matrix, common event patterns, EventBridge rule examples.
