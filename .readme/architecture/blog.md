# Blog Architecture

The blog is built with Astro and lives in `apps/web/`. It serves technical articles focused on AWS, DevOps, and cloud engineering.

## Directory Structure

```
apps/web/
├── astro.config.mjs          # Astro configuration
├── package.json              # Dependencies
├── wrangler.jsonc            # Cloudflare config
├── public/                   # Static assets
│   ├── favicon.svg
│   └── .assetsignore
├── src/
│   ├── components/
│   │   ├── blog/             # Blog-specific components
│   │   ├── landing/          # Homepage components
│   │   ├── layout/           # Layout components
│   │   ├── shared/           # Reusable components
│   │   └── tui/              # Terminal UI components
│   ├── content/
│   │   ├── blog/             # Blog posts (MDX)
│   │   │   ├── aws-for-startups/
│   │   │   ├── component-guide/
│   │   │   └── mdx-mastery-series/
│   │   └── config.ts         # Content collection schemas
│   ├── layouts/
│   │   └── Layout.astro      # Base layout
│   ├── pages/
│   │   ├── index.astro       # Homepage
│   │   ├── blog/
│   │   │   ├── index.astro   # Blog listing
│   │   │   └── [...slug].astro # Blog post pages
│   │   └── ...
│   ├── styles/
│   │   └── global.css        # Global styles + Tailwind
│   └── utils/                # Utility functions
└── vitest.config.ts          # Test configuration
```

## Technology Stack

| Technology | Purpose |
|------------|---------|
| Astro 5.x | Static site generation |
| MDX | Content with components |
| Tailwind CSS v4 | Styling |
| Solid.js | Interactive islands |
| TypeScript | Type safety |

## Content Collections

Blog posts use Astro's Content Collections for type-safe content management.

### Schema Definition

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string().min(10),
    tags: z.array(z.string()).min(1),
    featured: z.boolean().optional().default(false),
    draft: z.boolean().optional().default(false),
    series: z.string().optional(),
    seriesPart: z.number().optional(),
    seriesTotal: z.number().optional(),
  }),
});

export const collections = { blog: blogCollection };
```

## Creating Blog Posts

### Basic Post

Create a new `.mdx` file in `src/content/blog/`:

```mdx
---
title: "Your Post Title"
date: "2025-01-27"
excerpt: "A brief description of your post (minimum 10 characters)"
tags: ["aws", "devops"]
---

Your content here using MDX...
```

### Series Post

For multi-part series, organize in a folder:

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
series: "AWS for Startups"
seriesPart: 1
seriesTotal: 5
---
```

### Frontmatter Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Post title |
| `date` | string | Yes | Publication date (YYYY-MM-DD) |
| `excerpt` | string | Yes | Brief description (min 10 chars) |
| `tags` | string[] | Yes | At least one tag |
| `featured` | boolean | No | Highlight on homepage |
| `draft` | boolean | No | Hide from public |
| `series` | string | No | Series name |
| `seriesPart` | number | No | Part number in series |
| `seriesTotal` | number | No | Total parts in series |

## MDX Components

The blog supports custom MDX components for enhanced content:

### Code Blocks

````mdx
```typescript title="example.ts"
const greeting = "Hello, World!";
```
````

### Callouts/Alerts

```mdx
import Alert from '@/components/shared/Alert.astro';

<Alert type="warning">
  This is important information!
</Alert>
```

### File Trees

```mdx
import FileTree from '@/components/shared/FileTree.astro';

<FileTree>
  - src/
    - components/
    - pages/
</FileTree>
```

### Terminal Output

```mdx
import TerminalOutput from '@/components/shared/TerminalOutput.astro';

<TerminalOutput>
  $ npm install
  added 150 packages in 3s
</TerminalOutput>
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
cd apps/web
pnpm dev
```

Or from root:

```bash
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

### Validate Blog Posts

```bash
pnpm validate:blog
```

This checks all frontmatter against the schema.

## Deployment

The blog deploys to Cloudflare Pages:

1. **Preview**: Automatic on every PR
2. **Production**: Automatic on merge to `main`

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

- Static assets: Long-term caching via Cloudflare
- HTML pages: Short-term caching with revalidation

## Related Documentation

- [Architecture Overview](./overview.md)
- [Labs Platform](./labs.md)
- [CI/CD Workflows](./ci-cd.md)
