# Labs Platform Architecture

The Labs platform provides interactive, hands-on exercises for developers. Users complete tasks locally and verify their progress through the platform.

## Overview

Labs is designed around the concept of **learn by doing**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Labs Learning Flow                                 │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌───────────┐         ┌───────────┐         ┌───────────┐
     │           │         │           │         │           │
     │  1. READ  │────────>│  2. DO    │────────>│ 3. VERIFY │
     │           │         │           │         │           │
     └───────────┘         └───────────┘         └───────────┘
          │                     │                     │
          ▼                     ▼                     ▼
    ┌───────────┐         ┌───────────┐         ┌───────────┐
    │   Web UI  │         │  Local    │         │    CLI    │
    │           │         │  Machine  │         │  Command  │
    │ • Exercise│         │           │         │           │
    │   content │         │ • Terminal│         │ infra-    │
    │ • Hints   │         │ • Editor  │         │ learn     │
    │ • Docs    │         │ • Tools   │         │ verify    │
    └───────────┘         └───────────┘         └───────────┘
                                                     │
                                                     ▼
                               ┌─────────────────────────────────┐
                               │         4. TRACK PROGRESS        │
                               │                                  │
                               │  • API validates completion      │
                               │  • DynamoDB stores progress      │
                               │  • UI updates with checkmark     │
                               └─────────────────────────────────┘
```

1. User reads exercise instructions on the web
2. User performs tasks on their local machine (terminal, editor)
3. User runs a CLI command to verify completion
4. Progress is tracked and persisted via GitHub OAuth

## Directory Structure

### Frontend (apps/web)

```
apps/web/src/
├── components/labs/
│   ├── CLICommand.astro         # CLI command display
│   ├── DifficultyBadge.astro    # Beginner/Intermediate/Advanced badge
│   ├── ExerciseCard.astro       # Exercise preview card
│   ├── HintAccordion.astro      # Collapsible hints
│   ├── ModuleCard.astro         # Module overview card
│   ├── ObjectivesList.astro     # Exercise objectives
│   ├── ProgressBar.astro        # Completion progress
│   ├── VerificationChecklist.astro # Verification criteria
│   ├── islands/                 # Interactive Solid.js components
│   │   ├── AuthStatus.tsx       # Login/logout UI
│   │   ├── CLICommandCopy.tsx   # Copy-to-clipboard
│   │   └── ProgressTracker.tsx  # Real-time progress
│   └── layout/
│       ├── LabsHeader.astro     # Labs navigation
│       └── LabsSidebar.astro    # Module/exercise nav
├── content/labs/
│   ├── modules/                 # Module definitions
│   │   └── linux.mdx
│   ├── exercises/               # Exercise content
│   │   ├── linux-01.mdx
│   │   ├── linux-02.mdx
│   │   └── linux-03.mdx
│   └── schemas.ts               # Zod schemas (separate from config.ts)
├── pages/labs/
│   ├── index.astro              # Labs landing page
│   ├── dashboard.astro          # User dashboard
│   ├── login.astro              # Login page
│   ├── setup.astro              # CLI setup instructions
│   ├── auth/callback.astro      # OAuth callback handler
│   └── modules/
│       ├── index.astro          # Module listing
│       └── [...slug].astro      # Module/exercise pages
└── utils/labs/
    ├── api.ts                   # API client functions
    ├── auth.ts                  # Auth utilities
    ├── index.ts                 # Exports
    └── mocks.ts                 # Mock data for development
```

### Backend (packages/api)

```
packages/api/src/functions/
├── auth/
│   ├── github.ts       # Initiate GitHub OAuth
│   ├── callback.ts     # Handle OAuth callback, create JWT
│   ├── verify.ts       # Verify JWT token
│   └── logout.ts       # Invalidate session
├── exercises/
│   ├── list.ts         # List all exercises
│   └── get.ts          # Get exercise details
└── progress/
    ├── get.ts          # Get user progress
    └── record.ts       # Record exercise completion
```

## Content Schemas

Content collections are defined in `apps/web/src/content/config.ts`.

### Module Schema

```typescript
const labsModules = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().min(1),                              // Unique module identifier
    title: z.string().min(1),                           // Module title
    description: z.string().min(1),                     // Module description
    order: z.number().int().positive(),                 // Display order
    icon: z.string().optional(),                        // Emoji or icon
    prerequisites: z.array(z.string()).optional(),      // Required modules
    estimatedTime: z.string().min(1),                   // "2-3 hours"
    exerciseCount: z.number().int().nonnegative(),      // Number of exercises
    status: z.enum(['available', 'coming-soon', 'beta']).default('available'),
  }),
});
```

### Exercise Schema

```typescript
const labsExercises = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().min(1),                              // Unique exercise identifier
    module: z.string().min(1),                          // Parent module ID
    order: z.number().int().positive(),                 // Order within module
    title: z.string().min(1),                           // Exercise title
    description: z.string().min(1),                     // Brief description
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    estimatedTime: z.string().min(1),                   // "15 minutes"
    objectives: z.array(z.string()).min(1),             // Learning objectives
    verificationCriteria: z.array(z.string()).min(1),   // What gets verified
    hints: z.array(z.string()).optional(),              // Help hints
    cliCommand: z.string().startsWith('infra-learn'),   // Verification command
  }),
});
```

## Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │     │ Frontend │     │   API    │     │  GitHub  │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │ Click Login    │                │                │
     │───────────────>│                │                │
     │                │ GET /auth/github               │
     │                │───────────────>│                │
     │                │                │ Redirect URL   │
     │                │<───────────────│                │
     │ Redirect to GitHub              │                │
     │<────────────────────────────────────────────────>│
     │                │                │                │
     │ Grant Access   │                │                │
     │<───────────────────────────────────────────────>│
     │                │                │                │
     │ Callback with code              │                │
     │───────────────>│                │                │
     │                │ GET /auth/github/callback?code=│
     │                │───────────────>│                │
     │                │                │ Exchange code  │
     │                │                │───────────────>│
     │                │                │<───────────────│
     │                │                │ Access token   │
     │                │                │                │
     │                │                │ Get user info  │
     │                │                │───────────────>│
     │                │                │<───────────────│
     │                │                │                │
     │                │                │ Create/update user in DynamoDB
     │                │                │ Create session in DynamoDB
     │                │                │ Generate JWT (7-day expiry)
     │                │ Redirect with JWT              │
     │                │<───────────────│                │
     │ Store JWT      │                │                │
     │<───────────────│                │                │
```

