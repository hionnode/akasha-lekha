import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@solidjs/testing-library';
import { ProgressTracker } from './ProgressTracker';

// Mock the fetch API
const mockProgress = [
  { exerciseId: 'linux-01', completedAt: '2025-01-27T10:00:00Z', attempts: 1 },
  { exerciseId: 'linux-02', completedAt: '2025-01-27T11:00:00Z', attempts: 2 },
];

describe('ProgressTracker', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should show loading state initially', () => {
    global.fetch = vi.fn().mockImplementation(
      () =>
        new Promise(() => {
          /* never resolves */
        })
    );

    render(() => <ProgressTracker token="test-token" exerciseIds={['linux-01']} />);

    expect(screen.getByTestId('progress-loading')).toBeInTheDocument();
  });

  it('should display completed exercises after loading', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProgress),
    });

    render(() => (
      <ProgressTracker token="test-token" exerciseIds={['linux-01', 'linux-02', 'linux-03']} />
    ));

    await waitFor(() => {
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });
  });

  it('should show completion percentage', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProgress),
    });

    render(() => (
      <ProgressTracker
        token="test-token"
        exerciseIds={['linux-01', 'linux-02', 'linux-03']}
        showPercentage
      />
    ));

    await waitFor(() => {
      expect(screen.getByText('67%')).toBeInTheDocument();
    });
  });

  it('should mark specific exercise as completed', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProgress),
    });

    render(() => (
      <ProgressTracker token="test-token" exerciseIds={['linux-01']} showCheckmarks />
    ));

    await waitFor(() => {
      expect(screen.getByTestId('exercise-linux-01-complete')).toBeInTheDocument();
    });
  });

  it('should handle unauthenticated state', () => {
    render(() => <ProgressTracker exerciseIds={['linux-01']} />);

    expect(screen.getByTestId('progress-unauthenticated')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    render(() => <ProgressTracker token="test-token" exerciseIds={['linux-01']} />);

    await waitFor(() => {
      expect(screen.getByTestId('progress-error')).toBeInTheDocument();
    });
  });
});
