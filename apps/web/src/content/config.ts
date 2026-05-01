import { defineCollection, z } from 'astro:content';

// NOTE: schemas are duplicated in ./labs/schemas.ts (Zod 4) for tests.
// Astro bundles Zod 3 and defineCollection won't accept a Zod 4 schema.
// Keep both shapes in sync; ./labs/schemas.ts is the spec, this file is the wiring.

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    excerpt: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    series: z.string().optional(),
    seriesPart: z.number().optional(),
    seriesTotal: z.number().optional(),
  }),
});

const labsModules = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    order: z.number().int().positive(),
    icon: z.string().optional(),
    prerequisites: z.array(z.string()).optional(),
    estimatedTime: z.string().min(1),
    exerciseCount: z.number().int().nonnegative(),
    status: z.enum(['available', 'coming-soon', 'beta']).default('available'),
  }),
});

const labsExercises = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().min(1),
    module: z.string().min(1),
    order: z.number().int().positive(),
    title: z.string().min(1),
    description: z.string().min(1),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    estimatedTime: z.string().min(1),
    objectives: z.array(z.string()).min(1),
    verificationCriteria: z.array(z.string()).min(1),
    hints: z.array(z.string()).optional(),
    cliCommand: z.string().startsWith('infra-learn'),
  }),
});

export const collections = {
  blog,
  'labs/modules': labsModules,
  'labs/exercises': labsExercises,
};
