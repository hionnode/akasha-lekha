# Part 26: RSA and Cryptography: Why Number Theory Matters

> Rosen Sections: 4.5-4.6
> Blog file: `apps/web/src/content/blog/discrete-mathematics/26-cryptography-rsa.mdx`
> Estimated word count: 4,000-5,000

## Frontmatter

```yaml
---
title: "RSA and Cryptography: Why Number Theory Matters"
description: "Build RSA from scratch: key generation, encryption, decryption, and the correctness proof. Every HTTPS connection uses the math from this series."
excerpt: "Every HTTPS connection uses the math from Parts 24-25. This part connects the dots: from modular arithmetic and Euler's totient to a complete RSA implementation with a correctness proof."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "cryptography", "number-theory"]
series: "Discrete Mathematics for Developers"
seriesPart: 26
featured: false
draft: true
---
```

## Component Imports

```mdx
import Alert from '@components/shared/Alert.astro';
import CodeSwitcher from '@components/shared/CodeSwitcher.astro';
```

## Opening Hook

- **Scenario:** You type `https://` in your browser. In the next 200 milliseconds, your browser and the server agree on a shared secret, verify each other's identity, and establish an encrypted channel. This involves generating large primes, computing modular exponentials, and verifying digital signatures. Every piece of math from Parts 24-25 -- modular arithmetic, Euler's totient, the Euclidean algorithm, modular inverses -- is used in that handshake.
- **Reveal:** RSA is not a black box. With the number theory from Parts 24-25, you can understand every step: why key generation works, why encryption is correct, why decryption recovers the plaintext, and why breaking RSA requires factoring large numbers (which no one knows how to do efficiently).
- **Outcome:** Readers can implement RSA from scratch (with small primes for pedagogy), prove that RSA decryption correctly recovers the plaintext, understand Diffie-Hellman key exchange and digital signatures, and explain why quantum computing threatens RSA.

## Section Outline

### 1. Why This Matters

This is the payoff part. Every piece of discrete math from Phases 1-5 converges here:
- **Logic** (Phase 1): for the correctness proof
- **Sets and relations** (Phase 2): for algebraic structure of Z_n
- **Induction** (Phase 3): for reasoning about repeated operations
- **Counting** (Phase 5): Euler's totient function (Part 22) counts the elements of the multiplicative group
- **Number theory** (Parts 24-25): modular arithmetic, primes, GCD, modular inverses

If you followed the series to this point, you have everything you need to understand RSA -- not as a recipe, but as mathematics.

### 2. Hashing Functions -- Rosen 4.5

**Hashing as modular arithmetic:** h(k) = k mod m maps a key to a bucket.

Properties of good hash functions:
- Deterministic
- Uniform distribution over {0, 1, ..., m-1}
- Small changes in input produce large changes in output (avalanche property)

Connection to Part 20 (pigeonhole principle): collisions are inevitable when the key space exceeds the hash space.

Why cryptographic hash functions (SHA-256) differ from hash table functions: pre-image resistance, collision resistance, second pre-image resistance. These are one-way functions -- easy to compute, infeasible to invert.

### 3. Pseudorandom Number Generation

Linear congruential generators: x_(n+1) = (a * x_n + c) mod m.

Properties: periodic (period divides m), deterministic (given seed), not cryptographically secure (knowing a few outputs reveals the entire sequence).

Cryptographically secure PRNGs: use block ciphers or hash functions to prevent output prediction. `/dev/urandom` on Linux, `crypto.getRandomValues()` in browsers.

Connection: RSA key generation requires cryptographically random primes. Using a weak PRNG to generate RSA primes would be catastrophic.

### 4. Classical Cryptography -- Rosen 4.6

**Caesar cipher:** E(p) = (p + k) mod 26. Trivially broken by frequency analysis or brute force (only 26 keys).

**Affine cipher:** E(p) = (ap + b) mod 26 where gcd(a, 26) = 1. More keys, still broken by frequency analysis.

**Why classical ciphers fail:** The key space is too small, and the encryption function preserves statistical properties of the plaintext. Modern cryptography solves both problems.

### 5. Public-Key Cryptography: The Concept

**The key distribution problem:** If Alice and Bob want to communicate securely, they need a shared secret. But how do they agree on a secret over an insecure channel?

**The breakthrough:** Diffie and Hellman (1976), Rivest-Shamir-Adleman (1977). Use one-way functions to create a public key (anyone can encrypt) and a private key (only the holder can decrypt). The security relies on mathematical problems that are easy in one direction and hard to reverse.

### 6. RSA Key Generation (Full Walkthrough)

Step-by-step, with concrete numbers:

