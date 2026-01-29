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
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      PR Closed                                       │    │
│  │                                                                      │    │
│  │   api-deploy.yml (cleanup job)                                      │    │
│  │   - Remove preview stage resources                                  │    │
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
| `web` | `apps/web/**` changed | Lint, typecheck, test:run, build |
| `api` | `packages/api/**` changed | Typecheck, test:run |
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
- Updates existing comment on new commits

---

### 3. Web Production (`web-production.yml`)

**Purpose:** Deploy web app to production on merge.

**Triggers:**
- Push to `main` with web changes
- Manual dispatch

**Path Filter:**
```yaml
paths:
  - 'apps/web/**'
  - 'packages/types/**'
  - 'pnpm-lock.yaml'
```

**Features:**
- Deploys to Cloudflare Pages production
- Never cancels in-progress deploys
- Creates job summary

---

### 4. API Deploy (`api-deploy.yml`)

**Purpose:** Deploy SST API to AWS using OIDC authentication.

**Triggers:**
- Pull requests (opened, synchronize, reopened, closed): Deploy to `preview` stage
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

**Jobs:**

| Job | Trigger | Action |
|-----|---------|--------|
| `deploy` | PR opened/updated, push to main | Deploy to appropriate stage |
| `cleanup` | PR closed | Remove preview stage resources |

**Features:**
- **OIDC Authentication**: No static AWS credentials in GitHub secrets
- Automatic stage selection (PR → preview, main → prod)
- Posts API URL as PR comment
- Cleanup job removes preview resources when PR closes

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

## AWS OIDC Authentication

The API workflow uses **OIDC (OpenID Connect)** for keyless AWS authentication, eliminating the need for static credentials:

| Traditional (Access Keys) | OIDC |
|---------------------------|------|
| Long-lived credentials | Short-lived tokens (15 min - 1 hour) |
| Stored in GitHub secrets | No secrets to manage |
| Must be rotated manually | Automatic token refresh |
| Risk of credential leakage | No credentials to leak |

**How it works:**

```yaml
permissions:
  id-token: write  # Required for OIDC

steps:
  - name: Configure AWS Credentials (OIDC)
    uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
      role-session-name: github-actions-${{ github.run_id }}
      aws-region: ap-south-1
```

**Setup required:** See [AWS OIDC Setup Guide](../aws-oidc-setup.md) for IAM role configuration.

---

## Required Secrets

Configure in **Settings → Secrets and variables → Actions**:

| Secret | Used By | Description |
|--------|---------|-------------|
| `CLOUDFLARE_API_TOKEN` | Web workflows | Cloudflare API token with Pages edit permission |
| `CLOUDFLARE_ACCOUNT_ID` | Web workflows | Cloudflare account ID |
| `AWS_ROLE_ARN` | API workflow | IAM role ARN for OIDC (e.g., `arn:aws:iam::123456789:role/github-actions-akasha-labs`) |

**SST Secrets (per stage)** - Set via CLI, not GitHub:

```bash
# Preview stage
pnpm sst secret set GithubClientId <value> --stage preview
pnpm sst secret set GithubClientSecret <value> --stage preview
pnpm sst secret set JwtSecret $(openssl rand -base64 32) --stage preview

# Production stage
pnpm sst secret set GithubClientId <value> --stage prod
pnpm sst secret set GithubClientSecret <value> --stage prod
pnpm sst secret set JwtSecret $(openssl rand -base64 32) --stage prod
```

---

