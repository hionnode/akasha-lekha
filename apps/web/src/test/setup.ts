import '@testing-library/jest-dom/vitest';
import { vi, afterEach } from 'vitest';

// Mock environment variables for tests
vi.stubEnv('PUBLIC_LABS_API_URL', 'http://localhost:3000/api');
vi.stubEnv('PUBLIC_GITHUB_CLIENT_ID', 'test-github-client-id');

// Global test utilities
export const mockFetch = (response: unknown, ok = true) => {
  return vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response)),
  });
};

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});
