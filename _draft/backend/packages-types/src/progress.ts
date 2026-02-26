export interface Progress {
  exerciseId: string;
  completedAt: string;
  attempts: number;
  verificationHash?: string;
}

export interface UserProgress {
  userId: string;
  exerciseId: string;
  completedAt: string;
  attempts: number;
  verificationHash?: string;
  updatedAt: string;
}

export interface ModuleProgress {
  moduleId: string;
  completed: number;
  total: number;
  percentage: number;
}
