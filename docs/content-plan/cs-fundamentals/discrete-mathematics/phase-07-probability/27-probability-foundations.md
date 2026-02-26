# Part 27: Probability Foundations: Sample Spaces, Events, and Monte Carlo

> Rosen Sections: 7.1
> Blog file: `apps/web/src/content/blog/discrete-mathematics/27-probability-foundations.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "Probability Foundations: Sample Spaces, Events, and Monte Carlo"
description: "Learn sample spaces, event probability, and Monte Carlo methods — the math behind random number generation, A/B testing, and hash collision analysis."
excerpt: "Every PRNG, every A/B test, every hash collision has a sample space behind it. This post builds your probability foundations from the ground up, then puts them to work with Monte Carlo simulations."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "probability"]
series: "Discrete Mathematics for Developers"
seriesPart: 27
featured: false
draft: true
---
```

## Component Imports

```mdx
import Alert from '../../../components/shared/Alert.astro';
import ComparisonTable from '../../../components/shared/ComparisonTable.astro';
import ComparisonHeader from '../../../components/shared/ComparisonHeader.astro';
import ComparisonRow from '../../../components/shared/ComparisonRow.astro';
```

## Opening Hook

- **Scenario:** You call `Math.random()` or `random.randint()` and trust the result. You run an A/B test and declare a winner. You pick a hash function and hope for few collisions. Behind every one of these decisions is a sample space you never explicitly defined.
- **Reveal:** Random number generation is sampling from a sample space. A/B testing significance is event probability. Hash collision risk is the birthday problem formalized. Probability is the math you have been relying on without knowing it.
- **Outcome:** By the end, you will define sample spaces, compute event probabilities, distinguish PRNGs from CSPRNGs, estimate pi with Monte Carlo, and build a framework for analyzing hash collision probability.

## Section Outline

### 1. Why This Matters

- Every call to `random()` samples from a probability distribution. Every load balancer distributes traffic probabilistically. Every hash function's collision resistance is a probability statement.
- Developers use probability intuitively but rarely formalize it. This leads to subtle bugs: assuming independence when events are correlated, ignoring base rates, underestimating collision probability.
- This is the first post in the probability phase. Phase 5 (counting) gave us the tools to count outcomes. Now we assign probabilities to those outcomes.

### 2. Sample Spaces and Events

- **Definition:** A sample space S is the set of all possible outcomes of an experiment. An event E is a subset of S.
- **Examples:** Rolling a die: S = {1, 2, 3, 4, 5, 6}. Flipping two coins: S = {HH, HT, TH, TT}. Generating a random 32-bit integer: S = {0, 1, ..., 2^32 - 1}.
- **Events as sets:** "Rolling an even number" is E = {2, 4, 6}. This connects directly to Phase 2 (sets) -- events are subsets, and set operations (union, intersection, complement) map to event operations.
- **Code connection:** A sample space is the range of your random function. An event is a predicate filtering that range.

### 3. Probability Axioms

- **Axiom 1:** 0 <= P(E) <= 1 for any event E.
- **Axiom 2:** P(S) = 1 -- something must happen.
- **Axiom 3:** For mutually exclusive events E1, E2, ..., P(E1 union E2 union ...) = P(E1) + P(E2) + ...
- **Laplace's definition:** For equally likely outcomes, P(E) = |E| / |S|. This is where Phase 5 counting pays off -- computing |E| and |S| is a counting problem.

### 4. Complementary Events