## Progress Tracking

### DynamoDB Data Model

```typescript
// Progress Table
{
  pk: "USER#<github_id>",           // Partition key
  sk: "EXERCISE#<exercise_id>",     // Sort key
  gsi1pk: "EXERCISE#<exercise_id>", // For leaderboards (GSI)
  gsi1sk: "COMPLETED#<timestamp>",

  // Attributes
  completedAt: "2025-01-27T10:30:00Z",
  attempts: 3,
  verificationHash: "abc123",        // Proof of completion
}
```

### Verification Flow

```
1. User completes exercise locally
2. User runs: infra-learn verify <exercise-id>
3. CLI generates verification hash based on:
   - Local system state
   - Exercise requirements
   - Timestamp
4. CLI sends hash to POST /exercises/{id}/verify
5. API validates JWT from Authorization header
6. API validates hash format
7. API records completion in Progress table
8. Frontend updates to show completion
```

## API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/auth/github` | No | Redirect to GitHub OAuth |
| GET | `/auth/github/callback` | No | Handle OAuth callback, create JWT |
| POST | `/auth/verify` | JWT | Verify JWT token is valid |
| POST | `/auth/logout` | No | Invalidate session |

### Exercises

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/exercises` | No | List all exercises |
| GET | `/exercises/{id}` | No | Get exercise details |

### Progress

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/progress` | JWT | Get user's exercise progress |
| POST | `/exercises/{id}/verify` | JWT | Record exercise completion |

## Frontend Components

### Interactive Islands (Solid.js)

These components hydrate on the client for interactivity:

```tsx
// AuthStatus.tsx - Shows login/logout button
export function AuthStatus() {
  const [user, setUser] = createSignal<User | null>(null);
  // Checks localStorage for JWT, verifies with API
  // Shows login button or user avatar with logout
}

// ProgressTracker.tsx - Real-time progress updates
export function ProgressTracker(props: { exerciseId: string }) {
  const [progress, setProgress] = createSignal<Progress | null>(null);
  // Fetches progress from API, updates on completion
}

// CLICommandCopy.tsx - Copy command to clipboard
export function CLICommandCopy(props: { command: string }) {
  const [copied, setCopied] = createSignal(false);
  // Copies command to clipboard with visual feedback
}
```

### Usage in Astro

```astro
---
import { AuthStatus } from './islands/AuthStatus';
---

<AuthStatus client:load />
```

## Example Content

### Module Definition

```mdx
---
id: "linux"
title: "Linux Fundamentals"
description: "Master essential Linux commands and concepts"
order: 1
icon: "🐧"
estimatedTime: "4-6 hours"
exerciseCount: 3
prerequisites: []
status: "available"
---

## What You'll Learn

- Navigate the filesystem
- Manage files and directories
- Use pipes and redirects
- Understand permissions
```

### Exercise Definition

```mdx
---
id: "linux-01"
module: "linux"
order: 1
title: "Navigate the Filesystem"
description: "Learn to move around the Linux filesystem"
difficulty: "beginner"
estimatedTime: "15 minutes"
objectives:
  - "Use cd to change directories"
  - "Use ls to list directory contents"
  - "Understand absolute vs relative paths"
verificationCriteria:
  - "Navigate to /tmp"
  - "Create a directory called 'labs-test'"
  - "Navigate into labs-test"
hints:
  - "Remember, `cd ..` goes up one directory"
  - "Use `pwd` to print your current directory"
cliCommand: "infra-learn verify linux-01"
---

## Introduction

The filesystem is the foundation of Linux...
```

## Local Development

### Running Labs Locally

```bash
# Start frontend only
pnpm dev

# Start API (SST dev mode)
pnpm dev:api

# Start both together
pnpm dev:all

# Start local DynamoDB
pnpm db:local
```

### Mock Data

For frontend development without the API, mocks are available:

```typescript
// utils/labs/mocks.ts
export const mockUser: User = {
  id: "1",
  githubId: "12345",
  username: "developer",
  email: "dev@example.com",
  avatarUrl: "https://...",
};

export const mockProgress: Progress[] = [
  { exerciseId: "linux-01", completedAt: "2025-01-27" },
];
```

### Testing

```bash
# Unit tests for labs components
pnpm test:web

# E2E tests
pnpm test:e2e
```

## Related Documentation

- [Architecture Overview](./overview.md)
- [Backend (SST)](./backend-sst.md)
- [SST Development Guide](../sst-api-development.md)
- [CI/CD Workflows](./ci-cd.md)
