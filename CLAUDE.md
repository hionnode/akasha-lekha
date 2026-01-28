# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Akasha Lekha is a pnpm monorepo combining a developer-focused technical blog with interactive hands-on labs. Domain: works-on-my.cloud

**Core Concept:** Users read exercise instructions on the web, perform tasks locally (terminal/editor), then run a CLI command to verify completion. Progress is tracked via GitHub OAuth authentication.

## Commands

```bash
# Development
pnpm dev              # Start blog (Astro) at localhost:4321
pnpm dev:api          # Start API (SST dev mode - deploys real AWS resources, routes Lambda to local)
pnpm dev:all          # Run both concurrently

# Testing
pnpm test             # Run all tests (Vitest)
pnpm test:web         # Web app tests only
pnpm test:api         # API tests only
pnpm test:e2e         # Playwright E2E tests (Chromium, Firefox, Safari, mobile)

# Single test file
pnpm --filter @akasha/web test src/test/components/MyComponent.test.ts
pnpm --filter @akasha/api test src/functions/auth/auth.test.ts

# Quality
pnpm lint             # Lint all packages (ESLint flat config)
pnpm typecheck        # TypeScript check all packages
pnpm validate:blog    # Validate blog post frontmatter

# Database
pnpm db:local         # Start local DynamoDB + Admin UI (Docker)
pnpm db:local:stop    # Stop local DynamoDB
# DynamoDB Local: http://localhost:8000
# Admin UI: http://localhost:8001

# SST Commands
pnpm sst dev                          # Live Lambda development (hot reload)
pnpm sst deploy --stage preview       # Deploy to preview
pnpm sst deploy --stage prod          # Deploy to production (protected)
pnpm sst secret set KEY value --stage preview  # Set secret
pnpm sst secret list --stage preview  # List secrets
pnpm sst output --stage preview       # View API URL, table names
pnpm sst remove --stage dev           # Remove all resources for a stage
```

## System Architecture

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
                                    │ API Calls (fetch)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AWS API GATEWAY (ap-south-1)                        │
│  Routes:                                                                     │
│  GET  /auth/github          → Lambda (OAuth redirect)                        │
│  GET  /auth/github/callback → Lambda (OAuth callback, creates JWT)           │
│  POST /auth/verify          → Lambda (JWT verification)                      │
│  POST /auth/logout          → Lambda (Session cleanup)                       │
│  GET  /exercises            → Lambda (List exercises)                        │
│  GET  /exercises/{id}       → Lambda (Get exercise)                          │
│  GET  /progress             → Lambda (User progress)                         │
│  POST /exercises/{id}/verify→ Lambda (Record completion)                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AWS DYNAMODB (Single-Table Design)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      │
│  │    Users     │  │   Progress   │  │   Sessions   │                      │
│  │  pk=USER#id  │  │ pk=USER#id   │  │pk=SESSION#hash│                     │
│  │  sk=PROFILE  │  │sk=EXERCISE#id│  │ sk=USER#id   │                      │
│  └──────────────┘  └──────────────┘  └──────────────┘                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Monorepo Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              akasha-lekha                                    │
│                           pnpm monorepo                                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │                          │                          │
         ▼                          ▼                          ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│    apps/web     │      │  packages/api   │      │ packages/types  │
│   @akasha/web   │      │   @akasha/api   │      │  @akasha/types  │
├─────────────────┤      ├─────────────────┤      ├─────────────────┤
│ • Astro 5.x     │      │ • Lambda funcs  │      │ • Shared types  │
│ • Solid.js      │      │ • Auth handlers │      │ • API contracts │
│ • Tailwind v4   │      │ • DynamoDB ops  │      │ • Zod schemas   │
│ • MDX content   │      │ • Response lib  │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │                          │                          │
         │                          │                          │
         ▼                          ▼                          │
