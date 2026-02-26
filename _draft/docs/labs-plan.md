# Cloud Platform Engineering Roadmap — Implementation Plan

## Decision Summary

| Decision | Choice |
|----------|--------|
| CLI execution | Local CLI tool provisions VM/container for labs |
| Content management | Fully LLM-generated per section from outline |
| Business model | Free / lead-gen / credibility play for agency |
| Web framework | Astro SSG with content collections (already exists) |
| Progress model | Flexible with skip paths |
| Grading | Automated (submit code, run tests, pass/fail) |

---

## Architecture Overview

Two independent artifacts that reference each other:

```
┌──────────────────────────────────┐     ┌──────────────────────────────────┐
│         WEB (Astro SSG)          │     │          CLI (Go binary)         │
│                                  │     │                                  │
│  - Curriculum content (markdown) │     │  - Environment provisioning     │
│  - Phase/section navigation      │◄───►│  - Test runner & auto-grading   │
│  - Dependency graph visualization│     │  - Progress tracking (local)    │
│  - Exercise/project specs        │     │  - Lab lifecycle management     │
│  - Skip path guidance            │     │  - Scaffold generation          │
│                                  │     │                                  │
│  Pure static. No auth. No DB.   │     │  Runs locally. Docker/VM based. │
└──────────────────────────────────┘     └──────────────────────────────────┘
         reads curriculum                      reads test definitions
              from ▼                                from ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                    SHARED: Content Repository                            │
│                                                                          │
│  /content/phases/{phase}/sections/{section}.md    ← curriculum text      │
│  /tests/{phase}/{section}/{exercise}/             ← test suites          │
│  /scaffolds/{phase}/{section}/{exercise}/          ← starter code        │
│  /environments/{phase}.Dockerfile                  ← lab environments    │
│  /roadmap-outline.md                               ← source of truth     │
└──────────────────────────────────────────────────────────────────────────┘
```

### Why This Works

- **Web is pure SSG.** No server costs, deploy to Cloudflare Pages (your existing infra). Content collections are markdown. Astro does what it's good at.
- **CLI is a standalone Go binary.** Single binary download, no runtime dependencies except Docker. Handles all the "hard" stuff: provisioning, testing, grading.
- **No backend needed.** Progress is local (CLI-side). No auth, no database, no API server. Fits the free/lead-gen model — zero operational cost beyond static hosting.
- **Bridge between them:** Web pages include CLI commands to run. CLI can open web pages for reading material. Test definitions live in the shared repo so both web (displays specs) and CLI (runs tests) reference the same source of truth.

---

## Content Pipeline (LLM Generation)

### How Content Gets Created

```
roadmap-outline.md (the document we already built)
        │
        ▼
LLM expansion prompt per section (with document-wide guidelines)
        │
        ▼
Raw markdown with frontmatter
        │
        ▼
Human review / edit pass
        │
        ▼
/content/phases/{phase}/sections/{section}.md  → Astro content collection
/tests/{phase}/{section}/{exercise}/           → Test suite files
/scaffolds/{phase}/{section}/{exercise}/       → Starter code templates
```

### Content Authoring Process

This is NOT runtime LLM generation. It's a build-time authoring pipeline:

1. **Author feeds outline section + document-wide guidelines to LLM**
2. **LLM produces:** curriculum markdown, test definitions, scaffold code, Dockerfile requirements
3. **Author reviews,** edits for accuracy, tests the exercises locally
4. **Commit to repo** → Astro rebuilds → CLI picks up new tests on next update

### LLM Expansion Prompt Template

When expanding any section, use this prompt structure:

```
You are expanding a section of the Cloud Platform Engineering Roadmap.

## Document-wide guidelines
{paste the full "Document-Wide Guidelines" section from the outline}

## Section to expand
{paste the specific section outline}

## Context
- Previous section: {title and summary}
- Next section: {title and summary}
- Phase: {phase number and name}
- Language: {C or Go}
- Difficulty tier: {Core / Deep Dive / Enrichment}

## Required outputs

### 1. Curriculum markdown
- Follow the structural conventions (reading assignments, conceptual exercises,
  debugging exercises, project specs, completion criteria, benchmarks, interview checkpoints)
- Include frontmatter: title, phase, section, difficulty, dependencies, estimated_hours,
  language, projects (list), exercises (list)
- Every code block must specify language
- Every debugging exercise must have <details> answer blocks

### 2. Test definitions (one per exercise/project)
For each testable exercise, produce a test definition file:
{test definition schema - see below}

### 3. Scaffold code (one per project)
Starter code with:
- File structure
- Function signatures / type definitions (no implementations)
- Makefile or go.mod
- README with build/run/test instructions

### 4. Environment requirements
What the Docker/VM environment needs for this section:
- Base image
- Packages to install
- Kernel capabilities needed
- Network configuration needed
```

