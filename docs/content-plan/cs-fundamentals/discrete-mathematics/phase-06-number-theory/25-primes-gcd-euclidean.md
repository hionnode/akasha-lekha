# Part 25: Primes, GCD, and the Euclidean Algorithm: 2300 Years and Still Running

> Rosen Sections: 4.3-4.4
> Blog file: `apps/web/src/content/blog/discrete-mathematics/25-primes-gcd-euclidean.mdx`
> Estimated word count: 3,500-4,000

## Frontmatter

```yaml
---
title: "Primes, GCD, and the Euclidean Algorithm: 2300 Years and Still Running"
description: "Explore prime numbers, the fundamental theorem of arithmetic, GCD, and the Euclidean algorithm -- 2300-year-old math in every TLS handshake."
excerpt: "The Euclidean algorithm is one of the oldest algorithms (300 BC) and it runs in every TLS handshake happening right now. From Euclid to HTTPS in 2300 years."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "number-theory"]
series: "Discrete Mathematics for Developers"
seriesPart: 25
featured: false
draft: true
---
```

## Component Imports

```mdx
import Alert from '@components/shared/Alert.astro';
```

## Opening Hook

- **Scenario:** Every HTTPS connection involves a TLS handshake. That handshake uses RSA or Diffie-Hellman. Both require computing GCDs, modular inverses, and primality tests. The Euclidean algorithm, written by Euclid around 300 BC, runs in every one of these handshakes. It is one of the oldest algorithms still in production.
- **Reveal:** The Euclidean algorithm is elegant, provably correct, and efficient (O(log(min(a,b))) steps). Its extended version computes modular inverses, which are the key to RSA key generation. The math in this part is the direct prerequisite for Part 26 (RSA).
- **Outcome:** Readers understand prime numbers and the fundamental theorem of arithmetic, can run the Euclidean and extended Euclidean algorithms, know Bezout's identity and its proof, and can compute modular inverses.

## Section Outline

### 1. Why This Matters

Primes are the atoms of the integers. The fundamental theorem of arithmetic says every integer greater than 1 has a unique prime factorization. This uniqueness is what makes cryptography possible: if factoring were easy, RSA would be broken. This part builds the tools for Part 26.

### 2. Prime Numbers -- Rosen 4.3 (DIFCP)

**Definition:** An integer p > 1 is prime if its only positive divisors are 1 and p.

**Fundamental Theorem of Arithmetic:** Every integer greater than 1 can be expressed as a product of primes in exactly one way (up to ordering).

Back-reference to Part 5: "We proved there are infinitely many primes in Part 5 using proof by contradiction. Here we build on that foundation."

### 3. Prime Distribution

