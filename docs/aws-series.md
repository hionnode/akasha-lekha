# AWS Mastery: The Complete Startup Infrastructure Curriculum

## Definitive Final Edition (65 Parts)

---

## Series Philosophy

### The Three Pillars

|Pillar|What It Means|
|---|---|
|**Production-Ready**|Everything deploys to AWS with proper security, observability, and scaling|
|**World-Class DX**|Vercel-like workflow: push → preview → merge → production|
|**Confidence Through Testing**|Unit, Integration, E2E, Load — know it works before it's live|

### Pedagogical Principles

|Principle|Implementation|
|---|---|
|**Show Before Tell**|Deploy first, explain concepts after readers see them working|
|**Magic First**|SigNoz runs from Part 5; we explain what it shows as things deploy|
|**Progressive Complexity**|EC2 → ECS → Lambda (understand fundamentals before abstractions)|
|**Real-World Patterns**|Every decision includes "The Fine Line" — under vs right vs over|

---

## Observability Strategy: "Magic First, Explain Later"

Instead of front-loading observability theory, we let readers discover it:

|Part|What Deploys|What Appears in SigNoz|What We Say|
|:-:|---|---|---|
|5|SigNoz itself|Empty dashboard|"Just run this. Trust me."|
|19|First frontend|Web Vitals, page loads|"Look — your site's performance!"|
|30|First backend|Request traces appear|"See this waterfall? That's your request's journey"|
|34|K6 load test|Metrics spike|"Watch the dashboard while K6 runs"|
|39|Containers + logs|Logs stream in|"Now you have metrics, traces, AND logs"|
|43|ECS services|Service map|"See how services connect?"|
|55|Async (SQS)|Distributed traces|"Traces work across queues too"|
|60-61|—|—|**NOW we teach OTel properly — everything clicks**|

**Key insight:** By Part 60, readers have been using SigNoz for 55 parts. They have intuition. Now theory makes sense.

---

## Technologies Covered

### Infrastructure (AWS)

|Category|Services|
|---|---|
|Compute|EC2, ECS Fargate, Lambda|
|Storage|S3, EBS|
|Database|RDS PostgreSQL, ElastiCache Redis|
|Networking|VPC, ALB, CloudFront, Route53, API Gateway|
|Messaging|SQS, SNS, EventBridge|
|Security|IAM, Secrets Manager, Security Hub, GuardDuty, WAF|
|Mail|SES|

### Application Stack

|Category|Technologies|
|---|---|
|Frontend|React, Astro, SvelteKit, SolidStart|
|Backend|Bun.js, Python (FastAPI), Go|
|Auth|Clerk (primary), Auth0/Cognito (alternatives)|
|Feature Flags|AWS AppConfig + custom implementation|

### Developer Experience

|Category|Technologies|
|---|---|
|Version Control|Git, GitHub|
|Code Quality|Pre-commit, Biome, Ruff, golangci-lint, gitleaks|
|CI/CD|GitHub Actions|
|Preview Environments|Terraform workspaces + GitHub Actions|
|Unit Testing|Bun test, pytest, Go testing|
|E2E Testing|Playwright|
|Load Testing|K6|
|Mocking|MSW, responses/httpx-mock, testify/gomock|
|Local Dev|Docker Compose|
|Container Security|Trivy|

### Observability

|Category|Technologies|
|---|---|
|Instrumentation|OpenTelemetry (auto + manual)|
|Platform|SigNoz (self-hosted)|
|Synthetic Monitoring|K6|

---

## Complete Series Outline (65 Parts)

---

# Phase 1: Foundation (Parts 1-5)

## Part 1: Your First 60 Minutes in AWS

**Subtitle:** What everyone skips and regrets later

|Section|Content|
|---|---|
|Why This Matters|Horror stories of compromised accounts, $50K bills|
|Console Walkthrough|Root account lockdown, MFA setup|
|Core Setup|IAM admin user, billing alerts, CloudTrail, region selection|
|Tagging Strategy|Environment, Project, Owner tags from day one|
|**Lead Magnet**|AWS Account Security Checklist (PDF)|

|The Fine Line|
|---|
|❌ Under: Using root account daily, no MFA|
|✅ Right: Root locked, IAM admin with MFA, billing alerts|
|❌ Over: Complex AWS Organizations for solo founder|

---

## Part 2: IAM — The Key to Everything

**Subtitle:** Least privilege without losing your mind

|Section|Content|
|---|---|
|Core Concepts|Users, Groups, Roles, Policies|
|Practical Setup|Developer group, CI/CD role, service roles|
|Policy Patterns|Managed vs inline, policy simulator|
|Common Mistakes|Wildcard permissions, embedded credentials|
|**Lead Magnet**|IAM Policy Templates for Startups|

---

## Part 3: Your Local AWS Setup

**Subtitle:** CLI, profiles, and working like a professional

|Section|Content|
|---|---|
|AWS CLI v2|Installation, configuration|
|Named Profiles|Dev, staging, prod separation|
|Security|aws-vault for credential protection|
|Quality of Life|Shell completions, aliases|

---

## Part 4: Terraform Fundamentals

**Subtitle:** Why clicking is technical debt

|Section|Content|
|---|---|
|IaC Philosophy|Reproducibility, code review for infrastructure|
|HCL Basics|Providers, resources, variables, outputs|
|State Management|S3 backend + DynamoDB locking|
|Project Structure|Modules, environments|
|**Terraform Created**|State bucket, lock table|
|**Lead Magnet**|Terraform Starter Template|

---

## Part 5: SigNoz Setup — Just Run This

**Subtitle:** You'll thank me in 25 parts

|Section|Content|
|---|---|
|What We Do|Run SigNoz, verify it works|
|What We Don't Do|Explain metrics/traces/logs theory (yet)|
|Deployment Options|Docker Compose (homelab), EC2, ECS|
|**SigNoz Status**|Empty dashboard — "This fills up as we deploy"|
|**Lead Magnet**|SigNoz Deployment Templates|

**This is the shortest part in the series. ~500 words. Just get it running.**

```yaml
# docker-compose.signoz.yml (simplified)
# "Run this. Open localhost:3301. Done."
```

|📊 SigNoz Dashboard|
|---|
|Panels: 0 (empty, waiting for data)|

---

# Phase 2: Developer Workflow (Parts 6-9)

## Part 6: Git & GitHub — Professional Workflow

**Subtitle:** The foundation your whole team builds on

|Section|Content|
|---|---|
|Branching Strategy|Trunk-based development (recommended for small teams)|
|Branch Naming|`feature/`, `fix/`, `chore/` conventions|
|Commit Messages|Conventional Commits standard|
|Repository Setup|Initial structure for monorepo|
|**Lead Magnet**|.gitignore Templates Collection|

|The Fine Line|
|---|
|❌ Under: Push to main, random commit messages|
|✅ Right: Feature branches, conventional commits, clear history|
|❌ Over: GitFlow with release branches for 2-person team|

---

## Part 7: Branch Protection & PR Workflow