### Frontmatter Schema for Content Markdown

```yaml
---
title: "Pointers & Arrays"
slug: "phase-0-section-0.1-week-2"
phase: 0
section: "0.1"
week: 2
difficulty: "core"  # core | deep-dive | enrichment
language: "c"       # c | x86 | hdl | go
estimated_hours: 15
dependencies:
  - "phase-0-section-0.1-week-1"  # must complete before this
recommended:
  - "phase-0-section-0.3"         # helpful but not required
projects:
  - id: "dynamic-string-library"
    name: "Dynamic String Library"
    estimated_hours: 8
    has_tests: true
    has_scaffold: true
exercises:
  - id: "exercise-2a-memory-diagrams"
    type: "conceptual"             # conceptual | code | debugging
    has_tests: false
  - id: "debug-2.1-concat-bugs"
    type: "debugging"
    has_tests: true
    bug_count: 4
tags:
  - pointers
  - arrays
  - memory
  - strings
---
```

### Test Definition Schema

Each testable exercise/project gets a test definition directory:

```
/tests/phase-0/section-0.1/dynamic-string-library/
├── test_config.yaml        # metadata: language, timeout, required files
├── test_suite.c            # or test_suite_test.go for Go phases
├── reference_output/       # expected outputs for diff-based tests
├── test_data/              # input files for tests
└── grading.yaml            # pass criteria, scoring rubric
```

**test_config.yaml:**
```yaml
exercise_id: "dynamic-string-library"
language: "c"
timeout_seconds: 60
required_files:
  - "string_lib.h"
  - "string_lib.c"
compile:
  command: "gcc -Wall -Wextra -Werror -fsanitize=address,undefined -g"
  files: ["string_lib.c", "test_suite.c"]
  output: "test_runner"
memory_check: true          # run through valgrind
race_check: false           # only for concurrent code
benchmark: true             # run benchmarks
benchmark_targets:
  append_1m_chars_ms: 50
  find_in_1mb_ms: 10
  random_ops_1000_ms: 100
```

**grading.yaml:**
```yaml
pass_criteria:
  - name: "All tests pass"
    type: "test_exit_code"
    value: 0
    weight: 60
  - name: "No memory leaks"
    type: "valgrind_clean"
    weight: 20
  - name: "No compiler warnings"
    type: "compile_clean"
    weight: 10
  - name: "Benchmark targets met"
    type: "benchmark"
    weight: 10
total_to_pass: 80           # out of 100
```

---

## Web App (Astro SSG)

### What It Does

1. **Displays curriculum content** — rendered from markdown content collections
2. **Navigation** — phase → section → week/topic tree with skip path indicators
3. **Dependency graph** — visual map of what depends on what, what's skippable
4. **Exercise/project specs** — formatted with copy-pastable CLI commands
5. **Progress display** — reads a progress file (uploaded or pasted by user) and shows status
6. **Lead-gen surface** — agency branding, "need help implementing this for your team?" CTAs

### What It Does NOT Do

- No auth / accounts
- No server-side anything
- No real-time progress sync
- No code editor / execution
- No LLM chat interface

### Astro Content Collections Structure

