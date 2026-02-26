import { render, screen, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import { StepController } from './StepController';

function renderController(overrides: Partial<Parameters<typeof StepController>[0]> = {}) {
  const props = {
    currentStep: 2,
    totalSteps: 5,
    isPlaying: false,
    onStepForward: vi.fn(),
    onStepBack: vi.fn(),
    onGoToFirst: vi.fn(),
    onGoToLast: vi.fn(),
    onTogglePlay: vi.fn(),
    ...overrides,
  };
  render(() => <StepController {...props} />);
  return props;
}

describe('StepController', () => {
  it('renders step count', () => {
    renderController({ currentStep: 2, totalSteps: 5 });
    expect(screen.getByText('Step 3 of 5')).toBeInTheDocument();
  });

  it('shows play button when not playing', () => {
    renderController({ isPlaying: false });
    expect(screen.getByLabelText('Play')).toBeInTheDocument();
  });

  it('shows pause button when playing', () => {
    renderController({ isPlaying: true });
    expect(screen.getByLabelText('Pause')).toBeInTheDocument();
  });

  it('disables back buttons at step 0', () => {
    renderController({ currentStep: 0 });
    expect(screen.getByLabelText('Go to first step')).toBeDisabled();
    expect(screen.getByLabelText('Step back')).toBeDisabled();
  });

  it('disables forward buttons at last step', () => {
    renderController({ currentStep: 4, totalSteps: 5 });
    expect(screen.getByLabelText('Go to last step')).toBeDisabled();
    expect(screen.getByLabelText('Step forward')).toBeDisabled();
  });

  it('calls onStepForward when forward button clicked', async () => {
    const props = renderController();
    await fireEvent.click(screen.getByLabelText('Step forward'));
    expect(props.onStepForward).toHaveBeenCalledOnce();
  });

  it('calls onStepBack when back button clicked', async () => {
    const props = renderController();
    await fireEvent.click(screen.getByLabelText('Step back'));
    expect(props.onStepBack).toHaveBeenCalledOnce();
  });

  it('calls onTogglePlay when play button clicked', async () => {
    const props = renderController();
    await fireEvent.click(screen.getByLabelText('Play'));
    expect(props.onTogglePlay).toHaveBeenCalledOnce();
  });

  it('calls onGoToFirst when first button clicked', async () => {
    const props = renderController();
    await fireEvent.click(screen.getByLabelText('Go to first step'));
    expect(props.onGoToFirst).toHaveBeenCalledOnce();
  });

  it('calls onGoToLast when last button clicked', async () => {
    const props = renderController();
    await fireEvent.click(screen.getByLabelText('Go to last step'));
    expect(props.onGoToLast).toHaveBeenCalledOnce();
  });

  it('handles keyboard shortcuts', async () => {
    const props = renderController();

    await fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(props.onStepForward).toHaveBeenCalledOnce();

    await fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(props.onStepBack).toHaveBeenCalledOnce();

    await fireEvent.keyDown(document, { key: ' ' });
    expect(props.onTogglePlay).toHaveBeenCalledOnce();
  });
});
