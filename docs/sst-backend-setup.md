# SST Backend Setup Guide

> Complete guide for setting up the SST backend with DynamoDB in a monorepo structure.

---

## Table of Contents

1. [Monorepo Structure](#monorepo-structure)
2. [Prerequisites](#prerequisites)
3. [Initial Setup](#initial-setup)
4. [DynamoDB Local Setup](#dynamodb-local-setup)
5. [SST Configuration](#sst-configuration)
6. [API Routes Implementation](#api-routes-implementation)
7. [Authentication Flow](#authentication-flow)
8. [Testing Strategy](#testing-strategy)
9. [Deployment](#deployment)
10. [Lifecycle Analysis & Gap Identification](#lifecycle-analysis--gap-identification)

---

## Monorepo Structure

The project will be organized as a pnpm workspace monorepo:

```
akasha-lekha/
├── apps/
│   └── web/                    # Current Astro site (move existing src/, public/, etc.)
├── packages/
│   ├── api/                    # SST API functions
│   │   ├── src/
│   │   │   ├── functions/      # Lambda handlers
│   │   │   │   ├── auth/
│   │   │   │   │   ├── github.ts
│   │   │   │   │   ├── callback.ts
│   │   │   │   │   └── verify.ts
│   │   │   │   ├── exercises/
│   │   │   │   │   ├── list.ts
│   │   │   │   │   ├── get.ts
│   │   │   │   │   └── verify.ts
│   │   │   │   └── progress/
│   │   │   │       ├── get.ts
│   │   │   │       └── record.ts
│   │   │   ├── lib/            # Shared utilities
│   │   │   │   ├── db.ts       # DynamoDB client
│   │   │   │   ├── auth.ts     # JWT utilities
│   │   │   │   └── response.ts # API response helpers
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── types/                  # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── api.ts
│   │   │   ├── user.ts
│   │   │   ├── exercise.ts
│   │   │   └── progress.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── db/                     # Database schemas & migrations
│       ├── src/
│       │   ├── schema.ts       # DynamoDB table schemas
│       │   ├── seed.ts         # Seed data for development
│       │   └── migrations/     # If needed
│       ├── package.json
│       └── tsconfig.json
├── infra/                      # SST infrastructure
│   ├── api.ts                  # API Gateway + Lambda
│   ├── database.ts             # DynamoDB tables
│   ├── auth.ts                 # Auth resources (secrets)
│   └── index.ts                # Main stack export
├── sst.config.ts               # SST configuration
├── pnpm-workspace.yaml         # Workspace config
├── package.json                # Root package.json
└── ... (existing files)
```

---

## Prerequisites

### Required Tools

```bash
# Node.js 20+
node --version  # v20.x or higher

# pnpm 8+
pnpm --version  # 8.x or higher

# AWS CLI v2
aws --version

# Docker (for DynamoDB Local)
docker --version
```

### AWS Configuration

```bash
# Configure AWS credentials (for deployment)
aws configure --profile infra-learn-dev
# Enter: Access Key ID, Secret Access Key, Region (ap-south-1), Output (json)

# Verify
aws sts get-caller-identity --profile infra-learn-dev
```

### GitHub OAuth App

1. Go to GitHub > Settings > Developer settings > OAuth Apps > New OAuth App
2. Configure:
   - **Application name**: `infra-learn-dev`
   - **Homepage URL**: `http://localhost:4321`
   - **Authorization callback URL**: `http://localhost:3000/auth/github/callback`
3. Save **Client ID** and generate **Client Secret**

---

## Initial Setup

### Step 1: Initialize Workspace

Create workspace configuration:

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'infra'
```

### Step 2: Update Root package.json

```json
{
  "name": "akasha-lekha-monorepo",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "pnpm --filter @akasha/web dev",
    "dev:api": "sst dev",
    "dev:all": "concurrently \"pnpm dev\" \"pnpm dev:api\"",
    "build": "pnpm --filter @akasha/web build",
    "build:api": "sst build",
    "deploy": "sst deploy --stage production",
    "deploy:dev": "sst deploy --stage dev",
    "test": "pnpm -r test",
    "test:api": "pnpm --filter @akasha/api test",
    "db:local": "docker-compose up -d dynamodb-local",
    "db:seed": "pnpm --filter @akasha/db seed",
    "typecheck": "pnpm -r typecheck"
  },
  "devDependencies": {
    "sst": "^3.x",
    "aws-cdk-lib": "^2.x",
    "constructs": "^10.x",
    "concurrently": "^8.x",
    "typescript": "^5.x"
  }
}
```

### Step 3: Install SST

```bash
# Install SST globally (optional, for CLI)
pnpm add -g sst

# Install in project
pnpm add -D sst aws-cdk-lib constructs
```

### Step 4: Initialize SST

```bash
# In project root
pnpm sst init

# This creates sst.config.ts
```

---

## DynamoDB Local Setup

### Docker Compose Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  dynamodb-local:
    image: amazon/dynamodb-local:latest
    container_name: dynamodb-local
    ports:
      - "8000:8000"
    volumes:
      - dynamodb-data:/home/dynamodblocal/data
    command: "-jar DynamoDBLocal.jar -sharedDb -dbPath /home/dynamodblocal/data"
    healthcheck:
      test: ["CMD-SHELL", "curl -s http://localhost:8000 || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  dynamodb-admin:
    image: aaronshaf/dynamodb-admin:latest
    container_name: dynamodb-admin
    ports:
      - "8001:8001"
    environment:
      - DYNAMO_ENDPOINT=http://dynamodb-local:8000
      - AWS_REGION=ap-south-1
      - AWS_ACCESS_KEY_ID=local
      - AWS_SECRET_ACCESS_KEY=local
    depends_on:
      - dynamodb-local

volumes:
  dynamodb-data:
```

### Start Local DynamoDB

```bash
# Start services
docker-compose up -d

# Verify
curl http://localhost:8000

# Access admin UI at http://localhost:8001
```

### Environment Variables for Local Development

```bash
# .env.local (gitignored)
DYNAMODB_ENDPOINT=http://localhost:8000
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=local
AWS_SECRET_ACCESS_KEY=local

# GitHub OAuth (from your OAuth app)
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_jwt_secret_here

# Frontend URL
FRONTEND_URL=http://localhost:4321
```

---

## SST Configuration

### sst.config.ts

```typescript
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "infra-learn",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "ap-south-1",
          profile: input?.stage === "production"
            ? "infra-learn-prod"
            : "infra-learn-dev",
        },
      },
    };
  },
  async run() {
    // Import infrastructure modules
    const { database } = await import("./infra/database");
    const { api } = await import("./infra/api");
    const { auth } = await import("./infra/auth");

    return {
      api: api.url,
      tables: {
        users: database.usersTable.name,
        progress: database.progressTable.name,
      },
    };
  },
});
```

### infra/database.ts

```typescript
import { Resource } from "sst";

// Users table - stores user profiles
export const usersTable = new sst.aws.Dynamo("Users", {
  fields: {
    pk: "string",      // USER#<github_id>
    sk: "string",      // PROFILE
    gsi1pk: "string",  // EMAIL#<email>
    gsi1sk: "string",  // USER#<github_id>
  },
  primaryIndex: { hashKey: "pk", rangeKey: "sk" },
  globalIndexes: {
    gsi1: { hashKey: "gsi1pk", rangeKey: "gsi1sk" },
  },
});

// Progress table - stores exercise completions
export const progressTable = new sst.aws.Dynamo("Progress", {
  fields: {
    pk: "string",      // USER#<github_id>
    sk: "string",      // EXERCISE#<exercise_id>
    gsi1pk: "string",  // EXERCISE#<exercise_id>
    gsi1sk: "string",  // COMPLETED#<timestamp>
  },
  primaryIndex: { hashKey: "pk", rangeKey: "sk" },
  globalIndexes: {
    gsi1: { hashKey: "gsi1pk", rangeKey: "gsi1sk" },
  },
});

// Sessions table - stores auth sessions/tokens
export const sessionsTable = new sst.aws.Dynamo("Sessions", {
  fields: {
    pk: "string",      // SESSION#<token_hash>
    sk: "string",      // USER#<github_id>
  },
  primaryIndex: { hashKey: "pk", rangeKey: "sk" },
  ttl: "expiresAt",    // Auto-delete expired sessions
});

export const database = {
  usersTable,
  progressTable,
  sessionsTable,
};
```

### infra/auth.ts

```typescript
// Store secrets in SST
export const githubClientId = new sst.Secret("GithubClientId");
export const githubClientSecret = new sst.Secret("GithubClientSecret");
export const jwtSecret = new sst.Secret("JwtSecret");

export const auth = {
  githubClientId,
  githubClientSecret,
  jwtSecret,
};
```

### infra/api.ts

```typescript
import { database } from "./database";
import { auth } from "./auth";

export const api = new sst.aws.ApiGatewayV2("Api", {
  cors: {
    allowOrigins: [$app.stage === "production"
      ? "https://works-on-my.cloud"
      : "http://localhost:4321"
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowCredentials: true,
  },
});

// Auth routes
api.route("GET /auth/github", {
  handler: "packages/api/src/functions/auth/github.handler",
  link: [auth.githubClientId],
});

api.route("GET /auth/github/callback", {
  handler: "packages/api/src/functions/auth/callback.handler",
  link: [auth.githubClientId, auth.githubClientSecret, auth.jwtSecret, database.usersTable, database.sessionsTable],
});

api.route("POST /auth/verify", {
  handler: "packages/api/src/functions/auth/verify.handler",
  link: [auth.jwtSecret, database.sessionsTable],
});

api.route("POST /auth/logout", {
  handler: "packages/api/src/functions/auth/logout.handler",
  link: [database.sessionsTable],
});

// Exercise routes (public)
api.route("GET /exercises", {
  handler: "packages/api/src/functions/exercises/list.handler",
});

api.route("GET /exercises/{id}", {
  handler: "packages/api/src/functions/exercises/get.handler",
});

// Progress routes (authenticated)
api.route("GET /progress", {
  handler: "packages/api/src/functions/progress/get.handler",
  link: [auth.jwtSecret, database.progressTable, database.sessionsTable],
});

api.route("POST /exercises/{id}/verify", {
  handler: "packages/api/src/functions/progress/record.handler",
  link: [auth.jwtSecret, database.progressTable, database.sessionsTable],
});
```

---

## API Routes Implementation

### packages/api/src/lib/db.ts

```typescript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const isLocal = process.env.DYNAMODB_ENDPOINT !== undefined;

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
  ...(isLocal && {
    endpoint: process.env.DYNAMODB_ENDPOINT,
    credentials: {
      accessKeyId: "local",
      secretAccessKey: "local",
    },
  }),
});

export const db = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

export { GetCommand, PutCommand, QueryCommand, DeleteCommand };
```

### packages/api/src/lib/auth.ts

```typescript
import jwt from "jsonwebtoken";
import { Resource } from "sst";

export interface JwtPayload {
  sub: string;           // GitHub user ID
  username: string;
  email?: string;
  avatarUrl?: string;
  iat: number;
  exp: number;
}

export function createToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
  return jwt.sign(payload, Resource.JwtSecret.value, {
    expiresIn: "7d",
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
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
```

### packages/api/src/lib/response.ts

```typescript
import { APIGatewayProxyResultV2 } from "aws-lambda";

export function json(data: unknown, statusCode = 200): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
}

export function error(message: string, statusCode = 400): APIGatewayProxyResultV2 {
  return json({ error: message }, statusCode);
}

export function redirect(url: string): APIGatewayProxyResultV2 {
  return {
    statusCode: 302,
    headers: {
      Location: url,
    },
    body: "",
  };
}
```

### packages/api/src/functions/auth/github.ts

```typescript
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Resource } from "sst";
import { redirect } from "../../lib/response";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const state = crypto.randomUUID();
  const redirectUri = `${process.env.API_URL}/auth/github/callback`;

  const params = new URLSearchParams({
    client_id: Resource.GithubClientId.value,
    redirect_uri: redirectUri,
    scope: "read:user user:email",
    state,
  });

  // TODO: Store state in session for CSRF protection

  return redirect(`https://github.com/login/oauth/authorize?${params}`);
};
```

### packages/api/src/functions/auth/callback.ts

```typescript
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Resource } from "sst";
import { db, PutCommand } from "../../lib/db";
import { createToken } from "../../lib/auth";
import { redirect, error } from "../../lib/response";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const code = event.queryStringParameters?.code;
  if (!code) {
    return error("Missing authorization code", 400);
  }

  // Exchange code for access token
  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: Resource.GithubClientId.value,
      client_secret: Resource.GithubClientSecret.value,
      code,
    }),
  });

  const tokenData = await tokenResponse.json();
  if (tokenData.error) {
    return error(`GitHub OAuth error: ${tokenData.error_description}`, 400);
  }

  // Fetch user profile
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  const userData = await userResponse.json();

  // Fetch user email if not public
  let email = userData.email;
  if (!email) {
    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    const emails = await emailsResponse.json();
    email = emails.find((e: any) => e.primary)?.email;
  }

  // Save/update user in DynamoDB
  await db.send(new PutCommand({
    TableName: Resource.Users.name,
    Item: {
      pk: `USER#${userData.id}`,
      sk: "PROFILE",
      gsi1pk: email ? `EMAIL#${email}` : undefined,
      gsi1sk: `USER#${userData.id}`,
      githubId: userData.id.toString(),
      username: userData.login,
      email,
      avatarUrl: userData.avatar_url,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }));

  // Create JWT
  const token = createToken({
    sub: userData.id.toString(),
    username: userData.login,
    email,
    avatarUrl: userData.avatar_url,
  });

  // Store session
  const sessionHash = crypto.createHash("sha256").update(token).digest("hex");
  await db.send(new PutCommand({
    TableName: Resource.Sessions.name,
    Item: {
      pk: `SESSION#${sessionHash}`,
      sk: `USER#${userData.id}`,
      userId: userData.id.toString(),
      createdAt: new Date().toISOString(),
      expiresAt: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days TTL
    },
  }));

  // Redirect to frontend with token
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:4321";
  return redirect(`${frontendUrl}/labs/auth/callback?token=${token}`);
};
```

### packages/api/src/functions/progress/get.ts

```typescript
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Resource } from "sst";
import { db, QueryCommand } from "../../lib/db";
import { verifyToken, getTokenFromHeader } from "../../lib/auth";
import { json, error } from "../../lib/response";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const token = getTokenFromHeader(event.headers.authorization);
  if (!token) {
    return error("Unauthorized", 401);
  }

  const payload = verifyToken(token);
  if (!payload) {
    return error("Invalid token", 401);
  }

  const result = await db.send(new QueryCommand({
    TableName: Resource.Progress.name,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": `USER#${payload.sub}`,
    },
  }));

  const progress = (result.Items || []).map((item) => ({
    exerciseId: item.sk.replace("EXERCISE#", ""),
    completedAt: item.completedAt,
    attempts: item.attempts,
    verificationHash: item.verificationHash,
  }));

  return json({ progress });
};
```

### packages/api/src/functions/progress/record.ts

```typescript
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Resource } from "sst";
import { db, PutCommand, GetCommand } from "../../lib/db";
import { verifyToken, getTokenFromHeader } from "../../lib/auth";
import { json, error } from "../../lib/response";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const token = getTokenFromHeader(event.headers.authorization);
  if (!token) {
    return error("Unauthorized", 401);
  }

  const payload = verifyToken(token);
  if (!payload) {
    return error("Invalid token", 401);
  }

  const exerciseId = event.pathParameters?.id;
  if (!exerciseId) {
    return error("Exercise ID required", 400);
  }

  const body = JSON.parse(event.body || "{}");
  const { verificationHash } = body;

  // Check if already completed
  const existing = await db.send(new GetCommand({
    TableName: Resource.Progress.name,
    Key: {
      pk: `USER#${payload.sub}`,
      sk: `EXERCISE#${exerciseId}`,
    },
  }));

  const attempts = (existing.Item?.attempts || 0) + 1;
  const now = new Date().toISOString();

  await db.send(new PutCommand({
    TableName: Resource.Progress.name,
    Item: {
      pk: `USER#${payload.sub}`,
      sk: `EXERCISE#${exerciseId}`,
      gsi1pk: `EXERCISE#${exerciseId}`,
      gsi1sk: `COMPLETED#${now}`,
      completedAt: existing.Item?.completedAt || now,
      attempts,
      verificationHash,
      updatedAt: now,
    },
  }));

  return json({
    success: true,
    exerciseId,
    completedAt: existing.Item?.completedAt || now,
    attempts,
  });
};
```

---

## Authentication Flow

### Detailed Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AUTHENTICATION FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

1. USER INITIATES LOGIN
   ┌─────────┐     Click "Login"      ┌─────────────┐
   │ Browser │ ───────────────────────► │ /labs/login │
   └─────────┘                         └──────┬──────┘
                                              │
2. REDIRECT TO API                            ▼
   ┌─────────────┐     Redirect        ┌─────────────────────┐
   │ /labs/login │ ───────────────────► │ API /auth/github    │
   └─────────────┘                     └──────────┬──────────┘
                                                  │
3. REDIRECT TO GITHUB                             ▼
   ┌──────────────────┐   302 Redirect   ┌────────────────────────┐
   │ API /auth/github │ ─────────────────► │ github.com/login/oauth │
   └──────────────────┘                   └───────────┬────────────┘
                                                      │
4. USER AUTHORIZES                                    ▼
   ┌────────────────────────┐  Authorize   ┌─────────────────────┐
   │ github.com/login/oauth │ ─────────────► │ User grants access  │
   └────────────────────────┘               └──────────┬──────────┘
                                                       │
5. GITHUB REDIRECTS WITH CODE                          ▼
   ┌─────────────────────┐   ?code=xxx   ┌─────────────────────────┐
   │ User grants access  │ ──────────────► │ API /auth/github/callback│
   └─────────────────────┘                └───────────┬─────────────┘
                                                      │
6. API EXCHANGES CODE FOR TOKEN                       ▼
   ┌────────────────────────────┐  POST   ┌───────────────────────────┐
   │ API /auth/github/callback  │ ────────► │ github.com/oauth/token    │
   └────────────────────────────┘          └───────────┬───────────────┘
                                                       │
7. API FETCHES USER DATA                               ▼
   ┌───────────────────────────┐   GET    ┌──────────────────────┐
   │ GitHub returns token      │ ─────────► │ api.github.com/user  │
   └───────────────────────────┘           └──────────┬───────────┘
                                                      │
8. SAVE USER & CREATE JWT                             ▼
   ┌──────────────────────┐   PutItem    ┌────────────────┐
   │ api.github.com/user  │ ─────────────► │ DynamoDB Users │
   └──────────────────────┘               └────────┬───────┘
                                                   │
9. REDIRECT TO FRONTEND WITH TOKEN                 ▼
   ┌────────────────┐   ?token=jwt   ┌─────────────────────────┐
   │ DynamoDB saved │ ───────────────► │ /labs/auth/callback     │
   └────────────────┘                 └───────────┬─────────────┘
                                                  │
10. FRONTEND STORES TOKEN                         ▼
    ┌─────────────────────────┐  httpOnly  ┌────────────────┐
    │ /labs/auth/callback     │ ───────────► │ Cookie stored  │
    └─────────────────────────┘  cookie     └────────┬───────┘
                                                     │
11. REDIRECT TO DASHBOARD                            ▼
    ┌────────────────┐   Redirect    ┌─────────────────┐
    │ Cookie stored  │ ──────────────► │ /labs/dashboard │
    └────────────────┘                └─────────────────┘
```