```
src/
├── content/
│   ├── config.ts                    # collection schemas
│   └── phases/
│       ├── phase-0/
│       │   ├── _phase.md            # phase overview, purpose, duration
│       │   ├── section-0.1-week-1.md
│       │   ├── section-0.1-week-2.md
│       │   ├── section-0.1-week-3.md
│       │   ├── section-0.1-week-4.md
│       │   ├── section-0.2-gdb.md
│       │   ├── section-0.2-valgrind.md
│       │   ├── section-0.2-make.md
│       │   ├── section-0.3-boolean-algebra.md
│       │   ├── section-0.3-number-systems.md
│       │   ├── section-0.4-hash-tables.md
│       │   ├── section-0.4-trees.md
│       │   ├── section-0.4-heaps.md
│       │   ├── section-0.4-graphs.md
│       │   ├── section-0.4-mini-redis.md
│       │   └── exit-exam.md
│       ├── phase-1/
│       │   └── ...
│       └── ...
├── pages/
│   ├── index.astro                  # landing page
│   ├── roadmap.astro                # full dependency graph view
│   ├── phases/
│   │   ├── index.astro              # phase list
│   │   └── [phase]/
│   │       ├── index.astro          # phase overview
│   │       └── [section].astro      # section content page
│   └── progress.astro               # upload/paste progress JSON, see status
├── components/
│   ├── DependencyGraph.astro        # or React island for interactivity
│   ├── PhaseCard.astro
│   ├── SectionNav.astro
│   ├── DifficultyBadge.astro        # 🏗️ / 🔬 / 📚 visual indicator
│   ├── CLICommand.astro             # styled command block with copy button
│   ├── DebugExercise.astro          # collapsible answer block
│   ├── CompletionCriteria.astro     # checklist-style display
│   ├── BenchmarkTarget.astro        # table of target numbers
│   └── ProgressUploader.astro       # client-side JSON reader, React island
└── layouts/
    ├── BaseLayout.astro
    ├── PhaseLayout.astro
    └── SectionLayout.astro
```

### Key Pages

#### Landing Page (`/`)
- Hero: "Build Kubernetes from scratch. Understand cloud platforms at every layer."
- The "Explain Like You Built It" test questions as social proof
- Time commitment & prerequisites upfront
- Quick-start: `curl -fsSL https://cpe.works-on-my.cloud/install | sh` + `cpe init`
- Agency CTA at bottom

#### Roadmap View (`/roadmap`)
- Interactive dependency graph (the Appendix C graph from the outline, but visual)
- Click a phase → see sections, time estimates, difficulty badges
- Skip paths highlighted for each career track (from Appendix D)
- Could be a React island using d3 or a simpler Mermaid diagram

#### Section Page (`/phases/{phase}/{section}`)
- Curriculum content rendered from markdown
- Sidebar: section nav within phase, difficulty badge, estimated hours, dependencies
- CLI commands are styled blocks with copy buttons: `cpe start phase-0.section-0.1.week-2`
- Projects have prominent "Start this project" block with CLI command
- Completion criteria displayed as a checklist (visual only — actual checking is CLI-side)

#### Progress Page (`/progress`)
- Client-side only (React island)
- User pastes progress JSON (exported from CLI) or uploads file
- Renders: phase completion %, exercises passed/failed, benchmark results
- Shows suggested next steps based on what's complete
- "Share your progress" — generates a shareable image/badge for LinkedIn (lead-gen angle)

### Web Implementation Phases

**Web Phase 1: Skeleton (1-2 weeks)**
- Astro project setup (you already have this)
- Content collection schema with frontmatter types
- Base layouts: phase overview, section content
- Navigation: phase list → section list → content
- 2-3 manually written sections as content to develop against
- Deploy to Cloudflare Pages

**Web Phase 2: Content pipeline (2-3 weeks)**
- LLM-generate all Phase 0 content from outline
- Human review pass
- Write test suites and scaffolds for Phase 0
- Refine LLM prompt based on quality of output
- Components: CLICommand, DebugExercise, CompletionCriteria, BenchmarkTarget, DifficultyBadge

**Web Phase 3: Navigation & discovery (1-2 weeks)**
- Dependency graph visualization (React island or static SVG)
- Skip path UI per career track
- Search (Pagefind — works with Astro SSG)
- Table of contents within long sections

**Web Phase 4: Progress display (1 week)**
- ProgressUploader React island
- Parse CLI progress JSON, render visual status
- Shareable progress badge generation (canvas → PNG)

**Web Phase 5: Remaining content (ongoing, 8-12 weeks)**
- LLM-generate + review phases 1-9
- Parallel with CLI development
- Each phase follows the same pipeline: outline → LLM expand → review → tests → scaffolds → commit

---

## CLI Tool (`cpe` — Cloud Platform Engineering)

### What It Does

1. **Environment provisioning** — spins up Docker containers or VMs with correct toolchains per phase
2. **Scaffold generation** — creates starter code for exercises and projects
3. **Test runner** — compiles user code, runs test suites, reports pass/fail
4. **Benchmarking** — runs performance tests, compares against targets
5. **Memory/race checking** — Valgrind (C), race detector (Go)
6. **Progress tracking** — local JSON/SQLite, exportable for web progress page
7. **Lab management** — start/stop/destroy lab environments, manage multi-node setups

