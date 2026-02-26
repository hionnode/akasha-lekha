# Blog Writing Guide - works-on-my.cloud

## Overview

This blog supports two types of content:
1. **Standalone Posts** - Single, self-contained articles
2. **Multi-Part Series** - Related posts forming a cohesive guide

## File Structure

### Standalone Posts
Place standalone posts directly in the blog folder:

```
src/content/blog/
├── 2024-12-01-getting-started-with-kubernetes.md
├── 2024-12-05-aws-cost-optimization.md
└── 2024-12-10-terraform-best-practices.md
```

### Multi-Part Series
**Organize series in dedicated folders for better code navigation:**

```
src/content/blog/
├── eks-deep-dive/                    # Series folder (matches series slug)
│   ├── 01-introduction.md           # Part 1
│   ├── 02-setup.md                  # Part 2
│   ├── 03-networking.md             # Part 3
│   ├── 04-security.md               # Part 4
│   └── 05-scaling.md                # Part 5
├── terraform-mastery/               # Another series
│   ├── 01-basics.md
│   ├── 02-modules.md
│   └── 03-state-management.md
└── 2024-12-01-standalone-post.md    # Standalone posts in root
```

**Benefits:**
- ✅ Easy navigation in IDE/editor
- ✅ Clear organization of related content
- ✅ Series content stays together
- ✅ Cleaner URLs: `/blog/eks-deep-dive/01-introduction`

## Naming Convention

### Standalone Posts
```
YYYY-MM-DD-descriptive-slug.md
```

### Multi-Part Series Files
```
series-folder-name/
  NN-part-title.md
```

Where:
- `series-folder-name` matches the `series` slug in frontmatter
- `NN` is the zero-padded part number (01, 02, 03, etc.)
- `part-title` is a short, descriptive title

**Examples:**
- `eks-deep-dive/01-introduction.md`
- `eks-deep-dive/02-setup.md`
- `terraform-mastery/01-basics.md`

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
series: "series-name"              # Unique identifier (must match folder name)
seriesPart: 1                      # Part number (1, 2, 3, etc.)
---
```

**Note:** `seriesTotal` is **automatically calculated** by counting all posts in the series. You don't need to manually maintain it! When you add Part 6, all parts will automatically show "Part X of 6".

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

**Basic Code Block:**
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

**Enhanced: Code Block with File Title:**
````markdown
\`\`\`typescript title="sst.config.ts"
export default $config({
  app(input) {
    return { name: "my-app" };
  }
});
\`\`\`
````

This will display the filename in a header above the code block with a file icon.

**Enhanced: Terminal Window Styling:**
````markdown
\`\`\`bash terminal
aws sso login --sso-session=acme
\`\`\`
````

This will display a terminal window with macOS-style controls (red/yellow/green dots) and a "Terminal" label.

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

Use horizontal rules to create visual breaks between major sections:

```markdown
---
```

This will render as a subtle gradient line with extra spacing.

#### Callout Boxes

Use callout boxes to highlight important information, tips, warnings, and notes:

**Tip (Blue/Cyan):**
```markdown
:::tip
This is a helpful tip or best practice!
:::
```

**Note (Yellow/Amber):**
```markdown
:::note
This is important information to remember.
:::
```

**Info (Blue):**
```markdown
:::info
Additional contextual information.
:::
```

**Warning (Orange):**
```markdown
:::warning
Be careful! This is a critical warning.
:::
```

**Caution (Red):**
```markdown
:::caution
This could cause problems if not handled correctly.
:::
```

**When to use each type:**
- **:::tip** - Best practices, helpful suggestions, optimizations
- **:::note** - Important information, things to remember
- **:::info** - Additional context, background information
- **:::warning** - Potential cost implications, breaking changes, important caveats
- **:::caution** - Things that could cause data loss, security issues, or system failures

#### Collapsible Sections

Use collapsible sections for optional content, advanced topics, or long examples:

```markdown
<details>
<summary>View advanced configuration</summary>

Your content here can include:
- Markdown formatting
- Code blocks
- Lists
- Images

\`\`\`yaml
advanced:
  config: value
\`\`\`

</details>
```

**Best practices:**
- Use clear, descriptive summary text
- Keep the main content accessible; don't hide essential information
- Great for: advanced examples, detailed specs, optional steps, troubleshooting guides

#### Steps Component

Use the steps component for step-by-step instructions, tutorials, or setup guides:

```markdown
:::steps
1. Create a new Amplify Hosting project
2. Connect your repository to Amplify
3. Modify your build settings to match your project's build process
4. Deploy and verify your application
:::
```