**Subtitle:** Quality gates that don't slow you down

|Section|Content|
|---|---|
|Branch Protection|Required reviews, status checks, no force push|
|PR Templates|Checklist for testing, screenshots|
|CODEOWNERS|Auto-assign reviewers|
|Auto-merge|When all checks pass|
|**Lead Magnet**|PR Template Collection|

```markdown
## PR Template
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] E2E tests pass (if UI changed)
- [ ] Load tested (if performance-sensitive)
- [ ] Preview deployment verified
```

---

## Part 8: Pre-Commit Hooks & Code Quality

**Subtitle:** Catch problems before they become PRs

|Section|Content|
|---|---|
|Pre-commit Framework|Installation, configuration|
|Linting|Biome (Bun), Ruff (Python), golangci-lint (Go)|
|Formatting|Automatic on commit|
|Secrets Detection|gitleaks — prevent credential commits|
|Commit Linting|commitlint for conventional commits|
|**Lead Magnet**|Pre-commit Config Templates|

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: check-yaml
      - id: detect-private-key
      - id: no-commit-to-branch
        args: ['--branch', 'main']
  
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.1
    hooks:
      - id: gitleaks
  
  # Language-specific hooks...
```

|🚀 DX Enhancement|
|---|
|After this part: Bad code can't reach the repository. Every commit is clean.|

---

## Part 9: Monorepo Structure & Tooling

**Subtitle:** Organizing code for multiple services

|Section|Content|
|---|---|
|Structure|Complete directory layout|
|Makefile|Common commands across all services|
|Shared Code|packages/ directory pattern|
|Documentation|README standards|

```
aws-mastery/
├── .github/workflows/
├── terraform/
│   ├── modules/
│   └── environments/
├── services/
│   ├── bun-api/
│   ├── python-api/
│   └── go-api/
├── frontend/
│   ├── react-dashboard/
│   ├── astro-marketing/
│   ├── svelte-app/
│   └── solid-app/
├── packages/
├── tests/
│   ├── e2e/          # Playwright
│   └── load/         # K6
├── docker-compose.yml
├── docker-compose.dev.yml
└── Makefile
```

---

# Phase 3: Local Development (Parts 10-12)

## Part 10: Docker Compose — Local Development Environment

**Subtitle:** Production parity on your laptop

|Section|Content|
|---|---|
|Multi-service Setup|PostgreSQL, Redis, SigNoz, all APIs|
|Hot Reloading|Volume mounts, watch modes|
|Health Checks|Services wait for dependencies|
|Networking|Service discovery|
|**Lead Magnet**|Docker Compose Development Templates|

```yaml
# docker-compose.dev.yml
services:
  postgres:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev"]
    
  bun-api:
    volumes:
      - ./services/bun-api:/app
    command: bun --hot run src/index.ts
    depends_on:
      postgres:
        condition: service_healthy
```

|🚀 DX Enhancement|
|---|
|`make dev` → Full stack running with hot reload in under 60 seconds.|

---

## Part 11: Database Migrations

**Subtitle:** Schema changes without the fear

|Section|Content|
|---|---|
|Migration Philosophy|Version controlled schema|
|Tools by Language|Prisma (Bun), Alembic (Python), golang-migrate (Go)|
|CI Integration|Migrations run automatically|
|Rollback Strategies|Down migrations, expand-contract pattern|

|Zero-Downtime Migration Pattern|
|---|
|1. Add new column (nullable)|
|2. Deploy code writing to both|
|3. Backfill existing data|
|4. Deploy code reading from new|
|5. Drop old column|

---

## Part 12: Environment Variables & Secrets (Local)

**Subtitle:** Configuration without the chaos

|Section|Content|
|---|---|
|dotenv Patterns|.env.example (committed), .env (gitignored)|
|Secret Management|1Password CLI integration|
|Environment Hierarchy|Local → Preview → Staging → Production|
|direnv|Auto-load per directory|

```bash
# Load secrets from 1Password
op run --env-file=.env.example -- make dev
```

---

# Phase 4: Frontend Deployment (Parts 13-19)

## Part 13: S3 — Storage Fundamentals

**Subtitle:** Buckets, policies, and static hosting

|Section|Content|
|---|---|
|Core Concepts|Buckets, objects, keys|
|Policies|Bucket policies vs IAM policies|
|Versioning|Enable for production buckets|
|Lifecycle Rules|Cost optimization|
|**Terraform**|S3 bucket module|

---

## Part 14: Route53 + ACM — DNS and SSL

**Subtitle:** Custom domains and HTTPS

|Section|Content|
|---|---|
|DNS Basics|Records types (A, CNAME, ALIAS)|
|Hosted Zones|Public vs private|
|ACM Certificates|DNS validation, us-east-1 requirement|
|**Terraform**|Route53 + ACM module|
|**Lead Magnet**|DNS Records Cheatsheet|

---

## Part 15: CloudFront — CDN Fundamentals

**Subtitle:** Global delivery and caching

|Section|Content|
|---|---|
|Distribution Setup|Origins, behaviors|
|Origin Access Control|Secure S3 access|
|Cache Policies|When to cache, when not to|
|Error Pages|SPA routing (200 on 404)|
|**Terraform**|CloudFront distribution module|

---

## Part 16: User Uploads with S3 — NEW

**Subtitle:** Presigned URLs and file handling

|Section|Content|
|---|---|
|Direct Browser Upload|Presigned URLs (no server relay)|
|Validation|File type, size limits|
|Processing|Lambda trigger for thumbnails|
|Serving|CloudFront for user-generated content|
|Security|Signed URLs for private content|
|**Lead Magnet**|S3 Upload Patterns Guide|

```typescript
// Generate presigned URL (Bun.js)
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

async function getUploadUrl(filename: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.UPLOADS_BUCKET,
    Key: `uploads/${crypto.randomUUID()}/${filename}`,
    ContentType: contentType,
  })
  
  return getSignedUrl(s3Client, command, { expiresIn: 3600 })
}
```

---

## Part 17: Frontend Deployment — React + Astro

**Subtitle:** SPA vs Static Site Generation

|Section|Content|
|---|---|
|Build Differences|CSR (React) vs SSG (Astro)|
|OTel Browser SDK|Web Vitals to SigNoz|
|Deployment|S3 + CloudFront|
|**Tests**|Vitest for React, Astro test utils|
|**Lead Magnet**|Frontend Deployment Checklist|

|📊 SigNoz Dashboard|
|---|
|NEW: Web Vitals panel (LCP, FID, CLS)|
|"Look — your page load times are being tracked!"|

---

## Part 18: Frontend Deployment — SvelteKit + SolidStart

**Subtitle:** The next-gen frameworks

|Section|Content|
|---|---|
|SvelteKit|adapter-static, prerendering|
|SolidStart|Static export|
|OTel Setup|Same pattern as React|
|**Tests**|Vitest + testing-library variants|
|**Lead Magnet**|Frontend Framework Comparison Chart|

---

## Part 19: Frontend Preview Environments

**Subtitle:** Every PR gets a URL (frontend only)

|Section|Content|
|---|---|
|Architecture|S3 bucket per PR, wildcard CloudFront|
|GitHub Actions|Deploy on PR open, destroy on close|
|URL Pattern|`pr-123.preview.yourdomain.com`|
|Cost Control|Auto-destroy after 48h inactivity|

```yaml
# .github/workflows/preview-frontend.yml
on:
  pull_request:
    paths:
      - 'frontend/**'

