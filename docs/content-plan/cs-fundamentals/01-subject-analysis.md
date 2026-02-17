# Subject Analysis: The 8 Core CS Subjects

> Maps the territory: what subjects, how they relate, how long they take,
> and what makes each one hard.

---

## Subject Overview

| # | Subject | Theory / Practice | Prerequisites | Est. Hours | Key Challenge |
|---|---------|-------------------|---------------|------------|---------------|
| 1 | Discrete Mathematics | 60 / 40 | None | 150 | Proof writing barrier -- students can follow proofs but freeze when asked to construct one |
| 2 | C Programming | 25 / 75 | None | 100 | Memory model mental shift -- going from garbage-collected languages to manual memory management |
| 3 | Computer Architecture | 35 / 65 | None | 150 | Abstraction layer jumps -- reasoning about behavior across gates, ISA, microarchitecture, and OS simultaneously |
| 4 | Data Structures & Algorithms | 50 / 50 | Discrete math, any programming language | 200 | Memorization vs understanding -- students memorize implementations without grasping the underlying invariants |
| 5 | Operating Systems | 40 / 60 | C, computer architecture | 150 | Kernel complexity -- the sheer number of interacting subsystems and the difficulty of debugging concurrent code |
| 6 | Computer Networking | 45 / 55 | OS basics | 100 | Protocol stack abstraction -- understanding why layers exist and how they compose |
| 7 | Databases | 40 / 60 | Programming, basic DSA | 100 | Theory vs practical SQL gap -- students learn relational algebra or learn SQL but rarely connect the two |
| 8 | Distributed Systems | 50 / 50 | Networking, OS, databases | 150 | Failure modes thinking -- shifting from "how does this work" to "how does this break" |

**Total estimated hours: ~1,200** (roughly equivalent to 2 semesters of full-time study, or 18-24 months at 15 hours/week)

---

## Detailed Subject Profiles

### 1. Discrete Mathematics

**What it covers:** Propositional and predicate logic, set theory, functions and relations, combinatorics, graph theory, number theory, probability, proof techniques (induction, contradiction, construction).

**Why it matters:** Every other CS subject assumes this knowledge. Algorithm analysis requires combinatorics and induction. Database theory requires relational algebra (sets and relations). Networking uses graph theory. Cryptography uses number theory. Without discrete math, everything downstream is memorization instead of understanding.

**Theory/Practice split (60/40):** Heavily theoretical but best taught with executable examples. Proofs can be verified computationally. Combinatorial arguments can be tested with code. Graph algorithms bridge math and implementation.

**Estimated hours: 150.** This is the subject most developers skip entirely, which means starting from zero. The proof-writing skill in particular requires sustained deliberate practice.

**Key challenge:** The proof writing barrier. Students can follow a textbook proof step-by-step but cannot construct their own. This is analogous to reading a novel vs writing one -- consumption and production are fundamentally different skills. Most self-study materials don't provide enough scaffolded proof practice.

### 2. C Programming / Low-Level Programming

**What it covers:** Pointers and pointer arithmetic, manual memory management (malloc/free), stack vs heap, structs and unions, bit manipulation, the C compilation model (preprocessor, compiler, assembler, linker), undefined behavior, the POSIX interface.

**Why it matters:** C is the language of systems software. The Linux kernel, databases (PostgreSQL, SQLite), networking stacks, and language runtimes are written in C. Understanding C means understanding the machine model that every higher-level language abstracts over. You don't need to write C daily, but you need to think in C to understand performance, memory, and systems behavior.

**Theory/Practice split (25/75):** Almost entirely practical. Concepts are best learned by writing C code, debugging segfaults, and understanding memory layouts. A small amount of theory covers the C abstract machine and undefined behavior semantics.

