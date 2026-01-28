import type { User } from './user';
import type { Progress } from './progress';
import type { Exercise, Module } from './exercise';

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface AuthTokenResponse {
  token: string;
  user: User;
}

export interface AuthVerifyResponse {
  valid: boolean;
  user: User | null;
}

export interface ExercisesListResponse {
  exercises: Exercise[];
}

export interface ModulesListResponse {
  modules: Module[];
}

export interface ProgressResponse {
  progress: Progress[];
}

export interface RecordProgressRequest {
  verificationHash?: string;
}

export interface RecordProgressResponse {
  success: boolean;
  exerciseId: string;
  completedAt: string;
  attempts: number;
}

// API Error codes
export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'BAD_REQUEST'
  | 'INTERNAL_ERROR'
  | 'RATE_LIMITED';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, unknown>;
}