jobs:
  deploy-preview:
    steps:
      - name: Build frontend
        run: cd frontend/react-dashboard && npm run build
      
      - name: Deploy to S3
        run: aws s3 sync dist/ s3://preview-${{ github.event.pull_request.number }}/
      
      - name: Comment PR with URL
        # Add preview URL to PR
```

|🚀 DX Enhancement|
|---|
|Open PR with frontend changes → Get preview URL in 3 minutes|

---

# Phase 5: Networking (Parts 20-22)

## Part 20: VPC — Networking Fundamentals

**Subtitle:** Just enough networking

|Section|Content|
|---|---|
|VPC Basics|CIDR blocks, subnets (public/private)|
|Internet Access|Internet Gateway, NAT Gateway|
|VPC Endpoints|S3, ECR (save NAT costs)|
|**Terraform**|VPC module|
|**Lead Magnet**|VPC Reference Architecture|

|The Fine Line|
|---|
|❌ Under: Default VPC, everything public|
|✅ Right: Custom VPC, public/private subnets, NAT for private|
|❌ Over: Transit Gateway for single-account setup|

---

## Part 21: Security Groups — Stateful Firewalls

**Subtitle:** The rules that keep you safe

|Section|Content|
|---|---|
|Security Group Basics|Inbound/outbound rules, stateful|
|Common Patterns|ALB → ECS → RDS chain|
|Self-referencing|Service-to-service within same SG|
|**Terraform**|Security group modules|
|**Lead Magnet**|Security Group Patterns Cheatsheet|

---

## Part 22: ALB — Application Load Balancer

**Subtitle:** Traffic distribution and health checks

|Section|Content|
|---|---|
|ALB Components|Listeners, target groups, rules|
|Health Checks|Configuration, grace periods|
|HTTPS Termination|ACM certificate attachment|
|Access Logs|S3 for debugging|
|WebSocket Support|Configuration for real-time|
|**Terraform**|ALB module|
|**SigNoz**|ALB metrics (request count, latency)|

|📊 SigNoz Dashboard|
|---|
|NEW: ALB request rate, 4xx/5xx rates, target response time|

---

# Phase 6: API Design & Testing (Parts 23-27)

## Part 23: API Design — REST Best Practices

**Subtitle:** Design APIs that don't need rewrites

|Section|Content|
|---|---|
|Resource Naming|Nouns, plural, hierarchical|
|HTTP Methods|GET/POST/PUT/PATCH/DELETE semantics|
|Status Codes|When to use which|
|Error Format|Consistent error responses|
|Pagination|Cursor-based (recommended) vs offset|
|Versioning|URL vs header|
|**Lead Magnet**|API Design Cheatsheet|

```json
// Standard error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Invalid format" }
    ],
    "request_id": "req_abc123",
    "trace_id": "trace_xyz789"
  }
}
```

---

## Part 24: Request Validation & OpenAPI

**Subtitle:** Type safety at the API boundary

|Section|Content|
|---|---|
|Validation Libraries|Zod (Bun), Pydantic (Python), go-validator (Go)|
|OpenAPI Generation|Auto-generate from code|
|Documentation UI|Swagger UI, Redoc|
|Client Generation|TypeScript clients from OpenAPI|

```typescript
// Bun.js with Zod
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.enum(['user', 'admin']).default('user')
})
```

---

## Part 25: Mocking External Services

**Subtitle:** Test without dependencies

|Section|Content|
|---|---|
|Why Mock|Isolation, speed, reliability|
|MSW (Frontend)|Mock at network level|
|Python Mocking|responses, httpx-mock|
|Go Mocking|testify/mock, gomock|
|When Not to Mock|Integration tests need real services|

```typescript
// MSW handler
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Test User' }
    ])
  })
]
```

---

## Part 26: E2E Testing with Playwright — NEW

**Subtitle:** Test what users actually experience

|Section|Content|
|---|---|
|Playwright Setup|Installation, configuration|
|Writing E2E Tests|Page objects, selectors|
|CI Integration|Run against preview environments|
|Visual Regression|Screenshot comparison|
|**Lead Magnet**|Playwright Test Templates|

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test('user can log in', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  
  await expect(page).toHaveURL('/dashboard')
  await expect(page.locator('h1')).toContainText('Welcome')
})
```

|🧪 Testing Stack Complete|
|---|
|✅ Unit tests (Vitest, pytest, Go testing)|
|✅ Mocking (MSW, responses, testify)|
|✅ E2E tests (Playwright)|
|⏳ Load tests (K6, coming in Part 34)|

---

## Part 27: Testing in CI Pipeline

**Subtitle:** Automated quality gates

|Section|Content|
|---|---|
|Test Matrix|All languages in parallel|
|Service Containers|PostgreSQL, Redis in CI|
|E2E in CI|Against preview environment|
|Coverage Reports|Codecov integration|
|Failure Handling|Required checks before merge|

```yaml
# .github/workflows/ci.yml
jobs:
  test:
    strategy:
      matrix:
        service: [bun-api, python-api, go-api]
    services:
      postgres:
        image: postgres:16
    steps:
      - run: make test-${{ matrix.service }}
  
  e2e:
    needs: [deploy-preview]
    steps:
      - run: npx playwright test
        env:
          BASE_URL: ${{ needs.deploy-preview.outputs.url }}
```

---

# Phase 7: Backend on EC2 (Parts 28-33)

## Part 28: EC2 — Compute Fundamentals

**Subtitle:** Instances and the OTel Collector

|Section|Content|
|---|---|
|Instance Basics|Types, AMIs, pricing|
|SSM Access|No SSH keys needed|
|Instance Profiles|IAM roles for EC2|
|OTel Collector|Install on EC2, send to SigNoz|
|User Data|Bootstrap scripts|
|**Terraform**|EC2 module|
|**Lead Magnet**|EC2 Instance Type Cheatsheet|

|📊 SigNoz Dashboard|
|---|
|NEW: Host metrics (CPU, memory, disk, network)|

---

## Part 29: Backend on EC2 — Bun.js API

**Subtitle:** The fast JavaScript runtime

|Section|Content|
|---|---|
|Bun Runtime|Why Bun, installation|
|HTTP Server|Elysia or Hono framework|
|OTel Instrumentation|@opentelemetry/auto-instrumentations-node|
|systemd Deployment|Process management|
|**Unit Tests**|Bun test|
|**Terraform**|EC2 with Bun API|

|📊 SigNoz Dashboard|
|---|
|NEW: API request traces, latency histogram|
|"See this waterfall? That's your request's journey through the code"|

