import { createSignal, For, Show, onMount, onCleanup } from 'solid-js';
import { colors } from '../foundations/colors';
import { useAnime } from '../foundations/useAnime';
import { DiagramContainer } from '../foundations/DiagramContainer';
import { GateSVG, getInputPorts, getOutputPort } from './GateSVG';
import { WirePath } from './WirePath';
import { GatePalette } from './GatePalette';
import { evaluateCircuit, computeGateDepths } from './circuit-evaluator';
import type { GateType, CircuitDefinition, Point } from '../foundations/types';

export interface LogicGateEditorProps {
  preset?: CircuitDefinition;
  editable?: boolean;
  showTruthTable?: boolean;
  animateSignals?: boolean;
}

interface PlacedGate {
  id: string;
  type: GateType;
  position: Point;
  inputs: string[];
}

interface Wire {
  from: string;
  to: string;
  toPort: number;
}

let gateCounter = 0;

export function LogicGateEditor(props: LogicGateEditorProps) {
  const editable = () => props.editable ?? true;
  const animateSignals = () => props.animateSignals ?? true;
  const { animate } = useAnime();

  // Circuit state
  const [inputs, setInputs] = createSignal<{ id: string; label: string; defaultValue?: boolean }[]>(
    props.preset?.inputs ?? [
      { id: 'A', label: 'A', defaultValue: false },
      { id: 'B', label: 'B', defaultValue: false },
    ],
  );
  const [gates, setGates] = createSignal<PlacedGate[]>(
    props.preset?.gates.map((g) => ({ ...g })) ?? [],
  );
  const [outputs, setOutputs] = createSignal(
    props.preset?.outputs ?? [],
  );
  const [wires, setWires] = createSignal<Wire[]>(
    props.preset?.wires.map((w) => ({ ...w })) ?? [],
  );

  // Input values
  const [inputValues, setInputValues] = createSignal<Record<string, boolean>>(
    (() => {
      const vals: Record<string, boolean> = {};
      for (const inp of (props.preset?.inputs ?? [
        { id: 'A', label: 'A', defaultValue: false },
        { id: 'B', label: 'B', defaultValue: false },
      ])) {
        vals[inp.id] = inp.defaultValue ?? false;
      }
      return vals;
    })(),
  );

  // Selection
  const [selectedGate, setSelectedGate] = createSignal<string | null>(null);

  // Wire drawing state
  const [wireStart, setWireStart] = createSignal<string | null>(null);

  // Dragging state
  const [dragging, setDragging] = createSignal<{ gateId: string; offsetX: number; offsetY: number } | null>(null);

  // Evaluation
  const [evaluationResult, setEvaluationResult] = createSignal<Record<string, boolean>>({});
  const [animatingSignals, setAnimatingSignals] = createSignal(false);

  function buildCircuitDef(): CircuitDefinition {
    return {
      inputs: inputs(),
      gates: gates().map((g) => ({
        id: g.id,
        type: g.type,
        position: g.position,
        inputs: g.inputs,
      })),
      outputs: outputs(),
      wires: wires(),
    };
  }

  function runEvaluation() {
    const circuit = buildCircuitDef();
    if (circuit.gates.length === 0) {
      setEvaluationResult({});
      return;
    }

    try {
      const result = evaluateCircuit(circuit, inputValues());
      const allValues = { ...inputValues(), ...result.gateValues, ...result.outputValues };
      setEvaluationResult(allValues);

      if (animateSignals()) {
        animateSignalPropagation(circuit);
      }
    } catch {
      // Circuit may be incomplete; ignore errors
    }
  }

  async function animateSignalPropagation(circuit: CircuitDefinition) {
    setAnimatingSignals(true);
    try {
      const depths = computeGateDepths(circuit);
      const maxDepth = Math.max(0, ...Object.values(depths));

      for (let depth = 1; depth <= maxDepth; depth++) {
        const gatesAtDepth = circuit.gates.filter((g) => depths[g.id] === depth);
        for (const gate of gatesAtDepth) {
          const el = document.querySelector(`[data-testid="gate-${gate.type.toLowerCase()}-${gate.id}"]`);
          if (el) {
            await animate(el, {
              scale: [1, 1.05, 1],
              duration: 200,
            });
          }
        }
      }
    } finally {
      setAnimatingSignals(false);
    }
  }

  // Initialize evaluation
  onMount(() => {
    if (gates().length > 0) {
      runEvaluation();
    }
  });

  function toggleInput(id: string) {
    setInputValues((prev) => ({ ...prev, [id]: !prev[id] }));
    runEvaluation();
  }

  function addGate(type: GateType) {
    const id = `gate_${++gateCounter}`;
    const newGate: PlacedGate = {
      id,
      type,
      position: { x: 250 + Math.random() * 100, y: 80 + Math.random() * 200 },
      inputs: [],
    };
    setGates((prev) => [...prev, newGate]);

    // Auto-add output if this is the first gate
    if (outputs().length === 0) {
      setOutputs([{
        id: 'out',
        label: 'Output',
        source: id,
        position: { x: newGate.position.x + 120, y: newGate.position.y },
      }]);
    }
  }

  function deleteSelectedGate() {
    const sel = selectedGate();
    if (!sel) return;

    setGates((prev) => prev.filter((g) => g.id !== sel));
    setWires((prev) => prev.filter((w) => w.from !== sel && w.to !== sel));
    // Update gates that referenced the deleted gate
    setGates((prev) =>
      prev.map((g) => ({
        ...g,
        inputs: g.inputs.filter((i) => i !== sel),
      })),
    );
    // Update outputs that referenced the deleted gate
    setOutputs((prev) => prev.filter((o) => o.source !== sel));
    setSelectedGate(null);
    runEvaluation();
  }

  function handleGateClick(gateId: string) {
    const ws = wireStart();
    if (ws) {
      // Complete wire connection
      const gate = gates().find((g) => g.id === gateId);
      if (gate && ws !== gateId) {
        const maxInputs = gate.type === 'NOT' ? 1 : 2;
        if (gate.inputs.length < maxInputs) {
          setGates((prev) =>
            prev.map((g) =>
              g.id === gateId ? { ...g, inputs: [...g.inputs, ws] } : g,
            ),
          );
          setWires((prev) => [...prev, { from: ws, to: gateId, toPort: gate.inputs.length }]);
          runEvaluation();
        }
      }
      setWireStart(null);
    } else {
      setSelectedGate((prev) => (prev === gateId ? null : gateId));
    }
  }

  function startWireFromInput(inputId: string) {
    setWireStart(inputId);
    setSelectedGate(null);
  }

  function startWireFromGate(gateId: string) {
    setWireStart(gateId);
    setSelectedGate(null);
  }

  // Gate positions for wires
  function getNodePosition(nodeId: string): Point {
    const input = inputs().find((i) => i.id === nodeId);
    if (input) {
      const idx = inputs().indexOf(input);
      return { x: 60, y: 80 + idx * 80 };
    }

    const gate = gates().find((g) => g.id === nodeId);
    if (gate) {
      const outPort = getOutputPort(gate.type);
      return { x: gate.position.x + outPort.x, y: gate.position.y + outPort.y };
    }

    return { x: 0, y: 0 };
  }

  function getGateInputPosition(gateId: string, portIndex: number): Point {
    const gate = gates().find((g) => g.id === gateId);
    if (!gate) return { x: 0, y: 0 };
    const ports = getInputPorts(gate.type);
    const port = ports[portIndex] ?? ports[0];
    return { x: gate.position.x + port.x, y: gate.position.y + port.y };
  }

  function isNodeActive(nodeId: string): boolean {
    return evaluationResult()[nodeId] ?? false;
  }

  // Mouse handlers for dragging
  function handleCanvasMouseDown(e: MouseEvent) {
    if (wireStart()) {
      setWireStart(null);
      return;
    }
    setSelectedGate(null);
  }

  function handleGateMouseDown(e: MouseEvent, gateId: string) {
    if (!editable()) return;
    e.stopPropagation();
    const gate = gates().find((g) => g.id === gateId);
    if (!gate) return;

    const svg = (e.currentTarget as Element).closest('svg');
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()!.inverse());

    setDragging({
      gateId,
      offsetX: svgP.x - gate.position.x,
      offsetY: svgP.y - gate.position.y,
    });
  }

  function handleMouseMove(e: MouseEvent) {
    const d = dragging();
    if (!d) return;

    const svg = (e.currentTarget as Element);
    if (!svg || svg.tagName !== 'svg') return;
    const pt = (svg as SVGSVGElement).createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform((svg as SVGSVGElement).getScreenCTM()!.inverse());

    const newX = svgP.x - d.offsetX;
    const newY = svgP.y - d.offsetY;

    setGates((prev) =>
      prev.map((g) =>
        g.id === d.gateId ? { ...g, position: { x: newX, y: newY } } : g,
      ),
    );
  }

  function handleMouseUp() {
    setDragging(null);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedGate()) {
      e.preventDefault();
      deleteSelectedGate();
    }
  }

  onMount(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', handleKeyDown);
    }
  });

  onCleanup(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', handleKeyDown);
    }
  });

  return (
    <div data-testid="logic-gate-editor" class="rounded-lg border border-border bg-bg-primary overflow-hidden">
      <div class="flex">
        {/* Gate palette sidebar */}
        <Show when={editable()}>
          <div class="w-28 border-r border-border p-2 bg-bg-secondary flex-shrink-0">
            <GatePalette onSelectGate={addGate} />
            <Show when={selectedGate()}>
              <button
                onClick={deleteSelectedGate}
                class="mt-3 w-full px-2 py-1 text-xs text-accent-red bg-accent-red/10 rounded hover:bg-accent-red/20 transition-colors"
                aria-label="Delete selected gate"
              >
                Delete
              </button>
            </Show>
          </div>
        </Show>

        {/* Canvas */}
        <div class="flex-1">
          <DiagramContainer width={600} height={400} fallbackText="Enable JavaScript to use the logic gate editor.">
            {/* SVG event listeners are on the parent */}
            <rect
              width="600"
              height="400"
              fill="transparent"
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />

            {/* Input switches */}
            <For each={inputs()}>
              {(input, idx) => {
                const y = () => 80 + idx() * 80;
                const active = () => inputValues()[input.id] ?? false;
                return (
                  <g
                    data-testid={`input-${input.id}`}
                    transform={`translate(30, ${y()})`}
                    onClick={() => toggleInput(input.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect
                      x={-18}
                      y={-14}
                      width={36}
                      height={28}
                      rx={4}
                      fill={active() ? `${colors.signalActive}20` : colors.bgTertiary}
                      stroke={active() ? colors.signalActive : colors.fgMuted}
                      stroke-width="1.5"
                    />
                    <text
                      x={0}
                      y={1}
                      text-anchor="middle"
                      dominant-baseline="middle"
                      font-size="11"
                      font-family="Inconsolata, monospace"
                      font-weight="bold"
                      fill={active() ? colors.signalActive : colors.fgMuted}
                    >
                      {input.label}
                    </text>
                    <text
                      x={0}
                      y={22}
                      text-anchor="middle"
                      font-size="9"
                      font-family="Inconsolata, monospace"
                      fill={active() ? colors.truthTrue : colors.truthFalse}
                    >
                      {active() ? '1' : '0'}
                    </text>
                    {/* Connection handle */}
                    <circle
                      cx={24}
                      cy={0}
                      r={4}
                      fill={active() ? colors.signalActive : colors.signalInactive}
                      stroke={colors.fgMuted}
                      stroke-width="1"
                      onClick={(e) => {
                        e.stopPropagation();
                        startWireFromInput(input.id);
                      }}
                      style={{ cursor: 'crosshair' }}
                    />
                  </g>
                );
              }}
            </For>

            {/* Wires */}
            <For each={wires()}>
              {(wire, idx) => {
                const fromPos = () => getNodePosition(wire.from);
                const toPos = () => getGateInputPosition(wire.to, wire.toPort);
                return (
                  <WirePath
                    fromX={fromPos().x}
                    fromY={fromPos().y}
                    toX={toPos().x}
                    toY={toPos().y}
                    active={isNodeActive(wire.from)}
                    animated={animateSignals() && animatingSignals()}
                    id={`${wire.from}-${wire.to}-${idx()}`}
                  />
                );
              }}
            </For>

            {/* Gates */}
            <For each={gates()}>
              {(gate) => (
                <g
                  data-testid={`gate-${gate.type.toLowerCase()}-${gate.id}`}
                  onMouseDown={(e) => handleGateMouseDown(e, gate.id)}
                  style={{ cursor: editable() ? 'grab' : 'default' }}
                >
                  <GateSVG
                    type={gate.type}
                    x={gate.position.x}
                    y={gate.position.y}
                    active={isNodeActive(gate.id)}
                    selected={selectedGate() === gate.id}
                    onClick={() => handleGateClick(gate.id)}
                  />
                  {/* Output connection handle */}
                  <Show when={editable()}>
                    {(() => {
                      const outPort = getOutputPort(gate.type);
                      return (
                        <circle
                          cx={gate.position.x + outPort.x + 6}
                          cy={gate.position.y + outPort.y}
                          r={4}
                          fill={isNodeActive(gate.id) ? colors.signalActive : colors.signalInactive}
                          stroke={colors.fgMuted}
                          stroke-width="1"
                          onClick={(e) => {
                            e.stopPropagation();
                            startWireFromGate(gate.id);
                          }}
                          style={{ cursor: 'crosshair' }}
                        />
                      );
                    })()}
                  </Show>
                </g>
              )}
            </For>

            {/* Output indicators */}
            <For each={outputs()}>
              {(output) => {
                const active = () => evaluationResult()[output.source] ?? false;
                return (
                  <g data-testid={`output-${output.id}`} transform={`translate(${output.position.x}, ${output.position.y})`}>
                    <rect
                      x={-20}
                      y={-14}
                      width={40}
                      height={28}
                      rx={4}
                      fill={active() ? `${colors.signalActive}20` : colors.bgTertiary}
                      stroke={active() ? colors.signalActive : colors.fgMuted}
                      stroke-width="1.5"
                    />
                    <text
                      x={0}
                      y={1}
                      text-anchor="middle"
                      dominant-baseline="middle"
                      font-size="11"
                      font-family="Inconsolata, monospace"
                      font-weight="bold"
                      fill={active() ? colors.signalActive : colors.fgMuted}
                    >
                      {output.label.length > 4 ? 'Out' : output.label}
                    </text>
                    <text
                      x={0}
                      y={22}
                      text-anchor="middle"
                      font-size="9"
                      font-family="Inconsolata, monospace"
                      fill={active() ? colors.truthTrue : colors.truthFalse}
                    >
                      {active() ? '1' : '0'}
                    </text>
                  </g>
                );
              }}
            </For>

            {/* Wire drawing indicator */}
            <Show when={wireStart()}>
              <text
                x={300}
                y={385}
                text-anchor="middle"
                font-size="11"
                font-family="Inconsolata, monospace"
                fill={colors.accentYellow}
              >
                Click a gate input to connect · Click canvas to cancel
              </text>
            </Show>
          </DiagramContainer>
        </div>
      </div>

      {/* Status bar */}
      <div class="flex items-center justify-between px-3 py-1.5 border-t border-border text-xs text-fg-muted bg-bg-secondary">
        <span>
          {gates().length} gate{gates().length !== 1 ? 's' : ''} · {wires().length} wire{wires().length !== 1 ? 's' : ''}
        </span>
        <Show when={editable()}>
          <span class="text-fg-muted/60">
            Click gate in palette to add · Drag to move · Del to remove
          </span>
        </Show>
      </div>

      <noscript>
        <div class="p-4 text-center text-fg-muted text-sm">
          Enable JavaScript to use the logic gate editor.
        </div>
      </noscript>
    </div>
  );
}

export default LogicGateEditor;
