/**
 * Labs API Client
 *
 * Client for interacting with the SST backend API.
 * Handles fetching modules, exercises, and user progress.
 */

const API_BASE = import.meta.env.PUBLIC_LABS_API_URL || 'http://localhost:3000/api';

export interface ApiModule {
  id: string;
  title: string;
  description: string;
  order: number;
  icon?: string;
  prerequisites?: string[];
  estimatedTime?: string;
  exerciseCount: number;
  status: 'available' | 'coming-soon' | 'beta';
}

export interface ApiExercise {
  id: string;
  module: string;
  order: number;
  title: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
}

export interface ApiProgress {
  exerciseId: string;
  completedAt: string;
  attempts: number;
  verificationHash?: string;
}

export interface RecordProgressResult {
  success: boolean;
  exerciseId: string;
  completedAt: string;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(
      `API Error: ${response.status} ${response.statusText}`,
      response.status
    );
  }
  return response.json();
}

/**
 * Fetch all modules.
 * Note: In the actual API, modules are derived from exercises endpoint.
 */
export async function fetchModules(): Promise<ApiModule[]> {
  const response = await fetch(`${API_BASE}/exercises`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<ApiModule[]>(response);
}

/**
 * Fetch a single module by ID.
 */
export async function fetchModuleById(moduleId: string): Promise<ApiModule | null> {
  const response = await fetch(`${API_BASE}/modules/${moduleId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 404) {
    return null;
  }

  return handleResponse<ApiModule>(response);
}

/**
 * Fetch all exercises, optionally filtered by module.
 */
export async function fetchExercises(moduleId?: string): Promise<ApiExercise[]> {
  const url = new URL(`${API_BASE}/exercises`);
  if (moduleId) {
    url.searchParams.set('module', moduleId);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<ApiExercise[]>(response);
}

/**
 * Fetch a single exercise by ID.
 */
export async function fetchExerciseById(exerciseId: string): Promise<ApiExercise | null> {
  const response = await fetch(`${API_BASE}/exercises/${exerciseId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 404) {
    return null;
  }

  return handleResponse<ApiExercise>(response);
}

/**
 * Fetch user's progress (requires authentication).
 */
export async function fetchProgress(token: string): Promise<ApiProgress[]> {
  const response = await fetch(`${API_BASE}/progress`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<ApiProgress[]>(response);
}

/**
 * Record exercise completion (called after CLI verification).
 */
export async function recordProgress(
  token: string,
  exerciseId: string
): Promise<RecordProgressResult> {
  const response = await fetch(`${API_BASE}/exercises/${exerciseId}/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<RecordProgressResult>(response);
}

/**
 * Calculate completion percentage for a module.
 */
export function calculateModuleProgress(
  moduleId: string,
  exercises: ApiExercise[],
  progress: ApiProgress[]
): number {
  const moduleExercises = exercises.filter((e) => e.module === moduleId);
  if (moduleExercises.length === 0) return 0;

  const completedIds = new Set(progress.map((p) => p.exerciseId));
  const completedCount = moduleExercises.filter((e) => completedIds.has(e.id)).length;

  return Math.round((completedCount / moduleExercises.length) * 100);
}

/**
 * Check if an exercise is completed.
 */
export function isExerciseCompleted(
  exerciseId: string,
  progress: ApiProgress[]
): boolean {
  return progress.some((p) => p.exerciseId === exerciseId);
}

/**
 * Get the next incomplete exercise in a module.
 */
export function getNextExercise(
  moduleId: string,
  exercises: ApiExercise[],
  progress: ApiProgress[]
): ApiExercise | null {
  const moduleExercises = exercises
    .filter((e) => e.module === moduleId)
    .sort((a, b) => a.order - b.order);

  const completedIds = new Set(progress.map((p) => p.exerciseId));

  return moduleExercises.find((e) => !completedIds.has(e.id)) || null;
}