### Token Storage Options

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| httpOnly Cookie | Secure, no XSS | CSRF vulnerable | **Recommended** with CSRF token |
| localStorage | Easy access | XSS vulnerable | Not for production |
| sessionStorage | Tab-isolated | Lost on close | Not recommended |

### Recommended: httpOnly Cookie + CSRF

```typescript
// In auth callback handler
return {
  statusCode: 302,
  headers: {
    Location: `${frontendUrl}/labs/auth/callback`,
    "Set-Cookie": [
      `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
      `csrf_token=${csrfToken}; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
    ].join(", "),
  },
  body: "",
};
```

---

## Testing Strategy

### Unit Tests (Vitest)

```typescript
// packages/api/src/functions/auth/callback.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handler } from './callback';

// Mock SST Resource
vi.mock('sst', () => ({
  Resource: {
    GithubClientId: { value: 'test-client-id' },
    GithubClientSecret: { value: 'test-client-secret' },
    JwtSecret: { value: 'test-jwt-secret' },
    Users: { name: 'test-users-table' },
    Sessions: { name: 'test-sessions-table' },
  },
}));

// Mock fetch
global.fetch = vi.fn();

describe('GitHub OAuth Callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return error if code is missing', async () => {
    const event = {
      queryStringParameters: {},
    } as any;

    const result = await handler(event, {} as any);

    expect(result.statusCode).toBe(400);
  });

  it('should exchange code and create user', async () => {
    // Mock GitHub token exchange
    (fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve({ access_token: 'github-token' }),
    });

    // Mock GitHub user API
    (fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve({
        id: 12345,
        login: 'testuser',
        avatar_url: 'https://example.com/avatar',
        email: 'test@example.com',
      }),
    });

    const event = {
      queryStringParameters: { code: 'valid-code' },
    } as any;

    const result = await handler(event, {} as any);

    expect(result.statusCode).toBe(302);
    expect(result.headers?.Location).toContain('token=');
  });
});
```