┌─────────────────┐      ┌─────────────────┐                   │
│  Cloudflare     │      │      AWS        │                   │
│    Pages        │      │  (ap-south-1)   │                   │
├─────────────────┤      ├─────────────────┤                   │
│ • Static site   │ ───> │ • API Gateway   │ <─────────────────┘
│ • CDN edge      │      │ • Lambda        │
│ • Preview/Prod  │      │ • DynamoDB      │
└─────────────────┘      └─────────────────┘
```

```
akasha-lekha/
├── apps/web/                      # @akasha/web - Astro 5 frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── blog/              # Blog-specific components
│   │   │   ├── labs/              # Labs components + islands/
│   │   │   │   └── islands/       # Solid.js interactive components
│   │   │   ├── landing/           # Homepage components
│   │   │   ├── layout/            # Layout components
│   │   │   ├── shared/            # Reusable components
│   │   │   └── tui/               # Terminal UI components
│   │   ├── content/
│   │   │   ├── blog/              # Blog posts (MDX)
│   │   │   ├── labs/modules/      # Lab module definitions
│   │   │   └── labs/exercises/    # Exercise definitions
│   │   ├── pages/
│   │   │   ├── blog/[...slug].astro
│   │   │   └── labs/modules/[...slug].astro
│   │   ├── styles/global.css      # Global styles + Tailwind
│   │   └── utils/                 # Utility functions
│   ├── astro.config.mjs
│   ├── vitest.config.ts
│   └── playwright.config.ts
├── packages/
│   ├── api/                       # @akasha/api - Lambda functions
│   │   └── src/
│   │       ├── functions/
│   │       │   ├── auth/          # github.ts, callback.ts, verify.ts, logout.ts
│   │       │   ├── exercises/     # list.ts, get.ts
│   │       │   └── progress/      # get.ts, record.ts
│   │       └── lib/
│   │           ├── db.ts          # DynamoDB client
│   │           ├── auth.ts        # JWT utilities
│   │           └── response.ts    # HTTP helpers (json, error, redirect)
│   └── types/                     # @akasha/types - Shared TypeScript types
├── infra/                         # SST infrastructure-as-code
│   ├── api.ts                     # API Gateway routes + Lambda config
│   ├── auth.ts                    # Secrets (GithubClientId, GithubClientSecret, JwtSecret)
│   └── database.ts                # DynamoDB tables (Users, Progress, Sessions)
├── sst.config.ts                  # SST app config (akasha-labs, ap-south-1)
├── docker-compose.yml             # Local DynamoDB
└── .github/workflows/             # CI/CD
    ├── ci.yml                     # Quality checks (path-filtered)
    ├── web-preview.yml            # Cloudflare preview on PR
    ├── web-production.yml         # Cloudflare production on main
    └── api-deploy.yml             # SST deploy (preview on PR, prod on main)
```

## Frontend (apps/web)

### Tech Stack
- **Astro 5.x** - Static site generation with MDX content
- **Solid.js** - Interactive islands (auth status, progress tracking, clipboard)
- **Tailwind CSS v4** - Tokyo Night theme (dark mode only)
- **Typography** - Inconsolata monospace font throughout

### Content Collections

Blog and lab content uses Astro Content Collections with Zod schemas in `src/content/config.ts`.

**Blog Schema:**
```typescript
{
  title: z.string(),
  date: z.string(),                   // YYYY-MM-DD format
  updated: z.string().optional(),     // Last updated date
  excerpt: z.string(),                // Brief description for cards
  description: z.string().optional(), // SEO meta description
  author: z.string().optional(),
  tags: z.array(z.string()),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  series: z.string().optional(),      // Must match folder name
  seriesPart: z.number().optional(),
  seriesTotal: z.number().optional(),
}
```

**Module Schema:**
```typescript
{
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  order: z.number().int().positive(),           // Display order
  icon: z.string().optional(),                  // Emoji or icon
  prerequisites: z.array(z.string()).optional(),
  estimatedTime: z.string().min(1),             // "2-3 hours"
  exerciseCount: z.number().int().nonnegative(),
  status: z.enum(['available', 'coming-soon', 'beta']).default('available'),
}
```

**Exercise Schema:**
```typescript
{
  id: z.string().min(1),
  module: z.string().min(1),                    // Reference to module
  order: z.number().int().positive(),           // Order within module
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedTime: z.string().min(1),             // "15 minutes"
  objectives: z.array(z.string()).min(1),
  verificationCriteria: z.array(z.string()).min(1),
  hints: z.array(z.string()).optional(),
  cliCommand: z.string().startsWith('infra-learn'),  // Verification command
}
```

### MDX Components

**Callout Directives:**
```markdown
:::tip
Best practices, helpful suggestions
:::

:::note
Important information to remember
:::

:::info
Additional context, background
:::

:::warning
Cost implications, breaking changes
:::

