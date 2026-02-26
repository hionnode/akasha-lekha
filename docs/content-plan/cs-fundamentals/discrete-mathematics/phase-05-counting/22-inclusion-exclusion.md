# Part 22: Advanced Counting: Inclusion-Exclusion and Its Applications

> Rosen Sections: 6.5-6.6, 8.5-8.6
> Blog file: `apps/web/src/content/blog/discrete-mathematics/22-inclusion-exclusion.mdx`
> Estimated word count: 3,500-4,000

## Frontmatter

```yaml
---
title: "Advanced Counting: Inclusion-Exclusion and Its Applications"
description: "Master inclusion-exclusion, derangements, and Euler's totient function -- the counting tools behind analytics queries and RSA cryptography."
excerpt: "How many users use feature A or B? Every analytics query with 'OR' is an inclusion-exclusion problem. And the same principle powers RSA key generation."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "counting", "combinatorics"]
series: "Discrete Mathematics for Developers"
seriesPart: 22
featured: false
draft: true
---
```

## Component Imports

```mdx
import Alert from '@components/shared/Alert.astro';
```

## Opening Hook

- **Scenario:** Your analytics dashboard needs to answer: "How many users use feature A or feature B?" The naive approach: count users of A, count users of B, add them. But users who use both A and B get counted twice. The correct answer is |A| + |B| - |A intersect B|. You have been using inclusion-exclusion every time you write a SQL query with OR.
- **Reveal:** Inclusion-exclusion generalizes from 2 sets to any number. It connects to derangements (the Secret Santa problem), Euler's totient function (how many integers are coprime to n), and ultimately to RSA key generation in Part 26.
- **Outcome:** Readers can apply generalized permutations/combinations, derive and use the inclusion-exclusion principle, compute derangements and Euler's totient function, and see how these tools connect to cryptography.

## Section Outline

### 1. Why This Matters

Inclusion-exclusion is the workhorse of "count with constraints" problems. Every analytics query involving OR, every probability calculation involving "at least one," every system design involving overlapping categories uses this principle. And Euler's totient function -- a direct application -- is a critical component of RSA.

### 2. Generalized Permutations (DIFCP) -- Rosen 6.5

**Permutations with repetition:** The number of r-permutations from a set of n objects with repetition allowed is n^r.

Application: number of strings of length r over an alphabet of size n. Example: 8-character lowercase passwords: 26^8 = 208 billion.

**Combinations with repetition (Stars and Bars):** The number of ways to choose r objects from n types with repetition allowed is C(n + r - 1, r).

Stars and bars derivation: placing r identical stars into n categories separated by n-1 bars. Total positions: r + n - 1. Choose where the n-1 bars go: C(r + n - 1, n - 1) = C(n + r - 1, r).

Application: distributing 10 identical tasks among 4 servers = C(13, 3) = 286 ways.

### 3. Generating Permutations and Combinations Algorithmically -- Rosen 6.6

Brief treatment of algorithms for generating:
- All permutations (lexicographic order, next-permutation algorithm)
- All combinations (binary counting, bit manipulation)
- All subsets (power set generation)

These are the algorithms behind `itertools.permutations()` and `itertools.combinations()` in Python. The reader already uses the library functions; now they understand what those functions compute.

### 4. The Inclusion-Exclusion Principle for Two Sets (DIFCP + Proof) -- Rosen 8.5

**Theorem:** |A union B| = |A| + |B| - |A intersect B|.

**Proof (direct):**

Partition A union B into three disjoint regions:
1. Elements in A only: |A| - |A intersect B|
2. Elements in B only: |B| - |A intersect B|
3. Elements in both: |A intersect B|

Sum: (|A| - |A intersect B|) + (|B| - |A intersect B|) + |A intersect B| = |A| + |B| - |A intersect B|.

Back-reference to Part 8 (set operations) for the partition argument.

### 5. Inclusion-Exclusion for Three or More Sets

**For three sets:** |A union B union C| = |A| + |B| + |C| - |A intersect B| - |A intersect C| - |B intersect C| + |A intersect B intersect C|.

**General formula:** |A1 union ... union An| = sum of |Ai| - sum of |Ai intersect Aj| + sum of |Ai intersect Aj intersect Ak| - ... + (-1)^(n+1) |A1 intersect ... intersect An|.

The alternating signs correct for overcounting at each level. Visualize with Venn diagrams for 2 and 3 sets.

Developer application: "How many users use at least one of features A, B, or C?" requires three-set inclusion-exclusion.

### 6. Derangements (DIFCP)

**Definition:** A derangement is a permutation where no element appears in its original position.

**The Secret Santa problem:** n people draw names such that no one draws themselves. How many valid assignments are there?

**Formula:** D(n) = n! * sum from k=0 to n of (-1)^k / k!

Derivation via inclusion-exclusion: Let Ai = {permutations where person i is in position i}. Derangements = |complement of (A1 union ... union An)|. Apply inclusion-exclusion.

**Approximation:** D(n) approaches n!/e as n grows. The probability that a random permutation is a derangement converges to 1/e = 0.3679.

### 7. Euler's Totient Function (DIFCP)

**Definition:** phi(n) = the number of integers in {1, 2, ..., n} that are coprime to n (i.e., gcd(k, n) = 1).

Computation via inclusion-exclusion:
1. Factor n = p1^a1 * p2^a2 * ... * pk^ak.
2. Let Ai = {integers in {1,...,n} divisible by pi}.
3. Integers NOT coprime to n = |A1 union ... union Ak|.
4. Apply inclusion-exclusion.
5. Result: phi(n) = n * product of (1 - 1/pi) for each prime factor pi.

