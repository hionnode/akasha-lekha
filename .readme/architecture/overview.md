# Architecture Overview

This document provides a high-level overview of the Akasha Lekha platform architecture.

## System Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USERS                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLOUDFLARE PAGES                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     apps/web (Astro 5.x)                             │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │    │
│  │  │    Blog      │  │    Labs      │  │    Static Assets         │   │    │
│  │  │  /blog/*     │  │   /labs/*    │  │   /favicon, /fonts, etc  │   │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ API Calls (fetch)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AWS API GATEWAY v2                                  │
│                         (ap-south-1 region)                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Routes:                                                             │    │
│  │  GET  /auth/github          → Lambda (OAuth redirect)                │    │
│  │  GET  /auth/github/callback → Lambda (OAuth callback, JWT creation)  │    │
│  │  POST /auth/verify          → Lambda (JWT verification)              │    │
│  │  POST /auth/logout          → Lambda (Session cleanup)               │    │
│  │  GET  /exercises            → Lambda (List exercises)                │    │
│  │  GET  /exercises/{id}       → Lambda (Get exercise details)          │    │
│  │  GET  /progress             → Lambda (User progress)                 │    │
│  │  POST /exercises/{id}/verify→ Lambda (Record completion)             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AWS LAMBDA                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  packages/api/src/functions/                                         │    │
│  │  ├── auth/      (github.ts, callback.ts, verify.ts, logout.ts)      │    │
│  │  ├── exercises/ (list.ts, get.ts)                                   │    │
│  │  └── progress/  (get.ts, record.ts)                                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AWS DYNAMODB                                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │      Users       │  │     Progress     │  │     Sessions     │          │
│  │  pk=USER#<id>    │  │  pk=USER#<id>    │  │ pk=SESSION#<hash>│          │
│  │  sk=PROFILE      │  │ sk=EXERCISE#<id> │  │  sk=USER#<id>    │          │
│  │  gsi1pk=EMAIL#   │  │ gsi1pk=EXERCISE# │  │  ttl=expiresAt   │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Components

### Frontend (apps/web)

The Astro-based frontend serves both the blog and labs:

| Feature | Technology | Description |
|---------|------------|-------------|
| Static Site Generation | Astro 5.x | Blog posts, landing pages |
| Interactive Islands | Solid.js | Auth status, progress tracking, clipboard |
| Styling | Tailwind CSS v4 | Tokyo Night theme (dark mode only) |
| Content | MDX | Blog posts and lab exercises |
| Typography | Inconsolata | Monospace font throughout |

### Backend (packages/api)

Serverless API built with SST v3:

| Component | Technology | Description |
|-----------|------------|-------------|
| Runtime | AWS Lambda | Node.js 20 functions |
| API | API Gateway v2 | HTTP API with CORS |
| Auth | GitHub OAuth + JWT | Stateless authentication (7-day expiry) |
| Database | DynamoDB | Single-table design with GSIs |

### Infrastructure (infra/)

SST infrastructure-as-code:

| File | Purpose |
|------|---------|
| `sst.config.ts` | App configuration (name: akasha-labs, region: ap-south-1) |
| `infra/database.ts` | DynamoDB tables (Users, Progress, Sessions) |
| `infra/auth.ts` | Secrets (GithubClientId, GithubClientSecret, JwtSecret) |
| `infra/api.ts` | API Gateway routes with Lambda handlers |

## Data Flow

### Authentication Flow

```
┌──────────┐      ┌──────────────┐      ┌─────────────┐      ┌──────────┐
│   User   │      │   Frontend   │      │  API Lambda │      │  GitHub  │
└────┬─────┘      └──────┬───────┘      └──────┬──────┘      └────┬─────┘
     │                   │                     │                   │
     │  1. Click Login   │                     │                   │
     │──────────────────>│                     │                   │
     │                   │                     │                   │
     │                   │  2. GET /auth/github│                   │
     │                   │────────────────────>│                   │
     │                   │                     │                   │
     │                   │  3. Redirect URL    │                   │
     │                   │<────────────────────│                   │
     │                   │                     │                   │
     │  4. Redirect to GitHub OAuth            │                   │
     │<────────────────────────────────────────────────────────────>
     │                   │                     │                   │
     │  5. User authorizes app                 │                   │
     │<────────────────────────────────────────────────────────────>
     │                   │                     │                   │
     │  6. Callback with code                  │                   │
     │──────────────────>│                     │                   │
     │                   │                     │                   │
     │                   │  7. GET /callback?code=xxx              │
     │                   │────────────────────>│                   │
     │                   │                     │                   │
     │                   │                     │  8. Exchange code │
     │                   │                     │──────────────────>│
     │                   │                     │                   │
     │                   │                     │  9. Access token  │
     │                   │                     │<──────────────────│
     │                   │                     │                   │
     │                   │                     │  10. Get user info│
     │                   │                     │──────────────────>│
     │                   │                     │                   │
     │                   │                     │  11. User data    │
     │                   │                     │<──────────────────│
     │                   │                     │                   │
     │                   │                     │  12. Save to DynamoDB
     │                   │                     │  (Users + Sessions)
     │                   │                     │                   │
     │                   │  13. Redirect + JWT │                   │
     │                   │<────────────────────│                   │
     │                   │                     │                   │
     │  14. Store JWT    │                     │                   │
     │<──────────────────│                     │                   │
     │                   │                     │                   │
```

### Exercise Completion Flow

```
┌──────────┐      ┌──────────────┐      ┌─────────────┐      ┌──────────┐
│   User   │      │   Frontend   │      │  API Lambda │      │ DynamoDB │
└────┬─────┘      └──────┬───────┘      └──────┬──────┘      └────┬─────┘
     │                   │                     │                   │
     │  1. Read exercise │                     │                   │
     │      instructions │                     │                   │
     │<──────────────────│                     │                   │
     │                   │                     │                   │
     │  2. Perform tasks │                     │                   │
     │     locally       │                     │                   │
     │  (terminal/editor)│                     │                   │
     │                   │                     │                   │
     │  3. Run CLI:      │                     │                   │
     │  infra-learn      │                     │                   │
     │  verify <id>      │                     │                   │
     │──────────────────>│                     │                   │
     │                   │                     │                   │
     │                   │  4. POST /exercises/{id}/verify        │
     │                   │     Authorization: Bearer <jwt>        │
     │                   │────────────────────>│                   │
     │                   │                     │                   │
     │                   │                     │  5. Validate JWT  │
     │                   │                     │──────────────────>│
     │                   │                     │                   │
     │                   │                     │  6. Session valid │
     │                   │                     │<──────────────────│
     │                   │                     │                   │
     │                   │                     │  7. Record progress
     │                   │                     │──────────────────>│
     │                   │                     │                   │
     │                   │                     │  8. Success       │
     │                   │                     │<──────────────────│
     │                   │                     │                   │
     │                   │  9. Updated progress│                   │
     │                   │<────────────────────│                   │
     │                   │                     │                   │
     │  10. Show success │                     │                   │
     │<──────────────────│                     │                   │
     │                   │                     │                   │
```

## Environments

| Environment | Frontend URL | API Stage | Purpose |
|-------------|--------------|-----------|---------|
| Development | localhost:4321 | (local SST dev) | Local development |
| Preview | preview.works-on-my.cloud | preview | PR previews |
| Production | works-on-my.cloud | prod | Live site |

## Security

### Authentication
- GitHub OAuth for user identity
- JWT tokens with 7-day expiry
- Sessions stored in DynamoDB with TTL

### API Security
- CORS restricted to specific frontend origins per stage
- JWT validation on protected routes
- DynamoDB IAM roles scoped per Lambda function

### Secrets Management
- SST Secrets for sensitive values (GitHub OAuth, JWT secret)
- Per-stage secret isolation
- No secrets in code or git
- OIDC for GitHub Actions (no static AWS credentials)

## Scalability

### Frontend
- Cloudflare Pages CDN with global edge caching
- Static assets cached long-term
- HTML pages with short-term caching

### Backend
- Lambda auto-scaling (concurrent executions)
- DynamoDB on-demand capacity
- API Gateway managed scaling

## Monitoring

### Current
- Cloudflare analytics for frontend traffic
- CloudWatch Logs for Lambda functions
- GitHub Actions logs for CI/CD

## Related Documentation

- [Blog Architecture](./blog.md)
- [Labs Architecture](./labs.md)
- [Backend (SST)](./backend-sst.md)
- [CI/CD Workflows](./ci-cd.md)
- [SST Development Guide](../sst-api-development.md)
- [AWS OIDC Setup](../aws-oidc-setup.md)
