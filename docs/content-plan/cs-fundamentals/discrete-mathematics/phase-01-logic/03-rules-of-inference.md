# Part 3: Rules of Inference: Why Your Arguments Have Structure

> Rosen Sections: 1.5-1.6
> Blog file: `apps/web/src/content/blog/discrete-mathematics/03-rules-of-inference.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "Rules of Inference: Why Your Arguments Have Structure"
description: "Learn modus ponens, modus tollens, and other inference rules — the formal logic behind type checking, pattern matching, and debugging."
excerpt: "Type checking is modus ponens. Debugging by elimination is disjunctive syllogism. Every valid argument follows one of eight inference rules — this post teaches all of them."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "logic"]
series: "Discrete Mathematics for Developers"
seriesPart: 3
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

- **Scenario:** TypeScript checks `if x is string, then x.length is number`. You provide `x: string`. TypeScript concludes `x.length: number`. Or: you are debugging, and you know the bug is in module A or module B. You prove it is not in A. You conclude it is in B.
- **Reveal:** The first is modus ponens. The second is disjunctive syllogism. Every valid logical argument, whether in a type checker or in your head during debugging, follows one of a small number of inference rules.
- **Outcome:** By the end, you will know the 8 fundamental inference rules for propositions and 4 for quantifiers, be able to chain them into valid arguments, and have a Python tool that validates inference steps.

## Section Outline

### 1. Why This Matters

- Parts 1-2 gave you the vocabulary (propositions, connectives, predicates, quantifiers). This part gives you the grammar: how to combine true statements to derive new true statements.
- An inference rule is a template for valid reasoning. If you know the premises are true, the conclusion MUST be true. No exceptions.
- Proofs (starting in Part 4) are chains of inference rules. Before you can write proofs, you need to recognize valid inference patterns.

### 2. Nested Quantifiers in Depth (Rosen 1.5)

**Completing the quantifier material from Part 2.**

- Nested quantifiers with mixed types: ∀x ∃y (x + y = 0) over ℤ (for every integer, there exists its negative).
- Translating English to nested quantifiers and back. Common pitfalls: ambiguity in natural language ("every student likes some course").
- Negation of nested quantifiers: push ¬ through each quantifier, flipping as you go. ¬(∀x ∃y P(x,y)) ≡ ∃x ∀y ¬P(x,y).
- Prenex normal form (briefly): moving all quantifiers to the front.
- **Worked example:** "There is no largest integer" formalized as ∀n ∈ ℤ: ∃m ∈ ℤ: m > n. Negate it: ∃n ∈ ℤ: ∀m ∈ ℤ: m ≤ n ("there IS a largest integer") — clearly false over ℤ.

### 3. Rules of Inference for Propositional Logic (Rosen 1.6)

**Eight rules, each with DIFCP-lite treatment: name, formal pattern, developer analogy, example.**

#### 3a. Modus Ponens (Law of Detachment)

- **Pattern:** p → q, p ⊢ q. ("If p then q. p is true. Therefore q.")
- **Developer analogy:** Type checking. "If x is string, then x.length is number. x is string. Therefore x.length is number."
- **Example:** "If it rains, the game is canceled. It rains. Therefore the game is canceled."

#### 3b. Modus Tollens

- **Pattern:** p → q, ¬q ⊢ ¬p. ("If p then q. q is false. Therefore p is false.")
- **Developer analogy:** Debugging by consequence. "If the config is correct, the service starts. The service didn't start. Therefore the config is wrong."
- **Example:** "If the function is pure, it produces the same output for the same input. It produces different output. Therefore the function is not pure."

#### 3c. Hypothetical Syllogism

- **Pattern:** p → q, q → r ⊢ p → r. (Chaining implications.)
- **Developer analogy:** Middleware chains. "If request is authenticated, it reaches the handler. If it reaches the handler, it writes to the database. Therefore, if the request is authenticated, it writes to the database."
- **Example:** Function composition: if f maps A to B and g maps B to C, then g∘f maps A to C.

#### 3d. Disjunctive Syllogism

- **Pattern:** p ∨ q, ¬p ⊢ q. ("p or q is true. p is false. Therefore q.")
- **Developer analogy:** Debugging by elimination. "The bug is in the frontend or the backend. I verified the frontend is correct. Therefore the bug is in the backend."
- **Example:** Pattern matching with exhaustive cases.

#### 3e. Addition

- **Pattern:** p ⊢ p ∨ q. ("If p is true, then p or q is true" for any q.)
- **Developer analogy:** Widening a type. If `x: number`, then `x: number | string`. Adding more options to a union type is always valid.

#### 3f. Simplification

- **Pattern:** p ∧ q ⊢ p. ("If p and q are both true, then p is true.")
- **Developer analogy:** Destructuring. `const { name, age } = user;` — if you have the whole object, you can extract any field.

#### 3g. Conjunction

- **Pattern:** p, q ⊢ p ∧ q. ("If p is true and q is true, then p and q is true.")
- **Developer analogy:** Combining validations. "Input passes schema check AND input passes business rule check, therefore input is valid."

#### 3h. Resolution

- **Pattern:** p ∨ q, ¬p ∨ r ⊢ q ∨ r.
- **Developer analogy:** SAT solver mechanics. Resolution is the core rule used in automated theorem proving and SAT solvers (foreshadow Part 7).

**ComparisonTable:** All 8 rules with name, formal pattern, and one-line developer analogy.

:::note
**Proof preview (foreshadow Part 4):** Inference rules are the building blocks of proofs. Each rule is a single step: "if I know these premises, I can conclude this." Part 4 puts them together: you will write your first complete proof from scratch, chaining these rules into an argument that starts with assumptions and ends with a proven conclusion.
:::

### 4. Rules of Inference for Quantified Statements

#### 4a. Universal Instantiation

- **Pattern:** ∀x P(x) ⊢ P(c) for any c in the domain.
- "If all users must have emails, then this specific user must have an email."

#### 4b. Universal Generalization

- **Pattern:** P(c) for arbitrary c ⊢ ∀x P(x).
- "If we proved it for an arbitrary element (without assuming anything special about it), it holds for all elements."

#### 4c. Existential Instantiation

- **Pattern:** ∃x P(x) ⊢ P(c) for some specific c.
- "If there exists a user with no email, call that user c and work with c."

#### 4d. Existential Generalization

- **Pattern:** P(c) for some specific c ⊢ ∃x P(x).
- "If this specific user has no email, then there exists a user with no email."

### 5. Building Valid Arguments

- An argument is a sequence of propositions (premises) leading to a conclusion.
- An argument is valid if the conclusion follows from the premises by applying inference rules.
- **Worked example:** Build a multi-step argument using modus ponens + hypothetical syllogism. Show each step labeled with the rule used.
- **Worked example with quantifiers:** "All programmers drink coffee. Alice is a programmer. Therefore Alice drinks coffee." (Universal instantiation + modus ponens.)
- Distinguishing valid arguments from true conclusions. A valid argument with false premises can reach a false conclusion. Validity is about structure, not truth.

### 6. Fallacies: Invalid Inference Patterns

- **Affirming the consequent:** p → q, q ⊢ p (INVALID). "If it rains, the ground is wet. The ground is wet. Therefore it rained." — Wrong, the sprinkler could be on.
- **Denying the antecedent:** p → q, ¬p ⊢ ¬q (INVALID). "If it rains, the game is canceled. It didn't rain. Therefore the game wasn't canceled." — Wrong, could be canceled for other reasons.
- Why these matter: these are the bugs in logical reasoning that correspond to real bugs in code (incorrect assumptions, incomplete case analysis).

### 7. Code Companion: inference_checker.py

- **What it does:** Takes a set of premises and a conclusion, identifies which inference rule (if any) justifies the step, validates multi-step arguments.
- **Key functions:** `modus_ponens(p_implies_q, p)`, `modus_tollens(p_implies_q, not_q)`, `validate_argument(premises, steps, conclusion)`.
- **Expected output:** Validates sample arguments step by step, flagging invalid steps. Demonstrates a 3-step argument using modus ponens and hypothetical syllogism.

### 8. The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "If A then B, and A, so B" — works for simple cases but falls apart with complex nested reasoning or quantified statements |
| :white_check_mark: **Right** | Eight named propositional rules + four quantifier rules form a complete toolkit for valid deductive reasoning. Each step in an argument must cite a specific rule. |
| :x: **Too Formal** | Natural deduction systems, sequent calculus, Gentzen-style proof trees |
| :warning: **Common Mistake** | Affirming the consequent: from p → q and q, concluding p. "If the code compiles, it's correct. The code is correct. Therefore it compiled." — Not valid; it could be interpreted code. |

## Thread Progression

- **Proof Portfolio:** No new proofs (inference rule application only). Proofs begin in Part 4.
- **Code Companion:** `inference_checker.py` — validates inference rule applications in multi-step arguments.
- **Rosen Exercises:**
  - **Essential:** 1.5: 1, 3, 5, 7, 11; 1.6: 1, 3, 5, 7, 11
  - **Recommended:** 1.5: 15, 23; 1.6: 15, 23
  - **Challenge:** 1.5: 23 (complex nested quantifier); 1.6: 23 (multi-step argument)

## Further Resources

- **MIT 6.042J Lectures 1-2** — Covers inference rules in the context of proof methods. Lecture 2 begins applying them to proofs.
- **Book of Proof, Chapter 2** — Logic section covering inference rules with practice exercises.
- **Neso Academy: Rules of Inference** — Video walkthrough of all 8 propositional inference rules with examples.

## Key Takeaways

1. Every valid argument is a chain of inference rules: modus ponens (type checking), modus tollens (debugging by consequence), disjunctive syllogism (process of elimination).
2. Affirming the consequent and denying the antecedent are the two most common logical fallacies, and they correspond directly to incorrect debugging assumptions in code.
3. The inference rules from this post are the atoms of proof. Starting in Part 4, every proof you write will be a sequence of these rules applied to premises until you reach your conclusion.

## Writer Notes

- This is the last "vocabulary building" part before proofs begin. The reader should feel equipped and eager, not overwhelmed.
- Developer analogies are critical here. Each inference rule needs a concrete code scenario, not just a logical formula. The reader should think "I use this pattern all the time."
- The fallacies section is important because it previews common proof mistakes that Part 6 will cover in depth. Plant the seed here.
- Nested quantifiers (Rosen 1.5) were partially covered in Part 2. This part completes the coverage with the depth Rosen expects: negation of nested quantifiers, translating between English and formal logic.
- Forward-reference Part 4 in What's Coming: "You now have the full toolkit: propositions, predicates, quantifiers, and inference rules. Part 4 puts them to work. You will write your first real proofs — direct proof and proof by contraposition — and discover that the mental motion is exactly the same as writing a function that transforms a precondition into a postcondition."
