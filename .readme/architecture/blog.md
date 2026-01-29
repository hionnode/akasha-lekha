# Blog Architecture

The blog is built with Astro 5.x and lives in `apps/web/`. It serves technical articles focused on AWS, DevOps, and cloud engineering.

## Directory Structure

```
apps/web/
├── astro.config.mjs          # Astro configuration with MDX plugins
├── package.json              # Dependencies
├── wrangler.jsonc            # Cloudflare Pages config
├── public/                   # Static assets
│   ├── favicon.svg
│   └── .assetsignore
├── src/
│   ├── components/
│   │   ├── blog/             # Blog-specific components
│   │   ├── labs/             # Labs components
│   │   │   └── islands/      # Solid.js interactive components
│   │   ├── landing/          # Homepage components
│   │   ├── layout/           # Layout components
│   │   ├── shared/           # Reusable components
│   │   └── tui/              # Terminal UI components
│   ├── content/
│   │   ├── blog/             # Blog posts (MDX)
│   │   │   ├── aws-for-startups/
│   │   │   ├── component-guide/
│   │   │   └── mdx-mastery-series/
│   │   ├── labs/             # Labs content
│   │   │   ├── modules/
│   │   │   └── exercises/
│   │   └── config.ts         # Content collection schemas
│   ├── layouts/
│   │   └── Layout.astro      # Base layout
│   ├── pages/
│   │   ├── index.astro       # Homepage
│   │   ├── blog/
│   │   │   ├── index.astro   # Blog listing
│   │   │   └── [...slug].astro # Blog post pages
│   │   └── labs/             # Labs pages
│   ├── styles/
│   │   └── global.css        # Global styles + Tailwind
│   └── utils/                # Utility functions + MDX plugins
│       ├── remarkCallouts.ts
│       ├── remarkSteps.ts
│       └── remarkPackageManager.ts
├── vitest.config.ts          # Unit test configuration
└── playwright.config.ts      # E2E test configuration
```

## Technology Stack

| Technology | Purpose |
|------------|---------|
| Astro 5.x | Static site generation |
| MDX | Content with components |
| Tailwind CSS v4 | Styling |
| Solid.js | Interactive islands |
| TypeScript | Type safety |
| Vitest | Unit testing |
| Playwright | E2E testing |

## Content Collections

Blog posts use Astro's Content Collections for type-safe content management.

### Schema Definition

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),                              // YYYY-MM-DD format
    updated: z.string().optional(),                // Last updated date
    excerpt: z.string(),                           // Brief description
    description: z.string().optional(),            // SEO description
    author: z.string().optional(),                 // Post author
    tags: z.array(z.string()),                     // Topic tags
    featured: z.boolean().default(false),          // Show on homepage
    draft: z.boolean().default(false),             // Hide from production
    series: z.string().optional(),                 // Series identifier
    seriesPart: z.number().optional(),             // Part number in series
    seriesTotal: z.number().optional(),            // Total parts
  }),
});

export const collections = { blog };
```

## Content Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Blog Content Organization                          │
└─────────────────────────────────────────────────────────────────────────────┘

apps/web/src/content/blog/
│
├── Standalone Posts (single files)
│   │
│   ├── 2024-12-01-getting-started.mdx ──────> /blog/2024-12-01-getting-started
│   ├── 2024-12-15-advanced-tips.mdx ────────> /blog/2024-12-15-advanced-tips
│   └── 2025-01-20-new-feature.mdx ──────────> /blog/2025-01-20-new-feature
│
└── Series Posts (folders)
    │
    ├── aws-for-startups/
    │   ├── 01-your-first-60-minutes.mdx ────> /blog/aws-for-startups/01-your-first-60-minutes
    │   ├── 02-iam-intro.mdx ────────────────> /blog/aws-for-startups/02-iam-intro
    │   └── 03-local-setup.mdx ──────────────> /blog/aws-for-startups/03-local-setup
    │
    └── mdx-mastery-series/
        ├── 01-getting-started.mdx ──────────> /blog/mdx-mastery-series/01-getting-started
        ├── 02-advanced-components.mdx ──────> /blog/mdx-mastery-series/02-advanced-components
        └── 03-best-practices.mdx ───────────> /blog/mdx-mastery-series/03-best-practices

┌─────────────────────────────────────────────────────────────────────────────┐
│  Series Frontmatter Requirements:                                            │
│  ─────────────────────────────────                                           │
│  series: "aws-for-startups"    # Must match folder name exactly              │
│  seriesPart: 1                 # Part number in series                       │
│  seriesTotal: 5                # Total parts (optional)                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Creating Blog Posts

### Standalone Post

Create a new `.mdx` file in `src/content/blog/`:

```mdx
---
title: "Your Post Title"
date: "2025-01-27"
excerpt: "A brief description of your post"
tags: ["aws", "devops"]
---

