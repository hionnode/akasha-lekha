// Shared TypeScript interfaces for discrete math interactive components.

export interface StepState {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export type GateType = 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR';

export interface CircuitDefinition {
  inputs: { id: string; label: string; defaultValue?: boolean }[];
  gates: {
    id: string;
    type: GateType;
    position: Point;
    inputs: string[];
  }[];
  outputs: {
    id: string;
    label: string;
    source: string;
    position: Point;
  }[];
  wires: { from: string; to: string; toPort: number }[];
}

export type InferenceRule =
  | 'modus-ponens'
  | 'modus-tollens'
  | 'hypothetical-syllogism'
  | 'disjunctive-syllogism'
  | 'addition'
  | 'simplification'
  | 'conjunction'
  | 'resolution'
  | 'double-negation'
  | 'de-morgans'
  | 'distributive'
  | 'commutative'
  | 'associative'
  | 'identity'
  | 'complement'
  | 'absorption'
  | 'premise'
  | 'assumption';

export interface ProofStep {
  lineNumber: number;
  statement: string;
  justification: string;
  rule?: InferenceRule;
  highlightPrevious?: number[];
}

export interface ProofDefinition {
  title: string;
  statement: string;
  premises: string[];
  steps: ProofStep[];
  conclusion: string;
  qed?: boolean;
}