Examples:
- phi(12) = 12 * (1 - 1/2) * (1 - 1/3) = 4. The integers coprime to 12 in {1,...,12} are {1, 5, 7, 11}.
- phi(p) = p - 1 for any prime p. (Everything except p itself is coprime to p.)

**Forward reference:** Euler's totient function is the key to RSA key generation in Part 26. phi(n) tells you the size of the multiplicative group mod n, which determines the relationship between the encryption and decryption exponents.

### 8. Applications to Counting with Constraints -- Rosen 8.6

Combining inclusion-exclusion with other counting techniques:
- Surjective functions: how many onto functions from a set of m elements to a set of n elements?
- Integer solutions with constraints: how many ways to distribute r identical objects into n distinct bins with upper bounds?

Keep this section brief. The formulas are complex; the point is to show that inclusion-exclusion is a general tool, not a one-trick method.

### 9. Code Companion: Inclusion-Exclusion

`inclusion_exclusion.py` -- implements inclusion-exclusion, derangements, and Euler's totient function.

Key functions:
- `inclusion_exclusion_2(a: int, b: int, a_and_b: int) -> int` -- two-set formula
- `inclusion_exclusion_3(a, b, c, ab, ac, bc, abc) -> int` -- three-set formula
- `derangements(n: int) -> int` -- computes D(n) using the inclusion-exclusion formula
- `derangement_probability(n: int) -> float` -- D(n)/n!, converges to 1/e
- `euler_totient(n: int) -> int` -- computes phi(n) via prime factorization + inclusion-exclusion
- `coprime_list(n: int) -> list[int]` -- lists all integers coprime to n (brute force verification)
- `prime_factorization(n: int) -> list[int]` -- returns prime factors
- Main block: derangement table (D(1) through D(10)), verification that D(n)/n! converges to 1/e, Euler's totient for selected values with brute-force verification

### 10. The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "Just add the sets and subtract the overlap" -- works for 2 sets but breaks for 3+ without the alternating sign pattern. |
| :white_check_mark: **Right** | Inclusion-exclusion corrects for overcounting at every level via alternating signs. Derangements and Euler's totient are direct applications. phi(n) = n * product(1 - 1/p) for each prime factor p. |
| :x: **Too Formal** | Mobius inversion on partially ordered sets, sieve methods in analytic number theory. |
| :warning: **Common Mistake** | Forgetting to add back the triple intersection in three-set inclusion-exclusion. The pattern alternates: add singles, subtract pairs, add triples, subtract quadruples, ... |

## Thread Progression

- **Proof Portfolio:** +1 new proof (inclusion-exclusion for two sets, direct proof by partition). Cumulative: 23 proofs.
- **Code Companion:** `inclusion_exclusion.py` -- inclusion-exclusion, derangements, Euler's totient function. Cumulative: 22 programs.
- **Rosen Exercises:** 6.5: 1, 3, 5, 7, 11, 15. 6.6: 1, 3, 5. 8.5: 1, 3, 5, 7, 11. 8.6: 1, 3, 5. Essential: 6.5: 1, 3, 5; 8.5: 1, 3, 5. Recommended: 6.5: 7, 11; 8.5: 7, 11; 6.6: 1, 3. Challenge: 6.5: 15; 8.6: 1, 3, 5; 6.6: 5.

## Further Resources

- **MIT 6.042J Lectures 15-16** -- Inclusion-exclusion principle, derangements, and counting with constraints
- **Book of Proof, Ch 3** -- Additional examples of inclusion-exclusion proofs
- **Coursera UCSD Discrete Math: Week on Counting** -- Interactive exercises on permutations with repetition and stars-and-bars problems

## Key Takeaways

1. Inclusion-exclusion corrects the overcounting in union calculations: add singles, subtract pairs, add triples, and so on with alternating signs.
2. Derangements (no element in its original position) converge to n!/e -- the probability of a random permutation being a derangement is approximately 36.8%, regardless of n.
3. Euler's totient function phi(n) counts integers coprime to n and equals n * product(1 - 1/p) for each prime factor p. It is derived from inclusion-exclusion.
4. phi(n) is the bridge from counting to cryptography: it determines the relationship between RSA encryption and decryption keys (Part 26).

## Writer Notes

- This part covers four Rosen sections (6.5, 6.6, 8.5, 8.6), which is more than most parts. The generalized permutations/combinations (6.5) and generating algorithms (6.6) should be kept concise -- they are tools, not deep theory.
- The inclusion-exclusion proof should use the partition approach (three disjoint regions) rather than the set-algebraic approach. Partitions are more intuitive for developers.
- The Euler's totient section is critical infrastructure for Part 26 (RSA). Make the forward reference explicit: "This function -- phi(n) -- will appear again in Part 26, where it is the key to understanding why RSA key generation works." Plant the seed.
- Derangements are delightful mathematics. The 1/e convergence is surprising and memorable. Show the table D(n)/n! for n = 1 through 10 to make the convergence visually obvious.
- Stars and bars is one of those techniques that seems magical the first time you see it. Use a physical analogy: distributing 10 identical cookies among 4 kids by choosing where to place 3 dividers among 13 positions.
- The analytics query hook (feature A or B) is deliberately pedestrian. This is math that every developer uses without knowing its name. Name it. Own it.
