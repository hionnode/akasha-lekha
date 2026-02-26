# Labs Route Implementation Plan (MVP)

> **Goal**: Implement the frontend portion of the infrastructure learning platform within the existing akasha-lekha Astro site at `/labs`.

---

## Overview

This plan focuses on the **frontend MVP** that will integrate with the backend API (SST), CLI, and exercise system described in `docs/labs-setup.md`. The frontend serves as the web interface where users discover modules, read lesson content, track progress, and get CLI commands.

---

## Route Structure

```
/labs                           # Landing page - platform overview
/labs/login                     # GitHub OAuth initiation
/labs/auth/callback             # OAuth callback handler
/labs/dashboard                 # User's progress overview
/labs/modules                   # List of all learning modules
/labs/modules/[module]          # Module overview (e.g., /labs/modules/linux)
/labs/modules/[module]/[id]     # Individual exercise (e.g., /labs/modules/linux/03)
/labs/setup                     # CLI installation instructions
```

---

## Phase 1: Foundation & Static Pages

### 1.1 Directory Structure

```
src/
├── pages/
│   └── labs/
│       ├── index.astro              # Landing page
│       ├── login.astro              # OAuth redirect page
│       ├── auth/
│       │   └── callback.astro       # OAuth callback
│       ├── dashboard.astro          # User dashboard
│       ├── modules/
│       │   ├── index.astro          # Module listing
│       │   └── [...slug].astro      # Dynamic: module overview & exercises
│       └── setup.astro              # CLI setup guide
│
├── content/
│   └── labs/
│       ├── modules/                 # Module overview MDX files
│       │   ├── linux.mdx
│       │   ├── networking.mdx
│       │   └── ...
│       └── exercises/               # Exercise lesson content
│           ├── linux-01.mdx
│           ├── linux-02.mdx
│           └── ...
│
├── components/
│   └── labs/
│       ├── layout/
│       │   ├── LabsHeader.astro     # Labs-specific header with auth status
│       │   └── LabsSidebar.astro    # Module navigation sidebar
│       ├── ModuleCard.astro         # Card for module listing
│       ├── ExerciseCard.astro       # Card for exercise in module view
│       ├── ProgressBar.astro        # Visual progress indicator
│       ├── CLICommand.astro         # Copyable CLI command block
│       ├── HintAccordion.astro      # Progressive hints reveal
│       ├── VerificationChecklist.astro  # Shows what will be verified
│       └── islands/                 # Client-side SolidJS components
│           ├── AuthStatus.tsx       # Login/logout state
│           ├── ProgressTracker.tsx  # Real-time progress polling
│           └── ExerciseLauncher.tsx # Copy command + sandbox status
│
└── utils/
    └── labs/
        ├── auth.ts                  # Auth helpers (token handling)
        └── api.ts                   # API client for SST backend
```

### 1.2 Content Collection Schema

Add to `src/content/config.ts`:

```typescript
const labsModuleCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    order: z.number(),
    icon: z.string().optional(),  // emoji or icon name
    prerequisites: z.array(z.string()).optional(),
    estimatedTime: z.string(),    // e.g., "2-3 hours"
    exerciseCount: z.number(),
    status: z.enum(['available', 'coming-soon', 'beta']).default('available'),
  }),
});

const labsExerciseCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    module: z.string(),           // parent module id
    order: z.number(),
    title: z.string(),
    description: z.string(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    estimatedTime: z.string(),    // e.g., "15m"
    objectives: z.array(z.string()),
    verificationCriteria: z.array(z.string()),
    hints: z.array(z.string()).optional(),
    cliCommand: z.string(),       // e.g., "infra-learn launch linux-03"
  }),
});
```

### 1.3 Deliverables

- [ ] Create `src/pages/labs/` directory structure
- [ ] Create `src/content/labs/` with module and exercise schemas
- [ ] Create `src/components/labs/` directory
- [ ] Add content collections to config.ts
- [ ] Create sample module (linux.mdx) and 3 exercises (linux-01, linux-02, linux-03)

---

## Phase 2: Core Pages

### 2.1 Landing Page (`/labs`)

**Purpose**: Introduce the platform and drive users to get started.

