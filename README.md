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

# Run quality checks
pnpm lint              # Check for linting errors
pnpm format:check      # Check code formatting
pnpm typecheck         # Check TypeScript types
pnpm validate:blog     # Validate blog post frontmatter
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

- `src/content/blog/` - Blog posts (including multi-part series)

See `BLOG-GUIDE.md` for content creation guidelines.

## Development

The project uses:
- **pnpm** for package management
- **Astro** for static site generation
- **Tailwind CSS v4** for styling
- **TypeScript** for type safety

### Pre-commit Hooks & Quality Checks

This project uses automated quality checks to ensure code quality and prevent issues before they reach production.

#### What Runs on Every Commit

When you commit code, the following checks run automatically:

1. **Lint-staged** - ESLint and Prettier on changed files only
2. **Blog Validation** - Validates all blog post frontmatter
3. **Type Checking** - TypeScript type verification
4. **Build Verification** - Ensures the site builds successfully

If any check fails, the commit will be blocked until you fix the issues.

#### Available Commands

```bash
# Linting
pnpm lint              # Check for linting errors
pnpm lint:fix          # Auto-fix linting errors

# Formatting
pnpm format            # Auto-format all files
pnpm format:check      # Check code formatting

# Type Checking
pnpm typecheck         # Check TypeScript types

# Blog Validation
pnpm validate:blog     # Validate blog post frontmatter

# Run all checks manually
pnpm lint && pnpm format:check && pnpm validate:blog && pnpm typecheck && pnpm build
```

#### Bypassing Pre-commit Checks (Emergency Only)

```bash
# NOT RECOMMENDED - Use only in emergencies
git commit --no-verify -m "emergency fix"
```

#### Troubleshooting Pre-commit Hooks

If the pre-commit hook isn't running:

```bash
# Re-initialize Husky
pnpm prepare

# Make the hook executable
chmod +x .husky/pre-commit
```

### CI/CD Workflows

#### Pull Request Workflow

When you create a pull request to `main`:

1. **Quality Checks Job** runs:
   - Linting
   - Format checking
   - Blog post validation
   - Type checking
   - Full build

2. **Deploy Preview Job** (if checks pass):
   - Deploys to Cloudflare Pages
   - Posts preview URL as PR comment

#### Production Deployment

When a PR is merged to `main`:

1. **Quality Checks Job** runs full validation
2. **Deploy Production Job** deploys to Cloudflare Pages

#### Required GitHub Secrets

To enable CI/CD workflows, add these secrets to your GitHub repository:

1. Go to: **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `CLOUDFLARE_API_TOKEN` - Get from [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - `CLOUDFLARE_ACCOUNT_ID` - Find in your Cloudflare Pages project settings

See `GITHUB_SECRETS_SETUP.md` for detailed instructions.

### Blog Post Requirements

All blog posts must include valid frontmatter:

```yaml
---
title: "Your Post Title"              # Required: min 1 character
date: "2025-01-02"                    # Required: YYYY-MM-DD format
excerpt: "Brief description"          # Required: min 10 characters
tags: ["tag1", "tag2"]                # Required: at least one tag
featured: false                       # Optional: highlight on homepage
draft: false                          # Optional: hide from public
series: "Series Name"                 # Optional: for multi-part series
seriesPart: 1                         # Optional: part number
seriesTotal: 5                        # Optional: total parts
---
```

The `validate:blog` script will check all posts automatically.

### Development Workflow

```bash
# 1. Create a new branch
git checkout -b feature/your-feature

# 2. Make your changes
# Edit files, create blog posts, etc.

# 3. Commit (pre-commit hooks run automatically)
git add .
git commit -m "feat: add new feature"

# 4. Push to GitHub
git push origin feature/your-feature

# 5. Create Pull Request
# GitHub Actions will run checks and deploy preview

# 6. Merge to main
# Automatic production deployment
```

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
- [Blog Guide](./BLOG-GUIDE.md) - How to create blog posts and series
- [Quick Start Guide](./QUICK_START.md) - Daily development workflow
- [Pre-commit & CI/CD Summary](./PRE_COMMIT_CI_CD_IMPLEMENTATION_SUMMARY.md) - Complete setup details
- [GitHub Secrets Setup](./GITHUB_SECRETS_SETUP.md) - How to configure Cloudflare secrets

## Quality Assurance

This project includes comprehensive quality checks:

- ✅ **ESLint** - Code linting with TypeScript and Astro support
- ✅ **Prettier** - Automatic code formatting
- ✅ **TypeScript** - Type checking across the codebase
- ✅ **Blog Validation** - Frontmatter schema validation
- ✅ **Pre-commit Hooks** - Automated checks before every commit
- ✅ **GitHub Actions** - CI/CD with preview deployments
- ✅ **Cloudflare Pages** - Automated production deployments
