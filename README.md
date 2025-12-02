# Akasha Lekha

> Developer-focused technical blog and code library built with Astro

**Domain:** works-on-my.cloud

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

See [architecture.md](./architecture.md) for detailed documentation.

## Tech Stack

- **Astro 5.x** - Static site generation
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling with Tokyo Night theme
- **Inconsolata** - Monospace font (entire site)

## Content Collections

Content is managed through Astro Content Collections:

- `src/content/blog/` - Blog posts
- `src/content/guides/` - Multi-part guides
- `src/content/scripts/` - Code library scripts

See `src/content/README.md` for content creation guidelines.

## Development

The project uses:
- **pnpm** for package management
- **Astro** for static site generation
- **Tailwind CSS v4** for styling
- **TypeScript** for type safety

## Deployment

### Cloudflare Pages

This project is configured for Cloudflare Pages deployment:

**Build Settings (in Cloudflare Pages dashboard):**
- **Framework preset:** Astro (or "None" if Astro preset not available)
- **Build command:** `pnpm build`
- **Build output directory:** `dist`
- **Root directory:** (leave empty)
- **Node version:** 18.x, 20.x, or 22.x
- **Package manager:** pnpm

**⚠️ CRITICAL: Do NOT set a deploy command!**

Cloudflare Pages will automatically deploy the `dist` folder after the build completes. If you see errors about `wrangler deploy`, it means a deploy command is configured - **remove it** from your Cloudflare Pages settings.

**Environment Variables:** None required initially

The build output (`dist/`) contains all static files ready for deployment.

### Troubleshooting Deployment

If you see this error:
```
✘ [ERROR] Missing entry-point to Worker script or to assets directory
```

**Solution:** Go to your Cloudflare Pages project settings → Builds & deployments → Remove any "Deploy command" that might be set. Leave it empty.

## Documentation

- [Architecture Documentation](./architecture.md) - Complete architecture and implementation details
- [Content Guide](./src/content/README.md) - How to create content
- [Specs](../specs.md) - Original project specifications
