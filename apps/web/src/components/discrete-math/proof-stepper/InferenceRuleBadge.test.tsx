import { render, screen } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';
import { InferenceRuleBadge } from './InferenceRuleBadge';

describe('InferenceRuleBadge', () => {
  it('renders modus ponens badge', () => {
    render(() => <InferenceRuleBadge rule="modus-ponens" />);
    expect(screen.getByTestId('rule-badge-modus-ponens')).toBeInTheDocument();
    expect(screen.getByText('Modus Ponens')).toBeInTheDocument();
  });

  it('renders de morgans badge', () => {
    render(() => <InferenceRuleBadge rule="de-morgans" />);
    expect(screen.getByText("De Morgan's")).toBeInTheDocument();
  });

  it('renders premise badge', () => {
    render(() => <InferenceRuleBadge rule="premise" />);
    expect(screen.getByText('Premise')).toBeInTheDocument();
  });

  it('renders assumption badge', () => {
    render(() => <InferenceRuleBadge rule="assumption" />);
    expect(screen.getByText('Assumption')).toBeInTheDocument();
  });

  it('uses blue color for propositional rules', () => {
    render(() => <InferenceRuleBadge rule="modus-ponens" />);
    const badge = screen.getByTestId('rule-badge-modus-ponens');
    expect(badge.className).toContain('text-accent-blue');
  });

  it('uses green color for algebraic rules', () => {
    render(() => <InferenceRuleBadge rule="distributive" />);
    const badge = screen.getByTestId('rule-badge-distributive');
    expect(badge.className).toContain('text-accent-green');
  });

  it('uses purple color for structural rules', () => {
    render(() => <InferenceRuleBadge rule="premise" />);
    const badge = screen.getByTestId('rule-badge-premise');
    expect(badge.className).toContain('text-accent-purple');
  });

  it('applies custom class', () => {
    render(() => <InferenceRuleBadge rule="premise" class="my-class" />);
    const badge = screen.getByTestId('rule-badge-premise');
    expect(badge.className).toContain('my-class');
  });
});
