# Backend Architecture (SST)

The backend is built with SST (Serverless Stack) v3, providing serverless infrastructure on AWS.

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         SST v3                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  sst.config.ts                         │  │
│  │  - App: akasha-labs                                    │  │
│  │  - Region: ap-south-1                                  │  │
│  │  - Stages: dev, preview, prod                          │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│              ┌─────────────┼─────────────┐                  │
│              ▼             ▼             ▼                  │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐     │
│  │ infra/api.ts  │ │infra/auth.ts │ │infra/database │     │
│  │               │ │              │ │     .ts       │     │
│  │ API Gateway   │ │  Secrets     │ │  DynamoDB     │     │
│  │ + Lambda      │ │              │ │  Tables       │     │
│  └───────────────┘ └───────────────┘ └───────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    packages/api/                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  src/functions/                                        │  │
│  │  ├── auth/     (github, callback, verify, logout)     │  │
│  │  ├── exercises/(list, get)                            │  │
│  │  └── progress/ (get, record)                          │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  src/lib/                                              │  │
│  │  ├── db.ts       (DynamoDB client)                    │  │
│  │  ├── auth.ts     (JWT utilities)                      │  │
│  │  └── response.ts (HTTP helpers)                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Infrastructure Files

### `sst.config.ts`

Main SST configuration:

```typescript
export default $config({
  app(input) {
    return {
      name: "akasha-labs",
      removal: input?.stage === "prod" ? "retain" : "remove",
      protect: ["prod"].includes(input?.stage ?? ""),
      home: "aws",
      providers: {
        aws: {
          region: "ap-south-1",
        },
      },
    };
  },
  async run() {
    const { database } = await import("./infra/database");
    const { auth } = await import("./infra/auth");
    const { api } = await import("./infra/api");

    return {
      api: api.url,
      tables: {
        users: database.usersTable.name,
        progress: database.progressTable.name,
        sessions: database.sessionsTable.name,
      },
    };
  },
});
```

**Configuration details:**
- `removal: "retain"` for prod prevents accidental data loss
- `protect: true` for prod requires confirmation for destructive changes
- Returns API URL and table names as stack outputs

### `infra/database.ts`

DynamoDB tables with single-table design:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DynamoDB Tables                                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  USERS TABLE                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Primary Index                    │  GSI1 (Email Lookup)            │    │
│  │  ─────────────                    │  ────────────────────           │    │
│  │  pk: USER#<github_id>             │  gsi1pk: EMAIL#<email>          │    │
│  │  sk: PROFILE                      │  gsi1sk: USER#<github_id>       │    │
│  │                                   │                                  │    │
│  │  Attributes:                      │  Use case: Find user by email   │    │
│  │  - username                       │                                  │    │
│  │  - email                          │                                  │    │
│  │  - avatarUrl                      │                                  │    │
│  │  - createdAt                      │                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  PROGRESS TABLE                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Primary Index                    │  GSI1 (Exercise Stats)          │    │
│  │  ─────────────                    │  ────────────────────           │    │
│  │  pk: USER#<github_id>             │  gsi1pk: EXERCISE#<id>          │    │
│  │  sk: EXERCISE#<exercise_id>       │  gsi1sk: COMPLETED#<timestamp>  │    │
│  │                                   │                                  │    │
│  │  Attributes:                      │  Use case: Leaderboards,        │    │
│  │  - completedAt                    │  exercise completion counts     │    │
│  │  - attempts                       │                                  │    │
│  │  - verificationHash               │                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  SESSIONS TABLE                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Primary Index                    │  TTL                            │    │
│  │  ─────────────                    │  ───                            │    │
│  │  pk: SESSION#<token_hash>         │  expiresAt: <unix_timestamp>    │    │
│  │  sk: USER#<github_id>             │                                  │    │
│  │                                   │  Auto-deletes expired sessions  │    │
│  │  Attributes:                      │                                  │    │
│  │  - createdAt                      │                                  │    │
│  │  - userAgent                      │                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Table | Purpose | Key Schema | GSI |
|-------|---------|------------|-----|
| Users | User profiles | `pk=USER#<github_id>`, `sk=PROFILE` | `gsi1pk=EMAIL#<email>`, `gsi1sk=USER#<id>` |
| Progress | Exercise completions | `pk=USER#<github_id>`, `sk=EXERCISE#<id>` | `gsi1pk=EXERCISE#<id>`, `gsi1sk=COMPLETED#<ts>` |
| Sessions | Auth sessions | `pk=SESSION#<token_hash>`, `sk=USER#<github_id>` | TTL on `expiresAt` |

