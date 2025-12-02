# Cloudflare Pages Deployment

This directory contains Cloudflare Pages configuration if needed.

## Deployment Configuration

For Cloudflare Pages, configure the following in your Cloudflare Pages dashboard:

### Build Settings

- **Framework preset:** Astro
- **Build command:** `pnpm build`
- **Build output directory:** `dist`
- **Root directory:** (leave empty, or `/` if in monorepo)
- **Environment variables:** None required

### Important Notes

1. **Do NOT set a deploy command** - Cloudflare Pages will automatically deploy the `dist` folder after the build completes.

2. **If you see wrangler deploy errors**, it means a deploy command is configured. Remove it from your Cloudflare Pages settings.

3. **Build output:** The `dist/` directory contains all static HTML, CSS, and JavaScript files.

4. **Node version:** Cloudflare Pages supports Node 18.x, 20.x, and 22.x. The project works with all of these.

## Manual Deployment (Alternative)

If you need to deploy manually using Wrangler:

```bash
# Install wrangler
pnpm add -D wrangler

# Deploy static assets
npx wrangler pages deploy dist --project-name=akasha-lekha
```

However, for continuous deployment, use Cloudflare Pages with Git integration (recommended).

