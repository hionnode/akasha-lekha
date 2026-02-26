/**
 * Static module definitions for labs.
 * These are the learning modules displayed on the labs landing and sidebar.
 */

export interface LabModule {
  id: string;
  title: string;
  description: string;
  order: number;
  icon?: string;
  prerequisites: string[];
  estimatedTime: string;
  exerciseCount: number;
  status: 'available' | 'coming-soon' | 'beta';
}

export const labModules: LabModule[] = [
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