Your content here using MDX...
```

### Series Post

For multi-part series, organize in a folder matching the series slug:

```
src/content/blog/
└── aws-for-startups/
    ├── 01-your-first-60-minutes-in-aws.mdx
    ├── 02-iam-intro-for-starters.mdx
    └── 03-local-aws-setup.mdx
```

Each post in a series:

```mdx
---
title: "Your First 60 Minutes in AWS"
date: "2025-01-15"
excerpt: "Get started with AWS the right way"
tags: ["aws", "beginner"]
series: "aws-for-startups"
seriesPart: 1
seriesTotal: 5
---
```

**Note:** The `series` field should match the folder name exactly.

### Frontmatter Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Post title |
| `date` | string | Yes | Publication date (YYYY-MM-DD) |
| `updated` | string | No | Last updated date (YYYY-MM-DD) |
| `excerpt` | string | Yes | Brief description for cards |
| `description` | string | No | SEO meta description |
| `author` | string | No | Post author |
| `tags` | string[] | Yes | Topic tags |
| `featured` | boolean | No | Highlight on homepage (default: false) |
| `draft` | boolean | No | Hide from production (default: false) |
| `series` | string | No | Series identifier (match folder name) |
| `seriesPart` | number | No | Part number in series |
| `seriesTotal` | number | No | Total parts in series |

### URL Structure

- **Standalone posts:** `/blog/2024-12-01-my-post`
- **Series posts:** `/blog/aws-for-startups/01-your-first-60-minutes`

## MDX Components

### Callout Directives

Use directive syntax for callouts (no imports needed):

```markdown
:::tip
Best practices, helpful suggestions, optimizations
:::

:::note
Important information to remember
:::

:::info
Additional context, background information
:::

:::warning
Cost implications, breaking changes, important caveats
:::

:::caution
Data loss, security issues, system failures
:::
```

### Steps Component

For step-by-step instructions:

```markdown
:::steps
1. Create a new Amplify Hosting project
2. Connect your repository to Amplify
3. Modify your build settings
4. Deploy and verify your application
:::
```

### Package Manager Switcher

For showing commands across package managers:

````markdown
:::package-manager
```bash npm
npm install package-name
```

```bash pnpm
pnpm add package-name
```

```bash yarn
yarn add package-name
```
:::
````

### Code Block Enhancements

**With filename header:**
````markdown
```typescript title="example.ts"
const greeting = "Hello, World!";
```
````

**Terminal window styling:**
````markdown
```bash terminal
aws sso login --sso-session=acme
```
````

### Astro Components

Import and use components directly:

```mdx
import FileTree from '@/components/shared/FileTree.astro';

<FileTree>
  - src/
    - components/
    - pages/
</FileTree>
```

## Styling

### Theme: Tokyo Night

The blog uses a custom Tokyo Night-inspired color palette:

```css
/* Primary colors */
--color-bg: #1a1b26;
--color-fg: #a9b1d6;
--color-accent: #7aa2f7;
--color-accent-alt: #bb9af7;
```

### Typography

- Font: Inconsolata (monospace throughout)
- Prose styling via `@tailwindcss/typography`

### Dark Mode

The site is dark-mode only, matching the terminal aesthetic.

## Development

### Start Development Server

```bash
# From root
pnpm dev

# Or from apps/web
cd apps/web
pnpm dev
```

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

### Run Tests

```bash
# Unit tests
pnpm test:web

# E2E tests
pnpm test:e2e
```

## Deployment

The blog deploys to Cloudflare Pages:

1. **Preview**: Automatic on every PR (web-preview.yml)
2. **Production**: Automatic on merge to `main` (web-production.yml)

### Cloudflare Configuration

```jsonc
// wrangler.jsonc
{
  "name": "akasha-lekha",
  "compatibility_date": "2024-01-01",
  "pages_build_output_dir": "./dist"
}
```

### Build Settings

| Setting | Value |
|---------|-------|
| Framework | Astro |
| Build command | `pnpm build` |
| Output directory | `dist` |
| Node version | 20 |

## Performance Optimization

### Static Generation

All blog posts are statically generated at build time for optimal performance.

### Image Optimization

Use Astro's built-in image optimization:

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/image.png';
---

<Image src={myImage} alt="Description" />
```

### Caching

- Static assets: Long-term caching via Cloudflare CDN
- HTML pages: Short-term caching with revalidation

## Related Documentation

- [Architecture Overview](./overview.md)
- [Labs Platform](./labs.md)
- [CI/CD Workflows](./ci-cd.md)