### Integration Tests (Local DynamoDB)

```typescript
// packages/api/src/integration/progress.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DynamoDBClient, CreateTableCommand, DeleteTableCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  endpoint: 'http://localhost:8000',
  region: 'ap-south-1',
  credentials: { accessKeyId: 'local', secretAccessKey: 'local' },
});

describe('Progress API Integration', () => {
  beforeAll(async () => {
    // Create test tables
    await client.send(new CreateTableCommand({
      TableName: 'test-progress',
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
        { AttributeName: 'sk', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'sk', AttributeType: 'S' },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    }));
  });

  afterAll(async () => {
    await client.send(new DeleteTableCommand({ TableName: 'test-progress' }));
  });

  it('should record progress', async () => {
    // Test implementation
  });
});
```

### E2E Tests (with SST dev)

```typescript
// e2e/api.spec.ts
import { test, expect } from '@playwright/test';

test.describe('API E2E', () => {
  const API_URL = process.env.API_URL || 'http://localhost:3000';

  test('should list exercises', async ({ request }) => {
    const response = await request.get(`${API_URL}/exercises`);
    expect(response.ok()).toBe(true);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('should return 401 for unauthorized progress request', async ({ request }) => {
    const response = await request.get(`${API_URL}/progress`);
    expect(response.status()).toBe(401);
  });
});
```

