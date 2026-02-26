# Part 7: Logic in Practice: SAT Solvers, Type Systems, and Formal Verification

> Rosen Sections: Supplementary
> Blog file: `apps/web/src/content/blog/discrete-mathematics/07-logic-in-practice.mdx`
> Estimated word count: 2,500-3,500

## Frontmatter

```yaml
---
title: "Logic in Practice: SAT Solvers, Type Systems, and Formal Verification"
description: "Discover how SAT solvers power package managers, type systems prove theorems, and formal verification catches bugs that testing misses."
excerpt: "npm install runs a SAT solver. TypeScript's type system is a theorem prover. TLA+ formally verifies distributed systems. The logic you learned in Parts 1-6 is running inside your tools right now."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "logic"]
series: "Discrete Mathematics for Developers"
seriesPart: 7
featured: false
draft: true
---
```

## Component Imports

```mdx
import Alert from '../../../components/shared/Alert.astro';
import PanelSwitcher from '../../../components/shared/PanelSwitcher.astro';
import Panel from '../../../components/shared/Panel.astro';
import ValidationChecklist from '../../../components/shared/ValidationChecklist.astro';
```

## Opening Hook

- **Scenario:** You run `npm install` and it resolves 847 package dependencies without conflicts. Or it fails with "unable to resolve dependency tree." Behind the scenes, npm translated your dependency constraints into a Boolean satisfiability problem and ran a SAT solver.
- **Reveal:** SAT solving, type checking, and formal verification are all applications of the propositional and predicate logic from Parts 1-6. The math is not academic — it is running inside tools you use daily.
- **Outcome:** By the end, you will understand the SAT problem (Boolean satisfiability), how package managers use it, how type systems relate to theorem proving (Curry-Howard), and how tools like TLA+ and Alloy formally verify system designs.

## Section Outline

### 1. Why This Matters

- Parts 1-6 taught the theory. This post shows where the theory shows up in practice.
- This is a lighter post — no new proofs, no Rosen exercises. The goal is to inspire and connect, not to teach new formal techniques.
- Readers should walk away thinking "I didn't know math was doing this behind my tools."

### 2. The SAT Problem (Boolean Satisfiability)

**DIFCP treatment (Definition, Intuition, Formal, Code — no Practice since supplementary).**

- **Definition:** Given a Boolean formula in propositional logic, is there an assignment of truth values to its variables that makes the formula true? This is the satisfiability (SAT) problem.
- **Formal:** A formula is in Conjunctive Normal Form (CNF) if it is an AND of ORs: (x₁ ∨ ¬x₂ ∨ x₃) ∧ (¬x₁ ∨ x₂) ∧ ... Each parenthesized group is a clause.
- **Why it matters:** SAT was the first problem proven to be NP-complete (Cook-Levin theorem, 1971). Despite being NP-complete, modern SAT solvers handle formulas with millions of variables using clever heuristics.
- **Intuition:** Satisfiability asks "can all these constraints be satisfied simultaneously?" — exactly the question dependency resolution asks.

### 3. The DPLL Algorithm

- **Davis-Putnam-Logemann-Loveland (DPLL):** The foundational algorithm for SAT solving.
- **Steps:**
  1. Unit propagation: if a clause has only one literal, it must be true. Propagate this assignment.
  2. Pure literal elimination: if a variable appears only positively (or only negatively) across all clauses, assign it to satisfy those clauses.
  3. Branching: pick an unassigned variable, try true and false recursively.
  4. Backtracking: if a contradiction is reached, backtrack and try the other branch.
- **Complexity:** Worst case exponential (it IS NP-complete), but heuristics make it practical.
- **Connection to Part 1:** DPLL is essentially building a truth table, but smart — it prunes branches early using unit propagation instead of checking all 2ⁿ rows.

### 4. Package Managers as SAT Solvers

- **apt (Debian/Ubuntu):** Uses SAT/pseudo-boolean solvers for dependency resolution. Given: package A requires B ≥ 2.0, package C requires B < 3.0, package D conflicts with A. Question: can all requested packages be installed simultaneously?
- **npm/yarn/pnpm:** Use constraint satisfaction (similar to SAT) for the dependency tree. The infamous "unable to resolve dependency tree" error means the SAT solver returned UNSATISFIABLE — no valid combination exists.
- **Cargo (Rust):** Explicit SAT-based dependency resolution.
- **How it maps:** Each package version is a Boolean variable (installed or not). Each dependency is a clause. Each conflict is a negation. The solver finds a satisfying assignment (a valid set of versions) or proves none exists.
- Table mapping dependency concepts to SAT concepts: package version ↔ Boolean variable, dependency ↔ implication clause, conflict ↔ negation clause, resolution ↔ satisfying assignment.

### 5. Type Systems as Theorem Provers (Curry-Howard Correspondence)

**Simplified introduction — full treatment would require type theory.**

- **The Curry-Howard correspondence:** Types are propositions. Programs are proofs. Type checking is theorem proving. This is not a metaphor — it is a formal mathematical equivalence.
- **Simplified mapping:**
  - A function type `A → B` corresponds to the implication "if A then B."
  - A product type `(A, B)` corresponds to conjunction A ∧ B.
  - A sum type `A | B` corresponds to disjunction A ∨ B.
  - A program of type `A → B` is a proof that A implies B.
  - Type checking verifies the proof.
