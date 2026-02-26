// Barrel export for discrete math interactive components.

// Foundation
export { DiagramContainer } from './foundations/DiagramContainer';
export { StepController } from './foundations/StepController';
export { useAnime } from './foundations/useAnime';
export { useStepController } from './foundations/useStepController';
export { colors } from './foundations/colors';

// Truth Table
export { TruthTable } from './truth-table/TruthTable';
export { FormulaInput } from './truth-table/FormulaInput';
export { TableRenderer } from './truth-table/TableRenderer';
export * as truthTablePresets from './truth-table/presets';

// Logic Gate Editor
export { LogicGateEditor } from './logic-gate/LogicGateEditor';
export { GateSVG } from './logic-gate/GateSVG';
export { WirePath } from './logic-gate/WirePath';
export { GatePalette } from './logic-gate/GatePalette';
export * as logicGatePresets from './logic-gate/presets';

// Proof Stepper
export { ProofStepper } from './proof-stepper/ProofStepper';
export { ProofStep } from './proof-stepper/ProofStep';
export { InferenceRuleBadge } from './proof-stepper/InferenceRuleBadge';
export * as proofData from './proof-stepper/proof-data';

// Types
export type {
  StepState,
  Point,
  Dimensions,
  GateType,
  CircuitDefinition,
  InferenceRule,
  ProofStep as ProofStepType,
  ProofDefinition,
} from './foundations/types';
