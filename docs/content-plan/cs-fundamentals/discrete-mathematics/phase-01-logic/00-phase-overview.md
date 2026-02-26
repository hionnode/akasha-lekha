# Phase 1: Logic (Parts 0-7)

## Phase Goal

Part 0 introduces the series: why discrete math matters for developers, what the 39-part journey looks like, and how to use the series. Parts 1-7 formalize the logic developers already use daily -- `if/else`, `&&`/`||`, type systems -- then teach proof techniques, the key skill barrier for the entire series. The reader ends this phase able to read and write formal proofs using direct proof, contraposition, contradiction, and cases.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| Proof Portfolio | 0 proofs | 6 proofs (direct, contraposition, contradiction, cases, existence, constructive) |
| Code Companion | 0 programs | 7 programs (`truth_table.py` through `sat_solver.py`) |
| Rosen Sections | 0/65 | 9/65 (Ch 1 complete + supplementary) |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 0 | Discrete Mathematics for Developers: Why This Math Is Your Math | Series introduction, motivation, roadmap | No threads — orientation only | 2,500-3,000 |
| 1 | Propositions and Logic Gates: What `if` Statements Really Mean | Propositional logic formalized, truth tables, De Morgan's laws | `truth_table.py` — truth table generator for any propositional expression | 3,000-3,500 |
| 2 | Predicate Logic: From Booleans to Quantifiers | Predicates, quantifiers (forall/exists), nested quantifiers | `predicate_eval.py` — evaluates quantified predicates over finite domains | 3,000-3,500 |
| 3 | Rules of Inference: Why Your Arguments Have Structure | Modus ponens, modus tollens, disjunctive syllogism, inference chains | `inference_checker.py` — validates inference rule applications | 2,500-3,000 |
| 4 | Proof Techniques I: Direct Proof and Contraposition | First proofs: even + even = even; if n squared is odd then n is odd | Proof Portfolio +2; `proof_verifier.py` — verifies proof steps computationally | 4,000-4,500 |
| 5 | Proof Techniques II: Contradiction, Cases, Existence | Irrationality of sqrt(2), infinitude of primes | Proof Portfolio +2; `primality_check.py` — demonstrates existence proofs computationally | 4,500-5,500 |
| 6 | Proof Techniques III: Strategy and Common Mistakes | De Morgan's laws for sets, how to choose technique, common proof mistakes | Proof Portfolio +2; `proof_strategy.py` — technique selection guide with examples | 4,000-5,000 |
| 7 | Logic in Practice: SAT Solvers, Type Systems, and Formal Verification | SAT solvers (apt, npm resolution), TypeScript as theorem prover, TLA+/Alloy | `sat_solver.py` — simple DPLL SAT solver | 2,500-3,000 |

## Dependencies

- **Requires:** Basic programming experience (Python preferred). Comfort with variables, loops, functions, conditionals. No prior math beyond high school algebra.
- **Unlocks:** Phase 2 (sets, functions, relations), all subsequent proof writing. Every phase from here forward assumes the reader can construct and follow formal proofs.

## Writer Notes

- Three parts on proof techniques (4, 5, 6) is intentional. Research identifies the "proof writing barrier" as the primary challenge for this subject. Rushing proofs here means struggling in every subsequent phase.
- Part 0 is the series introduction. No definitions, no theorems, no DIFCP. Pure motivation and orientation. Its job is to make the reader feel "I need to know this" and "I know what I'm signing up for."
- Parts 1-3 build vocabulary and formal notation. Parts 4-6 build the actual skill. Part 7 is supplementary -- shows where logic appears in real tooling.
- Part 7 is the lightest part in the phase. Keep it practical and inspiring, not exhaustive. Readers should feel "I didn't know math was doing this behind my tools."
- Part 0 handles the "why should a developer care about discrete math" question. Part 1 can therefore jump straight into the material with a code-focused hook rather than a motivational preamble.
- Code companions in Parts 1-3 help readers verify logical claims computationally before they learn to prove things formally. This builds confidence: "the math checks out."
- Proof-heavy parts (4-6) are the longest in the phase. Budget 4,000-5,500 words because proofs need careful step-by-step exposition. Do not rush.
