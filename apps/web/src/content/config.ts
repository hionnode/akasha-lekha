import { defineCollection, z } from 'astro:content';
import { labsModuleSchema, labsExerciseSchema } from './labs/schemas';

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
  schema: labsModuleSchema,
});

const labsExercises = defineCollection({
  type: 'content',
  schema: labsExerciseSchema,
});

export const collections = {
  blog,
  'labs/modules': labsModules,
  'labs/exercises': labsExercises,
};
