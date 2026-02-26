**MVP Execution Plan: Infrastructure Learning Platform**

---

## Goal

Ship a working end-to-end system with one tutorial module (Linux Fundamentals - 3-5 exercises) that validates the entire architecture before scaling content.

---

## Success Criteria for MVP

- [ ] User can sign up via GitHub OAuth on `works-on-my.cloud/learn`
- [ ] User can configure CLI with local or AWS backend
- [ ] User can launch a sandbox, complete an exercise, verify, and see progress update
- [ ] System works identically on local Docker and user's AWS account
- [ ] One complete module with 3-5 exercises is playable end-to-end

---

## Phase 0: Foundation Setup
**Duration: 2-3 days**

### 0.1 Repository Structure

```
infra-learn/
├── apps/
│   ├── web/                 # Astro + SolidJS frontend
│   └── api/                 # SST Lambda functions
├── packages/
│   ├── cli/                 # OpenTUI CLI
│   ├── types/               # Shared TypeScript types
│   └── exercises/           # Exercise manifests + verification scripts
├── infra/
│   ├── sst/                 # SST infrastructure config
│   └── packer/              # AMI build templates
├── containers/
│   └── exercises/           # Dockerfiles for each exercise
└── docs/
```

### 0.2 Tooling Decisions

| Tool | Purpose |
|------|---------|
| Turborepo or pnpm workspaces | Monorepo management |
| Bun | Runtime for CLI and local dev |
| SST v3 | AWS infrastructure |
| Packer | AMI builds |
| GitHub Actions | CI/CD |

### 0.3 Deliverables

- [ ] Monorepo initialized with workspace config
- [ ] Shared types package with exercise manifest schema
- [ ] Basic CI pipeline (lint, typecheck)
- [ ] Development environment documented in README

---

## Phase 1: Backend API (SST)
**Duration: 3-4 days**

### 1.1 Authentication

- GitHub OAuth flow via Lambda
- JWT token generation for CLI authentication
- Token stored in DynamoDB (user sessions)

**Endpoints:**
```
GET  /auth/github          → Redirects to GitHub OAuth
GET  /auth/github/callback → Handles callback, issues JWT
POST /auth/verify          → Validates JWT (used by CLI)
```

### 1.2 User & Progress Storage

**DynamoDB Tables:**

```
users
├── pk: USER#<github_id>
├── github_username
├── email
├── created_at
└── config (backend preference, region, etc.)

progress
├── pk: USER#<github_id>
├── sk: EXERCISE#<exercise_id>
├── completed_at
├── attempts
└── verification_hash
```

### 1.3 Exercise API

**Endpoints:**
```
GET  /exercises                → List all modules and exercises
GET  /exercises/:id            → Get exercise manifest
POST /exercises/:id/verify     → Record completion (called by CLI)
GET  /progress                 → Get user's progress (for frontend)
```

### 1.4 Deliverables

- [ ] SST project configured and deployable
- [ ] Auth flow working (test via browser)
- [ ] DynamoDB tables created
- [ ] All endpoints functional with basic error handling
- [ ] API deployed to dev environment

---

## Phase 2: Golden AMI
**Duration: 2-3 days**

### 2.1 Base AMI Contents

```
Ubuntu 24.04 LTS
├── Docker (latest stable)
├── docker-compose
├── Common tools (curl, wget, vim, htop, net-tools, jq)
├── Exercise runner script (/opt/infra-learn/runner.sh)
├── Verification helper (/opt/infra-learn/verify.sh)
├── k3d (pre-installed for K8s modules)
├── AWS CLI v2
└── SSM Agent (for optional remote access)
```

### 2.2 Packer Template Structure

```
infra/packer/
├── base.pkr.hcl           # Main template
├── scripts/
│   ├── install-docker.sh
│   ├── install-tools.sh
│   ├── install-k3d.sh
│   └── configure-user.sh
└── files/
    ├── runner.sh
    └── verify.sh
```

### 2.3 AMI Distribution

- Build in `ap-south-1` (your primary region)
- Copy to `us-east-1`, `eu-west-1` for global users
- Tag with version: `infra-learn-base-v0.1.0`
- Store AMI IDs in a public JSON manifest (fetched by CLI)

```json
{
  "version": "0.1.0",
  "amis": {
    "ap-south-1": "ami-xxxxx",
    "us-east-1": "ami-yyyyy",
    "eu-west-1": "ami-zzzzz"
  }
}
```

### 2.4 Deliverables

- [ ] Packer template building successfully
- [ ] AMI tested manually (launch, SSH, run Docker)
- [ ] AMI copied to at least 2 regions
- [ ] Manifest JSON published (S3 or GitHub releases)

---

## Phase 3: CLI (OpenTUI)
**Duration: 5-7 days**

