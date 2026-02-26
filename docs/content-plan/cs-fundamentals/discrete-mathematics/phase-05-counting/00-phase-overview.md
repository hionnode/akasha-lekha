# Phase 5: Counting and Combinatorics (Parts 20-23)

## Phase Goal

Reason about combinatorial quantities -- from "how many?" to "why that many?" The reader ends this phase able to apply counting principles (product rule, sum rule, pigeonhole), work with permutations and combinations, use inclusion-exclusion, and understand generating functions as a problem-solving tool.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| Proof Portfolio | 20 proofs | 23 proofs (+ pigeonhole application, binomial theorem by induction, inclusion-exclusion derivation) |
| Code Companion | 19 programs | 23 programs (`counting_tools.py` through `generating_functions.py`) |
| Rosen Sections | 31/65 | 41/65 (Ch 6 complete + Ch 8 sections 8.3-8.6) |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 20 | Basics of Counting: Product Rule, Sum Rule, Pigeonhole | Counting principles, pigeonhole principle, birthday paradox, UUID collision analysis | Proof Portfolio +1 (pigeonhole); `counting_tools.py` — counting principles + birthday paradox Monte Carlo | 3,000-3,500 |
| 21 | Permutations, Combinations, and Binomial Coefficients | Permutations, combinations, binomial theorem, Pascal's triangle, Fisher-Yates | Proof Portfolio +1 (binomial theorem by induction); `combinatorics.py` — permutations, combinations, shuffle verification | 3,500-4,000 |
| 22 | Advanced Counting: Inclusion-Exclusion and Applications | Inclusion-exclusion, derangements, Euler's totient function, generalized permutations | Proof Portfolio +1 (inclusion-exclusion for two sets); `inclusion_exclusion.py` — derangements, Euler's totient | 3,500-4,000 |
| 23 | Generating Functions and Advanced Techniques | Generating functions, Catalan numbers, divide-and-conquer recurrences | `generating_functions.py` — generating function operations, Catalan number generator | 3,000-4,000 |

## Dependencies

- **Requires:** Phase 3 (induction -- binomial theorem proof uses induction, recurrence connection), Phase 4 (complexity context -- counting arises naturally in algorithm analysis)
- **Unlocks:** Phase 6 (number theory -- Euler's totient uses counting), Phase 7 (probability -- built on counting sample spaces)

## Writer Notes

- Part 23 (generating functions) is the most academic part in the entire series. Flag it explicitly as optional for practitioners. Readers who want to get to cryptography or probability can skip it without breaking continuity.
- Catalan numbers in Part 23 are the payoff: they count valid parenthesizations, BST shapes, and triangulations. This explains why certain data structures have the performance characteristics they do.
- The pigeonhole principle (Part 20) is deceptively powerful. Hash collision inevitability is the developer hook -- "if you have more items than buckets, collisions are guaranteed" explains why hash tables need collision handling.
- Part 21 connects to testing: n feature flags means 2^n configurations. This is why exhaustive testing of feature flag combinations is combinatorially infeasible.
- Inclusion-exclusion (Part 22) ties directly to Euler's totient function, which is needed for RSA in Phase 6. Make this forward reference explicit.
- The binomial theorem proof in Part 21 is a back-reference to Phase 3 induction. Call it out: "this is induction in action, months after you learned it."