```typescript
// First trace example
app.get('/users', async (c) => {
  // This entire handler creates a span
  const users = await db.query('SELECT * FROM users')
  // Database call creates a child span
  return c.json(users)
})
```

|🧪 Testing Addition|
|---|

```typescript
import { describe, it, expect } from 'bun:test'

describe('Users API', () => {
  it('returns users list', async () => {
    const res = await app.handle(new Request('http://localhost/users'))
    expect(res.status).toBe(200)
  })
})
```

---

## Part 30: Authentication with Clerk — MOVED EARLIER

**Subtitle:** Auth that doesn't take a sprint

|Section|Content|
|---|---|
|Why Clerk|vs Auth0 vs Cognito comparison|
|Setup|Clerk dashboard, API keys|
|Bun Integration|Middleware, protected routes|
|Python Integration|JWT validation|
|Go Integration|JWT validation|
|RBAC Basics|admin/user/viewer roles|
|**Lead Magnet**|Auth Integration Checklist|

```typescript
// Bun.js with Clerk
import { clerkMiddleware, requireAuth } from '@clerk/express'

app.use(clerkMiddleware())

app.get('/api/protected', requireAuth(), (c) => {
  const userId = c.get('auth').userId
  return c.json({ userId })
})
```

```python
# Python JWT validation
from clerk_backend_api import Clerk

async def get_current_user(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    session = clerk.sessions.verify_token(token)
    return session.user_id
```

```go
// Go JWT validation
func authMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        claims, err := clerk.VerifyToken(r.Header.Get("Authorization"))
        if err != nil {
            http.Error(w, "Unauthorized", 401)
            return
        }
        ctx := context.WithValue(r.Context(), "user_id", claims.Subject)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
```

|🔒 Security Note|
|---|
|Every API from now on can be protected. No more "we'll add auth later"|

---

## Part 31: Backend on EC2 — Python FastAPI

**Subtitle:** The Python standard for APIs

|Section|Content|
|---|---|
|FastAPI Setup|Async Python, type hints|
|OTel Instrumentation|opentelemetry-instrumentation-fastapi|
|systemd Deployment|Uvicorn + systemd|
|**Unit Tests**|pytest with TestClient|

```python
# tests/test_users.py
from fastapi.testclient import TestClient

def test_get_users():
    response = client.get("/users")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

---

## Part 32: Backend on EC2 — Go API

**Subtitle:** When performance matters

|Section|Content|
|---|---|
|Go HTTP Server|net/http or Chi router|
|OTel Instrumentation|go.opentelemetry.io packages|
|Single Binary|Build and deploy|
|**Unit Tests**|Go testing with httptest|
|**Lead Magnet**|Backend Language Comparison|

```go
func TestGetUsers(t *testing.T) {
    req := httptest.NewRequest(http.MethodGet, "/users", nil)
    w := httptest.NewRecorder()
    
    handler.GetUsers(w, req)
    
    if w.Code != http.StatusOK {
        t.Errorf("expected 200, got %d", w.Code)
    }
}
```

---

## Part 33: Auto Scaling Groups

**Subtitle:** Scale EC2 automatically

|Section|Content|
|---|---|
|ASG Basics|Launch templates, scaling policies|
|Health Checks|EC2 vs ELB health|
|Scaling Triggers|CPU, custom metrics|
|Deployment Patterns|Rolling updates|
|**Terraform**|ASG module|

---

# Phase 8: Load Testing (Part 34)

## Part 34: K6 Load Testing — Fundamentals

**Subtitle:** Know your limits before production

|Section|Content|
|---|---|
|K6 Basics|Virtual users, duration, checks|
|Test Types|Smoke, load, stress, spike, soak|
|Thresholds|Pass/fail criteria|
|CI Integration|Automated performance gates|
|K6 + SigNoz|Correlate load tests with traces|
|**Lead Magnet**|K6 Test Templates|

|K6 Test Types|
|---|
|**Smoke**: 1-5 VUs, verify it works (every PR)|
|**Load**: Expected traffic, find baseline (before staging)|
|**Stress**: Push limits, find breaking point (pre-release)|
|**Spike**: Sudden surge simulation|
|**Soak**: Extended duration, find leaks|

```javascript
// tests/load/smoke.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 3,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
}

export default function () {
  const res = http.get(`${__ENV.BASE_URL}/api/health`)
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 500,
  })
  sleep(1)
}
```

|📊 SigNoz Dashboard|
|---|
|NEW: K6 test correlation panel|
|"Run K6, watch SigNoz — see the spike in real-time"|

|🚀 DX Enhancement|
|---|
|Every PR runs smoke tests. Performance regression = blocked merge.|

---

# Phase 9: Database (Parts 35-38)

## Part 35: RDS — Managed PostgreSQL

**Subtitle:** Databases without the 3 AM pages

|Section|Content|
|---|---|
|RDS Setup|Instance class, storage, Multi-AZ|
|Subnet Groups|Private subnet placement|
|Parameter Groups|Tuning basics|
|Encryption|At rest and in transit|
|**Terraform**|RDS module|
|**SigNoz**|RDS CloudWatch metrics|
|**Lead Magnet**|RDS Sizing Guide|

|📊 SigNoz Dashboard|
|---|
|NEW: RDS connections, CPU, read/write IOPS|

---

## Part 36: Database Operations — Advanced — NEW

**Subtitle:** Scaling and reliability patterns

|Section|Content|
|---|---|
|Read Replicas|When and how to use|
|Connection Pooling|RDS Proxy setup|
|Query Optimization|EXPLAIN, indexes, N+1 detection|
|Backup Testing|Actually restore and verify|
|**Terraform**|RDS Proxy module|

```sql
-- Find slow queries in RDS
SELECT query, calls, mean_time, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

|Backup Testing Checklist|
|---|
|1. Create snapshot|
|2. Restore to new instance|
|3. Verify data integrity|
|4. Run smoke tests against restored DB|
|5. Document restore time|
|**Do this quarterly.**|

---

## Part 37: Secrets Manager

**Subtitle:** Credentials done right

|Section|Content|
|---|---|
|Secrets Manager|Storing database credentials|
|Rotation|Automatic credential rotation|
|Application Access|IAM roles, not environment variables|
|**Terraform**|Secrets Manager module|

---

## Part 38: ElastiCache Redis

**Subtitle:** Caching and sessions

|Section|Content|
|---|---|
|ElastiCache Setup|Redis cluster mode disabled (simpler)|
|Caching Patterns|Cache-aside, write-through|
|Session Storage|Replace in-memory sessions|
|Rate Limiting|Distributed rate limiting|
|**Terraform**|ElastiCache module|

---

# Phase 10: Containers (Parts 39-44)

## Part 39: Docker — Production Dockerfiles

**Subtitle:** Multi-stage builds and security

|Section|Content|
|---|---|
|Multi-stage Builds|Small, secure images|
|Layer Optimization|Caching, ordering|
|Security|Non-root users, distroless bases|
|Scanning|Trivy in CI pipeline|
|**Dockerfiles**|Production-ready for all languages|
|**Lead Magnet**|Dockerfile Templates|