:::caution
Data loss, security issues, system failures
:::
```

**Steps Component:**
```markdown
:::steps
1. First step
2. Second step
3. Third step
:::
```

**Package Manager Switcher:**
````markdown
:::package-manager
```bash npm
npm install package-name
```

```bash pnpm
pnpm add package-name
```

```bash yarn
yarn add package-name
```
:::
````

**Code Block Enhancements:**
````markdown
```typescript title="example.ts"
// Shows filename header with file icon
```

```bash terminal
# Shows terminal window with macOS controls
```
````

### Interactive Islands (Solid.js)

Located in `apps/web/src/components/labs/islands/`:
- `AuthStatus.tsx` - Login/logout button
- `ProgressTracker.tsx` - Real-time progress updates
- `CLICommandCopy.tsx` - Copy-to-clipboard

Usage in Astro:
```astro
<AuthStatus client:load />
```

## Backend (packages/api + infra/)

### Lambda Handler Pattern

```typescript
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Resource } from "sst";
import { json, error, redirect } from "../../lib/response";
import { db, GetCommand, PutCommand } from "../../lib/db";
import { verifyToken, getTokenFromHeader } from "../../lib/auth";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  // Access linked resources
  const secret = Resource.JwtSecret.value;
  const tableName = Resource.Users.name;

  // Access request data
  const id = event.pathParameters?.id;
  const query = event.queryStringParameters?.page;
  const body = event.body ? JSON.parse(event.body) : null;
  const authHeader = event.headers.authorization;

  // Auth check
  const token = getTokenFromHeader(authHeader);
  if (!token) return error("Missing authorization", 401);
  const payload = verifyToken(token);
  if (!payload) return error("Invalid token", 401);

  // DynamoDB operations
  const result = await db.send(new GetCommand({
    TableName: Resource.Users.name,
    Key: { pk: `USER#${payload.sub}`, sk: "PROFILE" },
  }));

  // Responses
  return json({ data: "success" });        // 200
  return json({ data: "created" }, 201);   // 201
  return error("Not found", 404);          // 404
  return redirect("https://...");          // 302
};
```

### Adding New Routes

1. **Define route in `infra/api.ts`:**
```typescript
api.route("POST /new-route/{id}", {
  handler: "packages/api/src/functions/domain/handler.handler",
  link: [auth.jwtSecret, database.usersTable],
  environment: { CUSTOM_VAR: "value" },
});
```

2. **Create handler in `packages/api/src/functions/domain/handler.ts`**

3. **Run `pnpm sst dev` to generate TypeScript types in `.sst/`**

### DynamoDB Key Patterns

| Entity | PK | SK | GSI1PK | GSI1SK |
|--------|----|----|--------|--------|
| User | `USER#<github_id>` | `PROFILE` | `EMAIL#<email>` | `USER#<github_id>` |
| Progress | `USER#<github_id>` | `EXERCISE#<exercise_id>` | `EXERCISE#<id>` | `COMPLETED#<timestamp>` |
| Session | `SESSION#<token_hash>` | `USER#<github_id>` | - | - |

### Secrets Management

```bash
# Required secrets per stage
pnpm sst secret set GithubClientId <value> --stage preview
pnpm sst secret set GithubClientSecret <value> --stage preview
pnpm sst secret set JwtSecret $(openssl rand -base64 32) --stage preview
```

Access in handlers: `Resource.GithubClientId.value`

## Blog Content Guidelines

### Standalone Posts
Place in `apps/web/src/content/blog/` with filename `YYYY-MM-DD-slug.mdx`

### Multi-Part Series
Organize in folders matching the series slug:
```
blog/eks-deep-dive/
├── 01-introduction.mdx
├── 02-setup.mdx
└── 03-networking.mdx
```

Frontmatter:
```yaml
series: "eks-deep-dive"    # Must match folder name exactly
seriesPart: 1              # seriesTotal auto-calculated from folder contents
```

### URLs
- Standalone: `/blog/2024-12-01-my-post`
- Series: `/blog/eks-deep-dive/01-introduction`

## CI/CD

### Path-Based Triggering

| Change | CI | Web Preview | Web Production | API Deploy |
|--------|----|----|----|----|
| `apps/web/**` | web job | yes | yes | no |
| `packages/api/**` | api job | no | no | yes |
| `packages/types/**` | types job | yes | yes | yes |
| `infra/**`, `sst.config.ts` | detect | no | no | yes |

### Workflows

- **ci.yml** - Lint, typecheck, test, build (path-filtered jobs)
- **web-preview.yml** - Cloudflare Pages preview on PR, posts URL comment
- **web-production.yml** - Cloudflare Pages production on main merge
- **api-deploy.yml** - SST deploy (preview on PR, prod on main), uses AWS OIDC

### Required GitHub Secrets
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID
- `AWS_ROLE_ARN` - IAM role ARN for OIDC authentication

## Environments

| Environment | Frontend | API Stage | Purpose |
|-------------|----------|-----------|---------|
| Development | localhost:4321 | local | Local development |
| Preview | preview.works-on-my.cloud | preview | PR previews |
| Production | works-on-my.cloud | prod | Live site |

## Key Configuration

- **TypeScript**: Strict mode, ES2022 target, ESNext modules
- **Prettier**: 2 spaces, semicolons, single quotes, 100 char width
- **ESLint**: Flat config with TypeScript and Astro plugins
- **Pre-commit hooks (Husky)**: lint-staged → blog validation → typecheck → build
- **SST stages**: `dev`, `preview`, `prod` (prod is protected, resources retained)
