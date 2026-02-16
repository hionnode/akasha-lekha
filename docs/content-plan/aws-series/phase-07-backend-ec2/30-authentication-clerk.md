# Part 30: Authentication with Clerk

> Status: PLANNED
> Blog file: `apps/web/src/content/blog/aws-for-startups/30-authentication-clerk.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Authentication with Clerk: Auth You Don't Have to Build"
description: "Integrate Clerk authentication across Bun, Python, and Go backends. Social login, JWT verification, and middleware patterns — without building auth from scratch."
excerpt: "Auth you don't have to build. Clerk integration across all three backends — because rolling your own auth is a full-time job you don't need."
date: "2026-04-30"
author: "works-on-my.cloud"
tags: ["aws", "devops", "startup", "authentication", "backend"]
series: "AWS From Zero to Production"
seriesPart: 30
featured: false
draft: true
---
```

## Section Outline

### 1. Why This Matters — Build vs buy for auth
### 2. Clerk Setup — Dashboard, API keys, social providers
### 3. Bun.js Integration — Middleware, JWT verification, protected routes
### 4. Python Integration — FastAPI middleware
### 5. Go Integration — Middleware pattern
### 6. Frontend Integration — React/Astro components

## The Fine Line

| | |
|---|---|
| ❌ Under | No auth, or basic JWT implementation with security holes |
| ✅ Right | Clerk for auth, JWT verification middleware, proper session management |
| ❌ Over | Custom auth service, SAML federation, MFA policies, for a pre-launch product |
| 🤖 Agent Trap | Agent implements custom JWT auth instead of using Clerk SDK — reinventing insecure wheels |

## Thread Progression

- All threads: No changes

## Key Takeaways

1. Auth is a buy decision, not a build decision — Clerk handles the complexity you don't want.
2. Agents love building custom auth. Resist. Use the SDK.
3. JWT verification middleware follows the same pattern across all three languages — the framework doesn't matter.

## Lead Magnet

- **Name:** Auth Integration Checklist
- **Format:** PDF
- **Contents:** Clerk vs Auth0 vs Cognito comparison, middleware patterns per language, JWT verification checklist.
