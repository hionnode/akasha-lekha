# Part 17: Algorithms and Pseudocode: Precision in Description

> Rosen Sections: 3.1
> Blog file: `apps/web/src/content/blog/discrete-mathematics/17-algorithms-pseudocode.mdx`
> Estimated word count: 2,500-3,500

## Frontmatter

```yaml
---
title: "Algorithms and Pseudocode: Precision in Description"
description: "Learn the formal definition of algorithms, pseudocode conventions, and why the same algorithm can be O(n) or O(n^2) depending on implementation."
excerpt: "An algorithm is not the same thing as its implementation. The same logic can be fast or slow depending on language, data structures, and hidden costs."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "algorithms"]
series: "Discrete Mathematics for Developers"
seriesPart: 17
featured: false
draft: true
---
```

## Component Imports

```mdx
import Alert from '@components/shared/Alert.astro';
```

## Opening Hook

- **Scenario:** You concatenate strings in a loop. In Python, `s += char` in a loop is O(n^2) because strings are immutable and each concatenation copies the entire string. In Go, the same logical algorithm with a `strings.Builder` is O(n).
- **Reveal:** The algorithm (repeated append) is the same. The complexity is different because "algorithm" and "implementation" are not synonyms. To reason about efficiency, you need a language-independent description -- pseudocode.
- **Outcome:** Readers can describe algorithms precisely using pseudocode, analyze searching and sorting algorithms at the algorithmic (not implementation) level, and distinguish algorithm properties from implementation artifacts.

## Section Outline

### 1. Why This Matters

Developers write code; computer scientists describe algorithms. The difference matters when you need to reason about correctness and efficiency. You cannot optimize what you cannot describe precisely. This part establishes the vocabulary for the rest of Phase 4.

### 2. What Is an Algorithm? (DIFCP)

Formal definition from Rosen: a finite sequence of precise instructions for performing a computation or solving a problem.

**Seven properties of algorithms:**
1. **Input** -- zero or more values taken from a specified set
2. **Output** -- at least one value produced
3. **Definiteness** -- every step is precisely defined (no ambiguity)
4. **Correctness** -- produces the correct output for every valid input
5. **Finiteness** -- terminates after a finite number of steps
6. **Effectiveness** -- every step can be performed exactly and in finite time
7. **Generality** -- applies to all instances of a problem, not just specific cases

Developer angle: most production code violates at least one of these. Event loops violate finiteness (by design). Heuristic search violates correctness (by tradeoff). That is fine -- but you should know which properties you are sacrificing and why.

### 3. Pseudocode Conventions

