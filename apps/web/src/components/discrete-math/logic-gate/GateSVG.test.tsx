import { render, screen } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import { GateSVG, getInputPorts, getOutputPort } from './GateSVG';

function renderGate(type: Parameters<typeof GateSVG>[0]['type'], overrides = {}) {
  render(() => (
    <svg>
      <GateSVG type={type} x={100} y={100} {...overrides} />
    </svg>
  ));
}

describe('GateSVG', () => {
  it('renders AND gate', () => {
    renderGate('AND');
    expect(screen.getByTestId('gate-and')).toBeInTheDocument();
  });

  it('renders OR gate', () => {
    renderGate('OR');
    expect(screen.getByTestId('gate-or')).toBeInTheDocument();
  });

  it('renders NOT gate', () => {
    renderGate('NOT');
    expect(screen.getByTestId('gate-not')).toBeInTheDocument();
  });

  it('renders XOR gate', () => {
    renderGate('XOR');
    expect(screen.getByTestId('gate-xor')).toBeInTheDocument();
  });

  it('renders NAND gate', () => {
    renderGate('NAND');
    expect(screen.getByTestId('gate-nand')).toBeInTheDocument();
  });

  it('renders NOR gate', () => {
    renderGate('NOR');
    expect(screen.getByTestId('gate-nor')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    renderGate('AND', { label: 'My Gate' });
    expect(screen.getByText('My Gate')).toBeInTheDocument();
  });

  it('defaults label to gate type', () => {
    renderGate('OR');
    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    renderGate('AND', { onClick });
    const gate = screen.getByTestId('gate-and');
    gate.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).toHaveBeenCalled();
  });
});

describe('getInputPorts', () => {
  it('returns 1 port for NOT', () => {
    expect(getInputPorts('NOT')).toHaveLength(1);
  });

  it('returns 2 ports for AND', () => {
    expect(getInputPorts('AND')).toHaveLength(2);
  });

  it('returns 2 ports for OR', () => {
    expect(getInputPorts('OR')).toHaveLength(2);
  });
});

describe('getOutputPort', () => {
  it('returns output port with offset for NOT', () => {
    const port = getOutputPort('NOT');
    expect(port.x).toBeGreaterThan(30); // has negation bubble offset
    expect(port.y).toBe(0);
  });

  it('returns output port without offset for AND', () => {
    const port = getOutputPort('AND');
    expect(port.x).toBe(30); // GATE_WIDTH / 2 = 30
  });
});
