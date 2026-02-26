# Part 2: Predicate Logic: From Booleans to Quantifiers

> Rosen Sections: 1.3-1.4
> Blog file: `apps/web/src/content/blog/discrete-mathematics/02-predicate-logic.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "Predicate Logic: From Booleans to Quantifiers"
description: "Learn predicate logic, universal and existential quantifiers, and how they map to SQL WHERE clauses, .every(), .some(), and loop patterns."
excerpt: "SQL WHERE clauses are predicate logic. JavaScript's .every() is the universal quantifier. .some() is the existential quantifier. This post formalizes the logic you already use."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "logic"]
series: "Discrete Mathematics for Developers"
seriesPart: 2
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

- **Scenario:** You write `SELECT * FROM users WHERE age > 18 AND is_active = true`. Or `users.filter(u => u.age > 18 && u.isActive)`. Or `users.every(u => u.hasVerifiedEmail)`.
- **Reveal:** The WHERE clause is a predicate. `.every()` is the universal quantifier ∀. `.some()` is the existential quantifier ∃. You have been writing predicate logic every time you filter or validate a collection.
- **Outcome:** By the end, you will know the formal rules for predicates and quantifiers, understand nested quantifiers as nested loops, and have a Python tool that evaluates quantified predicates over finite domains.

## Section Outline

### 1. Why This Matters

- Propositional logic (Part 1) deals with fixed true/false values. Real code deals with variables: "is this user active?", "does this item satisfy the filter?", "do ALL elements pass the test?"
- Predicate logic adds variables and quantifiers to propositional logic. This is the jump from `true && false` to `users.every(u => u.isActive)`.
- Understanding quantifiers precisely prevents a whole class of bugs: confusing "all" with "some", getting negation of quantified statements wrong, misunderstanding empty-collection edge cases.

### 2. Propositional Equivalences (Rosen 1.3)

**Brief section — bridge from Part 1 to new material.**

- Named logical equivalences: identity, domination, idempotent, double negation, commutative, associative, distributive, De Morgan's, absorption, negation laws.
- Organized as a reference table (this is the "algebra of propositions").
- How to use equivalences: show that (p → q) ≡ (¬p ∨ q) using truth table AND using equivalence laws.
- Satisfiability: a compound proposition is satisfiable if there exists an assignment making it true. Connection to SAT (foreshadow Part 7).

### 3. Predicates

**DIFCP treatment.**

- **Definition:** A predicate is a statement containing one or more variables that becomes a proposition when the variables are given specific values. P(x): "x > 5" is a predicate. P(3) is false. P(7) is true.
- **Intuition:** A predicate is a function that returns a boolean. `def is_active(user): return user.is_active` is a predicate on users.
- **Formal:** P(x) with domain D. The domain specifies what values x can take. P(x) is NOT a proposition until x has a value.
- **Code:** `lambda x: x > 5` is literally a predicate. `filter(predicate, collection)` applies a predicate to each element.
- **Multi-variable predicates:** Q(x, y): "x + y = 10". Q(3, 7) is true. Database relations are n-ary predicates (Rosen 9.2 preview).

### 4. Universal Quantifier (∀)

**DIFCP treatment.**

- **Definition:** ∀x P(x) means "P(x) is true for EVERY x in the domain." One false case makes ∀x P(x) false.
- **Intuition:** `.every()` in JavaScript, `all()` in Python, `∀` in math. ∀x P(x) is a giant AND: P(x₁) ∧ P(x₂) ∧ ... ∧ P(xₙ) when the domain is finite.
- **Formal:** ∀x P(x) over domain D = {d₁, d₂, ..., dₙ} is equivalent to P(d₁) ∧ P(d₂) ∧ ... ∧ P(dₙ).
- **Code:** `all(P(x) for x in domain)` in Python.
- **Edge case:** ∀x P(x) is TRUE when the domain is empty (vacuous truth). `[].every(x => x > 0)` returns `true` in JavaScript. This is mathematically correct and catches many developers off guard.
- **PanelSwitcher:** Show ∀x P(x) in formal notation alongside Python `all()`.

### 5. Existential Quantifier (∃)

**DIFCP treatment.**

- **Definition:** ∃x P(x) means "there exists at least one x in the domain such that P(x) is true." One true case makes ∃x P(x) true.
- **Intuition:** `.some()` in JavaScript, `any()` in Python, `EXISTS` in SQL. ∃x P(x) is a giant OR: P(x₁) ∨ P(x₂) ∨ ... ∨ P(xₙ).
- **Formal:** ∃x P(x) over domain D = {d₁, ..., dₙ} is equivalent to P(d₁) ∨ P(d₂) ∨ ... ∨ P(dₙ).
- **Code:** `any(P(x) for x in domain)` in Python.
- **Edge case:** ∃x P(x) is FALSE when the domain is empty. `[].some(x => x > 0)` returns `false`. The dual of the ∀ edge case.

### 6. Negation of Quantifiers (De Morgan's for Quantifiers)

**Key concept — the most common source of bugs with quantified statements.**

- **Rules:** ¬(∀x P(x)) ≡ ∃x ¬P(x) and ¬(∃x P(x)) ≡ ∀x ¬P(x).
- **Intuition:** "Not all students passed" = "there exists a student who didn't pass." "No student passed" = "for all students, they didn't pass."
- **Code:** `not all(P(x) for x in D)` ≡ `any(not P(x) for x in D)`.
- This is De Morgan's law (Part 1) generalized from AND/OR to ∀/∃. The pattern is the same: push negation through, flip the quantifier.
- **Worked example:** Negate "Every user in the system has verified their email." Step by step: ¬(∀u ∈ Users: verified(u)) ≡ ∃u ∈ Users: ¬verified(u) = "There exists a user who has NOT verified their email."

:::note
**Proof preview (foreshadow Part 4):** Flipping a quantifier during negation is not something we proved here — we verified it with examples and showed it follows the same pattern as De Morgan's law for AND/OR. Part 4 teaches how to prove that this works in general, not just for the examples we checked.
:::

### 7. Nested Quantifiers

**DIFCP treatment.**

- **Definition:** Quantifiers can be nested: ∀x ∃y P(x, y) means "for every x, there exists a y such that P(x,y)."
- **Order matters:** ∀x ∃y P(x, y) ≠ ∃y ∀x P(x, y) in general. Example: "every student has a favorite teacher" (∀s ∃t Fav(s,t)) vs "there is a teacher who is every student's favorite" (∃t ∀s Fav(s,t)).
- **Connection to nested loops:** ∀x ∃y P(x, y) maps to `all(any(P(x,y) for y in Y) for x in X)`. The outer quantifier is the outer loop.
- Table: map each quantifier combination (∀∀, ∀∃, ∃∀, ∃∃) to a nested loop pattern and a plain-English reading.
- **Worked example:** Express "for every row in the matrix, there exists a column where the value is zero" using nested quantifiers, then convert to Python.

### 8. Connection to SQL and Array Methods

- SQL WHERE = predicate applied to each row (implicit ∀ over result set).
- SQL EXISTS subquery = ∃.
- SQL NOT EXISTS = ¬∃ = ∀...¬.
- JavaScript `.every()` = ∀, `.some()` = ∃, `.filter()` = select elements satisfying predicate.
- Python `all()` = ∀, `any()` = ∃, list comprehension with condition = filter.
- **ComparisonTable:** Map ∀, ∃, ¬∀, ¬∃ to SQL, JavaScript, and Python equivalents.

### 9. Code Companion: predicate_eval.py

- **What it does:** Evaluates quantified predicates over finite domains, supports nesting, and demonstrates negation of quantifiers.
- **Key functions:** `for_all(predicate, domain)`, `exists(predicate, domain)`, `negate_quantifier(expr)`, evaluation of nested quantifier expressions.
- **Expected output:** Evaluates sample predicates like "∀x ∈ {1..10}: x² > x" (false, x=1 is counterexample), "∃x ∈ {1..10}: x² = x" (true, x=1), and demonstrates that ¬∀ ≡ ∃¬.

### 10. The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "For all means everything, there exists means something" — breaks when you hit empty domains, nested quantifiers, or order-dependent quantification |
| :white_check_mark: **Right** | ∀ is a giant AND over the domain, ∃ is a giant OR. Negating a quantifier flips it (De Morgan's generalized). Order of nested quantifiers matters. Empty domain makes ∀ vacuously true. |
| :x: **Too Formal** | Second-order logic, quantifying over predicates themselves. Herbrand universes. |
| :warning: **Common Mistake** | Swapping quantifier order: ∀x ∃y P(x,y) ("everyone has a buddy") is weaker than ∃y ∀x P(x,y) ("one person is everyone's buddy"). In code: the inner loop can pick a different y for each x. |

## Thread Progression

- **Proof Portfolio:** No new proofs (quantifier verification, truth table and evaluation only). Proofs begin Part 4.
- **Code Companion:** `predicate_eval.py` — evaluates quantified predicates over finite domains, demonstrates quantifier negation.
- **Rosen Exercises:**
  - **Essential:** 1.3: 1, 3, 5, 7, 11; 1.4: 1, 3, 5, 7, 11
  - **Recommended:** 1.3: 15, 23; 1.4: 15, 23
  - **Challenge:** 1.3: 31; 1.4: 25

## Further Resources

- **MIT 6.042J Lectures 1-2** — Propositional equivalences and introduction to predicate logic with quantifiers.
- **Book of Proof, Chapter 1** — Sections on logical equivalences and quantified statements.
- **Neso Academy: Predicate Logic playlist** — Step-by-step video walkthrough of quantifiers and nested quantifiers.

## Key Takeaways

1. A predicate is a boolean function — `lambda x: x > 5` is literally predicate logic, and every SQL WHERE clause is a predicate applied to rows.
2. ∀ is `.every()` / `all()`, ∃ is `.some()` / `any()`, and negating a quantifier flips it to the other — the same push-in-and-flip pattern as De Morgan's laws.
3. The order of nested quantifiers matters: ∀x ∃y (everyone has a buddy) is fundamentally different from ∃y ∀x (one person is everyone's buddy), just as the order of nested loops determines what gets computed.

## Writer Notes

- The SQL/array-method connection is the primary hook for developers. Make it concrete and early. Show actual SQL queries and actual `.every()`/`.some()` calls.
- The empty-domain edge case (∀ over empty = true, ∃ over empty = false) catches developers off guard. Demonstrate it with `[].every(x => false)` returning `true` in JavaScript.
- Nested quantifiers = nested loops is the key insight for developers. A two-column table mapping ∀∀, ∀∃, ∃∀, ∃∃ to nested `all()`/`any()` calls makes this concrete.
- Propositional equivalences (Rosen 1.3) are brief here because most were introduced in Part 1 (De Morgan's, double negation). This section organizes them into a reference table, then moves on to the new material (predicates and quantifiers from 1.4).
- Forward-reference Part 3 in What's Coming: "You now have propositions, connectives, predicates, and quantifiers — the vocabulary of logic. Part 3 adds the grammar: rules of inference that let you chain logical statements into valid arguments."
