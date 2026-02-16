# Part 14: Route53 + ACM — DNS & SSL

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/14-route53-acm-dns.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Route53 + ACM: Custom Domain with HTTPS"
description: "Configure custom domain with Route53 DNS and ACM SSL certificates. Terraform-managed DNS records, certificate validation, and the agent workflow for DNS setup."
excerpt: "Custom domain with HTTPS. Route53 for DNS, ACM for SSL — because nobody trusts an S3 endpoint URL."
date: "2026-02-28"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "route53", "acm", "terraform", "frontend"]
series: "AWS From Zero to Production"
seriesPart: 14
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
import ResourceStatus from '../../../components/shared/ResourceStatus.astro';
```

## Opening Hook

Nobody trusts a URL like `http://mastery-prod-website.s3-website-us-east-1.amazonaws.com`. Your users need `https://yourdomain.com`. Route53 gives you DNS, ACM gives you free SSL, and Terraform manages both.

Time promise: 30 minutes (plus DNS propagation wait).
Outcome promise: Custom domain pointing to your S3 site with valid HTTPS.

## Section Outline

### 1. Why This Matters — Custom domain + HTTPS as baseline trust
### 2. Route53 Hosted Zone — Domain registration or transfer, hosted zone setup
### 3. ACM Certificate — Request certificate, DNS validation records
### 4. DNS Records — A record (alias) pointing to S3, CNAME for www
### 5. Certificate Validation — Waiting for DNS propagation, verification
### 6. Agent-Assisted Terraform — Full Terraform for Route53 + ACM resources

## The Fine Line

| | |
|---|---|
| ❌ Under | Raw S3 endpoint URL, no HTTPS |
| ✅ Right | Custom domain via Route53, ACM certificate with DNS validation |
| ❌ Over | Multi-region DNS failover for a static site |
| 🤖 Agent Trap | Agent creates ACM certificate in wrong region (must be us-east-1 for CloudFront) |

## Thread Progression

- All threads: No changes

## Validation Checklist Items

- **DNS:** Route53 hosted zone created; Domain resolving correctly; ACM certificate issued and validated; HTTPS working
- **Terraform:** All Route53 and ACM resources managed by Terraform

## Key Takeaways

1. ACM certificates are free — there's no excuse for not having HTTPS.
2. ACM for CloudFront must be in us-east-1 regardless of your application region — agents forget this constantly.
3. DNS propagation takes time. Plan for it and verify with `dig` before declaring victory.

## Lead Magnet

- **Name:** DNS Records Cheatsheet
- **Format:** PDF
- **Contents:** Record types (A, AAAA, CNAME, MX, TXT), Route53 alias vs CNAME, ACM validation patterns, common DNS debugging commands.
