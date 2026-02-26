# Implementation Plan: Labs Feature

Two planning documents exist for the labs feature. They describe different products built on the same foundation. This document maps where they overlap, where they diverge, and what decisions remain open.

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Overlap Analysis](#overlap-analysis)
- [Current State Audit](#current-state-audit)
- [Path A: Complete the MVP (infra-learn)](#path-a-complete-the-mvp-infra-learn)
- [Path B: CPE Grand Vision (cpe)](#path-b-cpe-grand-vision-cpe)
- [Path C: Hybrid](#path-c-hybrid)
- [Decision Points](#decision-points)
- [Immediate Next Steps](#immediate-next-steps)

---

## Executive Summary

### What Exists

The codebase implements the MVP described in `docs/labs-implementation-plan.md`. The frontend is ~95% complete (all pages, components, islands, content schemas, tests). The backend infrastructure is fully defined (SST config, DynamoDB tables, API Gateway routes, secrets) but 7 of 8 Lambda handlers are stubs.

### The Two Visions

| | **MVP (infra-learn)** | **CPE Grand Vision (cpe)** |
|---|---|---|
| **Source document** | `docs/labs-implementation-plan.md` | `labs-plan.md` |
| **CLI tool** | `infra-learn` (language TBD) | `cpe` (Go binary) |
| **Scope** | Practical infrastructure exercises (Linux, networking, containers, K8s) | 10-phase systems programming curriculum (C memory → build K8s from scratch) |
| **Auth** | GitHub OAuth + JWT + DynamoDB sessions | None. Local-only progress (SQLite) |
| **Backend** | AWS Lambda + API Gateway + DynamoDB | None. Pure static web + standalone CLI |
| **Content model** | Astro content collections (MDX) | LLM-generated from outline, embedded in CLI via `go:embed` |
| **Progress** | Server-side (DynamoDB), synced via API | Local SQLite, exportable JSON for web display |
| **Verification** | CLI runs checks, reports to API | CLI runs tests inside Docker containers, stores locally |
| **Environments** | Simple (VM or container per exercise) | Complex (privileged containers, Docker-in-Docker, multi-node clusters, kind) |
| **Cost** | ~$0.50/mo (Lambda + DynamoDB free tier) | $0 (pure static hosting, no backend) |
| **Target audience** | Infrastructure beginners/intermediates | Serious engineers building deep systems knowledge |

### Where They Agree

Both visions share these core assumptions:
- Astro static site on Cloudflare Pages for content display
- CLI tool for local verification (user works in their own terminal)
- Exercise content lives in the repo as structured files
- Progress is tracked per-exercise with pass/fail status
- The web shows what to do; the CLI verifies it was done

---

## Overlap Analysis

### Concept-by-Concept Mapping

| Concept | MVP (infra-learn) | CPE (cpe) | Compatibility |
|---|---|---|---|
| **Web framework** | Astro 5 + Solid.js islands | Astro SSG | SAME — both use existing Astro site |
| **Content format** | Astro content collections (MDX) | Markdown with custom frontmatter | COMPATIBLE — CPE content could use Astro collections |
| **Content schema** | Module + Exercise (Zod validated) | Phase + Section + Week (YAML frontmatter) | DIFFERENT — CPE has deeper hierarchy (phase → section → week → exercise) |
| **CLI name** | `infra-learn` | `cpe` | DIFFERENT — naming only, not architectural |
| **CLI language** | Not decided | Go | OPEN — MVP could also be Go |
| **Verification** | `infra-learn verify <id>` → API call | `cpe test <id>` → local test suite execution | DIFFERENT — MVP reports to server, CPE is local-only |
| **Progress storage** | DynamoDB (server) | SQLite (local) | INCOMPATIBLE — fundamentally different models |
| **Auth** | GitHub OAuth (required for progress) | None | INCOMPATIBLE — CPE has no auth concept |
| **Exercise environments** | VM or container (simple) | Docker containers with per-phase Dockerfiles, Docker Compose for multi-node | COMPATIBLE — MVP is a subset of CPE environments |
| **Test definitions** | `VerificationCheck[]` (cmd + expect) | Full test suites (C/Go files) + `test_config.yaml` + `grading.yaml` | DIFFERENT — CPE tests are much richer |
| **Grading** | Pass/fail (all checks pass) | Scored (0-100, weighted: tests + memory + compile + benchmark) | DIFFERENT — CPE has rubric-based scoring |
| **Difficulty model** | `beginner \| intermediate \| advanced` | `core \| deep-dive \| enrichment` per subsection | DIFFERENT — CPE difficulty is per-subsection, not per-exercise |
| **Dependencies** | `prerequisites[]` on modules | Full dependency graph with `dependencies[]` and `recommended[]` | COMPATIBLE — CPE extends MVP's simpler model |
| **Benchmarks** | Not present | First-class (target times, memory checks, Valgrind) | CPE-ONLY |
| **Scaffolding** | Not present | `cpe scaffold <id>` generates starter code | CPE-ONLY |
| **Hints** | `hints[]` array on exercises | `cpe hint <id>` progressive reveal | COMPATIBLE — same concept, different delivery |
| **Multi-node labs** | Not present | Docker Compose for Raft clusters, kind for K8s | CPE-ONLY |

### Shared Infrastructure

These components serve both visions without modification:

1. **Astro site** — Both display content on the web
2. **Cloudflare Pages** — Both deploy static output
3. **Content collections** — Both store exercises as MDX/markdown in the repo
4. **Tokyo Night theme** — Visual identity is shared
5. **Blog** — Entirely independent of labs direction
6. **CI/CD** — Path-filtered workflows work for both

### Architectural Incompatibilities

1. **Auth model**: MVP requires GitHub OAuth for progress tracking. CPE has no auth. A hybrid would need auth to be optional.

2. **Progress storage**: MVP stores progress server-side (DynamoDB). CPE stores locally (SQLite). These can coexist but need a clear boundary — which is the source of truth?

3. **Content hierarchy**: MVP has a flat `module → exercise` structure. CPE has `phase → section → week → exercise/project`. The CPE hierarchy can't be represented in the current Zod schemas without extension.

4. **Test complexity**: MVP verification is shell commands with expected output. CPE tests are full test suites compiled and run inside containers. The `VerificationCheck` type in `packages/types/src/exercise.ts` can't represent CPE-style tests.

---

## Current State Audit

### Frontend — Pages

| File | Status | Notes |
|---|---|---|
| `apps/web/src/pages/labs/index.astro` | DONE | Landing page with hero, feature cards, module showcase. Uses mock data. |
| `apps/web/src/pages/labs/login.astro` | DONE | GitHub OAuth redirect page with loading state |
| `apps/web/src/pages/labs/setup.astro` | DONE | CLI installation guide (macOS, Linux, Windows), 5 setup steps |
| `apps/web/src/pages/labs/dashboard.astro` | DONE | User dashboard with stats, progress bars, recent activity. Uses mock data. |
| `apps/web/src/pages/labs/modules/index.astro` | DONE | Module listing grid |
| `apps/web/src/pages/labs/modules/[...slug].astro` | DONE | Dynamic routing for module overview + individual exercises. Breadcrumbs, MDX rendering, prev/next nav. |
| `apps/web/src/pages/labs/auth/callback.astro` | DONE | OAuth callback with loading spinner, token exchange script, error handling |

**Summary**: 7/7 pages complete. All use mock data since backend handlers are stubs.

### Frontend — Components

| File | Status | Notes |
|---|---|---|
| `apps/web/src/components/labs/layout/LabsHeader.astro` | DONE | Sticky header, mobile menu, AuthStatus island |
| `apps/web/src/components/labs/layout/LabsSidebar.astro` | DONE | Module list, active state, quick links |
| `apps/web/src/components/labs/ModuleCard.astro` | DONE | Card with icon, metadata, status badges, progress bar |
| `apps/web/src/components/labs/ExerciseCard.astro` | DONE | Order number, completion status, difficulty badge, locked/unlocked |
| `apps/web/src/components/labs/ProgressBar.astro` | DONE | Configurable sizes (sm/md/lg), animated transitions |
| `apps/web/src/components/labs/CLICommand.astro` | DONE | Wrapper for CLICommandCopy island |
| `apps/web/src/components/labs/HintAccordion.astro` | DONE | Progressive reveal with animated chevrons |
| `apps/web/src/components/labs/VerificationChecklist.astro` | DONE | Numbered criteria list |
| `apps/web/src/components/labs/DifficultyBadge.astro` | DONE | Color-coded (green/yellow/orange) with dot indicators |
| `apps/web/src/components/labs/ObjectivesList.astro` | DONE | Bulleted list with green accent |

**Summary**: 10/10 components complete.

### Frontend — Solid.js Islands

| File | Status | Tests |
|---|---|---|
| `apps/web/src/components/labs/islands/AuthStatus.tsx` | DONE | `AuthStatus.test.tsx` |
| `apps/web/src/components/labs/islands/ProgressTracker.tsx` | DONE | `ProgressTracker.test.tsx` |
| `apps/web/src/components/labs/islands/CLICommandCopy.tsx` | DONE | `CLICommandCopy.test.tsx` |

**Summary**: 3/3 islands complete with co-located unit tests.

### Frontend — Utilities

| File | Status | Notes |
|---|---|---|
| `apps/web/src/utils/labs/auth.ts` | DONE | JWT parsing, token expiry, OAuth URL generation, server-side verification (~165 lines) |
| `apps/web/src/utils/labs/api.ts` | DONE | Full API client: modules, exercises, progress, completion checks (~206 lines) |
| `apps/web/src/utils/labs/mocks.ts` | DONE | Mock data (user, modules, exercises, progress) for development |
| `apps/web/src/utils/labs/index.ts` | DONE | Re-exports |
| `apps/web/src/utils/labs/auth.test.ts` | DONE | Auth utility tests |
| `apps/web/src/utils/labs/api.test.ts` | DONE | API client tests |

**Summary**: All utilities complete with tests.

### Frontend — Content

| File | Status | Notes |
|---|---|---|
| `apps/web/src/content/labs/schemas.ts` | DONE | Zod schemas for modules (14 fields) and exercises (11 fields) |
| `apps/web/src/content/labs/schemas.test.ts` | DONE | 198 lines, covers all validations |
| `apps/web/src/content/labs/modules/linux.mdx` | DONE | 1 module: Linux Fundamentals |
| `apps/web/src/content/labs/exercises/linux-01.mdx` | DONE | Exercise 1 of 3 |
| `apps/web/src/content/labs/exercises/linux-02.mdx` | DONE | Exercise 2 of 3 |
| `apps/web/src/content/labs/exercises/linux-03.mdx` | DONE | Exercise 3 of 3 |

**Summary**: 1 module, 3 exercises. Schema and validation complete.

### Frontend — E2E Tests

| File | Status | Notes |
|---|---|---|
| `apps/web/e2e/labs.spec.ts` | DONE | Playwright tests for labs pages and navigation |

### Backend — Library Files

| File | Status | Notes |
|---|---|---|
| `packages/api/src/lib/response.ts` | DONE | `json()`, `error()`, `redirect()` helpers |
| `packages/api/src/lib/auth.ts` | DONE | `createToken()`, `verifyToken()`, `getTokenFromHeader()` using jsonwebtoken + `Resource.JwtSecret` |
| `packages/api/src/lib/db.ts` | DONE | DynamoDB DocumentClient with local dev support (`DYNAMODB_ENDPOINT`), re-exports commands |

**Summary**: All shared libraries are fully implemented and ready for handler use.

### Backend — Lambda Handlers

| File | Status | What It Does Now | What It Should Do |
|---|---|---|---|
| `packages/api/src/functions/auth/github.ts` | DONE | Redirects to GitHub OAuth consent screen with `client_id`, `scope`, `state` | — (complete) |
| `packages/api/src/functions/auth/callback.ts` | STUB | Validates code param exists, redirects with error | Exchange code for GitHub token, fetch user profile, upsert user in DynamoDB, create session, create JWT, redirect to frontend with token |
| `packages/api/src/functions/auth/verify.ts` | STUB | Returns 501 "Not implemented" | Verify JWT, optionally validate session in DynamoDB, return user payload |
| `packages/api/src/functions/auth/logout.ts` | STUB | Returns `{ success: true }` without action | Delete session from DynamoDB Sessions table |
| `packages/api/src/functions/exercises/list.ts` | STUB | Returns `{ exercises: [] }` | Return exercises from content or database |
| `packages/api/src/functions/exercises/get.ts` | STUB | Validates ID param, returns 404 | Fetch single exercise by ID |
| `packages/api/src/functions/progress/get.ts` | STUB | Returns 401 "Unauthorized" | Verify auth, query Progress table for user's completions |
| `packages/api/src/functions/progress/record.ts` | STUB | Returns 401 "Unauthorized" | Verify auth, write completion record to Progress table |

**Summary**: 1/8 handlers implemented. 7 are stubs with TODO comments. No handler currently interacts with DynamoDB.

### Backend — Infrastructure (SST)

| File | Status | Notes |
|---|---|---|
| `sst.config.ts` | DONE | App config: `akasha-labs`, `ap-south-1`, stage-based protection |
| `infra/api.ts` | DONE | API Gateway V2 with CORS, 8 routes, resource linking |
| `infra/auth.ts` | DONE | SST Secrets: `GithubClientId`, `GithubClientSecret`, `JwtSecret` |
| `infra/database.ts` | DONE | 3 DynamoDB tables (Users + GSI, Progress + GSI, Sessions + TTL) |

**Summary**: All infrastructure is defined and deployable. Tables, routes, and secrets are ready for the handlers to use.

### Shared Types

| File | Status | Notes |
|---|---|---|
| `packages/types/src/api.ts` | DONE | `ApiResponse<T>`, `AuthTokenResponse`, `AuthVerifyResponse`, error codes |
| `packages/types/src/user.ts` | DONE | `User`, `Session`, `JwtPayload` |
| `packages/types/src/exercise.ts` | DONE | `Exercise`, `Module`, `ExerciseManifest`, `VerificationCheck` |
| `packages/types/src/progress.ts` | DONE | `Progress`, `UserProgress`, `ModuleProgress` |

### Packages Stub

| File | Status | Notes |
|---|---|---|
| `packages/db/` | STUB | Package exists but contains no seed scripts or migration tooling |

---

## Path A: Complete the MVP (infra-learn)

Finish what's started. The frontend is done; the backend needs implementation. Then build the CLI.

### Phase A1: Backend Handlers (1-2 weeks)

Complete the 7 stub handlers. The auth library (`auth.ts`), DB client (`db.ts`), and response helpers (`response.ts`) are already implemented — handlers just need to use them.

**Priority order** (auth first, then data, then progress):

1. **`auth/callback.ts`** — The critical path. Without this, no user can log in.
   - Fetch GitHub access token (`POST https://github.com/login/oauth/access_token`)
   - Fetch user profile (`GET https://api.github.com/user`)
   - Upsert user in `Resource.Users.name` table (`PutCommand`)
   - Create session in `Resource.Sessions.name` table (`PutCommand` with TTL)
   - Create JWT via `createToken()` from `lib/auth.ts`
   - Redirect to frontend callback page with token in query string

2. **`auth/verify.ts`** — Validates JWT on subsequent requests.
   - Extract token via `getTokenFromHeader()`
   - Verify via `verifyToken()` from `lib/auth.ts`
   - Optionally check session exists in Sessions table
   - Return `{ valid: true, user: payload }`

3. **`auth/logout.ts`** — Session cleanup.
   - Extract and verify token
   - Hash the token, delete from Sessions table (`DeleteCommand`)
   - Return `{ success: true }`

4. **`exercises/list.ts`** — Return exercise catalog.
   - Decision: serve from DynamoDB or hardcode from content? Content collections are build-time (Astro), not available at Lambda runtime.
   - Simplest: return a static JSON manifest of exercises. Update it on deploy.
   - Alternative: store exercises in DynamoDB via seed script.

5. **`exercises/get.ts`** — Single exercise by ID.
   - Same decision as list — source of exercise data.

6. **`progress/get.ts`** — User's completion history.
   - Verify auth (token → user ID)
   - Query Progress table: `pk = USER#<id>`, all `sk` starting with `EXERCISE#`
   - Return array of `Progress` records

7. **`progress/record.ts`** — Record exercise completion.
   - Verify auth
   - Validate exercise ID
   - Write to Progress table: `pk = USER#<id>`, `sk = EXERCISE#<exerciseId>`
   - Include `completedAt`, `attempts`, optional `verificationHash`

### Phase A2: Wire Frontend to Real API (1 week)

- Replace mock data in pages with API calls
- Add environment variables (`PUBLIC_LABS_API_URL` per stage)
- Handle loading/error states (skeletons already exist)
- Test OAuth flow end-to-end (local DynamoDB + SST dev mode)
- Remove or gate mock data behind a dev flag

### Phase A3: CLI Tool — `infra-learn` (2-3 weeks)

Build the CLI that users run locally to verify exercises.

**Core commands:**
```
infra-learn verify <exercise-id>    # Run verification checks, report to API
infra-learn login                   # GitHub device flow or browser-based OAuth
infra-learn status                  # Show local progress summary
infra-learn doctor                  # Check prerequisites (Docker, etc.)
```

**Verification flow:**
1. Read exercise manifest (embedded or fetched from API)
2. Run each `VerificationCheck` — execute `cmd`, compare output to `expect` or `expectContains`
3. If all pass, POST to `/exercises/{id}/verify` with auth token
4. Display pass/fail summary

**Language decision**: Open. TypeScript (shares types with backend), Go (single binary, no runtime), or Rust (performance + single binary). See [Decision Points](#decision-points).

### Phase A4: Content Expansion (ongoing)

- Add more modules: Networking, Containers, Kubernetes, Cloud
- Each module: 5-10 exercises with MDX content + verification criteria
- Update `exerciseCount` in module frontmatter
- Exercise manifests define verification checks

### Phase A5: Polish (1 week)

- Error boundaries on all pages
- Rate limiting on API (API Gateway throttling)
- OAuth state validation (currently generated but not verified — CSRF risk)
- `packages/db` seed scripts for local development
- Monitoring/alerting for Lambda errors

---

## Path B: CPE Grand Vision (cpe)

Build the 10-phase systems programming curriculum with a standalone Go CLI. No backend required.

### Phase B1: Go CLI Skeleton (2-3 weeks)

```
cpe init          # Check Docker, pull base images
cpe doctor        # Verify system requirements
cpe env start <phase>   # Provision Docker environment
cpe env shell <phase>   # Drop into container
cpe version
```

- Go module with cobra or urfave/cli
- Docker SDK integration for container management
- Per-phase Dockerfile definitions
- SQLite progress database at `~/.cpe/progress.db`

### Phase B2: Content Pipeline (2-3 weeks per phase)

- Use LLM expansion prompt template from `labs-plan.md`
- Feed each section of the roadmap outline to produce:
  - Curriculum markdown with frontmatter
  - Test suite files (C or Go)
  - Scaffold code (starter templates)
  - Environment requirements (Dockerfile additions)
- Human review pass on every section
- Start with Phase 0 (C fundamentals) as proof of concept

### Phase B3: Test Runner (2 weeks)

```
cpe test <exercise-id>     # Run tests in container
cpe submit <exercise-id>   # Test + record to progress DB
cpe scaffold <exercise-id> # Generate starter code
```

- C test runner: compile with `-Wall -Wextra -Werror -fsanitize=address,undefined`, run, parse output
- Valgrind integration for memory checks
- Benchmark runner with target comparison
- Go test runner (for phases 5+): `go vet`, `go test`, `-race`, `-bench`
- Grading: weighted score (tests 60%, memory 20%, compile 10%, benchmark 10%)

### Phase B4: Docker Environments (2 weeks)

- Phase 0-4: Single container (GCC, GDB, Valgrind, Make)
- Phase 5: Privileged (NET_ADMIN, NET_RAW) for networking labs
- Phase 6: SYS_ADMIN for namespace/cgroup exercises
- Phase 7: Docker Compose multi-node for Raft clusters
- Phase 8-9: kind clusters for Kubernetes labs

### Phase B5: Web Integration (1-2 weeks)

- Display CPE curriculum content in existing Astro site
- New content collection: `phases` with phase/section/week hierarchy
- New pages: `/cpe`, `/cpe/phases/[phase]`, `/cpe/phases/[phase]/[section]`
- Progress upload page (user exports JSON from CLI, pastes on web)
- Dependency graph visualization
- No auth needed — web is read-only

### Phase B6: Content Production (8-12 weeks, parallelizable)

- Phase 0: C fundamentals (4-6 weeks estimated study time)
- Phase 1: Nand2Tetris / hardware abstraction
- Phase 2: CS:APP / systems programming
- Phase 3: Memory allocators
- Phase 4: Concurrency
- Phase 5: Go + networking
- Phase 6: Containers from scratch
- Phase 7: Distributed systems / Raft
- Phase 8: Kubernetes internals
- Phase 9: Capstone (build mini-K8s)

Each phase: 2-3 weeks of content production (LLM generation + human review + test writing).

---

## Path C: Hybrid

Build both on the same foundation. The Astro site supports two "tracks" — practical infrastructure labs (MVP) and deep systems engineering (CPE). They share the web platform but have different CLIs and progress models.

### Shared Layer

```
akasha-lekha/
├── apps/web/                     # Shared Astro site
│   ├── src/content/
│   │   ├── labs/                 # MVP content (modules + exercises)
│   │   └── cpe/                  # CPE content (phases + sections)
│   ├── src/pages/
│   │   ├── labs/                 # MVP pages (auth, dashboard, progress)
│   │   └── cpe/                  # CPE pages (read-only curriculum)
│   └── src/components/
│       ├── labs/                 # MVP components (islands with auth)
│       └── cpe/                  # CPE components (static, no auth)
├── packages/api/                 # MVP backend only
├── cli/
│   ├── infra-learn/              # MVP CLI (lightweight, reports to API)
│   └── cpe/                      # CPE CLI (Go, Docker environments, local tests)
└── infra/                        # MVP infrastructure
```

### How It Works

- **Labs track** (`/labs/*`): GitHub OAuth, server progress, simple exercises, `infra-learn` CLI. For infrastructure practitioners.
- **CPE track** (`/cpe/*`): No auth, read-only web, local progress, `cpe` CLI with Docker environments. For systems engineers.
- **Shared**: Site chrome, blog, Tokyo Night theme, Cloudflare hosting, CI/CD pipelines.

### Content Schema Extension

The CPE track would need a new content collection with its own schema:

```typescript
// Extends beyond current module/exercise model
const cpePhaseSchema = z.object({
  phase: z.number(),
  title: z.string(),
  duration: z.string(),           // "4-6 weeks"
  language: z.enum(['c', 'go']),
  sections: z.array(z.string()),  // section IDs
});

const cpeSectionSchema = z.object({
  phase: z.number(),
  section: z.string(),            // "0.1"
  week: z.number(),
  difficulty: z.enum(['core', 'deep-dive', 'enrichment']),
  estimated_hours: z.number(),
  dependencies: z.array(z.string()),
  recommended: z.array(z.string()),
  projects: z.array(cpeProjectSchema),
  exercises: z.array(cpeExerciseSchema),
});
```

### Auth Model

- Labs: Auth required for progress sync. Islands check auth state.
- CPE: Auth optional. If logged in, progress could sync to server. If not, progress stays local.
- Implementation: Auth context wraps both tracks. Labs pages redirect to login if unauthenticated. CPE pages work without auth.

### Trade-offs

| Pro | Con |
|---|---|
| Serves two audiences from one site | More complex content pipeline |
| Shared infrastructure reduces cost | Two CLI tools to maintain |
| CPE builds on MVP foundation | Risk of neither being done well |
| Users can start with labs, graduate to CPE | Content hierarchy mismatch adds schema complexity |

---

## Decision Points

These are the specific questions that determine which path (or combination) to pursue.

### 1. CLI Language

| Option | Pro | Con |
|---|---|---|
| **Go** | Single binary, no runtime deps, Docker SDK is native Go, matches CPE vision | Different language from rest of codebase (TypeScript) |
| **TypeScript (Node.js)** | Shares types with backend, easier for current team, npm distribution | Requires Node.js runtime on user's machine |
| **Rust** | Single binary, fast, growing DevTools ecosystem | Steep learning curve, slower development |

**Recommendation**: Go if CPE is the direction (Docker integration is critical). TypeScript if MVP-only (type sharing wins).

### 2. Auth Model

| Option | Implication |
|---|---|
| **Required** (MVP) | GitHub OAuth, DynamoDB sessions, server-side progress. More infrastructure to maintain. |
| **None** (CPE) | Local progress only. No backend needed. Zero operational cost. |
| **Optional** (Hybrid) | Both paths work. Auth adds sync, but isn't required. Most complex to implement. |

**Recommendation**: Start with MVP (required auth) since the backend infrastructure already exists. Make auth optional later if CPE track is added.

### 3. Content Scope

| Option | Implication |
|---|---|
| **Practical labs only** | 5-8 modules, beginner-intermediate, infrastructure focus. Faster to ship. |
| **CPE curriculum only** | 10 phases, months of content production, deep systems focus. Higher ambition. |
| **Both tracks** | Practical labs for quick wins, CPE for depth. Double the content work. |

### 4. Exercise Hosting & Distribution

| Option | MVP | CPE |
|---|---|---|
| **Content in Astro collections** | Yes (current) | Possible but schema needs extension |
| **Content embedded in CLI** | No | Yes (`go:embed`) |
| **Content in separate repo/CDN** | Possible | Possible (`cpe content sync`) |

### 5. Target Audience

| Audience | Direction |
|---|---|
| **Junior DevOps / SREs** | MVP — practical, guided, quick wins |
| **Senior engineers wanting depth** | CPE — rigorous, systems-level |
| **Agency lead generation** | Either — CPE has stronger credibility signal, MVP has lower barrier |

---

## Immediate Next Steps

These are worth doing regardless of which path is chosen, because they complete the existing infrastructure.

### 1. Complete Backend Handlers (both paths benefit)

The auth callback handler is needed for any auth-enabled experience. Even if CPE goes auth-free, the MVP backend should be finished since the infrastructure is already deployed.

**Minimum viable backend** (3 high-priority handlers):

1. `auth/callback.ts` — Complete OAuth flow
2. `auth/verify.ts` — JWT validation
3. `progress/record.ts` — Store completions

With these three, a user can: log in → complete exercises → have progress saved.

### 2. Exercise Data Strategy

Decide where exercise data lives at runtime:

- **Option A**: Static JSON manifest, bundled in Lambda deployment. Update on each deploy. Simple, no DB needed for exercises.
- **Option B**: DynamoDB seed script in `packages/db`. More flexible, supports dynamic content. More infrastructure.
- **Option C**: Lambda reads from an S3 bucket or CDN. Exercises update independently of Lambda deploys.

Recommendation: Option A for MVP. A JSON file in the API package that mirrors the Astro content collections. Keeps it simple.

### 3. Remove Mock Data Gate

The frontend pages currently use `apps/web/src/utils/labs/mocks.ts` for development. Once backend handlers are complete:

- Replace mock imports with real API calls
- Add `PUBLIC_LABS_API_URL` environment variable per stage
- Keep mocks for unit/E2E tests only

### 4. Security Fixes

Regardless of direction:

- Validate OAuth state parameter in callback (currently generated but not verified — CSRF risk)
- Add API Gateway throttling (no rate limiting currently)
- Review JWT storage (localStorage is XSS-vulnerable; consider httpOnly cookies)

---

## Appendix: File Reference

Every file path referenced in this document exists in the repository at commit baseline `a89cfc5` (main) or on the `labs` branch.

### Frontend
```
apps/web/src/pages/labs/index.astro
apps/web/src/pages/labs/login.astro
apps/web/src/pages/labs/setup.astro
apps/web/src/pages/labs/dashboard.astro
apps/web/src/pages/labs/modules/index.astro
apps/web/src/pages/labs/modules/[...slug].astro
apps/web/src/pages/labs/auth/callback.astro
apps/web/src/components/labs/layout/LabsHeader.astro
apps/web/src/components/labs/layout/LabsSidebar.astro
apps/web/src/components/labs/ModuleCard.astro
apps/web/src/components/labs/ExerciseCard.astro
apps/web/src/components/labs/ProgressBar.astro
apps/web/src/components/labs/CLICommand.astro
apps/web/src/components/labs/HintAccordion.astro
apps/web/src/components/labs/VerificationChecklist.astro
apps/web/src/components/labs/DifficultyBadge.astro
apps/web/src/components/labs/ObjectivesList.astro
apps/web/src/components/labs/islands/AuthStatus.tsx
apps/web/src/components/labs/islands/ProgressTracker.tsx
apps/web/src/components/labs/islands/CLICommandCopy.tsx
apps/web/src/content/labs/schemas.ts
apps/web/src/content/labs/schemas.test.ts
apps/web/src/content/labs/modules/linux.mdx
apps/web/src/content/labs/exercises/linux-01.mdx
apps/web/src/content/labs/exercises/linux-02.mdx
apps/web/src/content/labs/exercises/linux-03.mdx
apps/web/src/utils/labs/auth.ts
apps/web/src/utils/labs/api.ts
apps/web/src/utils/labs/mocks.ts
apps/web/src/utils/labs/index.ts
apps/web/e2e/labs.spec.ts
```

### Backend
```
packages/api/src/lib/response.ts
packages/api/src/lib/auth.ts
packages/api/src/lib/db.ts
packages/api/src/functions/auth/github.ts
packages/api/src/functions/auth/callback.ts
packages/api/src/functions/auth/verify.ts
packages/api/src/functions/auth/logout.ts
packages/api/src/functions/exercises/list.ts
packages/api/src/functions/exercises/get.ts
packages/api/src/functions/progress/get.ts
packages/api/src/functions/progress/record.ts
```

### Infrastructure
```
sst.config.ts
infra/api.ts
infra/auth.ts
infra/database.ts
docker-compose.yml
```

### Shared Types
```
packages/types/src/api.ts
packages/types/src/user.ts
packages/types/src/exercise.ts
packages/types/src/progress.ts
packages/types/src/index.ts
```

### Planning Documents
```
labs-plan.md                         # CPE grand vision
docs/labs-implementation-plan.md     # MVP frontend plan
docs/labs-setup.md                   # Backend setup guide
architecture.md                      # System architecture
```
