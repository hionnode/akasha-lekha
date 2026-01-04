# Content Directory

This directory contains all content for the site, organized into collections:

- `blog/` - Blog posts (MDX format)
- `guides/` - Multi-part guides
- `scripts/` - Code library scripts

## Creating Content

### Blog Post

Blog posts use **MDX** format, which allows you to use Astro components directly within your markdown content.

#### 1. Create a New File

Create a new file: `blog/YYYY-MM-DD-slug.mdx`

**Example:** `blog/2025-01-15-my-awesome-post.mdx`

#### 2. Add Required Frontmatter

```yaml
---
title: "Your Post Title"
date: "2025-01-15"
excerpt: "A brief description of the post"
tags: ["tag1", "tag2"]
featured: false
draft: false
---
```

**Optional fields for series posts:**
```yaml
series: "Series Name"
seriesPart: 1
seriesTotal: 3
```

#### 3. MDX Features

##### Basic MDX Syntax

- **Standard markdown still works** - All markdown syntax (headings, lists, links, images, etc.) works as expected
- **JSX expressions** - Use `{variable}` for dynamic content
- **Component usage** - Use `<Component prop="value" />` to embed Astro components

##### Importing Components

Import components at the top of your file, right after the frontmatter:

```mdx
---
title: "My Post"
date: "2025-01-15"
excerpt: "Description"
tags: ["tag1", "tag2"]
featured: false
draft: false
---

import Button from '../../components/shared/Button.astro';
import TagPill from '../../components/blog/TagPill.astro';
import Badge from '../../components/shared/Badge.astro';

# My Post Title

You can use components directly:

<Button href="/blog" variant="primary">Back to Blog</Button>
```

##### Using Available Components

- **`<Button>`** - Navigation buttons with variants (`primary`, `secondary`)
- **`<TagPill>`** - Tag displays for categorizing content
- **`<PostCard>`** - Post preview cards
- **`<Badge>`** - Status indicators and labels
- **`<CodeSwitcher>`** - Code block switchers (also available via markdown directives)
- **Code-Focused Components** - See [Part 4 of MDX Mastery series](/blog/mdx-mastery-series/04-code-focused-components) for:
  - `<PanelSwitcher>` / `<Panel>` - Tabbed content switching
  - `<FileTree>` - File/directory structure display
  - `<DiffViewer>` / `<DiffBlock>` - Code diff comparison
  - `<CommandReference>` / `<Command>` - CLI command documentation
  - `<ApiEndpoint>` / `<ResponseExample>` - API documentation
  - `<ComparisonTable>` / `<ComparisonHeader>` / `<ComparisonRow>` - Feature comparison tables
  - `<K8sManifest>` - Kubernetes manifest viewer
  - `<TerminalOutput>` - Enhanced terminal output with search
  - `<ResourceStatus>` - Kubernetes resource status indicators
  - `<CommandSequence>` / `<Step>` - Multi-step command workflows
  - `<EnvVars>` / `<EnvVar>` - Environment variable documentation
  - `<ServiceMapping>` / `<Service>` / `<Ingress>` - Port/service mapping
- Any other shared components from `src/components/shared/` or `src/components/blog/`

##### JSX Expressions

Use JSX expressions for dynamic content:

```mdx
---
title: "Dynamic Post"
date: "2025-01-15"
---
# {frontmatter.title}

Published on {new Date(frontmatter.date).toLocaleDateString()}

{frontmatter.featured && <Badge variant="featured">Featured Post</Badge>}
```

**Common JSX patterns:**
- Dynamic dates: `{new Date(frontmatter.date).toLocaleDateString()}`
- Conditional rendering: `{condition && <Component />}`
- Calculations: `Reading time: {Math.ceil(wordCount / 200)} minutes`

##### Combining with Existing Features

All existing markdown directives and plugins continue to work alongside MDX:

- **Callout boxes**: `:::tip`, `:::note`, `:::warning`, `:::caution`, `:::info`
- **Code switchers**: `:::code-switcher` with multiple code blocks
- **Steps component**: `:::steps` for step-by-step instructions
- **Code metadata**: `title="filename.ts"`, `terminal` flag
- **Mix markdown directives with MDX components** - Use both in the same post!

**Example combining markdown and MDX:**

```mdx
---
title: "Advanced Kubernetes Setup"
date: "2025-01-15"
excerpt: "Learn advanced Kubernetes patterns"
tags: ["kubernetes", "devops", "cloud"]
featured: true
draft: false
---

import Button from '../../components/shared/Button.astro';

# {frontmatter.title}

This post demonstrates MDX capabilities.

:::tip
You can still use markdown directives!
:::

<Button href="/blog" variant="secondary">
  View All Posts
</Button>

```yaml title="deployment.yaml"
apiVersion: apps/v1
kind: Deployment
```
```

##### Best Practices

1. **Use components for interactive elements** - Buttons, navigation, interactive widgets
2. **Use markdown directives for content structure** - Callouts, steps, code switchers
3. **Import components at the top** - Right after frontmatter, before content
4. **Keep component usage semantic and accessible** - Use proper HTML semantics
5. **Test components work in both dev and build modes** - Some components may behave differently

#### 4. Complete Example Post

```mdx
---
title: "Getting Started with Kubernetes"
date: "2025-01-15"
excerpt: "A beginner-friendly introduction to Kubernetes"
tags: ["kubernetes", "docker", "cloud"]
featured: true
draft: false
---

import Button from '../../components/shared/Button.astro';
import TagPill from '../../components/blog/TagPill.astro';

# {frontmatter.title}

Published on {new Date(frontmatter.date).toLocaleDateString()}

## Introduction

Kubernetes has become the de facto standard for container orchestration.

:::tip
This is a tip callout using markdown directives!
:::

## What is Kubernetes?

Kubernetes (often abbreviated as K8s) is an open-source container orchestration platform.

### Key Concepts

- **Pods**: The smallest deployable unit
- **Services**: Stable network endpoints
- **Deployments**: Manage replica sets

## Your First Deployment

Let's deploy a simple nginx application:

```yaml title="deployment.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
```

## Next Steps

<Button href="/blog" variant="primary">
  Explore More Posts
</Button>

:::note
You can combine markdown directives with MDX components seamlessly!
:::
```

### Guide

1. Create a directory: `guides/guide-slug/`
2. Create `index.mdx` with guide overview:
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
3. Create part files: `part-1-basics.mdx`, `part-2-advanced.mdx`, etc.
4. Each part needs:
   ```yaml
   ---
   title: "Part 1: Basics"
   guide: "guide-slug"
   part: 1
   date: "2025-01-15"
   tags: ["tag1", "tag2"]
   ---
   ```

### Script

1. Create a file: `scripts/script-slug.mdx`
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
3. Include usage, requirements, and script code in markdown/MDX

## Standard Tags

- Cloud providers: `aws`, `gcp`, `azure`, `multi-cloud`
- Topics: `kubernetes`, `docker`, `terraform`, `security`, `finops`, `observability`, `networking`
- Tools: `opentelemetry`, `grafana`, `prometheus`, `bash`, `python`
- Content types: `mdx`, `astro`, `components`, `tutorial`

Keep tags lowercase and hyphenated.

## MDX Resources

- [Astro MDX Documentation](https://docs.astro.build/en/guides/integrations-guide/mdx/)
- [MDX Guide](https://mdxjs.com/)
- Check sample posts in `blog/` for examples of MDX usage