## Deployment Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Developer Workflow                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Create Pull Request                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
          ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
          │    ci.yml       │ │ web-preview.yml │ │ api-deploy.yml  │
          │                 │ │                 │ │                 │
          │ • Lint          │ │ • Build Astro   │ │ • SST deploy    │
          │ • Typecheck     │ │ • Deploy to CF  │ │   --stage       │
          │ • Test          │ │ • Comment URL   │ │   preview       │
          │ • Build         │ │                 │ │ • Comment URL   │
          └────────┬────────┘ └────────┬────────┘ └────────┬────────┘
                   │                   │                   │
                   └─────────────────┬─┴───────────────────┘
                                     │
                                     ▼
                    ┌─────────────────────────────────────┐
                    │       All Checks Pass?              │
                    │       Review & Approve PR           │
                    └─────────────────┬───────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Merge to main                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    ▼                                   ▼
          ┌─────────────────────────┐       ┌─────────────────────────┐
          │  web-production.yml     │       │    api-deploy.yml       │
          │                         │       │                         │
          │  • Build Astro          │       │  • SST deploy           │
          │  • Deploy to Cloudflare │       │    --stage prod         │
          │    Pages (production)   │       │  • AWS OIDC auth        │
          └─────────────────────────┘       └─────────────────────────┘
                    │                                   │
                    ▼                                   ▼
          ┌─────────────────────────┐       ┌─────────────────────────┐
          │   works-on-my.cloud     │       │  API Gateway (prod)     │
          │   (Cloudflare Pages)    │       │  Lambda + DynamoDB      │
          └─────────────────────────┘       └─────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         PR Closed (Cleanup)                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  api-deploy.yml (cleanup job)                                        │    │
│  │  • pnpm sst remove --stage preview                                   │    │
│  │  • Removes all AWS resources for preview stage                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

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
Cancels previous runs on same branch to save resources.

### Web Preview
```yaml
concurrency:
  group: web-preview-${{ github.event.pull_request.number }}
  cancel-in-progress: true
```
One deployment per PR, cancels outdated builds.

### Web Production
```yaml
concurrency:
  group: web-production
  cancel-in-progress: false
```
Never cancels, queues deployments to prevent interruptions.

### API Deploy
```yaml
concurrency:
  group: api-${{ github.event_name == 'pull_request' && format('pr-{0}', github.event.pull_request.number) || 'prod' }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}
```
Cancels PR preview deploys, never cancels production.

---

## Environments

GitHub Environments configured in the workflows:

| Environment | Used By | Purpose |
|-------------|---------|---------|
| `api-preview` | api-deploy.yml (PR) | Preview API deployments |
| `api-production` | api-deploy.yml (main) | Production API deployments |

---

## Branch Protection

Recommended settings for `main` branch:

1. **Require status checks:**
   - `CI Success` (from ci.yml)

2. **Require PR reviews**

3. **Do not allow bypassing the above settings**

---

## Manual Triggers

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

**"No changes detected" - workflow didn't run:**
- Check if changed paths match workflow path filters
- Verify branch is correct (PRs to `main`)

**CI job skipped:**
- Normal behavior when path filter doesn't match
- Check `changes` job output to see detected changes

**API deploy fails with OIDC error:**
- Verify `AWS_ROLE_ARN` secret is set correctly
- Check IAM role trust policy allows the repository
- Ensure `id-token: write` permission is set
- See [AWS OIDC Setup Guide](../aws-oidc-setup.md)

**Web deploy fails:**
- Verify `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets
- Check Cloudflare Pages project exists

**SST deploy fails with missing secrets:**
- Run `pnpm sst secret list --stage <stage>` to verify secrets
- Set missing secrets with `pnpm sst secret set`

---

## Adding New Workflows

### New Package Quality Checks

1. Add path filter to `ci.yml` changes job:
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
  runs-on: ubuntu-latest
  defaults:
    run:
      working-directory: packages/newpackage
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
      with:
        version: 10
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'
    - run: pnpm install
      working-directory: .
    - run: pnpm typecheck
    - run: pnpm test:run
```

3. Update `ci-success` job needs to include new job.

---

## File Reference

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | Quality checks (lint, test, typecheck, build) |
| `.github/workflows/web-preview.yml` | Web preview deployments to Cloudflare Pages |
| `.github/workflows/web-production.yml` | Web production deployments to Cloudflare Pages |
| `.github/workflows/api-deploy.yml` | API (SST) deployments to AWS |

---

## Related Documentation

- [Architecture Overview](./overview.md)
- [Blog Setup](./blog.md)
- [Backend (SST)](./backend-sst.md)
- [AWS OIDC Setup](../aws-oidc-setup.md)
- [SST Development Guide](../sst-api-development.md)
