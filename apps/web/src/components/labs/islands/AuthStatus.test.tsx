import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import { AuthStatus } from './AuthStatus';

describe('AuthStatus', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should show login button when not authenticated', () => {
    render(() => <AuthStatus />);

    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should show user info when authenticated', () => {
    const user = {
      id: '123',
      username: 'testuser',
      avatarUrl: 'https://example.com/avatar.png',
    };

    render(() => <AuthStatus user={user} />);

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /avatar/i })).toBeInTheDocument();
  });

  it('should show dropdown menu on click when authenticated', async () => {
    const user = {
      id: '123',
      username: 'testuser',
      avatarUrl: 'https://example.com/avatar.png',
    };

    render(() => <AuthStatus user={user} />);

    const userButton = screen.getByRole('button', { name: /testuser/i });
    fireEvent.click(userButton);

    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('should call onLogin when login button is clicked', () => {
    const onLogin = vi.fn();

    render(() => <AuthStatus onLogin={onLogin} />);

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(onLogin).toHaveBeenCalledTimes(1);
  });

  it('should call onLogout when logout button is clicked', () => {
    const onLogout = vi.fn();
    const user = {
      id: '123',
      username: 'testuser',
      avatarUrl: 'https://example.com/avatar.png',
    };

    render(() => <AuthStatus user={user} onLogout={onLogout} />);

    // Open dropdown
    fireEvent.click(screen.getByRole('button', { name: /testuser/i }));
    // Click logout
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('should close dropdown when clicking outside', async () => {
    const user = {
      id: '123',
      username: 'testuser',
      avatarUrl: 'https://example.com/avatar.png',
    };

    render(() => (
      <div>
        <AuthStatus user={user} />
        <button data-testid="outside">Outside</button>
      </div>
    ));

    // Open dropdown
    fireEvent.click(screen.getByRole('button', { name: /testuser/i }));
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();

    // Click outside
    fireEvent.click(screen.getByTestId('outside'));

    // Dropdown should be closed
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });
});
