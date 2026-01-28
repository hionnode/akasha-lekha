import { createSignal, createEffect, Show, For, onCleanup } from 'solid-js';

export interface ProgressTrackerProps {
  token?: string;
  exerciseIds: string[];
  showPercentage?: boolean;
  showCheckmarks?: boolean;
  pollInterval?: number; // ms, default 30000
  apiUrl?: string;
}

interface Progress {
  exerciseId: string;
  completedAt: string;
  attempts: number;
}

export function ProgressTracker(props: ProgressTrackerProps) {
  const [progress, setProgress] = createSignal<Progress[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  const apiUrl = () => props.apiUrl || import.meta.env.PUBLIC_LABS_API_URL || '';

  const fetchProgress = async () => {
    if (!props.token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl()}/progress`, {
        headers: {
          Authorization: `Bearer ${props.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setProgress(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and polling
  createEffect(() => {
    if (props.token) {
      fetchProgress();

      const interval = setInterval(fetchProgress, props.pollInterval || 30000);
      onCleanup(() => clearInterval(interval));
    } else {
      setLoading(false);
    }
  });

  const completedIds = () => new Set(progress().map((p) => p.exerciseId));
  const completedCount = () =>
    props.exerciseIds.filter((id) => completedIds().has(id)).length;
  const percentage = () =>
    Math.round((completedCount() / props.exerciseIds.length) * 100);

  const isCompleted = (exerciseId: string) => completedIds().has(exerciseId);

  // Unauthenticated state
  if (!props.token) {
    return (
      <div data-testid="progress-unauthenticated" class="text-fg-muted text-sm">
        <a href="/labs/login" class="text-accent-blue hover:underline">
          Login
        </a>{' '}
        to track progress
      </div>
    );
  }

  return (
    <div class="progress-tracker">
      <Show when={loading()}>
        <div
          data-testid="progress-loading"
          class="flex items-center gap-2 text-fg-muted text-sm"
        >
          <div class="w-4 h-4 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          Loading progress...
        </div>
      </Show>

      <Show when={error()}>
        <div data-testid="progress-error" class="text-accent-red text-sm">
          Failed to load progress
        </div>
      </Show>

      <Show when={!loading() && !error()}>
        <div class="flex items-center gap-3">
          {/* Progress count */}
          <span class="text-fg-primary font-medium">
            {completedCount()} / {props.exerciseIds.length}
          </span>

          {/* Percentage */}
          <Show when={props.showPercentage}>
            <span class="text-accent-green font-medium">{percentage()}%</span>
          </Show>

          {/* Progress bar */}
          <div class="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
            <div
              class="h-full bg-accent-green transition-all duration-300"
              style={{ width: `${percentage()}%` }}
            />
          </div>
        </div>

        {/* Checkmarks for individual exercises */}
        <Show when={props.showCheckmarks}>
          <div class="mt-2 flex flex-wrap gap-2">
            <For each={props.exerciseIds}>
              {(exerciseId) => (
                <Show
                  when={isCompleted(exerciseId)}
                  fallback={
                    <span
                      data-testid={`exercise-${exerciseId}-incomplete`}
                      class="w-5 h-5 flex items-center justify-center rounded-full border border-border text-fg-muted text-xs"
                    >
                      ○
                    </span>
                  }
                >
                  <span
                    data-testid={`exercise-${exerciseId}-complete`}
                    class="w-5 h-5 flex items-center justify-center rounded-full bg-accent-green text-bg-primary text-xs"
                  >
                    ✓
                  </span>
                </Show>
              )}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
}

export default ProgressTracker;
