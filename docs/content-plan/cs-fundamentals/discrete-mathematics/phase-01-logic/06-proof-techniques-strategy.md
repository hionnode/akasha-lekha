# Part 6: Proof Techniques III: Strategy and Common Mistakes

> Rosen Sections: 1.8 (partial)
> Blog file: `apps/web/src/content/blog/discrete-mathematics/06-proof-techniques-strategy.mdx`
> Estimated word count: 3,500-4,500

## Frontmatter

```yaml
---
title: "Proof Techniques III: Strategy and Common Mistakes"
description: "Learn how to choose the right proof technique, avoid common proof mistakes, and use counterexamples — proof strategy as a developer skill."
excerpt: "Code review catches logic bugs. Proof review catches reasoning bugs. This post teaches proof strategy: how to choose techniques, avoid common mistakes, and verify correctness."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "proofs"]
series: "Discrete Mathematics for Developers"
seriesPart: 6
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

- **Scenario:** You review a pull request. The author says "this function handles all edge cases." You do not take their word for it. You check each case, verify the logic, look for missing branches, and flag assumptions that are not justified. That process — checking every step, not just the conclusion — is exactly how you verify a proof.
- **Reveal:** Proof review is code review for mathematics. The same instincts that make you a good code reviewer (suspicion of unstated assumptions, checking boundary conditions, verifying each step independently) make you good at writing and evaluating proofs.
- **Outcome:** By the end, you will have a decision tree for choosing proof techniques, know the 5 most common proof mistakes and how to avoid them, and understand proof by counterexample for disproving false claims.

## Section Outline

### 1. Why This Matters

- Parts 4-5 gave you four proof techniques: direct, contraposition, contradiction, cases. But knowing techniques is not the same as knowing WHEN to use them.
- This post is about strategy: the meta-skill of proof writing. Like knowing design patterns is different from knowing when to apply them.
- Common mistakes in proofs map directly to common mistakes in code: assuming the conclusion, circular reasoning, incorrect case analysis, and confusing necessary vs sufficient conditions.

### 2. How to Choose a Proof Technique

**Decision tree approach:**

1. **What form is the statement?**
   - "If P then Q" → Try direct proof first. If stuck, try contraposition. If both fail, try contradiction.
   - "P if and only if Q" (biconditional) → Prove P → Q AND Q → P separately.
   - "There exists an x such that P(x)" → Try constructive existence proof.
   - "For all x, P(x)" → Try direct proof with arbitrary x. If the domain splits naturally, try cases.
   - "P is false" / "No x satisfies P(x)" → Try contradiction or find a counterexample.

2. **Is the conclusion positive or negative?**
   - Positive conclusion ("n is even", "x is rational") → Direct proof is natural.
   - Negative conclusion ("n is not divisible by 3", "√2 is irrational") → Contraposition or contradiction.

3. **Does the domain split naturally?**
   - Yes (even/odd, positive/negative/zero, n < k / n ≥ k) → Try proof by cases.
   - No → Direct or contradiction.

- Present as a visual flowchart (described textually, since we cannot embed images).
- **PanelSwitcher:** Show the same theorem attacked by two different techniques, comparing the resulting proofs.

### 3. Common Mistakes in Proofs

#### 3a. Converse Error

- **The mistake:** Proving Q → P instead of P → Q. "If it rains, the ground is wet" does NOT prove "if the ground is wet, it rained."
- **Code analog:** Testing the output matches expected does NOT prove the function is correct (it could be correct by coincidence for that input).
- **How to avoid:** Always check which direction the implication goes. Write the hypothesis and conclusion explicitly before starting the proof.

#### 3b. Circular Reasoning (Begging the Question)

- **The mistake:** Using the conclusion as a step in the proof. "Prove a + b = b + a. Proof: by commutativity, a + b = b + a." — You used the thing you are proving.
- **Code analog:** Defining a function in terms of itself without a base case (infinite recursion, not meaningful recursion).
- **How to avoid:** List your allowed tools (axioms, definitions, previously proven results). If the conclusion is not on that list, you cannot use it.

#### 3c. Assuming the Conclusion

- **The mistake:** Starting with the statement to be proved and manipulating it until you reach something true. "We need to prove a² + b² ≥ 2ab. Well, a² + b² - 2ab ≥ 0, which is (a - b)² ≥ 0, which is always true." — The steps are individually valid but the DIRECTION is wrong. You started from the conclusion and reached a known truth. That is the reverse of a proof.
- **How to fix:** Reverse the chain. Start from (a - b)² ≥ 0 (known true), and derive a² + b² ≥ 2ab. Now the proof is valid.
- **Code analog:** Starting with the expected output and working backward to find an input that produces it. That is reverse engineering, not forward correctness.

#### 3d. Incorrect Use of Counterexample

- **The mistake:** Using a counterexample to try to prove a universal statement. "Prove all primes are odd. Counterexample: 7 is prime and odd." — That is ONE case, not all cases (and 2 is the actual counterexample that disproves it).
- **Correct use:** A single counterexample DISPROVES a universal statement. "All primes are odd" is disproved by the counterexample 2 (which is prime and even).
- **Key rule:** One counterexample disproves ∀. It takes proof (not examples) to prove ∀.

#### 3e. Proof by Example (Not a Proof)

- **The mistake:** Checking a few cases and claiming the result holds universally. "2 + 4 = 6 (even), 4 + 6 = 10 (even), so even + even = always even." — Three examples do not cover all pairs of even numbers.
- **How to avoid:** Examples build intuition. Proofs establish truth. The gap between them is infinite.

### 4. Proof by Counterexample

**DIFCP treatment — disproving false statements.**

- **Definition:** To disprove ∀x P(x), find ONE specific c such that P(c) is false. This single counterexample proves ∃x ¬P(x), which is the negation of ∀x P(x).
- **Examples:**
  - Disprove "for all n, n² > n." Counterexample: n = 1, 1² = 1, not > 1. (Or n = 0.)
  - Disprove "for all primes p, p is odd." Counterexample: p = 2.
  - Disprove "for all functions f, f(a + b) = f(a) + f(b)." Counterexample: f(x) = x², then f(1+2) = 9 but f(1) + f(2) = 5.
- **Developer connection:** Unit tests that find bugs are counterexamples. One failing test disproves "my function works for all inputs."

### 5. Proof: De Morgan's Laws for Sets (Proof Portfolio)

**Full proof using element-chasing / mutual subset inclusion.**

- **Theorem:** For any sets A and B: (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ.
- **Proof strategy:** Prove set equality by showing mutual inclusion (⊆ both directions).
- **Proof (⊆ direction):** Let x ∈ (A ∪ B)ᶜ. Then x ∉ (A ∪ B). Then x ∉ A and x ∉ B (by definition of union). Then x ∈ Aᶜ and x ∈ Bᶜ. Then x ∈ Aᶜ ∩ Bᶜ.
- **Proof (⊇ direction):** Let x ∈ Aᶜ ∩ Bᶜ. Then x ∈ Aᶜ and x ∈ Bᶜ. Then x ∉ A and x ∉ B. Then x ∉ (A ∪ B). Then x ∈ (A ∪ B)ᶜ.
- **Annotation:** This proof technique (element-chasing for set equality) will be used extensively in Phase 2. Also note: this is De Morgan's law again, just for sets instead of propositions. The same pattern keeps appearing.

### 6. Proof by Cases Example (Proof Portfolio)

- **Theorem:** For all integers n, n² + n is even.
- **Proof by cases:** Case 1: n is even. n = 2k, so n² + n = 4k² + 2k = 2(2k² + k), which is even. Case 2: n is odd. n = 2k+1, so n² + n = (2k+1)² + (2k+1) = 4k² + 4k + 1 + 2k + 1 = 4k² + 6k + 2 = 2(2k² + 3k + 1), which is even.
- Cases are exhaustive (every integer is even or odd), so the result holds for all integers. ∎

### 7. The Proof-Writing Workflow

A step-by-step process for approaching any new theorem:

1. **Understand the statement.** Write the hypothesis and conclusion explicitly. Identify all quantifiers.
2. **Try examples.** Compute specific cases. Build intuition for WHY the statement might be true.
3. **Choose a technique.** Use the decision tree from Section 2.
4. **Write a scratch proof.** Focus on getting the logic right, not the presentation.
5. **Verify each step.** Can you justify every step with a definition, axiom, or previously proven result?
6. **Write the clean proof.** State the technique upfront, label each step, end with ∎.
7. **Review.** Read it as a skeptic. Would you accept this in a code review?

### 8. Code Companion: proof_strategy.py

- **What it does:** A proof technique selection guide with examples. Given a theorem statement's structure (implication, biconditional, universal, existential, negation), suggests appropriate techniques. Includes a library of common proof patterns with templates.
- **Key functions:** `suggest_technique(statement_form)`, `proof_templates` dictionary, `check_counterexample(predicate, domain)`.
- **Expected output:** For input "if P then Q" suggests [direct, contraposition, contradiction] in order. For "for all x, P(x)" suggests [direct with arbitrary x, cases, contradiction]. Includes a counterexample finder that tests a predicate over a domain.

### 9. The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "It works for the cases I tried" — proof by example is not proof, and checking 100 cases does not cover the infinite domain |
| :white_check_mark: **Right** | Choose proof technique based on statement structure. Prove ALL cases (direct, contradiction, cases, existence). Every step cites a justification. Disprove with ONE counterexample. |
| :x: **Too Formal** | Automated theorem provers (Coq, Lean) that verify every logical step mechanically. Useful for safety-critical systems but overkill for learning. |
| :warning: **Common Mistake** | Starting from the conclusion and deriving something true (working backward). The steps may be correct, but the proof direction is wrong. Always start from the hypothesis and work toward the conclusion. |

## Thread Progression

- **Proof Portfolio:** +2 new proofs. (5) De Morgan's laws for sets (mutual inclusion / element-chasing). (6) n² + n is even for all integers (proof by cases). Cumulative: 6 proofs.
- **Code Companion:** `proof_strategy.py` — proof technique selection guide with examples and counterexample finder.
- **Rosen Exercises:**
  - **Essential:** 1.8: 13, 15, 17, 19
  - **Recommended:** 1.8: 21, 23
  - **Challenge:** 1.8: 25

## Further Resources

- **MIT 6.042J Lecture 3** — Proof strategy and common mistakes. Includes worked examples of choosing between techniques.
- **Book of Proof, Chapters 8-9** — Chapter 8: more proof techniques (cases, existence). Chapter 9: disproof by counterexample.
- **How to Prove It by Daniel Velleman, Chapter 3** — Excellent treatment of proof strategy with exercises.

## Key Takeaways

1. Choosing a proof technique is a strategic decision: match the statement form (implication, universal, existential, negative) to the technique (direct, contraposition, contradiction, cases, counterexample).
2. The five most common proof mistakes — converse error, circular reasoning, assuming the conclusion, proof by example, and incorrect counterexample use — map directly to common bugs in code review.
3. One counterexample disproves a universal claim, but no number of examples can prove one. The gap between testing and proving is infinite.

## Writer Notes

- This is the "meta" post about proofs. The reader has done proofs in Parts 4-5; now they learn to think strategically about WHICH technique to use.
- The common mistakes section is crucial. Every mistake should have both a mathematical example and a code analog. The reader should recognize these patterns from their own experience.
- The proof-writing workflow (Section 7) is the actionable takeaway. It gives the reader a repeatable process, not just intuition.
- De Morgan's laws for sets (Section 5) introduces the element-chasing technique for set equality proofs. This foreshadows Phase 2 (sets, functions, relations) where this technique is used heavily.
- The "working backward" mistake (Section 3c) is subtle. Many students do this without realizing it. Show a concrete example where the backward proof looks convincing but is invalid, then show how to reverse it into a valid proof.
- Forward-reference Part 7: "You now have the complete proof toolkit. Part 7 is a change of pace: we see logic in action inside real tools. Package managers run SAT solvers. TypeScript's type system proves theorems. TLA+ formally verifies distributed systems. Logic is not just math — it is running inside your software stack right now."