**Sections**:
1. Hero - "Learn Infrastructure Hands-On"
2. How it works (3-step visual: Install CLI → Launch Sandbox → Complete Exercise)
3. Learning path overview (Linux → Networking → Containers → K8s → Cloud)
4. Featured module preview
5. CTA: "Get Started" → `/labs/setup`

**Components needed**:
- Reuse existing `Header.astro` with labs-specific nav item
- `LearningPathVisualization.astro` - horizontal track showing module progression
- `FeatureCard.astro` - highlights for key features (local/cloud, progress sync, etc.)

### 2.2 Setup Page (`/labs/setup`)

**Purpose**: Guide users through CLI installation.

**Content**:
1. Installation commands (macOS, Linux, Windows)
2. Quick verification (`infra-learn --version`)
3. Initial setup (`infra-learn init`)
4. Login flow explanation
5. Troubleshooting section

**Components needed**:
- `CLICommand.astro` - copyable command block with OS tabs (reuse/extend CodeSwitcher)
- `StepGuide.astro` - numbered step component (may reuse GuideStep)

### 2.3 Modules Page (`/labs/modules`)

**Purpose**: Show all available learning modules.

**Layout**:
- Grid of module cards
- Each card shows: icon, title, description, exercise count, estimated time, status badge
- Progress indicator if logged in

**Components needed**:
- `ModuleCard.astro` - card component for module display
- `ProgressBar.astro` - visual completion percentage

### 2.4 Module Detail Page (`/labs/modules/[module]`)

**Purpose**: Module overview with exercise listing.

**Sections**:
1. Module header (title, description, prerequisites)
2. What you'll learn (objectives list)
3. Exercise list with completion status
4. Estimated total time
5. Start button → first incomplete exercise

**Components needed**:
- `ExerciseCard.astro` - compact card for exercise in list
- `PrerequisitesList.astro` - shows required prior modules

### 2.5 Exercise Page (`/labs/modules/[module]/[id]`)

**Purpose**: Individual lesson content and launch point.

**Sections**:
1. Breadcrumb (Labs > Linux > Exercise 03)
2. Exercise header (title, difficulty badge, time estimate)
3. Lesson content (MDX rendered - explanation, context, examples)
4. Objectives checklist
5. Launch sandbox section (CLI command to copy)
6. Verification criteria (what will be checked)
7. Hints (expandable accordion)
8. Previous/Next navigation

**Components needed**:
- `DifficultyBadge.astro` - beginner/intermediate/advanced
- `ObjectivesList.astro` - checklist of learning objectives
- `CLICommand.astro` - copyable launch command
- `VerificationChecklist.astro` - shows what verify will check
- `HintAccordion.astro` - progressive hint reveal

### 2.6 Deliverables

- [ ] Landing page (`/labs/index.astro`)
- [ ] Setup page (`/labs/setup.astro`)
- [ ] Modules listing (`/labs/modules/index.astro`)
- [ ] Module detail page (`/labs/modules/[...slug].astro`)
- [ ] Exercise page (part of [...slug].astro dynamic route)
- [ ] All required Astro components

---

## Phase 3: Authentication Integration

### 3.1 Auth Flow

1. User clicks "Login" → redirects to `/labs/login`
2. `/labs/login` redirects to SST API GitHub OAuth endpoint
3. GitHub redirects back to `/labs/auth/callback` with code
4. Callback page exchanges code for JWT via API
5. JWT stored in httpOnly cookie
6. User redirected to `/labs/dashboard`

### 3.2 Pages

**Login Page (`/labs/login`)**:
- Shows loading state
- Redirects to API OAuth endpoint
- Error handling for failed auth

**Callback Page (`/labs/auth/callback`)**:
- Receives OAuth code from GitHub
- Calls API to exchange for JWT
- Sets cookie
- Redirects to dashboard or original destination

**Dashboard Page (`/labs/dashboard`)**:
- Protected route (redirects to login if not authenticated)
- Shows user info (GitHub avatar, username)
- Overall progress summary
- Recently active exercises
- Continue learning CTA

### 3.3 Auth Utilities

