# Part 57: SES — Email

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/57-ses-email.mdx`
> Estimated word count: 2,000-2,500

## Frontmatter

```yaml
---
title: "SES: Transactional Email That Actually Gets Delivered"
description: "Configure Amazon SES for transactional email. Domain verification, DKIM/SPF/DMARC, sending limits, and deliverability best practices."
excerpt: "Transactional email that actually gets delivered. SES with proper DNS records — because landing in spam is worse than not sending at all."
date: "2026-08-14"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "ses", "terraform"]
series: "AWS From Zero to Production"
seriesPart: 57
featured: false
draft: true
---
```

## Section Outline
### 1. Why This Matters — Email deliverability affects user experience
### 2. SES Setup — Domain verification, sandbox vs production
### 3. DNS Records — DKIM, SPF, DMARC configuration
### 4. Sending Patterns — Transactional vs marketing, templates
### 5. Monitoring — Bounce rate, complaint rate, delivery metrics

## The Fine Line
| | |
|---|---|
| ❌ Under | SMTP credentials hardcoded, no DNS records, landing in spam |
| ✅ Right | SES with DKIM/SPF/DMARC, Terraform-managed, bounce monitoring |
| ❌ Over | Custom email rendering pipeline, A/B testing, for transactional emails |
| 🤖 Agent Trap | Agent skips DKIM/SPF/DMARC configuration — emails go to spam |

## Thread Progression
- All threads: No changes

## Key Takeaways
1. DKIM, SPF, and DMARC are non-negotiable — without them, your emails land in spam.
2. SES sandbox mode limits sending to verified addresses only — request production access early.
3. Monitor bounce and complaint rates — exceeding thresholds gets your SES account suspended.