### What It Does NOT Do

- No cloud communication (no telemetry, no accounts, no sync)
- No code editing (user uses their own editor)
- No LLM integration (content is pre-generated)
- No auto-updates (user runs `cpe update` manually, or re-downloads)

### CLI Command Structure

```
cpe
├── init                          # First-time setup, check Docker, pull base images
├── doctor                        # Verify system requirements
│
├── env                           # Environment management
│   ├── start <phase>             # Provision environment for a phase
│   ├── stop <phase>              # Stop environment
│   ├── destroy <phase>           # Remove environment and data
│   ├── status                    # Show running environments
│   └── shell <phase>             # Drop into environment shell
│
├── scaffold <exercise-id>        # Generate starter code for exercise
│   └── --force                   # Overwrite existing
│
├── test <exercise-id>            # Run tests for an exercise/project
│   ├── --verbose                 # Show detailed test output
│   ├── --valgrind                # Force memory check (C phases)
│   ├── --race                    # Force race detection (Go phases)
│   ├── --bench                   # Run benchmarks
│   └── --no-env                  # Run in host, not container (advanced)
│
├── submit <exercise-id>          # Test + record result in progress
│
├── progress
│   ├── show                      # Print progress summary
│   ├── export                    # Export JSON for web progress page
│   └── reset [exercise-id]       # Reset progress for exercise or all
│
├── lab                           # Multi-node lab management (Phases 5+)
│   ├── start <lab-name>          # Spin up multi-container lab
│   ├── stop <lab-name>
│   ├── destroy <lab-name>
│   └── status
│
├── content                       # Content management
│   ├── sync                      # Pull latest content/tests from repo
│   └── open <section-id>         # Open section in browser
│
├── update                        # Self-update CLI binary
└── version
```

### Environment Provisioning Strategy

Different phases need different environments:

| Phase | Environment | Base Image | Special Requirements |
|-------|-------------|------------|---------------------|
| 0 | Single container | Ubuntu + GCC, GDB, Valgrind, Make | None |
| 1 | Single container | Ubuntu + GCC + Nand2Tetris tools | Java (for N2T simulator) |
| 2 | Single container | Ubuntu + GCC, GDB, NASM | CS:APP lab binaries |
| 3-4 | Single container | Ubuntu + GCC, GDB, Valgrind | None |
| 5 | Privileged container(s) | Ubuntu + Go + iproute2, iptables, tcpdump | NET_ADMIN, NET_RAW capabilities. Multi-container for networking labs. |
| 6 | Privileged container | Ubuntu + Go + Docker-in-Docker or rootless nested containers | SYS_ADMIN for namespaces/cgroups. Mount propagation. |
| 7 | Multi-container (3-5 nodes) | Ubuntu + Go | Network between containers for Raft cluster |
| 8 | Kind cluster + Go | Ubuntu + Go + kind + kubectl | Docker-in-Docker for kind |
| 9 | Multi-container (3+ nodes) + kind | Ubuntu + Go + kind + all Phase 5-8 tools | Everything |

**Implementation:**

```go
// environments/phase0.go
type Phase0Env struct {
    containerID string
    workDir     string // mounted from host
}

func (e *Phase0Env) Dockerfile() string {
    return `
FROM ubuntu:24.04
RUN apt-get update && apt-get install -y \
    gcc gdb valgrind make \
    libc6-dev \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /workspace
`
}

func (e *Phase0Env) Start(workDir string) error {
    // Build image if not exists
    // docker run -d -v workDir:/workspace --name cpe-phase-0 cpe-phase-0
}
```

For multi-node environments (Phases 5, 7, 9), use Docker Compose:

```yaml
# environments/phase7-raft-lab.docker-compose.yml
services:
  node1:
    image: cpe-phase-7
    hostname: node1
    networks:
      raft-net:
        ipv4_address: 10.0.7.1
    volumes:
      - ./workspace:/workspace

  node2:
    image: cpe-phase-7
    hostname: node2
    networks:
      raft-net:
        ipv4_address: 10.0.7.2
    volumes:
      - ./workspace:/workspace

  node3:
    image: cpe-phase-7
    hostname: node3
    networks:
      raft-net:
        ipv4_address: 10.0.7.3
    volumes:
      - ./workspace:/workspace

networks:
  raft-net:
    ipam:
      config:
        - subnet: 10.0.7.0/24
```

