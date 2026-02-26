// Type definitions and predefined proof structures for the Proof Stepper.

import type { ProofDefinition } from '../foundations/types';

export const deMorgansFirstLawProof: ProofDefinition = {
  title: "De Morgan's First Law",
  statement: '¬(p ∧ q) ≡ ¬p ∨ ¬q',
  premises: [],
  steps: [
    {
      lineNumber: 1,
      statement: 'Assume p ∧ q is true',
      justification: 'Assumption',
      rule: 'assumption',
    },
    {
      lineNumber: 2,
      statement: 'Then both p and q are true',
      justification: 'Definition of conjunction',
      rule: 'conjunction',
      highlightPrevious: [1],
    },
    {
      lineNumber: 3,
      statement: '¬(p ∧ q) is false when p ∧ q is true',
      justification: 'Definition of negation',
      rule: 'complement',
      highlightPrevious: [1],
    },
    {
      lineNumber: 4,
      statement: 'If p is true, then ¬p is false; if q is true, then ¬q is false',
      justification: 'Definition of negation',
      rule: 'complement',
      highlightPrevious: [2],
    },
    {
      lineNumber: 5,
      statement: '¬p ∨ ¬q is false (both disjuncts false)',
      justification: 'Definition of disjunction',
      rule: 'de-morgans',
      highlightPrevious: [4],
    },
    {
      lineNumber: 6,
      statement: 'Both sides false when p ∧ q is true ✓',
      justification: 'Matching truth values',
      highlightPrevious: [3, 5],
    },
    {
      lineNumber: 7,
      statement: 'Assume p ∧ q is false (at least one is false)',
      justification: 'Assumption (other case)',
      rule: 'assumption',
    },
    {
      lineNumber: 8,
      statement: '¬(p ∧ q) is true',
      justification: 'Definition of negation',
      rule: 'complement',
      highlightPrevious: [7],
    },
    {
      lineNumber: 9,
      statement: 'At least one of ¬p, ¬q is true',
      justification: 'Negation distributes over conjunction',
      rule: 'de-morgans',
      highlightPrevious: [7],
    },
    {
      lineNumber: 10,
      statement: '¬p ∨ ¬q is true',
      justification: 'Definition of disjunction',
      highlightPrevious: [9],
    },
    {
      lineNumber: 11,
      statement: 'Both sides true when p ∧ q is false ✓',
      justification: 'Matching truth values',
      highlightPrevious: [8, 10],
    },
  ],
  conclusion: 'Therefore ¬(p ∧ q) ≡ ¬p ∨ ¬q',
  qed: true,
};

export const modusPonensExample: ProofDefinition = {
  title: 'Modus Ponens',
  statement: 'From "If it rains, the ground is wet" and "It rains", derive "The ground is wet"',
  premises: ['p → q (If it rains, the ground is wet)', 'p (It rains)'],
  steps: [
    {
      lineNumber: 1,
      statement: 'p → q',
      justification: 'Premise',
      rule: 'premise',
    },
    {
      lineNumber: 2,
      statement: 'p',
      justification: 'Premise',
      rule: 'premise',
    },
    {
      lineNumber: 3,
      statement: 'q',
      justification: 'Modus Ponens (1, 2)',
      rule: 'modus-ponens',
      highlightPrevious: [1, 2],
    },
  ],
  conclusion: 'Therefore: The ground is wet (q)',
  qed: true,
};

export const evenPlusEvenProof: ProofDefinition = {
  title: 'Direct Proof: even + even = even',
  statement: 'If a and b are even integers, then a + b is even.',
  premises: ['a is even', 'b is even'],
  steps: [
    {
      lineNumber: 1,
      statement: 'a is even',
      justification: 'Premise',
      rule: 'premise',
    },
    {
      lineNumber: 2,
      statement: 'a = 2k for some integer k',
      justification: 'Definition of even',
      highlightPrevious: [1],
    },
    {
      lineNumber: 3,
      statement: 'b is even',
      justification: 'Premise',
      rule: 'premise',
    },
    {
      lineNumber: 4,
      statement: 'b = 2m for some integer m',
      justification: 'Definition of even',
      highlightPrevious: [3],
    },
    {
      lineNumber: 5,
      statement: 'a + b = 2k + 2m',
      justification: 'Substitution',
      highlightPrevious: [2, 4],
    },
    {
      lineNumber: 6,
      statement: 'a + b = 2(k + m)',
      justification: 'Factor out 2',
      rule: 'distributive',
      highlightPrevious: [5],
    },
    {
      lineNumber: 7,
      statement: 'k + m is an integer (closure of integers under addition)',
      justification: 'Integer closure',
      highlightPrevious: [6],
    },
    {
      lineNumber: 8,
      statement: 'a + b = 2n where n = k + m is an integer',
      justification: 'Let n = k + m',
      highlightPrevious: [6, 7],
    },
    {
      lineNumber: 9,
      statement: 'a + b is even',
      justification: 'Definition of even',
      highlightPrevious: [8],
    },
  ],
  conclusion: 'Therefore, the sum of two even integers is even.',
  qed: true,
};