```typescript
// Sessions table with TTL for automatic cleanup
export const sessionsTable = new sst.aws.Dynamo("Sessions", {
  fields: {
    pk: "string",  // SESSION#<token_hash>
    sk: "string",  // USER#<github_id>
  },
  primaryIndex: { hashKey: "pk", rangeKey: "sk" },
  ttl: "expiresAt",  // Automatic expiration
});
```

### `infra/auth.ts`

SST Secrets for sensitive configuration:

```typescript
export const githubClientId = new sst.Secret("GithubClientId");
export const githubClientSecret = new sst.Secret("GithubClientSecret");
export const jwtSecret = new sst.Secret("JwtSecret");

export const auth = {
  githubClientId,
  githubClientSecret,
  jwtSecret,
};
```

| Secret | Purpose |
|--------|---------|
| `GithubClientId` | GitHub OAuth app ID |
| `GithubClientSecret` | GitHub OAuth secret |
| `JwtSecret` | JWT signing key (32+ bytes recommended) |

### `infra/api.ts`

API Gateway with Lambda routes and CORS:

```typescript
const frontendUrls: Record<string, string> = {
  prod: "https://works-on-my.cloud",
  preview: "https://preview.works-on-my.cloud",
};

const frontendUrl = frontendUrls[$app.stage] || "http://localhost:4321";

export const api = new sst.aws.ApiGatewayV2("Api", {
  cors: {
    allowOrigins: [frontendUrl],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowCredentials: true,
  },
});
```

**Routes:**

| Route | Handler | Linked Resources |
|-------|---------|------------------|
| `GET /auth/github` | `auth/github.ts` | GithubClientId |
| `GET /auth/github/callback` | `auth/callback.ts` | All auth secrets + Users, Sessions |
| `POST /auth/verify` | `auth/verify.ts` | JwtSecret, Sessions |
| `POST /auth/logout` | `auth/logout.ts` | Sessions |
| `GET /exercises` | `exercises/list.ts` | None (public) |
| `GET /exercises/{id}` | `exercises/get.ts` | None (public) |
| `GET /progress` | `progress/get.ts` | JwtSecret, Progress, Sessions |
| `POST /exercises/{id}/verify` | `progress/record.ts` | JwtSecret, Progress, Sessions |

## Lambda Functions

### Handler Structure

```typescript
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Resource } from "sst";
import { json, error, redirect } from "../../lib/response";
import { db, GetCommand, PutCommand } from "../../lib/db";
import { verifyToken, getTokenFromHeader } from "../../lib/auth";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  // Access linked resources (only available if linked in infra/api.ts)
  const secret = Resource.JwtSecret.value;
  const tableName = Resource.Users.name;

  // Access request data
  const id = event.pathParameters?.id;
  const query = event.queryStringParameters?.page;
  const body = event.body ? JSON.parse(event.body) : null;
  const authHeader = event.headers.authorization;

  // Auth check pattern
  const token = getTokenFromHeader(authHeader);
  if (!token) return error("Missing authorization", 401);
  const payload = verifyToken(token);
  if (!payload) return error("Invalid token", 401);

  // DynamoDB operations
  const result = await db.send(new GetCommand({
    TableName: Resource.Users.name,
    Key: { pk: `USER#${payload.sub}`, sk: "PROFILE" },
  }));

  // Return responses
  return json({ data: "success" });         // 200
  return json({ data: "created" }, 201);    // 201
  return error("Not found", 404);           // 404
  return redirect("https://...");           // 302
};
```

### Shared Libraries

**`lib/db.ts`** - DynamoDB client with local support:

```typescript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const isLocal = process.env.DYNAMODB_ENDPOINT !== undefined;

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
  ...(isLocal && {
    endpoint: process.env.DYNAMODB_ENDPOINT,
    credentials: { accessKeyId: "local", secretAccessKey: "local" },
  }),
});

