/**
 * Labs Authentication Utilities
 *
 * Handles JWT token parsing, validation, and OAuth flow helpers.
 * These utilities work with the SST backend API for GitHub OAuth.
 */

export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  email?: string;
}

export interface AuthConfig {
  apiUrl: string;
  githubClientId: string;
  redirectUri?: string;
}

export interface TokenExchangeResult {
  token: string;
  user: User;
}

export interface TokenVerifyResult {
  valid: boolean;
  user: User | null;
}

interface JwtPayload {
  sub: string;
  exp: number;
  [key: string]: unknown;
}

/**
 * Parse a JWT token and extract the payload.
 * Note: This does NOT verify the signature - that must be done server-side.
 */
export function parseJwt(token: string): JwtPayload {
  if (!token || !token.includes('.')) {
    throw new Error('Invalid JWT format');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch {
    throw new Error('Failed to parse JWT payload');
  }
}

/**
 * Check if a JWT token is expired.
 * Returns true if expired or invalid.
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = parseJwt(token);
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true;
  }
}

/**
 * Get the GitHub OAuth authorization URL.
 */
export function getAuthUrl(config: AuthConfig): string {
  const url = new URL(`${config.apiUrl}/auth/github`);

  if (config.redirectUri) {
    url.searchParams.set('redirect_uri', config.redirectUri);
  }

  return url.toString();
}

/**
 * Exchange an OAuth code for a JWT token.
 * This calls the backend API which handles the GitHub OAuth exchange.
 */
export async function exchangeCodeForToken(
  config: AuthConfig,
  code: string
): Promise<TokenExchangeResult> {
  const response = await fetch(`${config.apiUrl}/auth/github/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return {
    token: data.token,
    user: data.user,
  };
}

/**
 * Verify a JWT token with the backend API.
 * Returns user info if valid, null if invalid.
 */
export async function verifyToken(
  config: AuthConfig,
  token: string
): Promise<TokenVerifyResult> {
  const response = await fetch(`${config.apiUrl}/auth/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return { valid: false, user: null };
  }

  const data = await response.json();
  return {
    valid: data.valid,
    user: data.user,
  };
}

/**
 * Get user info from a JWT token (client-side only, not verified).
 * For display purposes only - always verify server-side for protected actions.
 */
export function getUserFromToken(token: string): User | null {
  try {
    const payload = parseJwt(token);
    return {
      id: payload.sub,
      username: (payload.username as string) || '',
      avatarUrl: (payload.avatar_url as string) || '',
      email: payload.email as string | undefined,
    };
  } catch {
    return null;
  }
}
