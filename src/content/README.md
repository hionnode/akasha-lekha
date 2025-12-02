# Content Directory

This directory contains all markdown content for the site, organized into collections:

- `blog/` - Blog posts
- `guides/` - Multi-part guides
- `scripts/` - Code library scripts

## Creating Content

### Blog Post

1. Create a new file: `blog/YYYY-MM-DD-slug.md`
2. Add required frontmatter:
   ```yaml
   ---
   title: "Your Post Title"
   date: "2024-12-01"
   excerpt: "A brief description of the post"
   tags: ["tag1", "tag2"]
   featured: false
   draft: false
   ---
   ```
3. Write your content in markdown below the frontmatter

### Guide

1. Create a directory: `guides/guide-slug/`
2. Create `index.md` with guide overview:
   ```yaml
   ---
   title: "Guide Title"
   description: "Multi-paragraph description..."
   tags: ["tag1", "tag2"]
   featured: false
   parts:
     - slug: "part-1-basics"
       title: "Part 1: Basics"
     - slug: "part-2-advanced"
       title: "Part 2: Advanced"
   ---
   ```
3. Create part files: `part-1-basics.md`, `part-2-advanced.md`, etc.
4. Each part needs:
   ```yaml
   ---
   title: "Part 1: Basics"
   guide: "guide-slug"
   part: 1
   date: "2024-12-01"
   tags: ["tag1", "tag2"]
   ---
   ```

### Script

1. Create a file: `scripts/script-slug.md`
2. Add frontmatter:
   ```yaml
   ---
   title: "Script Title"
   description: "What the script does"
   language: "bash"
   tags: ["aws", "finops"]
   externalRepo: "https://github.com/user/repo" # optional
   ---
   ```
3. Include usage, requirements, and script code in markdown

## Standard Tags

- Cloud providers: `aws`, `gcp`, `azure`, `multi-cloud`
- Topics: `kubernetes`, `docker`, `terraform`, `security`, `finops`, `observability`, `networking`
- Tools: `opentelemetry`, `grafana`, `prometheus`, `bash`, `python`

Keep tags lowercase and hyphenated.

