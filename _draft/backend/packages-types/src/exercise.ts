export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ModuleStatus = 'available' | 'coming-soon' | 'beta';

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  icon?: string;
  prerequisites?: string[];
  estimatedTime?: string;
  exerciseCount: number;
  status: ModuleStatus;
}

export interface Exercise {
  id: string;
  module: string;
  order: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedTime: string;
  objectives: string[];
  verificationCriteria: string[];
  hints?: string[];
  cliCommand: string;
}

export interface ExerciseManifest {
  id: string;
  module: string;
  order: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedTime: string;
  backend: 'vm' | 'container';
  containerImage?: string;
  setup?: {
    source: string;
    dest: string;
  }[];
  verify: VerificationCheck[];
  hints?: string[];
}

export interface VerificationCheck {
  name: string;
  cmd: string;
  expect?: string;
  expectContains?: string;
}
