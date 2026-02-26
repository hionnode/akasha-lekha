# Phase 9: Boolean Algebra and Modeling Computation -- Bridge (Parts 36-39)

## Phase Goal

Bridge to the Computer Architecture and Theory of Computation tracks. The reader ends this phase with a working understanding of Boolean circuits (how CPUs compute), finite automata (how regex works), and Turing machines (what computation can and cannot do) -- with forward references to the dedicated tracks that go deeper.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| Proof Portfolio | 32 proofs | ~35 proofs (+ Boolean algebra identities, pumping lemma application, halting problem undecidability) |
| Code Companion | 35 programs | 39 programs (`boolean_algebra.py` through `turing_machine.py`) |
| Rosen Sections | 64/65 | 65/65 (Ch 12 + Ch 13 complete -- 100% Rosen coverage) |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 36 | Boolean Algebra: From Logic Gates to Circuits | Boolean functions, representations (DNF/CNF), Karnaugh maps, bitwise operations in code | Proof Portfolio +1 (Boolean algebra identities from axioms); `boolean_algebra.py` — truth table to DNF, Karnaugh map simplification | 2,500-3,000 |
| 37 | Boolean Circuits and Digital Logic | Half adder, full adder, ripple-carry adder, circuit complexity | `circuits.py` — half/full adder simulator, ripple-carry adder | 2,000-2,500 |
| 38 | Finite Automata and Regular Languages | DFA, NFA, NFA-to-DFA conversion, regular expressions, pumping lemma | Proof Portfolio +1 (pumping lemma: a^n b^n is not regular); `automata.py` — NFA-to-DFA converter, regex engine | 3,000-3,500 |
| 39 | Turing Machines and the Limits of Computation | Turing machines, halting problem, Rice's theorem, Church-Turing thesis, undecidability | Proof Portfolio +1 (halting problem by diagonalization); `turing_machine.py` — Turing machine simulator | 2,500-3,000 |

## Dependencies

- **Requires:** Phase 1 (logic -- Boolean algebra extends propositional logic), Phase 8 (graph concepts -- automata state diagrams are directed graphs)
- **Unlocks:** Computer Architecture track (Boolean algebra and circuits from Parts 36-37), Theory of Computation track (automata and Turing machines from Parts 38-39)

## Writer Notes

- This is a bridge phase. The goal is complete Rosen coverage at survey depth, with explicit forward references to the dedicated tracks that provide full treatment. Do not try to compress a full Theory of Computation course into 2 parts.
- Parts 36-37 bridge to Computer Architecture. The key insight: Boolean algebra connects the logic from Part 1 to how CPUs actually compute. "You learned logic gates as an abstraction in Part 1. Here's how they're wired into silicon."
- Parts 38-39 bridge to Theory of Computation. The developer hooks are strong: regex internals (NFA-to-DFA conversion, why `.*` can be slow), "you can't parse HTML with regex" (pumping lemma), the halting problem ("you can't write a perfect linter"), Rice's theorem ("you can't decide any non-trivial property of programs").
- Part 39 (Turing machines) is the philosophical capstone. The halting problem proof is the most famous proof by contradiction in computer science -- and readers have the tools from Phase 1 to follow it rigorously.
- Word counts are lower than other phases (2,000-3,500 per part). This is intentional: bridge depth, not full treatment. Readers should feel satisfied with the coverage but excited to go deeper in the dedicated tracks.
- The series achieves 100% Rosen section coverage (65/65) by the end of Part 39. Call this out explicitly in the final part: "you've now covered every section in a standard discrete mathematics textbook."
- Final proof count of approximately 35 and program count of exactly 39 (one per part) should be celebrated as a concrete accomplishment in the series conclusion within Part 39.
