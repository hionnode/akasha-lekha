import { For } from 'solid-js';
import type { GateType } from '../foundations/types';

export interface GatePaletteProps {
  onSelectGate: (type: GateType) => void;
  disabled?: boolean;
  class?: string;
}

const GATE_ITEMS: { type: GateType; label: string; description: string }[] = [
  { type: 'AND', label: 'AND', description: 'Output is true when all inputs are true' },
  { type: 'OR', label: 'OR', description: 'Output is true when any input is true' },
  { type: 'NOT', label: 'NOT', description: 'Inverts the input' },
  { type: 'XOR', label: 'XOR', description: 'Output is true when inputs differ' },
  { type: 'NAND', label: 'NAND', description: 'Inverted AND' },
  { type: 'NOR', label: 'NOR', description: 'Inverted OR' },
];

// Simplified gate icon paths for the palette (smaller scale)
function miniGateIcon(type: GateType): string {
  switch (type) {
    case 'AND': return 'M 4 2 L 10 2 A 6 6 0 0 1 10 14 L 4 14 Z';
    case 'OR': return 'M 4 2 Q 8 2 14 8 Q 8 14 4 14 Q 6 8 4 2';
    case 'NOT': return 'M 4 2 L 12 8 L 4 14 Z';
    case 'XOR': return 'M 4 2 Q 8 2 14 8 Q 8 14 4 14 Q 6 8 4 2';
    case 'NAND': return 'M 4 2 L 10 2 A 6 6 0 0 1 10 14 L 4 14 Z';
    case 'NOR': return 'M 4 2 Q 8 2 14 8 Q 8 14 4 14 Q 6 8 4 2';
  }
}

function hasNegation(type: GateType): boolean {
  return type === 'NOT' || type === 'NAND' || type === 'NOR';
}

export function GatePalette(props: GatePaletteProps) {
  return (
    <div
      data-testid="gate-palette"
      class={`flex flex-col gap-1 ${props.class ?? ''}`}
    >
      <span class="text-xs text-fg-muted font-medium mb-1 px-1">Gates</span>
      <For each={GATE_ITEMS}>
        {(item) => (
          <button
            data-testid={`palette-${item.type.toLowerCase()}`}
            onClick={() => props.onSelectGate(item.type)}
            disabled={props.disabled}
            title={item.description}
            aria-label={`Add ${item.type} gate`}
            class="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-fg-secondary hover:text-accent-cyan hover:bg-bg-tertiary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="18" height="16" viewBox="0 0 18 16" class="flex-shrink-0">
              <path
                d={miniGateIcon(item.type)}
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
              {hasNegation(item.type) && (
                <circle cx="15" cy="8" r="2" fill="none" stroke="currentColor" stroke-width="1.5" />
              )}
            </svg>
            <span class="font-mono text-xs">{item.label}</span>
          </button>
        )}
      </For>
    </div>
  );
}

export default GatePalette;