- P(E') = 1 - P(E). Often easier to compute "the probability something doesn't happen" and subtract from 1.
- **Developer pattern:** "What's the probability of at least one failure in 100 requests?" is easier as 1 - P(no failures in 100 requests).

### 5. Union of Events

- P(A union B) = P(A) + P(B) - P(A intersection B). Inclusion-exclusion from Phase 5 appears again.
- Mutually exclusive events: P(A intersection B) = 0, so P(A union B) = P(A) + P(B).
- **Code connection:** Monitoring alerts. P(CPU alert OR memory alert) is not P(CPU) + P(memory) unless the events are independent -- and they usually are not.

### 6. Probabilistic vs Deterministic Thinking

- Deterministic: "This function returns 42." Probabilistic: "This function returns 42 with probability 0.95."
- Randomized algorithms deliberately introduce randomness to improve average-case performance or simplify logic. Deterministic thinking says "prove it always works." Probabilistic thinking says "prove it works with high probability."
- Brief: Las Vegas algorithms (always correct, randomized runtime) vs Monte Carlo algorithms (fixed runtime, probabilistic correctness).

### 7. PRNGs vs CSPRNGs

- **PRNG (Pseudorandom Number Generator):** Deterministic algorithm that produces numbers that appear random. `Math.random()`, `random.random()`. Fast but predictable if you know the seed.
- **CSPRNG (Cryptographically Secure PRNG):** Unpredictable even if you know previous outputs. `secrets.token_bytes()`, `/dev/urandom`. Slower but safe for security contexts.
- **When it matters:** Session tokens, API keys, cryptographic nonces require CSPRNGs. Simulations, games, shuffling can use PRNGs.
- **ComparisonTable:** PRNG vs CSPRNG -- speed, predictability, use cases, Python/JS APIs.

### 8. Monte Carlo Method: Estimating Pi

- **The idea:** Generate random points in a unit square. Count how many fall inside the inscribed quarter-circle. The ratio approximates pi/4.
- Step-by-step: generate (x, y) uniformly in [0, 1] x [0, 1]. Check if x^2 + y^2 <= 1. After N trials, pi approximately equals 4 * (hits / N).
- Convergence: accuracy improves with sqrt(N). Need 100x more samples for 10x more accuracy.
- **Code walkthrough:** Build the simulation, plot convergence.

### 9. Birthday Problem Revisited with Probability

- In Phase 5 (Part 20), the birthday problem was a counting argument. Now formalize it as a probability calculation.
- P(at least two share a birthday in n people) = 1 - P(all different) = 1 - (365/365)(364/365)...(365-n+1)/365.
- The answer crosses 50% at n = 23. This surprises most people.
- **Simulation:** Run 10,000 trials, compare empirical vs theoretical probability.

### 10. Hash Collision Probability Framework

- Hash functions map inputs to a fixed-size output space. Collisions are the birthday problem.
- For a hash producing k-bit outputs, the probability of collision among n items: approximately 1 - e^(-n^2 / (2 * 2^k)).
- **Practical table:** For 128-bit hash (MD5), 256-bit (SHA-256), how many items before collision probability exceeds 1 in a billion?
- This framework applies to UUIDs, database primary keys, content-addressable storage.

### Code Companion: probability_sim.py

- **Monte Carlo pi estimator:** Generate N random points, estimate pi, show convergence.
- **Birthday paradox simulator:** Run trials for n = 2 to 100 people, plot probability curve, compare to theoretical formula.
- **Random walk simulator:** 1D and 2D random walks, expected distance from origin after N steps, visualize paths.
- All three demonstrate different facets of probabilistic simulation.

### The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "Random means unpredictable" -- conflates pseudorandom and truly random, ignores that PRNGs are deterministic |
| :white_check_mark: **Right** | A sample space is the set of all outcomes. An event is a subset. Probability assigns a number between 0 and 1 to each event, with axioms governing consistency. Counting from Phase 5 computes |E|/|S| for equally likely outcomes. |
| :x: **Too Formal** | Sigma-algebras, measure-theoretic probability, Borel sets. This is discrete probability, not continuous measure theory. |
| :warning: **Common Mistake** | Assuming events are independent without checking. P(A and B) = P(A) * P(B) ONLY when A and B are independent. Correlated events (CPU and memory usage) require P(A and B) = P(A) * P(B|A). |

## Thread Progression

- **Proof Portfolio:** No new proofs. This part builds computational intuition through simulation before the formal treatment in Parts 28-29.
- **Code Companion:** `probability_sim.py` -- Monte Carlo pi estimation, birthday paradox simulation, random walk visualization.
- **Rosen Exercises:**
  - **Essential:** 7.1: 1, 3, 5, 7, 11, 15
  - **Recommended:** 7.1: 17, 23, 25
  - **Challenge:** 7.1: 31

## Further Resources

- **MIT 6.042J Lecture 17** -- Introduction to probability, sample spaces, and counting-based probability calculations.
- **Khan Academy: Probability and Combinatorics** -- Visual explanations of sample spaces, events, and basic probability rules.
- **Python `random` module documentation** -- Details on PRNG algorithms (Mersenne Twister) and `secrets` module for CSPRNGs.

## Key Takeaways

1. A sample space defines what can happen; an event defines what you care about. Probability is the ratio |E|/|S| for equally likely outcomes -- and Phase 5 counting computes both.
2. PRNGs are fast and deterministic (fine for simulations); CSPRNGs are unpredictable (required for security). Know which one your code uses.
3. Monte Carlo methods turn difficult analytical problems into straightforward simulations -- generate random samples, count hits, converge to the answer.

## Writer Notes

- This is the entry point for the probability phase. Build intuition through simulation before formalism. Let readers see probability in action (Monte Carlo, birthday simulation) before proving anything.
- The birthday problem was introduced in Phase 5 as a counting argument. Here it becomes a probability calculation. Call back explicitly: "In Part 20, we counted the number of ways birthdays can collide. Now we compute the probability."
- The PRNG vs CSPRNG section is a developer service. Most programmers use `Math.random()` for everything. Make the security implications concrete: "If you use a PRNG for session tokens, an attacker who observes a few tokens can predict all future tokens."
- Hash collision probability is the most directly useful application. UUIDs, content-addressable storage, database keys -- developers make decisions about hash size constantly. Give them the formula.
- No proofs in this part. The computational focus is intentional: simulations build the intuition that makes Part 28's Bayes' theorem derivation meaningful.
