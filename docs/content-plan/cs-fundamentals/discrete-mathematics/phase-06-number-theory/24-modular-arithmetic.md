# Part 24: Modular Arithmetic: The Math Behind Hash Tables, Clocks, and Circular Buffers

> Rosen Sections: 4.1-4.2
> Blog file: `apps/web/src/content/blog/discrete-mathematics/24-modular-arithmetic.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "Modular Arithmetic: The Math Behind Hash Tables, Clocks, and Circular Buffers"
description: "Master divisibility, modular arithmetic, and integer representations -- the number theory behind hash functions, circular buffers, and load balancers."
excerpt: "hash % bucketCount, index % size, round-robin load balancing -- you already use modular arithmetic everywhere. Now learn why it works."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "number-theory"]
series: "Discrete Mathematics for Developers"
seriesPart: 24
featured: false
draft: true
---
```

## Component Imports

```mdx
import Alert from '@components/shared/Alert.astro';
```

## Opening Hook

- **Scenario:** `hash % bucketCount` maps a hash to a bucket. `index % size` wraps around a circular buffer. `requestCount % serverCount` does round-robin load balancing. You use modular arithmetic dozens of times a day without calling it that.
- **Reveal:** Modular arithmetic is not just "the remainder operator." It is a complete algebraic system with its own rules for addition, subtraction, multiplication, and (sometimes) division. And congruence mod m is an equivalence relation -- connecting back to the relation theory from Part 11.
- **Outcome:** Readers understand divisibility and the division algorithm, can do arithmetic in Z_n (integers mod n), can prove that congruence mod m is an equivalence relation, and understand integer representations (binary, hex, two's complement).

## Section Outline

### 1. Why This Matters

Number theory was once considered the purest of pure mathematics -- beautiful but useless. Then computers happened. Hash tables, circular buffers, load balancers, checksums, and cryptography all depend on modular arithmetic. This phase (Parts 24-26) takes you from the % operator to RSA.

### 2. Divisibility -- Rosen 4.1 (DIFCP)

**Definition:** If a and b are integers with a != 0, we say a divides b (written a | b) if there exists an integer c such that b = a * c.

Properties:
- If a | b and a | c, then a | (b + c)
- If a | b, then a | (b * c) for any integer c
- If a | b and b | c, then a | c (transitivity)

### 3. The Division Algorithm (DIFCP)

**Theorem:** For any integer a and positive integer d, there exist unique integers q (quotient) and r (remainder) such that a = d * q + r and 0 <= r < d.

This is what the `%` operator computes (with caveats for negative numbers in different languages).

Developer angle: Python's `%` always returns a non-negative remainder for positive divisor. C/C++ `%` can return negative remainders. JavaScript `%` can also return negative results. This is a real source of bugs.

### 4. Modular Arithmetic: Congruence (DIFCP)

**Definition:** a is congruent to b modulo m (written a ≡ b (mod m)) if m | (a - b).

Equivalently: a and b have the same remainder when divided by m.

**Properties of congruences:**
- If a ≡ b (mod m) and c ≡ d (mod m), then:
  - a + c ≡ b + d (mod m)
  - a * c ≡ b * d (mod m)
  - a^k ≡ b^k (mod m) for any positive integer k

These properties mean you can do arithmetic mod m by reducing at every step. You never need to work with numbers larger than m^2.

### 5. Congruence Mod m Is an Equivalence Relation (Proof)

**Theorem:** For any positive integer m, the relation "≡ (mod m)" on the integers is an equivalence relation.

**Proof:**

1. **Reflexive:** a ≡ a (mod m) because m | (a - a) = 0. (Every integer divides 0.)
2. **Symmetric:** If a ≡ b (mod m), then m | (a - b), so a - b = mk for some integer k. Then b - a = m(-k), so m | (b - a), hence b ≡ a (mod m).
3. **Transitive:** If a ≡ b (mod m) and b ≡ c (mod m), then m | (a - b) and m | (b - c). So a - b = mk1 and b - c = mk2 for integers k1, k2. Then a - c = (a - b) + (b - c) = m(k1 + k2), so m | (a - c), hence a ≡ c (mod m).

Back-reference to Part 10 (relations) and Part 11 (equivalence relations): "You proved that equivalence relations partition sets in Part 11. Congruence mod m partitions the integers into m equivalence classes: {0, m, 2m, ...}, {1, m+1, 2m+1, ...}, ..., {m-1, 2m-1, 3m-1, ...}. These are the residue classes."

### 6. Arithmetic in Z_n

Z_n = {0, 1, 2, ..., n-1} with addition and multiplication mod n.

Addition table and multiplication table for Z_5 (small enough to show completely).

Key observation: Z_n has multiplicative inverses for elements coprime to n. In Z_5, every nonzero element has an inverse (because 5 is prime). In Z_6, the element 2 has no inverse (because gcd(2, 6) != 1).

Forward reference: modular inverses are critical for RSA (Part 26). The extended Euclidean algorithm (Part 25) computes them efficiently.

### 7. Integer Representations -- Rosen 4.2

**Binary (base 2):** Every positive integer has a unique binary representation. Conversion algorithm: repeated division by 2.

**Hexadecimal (base 16):** Compact representation of binary. Each hex digit = 4 binary digits.

**Two's complement:** How computers represent negative integers. For n-bit representation: -x is stored as 2^n - x. This allows subtraction to be implemented as addition of the complement.

**Base conversion algorithm:** To convert integer n to base b: repeatedly divide by b, record remainders, reverse. This is a direct application of the division algorithm.

### 8. Why parseInt('08') Was a JS Footgun

Historical JavaScript trivia that illustrates why integer representation matters: before ES5, `parseInt('08')` returned 0 because the leading zero triggered octal (base 8) parsing, and '8' is not a valid octal digit. This was fixed in ES5 (leading zeros no longer imply octal), but it remains a cautionary tale about assuming base-10 everywhere.

### 9. Code Companion: Modular Arithmetic

`modular_arithmetic.py` -- modular arithmetic operations, base conversions, and modular exponentiation.

Key functions:
- `mod(a: int, m: int) -> int` -- proper modular reduction (always non-negative)
- `mod_add(a: int, b: int, m: int) -> int` -- addition mod m
- `mod_mul(a: int, b: int, m: int) -> int` -- multiplication mod m
- `mod_exp(base: int, exp: int, m: int) -> int` -- fast modular exponentiation (square-and-multiply)
- `mod_inverse(a: int, m: int) -> int | None` -- modular inverse via extended GCD (preview, full treatment in Part 25)
- `to_base(n: int, base: int) -> str` -- integer to any base representation
- `from_base(s: str, base: int) -> int` -- any base representation to integer
- `twos_complement(n: int, bits: int) -> str` -- two's complement binary representation
- `congruence_classes(m: int, limit: int) -> dict[int, list[int]]` -- generates equivalence classes mod m
- Main block: modular arithmetic demonstrations, base conversion examples, two's complement table for 4-bit integers (-8 to 7), congruence classes mod 5 for integers 0-24

### 10. The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "Modular arithmetic is just the remainder" -- the `%` operator is implementation-specific and can return negative values. Congruence is an equivalence relation with algebraic properties. |
| :white_check_mark: **Right** | Congruence mod m is an equivalence relation that partitions integers into m residue classes. Addition and multiplication are well-defined on these classes. Modular inverses exist exactly when gcd(a, m) = 1. |
| :x: **Too Formal** | Quotient rings Z/mZ, ideals, ring homomorphisms, the Chinese Remainder Theorem as an isomorphism of rings. |
| :warning: **Common Mistake** | Assuming `a % m` in your programming language always returns a value in {0, 1, ..., m-1}. In C/C++/Java/JS, `(-7) % 3` may return -1, not 2. Always test with negative inputs. |

## Thread Progression

- **Proof Portfolio:** +1 new proof (congruence mod m is an equivalence relation, verifying reflexivity, symmetry, and transitivity). Cumulative: 24 proofs.
- **Code Companion:** `modular_arithmetic.py` -- modular operations, base conversions, fast modular exponentiation. Cumulative: 24 programs.
- **Rosen Exercises:** 4.1: 1, 3, 5, 7, 11, 15, 23, 25, 31. 4.2: 1, 3, 5, 7, 11, 15. Essential: 4.1: 1, 3, 5, 7, 11; 4.2: 1, 3, 5. Recommended: 4.1: 15, 23; 4.2: 7, 11. Challenge: 4.1: 25, 31; 4.2: 15.

## Further Resources

- **MIT 6.042J Lecture 8** -- Number theory foundations, divisibility, modular arithmetic
- **Book of Proof, Ch 3** -- Equivalence relations and modular arithmetic proofs
- **Two's Complement Explained (Ben Eater)** -- Excellent video walkthrough of two's complement with hardware context

## Key Takeaways

1. Congruence mod m is an equivalence relation: reflexive, symmetric, and transitive. It partitions the integers into m residue classes.
2. You can add, subtract, and multiply mod m freely (reduce at every step). Division requires a modular inverse, which exists only when gcd(a, m) = 1.
3. The `%` operator in your language may not behave like mathematical mod for negative numbers. Always test with negative inputs.
4. Integer representations (binary, hex, two's complement) are direct applications of the division algorithm. Two's complement turns subtraction into addition, which is why hardware uses it.
5. Modular arithmetic is the foundation for hash tables, circular buffers, load balancers, checksums, and (in Parts 25-26) RSA cryptography.

## Writer Notes

- The equivalence relation proof is a deliberate back-reference to Phase 2. Readers proved that equivalence relations partition sets in Part 11. Now they see a concrete, important equivalence relation in the wild. Call this out explicitly: "You have been building toward this. The abstract definition of equivalence relation from Part 10, the partition theorem from Part 11 -- here is where it pays off."
- The parseInt('08') story is a crowd-pleaser. Use it to illustrate that integer representation is not academic -- it caused real bugs in real production JavaScript.
- Modular exponentiation (square-and-multiply) is a preview of what is needed for RSA. Introduce it here as an efficiency technique: "Computing 3^1000 mod 7 naively requires 1000 multiplications. Square-and-multiply does it in about 10." The reader will use this function in Part 26.
- The Z_n multiplication table for Z_5 should be complete (5x5 table). Point out that every nonzero element has an inverse. Then show Z_6 and point out that 2 * 3 = 0 (mod 6) -- zero divisors exist in Z_n when n is not prime. This foreshadows the importance of primes in Part 25.
- Keep the two's complement section practical. Developers encounter it when debugging integer overflow, bitwise operations, or network protocols. Do not prove uniqueness of two's complement representation; just explain how it works and why hardware uses it.