### Test Runner Architecture

```go
// testing/runner.go

type TestConfig struct {
    ExerciseID    string
    Language      string            // "c" or "go"
    Timeout       time.Duration
    RequiredFiles []string
    Compile       CompileConfig
    MemoryCheck   bool
    RaceCheck     bool
    Benchmark     bool
    BenchTargets  map[string]float64
}

type TestResult struct {
    ExerciseID   string
    Passed       bool
    Score        int               // 0-100
    TestsPassed  int
    TestsTotal   int
    MemoryClean  bool
    RaceClean    bool
    Benchmarks   map[string]float64
    CompileClean bool
    Errors       []string
    Duration     time.Duration
    Timestamp    time.Time
}

func RunTests(config TestConfig, workDir string, envID string) (*TestResult, error) {
    result := &TestResult{ExerciseID: config.ExerciseID}

    // 1. Verify required files exist
    // 2. Copy test suite into container
    // 3. Compile (check for warnings)
    // 4. Run test binary (check exit code)
    // 5. If MemoryCheck: run through valgrind, parse output
    // 6. If RaceCheck: run with -race flag
    // 7. If Benchmark: run benchmarks, compare to targets
    // 8. Calculate score based on grading.yaml weights
    // 9. Return result
}
```

For C phases, the test runner:
1. Copies user `.c`/`.h` files + test suite into container
2. Compiles with `-Wall -Wextra -Werror -fsanitize=address,undefined`
3. Runs binary, captures exit code and output
4. Optionally runs through Valgrind
5. Optionally runs benchmarks

For Go phases:
1. Copies user `.go` files + test files into container
2. `go vet ./...`
3. `go test -v -count=1 ./...`
4. Optionally `go test -race ./...`
5. Optionally `go test -bench=. -benchmem ./...`

### Progress Storage

Local SQLite database at `~/.cpe/progress.db`:

```sql
CREATE TABLE progress (
    exercise_id TEXT PRIMARY KEY,
    phase       INTEGER,
    section     TEXT,
    status      TEXT,          -- 'not_started', 'attempted', 'passed', 'failed'
    score       INTEGER,       -- 0-100
    attempts    INTEGER,
    last_attempt TIMESTAMP,
    first_pass  TIMESTAMP,     -- when first passed
    test_result TEXT           -- JSON blob of last TestResult
);

CREATE TABLE benchmarks (
    exercise_id TEXT,
    metric_name TEXT,
    target      REAL,
    actual      REAL,
    passed      BOOLEAN,
    timestamp   TIMESTAMP,
    PRIMARY KEY (exercise_id, metric_name, timestamp)
);
```

Export format (for web progress page):

```json
{
  "version": "1.0",
  "exported_at": "2026-02-13T10:00:00Z",
  "cli_version": "0.1.0",
  "summary": {
    "phases_started": 3,
    "exercises_passed": 42,
    "exercises_total": 128,
    "total_hours_estimated": 450
  },
  "phases": {
    "0": {
      "status": "completed",
      "exercises": {
        "mywc": { "status": "passed", "score": 95, "attempts": 3 },
        "dynamic-string-library": { "status": "passed", "score": 100, "attempts": 1 },
        ...
      }
    },
    ...
  }
}
```

### CLI Implementation Phases

**CLI Phase 1: Core skeleton (2 weeks)**
- Go module setup, CLI framework (cobra or urfave/cli)
- `cpe init` — check Docker installed, pull base images
- `cpe doctor` — verify system requirements (Docker version, disk space, OS)
- `cpe version`, `cpe update` (self-update via GitHub releases)
- `cpe env start phase-0` / `stop` / `destroy` / `status` / `shell`
- Single container environments only (Phases 0-4)
- Progress database setup (SQLite)

**CLI Phase 2: Test runner for C (2 weeks)**
- Test config parser (YAML)
- Compile step with warning capture
- Test execution with timeout
- Valgrind integration and output parsing
- Benchmark runner with target comparison
- `cpe test <exercise-id>` working end-to-end for Phase 0 exercises
- `cpe submit` records results to progress DB
- `cpe progress show` / `export`
- Write test suites for all Phase 0 exercises (parallel with web content)

**CLI Phase 3: Scaffold generator (1 week)**
- `cpe scaffold <exercise-id>` creates starter code from templates
- Templates stored in content repo, pulled on `cpe content sync`
- Generates: source files with function signatures, Makefile, README