### 3.1 Command Structure

```
infra-learn
├── init              # First-time setup wizard
├── login             # GitHub OAuth flow
├── logout            # Clear local credentials
├── status            # Show current config, auth status, running sandboxes
├── modules           # List available modules
├── launch <id>       # Provision sandbox for exercise
├── verify [id]       # Run verification for current/specified exercise
├── destroy           # Tear down running sandbox
└── config
    ├── show          # Display current config
    ├── set <k> <v>   # Update config value
    └── reset         # Reset to defaults
```

### 3.2 Init Flow (TUI)

```
$ infra-learn init

┌─────────────────────────────────────────────────────┐
│  Welcome to infra-learn                             │
│                                                     │
│  Choose your sandbox backend:                       │
│                                                     │
│  > Local (Docker)                                   │
│    AWS (your account)                               │
│                                                     │
│  ↑/↓ to move, Enter to select                       │
└─────────────────────────────────────────────────────┘
```

**If AWS selected:**
```
┌─────────────────────────────────────────────────────┐
│  AWS Configuration                                  │
│                                                     │
│  Profile: [default____]                             │
│  Region:  [ap-south-1_]                             │
│  Instance Type: [t3.micro]                          │
│                                                     │
│  Testing credentials...                             │
└─────────────────────────────────────────────────────┘
```

### 3.3 Config File

Location: `~/.infra-learn/config.yaml`

```yaml
version: 1
backend: local  # or 'aws'

local:
  runtime: docker  # or 'lima' (future)

aws:
  profile: default
  region: ap-south-1
  instance_type: t3.micro
  key_pair: infra-learn  # created during init if missing
  security_group: infra-learn-sandbox

auth:
  token: <jwt>
  expires_at: <timestamp>
```

### 3.4 Launch Flow

**Local backend:**
```
$ infra-learn launch linux-03

Pulling exercise image...
[████████████████████████] 100%

Starting container...
Container ready.

Dropping you into the sandbox. Complete the exercise, then run:
  infra-learn verify

$ docker exec -it infra-learn-sandbox /bin/bash
learner@sandbox:~$ _
```

**AWS backend:**
```
$ infra-learn launch linux-03

Checking for existing sandbox...
No existing sandbox found.

Launching EC2 instance (t3.micro) in ap-south-1...
[████████░░░░░░░░░░░░░░░░] Instance launching...
[████████████████░░░░░░░░] Waiting for SSH...
[████████████████████████] Ready!

Pulling exercise container on remote...
Done.

Connecting to sandbox...

learner@sandbox:~$ _
```

### 3.5 Verify Flow

```
$ infra-learn verify

Running verification for linux-03...

✓ Check 1/3: systemd service exists
✓ Check 2/3: service is active
✓ Check 3/3: endpoint responds correctly

All checks passed!

Syncing progress to cloud...
✓ Progress saved.

Continue to next exercise:
  infra-learn launch linux-04
```

### 3.6 Offline Mode

When user has `--offline` flag or no network:
- Exercise specs cached locally in `~/.infra-learn/cache/exercises/`
- Verification runs locally
- Progress stored in `~/.infra-learn/local-progress.json`
- Warning shown: "Progress will not sync to cloud"

### 3.7 Deliverables

- [ ] CLI scaffold with OpenTUI
- [ ] `init` command with TUI wizard
- [ ] `login` command with OAuth flow (opens browser, listens for callback)
- [ ] `launch` working for local Docker backend
- [ ] `launch` working for AWS backend
- [ ] `verify` command running checks and POSTing to API
- [ ] `destroy` command for cleanup
- [ ] Prebuilt binaries for macOS (arm64, x64), Linux (x64), Windows (x64)
- [ ] Binary distribution via GitHub releases

---

## Phase 4: Exercise System
**Duration: 2-3 days**

### 4.1 Exercise Manifest Schema

```yaml
# exercises/linux/03-systemd-service.yaml

id: linux-03
module: linux
order: 3
title: "Create a systemd service"
description: |
  Learn how to create and manage a systemd service unit.
  You'll write a unit file, enable the service, and verify it starts on boot.

difficulty: beginner
estimated_time: 15m

backend: vm  # 'vm' or 'container'
container_image: ghcr.io/yourorg/infra-learn/linux-03:latest

# Files to copy into sandbox before user starts
setup:
  - source: files/myapp.py
    dest: /home/learner/myapp.py
  - source: files/instructions.md
    dest: /home/learner/README.md

# Verification checks (run in order, all must pass)
verify:
  - name: "Unit file exists"
    cmd: test -f /etc/systemd/system/myapp.service
    
  - name: "Service is enabled"
    cmd: systemctl is-enabled myapp
    expect: enabled
    
  - name: "Service is running"
    cmd: systemctl is-active myapp
    expect: active
    
  - name: "App responds on port 5000"
    cmd: curl -s http://localhost:5000
    expect_contains: "Hello from myapp"

# Hints (shown progressively if user struggles)
hints:
  - "Start by creating a file at /etc/systemd/system/myapp.service"
  - "Use 'systemctl daemon-reload' after creating the unit file"
  - "The ExecStart should point to: /usr/bin/python3 /home/learner/myapp.py"
```

