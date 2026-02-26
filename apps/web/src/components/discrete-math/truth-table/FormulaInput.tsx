import { createSignal } from 'solid-js';

export interface FormulaInputProps {
  value: string;
  onInput: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
}

const SYMBOLS = [
  { label: '¬', insert: '¬', title: 'NOT' },
  { label: '∧', insert: '∧', title: 'AND' },
  { label: '∨', insert: '∨', title: 'OR' },
  { label: '⊕', insert: '⊕', title: 'XOR' },
  { label: '→', insert: '→', title: 'IMPLIES' },
  { label: '↔', insert: '↔', title: 'BICONDITIONAL' },
  { label: '(', insert: '(', title: 'Left parenthesis' },
  { label: ')', insert: ')', title: 'Right parenthesis' },
] as const;

const VARIABLE_BUTTONS = ['p', 'q', 'r', 's', 't'] as const;

export function FormulaInput(props: FormulaInputProps) {
  let inputRef: HTMLInputElement | undefined;
  const [cursorPos, setCursorPos] = createSignal(0);

  function insertAtCursor(text: string) {
    const input = inputRef;
    if (!input) return;

    const start = input.selectionStart ?? cursorPos();
    const end = input.selectionEnd ?? start;
    const before = props.value.slice(0, start);
    const after = props.value.slice(end);
    const newValue = before + text + after;
    const newPos = start + text.length;

    props.onInput(newValue);
    setCursorPos(newPos);

    // Restore cursor after Solid re-renders
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(newPos, newPos);
    });
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      props.onSubmit();
    }
  }

  return (
    <div data-testid="formula-input" class={`space-y-2 ${props.class ?? ''}`}>
      <div class="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={props.value}
          onInput={(e) => {
            props.onInput(e.currentTarget.value);
            setCursorPos(e.currentTarget.selectionStart ?? 0);
          }}
          onKeyDown={handleKeyDown}
          onClick={(e) => setCursorPos(e.currentTarget.selectionStart ?? 0)}
          placeholder={props.placeholder ?? 'e.g. p ∧ q, !(p || q), p -> q'}
          disabled={props.disabled}
          class="flex-1 px-3 py-2 bg-bg-secondary border border-border rounded text-fg-primary font-mono text-sm placeholder:text-fg-muted/50 focus:outline-none focus:border-accent-blue disabled:opacity-50"
          aria-label="Formula input"
        />
        <button
          onClick={props.onSubmit}
          disabled={props.disabled || !props.value.trim()}
          class="px-3 py-2 bg-accent-blue/20 text-accent-blue rounded text-sm font-medium hover:bg-accent-blue/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Add formula"
        >
          Add
        </button>
      </div>

      <div class="flex flex-wrap gap-1">
        {SYMBOLS.map((sym) => (
          <button
            onClick={() => insertAtCursor(sym.insert)}
            disabled={props.disabled}
            title={sym.title}
            aria-label={`Insert ${sym.title}`}
            class="px-2 py-1 bg-bg-tertiary border border-border rounded text-fg-secondary font-mono text-sm hover:text-accent-cyan hover:border-accent-cyan/30 disabled:opacity-30 transition-colors"
          >
            {sym.label}
          </button>
        ))}
        <span class="w-px bg-border mx-1" />
        {VARIABLE_BUTTONS.map((v) => (
          <button
            onClick={() => insertAtCursor(v)}
            disabled={props.disabled}
            title={`Variable ${v}`}
            aria-label={`Insert variable ${v}`}
            class="px-2 py-1 bg-bg-tertiary border border-border rounded text-accent-purple font-mono text-sm hover:text-accent-purple hover:border-accent-purple/30 disabled:opacity-30 transition-colors"
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FormulaInput;
