# Part 13: Mathematical Induction: Recursion's Formal Twin

> Rosen Sections: 5.1
> Blog file: `apps/web/src/content/blog/discrete-mathematics/13-mathematical-induction.mdx`
> Estimated word count: 3,500-4,500

## Frontmatter

```yaml
---
title: "Mathematical Induction: Recursion's Formal Twin"
description: "Learn mathematical induction through the lens of recursion — base case, inductive step, and inductive hypothesis map directly to recursive function structure."
excerpt: "Every recursive function implicitly uses induction: base case = base case, recursive call = inductive step. If you can write a recursive function, you can write an induction proof."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "induction", "recursion"]
series: "Discrete Mathematics for Developers"
seriesPart: 13
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

- **Scenario:** You write a recursive function: `def factorial(n): return 1 if n == 0 else n * factorial(n - 1)`. You trust it works. But why? The base case handles `n = 0`. The recursive step assumes `factorial(n - 1)` is correct and uses that assumption to compute `factorial(n)`. That assumption — "it works for n - 1" — is the inductive hypothesis.
- **Reveal:** Every recursive function implicitly uses mathematical induction. The base case is the base case. The recursive call is the inductive step. "It works for the smaller input" is the inductive hypothesis. Induction is recursion made formal.
- **Outcome:** By the end, you will be able to write induction proofs, prove the correctness of recursive functions, understand the relationship between recursion and induction, and have proved the classic sum formula Σi = n(n+1)/2.

## Section Outline

### 1. Why This Matters

- Induction is the most powerful proof technique for statements about integers, sequences, and recursive structures. Almost every phase from here forward uses induction.
- Developers already think inductively when they write recursive functions. This post formalizes that intuition into a proof technique.
- Without induction, you cannot prove that algorithms are correct, that data structures maintain invariants, or that recursive programs terminate. Testing checks finite cases. Induction covers all of them.

### 2. The Principle of Mathematical Induction

**DIFCP treatment.**

- **Definition:** To prove that a property P(n) holds for all integers n ≥ n₀:
  1. **Base case:** Prove P(n₀) is true.
  2. **Inductive step:** Prove that for any k ≥ n₀, if P(k) is true (the inductive hypothesis), then P(k+1) is true.
  3. Conclude: P(n) holds for all n ≥ n₀.
- **Why it works:** Think of dominos. The base case knocks over the first domino. The inductive step says "if domino k falls, domino k+1 falls." Together, they guarantee all dominos fall.
- **Formally:** Induction is a valid inference rule. It is an axiom of the natural numbers (the Peano axiom of induction).

### 3. The Recursion-Induction Correspondence

**The key conceptual bridge for developers.**

| Recursion | Induction |
|---|---|
| Base case: `if n == 0: return 1` | Base case: Prove P(0) |
| Recursive call: `factorial(n-1)` | Inductive hypothesis: Assume P(k) |
| Recursive step: `n * factorial(n-1)` | Inductive step: Prove P(k+1) using P(k) |
| Termination: n decreases toward base case | Well-ordering: k decreases toward n₀ |
| "It works for the smaller input" | "P(k) is true" (the assumption we get to use) |

- **PanelSwitcher:** Show a recursive factorial function alongside the induction proof of factorial correctness. Highlight the structural parallel line by line.
- **The mental motion is the same.** If you can justify why a recursive function works, you can write an induction proof. The only difference is rigor and notation.

### 4. Proof: Sum of First n Integers (Proof Portfolio)

**Full induction proof — the classic first example.**

- **Theorem:** For all n ≥ 1: Σᵢ₌₁ⁿ i = n(n+1)/2.
- **Base case:** n = 1. LHS = 1. RHS = 1(2)/2 = 1. LHS = RHS. ✓
- **Inductive hypothesis:** Assume Σᵢ₌₁ᵏ i = k(k+1)/2 for some k ≥ 1.
- **Inductive step:** Prove Σᵢ₌₁ᵏ⁺¹ i = (k+1)(k+2)/2.
  - Σᵢ₌₁ᵏ⁺¹ i = (Σᵢ₌₁ᵏ i) + (k+1) = k(k+1)/2 + (k+1) [by IH] = k(k+1)/2 + 2(k+1)/2 = (k+1)(k+2)/2.
- **Conclusion:** By induction, the formula holds for all n ≥ 1. ∎
- **Annotation:** Walk through every algebraic step. Highlight where the inductive hypothesis is used (the substitution step). Emphasize that the IH is not something we prove in this step — it is something we ASSUME and then use.

### 5. More Induction Proof Examples

#### Sum of First n Odd Numbers

- **Theorem:** Σᵢ₌₁ⁿ (2i - 1) = n². (The sum of the first n odd numbers is a perfect square.)
- **Base case:** n = 1: 2(1) - 1 = 1 = 1². ✓
- **Inductive step:** Assume Σᵢ₌₁ᵏ (2i - 1) = k². Then Σᵢ₌₁ᵏ⁺¹ (2i - 1) = k² + (2(k+1) - 1) = k² + 2k + 1 = (k+1)². ∎
- Brief annotation.

#### Geometric Series Sum

- **Theorem:** For r ≠ 1: Σᵢ₌₀ⁿ rⁱ = (rⁿ⁺¹ - 1)/(r - 1).
- Base case and inductive step outlined (not full annotation — reader has seen the pattern).

### 6. Proof: Correctness of Recursive Factorial (Proof Portfolio)

**Proving program correctness by induction.**

- **Theorem:** The recursive function `factorial(n)` returns n! for all n ≥ 0.
- **Definition of n!:** 0! = 1, n! = n · (n-1)! for n ≥ 1.
- **Base case:** n = 0. `factorial(0)` returns 1 = 0!. ✓
- **Inductive hypothesis:** Assume `factorial(k)` returns k! for some k ≥ 0.
- **Inductive step:** `factorial(k+1)` returns `(k+1) * factorial(k)` = (k+1) · k! [by IH] = (k+1)!. ✓
- **Conclusion:** By induction, `factorial(n)` returns n! for all n ≥ 0. ∎
- **Annotation:** This is the first proof of PROGRAM CORRECTNESS in the series. The structure exactly mirrors the recursion. This is why induction and recursion are twins.

### 7. Common Induction Mistakes

**Alert boxes for each mistake.**

#### Forgetting the Base Case

- "Assume P(k). Then P(k+1)." Without a base case, you have no starting point. The dominos have no first push.
- Example: "Prove all horses are the same color." The classic false induction proof fails at n = 2 (the base case does not work).

#### Wrong Inductive Hypothesis

- Assuming P(k+1) instead of P(k). That is circular reasoning — you are assuming what you want to prove.
- Always assume P(k) and prove P(k+1). Never the reverse.

#### Not Using the Inductive Hypothesis

- If your proof of P(k+1) does not reference P(k), something is wrong. The whole point of induction is that the inductive step USES the assumption.

#### Off-by-One Errors

- Starting the base case at the wrong value. If your theorem says "for all n ≥ 1" but you prove the base case for n = 0, there is a gap if P(0) is not needed.
- Match the base case to the quantifier.

### 8. Code Companion: induction_demo.py

- **What it does:** Implements recursive and iterative versions of sum, factorial, and geometric series. For each, computationally verifies the closed-form formula for a range of inputs. Shows the "induction in action" by printing each step of the recursion alongside the inductive argument.
- **Key functions:** `sum_n_recursive(n)`, `sum_n_iterative(n)`, `verify_sum_formula(n)`, `factorial_recursive(n)`, `verify_factorial(n)`, `trace_induction(n)` (prints the base case and each inductive step).
- **Expected output:** Verifies sum formula for n = 1 to 100. Verifies factorial for n = 0 to 20. Prints a trace showing "Base case: P(1) holds. Assume P(1)...P(k). Verify P(k+1)..." for a small n.

### 9. The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "It works for 1, and if it works for k then it works for k+1, so it works for everything" — correct structure but missing the actual PROOF of the inductive step, which is where all the work happens |
| :white_check_mark: **Right** | Induction has three parts: (1) prove the base case, (2) assume P(k) for arbitrary k ≥ n₀ (the inductive hypothesis), (3) prove P(k+1) using the assumption. The inductive hypothesis is assumed, not proved — that is the power of the technique. |
| :x: **Too Formal** | Transfinite induction, ordinal induction, the connection between induction and the well-ordering principle as equivalent axioms |
| :warning: **Common Mistake** | Not using the inductive hypothesis in the inductive step. If your proof of P(k+1) never references P(k), you have not done induction — you have done a direct proof (which is fine if it works, but means induction was unnecessary). |

## Thread Progression

- **Proof Portfolio:** +2 new proofs. (12) Sum of first n integers: Σi = n(n+1)/2 (weak induction). (13) Correctness of recursive factorial (program correctness by induction). Cumulative: 13 proofs.
- **Code Companion:** `induction_demo.py` — recursive vs iterative implementations with induction verification and trace output.
- **Rosen Exercises:**
  - **Essential:** 5.1: 1, 3, 5, 7, 11, 15, 17
  - **Recommended:** 5.1: 21, 23, 25
  - **Challenge:** 5.1: 31, 33

## Further Resources

- **MIT 6.042J Lecture 3** — Mathematical induction with multiple examples. Excellent treatment of the domino analogy and common pitfalls.
- **Book of Proof, Chapter 10** — Induction: weak induction, examples, and exercises. The best free resource for induction practice.
- **3Blue1Brown: "But what IS mathematical induction?"** — Visual explanation of why induction works, with the domino chain analogy.

## Key Takeaways

1. Mathematical induction has three parts — base case, inductive hypothesis (assume P(k)), and inductive step (prove P(k+1)) — and the mental motion is identical to writing a recursive function with a base case and a recursive call.
2. The inductive hypothesis is ASSUMED, not proved, and using it is the entire point: if your proof of P(k+1) does not reference P(k), you have not done induction.
3. Proving program correctness by induction maps directly to the structure of recursive code: the base case handles the termination condition, and the inductive step mirrors the recursive call.

## Writer Notes

- The recursion-induction correspondence is THE insight of this post. The side-by-side table (Section 3) and PanelSwitcher (recursive code vs induction proof) must be crystal clear. The reader should feel "these are the same thing."
- The sum formula proof is the classic first induction proof. Walk through it slowly. Mark where the IH is used. Many students miss this step.
- The factorial correctness proof (Section 6) is the first PROGRAM CORRECTNESS proof. Emphasize that this is what induction buys you that testing cannot: a guarantee over ALL inputs, not just the ones you tested.
- Common mistakes (Section 7) deserve significant space. The "all horses are the same color" example is classic and fun — it shows how induction can go wrong when the base case fails.
- This post is the gateway to Phase 3. If the reader understands induction as "recursion made formal," the remaining three parts (strong induction, structural induction, recurrences) will flow naturally.
- Forward-reference Part 14: "Weak induction assumes P(k) to prove P(k+1). But what if you need to assume P(1), P(2), ..., P(k) all at once? That is strong induction, and it is how you prove binary search is correct — the sub-problem could be any size up to n/2, not just n-1."
