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

Configured for Cloudflare Pages:
- Build command: `pnpm build`
- Output directory: `dist`
- Node version: 18.x or 20.x

## Documentation

- [Architecture Documentation](./architecture.md) - Complete architecture and implementation details
- [Content Guide](./src/content/README.md) - How to create content
- [Specs](../specs.md) - Original project specifications
