# Architect Recommendations: Akasha Lekha Audit

**Date:** 2026-02-14
**Scope:** Full-stack audit of akasha-lekha monorepo — frontend, backend, infrastructure, content, and strategic direction.

---

## 1. Executive Summary

Akasha Lekha has a polished frontend (~95% complete), fully defined infrastructure-as-code, and a functionally incomplete backend (7 of 8 Lambda handlers are stubs returning errors or empty data). Two competing vision documents exist — a focused MVP (`docs/labs-implementation-plan.md`) and a grand curriculum roadmap (`.readme/cloud-platform-engineer.md`) — with no clear decision made between them.

**The single most important decision:** Choose a strategic direction (MVP vs CPE vs Hybrid) and commit. Everything else — auth implementation, exercise data source, CLI language — flows from this. The project currently has enough infrastructure to ship either vision, but the split attention means neither is shipping.

**Current state in one sentence:** Beautiful frontend, solid infrastructure skeleton, no working backend, no working auth, no exercises that actually run.

---

## 2. Current State Assessment

### What's Solid

| Area | Status | Evidence |
|------|--------|----------|
| Frontend (Astro + Solid.js) | ~95% complete | Full page structure, components, styling, responsive design, TUI mode, blog system |
| Infrastructure-as-Code | Complete | SST config, 3 DynamoDB tables, API Gateway, secrets management (`infra/`) |
| Shared type system | Complete | `packages/types/` — User, Exercise, Progress, API response types |
| Library code | Complete | `packages/api/src/lib/` — JWT utils, DynamoDB client, HTTP response helpers |
| Content collections | Complete | Zod schemas, sample modules/exercises, blog content with custom remark/rehype plugins |
| CI/CD | Complete | 4 GitHub workflows with path-based triggering, Cloudflare + AWS OIDC deploys |
| Testing infrastructure | Complete | Vitest + Playwright configured, co-located test files, mock data |

### What's Fragile

| Area | Issue | Impact |
|------|-------|--------|
| OAuth flow | Frontend sends POST, backend expects GET (see Section 4.1) | Auth is completely broken |
| Type contracts | Frontend and backend disagree on field names (see Section 4.3) | Runtime failures when integrated |
| Dashboard | Hardcoded to mock data (`dashboard.astro:7-14`) | No path to real data without backend |
| Frontend API client | Calls `/modules/{id}` route (`api.ts:83`) that doesn't exist in backend | 404 at runtime |
| Mock auth fallback | Catch block silently sets `mock-token` (`callback.astro:71`) | Hides real auth failures |

### What's Missing

| Area | Gap | Severity |
|------|-----|----------|
| OAuth callback handler | Stub — returns `redirect(?error=not_implemented)` (`callback.ts:16`) | **Critical** — blocks all auth |
| Token verification | Stub — returns `501 Not Implemented` (`verify.ts:7`) | **Critical** — no protected routes work |
| Logout handler | Stub — returns `{ success: true }` without doing anything (`logout.ts:7`) | Medium — sessions never invalidated |
| Exercise list handler | Stub — returns `{ exercises: [] }` (`list.ts:7`) | **Critical** — no exercises visible |
| Exercise get handler | Stub — returns `404` for everything (`get.ts:13`) | **Critical** — no exercise detail |
| Progress get handler | Stub — returns `401` (`progress/get.ts:7`) | High — dashboard non-functional |
| Progress record handler | Stub — returns `401` (`progress/record.ts:7`) | High — no exercise completion tracking |
| CLI tool | Does not exist | **Critical** — core product concept |
| Rate limiting | Not implemented anywhere | Medium — API vulnerable to abuse |
| Input validation | No request body validation on any handler | Medium — injection risk |

---

## 3. Hard Decisions That Need to Be Made Now

### 3.1 Strategic Direction

**The question:** Which product are you building?