---

## Deployment

### Set Secrets (First Time)

```bash
# Set secrets for the stage
pnpm sst secret set GithubClientId your-client-id --stage dev
pnpm sst secret set GithubClientSecret your-client-secret --stage dev
pnpm sst secret set JwtSecret $(openssl rand -base64 32) --stage dev
```

### Deploy

```bash
# Deploy to dev
pnpm sst deploy --stage dev

# Deploy to production
pnpm sst deploy --stage production
```

### Environment-Specific Config

```typescript
// sst.config.ts
export default $config({
  app(input) {
    return {
      name: "infra-learn",
      removal: input?.stage === "production" ? "retain" : "remove",
      // ...
    };
  },
});
```

---

## Lifecycle Analysis & Gap Identification

### Complete User Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPLETE USER LIFECYCLE                              │
└─────────────────────────────────────────────────────────────────────────────┘

PHASE 1: DISCOVERY
─────────────────
User lands on /labs → Browses modules → Reads about exercises

   ⚠️ GAPS IDENTIFIED:
   • [ ] Analytics tracking for user journey
   • [ ] A/B testing for conversion optimization
   • [ ] Social proof (completion counts, testimonials)


PHASE 2: ONBOARDING
───────────────────
User goes to /labs/setup → Installs CLI → Runs `infra-learn init`

   ⚠️ GAPS IDENTIFIED:
   • [ ] CLI binary distribution (GitHub Releases, Homebrew tap)
   • [ ] CLI installation verification endpoint
   • [ ] Troubleshooting guide for common install issues
   • [ ] Platform-specific instructions (Windows WSL, M1/M2 Macs)


