# Part 1: Propositions and Logic Gates: What `if` Statements Really Mean

> Rosen Sections: 1.1-1.2
> Blog file: `apps/web/src/content/blog/discrete-mathematics/01-propositions-and-logic-gates.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "Propositions and Logic Gates: What if Statements Really Mean"
description: "Learn propositional logic, truth tables, and De Morgan's laws — the formal rules behind every boolean expression you write in code."
excerpt: "Every if statement is a proposition. Every && is conjunction. You have been doing propositional logic your entire career — this post gives you the formal rules."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "logic"]
series: "Discrete Mathematics for Developers"
seriesPart: 1
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

**High-stakes narrative, not just relatability.** The opening tells a real production bug story before any formal definitions.

- **Story:** An access control check in a production system used `not active and not admin` instead of `not (active and admin)`. Inactive admins bypassed the check. The bug went to production and was not caught for three days because the logic "looked right" to every code reviewer. The fix was one line. The rule that prevents this bug has a name: De Morgan's law. It takes 10 seconds to apply once you know it.
- **Escalation:** This is just the first rule. There are dozens. They are the algebra of boolean expressions. Not knowing them means you are doing arithmetic by guessing.
- **Reveal:** Every `if` statement is a proposition. Every `&&` is conjunction. Every `||` is disjunction. You have been doing propositional logic your entire career. The formal rules exist. They are not hard. And they turn "I think this is right" into "I can prove this is right."
- **Outcome:** By the end, you will know the formal rules behind boolean expressions, be able to simplify any compound condition using algebraic laws, and have a Python truth table generator that verifies your work.

## Section Outline

### 1. Why This Matters

**Focus on consequences, not just relevance.** Do not just say "every if statement is a proposition." Show the cost of not knowing:

- Complex conditions in production code that no reviewer can confidently verify
- Boolean expressions that "probably work" but no one can prove
- Code review comments that say "I think this is right?" instead of "this is equivalent because [rule]"
- The gap between "I can write code" and "I can reason about code"

This is the first post in the CS Fundamentals track. Set the tone: math is not separate from code, it IS the specification your code implements.

### 2. Propositions: True or False, Nothing Else

**DIFCP treatment with conceptual on-ramp.**

- **On-ramp (before the definition box):** "You already work with propositions. Every boolean variable is one. `isActive`, `hasPermission`, `isConnected`. The formal name is proposition. The formal rule is: exactly two values, true or false, nothing else."
- **Definition:** A proposition is a declarative sentence that is either true or false, but not both. Propositions have a truth value.
- **Examples that are propositions:** "5 > 3" (true), "Python is a compiled language" (false), "The current user is authenticated" (depends on state, but has a definite truth value at any moment).
- **Examples that are NOT propositions:** "Close the door" (command), "Is x > 5?" (question), "x + 1 = 3" (open sentence, depends on x — becomes a predicate in Part 2).
- **Notation:** Propositional variables p, q, r, s. Convention: lowercase letters. Build from familiar (boolean variables) to new (propositional variables p, q, r).
- **Code connection:** Every boolean variable in your program is a proposition. `isActive`, `hasPermission`, `isConnected` are all propositions.

### 3. Logical Connectives: The Five Operators

Each connective gets a mini-DIFCP cycle with definition, truth table, code equivalent, and developer intuition.

#### 3a. Negation (NOT, ¬)

- **Definition:** ¬p is true when p is false, and false when p is true.
- **Truth table:** 2 rows.
- **Code:** `not p` (Python), `!p` (JS/C/Java).
- **Intuition:** Flips the truth value. The simplest operator.

#### 3b. Conjunction (AND, ∧)

- **Definition:** p ∧ q is true when both p and q are true.
- **Truth table:** 4 rows.
- **Code:** `p and q` (Python), `p && q` (JS).
- **Intuition:** Both conditions must hold. This is the `&&` you write daily.

#### 3c. Disjunction (OR, ∨)

- **Definition:** p ∨ q is true when at least one of p or q is true (inclusive OR).
- **Truth table:** 4 rows.
- **Code:** `p or q` (Python), `p || q` (JS).
- **Intuition:** At least one condition must hold. Note: inclusive, not exclusive. "Soup or salad" in English is exclusive; ∨ in math is inclusive.

#### 3d. Exclusive Or (XOR, ⊕)

- **Definition:** p ⊕ q is true when exactly one of p or q is true, but not both.
- **Truth table:** 4 rows.
- **Code:** `p ^ q` (Python/JS on booleans).
- **Intuition:** The "one or the other but not both" operator. Used in cryptography (XOR cipher), parity checks, toggle logic.

#### 3e. Implication (→)

- **Definition:** p → q is false only when p is true and q is false. In all other cases, it is true.
- **Truth table:** 4 rows. The key row: F → F is true, F → T is true. "Vacuous truth" when the hypothesis is false.
- **Code:** `not p or q` (Python), `!p || q` (JS). No direct operator in most languages.
- **Intuition:** "If the precondition holds, the postcondition must hold." If the precondition is false, the implication is trivially satisfied. This is the most unintuitive connective for programmers. Example: "If pigs fly, then I'm the queen of England" is a TRUE implication.
- **Developer connection:** Function contracts. "If input is a valid email, output is a User object." When input is invalid, the contract says nothing — the implication is vacuously true.

#### 3f. Biconditional (↔)

- **Definition:** p ↔ q is true when p and q have the same truth value (both true or both false).
- **Truth table:** 4 rows.
- **Code:** `p == q` (Python on booleans), `p === q` (JS on booleans).
- **Intuition:** "If and only if." Type equivalence: two types are compatible ↔ they satisfy the same interface.

**ComparisonTable:** Map all 6 operators: Math symbol, Python, JavaScript, meaning.

### 4. Compound Propositions and Operator Precedence

- Building complex expressions: (p ∨ q) ∧ ¬r
- **Precedence order:** ¬ (highest), ∧, ∨, →, ↔ (lowest). Same as programming: `!` before `&&` before `||`.
- Parentheses override precedence, just like in code.
- Example: parse `p ∨ q ∧ r` — this is `p ∨ (q ∧ r)`, NOT `(p ∨ q) ∧ r`. Same gotcha as `x || y && z` in code.
- **PanelSwitcher:** Show the same expression in formal notation and Python side by side.

### 5. Truth Tables for Compound Propositions

- How to build a truth table: one column per variable, one per sub-expression, final column for the full expression.
- n variables → 2^n rows. 2 variables → 4 rows. 3 variables → 8 rows. 10 variables → 1,024 rows (this is why truth tables don't scale, foreshadowing SAT solvers in Part 7).
- Worked example: build full truth table for (p → q) ∧ (q → r) → (p → r) (hypothetical syllogism preview).

### 6. De Morgan's Laws

**DIFCP treatment — the centerpiece of Part 1.**

- **Definition:** ¬(p ∧ q) ≡ ¬p ∨ ¬q and ¬(p ∨ q) ≡ ¬p ∧ ¬q.
- **Intuition:** "Push the negation in, flip the operator." NOT(A AND B) = (NOT A) OR (NOT B). NOT(A OR B) = (NOT A) AND (NOT B).
- **Formal:** Truth table verification (both laws, all 4 rows each).
- **Code:** `!(a && b)` === `(!a || !b)` and `!(a || b)` === `(!a && !b)`.
- **Developer connection:** This is the rule you use every time you negate a compound condition. "If not (active AND admin)" = "if (not active OR not admin)." Getting this wrong is one of the most common boolean bugs in production code.
- **Extended example:** Negate `if (isLoggedIn && (isAdmin || isOwner))` step by step using De Morgan's.
- **Running thread:** Reference back to the opening bug. "Remember the access control bug from the opening? Here's exactly what went wrong, step by step." Give the formal De Morgan's treatment of the specific bug.

:::note
**Proof preview (foreshadow Part 4):** What we just did — checking every row of a truth table — is a proof technique called **proof by exhaustion**. It works when there are finitely many cases. In Part 4, we will learn proof techniques that work when there are infinitely many cases.
:::

### 7. Short-Circuit Evaluation

- How `&&` and `||` short-circuit in most languages: `p && q` skips evaluating q if p is false; `p || q` skips evaluating q if p is true.
- This is a computational optimization that matches the truth table: if p is false, p ∧ q is false regardless of q.
- Connection to implication: guard clauses like `if (obj != null && obj.value > 0)` rely on short-circuit semantics. If obj is null, the second operand is never evaluated.
- Caution: short-circuit evaluation is a property of the LANGUAGE, not the LOGIC. In formal logic, both operands always have truth values.

### 8. Tautologies, Contradictions, and Contingencies

- **Tautology:** A proposition that is ALWAYS true regardless of variable values. Example: p ∨ ¬p (law of excluded middle).
- **Contradiction:** A proposition that is ALWAYS false. Example: p ∧ ¬p.
- **Contingency:** A proposition that is sometimes true, sometimes false. Most real-world propositions are contingencies.
- Why this matters: tautologies are the "always-pass" test cases. Contradictions are dead code (unreachable branches). Contingencies are the interesting cases where logic matters.

### 9. Logical Equivalence

- **Definition:** Two propositions are logically equivalent (≡) when they have the same truth value for every possible assignment of variables. Equivalently, p ≡ q means p ↔ q is a tautology.
- Key equivalences to know: De Morgan's laws, double negation (¬¬p ≡ p), distributive laws, absorption, identity, domination, idempotent, commutative, associative.
- Table of important logical equivalences (named laws).
- These are the algebraic rules for simplifying boolean expressions — the same rules your compiler uses for optimization.

### 10. Code Companion: truth_table.py

- **What it does:** Takes a propositional expression as a string (or lambda), generates the complete truth table, identifies whether it is a tautology, contradiction, or contingency.
- **Key functions:** `truth_table(expression, variables)`, `evaluate(expression, assignment)`, `is_tautology(expression)`, `is_contradiction(expression)`.
- **Expected output:** Formatted truth table for any user-supplied expression, with final classification.
- Uses Python's `itertools.product` for generating all combinations of True/False.
- Example usage: verify De Morgan's laws by showing both sides produce identical truth table columns.

### 11. The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "AND means both things are true" — breaks when you hit edge cases like short-circuit evaluation, three-valued logic (SQL NULL), or vacuous truth in implications |
| :white_check_mark: **Right** | Propositions have exactly two truth values. The 5 connectives are defined by their truth tables. De Morgan's laws let you push negation through conjunction/disjunction. Implication is false only when the hypothesis is true and the conclusion is false. |
| :x: **Too Formal** | Defining propositional logic via the Sheffer stroke (NAND), then deriving all connectives from a single operator. Functional completeness proofs. |
| :warning: **Common Mistake** | Writing `!(a && b)` as `(!a && !b)` instead of the correct `(!a || !b)`. This is De Morgan's law applied wrong — you flip the operator when you push the negation in. |

## Thread Progression

- **Proof Portfolio:** No new proofs (truth table verification only). The proof portfolio begins in Part 4.
- **Code Companion:** `truth_table.py` — generates truth tables for any propositional expression, classifies as tautology/contradiction/contingency.
- **Rosen Exercises:**
  - **Essential:** 1.1: 1, 3, 5, 7, 11, 15; 1.2: 1, 3, 5
  - **Recommended:** 1.1: 23, 25; 1.2: 7, 11
  - **Challenge:** 1.1: 31; 1.2: 15

## Embedded References (inline in the post body)

Place 3-4 references at points of maximum relevance in the post:

1. **After De Morgan's truth table proof:** "MIT 6.042J Lecture 1 walks through this same proof in the first 20 minutes — useful if you prefer video."
2. **After the implication section:** "If vacuous truth is still bugging you, Book of Proof Chapter 2 has an excellent extended treatment with more examples."
3. **After the logical equivalences table:** "Rosen Section 1.2 has 25+ exercises drilling these equivalences — worth doing if you want them to feel automatic."

## Further Resources

Curated summary of inline references plus additional items:

- **MIT 6.042J Lecture 1** — Propositional logic, truth tables, and logical operators. The first 30 minutes cover exactly this material.
- **Book of Proof, Chapter 2** (Richard Hammack) — Logic chapter with exercises, including extended treatment of implication and vacuous truth.
- **Neso Academy: Propositional Logic playlist** — Video walkthrough of all connectives with truth table examples.
- **Coursera: Introduction to Discrete Mathematics (UCSD), Week 1** — Propositional logic with autograded exercises.

## Key Takeaways

1. Every `if` statement evaluates a proposition, and the 5 logical connectives (NOT, AND, OR, XOR, implication) are its building blocks.
2. De Morgan's laws — push the negation in, flip the operator — are the single most useful logical equivalence for everyday programming.
3. Implication (p → q) is true whenever p is false, which is unintuitive but matches how function contracts and guard clauses work.

## Writer Notes

- Part 0 now handles the "why should a developer care about discrete math" motivation. Part 1 opens with a specific production bug story (high stakes), not a generic relatability hook (low stakes). The reader should feel the cost of not knowing De Morgan's law before they see the first definition.
- Ease into definitions using the Conceptual On-Ramp pattern from STYLE-GUIDE.md. Before the first "Definition: Proposition" box, connect to boolean variables the reader already uses daily.
- Embed 3-4 references inline at points of maximum relevance (after De Morgan's proof, after implication, after equivalences table). The Further Resources section is a curated summary plus extras.
- Include the proof preview note after De Morgan's truth table verification: "What we just did is proof by exhaustion. Part 4 teaches techniques that work for infinitely many cases."
- De Morgan's laws are the hero concept. Use the opening bug as a running thread: reference it again when teaching De Morgan's formally, showing step by step what went wrong.
- Implication deserves the most space among the connectives. It is the most unintuitive for programmers and the most important for proof writing (which starts in Part 4).
- Keep truth tables visual. Use actual table markdown, not prose descriptions of rows.
- The ComparisonTable mapping all 6 operators (Math, Python, JS, meaning) is the reference table readers will come back to. Make it prominent.
- Forward-reference Part 2 (predicate logic) in the What's Coming section.