### 4.2 Exercise Container Structure

```dockerfile
# containers/exercises/linux-03/Dockerfile

FROM ubuntu:24.04

# Install dependencies for this exercise
RUN apt-get update && apt-get install -y \
    python3 \
    systemd \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create learner user
RUN useradd -m -s /bin/bash learner && \
    echo "learner ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Copy exercise files
COPY files/ /exercises/linux-03/

# Set working directory
WORKDIR /home/learner

USER learner
```

### 4.3 Verification Runner

The CLI runs verification checks either:
- Directly in the container (local backend)
- Via SSH command execution (AWS backend)

```typescript
// Pseudocode for verification
async function verify(exercise: Exercise, sandbox: Sandbox): Promise<VerifyResult> {
  const results = [];
  
  for (const check of exercise.verify) {
    const output = await sandbox.exec(check.cmd);
    
    const passed = check.expect 
      ? output.stdout.trim() === check.expect
      : check.expect_contains
        ? output.stdout.includes(check.expect_contains)
        : output.exitCode === 0;
    
    results.push({ name: check.name, passed, output });
    
    if (!passed) break; // Stop on first failure
  }
  
  return { passed: results.every(r => r.passed), checks: results };
}
```

### 4.4 Deliverables

- [ ] Exercise manifest schema defined (TypeScript types)
- [ ] YAML validation for exercise manifests
- [ ] Verification runner implemented in CLI
- [ ] 3-5 exercise containers built and pushed to registry
- [ ] Exercise manifest files for Linux module

---

## Phase 5: Frontend (Astro + SolidJS)
**Duration: 4-5 days**

### 5.1 Route Structure

```
works-on-my.cloud/learn/
├── /                        # Landing page - what is this, how to start
├── /login                   # GitHub OAuth initiation
├── /auth/callback           # OAuth callback handler
├── /dashboard               # User's progress overview
├── /modules                 # List of all modules
├── /modules/[module]        # Module overview (e.g., /modules/linux)
├── /modules/[module]/[id]   # Individual lesson (e.g., /modules/linux/03)
└── /setup                   # CLI installation instructions
```

### 5.2 Page Components

**Landing Page (`/learn`)**
- Hero: "Learn infrastructure from scratch"
- How it works (3 steps visual)
- Module overview (Linux → Networking → Containers → Docker → K8s → Cloud)
- CTA: Get Started

**Module Page (`/modules/linux`)**
- Module description
- Prerequisites
- Exercise list with completion status (if logged in)
- Estimated total time

**Exercise Page (`/modules/linux/03`)**
- Lesson content (MDX rendered)
- "Launch Sandbox" button (shows CLI command to copy)
- Exercise objectives
- Verification criteria (what will be checked)
- Hints (expandable)
- Completion status
- Previous/Next navigation

### 5.3 SolidJS Islands

Interactive components that need client-side JS:

1. **AuthStatus** - Shows logged in/out state, user avatar
2. **ProgressTracker** - Real-time progress updates (polls API)
3. **ExerciseLauncher** - Copy CLI command, show sandbox status
4. **HintRevealer** - Progressive hint disclosure

### 5.4 Content Collections (Astro)

```
apps/web/src/content/
├── modules/
│   ├── linux.mdx           # Module overview
│   ├── networking.mdx
│   └── ...
└── exercises/
    ├── linux-01.mdx        # Exercise lesson content
    ├── linux-02.mdx
    └── ...
```

### 5.5 API Integration

Frontend calls your SST API:
- `GET /progress` - Fetch user's completed exercises
- `GET /exercises` - Fetch exercise metadata

Auth token stored in httpOnly cookie (set during OAuth callback).

### 5.6 Deliverables

- [ ] Astro project added to existing `works-on-my.cloud` repo
- [ ] `/learn` route configured
- [ ] Landing page designed and built
- [ ] Auth flow integrated (login → callback → dashboard)
- [ ] Module listing page
- [ ] Exercise page with MDX content rendering
- [ ] Progress display (solid island polling API)
- [ ] Mobile responsive
- [ ] Deployed to Cloudflare Pages

---

## Phase 6: Integration & Testing
**Duration: 3-4 days**

### 6.1 End-to-End Test Scenarios

