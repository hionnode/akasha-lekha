import { createSignal, For, Show, onMount } from 'solid-js';
import { useAnime } from '../foundations/useAnime';
import { colors } from '../foundations/colors';
import type { TruthTableResult } from './logic-engine';

export interface TableRendererProps {
  table: TruthTableResult;
  animateOnMount?: boolean;
  highlightEquivalent?: boolean;
  showClassification?: boolean;
}

function classificationLabel(c: 'tautology' | 'contradiction' | 'contingency') {
  switch (c) {
    case 'tautology': return { text: 'Tautology', color: 'text-accent-green bg-accent-green/10' };
    case 'contradiction': return { text: 'Contradiction', color: 'text-accent-red bg-accent-red/10' };
    case 'contingency': return { text: 'Contingency', color: 'text-accent-yellow bg-accent-yellow/10' };
  }
}

function equivalenceColor(index: number): string {
  const palette = [colors.accentBlue, colors.accentCyan, colors.accentPurple, colors.accentMagenta];
  return palette[index % palette.length];
}

export function TableRenderer(props: TableRendererProps) {
  const [visible, setVisible] = createSignal(false);
  const { animate } = useAnime();

  const equivalentLabels = () => {
    if (!props.highlightEquivalent) return new Map<string, number>();
    const map = new Map<string, number>();
    props.table.equivalences.forEach(([a, b], i) => {
      map.set(a, i);
      map.set(b, i);
    });
    return map;
  };

  onMount(async () => {
    setVisible(true);
    if (props.animateOnMount && props.table.rows.length <= 16) {
      await animate('[data-truth-row]', {
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 300,
        delay: (_el: Element, i: number) => i * 50,
      });
    }
  });

  return (
    <div data-testid="table-renderer" class="overflow-x-auto">
      <Show when={visible()}>
        <table class="w-full text-sm font-mono border-collapse">
          <thead>
            <tr class="border-b border-border">
              <For each={props.table.variables}>
                {(v) => (
                  <th class="px-3 py-2 text-accent-purple font-medium text-center">{v}</th>
                )}
              </For>
              <th class="w-px px-0 py-2">
                <span class="block w-px h-4 bg-border mx-auto" />
              </th>
              <For each={props.table.expressions}>
                {(expr) => {
                  const eqIndex = () => equivalentLabels().get(expr);
                  const borderColor = () => {
                    const idx = eqIndex();
                    return idx !== undefined ? equivalenceColor(idx) : undefined;
                  };
                  return (
                    <th
                      class="px-3 py-2 text-accent-cyan font-medium text-center"
                      style={borderColor() ? { 'border-bottom': `2px solid ${borderColor()}` } : {}}
                    >
                      {expr}
                    </th>
                  );
                }}
              </For>
            </tr>
          </thead>
          <tbody>
            <For each={props.table.rows}>
              {(row, rowIndex) => (
                <tr
                  data-truth-row={rowIndex()}
                  class="border-b border-border/50 hover:bg-bg-tertiary/50 transition-colors"
                  style={props.animateOnMount && props.table.rows.length <= 16 ? { opacity: 0 } : {}}
                >
                  <For each={props.table.variables}>
                    {(v) => (
                      <td
                        class="px-3 py-1.5 text-center"
                        style={{ color: row.inputs[v] ? colors.truthTrue : colors.truthFalse }}
                      >
                        {row.inputs[v] ? 'T' : 'F'}
                      </td>
                    )}
                  </For>
                  <td class="w-px px-0 py-1.5">
                    <span class="block w-px h-4 bg-border mx-auto" />
                  </td>
                  <For each={props.table.expressions}>
                    {(expr) => {
                      const eqIndex = () => equivalentLabels().get(expr);
                      const bgColor = () => {
                        const idx = eqIndex();
                        return idx !== undefined ? `${equivalenceColor(idx)}10` : undefined;
                      };
                      return (
                        <td
                          class="px-3 py-1.5 text-center font-medium"
                          style={{
                            color: row.outputs[expr] ? colors.truthTrue : colors.truthFalse,
                            'background-color': bgColor(),
                          }}
                        >
                          {row.outputs[expr] ? 'T' : 'F'}
                        </td>
                      );
                    }}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>

        <Show when={props.showClassification}>
          <div class="flex flex-wrap gap-2 mt-3" data-testid="classification-badges">
            <For each={props.table.expressions}>
              {(expr) => {
                const cls = () => classificationLabel(props.table.classification[expr]);
                return (
                  <span class={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${cls().color}`}>
                    <span class="text-fg-muted">{expr}:</span>
                    {cls().text}
                  </span>
                );
              }}
            </For>
          </div>
        </Show>

        <Show when={props.highlightEquivalent && props.table.equivalences.length > 0}>
          <div class="mt-2 text-xs text-fg-muted" data-testid="equivalence-note">
            <For each={props.table.equivalences}>
              {([a, b], i) => (
                <span class="inline-flex items-center gap-1 mr-3">
                  <span class="w-2 h-2 rounded-full" style={{ background: equivalenceColor(i()) }} />
                  {a} ≡ {b}
                </span>
              )}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
}

export default TableRenderer;
