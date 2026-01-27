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
│  │                     apps/web (Astro)                                 │    │
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
│                          AWS API GATEWAY                                     │
│                         (ap-south-1 region)                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Routes:                                                             │    │
│  │  GET  /auth/github          → Lambda (OAuth redirect)                │    │
│  │  GET  /auth/github/callback → Lambda (OAuth callback)                │    │
│  │  POST /auth/verify          → Lambda (JWT verification)              │    │
│  │  POST /auth/logout          → Lambda (Session cleanup)               │    │
│  │  GET  /exercises            → Lambda (List exercises)                │    │
│  │  GET  /exercises/{id}       → Lambda (Get exercise)                  │    │
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
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      │
│  │    Users     │  │   Progress   │  │   Sessions   │                      │
│  │  (profiles)  │  │ (completions)│  │   (tokens)   │                      │
│  └──────────────┘  └──────────────┘  └──────────────┘                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Components

### Frontend (apps/web)

The Astro-based frontend serves both the blog and labs:

| Feature | Technology | Description |
|---------|------------|-------------|
| Static Site Generation | Astro 5.x | Blog posts, landing pages |
| Interactive Islands | Solid.js | Auth status, progress tracking |
| Styling | Tailwind CSS v4 | Tokyo Night theme |
| Content | MDX | Blog posts and lab exercises |

### Backend (packages/api)

Serverless API built with SST:

| Component | Technology | Description |
|-----------|------------|-------------|
| Runtime | AWS Lambda | Node.js 20 functions |
| API | API Gateway v2 | HTTP API with CORS |
| Auth | GitHub OAuth + JWT | Stateless authentication |
| Database | DynamoDB | Single-table design |

### Infrastructure (infra/)

SST infrastructure-as-code:

| File | Purpose |
|------|---------|
| `sst.config.ts` | App configuration |
| `infra/database.ts` | DynamoDB tables |
| `infra/auth.ts` | Secrets management |
| `infra/api.ts` | API Gateway routes |

## Data Flow

### Authentication Flow

```
1. User clicks "Login with GitHub"
2. Frontend redirects to /auth/github
3. Lambda redirects to GitHub OAuth
4. GitHub redirects back with code
5. Lambda exchanges code for token
6. Lambda creates user in DynamoDB
7. Lambda creates JWT
8. Redirect to frontend with JWT
9. Frontend stores JWT in localStorage
```

### Exercise Completion Flow

```
1. User completes exercise locally
2. User runs verification command
3. Frontend sends POST /exercises/{id}/verify
4. Lambda validates JWT
5. Lambda records completion in DynamoDB
6. Lambda returns updated progress
7. Frontend updates UI
```

## Environments

| Environment | Frontend URL | API Stage | Purpose |
|-------------|--------------|-----------|---------|
| Development | localhost:4321 | (local) | Local development |
| Preview | preview.works-on-my.cloud | preview | PR previews |
| Production | works-on-my.cloud | prod | Live site |

## Security

### Authentication
- GitHub OAuth for user identity
- JWT tokens (7-day expiry)
- Secure HTTP-only considerations for production

### API Security
- CORS restricted to frontend origins
- JWT validation on protected routes
- DynamoDB IAM roles per Lambda

### Secrets Management
- SST Secrets for sensitive values
- Per-stage secret isolation
- No secrets in code or git

## Scalability

### Frontend
- Cloudflare Pages CDN
- Edge caching for static assets
- Incremental static regeneration

### Backend
- Lambda auto-scaling
- DynamoDB on-demand capacity
- API Gateway managed scaling

## Monitoring

### Current
- Cloudflare analytics (frontend)
- CloudWatch Logs (Lambda)
- GitHub Actions logs (CI/CD)

### Planned
- OpenTelemetry integration
- Custom dashboards
- Error tracking (Sentry)

## Related Documentation

- [Blog Architecture](./blog.md)
- [Labs Architecture](./labs.md)
- [Backend (SST)](./backend-sst.md)
- [CI/CD Workflows](./ci-cd.md)
- [SST Development Guide](../sst-api-development.md)
