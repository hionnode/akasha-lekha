import { render, screen, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import { ProofStepper } from './ProofStepper';
import { modusPonensExample } from './proof-data';

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

describe('ProofStepper', () => {
  it('renders proof title', () => {
    render(() => <ProofStepper proof={modusPonensExample} animate={false} />);
    expect(screen.getByText('Modus Ponens')).toBeInTheDocument();
  });

  it('renders proof statement', () => {
    render(() => <ProofStepper proof={modusPonensExample} animate={false} />);
    const statement = screen.getByText(/^From "If it rains/);
    expect(statement).toBeInTheDocument();
  });

  it('renders premises section', () => {
    render(() => <ProofStepper proof={modusPonensExample} animate={false} />);
    expect(screen.getByText('Premises:')).toBeInTheDocument();
  });

  it('renders step controller', () => {
    render(() => <ProofStepper proof={modusPonensExample} animate={false} />);
    expect(screen.getByTestId('step-controller')).toBeInTheDocument();
  });

  it('initially shows first step only', () => {
    render(() => <ProofStepper proof={modusPonensExample} animate={false} />);
    // Step 1 should be visible
    expect(screen.getByTestId('proof-step-1')).toBeInTheDocument();
    // Conclusion should not be visible yet
    expect(screen.queryByText('Therefore:')).not.toBeInTheDocument();
  });

  it('shows next step when stepping forward', async () => {
    render(() => <ProofStepper proof={modusPonensExample} animate={false} />);

    // Click step forward
    await fireEvent.click(screen.getByLabelText('Step forward'));

    // Step 2 should now be visible
    expect(screen.getByTestId('proof-step-2')).toBeInTheDocument();
  });

  it('shows conclusion after all steps', async () => {
    render(() => <ProofStepper proof={modusPonensExample} animate={false} />);

    // Go to last step
    await fireEvent.click(screen.getByLabelText('Go to last step'));

    // Conclusion should be visible
    expect(screen.getByText(/Therefore/)).toBeInTheDocument();
  });

  it('shows QED marker when qed is true', async () => {
    render(() => <ProofStepper proof={modusPonensExample} animate={false} />);
    await fireEvent.click(screen.getByLabelText('Go to last step'));
    expect(screen.getByLabelText('QED')).toBeInTheDocument();
  });

  it('displays step count', () => {
    render(() => <ProofStepper proof={modusPonensExample} animate={false} />);
    // modusPonens has 3 steps + 1 conclusion = 4 total
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
  });
});