```yaml
# Add to CI pipeline
- name: Scan Docker image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: '${{ env.IMAGE }}'
    exit-code: '1'
    severity: 'CRITICAL,HIGH'
```

|📊 SigNoz Dashboard|
|---|
|NEW: Container logs appear|
|"Now you have all three: metrics, traces, AND logs"|

---

## Part 40: ECR — Container Registry

**Subtitle:** Your private Docker Hub

|Section|Content|
|---|---|
|ECR Setup|Repository creation|
|Lifecycle Policies|Auto-delete old images|
|Scanning|Automatic vulnerability scanning|
|Pull-through Cache|Cache public images|
|**Terraform**|ECR module|

---

## Part 41: ECS Fargate — Bun.js API

**Subtitle:** Containers without managing servers

|Section|Content|
|---|---|
|ECS Concepts|Clusters, services, tasks|
|Task Definitions|Container specs, resources|
|OTel Sidecar|Collector as sidecar container|
|Service Discovery|CloudMap integration|
|**Terraform**|ECS cluster + service modules|
|**Lead Magnet**|ECS Task Definition Templates|

```json
// Task definition with OTel sidecar
{
  "containerDefinitions": [
    {
      "name": "app",
      "image": "...",
      "environment": [
        {"name": "OTEL_EXPORTER_OTLP_ENDPOINT", "value": "http://localhost:4317"}
      ]
    },
    {
      "name": "otel-collector",
      "image": "otel/opentelemetry-collector:latest",
      "portMappings": [{"containerPort": 4317}]
    }
  ]
}
```

|📊 SigNoz Dashboard|
|---|
|NEW: ECS service metrics, container health|

---

## Part 42: ECS Fargate — Python + Go APIs

**Subtitle:** Multi-language ECS deployment

|Section|Content|
|---|---|
|Python on ECS|Resource tuning for Python|
|Go on ECS|Minimal resources, fast startup|
|Service-to-Service|Internal load balancing|

---

## Part 43: Full-Stack Preview Environments — NEW

**Subtitle:** Complete preview with backend

|Section|Content|
|---|---|
|Architecture|ECS services per PR|
|Database Strategy|Shared RDS, schema isolation|
|Cost Optimization|Small tasks, auto-cleanup|
|GitHub Actions|Complete workflow|
|**Lead Magnet**|Preview Environment Templates|

```yaml
# Full-stack preview creates:
# - S3 + CloudFront for frontend
# - ECS service for each API
# - Database schema for this PR
# - All wired together
# 
# PR comment includes:
# - Frontend URL
# - API URL  
# - SigNoz filtered to this PR
```

|🚀 DX Enhancement|
|---|
|Full application preview per PR. Test everything before merge.|

---

## Part 44: K6 Load Testing — Containers

**Subtitle:** Load testing ECS services

|Section|Content|
|---|---|
|ECS Load Testing|Find container limits|
|Scaling Observation|Watch ECS scale during test|
|Cost per Request|Calculate under load|
|Bottleneck Finding|Database, CPU, memory|

```javascript
// tests/load/stress-ecs.js
export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
}
```

|📊 SigNoz Dashboard|
|---|
|Watch: ECS task count, CPU/memory, response times during K6 run|

---

# Phase 11: CI/CD (Parts 45-47)

## Part 45: GitHub Actions — Complete CI Pipeline

**Subtitle:** Build, test, and validate automatically

|Section|Content|
|---|---|
|Pipeline Structure|Lint → Test → Build → Deploy|
|Matrix Builds|All languages in parallel|
|Caching|Dependencies, Docker layers|
|Artifact Storage|Build outputs|

```yaml
name: CI
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: pre-commit/action@v3.0.0
  
  test:
    needs: lint
    strategy:
      matrix:
        service: [bun-api, python-api, go-api]
    # ...
  
  e2e:
    needs: test
    # Run Playwright against preview
  
  load-test:
    needs: e2e
    # Run K6 smoke test
```

---

## Part 46: GitHub Actions + OIDC

**Subtitle:** Keyless AWS authentication

|Section|Content|
|---|---|
|OIDC Federation|No long-lived credentials|
|Trust Policies|Scope to repo/branch|
|Role Assumption|Per-environment roles|
|**Terraform**|OIDC provider + roles|
|**Lead Magnet**|GitHub Actions + AWS OIDC Templates|

```yaml
- name: Configure AWS
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/github-actions
    aws-region: us-east-1
```

---

## Part 47: Production Deployment Pipeline

**Subtitle:** Safe deployments with gates

|Section|Content|
|---|---|
|Environment Promotion|Dev → Staging → Production|
|Approval Gates|Manual approval for prod|
|Rollback Automation|One-click rollback|
|Deployment Markers|SigNoz deployment annotations|
|Notifications|Slack on deploy|

```
PR merged to main
    │
    ▼
CI passes (lint, test, e2e, smoke)
    │
    ▼
Build production images
    │
    ▼
Deploy to staging
    │
    ▼
K6 load test on staging
    │
    ├── Fail → Block, alert
    │
    ▼ Pass
Manual approval
    │
    ▼
Deploy to production (rolling)
    │
    ▼
Synthetic monitoring starts
```

|🚀 DX Enhancement|
|---|
|Merge PR → automatic staging → one approval → production. No manual deploys.|

---

# Phase 12: Serverless (Parts 48-53)

## Part 48: Lambda — Fundamentals

**Subtitle:** Functions and cold starts

|Section|Content|
|---|---|
|Execution Model|Invocation, concurrency, cold starts|
|OTel Lambda Layer|Automatic instrumentation|
|Provisioned Concurrency|Eliminate cold starts (costs more)|
|**Terraform**|Lambda module|
|**Lead Magnet**|Lambda Cold Start Cheatsheet|

|📊 SigNoz Dashboard|
|---|
|NEW: Lambda duration, cold start percentage, errors|

---

## Part 49: Lambda — Bun.js (Custom Runtime)

**Subtitle:** Bun on Lambda

|Section|Content|
|---|---|
|Custom Runtime|Bootstrap script|
|Bundling|Single-file deployment|
|Cold Start Optimization|Bundle size matters|

---

## Part 50: Lambda — Python

**Subtitle:** The serverless default

|Section|Content|
|---|---|
|Python Lambda|Handler patterns|
|Lambda Powertools|Logging, tracing, metrics|
|Mangum|FastAPI on Lambda|

---

## Part 51: Lambda — Go

**Subtitle:** Millisecond cold starts

|Section|Content|
|---|---|
|Go Lambda|provided.al2023 runtime|
|Cold Starts|~100ms typical|
|Binary Size|Strip symbols|
|**Lead Magnet**|Serverless Language Comparison|

---

## Part 52: API Gateway + Lambda

**Subtitle:** Serverless APIs

