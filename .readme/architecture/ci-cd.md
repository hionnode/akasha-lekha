# CI/CD Workflows

This document describes the GitHub Actions workflows for continuous integration and deployment.

## Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GitHub Actions                                     │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        Pull Request                                  │    │
│  │                                                                      │    │
│  │   ci.yml          web-preview.yml        api-deploy.yml             │    │
│  │   ────────        ────────────────       ───────────────            │    │
│  │   All changes:    Web changes:           API/Infra changes:         │    │
│  │   - Lint          - Build                - Deploy to preview        │    │
│  │   - Typecheck     - Deploy preview       - Comment on PR            │    │
│  │   - Test          - Comment on PR                                   │    │
│  │   - Build                                                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        Push to main                                  │    │
│  │                                                                      │    │
│  │   ci.yml          web-production.yml     api-deploy.yml             │    │
│  │   ────────        ─────────────────      ───────────────            │    │
│  │   Quality checks  Web changes:           API/Infra changes:         │    │
│  │                   - Deploy production    - Deploy to prod           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Workflows

### 1. CI (`ci.yml`)

**Purpose:** Quality checks for all packages with path filtering.

**Triggers:**
- All pull requests to `main`
- All pushes to `main`

**Jobs:**

| Job | Condition | Checks |
|-----|-----------|--------|
| `changes` | Always | Detect which packages changed |
| `web` | `apps/web/**` changed | Lint, typecheck, test, build |
| `api` | `packages/api/**` changed | Typecheck, test |
| `types` | `packages/types/**` changed | Typecheck |
| `ci-success` | Always | Aggregate results for branch protection |

**Path Filters:**

```yaml
web:
  - 'apps/web/**'
  - 'packages/types/**'
  - 'pnpm-lock.yaml'
api:
  - 'packages/api/**'
  - 'packages/types/**'
  - 'pnpm-lock.yaml'
types:
  - 'packages/types/**'
infra:
  - 'infra/**'
  - 'sst.config.ts'
```

---

### 2. Web Preview (`web-preview.yml`)

**Purpose:** Deploy preview of web app for every PR.

**Triggers:**
- Pull requests to `main` with web changes

**Path Filter:**
```yaml
paths:
  - 'apps/web/**'
  - 'packages/types/**'
  - 'pnpm-lock.yaml'
```

**Features:**
- Builds from `apps/web/`
- Deploys to Cloudflare Pages
- Posts preview URL as PR comment
- Tracks deployment history (last 5)
- Updates commit status

**PR Comment Example:**

```markdown
## 🌐 Web Preview Deployment

### 🔗 [**Visit Preview →**](https://preview-123.workers.dev)

| Branch | Commit | Build | Cache | Status |
|:-------|:-------|:------|:------|:-------|
| `feat/new-feature` | `abc1234` | 45s | ✅ | ✅ Ready |
```

---

### 3. Web Production (`web-production.yml`)

**Purpose:** Deploy web app to production on merge.

**Triggers:**
- Push to `main` with web changes
- Manual dispatch (with skip cache option)

**Path Filter:**
```yaml
paths:
  - 'apps/web/**'
  - 'packages/types/**'
  - 'pnpm-lock.yaml'
```

**Features:**
- Deploys to Cloudflare Pages production
- Captures previous version for rollback
- Creates job summary with rollback command
- Never cancels in-progress deploys

---

### 4. API Deploy (`api-deploy.yml`)

**Purpose:** Deploy SST API to AWS.

**Triggers:**
- Pull requests: Deploy to `preview` stage
- Push to `main`: Deploy to `prod` stage
- Manual dispatch: Choose stage

**Path Filter:**
```yaml
paths:
  - 'packages/api/**'
  - 'packages/types/**'
  - 'infra/**'
  - 'sst.config.ts'
  - 'pnpm-lock.yaml'
```

**Features:**
- Automatic stage selection (PR → preview, main → prod)
- AWS credentials via secrets
- Posts API URL as PR comment
- Cleanup job removes preview stage when PR closes

**PR Comment Example:**

```markdown
## ⚡ API Deployment

### ✅ Deployed to `preview`

**API URL:** https://abc123.execute-api.ap-south-1.amazonaws.com

**Test endpoint:**
```bash
curl https://abc123.execute-api.ap-south-1.amazonaws.com/exercises
```
```

---

## Required Secrets

### GitHub Repository Secrets

Configure in **Settings → Secrets and variables → Actions**:

