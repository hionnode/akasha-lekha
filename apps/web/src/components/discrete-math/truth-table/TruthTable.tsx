import { createSignal, Show } from 'solid-js';
import { FormulaInput } from './FormulaInput';
import { TableRenderer } from './TableRenderer';
import { generateTruthTable, extractVariablesFromFormula } from './logic-engine';
import type { TruthTableResult } from './logic-engine';

export interface TruthTableProps {
  variables?: string[];
  expressions?: Record<string, string>;
  editable?: boolean;
  highlightEquivalent?: boolean;
  compareMode?: boolean;
  showClassification?: boolean;
  animateOnMount?: boolean;
}

export function TruthTable(props: TruthTableProps) {
  const editable = () => props.editable ?? true;
  const [formulaText, setFormulaText] = createSignal('');
  const [expressions, setExpressions] = createSignal<Record<string, string>>(
    props.expressions ?? {},
  );
  const [error, setError] = createSignal<string | null>(null);
  const [table, setTable] = createSignal<TruthTableResult | null>(null);

  // Generate initial table if expressions are provided
  if (props.expressions && Object.keys(props.expressions).length > 0) {
    try {
      setTable(generateTruthTable(props.expressions, props.variables));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate table');
    }
  }

  function addFormula() {
    const text = formulaText().trim();
    if (!text) return;

    // Validate
    const vars = extractVariablesFromFormula(text);
    const currentExprs = expressions();
    const allVars = new Set<string>();
    for (const formula of Object.values(currentExprs)) {
      for (const v of extractVariablesFromFormula(formula)) {
        allVars.add(v);
      }
    }
    for (const v of vars) {
      allVars.add(v);
    }

    if (allVars.size > 5) {
      setError('Maximum 5 variables supported (32 rows)');
      return;
    }

    const newExprs = { ...currentExprs, [text]: text };
    setExpressions(newExprs);
    setFormulaText('');
    setError(null);

    try {
      setTable(generateTruthTable(newExprs, props.variables));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid formula');
      // Revert
      setExpressions(currentExprs);
    }
  }

  function removeExpression(label: string) {
    const newExprs = { ...expressions() };
    delete newExprs[label];
    setExpressions(newExprs);

    if (Object.keys(newExprs).length === 0) {
      setTable(null);
    } else {
      try {
        setTable(generateTruthTable(newExprs, props.variables));
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error');
      }
    }
  }

  function clearAll() {
    setExpressions({});
    setTable(null);
    setError(null);
  }

  const varCount = () => {
    const t = table();
    return t ? t.variables.length : 0;
  };

  return (
    <div data-testid="truth-table" class="rounded-lg border border-border bg-bg-primary p-4 space-y-4">
      <Show when={editable()}>
        <FormulaInput
          value={formulaText()}
          onInput={setFormulaText}
          onSubmit={addFormula}
          placeholder="Type a formula: p ∧ q, !(p || q), p → q"
        />
      </Show>

      <Show when={error()}>
        <div class="px-3 py-2 text-sm text-accent-red bg-accent-red/10 rounded border border-accent-red/20">
          {error()}
        </div>
      </Show>

      <Show when={varCount() >= 4 && (props.animateOnMount ?? true)}>
        <div class="text-xs text-fg-muted">
          {varCount() >= 5 ? 'Animations disabled for 5 variables (32 rows).' : ''}
        </div>
      </Show>

      <Show when={editable() && Object.keys(expressions()).length > 0}>
        <div class="flex flex-wrap gap-2">
          {Object.keys(expressions()).map((label) => (
            <span class="inline-flex items-center gap-1 px-2 py-1 bg-bg-tertiary rounded text-xs font-mono text-fg-secondary">
              {label}
              <button
                onClick={() => removeExpression(label)}
                aria-label={`Remove ${label}`}
                class="ml-1 text-fg-muted hover:text-accent-red transition-colors"
              >
                ×
              </button>
            </span>
          ))}
          <button
            onClick={clearAll}
            class="px-2 py-1 text-xs text-fg-muted hover:text-accent-red transition-colors"
            aria-label="Clear all formulas"
          >
            Clear all
          </button>
        </div>
      </Show>

      <Show when={table()}>
        {(t) => (
          <TableRenderer
            table={t()}
            animateOnMount={props.animateOnMount ?? true}
            highlightEquivalent={props.highlightEquivalent ?? true}
            showClassification={props.showClassification ?? true}
          />
        )}
      </Show>

      <Show when={!table() && !error()}>
        <div class="text-center py-8 text-fg-muted text-sm">
          {editable()
            ? 'Enter a formula above to generate a truth table.'
            : 'No formulas configured.'}
        </div>
      </Show>

      <noscript>
        <div class="text-center py-8 text-fg-muted text-sm">
          Enable JavaScript to use the interactive truth table.
        </div>
      </noscript>
    </div>
  );
}

export default TruthTable;
