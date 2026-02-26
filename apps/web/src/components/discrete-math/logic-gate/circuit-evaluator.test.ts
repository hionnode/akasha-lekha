import { describe, it, expect } from 'vitest';
import {
  evaluateCircuit,
  topologicalSort,
  computeGateDepths,
  generateCircuitTruthTable,
} from './circuit-evaluator';
import type { CircuitDefinition } from '../foundations/types';

const simpleAnd: CircuitDefinition = {
  inputs: [
    { id: 'A', label: 'A' },
    { id: 'B', label: 'B' },
  ],
  gates: [{ id: 'g1', type: 'AND', position: { x: 200, y: 100 }, inputs: ['A', 'B'] }],
  outputs: [{ id: 'out', label: 'Output', source: 'g1', position: { x: 350, y: 100 } }],
  wires: [
    { from: 'A', to: 'g1', toPort: 0 },
    { from: 'B', to: 'g1', toPort: 1 },
  ],
};

const deMorganCircuit: CircuitDefinition = {
  inputs: [
    { id: 'A', label: 'A' },
    { id: 'B', label: 'B' },
  ],
  gates: [
    { id: 'notA', type: 'NOT', position: { x: 150, y: 50 }, inputs: ['A'] },
    { id: 'notB', type: 'NOT', position: { x: 150, y: 150 }, inputs: ['B'] },
    { id: 'orGate', type: 'OR', position: { x: 300, y: 100 }, inputs: ['notA', 'notB'] },
  ],
  outputs: [{ id: 'out', label: 'Output', source: 'orGate', position: { x: 450, y: 100 } }],
  wires: [
    { from: 'A', to: 'notA', toPort: 0 },
    { from: 'B', to: 'notB', toPort: 0 },
    { from: 'notA', to: 'orGate', toPort: 0 },
    { from: 'notB', to: 'orGate', toPort: 1 },
  ],
};

describe('topologicalSort', () => {
  it('sorts single gate circuit', () => {
    const order = topologicalSort(simpleAnd);
    expect(order).toEqual(['g1']);
  });

  it('sorts multi-level circuit in dependency order', () => {
    const order = topologicalSort(deMorganCircuit);
    // notA and notB should come before orGate
    const orIndex = order.indexOf('orGate');
    const notAIndex = order.indexOf('notA');
    const notBIndex = order.indexOf('notB');
    expect(notAIndex).toBeLessThan(orIndex);
    expect(notBIndex).toBeLessThan(orIndex);
  });

  it('detects cycles', () => {
    const cyclic: CircuitDefinition = {
      inputs: [{ id: 'A', label: 'A' }],
      gates: [
        { id: 'g1', type: 'AND', position: { x: 0, y: 0 }, inputs: ['A', 'g2'] },
        { id: 'g2', type: 'OR', position: { x: 0, y: 0 }, inputs: ['g1'] },
      ],
      outputs: [],
      wires: [],
    };
    expect(() => topologicalSort(cyclic)).toThrow('cycle');
  });
});

