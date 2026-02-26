# Phase 6: Number Theory and Cryptography (Parts 24-26)

## Phase Goal

Understand why cryptography works, from modular arithmetic to a full RSA walkthrough with the math. The reader ends this phase able to explain RSA key generation, encryption, and decryption -- not as a black box, but from the number theory that makes it correct.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| Proof Portfolio | 23 proofs | 27 proofs (+ modular equivalence is equivalence relation, Euclidean algorithm correctness, Bezout's identity, RSA correctness) |
| Code Companion | 23 programs | 26 programs (`modular_arithmetic.py` through `rsa.py`) |
| Rosen Sections | 41/65 | 47/65 (Ch 4 complete) |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 24 | Divisibility, Modular Arithmetic, and Integer Representations | Modular arithmetic formalized, congruence as equivalence relation, integer representations | Proof Portfolio +1 (a equiv b mod m is an equivalence relation); `modular_arithmetic.py` — mod_exp, mod_inverse, CRT | 3,000-3,500 |
| 25 | Primes, GCD, and the Euclidean Algorithm | Fundamental theorem of arithmetic, Euclidean algorithm, extended GCD, modular inverse | Proof Portfolio +2 (Euclidean algorithm correctness, Bezout's identity); `euclidean.py` — GCD, extended GCD, Miller-Rabin | 3,500-4,500 |
| 26 | Cryptography: RSA and Why Number Theory Matters | Full RSA: key generation, encryption, decryption, correctness proof. TLS, Diffie-Hellman, digital signatures | Proof Portfolio +1 (RSA correctness); `rsa.py` — complete RSA implementation from scratch | 4,500-5,500 |

## Dependencies

- **Requires:** Phase 5 (counting -- Euler's totient function uses counting arguments), Phase 3 (induction -- used in correctness proofs)
- **Unlocks:** Standalone payoff (RSA understanding). No subsequent phase depends on number theory, making this a satisfying capstone for the middle of the series.

## Writer Notes

- This is the big payoff phase. Part 26 is the crown jewel of the entire series. Every piece of math from Phases 1-5 converges: logic for proofs, sets for algebraic structures, induction for correctness, counting for Euler's totient.
- Part 26 should be the longest part in the phase. Full RSA walkthrough means: key generation (choose primes, compute n, compute totient, choose e, compute d), encryption (c = m^e mod n), decryption (m = c^d mod n), and the proof that decryption recovers the original message.
- The proof that a equiv b (mod m) is an equivalence relation (Part 24) is a deliberate back-reference to Phase 2. Call it out: readers are using relation properties they learned months ago.
- Part 24 should emphasize that modular arithmetic is everywhere in programming: hash functions (hash % bucketCount), circular buffers (index % size), load balancing (round-robin), clock arithmetic.
- The RSA implementation in Part 26 uses small primes for pedagogy. Include a note about why real-world RSA uses 2048+ bit primes and how key generation differs at scale.
- Briefly mention quantum computing's threat to RSA (Shor's algorithm) in Part 26, but don't go deep. This is a forward reference, not a treatment.