PHASE 3: AUTHENTICATION
───────────────────────
User clicks Login → GitHub OAuth → JWT issued → Cookie stored

   ⚠️ GAPS IDENTIFIED:
   • [ ] CSRF protection for OAuth flow
   • [ ] Rate limiting on auth endpoints
   • [ ] Session invalidation on password change
   • [ ] "Remember me" vs session-only cookies
   • [ ] Logout endpoint to invalidate sessions
   • [ ] Token refresh mechanism (or accept 7-day expiry)


PHASE 4: EXERCISE DISCOVERY
───────────────────────────
User browses /labs/modules → Selects module → Views exercise

   ⚠️ GAPS IDENTIFIED:
   • [ ] Exercise content in database (or keep in MDX?)
   • [ ] Dynamic exercise metadata from API
   • [ ] Module prerequisites enforcement
   • [ ] Estimated completion time accuracy


PHASE 5: SANDBOX LAUNCH
───────────────────────
User copies CLI command → Runs `infra-learn launch linux-01`

   ⚠️ GAPS IDENTIFIED:
   • [ ] CLI needs to fetch exercise manifest from API or embed locally
   • [ ] Sandbox provisioning logic (Docker or AWS EC2)
   • [ ] Container image registry (ghcr.io or ECR)
   • [ ] Exercise container Dockerfiles
   • [ ] AWS backend: EC2 instance provisioning, AMI management
   • [ ] SSH key management for AWS sandboxes
   • [ ] Sandbox timeout/auto-cleanup
   • [ ] Resource limits (CPU, memory, disk)


