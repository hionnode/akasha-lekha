# Architecture

Comprehensive architecture documentation for Akasha Lekha. Updated with every merge to `main`.

---

## Table of Contents

- [System Overview](#system-overview)
- [Evolution Timeline](#evolution-timeline)
- [Monorepo Layout](#monorepo-layout)
- [Request Flow](#request-flow)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Design](#database-design)
- [Authentication Flow](#authentication-flow)
- [Content System](#content-system)
- [Styling & Theme System](#styling--theme-system)
- [CI/CD Pipeline](#cicd-pipeline)
- [Local Development](#local-development)
- [Shared Type Contracts](#shared-type-contracts)
- [Security Decisions](#security-decisions)
- [Cost Optimization](#cost-optimization)
- [Known Gaps & Future Work](#known-gaps--future-work)
- [Changelog](#changelog)

---

## System Overview

Akasha Lekha is a pnpm monorepo combining a developer-focused technical blog with interactive hands-on labs. Users read exercise instructions on the web, perform tasks locally (terminal/editor), then run a CLI command to verify completion.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   USERS                                         │
│                        Browser / CLI (infra-learn)                               │
└────────────────────────────────┬────────────────────────────────────────────────┘
                                 │
              ┌──────────────────┴──────────────────┐
              │                                     │
              ▼                                     ▼
┌──────────────────────────┐          ┌──────────────────────────────┐
│    CLOUDFLARE PAGES      │          │   AWS (ap-south-1 / Mumbai)  │
│                          │          │                              │
│  ┌────────────────────┐  │  fetch   │  ┌────────────────────────┐  │
│  │   apps/web (Astro) │  │ ──────>  │  │   API Gateway v2       │  │
│  │                    │  │          │  │   (HTTP API + CORS)    │  │
│  │  • Blog (/blog/*)  │  │          │  └───────────┬────────────┘  │
│  │  • Labs (/labs/*)  │  │          │              │               │
│  │  • TUI  (/tui)    │  │          │  ┌───────────▼────────────┐  │
│  │  • Tools           │  │          │  │   Lambda Functions     │  │
│  └────────────────────┘  │          │  │   (Node.js 20)         │  │
│                          │          │  │                        │  │
│  Static HTML + JS        │          │  │  • Auth (GitHub OAuth) │  │
│  CDN Edge (global)       │          │  │  • Exercises (CRUD)    │  │
│  Preview + Production    │          │  │  • Progress (tracking) │  │
└──────────────────────────┘          │  └───────────┬────────────┘  │
                                      │              │               │
                                      │  ┌───────────▼────────────┐  │
                                      │  │   DynamoDB             │  │
                                      │  │   (Single-Table Design)│  │
                                      │  │                        │  │
                                      │  │  Users    ─ profiles   │  │
                                      │  │  Progress ─ completions│  │
                                      │  │  Sessions ─ auth (TTL) │  │
                                      │  └────────────────────────┘  │
                                      │                              │
                                      │  SST Secrets (SSM)           │
                                      │  • GithubClientId            │
                                      │  • GithubClientSecret        │
                                      │  • JwtSecret                 │
                                      └──────────────────────────────┘
```

### Why This Stack

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Static Site Generator | **Astro 5** | Best-in-class performance, MDX support, island architecture for selective hydration |
| Interactive Islands | **Solid.js** | Smaller bundles than React (no VDOM), fine-grained reactivity, perfect for small interactive widgets |
| CSS Framework | **Tailwind v4** | Utility-first with `@theme` directive for Tokyo Night variables, `@tailwindcss/vite` integration |
| Backend Framework | **SST v3** | TypeScript infrastructure-as-code, type-safe resource references via `Resource.*`, live Lambda dev mode |
| Database | **DynamoDB** | Serverless pay-per-request, single-table design for cost efficiency, TTL for session cleanup |
| Frontend Hosting | **Cloudflare Pages** | Global edge CDN, instant cache invalidation, preview deployments, free tier |
| API Hosting | **AWS Lambda + API Gateway** | Serverless, pay-per-request, same region as database |
| AWS Region | **ap-south-1 (Mumbai)** | Lower latency for primary user base |
| Package Manager | **pnpm** | Disk-efficient, strict dependency resolution, workspace protocol |
| Auth Provider | **GitHub OAuth** | Target audience is developers, no password management overhead |

---

## Evolution Timeline

The codebase evolved through distinct phases, visible in the git history:

```
Phase 1: Static Blog                    Phase 2: UX Polish
────────────────────                    ──────────────────
8fa9b67 initial setup                   d356317 UX Audit (#3)
5ac79ca updated readme                   ├─ interactive validation
d3467d6 basic functionality              ├─ GuideStep component
3d560b8 actions setup (#1)               ├─ technical SEO
85c721c actions setup (#2)               └─ PR preview action

Phase 3: Blog Foundation               Phase 4: Labs + Backend
─────────────────────────               ────────────────────────
7f00cec blog as home page (#5)          c4ab6e4 Feat/labs setup (#8)
2bc1d8d IAM blog (#6)                    ├─ 204b36e restructure as monorepo
 ├─ collapsible code blocks              ├─ 3bded23 shared types package
 └─ ASCII diagram detection              ├─ a099221 SST infrastructure
1467f18 base blog (#7)                   ├─ a24a5e2 API Lambda handlers
 ├─ terraform fundamentals              ├─ 273937c local DynamoDB (Docker)
 ├─ otel setup                          ├─ ce755d9 GitHub Actions for monorepo
 └─ UX fixes                            └─ cb7b57d AWS OIDC auth

Phase 5: Documentation                 Phase 6: CI Hardening
───────────────────────                 ──────────────────────
cd84d5f docs: schemas + ASCII (#9)      82b1bfe CI + blog validation (#10)
                                        a89cfc5 CI improvements (#11)
```

### Key Architectural Pivots

1. **Single Astro app → pnpm monorepo** (`204b36e`): Adding labs required a backend. Restructured `apps/web` + `packages/api` + `packages/types` to share code.
2. **Static credentials → OIDC** (`cb7b57d`): Replaced long-lived AWS access keys with GitHub OIDC federation for keyless CI/CD deployments.
3. **Separate tables → single-table design**: Chose DynamoDB single-table pattern from the start to avoid migration costs later. Three tables used (Users, Progress, Sessions) but each uses composite keys for flexible access patterns.

---

## Monorepo Layout

```
akasha-lekha/
│
├─── apps/
│    └─── web/                         @akasha/web
│         ├─── src/
│         │    ├─── components/
│         │    │    ├─── blog/          Blog-specific (post cards, tags)
│         │    │    ├─── labs/
│         │    │    │    ├─── islands/   Solid.js: AuthStatus, ProgressTracker, CLICommandCopy
│         │    │    │    └─── layout/    LabsHeader, LabsSidebar
│         │    │    ├─── landing/        TerminalHero, FastfetchOutput
│         │    │    ├─── layout/         Header, Footer, Container, Sidebars
│         │    │    ├─── shared/         35+ reusable: Alert, CodeSwitcher, FileTree, SEO...
│         │    │    └─── tui/            Terminal UI: TUILayout, ContentViewer, SearchBar...
│         │    ├─── content/
│         │    │    ├─── blog/           MDX posts (standalone + series folders)
│         │    │    └─── labs/
│         │    │         ├─── modules/   Module definitions (learning tracks)
│         │    │         ├─── exercises/ Exercise definitions
│         │    │         └─── schemas.ts Zod validation (with tests)
│         │    ├─── pages/              Astro file-based routing
│         │    ├─── styles/global.css   Tailwind v4 + Tokyo Night theme
│         │    └─── utils/              Remark/Rehype plugins, helpers
│         ├─── e2e/                     Playwright E2E tests
│         ├─── wrangler.jsonc           Cloudflare Workers config
│         └─── astro.config.mjs
│
├─── packages/
│    ├─── api/                         @akasha/api
│    │    └─── src/
│    │         ├─── functions/
│    │         │    ├─── auth/          github.ts, callback.ts, verify.ts, logout.ts
│    │         │    ├─── exercises/     list.ts, get.ts
│    │         │    └─── progress/      get.ts, record.ts
│    │         └─── lib/
│    │              ├─── response.ts    json(), error(), redirect()
│    │              ├─── auth.ts        createToken(), verifyToken(), getTokenFromHeader()
│    │              └─── db.ts          DynamoDB client (local + AWS)
│    │
│    ├─── db/                          @akasha/db (stub - seeds/migrations)
│    │
│    └─── types/                       @akasha/types
│         └─── src/
│              ├─── api.ts             ApiResponse<T>, AuthTokenResponse, ApiErrorCode
│              ├─── user.ts            User, Session, JwtPayload
│              ├─── exercise.ts        Exercise, Module, ExerciseManifest, VerificationCheck
│              └─── progress.ts        Progress, UserProgress, ModuleProgress
│
├─── infra/                            SST infrastructure-as-code
│    ├─── api.ts                       API Gateway routes + CORS
│    ├─── auth.ts                      SST Secrets (SSM Parameter Store)
│    └─── database.ts                  DynamoDB tables + GSIs
│
├─── scripts/
│    └─── validate-blog-posts.mjs      Frontmatter validation (Zod + gray-matter)
│
├─── sst.config.ts                     SST app: akasha-labs, ap-south-1
├─── docker-compose.yml                DynamoDB Local + Admin UI
└─── .github/workflows/                CI/CD (4 workflows)
```

### Workspace Dependencies

```
┌──────────────┐     workspace:*     ┌──────────────┐
│  @akasha/web │ ──────────────────> │ @akasha/types │
└──────────────┘                     └──────────────┘
                                            ▲
┌──────────────┐     workspace:*            │
│  @akasha/api │ ───────────────────────────┘
└──────────────┘

pnpm-workspace.yaml:
  packages:
    - 'apps/*'
    - 'packages/*'
```

**Why `workspace:*`**: Always uses the local version. No version mismatches. Changes in `@akasha/types` are instantly available without re-installing.

---

## Request Flow

### Static Content (Blog / Labs Pages)

```
Browser                 Cloudflare Edge              Origin (Build Artifact)
   │                         │                              │
   │  GET /blog/my-post      │                              │
   │ ───────────────────>    │                              │
   │                         │  Cache HIT?                  │
   │                         │  ┌─ Yes ─> serve from edge   │
   │  <200 HTML>             │  │                           │
   │ <───────────────────    │  │                           │
   │                         │  └─ No ──> fetch from origin │
   │                         │           ──────────────>    │
   │                         │  <HTML>                      │
   │                         │  <────────────────────       │
   │  <200 HTML>             │  (cache + serve)             │
   │ <───────────────────    │                              │
```

### API Request (Authenticated)

```
Browser                  API Gateway              Lambda              DynamoDB
   │                         │                      │                     │
   │  POST /exercises/01/    │                      │                     │
   │       verify            │                      │                     │
   │  Authorization:         │                      │                     │
   │    Bearer <jwt>         │                      │                     │
   │ ───────────────────>    │                      │                     │
   │                         │  CORS check          │                     │
   │                         │  (origin allowlist)  │                     │
   │                         │ ──────────────────>  │                     │
   │                         │                      │  verifyToken(jwt)   │
   │                         │                      │  ─ decode + verify  │
   │                         │                      │                     │
   │                         │                      │  GetCommand         │
   │                         │                      │ ──────────────────> │
   │                         │                      │  <user progress>    │
   │                         │                      │ <────────────────── │
   │                         │                      │                     │
   │                         │                      │  PutCommand         │
   │                         │                      │ ──────────────────> │
   │                         │                      │  <ack>              │
   │                         │                      │ <────────────────── │
   │                         │                      │                     │
   │                         │  <json response>     │                     │
   │                         │ <──────────────────  │                     │
   │  <200 JSON>             │                      │                     │
   │ <───────────────────    │                      │                     │
```

---

## Frontend Architecture

### Rendering Strategy

```
┌───────────────────────────────────────────────────────────────────┐
│                        Build Time (Astro)                         │
│                                                                   │
│  MDX Files ──> Remark Plugins ──> Rehype Plugins ──> Static HTML │
│                                                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────┐   │
│  │ remarkDir-  │  │ remarkCall-  │  │ rehypeSlug            │   │
│  │ ective      │  │ outs         │  │ rehypeAutolinkHeadings│   │
│  │ (:::syntax) │  │ (tip/note/   │  │ rehypeCodeSwitcherPOC │   │
│  │             │  │  warning)    │  │                       │   │
│  ├─────────────┤  ├──────────────┤  └───────────────────────┘   │
│  │ remarkCode- │  │ remarkSteps  │                               │
│  │ Meta        │  │ (:::steps)   │                               │
│  │ (title="..")│  ├──────────────┤                               │
│  │             │  │ remarkCode-  │                               │
│  │             │  │ SwitcherPOC  │                               │
│  └─────────────┘  └──────────────┘                               │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────┐
│                       Runtime (Browser)                           │
│                                                                   │
│  Static HTML (pre-rendered) + Solid.js Islands (hydrated)        │
│                                                                   │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │ <AuthStatus     │  │ <ProgressTracker │  │ <CLICommandCopy│  │
│  │  client:load /> │  │  client:load />  │  │  client:load />│  │
│  │                 │  │                  │  │                │  │
│  │ Login/Logout    │  │ Real-time        │  │ Copy to        │  │
│  │ button          │  │ progress bars    │  │ clipboard      │  │
│  └─────────────────┘  └──────────────────┘  └────────────────┘  │
│                                                                   │
│  Everything else = zero JavaScript (static HTML)                 │
└───────────────────────────────────────────────────────────────────┘
```

**Why static output**: Best performance (pre-rendered HTML), SEO-friendly, deployable to any CDN. Solid.js islands hydrate only the interactive parts.

**Why POC code switcher**: The codebase has both standard (`remarkCodeSwitcher.ts`) and POC (`remarkCodeSwitcher.poc.ts`) versions. The POC version is currently active in `astro.config.mjs`. This allows iterating on the code switcher design without breaking the stable version.

### Page Architecture

```
┌───────────────────────────────────────────────────────────┐
│                    Blog Post Layout                        │
│                                                            │
│  ┌──────────┐  ┌──────────────────────┐  ┌─────────────┐ │
│  │  LEFT    │  │      CENTER          │  │   RIGHT     │ │
│  │  SIDEBAR │  │                      │  │   SIDEBAR   │ │
│  │          │  │   Blog Content       │  │             │ │
│  │ Blog     │  │   (MDX rendered)     │  │  TOC        │ │
│  │ Sidebar  │  │   max-width: 1000px  │  │  Minimap    │ │
│  │ (250px)  │  │                      │  │  (280px)    │ │
│  │          │  │   Callouts           │  │             │ │
│  │ Series   │  │   Code blocks        │  │  Headings   │ │
│  │ Nav      │  │   Steps              │  │  scroll-spy │ │
│  │          │  │   ASCII diagrams     │  │             │ │
│  └──────────┘  └──────────────────────┘  └─────────────┘ │
│                                                            │
│  Three-column grid: 250px | 1fr | 280px                   │
│  max-width: 1600px                                         │
│                                                            │
│  ≤1280px: Hide right sidebar (two-column)                  │
│  ≤1024px: Hide both sidebars (single column + drawers)     │
└───────────────────────────────────────────────────────────┘
```

### Route Map

```
/                           index.astro              Landing (TerminalHero)
/blog                       blog/index.astro         Blog listing
/blog/:slug                 blog/[...slug].astro     Blog post / series part
/labs                       labs/index.astro          Labs landing
/labs/dashboard             labs/dashboard.astro      User progress dashboard
/labs/login                 labs/login.astro          Login page
/labs/setup                 labs/setup.astro          Setup instructions
/labs/modules/:slug         labs/modules/[...slug]    Module / exercise pages
/labs/auth/callback         labs/auth/callback.astro  GitHub OAuth callback
/aws                        aws.astro                 AWS resource page
/monitoring                 monitoring.astro          Monitoring page
/tui                        tui.astro                 Terminal UI interface
/tools/aws-latency          tools/aws-latency.astro   AWS region latency tool
/404                        404.astro                 Not found
/rss.xml                    rss.xml.ts                RSS feed
```

### TUI (Terminal UI)

The `/tui` page provides a terminal-like browsing interface with keyboard-first navigation.

```
┌─────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ContentTypeNav  [all] [blog] [labs] [tools]         │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ SearchBar       / to search  │  TagFilter  t to tag │   │
│  ├─────────────────┬───────────────────────────────────┤   │
│  │                 │                                   │   │
│  │  ContentList    │        ContentViewer              │   │
│  │                 │                                   │   │
│  │  > item 1  ←── │   Title                           │   │
│  │    item 2      │   ─────                           │   │
│  │    item 3      │   Content preview...              │   │
│  │    item 4      │                                   │   │
│  │                 │                                   │   │
│  ├─────────────────┴───────────────────────────────────┤   │
│  │ StatusBar      vim: j/k   arrows: ↑/↓   q: quit   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

Keyboard modes (stored in localStorage):
  vim:    j/k navigate, / search, t tags, Enter select, Esc clear
  arrows: ↑/↓ navigate, same modifiers

Controlled by: TUIController.ts (event-driven state machine)
```

---

## Backend Architecture

### API Route Map

```
┌──────────────────────────────────────────────────────────────────┐
│                     API Gateway v2 (HTTP API)                     │
│                     CORS: stage-specific origin                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  PUBLIC ROUTES (no auth required)                                 │
│  ─────────────────────────────────                                │
│  GET  /auth/github           ──> github.handler                   │
│       Links: [GithubClientId]                                     │
│       Redirects to GitHub OAuth consent screen                    │
│                                                                   │
│  GET  /auth/github/callback  ──> callback.handler                 │
│       Links: [GithubClientId, GithubClientSecret,                 │
│               JwtSecret, Users, Sessions]                         │
│       Exchanges code for token, creates JWT + session             │
│                                                                   │
│  GET  /exercises             ──> exercises/list.handler            │
│       No links (reads from content, not DB)                       │
│                                                                   │
│  GET  /exercises/{id}        ──> exercises/get.handler             │
│       No links                                                    │
│                                                                   │
│  AUTHENTICATED ROUTES (JWT required)                              │
│  ────────────────────────────────────                              │
│  POST /auth/verify           ──> verify.handler                   │
│       Links: [JwtSecret, Sessions]                                │
│                                                                   │
│  POST /auth/logout           ──> logout.handler                   │
│       Links: [Sessions]                                           │
│                                                                   │
│  GET  /progress              ──> progress/get.handler              │
│       Links: [JwtSecret, Progress, Sessions]                      │
│                                                                   │
│  POST /exercises/{id}/verify ──> progress/record.handler           │
│       Links: [JwtSecret, Progress, Sessions]                      │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### CORS Configuration

```typescript
// infra/api.ts - stage-specific origins
const frontendUrls: Record<string, string> = {
  prod:    "https://works-on-my.cloud",
  preview: "https://preview.works-on-my.cloud",
};
const frontendUrl = frontendUrls[$app.stage] || "http://localhost:4321";

cors: {
  allowOrigins:     [frontendUrl],
  allowMethods:     ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders:     ["Content-Type", "Authorization"],
  allowCredentials: true,  // Required for cookies/auth headers
}
```

**Why stage-specific CORS**: Only the matching frontend can call the API. Localhost is the fallback for dev/unnamed stages.

### Lambda Handler Pattern

Every handler follows this pattern:

```
┌─────────────────────────────────────────┐
│              Lambda Handler              │
│                                          │
│  1. Parse request (path params, body,    │
│     query strings, headers)              │
│                                          │
│  2. Auth check (if required):            │
│     getTokenFromHeader(authHeader)       │
│     verifyToken(token) → JwtPayload      │
│     Return 401 if invalid                │
│                                          │
│  3. Business logic:                      │
│     DynamoDB operations via db.send()    │
│     Access secrets via Resource.*        │
│                                          │
│  4. Return standardized response:        │
│     json(data, statusCode)   → 200/201   │
│     error(message, code)     → 400/401   │
│     redirect(url)            → 302       │
└─────────────────────────────────────────┘
```

### Response Library

```typescript
// packages/api/src/lib/response.ts
json(data, statusCode = 200)  → { statusCode, headers: {"Content-Type": "application/json"}, body }
error(message, statusCode = 400) → json({ error: message }, statusCode)
redirect(url)                 → { statusCode: 302, headers: { Location: url }, body: "" }
```

**Why no middleware**: Lambda functions are stateless and short-lived. Each handler is self-contained. Auth checks are explicit in each handler rather than hidden in middleware, making the security boundary visible.

### Auth Library

```typescript
// packages/api/src/lib/auth.ts
createToken(payload)           → jwt.sign(payload, Resource.JwtSecret.value, { expiresIn: "7d" })
verifyToken(token)             → JwtPayload | null  (null on any error)
getTokenFromHeader(authHeader) → token string | null (expects "Bearer <token>")
```

**Why 7-day JWT expiry**: Balances security vs UX. Users re-authenticate weekly. No refresh token complexity.

**Why `null` on verify error**: Simplifies handler logic. No try/catch needed — just `if (!payload) return error("Unauthorized", 401)`.

### DynamoDB Client

```typescript
// packages/api/src/lib/db.ts
const isLocal = process.env.DYNAMODB_ENDPOINT !== undefined;

// Local: endpoint=http://localhost:8000, credentials=local/local
// AWS:   region=ap-south-1, credentials from Lambda execution role

DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true }
});

// Re-exports: GetCommand, PutCommand, QueryCommand, DeleteCommand
```

**Why `removeUndefinedValues`**: DynamoDB rejects `undefined`. JavaScript objects often have optional fields that are `undefined`. This strips them automatically.

---

## Database Design

### Table Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                    DynamoDB - Three Tables                         │
│                    (Single-Table Design per entity group)          │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  USERS TABLE                                                      │
│  ────────────                                                     │
│  Primary:  pk = USER#<github_id>     sk = PROFILE                │
│  GSI1:     gsi1pk = EMAIL#<email>    gsi1sk = USER#<github_id>   │
│                                                                   │
│  ┌─────────────────────┬──────────┬──────────────┬────────────┐  │
│  │ pk                  │ sk       │ gsi1pk       │ gsi1sk     │  │
│  ├─────────────────────┼──────────┼──────────────┼────────────┤  │
│  │ USER#12345          │ PROFILE  │ EMAIL#a@b.c  │ USER#12345 │  │
│  │ USER#67890          │ PROFILE  │ EMAIL#d@e.f  │ USER#67890 │  │
│  └─────────────────────┴──────────┴──────────────┴────────────┘  │
│                                                                   │
│  Access patterns:                                                 │
│    • Get user by GitHub ID:  pk=USER#id, sk=PROFILE              │
│    • Get user by email:      gsi1pk=EMAIL#email                  │
│                                                                   │
│  PROGRESS TABLE                                                   │
│  ──────────────                                                   │
│  Primary:  pk = USER#<github_id>     sk = EXERCISE#<exercise_id> │
│  GSI1:     gsi1pk = EXERCISE#<id>    gsi1sk = COMPLETED#<ts>     │
│                                                                   │
│  ┌────────────┬──────────────────┬──────────────────┬────────────────────┐
│  │ pk         │ sk               │ gsi1pk           │ gsi1sk             │
│  ├────────────┼──────────────────┼──────────────────┼────────────────────┤
│  │ USER#123   │ EXERCISE#lin-01  │ EXERCISE#lin-01  │ COMPLETED#2025-..  │
│  │ USER#123   │ EXERCISE#lin-02  │ EXERCISE#lin-02  │ COMPLETED#2025-..  │
│  │ USER#456   │ EXERCISE#lin-01  │ EXERCISE#lin-01  │ COMPLETED#2025-..  │
│  └────────────┴──────────────────┴──────────────────┴────────────────────┘
│                                                                   │
│  Access patterns:                                                 │
│    • All progress for a user:  pk=USER#id                        │
│    • Specific exercise:        pk=USER#id, sk=EXERCISE#eid       │
│    • All completions of an exercise: gsi1pk=EXERCISE#id          │
│    • Completions sorted by time:     gsi1pk + gsi1sk range       │
│                                                                   │
│  SESSIONS TABLE                                                   │
│  ──────────────                                                   │
│  Primary:  pk = SESSION#<token_hash>  sk = USER#<github_id>      │
│  TTL:      expiresAt (Unix timestamp) — auto-deleted by DynamoDB │
│                                                                   │
│  ┌─────────────────────┬──────────────┬────────────┐             │
│  │ pk                  │ sk           │ expiresAt  │             │
│  ├─────────────────────┼──────────────┼────────────┤             │
│  │ SESSION#a3f8c2..    │ USER#12345   │ 1738000000 │             │
│  └─────────────────────┴──────────────┴────────────┘             │
│                                                                   │
│  Access patterns:                                                 │
│    • Validate session:  pk=SESSION#hash, sk=USER#id              │
│    • Auto-cleanup:      TTL deletes expired sessions (free)      │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Why Three Tables (Not One)

While "single-table design" often means literally one table, this project uses three tables that each follow single-table design principles internally:

1. **Isolation**: Users, Progress, and Sessions have different scaling characteristics
2. **TTL**: Only Sessions needs TTL — a single table would require TTL on all items or none
3. **GSI cost**: Each table has its own GSI with relevant data, avoiding cross-entity index bloat
4. **Security**: IAM policies can restrict Lambda access to specific tables (e.g., logout handler only needs Sessions)

### Why No GSI on Sessions

Sessions are always looked up by their token hash (pk). There's no need to query "all sessions for a user" — logout deletes the specific session, and expired sessions are auto-cleaned by TTL.

---

## Authentication Flow

```
┌────────┐          ┌───────────┐          ┌────────┐         ┌──────────┐
│ Browser│          │API Gateway│          │ GitHub │         │ DynamoDB │
└───┬────┘          └─────┬─────┘          └───┬────┘         └────┬─────┘
    │                     │                    │                   │
    │  1. Click "Login"   │                    │                   │
    │  GET /auth/github   │                    │                   │
    │ ───────────────────> │                    │                   │
    │                     │                    │                   │
    │  2. 302 Redirect    │                    │                   │
    │  Location: github.  │                    │                   │
    │  com/login/oauth/   │                    │                   │
    │  authorize?         │                    │                   │
    │    client_id=...    │                    │                   │
    │    scope=read:user  │                    │                   │
    │      user:email     │                    │                   │
    │    state=<uuid>     │                    │                   │
    │ <─────────────────── │                    │                   │
    │                     │                    │                   │
    │  3. User authorizes │                    │                   │
    │ ────────────────────────────────────────> │                   │
    │                     │                    │                   │
    │  4. Redirect back   │                    │                   │
    │  GET /auth/github/  │                    │                   │
    │  callback?code=...  │                    │                   │
    │ ───────────────────> │                    │                   │
    │                     │                    │                   │
    │                     │  5. Exchange code   │                   │
    │                     │  POST /access_token │                   │
    │                     │ ──────────────────> │                   │
    │                     │  <access_token>     │                   │
    │                     │ <────────────────── │                   │
    │                     │                    │                   │
    │                     │  6. Get user profile│                   │
    │                     │  GET /user          │                   │
    │                     │ ──────────────────> │                   │
    │                     │  <profile>          │                   │
    │                     │ <────────────────── │                   │
    │                     │                    │                   │
    │                     │  7. Upsert user     │                   │
    │                     │ ──────────────────────────────────────> │
    │                     │                    │                   │
    │                     │  8. Create session  │                   │
    │                     │ ──────────────────────────────────────> │
    │                     │                    │                   │
    │                     │  9. Create JWT      │                   │
    │                     │  (7-day expiry)     │                   │
    │                     │                    │                   │
    │  10. 302 Redirect   │                    │                   │
    │  /labs/auth/callback│                    │                   │
    │  ?token=<jwt>       │                    │                   │
    │ <─────────────────── │                    │                   │
    │                     │                    │                   │
    │  11. Store JWT      │                    │                   │
    │  (localStorage)     │                    │                   │
    │                     │                    │                   │
```

**Note**: Steps 5-9 in the callback handler are currently stubbed with TODOs. The OAuth initiation (steps 1-4) is implemented.

### JWT Payload

```typescript
interface JwtPayload {
  sub: string;       // User ID (maps to DynamoDB pk)
  username: string;  // GitHub username
  email?: string;    // Verified email (optional)
  avatarUrl?: string;
  iat: number;       // Issued at (Unix timestamp)
  exp: number;       // Expires at (iat + 7 days)
}
```

**Why `sub` for user ID**: Standard JWT claim. Avoids exposing the GitHub ID directly in the token.

---

## Content System

### Content Collections Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     Astro Content Collections                 │
│                     src/content/config.ts                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  "blog" Collection                                            │
│  ─────────────────                                            │
│  Type: content (MDX)                                          │
│  Schema: title, date (YYYY-MM-DD), excerpt, tags,            │
│          featured, draft, series?, seriesPart?                 │
│                                                               │
│  Standalone: blog/2025-01-15-mdx-features-showcase.mdx       │
│  Series:     blog/aws-for-startups/01-introduction.mdx       │
│              blog/aws-for-startups/02-iam-intro.mdx          │
│                                                               │
│  "labs/modules" Collection                                    │
│  ─────────────────────────                                    │
│  Type: content (MDX)                                          │
│  Schema: id, title, description, order, icon?, prerequisites?,│
│          estimatedTime, exerciseCount, status                 │
│                                                               │
│  "labs/exercises" Collection                                  │
│  ────────────────────────────                                 │
│  Type: content (MDX)                                          │
│  Schema: id, module, order, title, description, difficulty,   │
│          estimatedTime, objectives[], verificationCriteria[], │
│          hints?[], cliCommand (startsWith 'infra-learn')      │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Blog Series Organization

```
content/blog/
├── 2025-01-15-mdx-features-showcase.mdx     ← Standalone post
│                                                URL: /blog/2025-01-15-mdx-features-showcase
│
├── aws-for-startups/                          ← Series folder
│   ├── 01-your-first-60-minutes-in-aws.mdx     URL: /blog/aws-for-startups/01-your-first-...
│   ├── 02-iam-intro-for-starters.mdx            URL: /blog/aws-for-startups/02-iam-intro-...
│   └── 03-local-aws-setup.mdx                   URL: /blog/aws-for-startups/03-local-aws-...
│   Frontmatter: series: "aws-for-startups", seriesPart: 1
│   seriesTotal: auto-calculated from folder file count
│
├── component-guide/                           ← Another series
└── mdx-mastery-series/
```

### MDX Plugin Pipeline

```
MDX Source ──────────────────────────────────────────────────> HTML Output
              │                                      │
              │  REMARK (operates on MDAST)          │  REHYPE (operates on HAST)
              │                                      │
              ├─ remarkDirective                     ├─ rehypeSlug
              │  Parses :::syntax into               │  Adds id= to headings
              │  directive AST nodes                 │
              │                                      ├─ rehypeAutolinkHeadings
              ├─ remarkCallouts                      │  Wraps headings in <a>
              │  :::tip/note/warning/caution/info    │  class="heading-link"
              │  → <div class="callout callout-tip"> │
              │    <div class="callout-header">      ├─ rehypeCodeSwitcherPOC
              │      <svg icon> <span label>         │  Processes code-switcher
              │    <div class="callout-content">     │  groups into tabbed UI
              │                                      │
              ├─ remarkCodeMeta                      │
              │  ```ts title="file.ts"               │
              │  → data-title="file.ts"              │
              │  ```bash terminal                    │
              │  → data-terminal="true"              │
              │                                      │
              ├─ remarkSteps                         │
              │  :::steps + ordered list              │
              │  → <div class="steps-container">     │
              │                                      │
              └─ remarkCodeSwitcherPOC               │
                 :::code-switcher                    │
                 → marked for rehype processing      │
```

### Blog Validation

Pre-commit and CI validation via `scripts/validate-blog-posts.mjs`:

```
validate-blog-posts.mjs
├── Scans apps/web/src/content/blog/ recursively for .mdx files
├── Parses frontmatter with gray-matter
├── Validates against Zod schema:
│   ├── title: string, min 1 char
│   ├── date: regex YYYY-MM-DD
│   ├── excerpt: string, min 10 chars
│   ├── tags: array, min 1 tag
│   ├── featured: boolean (default false)
│   ├── draft: boolean (default false)
│   └── series?, seriesPart?, seriesTotal?
├── Reports errors with file path and field details
└── Exits with code 1 on any failure (blocks commit/CI)
```

---

## Styling & Theme System

### Tokyo Night Color Palette

```
┌────────────────────────────────────────────────────────────┐
│                     Tokyo Night Theme                       │
│                     (Dark mode only)                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  BACKGROUNDS                                               │
│  ███ bg-primary    #1a1b26  Main background                │
│  ███ bg-secondary  #16161e  Deeper panels                  │
│  ███ bg-tertiary   #24283b  Cards, code blocks             │
│                                                            │
│  FOREGROUNDS                                               │
│  ███ fg-primary    #c0caf5  Main text                      │
│  ███ fg-secondary  #a9b1d6  Body text, prose               │
│  ███ fg-muted      #565f89  Subtle text, labels            │
│                                                            │
│  ACCENTS                                                   │
│  ███ accent-blue    #7aa2f7  Links, h2 border, active TOC │
│  ███ accent-cyan    #7dcfff  Hover, h3 color, tips        │
│  ███ accent-green   #9ece6a  Success, bash labels          │
│  ███ accent-yellow  #e0af68  Notes, JS labels              │
│  ███ accent-orange  #ff9e64  Inline code, JSON labels      │
│  ███ accent-red     #f7768e  Caution, terminal dots        │
│  ███ accent-purple  #bb9af7  YAML/TF labels, h4 TOC       │
│  ███ accent-magenta #c0a7e0  Decorative                    │
│                                                            │
│  CHROME                                                    │
│  ███ border  #292e42  Borders, dividers                    │
│  ███ hover   #2f3549  Hover states                         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Typography Scale

```
html   18px  (base, Inconsolata monospace)
h1     48px  (3rem)     bold        tracking: -0.02em
h2     36px  (2.25rem)  semibold    blue left border
h3     28px  (1.75rem)  semibold    cyan color
h4     24px  (1.5rem)   semibold
p      17px  (1.0625rem)            line-height: 1.7
code   15px  (0.9375rem)            in code blocks
inline 0.9em                        orange bg, rounded
```

**Why Inconsolata**: Developer-focused site, consistent character widths for ASCII diagrams, code-editor feel.

**Why 18px base**: Larger than default 16px for better readability on modern displays.

### Code Block Language Colors

```
Language        Color           CSS Variable
────────        ─────           ────────────
JavaScript/JS   yellow          --accent-yellow
TypeScript/TS   blue            --accent-blue
Python          cyan            --accent-cyan
Bash/Shell      green           --accent-green
YAML/YML        purple          --accent-purple
JSON            orange          --accent-orange
Dockerfile      blue            --accent-blue
Go              cyan            --accent-cyan
Rust            orange          --accent-orange
Terraform/HCL   purple          --accent-purple
```

---

## CI/CD Pipeline

### Pipeline Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                        GitHub Actions Workflows                       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ON PULL REQUEST                                                      │
│  ───────────────                                                      │
│                                                                       │
│  ci.yml ─────────────────────────────────────────────────────────────│
│  │                                                                   │
│  │  ┌─────────────┐                                                  │
│  │  │   changes   │ (dorny/paths-filter)                             │
│  │  └──┬──┬──┬──┬─┘                                                  │
│  │     │  │  │  │                                                     │
│  │     │  │  │  └──> blog? ──> validate:blog                         │
│  │     │  │  └─────> types? ─> typecheck                             │
│  │     │  └────────> api? ───> lint + typecheck                      │
│  │     └───────────> web? ───> lint + typecheck + test + build       │
│  │                                     │                              │
│  │                                     └──> e2e (chromium, optional)  │
│  │                                                                   │
│  │  ┌────────────┐                                                   │
│  │  │ ci-success │ (gate job for branch protection)                  │
│  │  └────────────┘                                                   │
│  │                                                                   │
│  web-preview.yml ────────────────────────────────────────────────────│
│  │  (if apps/web/** or packages/types/** changed)                    │
│  │  Build Astro → Deploy to Cloudflare Pages (version upload)        │
│  │  → Post PR comment with preview URL + history table               │
│  │  → Set commit status                                              │
│  │                                                                   │
│  api-deploy.yml ─────────────────────────────────────────────────────│
│  │  (if packages/api/** or infra/** or sst.config.ts changed)        │
│  │  OIDC auth → SST deploy --stage preview                          │
│  │  → Post PR comment with API URL                                   │
│  │                                                                   │
│  ON MERGE TO MAIN                                                     │
│  ────────────────                                                     │
│                                                                       │
│  ci.yml ─── same as above ──────────────────────────────────────────│
│                                                                       │
│  web-production.yml ─────────────────────────────────────────────────│
│  │  Build Astro → wrangler deploy (production)                       │
│  │  → Summary with rollback command                                  │
│  │  → Set commit status                                              │
│  │  concurrency: web-production (cancel-in-progress: false)          │
│  │                                                                   │
│  api-deploy.yml ─────────────────────────────────────────────────────│
│  │  OIDC auth → SST deploy --stage prod                             │
│  │                                                                   │
│  ON PR CLOSE                                                          │
│  ───────────                                                          │
│  api-deploy.yml cleanup job → sst remove --stage preview             │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Path-Based Triggering Matrix

```
┌─────────────────────┬──────┬──────┬───────┬──────┬──────────┬──────────┬──────────┐
│ File Changed        │ web  │ api  │ types │ blog │ web      │ web      │ api      │
│                     │ CI   │ CI   │ CI    │ CI   │ preview  │ prod     │ deploy   │
├─────────────────────┼──────┼──────┼───────┼──────┼──────────┼──────────┼──────────┤
│ apps/web/**         │  ✓   │      │       │      │    ✓     │    ✓     │          │
│ packages/api/**     │      │  ✓   │       │      │          │          │    ✓     │
│ packages/types/**   │  ✓   │  ✓   │   ✓   │      │    ✓     │    ✓     │    ✓     │
│ infra/**            │      │      │       │      │          │          │    ✓     │
│ sst.config.ts       │      │      │       │      │          │          │    ✓     │
│ content/blog/**     │      │      │       │  ✓   │          │          │          │
│ pnpm-lock.yaml      │  ✓   │  ✓   │       │      │    ✓     │    ✓     │    ✓     │
└─────────────────────┴──────┴──────┴───────┴──────┴──────────┴──────────┴──────────┘
```

### Preview Comment Bot

The web preview workflow posts a self-updating PR comment with deployment history:

```
┌──────────────────────────────────────────────────────────────┐
│  ## 🌐 Web Preview Deployment                                │
│                                                              │
│  ### 🔗 Visit Preview →                                      │
│                                                              │
│  | Branch | Commit | Build | Cache | Status |                │
│  |--------|--------|-------|-------|--------|                │
│  | feat/x | a1b2c3 | 45s   |  ✅   | ✅ Ready |              │
│                                                              │
│  ▸ 📜 History (3)                                             │
│    | Commit | Status | Build | Cache | Time           |      │
│    |--------|--------|-------|-------|----------------|      │
│    | a1b2c3 | ✅     | 45s   | ✅    | Jan 15, 2:30PM |      │
│    | d4e5f6 | ✅     | 62s   | ❌    | Jan 15, 1:15PM |      │
│    | g7h8i9 | ❌     | --    | --    | Jan 15, 12:00PM|      │
│                                                              │
│  ──────────────────────────────────────────                  │
│  🚀 Cloudflare Pages · Jan 15, 2025 2:30 PM UTC · Logs      │
└──────────────────────────────────────────────────────────────┘

History is stored as base64-encoded JSON in an HTML comment:
<!-- history:eyJzaGEiOiJhMWIy... -->
This survives comment edits without needing a database.
```

### OIDC Authentication (API Deploy)

```
┌──────────────────┐                    ┌──────────────────┐
│  GitHub Actions  │                    │     AWS IAM      │
│                  │                    │                  │
│  1. Request OIDC │                    │                  │
│     token from   │  2. JWT token      │                  │
│     GitHub's     │ ──────────────────>│  3. Validate     │
│     OIDC provider│                    │     token issuer │
│                  │                    │     + claims     │
│                  │  4. Temporary      │                  │
│                  │     credentials    │  Trust policy:   │
│                  │ <──────────────────│  repo:hionnode/  │
│                  │                    │  akasha-lekha:*  │
│  5. Use creds    │                    │                  │
│     for SST      │                    │                  │
│     deploy       │                    │                  │
└──────────────────┘                    └──────────────────┘

Why OIDC over access keys:
  ✓ No long-lived credentials to rotate or leak
  ✓ Short-lived tokens (15 min - 1 hour)
  ✓ Full CloudTrail audit trail
  ✓ Repository-scoped trust policy
```

### Pre-Commit Hooks

```
.husky/pre-commit
├── pnpm lint-staged          # ESLint + Prettier on staged files only
│   ├── *.{js,ts,astro}       →  eslint --fix + prettier --write
│   └── *.{css,json,md}       →  prettier --write
├── pnpm validate:blog        # Zod schema validation on blog frontmatter
├── pnpm typecheck            # tsc --noEmit across all packages
└── pnpm build                # Full Astro build to catch SSG errors
```

**Trade-off**: Slower commits (full build) but ensures main branch always compiles. Could optimize by skipping build when no code changes detected.

---

## Local Development

### Docker Compose Setup

```
┌───────────────────────────────────────────────────────────┐
│                    docker-compose.yml                       │
│                                                            │
│  ┌────────────────────┐    ┌─────────────────────────┐    │
│  │  dynamodb-local    │    │  dynamodb-admin          │    │
│  │  :8000             │    │  :8001                    │    │
│  │                    │    │                           │    │
│  │  amazon/dynamodb-  │◄───│  aaronshaf/dynamodb-     │    │
│  │  local:latest      │    │  admin:latest             │    │
│  │                    │    │                           │    │
│  │  -sharedDb         │    │  DYNAMO_ENDPOINT=        │    │
│  │  -dbPath /data     │    │  http://dynamodb-local   │    │
│  │                    │    │  :8000                    │    │
│  │  healthcheck:      │    │                           │    │
│  │  curl :8000        │    │  Visual table browser    │    │
│  │                    │    │  Query builder            │    │
│  │  Volume: dynamodb- │    │                           │    │
│  │  data (persistent) │    │                           │    │
│  └────────────────────┘    └─────────────────────────┘    │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

### Development Workflow

```
Terminal 1                Terminal 2              Terminal 3
──────────                ──────────              ──────────
pnpm db:local             pnpm dev                pnpm dev:api
(docker-compose up -d)    (Astro dev server)      (SST dev mode)
                          localhost:4321           Live Lambda
DynamoDB: :8000                                   (hot reload)
Admin UI: :8001

Or combined:
  pnpm dev:all            # runs web + api concurrently
```

### SST Dev Mode

SST dev mode deploys real AWS resources but routes Lambda invocations to your local machine:

```
┌──────────┐         ┌────────────────┐         ┌──────────────┐
│  Browser │ ──────> │  API Gateway   │ ──────> │  IoT Core    │
│          │         │  (real AWS)    │         │  WebSocket   │
└──────────┘         └────────────────┘         └──────┬───────┘
                                                       │
                                                       │ Routes to
                                                       │ local machine
                                                       ▼
                                                ┌──────────────┐
                                                │  Your laptop │
                                                │  (Lambda     │
                                                │   handler    │
                                                │   runs here) │
                                                └──────────────┘
```

---

## Shared Type Contracts

### Type Hierarchy

```
@akasha/types
├── user.ts
│   ├── User           { id, githubId, username, email?, avatarUrl?, createdAt, updatedAt }
│   ├── Session         { userId, createdAt, expiresAt }
│   └── JwtPayload     { sub, username, email?, avatarUrl?, iat, exp }
│
├── exercise.ts
│   ├── Difficulty      'beginner' | 'intermediate' | 'advanced'
│   ├── ModuleStatus    'available' | 'coming-soon' | 'beta'
│   ├── Module          { id, title, description, order, icon?, prerequisites?, ... }
│   ├── Exercise        { id, module, order, title, difficulty, objectives[], cliCommand, ... }
│   ├── ExerciseManifest { ...Exercise + backend: 'vm'|'container', verify: VerificationCheck[] }
│   └── VerificationCheck { name, cmd, expect?, expectContains? }
│
├── progress.ts
│   ├── Progress        { exerciseId, completedAt, attempts, verificationHash? }
│   ├── UserProgress    { userId, exerciseId, completedAt, attempts, verificationHash?, updatedAt }
│   └── ModuleProgress  { moduleId, completed, total, percentage }
│
└── api.ts
    ├── ApiResponse<T>          { data?: T, error?: string }
    ├── AuthTokenResponse       { token, user }
    ├── AuthVerifyResponse      { valid, user }
    ├── ExercisesListResponse   { exercises[] }
    ├── ModulesListResponse     { modules[] }
    ├── ProgressResponse        { progress[] }
    ├── RecordProgressRequest   { verificationHash? }
    ├── RecordProgressResponse  { success, exerciseId, completedAt, attempts }
    ├── ApiErrorCode            'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | ...
    └── ApiError                { code, message, details? }
```

### ExerciseManifest (CLI Verification)

The `ExerciseManifest` type defines how the `infra-learn` CLI verifies exercise completion:

```typescript
interface ExerciseManifest {
  backend: 'vm' | 'container';      // Execution environment
  containerImage?: string;           // Docker image for container backend
  setup?: { source: string; dest: string }[];  // Files to copy before verification
  verify: VerificationCheck[];       // Array of checks to run
}

interface VerificationCheck {
  name: string;            // Human-readable check name
  cmd: string;             // Shell command to execute
  expect?: string;         // Exact expected output
  expectContains?: string; // Substring match
}
```

---

## Security Decisions

| Decision | Choice | Trade-off |
|----------|--------|-----------|
| Auth provider | GitHub OAuth | Only supports GitHub users; simple implementation |
| Token storage | JWT in localStorage | Vulnerable to XSS; simpler than httpOnly cookies with CORS |
| Token expiry | 7 days | Users re-login weekly; no refresh token complexity |
| Session storage | DynamoDB with TTL | Auto-cleanup; no cron jobs needed |
| CI auth | OIDC federation | No static credentials; requires IAM trust policy setup |
| Secrets | SST Secrets (SSM) | Free; per-stage isolation; no Secrets Manager cost |
| CORS | Stage-specific origin allowlist | Only matching frontend can call API |
| Prod protection | `protect: ["prod"]` in SST | Prevents accidental `sst remove --stage prod` |
| Data retention | `removal: "retain"` for prod | Prevents data loss; other stages auto-cleanup |
| OAuth state | `crypto.randomUUID()` | **Gap**: State is not validated in callback (CSRF risk) |

---

## Cost Optimization

```
┌──────────────────────────────────────────────────────────────────────┐
│                        Monthly Cost Estimate                          │
├──────────────────────┬──────────────┬────────────────────────────────┤
│ Service              │ Cost         │ Notes                          │
├──────────────────────┼──────────────┼────────────────────────────────┤
│ Cloudflare Pages     │ $0           │ Free tier (unlimited bandwidth)│
│ AWS Lambda           │ ~$0          │ 1M free requests/month         │
│ API Gateway          │ ~$0          │ 1M free requests/month         │
│ DynamoDB             │ ~$0          │ 25GB free, on-demand pricing   │
│ SST Secrets (SSM)    │ $0           │ Free (vs $0.40/secret/mo SM)   │
│ GitHub Actions       │ $0           │ Free for public repos          │
│ Route53 (if used)    │ ~$0.50       │ $0.50/hosted zone              │
├──────────────────────┼──────────────┼────────────────────────────────┤
│ TOTAL                │ ~$0.50/mo    │ Effectively free at low scale  │
└──────────────────────┴──────────────┴────────────────────────────────┘

Key decisions that minimize cost:
  • Static site on Cloudflare (free) instead of SSR/server
  • DynamoDB on-demand (pay per request) instead of provisioned
  • SSM Parameter Store (free) instead of AWS Secrets Manager
  • OIDC (no credential rotation overhead)
  • Path-filtered CI (fewer build minutes)
  • Preview stage auto-cleanup (no orphaned resources)
```

---

## Known Gaps & Future Work

### Incomplete Implementations

| Area | Status | What's Missing |
|------|--------|----------------|
| OAuth callback | Stubbed | Token exchange, user upsert, JWT creation, session storage |
| Exercise verification | Routes only | CLI tool (`infra-learn`), hash validation, completion recording |
| Progress tracking | Schema ready | API handler implementation, frontend integration |
| `packages/db` | Stub | Seed scripts, migration tooling |

### Security Gaps

- **OAuth state validation**: The state parameter is generated but not verified in the callback (CSRF risk)
- **No rate limiting**: API endpoints have no request throttling
- **No refresh tokens**: Users must fully re-authenticate after JWT expiry

### Potential Improvements

- **Redis session cache**: Reduce DynamoDB reads for high-traffic auth verification
- **Multi-region**: Deploy API to additional regions for global latency
- **CloudWatch alarms**: Monitoring and alerting for Lambda errors, DynamoDB throttling
- **User dashboard**: Progress visualization with charts and completion stats
- **Leaderboards**: Per-exercise completion rankings via Progress GSI

---

## Changelog

All entries are added when a branch is merged to `main`.

### 2025-02-13 — Initial Architecture Document

- Created comprehensive architecture documentation from existing codebase state
- Documented all architectural decisions with rationale
- Captured system diagrams, data flows, and type contracts
- Recorded known gaps and future work items
- **Baseline commit**: `a89cfc5` (main branch HEAD)