```typescript
// src/utils/labs/auth.ts

export function getAuthToken(cookies: AstroCookies): string | null;
export function isAuthenticated(cookies: AstroCookies): boolean;
export function setAuthCookie(cookies: AstroCookies, token: string): void;
export function clearAuthCookie(cookies: AstroCookies): void;
export async function getUserFromToken(token: string): Promise<User | null>;
```

### 3.4 Deliverables

- [ ] Login page with redirect logic
- [ ] Callback page with token exchange
- [ ] Dashboard page (protected)
- [ ] Auth utility functions
- [ ] Cookie handling for JWT

---

## Phase 4: Interactive Components (SolidJS Islands)

### 4.1 SolidJS Setup

Add SolidJS integration to Astro:

```bash
pnpm astro add solid
```

### 4.2 Islands

**AuthStatus (`islands/AuthStatus.tsx`)**:
- Shows login button or user avatar
- Dropdown with logout option
- Used in labs header

**ProgressTracker (`islands/ProgressTracker.tsx`)**:
- Polls API for user progress
- Updates UI when exercises completed via CLI
- Shows real-time completion status on exercise cards

**ExerciseLauncher (`islands/ExerciseLauncher.tsx`)**:
- Copy CLI command to clipboard
- Optional: poll for sandbox status
- Shows "Sandbox Running" indicator if active

### 4.3 API Client

```typescript
// src/utils/labs/api.ts

const API_BASE = import.meta.env.PUBLIC_LABS_API_URL;

export async function fetchProgress(token: string): Promise<Progress[]>;
export async function fetchExercises(): Promise<Exercise[]>;
export async function fetchModules(): Promise<Module[]>;
```

### 4.4 Deliverables

- [ ] Add SolidJS integration to Astro
- [ ] AuthStatus island component
- [ ] ProgressTracker island component
- [ ] ExerciseLauncher island component
- [ ] API client utility

---

## Phase 5: Styling & Polish

### 5.1 Design Tokens

Extend existing Tokyo Night theme with labs-specific tokens:

```css
/* Labs-specific colors */
--labs-progress-bg: var(--bg-tertiary);
--labs-progress-fill: var(--accent-green);
--labs-difficulty-beginner: var(--accent-green);
--labs-difficulty-intermediate: var(--accent-yellow);
--labs-difficulty-advanced: var(--accent-orange);
--labs-coming-soon: var(--fg-muted);
```

### 5.2 Responsive Design

- Mobile-first approach
- Sidebar collapses to drawer on mobile (reuse MobileSidebarDrawers pattern)
- Exercise cards stack vertically on small screens
- CLI commands horizontally scrollable on mobile

### 5.3 Deliverables

- [ ] Labs-specific CSS variables
- [ ] Responsive layouts for all pages
- [ ] Mobile navigation drawer
- [ ] Consistent styling with existing site

---

## Sample Content: Linux Module

### Module Overview (`src/content/labs/modules/linux.mdx`)

```mdx
---
id: linux
title: Linux Fundamentals
description: Master essential Linux skills for infrastructure work. Learn the command line, file systems, processes, and system administration basics.
order: 1
icon: "🐧"
prerequisites: []
estimatedTime: "2-3 hours"
exerciseCount: 5
status: available
---

## What You'll Learn

This module covers the foundational Linux skills every infrastructure engineer needs...
```

### Exercise Example (`src/content/labs/exercises/linux-03.mdx`)

```mdx
---
id: linux-03
module: linux
order: 3
title: Create a systemd Service
description: Learn how to create and manage a systemd service unit.
difficulty: beginner
estimatedTime: "15m"
objectives:
  - Understand systemd service unit files
  - Create a custom service unit
  - Enable services to start on boot
  - Check service status and logs
verificationCriteria:
  - Unit file exists at /etc/systemd/system/myapp.service
  - Service is enabled (starts on boot)
  - Service is currently running
  - Application responds on port 5000
hints:
  - Start by creating a file at /etc/systemd/system/myapp.service
  - Use 'systemctl daemon-reload' after creating the unit file
  - The ExecStart should point to: /usr/bin/python3 /home/learner/myapp.py
cliCommand: infra-learn launch linux-03
---

## Introduction

systemd is the init system used by most modern Linux distributions...

## Service Unit File Structure

A basic systemd service unit file has three sections...

```ini
[Unit]
Description=My Application
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 /home/learner/myapp.py
Restart=always