PHASE 6: EXERCISE COMPLETION
────────────────────────────
User works in sandbox → Runs `infra-learn verify` → Checks pass

   ⚠️ GAPS IDENTIFIED:
   • [ ] Verification script format and runner
   • [ ] Verification scripts per exercise
   • [ ] Exit codes and error messages
   • [ ] Partial completion tracking
   • [ ] Hint system integration with CLI


PHASE 7: PROGRESS SYNC
──────────────────────
CLI calls API → Progress recorded → Frontend updates

   ⚠️ GAPS IDENTIFIED:
   • [ ] Offline progress storage in CLI
   • [ ] Conflict resolution for offline sync
   • [ ] Real-time progress updates (WebSocket or polling)
   • [ ] Progress webhook for external integrations


PHASE 8: CONTINUATION
─────────────────────
User returns → Sees progress → Continues next exercise

   ⚠️ GAPS IDENTIFIED:
   • [ ] "Continue where you left off" logic
   • [ ] Sandbox state persistence (optional)
   • [ ] Progress streaks / gamification
   • [ ] Email notifications for inactive users
```

### Critical Missing Components

| Priority | Component | Description | Effort |
|----------|-----------|-------------|--------|
| **P0** | CLI Binary | The actual CLI tool doesn't exist yet | High |
| **P0** | Exercise Containers | Docker images with exercise environments | Medium |
| **P0** | Verification Scripts | Scripts that check exercise completion | Medium |
| **P1** | AWS Sandbox Backend | EC2 provisioning in user's AWS account | High |
| **P1** | Golden AMI | Pre-built AMI for AWS sandboxes | Medium |
| **P1** | Exercise Manifests | YAML files defining exercises (CLI-side) | Low |
| **P2** | Progress Real-time | WebSocket or polling for live updates | Medium |
| **P2** | Offline Mode | Local progress storage and sync | Medium |
| **P3** | Analytics | Track user journey and conversions | Low |
| **P3** | Gamification | Streaks, badges, leaderboards | Medium |

### API Endpoints Summary

| Endpoint | Method | Auth | Status | Notes |
|----------|--------|------|--------|-------|
| `/auth/github` | GET | No | 🔴 Implement | Initiates OAuth |
| `/auth/github/callback` | GET | No | 🔴 Implement | Handles OAuth callback |
| `/auth/verify` | POST | Yes | 🔴 Implement | Verifies JWT |
| `/auth/logout` | POST | Yes | 🔴 Implement | Invalidates session |
| `/exercises` | GET | No | 🟡 Partial | Returns from static data or DB |
| `/exercises/{id}` | GET | No | 🔴 Implement | Single exercise details |
| `/progress` | GET | Yes | 🔴 Implement | User's progress |
| `/exercises/{id}/verify` | POST | Yes | 🔴 Implement | Record completion |
| `/users/me` | GET | Yes | 🔴 Implement | Current user profile |

### Database Schema Gaps

```
CURRENT TABLES:
✅ Users - User profiles
✅ Progress - Exercise completions
✅ Sessions - Auth sessions

