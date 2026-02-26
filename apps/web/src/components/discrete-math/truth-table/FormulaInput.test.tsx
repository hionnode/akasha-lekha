import { render, screen, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import { FormulaInput } from './FormulaInput';

describe('FormulaInput', () => {
  it('renders input field', () => {
    render(() => <FormulaInput value="" onInput={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByLabelText('Formula input')).toBeInTheDocument();
  });

  it('renders symbol toolbar buttons', () => {
    render(() => <FormulaInput value="" onInput={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByLabelText('Insert NOT')).toBeInTheDocument();
    expect(screen.getByLabelText('Insert AND')).toBeInTheDocument();
    expect(screen.getByLabelText('Insert OR')).toBeInTheDocument();
  });

  it('renders variable buttons', () => {
    render(() => <FormulaInput value="" onInput={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByLabelText('Insert variable p')).toBeInTheDocument();
    expect(screen.getByLabelText('Insert variable q')).toBeInTheDocument();
  });

  it('calls onInput when typing', async () => {
    const onInput = vi.fn();
    render(() => <FormulaInput value="" onInput={onInput} onSubmit={vi.fn()} />);
    const input = screen.getByLabelText('Formula input');
    await fireEvent.input(input, { target: { value: 'p' } });
    expect(onInput).toHaveBeenCalledWith('p');
  });

  it('calls onSubmit when clicking Add', async () => {
    const onSubmit = vi.fn();
    render(() => <FormulaInput value="p && q" onInput={vi.fn()} onSubmit={onSubmit} />);
    await fireEvent.click(screen.getByLabelText('Add formula'));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('calls onSubmit when pressing Enter', async () => {
    const onSubmit = vi.fn();
    render(() => <FormulaInput value="p && q" onInput={vi.fn()} onSubmit={onSubmit} />);
    const input = screen.getByLabelText('Formula input');
    await fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('disables Add button when value is empty', () => {
    render(() => <FormulaInput value="" onInput={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByLabelText('Add formula')).toBeDisabled();
  });

  it('inserts symbol at cursor when symbol button clicked', async () => {
    const onInput = vi.fn();
    render(() => <FormulaInput value="p  q" onInput={onInput} onSubmit={vi.fn()} />);
    await fireEvent.click(screen.getByLabelText('Insert AND'));
    expect(onInput).toHaveBeenCalled();
  });

  it('disables all inputs when disabled prop is true', () => {
    render(() => <FormulaInput value="" onInput={vi.fn()} onSubmit={vi.fn()} disabled />);
    expect(screen.getByLabelText('Formula input')).toBeDisabled();
    expect(screen.getByLabelText('Add formula')).toBeDisabled();
    expect(screen.getByLabelText('Insert NOT')).toBeDisabled();
  });
});
