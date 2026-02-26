// Predefined circuit configurations for logic gate demonstrations.

import type { CircuitDefinition } from '../foundations/types';

export const singleAndGate: CircuitDefinition = {
  inputs: [
    { id: 'A', label: 'A', defaultValue: false },
    { id: 'B', label: 'B', defaultValue: false },
  ],
  gates: [{ id: 'and1', type: 'AND', position: { x: 250, y: 120 }, inputs: ['A', 'B'] }],
  outputs: [{ id: 'out', label: 'Output', source: 'and1', position: { x: 420, y: 120 } }],
  wires: [
    { from: 'A', to: 'and1', toPort: 0 },
    { from: 'B', to: 'and1', toPort: 1 },
  ],
};

export const deMorgansLawCircuit: CircuitDefinition = {
  inputs: [
    { id: 'A', label: 'A', defaultValue: true },
    { id: 'B', label: 'B', defaultValue: false },
  ],
  gates: [
    // Left side: NOT(A AND B)
    { id: 'and1', type: 'AND', position: { x: 200, y: 80 }, inputs: ['A', 'B'] },
    { id: 'not1', type: 'NOT', position: { x: 320, y: 80 }, inputs: ['and1'] },
    // Right side: (NOT A) OR (NOT B)
    { id: 'not2', type: 'NOT', position: { x: 200, y: 240 }, inputs: ['A'] },
    { id: 'not3', type: 'NOT', position: { x: 200, y: 310 }, inputs: ['B'] },
    { id: 'or1', type: 'OR', position: { x: 320, y: 270 }, inputs: ['not2', 'not3'] },
  ],
  outputs: [
    { id: 'out1', label: '¬(A∧B)', source: 'not1', position: { x: 460, y: 80 } },
    { id: 'out2', label: '¬A∨¬B', source: 'or1', position: { x: 460, y: 270 } },
  ],
  wires: [
    { from: 'A', to: 'and1', toPort: 0 },
    { from: 'B', to: 'and1', toPort: 1 },
    { from: 'and1', to: 'not1', toPort: 0 },
    { from: 'A', to: 'not2', toPort: 0 },
    { from: 'B', to: 'not3', toPort: 0 },
    { from: 'not2', to: 'or1', toPort: 0 },
    { from: 'not3', to: 'or1', toPort: 1 },
  ],
};

export const accessControlBugCircuit: CircuitDefinition = {
  inputs: [
    { id: 'admin', label: 'admin', defaultValue: false },
    { id: 'owner', label: 'owner', defaultValue: true },
  ],
  gates: [
    // Bug version: uses AND (too restrictive)
    { id: 'bugAnd', type: 'AND', position: { x: 250, y: 80 }, inputs: ['admin', 'owner'] },
    // Fix version: uses OR (correct)
    { id: 'fixOr', type: 'OR', position: { x: 250, y: 240 }, inputs: ['admin', 'owner'] },
  ],
  outputs: [
    { id: 'bugOut', label: 'Bug', source: 'bugAnd', position: { x: 420, y: 80 } },
    { id: 'fixOut', label: 'Fix', source: 'fixOr', position: { x: 420, y: 240 } },
  ],
  wires: [
    { from: 'admin', to: 'bugAnd', toPort: 0 },
    { from: 'owner', to: 'bugAnd', toPort: 1 },
    { from: 'admin', to: 'fixOr', toPort: 0 },
    { from: 'owner', to: 'fixOr', toPort: 1 },
  ],
};