**Features:**
- Automatically numbered steps with visual indicators
- Connector lines between steps for clear progression
- Responsive design that works on all screen sizes
- Accessible with proper ARIA roles

**Best practices:**
- Use for sequential instructions (setup guides, tutorials, workflows)
- Keep each step concise and actionable
- Steps can contain markdown formatting (bold, code, links)
- Great for: installation guides, configuration steps, deployment processes

#### Package Manager Switcher

Use the package manager switcher to show installation commands for different package managers:

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

**Supported Package Managers:**
- `npm` - Node Package Manager
- `pnpm` - Fast, disk space efficient package manager
- `yarn` - Yarn package manager
- `bun` - Bun runtime and package manager
- `deno` - Deno runtime

**Syntax:**
- Use language tag format: `bash npm`, `bash pnpm`, `bash yarn`, etc.
- The package manager name must be included in the language tag
- Each code block will be grouped by its package manager
- Users can switch between package managers using the tab interface

**Features:**
- Tab-style switcher with package manager icons
- Remembers user preference in localStorage
- Smooth transitions between code blocks
- Automatically detects available package managers from code blocks

**Best practices:**
- Include at least 2-3 package managers for flexibility
- Use consistent command format across all managers
- Great for: installation instructions, dependency management guides, getting started tutorials

**Example with multiple commands:**
````markdown
:::package-manager
```bash npm
npm install package-name
npm run dev
```

```bash pnpm
pnpm add package-name
pnpm dev
```

```bash yarn
yarn add package-name
yarn dev
```
:::
````

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

In series posts, reference other parts using the folder-based URLs:

```markdown
## Prerequisites

Before starting, make sure you've completed [Part 1: Introduction](/blog/eks-deep-dive/01-introduction).

## What's Next

In [Part 3: Networking](/blog/eks-deep-dive/03-networking), we'll explore VPC configurations.
```

**Note:** URLs now include the series folder name: `/blog/series-name/NN-part-title`

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
- [ ] File titles added to code blocks where helpful (`title="filename.ts"`)
- [ ] Terminal commands use `terminal` flag where appropriate
- [ ] All links work (internal and external)
- [ ] Images have alt text
- [ ] Series metadata correct (if series post)
- [ ] Cross-links to related posts included
- [ ] Grammar and spelling checked
- [ ] Code examples tested
- [ ] Callout boxes used for tips, warnings, notes
- [ ] Collapsible sections used for optional/advanced content
- [ ] Horizontal rules used to separate major sections

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

## Example: Series Post (Folder Structure)

**File:** `src/content/blog/eks-deep-dive/01-introduction.md`

```markdown
---
title: "EKS Deep Dive Series Part 1: Introduction to Amazon EKS"
date: "2025-01-01"
excerpt: "Begin your journey into Amazon EKS with this comprehensive introduction covering architecture, core concepts, and when to use EKS over self-managed Kubernetes."
tags: ["eks", "kubernetes", "aws", "cloud", "devops"]
featured: true
draft: false
series: "eks-deep-dive"              # Must match folder name
seriesPart: 1                        # No need for seriesTotal!
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

In [Part 2: Setup](/blog/eks-deep-dive/02-setup), we'll create our first EKS cluster...
```

### Adding a New Part to an Existing Series

Simply create a new file in the series folder with the next part number:

```bash
# Add Part 6 to the EKS series
touch src/content/blog/eks-deep-dive/06-monitoring.md
```

```yaml
---
title: "EKS Deep Dive Series Part 6: Monitoring and Observability"
date: "2025-01-06"
excerpt: "..."
tags: ["eks", "monitoring", "observability"]
featured: true
draft: false
series: "eks-deep-dive"    # Same series name
seriesPart: 6              # Just increment the number!
---
```

**That's it!** All existing parts (1-5) will automatically show "Part X of 6" without any changes needed!

## Troubleshooting

### Post Not Showing Up

1. Check `draft: false` in frontmatter
2. Verify date format is `YYYY-MM-DD`
3. Ensure file is in `/src/content/blog/`
4. Check for YAML syntax errors

### Series Navigation Not Working

1. Verify `series` slug matches folder name exactly
2. Confirm `seriesPart` numbers are sequential (1, 2, 3, etc.)
3. ~~Check `seriesTotal` is correct~~ No longer needed - auto-calculated!

### Images Not Loading

1. Confirm image is in `/public/images/blog/`
2. Use absolute path: `/images/blog/filename.png`
3. Check file extension case (`.png` not `.PNG`)

---

**Happy writing! May your posts be ever insightful and your code blocks ever syntax-highlighted.** 🚀


