# Phase 7: Discrete Probability (Parts 27-29)

## Phase Goal

Reason about probabilistic systems -- reliability, testing, randomized algorithms. The reader ends this phase able to compute probabilities, apply Bayes' theorem to real monitoring and testing scenarios, and use expected value for system design decisions.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| Proof Portfolio | 27 proofs | 28 proofs (+ Bayes' theorem derivation) |
| Code Companion | 26 programs | 29 programs (`probability_sim.py` through `expected_value.py`) |
| Rosen Sections | 47/65 | 51/65 (Ch 7 complete) |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 27 | Probability Foundations: Sample Spaces and Events | Sample spaces, event probability, independence, Monte Carlo methods | `probability_sim.py` — Monte Carlo pi estimation, birthday paradox simulation, random walks | 3,000-3,500 |
| 28 | Conditional Probability and Bayes' Theorem | Conditional probability, Bayes' theorem, false positive rates, naive Bayes | Proof Portfolio +1 (Bayes' theorem derivation); `bayesian.py` — Bayesian updater, naive Bayes spam classifier | 3,500-4,000 |
| 29 | Expected Value, Variance, and Probabilistic Analysis | Expected value, variance, linearity of expectation, randomized algorithm analysis | `expected_value.py` — Bloom filter, SLO calculator, coupon collector simulation | 3,000-3,500 |

## Dependencies

- **Requires:** Phase 5 (counting -- probability calculations depend on counting sample spaces and favorable outcomes)
- **Unlocks:** Probabilistic analysis of algorithms in Phase 8 (randomized quicksort expected time), general engineering reasoning about system reliability

## Writer Notes

- This phase is engineering-focused, not measure-theory-focused. The goal is practical probabilistic reasoning for developers, not rigorous probability theory.
- Part 28 (Bayes' theorem) has the strongest real-world hook: "if your monitoring test is 99% accurate and the event is rare, most positives are false." Base rate neglect is the most common probabilistic mistake in engineering.
- Part 29's biggest payoff is linearity of expectation -- a problem-solving superpower. Randomized quicksort analysis, coupon collector problem, and Bloom filter false positive rate all use it.
- SLO/SLA calculations in Part 29 are directly useful: "99.9% uptime means 8.7 hours of downtime per year." This connects probability to every on-call engineer's reality.
- Part 27 (computational focus, no new proofs) builds intuition via Monte Carlo simulations before the formal treatment in Parts 28-29. Let readers see probability in action before proving anything.
- This is one of the lighter phases for proofs (only 1 new proof). The focus is on computational reasoning and application, not proof technique. Proofs are well-covered by this point in the series.
- Revisit the birthday paradox from Phase 5 (Part 20) with the full probability framework. In Phase 5 it was a counting argument; here it becomes a probability calculation.
