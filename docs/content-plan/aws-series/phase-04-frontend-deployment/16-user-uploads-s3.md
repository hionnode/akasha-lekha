# Part 16: User Uploads to S3

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/16-user-uploads-s3.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "User Uploads to S3: Presigned URLs and Direct Uploads"
description: "Implement secure user file uploads with S3 presigned URLs. Direct browser-to-S3 uploads, size limits, content type validation, and lifecycle policies."
excerpt: "Presigned URLs and direct uploads. Secure file uploads without routing everything through your server — because your API shouldn't be a file proxy."
date: "2026-03-08"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "s3", "terraform", "frontend"]
series: "AWS From Zero to Production"
seriesPart: 16
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
import FileTree from '../../../components/shared/FileTree.astro';
```

## Opening Hook

Your users need to upload profile pictures. The naive approach: browser → your API → S3. Every byte flows through your server, eating bandwidth and memory. The right approach: browser → S3 directly, with a presigned URL your API generates in 5ms.

Time promise: 40 minutes.
Outcome promise: Secure direct-to-S3 uploads with presigned URLs, content validation, and lifecycle policies for cleanup.

## Section Outline

### 1. Why This Matters — Server-proxied vs direct uploads
### 2. Presigned URL Pattern — ASCII diagram: API generates URL → Browser uploads directly to S3
### 3. Implementation — Backend presigned URL generation, frontend upload code
### 4. Security — Content type validation, size limits, bucket policies
### 5. Lifecycle Policies — Auto-cleanup of temporary uploads, Glacier transition
### 6. CORS Configuration — Required for browser-to-S3 direct uploads

## The Fine Line

| | |
|---|---|
| ❌ Under | Uploading through your API server (bandwidth bottleneck) |
| ✅ Right | Presigned URLs with content type validation, size limits, lifecycle policies |
| ❌ Over | Multi-part upload with progress tracking, image processing pipeline, before MVP |
| 🤖 Agent Trap | Agent generates presigned URL without expiration or content type restriction |

## Thread Progression

- All threads: No changes

## Validation Checklist Items

- **Uploads:** Presigned URL generation working; Direct browser-to-S3 upload succeeding; Content type validation enforced; Size limits configured
- **Security:** CORS configured for upload bucket; Presigned URLs expire appropriately; Bucket not publicly writable

## Key Takeaways

1. Never proxy file uploads through your API — presigned URLs let browsers upload directly to S3.
2. Always set expiration and content type restrictions on presigned URLs — agents generate permissive defaults.
3. Lifecycle policies prevent orphaned uploads from accumulating storage costs forever.

## Lead Magnet

- **Name:** S3 Upload Patterns Guide
- **Format:** PDF + code samples
- **Contents:** Presigned URL patterns for Bun/Python/Go, CORS configurations, lifecycle policy templates.
