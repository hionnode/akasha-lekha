# Part 16: Recurrence Relations: Why Merge Sort is O(n log n)

> Rosen Sections: 5.5, 8.1-8.2
> Blog file: `apps/web/src/content/blog/discrete-mathematics/16-recurrence-relations.mdx`
> Estimated word count: 3,500-4,500

## Frontmatter

```yaml
---
title: "Recurrence Relations: Why Merge Sort is O(n log n)"
description: "Learn recurrence relations, the characteristic equation method, and the Master theorem — derive merge sort's O(n log n) complexity instead of memorizing it."
excerpt: "T(n) = 2T(n/2) + O(n) — every developer memorizes merge sort's complexity. This post teaches you to derive it by solving the recurrence relation."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "recursion"]
series: "Discrete Mathematics for Developers"
seriesPart: 16
featured: false
draft: true
---
```

## Component Imports

```mdx
import Alert from '../../../components/shared/Alert.astro';
import PanelSwitcher from '../../../components/shared/PanelSwitcher.astro';
import Panel from '../../../components/shared/Panel.astro';
import ComparisonTable from '../../../components/shared/ComparisonTable.astro';
import ComparisonHeader from '../../../components/shared/ComparisonHeader.astro';
import ComparisonRow from '../../../components/shared/ComparisonRow.astro';
import ValidationChecklist from '../../../components/shared/ValidationChecklist.astro';
```

## Opening Hook

- **Scenario:** You know merge sort is O(n log n). You know quicksort's average case is O(n log n). You know the Fibonacci sequence grows exponentially. But if someone asked you to PROVE any of these, could you? The answer is the same for all three: solve a recurrence relation.
- **Reveal:** T(n) = 2T(n/2) + n is the recurrence for merge sort. F(n) = F(n-1) + F(n-2) is the Fibonacci recurrence. Both are equations that define a value in terms of smaller values. Solving them — finding the closed-form — is how you derive complexity bounds instead of memorizing them.
- **Outcome:** By the end, you will know how to write recurrence relations for algorithms, solve linear homogeneous recurrences using the characteristic equation, apply the Master theorem for divide-and-conquer recurrences, and prove that merge sort is O(n log n).

## Section Outline

### 1. Why This Matters

- Every recursive algorithm defines a recurrence relation for its running time. Solving the recurrence gives the Big-O complexity.
- Memorizing "merge sort is O(n log n)" is fragile. Deriving it from T(n) = 2T(n/2) + n is durable — and lets you analyze any divide-and-conquer algorithm, not just the ones you have memorized.
- Recurrence relations also appear in dynamic programming (Fibonacci, edit distance, knapsack), population modeling, and financial mathematics. This part focuses on the algorithm analysis application.

### 2. Program Correctness and Loop Invariants (Rosen 5.5)

**Brief section — connecting to proof techniques before moving to recurrences.**

- **Loop invariant:** A property that holds before and after each iteration of a loop. Proving a loop invariant by induction (base case = before first iteration, inductive step = iteration preserves invariant) proves the loop correct.
- **Example:** Insertion sort invariant: "after iteration i, the first i elements are sorted."
  - Initialization: before the first iteration, the first 1 element is trivially sorted.
  - Maintenance: if the first k elements are sorted, inserting element k+1 in the correct position gives k+1 sorted elements.
  - Termination: after n iterations, all n elements are sorted.
- **Connection:** Loop invariants are induction proofs in disguise. The base case is initialization. The inductive step is maintenance. Termination is the conclusion.
- **Code:** Annotated insertion sort with invariant comments.

### 3. Recurrence Relations from Algorithms (Rosen 8.1)

**DIFCP treatment.**

- **Definition:** A recurrence relation is an equation that defines a sequence recursively: a value is defined in terms of previous values. aₙ = f(aₙ₋₁, aₙ₋₂, ...) with initial conditions.
- **From algorithms:** The running time T(n) of a recursive algorithm satisfies a recurrence based on the algorithm's recursive structure.
- **Examples:**
  - **Binary search:** T(n) = T(n/2) + c. Each call does constant work and recurses on half the input.
  - **Merge sort:** T(n) = 2T(n/2) + cn. Two recursive calls on half the input, plus cn work to merge.
  - **Linear recursion:** T(n) = T(n-1) + c. Each call does constant work and recurses on input of size n-1. (Like linear search, or traversing a linked list.)
  - **Tower of Hanoi:** T(n) = 2T(n-1) + 1. Move n-1 disks, move the large disk, move n-1 disks again.
- Table mapping common algorithms to their recurrence relations.

### 4. The Fibonacci Recurrence