Establish the pseudocode notation used throughout the rest of the series (matching Rosen's conventions):
- Assignment, comparison, loops (for, while), conditionals
- Procedure declaration and return values
- Array indexing (1-based in pseudocode, contrast with 0-based in code)
- Comments

Key point: pseudocode is not Python, not Java, not English. It is precise enough to prove things about but abstract enough to ignore implementation details.

### 4. Searching Algorithms

**Linear search** -- pseudocode, step-by-step trace, complexity analysis (worst case n comparisons)

**Binary search** -- pseudocode, step-by-step trace on sorted array, complexity claim (log n comparisons). Note: we proved binary search correctness by strong induction in Part 14. Here we focus on the algorithm description, not the proof.

Back-reference to Part 14: "You already proved this works. Now we describe it precisely enough to analyze how fast it works."

### 5. Sorting Algorithms

**Bubble sort** -- pseudocode, trace on small array, why it is O(n^2) (count comparisons)

**Insertion sort** -- pseudocode, trace, why it is O(n^2) worst case but O(n) best case (already sorted)

These are chosen because they are simple enough to fully trace in a blog post. The point is not "learn bubble sort" but "practice reading and tracing pseudocode."

### 6. Algorithm vs Implementation

The string concatenation example from the hook, expanded:
- Same algorithm (append each character) is O(n) with a mutable buffer, O(n^2) with immutable strings
- Same sorting algorithm (insertion sort) has different constants on arrays vs linked lists
- Hidden costs: Python list `.append()` is amortized O(1) but occasionally O(n) when the backing array resizes

This is why we analyze algorithms in pseudocode, not in Python. Pseudocode strips away the language-specific costs so we can reason about the algorithmic complexity.

### 7. Code Companion: Algorithm Timing Comparison

`algorithm_comparison.py` -- times linear search vs binary search on arrays of increasing size. Also times bubble sort vs insertion sort vs Python's built-in `sorted()` (Timsort).

Key functions:
- `linear_search(arr, target)` -- standard linear scan
- `binary_search(arr, target)` -- iterative binary search
- `bubble_sort(arr)` -- standard bubble sort
- `insertion_sort(arr)` -- standard insertion sort
- `measure_time(func, *args)` -- timing wrapper
- Main block generates arrays of size 100, 1000, 10000, 100000 and prints timing comparison table

The output demonstrates: binary search is dramatically faster on large inputs, and Python's Timsort crushes both bubble and insertion sort because it is O(n log n) with optimized constants.

### 8. The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "Binary search is fast" -- fast compared to what? On what inputs? |
| :white_check_mark: **Right** | An algorithm is a finite, definite, effective procedure. Binary search makes at most ceil(log2(n)) comparisons on a sorted array of n elements. |
| :x: **Too Formal** | Modeling algorithms as Turing machines with formal transition functions (that is Part 39). |
| :warning: **Common Mistake** | Confusing algorithm complexity with implementation performance. "Python's sort is O(n log n)" is about Timsort, not about Python. |

## Thread Progression

- **Proof Portfolio:** No new proofs. (Binary search correctness was proved in Part 14. Algorithm analysis proofs begin in Part 18.)
- **Code Companion:** `algorithm_comparison.py` -- timing comparison of linear vs binary search, bubble vs insertion sort vs Timsort. Cumulative: 17 programs.
- **Rosen Exercises:** 3.1: 1, 3, 5, 7, 11, 15, 17, 21, 23, 25, 31, 33, 41, 43, 51. Essential: 1, 3, 5, 7, 11, 15. Recommended: 17, 21, 23, 25. Challenge: 31, 33, 41, 43, 51.

## Further Resources

- **MIT 6.042J Lecture 12** -- Introduction to algorithms and complexity, pseudocode conventions
- **CLRS Ch 1-2** -- The role of algorithms in computing, getting started with insertion sort and merge sort analysis
- **Book of Proof, Ch 3** -- General mathematical writing conventions useful for algorithm descriptions

## Key Takeaways

1. An algorithm has seven properties (input, output, definiteness, correctness, finiteness, effectiveness, generality) and most production code intentionally violates at least one.
2. Pseudocode is the language-independent layer where you can reason about correctness and efficiency without getting distracted by implementation artifacts.
3. The same algorithm can have different complexity in different languages because hidden costs (immutable copies, amortized resizing) live in the implementation, not the algorithm.
4. Binary search makes at most ceil(log2(n)) comparisons -- you proved it works in Part 14, and now you can describe it precisely enough to analyze its speed.

## Writer Notes

- This part is intentionally lighter than Parts 18-19. It establishes vocabulary (algorithm, pseudocode, properties) and sets up the framework for the proof-heavy Big-O work in Part 18.
- The string concatenation hook is extremely relatable for Python/JS developers. Use concrete numbers: "1 million characters, 47ms with a list + join, 8.3 seconds with repeated concatenation."
- Resist the urge to go deep on sorting. Bubble sort and insertion sort are here as pseudocode-reading exercises, not as algorithms to memorize. The goal is fluency in reading pseudocode, not encyclopedic knowledge of sorting.
- The back-reference to Part 14 (binary search correctness proof) is important. Readers should feel the payoff: "I proved this works. Now I can describe it precisely enough to ask how fast it works."
- Keep the timing comparison output clean and tabular. The visual contrast between linear and binary search on 100,000 elements is the single most convincing argument for formal analysis.
