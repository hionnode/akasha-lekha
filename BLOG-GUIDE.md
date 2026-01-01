# Blog Writing Guide - works-on-my.cloud

## Overview

This blog supports two types of content:
1. **Standalone Posts** - Single, self-contained articles
2. **Multi-Part Series** - Related posts forming a cohesive guide

## File Structure

```
src/content/blog/
├── 2025-01-01-standalone-post.md          # Single post
├── 2025-01-01-series-01-intro.md          # Series: Part 1
├── 2025-01-02-series-02-setup.md          # Series: Part 2
└── 2025-01-03-series-03-advanced.md       # Series: Part 3
```

## Naming Convention

### Standalone Posts
```
YYYY-MM-DD-descriptive-slug.md
```

### Multi-Part Series
```
YYYY-MM-DD-series-name-NN-part-title.md
```

Where `NN` is the zero-padded part number (01, 02, etc.)

## Frontmatter Schema

### Standalone Post

```yaml
---
title: "Your Post Title"
date: "2025-01-01"
excerpt: "Brief description (150-200 characters) for cards and SEO"
tags: ["tag1", "tag2", "tag3"]
featured: false                    # Set to true for homepage featured section
draft: false                       # Set to true to hide from production
---
```

### Multi-Part Series Post

```yaml
---
title: "Series Name Part 1: Introduction"
date: "2025-01-01"
excerpt: "Brief description of this specific part"
tags: ["tag1", "tag2", "tag3"]
featured: true                     # Often true for series
draft: false
series: "series-name"              # Unique identifier for the series
seriesPart: 1                      # Part number (1, 2, 3, etc.)
seriesTotal: 5                     # Total number of parts in series
---
```

## Content Guidelines

### Markdown Features

#### Headings
```markdown
## Main Section (H2)
### Subsection (H3)
#### Detail Level (H4)
```

- Use H2 for main sections
- H3 for subsections
- H4 for details
- Avoid H1 (reserved for post title)

#### Code Blocks

```markdown
\`\`\`bash
# Bash commands
kubectl get pods
\`\`\`

\`\`\`yaml
# YAML configuration
apiVersion: v1
kind: Pod
\`\`\`

\`\`\`python
# Python code
def hello_world():
    print("Hello!")
\`\`\`
```

Supported languages: `bash`, `yaml`, `json`, `javascript`, `typescript`, `python`, `go`, `rust`, `java`, `sql`

#### Lists

```markdown
- Unordered list item
- Another item
  - Nested item

1. Ordered list
2. Second item
   1. Nested ordered
```

#### Emphasis

```markdown
**Bold text** for emphasis
*Italic text* for subtle emphasis
`inline code` for commands and code
```

#### Links

```markdown
<!-- External links -->
[Link text](https://example.com)

<!-- Internal cross-links to other posts -->
[See Part 1](/blog/2025-01-01-series-01-intro)
[Related post about Docker](/blog/2024-12-20-docker-security)

<!-- Anchor links within post -->
[Jump to section](#section-heading)
```

#### Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data     | More     |
| Row 2    | Data     | More     |
```

#### Blockquotes

```markdown
> Important note or callout
> Can span multiple lines
```

#### Horizontal Rules

```markdown
---
```

### Images

Place images in `/public/images/blog/`:

```markdown
![Alt text description](/images/blog/my-diagram.png)
```

For diagrams and visualizations:
- Use ASCII art for simple diagrams (renders well in terminal theme)
- Use images for complex architecture diagrams
- Keep images under 200KB
- Use descriptive alt text for accessibility

#### ASCII Diagrams Example

```markdown
┌─────────────────────────────────────┐
│         Application Layer           │
│  ┌──────────┐      ┌──────────┐   │
│  │ Service  │─────▶│ Database │   │
│  └──────────┘      └──────────┘   │
└─────────────────────────────────────┘
```

## Writing Style

### Terminal-Themed Voice

This blog has a terminal/hacker aesthetic. Write accordingly:

✅ **Good Examples:**
```markdown
Let's dive into the config...
Here's what the output looks like:
Run this command to verify:
The logs will show:
```

❌ **Avoid:**
```markdown
Please navigate to...
You may want to consider...
It is recommended that...
```

### Technical Depth

- **Assume competence**: Readers are developers/DevOps engineers
- **Be practical**: Include working examples
- **Be precise**: Specific commands, exact outputs
- **Be comprehensive**: Cover edge cases and troubleshooting

### Code Examples

#### Command Examples
```bash
# Show context and expected output
kubectl get pods --all-namespaces

