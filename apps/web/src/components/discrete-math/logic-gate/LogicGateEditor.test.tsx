import { render, screen, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import { LogicGateEditor } from './LogicGateEditor';
import type { CircuitDefinition } from '../foundations/types';

vi.mock('animejs', () => ({
  animate: vi.fn(() => ({
    play: vi.fn(),
    pause: vi.fn(),
    cancel: vi.fn(),
  })),
  createTimeline: vi.fn(() => ({
    add: vi.fn().mockReturnThis(),
    play: vi.fn(),
    pause: vi.fn(),
    cancel: vi.fn(),
  })),
  stagger: vi.fn((val: number) => (_el: Element, i: number) => val * i),
}));

const simpleAndPreset: CircuitDefinition = {
  inputs: [
    { id: 'A', label: 'A', defaultValue: false },
    { id: 'B', label: 'B', defaultValue: false },
  ],
  gates: [{ id: 'g1', type: 'AND', position: { x: 200, y: 100 }, inputs: ['A', 'B'] }],
  outputs: [{ id: 'out', label: 'Output', source: 'g1', position: { x: 350, y: 100 } }],
  wires: [
    { from: 'A', to: 'g1', toPort: 0 },
    { from: 'B', to: 'g1', toPort: 1 },
  ],
};

describe('LogicGateEditor', () => {
  it('renders the editor', () => {
    render(() => <LogicGateEditor />);
    expect(screen.getByTestId('logic-gate-editor')).toBeInTheDocument();
  });

  it('renders gate palette when editable', () => {
    render(() => <LogicGateEditor editable />);
    expect(screen.getByTestId('gate-palette')).toBeInTheDocument();
  });

  it('hides gate palette when not editable', () => {
    render(() => <LogicGateEditor editable={false} />);
    expect(screen.queryByTestId('gate-palette')).not.toBeInTheDocument();
  });

  it('renders preset circuit inputs', () => {
    render(() => <LogicGateEditor preset={simpleAndPreset} editable={false} />);
    expect(screen.getByTestId('input-A')).toBeInTheDocument();
    expect(screen.getByTestId('input-B')).toBeInTheDocument();
  });

  it('renders preset circuit output', () => {
    render(() => <LogicGateEditor preset={simpleAndPreset} editable={false} />);
    expect(screen.getByTestId('output-out')).toBeInTheDocument();
  });

  it('toggles input when clicked', async () => {
    render(() => <LogicGateEditor preset={simpleAndPreset} editable={false} animateSignals={false} />);
    const inputA = screen.getByTestId('input-A');
    // Initially shows 0
    expect(inputA.textContent).toContain('0');

    await fireEvent.click(inputA);
    // After click shows 1
    expect(inputA.textContent).toContain('1');
  });

  it('shows gate count in status bar', () => {
    render(() => <LogicGateEditor preset={simpleAndPreset} editable={false} />);
    expect(screen.getByText(/1 gate/)).toBeInTheDocument();
    expect(screen.getByText(/2 wires/)).toBeInTheDocument();
  });

  it('adds gate when palette item clicked', async () => {
    render(() => <LogicGateEditor editable animateSignals={false} />);
    await fireEvent.click(screen.getByTestId('palette-and'));
    // Should now show 1 gate
    expect(screen.getByText(/1 gate/)).toBeInTheDocument();
  });

  it('renders default inputs A and B', () => {
    render(() => <LogicGateEditor editable />);
    expect(screen.getByTestId('input-A')).toBeInTheDocument();
    expect(screen.getByTestId('input-B')).toBeInTheDocument();
  });
});