1. **Choose two large primes p and q.** Example: p = 61, q = 53.
2. **Compute n = p * q.** n = 3233. This is the modulus.
3. **Compute Euler's totient phi(n) = (p-1)(q-1).** phi(3233) = 60 * 52 = 3120. (Back-reference to Part 22: this is the Euler's totient function.)
4. **Choose encryption exponent e** such that 1 < e < phi(n) and gcd(e, phi(n)) = 1. Choose e = 17. Verify gcd(17, 3120) = 1.
5. **Compute decryption exponent d** such that d * e ≡ 1 (mod phi(n)). Use extended Euclidean algorithm (Part 25) to find d = 2753. Verify: 17 * 2753 = 46801 = 15 * 3120 + 1.
6. **Public key:** (n, e) = (3233, 17). **Private key:** (n, d) = (3233, 2753).

### 7. RSA Encryption and Decryption

**Encryption:** Given plaintext message m (an integer with 0 <= m < n), ciphertext c = m^e mod n.

Example: encrypt m = 65. c = 65^17 mod 3233 = 2790.

**Decryption:** Given ciphertext c, plaintext m = c^d mod n.

Example: decrypt c = 2790. m = 2790^2753 mod 3233 = 65. Original message recovered.

Both computations use modular exponentiation (square-and-multiply from Part 24).

### 8. RSA Correctness Proof

**Theorem:** For any message m with 0 <= m < n, decrypting the encryption of m recovers m. That is, (m^e)^d ≡ m (mod n).

**Proof:**

Since e * d ≡ 1 (mod phi(n)), we have e * d = 1 + k * phi(n) for some integer k.

So m^(ed) = m^(1 + k * phi(n)) = m * (m^(phi(n)))^k.

**Case 1: gcd(m, n) = 1.** By Euler's theorem, m^(phi(n)) ≡ 1 (mod n). So m^(ed) = m * 1^k = m (mod n).

**Case 2: gcd(m, n) != 1.** Since n = pq and p, q are prime, gcd(m, n) != 1 means p | m or q | m (but not both, since m < n = pq). Suppose p | m. Then m^(ed) ≡ 0 ≡ m (mod p). Also, since gcd(m, q) = 1, by Fermat's Little Theorem m^(q-1) ≡ 1 (mod q), so m^(ed) = m * (m^(q-1))^(k*(p-1)) ≡ m (mod q). By CRT (Part 25), m^(ed) ≡ m (mod pq) = m (mod n).

This is the crown jewel proof of the series.

### 9. Diffie-Hellman Key Exchange

The Diffie-Hellman protocol allows two parties to establish a shared secret over an insecure channel:

1. Agree on public parameters: prime p and generator g.
2. Alice chooses secret a, sends g^a mod p.
3. Bob chooses secret b, sends g^b mod p.
4. Alice computes (g^b)^a = g^(ab) mod p.
5. Bob computes (g^a)^b = g^(ab) mod p.
6. Shared secret: g^(ab) mod p.

Security: computing a from g^a mod p (discrete logarithm problem) is believed to be hard.

### 10. Digital Signatures

RSA signatures reverse the roles of public and private keys:
- **Sign:** s = m^d mod n (using private key)
- **Verify:** m' = s^e mod n (using public key). If m' = m, signature is valid.

This works because (m^d)^e = m^(de) = m^(ed) ≡ m (mod n) by the same correctness proof.

Application: code signing, TLS certificates, Git commit signing.

### 11. The TLS Handshake Overview

How all the pieces fit together in practice:
1. Client sends supported cipher suites.
2. Server sends certificate (containing public key, signed by CA).
3. Client verifies certificate signature using CA's public key.
4. Key exchange (Diffie-Hellman or RSA) establishes shared secret.
5. Symmetric encryption (AES) with shared secret for bulk data transfer.

Why RSA is used for key exchange/signatures but not bulk encryption: RSA is slow (modular exponentiation with 2048-bit numbers). AES is fast (hardware-accelerated symmetric cipher). The hybrid approach gets the best of both: RSA for key establishment, AES for data.

### 12. Why Quantum Computing Threatens RSA

**Shor's algorithm** (1994): a quantum algorithm that factors integers in polynomial time. If a sufficiently large quantum computer is built, RSA is broken.

Current state: largest number factored by a quantum computer is much smaller than RSA key sizes. But the threat is real enough that NIST is standardizing post-quantum cryptography algorithms (lattice-based, code-based, hash-based).

Keep this brief. The point is "this is an active area of concern," not "here is how Shor's algorithm works."

### 13. Password Hashing: Why bcrypt, Not SHA-256

Detour into practical security:
- SHA-256 is fast. That is bad for passwords. An attacker can test billions of SHA-256 hashes per second.
- bcrypt/scrypt/argon2 are intentionally slow (tunable work factor). They also use salt (random prefix) to defeat rainbow tables.
- This is a different application of hashing than hash tables. Cryptographic hash functions have multiple uses with different requirements.

### 14. Code Companion: RSA Implementation

`rsa.py` -- complete RSA implementation using small primes for pedagogy.