**Scenario 1: New user, local backend**
1. User visits `/learn`, clicks Get Started
2. User goes to `/setup`, copies CLI install command
3. User runs `infra-learn init`, selects Local Docker
4. User runs `infra-learn login`, completes OAuth in browser
5. User reads linux-01 lesson on web
6. User runs `infra-learn launch linux-01`
7. User completes exercise in terminal
8. User runs `infra-learn verify`
9. Browser shows linux-01 complete
10. User proceeds to linux-02

**Scenario 2: New user, AWS backend**
Same as above but with AWS configuration during init.

**Scenario 3: Returning user**
1. User runs `infra-learn status` - shows auth valid, last exercise
2. User runs `infra-learn launch linux-03` - continues where they left off

**Scenario 4: Offline mode**
1. User runs `infra-learn launch linux-01 --offline`
2. Verification works locally
3. Progress not synced
4. When back online, `infra-learn sync` pushes local progress

### 6.2 Testing Checklist

- [ ] OAuth flow works end-to-end
- [ ] CLI → API communication works
- [ ] Local Docker sandbox launches and verifies
- [ ] AWS EC2 sandbox launches and verifies
- [ ] Progress syncs correctly
- [ ] Frontend displays progress in real-time
- [ ] CLI binaries work on macOS, Linux, Windows
- [ ] Error handling for common failures (no Docker, bad AWS creds, network issues)

### 6.3 Deliverables

- [ ] Integration test suite (can be manual for MVP)
- [ ] Bug fixes from testing
- [ ] Error messages improved based on testing
- [ ] Documentation updated with troubleshooting

---

## Phase 7: Documentation & Launch Prep
**Duration: 2-3 days**

### 7.1 Documentation

**User-facing:**
- README with project overview
- Installation guide (CLI setup)
- Quick start tutorial
- Troubleshooting guide
- FAQ

**Developer-facing:**
- Contributing guide
- Architecture overview
- How to add new exercises
- Local development setup

### 7.2 Launch Checklist

- [ ] GitHub repo public
- [ ] README polished
- [ ] License file (MIT or Apache 2.0)
- [ ] CLI binaries on GitHub releases
- [ ] AMI manifest published
- [ ] Exercise containers on ghcr.io
- [ ] Frontend deployed to production
- [ ] API deployed to production
- [ ] Monitoring/alerting basic setup (CloudWatch)
- [ ] Feedback mechanism (GitHub issues template)

### 7.3 Deliverables

- [ ] All documentation written
- [ ] Repo ready for public launch
- [ ] Soft launch to small group for feedback

---

## Timeline Summary

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 0: Foundation | 2-3 days | None |
| Phase 1: Backend API | 3-4 days | Phase 0 |
| Phase 2: Golden AMI | 2-3 days | None (parallel) |
| Phase 3: CLI | 5-7 days | Phase 0, 1 |
| Phase 4: Exercise System | 2-3 days | Phase 2, 3 |
| Phase 5: Frontend | 4-5 days | Phase 1 |
| Phase 6: Integration | 3-4 days | All above |
| Phase 7: Docs & Launch | 2-3 days | Phase 6 |

**Total estimated: 4-5 weeks** (assuming ~3-4 hours/day)

---

## Parallel Workstreams

```
Week 1:     [Phase 0: Foundation]──────┐
                                       │
Week 1-2:   [Phase 1: Backend]─────────┼──────────────┐
            [Phase 2: AMI]─────────────┘              │
                                                      │
Week 2-3:   [Phase 3: CLI]────────────────────────────┤
            [Phase 5: Frontend]───────────────────────┤
                                                      │
Week 3-4:   [Phase 4: Exercises]──────────────────────┤
                                                      │
Week 4-5:   [Phase 6: Integration]────────────────────┘
            [Phase 7: Docs & Launch]
```

---

## MVP Scope Boundaries

**In scope:**
- 1 module (Linux Fundamentals)
- 3-5 exercises
- Local Docker + AWS backends
- GitHub OAuth only
- Basic progress tracking
- Web + CLI working together

**Explicitly out of scope for MVP:**
- Multiple modules
- Lima support for macOS
- Railway or other cloud backends
- Social features (leaderboards, sharing)
- Paid tiers
- Mobile app
- Video content
- Certificate generation

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| OpenTUI learning curve | Start with simple commands, add TUI polish iteratively |
| AWS sandbox provisioning complexity | Get one working flow first, then optimize |
| Cross-platform CLI issues | Test early on all platforms, use CI matrix |
| Exercise verification edge cases | Start with simple deterministic checks |
| Scope creep | Strict MVP boundaries, parking lot for ideas |

---

Ready to proceed? I'd suggest starting with **Phase 0 + Phase 2** in parallel since the AMI work is independent and can be tested while setting up the monorepo.