import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchModules,
  fetchExercises,
  fetchProgress,
  fetchModuleById,
  fetchExerciseById,
  recordProgress,
  type ApiModule,
  type ApiExercise,
  type ApiProgress,
} from './api';

// Mock data
const mockModules: ApiModule[] = [
  {
    id: 'linux',
    title: 'Linux Fundamentals',
    description: 'Learn Linux basics',
    order: 1,
    exerciseCount: 3,
    status: 'available',
  },
  {
    id: 'networking',
    title: 'Networking Basics',
    description: 'Learn networking',
    order: 2,
    exerciseCount: 5,
    status: 'coming-soon',
  },
];

const mockExercises: ApiExercise[] = [
  {
    id: 'linux-01',
    module: 'linux',
    order: 1,
    title: 'File System Navigation',
    difficulty: 'beginner',
    estimatedTime: '10m',
  },
  {
    id: 'linux-02',
    module: 'linux',
    order: 2,
    title: 'Process Management',
    difficulty: 'beginner',
    estimatedTime: '15m',
  },
];

const mockProgress: ApiProgress[] = [
  {
    exerciseId: 'linux-01',
    completedAt: '2025-01-27T10:00:00Z',
    attempts: 1,
  },
];

describe('API Client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchModules', () => {
    it('should fetch all modules', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockModules),
      });

      const modules = await fetchModules();

      expect(modules).toEqual(mockModules);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/exercises'), expect.any(Object));
    });

    it('should throw on API error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(fetchModules()).rejects.toThrow();
    });
  });

  describe('fetchExercises', () => {
    it('should fetch all exercises', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockExercises),
      });

      const exercises = await fetchExercises();

      expect(exercises).toEqual(mockExercises);
    });

    it('should filter exercises by module', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockExercises),
      });

      await fetchExercises('linux');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('module=linux'),
        expect.any(Object)
      );
    });
  });

  describe('fetchModuleById', () => {
    it('should fetch a single module by id', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockModules[0]),
      });

      const module = await fetchModuleById('linux');

      expect(module).toEqual(mockModules[0]);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/modules/linux'),
        expect.any(Object)
      );
    });

    it('should return null for non-existent module', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      const module = await fetchModuleById('nonexistent');

      expect(module).toBeNull();
    });
  });

  describe('fetchExerciseById', () => {
    it('should fetch a single exercise by id', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockExercises[0]),
      });

      const exercise = await fetchExerciseById('linux-01');

      expect(exercise).toEqual(mockExercises[0]);
    });
  });

  describe('fetchProgress', () => {
    it('should fetch user progress with auth token', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProgress),
      });

      const progress = await fetchProgress('valid-token');

      expect(progress).toEqual(mockProgress);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/progress'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer valid-token',
          }),
        })
      );
    });

    it('should throw on unauthorized', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      await expect(fetchProgress('invalid-token')).rejects.toThrow();
    });
  });

  describe('recordProgress', () => {
    it('should record exercise completion', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            exerciseId: 'linux-02',
            completedAt: '2025-01-27T12:00:00Z',
          }),
      });

      const result = await recordProgress('valid-token', 'linux-02');

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/exercises/linux-02/verify'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer valid-token',
          }),
        })
      );
    });
  });
});
