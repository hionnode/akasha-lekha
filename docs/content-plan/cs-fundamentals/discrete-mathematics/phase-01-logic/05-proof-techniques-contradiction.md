# Part 5: Proof Techniques II: Contradiction, Cases, and Existence

> Rosen Sections: 1.7-1.8 (partial)
> Blog file: `apps/web/src/content/blog/discrete-mathematics/05-proof-techniques-contradiction.mdx`
> Estimated word count: 4,000-5,500

## Frontmatter

```yaml
---
title: "Proof Techniques II: Contradiction, Cases, and Existence"
description: "Learn proof by contradiction, proof by cases, and existence proofs — including the irrationality of sqrt(2) and the infinitude of primes."
excerpt: "Assume the system works, derive something impossible — that is proof by contradiction. This post covers three techniques and two of the most beautiful proofs in mathematics."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "proofs"]
series: "Discrete Mathematics for Developers"
seriesPart: 5
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

- **Scenario:** A teammate claims their algorithm always terminates. You cannot prove it directly (you cannot trace every possible execution path). Instead, you assume it runs forever, and derive a consequence that is impossible: the loop counter would have to be both positive and negative simultaneously. Since that is impossible, your assumption was wrong, and the algorithm terminates.
- **Reveal:** That reasoning pattern is proof by contradiction. Assume the opposite of what you want to prove, derive a logical impossibility, and conclude the original statement must be true. Some of the most famous results in mathematics use this technique.
- **Outcome:** By the end, you will know three new proof techniques (contradiction, cases, existence), have proved that √2 is irrational and that there are infinitely many primes, and understand when each technique is the right tool.

## Section Outline

### 1. Why This Matters

- Direct proof and contraposition (Part 4) handle many theorems, but not all. Some statements are hard to prove "forward." Contradiction lets you prove things by showing the alternative is impossible.
- Proof by cases handles situations where the proof splits into exhaustive scenarios (like a switch statement with every branch covered).
- Existence proofs answer "does there exist an X with property P?" — the theoretical counterpart of "can I construct a valid configuration?"

### 2. Proof by Contradiction

**DIFCP treatment.**

- **Definition:** To prove a statement S, assume ¬S (the negation), then derive a contradiction (a statement that is always false, like p ∧ ¬p). Since logic cannot contain contradictions, the assumption ¬S must be false, so S is true.
- **Intuition:** "Assume the system works. Derive something impossible. Conclude the system is broken." Or positively: "Assume the theorem is false. Derive something impossible. Conclude the theorem is true."
- **Structure:**
  1. State what you want to prove: S.
  2. Assume ¬S (the negation) for the sake of contradiction.
  3. Apply valid reasoning to derive a statement of the form p ∧ ¬p (or any known falsehood).
  4. Since we reached a contradiction, ¬S must be false.
  5. Therefore S is true. ∎
- **When to use:** When you cannot see a path forward from the hypothesis, but the negation gives you something concrete to work with. Also when the statement is a negative ("there is no X such that...") — negating it gives you a positive ("there IS an X such that...") which is easier to reason about.

#### Proof 3: √2 Is Irrational (Proof Portfolio)

- **Theorem:** √2 is irrational.
- **Setup:** Assume for contradiction that √2 IS rational. Then √2 = a/b where a, b are integers with no common factors (reduced fraction).
- **Proof steps:**
  1. √2 = a/b → 2 = a²/b² → a² = 2b².
  2. a² is even → a is even (by Part 4 contrapositive proof). So a = 2k.
  3. Substitute: (2k)² = 2b² → 4k² = 2b² → b² = 2k².
  4. b² is even → b is even.
  5. But both a and b are even → they share common factor 2.
  6. This contradicts our assumption that a/b is in reduced form.
  7. Therefore √2 is irrational. ∎
- **Annotation:** Note how the proof uses the result from Part 4 (n² even → n even) as a lemma. This is how proofs build on each other.
- **Code connection:** `math.sqrt(2)` returns `1.4142135623730951`. That decimal never terminates or repeats, which is what irrational means. But the code cannot prove this — it just computes an approximation.

#### Proof 4: There Are Infinitely Many Primes (Proof Portfolio)

- **Theorem:** There are infinitely many prime numbers. (Euclid, ~300 BCE)
- **Setup:** Assume for contradiction that there are finitely many primes: p₁, p₂, ..., pₙ (a complete list).
- **Proof steps:**
  1. Construct the number Q = p₁ · p₂ · ... · pₙ + 1 (product of all primes, plus one).
  2. Q is either prime or composite.
  3. If Q is prime: Q is not in our list (it is larger than all listed primes). Contradiction — we assumed the list was complete.
  4. If Q is composite: Q has a prime factor p. But Q divided by any pᵢ leaves remainder 1 (by construction). So p is not in our list. Contradiction.
  5. Both cases lead to contradiction. Therefore our assumption is false.
  6. There are infinitely many primes. ∎
- **Annotation:** Note the elegance: we do not claim Q is prime. We claim Q reveals a prime not in the list, whether Q is itself prime or not.
- **Developer connection:** Primes are the atoms of number theory. RSA encryption (Part 26) depends on the difficulty of factoring products of large primes. An infinite supply of primes means an infinite supply of keys.

### 3. Proof by Cases (Exhaustive Proof)

**DIFCP treatment.**

- **Definition:** To prove P → Q, divide the domain of P into exhaustive cases (P₁ ∨ P₂ ∨ ... ∨ Pₙ where P ≡ P₁ ∨ ... ∨ Pₙ), then prove Q separately for each case.
- **Intuition:** Pattern matching / switch statements. If you cover every possible case and prove the result in each one, the theorem holds.
- **Structure:**
  1. Identify exhaustive cases that cover all possibilities.
  2. Prove the result for each case separately.
  3. Since the cases are exhaustive, the result holds universally.
- **Example:** Prove |xy| = |x| · |y| for all real numbers. Cases: both positive, both negative, one positive one negative, one or both zero (4 cases, each straightforward).
- **When to use:** When the proof approach differs depending on some property of the input (even/odd, positive/negative, etc.). The cases must be exhaustive (cover all possibilities) and each case must lead to the conclusion.
- **Developer connection:** Exhaustive pattern matching in Rust/Haskell/TypeScript discriminated unions. The compiler forces you to handle every case. Proof by cases is the mathematical equivalent.

### 4. Existence Proofs

**DIFCP treatment.**

- **Definition:** To prove ∃x P(x), exhibit a specific witness c such that P(c) is true (constructive), or show that the assumption ¬∃x P(x) leads to a contradiction (non-constructive).
- **Constructive existence proof:** Produce the witness. "There exists a prime greater than 100. Proof: 101 is prime." Done.
- **Non-constructive existence proof:** Show that something must exist without naming it. "There exist irrational numbers a, b such that aᵇ is rational." (The classic proof considers √2^√2: either it is rational, done, or it is irrational and (√2^√2)^√2 = 2 is rational. Either way, the example exists, but we do not know which case applies.)
- **Developer connection:** Constructive proofs correspond to algorithms that produce a result. Non-constructive proofs correspond to proofs that a solution exists but do not give you an algorithm to find it. In practice, constructive proofs are more useful for engineers.

### 5. The Halting Problem as Famous Contradiction

- Brief preview (not a full proof, that is Part 39): Alan Turing proved that no program can decide whether an arbitrary program halts by assuming such a program exists and deriving a contradiction (self-referential paradox).
- This is the most consequential proof by contradiction in computer science. It means perfect linters, perfect type checkers, and perfect static analyzers are impossible in general.
- Full treatment in Part 39 (Turing machines). Here, just plant the seed.

### 6. Code Companion: primality_check.py

- **What it does:** Demonstrates existence proofs computationally. Finds primes, checks primality, constructs Q = p₁p₂...pₙ + 1 for a given list of primes and factors it, verifying that a new prime always emerges.
- **Key functions:** `is_prime(n)`, `find_primes(limit)`, `euclid_construction(primes)`, `sqrt2_rational_check(precision)`.
- **Expected output:** Constructs Q for the first 5, 10, 15 primes. Shows that Q (or its factors) always reveals a prime not in the original list. Also shows that √2 squared is approximately 2.0000000... but never exactly 2 in floating point (demonstrating the limits of computation).

### 7. The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "√2 can't be a fraction because its decimal goes on forever" — incorrect reasoning (1/3 = 0.333... also goes on forever and IS rational) |
| :white_check_mark: **Right** | Proof by contradiction assumes the negation, derives an impossibility, and concludes the original statement is true. The √2 proof hinges on the reduced-fraction assumption. The infinitude-of-primes proof constructs a number that reveals a missing prime. |
| :x: **Too Formal** | Constructive vs non-constructive proofs as a philosophical debate (intuitionism, law of excluded middle). Non-standard analysis approaches. |
| :warning: **Common Mistake** | In the √2 proof, claiming "Q = p₁p₂...pₙ + 1 is always prime." It is NOT. Q could be composite. The point is that Q's prime factors are not in the original list. For √2: forgetting to start with a/b in lowest terms, which breaks the contradiction at step 6. |

## Thread Progression

- **Proof Portfolio:** +2 new proofs. (3) √2 is irrational (contradiction). (4) Infinitely many primes (contradiction + cases). Cumulative: 4 proofs.
- **Code Companion:** `primality_check.py` — demonstrates existence proofs computationally, constructs Euclid's Q.
- **Rosen Exercises:**
  - **Essential:** 1.7: 23, 25, 27; 1.8: 1, 3, 5
  - **Recommended:** 1.7: 29, 31; 1.8: 7, 11
  - **Challenge:** 1.8: 11 (non-constructive existence proof)

## Further Resources

- **MIT 6.042J Lectures 2-3** — Proof by contradiction and existence proofs. The √2 irrationality proof is covered in detail.
- **Book of Proof, Chapters 6-7** — Chapter 6: proof by contradiction. Chapter 7: existence proofs (constructive and non-constructive).
- **Numberphile: "Infinity is bigger than you think"** — Visual introduction to the infinitude of primes and related ideas.

## Key Takeaways

1. Proof by contradiction assumes the opposite of what you want to prove, derives an impossibility, and concludes the original statement must be true — the logical equivalent of "assume the system works, derive something impossible."
2. The irrationality of √2 and the infinitude of primes are two of the most elegant proofs in mathematics, and both use contradiction: assume a finite list of primes or a rational representation, then show the assumption breaks.
3. Existence proofs come in two flavors: constructive (produce the witness) and non-constructive (show something must exist without naming it), and the constructive version is the one that corresponds to an algorithm.

## Writer Notes

- The √2 proof is the centerpiece. Walk through every step slowly. Annotate why each step works. This is the first proof readers encounter that is not about simple arithmetic properties.
- The infinitude of primes proof is equally important but often misunderstood. Emphasize that Q is NOT claimed to be prime. Q reveals a prime not in the list.
- The halting problem preview should be brief (3-4 sentences). Do not attempt the full proof. Just establish "proof by contradiction gave us one of the most important results in CS."
- This is a proof-heavy post (4,000-5,500 words). Two full proofs with careful annotation, plus shorter examples for cases and existence. Do not rush the annotation on the main proofs.
- Forward-reference Part 6: "You now have four proof techniques: direct, contraposition, contradiction, cases. Part 6 teaches you how to CHOOSE between them, covers the common mistakes that trip up beginners, and includes a proof-writing workflow you can follow for any new theorem."
