# SST & API Development Guide

This document provides comprehensive documentation for developing with SST in the akasha-labs project.

## Table of Contents

1. [Project Structure](#project-structure)
2. [SST Configuration](#sst-configuration)
3. [Infrastructure Modules](#infrastructure-modules)
4. [Adding New Routes](#adding-new-routes)
5. [Writing Lambda Handlers](#writing-lambda-handlers)
6. [Working with DynamoDB](#working-with-dynamodb)
7. [Secrets Management](#secrets-management)
8. [Local Development](#local-development)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Project Structure

```
akasha-lekha/
├── sst.config.ts              # Main SST configuration
├── infra/                     # Infrastructure definitions
│   ├── api.ts                 # API Gateway routes
│   ├── auth.ts                # Secrets (OAuth, JWT)
│   └── database.ts            # DynamoDB tables
├── packages/
│   └── api/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── lib/           # Shared utilities
│           │   ├── auth.ts    # JWT helpers
│           │   ├── db.ts      # DynamoDB client
│           │   └── response.ts # HTTP response helpers
│           └── functions/     # Lambda handlers
│               ├── auth/
│               ├── exercises/
│               └── progress/
├── docker-compose.yml         # Local DynamoDB
└── .env.local                 # Local environment variables
```

---

## SST Configuration

### Main Config (`sst.config.ts`)

```typescript
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "akasha-labs",           // App name (used in resource naming)
      removal: input?.stage === "prod" ? "retain" : "remove",  // Keep prod resources
      protect: ["prod"].includes(input?.stage ?? ""),          // Prevent accidental deletion
      home: "aws",
      providers: {
        aws: {
          region: "ap-south-1",
        },
      },
    };
  },
  async run() {
    // Import infrastructure modules
    const { database } = await import("./infra/database");
    const { auth } = await import("./infra/auth");
    const { api } = await import("./infra/api");

    // Return outputs (accessible via `sst output`)
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

### Key Concepts

- **Stage**: Environment identifier (`preview`, `prod`, or custom). Access via `$app.stage`
- **Removal**: `"remove"` deletes resources when stage is removed, `"retain"` keeps them
- **Protect**: Prevents accidental deletion of production resources
- **Outputs**: Values returned from `run()` are accessible via `pnpm sst output --stage <stage>`

---

## Infrastructure Modules

### Database (`infra/database.ts`)

DynamoDB tables with single-table design patterns:

```typescript
// Create a DynamoDB table
export const usersTable = new sst.aws.Dynamo("Users", {
  fields: {
    pk: "string",      // Partition key
    sk: "string",      // Sort key
    gsi1pk: "string",  // GSI partition key
    gsi1sk: "string",  // GSI sort key
  },
  primaryIndex: { hashKey: "pk", rangeKey: "sk" },
  globalIndexes: {
    gsi1: { hashKey: "gsi1pk", rangeKey: "gsi1sk" },
  },
  // Optional: enable TTL
  // ttl: "expiresAt",
});
```

### Auth/Secrets (`infra/auth.ts`)

```typescript
// Define secrets (values set via CLI)
export const githubClientId = new sst.Secret("GithubClientId");
export const githubClientSecret = new sst.Secret("GithubClientSecret");
export const jwtSecret = new sst.Secret("JwtSecret");
```

### API Gateway (`infra/api.ts`)

```typescript
import { database } from "./database";
import { auth } from "./auth";

// Frontend URL based on stage
const frontendUrls: Record<string, string> = {
  prod: "https://works-on-my.cloud",
  preview: "https://preview.works-on-my.cloud",
};
const frontendUrl = frontendUrls[$app.stage] || "http://localhost:4321";

// Create API Gateway
export const api = new sst.aws.ApiGatewayV2("Api", {
  cors: {
    allowOrigins: [frontendUrl],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowCredentials: true,
  },
});

// Add routes
api.route("GET /auth/github", {
  handler: "packages/api/src/functions/auth/github.handler",
  link: [auth.githubClientId],
  environment: {
    FRONTEND_URL: frontendUrl,
  },
});
```

---

## Adding New Routes

### Step 1: Define the Route in `infra/api.ts`

```typescript
// Public route (no auth required)
api.route("GET /exercises", {
  handler: "packages/api/src/functions/exercises/list.handler",
});

// Route with path parameters
api.route("GET /exercises/{id}", {
  handler: "packages/api/src/functions/exercises/get.handler",
});

// Route with linked resources (secrets, tables)
api.route("POST /exercises/{id}/verify", {
  handler: "packages/api/src/functions/progress/record.handler",
  link: [
    auth.jwtSecret,           // Access via Resource.JwtSecret.value
    database.progressTable,   // Access via Resource.Progress.name
    database.sessionsTable,
  ],
});

// Route with custom environment variables
api.route("GET /auth/github/callback", {
  handler: "packages/api/src/functions/auth/callback.handler",
  link: [auth.githubClientId, auth.githubClientSecret],
  environment: {
    FRONTEND_URL: frontendUrl,
    CUSTOM_VAR: "value",
  },
});
```

### Step 2: Create the Handler File

Create file at `packages/api/src/functions/<domain>/<action>.ts`:

```typescript
// packages/api/src/functions/exercises/list.ts
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { json, error } from "../../lib/response";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  // Your logic here
  return json({ exercises: [] });
};
```

### Route Patterns

| Pattern | Example | Path Parameters |
|---------|---------|-----------------|
| Static | `GET /exercises` | None |
| Single param | `GET /exercises/{id}` | `event.pathParameters?.id` |
| Multiple params | `GET /users/{userId}/progress/{exerciseId}` | Both available |
| Catch-all | `GET /files/{proxy+}` | `event.pathParameters?.proxy` |

### HTTP Methods

```typescript
api.route("GET /resource", { handler: "..." });
api.route("POST /resource", { handler: "..." });
api.route("PUT /resource/{id}", { handler: "..." });
api.route("PATCH /resource/{id}", { handler: "..." });
api.route("DELETE /resource/{id}", { handler: "..." });
```

---

## Writing Lambda Handlers

### Basic Handler Structure

```typescript
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { json, error, redirect } from "../../lib/response";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  // Access path parameters
  const id = event.pathParameters?.id;

  // Access query parameters
  const page = event.queryStringParameters?.page || "1";

  // Access headers
  const authHeader = event.headers.authorization;

  // Access request body (for POST/PUT)
  const body = event.body ? JSON.parse(event.body) : null;

  // Return responses
  return json({ data: "success" });           // 200 OK
  return json({ data: "created" }, 201);      // 201 Created
  return error("Not found", 404);             // 404 Error
  return redirect("https://example.com");     // 302 Redirect
};
```

### Accessing Linked Resources

```typescript
import { Resource } from "sst";

// Access secrets
const clientId = Resource.GithubClientId.value;
const jwtSecret = Resource.JwtSecret.value;

// Access DynamoDB table names
const tableName = Resource.Users.name;      // Returns actual table name
const progressTable = Resource.Progress.name;
```

### Handler with Authentication

```typescript
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { json, error } from "../../lib/response";
import { verifyToken, getTokenFromHeader } from "../../lib/auth";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  // Extract and verify token
  const token = getTokenFromHeader(event.headers.authorization);
  if (!token) {
    return error("Missing authorization header", 401);
  }

  const payload = verifyToken(token);
  if (!payload) {
    return error("Invalid or expired token", 401);
  }

  // Use authenticated user info
  const userId = payload.sub;
  const username = payload.username;

  // Your authenticated logic here
  return json({ userId, message: "Authenticated!" });
};
```

### Response Helpers (`lib/response.ts`)

```typescript
import type { APIGatewayProxyResultV2 } from "aws-lambda";

// JSON response
export function json(data: unknown, statusCode = 200): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}

// Error response
export function error(message: string, statusCode = 400): APIGatewayProxyResultV2 {
  return json({ error: message }, statusCode);
}

// Redirect response
export function redirect(url: string): APIGatewayProxyResultV2 {
  return {
    statusCode: 302,
    headers: { Location: url },
    body: "",
  };
}
```

---

## Working with DynamoDB

### Database Client (`lib/db.ts`)

```typescript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
});

export const db = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

export { GetCommand, PutCommand, QueryCommand, DeleteCommand, UpdateCommand };
```

### Common Operations

#### Get Item

```typescript
import { Resource } from "sst";
import { db, GetCommand } from "../../lib/db";

const result = await db.send(new GetCommand({
  TableName: Resource.Users.name,
  Key: {
    pk: `USER#${githubId}`,
    sk: "PROFILE",
  },
}));

const user = result.Item;
```

#### Put Item

```typescript
await db.send(new PutCommand({
  TableName: Resource.Users.name,
  Item: {
    pk: `USER#${githubId}`,
    sk: "PROFILE",
    gsi1pk: `EMAIL#${email}`,
    gsi1sk: `USER#${githubId}`,
    username,
    email,
    avatarUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
}));
```

#### Query Items

```typescript
// Query by partition key
const result = await db.send(new QueryCommand({
  TableName: Resource.Progress.name,
  KeyConditionExpression: "pk = :pk",
  ExpressionAttributeValues: {
    ":pk": `USER#${userId}`,
  },
}));

const items = result.Items || [];
```

#### Query with GSI

```typescript
const result = await db.send(new QueryCommand({
  TableName: Resource.Users.name,
  IndexName: "gsi1",
  KeyConditionExpression: "gsi1pk = :email",
  ExpressionAttributeValues: {
    ":email": `EMAIL#${email}`,
  },
}));
```

#### Delete Item

```typescript
await db.send(new DeleteCommand({
  TableName: Resource.Sessions.name,
  Key: {
    pk: `SESSION#${tokenHash}`,
    sk: `USER#${userId}`,
  },
}));
```

#### Update Item

```typescript
await db.send(new UpdateCommand({
  TableName: Resource.Progress.name,
  Key: {
    pk: `USER#${userId}`,
    sk: `EXERCISE#${exerciseId}`,
  },
  UpdateExpression: "SET attempts = attempts + :inc, updatedAt = :now",
  ExpressionAttributeValues: {
    ":inc": 1,
    ":now": new Date().toISOString(),
  },
}));
```

### Key Design Patterns

| Entity | PK | SK | GSI1PK | GSI1SK |
|--------|----|----|--------|--------|
| User | `USER#<github_id>` | `PROFILE` | `EMAIL#<email>` | `USER#<github_id>` |
| Progress | `USER#<github_id>` | `EXERCISE#<exercise_id>` | `EXERCISE#<id>` | `COMPLETED#<timestamp>` |
| Session | `SESSION#<token_hash>` | `USER#<github_id>` | - | - |

---

## Secrets Management

### Setting Secrets

```bash
# Set a secret for a specific stage
pnpm sst secret set GithubClientId <value> --stage preview
pnpm sst secret set GithubClientSecret <value> --stage preview
pnpm sst secret set JwtSecret $(openssl rand -base64 32) --stage preview

# Production secrets
pnpm sst secret set GithubClientId <value> --stage prod
pnpm sst secret set GithubClientSecret <value> --stage prod
pnpm sst secret set JwtSecret $(openssl rand -base64 32) --stage prod
```

### Listing Secrets

```bash
pnpm sst secret list --stage preview
```

### Removing Secrets

```bash
pnpm sst secret remove SecretName --stage preview
```

### Defining New Secrets

1. Add to `infra/auth.ts`:

```typescript
export const newSecret = new sst.Secret("NewSecretName");

export const auth = {
  githubClientId,
  githubClientSecret,
  jwtSecret,
  newSecret,  // Add here
};
```

2. Link to routes that need it in `infra/api.ts`:

```typescript
api.route("GET /route", {
  handler: "...",
  link: [auth.newSecret],
});
```

3. Set the value:

```bash
pnpm sst secret set NewSecretName <value> --stage preview
```

4. Access in handler:

```typescript
import { Resource } from "sst";
const value = Resource.NewSecretName.value;
```

---

## Local Development

### Start Local DynamoDB

```bash
# Start DynamoDB Local and Admin UI
pnpm db:local
# or
docker-compose up -d

# Stop
pnpm db:local:stop
# or
docker-compose down
```

- DynamoDB Local: http://localhost:8000
- DynamoDB Admin UI: http://localhost:8001

### Environment Variables (`.env.local`)

```bash
DYNAMODB_ENDPOINT=http://localhost:8000
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=local
AWS_SECRET_ACCESS_KEY=local
```

### Run SST Dev Mode

```bash
# Start SST development (live Lambda)
pnpm sst dev

# Or with a specific stage
pnpm sst dev --stage preview
```

SST dev mode:
- Deploys real AWS resources
- Routes Lambda invocations to your local machine
- Provides live reload on code changes
- Generates TypeScript types in `.sst/`

### Running Both Web and API

```bash
pnpm dev:all
```

---

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
# Get API URL and other outputs
pnpm sst output --stage preview
```

### Remove a Stage

```bash
# Remove all resources for a stage (won't work for protected stages)
pnpm sst remove --stage dev
```

---

## Troubleshooting

### TypeScript Errors for `Resource.*`

**Problem**: `Property 'X' does not exist on type 'Resource'`

**Solution**: Run `pnpm sst dev` or `pnpm sst deploy` to generate types in `.sst/`

### Secret Not Found

**Problem**: `Secret X is not set`

**Solution**:
```bash
pnpm sst secret set X <value> --stage <stage>
pnpm sst deploy --stage <stage>
```

### CORS Errors

**Problem**: Browser blocks requests due to CORS

**Solution**: Check `infra/api.ts` CORS configuration:
```typescript
cors: {
  allowOrigins: [frontendUrl],  // Must match exact origin
  allowCredentials: true,
}
```

### DynamoDB Local Connection Issues

**Problem**: Cannot connect to local DynamoDB

**Solution**:
1. Ensure Docker is running
2. Check `docker-compose up -d` completed successfully
3. Verify `.env.local` has correct `DYNAMODB_ENDPOINT`

### Lambda Timeout

**Problem**: Function times out

**Solution**: Increase timeout in route config:
```typescript
api.route("POST /slow-operation", {
  handler: "...",
  timeout: "30 seconds",  // Default is 10 seconds
});
```

### Cold Start Issues

**Problem**: First request is slow

**Solution**: Consider provisioned concurrency for critical paths:
```typescript
api.route("GET /critical", {
  handler: "...",
  memory: "512 MB",  // More memory = faster CPU
});
```

---

## Quick Reference

### Common Commands

| Command | Description |
|---------|-------------|
| `pnpm sst dev` | Start local development |
| `pnpm sst deploy --stage X` | Deploy to stage X |
| `pnpm sst remove --stage X` | Remove stage X |
| `pnpm sst output --stage X` | View outputs for stage X |
| `pnpm sst secret set K V --stage X` | Set secret K to V |
| `pnpm sst secret list --stage X` | List secrets |
| `pnpm db:local` | Start local DynamoDB |

### File Locations

| Purpose | Location |
|---------|----------|
| SST config | `/sst.config.ts` |
| API routes | `/infra/api.ts` |
| DynamoDB tables | `/infra/database.ts` |
| Secrets | `/infra/auth.ts` |
| Lambda handlers | `/packages/api/src/functions/` |
| Shared utilities | `/packages/api/src/lib/` |
| Types | `/packages/types/src/` |

### Response Status Codes

| Code | Usage |
|------|-------|
| 200 | Success (GET, PUT) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 302 | Redirect |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |
