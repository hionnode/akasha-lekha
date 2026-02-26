import type { JSX } from 'solid-js';

export interface DiagramContainerProps {
  width?: number;
  height?: number;
  viewBox?: string;
  class?: string;
  children: JSX.Element;
  fallbackText?: string;
}

export function DiagramContainer(props: DiagramContainerProps) {
  const w = () => props.width ?? 600;
  const h = () => props.height ?? 400;
  const vb = () => props.viewBox ?? `0 0 ${w()} ${h()}`;

  return (
    <div
      data-testid="diagram-container"
      class={`relative w-full rounded-lg border border-border overflow-hidden ${props.class ?? ''}`}
    >
      <svg
        width="100%"
        viewBox={vb()}
        preserveAspectRatio="xMidYMid meet"
        class="block"
        style={{ background: 'var(--bg-secondary)' }}
        role="img"
      >
        {props.children}
      </svg>
      <noscript>
        <div class="absolute inset-0 flex items-center justify-center bg-bg-secondary text-fg-muted p-4 text-center">
          {props.fallbackText ?? 'Enable JavaScript to view this interactive diagram.'}
        </div>
      </noscript>
    </div>
  );
}

export default DiagramContainer;