[Install]
WantedBy=multi-user.target
```

## Your Task

Create a systemd service that runs the Python application located at `/home/learner/myapp.py`...
```

---

## Implementation Order

### Week 1: Foundation
1. Set up directory structure
2. Add content collections schema
3. Create landing page
4. Create setup page
5. Create sample Linux module content

### Week 2: Core Features
1. Module listing page
2. Module detail page
3. Exercise page with MDX rendering
4. Navigation between exercises
5. CLI command component

### Week 3: Auth & Interactivity
1. Add SolidJS integration
2. Implement auth flow (login, callback, dashboard)
3. Build AuthStatus island
4. Build ProgressTracker island

### Week 4: Polish & Integration
1. ExerciseLauncher island
2. Responsive design pass
3. Error states and loading states
4. Integration testing with mock API
5. Documentation

---

## Environment Variables

```env
# .env
PUBLIC_LABS_API_URL=https://api.works-on-my.cloud/labs
PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
```

---

## API Endpoints (Reference)

Frontend will call these SST API endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/github` | GET | Initiate GitHub OAuth |
| `/auth/github/callback` | GET | OAuth callback handler |
| `/auth/verify` | POST | Validate JWT token |
| `/exercises` | GET | List all exercises |
| `/progress` | GET | Get user's progress |

---

## Dependencies to Add

```json
{
  "dependencies": {
    "@astrojs/solid-js": "^4.x",
    "solid-js": "^1.x"
  }
}
```

---

## Out of Scope for MVP

- Real-time sandbox status from CLI
- Leaderboards or social features
- Multiple auth providers (GitHub only)
- Certificate generation
- Video content embedding
- Advanced search/filtering of exercises

---

## Success Criteria

- [ ] User can browse modules and exercises without login
- [ ] User can log in via GitHub OAuth
- [ ] Logged-in user sees their progress on dashboard
- [ ] Exercise pages render MDX content correctly
- [ ] CLI commands are easily copyable
- [ ] Progress updates reflect in UI (via polling)
- [ ] Mobile-responsive on all pages
- [ ] Consistent with existing site design (Tokyo Night theme)

---

## File Checklist

### Pages (8 files)
- [ ] `src/pages/labs/index.astro`
- [ ] `src/pages/labs/login.astro`
- [ ] `src/pages/labs/auth/callback.astro`
- [ ] `src/pages/labs/dashboard.astro`
- [ ] `src/pages/labs/modules/index.astro`
- [ ] `src/pages/labs/modules/[...slug].astro`
- [ ] `src/pages/labs/setup.astro`

### Components (~12 files)
- [ ] `src/components/labs/layout/LabsHeader.astro`
- [ ] `src/components/labs/layout/LabsSidebar.astro`
- [ ] `src/components/labs/ModuleCard.astro`
- [ ] `src/components/labs/ExerciseCard.astro`
- [ ] `src/components/labs/ProgressBar.astro`
- [ ] `src/components/labs/CLICommand.astro`
- [ ] `src/components/labs/HintAccordion.astro`
- [ ] `src/components/labs/VerificationChecklist.astro`
- [ ] `src/components/labs/DifficultyBadge.astro`
- [ ] `src/components/labs/ObjectivesList.astro`
- [ ] `src/components/labs/LearningPathVisualization.astro`

### Islands (3 files)
- [ ] `src/components/labs/islands/AuthStatus.tsx`
- [ ] `src/components/labs/islands/ProgressTracker.tsx`
- [ ] `src/components/labs/islands/ExerciseLauncher.tsx`

### Utilities (2 files)
- [ ] `src/utils/labs/auth.ts`
- [ ] `src/utils/labs/api.ts`

### Content (4+ files)
- [ ] `src/content/labs/modules/linux.mdx`
- [ ] `src/content/labs/exercises/linux-01.mdx`
- [ ] `src/content/labs/exercises/linux-02.mdx`
- [ ] `src/content/labs/exercises/linux-03.mdx`

---

**Last Updated**: 2025-01-27