|Section|Content|
|---|---|
|HTTP API|Lower cost, simpler|
|Lambda Integration|Request/response mapping|
|Custom Domains|Route53 + ACM|
|Rate Limiting|Built-in throttling|
|**Terraform**|API Gateway module|

---

## Part 53: K6 Load Testing — Lambda

**Subtitle:** Testing serverless under load

|Section|Content|
|---|---|
|Cold Start Measurement|Track cold vs warm|
|Concurrency Testing|Find Lambda limits|
|Cost Analysis|Cost per request under load|

```javascript
// tests/load/lambda.js
import { Trend } from 'k6/metrics'

const coldStartDuration = new Trend('cold_start_duration')
const warmStartDuration = new Trend('warm_start_duration')

export default function () {
  const res = http.get(`${__ENV.BASE_URL}/api/handler`)
  
  // Check custom header for cold start
  const isCold = res.headers['X-Cold-Start'] === 'true'
  
  if (isCold) {
    coldStartDuration.add(res.timings.duration)
  } else {
    warmStartDuration.add(res.timings.duration)
  }
}
```

---

# Phase 13: Event-Driven (Parts 54-57)

## Part 54: SQS — Message Queues

**Subtitle:** Decoupling services

|Section|Content|
|---|---|
|SQS Basics|Standard vs FIFO|
|Dead Letter Queues|Handle failures|
|Lambda Triggers|Event source mapping|
|Trace Propagation|Distributed tracing across queues|
|**Terraform**|SQS module|
|**Lead Magnet**|SQS Patterns Cheatsheet|

|📊 SigNoz Dashboard|
|---|
|NEW: Async traces — see messages flow through queues|
|"Traces work across queues too!"|

---

## Part 55: SNS + EventBridge

**Subtitle:** Events and routing

|Section|Content|
|---|---|
|SNS|Fan-out to multiple consumers|
|EventBridge|Event routing, filtering|
|Event Patterns|When to use which|
|**Terraform**|SNS + EventBridge modules|
|**Lead Magnet**|Event Patterns Cheatsheet|

---

## Part 56: WebSockets — Real-Time — NEW

**Subtitle:** When polling isn't enough

|Section|Content|
|---|---|
|WebSocket Basics|When to use vs polling vs SSE|
|ALB WebSockets|Sticky sessions|
|API Gateway WebSockets|Managed, pay per message|
|Scaling|Redis pub/sub for multi-instance|
|**Terraform**|WebSocket infrastructure|

```typescript
// Go WebSocket handler (brief example)
func handleWebSocket(w http.ResponseWriter, r *http.Request) {
    conn, _ := upgrader.Upgrade(w, r, nil)
    defer conn.Close()
    
    for {
        messageType, p, _ := conn.ReadMessage()
        // Broadcast to other connections via Redis pub/sub
        conn.WriteMessage(messageType, p)
    }
}
```

---

## Part 57: Transactional Email — SES

**Subtitle:** Sending email that arrives

|Section|Content|
|---|---|
|SES Setup|Domain verification, sandbox escape|
|Deliverability|SPF, DKIM, DMARC|
|Templates|Handlebars/Jinja templates|
|Sending|From Bun/Python/Go|
|Alternatives|Resend, SendGrid comparison|

---

# Phase 14: Observability Deep Dive (Parts 58-61)

## Part 58: Event-Driven Patterns

**Subtitle:** Idempotency and debugging async

|Section|Content|
|---|---|
|Idempotency|Deduplication keys|
|Correlation IDs|Track across async boundaries|
|Saga Pattern|Distributed transactions|
|Debugging Async|Using SigNoz for async flows|

---

## Part 59: Debugging Production Issues — NEW

**Subtitle:** The actual workflow

|Section|Content|
|---|---|
|Alert → Investigation|Systematic approach|
|Using SigNoz|Traces, logs, metrics correlation|
|Common Scenarios|Slow API, error spike, memory leak|
|Reproduction|Get inputs from traces|

|Debugging Workflow|
|---|
|1. Alert fires → Open SigNoz|
|2. Check service dashboard → Identify affected service|
|3. Filter traces by error → Find failing requests|
|4. Examine span attributes → Find error details|
|5. Correlate with logs → Get stack traces|
|6. Reproduce locally → Fix|
|7. Verify in SigNoz → Errors drop|

```
Scenario: "API is slow"

1. Open SigNoz → Services → your-api
2. Check p99 latency panel — when did it spike?
3. Filter traces: latency > 1s
4. Examine slow traces — which span is slow?
5. Common findings:
   - Database span slow → Check RDS metrics, queries
   - External API slow → Check that service
   - No child spans → CPU-bound code
```

---

## Part 60: OpenTelemetry Mastery

**Subtitle:** Beyond auto-instrumentation

|Section|Content|
|---|---|
|Manual Spans|Add detail where needed|
|Span Attributes|Business context (user_id, order_id)|
|Baggage|Propagate context|
|Sampling|Control data volume|
|Semantic Conventions|Standard attribute names|
|**Lead Magnet**|OTel Instrumentation Guide|

```typescript
// Manual span with business context
const span = tracer.startSpan('process-order')
span.setAttribute('order.id', orderId)
span.setAttribute('order.total', total)
span.setAttribute('customer.tier', customer.tier)

try {
  await processOrder(order)
  span.setStatus({ code: SpanStatusCode.OK })
} catch (error) {
  span.setStatus({ code: SpanStatusCode.ERROR, message: error.message })
  span.recordException(error)
  throw error
} finally {
  span.end()
}
```

|📊 SigNoz Dashboard|
|---|
|By now: ~50 panels, complete visibility|
|"Remember Part 5 when this was empty? Look at it now."|

---

## Part 61: SigNoz Dashboards & Alerts

**Subtitle:** From data to action

|Section|Content|
|---|---|
|Dashboard Design|Golden Signals (latency, traffic, errors, saturation)|
|Custom Dashboards|Per-service, business metrics|
|Alerting|Threshold, anomaly detection|
|SLOs|Service Level Objectives intro|
|Runbook Links|Alert → runbook|
|**Lead Magnet**|SigNoz Dashboard Templates|

---

# Phase 15: Production Readiness (Parts 62-65)

## Part 62: Feature Flags — NEW

**Subtitle:** Ship safely

|Section|Content|
|---|---|
|Why Feature Flags|Decouple deploy from release|
|Simple Approach|Environment variables|
|AWS AppConfig|Native AWS solution|
|Patterns|Percentage rollout, user targeting|

```typescript
// Feature flag check
const features = await appConfig.getConfiguration()

if (features.newCheckoutFlow.enabled) {
  // New code path
  return renderNewCheckout()
} else {
  // Old code path
  return renderOldCheckout()
}
```

|The Fine Line|
|---|
|❌ Under: No flags, deploy = release|
|✅ Right: Flags for risky features, percentage rollouts|
|❌ Over: Every if-statement is a flag|

---

## Part 63: Incident Response — NEW

**Subtitle:** When things go wrong

