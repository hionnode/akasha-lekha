# Options: What We Could Build

> 4 concrete options with honest tradeoffs. Each option includes scope,
> effort, infrastructure needs, what it does well, and what it does poorly.

---

## Decision Context

The preceding research files establish several constraints:

1. **No single format works for all 8 CS subjects.** Discrete math needs interactive proofs. OS needs kernel labs. Networking needs packet captures. A uniform approach will be mediocre everywhere.

2. **Retention requires active retrieval practice.** Passive content (blog posts, videos) decays rapidly without spaced review. Any option that doesn't address retention is building on sand.

3. **The existing codebase provides a foundation.** Astro + MDX for content, Solid.js islands for interactivity, labs infrastructure for exercise schemas and progress tracking. The question is how much to build on this vs how much to build new.

4. **Content authoring is the bottleneck.** Engineering an SRS engine takes weeks. Writing 150 hours of high-quality discrete math content takes months. Any option must be realistic about authoring effort.

5. **The audience wants practical understanding, not credentials.** Working developers (1-5 years experience) who want to fill gaps and become better engineers. Not students seeking a degree equivalent.

---

## Option A: "CS Tracks" -- Blog Series per Subject

### Model

Extend the existing blog with multi-part series per CS subject, mirroring the AWS series model. Each subject gets a 10-20 part long-form series with code examples, diagrams, and exercises at the end of each part.

### What It Looks Like

```
/blog/discrete-math/01-logic-and-proofs
/blog/discrete-math/02-sets-and-functions
/blog/discrete-math/03-induction
...
/blog/operating-systems/01-processes
/blog/operating-systems/02-virtual-memory
...
```

Each post: 2,000-4,000 words, MDX with callouts, code blocks, diagrams, and 3-5 exercises at the end (ungraded, self-check).

### Scope

- 8 series, 10-20 parts each = 80-160 blog posts
- Each post requires 8-16 hours to write well (research, writing, diagrams, exercises)
- Total authoring effort: 640-2,560 hours (this is the dominant cost)
- Engineering effort: near zero (existing blog infrastructure handles everything)

### What Exists in the Codebase

Everything needed already exists:
- Blog content collection with series support (`series`, `seriesPart` frontmatter)
- MDX components: callouts, steps, code blocks with syntax highlighting, code switcher
- Series navigation (sidebar, prev/next)
- SEO infrastructure (meta tags, Open Graph)
- Build and deploy pipeline (Cloudflare Pages)

### What Would Need to Be Built

| Feature | Effort | Notes |
|---------|--------|-------|
| Nothing significant | -- | The blog handles this natively |
| Optional: subject landing pages | Low | Custom index pages per subject with progress overview |
| Optional: exercise self-check component | Low | A "reveal answer" component for end-of-post exercises |

### Pros

- **Zero engineering effort.** The existing blog infrastructure handles multi-part series with MDX components. Start writing immediately.
- **SEO-friendly.** Each blog post is an independent, indexable page. Organic search traffic for "operating systems for developers" etc.
- **Familiar format.** Developers know how to read blog posts. No learning curve for the platform itself.
- **Incremental delivery.** Publish one post at a time. Each post is independently valuable. No need to build an entire subject before launching.
- **Low risk.** If a subject doesn't resonate, you've written some blog posts, not built a platform.

### Cons

- **Passive consumption risk.** Blog posts are read, not done. Without active exercises, retention will be poor (see `04-retention-and-progress.md`). End-of-post exercises help but are self-reported and easily skipped.
- **No feedback loop.** Students can't verify understanding. They read the post, maybe try the exercises, and have no way to know if they truly understood.
- **No progress tracking.** The blog has no concept of "you've completed 7 of 15 discrete math posts." Progress is invisible.
- **Poor for practical subjects.** OS labs, C debugging exercises, and Wireshark captures don't fit the blog format. You can describe them but students need to actually do them.
- **Content authoring is enormous.** 80-160 high-quality posts is 1-3 years of sustained writing effort. Quality will vary as fatigue sets in.

