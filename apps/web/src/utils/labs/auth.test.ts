import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  parseJwt,
  isTokenExpired,
  getAuthUrl,
  exchangeCodeForToken,
  verifyToken,
  type User,
  type AuthConfig,
} from './auth';

describe('Auth Utilities', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('parseJwt', () => {
    it('should parse a valid JWT payload', () => {
      // JWT with payload: { "sub": "12345", "name": "Test User", "exp": 9999999999 }
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJUZXN0IFVzZXIiLCJleHAiOjk5OTk5OTk5OTl9.signature';

      const payload = parseJwt(token);

      expect(payload.sub).toBe('12345');
      expect(payload.name).toBe('Test User');
      expect(payload.exp).toBe(9999999999);
    });

    it('should throw on invalid JWT format', () => {
      expect(() => parseJwt('not-a-jwt')).toThrow();
      expect(() => parseJwt('')).toThrow();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid token', () => {
      // Token expiring in the future (year 2286)
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsImV4cCI6OTk5OTk5OTk5OX0.signature';

      expect(isTokenExpired(token)).toBe(false);
    });

    it('should return true for expired token', () => {
      // Token expired in 2020
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsImV4cCI6MTU3NzgzNjgwMH0.signature';

      expect(isTokenExpired(token)).toBe(true);
    });

    it('should return true for invalid token', () => {
      expect(isTokenExpired('invalid')).toBe(true);
    });
  });

  describe('getAuthUrl', () => {
    it('should return GitHub OAuth URL with client ID', () => {
      const config: AuthConfig = {
        apiUrl: 'https://api.example.com',
        githubClientId: 'test-client-id',
      };

      const url = getAuthUrl(config);

      expect(url).toContain('https://api.example.com/auth/github');
    });

    it('should include redirect URI if provided', () => {
      const config: AuthConfig = {
        apiUrl: 'https://api.example.com',
        githubClientId: 'test-client-id',
        redirectUri: 'https://example.com/callback',
      };

      const url = getAuthUrl(config);

      expect(url).toContain('redirect_uri=');
    });
  });

  describe('exchangeCodeForToken', () => {
    it('should exchange OAuth code for JWT token', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            token: 'new-jwt-token',
            user: {
              id: '12345',
              username: 'testuser',
              avatarUrl: 'https://example.com/avatar.png',
            },
          }),
      });

      const config: AuthConfig = {
        apiUrl: 'https://api.example.com',
        githubClientId: 'test-client-id',
      };

      const result = await exchangeCodeForToken(config, 'oauth-code');

      expect(result.token).toBe('new-jwt-token');
      expect(result.user.username).toBe('testuser');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/github/callback'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should throw on invalid code', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      const config: AuthConfig = {
        apiUrl: 'https://api.example.com',
        githubClientId: 'test-client-id',
      };

      await expect(exchangeCodeForToken(config, 'invalid-code')).rejects.toThrow();
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token and return user info', async () => {
      const mockUser: User = {
        id: '12345',
        username: 'testuser',
        avatarUrl: 'https://example.com/avatar.png',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            valid: true,
            user: mockUser,
          }),
      });

      const config: AuthConfig = {
        apiUrl: 'https://api.example.com',
        githubClientId: 'test-client-id',
      };

      const result = await verifyToken(config, 'valid-token');

      expect(result.valid).toBe(true);
      expect(result.user).toEqual(mockUser);
    });

    it('should return invalid for expired token', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            valid: false,
            user: null,
          }),
      });

      const config: AuthConfig = {
        apiUrl: 'https://api.example.com',
        githubClientId: 'test-client-id',
      };

      const result = await verifyToken(config, 'expired-token');

      expect(result.valid).toBe(false);
      expect(result.user).toBeNull();
    });
  });
});
