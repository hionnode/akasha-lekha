# CS Fundamentals: The Problem and Scope

> Research deliverable for works-on-my.cloud. These files synthesize findings on
> CS education gaps, subject analysis, pedagogy, and platform options. The goal
> is to make informed decisions about what to build next.

---

## The Problem

Most working programmers have weak CS fundamentals. This isn't a moral failing -- it's a structural one. The paths into software development produce predictable gaps:

**Bootcamp graduates** learn to ship features in React or Rails but have no mental model for what happens below the framework. They can use a hash map but can't explain why it's O(1). They can deploy to AWS but don't understand TCP. When something breaks at the systems level, they're stuck.

**Self-taught programmers** typically learn by building projects. This produces strong practical skills in their chosen domain but leaves systematic gaps -- discrete math, computer architecture, and operating systems are rarely self-taught because they don't appear on the critical path to shipping a web app.

**CS graduates from outdated programs** may have covered the theory but with curricula that haven't been meaningfully updated since the 2000s. Many programs still teach operating systems without containers, networking without cloud, and databases without distributed systems. The theory is there but the connection to modern practice is missing.

**CS graduates who didn't retain** studied the material once, passed the exam, and forgot it. Without deliberate practice and spaced repetition, theoretical knowledge decays rapidly. A 2019 study by Karpicke & Blunt found that students retain only 20-30% of lecture-based material after one week without retrieval practice.

## The Evidence

**JetBrains Developer Ecosystem Survey (2024):** 55.9% of developers report struggling with abstract CS concepts. This was the most-cited difficulty across all experience levels, ahead of "keeping up with new technologies" (48.2%) and "debugging complex systems" (42.1%).

**Bradfield School of Computer Science observations:** Founded specifically to address this gap for working developers. Their enrollment data shows the most-requested subjects are: operating systems, computer networking, and computer architecture -- the subjects most absent from bootcamp curricula and most poorly taught in traditional programs.

**ACM CS2023 Curriculum Guidelines:** The latest revision acknowledges that the gap between academic CS education and industry needs has widened, not narrowed. The report specifically calls out the need for "systems thinking" and "cross-layer understanding" that current curricula fail to develop.

**Stack Overflow Developer Survey (2023-2024):** 38% of professional developers are self-taught or bootcamp-trained with no formal CS education. Among those with CS degrees, 45% report that their education did not adequately prepare them for systems-level work.

**Hiring signal:** Companies like Google, Meta, and Stripe have shifted interviews toward systems design and fundamentals, not because they're elitist but because they've found that developers with strong fundamentals ramp up faster, debug more effectively, and make better architectural decisions.

## The Audience

Primary audience: **working developers with 1-5 years of experience** who:

- Can build and ship software in at least one language/framework
- Have encountered the limits of their knowledge (performance issues they can't diagnose, distributed systems they can't reason about, algorithms they can't analyze)
- Are motivated to fill gaps but don't have time for a full CS degree
- Want practical understanding, not academic credentials
- Learn best by doing, not just reading

Secondary audience:

- **Senior developers** filling specific gaps (e.g., a backend engineer who never properly learned networking theory)
- **Career changers** from adjacent technical fields who have domain expertise but lack CS foundations
- **CS students** who want a more practical, modern treatment of subjects their program covers poorly

This is NOT for:

- Complete beginners who haven't written code yet (they need a different starting point)
- Researchers pursuing academic depth in a single subject
- Interview preppers looking for LeetCode shortcuts

## What "CS Fundamentals" Means

There is remarkable consensus across top CS programs (MIT, Stanford, CMU, Berkeley) and self-study curricula (Teach Yourself CS, OSSU, Bradfield) about 8 core subjects that form the foundation of computer science:

1. **Discrete Mathematics** -- Logic, sets, combinatorics, graph theory, probability
2. **C Programming / Low-Level Programming** -- Memory management, pointers, systems programming
3. **Computer Architecture** -- Gates, processors, memory hierarchy, instruction sets
4. **Data Structures & Algorithms** -- The classic CS subject, but taught for understanding, not interviews
5. **Operating Systems** -- Processes, memory, filesystems, concurrency
6. **Computer Networking** -- Protocol stacks, TCP/IP, DNS, HTTP, sockets
7. **Databases** -- Relational model, query optimization, transactions, storage engines
8. **Distributed Systems** -- Consensus, replication, consistency models, failure modes

These 8 subjects appear in every serious CS curriculum worldwide. They represent the knowledge that separates a developer who can use tools from a developer who understands tools.

Some curricula include additional subjects (compilers, programming languages theory, software engineering, security). These are valuable but not foundational in the same way -- they build on the 8 core subjects rather than forming the base layer.

## How These Files Relate

```
00-overview.md (this file)
│   Problem, audience, scope
│
├── 01-subject-analysis.md
│   What are the 8 subjects? How do they relate?
│   Dependencies, ordering, time estimates
│
├── 02-pedagogy-by-subject.md
│   For each subject: what works, what fails, best resources
│   The core research on HOW to teach each subject
│
├── 03-platform-formats.md
│   How to deliver: blog, exercises, interactive, curated
│   Format-to-subject mapping
│
├── 04-retention-and-progress.md
│   Making knowledge stick: spaced repetition, mastery gates
│   Progress tracking, motivation
│
└── 05-options.md
    4 concrete options for what to build
    Tradeoffs, effort, infrastructure needs
```

Read in order if you want the full picture. Jump to `05-options.md` if you want to start with the decision.

## Relationship to the AWS Series

The existing 70-part AWS series covers cloud infrastructure -- a practical domain that benefits enormously from strong CS fundamentals. The relationship is complementary:

- **AWS series** = top-down, practical, cloud-native skills
- **CS fundamentals** = bottom-up, foundational, transferable knowledge

A developer who understands operating systems will grasp EC2 more deeply. A developer who understands networking will reason about VPCs correctly. A developer who understands distributed systems will make better choices about DynamoDB consistency modes.

The CS fundamentals content would not compete with the AWS series -- it would make it more valuable. The AWS series teaches you WHAT to use. CS fundamentals teach you WHY it works.

This could also create a powerful learning loop: encounter a concept in the AWS series (e.g., "eventual consistency in DynamoDB"), realize you don't understand the underlying theory, follow a link to the distributed systems track for the foundational explanation, then return to the AWS content with deeper understanding.