**CLI Phase 4: Privileged environments (2 weeks)**
- Privileged containers for Phase 5 (NET_ADMIN) and Phase 6 (SYS_ADMIN)
- Docker Compose orchestration for multi-node labs
- `cpe lab start/stop/destroy` for multi-container setups
- Network configuration for isolated lab networks

**CLI Phase 5: Go test runner (1 week)**
- `go vet`, `go test`, `-race`, `-bench` integration
- Same TestResult format as C runner
- `cpe test` auto-detects language from test_config.yaml

**CLI Phase 6: Multi-node labs (2 weeks)**
- Docker Compose-based multi-node environments
- Raft cluster labs (Phase 7): 3-5 node cluster with controlled networking
- Kubernetes labs (Phase 8-9): kind cluster provisioning
- Chaos testing helpers: `cpe lab partition <node>`, `cpe lab kill <node>`, `cpe lab delay <node> <ms>`

**CLI Phase 7: Polish (1-2 weeks)**
- `cpe content open <section-id>` — opens web page in browser
- Colored terminal output, progress bars
- Error messages with actionable fixes
- Shell completions (bash, zsh, fish)
- Man page generation
- Installation script (`curl | sh`)

---

## Content Generation Pipeline — Detailed Process

### Phase-by-Phase Content Production

Each phase follows this pipeline. Budget 2-3 weeks per phase for content production.

```
1. Take phase outline from roadmap-outline.md
2. For each section in the phase:
   a. Construct LLM expansion prompt (template + section outline + guidelines)
   b. Generate curriculum markdown
   c. Human review: accuracy, tone, completeness, exercise quality
   d. Generate test suites for each testable exercise
   e. Test the test suites locally (run them yourself)
   f. Generate scaffold code
   g. Verify scaffold + test suite work together (scaffold should fail tests,
      reference solution should pass)
   h. Commit to content repo
3. Build Astro site, verify all pages render correctly
4. Build CLI test bundles, verify `cpe test` works for all exercises
5. Write phase exit exam
```

### Content Production Order

Do NOT generate all content at once. Build and ship incrementally:

**Sprint 1 (Weeks 1-4): MVP — Web skeleton + CLI core + Phase 0 content**
- Web: Astro skeleton, layouts, 2-3 sections hand-written to establish patterns
- CLI: `init`, `doctor`, `env start/stop`, `test`, `submit`, `progress`
- Content: Phase 0 fully generated and reviewed
- Result: Someone can start Phase 0 and complete it with automated grading

**Sprint 2 (Weeks 5-8): Phases 1-2 content + CLI refinement**
- Content: Phases 1-2 generated and reviewed
- CLI: Bug fixes from Sprint 1, scaffold generator
- Web: Dependency graph, search, all Phase 0-2 pages live

**Sprint 3 (Weeks 9-12): Phases 3-4 content**
- Content: Phases 3-4 generated and reviewed
- CLI: Stable for all C-phase exercises
- CS:APP lab integration (Bomb Lab, Cache Lab, Malloc Lab test suites)

**Sprint 4 (Weeks 13-16): Phase 5 (the big one — Go transition + networking)**
- Content: Phase 5 generated and reviewed
- CLI: Privileged container support, Go test runner, multi-container labs
- Networking lab environments (veth, bridges, VXLAN)

**Sprint 5 (Weeks 17-20): Phase 6 (containers)**
- Content: Phase 6 generated and reviewed
- CLI: Docker-in-Docker or nested container support
- TinyContainer project test suite (complex — needs namespace/cgroup verification)

**Sprint 6 (Weeks 21-24): Phase 7 (distributed systems)**
- Content: Phase 7 generated and reviewed
- CLI: Multi-node Raft lab, chaos testing helpers
- Jepsen-lite test framework for linearizability testing

**Sprint 7 (Weeks 25-28): Phase 8 (Kubernetes internals)**
- Content: Phase 8 generated and reviewed
- CLI: Kind cluster provisioning, Kubernetes-specific test helpers
- Controller and scheduler project test suites

**Sprint 8 (Weeks 29-34): Phase 9 (capstone)**
- Content: Phase 9 generated and reviewed
- CLI: Full multi-node capstone environment
- End-to-end test suite for mini-Kubernetes
- Milestone-based testing (each milestone independently testable)

### LLM Guidelines for Content Generation

When generating section content, the LLM must follow these rules:

**General rules (apply to ALL sections):**
- Every code block specifies language (```c, ```go, ```bash, ```asm, etc.)
- Every debugging exercise uses <details> blocks for answers
- Every project has explicit completion criteria (automatable, not subjective)
- Every section opens with 2-3 sentence "why this matters" connecting to end goal
- Use the exact frontmatter schema defined above
- Do not invent book chapters or page numbers — use only what's in the outline
- Include CLI commands inline: `cpe scaffold <exercise-id>`, `cpe test <exercise-id>`
- Mark difficulty: 🏗️ Core, 🔬 Deep Dive, 📚 Enrichment on every subsection

**C-specific rules (Phases 0-4):**
- All code must compile with `gcc -Wall -Wextra -Werror -std=c11`
- All debugging exercises must have bugs that are realistic, not contrived
- Every memory-related exercise reminds about Valgrind
- Include the specific Valgrind/GDB commands to use
- Debugging exercises should have exactly N bugs where N is stated upfront

**Go-specific rules (Phases 5-9):**
- Follow standard Go project layout (cmd/, internal/, pkg/)
- Use table-driven tests
- Use context.Context for cancellation where appropriate
- Reference real Go libraries/projects where relevant (client-go, controller-runtime, cilium/ebpf)
- Include `go vet` and `staticcheck` as standard checks
- Concurrent code must always mention race detector

**Section-specific guidelines (override general rules where noted):**

Phase 0: Be very explicit and hand-holdy. The learner may never have written C.
Provide memory diagrams for every pointer exercise. Show addresses as hex.

Phase 1-2: Can assume C fluency from Phase 0. Assembly sections need line-by-line annotation of what each instruction does.

Phase 3: malloc lab needs an explicit debugging strategy section that's longer than the implementation section. Most time is spent debugging, not writing.

Phase 4: Concurrency bugs are non-deterministic. Every exercise must include "run this 1000 times" as part of the test. Include the exact shell loop command.

Phase 5: This is the Go transition. First 2 weeks need extra scaffolding. Include "in C, you would do X; in Go, you do Y" comparisons for every new concept.

Phase 6: Container exercises need careful safety notes. Privileged containers can damage the host. Include explicit warnings and cleanup commands.

Phase 7: Distributed systems exercises must include failure injection. Every "it works" test needs a corresponding "kill a node and it still works" test.

Phase 8: This phase is more reading-and-understanding than building. Include source code references (file paths in the Kubernetes repo) rather than reimplementing.

Phase 9: Milestone-based. Each milestone must be independently testable. The learner should have something working (and passing tests) at the end of each 2-week milestone, not only at the end.

---

## Repository Structure

```
cpe/
├── web/                              # Astro app
│   ├── astro.config.mjs
│   ├── package.json
│   ├── src/
│   │   ├── content/                  # Content collections
│   │   │   ├── config.ts
│   │   │   └── phases/              # LLM-generated markdown
│   │   ├── components/
│   │   ├── layouts/
│   │   └── pages/
│   └── public/
│
├── cli/                              # Go CLI
│   ├── go.mod
│   ├── go.sum
│   ├── main.go
│   ├── cmd/                          # CLI commands (cobra)
│   │   ├── root.go
│   │   ├── init.go
│   │   ├── env.go
│   │   ├── test.go
│   │   ├── submit.go
│   │   ├── scaffold.go
│   │   ├── progress.go
│   │   ├── lab.go
│   │   └── content.go
│   ├── internal/
│   │   ├── environment/             # Docker/VM provisioning
│   │   │   ├── docker.go
│   │   │   ├── compose.go
│   │   │   └── phases.go
│   │   ├── testing/                 # Test runner
│   │   │   ├── runner.go
│   │   │   ├── c_runner.go
│   │   │   ├── go_runner.go
│   │   │   ├── valgrind.go
│   │   │   └── benchmark.go
│   │   ├── progress/                # Progress tracking
│   │   │   ├── store.go
│   │   │   ├── sqlite.go
│   │   │   └── export.go
│   │   ├── scaffold/                # Scaffold generator
│   │   │   └── generator.go
│   │   └── config/                  # Config parsing
│   │       └── config.go
│   └── Makefile                     # Build for multiple platforms
│
├── content/                          # Shared content (submodule or embedded)
│   ├── tests/
│   │   ├── phase-0/
│   │   │   ├── mywc/
│   │   │   │   ├── test_config.yaml
│   │   │   │   ├── test_suite.c
│   │   │   │   ├── grading.yaml
│   │   │   │   └── test_data/
│   │   │   ├── dynamic-string-library/
│   │   │   ├── mygrep/
│   │   │   └── ...
│   │   ├── phase-5/
│   │   │   ├── dns-resolver/
│   │   │   │   ├── test_config.yaml
│   │   │   │   ├── resolver_test.go
│   │   │   │   └── grading.yaml
│   │   │   └── ...
│   │   └── ...
│   ├── scaffolds/
│   │   ├── phase-0/
│   │   │   ├── mywc/
│   │   │   │   ├── main.c
│   │   │   │   ├── Makefile
│   │   │   │   └── README.md
│   │   │   └── ...
│   │   └── ...
│   └── environments/
│       ├── phase-0.Dockerfile
│       ├── phase-5.Dockerfile
│       ├── phase-6.Dockerfile
│       ├── phase-7.docker-compose.yml
│       └── ...
│
├── outline/
│   └── roadmap-outline.md            # Source of truth
│
├── scripts/
│   ├── generate-content.sh           # LLM content generation helper
│   └── install.sh                    # CLI installer (curl | sh)
│
└── README.md
```