describe('evaluateCircuit', () => {
  it('evaluates AND gate', () => {
    const result = evaluateCircuit(simpleAnd, { A: true, B: true });
    expect(result.outputValues.out).toBe(true);

    const result2 = evaluateCircuit(simpleAnd, { A: true, B: false });
    expect(result2.outputValues.out).toBe(false);
  });

  it('evaluates De Morgan: NOT A OR NOT B', () => {
    // ¬A ∨ ¬B is equivalent to ¬(A ∧ B)
    const cases: [boolean, boolean, boolean][] = [
      [false, false, true],
      [false, true, true],
      [true, false, true],
      [true, true, false],
    ];
    for (const [a, b, expected] of cases) {
      const result = evaluateCircuit(deMorganCircuit, { A: a, B: b });
      expect(result.outputValues.out).toBe(expected);
    }
  });

  it('provides evaluation order', () => {
    const result = evaluateCircuit(deMorganCircuit, { A: true, B: false });
    expect(result.evaluationOrder).toContain('notA');
    expect(result.evaluationOrder).toContain('notB');
    expect(result.evaluationOrder).toContain('orGate');
  });

  it('evaluates NOT gate', () => {
    const notCircuit: CircuitDefinition = {
      inputs: [{ id: 'A', label: 'A' }],
      gates: [{ id: 'n1', type: 'NOT', position: { x: 0, y: 0 }, inputs: ['A'] }],
      outputs: [{ id: 'out', label: 'Out', source: 'n1', position: { x: 0, y: 0 } }],
      wires: [],
    };
    expect(evaluateCircuit(notCircuit, { A: true }).outputValues.out).toBe(false);
    expect(evaluateCircuit(notCircuit, { A: false }).outputValues.out).toBe(true);
  });

  it('evaluates XOR gate', () => {
    const xorCircuit: CircuitDefinition = {
      inputs: [
        { id: 'A', label: 'A' },
        { id: 'B', label: 'B' },
      ],
      gates: [{ id: 'x1', type: 'XOR', position: { x: 0, y: 0 }, inputs: ['A', 'B'] }],
      outputs: [{ id: 'out', label: 'Out', source: 'x1', position: { x: 0, y: 0 } }],
      wires: [],
    };
    expect(evaluateCircuit(xorCircuit, { A: true, B: true }).outputValues.out).toBe(false);
    expect(evaluateCircuit(xorCircuit, { A: true, B: false }).outputValues.out).toBe(true);
  });

  it('evaluates NAND gate', () => {
    const nandCircuit: CircuitDefinition = {
      inputs: [
        { id: 'A', label: 'A' },
        { id: 'B', label: 'B' },
      ],
      gates: [{ id: 'n1', type: 'NAND', position: { x: 0, y: 0 }, inputs: ['A', 'B'] }],
      outputs: [{ id: 'out', label: 'Out', source: 'n1', position: { x: 0, y: 0 } }],
      wires: [],
    };
    expect(evaluateCircuit(nandCircuit, { A: true, B: true }).outputValues.out).toBe(false);
    expect(evaluateCircuit(nandCircuit, { A: false, B: true }).outputValues.out).toBe(true);
  });

  it('evaluates NOR gate', () => {
    const norCircuit: CircuitDefinition = {
      inputs: [
        { id: 'A', label: 'A' },
        { id: 'B', label: 'B' },
      ],
      gates: [{ id: 'n1', type: 'NOR', position: { x: 0, y: 0 }, inputs: ['A', 'B'] }],
      outputs: [{ id: 'out', label: 'Out', source: 'n1', position: { x: 0, y: 0 } }],
      wires: [],
    };
    expect(evaluateCircuit(norCircuit, { A: false, B: false }).outputValues.out).toBe(true);
    expect(evaluateCircuit(norCircuit, { A: true, B: false }).outputValues.out).toBe(false);
  });
});

describe('computeGateDepths', () => {
  it('computes depths for multi-level circuit', () => {
    const depths = computeGateDepths(deMorganCircuit);
    expect(depths['notA']).toBe(1);
    expect(depths['notB']).toBe(1);
    expect(depths['orGate']).toBe(2);
  });

  it('computes depth 1 for single gate', () => {
    const depths = computeGateDepths(simpleAnd);
    expect(depths['g1']).toBe(1);
  });
});

describe('generateCircuitTruthTable', () => {
  it('generates all combinations for AND gate', () => {
    const rows = generateCircuitTruthTable(simpleAnd);
    expect(rows).toHaveLength(4);
    // FF=F, FT=F, TF=F, TT=T
    expect(rows[0].outputs.out).toBe(false);
    expect(rows[1].outputs.out).toBe(false);
    expect(rows[2].outputs.out).toBe(false);
    expect(rows[3].outputs.out).toBe(true);
  });

  it('generates table for De Morgan circuit', () => {
    const rows = generateCircuitTruthTable(deMorganCircuit);
    expect(rows).toHaveLength(4);
    // NOT(A AND B) equivalence
    expect(rows[0].outputs.out).toBe(true); // FF -> T
    expect(rows[1].outputs.out).toBe(true); // FT -> T
    expect(rows[2].outputs.out).toBe(true); // TF -> T
    expect(rows[3].outputs.out).toBe(false); // TT -> F
  });
});
