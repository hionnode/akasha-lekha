# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Akasha Lekha is a developer-focused technical blog with interactive hands-on labs. Domain: works-on-my.cloud

The site is a static Astro site deployed to Cloudflare Pages. Labs content (modules and exercises) is browsable; backend API for progress tracking is deferred (code preserved in `_draft/backend/`).

## Commands

```bash
# Development
pnpm dev              # Start Astro dev server at localhost:4321

# Build & Deploy
pnpm build            # Build web app
pnpm deploy:web       # Deploy web to Cloudflare Pages

# Testing
pnpm test             # Run all tests (Vitest)
pnpm test:web         # Web app tests only
pnpm test:e2e         # Playwright E2E tests (Chromium, Firefox, Safari, mobile)

# Single test file
pnpm --filter @akasha/web test src/test/components/MyComponent.test.ts

# Quality
pnpm lint             # Lint all packages (ESLint flat config)
pnpm typecheck        # TypeScript check all packages
pnpm validate:blog    # Validate blog post frontmatter
```

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USERS                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLOUDFLARE PAGES                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     apps/web (Astro)                                 │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │    │
│  │  │    Blog      │  │    Labs      │  │    Tools + Assets        │   │    │
│  │  │  /blog/*     │  │   /labs/*    │  │  /tools/*, /fonts, etc   │   │    │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
akasha-lekha/
├── apps/web/                      # @akasha/web - Astro 5 frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── blog/              # Blog-specific components
│   │   │   │   ├── code/          # Code display (PanelSwitcher, FileTree, TerminalOutput, Command)
│   │   │   │   └── guide/         # Instructional (GuideStep, ValidationChecklist, ComparisonTable, EnvVars)
│   │   │   ├── discrete-math/     # Interactive math components (TruthTable, LogicGateEditor, ProofStepper)
│   │   │   ├── labs/              # Labs components
│   │   │   │   ├── islands/       # Solid.js interactive (CLICommandCopy)
│   │   │   │   └── layout/        # LabsHeader.astro, LabsSidebar.astro
│   │   │   ├── layout/            # Header, Footer, Container, BlogSidebar, SeriesSidebar
│   │   │   └── shared/            # Truly shared (Alert, Badge, Button, SEO, CodeSwitcher, TOCMinimap)
│   │   ├── content/
│   │   │   ├── blog/              # Blog posts (MDX) - standalone + series folders
│   │   │   └── labs/
│   │   │       ├── modules/       # Lab module definitions
│   │   │       ├── exercises/     # Exercise definitions
│   │   │       ├── schemas.ts     # Zod schemas for labs content validation
│   │   │       └── schemas.test.ts
│   │   ├── data/
│   │   │   └── labs-modules.ts    # Static module list for labs UI
│   │   ├── pages/
│   │   │   ├── blog/              # [..slug].astro, index.astro
│   │   │   ├── labs/              # index, setup, modules/[...slug]
│   │   │   ├── tools/             # aws-latency.astro
│   │   │   └── aws.astro          # AWS redirect page
│   │   ├── styles/global.css      # Global styles + Tailwind
│   │   └── utils/                 # Remark/Rehype plugins, helpers
│   │       ├── remarkCallouts.ts
│   │       ├── remarkCodeMeta.ts
│   │       ├── remarkSteps.ts
│   │       ├── remarkCodeSwitcher.poc.ts  # Active code switcher
│   │       ├── rehypeCodeSwitcher.poc.ts  # Active code switcher
│   │       └── ...                # seo.ts, readingTime.ts, etc.
│   ├── e2e/                       # Playwright E2E tests
│   ├── public/                    # Static assets (robots.txt, etc.)
│   ├── wrangler.jsonc             # Cloudflare Workers config
│   ├── astro.config.mjs
│   ├── vitest.config.ts
│   └── playwright.config.ts
├── scripts/
│   └── validate-blog-posts.mjs    # Blog frontmatter validation
├── docs/                          # Active documentation
│   ├── content-plan/              # AWS series content plan
│   ├── BLOG-GUIDE.md
│   ├── QUICK_START.md
│   └── DEPLOYMENT.md
├── _draft/                        # Deferred backend code (tracked in git)
│   ├── backend/                   # API, types, infra, SST config
│   └── docs/                      # Archived session notes
└── .github/workflows/             # CI/CD
    ├── ci.yml                     # Quality checks (path-filtered)
    ├── web-preview.yml            # Cloudflare preview on PR
    └── web-production.yml         # Cloudflare production on main
```

## Frontend (apps/web)

### Tech Stack
- **Astro 5.x** - Static output mode with Cloudflare adapter, MDX content
- **Solid.js** - Interactive islands (clipboard copy)
- **Tailwind CSS v4** - Tokyo Night theme (dark mode only), via `@tailwindcss/vite`
- **Typography** - Inconsolata monospace font throughout
- **Shiki** - Code highlighting with `tokyo-night` theme
- **Markdown pipeline** - remark-directive + custom remark/rehype plugins in `src/utils/`

### Content Collections

Blog and lab content uses Astro Content Collections with Zod schemas in `src/content/config.ts`. Labs also have standalone schemas in `src/content/labs/schemas.ts` with tests.

**Blog Schema:**
```typescript
{
  title: z.string(),
  date: z.string(),                   // YYYY-MM-DD format
  updated: z.string().optional(),     // Last updated date
  excerpt: z.string(),                // Brief description for cards
  description: z.string().optional(), // SEO meta description
  author: z.string().optional(),
  tags: z.array(z.string()),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  series: z.string().optional(),      // Must match folder name
  seriesPart: z.number().optional(),
  seriesTotal: z.number().optional(),
}
```

**Module Schema:**
```typescript
{
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  order: z.number().int().positive(),           // Display order
  icon: z.string().optional(),                  // Emoji or icon
  prerequisites: z.array(z.string()).optional(),
  estimatedTime: z.string().min(1),             // "2-3 hours"
  exerciseCount: z.number().int().nonnegative(),
  status: z.enum(['available', 'coming-soon', 'beta']).default('available'),
}
```

**Exercise Schema:**
```typescript
{
  id: z.string().min(1),
  module: z.string().min(1),                    // Reference to module
  order: z.number().int().positive(),           // Order within module
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedTime: z.string().min(1),             // "15 minutes"
  objectives: z.array(z.string()).min(1),
  verificationCriteria: z.array(z.string()).min(1),
  hints: z.array(z.string()).optional(),
  cliCommand: z.string().startsWith('infra-learn'),  // Verification command
}
```

### MDX Components

**Callout Directives:**
```markdown
:::tip
Best practices, helpful suggestions
:::

:::note
Important information to remember
:::

:::info
Additional context, background
:::

:::warning
Cost implications, breaking changes
:::

:::caution
Data loss, security issues, system failures
:::
```

**Steps Component:**
```markdown
:::steps
1. First step
2. Second step
3. Third step
:::
```

**Code Block Enhancements:**
````markdown
```typescript title="example.ts"
// Shows filename header with file icon
```

```bash terminal
# Shows terminal window with macOS controls
```
````

**Code Switcher:**
````markdown
:::code-switcher
```typescript title="Option A"
const a = 1;
```

```typescript title="Option B"
const b = 2;
```
:::
````

### Key Pages

| Route | File | Purpose |
|-------|------|---------|
| `/` | `index.astro` | Landing page with terminal hero |
| `/blog` | `blog/index.astro` | Blog listing |
| `/blog/:slug` | `blog/[...slug].astro` | Blog post |
| `/labs` | `labs/index.astro` | Labs landing |
| `/labs/setup` | `labs/setup.astro` | Setup instructions |
| `/labs/modules/:slug` | `labs/modules/[...slug].astro` | Module/exercise pages |
| `/aws` | `aws.astro` | AWS resource page |
| `/tools/aws-latency` | `tools/aws-latency.astro` | AWS region latency tool |

## Blog Content Guidelines

### Standalone Posts
Place in `apps/web/src/content/blog/` with filename `YYYY-MM-DD-slug.mdx`

### Multi-Part Series
Organize in folders matching the series slug:
```
blog/eks-deep-dive/
├── 01-introduction.mdx
├── 02-setup.mdx
└── 03-networking.mdx
```

Frontmatter:
```yaml
series: "eks-deep-dive"    # Must match folder name exactly
seriesPart: 1              # seriesTotal auto-calculated from folder contents
```

### URLs
- Standalone: `/blog/2024-12-01-my-post`
- Series: `/blog/eks-deep-dive/01-introduction`

## CI/CD

### Path-Based Triggering

| Change | CI | Web Preview | Web Production |
|--------|----|----|----|
| `apps/web/**` | web job | yes | yes |
| `pnpm-lock.yaml` | web job | yes | yes |
| `apps/web/src/content/blog/**` | blog job | - | - |

### Workflows

- **ci.yml** - Lint, typecheck, test, build (path-filtered jobs)
- **web-preview.yml** - Cloudflare Pages preview on PR, posts URL comment
- **web-production.yml** - Cloudflare Pages production on main merge

### Required GitHub Secrets
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID

## Environments

| Environment | Frontend | Purpose |
|-------------|----------|---------|
| Development | localhost:4321 | Local development |
| Preview | preview.works-on-my.cloud | PR previews |
| Production | works-on-my.cloud | Live site |

## Deferred Content (`_draft/`)

The `_draft/` directory contains code and content moved out of the active build scope. It includes:
- `_draft/backend/` — Deferred backend (API, types, infra, SST config, Solid.js islands, web utils, pages)
- `_draft/content/blog/` — Meta-content blog posts (component-guide, mdx-mastery-series, MDX showcase)
- `_draft/docs/` — Archived session notes and implementation docs

This code is tracked in git but excluded from the build.

## AWS Series Content Plan

The 70-part "AWS From Zero to Production" blog series has a structured content plan at `docs/content-plan/aws-series/`.

### Content Plan Structure

```
docs/content-plan/aws-series/
├── aws-plan.md                    # Master curriculum plan (70 parts)
├── STYLE-GUIDE.md                 # Voice, tone, audience, prose conventions
├── COMPONENT-PLAYBOOK.md          # Which component when, copy-paste examples
├── THREAD-TRACKER.md              # Four threads state at every part
├── CONTENT-PATTERNS.md            # Structural patterns: Fine Line, DGVE, leads
├── FRONTMATTER-AND-METADATA.md    # Frontmatter templates, tags, SEO, dates
├── phase-NN-name/
│   ├── 00-phase-overview.md       # Phase goal, thread state, part summary
│   └── NN-slug.md                 # Per-part implementation plan
```

### Using the Content Plan When Writing Blog Posts

1. **Before writing any part:** Read the corresponding `NN-slug.md` implementation file for section outline, component imports, thread additions, and code examples spec.
2. **For component usage:** Reference `COMPONENT-PLAYBOOK.md` for copy-paste import blocks and usage patterns.
3. **For voice/tone:** Follow `STYLE-GUIDE.md` conventions (direct, opinionated, second person, active voice).
4. **For frontmatter:** Copy the exact template from `FRONTMATTER-AND-METADATA.md`.
5. **For thread continuity:** Check `THREAD-TRACKER.md` to see what AGENT-INSTRUCTIONS.md, Scorecard, Eval, and MCP state should be at any given part.
6. **For structural patterns:** Use `CONTENT-PATTERNS.md` for Fine Line boxes, DGVE pipeline sections, and cross-referencing conventions.

### Blog Post Location

All AWS series posts live in `apps/web/src/content/blog/aws-for-startups/` with filenames `NN-kebab-case-slug.mdx`.

## Key Configuration

- **TypeScript**: Strict mode, ES2022 target, ESNext modules
- **Zod**: v4.x (used for content schemas)
- **Prettier**: 2 spaces, semicolons, single quotes, 100 char width, trailing commas (es5)
- **ESLint**: Flat config (`eslint.config.js`) with TypeScript and Astro plugins
- **Lint-staged** (`.lintstagedrc.json`): `*.{js,ts,astro}` → eslint + prettier; `*.{css,json,md}` → prettier
- **Pre-commit hooks (Husky)**: lint-staged → blog validation → build
- **Cloudflare**: Wrangler config in `apps/web/wrangler.jsonc` (static output with Cloudflare adapter)