### Monorepo vs Multi-repo

Recommended: **monorepo** with the structure above.

- Web deploys from `web/` via Cloudflare Pages (set build directory)
- CLI releases from `cli/` via GitHub Actions (goreleaser)
- Content is shared between both via `content/` directory
- CLI embeds test definitions and scaffolds at build time using `go:embed`

---

## Deployment & Distribution

### Web
- **Host:** Cloudflare Pages (your existing setup)
- **Build:** `cd web && npm run build`
- **Deploy:** Push to main branch → auto-deploy
- **Domain:** Something like `learn.works-on-my.cloud` or `cpe.works-on-my.cloud`

### CLI
- **Distribution:** GitHub Releases + install script
- **Build:** goreleaser for cross-compilation (linux/amd64, linux/arm64, darwin/amd64, darwin/arm64)
- **Install:** `curl -fsSL https://cpe.works-on-my.cloud/install | sh`
- **Update:** `cpe update` downloads latest binary from GitHub Releases
- **Content bundling:** Test definitions and scaffolds embedded in binary via `go:embed`. User runs `cpe content sync` to get updates between CLI releases.

### Content Updates
- Content can update independently of CLI releases
- `cpe content sync` pulls latest test/scaffold tarballs from a GitHub release or CDN
- Web rebuilds on every content commit (Cloudflare Pages auto-deploy)

---

## What to Build First (Critical Path)

The absolute minimum to ship something useful:

```
Week 1-2:  CLI skeleton (init, doctor, env start/stop/shell for Phase 0)
Week 2-3:  LLM-generate Phase 0 content (parallel with CLI)
Week 3-4:  CLI test runner for C (compile, run, valgrind)
Week 4:    Write Phase 0 test suites (mywc, string lib, linked list, mygrep, mini-redis)
Week 5:    Astro skeleton with Phase 0 content live
Week 6:    Integration: cpe test + cpe submit + progress export, web progress page
Week 7:    Polish, write install script, README, landing page
Week 8:    Ship Phase 0 MVP. Start Phase 1-2 content generation.
```

After that, each subsequent phase is ~3-4 weeks of content generation + test writing + CLI environment support, shipped incrementally.

---

## Risk Mitigations

| Risk | Mitigation |
|------|------------|
| LLM-generated content has errors in exercises/code | Human review pass mandatory. Every test suite must be verified by running reference solution. |
| Privileged container labs break user's system | Explicit warnings. Isolated Docker networks. `cpe doctor` checks before lab start. Cleanup commands in `cpe lab destroy`. |
| Phase 5+ environments are complex to provision | Provide pre-built Docker images on GHCR. `cpe init` pre-pulls them. Include troubleshooting guide for common Docker issues. |
| Users get stuck, no support channel | Include "hint" system in CLI (`cpe hint <exercise-id>` reveals progressive hints). Common errors FAQ per phase on web. Agency CTA for paid mentoring. |
| Content generation takes too long | Ship phases incrementally. Phase 0 alone is valuable. Each phase is independently useful. |
| Test suites are too strict/lenient | Include `cpe test --verbose` for detailed output. Grading weights are configurable. Accept PRs for test improvements. |
