# Phase 2: Sets, Functions, and Relations (Parts 8-12)

## Phase Goal

Understand the formal foundations of data modeling -- sets, functions, relations, and their representations. The reader ends this phase able to reason formally about the structures that underlie databases, type systems, and data processing pipelines.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| Proof Portfolio | 6 proofs | 11 proofs (+ set equality, function properties, relation properties, constructive) |
| Code Companion | 7 programs | 12 programs (`set_operations.py` through `matrix_relations.py`) |
| Rosen Sections | 9/65 | 21/65 (Ch 2 + Ch 9 complete) |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 8 | Sets and Set Operations | Set notation, operations, power sets, Cartesian product | Proof Portfolio +1 (set equality via mutual subset); `set_operations.py` | 3,000-3,500 |
| 9 | Functions: The Most Important Concept in Programming | Injection, surjection, bijection, function composition, sequences | Proof Portfolio +2 (composition associativity, injective iff left inverse); `function_properties.py` | 3,500-4,000 |
| 10 | Relations and Their Properties | Relations as sets of ordered pairs, reflexive/symmetric/transitive, n-ary relations | Proof Portfolio +1 (equivalence relation properties); `relation_checker.py` | 3,000-3,500 |
| 11 | Equivalence Relations, Partial Orders, and Closures | Equivalence classes, partial orders, topological sort, Hasse diagrams | Proof Portfolio +1 (every equivalence relation partitions the set); `topological_sort.py` | 3,500-4,000 |
| 12 | Matrices for Relations and Computation | Adjacency matrices, Boolean matrix multiplication, transitive closure | `matrix_relations.py` — matrix operations for relations, bridge to graph representations | 2,500-3,000 |

## Dependencies

- **Requires:** Phase 1 (proof techniques -- readers need direct proof and set equality by mutual subset)
- **Unlocks:** Phase 3 (induction uses function properties), Phase 8 (graphs are built on relations and matrix representations)

## Writer Notes

- The big reorder: Relations are pulled forward from Rosen Ch 9 (which places them after counting, number theory, and probability) because relations ARE sets of ordered pairs. Rosen separates them by 7 chapters -- we reunite them.
- Database tie-ins are the primary developer hook. JOIN = relation composition. GROUP BY = equivalence classes. Foreign keys = relation properties. Make these connections explicit in every part.
- Part 12 is computation-focused (no new proofs). It bridges to Phase 8 (graphs) by introducing adjacency matrices and transitive closure via matrix exponentiation.
- Functions (Part 9) should explicitly connect to concepts developers know: hash functions are neither injective nor surjective, `JSON.parse` composed with `JSON.stringify` is not identity, `map`/`filter`/`reduce` as function composition.
- Part 11 is the most abstract part in this phase. Topological sort is the payoff that grounds it -- readers implement a working toposort and see partial orders in action.