| Option | Description | Effort | Risk |
|--------|-------------|--------|------|
| **A: Infra-Learn MVP** | 4 modules (Linux, Networking, Containers, K8s), `infra-learn` CLI, GitHub auth, progress tracking. Ship in weeks. | Low | Low — focused scope |
| **B: CPE Grand Curriculum** | 9-phase, 34-week CS fundamentals program (C, assembly, OS, distributed systems, K8s). Go CLI with VM/container provisioning. | Very high | High — months of content + tooling |
| **C: Hybrid** | Ship MVP first as proof-of-concept. Expand to CPE curriculum later. MVP validates the platform; CPE is the content roadmap. | Medium | Medium — scope creep if boundaries blur |

**Recommendation: Option C (Hybrid), with hard boundaries.** Ship the Infra-Learn MVP as the platform. The CPE curriculum is a content roadmap, not a product pivot. The existing frontend, infrastructure, and CLI command schema (`infra-learn launch linux-03`) all align with MVP. The CPE document (`.readme/cloud-platform-engineer.md`) describes a different product (Go CLI, no auth, no backend, SQLite progress) — trying to merge them will stall both.

**Decision needed:** Commit to one. If Hybrid, define the exact boundary: MVP ships first, CPE content feeds into it later. Do not build two CLI tools.

### 3.2 Auth Token Storage

**The question:** Where does the JWT live after login?

| Option | Security | UX | Complexity |
|--------|----------|-----|------------|
| **A: localStorage** | Vulnerable to XSS. Any injected script can steal tokens. | Simple. Works with SPA patterns. | Low |
| **B: httpOnly cookie** | Immune to XSS (JS cannot read the cookie). Vulnerable to CSRF without mitigation. | Requires CORS and cookie config. | Medium |
| **C: httpOnly cookie + CSRF token** | Best security. httpOnly cookie for auth, CSRF token in header for state-changing requests. | Most robust but most complex. | High |

**Current state:** Frontend uses localStorage (`callback.astro:62-63`). The labs implementation plan says httpOnly cookies (Phase 3.1, step 5). These contradict.

