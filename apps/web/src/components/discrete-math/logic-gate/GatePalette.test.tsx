import { render, screen, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import { GatePalette } from './GatePalette';

describe('GatePalette', () => {
  it('renders all gate buttons', () => {
    render(() => <GatePalette onSelectGate={vi.fn()} />);
    expect(screen.getByTestId('gate-palette')).toBeInTheDocument();
    expect(screen.getByTestId('palette-and')).toBeInTheDocument();
    expect(screen.getByTestId('palette-or')).toBeInTheDocument();
    expect(screen.getByTestId('palette-not')).toBeInTheDocument();
    expect(screen.getByTestId('palette-xor')).toBeInTheDocument();
    expect(screen.getByTestId('palette-nand')).toBeInTheDocument();
    expect(screen.getByTestId('palette-nor')).toBeInTheDocument();
  });

  it('calls onSelectGate with correct type when clicked', async () => {
    const onSelect = vi.fn();
    render(() => <GatePalette onSelectGate={onSelect} />);

    await fireEvent.click(screen.getByTestId('palette-and'));
    expect(onSelect).toHaveBeenCalledWith('AND');

    await fireEvent.click(screen.getByTestId('palette-or'));
    expect(onSelect).toHaveBeenCalledWith('OR');

    await fireEvent.click(screen.getByTestId('palette-not'));
    expect(onSelect).toHaveBeenCalledWith('NOT');
  });

  it('disables buttons when disabled prop is true', () => {
    render(() => <GatePalette onSelectGate={vi.fn()} disabled />);
    expect(screen.getByTestId('palette-and')).toBeDisabled();
    expect(screen.getByTestId('palette-or')).toBeDisabled();
  });

  it('has aria labels for accessibility', () => {
    render(() => <GatePalette onSelectGate={vi.fn()} />);
    expect(screen.getByLabelText('Add AND gate')).toBeInTheDocument();
    expect(screen.getByLabelText('Add OR gate')).toBeInTheDocument();
    expect(screen.getByLabelText('Add NOT gate')).toBeInTheDocument();
  });

  it('shows section label', () => {
    render(() => <GatePalette onSelectGate={vi.fn()} />);
    expect(screen.getByText('Gates')).toBeInTheDocument();
  });
});
