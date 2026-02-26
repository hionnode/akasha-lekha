// Circuit evaluator with topological sort for gate-level logic.
// Pure logic — no UI dependencies.

import type { GateType, CircuitDefinition } from '../foundations/types';

export interface EvaluationResult {
  gateValues: Record<string, boolean>;
  outputValues: Record<string, boolean>;
  evaluationOrder: string[];
}

function evaluateGate(type: GateType, inputs: boolean[]): boolean {
  switch (type) {
    case 'AND':
      return inputs.every(Boolean);
    case 'OR':
      return inputs.some(Boolean);
    case 'NOT':
      return !inputs[0];
    case 'XOR':
      return inputs.reduce((a, b) => a !== b, false);
    case 'NAND':
      return !inputs.every(Boolean);
    case 'NOR':
      return !inputs.some(Boolean);
  }
}

// Build adjacency and resolve evaluation order via topological sort.
export function topologicalSort(circuit: CircuitDefinition): string[] {
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  // Initialize all gates
  for (const gate of circuit.gates) {
    inDegree.set(gate.id, 0);
    adjacency.set(gate.id, []);
  }

  // Build edges: for each gate, its inputs may come from other gates
  const gateIds = new Set(circuit.gates.map((g) => g.id));

  for (const gate of circuit.gates) {
    for (const inputId of gate.inputs) {
      if (gateIds.has(inputId)) {
        // inputId gate feeds into this gate
        adjacency.get(inputId)!.push(gate.id);
        inDegree.set(gate.id, (inDegree.get(gate.id) ?? 0) + 1);
      }
      // Inputs from circuit inputs don't add dependencies
    }
  }

  // Kahn's algorithm
  const queue: string[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  const order: string[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    for (const neighbor of adjacency.get(node) ?? []) {
      const newDeg = (inDegree.get(neighbor) ?? 1) - 1;
      inDegree.set(neighbor, newDeg);
      if (newDeg === 0) queue.push(neighbor);
    }
  }

  if (order.length !== circuit.gates.length) {
    throw new Error('Circuit contains a cycle');
  }

  return order;
}

export function evaluateCircuit(
  circuit: CircuitDefinition,
  inputValues: Record<string, boolean>
): EvaluationResult {
  const order = topologicalSort(circuit);
  const values: Record<string, boolean> = { ...inputValues };

  // Evaluate gates in topological order
  for (const gateId of order) {
    const gate = circuit.gates.find((g) => g.id === gateId)!;
    const gateInputs = gate.inputs.map((inputId) => {
      if (inputId in values) return values[inputId];
      throw new Error(`Gate ${gateId} references unknown input: ${inputId}`);
    });
    values[gateId] = evaluateGate(gate.type, gateInputs);
  }

  // Collect gate values
  const gateValues: Record<string, boolean> = {};
  for (const gate of circuit.gates) {
    gateValues[gate.id] = values[gate.id];
  }

  // Collect output values
  const outputValues: Record<string, boolean> = {};
  for (const output of circuit.outputs) {
    if (output.source in values) {
      outputValues[output.id] = values[output.source];
    } else {
      throw new Error(`Output ${output.id} references unknown source: ${output.source}`);
    }
  }

  return { gateValues, outputValues, evaluationOrder: order };
}

// Compute the depth (level) of each gate for staggered animation timing.
export function computeGateDepths(circuit: CircuitDefinition): Record<string, number> {
  const _gateIds = new Set(circuit.gates.map((g) => g.id));
  const depths: Record<string, number> = {};

  // Input nodes have depth 0
  for (const input of circuit.inputs) {
    depths[input.id] = 0;
  }

  const order = topologicalSort(circuit);
  for (const gateId of order) {
    const gate = circuit.gates.find((g) => g.id === gateId)!;
    let maxInputDepth = 0;
    for (const inputId of gate.inputs) {
      if (inputId in depths) {
        maxInputDepth = Math.max(maxInputDepth, depths[inputId]);
      }
    }
    depths[gateId] = maxInputDepth + 1;
  }

  return depths;
}

// Generate a truth table for a circuit by evaluating all input combinations.
export function generateCircuitTruthTable(
  circuit: CircuitDefinition
): { inputs: Record<string, boolean>; outputs: Record<string, boolean> }[] {
  const inputIds = circuit.inputs.map((i) => i.id);
  const total = 1 << inputIds.length;
  const rows: { inputs: Record<string, boolean>; outputs: Record<string, boolean> }[] = [];

  for (let i = 0; i < total; i++) {
    const inputValues: Record<string, boolean> = {};
    for (let j = 0; j < inputIds.length; j++) {
      inputValues[inputIds[j]] = Boolean((i >> (inputIds.length - 1 - j)) & 1);
    }
    const result = evaluateCircuit(circuit, inputValues);
    rows.push({ inputs: inputValues, outputs: result.outputValues });
  }

  return rows;
}