POTENTIALLY NEEDED:
❓ Exercises - If moving from MDX to DB
❓ Sandboxes - Track active sandbox instances
❓ AuditLog - Track all user actions
❓ Feedback - User feedback/ratings per exercise
```

### Security Checklist

- [ ] Rate limiting on all endpoints
- [ ] Input validation on all handlers
- [ ] SQL injection prevention (N/A for DynamoDB)
- [ ] XSS prevention in frontend
- [ ] CSRF tokens for state-changing operations
- [ ] Secrets rotation policy
- [ ] API key for CLI (separate from user JWT?)
- [ ] Audit logging for security events
- [ ] CORS configuration review
- [ ] Content Security Policy headers

### Frontend Integration Points

```typescript
// Update src/utils/labs/api.ts to call real API

const API_URL = import.meta.env.PUBLIC_LABS_API_URL;

export async function fetchProgress(token: string): Promise<Progress[]> {
  const response = await fetch(`${API_URL}/progress`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch progress');
  }

  const data = await response.json();
  return data.progress;
}

// Update auth callback page to handle token from URL
// /labs/auth/callback.astro
```

---

## Next Steps Checklist

### Immediate (This Session)
- [ ] Create monorepo structure
- [ ] Set up SST config
- [ ] Implement auth endpoints
- [ ] Implement progress endpoints
- [ ] Local testing with DynamoDB

### Short Term (Next Session)
- [ ] Deploy to dev environment
- [ ] Connect frontend to real API
- [ ] Add integration tests
- [ ] Document API with examples

### Medium Term
- [ ] Build CLI tool (separate effort)
- [ ] Create exercise containers
- [ ] Write verification scripts
- [ ] AWS sandbox backend

---

**Last Updated**: 2025-01-27
