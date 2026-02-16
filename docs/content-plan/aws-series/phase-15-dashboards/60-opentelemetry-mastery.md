# Part 60: OpenTelemetry Mastery

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/60-opentelemetry-mastery.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "OpenTelemetry Mastery: Beyond Auto-Instrumentation"
description: "Advanced OpenTelemetry patterns: manual spans, custom attributes, baggage propagation, tail-based sampling, and the instrumentation that auto-mode misses."
excerpt: "Beyond auto-instrumentation. Manual spans, custom attributes, baggage, and sampling strategies — the OTel skills that separate monitoring from observability."
date: "2026-09-04"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "opentelemetry", "observability"]
series: "AWS From Zero to Production"
seriesPart: 60
featured: false
draft: true
---
```

## Section Outline
### 1. Why This Matters — Auto-instrumentation is 80%, manual spans are the critical 20%
### 2. Manual Spans — Business-critical operations, custom span names
### 3. Custom Attributes — Adding business context to traces (user_id, tenant_id, feature_flag)
### 4. Baggage — Propagating context across service boundaries
### 5. Sampling Strategies — Head-based vs tail-based, error-biased sampling
### 6. Metrics from Traces — Span metrics, latency histograms

## The Fine Line
| | |
|---|---|
| ❌ Under | Auto-instrumentation only, no business context in traces |
| ✅ Right | Manual spans on critical paths, custom attributes, tail-based sampling, baggage for context |
| ❌ Over | Span on every function, 100% sampling, custom exporters |
| 🤖 Agent Trap | Agent adds manual spans to every function instead of critical business paths — trace noise |

## Thread Progression
- All threads: No changes

## Key Takeaways
1. Auto-instrumentation gives you HTTP and database spans. Manual spans give you business operation spans.
2. Custom attributes (user_id, tenant_id) turn traces from "what happened" to "who was affected."
3. Tail-based sampling keeps errors and slow traces while sampling out routine successful requests.

## Lead Magnet
- **Name:** OTel Instrumentation Guide
- **Format:** PDF + code samples
- **Contents:** Manual span patterns per language, custom attribute guide, sampling configuration, baggage examples.
