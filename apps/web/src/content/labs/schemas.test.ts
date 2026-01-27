import { describe, it, expect } from 'vitest';
import { labsModuleSchema, labsExerciseSchema } from './schemas';

describe('labsModuleSchema', () => {
  const validModule = {
    id: 'linux',
    title: 'Linux Fundamentals',
    description: 'Master essential Linux skills for infrastructure work.',
    order: 1,
    icon: '🐧',
    prerequisites: [],
    estimatedTime: '2-3 hours',
    exerciseCount: 5,
    status: 'available' as const,
  };

  it('should validate a complete valid module', () => {
    const result = labsModuleSchema.safeParse(validModule);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('linux');
      expect(result.data.title).toBe('Linux Fundamentals');
    }
  });

  it('should require id field', () => {
    const { id, ...moduleWithoutId } = validModule;
    const result = labsModuleSchema.safeParse(moduleWithoutId);
    expect(result.success).toBe(false);
  });

  it('should require title field', () => {
    const { title, ...moduleWithoutTitle } = validModule;
    const result = labsModuleSchema.safeParse(moduleWithoutTitle);
    expect(result.success).toBe(false);
  });

  it('should require description field', () => {
    const { description, ...moduleWithoutDesc } = validModule;
    const result = labsModuleSchema.safeParse(moduleWithoutDesc);
    expect(result.success).toBe(false);
  });

  it('should require order as a number', () => {
    const result = labsModuleSchema.safeParse({
      ...validModule,
      order: 'first',
    });
    expect(result.success).toBe(false);
  });

  it('should allow optional icon field', () => {
    const { icon, ...moduleWithoutIcon } = validModule;
    const result = labsModuleSchema.safeParse(moduleWithoutIcon);
    expect(result.success).toBe(true);
  });

  it('should default status to available', () => {
    const { status, ...moduleWithoutStatus } = validModule;
    const result = labsModuleSchema.safeParse(moduleWithoutStatus);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe('available');
    }
  });

  it('should validate status enum values', () => {
    const validStatuses = ['available', 'coming-soon', 'beta'];
    for (const status of validStatuses) {
      const result = labsModuleSchema.safeParse({ ...validModule, status });
      expect(result.success).toBe(true);
    }

    const result = labsModuleSchema.safeParse({
      ...validModule,
      status: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('should validate prerequisites as array of strings', () => {
    const result = labsModuleSchema.safeParse({
      ...validModule,
      prerequisites: ['networking', 'docker'],
    });
    expect(result.success).toBe(true);
  });

  it('should allow optional prerequisites field', () => {
    const { prerequisites, ...moduleWithoutPrereqs } = validModule;
    const result = labsModuleSchema.safeParse(moduleWithoutPrereqs);
    expect(result.success).toBe(true);
  });
});

describe('labsExerciseSchema', () => {
  const validExercise = {
    id: 'linux-03',
    module: 'linux',
    order: 3,
    title: 'Create a systemd Service',
    description: 'Learn how to create and manage a systemd service unit.',
    difficulty: 'beginner' as const,
    estimatedTime: '15m',
    objectives: [
      'Understand systemd service unit files',
      'Create a custom service unit',
    ],
    verificationCriteria: [
      'Unit file exists at /etc/systemd/system/myapp.service',
      'Service is enabled',
    ],
    hints: ['Start by creating a file at /etc/systemd/system/myapp.service'],
    cliCommand: 'infra-learn launch linux-03',
  };

  it('should validate a complete valid exercise', () => {
    const result = labsExerciseSchema.safeParse(validExercise);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('linux-03');
      expect(result.data.module).toBe('linux');
    }
  });

  it('should require id field', () => {
    const { id, ...exerciseWithoutId } = validExercise;
    const result = labsExerciseSchema.safeParse(exerciseWithoutId);
    expect(result.success).toBe(false);
  });

  it('should require module field', () => {
    const { module, ...exerciseWithoutModule } = validExercise;
    const result = labsExerciseSchema.safeParse(exerciseWithoutModule);
    expect(result.success).toBe(false);
  });

  it('should require order as a number', () => {
    const result = labsExerciseSchema.safeParse({
      ...validExercise,
      order: 'third',
    });
    expect(result.success).toBe(false);
  });

  it('should validate difficulty enum values', () => {
    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    for (const difficulty of validDifficulties) {
      const result = labsExerciseSchema.safeParse({
        ...validExercise,
        difficulty,
      });
      expect(result.success).toBe(true);
    }

    const result = labsExerciseSchema.safeParse({
      ...validExercise,
      difficulty: 'expert',
    });
    expect(result.success).toBe(false);
  });

  it('should require objectives as non-empty array', () => {
    const result = labsExerciseSchema.safeParse({
      ...validExercise,
      objectives: [],
    });
    expect(result.success).toBe(false);
  });

  it('should require verificationCriteria as non-empty array', () => {
    const result = labsExerciseSchema.safeParse({
      ...validExercise,
      verificationCriteria: [],
    });
    expect(result.success).toBe(false);
  });

  it('should allow optional hints field', () => {
    const { hints, ...exerciseWithoutHints } = validExercise;
    const result = labsExerciseSchema.safeParse(exerciseWithoutHints);
    expect(result.success).toBe(true);
  });

  it('should require cliCommand field', () => {
    const { cliCommand, ...exerciseWithoutCmd } = validExercise;
    const result = labsExerciseSchema.safeParse(exerciseWithoutCmd);
    expect(result.success).toBe(false);
  });

  it('should validate cliCommand starts with infra-learn', () => {
    const result = labsExerciseSchema.safeParse({
      ...validExercise,
      cliCommand: 'docker run exercise',
    });
    expect(result.success).toBe(false);
  });
});
