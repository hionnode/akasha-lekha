import { createSignal } from 'solid-js';

export interface CLICommandCopyProps {
  command: string;
  class?: string;
}

type CopyState = 'idle' | 'copied' | 'failed';

export function CLICommandCopy(props: CLICommandCopyProps) {
  const [copyState, setCopyState] = createSignal<CopyState>('idle');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.command);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      setCopyState('failed');
      setTimeout(() => setCopyState('idle'), 2000);
    }
  };

  const buttonLabel = () => {
    switch (copyState()) {
      case 'copied':
        return 'Copied!';
      case 'failed':
        return 'Failed';
      default:
        return 'Copy';
    }
  };

  const buttonIcon = () => {
    switch (copyState()) {
      case 'copied':
        return (
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case 'failed':
        return (
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      default:
        return (
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        );
    }
  };

  return (
    <div
      data-testid="cli-command-container"
      class={`flex items-center gap-2 p-3 bg-bg-secondary border border-border rounded-lg font-mono text-sm ${props.class || ''}`}
    >
      {/* Terminal prompt */}
      <span class="text-accent-green select-none">$</span>

      {/* Command text */}
      <code class="flex-1 text-fg-primary overflow-x-auto whitespace-nowrap">
        {props.command}
      </code>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        aria-label={buttonLabel()}
        class={`flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded transition-colors ${
          copyState() === 'copied'
            ? 'text-accent-green bg-accent-green/10'
            : copyState() === 'failed'
              ? 'text-accent-red bg-accent-red/10'
              : 'text-fg-muted hover:text-fg-primary hover:bg-bg-tertiary'
        }`}
      >
        {buttonIcon()}
        <span>{buttonLabel()}</span>
      </button>
    </div>
  );
}

export default CLICommandCopy;
