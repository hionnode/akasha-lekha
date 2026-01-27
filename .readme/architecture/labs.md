# Labs Platform Architecture

The Labs platform provides interactive, hands-on exercises for developers. Users complete tasks locally and verify their progress through the platform.

## Overview

Labs is designed around the concept of **learn by doing**:

1. User reads exercise instructions on the web
2. User performs tasks on their local machine (terminal, editor)
3. User runs a CLI command to verify completion
4. Progress is tracked and persisted

## Directory Structure

### Frontend (apps/web)

```
apps/web/src/
├── components/labs/
│   ├── CLICommand.astro         # CLI command display
│   ├── DifficultyBadge.astro    # Easy/Medium/Hard badge
│   ├── ExerciseCard.astro       # Exercise preview card
│   ├── HintAccordion.astro      # Collapsible hints
│   ├── ModuleCard.astro         # Module overview card
│   ├── ObjectivesList.astro     # Exercise objectives
│   ├── ProgressBar.astro        # Completion progress
│   ├── VerificationChecklist.astro # Verification steps
│   ├── islands/                 # Interactive components
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
│   └── schemas.ts               # Content schemas
├── pages/labs/
│   ├── index.astro              # Labs landing
│   ├── dashboard.astro          # User dashboard
│   ├── login.astro              # Login page
│   ├── setup.astro              # CLI setup instructions
│   ├── auth/callback.astro      # OAuth callback
│   └── modules/
│       ├── index.astro          # Module listing
│       └── [...slug].astro      # Module/exercise pages
└── utils/labs/
    ├── api.ts                   # API client
    ├── auth.ts                  # Auth utilities
    └── mocks.ts                 # Mock data for dev
```

### Backend (packages/api)

```
packages/api/src/functions/
├── auth/
│   ├── github.ts       # Initiate GitHub OAuth
│   ├── callback.ts     # Handle OAuth callback
│   ├── verify.ts       # Verify JWT token
│   └── logout.ts       # Invalidate session
├── exercises/
│   ├── list.ts         # List all exercises
│   └── get.ts          # Get exercise details
└── progress/
    ├── get.ts          # Get user progress
    └── record.ts       # Record exercise completion
```

## Content Schema

### Module Schema

```typescript
const moduleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),                    // Emoji or icon name
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedTime: z.string(),           // "2-3 hours"
  prerequisites: z.array(z.string()).optional(),
  tags: z.array(z.string()),
  status: z.enum(['available', 'coming-soon', 'beta']),
});
```

### Exercise Schema

```typescript
const exerciseSchema = z.object({
  id: z.string(),
  module: z.string(),                  // Reference to module
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  estimatedTime: z.string(),           // "15 minutes"
  objectives: z.array(z.string()),
  hints: z.array(z.object({
    title: z.string(),
    content: z.string(),
  })).optional(),
  cliCommand: z.string(),              // Verification command
  verificationSteps: z.array(z.string()),
  order: z.number(),
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
     │                │                │ Create/update user
     │                │                │ Create JWT     │
     │                │ Redirect with JWT              │
     │                │<───────────────│                │
     │ Store JWT      │                │                │
     │<───────────────│                │                │
```

## Progress Tracking

### Data Model

```typescript
// DynamoDB Progress Table
{
  pk: "USER#<github_id>",           // Partition key
  sk: "EXERCISE#<exercise_id>",     // Sort key
  gsi1pk: "EXERCISE#<exercise_id>", // For leaderboards
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
2. User runs: labs verify <exercise-id>
3. CLI generates verification hash based on:
   - Local system state
   - Exercise requirements
   - Timestamp
4. CLI sends hash to API
5. API validates hash format
6. API records completion with hash
7. Frontend updates progress
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/github` | Redirect to GitHub OAuth |
| GET | `/auth/github/callback` | Handle OAuth callback |
| POST | `/auth/verify` | Verify JWT token |
| POST | `/auth/logout` | Invalidate session |

### Exercises

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/exercises` | List all exercises |
| GET | `/exercises/{id}` | Get exercise details |

### Progress

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/progress` | Get user's progress |
| POST | `/exercises/{id}/verify` | Record exercise completion |

## Frontend Components

### Interactive Islands (Solid.js)

These components hydrate on the client for interactivity:

```tsx
// AuthStatus.tsx - Shows login/logout button
export function AuthStatus() {
  const [user, setUser] = createSignal<User | null>(null);
  // ... handles auth state
}

// ProgressTracker.tsx - Real-time progress updates
export function ProgressTracker(props: { exerciseId: string }) {
  const [progress, setProgress] = createSignal<Progress | null>(null);
  // ... polls for progress updates
}

// CLICommandCopy.tsx - Copy command to clipboard
export function CLICommandCopy(props: { command: string }) {
  const [copied, setCopied] = createSignal(false);
  // ... handles clipboard
}
```

### Usage in Astro

```astro
---
import { AuthStatus } from './islands/AuthStatus';
---

<AuthStatus client:load />
```

## Module Structure

### Example Module (Linux Fundamentals)

```mdx
---
id: "linux"
title: "Linux Fundamentals"
description: "Master essential Linux commands and concepts"
icon: "🐧"
difficulty: "beginner"
estimatedTime: "4-6 hours"
prerequisites: []
tags: ["linux", "terminal", "basics"]
status: "available"
---

## What You'll Learn

- Navigate the filesystem
- Manage files and directories
- Use pipes and redirects
- Understand permissions
```

### Example Exercise

```mdx
---
id: "linux-01"
module: "linux"
title: "Navigate the Filesystem"
description: "Learn to move around the Linux filesystem"
difficulty: "easy"
estimatedTime: "15 minutes"
objectives:
  - "Use cd to change directories"
  - "Use ls to list directory contents"
  - "Understand absolute vs relative paths"
hints:
  - title: "Stuck on cd?"
    content: "Remember, `cd ..` goes up one directory"
cliCommand: "labs verify linux-01"
verificationSteps:
  - "Navigate to /tmp"
  - "Create a directory called 'labs-test'"
  - "Navigate into labs-test"
order: 1
---

## Introduction

The filesystem is the foundation of Linux...
```

## Local Development

### Running Labs Locally

```bash
# Start frontend
pnpm dev

# Start API (SST dev mode)
pnpm dev:api

# Or both
pnpm dev:all
```

### Mock Data

For frontend development without the API:

```typescript
// utils/labs/mocks.ts
export const mockUser: User = {
  id: "1",
  githubId: "12345",
  username: "developer",
  // ...
};

export const mockProgress: Progress[] = [
  { exerciseId: "linux-01", completedAt: "2025-01-27" },
  // ...
];
```

## Future Enhancements

- [ ] CLI tool (`labs` command) for verification
- [ ] Leaderboards and achievements
- [ ] Team/organization progress tracking
- [ ] Custom exercise creation
- [ ] Integration with cloud sandboxes

## Related Documentation

- [Architecture Overview](./overview.md)
- [Backend (SST)](./backend-sst.md)
- [SST Development Guide](../sst-api-development.md)
