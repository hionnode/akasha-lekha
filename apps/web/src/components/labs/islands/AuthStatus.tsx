import { createSignal, Show, onCleanup } from 'solid-js';

export interface User {
  id: string;
  username: string;
  avatarUrl: string;
}

export interface AuthStatusProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
  loginUrl?: string;
  dashboardUrl?: string;
}

export function AuthStatus(props: AuthStatusProps) {
  const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);

  // Close dropdown when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('[data-auth-status]')) {
      setIsDropdownOpen(false);
    }
  };

  // Add/remove event listener
  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleClickOutside);
    onCleanup(() => {
      document.removeEventListener('click', handleClickOutside);
    });
  }

  const handleLogin = () => {
    if (props.onLogin) {
      props.onLogin();
    } else if (props.loginUrl) {
      window.location.href = props.loginUrl;
    }
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    if (props.onLogout) {
      props.onLogout();
    }
  };

  return (
    <div data-auth-status class="relative">
      <Show
        when={props.user}
        fallback={
          <button
            onClick={handleLogin}
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-fg-primary bg-bg-tertiary hover:bg-accent-blue/20 border border-border rounded-lg transition-colors"
          >
            <svg
              class="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clip-rule="evenodd"
              />
            </svg>
            Login with GitHub
          </button>
        }
      >
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen())}
          aria-label={props.user?.username}
          class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-fg-primary hover:bg-bg-tertiary border border-transparent hover:border-border rounded-lg transition-colors"
        >
          <img
            src={props.user?.avatarUrl}
            alt="avatar"
            class="w-6 h-6 rounded-full"
          />
          <span>{props.user?.username}</span>
          <svg
            class={`w-4 h-4 transition-transform ${isDropdownOpen() ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <Show when={isDropdownOpen()}>
          <div class="absolute right-0 mt-2 w-48 bg-bg-secondary border border-border rounded-lg shadow-lg py-1 z-50">
            <a
              href={props.dashboardUrl || '/labs/dashboard'}
              role="link"
              aria-label="Dashboard"
              class="block px-4 py-2 text-sm text-fg-primary hover:bg-bg-tertiary transition-colors"
            >
              Dashboard
            </a>
            <hr class="border-border my-1" />
            <button
              onClick={handleLogout}
              class="w-full text-left px-4 py-2 text-sm text-accent-red hover:bg-bg-tertiary transition-colors"
            >
              Logout
            </button>
          </div>
        </Show>
      </Show>
    </div>
  );
}

export default AuthStatus;