- Prime counting function pi(n): approximately n / ln(n) (Prime Number Theorem)
- Primes become sparser but never stop: there is always a prime between n and 2n (Bertrand's postulate)
- Practical: the probability that a random n-digit number is prime is approximately 1 / (n * ln(10))
- For RSA with 2048-bit keys, you need 1024-bit primes. The density is about 1 in 710 odd numbers. Finding one by random sampling is fast.

### 4. Primality Testing

**Trial division:** Test divisibility by all primes up to sqrt(n). Time: O(sqrt(n)). Good enough for small n.

**Fermat's Little Theorem:** If p is prime and a is not divisible by p, then a^(p-1) ≡ 1 (mod p).

Contrapositive: if a^(p-1) is not congruent to 1 (mod p), then p is not prime. This gives a fast primality test -- but it has false positives (Carmichael numbers).

**Miller-Rabin primality test:** Refinement of Fermat's test that catches Carmichael numbers. Probabilistic: if it says "composite," the number is definitely composite. If it says "probably prime," the probability of error is at most 1/4 per round. Run k rounds: error probability at most (1/4)^k.

This is what `openssl genrsa` uses to find primes.

### 5. GCD and LCM (DIFCP)

**Definition:** gcd(a, b) is the largest positive integer that divides both a and b.

**Definition:** lcm(a, b) is the smallest positive integer that is divisible by both a and b.

**Relationship:** gcd(a, b) * lcm(a, b) = a * b.

Developer application: gcd appears in simplifying fractions, computing LCM for scheduling (LCM of task periods), and in cryptographic key generation.

### 6. The Euclidean Algorithm (DIFCP + Proof)

**Algorithm:** To compute gcd(a, b) where a > b > 0:
1. Divide a by b: a = bq + r, where 0 <= r < b.
2. If r = 0, return b.
3. Otherwise, return gcd(b, r).

**Proof of correctness:**

**Theorem:** gcd(a, b) = gcd(b, a mod b).

**Proof:** Let d = gcd(a, b). Since a = bq + r:
- d | a and d | b implies d | (a - bq) = r. So d | gcd(b, r).
- Conversely, let e = gcd(b, r). Then e | b and e | r, so e | (bq + r) = a. So e | gcd(a, b) = d.
- Since d | gcd(b, r) and gcd(b, r) | d, we have d = gcd(b, r).

**Termination:** The remainder r strictly decreases at each step (0 <= r < b), so the algorithm terminates in at most O(log(min(a, b))) steps.

Trace example: gcd(252, 198) -> gcd(198, 54) -> gcd(54, 36) -> gcd(36, 18) -> gcd(18, 0) = 18.

### 7. The Extended Euclidean Algorithm -- Rosen 4.4

The extended version computes not just gcd(a, b) but also integers s and t such that as + bt = gcd(a, b).

**Algorithm:** Run the Euclidean algorithm, then back-substitute to express the GCD as a linear combination.

Trace example: extend the gcd(252, 198) computation to find s = -3, t = 4 such that 252(-3) + 198(4) = 18.

### 8. Bezout's Identity (Proof)

**Theorem (Bezout's Identity):** For any integers a, b with gcd(a, b) = d, there exist integers s, t such that as + bt = d.

**Proof (constructive):** The extended Euclidean algorithm produces s and t. At each step, we maintain the invariant that the current remainder can be expressed as a linear combination of a and b. The base case is trivially a = a*1 + b*0. Each division step preserves the invariant. When the algorithm terminates with the GCD, the invariant gives us s and t.

### 9. Solving Linear Congruences

**Problem:** Solve ax ≡ b (mod m).

**Solution:** The equation has a solution iff gcd(a, m) | b. If so, use the extended Euclidean algorithm to find the inverse of a/gcd(a,m) mod m/gcd(a,m).

Special case: if gcd(a, m) = 1, then a has a modular inverse a^(-1) mod m, and x = a^(-1) * b mod m is the unique solution.

This is the tool that computes the decryption exponent d in RSA.

### 10. Chinese Remainder Theorem (Brief)

**Theorem:** If gcd(m1, m2) = 1, then the system x ≡ a1 (mod m1), x ≡ a2 (mod m2) has a unique solution mod m1 * m2.

Application: reconstructing a number from its remainders. Used in some RSA optimizations (CRT-RSA) for faster decryption.

Keep this brief. State the theorem, give one example, mention the RSA optimization.

### 11. Code Companion: Euclidean Algorithm

`euclidean.py` -- GCD, extended GCD, modular inverse, and Miller-Rabin primality test.

Key functions:
- `gcd(a: int, b: int) -> int` -- Euclidean algorithm
- `extended_gcd(a: int, b: int) -> tuple[int, int, int]` -- returns (d, s, t) where as + bt = d
- `mod_inverse(a: int, m: int) -> int | None` -- modular inverse via extended GCD
- `solve_congruence(a: int, b: int, m: int) -> int | None` -- solves ax ≡ b (mod m)
- `is_prime_trial(n: int) -> bool` -- trial division primality test
- `is_prime_fermat(n: int, rounds: int) -> bool` -- Fermat primality test
- `miller_rabin(n: int, rounds: int) -> bool` -- Miller-Rabin probabilistic primality test
- `generate_prime(bits: int) -> int` -- generates a random prime of specified bit length using Miller-Rabin
- `chinese_remainder(a1: int, m1: int, a2: int, m2: int) -> int` -- CRT solver
- Main block: GCD and extended GCD traces, modular inverse computations, Miller-Rabin demo on large numbers, prime generation timing

### 12. The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "GCD is the biggest number that divides both" -- correct definition but misses the algorithmic and algebraic depth. You need Bezout's identity and modular inverses for cryptography. |
| :white_check_mark: **Right** | The Euclidean algorithm computes gcd(a,b) in O(log min(a,b)) steps. The extended version produces Bezout coefficients s, t such that as + bt = gcd(a,b). Modular inverses exist iff gcd(a,m) = 1. |
| :x: **Too Formal** | Euclidean domains, principal ideal domains, the structure theorem for finitely generated modules over a PID. |
| :warning: **Common Mistake** | Trying to compute modular inverses by brute force (testing every value from 1 to m-1). The extended Euclidean algorithm does it in O(log m) steps. Always use the algorithm. |

## Thread Progression

- **Proof Portfolio:** +2 new proofs (Euclidean algorithm correctness: gcd(a,b) = gcd(b, a mod b); Bezout's identity via constructive proof from the extended algorithm). Cumulative: 26 proofs.
- **Code Companion:** `euclidean.py` -- GCD, extended GCD, modular inverse, Miller-Rabin, CRT. Cumulative: 25 programs.
- **Rosen Exercises:** 4.3: 1, 3, 5, 7, 11, 15, 23, 25, 31. 4.4: 1, 3, 5, 7, 11, 15, 23, 25. Essential: 4.3: 1, 3, 5, 7; 4.4: 1, 3, 5, 7. Recommended: 4.3: 11, 15, 23; 4.4: 11, 15. Challenge: 4.3: 25, 31; 4.4: 23, 25.

## Further Resources

- **MIT 6.042J Lectures 8-9** -- Number theory, GCD, Euclidean algorithm, modular inverses, RSA preview
- **CLRS Ch 31** -- Number-theoretic algorithms including GCD, modular arithmetic, RSA (rigorous treatment)
- **Book of Proof, Ch 3** -- Divisibility proofs and the well-ordering principle

## Key Takeaways

1. The fundamental theorem of arithmetic guarantees unique prime factorization. If factoring were easy, RSA would be broken. It is not easy, and that is the foundation of modern cryptography.
2. The Euclidean algorithm computes gcd(a, b) in O(log min(a, b)) steps. It is 2300 years old and runs in every TLS handshake.
3. Bezout's identity (as + bt = gcd(a, b)) is not just a theorem -- the extended Euclidean algorithm constructs s and t. This gives you modular inverses.
4. Modular inverses exist iff gcd(a, m) = 1. Computing them via the extended Euclidean algorithm is how RSA key generation finds the decryption exponent.
5. Miller-Rabin primality testing is probabilistic but fast. With k rounds, the error probability is at most (1/4)^k. This is how `openssl genrsa` works.

## Writer Notes

- This part and Part 26 form a two-part climax. Everything from Phases 1-5 converges here: logic for proofs, sets for algebraic structures, induction for correctness, counting for Euler's totient (Part 22). Make the convergence explicit.
- The Euclidean algorithm correctness proof should be fully worked out. It is the reader's 25th or 26th proof, so they have the technique. But the proof is important enough to deserve full space.
- The extended Euclidean algorithm should include a complete step-by-step trace. Back-substitution is where most students get lost. Use a table format: each row shows the current a, b, q, r, s, t values.
- Miller-Rabin is a practical algorithm that every developer should know exists. The explanation should focus on "how to use it" (call with k rounds, get error probability (1/4)^k) rather than "how it works internally" (the witness and strong liar details can be sketched but not belabored).
- The prime generation function in the Code Companion is a direct preview of RSA. "This function generates a prime of the specified bit length. In Part 26, we will use it to generate RSA keys."
- Back-reference Part 5 (infinitely many primes) and Part 22 (Euler's totient). Forward-reference Part 26 (RSA). This part is the bridge between pure number theory and applied cryptography.
- Bezout's identity connects to linear algebra (it is a 1D version of finding integer solutions to linear equations). Do not make this connection explicit -- it is out of scope -- but be aware of it for accuracy.