**Recommendation: Option B (httpOnly cookie).** This is a learning platform, not a bank. httpOnly cookies eliminate XSS token theft with manageable complexity. CSRF is mitigated by requiring `Content-Type: application/json` on all POST requests (browsers won't send JSON content types in CSRF attacks without CORS preflight). The API Gateway CORS config (`infra/api.ts:14-19`) already restricts origins.

**What changes:**
- Backend callback sets `Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=Lax; Path=/`
- Frontend reads user info from a `/auth/me` endpoint (or client-side JWT decode for display-only data)
- API client sends `credentials: 'include'` on all requests (already done in `callback.astro:52`)

### 3.3 Exercise Data Source

**The question:** Where do exercise definitions live?

| Option | Pros | Cons |
|--------|------|------|
| **A: Astro content collections only** | Already built. Exercises render at build time. No API needed for exercise content. | Can't query/filter server-side. CLI tool needs a separate data source. |
| **B: DynamoDB** | API can serve exercises dynamically. CLI tool queries same source. | Exercise data must be seeded/migrated. Duplicates content collections. |
| **C: Content collections + static JSON manifest** | Content collections for web rendering. Static JSON file (generated at build time) for CLI and API. Single source of truth. | Requires build step to generate manifest. |

**Current state:** Content collections exist with 3 sample exercises (`apps/web/src/content/labs/exercises/`). API handlers for exercises are stubs. Frontend API client expects exercises from the API (`api.ts:69-76`).

**Recommendation: Option C (Content collections + static manifest).** Content collections are the source of truth. A build step generates a `exercises.json` manifest. The API serves this manifest (no DynamoDB needed for exercises). The CLI embeds it. This avoids data duplication and keeps content in markdown where it's easy to author.

**What changes:**
- Add a build script that extracts exercise metadata from content collections into `exercises.json`
- Exercise list/get handlers serve from the static manifest (loaded once at Lambda cold start)
- DynamoDB stores only user data, sessions, and progress — not exercise definitions

### 3.4 Session Management

**The question:** JWT-only or JWT + server-side sessions?

| Option | Pros | Cons |
|--------|------|------|
| **A: JWT-only** | Stateless. No session table needed. Simple to implement. | Cannot revoke tokens. Logout is client-side only (delete cookie). 7-day window if token is stolen. |
| **B: JWT + server-side sessions** | Can revoke tokens. Logout actually invalidates the session. Can track active sessions. | Requires DB lookup on every authenticated request. Sessions table already exists. |

**Current state:** Sessions table is defined (`infra/database.ts:32-39`) with TTL. Logout handler is linked to sessions table (`infra/api.ts:52`). But no handler actually uses it.

**Recommendation: Option A (JWT-only) for MVP.** The sessions table already exists and can be added later. For a learning platform with GitHub OAuth, the risk of token theft is low enough that JWT-only is acceptable. The 7-day expiry (`lib/auth.ts:8`) provides a natural rotation. Add server-side sessions later if you need "logout everywhere" or admin session management.

**Trade-off acknowledged:** If you choose httpOnly cookies (3.2), the token theft surface is already small. JWT-only is fine for now.

### 3.5 CLI Tool Language

**The question:** What language for the `infra-learn` / `cpe` CLI?

| Option | Pros | Cons |
|--------|------|------|
| **A: TypeScript (Node.js)** | Same language as rest of codebase. Share types with `@akasha/types`. Fast to build. | Requires Node.js runtime. Larger binary via pkg/vercel/ncc. |
| **B: Go** | Single static binary. No runtime dependency. Fast. CPE doc assumes Go. | Separate language from rest of codebase. No type sharing. |
| **C: Rust** | Single static binary. Fastest. Memory safe. | Steepest learning curve. Slowest to build. Overkill for a CLI. |

**Current state:** CPE document (`.readme/cloud-platform-engineer.md`) assumes Go. Content schema uses `infra-learn` as the CLI name. No CLI code exists.

**Recommendation: Option A (TypeScript) for MVP, Option B (Go) if building CPE.** For the MVP scope (launch exercises, verify completion, track progress), TypeScript is fastest to build and shares types with the backend. If the CPE grand curriculum is the goal (VM provisioning, multi-container labs, Valgrind integration), Go is the right choice. This decision follows from 3.1.

### 3.6 Backend Completion Strategy

**The question:** Implement the real backend now, or ship with mock data?

| Option | Pros | Cons |
|--------|------|------|
| **A: Implement now** | Real auth, real progress tracking. End-to-end flow works. | Blocks shipping by 1-2 weeks. |
| **B: Ship with mocks** | Ship the frontend immediately. Backend can follow. | No real auth. No real progress. Users see a demo, not a product. |
| **C: Implement auth only, mock everything else** | Users can log in. Exercises and progress use mock data. Ship fast with a real auth foundation. | Partial integration. Must revisit for full implementation. |

**Current state:** Frontend already has comprehensive mock data (`utils/labs/mocks.ts`). Dashboard hardcodes mocks (`dashboard.astro:7-14`).

**Recommendation: Option A (Implement now).** The 7 stub handlers are each ~20-40 lines of real code. The library layer is complete (`lib/auth.ts`, `lib/db.ts`, `lib/response.ts`). The infrastructure exists. Implementing the real handlers is 1-2 days of focused work, not weeks. Shipping mocks means shipping a demo — and demos don't generate the feedback loops that matter.

**Priority order for implementation:**
1. `callback.ts` — OAuth token exchange (unblocks all auth)
2. `verify.ts` — Token verification (unblocks protected routes)
3. `logout.ts` — Session cleanup
4. `list.ts` + `get.ts` — Exercise data (can serve static JSON)
5. `progress/get.ts` + `progress/record.ts` — Progress tracking

---

## 4. Security Audit

### 4.1 CRITICAL: OAuth Callback Contract Mismatch

**Severity:** Critical — auth flow is completely broken.

The backend registers the OAuth callback as a **GET** endpoint:
```
infra/api.ts:31 → api.route("GET /auth/github/callback", { ... })
```

The backend handler reads the code from **query parameters**:
```
packages/api/src/functions/auth/callback.ts:6 → const code = event.queryStringParameters?.code;
```

But the frontend sends a **POST** with the code in the **request body**:
```
apps/web/src/pages/labs/auth/callback.astro:46-51 →
  const response = await fetch(`${apiUrl}/auth/github/callback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
```

And the frontend auth utility also sends a **POST**:
```
apps/web/src/utils/labs/auth.ts:102-108 →
  const response = await fetch(`${config.apiUrl}/auth/github/callback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
```

**Impact:** The frontend POST to a GET-only route will return 403/404 from API Gateway. Even if it didn't, the backend reads `queryStringParameters` while the frontend sends `body`. These cannot work together.

**The actual OAuth flow should be:**
1. GitHub redirects the browser to `GET /auth/github/callback?code=xxx&state=yyy`
2. The backend handler (GET) receives the code via query parameters
3. Backend exchanges code for token, creates JWT, redirects browser to frontend with token

The frontend `callback.astro` page should receive the JWT (via cookie set by the redirect, or via a query parameter), not call the backend API directly. The current architecture has the frontend acting as a middleman in a flow where the backend should redirect the browser directly.

**Fix options:**
- **Option A (Server redirect):** Backend callback sets httpOnly cookie and redirects to `/labs/dashboard`. Frontend callback page is unnecessary.
- **Option B (Frontend exchange):** Change backend route to `POST /auth/github/callback`. Frontend receives code from GitHub redirect, sends to backend, gets JWT back. Requires GitHub redirect_uri to point to the frontend, not the backend.

### 4.2 CRITICAL: OAuth State Parameter Not Validated

**Severity:** Critical — CSRF vulnerability in OAuth flow.

The OAuth initiation handler generates a state parameter but never stores it:
```
packages/api/src/functions/auth/github.ts:13 → state: crypto.randomUUID(),
```

The callback handler (`callback.ts`) never validates the state parameter. This means an attacker can initiate an OAuth flow and substitute their own authorization code, potentially linking the victim's account to the attacker's GitHub account.

**Fix:** Store the state in a short-lived cookie or DynamoDB entry when generating the OAuth URL. Validate it in the callback handler before proceeding with the token exchange.

### 4.3 HIGH: Type Mismatches Between Frontend and Types Package

**Severity:** High — will cause runtime failures when frontend and backend are integrated.

**Issue 1: `avatarUrl` optionality mismatch**

The shared types package defines `avatarUrl` as **optional**:
```
packages/types/src/user.ts:6 → avatarUrl?: string;
```

But the frontend `User` type defines it as **required**:
```
apps/web/src/utils/labs/auth.ts:11 → avatarUrl: string;
```

This means the frontend will render `undefined` as an `<img src>` when a user has no avatar.

**Issue 2: `avatar_url` vs `avatarUrl` case mismatch**

The frontend `getUserFromToken` reads `avatar_url` (snake_case) from the JWT payload:
```
apps/web/src/utils/labs/auth.ts:158 → avatarUrl: (payload.avatar_url as string) || '',
```

But the `JwtPayload` type defines `avatarUrl` (camelCase):
```
packages/types/src/user.ts:21 → avatarUrl?: string;
```

The mock token in `mocks.ts:107` encodes `avatar_url` (snake_case), matching the frontend but not the type definition. When a real JWT is created by `lib/auth.ts:6-9` using the `JwtPayload` type, it will use `avatarUrl` (camelCase), and the frontend will read an empty string.

**Fix:** Standardize on `avatarUrl` (camelCase) everywhere. Update `getUserFromToken` to read `payload.avatarUrl`. Make `avatarUrl` optional in the frontend `User` type or provide a default avatar fallback.

### 4.4 HIGH: Mock Auth Fallback in Production Path

**Severity:** High — silently masks auth failures.

```
apps/web/src/pages/labs/auth/callback.astro:68-73 →
  } catch (err) {
    console.error('Callback error:', err);
    // For MVP, just redirect to dashboard anyway (mock auth)
    localStorage.setItem('labs_token', 'mock-token');
    window.location.href = '/labs/dashboard';
  }
```

If the API call fails for any reason (network error, 500, CORS issue), the user gets silently authenticated with a `mock-token`. This token will fail verification on every subsequent API call, creating a confusing UX where the user appears logged in but nothing works.

**Fix:** Remove the mock fallback. On auth failure, redirect to `/labs/login?error=auth_failed` with a user-visible error message.

### 4.5 MEDIUM: Missing Rate Limiting

No rate limiting exists on any endpoint. The OAuth endpoints are particularly vulnerable:
- `GET /auth/github` — can be used to flood GitHub OAuth
- `POST /auth/verify` — can be brute-forced for token validation
- `POST /exercises/{id}/verify` — can be spammed for progress recording

**Fix:** Add API Gateway throttling in `infra/api.ts` or per-route Lambda-level rate limiting. Start with API Gateway's built-in throttling (10 req/s default is usually fine).

### 4.6 MEDIUM: No Input Validation on Request Bodies

No handler validates request body structure. The `callback.ts` handler will eventually parse the OAuth code from the body but doesn't validate it. The `progress/record.ts` handler accepts a `verificationHash` (`packages/types/src/api.ts:34`) but doesn't validate format.

**Fix:** Add Zod validation for all request bodies. The types package already defines the schemas; use them.

### 4.7 LOW: CORS Allows Only Single Origin Per Stage

```
infra/api.ts:6-11 →
  const frontendUrls: Record<string, string> = {
    prod: "https://works-on-my.cloud",
    preview: "https://preview.works-on-my.cloud",
  };
  const frontendUrl = frontendUrls[$app.stage] || "http://localhost:4321";
```

CORS `allowOrigins` is set to a single URL. This means:
- In `dev` stage, only `localhost:4321` works (fine for dev)
- In `preview`, only the exact preview URL works (PR preview URLs may differ)
- Cannot test production API from localhost

**Fix:** For non-prod stages, consider allowing multiple origins or using a pattern match.

---

## 5. Architecture Debt & Smell Detection

### 5.1 Type Duplication Between Frontend and Types Package

The frontend defines its own types that duplicate `@akasha/types`:

| Frontend Type | Location | Types Package Equivalent |
|---------------|----------|--------------------------|
| `User` | `apps/web/src/utils/labs/auth.ts:8-13` | `packages/types/src/user.ts:1-9` |
| `JwtPayload` | `apps/web/src/utils/labs/auth.ts:31-35` | `packages/types/src/user.ts:17-24` |
| `ApiModule` | `apps/web/src/utils/labs/api.ts:10-20` | `packages/types/src/exercise.ts:4-14` |
| `ApiExercise` | `apps/web/src/utils/labs/api.ts:22-30` | `packages/types/src/exercise.ts:16-28` |
| `ApiProgress` | `apps/web/src/utils/labs/api.ts:32-37` | `packages/types/src/progress.ts:1-6` |

These types are subtly different (e.g., `description` is optional in `ApiExercise` but required in `Exercise`). This will cause silent mismatches as the codebase evolves.

**Fix:** Import from `@akasha/types` in the frontend. The package is already a workspace dependency (`apps/web/package.json:27`).

### 5.2 Frontend API Client References Non-Existent Route

`apps/web/src/utils/labs/api.ts:83` calls `GET /modules/{moduleId}`, but no such route exists in `infra/api.ts`. The API has `GET /exercises` and `GET /exercises/{id}`, not a modules endpoint.

**Fix:** Either add a modules route to the API or restructure the frontend to derive module data from the exercises endpoint (as the comment at `api.ts:67` suggests).

### 5.3 Dashboard Hardcoded to Mock Data

`apps/web/src/pages/labs/dashboard.astro:7-14` imports mock data directly:
```
const user = mockUser;
const modules = mockModules;
const exercises = mockExercises;
const progress = mockProgress;
```

There is no conditional logic to use real API data. When the backend is implemented, this page will still show mock data.

**Fix:** Either fetch from the API (requires SSR or client-side fetch) or pass through Astro's server-side props with a fallback to mocks during development.

### 5.4 CLI Command Name Mismatch

Content schemas enforce `infra-learn` as the CLI command prefix:
```
apps/web/src/content/labs/schemas.ts:72 → cliCommand: z.string().startsWith('infra-learn'),
apps/web/src/content/config.ts:52 → cliCommand: z.string().startsWith('infra-learn'),
```

But the CPE document (`.readme/cloud-platform-engineer.md`) uses `cpe` as the CLI command. The CLI tool doesn't exist yet, but the name must be decided before building it.

### 5.5 Documentation Bloat

The `docs/` directory contains 28 files, many of which are implementation completion artifacts rather than documentation:

- `SIDEBAR_FIXES_COMPLETE.md`
- `TOC_HIERARCHY_FIX_COMPLETE.md`
- `FIXES_IMPLEMENTED.md`
- `IMPROVEMENTS_COMPLETED.md`
- `CONSOLIDATION_COMPLETE.md`
- `SST_UI_ENHANCEMENTS_COMPLETE.md`
- `THREE_COLUMN_LAYOUT_IMPLEMENTATION.md`
- `PRE_COMMIT_HOOKS_FIXED.md`
- `PRE_COMMIT_CI_CD_IMPLEMENTATION_SUMMARY.md`

These files document what was done, not what should be done or how the system works. They provide no ongoing value and add noise when navigating the project.

**Fix:** Archive or delete completion-report docs. Keep only: `QUICK_START.md`, `DEPLOYMENT.md`, `BLOG-GUIDE.md`, `architecture.md`, and active planning documents.

### 5.6 ExerciseManifest Type Is Unused

`packages/types/src/exercise.ts:30-46` defines `ExerciseManifest` and `VerificationCheck` types with fields like `backend: 'vm' | 'container'`, `containerImage`, `setup`, and `verify`. These types are not referenced anywhere in the codebase outside the types package — no handler, no frontend code, no CLI uses them.

This appears to be speculative design for the CLI verification system that hasn't been built yet. Keeping them is fine if the CLI is coming soon, but they shouldn't drive backend design decisions prematurely.

### 5.7 Testing Gaps

The test infrastructure is well-configured, but coverage has gaps:

| Area | Tests Exist? | Notes |
|------|-------------|-------|
| Content schemas | Yes | `schemas.test.ts` — thorough |
| Solid.js islands | Yes | `AuthStatus.test.tsx` — component tests |
| Auth utilities | Yes | `auth.test.ts` — unit tests |
| Backend handlers | No | No tests for any Lambda handler |
| API integration | No | No tests for frontend-to-backend contract |
| E2E auth flow | No | Playwright configured but no auth tests |

**Fix:** When implementing backend handlers, co-locate tests. At minimum, test the OAuth callback handler (most complex) and the auth middleware pattern.

---

## 6. Dependency & Infrastructure Risk

### 6.1 AWS Region Choice

The project deploys to `ap-south-1` (Mumbai):
```
sst.config.ts:13 → region: "ap-south-1"
```

This is fine if the target audience is India-centric. However:
- Cloudflare Pages serves globally (edge-cached)
- API calls go to Mumbai regardless of user location
- DynamoDB is in Mumbai

**Risk:** Users outside South Asia will experience 200-400ms latency on every API call. This matters for progress tracking (real-time updates) but not for static content (served by Cloudflare edge).

**Mitigation:** Acceptable for MVP. If the audience grows globally, consider DynamoDB Global Tables + multi-region Lambda, or move to a region-agnostic architecture (Cloudflare Workers + D1/KV).

### 6.2 Vendor Dependencies

| Dependency | Risk | Mitigation |
|------------|------|------------|
| SST v3 | SST is actively maintained but niche. Breaking changes between major versions. | Infra layer is thin (3 files). Migration to raw CDK/CloudFormation is feasible. |
| Cloudflare Pages | Low risk — large company, widely used. | Standard static site. Trivially portable to Vercel/Netlify. |
| DynamoDB | Low risk — AWS core service. | Single-table design is DynamoDB-specific. Migration to PostgreSQL would require schema redesign. |
| Astro 5 | Actively maintained, popular. | Content collections API may change in major versions. Content itself is portable markdown. |
| Solid.js | Smaller community than React/Vue. | Only 3 island components. Easy to rewrite in any framework. |
| jsonwebtoken (npm) | Widely used, stable, but uses callback patterns. | Consider `jose` for modern ESM + Edge runtime support if deploying to Cloudflare Workers. |

### 6.3 Zod v4

The project uses Zod v4 (`zod: "^4.3.4"` in both root and web package.json). Zod v4 was a recent release with breaking changes from v3. Verify that:
- All schema APIs used are stable in v4
- Third-party integrations (Astro content collections) support Zod v4
- The `startsWith` validator used in exercise schemas (`schemas.ts:72`) is available in v4

### 6.4 Security Dependencies

`jsonwebtoken@9.0.2` — Last major update was in response to CVEs. No known vulnerabilities at time of audit, but this package has historically been a target. Pin the version and monitor advisories.

---

## 7. Recommendations Timeline

### This Week (Immediate)

1. **Decide strategic direction** (Section 3.1) — everything else is blocked on this
2. **Fix the OAuth callback contract** (Section 4.1) — decide GET-redirect vs POST-exchange pattern
3. **Fix the OAuth state validation** (Section 4.2) — store state, validate on callback
4. **Remove mock auth fallback** (Section 4.4) — `callback.astro:68-73`
5. **Standardize `avatarUrl` casing** (Section 4.3) — one-line fix in `auth.ts:158`

### This Month

6. **Implement all 7 stub handlers** (Section 3.6) — callback, verify, logout, exercises, progress
7. **Eliminate type duplication** (Section 5.1) — frontend imports from `@akasha/types`
8. **Wire dashboard to real data** (Section 5.3) — replace mock imports with API calls
9. **Archive stale docs** (Section 5.5) — delete completion-report files
10. **Add backend handler tests** (Section 5.7) — especially OAuth callback

### This Quarter

11. **Build the CLI tool** (Section 3.5) — in chosen language, with `verify` command at minimum
12. **Add rate limiting** (Section 4.5) — API Gateway throttling
13. **Add request body validation** (Section 4.6) — Zod schemas on all POST handlers
14. **Write first real exercise module** — Linux fundamentals with working verification
15. **Create content pipeline** — process for authoring exercises with test suites
16. **E2E test the full auth flow** — Playwright test from login click to dashboard render

---

## 8. Anti-Patterns to Avoid

### 8.1 The Grand Vision Trap

The CPE roadmap (`.readme/cloud-platform-engineer.md`) describes a 34-week, 9-phase curriculum spanning C programming through Kubernetes internals. It's thorough and well-designed. It's also a year of work for a team, not a solo project.

The existing codebase is built for a simpler product (infra-learn: 4 modules, practical exercises, GitHub auth). Trying to backport the CPE architecture (Go CLI, SQLite progress, no backend, VM provisioning) into the existing SST + DynamoDB + TypeScript stack will create an impedance mismatch that slows everything down.

**Rule:** Ship the product you've already 95% built. Use the CPE document as a content roadmap, not an architecture blueprint.

### 8.2 Documentation as Deliverable

28 docs files exist. Many document completed work (`SIDEBAR_FIXES_COMPLETE.md`, `TOC_HIERARCHY_FIX_COMPLETE.md`). Writing completion reports feels productive but doesn't ship product. The codebase itself, with its commit history, is the record of what changed.

**Rule:** Delete completion-report docs. Write documentation only for things someone needs to reference later: architecture decisions, setup guides, API contracts.

### 8.3 Infrastructure Before Product

Three DynamoDB tables, API Gateway with CORS, secrets management, CI/CD with path-filtered jobs, Cloudflare Pages with preview deployments — all production-ready. Meanwhile, 7 of 8 Lambda handlers return stubs.

The infrastructure is excellent. But infrastructure without handlers is a highway without cars.

**Rule:** No more infrastructure work until the 7 stub handlers are implemented and the auth flow works end-to-end.

### 8.4 Premature Abstraction

The types package defines `ExerciseManifest` with `backend: 'vm' | 'container'`, `VerificationCheck` with regex matchers, and `containerImage` fields (`packages/types/src/exercise.ts:30-53`). None of this is used anywhere. It's designing a verification system that doesn't exist yet.

Similarly, the frontend API client has functions for `calculateModuleProgress`, `isExerciseCompleted`, and `getNextExercise` (`api.ts:166-205`) — useful abstractions, but built before the data they operate on exists.

**Rule:** Build the simplest thing that works. Add abstraction when you have three concrete use cases, not when you imagine them.

### 8.5 Duplicating Instead of Importing

The frontend defines its own `User`, `JwtPayload`, `ApiModule`, `ApiExercise`, and `ApiProgress` types (`auth.ts`, `api.ts`) despite `@akasha/types` being a workspace dependency. This creates drift — the types are already different (optional vs required fields, snake_case vs camelCase).

**Rule:** One source of truth for types. If the shared types don't match what the frontend needs, fix the shared types. Don't create local copies.

---

## Appendix: File Reference Index

All file paths and line numbers referenced in this document:

| File | Lines | Referenced In |
|------|-------|---------------|
| `packages/api/src/functions/auth/github.ts` | 13 | 4.2 |
| `packages/api/src/functions/auth/callback.ts` | 6, 16 | 2, 4.1 |
| `packages/api/src/functions/auth/verify.ts` | 7 | 2 |
| `packages/api/src/functions/auth/logout.ts` | 7 | 2 |
| `packages/api/src/functions/exercises/list.ts` | 7 | 2 |
| `packages/api/src/functions/exercises/get.ts` | 13 | 2 |
| `packages/api/src/functions/progress/get.ts` | 7 | 2 |
| `packages/api/src/functions/progress/record.ts` | 7 | 2 |
| `packages/api/src/lib/auth.ts` | 6-9, 8 | 3.4, 4.3 |
| `packages/api/src/lib/db.ts` | — | 2 |
| `packages/api/src/lib/response.ts` | — | 2 |
| `infra/api.ts` | 6-11, 14-19, 31, 52 | 4.1, 4.7, 5.2 |
| `infra/database.ts` | 32-39 | 3.4 |
| `packages/types/src/user.ts` | 6, 17-24, 21 | 4.3 |
| `packages/types/src/exercise.ts` | 30-53 | 5.6, 8.4 |
| `packages/types/src/api.ts` | 34 | 4.6 |
| `apps/web/src/pages/labs/auth/callback.astro` | 46-52, 62-63, 68-73, 71 | 4.1, 3.2, 4.4 |
| `apps/web/src/pages/labs/dashboard.astro` | 7-14, 55 | 5.3 |
| `apps/web/src/utils/labs/auth.ts` | 8-13, 11, 31-35, 102-108, 158 | 4.3, 5.1 |
| `apps/web/src/utils/labs/api.ts` | 10-37, 67, 69-76, 83, 166-205 | 5.1, 5.2, 8.4 |
| `apps/web/src/utils/labs/mocks.ts` | 107 | 4.3 |
| `apps/web/src/content/labs/schemas.ts` | 72 | 5.4 |
| `apps/web/src/content/config.ts` | 52 | 5.4 |
| `sst.config.ts` | 13 | 6.1 |
| `.readme/cloud-platform-engineer.md` | — | 3.1, 5.4, 8.1 |
| `docs/labs-implementation-plan.md` | — | 3.2 |
