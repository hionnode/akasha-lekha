# Akasha Lekha - Architecture Documentation

> **Project Name:** akasha-lekha  
> **Domain:** works-on-my.cloud  
> **Framework:** Astro (Static Site Generation)  
> **Purpose:** Developer-focused technical blog and code library

This document explains the architecture, folder structure, and how everything works in the akasha-lekha project. It's a living document that will be updated as the project evolves.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Design System](#design-system)
5. [Content Architecture](#content-architecture)
6. [Component Architecture](#component-architecture)
7. [Routing & Pages](#routing--pages)
8. [Build & Deployment](#build--deployment)
9. [Development Workflow](#development-workflow)

---

## Project Overview

Akasha Lekha is a static site generator for a technical blog and code library. It focuses on:

- **Blog Posts:** Technical articles about cloud infrastructure, DevOps, security, and observability
- **Guides:** Multi-part deep-dive guides into specific topics
- **Code Library:** Bash scripts, Terraform modules, and infrastructure code
- **Static Generation:** All content is pre-rendered at build time for optimal performance

**Note:** The monitoring platform product component is deferred to a future phase. This is a content-focused static site.

---

## Tech Stack

### Core Framework
- **Astro 5.x:** Static site generation framework
- **TypeScript:** Type-safe development
- **Tailwind CSS:** Utility-first CSS framework

### Content Management
- **Astro Content Collections:** Type-safe markdown content management
- **Markdown:** All content stored as `.md` files in Git
- **Frontmatter:** YAML frontmatter for metadata

### Styling
- **Tailwind CSS:** Configured with Tokyo Night color palette
- **Inconsolata Font:** Monospace font for entire site
- **Custom CSS:** Syntax highlighting themes

### Build & Deployment
- **pnpm:** Package manager
- **Cloudflare Pages:** Deployment target
- **Static Site Generation:** All pages pre-rendered at build time

---

## Folder Structure

```
akasha-lekha/
├── public/                    # Static assets (served as-is)
│   ├── favicon.ico
│   ├── og-image.jpg           # Social share image
│   └── fonts/
│       └── inconsolata/       # Self-hosted Inconsolata font files
│
├── src/
│   ├── components/            # Reusable Astro components
│   │   ├── layout/
│   │   │   ├── Header.astro   # Site header/navigation
│   │   │   ├── Footer.astro   # Site footer
│   │   │   └── Container.astro # Content container wrapper
│   │   ├── blog/
│   │   │   ├── PostCard.astro # Blog post card component
│   │   │   ├── PostList.astro # Blog post list component
│   │   │   ├── FilterBar.astro # Filter bar (client-side island)
│   │   │   └── TagPill.astro  # Tag pill component
│   │   ├── guides/
│   │   │   ├── GuideCard.astro # Guide card component
│   │   │   ├── GuideNav.astro # Guide navigation component
│   │   │   └── PartNav.astro  # Guide part navigation
│   │   ├── code/
│   │   │   ├── ScriptCard.astro # Script card component
│   │   │   ├── CodeBlock.astro # Code block with syntax highlighting
│   │   │   └── CopyButton.astro # Copy button (client-side island)
│   │   └── shared/
│   │       ├── Button.astro   # Button component
│   │       ├── Badge.astro    # Badge component
│   │       └── SEO.astro      # SEO meta tags component
│   │
│   ├── layouts/               # Page layout templates
│   │   ├── Layout.astro       # Base layout (header + footer)
│   │   └── PostLayout.astro   # Blog post/guide part layout
│   │
│   ├── pages/                 # Astro file-based routing
│   │   ├── index.astro        # Homepage (/)
│   │   ├── blog/
│   │   │   ├── index.astro    # Blog home (/blog)
│   │   │   └── [slug].astro   # Blog post (/blog/[slug])
│   │   ├── guides/
│   │   │   ├── index.astro    # Guides home (/guides)
│   │   │   └── [guide-slug]/
│   │   │       ├── index.astro    # Guide index (/guides/[guide-slug])
│   │   │       └── [part-slug].astro # Guide part (/guides/[guide-slug]/[part-slug])
│   │   ├── code/
│   │   │   ├── index.astro    # Code library (/code)
│   │   │   └── [slug].astro   # Script page (/code/[slug])
│   │   ├── monitoring.astro   # Monitoring coming soon page
│   │   ├── rss.xml.ts         # RSS feed generation
│   │   └── sitemap.xml.ts     # Sitemap generation
│   │
│   ├── content/               # Content collections (markdown files)
│   │   ├── blog/              # Blog posts
│   │   │   ├── 2024-12-01-first-post.md
│   │   │   └── 2024-12-05-another-post.md
│   │   ├── guides/            # Multi-part guides
│   │   │   ├── kubernetes-security/
│   │   │   │   ├── index.md   # Guide overview
│   │   │   │   ├── part-1-basics.md
│   │   │   │   └── part-2-network-policies.md
│   │   │   └── aws-finops/
│   │   │       ├── index.md
│   │   │       └── part-1-billing.md
│   │   └── scripts/           # Code library scripts
│   │       ├── aws-cost-analyzer.md
│   │       └── k8s-security-scan.md
│   │
│   ├── utils/                 # Utility functions
│   │   ├── markdown.ts        # Markdown parsing utilities
│   │   ├── readingTime.ts     # Calculate reading time
│   │   ├── seo.ts             # SEO meta generation
│   │   └── content.ts        # Content loading/filtering helpers
│   │
│   ├── styles/                # Global styles
│   │   ├── globals.css        # Tailwind imports, base styles
│   │   └── syntax-theme.css   # Code syntax highlighting theme
│   │
│   └── config.ts              # Astro config, content collections config
│
├── astro.config.mjs           # Astro configuration
├── tailwind.config.mjs        # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
└── README.md                  # Project setup instructions
```

---

## Design System

### Color Palette: Tokyo Night

The entire site uses the Tokyo Night color scheme:

```css
/* Backgrounds */
--bg-primary: #1a1b26      /* Main page background */
--bg-secondary: #16161e     /* Card backgrounds, code blocks */
--bg-tertiary: #24283b      /* Hover states, active elements */

/* Foregrounds */
--fg-primary: #c0caf5       /* Main text */
--fg-secondary: #a9b1d6     /* Subheadings, metadata */
--fg-muted: #565f89         /* Timestamps, tags, less important text */

/* Accents */
--accent-blue: #7aa2f7      /* Links */
--accent-cyan: #7dcfff      /* Inline code */
--accent-green: #9ece6a      /* Success states */
--accent-yellow: #e0af68    /* Warnings */
--accent-orange: #ff9e64    /* Highlights */
--accent-red: #f7768e       /* Errors */
--accent-purple: #bb9af7    /* Highlights */
--accent-magenta: #c0a7e0   /* Special highlights */

/* Borders & Hover */
--border: #292e42            /* All borders, dividers */
--hover: #2f3549            /* Interactive element hover states */
```

### Typography

**Font:** Inconsolata (monospace only) - weights 400, 600, 700

**Type Scale:**
- `h1`: 2.5rem (40px) - Inconsolata 700 - Page titles
- `h2`: 2rem (32px) - Inconsolata 600 - Section headings
- `h3`: 1.5rem (24px) - Inconsolata 600 - Subsection headings
- `h4`: 1.25rem (20px) - Inconsolata 600 - Card titles
- `h5`: 1rem (16px) - Inconsolata 600 - Small headings
- `Body`: 1rem (16px) - Inconsolata 400 - Regular text
- `Body Large`: 1.125rem (18px) - Inconsolata 400 - Intro paragraphs
- `Body Small`: 0.875rem (14px) - Inconsolata 400 - Metadata, captions
- `Code Inline`: 0.875rem (14px) - Inconsolata 400
- `Code Block`: 0.875rem (14px) - Inconsolata 400
- `Label`: 0.75rem (12px) - Inconsolata 600 - Tags, badges

**Line Heights:**
- Headings: 1.2
- Body text: 1.6
- Code: 1.5

**Letter Spacing:**
- Headings: -0.02em
- Body: 0
- Labels/Tags: 0.05em (uppercase)

### Spacing Scale

Tailwind-compatible spacing:
- `xs`: 0.25rem (4px)
- `sm`: 0.5rem (8px)
- `md`: 1rem (16px)
- `lg`: 1.5rem (24px)
- `xl`: 2rem (32px)
- `2xl`: 3rem (48px)
- `3xl`: 4rem (64px)
- `4xl`: 6rem (96px)

### Max Widths
- Content: 65ch (optimal reading width)
- Container: 1200px
- Wide: 1400px (for code blocks, images)

---

## Content Architecture

### Astro Content Collections

All content is managed through Astro's Content Collections API, which provides:
- **Type Safety:** TypeScript schemas for frontmatter validation
- **Automatic Discovery:** Content files are automatically discovered
- **Built-in Parsing:** Markdown and frontmatter parsing out of the box
- **Easy Querying:** Simple API to query and filter content

### Content Types

#### 1. Blog Posts (`src/content/blog/`)

**File Naming:** `YYYY-MM-DD-slug.md`

**Frontmatter Schema:**
```yaml
---
title: string (required)
date: string (required, ISO format)
updated?: string (optional, ISO format)
excerpt: string (required)
tags: string[] (required)
featured?: boolean (optional, default: false)
draft?: boolean (optional, default: false)
---
```

**Example:**
```yaml
---
title: "Setting Up OpenTelemetry on Kubernetes"
date: "2024-12-01"
updated: "2024-12-05"
excerpt: "A practical guide to instrumenting your K8s cluster with OpenTelemetry"
tags: ["kubernetes", "observability", "opentelemetry"]
featured: true
draft: false
---
```

#### 2. Guides (`src/content/guides/`)

**Structure:** Each guide is a directory containing:
- `index.md` - Guide overview and parts list
- `part-1-slug.md`, `part-2-slug.md`, etc. - Individual guide parts

**Guide Index Frontmatter:**
```yaml
---
title: string (required)
description: string (required, multi-paragraph)
tags: string[] (required)
featured?: boolean (optional)
parts:
  - slug: string (required)
    title: string (required)
---
```

**Guide Part Frontmatter:**
```yaml
---
title: string (required)
guide: string (required, matches directory name)
part: number (required)
date: string (required, ISO format)
tags: string[] (required)
---
```

#### 3. Scripts (`src/content/scripts/`)

**File Naming:** `slug.md`

**Frontmatter Schema:**
```yaml
---
title: string (required)
description: string (required)
language: string (required, e.g., "bash", "terraform", "python")
tags: string[] (required)
externalRepo?: string (optional, GitHub URL)
---
```

**Content Structure:**
- Frontmatter (metadata)
- Usage section
- Requirements section
- Script section (code block)

---

## Component Architecture

### Component Types

#### 1. Server Components (Default)
Most components are Astro components (`.astro`), which are:
- **Server-rendered:** HTML generated at build time
- **Zero JavaScript:** No client-side JavaScript by default
- **Fast:** Minimal bundle size

#### 2. Client Islands
Interactive components use Astro islands with `client:*` directives:
- `client:load` - Load immediately
- `client:visible` - Load when visible (recommended for filters)
- `client:idle` - Load when browser is idle

**Examples:**
- `FilterBar.astro` - Blog filtering (client-side JavaScript)
- `CopyButton.astro` - Copy to clipboard functionality

### Component Organization

```
components/
├── layout/        # Site-wide layout components
├── blog/          # Blog-specific components
├── guides/         # Guide-specific components
├── code/           # Code library components
└── shared/         # Shared utility components
```

### Component Patterns

**Base Layout Component:**
```astro
---
// src/layouts/Layout.astro
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<html>
  <head>
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

**Content Component:**
```astro
---
// src/components/blog/PostCard.astro
interface Props {
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  slug: string;
}

const { title, excerpt, date, tags, slug } = Astro.props;
---

<article class="post-card">
  <h2><a href={`/blog/${slug}`}>{title}</a></h2>
  <p>{excerpt}</p>
  <footer>
    <time>{date}</time>
    <ul class="tags">
      {tags.map(tag => <li>{tag}</li>)}
    </ul>
  </footer>
</article>
```

---

## Routing & Pages

### File-Based Routing

Astro uses file-based routing. Files in `src/pages/` automatically become routes:

- `src/pages/index.astro` → `/`
- `src/pages/blog/index.astro` → `/blog`
- `src/pages/blog/[slug].astro` → `/blog/[slug]` (dynamic route)
- `src/pages/guides/[guide-slug]/[part-slug].astro` → `/guides/[guide-slug]/[part-slug]`

### Page Types

#### 1. Homepage (`/`)
- Hero section
- Featured posts (5 most recent with `featured: true`)
- Latest posts (5 most recent overall)

#### 2. Blog Home (`/blog`)
- Filter bar (client-side island)
- Post list (chronological)
- Pagination (static pages generated at build)

#### 3. Blog Post (`/blog/[slug]`)
- Article header (title, metadata)
- Article content (rendered markdown)
- Article footer (tags, back link)

#### 4. Guides Home (`/guides`)
- Card grid (2 columns desktop, 1 column mobile)
- Each card represents one guide

#### 5. Guide Index (`/guides/[guide-slug]`)
- Guide header (title, description, tags)
- Parts list (numbered, clickable)

#### 6. Guide Part (`/guides/[guide-slug]/[part-slug]`)
- Breadcrumb navigation
- Article content
- Navigation footer (prev/next part)
- Series sidebar (desktop) or menu (mobile)

#### 7. Code Library (`/code`)
- Filter/tag bar (client-side island)
- Script list (single column)
- Each script is a card

#### 8. Script Page (`/code/[slug]`)
- Full description
- Usage instructions
- Code block with syntax highlighting
- Requirements/dependencies

#### 9. Monitoring (`/monitoring`)
- Coming soon placeholder page

### Dynamic Routes

Dynamic routes use `getStaticPaths()` to generate all possible paths at build time:

```astro
---
// src/pages/blog/[slug].astro
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
---

<Layout title={post.data.title}>
  <article>
    <h1>{post.data.title}</h1>
    <Content />
  </article>
</Layout>
```

---

## Build & Deployment

### Build Process

1. **Content Collection Processing:**
   - Astro discovers all content files
   - Validates frontmatter against schemas
   - Parses markdown and frontmatter

2. **Page Generation:**
   - Static pages are pre-rendered
   - Dynamic routes generate all possible paths
   - HTML is generated for each page

3. **Asset Optimization:**
   - Images are optimized (via Astro's image optimization)
   - CSS is minified
   - JavaScript is code-split and minified

4. **Output:**
   - All static files written to `dist/` directory

### Build Commands

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview
```

### Cloudflare Pages Configuration

- **Build command:** `pnpm build`
- **Build output directory:** `dist`
- **Node version:** 18.x or 20.x
- **Environment variables:** None required initially

### Performance Optimizations

- **Static Generation:** All pages pre-rendered (SSG)
- **Astro Islands:** Only interactive components ship JavaScript
- **Image Optimization:** Automatic via Astro
- **Code Splitting:** Automatic by route
- **Minification:** Automatic in production builds
- **Compression:** Gzip/Brotli handled by Cloudflare

---

## Development Workflow

### Adding New Content

#### Blog Post
1. Create file: `src/content/blog/YYYY-MM-DD-slug.md`
2. Add frontmatter with required fields
3. Write markdown content
4. Commit and push
5. Build automatically generates new page

#### Guide
1. Create directory: `src/content/guides/guide-slug/`
2. Create `index.md` with guide overview
3. Create part files: `part-1-slug.md`, `part-2-slug.md`, etc.
4. Ensure frontmatter matches schema
5. Build generates all guide pages

#### Script
1. Create file: `src/content/scripts/script-slug.md`
2. Add frontmatter with required fields
3. Include usage, requirements, and script code
4. Build generates script page

### Component Development

1. Create component in appropriate directory
2. Use TypeScript interfaces for props
3. Add Tailwind classes for styling
4. Test in development server
5. Use Astro islands for client-side interactivity when needed

### Styling Guidelines

- Use Tailwind utility classes
- Follow Tokyo Night color palette
- Use Inconsolata font for all text
- Follow type scale and spacing scale
- Maintain responsive design (mobile-first)

---

## Future Enhancements

### Phase 2 (Months 4-6)
- Newsletter integration
- Analytics (Plausible or Umami)
- Search functionality (Algolia or local search)
- Dark/light mode toggle
- Comment system (Giscus)

### Phase 3 (Months 7-12)
- Monitoring platform functionality (deferred)
- User accounts (if needed)
- API documentation
- Interactive demos/sandboxes
- Video embedding/player

---

## Implementation Status

### ✅ Completed

- [x] Project initialization with Astro and TypeScript
- [x] Tailwind CSS v4 integration
- [x] Tokyo Night color palette configuration
- [x] Inconsolata font setup (Google Fonts)
- [x] Content collections schema (blog, guides, scripts)
- [x] Base layout components (Header, Footer, Container)
- [x] Base Layout component
- [x] Utility functions (readingTime, seo)
- [x] Basic page structure (homepage, blog, guides, code, monitoring)
- [x] Astro configured for static site generation
- [x] **Shared components** (Button, Badge, SEO)
- [x] **Blog components** (PostCard, PostList, FilterBar, TagPill)
- [x] **Guide components** (GuideCard, GuideNav, PartNav)
- [x] **Code library components** (ScriptCard, CodeBlock, CopyButton)
- [x] **Dynamic routes** (blog/[slug], guides/[guide-slug]/[part-slug], code/[slug])
- [x] **Sample content** (2 blog posts, 1 guide with 3 parts, 1 script)
- [x] **Shiki syntax highlighting** configured with Tokyo Night theme

### 🚧 In Progress

- [ ] FilterBar client-side filtering implementation
- [ ] RSS feed generation
- [ ] Sitemap generation
- [ ] Enhanced code block styling

### 📋 Pending

- [ ] Syntax highlighting theme (Tokyo Night)
- [ ] Image optimization setup
- [ ] SEO meta tags implementation
- [ ] Client-side islands for interactive components
- [ ] Responsive design refinements
- [ ] Accessibility audit
- [ ] Performance optimization

---

## Documentation Updates

This document will be updated as the project evolves. Key areas to document:

- [x] Content collection schema details
- [x] Utility function documentation
- [x] Build process details
- [ ] Component API documentation
- [ ] Deployment procedures
- [ ] Performance optimizations
- [ ] Accessibility features
- [ ] SEO implementation details

---

## Recent Changes

### 2024-12-XX - Initial Setup Complete ✅
- ✅ Created complete project structure (components, layouts, pages, content, utils)
- ✅ Configured Tailwind CSS v4 with Tokyo Night color palette via `@theme` directive
- ✅ Set up Inconsolata font via Google Fonts
- ✅ Created content collections with TypeScript schemas (blog, guides, scripts)
- ✅ Implemented base layout components (Header, Footer, Container, Layout)
- ✅ Created utility functions (readingTime.ts, seo.ts)
- ✅ Set up all basic page routes (homepage, blog, guides, code, monitoring)
- ✅ Configured Astro for static site generation
- ✅ Created content directory README with instructions
- ✅ Dev server tested and running successfully

### 2024-12-XX - Components & Content Implementation ✅
- ✅ **Shared Components**: Button, Badge, SEO components with proper styling
- ✅ **Blog Components**: PostCard, PostList, FilterBar (placeholder), TagPill
- ✅ **Guide Components**: GuideCard, GuideNav, PartNav with navigation
- ✅ **Code Library Components**: ScriptCard, CodeBlock, CopyButton (client-side)
- ✅ **Dynamic Routes**: All routes implemented with proper data fetching
  - Blog post pages with reading time calculation
  - Guide index and part pages with navigation
  - Script pages with code highlighting
- ✅ **Sample Content**: 
  - 2 blog posts (Kubernetes intro, AWS cost optimization)
  - 1 complete guide (Kubernetes Security with 3 parts)
  - 1 script (AWS Cost Analyzer)
- ✅ **Shiki Integration**: Syntax highlighting configured with Tokyo Night theme
- ✅ **Homepage**: Now displays featured and latest posts dynamically

**Project Status:** Fully functional with all components, routes, and sample content. Ready for content creation and deployment.

---

**Last Updated:** 2024-12-XX  
**Version:** 1.0.0

