# Part 4: Proof Techniques I: Direct Proof and Contraposition

> Rosen Sections: 1.7 (partial)
> Blog file: `apps/web/src/content/blog/discrete-mathematics/04-proof-techniques-direct.mdx`
> Estimated word count: 4,000-5,000

## Frontmatter

```yaml
---
title: "Proof Techniques I: Direct Proof and Contraposition"
description: "Learn direct proof and proof by contraposition with step-by-step examples — the formal version of 'if precondition P, then postcondition Q' in code."
excerpt: "Every function with a precondition and postcondition is a theorem waiting to be proved. Direct proof and contraposition are the two techniques you will use most often."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "proofs", "logic"]
series: "Discrete Mathematics for Developers"
seriesPart: 4
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

- **Scenario:** You write a function: "If the input is a sorted array, the output is the correct search index." Every function with a precondition (P) and postcondition (Q) is an implication: P → Q. You know it works because you tested it. But testing checks finite cases. A proof checks ALL cases.
- **Reveal:** A direct proof IS the logical structure of a function: assume the precondition, apply valid transformations step by step, arrive at the postcondition. You have been "proving" things every time you reason about why your code is correct.
- **Outcome:** By the end, you will be able to write direct proofs and proofs by contraposition, understand when to use each, and add two proofs to your growing Proof Portfolio.

## Section Outline

### 1. Why This Matters

- This is the most important post in Phase 1. Proof writing is the key skill barrier for the entire discrete math series. Every phase from here forward assumes you can read and write proofs.
- Two proof techniques today: direct proof and contraposition. These handle the majority of mathematical arguments you will encounter.
- The mental motion of proof is identical to the mental motion of programming: start with assumptions, apply valid operations, arrive at a guaranteed result.

### 2. What Is a Proof?

- **Definition:** A proof is a valid argument that establishes the truth of a mathematical statement. It is a finite sequence of steps, each justified by an axiom, a definition, or a previously established result (including the inference rules from Part 3).
- **Key insight:** A proof is NOT an explanation of why something is true. It is a guarantee that it MUST be true. Explanations can be wrong. Proofs cannot (assuming the steps are valid).
- **Theorems, lemmas, corollaries:** Theorem = major result. Lemma = helper result used to prove a theorem. Corollary = easy consequence of a theorem. In code: theorem = main function, lemma = helper function, corollary = trivial wrapper.
- **Proof vs testing:** Testing checks specific inputs. Proofs cover ALL inputs. This is the qualitative jump from "my function works on these 50 test cases" to "my function works on every possible input."

### 3. Direct Proof

**DIFCP treatment — first major proof technique.**

- **Definition:** To prove "if P then Q" (P → Q), assume P is true, then use definitions, axioms, and previously proven results to show Q must also be true.
- **Intuition:** Direct proof is the natural way you reason: start with what you know, derive what you need. It is the logical equivalent of writing a function: take the input (P), process it (valid steps), produce the output (Q).
- **Structure:**
  1. State what you want to prove: "We prove that if P then Q."
  2. Assume P.
  3. Apply valid operations (definitions, algebra, inference rules).
  4. Arrive at Q.
  5. Conclude: "Therefore P → Q." ∎

#### Proof 1: Even + Even = Even (Proof Portfolio)

- **Theorem:** If a and b are both even integers, then a + b is even.
- **Proof:** Assume a and b are even. By definition of even, a = 2k for some integer k, and b = 2m for some integer m. Then a + b = 2k + 2m = 2(k + m). Since k + m is an integer, a + b is 2 times an integer, so a + b is even. ∎
- **Annotation:** Walk through each step explaining WHY it is valid. Highlight the definition of even (2 times an integer) as the key insight.

#### Additional Direct Proof Examples

- Sum of two odd numbers is even: a = 2k+1, b = 2m+1, a+b = 2(k+m+1).
- Product of two rationals is rational: a = p/q, b = r/s, ab = pr/qs.
- The square of an even number is even.

### 4. Proof by Contraposition

**DIFCP treatment — second major proof technique.**

- **Definition:** To prove "if P then Q" (P → Q), instead prove its contrapositive: "if not Q then not P" (¬Q → ¬P). These are logically equivalent (proven by truth table in Part 1).
- **Intuition:** Contraposition is debugging in reverse. "If the output is wrong (¬Q), the input must have been wrong (¬P)." Instead of going forward from precondition to postcondition, you go backward from failure to find the cause.
- **When to use:** When the conclusion Q is hard to work with directly, but ¬Q gives you something concrete to start from. Rule of thumb: if the conclusion involves a negative ("n is odd", "x is irrational"), try contraposition.
- **Structure:**
  1. State what you want to prove: "We prove P → Q by contraposition."
  2. State the contrapositive: "We prove ¬Q → ¬P."
  3. Assume ¬Q.
  4. Derive ¬P.
  5. Conclude: "By contraposition, P → Q." ∎

#### Proof 2: If n² Is Odd, Then n Is Odd (Proof Portfolio)

- **Theorem:** For any integer n, if n² is odd, then n is odd.
- **Why contraposition?** It is easier to work with "n is even" (we know what even looks like: 2k) than to work directly with "n² is odd."
- **Contrapositive:** If n is even, then n² is even.
- **Proof:** Assume n is even. Then n = 2k for some integer k. Then n² = (2k)² = 4k² = 2(2k²). Since 2k² is an integer, n² is even. ∎
- **Annotation:** Point out that the forward direction ("n² is odd → n is odd") is awkward because "n² is odd" does not directly tell you what n looks like. The contrapositive starts from "n is even" which immediately gives you n = 2k.

#### Additional Contrapositive Examples

- If n² is even, then n is even (same structure, swapped parity).
- If a + b ≥ 100, then a ≥ 50 or b ≥ 50 (contrapositive: if a < 50 and b < 50, then a + b < 100).

### 5. Choosing Between Direct and Contrapositive

- **Decision heuristic:**
  - Can you unpack the conclusion Q into something workable? → Try direct proof first.
  - Is ¬Q easier to start from than P? → Try contraposition.
  - Both work? → Use whichever produces a shorter proof.
- Table comparing both approaches for the examples covered.
- Neither technique handles every situation. Parts 5-6 add contradiction, cases, and existence proofs to complete the toolkit.

### 6. Definitions Are Your Best Friend

- Most proof steps involve applying a definition. "a is even" → "a = 2k for some integer k." This is almost always the first move.
- Building a personal definition library: even, odd, rational, irrational, divides, prime, composite. Each definition is a tool you reach for when writing proofs.
- The definition of "divides": a | b means b = ak for some integer k. Equivalently, b/a is an integer.

### 7. Code Companion: proof_verifier.py

- **What it does:** Computationally checks proof claims for specific cases. Verifies "even + even = even" and "n² odd → n odd" over ranges of integers. Does NOT replace proofs (testing vs proving), but builds confidence that the theorems are correct.
- **Key functions:** `check_direct_proof(property, domain)`, `check_contrapositive(p, q, domain)`, `find_counterexample(property, domain)`.
- **Expected output:** Tests even+even=even for all pairs (a,b) with a,b in [-100, 100]. Tests n² odd → n odd for all n in [-1000, 1000]. Reports "No counterexample found" (which is expected, since we proved it for ALL integers, not just these).
- **Teaching point:** The code checks finite cases. The proof covers infinite cases. This is the gap that proofs bridge.

### 8. The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "Even plus even is even because, like, they're both divisible by 2" — lacks the algebraic step that makes it a proof |
| :white_check_mark: **Right** | A direct proof starts with the hypothesis, applies definitions and algebra step by step, and arrives at the conclusion. A contrapositive proof proves ¬Q → ¬P, which is logically equivalent to P → Q. Every step cites a definition, algebraic law, or previously proven result. |
| :x: **Too Formal** | Formal proofs in first-order logic with every step citing a specific axiom of ZFC set theory |
| :warning: **Common Mistake** | Proving the converse instead of the contrapositive. The contrapositive of P → Q is ¬Q → ¬P (valid). The converse is Q → P (NOT equivalent, NOT valid as a proof technique). |

## Thread Progression

- **Proof Portfolio:** +2 new proofs. (1) Even + even = even (direct proof). (2) If n² is odd then n is odd (proof by contraposition). Cumulative: 2 proofs.
- **Code Companion:** `proof_verifier.py` — computationally checks proof claims over finite domains.
- **Rosen Exercises:**
  - **Essential:** 1.7: 1, 3, 5, 7, 9, 11
  - **Recommended:** 1.7: 13, 15, 17, 19
  - **Challenge:** 1.7: 21

## Further Resources

- **MIT 6.042J Lecture 2** — Introduction to proofs, direct proof, and contrapositive proof with worked examples.
- **Book of Proof, Chapters 4-5** — Chapter 4 covers direct proof, Chapter 5 covers contrapositive proof. Excellent practice problems.
- **Neso Academy: Proof Techniques** — Video walkthrough of direct proof and contraposition.

## Key Takeaways

1. A direct proof of P → Q assumes P and derives Q step by step, exactly like a function that takes precondition P as input and produces postcondition Q as output.
2. Proof by contraposition proves ¬Q → ¬P instead, which is logically equivalent. Use it when the negated conclusion gives you a more concrete starting point than the original hypothesis.
3. Definitions are the workhorse of proofs: "a is even" means "a = 2k for some integer k," and this substitution is almost always the first step.

## Writer Notes

- This is the most important post in Phase 1 and possibly the most important post in the first half of the series. Proof writing is the primary skill barrier. Take the time to explain every step of every proof.
- The "even + even = even" proof is deliberately simple. The reader should feel "I can do this" after reading it. Complexity comes in Parts 5-6.
- The converse vs contrapositive distinction deserves its own Alert box (type="caution"). Confusing these is the #1 beginner proof mistake.
- Show the connection between proof structure and function structure explicitly. A proof is to a theorem what an implementation is to a function signature.
- The proof_verifier.py code companion serves a pedagogical purpose: it shows the reader that testing agrees with the proof, building trust in the proof process. But it also shows the limitation: testing can never cover all cases.
- This is a longer post (4,000-5,000 words). The extra space is needed for careful step-by-step proof exposition. Do not compress.
- Forward-reference Part 5: "Direct proof and contraposition handle 'if P then Q' statements. But some theorems require a different approach. Part 5 introduces proof by contradiction (assume it is true, derive something impossible) and covers two of the most famous proofs in mathematics: the irrationality of √2 and the infinitude of primes."