- **Definition:** F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2).
- **Closed form (Binet's formula):** F(n) = (φⁿ - ψⁿ) / √5 where φ = (1 + √5)/2 ≈ 1.618 (golden ratio) and ψ = (1 - √5)/2 ≈ -0.618.
- **Growth rate:** F(n) ∈ Θ(φⁿ). Fibonacci grows exponentially. This is why naive recursive Fibonacci is exponential: T(n) = T(n-1) + T(n-2) + c has the same recurrence as Fibonacci itself.
- **Developer connection:** Dynamic programming replaces the exponential recursive tree with O(n) computation by memoizing. The recurrence does not change; the computation method does.

### 5. Tower of Hanoi

- **Recurrence:** T(n) = 2T(n-1) + 1, T(1) = 1.
- **Solution by unrolling:** T(n) = 2T(n-1) + 1 = 2(2T(n-2) + 1) + 1 = 4T(n-2) + 3 = ... = 2ⁿ - 1.
- **Proof by induction:** Verify T(n) = 2ⁿ - 1 satisfies the recurrence. Base: T(1) = 2¹ - 1 = 1. ✓ Inductive step: T(k+1) = 2T(k) + 1 = 2(2ᵏ - 1) + 1 = 2ᵏ⁺¹ - 1. ✓
- This is the standard example of "guess and verify" (also called "substitution method").

### 6. Linear Homogeneous Recurrences (Rosen 8.2)

**DIFCP treatment — the general solution method.**

- **Definition:** A linear homogeneous recurrence with constant coefficients has the form: aₙ = c₁aₙ₋₁ + c₂aₙ₋₂ + ... + cₖaₙ₋ₖ.
- **Characteristic equation method:**
  1. Write the recurrence: aₙ - c₁aₙ₋₁ - c₂aₙ₋₂ = 0.
  2. Substitute aₙ = rⁿ: rⁿ - c₁rⁿ⁻¹ - c₂rⁿ⁻² = 0.
  3. Divide by rⁿ⁻²: r² - c₁r - c₂ = 0 (the characteristic equation).
  4. Solve for roots r₁, r₂.
  5. General solution: aₙ = A·r₁ⁿ + B·r₂ⁿ (for distinct roots). Solve for A, B using initial conditions.
  6. For repeated roots: aₙ = (A + Bn)·rⁿ.
- **Worked example:** Solve F(n) = F(n-1) + F(n-2). Characteristic equation: r² - r - 1 = 0. Roots: r = (1 ± √5)/2. Solution: F(n) = A·φⁿ + B·ψⁿ. Use F(0) = 0, F(1) = 1 to find A = 1/√5, B = -1/√5. Result: Binet's formula.
- **Second worked example:** Solve aₙ = 6aₙ₋₁ - 9aₙ₋₂ with a₀ = 1, a₁ = 6. Characteristic equation: r² - 6r + 9 = 0 → (r - 3)² = 0. Repeated root r = 3. Solution: aₙ = (A + Bn)·3ⁿ. Use initial conditions: A = 1, B = 1. Solution: aₙ = (1 + n)·3ⁿ.

### 7. Solving T(n) = 2T(n/2) + n (Merge Sort)

**Proof: Merge Sort is O(n log n) (Proof Portfolio)**

- **Recurrence:** T(n) = 2T(n/2) + n, T(1) = 1.
- **Solution by recursion tree (unrolling):**
  - Level 0: n work (one problem of size n).
  - Level 1: 2 · (n/2) = n work (two problems of size n/2).
  - Level 2: 4 · (n/4) = n work (four problems of size n/4).
  - Level k: 2ᵏ · (n/2ᵏ) = n work.
  - Number of levels: log₂(n) (until sub-problems reach size 1).
  - Total work: n · log₂(n) = n log n.
- **Proof by induction:** Guess T(n) = n log₂(n). Verify: T(n) = 2T(n/2) + n = 2 · (n/2) · log₂(n/2) + n = n · (log₂(n) - 1) + n = n log₂(n) - n + n = n log₂(n). ✓
- **Annotation:** The recursion tree gives the guess. Induction verifies it. This is the standard method: use the tree to build intuition, then prove by substitution/induction.

### 8. The Master Theorem (Overview)

**Practical tool for divide-and-conquer recurrences.**

- **Statement:** For T(n) = aT(n/b) + f(n) where a ≥ 1, b > 1:
  - **Case 1:** If f(n) = O(n^{log_b(a) - ε}) for some ε > 0, then T(n) = Θ(n^{log_b(a)}).
  - **Case 2:** If f(n) = Θ(n^{log_b(a)}), then T(n) = Θ(n^{log_b(a)} · log n).
  - **Case 3:** If f(n) = Ω(n^{log_b(a) + ε}) for some ε > 0, then T(n) = Θ(f(n)).
- **Intuition:** Compare f(n) (work at each level) with n^{log_b(a)} (number of sub-problems). If sub-problems dominate: Case 1. If they are equal: Case 2. If f(n) dominates: Case 3.
- **Applications:**
  - Binary search: T(n) = T(n/2) + 1. a=1, b=2, f(n)=1, n^{log_2(1)}=1. Case 2: T(n) = Θ(log n). ✓
  - Merge sort: T(n) = 2T(n/2) + n. a=2, b=2, f(n)=n, n^{log_2(2)}=n. Case 2: T(n) = Θ(n log n). ✓
  - Strassen's multiplication: T(n) = 7T(n/2) + Θ(n²). a=7, b=2, n^{log_2(7)} ≈ n^{2.81}. Case 1: T(n) = Θ(n^{2.81}).
- Table of common recurrences with Master theorem solutions.

### 9. Connection to Dynamic Programming

- A recurrence relation defines the RELATIONSHIP between sub-problems. How you compute it determines the algorithm.
- **Top-down (memoization):** Recursive with caching. Computes only needed sub-problems.
- **Bottom-up (tabulation):** Iterative, filling a table from base cases up. Computes all sub-problems.
- **Example:** Fibonacci. Recurrence: F(n) = F(n-1) + F(n-2). Naive recursion: O(2ⁿ). Memoized: O(n). Bottom-up: O(n) with O(1) space.
- The recurrence does not change. The computation strategy does. Understanding recurrences is the prerequisite for dynamic programming.

### 10. Code Companion: recurrence_solver.py

- **What it does:** Solves linear recurrences via the characteristic equation method, applies the Master theorem to divide-and-conquer recurrences, and visualizes the recursion tree for merge sort.
- **Key functions:** `solve_linear_recurrence(coefficients, initial_values)`, `master_theorem(a, b, f_n_order)`, `recursion_tree_work(a, b, f, n)`, `merge_sort_analysis(n)`.
- **Expected output:** Solves Fibonacci recurrence (outputs Binet's formula coefficients and verifies numerically). Applies Master theorem to binary search, merge sort, and Strassen's. Prints the recursion tree for merge sort on n=16, showing n work per level and log₂(n) levels.

### 11. The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "Merge sort is O(n log n) because it divides in half and merges linearly" — correct intuition but not a proof; misses why the recursion tree sums to exactly n log n |
| :white_check_mark: **Right** | Write the recurrence T(n) = 2T(n/2) + n. Build the recursion tree (n work per level, log n levels). Verify by induction: T(n) = n log n. The Master theorem gives O(n log n) directly for Case 2. |
| :x: **Too Formal** | Akra-Bazzi method for non-standard divide-and-conquer recurrences, generating functions for general recurrence solutions (covered briefly in Part 23) |
| :warning: **Common Mistake** | Confusing the recurrence's base case with the algorithm's base case. T(1) = 1 is the recurrence's base case. The algorithm's base case is "return the single element." They correspond, but the recurrence is about TIME, not about the output. |

## Thread Progression

- **Proof Portfolio:** +1 new proof. (18) Merge sort is O(n log n) (recurrence solution + induction verification). Cumulative: 18 proofs.
- **Code Companion:** `recurrence_solver.py` — solves linear recurrences, applies Master theorem, visualizes recursion trees.
- **Rosen Exercises:**
  - **Essential:** 5.5: 1, 3; 8.1: 1, 3, 5, 7; 8.2: 1, 3, 5
  - **Recommended:** 5.5: 5; 8.1: 11, 15; 8.2: 7, 11
  - **Challenge:** 8.2: 15, 23

## Further Resources

- **MIT 6.042J Lecture 12** — Recurrence relations and their solutions. Covers the recursion tree method and the substitution method.
- **CLRS (Cormen et al.), Chapter 4** — The Master theorem: full statement, proof, and many examples. The definitive reference.
- **Book of Proof, Chapter 10** — Section on solving recurrences with induction.
- **Abdul Bari: "Recurrence Relations" (YouTube)** — Clear video walkthrough of the recursion tree and Master theorem.

## Key Takeaways

1. Every recursive algorithm defines a recurrence relation for its running time, and solving that recurrence (not memorizing the answer) is how you derive complexity: T(n) = 2T(n/2) + n gives O(n log n) for merge sort.
2. The characteristic equation method solves linear homogeneous recurrences (like Fibonacci) by finding roots of a polynomial, and the Master theorem handles divide-and-conquer recurrences T(n) = aT(n/b) + f(n) by comparing sub-problem growth to per-level work.
3. Recurrence relations are the bridge between recursion (how the algorithm works) and complexity (how fast it runs), and they are the prerequisite for understanding dynamic programming as an optimization of naive recursion.

## Writer Notes

- The merge sort derivation is the centerpiece. Walk through the recursion tree visually (even in text: show each level, the number of sub-problems, the work per sub-problem, the total per level). Then verify by induction.
- The characteristic equation method needs a clean worked example (Fibonacci). Show every step of the algebra. This is the first time the reader solves a polynomial equation in this series.
- The Master theorem should be presented as a practical lookup tool, not a deep theorem. State the three cases, show examples, provide a table. Do NOT prove the Master theorem (that requires more advanced techniques).
- Loop invariants (Rosen 5.5) are brief but important. They connect induction to iterative code, complementing the recursion-induction connection from Part 13.
- The DP connection (Section 9) is a teaser. Do not go deep. Just establish that recurrences are the mathematical backbone of DP, and the reader is now equipped to understand DP at a formal level.
- This is the last part of Phase 3. Forward-reference Phase 4: "You can now prove algorithms correct (induction) and analyze their complexity (recurrences). Phase 4 formalizes these ideas: Part 17 covers algorithms and pseudocode, Part 18 defines Big-O, Big-Omega, and Big-Theta formally, and Part 19 explores tractable vs intractable problems. You will prove (not memorize) complexity bounds."