Key functions:
- `generate_keypair(p: int, q: int) -> tuple[tuple[int,int], tuple[int,int]]` -- returns ((n, e), (n, d))
- `encrypt(message: int, public_key: tuple[int,int]) -> int` -- m^e mod n
- `decrypt(ciphertext: int, private_key: tuple[int,int]) -> int` -- c^d mod n
- `sign(message: int, private_key: tuple[int,int]) -> int` -- digital signature
- `verify(message: int, signature: int, public_key: tuple[int,int]) -> bool` -- signature verification
- `text_to_int(text: str) -> int` -- encode text as integer
- `int_to_text(n: int) -> str` -- decode integer to text
- `diffie_hellman_demo(p: int, g: int) -> tuple[int, int, int]` -- simulates key exchange
- Main block: full RSA demo (key generation with p=61, q=53; encrypt/decrypt "HI"; sign/verify), Diffie-Hellman demo, note about why real RSA uses 2048+ bit primes

### 15. The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "RSA works because factoring is hard" -- that is the intuition but not the mechanism. You need Euler's theorem and the modular inverse to explain WHY decryption recovers the plaintext. |
| :white_check_mark: **Right** | RSA correctness follows from Euler's theorem: m^(ed) ≡ m (mod n) because ed ≡ 1 (mod phi(n)). Key generation, encryption, and decryption are all modular arithmetic operations with proven correctness. |
| :x: **Too Formal** | RSA in the context of abstract algebra (group theory of (Z/nZ)*), semantic security proofs, chosen-ciphertext attack models (IND-CCA2). |
| :warning: **Common Mistake** | Implementing "textbook RSA" in production. Real RSA uses padding schemes (OAEP) to prevent attacks. Never implement your own cryptography for production use. This implementation is for understanding, not deployment. |

## Thread Progression

- **Proof Portfolio:** +1 new proof (RSA correctness: (m^e)^d ≡ m (mod n) via Euler's theorem + CRT). Cumulative: 27 proofs.
- **Code Companion:** `rsa.py` -- complete RSA implementation with key generation, encryption, decryption, signing, verification, and Diffie-Hellman demo. Cumulative: 26 programs.
- **Rosen Exercises:** 4.5: 1, 3, 5, 7, 11, 15. 4.6: 1, 3, 5, 7, 11, 15, 23. Essential: 4.5: 1, 3, 5; 4.6: 1, 3, 5. Recommended: 4.5: 7, 11; 4.6: 7, 11. Challenge: 4.5: 15; 4.6: 15, 23.

## Further Resources

- **MIT 6.042J Lectures 9-10** -- RSA, Euler's theorem, public-key cryptography
- **Christof Paar's "Understanding Cryptography" lectures** -- Excellent video series covering RSA, Diffie-Hellman, and practical cryptographic protocols (free on YouTube)
- **CLRS Ch 31** -- Number-theoretic algorithms including RSA (formal treatment with all proofs)
- **Computerphile: "How RSA Works"** -- Accessible video walkthrough for visual learners

## Key Takeaways

1. RSA key generation: choose primes p, q; compute n = pq and phi(n) = (p-1)(q-1); choose e coprime to phi(n); compute d = e^(-1) mod phi(n). Every step uses math from Parts 22-25.
2. RSA correctness is provable: (m^e)^d ≡ m (mod n) follows from Euler's theorem and the fact that ed ≡ 1 (mod phi(n)). This is not magic; it is a chain of theorems.
3. RSA security depends on the difficulty of factoring n = pq. If you can factor n, you can compute phi(n), then d, and break the encryption. No one knows how to factor large numbers efficiently (yet).
4. Never implement your own cryptography for production. This implementation uses small primes for understanding. Real RSA uses 2048+ bit primes, padding schemes (OAEP), and constant-time operations to prevent side-channel attacks.
5. Quantum computing (Shor's algorithm) threatens RSA. Post-quantum cryptography is an active standardization effort.

## Writer Notes

- This is the crown jewel of the series. The RSA correctness proof should be the most carefully written proof in all 39 parts. Every step must be justified. Every back-reference (Euler's theorem, modular inverse, CRT) must be explicit.
- The full RSA walkthrough with p=61, q=53 should be traceable by hand. Include every intermediate computation. The reader should be able to verify each step with a calculator (or the Code Companion from Part 24).
- The "never implement your own crypto" warning is essential. Include it prominently. The Code Companion is for learning, not production.
- Diffie-Hellman should be a self-contained section. Many developers encounter DH before RSA (via TLS). Show that DH solves the key distribution problem that motivates public-key cryptography.
- The password hashing detour (bcrypt vs SHA-256) is outside Rosen but highly practical. Every developer should understand why "hash the password with SHA-256" is bad advice. Keep it to one section -- this is not a full security course.
- The quantum computing section should be two paragraphs, not a deep dive. The point is "this is why people are worried" and "post-quantum crypto is coming." Shor's algorithm is mentioned by name but not explained.
- Back-references should span the entire series: Phase 1 (logic for proofs), Phase 2 (sets for Z_n structure), Phase 3 (induction for reasoning), Phase 5 (counting for Euler's totient). This part demonstrates why learning math in a structured sequence matters. The convergence is the pedagogical argument for the entire series.
- This is the longest part in Phases 4-6 by design. RSA deserves 4,000-5,000 words because it is the culminating application. Do not compress it.
