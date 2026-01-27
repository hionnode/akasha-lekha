import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library';
import { CLICommandCopy } from './CLICommandCopy';

describe('CLICommandCopy', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('should display the command', () => {
    render(() => <CLICommandCopy command="infra-learn launch linux-01" />);

    expect(screen.getByText('infra-learn launch linux-01')).toBeInTheDocument();
  });

  it('should show copy button', () => {
    render(() => <CLICommandCopy command="infra-learn launch linux-01" />);

    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
  });

  it('should copy command to clipboard on button click', async () => {
    render(() => <CLICommandCopy command="infra-learn launch linux-01" />);

    fireEvent.click(screen.getByRole('button', { name: /copy/i }));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('infra-learn launch linux-01');
  });

  it('should show copied feedback after copying', async () => {
    render(() => <CLICommandCopy command="infra-learn launch linux-01" />);

    fireEvent.click(screen.getByRole('button', { name: /copy/i }));

    await waitFor(() => {
      expect(screen.getByText(/copied/i)).toBeInTheDocument();
    });
  });

  it('should reset copied state after timeout', async () => {
    vi.useFakeTimers();

    render(() => <CLICommandCopy command="infra-learn launch linux-01" />);

    fireEvent.click(screen.getByRole('button', { name: /copy/i }));

    await waitFor(() => {
      expect(screen.getByText(/copied/i)).toBeInTheDocument();
    });

    vi.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(screen.queryByText(/copied/i)).not.toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it('should handle clipboard error gracefully', async () => {
    navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error('Clipboard error'));

    render(() => <CLICommandCopy command="infra-learn launch linux-01" />);

    fireEvent.click(screen.getByRole('button', { name: /copy/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed/i)).toBeInTheDocument();
    });
  });

  it('should apply custom className', () => {
    render(() => <CLICommandCopy command="infra-learn launch linux-01" class="custom-class" />);

    const container = screen.getByTestId('cli-command-container');
    expect(container).toHaveClass('custom-class');
  });
});
