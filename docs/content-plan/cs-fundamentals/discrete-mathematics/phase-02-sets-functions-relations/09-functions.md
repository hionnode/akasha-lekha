# Part 9: Functions: The Most Important Concept in Programming

> Rosen Sections: 2.3, 2.4, 2.5
> Blog file: `apps/web/src/content/blog/discrete-mathematics/09-functions.mdx`
> Estimated word count: 3,500-4,000

## Frontmatter

```yaml
---
title: "Functions: The Most Important Concept in Programming"
description: "Learn injective, surjective, and bijective functions, function composition, and cardinality — why your hash function collides and JSON.stringify isn't invertible."
excerpt: "Hash functions are neither injective nor surjective. JSON.parse composed with JSON.stringify is not the identity function. This post formalizes what functions really are."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "functions", "sets"]
series: "Discrete Mathematics for Developers"
seriesPart: 9
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

- **Scenario:** Your hash function maps strings to 32-bit integers. Two different strings produce the same hash. Your JSON round-trip loses `undefined` values and function properties. Your `map()` chain produces the right result, but you cannot explain why composition order matters.
- **Reveal:** Hash collisions happen because the function is not injective. JSON round-trip fails because `JSON.stringify` is not surjective (not every string is valid JSON) and `JSON.parse(JSON.stringify(x))` is not the identity (it loses information). `map().filter().reduce()` works because function composition is associative.
- **Outcome:** By the end, you will know the formal properties of functions (injective, surjective, bijective), understand function composition and inverse functions, and grasp why some sets are "bigger" than others (cardinality and Cantor's diagonal argument).

## Section Outline

### 1. Why This Matters

- Functions are the most important concept in programming. Every language has them. But the mathematical definition of "function" is more precise than the programming concept.
- Understanding injection/surjection/bijection explains hash collisions, lossy compression, type conversions, and the limits of serialization.
- Function composition is the foundation of functional programming. Associativity of composition is why `pipe()` and `compose()` work as you expect.

### 2. Function Definition

**DIFCP treatment.**

- **Definition:** A function f: A → B assigns to each element a ∈ A exactly one element f(a) ∈ B. A is the domain, B is the codomain, and {f(a) | a ∈ A} is the range (or image).
- **Key distinction:** The codomain is what f COULD map to. The range is what f ACTUALLY maps to. These are often different.
- **Code connection:** `function f(x: number): string` has domain = `number`, codomain = `string`. The range is the set of strings actually returned by f for some input.
- **As a set of pairs:** f = {(a, b) | a ∈ A, b = f(a)} ⊂ A × B. A function IS a relation (preview of Part 10), specifically one where each input maps to exactly one output.
- **Not a function in the math sense:** Random number generators (same input, different output), side-effecting functions (output depends on external state). Mathematically, functions are deterministic and total.

### 3. Injective (One-to-One) Functions

**DIFCP treatment.**

- **Definition:** f: A → B is injective if f(a₁) = f(a₂) implies a₁ = a₂. Equivalently: different inputs always produce different outputs. No two elements of the domain map to the same element of the codomain.
- **Intuition:** "No collisions." If the function never maps two different inputs to the same output, it is injective.
- **Examples:**
  - f(x) = 2x is injective (if 2a = 2b then a = b).
  - f(x) = x² is NOT injective over ℤ (f(3) = f(-3) = 9).
  - A UUID generator is designed to be injective (but only probabilistically).
- **Developer connection:** Hash functions are explicitly NOT injective (pigeonhole principle: infinite inputs, finite outputs). Unique constraints in databases enforce injectivity on columns.

### 4. Surjective (Onto) Functions

**DIFCP treatment.**

- **Definition:** f: A → B is surjective if for every b ∈ B, there exists an a ∈ A such that f(a) = b. The range equals the codomain.
- **Intuition:** "Every output is reachable." No element of the codomain is wasted.
- **Examples:**
  - f: ℤ → ℤ, f(x) = x + 1 is surjective (for any b, f(b-1) = b).
  - f: ℤ → ℤ, f(x) = x² is NOT surjective (no integer squares to -1).
  - `parseInt()` from String → Number is not surjective (not every number is returned by parsing some string, depending on the range you consider).
- **Developer connection:** A router mapping URLs to handlers is surjective if every handler is reachable from some URL. Dead code = a handler that no URL maps to = failure of surjectivity.

### 5. Bijective Functions

**DIFCP treatment.**

- **Definition:** f: A → B is bijective if it is both injective and surjective. Every element of B is mapped to by exactly one element of A.
- **Intuition:** A perfect one-to-one correspondence. Invertible. Reversible.
- **Examples:**
  - f(x) = 2x + 1 from ℤ to odd integers is a bijection.
  - Encryption functions should be bijections (so decryption works).
  - Array indexing: index → element is a bijection for arrays with unique elements.
- **Developer connection:** A bijection means the function has a perfect inverse. Lossless compression must be a bijection (every compressed form maps uniquely back to the original). Lossy compression is injective (into a smaller set) but not surjective (not every possible compressed form corresponds to valid data).

### 6. Function Composition

**DIFCP treatment.**

- **Definition:** Given f: A → B and g: B → C, the composition g ∘ f: A → C is defined by (g ∘ f)(x) = g(f(x)).
- **Notation caution:** g ∘ f applies f first, then g. This reads right-to-left. `pipe()` in FP reads left-to-right. Both are composition; the order of writing differs.
- **Properties:**
  - Associative: (h ∘ g) ∘ f = h ∘ (g ∘ f). This is why `pipe(f, g, h)` and `compose(h, g, f)` both work.
  - NOT commutative in general: g ∘ f ≠ f ∘ g.
  - Identity function: id(x) = x satisfies f ∘ id = id ∘ f = f.
- **Developer connection:** `map(f).map(g)` = `map(g ∘ f)` (functor law). Pipeline operators: `data |> f |> g |> h` is `h(g(f(data)))` = `(h ∘ g ∘ f)(data)`.

### 7. Inverse Functions

- **Definition:** f⁻¹: B → A exists if and only if f is a bijection. f⁻¹(b) = the unique a such that f(a) = b.
- **Left inverse:** g is a left inverse of f if g ∘ f = id_A. Exists iff f is injective.
- **Right inverse:** g is a right inverse of f if f ∘ g = id_B. Exists iff f is surjective.
- **Developer connection:** `JSON.parse` is a left inverse of `JSON.stringify` for JSON-serializable values, but NOT a full inverse because `JSON.stringify` loses information (`undefined`, functions, circular references).

### 8. Sequences as Functions (Rosen 2.4)

- **Definition:** A sequence is a function from a subset of ℤ (usually ℕ) to some set. a₁, a₂, a₃, ... is the function a: ℕ → S where a(n) = aₙ.
- **Arithmetic sequences:** aₙ = a₀ + nd. Geometric sequences: aₙ = a₀ · rⁿ.
- **Summation notation:** Σ (sigma notation) for summing sequences. Σᵢ₌₁ⁿ i = n(n+1)/2 (we prove this by induction in Part 13).
- **Code connection:** Arrays are sequences. `a[n]` is the function applied to index n.

### 9. Cardinality (Rosen 2.5)

**DIFCP treatment.**

- **Definition:** The cardinality |A| of a finite set A is the number of elements. For infinite sets, two sets have the same cardinality if there exists a bijection between them.
- **Countably infinite:** A set is countably infinite if there exists a bijection with ℕ. Examples: ℤ (map n → 0, 1, -1, 2, -2, ...), ℚ (Cantor's zigzag argument).
- **Uncountably infinite:** ℝ is uncountable. Cantor's diagonal argument: assume a bijection ℕ → ℝ (list all reals), construct a real not in the list by changing the nth digit of the nth number. Contradiction.
- **Developer connection:** Countable means "you can enumerate them in a program." Uncountable means "no program can list all of them." The set of all possible programs is countable (programs are finite strings). The set of all functions ℕ → ℕ is uncountable. Therefore, most functions cannot be computed by any program. This is the deepest result in computability theory.
- **Brief treatment:** This is a preview. Full treatment of Cantor's diagonal in the context of computability comes in Part 39 (Turing machines).

### 10. Code Companion: function_properties.py

- **What it does:** Given a function (as a Python callable) and finite domain/codomain, determines whether the function is injective, surjective, or bijective. Composes functions and checks composition properties. Demonstrates inverse functions.
- **Key functions:** `is_injective(f, domain)`, `is_surjective(f, domain, codomain)`, `is_bijective(f, domain, codomain)`, `compose(f, g)`, `find_inverse(f, domain, codomain)`.
- **Expected output:** Tests sample functions (squaring, doubling, modular arithmetic) for properties. Composes functions and verifies associativity. Finds inverse of a bijection.

### 11. The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "A function takes input and gives output" — fails to distinguish mathematical functions (deterministic, total) from programming functions (side effects, partial, nondeterministic) |
| :white_check_mark: **Right** | A function f: A → B assigns exactly one output to each input. Injective = no collisions. Surjective = full range. Bijective = both, hence invertible. Function composition is associative. Cardinality compares set sizes via bijections. |
| :x: **Too Formal** | Functions as morphisms in category theory. Cardinality via cardinal numbers and the continuum hypothesis. |
| :warning: **Common Mistake** | Confusing the codomain with the range. `f: ℤ → ℤ` defined by f(x) = x² has codomain ℤ but range {0, 1, 4, 9, ...}. Surjectivity depends on the codomain, not the range. The same formula can be surjective or not depending on what codomain you declare. |

## Thread Progression

- **Proof Portfolio:** +2 new proofs. (8) Function composition is associative. (9) f is injective if and only if f has a left inverse. Cumulative: 9 proofs.
- **Code Companion:** `function_properties.py` — checks injectivity, surjectivity, bijectivity; composes functions; finds inverses.
- **Rosen Exercises:**
  - **Essential:** 2.3: 1, 3, 5, 7, 11, 15; 2.4: 1, 3; 2.5: 1, 3
  - **Recommended:** 2.3: 23, 25; 2.4: 5, 7; 2.5: 5
  - **Challenge:** 2.3: 25 (prove composition preserves injectivity)

## Further Resources

- **MIT 6.042J Lecture 4** — Functions, bijections, and cardinality. Includes Cantor's diagonal argument.
- **Book of Proof, Chapter 12** — Functions: injectivity, surjectivity, composition, and inverse functions with many examples and exercises.
- **3Blue1Brown: "How to count past infinity"** — Excellent visual introduction to cardinality, countable vs uncountable infinity.

## Key Takeaways

1. A mathematical function assigns exactly one output to each input — no side effects, no randomness — and the properties injective (no collisions), surjective (full coverage), and bijective (both) explain why hash functions collide, compression can be lossy, and encryption must be invertible.
2. Function composition is associative, which is why `pipe(f, g, h)` works: it does not matter whether you group as `(h . g) . f` or `h . (g . f)`, the result is the same.
3. Cantor's diagonal argument proves ℝ is uncountable (bigger than ℕ), which means most functions cannot be computed by any program — the deepest result connecting set theory to computability.

## Writer Notes

- The hash function / JSON.stringify hook is the strongest developer connection. Lead with it and return to it throughout.
- Injective/surjective/bijective are the core concepts. Give each full DIFCP treatment with code examples.
- The Cantor diagonal argument (Section 9) should be brief but correct. Do not try to prove it formally here. State the result, describe the diagonal construction intuitively, and forward-reference Part 39.
- Sequences (Rosen 2.4) are brief because they are a special case of functions. Cover enough for summation notation (needed in Part 13 for induction proofs on sums).
- The two proofs (composition associativity, injective iff left inverse) are important for building the proof portfolio. The first is algebraic; the second requires both directions of a biconditional.
- Forward-reference Part 10: "Functions map one set to another. Relations are the more general concept: they connect elements of sets without the 'exactly one output' constraint. Part 10 introduces relations — the mathematical foundation of database relationships, social networks, and dependency graphs."