export const db = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

export { GetCommand, PutCommand, QueryCommand, DeleteCommand };
```

**`lib/auth.ts`** - JWT utilities:

```typescript
import jwt from "jsonwebtoken";
import { Resource } from "sst";

export function createToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
  return jwt.sign(payload, Resource.JwtSecret.value, { expiresIn: "7d" });
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

**`lib/response.ts`** - HTTP helpers:

```typescript
export function json(data: unknown, statusCode = 200): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}

export function error(message: string, statusCode = 400): APIGatewayProxyResultV2 {
  return json({ error: message }, statusCode);
}

export function redirect(url: string): APIGatewayProxyResultV2 {
  return { statusCode: 302, headers: { Location: url }, body: "" };
}
```

## Environments

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                    SST Stages                            │
                    └─────────────────────────────────────────────────────────┘
                                              │
           ┌──────────────────────────────────┼──────────────────────────────────┐
           │                                  │                                  │
           ▼                                  ▼                                  ▼
┌─────────────────────┐          ┌─────────────────────┐          ┌─────────────────────┐
│        dev          │          │      preview        │          │        prod         │
├─────────────────────┤          ├─────────────────────┤          ├─────────────────────┤
│ CORS: localhost     │          │ CORS: preview.*     │          │ CORS: works-on-my   │
│ Tables: dev-*       │          │ Tables: preview-*   │          │ Tables: prod-*      │
│ Removal: remove     │          │ Removal: remove     │          │ Removal: retain     │
│ Protected: no       │          │ Protected: no       │          │ Protected: yes      │
└─────────────────────┘          └─────────────────────┘          └─────────────────────┘
         │                                │                                │
         │                                │                                │
         ▼                                ▼                                ▼
   Local Development              PR Preview Deploys              Production Site
   (pnpm sst dev)                (GitHub Actions)               (GitHub Actions)
```

| Stage | API URL | DynamoDB | Secrets | CORS Origin |
|-------|---------|----------|---------|-------------|
| `dev` | Personal dev URL | `dev-*` tables | Dev secrets | `localhost:4321` |
| `preview` | `https://<id>.execute-api.ap-south-1.amazonaws.com` | `preview-*` tables | Preview secrets | `preview.works-on-my.cloud` |
| `prod` | `https://<id>.execute-api.ap-south-1.amazonaws.com` | `prod-*` tables | Production secrets | `works-on-my.cloud` |

## Development Workflow

### Local Development

```bash
# Start SST dev mode (live Lambda)
pnpm sst dev

# With specific stage
pnpm sst dev --stage dev
```

SST dev mode:
- Deploys real AWS resources (API Gateway, DynamoDB tables)
- Routes Lambda invocations to your local machine via WebSocket
- Hot reloads on code changes
- Generates TypeScript types in `.sst/`

### Local DynamoDB

```bash
# Start local DynamoDB + Admin UI (via Docker)
pnpm db:local

# Access endpoints
# DynamoDB: http://localhost:8000
# Admin UI: http://localhost:8001

# Stop
pnpm db:local:stop
```

### Testing

```bash
# Run API tests
pnpm test:api

# Test specific endpoint
curl https://<api-url>/exercises

# With auth
curl -H "Authorization: Bearer <jwt>" https://<api-url>/progress
```

## Deployment

### Manual Deployment

```bash
# Deploy to preview
pnpm sst deploy --stage preview

# Deploy to production (protected)
pnpm sst deploy --stage prod
```

### CI/CD Deployment

Deployments run automatically via GitHub Actions using OIDC authentication:
- **PR opened/updated**: Deploy to `preview` stage
- **PR closed**: Remove `preview` stage resources
- **Merge to main**: Deploy to `prod` stage

See [CI/CD Workflows](./ci-cd.md) and [AWS OIDC Setup](../aws-oidc-setup.md).

### View Outputs