# Output:
NAMESPACE     NAME                          READY   STATUS
kube-system   coredns-5644d7b6d9-abcde     1/1     Running
```

#### Configuration Examples
```yaml
# Always include comments explaining key fields
apiVersion: v1
kind: Pod
metadata:
  name: my-app        # Descriptive name
  namespace: default  # Target namespace
spec:
  containers:
  - name: app
    image: nginx:1.24 # Use specific versions
```

## Multi-Part Series Guidelines

### Series Planning

1. **Define scope**: What will the series cover?
2. **Break down logically**: Each part should be 10-20 min read
3. **Build progressively**: Each part builds on previous
4. **Stay consistent**: Tone, depth, format

### Series Structure

#### Part 1: Introduction
- Overview of entire series
- What readers will learn
- Prerequisites
- Why this topic matters

#### Middle Parts: Deep Dives
- Focus on one major topic per part
- Practical examples
- Hands-on exercises
- Troubleshooting

#### Final Part: Advanced/Wrap-up
- Advanced topics
- Best practices
- Common pitfalls
- Resources for further learning

### Cross-Linking

In series posts, reference other parts:

```markdown
## Prerequisites

Before starting, make sure you've completed [Part 1: Introduction](/blog/2025-01-01-series-01-intro).

## What's Next

In [Part 3](/blog/2025-01-03-series-03-advanced), we'll explore advanced configurations.
```

## SEO Best Practices

### Excerpt Writing
- 150-200 characters
- Include main keyword
- Be descriptive yet concise
- End with period (no ellipsis)

### Tag Selection
- 3-6 tags per post
- Use lowercase
- Be specific: "eks" not "kubernetes-eks"
- Reuse existing tags when possible
- Common tags: aws, kubernetes, docker, devops, security, networking

### Title Optimization
- Keep under 60 characters when possible
- Front-load important keywords
- Be descriptive, not cute
- For series: Include "Part N:" prefix

## Post Checklist

Before publishing, verify:

- [ ] Frontmatter is complete and valid
- [ ] Title is clear and descriptive
- [ ] Excerpt is 150-200 characters
- [ ] 3-6 relevant tags included
- [ ] All code blocks have language specified
- [ ] All links work (internal and external)
- [ ] Images have alt text
- [ ] Series metadata correct (if series post)
- [ ] Cross-links to related posts included
- [ ] Grammar and spelling checked
- [ ] Code examples tested

## Example: Standalone Post

```markdown
---
title: "Docker Security Best Practices"
date: "2024-12-20"
excerpt: "Essential security practices for Docker containers, including image scanning, least privilege principles, and runtime security."
tags: ["docker", "security", "containers", "devops"]
featured: false
draft: false
---

## Introduction

Container security starts with good practices...

## Image Security

### Base Image Selection

Choose minimal base images:

\`\`\`dockerfile
# Good: Alpine-based
FROM node:18-alpine

# Avoid: Full distributions
FROM node:18
\`\`\`

[More on containers](/blog/2024-12-01-getting-started-with-kubernetes)
```

## Example: Series Post

```markdown
---
title: "EKS Deep Dive Series Part 1: Introduction to Amazon EKS"
date: "2025-01-01"
excerpt: "Begin your journey into Amazon EKS with this comprehensive introduction covering architecture, core concepts, and when to use EKS over self-managed Kubernetes."
tags: ["eks", "kubernetes", "aws", "cloud", "devops"]
featured: true
draft: false
series: "eks-deep-dive"
seriesPart: 1
seriesTotal: 5
---

## Welcome to the EKS Deep Dive Series

Over the next 5 posts, we'll cover...

## What You'll Learn in This Series

1. **Part 1 (This Post)**: EKS Architecture & Fundamentals
2. **Part 2**: Setting Up Your First EKS Cluster
3. **Part 3**: Networking in EKS
4. **Part 4**: Security Best Practices
5. **Part 5**: Scaling and Performance Optimization

## What's Next?

In [Part 2](/blog/2025-01-02-eks-series-02-setup), we'll create our first EKS cluster...
```

## Troubleshooting

### Post Not Showing Up

1. Check `draft: false` in frontmatter
2. Verify date format is `YYYY-MM-DD`
3. Ensure file is in `/src/content/blog/`
4. Check for YAML syntax errors

### Series Navigation Not Working

1. Verify `series` slug matches across all parts
2. Confirm `seriesPart` numbers are sequential
3. Check `seriesTotal` is correct

### Images Not Loading

1. Confirm image is in `/public/images/blog/`
2. Use absolute path: `/images/blog/filename.png`
3. Check file extension case (`.png` not `.PNG`)

---

**Happy writing! May your posts be ever insightful and your code blocks ever syntax-highlighted.** 🚀

