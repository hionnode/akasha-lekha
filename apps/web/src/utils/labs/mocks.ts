/**
 * Mock data for development before the real API exists.
 * These mocks mirror the expected API response structure.
 */

import type { ApiModule, ApiExercise, ApiProgress } from './api';
import type { User } from './auth';

export const mockUser: User = {
  id: 'mock-user-123',
  username: 'testuser',
  avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
  email: 'test@example.com',
};

export const mockModules: ApiModule[] = [
  {
    id: 'linux',
    title: 'Linux Fundamentals',
    description:
      'Master essential Linux skills for infrastructure work. Learn the command line, file systems, processes, and system administration basics.',
    order: 1,
    icon: '🐧',
    prerequisites: [],
    estimatedTime: '2-3 hours',
    exerciseCount: 3,
    status: 'available',
  },
  {
    id: 'networking',
    title: 'Networking Basics',
    description:
      'Understand TCP/IP, DNS, firewalls, and network troubleshooting. Essential knowledge for cloud infrastructure.',
    order: 2,
    icon: '🌐',
    prerequisites: ['linux'],
    estimatedTime: '3-4 hours',
    exerciseCount: 5,
    status: 'coming-soon',
  },
  {
    id: 'containers',
    title: 'Container Fundamentals',
    description:
      'Learn Docker from the ground up. Build, run, and manage containers for modern application deployment.',
    order: 3,
    icon: '📦',
    prerequisites: ['linux'],
    estimatedTime: '4-5 hours',
    exerciseCount: 6,
    status: 'coming-soon',
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes Essentials',
    description:
      'Deploy and manage applications on Kubernetes. Learn pods, services, deployments, and more.',
    order: 4,
    icon: '☸️',
    prerequisites: ['linux', 'containers'],
    estimatedTime: '6-8 hours',
    exerciseCount: 8,
    status: 'coming-soon',
  },
];

export const mockExercises: ApiExercise[] = [
  {
    id: 'linux-01',
    module: 'linux',
    order: 1,
    title: 'File System Navigation',
    description: 'Learn to navigate the Linux file system using essential command-line tools.',
    difficulty: 'beginner',
    estimatedTime: '10m',
  },
  {
    id: 'linux-02',
    module: 'linux',
    order: 2,
    title: 'Process Management',
    description: 'Learn to view, manage, and control processes running on a Linux system.',
    difficulty: 'beginner',
    estimatedTime: '15m',
  },
  {
    id: 'linux-03',
    module: 'linux',
    order: 3,
    title: 'Create a systemd Service',
    description: 'Learn how to create and manage a systemd service unit.',
    difficulty: 'beginner',
    estimatedTime: '15m',
  },
];

export const mockProgress: ApiProgress[] = [
  {
    exerciseId: 'linux-01',
    completedAt: '2025-01-27T10:30:00Z',
    attempts: 1,
  },
];

// Mock JWT token (for development only - not a real token)
export const mockToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2NrLXVzZXItMTIzIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImF2YXRhcl91cmwiOiJodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMT92PTQiLCJleHAiOjk5OTk5OTk5OTl9.mock-signature';

/**
 * Mock API handlers for development.
 * Use these to simulate API responses when the backend isn't available.
 */
export const mockApi = {
  getModules: () => Promise.resolve(mockModules),

  getModule: (id: string) =>
    Promise.resolve(mockModules.find((m) => m.id === id) || null),

  getExercises: (moduleId?: string) =>
    Promise.resolve(
      moduleId ? mockExercises.filter((e) => e.module === moduleId) : mockExercises
    ),

  getExercise: (id: string) =>
    Promise.resolve(mockExercises.find((e) => e.id === id) || null),

  getProgress: () => Promise.resolve(mockProgress),

  recordProgress: (exerciseId: string) =>
    Promise.resolve({
      success: true,
      exerciseId,
      completedAt: new Date().toISOString(),
    }),

  verifyToken: () =>
    Promise.resolve({
      valid: true,
      user: mockUser,
    }),
};

/**
 * Check if we should use mocks (development mode without API).
 */
export function shouldUseMocks(): boolean {
  // Use mocks if API URL is not set or is localhost
  const apiUrl = import.meta.env.PUBLIC_LABS_API_URL || '';
  return !apiUrl || apiUrl.includes('localhost');
}
