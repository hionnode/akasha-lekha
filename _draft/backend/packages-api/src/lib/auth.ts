// packages/api/src/lib/auth.ts
import jwt from 'jsonwebtoken';
import { Resource } from 'sst';
import type { JwtPayload } from '@akasha/types';

export function createToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, Resource.JwtSecret.value, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, Resource.JwtSecret.value) as JwtPayload;
  } catch {
    return null;
  }
}

export function getTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}
