import { z } from 'zod';

/**
 * Schema for labs module content collection
 * Modules are learning tracks (e.g., Linux Fundamentals, Networking, etc.)
 */
export const labsModuleSchema = z.object({
  // Unique identifier for the module (e.g., 'linux', 'networking')
  id: z.string().min(1),

  // Display title
  title: z.string().min(1),

  // Module description (shown on cards and module page)
  description: z.string().min(1),

  // Order in the learning path (1 = first module)
  order: z.number().int().positive(),

  // Optional emoji or icon name
  icon: z.string().optional(),

  // List of module IDs that should be completed first
  prerequisites: z.array(z.string()).optional(),

  // Human-readable time estimate (e.g., "2-3 hours")
  estimatedTime: z.string().min(1),

  // Number of exercises in this module
  exerciseCount: z.number().int().nonnegative(),

  // Module availability status
  status: z.enum(['available', 'coming-soon', 'beta']).default('available'),
});

/**
 * Schema for labs exercise content collection
 * Exercises are individual hands-on tasks within a module
 */
export const labsExerciseSchema = z.object({
  // Unique identifier (e.g., 'linux-03')
  id: z.string().min(1),

  // Parent module ID
  module: z.string().min(1),

  // Order within the module
  order: z.number().int().positive(),

  // Exercise title
  title: z.string().min(1),

  // Brief description of the exercise
  description: z.string().min(1),

  // Difficulty level
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),

  // Time estimate (e.g., "15m", "30m", "1h")
  estimatedTime: z.string().min(1),

  // Learning objectives (what the user will learn)
  objectives: z.array(z.string()).min(1),

  // What the verification script will check
  verificationCriteria: z.array(z.string()).min(1),

  // Optional progressive hints
  hints: z.array(z.string()).optional(),

  // CLI command to launch the exercise (must start with 'infra-learn')
  cliCommand: z.string().startsWith('infra-learn'),
});

// TypeScript types inferred from schemas
export type LabsModule = z.infer<typeof labsModuleSchema>;
export type LabsExercise = z.infer<typeof labsExerciseSchema>;
