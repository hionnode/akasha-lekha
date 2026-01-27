# CI/CD Workflows

This document describes the GitHub Actions workflows for continuous integration and deployment.

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions                            │
│                                                              │
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │   Pull Request      │    │     Push to main            │ │
│  │                     │    │                             │ │
│  │  pr-preview.yml     │    │  production-deploy.yml      │ │
│  │  ───────────────    │    │  ────────────────────       │ │
│  │  1. Build           │    │  1. Build                   │ │
│  │  2. Deploy Preview  │    │  2. Deploy Production       │ │
│  │  3. Comment on PR   │    │  3. Create Summary          │ │
│  └─────────────────────┘    └─────────────────────────────┘ │
│           │                            │                     │
│           ▼                            ▼                     │
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │ Cloudflare Pages    │    │   Cloudflare Pages          │ │
│  │ (Preview URL)       │    │   (Production)              │ │
│  └─────────────────────┘    └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Workflows

### Preview Deployment (`pr-preview.yml`)

**Trigger:** Pull requests to `main`

**Purpose:** Deploy preview versions for every PR, providing a Vercel-like experience.

```yaml
on:
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]
```

**Steps:**

1. **Checkout** - Get the PR code
2. **Set Pending Status** - Show "Building..." status on commit
3. **Setup pnpm + Node.js** - Install toolchain
4. **Cache Astro Build** - Speed up subsequent builds
5. **Install Dependencies** - `pnpm install`
6. **Build** - `pnpm build` with timing
7. **Deploy Preview** - Upload to Cloudflare Workers
8. **Update Commit Status** - Show success/failure
9. **Comment on PR** - Post deployment URL

**PR Comment Features:**

- Preview URL with one-click access
- Build duration and cache status
- Deployment history (last 5 deployments)
- Commit links and status badges

**Example PR Comment:**

```markdown
## 🌐 Preview Deployment

### 🔗 [**Visit Preview →**](https://preview-123.workers.dev)

| Branch | Commit | Build | Cache | Status |
|:-------|:-------|:------|:------|:-------|
| `feat/new-feature` | `abc1234` | 45s | ✅ | ✅ Ready |

<details>
<summary>📜 Deployment History (3 deployments)</summary>
...
</details>
```

### Production Deployment (`production-deploy.yml`)

**Trigger:** Push to `main` (including merges)

**Purpose:** Deploy to production with rollback support.

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      skip_cache:
        description: 'Skip build cache'
        type: boolean
```

**Steps:**

1. **Checkout** - Get full history (for versioning)
2. **Setup pnpm + Node.js** - Install toolchain
3. **Cache Astro Build** - Unless skip_cache is true
4. **Install Dependencies** - `pnpm install`
5. **Build** - `pnpm build` with timing
6. **Get Previous Version** - For rollback reference
7. **Deploy to Production** - `wrangler deploy`
8. **Create Summary** - Job summary with details
9. **Update Commit Status** - Mark deployment status

**Job Summary:**

```markdown
## 🚀 Production Deployment Complete

| Property | Value |
|:---------|:------|
| **URL** | https://works-on-my.cloud |
| **Commit** | `abc1234567890` |
| **Build Time** | 52s |
| **Cache** | ✅ Hit |
| **Previous Version** | `v1.2.3` |

### Rollback Command
npx wrangler versions deploy v1.2.3
```

## Required Secrets

Configure these in **Repository Settings → Secrets and variables → Actions**:

| Secret | Description | How to Get |
|--------|-------------|------------|
| `CLOUDFLARE_API_TOKEN` | API token for deployments | [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account | Cloudflare Dashboard → Account ID |

### Creating Cloudflare API Token

1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Edit Cloudflare Workers" template
4. Or create custom with permissions:
   - Account: Cloudflare Pages - Edit
   - Zone: Zone - Read (if using custom domain)
5. Copy the token and add to GitHub secrets

## Concurrency

### Preview Deployments

```yaml
concurrency:
  group: preview-${{ github.event.pull_request.number }}
  cancel-in-progress: true
```

- Groups by PR number
- Cancels previous runs for same PR
- Prevents duplicate deployments

### Production Deployments

```yaml
concurrency:
  group: production
  cancel-in-progress: false
```

- Single group for all production deploys
- Never cancels in-progress deploys
- Queues subsequent deploys

## Caching

### Astro Build Cache

```yaml
- name: Cache Astro Build
  uses: actions/cache@v4
  with:
    path: |
      node_modules/.astro
      .astro
    key: astro-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml', 'astro.config.*') }}
```

Cache is invalidated when:
- `pnpm-lock.yaml` changes (new dependencies)
- `astro.config.*` changes (config updates)

### pnpm Cache

```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'pnpm'
```

Automatically caches `node_modules` based on lockfile.

## Environment Protection

### Preview Environment

```yaml
environment:
  name: preview
  url: ${{ steps.deploy.outputs.deployment-url }}
```

No protection rules by default. Every PR gets a preview.

### Production Environment

```yaml
environment:
  name: production
  url: ${{ steps.deploy.outputs.deployment-url }}
```

Optional protection rules (configure in GitHub):
- Required reviewers
- Wait timer
- Deployment branches

## Commit Status Checks

Both workflows update commit status:

| Context | States | Description |
|---------|--------|-------------|
| Preview Deployment | pending, success, failure | PR preview status |
| Production Deployment | success, failure | Production deploy status |

These appear in:
- PR checks section
- Commit status indicators
- Branch protection rules

## Manual Triggers

### Production with Skip Cache

```yaml
workflow_dispatch:
  inputs:
    skip_cache:
      description: 'Skip build cache'
      type: boolean
      default: false
```

Trigger manually via:
1. Actions tab → Production workflow
2. "Run workflow" button
3. Optionally check "Skip build cache"

Useful for:
- Forcing fresh build after cache issues
- Testing deployment without cache

## Debugging Workflows

### View Logs

1. Go to **Actions** tab
2. Click on workflow run
3. Expand job steps

### Common Issues

**Build fails:**
- Check Node version compatibility
- Verify pnpm-lock.yaml is committed
- Check for TypeScript errors

**Deploy fails:**
- Verify Cloudflare secrets are set
- Check API token permissions
- Ensure wrangler.jsonc is valid

**Cache not working:**
- Check cache key matches
- Verify paths exist
- Look for "Cache hit" in logs

## Extending Workflows

### Add Quality Checks

```yaml
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test

  deploy:
    needs: quality
    # ... deployment steps
```

### Add Slack Notifications

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    fields: repo,message,commit,author
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Add Smoke Tests

```yaml
smoke-test:
  needs: deploy
  runs-on: ubuntu-latest
  steps:
    - name: Health Check
      run: |
        curl -sf ${{ needs.deploy.outputs.url }}/health || exit 1
```

## Future Enhancements

- [ ] API deployment workflow (SST)
- [ ] E2E tests before production deploy
- [ ] Automatic rollback on health check failure
- [ ] Deployment notifications (Slack/Discord)
- [ ] Performance budget checks

## Related Documentation

- [Architecture Overview](./overview.md)
- [Blog Setup](./blog.md)
- [Backend (SST)](./backend-sst.md)