|Section|Content|
|---|---|
|On-Call Setup|PagerDuty/Opsgenie basics|
|Severity Levels|What wakes someone up|
|Incident Process|Detect → Respond → Resolve → Review|
|Communication|Status page, stakeholder updates|
|Post-Mortems|Blameless analysis template|
|**Lead Magnet**|Incident Response Playbook|

|Incident Severity|
|---|
|**SEV1**: Complete outage, all users affected, immediate response|
|**SEV2**: Major feature broken, many users affected, 15min response|
|**SEV3**: Minor issue, some users affected, business hours|
|**SEV4**: Cosmetic/minor, no user impact, next sprint|

|Post-Mortem Template|
|---|
|**Incident**: [Title]|
|**Duration**: [Start - End]|
|**Impact**: [Users affected, revenue impact]|
|**Timeline**: [What happened when]|
|**Root Cause**: [Why it happened]|
|**Resolution**: [How it was fixed]|
|**Action Items**: [Prevent recurrence]|
|**Lessons Learned**: [What we'll do differently]|

---

## Part 64: Cost Management

**Subtitle:** AWS billing doesn't have to be terrifying

|Section|Content|
|---|---|
|Cost Explorer|Understanding your bill|
|Budgets|Alerts before surprises|
|Savings Plans|Commit for discounts|
|Right-sizing|Recommendations|
|Cost per Request|K6 + billing analysis|
|**Lead Magnet**|Cost Optimization Checklist|

---

## Part 65: Security Posture

**Subtitle:** Security is a habit

|Section|Content|
|---|---|
|Security Hub|Centralized findings|
|GuardDuty|Threat detection|
|WAF|Common web attacks|
|Prowler|Open-source audit|
|Dependency Scanning|npm audit, pip-audit, govulncheck|
|**Lead Magnet**|Security Audit Checklist|

---

## Part 66: Compliance Basics

**Subtitle:** GDPR, data retention, audit logs

|Section|Content|
|---|---|
|GDPR Basics|EU user requirements|
|Data Retention|Policies and implementation|
|Audit Logging|Who accessed what|
|Privacy by Design|Build it in|

---

# Phase 16: Capstone (Parts 67-69)

## Part 67: Capstone — Architecture

**Subtitle:** Designing a real SaaS application

|Application|Multi-tenant SaaS|
|---|---|
|Frontend|React dashboard + Astro marketing (S3/CloudFront)|
|Backend|Bun (auth), Python (billing), Go (realtime) on ECS|
|Database|RDS PostgreSQL Multi-AZ|
|Cache|ElastiCache Redis|
|Workers|Lambda (all 3 languages) via SQS|
|Events|SNS + EventBridge|
|Real-time|WebSocket via Go service|
|Auth|Clerk|
|Email|SES|
|Observability|Complete SigNoz|

**Architecture Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                         CloudFront                              │
│    (React Dashboard + Astro Marketing + API routing)           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌─────────┐       ┌─────────┐        ┌─────────┐
   │   S3    │       │   S3    │        │   ALB   │
   │ (React) │       │ (Astro) │        └────┬────┘
   └─────────┘       └─────────┘             │
                                             │
   ┌─────────────────────────────────────────┴────────────────────┐
   │                          VPC                                 │
   │  ┌───────────────────────────────────────────────────────┐  │
   │  │                    ECS Fargate                        │  │
   │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │  │
   │  │  │ Bun.js   │  │ Python   │  │   Go     │            │  │
   │  │  │ (Auth)   │  │(Billing) │  │(Realtime)│            │  │
   │  │  │+ OTel    │  │+ OTel    │  │+ OTel    │            │  │
   │  │  └────┬─────┘  └────┬─────┘  └────┬─────┘            │  │
   │  └───────┼─────────────┼─────────────┼──────────────────┘  │
   │          │             │             │                     │
   │          └─────────────┼─────────────┘                     │
   │                        │                                   │
   │         ┌──────────────┴──────────────┐                   │
   │         │                             │                   │
   │    ┌────┴────┐                 ┌──────┴─────┐             │
   │    │   RDS   │                 │ ElastiCache│             │
   │    │Postgres │                 │   Redis    │             │
   │    │Multi-AZ │                 └────────────┘             │
   │    └─────────┘                                            │
   └───────────────────────────────────────────────────────────┘
   
   ┌───────────────────────────────────────────────────────────┐
   │                  Event-Driven Layer                       │
   │  ┌─────┐      ┌─────────────┐      ┌─────┐               │
   │  │ SQS │      │ EventBridge │      │ SNS │               │
   │  └──┬──┘      └──────┬──────┘      └──┬──┘               │
   │     │                │                │                   │
   │     └────────────────┼────────────────┘                   │
   │                      │                                    │
   │  ┌───────────────────┴───────────────────┐               │
   │  │           Lambda Workers              │               │
   │  │  ┌──────┐  ┌──────┐  ┌──────┐        │               │
   │  │  │ Bun  │  │Python│  │  Go  │        │               │
   │  │  │Email │  │Report│  │Webhook│       │               │
   │  │  └──────┘  └──────┘  └──────┘        │               │
   │  └───────────────────────────────────────┘               │
   └───────────────────────────────────────────────────────────┘
                           │
                           ▼
   ┌───────────────────────────────────────────────────────────┐
   │                    SigNoz                                 │
   │  ┌─────────────────────────────────────────────────────┐ │
   │  │              Complete Dashboard                     │ │
   │  │  • Request Rate  • Error Rate  • p99 Latency       │ │
   │  │  • Cold Starts   • Queue Depth • Active WS         │ │
   │  │  • DB Connections • Cache Hit Rate                 │ │
   │  │                                                     │ │
   │  │  Distributed Traces: CloudFront → ALB → ECS →     │ │
   │  │    RDS/Redis → SQS → Lambda                        │ │
   │  └─────────────────────────────────────────────────────┘ │
   │                                                           │
   │  Alerts: Error rate > 1%, p99 > 500ms, Queue depth > 100 │
   └───────────────────────────────────────────────────────────┘
```

---

## Part 68: Capstone — Deployment

**Subtitle:** Terraform from zero to production

|Section|Content|
|---|---|
|Terraform Structure|~50 files, modularized|
|Environment Setup|Dev, staging, production|
|Deployment Pipeline|Complete GitHub Actions|
|Feature Flags|New features behind flags|

---

## Part 69: Capstone — Operations

**Subtitle:** Running in production

|Section|Content|
|---|---|
|Monitoring|Complete SigNoz dashboards|
|Alerting|PagerDuty integration|
|Runbooks|Common issue resolution|
|K6 Synthetic|Continuous production testing|
|Incident Process|Ready for when things break|
|**Lead Magnet**|Production Readiness Checklist|

```javascript
// K6 synthetic monitoring (runs every 5 min)
// tests/load/synthetic.js
export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    checks: ['rate>0.99'],
  },
}

