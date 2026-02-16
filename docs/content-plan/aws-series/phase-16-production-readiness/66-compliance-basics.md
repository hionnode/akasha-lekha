# Part 66: Compliance Basics

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/66-compliance-basics.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Compliance Basics: The Minimum Viable Compliance"
description: "GDPR basics, data retention policies, audit logging, and how your agent audit trail feeds compliance requirements. Compliance as a byproduct of good engineering."
excerpt: "The minimum viable compliance. GDPR, data retention, audit logs — and how your agent audit trail is already doing half the work."
date: "2026-09-28"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "security"]
series: "AWS From Zero to Production"
seriesPart: 66
featured: false
draft: true
---
```

## Section Outline
### 1. Why This Matters — Compliance as engineering byproduct, not separate workstream
### 2. GDPR Basics — Data inventory, consent, right to deletion
### 3. Data Retention — Policies, automated cleanup, S3 lifecycle
### 4. Audit Logging — CloudTrail + agent audit trail (already built!)
### 5. Compliance Reports — Security Hub compliance standards, Prowler reports

## The Fine Line
| | |
|---|---|
| ❌ Under | No data policies, no audit trail, hope for the best |
| ✅ Right | Data retention policies, GDPR awareness, CloudTrail + agent audit, compliance reports |
| ❌ Over | SOC 2 certification, dedicated compliance officer, for a pre-revenue startup |
| 🤖 Agent Trap | Agent generates data handling code that doesn't respect retention policies or deletion requests |

## Thread Progression
- All threads: No changes

## Key Takeaways
1. Most compliance requirements are byproducts of good engineering — CloudTrail, encryption, access control.
2. Your agent audit trail from Part 62 already covers half of compliance audit requirements.
3. Data retention policies are simple but easy to forget — automate with S3 lifecycle and database TTLs.
