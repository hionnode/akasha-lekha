# Phase 3: Induction, Recursion, and Recursive Thinking (Parts 13-16)

## Phase Goal

Formalize recursive thinking and prove correctness of recursive algorithms. The reader ends this phase able to write induction proofs (weak, strong, and structural), define recursive structures formally, and solve recurrence relations to derive algorithm complexity.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| Proof Portfolio | 11 proofs | 18 proofs (+ weak induction, strong induction, structural induction, recurrence solution) |
| Code Companion | 12 programs | 16 programs (`induction_demo.py` through `recurrence_solver.py`) |
| Rosen Sections | 21/65 | 28/65 (Ch 5 complete + Ch 8 sections 8.1-8.2) |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 13 | Mathematical Induction: Recursion's Formal Twin | Weak induction: sum of first n integers, correctness of recursive factorial | Proof Portfolio +2; `induction_demo.py` — recursive vs iterative with induction verification | 4,000-4,500 |
| 14 | Strong Induction and Well-Ordering | Binary search correctness, fundamental theorem of arithmetic, infinite descent | Proof Portfolio +2; `binary_search_proof.py` — binary search with correctness checking | 4,000-5,000 |
| 15 | Recursive Definitions and Structural Induction | Recursive data structures (ASTs, trees, JSON), well-formed formula definitions | Proof Portfolio +2 (tree height bound, WFF structure); `recursive_structures.py` — AST evaluation | 3,500-4,000 |
| 16 | Solving Recurrence Relations and Program Analysis | Master theorem, linear recurrences, merge sort O(n log n) derivation | Proof Portfolio +1 (merge sort via recurrence); `recurrence_solver.py` — recurrence relation solver | 3,500-4,500 |

## Dependencies

- **Requires:** Phase 1 (proof techniques -- induction extends the proof toolkit), Phase 2 (function properties -- need formal functions to prove things about)
- **Unlocks:** Phase 4 (algorithm complexity proofs use induction on input size), Phase 5 (binomial theorem proof uses induction), Phase 6 (number theory proofs)

## Writer Notes

- This is the "aha moment" phase. Developers already think recursively -- they write recursive functions daily. Induction is "formalizing what you already do." Lean into this connection hard.
- The base case / inductive step structure maps directly to recursive function base case / recursive call. Make this explicit in Part 13: "if you can write a recursive function, you can write an induction proof -- they're the same mental motion."
- Recurrences (Part 16) are pulled from Rosen Ch 8 ("Advanced Counting") because they are solved by induction. Placing them here preserves the pedagogical connection. Rosen's placement in Chapter 8 obscures the fact that recurrences and induction are the same topic.
- Part 14 (strong induction) is the hardest part in this phase. Binary search correctness is the key example -- the sub-problem could be any size at most n/2, not just n-1, so weak induction is insufficient.
- Part 16 bridges directly to Phase 4: once readers can solve recurrences, they can derive (not memorize) that merge sort is O(n log n). This sets up the formal Big-O treatment in Part 18.
- Four parts for induction may seem like a lot, but this is the technique used most often in the rest of the series. Phases 4-9 all reference induction repeatedly.
