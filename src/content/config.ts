import { defineCollection, z } from 'astro:content';

// Blog post collection schema
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// Guide index schema
const guideIndex = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  featured: z.boolean().default(false),
  parts: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
    })
  ),
});

// Guide part schema
const guidePart = z.object({
  title: z.string(),
  guide: z.string(),
  part: z.number(),
  date: z.string(),
  tags: z.array(z.string()),
});

// Guides collection (can be index or part)
const guides = defineCollection({
  type: 'content',
  schema: z.union([guideIndex, guidePart]),
});

// Scripts collection schema
const scripts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    language: z.string(),
    tags: z.array(z.string()),
    externalRepo: z.string().url().optional(),
  }),
});

export const collections = {
  blog,
  guides,
  scripts,
};

