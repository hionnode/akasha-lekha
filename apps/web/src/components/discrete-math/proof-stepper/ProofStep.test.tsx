import { render, screen } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';
import { ProofStep } from './ProofStep';
import type { ProofStep as ProofStepType } from '../foundations/types';

const sampleStep: ProofStepType = {
  lineNumber: 3,
  statement: 'q',
  justification: 'Modus Ponens (1, 2)',
  rule: 'modus-ponens',
  highlightPrevious: [1, 2],
};

describe('ProofStep', () => {
  it('renders step with line number', () => {
    render(() => <ProofStep step={sampleStep} />);
    expect(screen.getByTestId('proof-step-3')).toBeInTheDocument();
    expect(screen.getByText('3.')).toBeInTheDocument();
  });

  it('renders statement', () => {
    render(() => <ProofStep step={sampleStep} />);
    expect(screen.getByText('q')).toBeInTheDocument();
  });

  it('renders justification', () => {
    render(() => <ProofStep step={sampleStep} />);
    expect(screen.getByText('Modus Ponens (1, 2)')).toBeInTheDocument();
  });

  it('renders rule badge when rule is provided', () => {
    render(() => <ProofStep step={sampleStep} />);
    expect(screen.getByTestId('rule-badge-modus-ponens')).toBeInTheDocument();
  });

  it('does not render rule badge when rule is absent', () => {
    const stepNoRule: ProofStepType = {
      lineNumber: 1,
      statement: 'something',
      justification: 'Given',
    };
    render(() => <ProofStep step={stepNoRule} />);
    expect(screen.queryByTestId(/rule-badge/)).not.toBeInTheDocument();
  });

  it('applies highlight styling when highlighted', () => {
    render(() => <ProofStep step={sampleStep} highlighted />);
    const el = screen.getByTestId('proof-step-3');
    expect(el.className).toContain('bg-accent-blue');
  });

  it('applies conclusion styling when isConclusion', () => {
    render(() => <ProofStep step={sampleStep} isConclusion />);
    const el = screen.getByTestId('proof-step-3');
    expect(el.className).toContain('bg-accent-green');
  });

  it('is hidden when visible is false', () => {
    render(() => <ProofStep step={sampleStep} visible={false} />);
    expect(screen.queryByTestId('proof-step-3')).not.toBeInTheDocument();
  });

  it('is visible by default', () => {
    render(() => <ProofStep step={sampleStep} />);
    expect(screen.getByTestId('proof-step-3')).toBeInTheDocument();
  });
});
