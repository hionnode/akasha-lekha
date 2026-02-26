# Phase 4: Algorithms and Complexity (Parts 17-19)

## Phase Goal

Prove (not memorize) complexity bounds using induction and formal definitions. The reader ends this phase able to formally analyze algorithm complexity, understand Big-O/Big-Omega/Big-Theta from their definitions, and reason about tractability (P vs NP).

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| Proof Portfolio | 18 proofs | 20 proofs (+ Big-O from definition, Big-O transitivity) |
| Code Companion | 16 programs | 19 programs (`algorithm_comparison.py` through `complexity_explorer.py`) |
| Rosen Sections | 28/65 | 31/65 (Ch 3 complete) |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 17 | Algorithms and Pseudocode: Precision in Description | Algorithm vs implementation, pseudocode conventions, searching/sorting case studies | `algorithm_comparison.py` — timing comparison of linear vs binary search | 2,500-3,000 |
| 18 | Growth of Functions: Big-O, Big-Omega, Big-Theta | Formal definitions, proving 3n^2 + 5n + 2 is O(n^2), Big-O transitivity | Proof Portfolio +2; `big_o_verifier.py` — Big-O verification via ratio test + growth plots | 4,000-5,000 |
| 19 | Algorithm Complexity: Analysis in Practice | P vs NP, tractable vs intractable, when O(n^2) is fine, NP-completeness | `complexity_explorer.py` — timing experiments for complexity classes | 2,500-3,000 |

## Dependencies

- **Requires:** Phase 3 (induction -- needed to prove Big-O bounds and reason about recursive complexity)
- **Unlocks:** Phase 5 (counting in algorithmic context), general algorithmic reasoning for all subsequent phases

## Writer Notes

- This phase is placed after induction intentionally. Rosen puts algorithms in Ch 3 (immediately after logic), which means students encounter Big-O claims they cannot verify. Our ordering means readers arrive with induction ready and can prove bounds from definitions.
- Part 18 is the proof-heavy part in this phase. The formal epsilon-delta style of Big-O definitions ("there exist constants c and n_0 such that...") is where many students struggle. Give it space.
- Part 17 is lighter -- it establishes vocabulary (algorithm vs implementation, pseudocode conventions). The key insight: the same algorithm can be O(n) in one language and O(n^2) in another (string concatenation in a loop).
- Part 19 is conceptual more than proof-heavy. P vs NP is explained for practical reasoning ("when should you reach for approximation or heuristics?"), not as a deep complexity theory dive. NP-completeness means "don't bother looking for a polynomial algorithm."
- Three parts is the right length. Algorithms are the topic developers think they already know. The goal is to upgrade from "I memorized that merge sort is O(n log n)" to "I can derive and prove it."
