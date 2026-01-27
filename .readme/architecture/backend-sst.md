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
│  │  - Stages: preview, prod                               │  │
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
      providers: { aws: { region: "ap-south-1" } },
    };
  },
  async run() {
    const { database } = await import("./infra/database");
    const { auth } = await import("./infra/auth");
    const { api } = await import("./infra/api");
    return { api: api.url, tables: { ... } };
  },
});
```

### `infra/database.ts`

DynamoDB tables with single-table design:

| Table | Purpose | Key Schema |
|-------|---------|------------|
| Users | User profiles | `pk=USER#<id>`, `sk=PROFILE` |
| Progress | Exercise completions | `pk=USER#<id>`, `sk=EXERCISE#<id>` |
| Sessions | Auth sessions | `pk=SESSION#<hash>`, `sk=USER#<id>` |

### `infra/auth.ts`

SST Secrets for sensitive configuration:

| Secret | Purpose |
|--------|---------|
| `GithubClientId` | GitHub OAuth app ID |
| `GithubClientSecret` | GitHub OAuth secret |
| `JwtSecret` | JWT signing key |

### `infra/api.ts`

API Gateway with Lambda routes:

| Route | Handler | Linked Resources |
|-------|---------|------------------|
| `GET /auth/github` | `auth/github.ts` | GithubClientId |
| `GET /auth/github/callback` | `auth/callback.ts` | All auth + Users, Sessions |
| `POST /auth/verify` | `auth/verify.ts` | JwtSecret, Sessions |
| `POST /auth/logout` | `auth/logout.ts` | Sessions |
| `GET /exercises` | `exercises/list.ts` | None |
| `GET /exercises/{id}` | `exercises/get.ts` | None |
| `GET /progress` | `progress/get.ts` | JwtSecret, Progress, Sessions |
| `POST /exercises/{id}/verify` | `progress/record.ts` | JwtSecret, Progress, Sessions |

## Lambda Functions

### Handler Structure

```typescript
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Resource } from "sst";
import { json, error, redirect } from "../../lib/response";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  // Access linked resources
  const secret = Resource.JwtSecret.value;
  const tableName = Resource.Users.name;

  // Access request data
  const id = event.pathParameters?.id;
  const body = event.body ? JSON.parse(event.body) : null;
  const token = event.headers.authorization;

  // Return response
  return json({ data: "success" });
};
```

### Shared Libraries

**`lib/db.ts`** - DynamoDB client:
```typescript
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
export const db = DynamoDBDocumentClient.from(client);
```

**`lib/auth.ts`** - JWT utilities:
```typescript
export function createToken(payload): string;
export function verifyToken(token): JwtPayload | null;
export function getTokenFromHeader(header): string | null;
```

**`lib/response.ts`** - HTTP helpers:
```typescript
export function json(data, status = 200);
export function error(message, status = 400);
export function redirect(url);
```

## Environments

| Stage | API URL | DynamoDB Tables | Secrets |
|-------|---------|-----------------|---------|
| `preview` | `https://<id>.execute-api.ap-south-1.amazonaws.com` | `preview-*` | Preview secrets |
| `prod` | `https://<id>.execute-api.ap-south-1.amazonaws.com` | `prod-*` | Production secrets |

## Development Workflow

### Local Development

```bash
# Start SST dev mode (live Lambda)
pnpm sst dev

# With specific stage
pnpm sst dev --stage preview
```

SST dev mode:
- Deploys real AWS resources
- Routes Lambda invocations to local machine
- Hot reloads on code changes
- Generates TypeScript types

### Local DynamoDB

```bash
# Start local DynamoDB
pnpm db:local

# Access Admin UI
open http://localhost:8001
```

### Testing

```bash
# Run API tests
pnpm test:api

# Test specific endpoint
curl https://<api-url>/exercises
```

## Deployment

### Deploy to Preview

```bash
pnpm sst deploy --stage preview
```

### Deploy to Production

```bash
pnpm sst deploy --stage prod
```

### View Outputs

```bash
pnpm sst output --stage preview
# Returns: api URL, table names
```

## Secrets Management

### Set Secrets

```bash
# Preview
pnpm sst secret set GithubClientId <value> --stage preview
pnpm sst secret set GithubClientSecret <value> --stage preview
pnpm sst secret set JwtSecret $(openssl rand -base64 32) --stage preview

# Production
pnpm sst secret set GithubClientId <value> --stage prod
pnpm sst secret set GithubClientSecret <value> --stage prod
pnpm sst secret set JwtSecret $(openssl rand -base64 32) --stage prod
```

### List Secrets

```bash
pnpm sst secret list --stage preview
```

## Adding New Features

### New Route

1. Add route in `infra/api.ts`:
   ```typescript
   api.route("GET /new-route", {
     handler: "packages/api/src/functions/domain/handler.handler",
     link: [/* resources */],
   });
   ```

2. Create handler in `packages/api/src/functions/`:
   ```typescript
   export const handler: APIGatewayProxyHandlerV2 = async (event) => {
     return json({ data: "success" });
   };
   ```

### New Table

1. Add in `infra/database.ts`:
   ```typescript
   export const newTable = new sst.aws.Dynamo("NewTable", {
     fields: { pk: "string", sk: "string" },
     primaryIndex: { hashKey: "pk", rangeKey: "sk" },
   });
   ```

2. Link to routes that need it in `infra/api.ts`

### New Secret

1. Add in `infra/auth.ts`:
   ```typescript
   export const newSecret = new sst.Secret("NewSecret");
   ```

2. Set value:
   ```bash
   pnpm sst secret set NewSecret <value> --stage <stage>
   ```

3. Access in handler:
   ```typescript
   const value = Resource.NewSecret.value;
   ```

## Monitoring

### CloudWatch Logs

Each Lambda function logs to CloudWatch. View via:
- AWS Console
- `sst dev` terminal output
- CloudWatch Logs Insights

### Metrics

- Lambda invocations, duration, errors
- API Gateway requests, latency
- DynamoDB read/write capacity

## Security

### IAM Permissions

SST automatically creates least-privilege IAM roles:
- Each Lambda only accesses linked resources
- DynamoDB permissions scoped to specific tables

### CORS

Configured in `infra/api.ts`:
```typescript
cors: {
  allowOrigins: [frontendUrl],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  allowCredentials: true,
}
```

### Secrets

- Never in code or git
- Per-stage isolation
- Encrypted at rest in AWS

## Detailed Guide

For comprehensive development instructions, see:
**[SST API Development Guide](../sst-api-development.md)**

## Related Documentation

- [Architecture Overview](./overview.md)
- [Labs Platform](./labs.md)
- [CI/CD Workflows](./ci-cd.md)
