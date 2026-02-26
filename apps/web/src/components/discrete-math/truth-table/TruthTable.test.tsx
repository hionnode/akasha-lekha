import { render, screen, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import { TruthTable } from './TruthTable';

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

describe('TruthTable', () => {
  it('renders with empty state when no expressions', () => {
    render(() => <TruthTable />);
    expect(screen.getByTestId('truth-table')).toBeInTheDocument();
    expect(screen.getByText(/Enter a formula/)).toBeInTheDocument();
  });

  it('renders pre-configured expressions', () => {
    render(() => (
      <TruthTable
        expressions={{ 'p ∧ q': 'p && q' }}
        editable={false}
        animateOnMount={false}
      />
    ));
    expect(screen.getByTestId('table-renderer')).toBeInTheDocument();
  });

  it('shows formula input when editable', () => {
    render(() => <TruthTable editable />);
    expect(screen.getByTestId('formula-input')).toBeInTheDocument();
  });

  it('hides formula input when not editable', () => {
    render(() => <TruthTable editable={false} />);
    expect(screen.queryByTestId('formula-input')).not.toBeInTheDocument();
  });

  it('adds formula and generates table', async () => {
    render(() => <TruthTable animateOnMount={false} />);

    const input = screen.getByLabelText('Formula input');
    await fireEvent.input(input, { target: { value: 'p && q' } });
    await fireEvent.click(screen.getByLabelText('Add formula'));

    expect(screen.getByTestId('table-renderer')).toBeInTheDocument();
  });

  it('shows error for invalid formula', async () => {
    render(() => <TruthTable animateOnMount={false} />);

    const input = screen.getByLabelText('Formula input');
    await fireEvent.input(input, { target: { value: '&&' } });
    await fireEvent.click(screen.getByLabelText('Add formula'));

    expect(screen.getByText(/Unexpected token/i)).toBeInTheDocument();
  });

  it('clears input after adding formula', async () => {
    render(() => <TruthTable animateOnMount={false} />);

    const input = screen.getByLabelText('Formula input') as HTMLInputElement;
    await fireEvent.input(input, { target: { value: 'p' } });
    await fireEvent.click(screen.getByLabelText('Add formula'));

    expect(input.value).toBe('');
  });

  it('can remove an expression', async () => {
    render(() => <TruthTable animateOnMount={false} />);

    const input = screen.getByLabelText('Formula input');
    await fireEvent.input(input, { target: { value: 'p' } });
    await fireEvent.click(screen.getByLabelText('Add formula'));

    const removeBtn = screen.getByLabelText('Remove p');
    await fireEvent.click(removeBtn);

    expect(screen.queryByTestId('table-renderer')).not.toBeInTheDocument();
  });

  it('shows non-editable message when no expressions and not editable', () => {
    render(() => <TruthTable editable={false} />);
    expect(screen.getByText(/No formulas configured/)).toBeInTheDocument();
  });
});