**Estimated hours: 100.** Developers who already program pick up syntax quickly. The hard part is the mental model shift -- learning to think about memory explicitly. Lab-based learning (like CSAPP's Data Lab and Bomb Lab) is dramatically more effective than textbook exercises.

**Key challenge:** The memory model mental shift. Developers from Python/JavaScript/Java have never thought about where variables live in memory. The concepts of stack frames, heap allocation, pointer dereferencing, and buffer overflows are not just new syntax -- they require a fundamentally different way of thinking about program execution.

### 3. Computer Architecture

**What it covers:** Boolean logic and gates, combinational and sequential circuits, instruction set architecture (ISA), processor design (single-cycle, pipeline, superscalar), memory hierarchy (caches, virtual memory), I/O, parallelism (SIMD, multicore).

**Why it matters:** Understanding architecture explains why certain operations are fast or slow, why cache locality matters, why branch prediction affects performance, and how the hardware constrains software design. It's the foundation for understanding OS and compiler behavior.

**Theory/Practice split (35/65):** Conceptually rich but best taught through building. The Nand2Tetris approach -- building a computer from NAND gates to a high-level language -- has proven remarkably effective because it makes every abstraction layer concrete.

**Estimated hours: 150.** The build-from-scratch approach (Nand2Tetris) takes about 100-120 hours. Adding depth on modern topics (caches, virtual memory, pipelining) via CS:APP adds another 30-50 hours.

**Key challenge:** Abstraction layer jumps. Students must simultaneously hold models at multiple levels: what a gate does, what an instruction does, what the OS sees, what the program sees. The skill is knowing which layer to think at for a given problem. Many students get stuck at one layer and can't zoom in or out.

### 4. Data Structures & Algorithms

**What it covers:** Arrays, linked lists, stacks, queues, trees (BST, AVL, B-trees), hash tables, heaps, graphs. Sorting, searching, dynamic programming, greedy algorithms, graph algorithms (BFS, DFS, shortest path, MST). Complexity analysis (Big-O, amortized).

**Why it matters:** The most directly applicable CS subject for working developers. Every program manipulates data structures and executes algorithms. Understanding them means making better choices about data representation, recognizing when a problem has a known efficient solution, and analyzing the performance characteristics of your code.

**Theory/Practice split (50/50):** Equal parts analysis (proving correctness, deriving complexity) and implementation (coding algorithms, choosing data structures for real problems). The theory without practice produces developers who can analyze but not implement. The practice without theory produces developers who implement but can't analyze.

**Estimated hours: 200.** The longest subject because it has the widest breadth. However, most developers have partial knowledge here -- they've used hash maps and know what a binary tree is. The work is filling gaps and building depth, not starting from zero.

**Key challenge:** Memorization vs understanding. Students (especially those studying for interviews) memorize algorithm implementations without understanding the invariants that make them correct or the structural properties that determine their complexity. When the problem changes slightly, memorized solutions break. The goal should be understanding the design principles (divide and conquer, greedy choice, optimal substructure) that generate algorithms.

### 5. Operating Systems

**What it covers:** Process management (fork, exec, scheduling), memory management (virtual memory, paging, segmentation), file systems (inodes, journaling, VFS), concurrency (threads, locks, semaphores, condition variables), I/O (interrupts, DMA, device drivers), inter-process communication, security and protection.

**Why it matters:** The OS is the software that manages all hardware resources. Every program runs on an OS. Understanding OS concepts explains process isolation, memory limits, file I/O performance, and concurrency bugs. For cloud developers specifically, containers are OS-level virtualization -- understanding cgroups and namespaces requires understanding process and memory management first.

**Theory/Practice split (40/60):** Best taught through a combination of reading (OSTEP is excellent for building intuition) and labs (xv6 provides a real kernel to modify). The theory is essential for understanding WHY the OS works this way, but the labs make it concrete.

**Estimated hours: 150.** One of the more demanding subjects because the labs involve modifying kernel code, which requires careful debugging and understanding of concurrent execution. Students typically spend 15-25 hours per major lab (page tables, copy-on-write, filesystem).

**Key challenge:** Kernel complexity. An OS kernel is a massive concurrent system where every subsystem interacts with every other subsystem. A bug in the memory manager can manifest as a filesystem corruption. A scheduling decision affects I/O latency. Students struggle with the debugging difficulty (no printf in a broken kernel) and the sheer number of moving parts.

### 6. Computer Networking

**What it covers:** The TCP/IP protocol stack (application, transport, network, link layers), HTTP/HTTPS, DNS, TCP (connection management, flow control, congestion control), UDP, IP (addressing, routing, NAT), Ethernet, ARP, sockets programming, network security (TLS, certificates).

**Why it matters:** Every modern application is a networked application. Understanding networking explains latency, throughput, DNS resolution, load balancing, CDNs, and the behavior of distributed systems. For cloud developers, networking is arguably the most directly practical CS fundamental -- VPCs, security groups, load balancers, and Route 53 are all networking concepts with AWS wrappers.

**Theory/Practice split (45/55):** Moderate theory (protocol design, layering rationale) with significant practice (Wireshark captures, socket programming, building simple protocols). The top-down approach (starting with HTTP, working down to physical) is more effective than bottom-up for developers who already use networks daily.

**Estimated hours: 100.** One of the more accessible subjects because developers have daily experience with the application layer (HTTP, DNS). The work is understanding what happens below that layer and why.

**Key challenge:** Protocol stack abstraction. The layered model is powerful but confusing. Students struggle with understanding why layers exist, how they interact, and what guarantees each layer provides. The most common confusion: conflating TCP reliability with application-level reliability, or not understanding where encryption happens in the stack.

### 7. Databases

**What it covers:** Relational model and algebra, SQL (DDL, DML, joins, subqueries, window functions), query optimization (cost models, join algorithms, index selection), transactions (ACID, isolation levels, MVCC), storage engines (B-trees, LSM trees, heap files), recovery (WAL, checkpointing), NoSQL models (document, key-value, graph, column-family).

**Why it matters:** Nearly every application stores and retrieves data. Understanding database internals explains why certain queries are slow, how indexes work, what isolation levels mean in practice, and how to choose between relational and non-relational models. For the works-on-my.cloud audience specifically, understanding DynamoDB's single-table design requires understanding both relational theory (to know what you're giving up) and storage engine concepts (to know what you're gaining).

**Theory/Practice split (40/60):** The relational model and query optimization have rich theoretical foundations, but they're best understood through practical SQL work and examining query plans. Storage engine internals are best learned by building a toy database or studying SQLite's implementation.

**Estimated hours: 100.** Most developers already know basic SQL and have used databases. The work is understanding the internals: how a query optimizer chooses a plan, how MVCC implements isolation, how a B-tree index speeds up lookups, and how WAL provides durability.

**Key challenge:** The theory-practice gap. Academic database courses focus on relational algebra and normal forms. Practical database work focuses on SQL performance and schema design. Students who learn only theory can't write efficient queries. Students who learn only practice can't reason about correctness or optimization. Both sides are needed.

### 8. Distributed Systems

**What it covers:** System models (synchronous, asynchronous, partially synchronous), failure models (crash-stop, crash-recovery, Byzantine), consistency models (linearizability, sequential consistency, eventual consistency, causal consistency), consensus protocols (Paxos, Raft), replication strategies (primary-backup, multi-leader, leaderless), partitioning (hash, range), distributed transactions (2PC, Saga), clock synchronization (Lamport, vector clocks), CAP theorem and its practical implications.

**Why it matters:** Modern infrastructure is distributed by default. Cloud services, microservices, databases with replication, message queues, CDNs -- all are distributed systems. Understanding distributed systems explains why distributed databases behave differently from single-node databases, why network partitions cause split-brain, and why "exactly-once delivery" is a lie. This is the subject that most directly connects CS theory to cloud infrastructure practice.

**Theory/Practice split (50/50):** Heavy on theory (impossibility results, protocol proofs, consistency models) with practical application through reading real system papers (Dynamo, Spanner, Raft) and reasoning about failure scenarios. Labs typically involve building a simple distributed key-value store or implementing Raft.

**Estimated hours: 150.** The most advanced subject on the list. Requires solid foundations in networking, OS (concurrency), and databases. Most developers have used distributed systems but have never studied them formally. The gap between "using Kafka" and "understanding why Kafka makes the design tradeoffs it does" is enormous.

**Key challenge:** Failure modes thinking. Most software development training focuses on the happy path: how systems work when everything goes right. Distributed systems is fundamentally about what happens when things go wrong. Students must develop intuition for network partitions, partial failures, race conditions, and cascade failures. This requires a different way of thinking that doesn't come naturally.

---

## Dependency Graph

```
                    ┌──────────────────┐
                    │     Discrete     │
                    │   Mathematics    │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐     ┌──────────────────┐
                    │  Data Structures │     │  C Programming   │
                    │  & Algorithms    │     │                  │
                    └────────┬─────────┘     └────────┬─────────┘
                             │                        │
                             │               ┌────────▼─────────┐
                             │               │    Computer      │
                             │               │  Architecture    │
                             │               └────────┬─────────┘
                             │                        │
                    ┌────────▼────────────────────────▼─────────┐
                    │            Operating Systems               │
                    └────────┬──────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼────────┐    │    ┌─────────▼────────┐
     │    Computer      │    │    │    Databases      │
     │   Networking     │    │    │                   │
     └────────┬─────────┘    │    └─────────┬────────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
                    ┌────────▼─────────┐
                    │   Distributed    │
                    │    Systems       │
                    └──────────────────┘
```

**Hard prerequisites (must complete before starting):**
- Data Structures & Algorithms requires discrete math foundations (induction for proofs, combinatorics for analysis)
- Operating Systems requires C programming (you're writing kernel code) and architecture (you need to understand hardware)
- Distributed Systems requires networking, OS (concurrency), and databases (replication/consistency are database concepts)

**Soft prerequisites (helpful but not blocking):**
- Computer Architecture benefits from C (seeing how C maps to assembly) but can be studied independently
- Databases benefit from DSA (B-trees, hash tables) but the practical SQL portion is independent
- Networking benefits from OS knowledge (sockets are an OS abstraction) but the protocol theory is independent

---

## Recommended Orderings

### Path 1: Bottom-Up (The Nand2Tetris Path)

```
Discrete Math → C → Architecture → OS → Networking → DSA → Databases → Distributed Systems
```

**Philosophy:** Build understanding from the ground up. Start with the math that underlies everything, learn the lowest-level programming language, understand the hardware, then layer on OS, networking, and applications.

**Pros:** Deep understanding. Every layer builds on the previous. No "magic" -- you understand everything below you.

**Cons:** Delayed gratification. It takes months before you encounter anything that directly relates to your daily work. High dropout risk because the connection to practical programming isn't obvious in the first 3-4 subjects.

**Best for:** Developers with patience and intellectual curiosity. Those who are frustrated by not understanding "how it really works." People who won't drop out during the abstract early stages.

### Path 2: Top-Down (The Practical-First Path)

```
Networking → Databases → OS → DSA → C → Architecture → Distributed Systems → Discrete Math
```

**Philosophy:** Start with the subjects closest to what you already use daily. You already make HTTP requests -- now understand what's happening underneath. You already use databases -- now understand how they work internally. Build downward toward fundamentals.

**Pros:** Immediate relevance. Every subject connects to tools and concepts you already use. High motivation because you're constantly connecting theory to practice.

**Cons:** Shallower initial understanding. You'll encounter concepts (like Big-O in DSA) that assume math you haven't studied yet. Requires more backtracking and revisiting.

**Best for:** Developers who need to stay motivated by practical relevance. Those who already have some CS knowledge and are filling gaps rather than building from scratch.

### Path 3: Hybrid (The Two-Track Path)

```
Track A (theory):     Discrete Math ─────→ DSA ──────────→ Distributed Systems
Track B (systems):    C → Architecture → OS → Networking → Databases
```

Run both tracks in parallel, spending roughly half your time on each. The tracks converge at Distributed Systems, which requires both theory (consistency models, impossibility results) and systems (networking, OS, databases).

**Philosophy:** Alternate between theoretical and practical to maintain both rigor and motivation. When you're tired of proofs, write C code. When you're tired of debugging segfaults, study graph theory.

**Pros:** Balanced progression. Sustained motivation through variety. Natural convergence point at distributed systems.

**Cons:** Requires discipline to maintain two tracks. Some subjects are studied before their prerequisites in the other track are complete (e.g., you might encounter references to Big-O in OS before you've covered it formally in DSA).

**Best for:** Self-disciplined learners who can handle non-linear progression. The recommended path for most working developers because it balances depth with motivation.

---

## Comparison with Existing Curricula

### Teach Yourself CS (teachyourselfcs.com)

**Subjects covered:** 9 (adds compilers and 'math for CS')
**Recommended order:** Roughly bottom-up but allows flexibility
**Estimated time:** 100-200 hours per subject, 900-1800 hours total
**Format:** Links to best textbook + best video lecture per subject
**Strengths:** Opinionated, well-curated, respects learner's time
**Weaknesses:** No exercises, no progress tracking, no community, purely passive after the initial read. Textbook recommendations (SICP, CSAPP) are excellent but intimidating for self-study.

### OSSU (Open Source Society University)

**Subjects covered:** 20+ courses covering a full CS degree
**Recommended order:** Strict course progression mimicking a 4-year degree
**Estimated time:** 2-3 years part-time
**Format:** Links to MOOCs (Coursera, edX, MIT OCW)
**Strengths:** Comprehensive, free, community Discord
**Weaknesses:** Too broad (includes electives that aren't fundamental), MOOC links break frequently, no quality control on linked courses, overwhelming scope.

### CMU CS Curriculum

**Subjects covered:** The 8 core + many electives
**Notable courses:** 15-213 (CSAPP), 15-410 (OS), 15-440 (Distributed Systems)
**Strengths:** Lab-heavy approach, particularly CSAPP's bomb/attack/malloc labs. Among the best systems education in the world.
**Weaknesses:** Labs assume full-time student schedule. Course materials are partially restricted. Assignments designed for proctored environments don't translate perfectly to self-study.

### MIT OCW / 6.004 + 6.824

**Subjects covered:** Individual courses, not a unified curriculum
**Notable courses:** 6.004 (Architecture), 6.824 (Distributed Systems), 6.006 (Algorithms)
**Strengths:** 6.824 is the gold standard for distributed systems education. Lecture recordings are world-class.
**Weaknesses:** Individual courses, not a cohesive curriculum. Materials from different years and different formats. No unified learning path.

### Bradfield School of Computer Science

**Subjects covered:** 6 (CS fundamentals subset, no discrete math or DSA)
**Format:** Live online cohort-based courses for working engineers
**Estimated time:** 8 weeks per course, 10-15 hours/week
**Strengths:** Designed specifically for working developers. Excellent pedagogy. Real-time feedback.
**Weaknesses:** Expensive ($1,500-2,000 per course). Cohort scheduling constraints. Not self-paced.

### Key Gaps in Existing Options

| Gap | Impact |
|-----|--------|
| No adaptive difficulty | Students waste time on material they already know or get stuck on material they're not ready for |
| No per-subject format optimization | Discrete math is taught the same way as OS, despite requiring fundamentally different approaches |
| No progress tracking across subjects | Students can't see how subjects connect or track overall progress toward fluency |
| No integration with practical work | Theory and daily development work remain disconnected |
| No spaced repetition | Knowledge decays rapidly without retrieval practice |

These gaps represent the opportunity space for works-on-my.cloud.