### Subjects Served Well vs Poorly

| Well Served | Poorly Served |
|------------|---------------|
| Discrete math (proofs can be shown in text) | OS (needs kernel labs) |
| Networking theory (protocol explanations) | C programming (needs hands-on coding) |
| Distributed systems theory (design discussions) | Architecture (needs building projects) |
| Databases theory (relational model, SQL) | DSA (needs interactive practice) |

### Verdict

**Best as: a starting point or a complement to a more interactive system.** The blog series model is how the AWS content works and it works well for that audience. For CS fundamentals, it provides the *theory layer* but not the *practice layer*. If combined with external exercises (Exercism, CSAPP labs), it could work. As a standalone, it will suffer from the passive consumption problem.

---

## Option B: "Exercism-Style Tracks" -- Exercise-First with CLI Verification

### Model

Exercise collections organized per subject, using real tools on the student's machine. Students read a short lesson, complete an exercise locally, and run a CLI command to verify completion. This extends the existing labs model.

### What It Looks Like

```
/labs/modules/discrete-math
  /exercises/logic-truth-tables
  /exercises/set-operations
  /exercises/proof-by-induction
...
/labs/modules/c-programming
  /exercises/pointer-arithmetic
  /exercises/memory-layout
  /exercises/linked-list-implementation
...
```

Each exercise: short lesson (500-1,000 words), clear objectives, starter code (where applicable), CLI verification command.

### Scope

- 8 subjects × 15-30 exercises each = 120-240 exercises
- Each exercise: 4-8 hours to design (lesson, starter code, verification logic, edge cases)
- Total authoring effort: 480-1,920 hours
- CLI verification tooling: must be built per-subject (different verification for C code vs SQL queries vs proofs)
- Total engineering effort: 200-400 hours (CLI tools, verification engines, per-subject scaffolding)

### What Exists in the Codebase

