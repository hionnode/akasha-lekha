export interface User {
  id: string;
  githubId: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  userId: string;
  createdAt: string;
  expiresAt: number;
}

export interface JwtPayload {
  sub: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  iat: number;
  exp: number;
}
