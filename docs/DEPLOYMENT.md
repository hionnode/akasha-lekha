# Deployment Guide

## Cloudflare Pages Deployment

### Issue: Wrangler Deploy Error

If you're seeing this error:
```
✘ [ERROR] Missing entry-point to Worker script or to assets directory
```

This happens because Cloudflare Pages is trying to run `npx wrangler deploy`, which is for Cloudflare Workers, not static sites.

### Solution

**For Static Sites (this project):**

1. Go to your Cloudflare Pages dashboard
2. Navigate to your project → **Settings** → **Builds & deployments**
3. **Remove any "Deploy command"** - leave it completely empty
4. Ensure these settings are correct:
   - **Build command:** `pnpm build`
   - **Build output directory:** `dist`
   - **Root directory:** (empty)
   - **Node version:** 18.x, 20.x, or 22.x
   - **Package manager:** pnpm

Cloudflare Pages will automatically deploy the `dist` folder after the build completes. No deploy command is needed for static sites.

### Alternative: Manual Wrangler Deployment

If you need to deploy manually using Wrangler (not recommended for CI/CD):

```bash
# Install wrangler
pnpm add -D wrangler

# Deploy static assets
npx wrangler pages deploy dist --project-name=akasha-lekha
```

However, for continuous deployment, use Cloudflare Pages with Git integration and **no deploy command** (recommended).

### Build Verification

The build should complete successfully with output like:
```
✓ [build] 12 page(s) built in 3.55s
✓ [build] Complete!
```

After this, Cloudflare Pages will automatically deploy the `dist` folder.

