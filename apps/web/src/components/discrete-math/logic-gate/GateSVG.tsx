import { Show } from 'solid-js';
import { colors } from '../foundations/colors';
import type { GateType } from '../foundations/types';

export interface GateSVGProps {
  type: GateType;
  x: number;
  y: number;
  active?: boolean;
  selected?: boolean;
  label?: string;
  onClick?: () => void;
}

const GATE_WIDTH = 60;
const GATE_HEIGHT = 40;

// Standard IEEE-style gate path definitions (relative to gate center)
function gatePath(type: GateType): string {
  const w = GATE_WIDTH;
  const h = GATE_HEIGHT;
  const hw = w / 2;
  const hh = h / 2;

  switch (type) {
    case 'AND':
      // D-shape: flat left, curved right
      return `M ${-hw} ${-hh} L ${0} ${-hh} A ${hw} ${hh} 0 0 1 ${0} ${hh} L ${-hw} ${hh} Z`;
    case 'OR':
      // Curved shield shape
      return `M ${-hw} ${-hh} Q ${-hw / 3} ${-hh} ${hw} ${0} Q ${-hw / 3} ${hh} ${-hw} ${hh} Q ${-hw / 4} ${0} ${-hw} ${-hh}`;
    case 'NOT':
      // Triangle
      return `M ${-hw} ${-hh} L ${hw - 8} ${0} L ${-hw} ${hh} Z`;
    case 'XOR':
      // OR with extra input curve
      return `M ${-hw} ${-hh} Q ${-hw / 3} ${-hh} ${hw} ${0} Q ${-hw / 3} ${hh} ${-hw} ${hh} Q ${-hw / 4} ${0} ${-hw} ${-hh}`;
    case 'NAND':
      // AND with bubble
      return `M ${-hw} ${-hh} L ${0} ${-hh} A ${hw} ${hh} 0 0 1 ${0} ${hh} L ${-hw} ${hh} Z`;
    case 'NOR':
      // OR with bubble
      return `M ${-hw} ${-hh} Q ${-hw / 3} ${-hh} ${hw} ${0} Q ${-hw / 3} ${hh} ${-hw} ${hh} Q ${-hw / 4} ${0} ${-hw} ${-hh}`;
  }
}

// Input port positions relative to gate center
export function getInputPorts(type: GateType): { x: number; y: number }[] {
  const hw = GATE_WIDTH / 2;
  if (type === 'NOT') {
    return [{ x: -hw, y: 0 }];
  }
  return [
    { x: -hw, y: -10 },
    { x: -hw, y: 10 },
  ];
}

// Output port position relative to gate center
export function getOutputPort(type: GateType): { x: number; y: number } {
  const hw = GATE_WIDTH / 2;
  const hasNegationBubble = type === 'NOT' || type === 'NAND' || type === 'NOR';
  return { x: hw + (hasNegationBubble ? 8 : 0), y: 0 };
}

export function GateSVG(props: GateSVGProps) {
  const strokeColor = () => {
    if (props.selected) return colors.accentYellow;
    if (props.active) return colors.signalActive;
    return colors.accentCyan;
  };

  const fillColor = () => colors.bgTertiary;
  const hasNegationBubble = () => props.type === 'NOT' || props.type === 'NAND' || props.type === 'NOR';
  const hasExtraXorCurve = () => props.type === 'XOR';

  return (
    <g
      data-testid={`gate-${props.type.toLowerCase()}`}
      transform={`translate(${props.x}, ${props.y})`}
      onClick={props.onClick}
      style={{ cursor: props.onClick ? 'pointer' : 'default' }}
    >
      {/* Gate body */}
      <path
        d={gatePath(props.type)}
        fill={fillColor()}
        stroke={strokeColor()}
        stroke-width="2"
      />

      {/* XOR extra input curve */}
      <Show when={hasExtraXorCurve()}>
        <path
          d={`M ${-GATE_WIDTH / 2 - 6} ${-GATE_HEIGHT / 2} Q ${-GATE_WIDTH / 8 - 6} ${0} ${-GATE_WIDTH / 2 - 6} ${GATE_HEIGHT / 2}`}
          fill="none"
          stroke={strokeColor()}
          stroke-width="2"
        />
      </Show>

      {/* Negation bubble for NOT, NAND, NOR */}
      <Show when={hasNegationBubble()}>
        <circle
          cx={GATE_WIDTH / 2 + 4}
          cy={0}
          r={4}
          fill={fillColor()}
          stroke={strokeColor()}
          stroke-width="2"
        />
      </Show>

      {/* Input ports */}
      {getInputPorts(props.type).map((port) => (
        <circle
          cx={port.x}
          cy={port.y}
          r={3}
          fill={colors.bgSecondary}
          stroke={colors.fgMuted}
          stroke-width="1"
          class="gate-input-port"
        />
      ))}

      {/* Output port */}
      {(() => {
        const port = getOutputPort(props.type);
        return (
          <circle
            cx={port.x}
            cy={port.y}
            r={3}
            fill={colors.bgSecondary}
            stroke={colors.fgMuted}
            stroke-width="1"
            class="gate-output-port"
          />
        );
      })()}

      {/* Gate label */}
      <text
        x={0}
        y={GATE_HEIGHT / 2 + 14}
        text-anchor="middle"
        font-size="10"
        fill={colors.fgMuted}
        font-family="Inconsolata, monospace"
      >
        {props.label ?? props.type}
      </text>
    </g>
  );
}

export default GateSVG;