| Secret | Used By | Description |
|--------|---------|-------------|
| `CLOUDFLARE_API_TOKEN` | Web workflows | Cloudflare API token |
| `CLOUDFLARE_ACCOUNT_ID` | Web workflows | Cloudflare account ID |
| `AWS_ACCESS_KEY_ID` | API workflow | AWS IAM access key |
| `AWS_SECRET_ACCESS_KEY` | API workflow | AWS IAM secret key |

### SST Secrets (per stage)

Set via CLI (not GitHub):

```bash
# Preview stage
pnpm sst secret set GithubClientId <value> --stage preview
pnpm sst secret set GithubClientSecret <value> --stage preview
pnpm sst secret set JwtSecret <value> --stage preview

# Production stage
pnpm sst secret set GithubClientId <value> --stage prod
pnpm sst secret set GithubClientSecret <value> --stage prod
pnpm sst secret set JwtSecret <value> --stage prod
```

---

## Path-Based Triggering

Workflows only run when relevant files change:

| Change | ci.yml | web-preview | web-production | api-deploy |
|--------|--------|-------------|----------------|------------|
| `apps/web/**` | ✅ web job | ✅ | ✅ | ❌ |
| `packages/api/**` | ✅ api job | ❌ | ❌ | ✅ |
| `packages/types/**` | ✅ types job | ✅ | ✅ | ✅ |
| `infra/**` | ✅ (detect) | ❌ | ❌ | ✅ |
| `sst.config.ts` | ✅ (detect) | ❌ | ❌ | ✅ |
| `pnpm-lock.yaml` | ✅ all jobs | ✅ | ✅ | ✅ |
| `README.md` | ❌ | ❌ | ❌ | ❌ |

---

## Concurrency

### CI Workflow
```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```
Cancels previous runs on same branch.

### Web Preview
```yaml
concurrency:
  group: web-preview-${{ github.event.pull_request.number }}
  cancel-in-progress: true
```
One deployment per PR, cancels outdated.

### Web Production
```yaml
concurrency:
  group: web-production
  cancel-in-progress: false
```
Never cancels, queues deploys.

### API Deploy
```yaml
concurrency:
  group: api-${{ github.event_name == 'pull_request' && format('pr-{0}', github.event.pull_request.number) || 'prod' }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}
```
Cancels PR deploys, never cancels production.

---

## Caching

### Web (Astro)
```yaml
path: |
  apps/web/node_modules/.astro
  apps/web/.astro
key: astro-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml', 'apps/web/astro.config.*') }}
```

### pnpm
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'pnpm'
```

---

## Branch Protection

Recommended settings for `main` branch:

1. **Require status checks:**
   - `CI Success` (from ci.yml)
   - `Web Preview` (when web changes)
   - `API Deploy` (when API changes)

2. **Require PR reviews**

3. **Require linear history** (optional)

---

## Manual Triggers

### Web Production (skip cache)

1. Go to **Actions** → **Web Production**
2. Click **Run workflow**
3. Check **Skip build cache**
4. Click **Run workflow**

### API Deploy (choose stage)

1. Go to **Actions** → **API Deploy**
2. Click **Run workflow**
3. Select stage: `preview` or `prod`
4. Click **Run workflow**

---

## Debugging

### View Logs
1. Go to **Actions** tab
2. Click workflow run
3. Expand job steps

### Common Issues

**"No changes detected":**
- Workflow didn't trigger because paths didn't match
- Check path filters in workflow file

**Web build fails:**
- Check `apps/web/` has valid astro.config.mjs
- Verify TypeScript errors in web package

**API deploy fails:**
- Verify AWS credentials are set
- Check SST secrets are configured
- Run `pnpm sst deploy --stage <stage>` locally to debug

**Cache not working:**
- Check cache key matches
- Verify paths exist after build

---

## Adding New Workflows

### New Package Workflow

1. Add path filter to `ci.yml`:
```yaml
newpackage:
  - 'packages/newpackage/**'
```

2. Add job:
```yaml
newpackage:
  name: NewPackage Quality
  needs: changes
  if: needs.changes.outputs.newpackage == 'true'
  # ... steps
```

3. Update `ci-success` job to include new job.

### New Deployment Target

Create new workflow file following existing patterns:
- Define triggers with path filters
- Set up concurrency
- Configure environment
- Add deployment steps
- Post comments/summaries

---

## File Reference

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | Quality checks (lint, test, typecheck) |
| `.github/workflows/web-preview.yml` | Web preview deployments |
| `.github/workflows/web-production.yml` | Web production deployments |
| `.github/workflows/api-deploy.yml` | API (SST) deployments |

---

## Related Documentation

- [Architecture Overview](./overview.md)
- [Blog Setup](./blog.md)
- [Backend (SST)](./backend-sst.md)
- [SST Development Guide](../sst-api-development.md)