- **TypeScript example:** When TypeScript checks that `function f(x: string): number` is well-typed, it is verifying a proof that "given a string, this function produces a number."
- **Limits:** TypeScript's type system is not powerful enough to express all propositions. Languages like Agda, Idris, and Coq have type systems that ARE full theorem provers.
- **Practical takeaway:** The more expressive your type system, the more theorems (correctness properties) you can prove at compile time. This is why Rust catches bugs that JavaScript cannot.

### 6. TLA+ and Alloy: Formal Verification for Systems

- **TLA+ (Temporal Logic of Actions):** Leslie Lamport's specification language for distributed systems. Used at Amazon (AWS), Microsoft, and others to find bugs in system designs before writing code.
- **What it does:** You write a formal specification of your system's behavior (states, transitions, invariants). TLA+ model-checks all reachable states and verifies invariants hold universally. This is exhaustive testing of the DESIGN, not the code.
- **Alloy:** A lighter-weight formal modeling tool. Uses SAT solving internally to find counterexamples to assertions.
- **Developer connection:** Code review catches implementation bugs. Formal verification catches design bugs. A correct implementation of a flawed design is still flawed.
- **Example:** Amazon used TLA+ to find a subtle bug in the DynamoDB replication protocol that was not caught by extensive testing. The bug only manifested under a specific sequence of failures that was astronomically unlikely but mathematically possible.

### 7. Where Informal Logic Breaks at Scale

- Simple systems can be reasoned about informally. Complex systems (distributed databases, consensus protocols, concurrent data structures) have state spaces too large for human intuition.
- "It works on my machine" + "it passed all tests" ≠ "it is correct." The gap is the difference between testing (finite cases) and proof (all cases), which we established in Part 4.
- Formal methods close this gap for critical systems. Most developers will never write TLA+ specs, but understanding WHY these tools exist (and what they do) informs better system design.

### 8. Code Companion: sat_solver.py

- **What it does:** A simple DPLL SAT solver that takes a formula in CNF and determines satisfiability. Demonstrates unit propagation and backtracking. Includes a dependency resolution example.
- **Key functions:** `solve(clauses)`, `dpll(clauses, assignment)`, `unit_propagate(clauses, assignment)`, `pure_literal_eliminate(clauses, assignment)`, `dependency_to_cnf(dependencies)`.
- **Expected output:** Solves sample CNF formulas. Translates a simplified package dependency graph into CNF and resolves it. Shows a case where dependencies conflict (UNSATISFIABLE) and a case where they resolve (SAT + satisfying assignment).

### 9. The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "SAT solvers just try all combinations" — ignores the heuristics (unit propagation, CDCL) that make modern solvers handle millions of variables |
| :white_check_mark: **Right** | SAT solving is NP-complete but practically tractable for many real-world instances. Package managers, type checkers, and formal verification tools all use propositional/predicate logic internally. Curry-Howard connects types to propositions and programs to proofs. |
| :x: **Too Formal** | CDCL (Conflict-Driven Clause Learning) solver internals, SMT (Satisfiability Modulo Theories) solvers, dependent type theory |
| :warning: **Common Mistake** | Thinking formal verification replaces testing. It does not. TLA+ verifies the DESIGN (model). You still need tests for the IMPLEMENTATION. They catch different classes of bugs. |

## Thread Progression

- **Proof Portfolio:** No new proofs (applications part). Cumulative: 6 proofs.
- **Code Companion:** `sat_solver.py` — simple DPLL SAT solver with dependency resolution example.
- **Rosen Exercises:** None (supplementary part, not mapped to specific Rosen sections).

## Further Resources

- **MIT 6.042J (Propositional Logic recap)** — Reviews the theoretical foundations that SAT solving builds on.
- **"SAT Solvers: A Brief History" by Malik and Zhang** — Accessible overview of SAT solver evolution from DPLL to modern CDCL.
- **Hillel Wayne: "Practical TLA+"** — The most accessible introduction to TLA+ for working developers.
- **Lamport's TLA+ Video Course** — Free video course by the creator of TLA+.

## Key Takeaways

1. The SAT problem (Boolean satisfiability) is the computational heart of dependency resolution: every time `npm install` resolves your dependency tree, it is solving a propositional logic problem.
2. The Curry-Howard correspondence says types are propositions and programs are proofs, which means TypeScript's type checker is literally a (limited) theorem prover running on every compile.
3. Formal verification tools like TLA+ catch design bugs that testing cannot reach by exhaustively checking all reachable states, and they are built on the same predicate logic foundations from Parts 1-3.

## Writer Notes

- This is the lightest post in Phase 1. Keep it practical and inspiring. The reader should feel "I didn't know math was doing this behind my tools."
- Do NOT attempt to teach SAT solving in depth. The DPLL walkthrough should be just enough for the reader to understand the sat_solver.py code companion. The goal is appreciation, not mastery.
- The Curry-Howard section is intentionally simplified. Do NOT go into dependent types, the lambda calculus, or proof assistants beyond a brief mention. Plant the seed; interested readers can explore further.
- The TLA+ section should feature the Amazon/DynamoDB anecdote. This is the "wow" moment: a real company found a real bug in a real system using formal methods.
- Forward-reference Phase 2: "Phase 1 is complete. You now have the language of logic, the toolkit of proofs, and a sense of where these ideas show up in real systems. Phase 2 builds on this foundation: sets, functions, and relations — the formal structures behind data modeling, type systems, and databases. Part 8 starts with sets: the most fundamental mathematical object and the one your programming language already gives you."
