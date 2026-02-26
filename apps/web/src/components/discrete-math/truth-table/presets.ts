// Pre-built configurations for common truth table demonstrations.

import type { TruthTableProps } from './TruthTable';

type Preset = Pick<
  TruthTableProps,
  'variables' | 'expressions' | 'highlightEquivalent' | 'showClassification' | 'editable'
>;

export const deMorgansFirstLaw: Preset = {
  variables: ['p', 'q'],
  expressions: {
    '¬(p ∧ q)': '!(p && q)',
    '¬p ∨ ¬q': '!p || !q',
  },
  highlightEquivalent: true,
  showClassification: true,
  editable: false,
};

export const deMorgansSecondLaw: Preset = {
  variables: ['p', 'q'],
  expressions: {
    '¬(p ∨ q)': '!(p || q)',
    '¬p ∧ ¬q': '!p && !q',
  },
  highlightEquivalent: true,
  showClassification: true,
  editable: false,
};

export const accessControlBug: Preset = {
  variables: ['admin', 'owner'],
  expressions: {
    'admin ∧ owner': 'admin && owner',
    'admin ∨ owner': 'admin || owner',
  },
  highlightEquivalent: false,
  showClassification: true,
  editable: false,
};

export const implicationExplorer: Preset = {
  variables: ['p', 'q'],
  expressions: {
    'p → q': 'p -> q',
    '¬p ∨ q': '!p || q',
    '¬q → ¬p': '!q -> !p',
  },
  highlightEquivalent: true,
  showClassification: true,
  editable: true,
};

export const biconditionalExplorer: Preset = {
  variables: ['p', 'q'],
  expressions: {
    'p ↔ q': 'p <-> q',
    '(p → q) ∧ (q → p)': '(p -> q) && (q -> p)',
  },
  highlightEquivalent: true,
  showClassification: true,
  editable: false,
};

export const tautologyAndContradiction: Preset = {
  variables: ['p'],
  expressions: {
    'p ∨ ¬p': 'p || !p',
    'p ∧ ¬p': 'p && !p',
  },
  highlightEquivalent: false,
  showClassification: true,
  editable: false,
};

export const xorExplorer: Preset = {
  variables: ['p', 'q'],
  expressions: {
    'p ⊕ q': 'p xor q',
    '(p ∨ q) ∧ ¬(p ∧ q)': '(p || q) && !(p && q)',
  },
  highlightEquivalent: true,
  showClassification: true,
  editable: true,
};