- Labs content collection with module and exercise schemas (`id`, `module`, `order`, `difficulty`, `objectives`, `verificationCriteria`, `cliCommand`)
- Solid.js islands: AuthStatus, ProgressTracker, CLICommandCopy
- API endpoints: exercise CRUD, progress recording, auth (GitHub OAuth)
- DynamoDB progress tracking (USER#id, EXERCISE#id)
- SST infrastructure for API and database

### What Would Need to Be Built

| Feature | Effort | Notes |
|---------|--------|-------|
| CLI verification tools per subject | High | C: compile and test; SQL: run queries against a test DB; Math: verify proof steps; Network: check captures |
| Exercise starter repositories | Medium | Git repos with starter code, test harnesses, and README for each exercise |
| Subject-specific verification logic | High | Each subject verifies differently; no universal approach |
| Prerequisite/dependency UI | Medium | Show which exercises are unlocked based on completed prerequisites |
| Exercise content (120-240 exercises) | High | The dominant cost; each needs careful pedagogical design |

### Pros

- **Active learning.** Students do, not just read. This is the single biggest predictor of learning outcomes (Freeman et al., 2014).
- **Real tooling.** Students use GCC, GDB, Wireshark, PostgreSQL on their own machines. Skills transfer directly to professional work.
- **Builds on existing infrastructure.** The labs model (content collections, progress API, auth) is already built. This extends it rather than replacing it.
- **CLI verification provides a feedback loop.** Students know immediately whether they succeeded. Progress is objective, not self-reported.
- **Natural gamification.** Exercise completion, module progress, and subject mastery provide meaningful milestones.

### Cons

- **Heavy engineering per subject.** C exercises need a different verification system than SQL exercises, which need a different system than networking exercises. Each subject essentially needs its own CLI verification tool.
- **High content authoring effort.** Each exercise needs: lesson text, starter code, test cases, verification logic, hints, and edge case handling. This is more work per unit than a blog post.
- **Only works for practical subjects.** You can verify C code compiles and passes tests. How do you verify a student understands the CAP theorem? CLI verification struggles with theoretical subjects.
- **Setup friction.** Students need to install subject-specific tools (GCC, Wireshark, PostgreSQL, etc.). This is the #1 cause of dropout in self-directed technical education.
- **Narrow exercises risk.** Exercises that are too narrow (single-function implementations) miss the integrative understanding that projects provide. Need to balance micro-exercises with larger labs.

### Subjects Served Well vs Poorly

| Well Served | Poorly Served |
|------------|---------------|
| C programming (compile, test, verify) | Discrete math (proofs are hard to verify automatically) |
| DSA (algorithm correctness is testable) | Distributed systems theory (design reasoning can't be CLI-verified) |
| Databases (SQL queries have correct answers) | Computer architecture (needs hardware simulator, not CLI) |
| OS (xv6 labs have test harnesses) | Networking theory (concepts vs captures) |

### Verdict

**Best as: the practice layer for practical subjects.** This is the strongest model for subjects where "doing" is the core activity: C programming, DSA, OS labs, database queries. It struggles with theoretical subjects where understanding can't be reduced to a testable output. Combining this with blog content (Option A) for theory creates a more complete solution.

---

## Option C: "Hybrid Paths" -- Mixed-Mode per Subject

### Model

Each subject gets its own pedagogical design based on its theory/practice ratio and what works best for that specific subject. No forced uniformity. Discrete math gets interactive proofs and drills. OS gets blog articles paired with xv6 labs. Networking gets top-down articles with Wireshark exercises. DSA gets visualizations with coding exercises.

### What It Looks Like

```
Subject-specific entry points:

/cs/discrete-math      → Interactive text with executable proofs + SRS drills
/cs/c-programming      → Labs track with CSAPP-style progression
/cs/architecture       → Guided project track (Nand2Tetris model)
/cs/dsa                → Visualizations + coding exercises + SRS review
/cs/operating-systems  → Blog series (OSTEP-style) + xv6 lab exercises
/cs/networking         → Top-down blog series + Wireshark exercises + socket projects
/cs/databases          → SQL exercises + internals blog series + build-a-DB project
/cs/distributed        → Paper summaries + blog series + Raft lab
```

### Scope

- Per-subject content design (no template; each subject is individually designed)
- Total authoring effort: 1,500-3,000 hours (varies widely by subject)
- Engineering effort: 400-800 hours (multiple formats require multiple component types)
- Timeline: 12-24 months for full coverage

### What Exists in the Codebase

Everything from Options A and B, plus the need for:
- Blog infrastructure (exists) for theory-heavy subjects
- Labs infrastructure (exists) for practice-heavy subjects
- Both used in combination for hybrid subjects

### What Would Need to Be Built

| Feature | Effort | Notes |
|---------|--------|-------|
| Everything from Options A and B | See above | Blog + labs infrastructure |
| Interactive proof environment | High | Browser-based proof checker for discrete math |
| SRS engine | Medium | Scheduling algorithm, exercise database, review UI |
| Visualization components | Medium-High | Per data structure/algorithm; must be interactive, not passive |
| Subject-specific landing pages | Medium | Each subject has different navigation (linear for blog, graph for exercises, project-based for architecture) |
| Cross-subject progress dashboard | Medium | Unified view across different learning formats |
| Per-subject CLI verification tools | High | Same as Option B, for applicable subjects |

### Pros

- **Pedagogically optimal.** Each subject is taught the way research shows it should be taught. Discrete math gets proofs and drills. OS gets kernel labs. Architecture gets building projects. No compromises for format uniformity.
- **Leverages existing infrastructure.** Blog series for theory. Labs for practice. Both already exist.
- **Best learning outcomes.** If the goal is genuine understanding, this approach produces the deepest learning because it respects the nature of each subject.
- **Differentiated offering.** No other platform offers per-subject pedagogical optimization for CS fundamentals. This is a genuine competitive advantage.

### Cons

- **Highest complexity.** Designing, building, and maintaining 8 different learning experiences is significantly more work than one uniform approach.
- **Inconsistent UX.** Students moving between subjects encounter different formats, navigation patterns, and interaction models. This can be disorienting.
- **Maintenance burden.** 8 different content formats means 8 different sets of components, validation rules, and authoring workflows.
- **Requires pedagogical expertise per subject.** You can't just write content; you need to understand what works for each subject. Getting this wrong undermines the whole premise.
- **Hardest to scope incrementally.** Each subject is a mini-project. It's hard to ship "half of discrete math" because the format is purpose-built for the full experience.

### Subjects Served Well vs Poorly

| Well Served | Poorly Served |
|------------|---------------|
| All subjects (by design) | None (by design) |

The whole point is that every subject gets its optimal format. The tradeoff is complexity, not pedagogical coverage.

### Verdict

**Best as: the long-term vision if CS education becomes a core product.** This is the right answer if you're building a serious CS education platform. It's the wrong answer if CS fundamentals is a side project or experiment. The effort is substantial but the outcome is genuinely differentiated.

---

## Option D: "Curated Roadmap" -- External Resources + Original Glue

### Model

Curated learning paths that link to the best existing open resources (OSTEP, Nand2Tetris, Beej's Guide, MIT 6.824, CS:APP labs, Exercism tracks) with original "bridge" content filling gaps between resources. Progress tracking and sequencing are the platform's value-add.

### What It Looks Like

```
/cs/roadmap                     → Overview of all 8 subjects with recommended paths
/cs/discrete-math/roadmap       → Curated path through MIT 6.042 + Book of Proof + exercises
/cs/operating-systems/roadmap   → Curated path through OSTEP + MIT 6.1810 xv6 labs
/cs/networking/roadmap          → Curated path through Kurose & Ross + Wireshark labs + Beej's Guide

Each roadmap page:
- Subject overview (original content, 1,000-2,000 words)
- Recommended resources with specific chapters/lectures
- Checkable milestones (self-reported progress tracking)
- Bridge articles (original, 500-1,000 words each) filling gaps between resources
- "What to do if you're stuck" guidance per section
```

### Scope

- 8 subject roadmaps with curated resource lists
- 3-5 bridge articles per subject = 24-40 original articles (short)
- Total authoring effort: 200-400 hours (mostly curation and bridge writing)
- Engineering effort: 100-200 hours (progress tracking, roadmap UI, milestone system)
- Timeline: 2-4 months

### What Exists in the Codebase

- Blog infrastructure for bridge articles
- Progress tracking API (can be extended for milestone tracking)
- Auth system for persistent progress

### What Would Need to Be Built

| Feature | Effort | Notes |
|---------|--------|-------|
| Roadmap page component | Medium | Subject overview, resource list, milestone checkboxes |
| Self-reported milestone tracking | Low | Extend progress API with "checked/unchecked" milestones |
| Bridge articles (24-40) | Medium | Short articles filling gaps between external resources |
| Resource validation | Low | Periodic checks that linked resources still exist |
| Subject overview pages | Low | Original content introducing each subject and the recommended path |

### Pros

- **Ship fast.** 2-4 months to a complete v1. The content already exists externally; you're curating and sequencing, not authoring from scratch.
- **Leverage proven materials.** OSTEP, Nand2Tetris, CS:APP labs, and MIT 6.824 are some of the best CS education materials ever created. Linking to them is better than creating inferior alternatives.
- **Focus energy on what's unique.** Instead of writing an OS textbook, write the bridge content that connects OSTEP to xv6 labs. Instead of creating a networking course, curate the path through Kurose & Ross with Wireshark.
- **Low risk.** If no one wants CS fundamentals content, you've invested 2-4 months. If they do, you have a validated foundation to build on.
- **Validates demand.** Before investing 1,000+ hours in original content, find out if people actually want CS fundamentals guidance.

### Cons

- **Dependent on external links.** If MIT takes down 6.824 lectures or OSTEP changes URLs, your roadmap breaks. Links rot. This is an ongoing maintenance burden.
- **Less brand-building.** Students are spending most of their time on external sites. They associate the learning with MIT or OSTEP, not with works-on-my.cloud. Limited SEO value.
- **"Just another roadmap."** Teach Yourself CS, OSSU, and roadmap.sh already exist. Differentiation requires the bridge content and progress tracking to be genuinely valuable.
- **No feedback loop.** Progress tracking is self-reported (checkboxes). There's no verification that the student actually understood the material.
- **Limited depth of engagement.** Students visit for the roadmap, leave for the external content, and may never return. The platform becomes a bookmark, not a destination.

### Subjects Served Well vs Poorly

| Well Served | Poorly Served |
|------------|---------------|
| OS (OSTEP + xv6 labs are excellent and complete) | Subjects without a single clear "best" resource |
| Architecture (Nand2Tetris is self-contained) | Discrete math (no single open resource covers it well for developers) |
| Distributed systems (MIT 6.824 is comprehensive) | Databases (good resources exist but are fragmented) |
| Networking (Kurose & Ross + Beej's Guide) | |

### Verdict

**Best as: the MVP for validating demand.** Ship fast, learn what resonates, then invest in original content for the subjects and formats that prove popular. The risk of building a full platform for CS education without validating demand first is significant. Option D provides that validation at minimal cost.

---

## Comparison Matrix

| Dimension | A: Blog Series | B: Exercise Tracks | C: Hybrid Paths | D: Curated Roadmap |
|-----------|---------------|-------------------|-----------------|-------------------|
| **Authoring effort** | 640-2,560 hrs | 480-1,920 hrs | 1,500-3,000 hrs | 200-400 hrs |
| **Engineering effort** | ~0 hrs | 200-400 hrs | 400-800 hrs | 100-200 hrs |
| **Time to v1** | 6-18 months | 6-12 months | 12-24 months | 2-4 months |
| **Active learning** | Low | High | High | Low (external) |
| **Retention** | Poor | Good | Best | Poor |
| **Theory subjects** | Good | Poor | Best | Good (external) |
| **Practical subjects** | Poor | Good | Best | Good (external) |
| **SEO value** | High | Medium | High | Low |
| **Brand building** | High | High | Highest | Low |
| **Risk** | Low | Medium | High | Lowest |
| **Maintenance** | Low | High | Highest | Medium (link rot) |
| **Builds on existing** | Fully | Substantially | Substantially | Partially |
| **Differentiation** | Low (many blogs) | Medium (Exercism exists) | High (unique) | Low (many roadmaps) |

---

## Recommended Sequencing

These options aren't mutually exclusive. They can be sequenced:

### Phase 1: Validate (Option D, 2-4 months)
Ship curated roadmaps for all 8 subjects. Write bridge articles. Add progress tracking. Measure which subjects get the most traffic and engagement. Learn what the audience actually wants.

### Phase 2: Deepen (Option A + B for top subjects, 6-12 months)
For the 2-3 subjects that proved most popular in Phase 1, create original blog series (theory) and exercise tracks (practice). This is a targeted investment based on validated demand.

### Phase 3: Optimize (Option C for proven subjects, ongoing)
For subjects with sustained engagement, evolve toward the hybrid model with per-subject pedagogical optimization, SRS integration, and interactive components.

This sequencing minimizes risk, validates assumptions, and invests heavily only where demand is proven. The total effort is higher than any single option, but the waste is lower because each phase informs the next.

---

## Infrastructure Summary

What needs to be built, by phase:

### Phase 1 (Option D)
- Roadmap page component
- Self-reported milestone tracking (extend progress API)
- 24-40 bridge articles

### Phase 2 (Options A + B)
- Blog series for selected subjects (no new engineering)
- CLI verification tools for selected practical subjects
- Exercise starter repositories

### Phase 3 (Option C additions)
- SRS engine (scheduling, review sessions, progress tracking)
- Interactive visualization components (subject-specific)
- Per-subject landing pages and navigation
- Cross-subject progress dashboard

The existing codebase (Astro, Solid.js islands, labs infrastructure, DynamoDB progress tracking, GitHub OAuth) provides the foundation for all phases. The incremental engineering effort is manageable if spread across phases.