export default function () {
  // Critical user journeys
  check(http.get(`${BASE_URL}/`), { 'homepage OK': r => r.status === 200 })
  check(http.get(`${BASE_URL}/api/health`), { 'API OK': r => r.status === 200 })
  check(http.post(`${BASE_URL}/api/auth/verify`), { 'Auth OK': r => r.status === 200 })
}
```

---

# Summary Tables

## Complete Parts List (69 Parts)

|Phase|Parts|Count|Topics|
|---|---|:-:|---|
|Foundation|1-5|5|AWS, IAM, CLI, Terraform, SigNoz|
|Developer Workflow|6-9|4|Git, PR, Pre-commit, Monorepo|
|Local Development|10-12|3|Docker Compose, Migrations, Env vars|
|Frontend Deployment|13-19|7|S3, DNS, CDN, Uploads, Frameworks, Preview|
|Networking|20-22|3|VPC, Security Groups, ALB|
|API Design & Testing|23-27|5|REST, Validation, Mocking, E2E, CI|
|Backend on EC2|28-33|6|EC2, Bun, Auth, Python, Go, ASG|
|Load Testing|34|1|K6 Fundamentals|
|Database|35-38|4|RDS, Operations, Secrets, Redis|
|Containers (ECS)|39-44|6|Docker, ECR, ECS, Preview, K6|
|CI/CD|45-47|3|GitHub Actions, OIDC, Deployment|
|Serverless|48-53|6|Lambda (all languages), API GW, K6|
|Event-Driven|54-57|4|SQS, SNS/EB, WebSockets, Email|
|Observability Deep Dive|58-61|4|Patterns, Debugging, OTel, Dashboards|
|Production Readiness|62-66|5|Feature Flags, Incidents, Cost, Security, Compliance|
|Capstone|67-69|3|Architecture, Deployment, Operations|
|**Total**||**69**||

---

## Publishing Schedule

|Weeks|Parts|Milestone|
|:-:|:-:|---|
|1-3|1-6|Foundation complete|
|4-5|7-10|Dev workflow + local dev|
|6-7|11-14|Frontend basics|
|8-10|15-20|Frontend + Preview + Networking starts|
|11-13|21-27|Networking + API + Testing|
|14-17|28-35|Backend + Auth + Load testing + DB|
|18-22|36-44|Containers complete|
|23-25|45-53|CI/CD + Serverless|
|26-29|54-61|Events + Observability|
|30-33|62-66|Production readiness|
|34-35|67-69|Capstone|

**Total: ~35 weeks (~9 months)**

---

## Lead Magnets (30 Total)

| Part | Lead Magnet                          |
| :--: | ------------------------------------ |
|  1   | AWS Account Security Checklist       |
|  2   | IAM Policy Templates                 |
|  4   | Terraform Starter Template           |
|  5   | SigNoz Deployment Templates          |
|  6   | .gitignore Templates Collection      |
|  7   | PR Template Collection               |
|  8   | Pre-commit Config Templates          |
|  10  | Docker Compose Development Templates |
|  14  | DNS Records Cheatsheet               |
|  16  | S3 Upload Patterns Guide             |
|  17  | Frontend Deployment Checklist        |
|  18  | Frontend Framework Comparison        |
|  20  | VPC Reference Architecture           |
|  21  | Security Group Patterns              |
|  23  | API Design Cheatsheet                |
|  26  | Playwright Test Templates            |
|  28  | EC2 Instance Type Cheatsheet         |
|  30  | Auth Integration Checklist           |
|  32  | Backend Language Comparison          |
|  34  | K6 Test Templates                    |
|  35  | RDS Sizing Guide                     |
|  39  | Dockerfile Templates                 |
|  41  | ECS Task Definition Templates        |
|  43  | Preview Environment Templates        |
|  46  | GitHub Actions + OIDC Templates      |
|  48  | Lambda Cold Start Cheatsheet         |
|  51  | Serverless Language Comparison       |
|  54  | SQS Patterns Cheatsheet              |
|  55  | Event Patterns Cheatsheet            |
|  60  | OTel Instrumentation Guide           |
|  61  | SigNoz Dashboard Templates           |
|  63  | Incident Response Playbook           |
|  64  | Cost Optimization Checklist          |
|  65  | Security Audit Checklist             |
|  69  | Production Readiness Checklist       |

---

## Testing Coverage Evolution

|Part|What's Added|Testing Stack|
|:-:|---|---|
|8|Pre-commit hooks|Lint/format on commit|
|17|Frontend unit tests|+ Vitest|
|25|Mocking|+ MSW, responses, gomock|
|26|E2E tests|+ Playwright|
|27|CI integration|All tests in pipeline|
|29-32|Backend unit tests|+ Bun test, pytest, Go testing|
|34|Load tests|+ K6 smoke/load/stress|
|44|Container load tests|+ K6 for ECS|
|53|Lambda load tests|+ K6 for cold starts|
|69|Synthetic monitoring|+ K6 production tests|

---

## SigNoz Dashboard Evolution

|Part|New Panels|Total Panels|
|:-:|---|:-:|
|5|(empty)|0|
|17|Web Vitals|4|
|22|ALB metrics|8|
|28|Host metrics|12|
|29|API traces, latency|16|
|34|K6 correlation|20|
|35|RDS metrics|24|
|39|Container logs|28|
|41|ECS service metrics|34|
|48|Lambda metrics|40|
|54|Queue metrics, async traces|48|
|61|Alerts, SLOs|55+|

---

## Developer Experience Milestones

|Part|Milestone|What It Enables|
|:-:|---|---|
|8|Pre-commit|Clean code always|
|10|`make dev`|Full stack in 60s|
|12|1Password|Secrets without `.env` files|
|19|Frontend preview|Preview URL per PR|
|27|All tests in CI|Quality gates|
|34|K6 in pipeline|Performance gates|
|43|Full-stack preview|Complete app per PR|
|47|Production pipeline|Merge → auto-deploy|
|62|Feature flags|Safe releases|
|69|Synthetic monitoring|24/7 confidence|

---

## Success Metrics

|Metric|Target|
|---|---|
|Email subscribers|5,000+|
|GitHub stars|2,000+|
|Discovery calls|100+|
|LinkedIn followers|15,000+|
|Course waitlist|1,500+|

---

## What This Enables (Business Outcomes)

|Reader Journey|Your Opportunity|
|---|---|
|Completes Foundation|Understands AWS, may need implementation help|
|Completes Dev Workflow|Appreciates quality, wants it for team|
|Completes Preview Deploy|"This is exactly what I need" → consulting lead|
|Completes Full Series|Implements themselves OR hires for speed|

**The Funnel:**

1. Blog posts → Email (lead magnets)
2. Email nurture → Discovery calls
3. Calls → Consulting or course
4. GitHub templates → Stars → Social proof → More leads

---

## Future Series (Teased Throughout)

1. **Kubernetes Mastery**: EKS, Helm, ArgoCD, service mesh
2. **Data Engineering 101**: Glue, Athena, Kinesis, dbt, Airflow
3. **Platform Engineering**: Internal developer platforms, golden paths
4. **Multi-Region AWS**: Global deployments, disaster recovery
5. **Advanced Security**: SOC2, penetration testing, red team exercises