```bash
pnpm sst output --stage preview
# Returns:
# api: https://xxxxx.execute-api.ap-south-1.amazonaws.com
# tables.users: preview-akasha-labs-Users
# tables.progress: preview-akasha-labs-Progress
# tables.sessions: preview-akasha-labs-Sessions
```

### Remove Resources

```bash
# Remove all resources for a stage (not prod)
pnpm sst remove --stage dev
```

## Secrets Management

### Set Secrets

```bash
# Preview environment
pnpm sst secret set GithubClientId <value> --stage preview
pnpm sst secret set GithubClientSecret <value> --stage preview
pnpm sst secret set JwtSecret $(openssl rand -base64 32) --stage preview

# Production environment
pnpm sst secret set GithubClientId <value> --stage prod
pnpm sst secret set GithubClientSecret <value> --stage prod
pnpm sst secret set JwtSecret $(openssl rand -base64 32) --stage prod
```

### List Secrets

```bash
pnpm sst secret list --stage preview
```

### Access in Code

```typescript
import { Resource } from "sst";

const clientId = Resource.GithubClientId.value;
const secret = Resource.JwtSecret.value;
```

## Adding New Features

### New Route

1. Add route in `infra/api.ts`:
   ```typescript
   api.route("POST /new-route/{id}", {
     handler: "packages/api/src/functions/domain/handler.handler",
     link: [auth.jwtSecret, database.usersTable],
     environment: { CUSTOM_VAR: "value" },
   });
   ```

2. Create handler in `packages/api/src/functions/domain/handler.ts`:
   ```typescript
   import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
   import { Resource } from "sst";
   import { json, error } from "../../lib/response";

   export const handler: APIGatewayProxyHandlerV2 = async (event) => {
     const id = event.pathParameters?.id;
     return json({ id, message: "success" });
   };
   ```

3. Run `pnpm sst dev` to generate TypeScript types

### New Table

1. Add in `infra/database.ts`:
   ```typescript
   export const newTable = new sst.aws.Dynamo("NewTable", {
     fields: {
       pk: "string",
       sk: "string",
     },
     primaryIndex: { hashKey: "pk", rangeKey: "sk" },
   });

   export const database = {
     // ... existing
     newTable,
   };
   ```

2. Link to routes in `infra/api.ts`:
   ```typescript
   api.route("GET /new-data", {
     handler: "...",
     link: [database.newTable],
   });
   ```

### New Secret

1. Add in `infra/auth.ts`:
   ```typescript
   export const newSecret = new sst.Secret("NewSecret");

   export const auth = {
     // ... existing
     newSecret,
   };
   ```

2. Set value per stage:
   ```bash
   pnpm sst secret set NewSecret <value> --stage preview
   pnpm sst secret set NewSecret <value> --stage prod
   ```

3. Access in handler:
   ```typescript
   import { Resource } from "sst";
   const value = Resource.NewSecret.value;
   ```

## Monitoring

### CloudWatch Logs

Each Lambda function logs to CloudWatch automatically. View via:
- AWS Console → CloudWatch → Log groups → `/aws/lambda/akasha-labs-*`
- `sst dev` terminal output (live streaming)
- CloudWatch Logs Insights for queries

### Metrics

Built-in metrics available:
- Lambda: invocations, duration, errors, cold starts
- API Gateway: requests, latency, 4xx/5xx errors
- DynamoDB: read/write capacity, throttled requests

## Security

### IAM Permissions

SST automatically creates least-privilege IAM roles:
- Each Lambda only accesses resources explicitly linked
- DynamoDB permissions scoped to specific tables
- Secrets only accessible to handlers that link them

### CORS

Configured per-stage in `infra/api.ts`:
```typescript
cors: {
  allowOrigins: [frontendUrl],  // Stage-specific
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  allowCredentials: true,
}
```

### Secrets

- Never stored in code or git
- Per-stage isolation (preview secrets separate from prod)
- Encrypted at rest in AWS SSM Parameter Store
- Only accessible to linked Lambda functions

## Related Documentation

- [Architecture Overview](./overview.md)
- [Labs Platform](./labs.md)
- [CI/CD Workflows](./ci-cd.md)
- [SST Development Guide](../sst-api-development.md)
- [AWS OIDC Setup](../aws-oidc-setup.md)
