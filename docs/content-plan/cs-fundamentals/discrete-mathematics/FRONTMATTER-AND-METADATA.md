# Frontmatter and Metadata — Discrete Mathematics for Developers

## Frontmatter Template

Every post uses this exact YAML frontmatter structure:

```yaml
---
title: "{Topic}: {Developer-Angle Subtitle}"
description: "{SEO meta description, 150-160 chars, includes primary keyword}"
excerpt: "{1-2 sentences for blog listing cards}"
date: "YYYY-MM-DD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", ...topic-specific]
series: "Discrete Mathematics for Developers"
seriesPart: N
featured: false
draft: true
---
```

### Field Rules

| Field | Required | Rules |
|---|---|---|
| `title` | Yes | Format: `"{Topic}: {Subtitle}"`. Topic names the math concept. Subtitle connects to code. |
| `description` | Yes | 150-160 characters. Starts with verb or "Learn". Includes primary keyword. For SEO meta tag. |
| `excerpt` | Yes | 1-2 sentences for blog listing cards. Connects math to code. |
| `date` | Yes | ISO format `YYYY-MM-DD`. See scheduling section below. |
| `author` | Yes | Always `"works-on-my.cloud"` |
| `tags` | Yes | Array. See tag taxonomy below. Minimum 3, maximum 6. |
| `series` | Yes | Always exactly `"Discrete Mathematics for Developers"` |
| `seriesPart` | Yes | Integer 0-39. Part 0 is the series introduction. `seriesTotal` is auto-calculated from folder contents. |
| `featured` | No | Default `false`. |
| `draft` | No | Default `true` during development. Set `false` when published. |

## Tag Taxonomy

### Required Tags (every post)

Every DM series post includes these two tags:
- `discrete-math` — Series identifier
- `cs-fundamentals` — Track identifier

### Topic Tags

| Topic Area | Tag | Used in Parts |
|---|---|---|
| Logic | `logic` | 1, 2, 3, 7 |
| Proofs | `proofs` | 4, 5, 6 |
| Sets | `sets` | 8 |
| Functions | `functions` | 9 |
| Relations | `relations` | 10, 11, 12 |
| Induction | `induction` | 13, 14 |
| Recursion | `recursion` | 15, 16 |
| Algorithms | `algorithms` | 17, 18, 19 |
| Complexity | `complexity` | 18, 19 |
| Counting | `counting` | 20, 21 |
| Combinatorics | `combinatorics` | 21, 22, 23 |
| Number Theory | `number-theory` | 24, 25 |
| Cryptography | `cryptography` | 26 |
| Probability | `probability` | 27, 28, 29 |
| Graphs | `graphs` | 30, 31, 32, 33 |
| Trees | `trees` | 34, 35 |
| Boolean Algebra | `boolean-algebra` | 36, 37 |
| Automata | `automata` | 38 |
| Computation | `computation` | 39 |

### Tag Examples by Part

| Part | Tags |
|---|---|
| 0 | `["discrete-math", "cs-fundamentals"]` |
| 1 | `["discrete-math", "cs-fundamentals", "logic"]` |
| 4 | `["discrete-math", "cs-fundamentals", "proofs", "logic"]` |
| 9 | `["discrete-math", "cs-fundamentals", "functions", "sets"]` |
| 13 | `["discrete-math", "cs-fundamentals", "induction", "recursion"]` |
| 18 | `["discrete-math", "cs-fundamentals", "algorithms", "complexity"]` |
| 26 | `["discrete-math", "cs-fundamentals", "cryptography", "number-theory"]` |
| 30 | `["discrete-math", "cs-fundamentals", "graphs"]` |

## File Naming

### Convention

```
apps/web/src/content/blog/discrete-mathematics/{NN}-{kebab-case-slug}.mdx
```

- `NN` — Zero-padded two-digit part number (00-39)
- `kebab-case-slug` — Lowercase, hyphenated, descriptive

### Complete File List

| Part | Filename |
|:--:|---|
| 0 | `00-why-discrete-math.mdx` |
| 1 | `01-propositions-and-logic-gates.mdx` |
| 2 | `02-predicate-logic.mdx` |
| 3 | `03-rules-of-inference.mdx` |
| 4 | `04-proof-techniques-direct.mdx` |
| 5 | `05-proof-techniques-contradiction.mdx` |
| 6 | `06-proof-techniques-strategy.mdx` |
| 7 | `07-logic-in-practice.mdx` |
| 8 | `08-sets-and-set-operations.mdx` |
| 9 | `09-functions.mdx` |
| 10 | `10-relations-and-properties.mdx` |
| 11 | `11-equivalence-partial-orders.mdx` |
| 12 | `12-matrices-for-relations.mdx` |
| 13 | `13-mathematical-induction.mdx` |
| 14 | `14-strong-induction.mdx` |
| 15 | `15-recursive-definitions.mdx` |
| 16 | `16-recurrence-relations.mdx` |
| 17 | `17-algorithms-pseudocode.mdx` |
| 18 | `18-growth-of-functions.mdx` |
| 19 | `19-algorithm-complexity.mdx` |
| 20 | `20-basics-of-counting.mdx` |
| 21 | `21-permutations-combinations.mdx` |
| 22 | `22-inclusion-exclusion.mdx` |
| 23 | `23-generating-functions.mdx` |
| 24 | `24-modular-arithmetic.mdx` |
| 25 | `25-primes-gcd-euclidean.mdx` |
| 26 | `26-cryptography-rsa.mdx` |
| 27 | `27-probability-foundations.mdx` |
| 28 | `28-bayes-theorem.mdx` |
| 29 | `29-expected-value.mdx` |
| 30 | `30-graph-fundamentals.mdx` |
| 31 | `31-graph-representations.mdx` |
| 32 | `32-connectivity-traversal.mdx` |
| 33 | `33-shortest-paths-coloring.mdx` |
| 34 | `34-trees.mdx` |
| 35 | `35-spanning-trees.mdx` |
| 36 | `36-boolean-algebra.mdx` |
| 37 | `37-boolean-circuits.mdx` |
| 38 | `38-finite-automata.mdx` |
| 39 | `39-turing-machines.mdx` |

## Date Scheduling

- Series starts: **TBD** (after AWS series establishes publishing cadence)
- Cadence: approximately **5-7 days apart** (one part per week)
- Schedule is approximate; actual dates set when posts are ready

## SEO Guidelines

### Title Tag
- Same as frontmatter `title`
- Should include primary keyword (mathematical concept name)

### Meta Description
- Frontmatter `description` field
- 150-160 characters
- Starts with action verb or "Learn"
- Includes primary keyword naturally
- Mentions a concrete developer connection

### URL Structure
- All posts at `/blog/discrete-mathematics/{NN}-{slug}`
- Clean, descriptive slugs
- No dates in URLs

### Heading Structure
- H1: Post title (automatic from frontmatter)
- H2: Major sections (Why This Matters, content sections, Code Companion, The Formality Spectrum, Practice with Rosen, Key Takeaways)
- H3: Subsections within content
- Never skip heading levels

## Featured and Draft Conventions

| Convention | Value | When |
|---|---|---|
| `featured: false` | All parts | Default (no KEY parts designated yet) |
| `draft: true` | During development | Until post is ready for publication |
| `draft: false` | Published | Set when deploying |
