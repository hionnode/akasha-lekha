import { onCleanup, onMount } from 'solid-js';

export interface StepControllerProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  onStepForward: () => void;
  onStepBack: () => void;
  onGoToFirst: () => void;
  onGoToLast: () => void;
  onTogglePlay: () => void;
  class?: string;
}

export function StepController(props: StepControllerProps) {
  const atStart = () => props.currentStep <= 0;
  const atEnd = () => props.currentStep >= props.totalSteps - 1;

  function handleKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        props.onStepBack();
        break;
      case 'ArrowRight':
        e.preventDefault();
        props.onStepForward();
        break;
      case ' ':
        e.preventDefault();
        props.onTogglePlay();
        break;
    }
  }

  onMount(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', handleKeyDown);
    }
  });

  onCleanup(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', handleKeyDown);
    }
  });

  return (
    <div
      data-testid="step-controller"
      class={`flex items-center justify-center gap-2 py-2 ${props.class ?? ''}`}
    >
      <button
        onClick={props.onGoToFirst}
        disabled={atStart()}
        aria-label="Go to first step"
        class="p-1.5 rounded text-fg-muted hover:text-fg-primary hover:bg-bg-tertiary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={props.onStepBack}
        disabled={atStart()}
        aria-label="Step back"
        class="p-1.5 rounded text-fg-muted hover:text-fg-primary hover:bg-bg-tertiary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={props.onTogglePlay}
        aria-label={props.isPlaying ? 'Pause' : 'Play'}
        class="p-2 rounded-full text-accent-blue hover:bg-accent-blue/10 transition-colors"
      >
        {props.isPlaying ? (
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <button
        onClick={props.onStepForward}
        disabled={atEnd()}
        aria-label="Step forward"
        class="p-1.5 rounded text-fg-muted hover:text-fg-primary hover:bg-bg-tertiary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <button
        onClick={props.onGoToLast}
        disabled={atEnd()}
        aria-label="Go to last step"
        class="p-1.5 rounded text-fg-muted hover:text-fg-primary hover:bg-bg-tertiary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M6 5l7 7-7 7" />
        </svg>
      </button>

      <span class="ml-2 text-xs text-fg-muted tabular-nums">
        Step {props.currentStep + 1} of {props.totalSteps}
      </span>
    </div>
  );
}

export default StepController;
