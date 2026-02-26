# Part 29: Expected Value and Variance: SLOs, Bloom Filters, and the Coupon Collector

> Rosen Sections: 7.4
> Blog file: `apps/web/src/content/blog/discrete-mathematics/29-expected-value.mdx`
> Estimated word count: 3,500-4,000

## Frontmatter

```yaml
---
title: "Expected Value and Variance: SLOs, Bloom Filters, and the Coupon Collector"
description: "Master expected value and variance — the math behind SLO calculations, Bloom filter false positive rates, randomized quicksort analysis, and the coupon collector problem."
excerpt: "'99.9% uptime means 8.7 hours of downtime per year.' SLO math is expected value. This post teaches you expected value, linearity of expectation, and variance — then applies them to Bloom filters, randomized algorithms, and system reliability."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "probability"]
series: "Discrete Mathematics for Developers"
seriesPart: 29
featured: false
draft: true
---
```

## Component Imports

```mdx
import Alert from '../../../components/shared/Alert.astro';
import ComparisonTable from '../../../components/shared/ComparisonTable.astro';
import ComparisonHeader from '../../../components/shared/ComparisonHeader.astro';
import ComparisonRow from '../../../components/shared/ComparisonRow.astro';
```

## Opening Hook

- **Scenario:** Your SLA says "99.9% uptime." Your manager asks: "How many minutes of downtime per month is that?" You do the math: 0.001 * 30 * 24 * 60 = 43.2 minutes. That single calculation -- multiplying an outcome by its probability -- is expected value. You have been doing expected value calculations your entire career without calling them that.
- **Reveal:** Expected value is the weighted average over all possible outcomes. Linearity of expectation is its superpower: the expected value of a sum is the sum of the expected values, even when the variables are dependent. This one property makes randomized algorithm analysis tractable.
- **Outcome:** By the end, you will compute expected values and variances, apply linearity of expectation to complex problems, analyze Bloom filter false positive rates, calculate SLO budgets, and solve the coupon collector problem.

## Section Outline

### 1. Why This Matters

- SLO/SLA calculations, Bloom filter sizing, randomized algorithm analysis, retry budget estimation, capacity planning -- all expected value problems.
- Linearity of expectation is one of the most powerful problem-solving tools in discrete mathematics. It simplifies problems that seem intractable by breaking them into independent pieces.
- This part completes the probability phase. After this, you have the tools to reason about any probabilistic system quantitatively.

### 2. Expected Value Definition

- **Definition:** For a discrete random variable X taking values x1, x2, ..., xn with probabilities p1, p2, ..., pn, the expected value is E[X] = sum(xi * pi).
- **Intuition:** The "center of mass" of the probability distribution. The long-run average if you repeated the experiment infinitely many times.
- **Simple examples:** Fair die: E[X] = (1+2+3+4+5+6)/6 = 3.5. Biased coin (P(H)=0.7): E[heads in 10 flips] = 7.
- **Code connection:** The expected value of a function's runtime is the weighted average over all possible inputs. Amortized analysis is a related but distinct concept.

### 3. Linearity of Expectation (Superpower)

- **Statement:** E[X + Y] = E[X] + E[Y]. Always. Even when X and Y are dependent. This is the key insight.
- **Why it is powerful:** You can break a complex random variable into simpler indicator variables, compute their expected values independently, and sum.
- **Example 1:** Expected number of heads in n coin flips. Let Xi = 1 if flip i is heads, 0 otherwise. E[Xi] = p. E[total heads] = sum(E[Xi]) = n*p. No need to think about joint distributions.
- **Example 2:** Expected number of fixed points in a random permutation. Let Xi = 1 if element i is in position i. E[Xi] = 1/n. E[total fixed points] = sum(1/n) = 1. Exactly 1 fixed point on average, regardless of n. Surprising and elegant.

### 4. Variance and Standard Deviation

- **Variance:** Var(X) = E[(X - E[X])^2] = E[X^2] - (E[X])^2. Measures spread around the mean.
- **Standard deviation:** sigma = sqrt(Var(X)). Same units as X.
- **Why variance matters:** Two systems can have the same expected latency but very different variances. P50 vs P99 latency differences are variance.
- **For independent variables:** Var(X + Y) = Var(X) + Var(Y). Note: this requires independence, unlike linearity of expectation.

### 5. Chebyshev's Inequality

- **Statement:** P(|X - E[X]| >= k * sigma) <= 1/k^2.
- **Intuition:** The probability of being more than k standard deviations from the mean is at most 1/k^2. Within 2 sigma: at least 75%. Within 3 sigma: at least 89%.
- **Use case:** Bounding tail probabilities without knowing the exact distribution. If you know only the mean and variance, Chebyshev tells you how likely extreme values are.
- **Developer connection:** SLO error budget calculations, capacity planning margins.

### 6. Randomized Quicksort Expected Time

- Quicksort picks a random pivot, partitions, recurses. Expected comparisons: O(n log n).
- **Analysis using linearity of expectation:** Let Xij = 1 if elements i and j are compared. P(Xij = 1) = 2/(j-i+1). E[total comparisons] = sum over all pairs = O(n log n).
- This is one of the most famous applications of linearity of expectation. The random pivot ensures good expected performance regardless of input distribution.
- **Callback:** Phase 4 (algorithms) analyzed worst-case complexity. Here we analyze expected-case complexity for randomized algorithms -- a fundamentally different guarantee.

### 7. Bloom Filter False Positive Rate

- **What a Bloom filter is:** A space-efficient probabilistic data structure that tests set membership. False positives possible, false negatives impossible.
- **Parameters:** m bits, k hash functions, n inserted elements.
- **False positive probability:** Approximately (1 - e^(-kn/m))^k.
- **Optimal k:** k = (m/n) * ln(2). Minimizes false positive rate for given m and n.
- **Practical sizing:** Given desired false positive rate and expected number of elements, compute required m and k.
- **Code walkthrough:** Implement a Bloom filter, measure empirical false positive rate, compare to theoretical.

### 8. SLO/SLA Calculations

- **The math:** 99.9% uptime = 0.1% downtime = 43.2 minutes/month = 8.76 hours/year.
- **Compound SLOs:** If service A is 99.9% and service B is 99.9% and both must be up, overall availability = 99.9% * 99.9% = 99.8%. Each dependency multiplies downtime.
- **Error budgets:** If your SLO is 99.95%, you have a budget of 21.9 minutes of downtime per month. Deploys, experiments, and incidents all draw from this budget.
- **Expected number of incidents:** If each incident causes 10 minutes of downtime and you have a 22-minute budget, you can tolerate 2 incidents per month.
- **Table:** SLO tiers (99%, 99.9%, 99.95%, 99.99%) with downtime per day/month/year.

### 9. Coupon Collector Problem

- **Problem:** There are n distinct coupon types. Each random draw gives one coupon uniformly at random. How many draws expected to collect all n types?
- **Solution:** E[draws] = n * H(n) = n * (1 + 1/2 + 1/3 + ... + 1/n) approximately equals n * ln(n).
- **Derivation:** After collecting i types, the probability of getting a new type is (n-i)/n. Expected draws for the next new type: n/(n-i). Sum over i from 0 to n-1.
- **Developer connection:** "How many random API calls to hit all endpoints?" "How many random tests to cover all code paths?" "How many random samples to see all categories?"
- **Geometric distribution:** Each "waiting for the next new coupon" phase is a geometric random variable. Expected value of geometric(p) is 1/p.

### 10. Expected Retries Before Success

- **Geometric distribution:** If each attempt succeeds with probability p independently, the expected number of attempts until first success is 1/p.
- **Example:** Network request with 1% failure rate. Expected requests until failure: 100. Expected retries until success after a failure: 1/0.99 approximately equals 1.01.
- **Exponential backoff:** Retry strategies in distributed systems. Expected total wait time with exponential backoff.
- **Connection to SLOs:** Expected number of retries factors into SLO calculations and timeout budgets.

### Code Companion: expected_value.py

- **Expected value calculator:** Generic function for computing E[X] given a probability distribution. Supports linearity of expectation decomposition.
- **Bloom filter implementation:** Insert, query, false positive rate measurement, optimal parameter calculation.
- **SLO calculator:** Input an SLO percentage, output downtime budget per day/month/year. Compound SLO calculator for service chains.
- **Coupon collector simulation:** Run trials, compare empirical vs theoretical E[n * H(n)].

### The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "Expected value is the average" -- misses that it is a weighted average over a probability distribution, not a simple arithmetic mean of observed data |
| :white_check_mark: **Right** | E[X] = sum(xi * pi). Linearity of expectation (E[X+Y] = E[X] + E[Y], always) lets you decompose complex random variables into indicator variables. Variance measures spread. Chebyshev bounds tail probabilities using only mean and variance. |
| :x: **Too Formal** | Moment generating functions, characteristic functions, convergence theorems (law of large numbers, central limit theorem) |
| :warning: **Common Mistake** | Assuming Var(X+Y) = Var(X) + Var(Y) without checking independence. Unlike linearity of expectation, variance addition REQUIRES independence. For dependent variables, you need the covariance term. |

## Thread Progression

- **Proof Portfolio:** No new proofs. This part is computationally focused -- applying expected value to practical problems.
- **Code Companion:** `expected_value.py` -- expected value calculations, Bloom filter implementation, SLO calculator, coupon collector simulation.
- **Rosen Exercises:**
  - **Essential:** 7.4: 1, 3, 5, 7, 11, 15
  - **Recommended:** 7.4: 17, 23, 25
  - **Challenge:** 7.4: 31

## Further Resources

- **MIT 6.042J Lectures 18-19** -- Expected value, linearity of expectation, and variance. The fixed-point permutation example is covered here.
- **Bloom filter resources:** "Network Applications of Bloom Filters: A Survey" (Broder and Mitzenmacher) for applications. Interactive Bloom filter visualizations online.
- **Google SRE Book, Chapter 4** -- Service Level Objectives. The industry-standard reference for SLO calculations and error budgets.

## Key Takeaways

1. Expected value E[X] = sum(xi * pi) is the weighted average over all outcomes. Linearity of expectation (E[X+Y] = E[X] + E[Y], always, even for dependent variables) is the single most powerful tool for probabilistic analysis.
2. SLO math is expected value: 99.9% uptime means 43.2 minutes of downtime per month. Compound SLOs multiply, so each dependency reduces your budget.
3. The coupon collector needs n * ln(n) draws to collect all n types. This quantifies how many random samples you need for complete coverage -- directly applicable to testing and load balancing.

## Writer Notes

- The SLO section is the most immediately useful content in the entire probability phase. Every on-call engineer computes these numbers. Make the table of SLO tiers vs downtime a reference that readers bookmark.
- Linearity of expectation is the conceptual centerpiece. The randomized quicksort analysis and the fixed-point permutation example both demonstrate its power. Emphasize: "the sum rule for expectations does NOT require independence. This is why it is so powerful."
- The Bloom filter section bridges data structures and probability. Readers who have used Bloom filters in practice (Redis, Cassandra, browser safe browsing) will appreciate seeing the math behind the parameters they configure.
- Chebyshev's inequality is included for completeness but should not dominate. It is a tool for bounding, not an object of study. One worked example (SLO tail risk) is sufficient.
- The coupon collector problem has a satisfying derivation using geometric distribution and linearity of expectation. Walk through it step by step -- it ties together multiple concepts from this part.
- This is the last part of Phase 7. Close with a forward reference to Phase 8 (graphs): "Probability told you about randomized algorithms. Phase 8 gives you the data structures -- graphs and trees -- that those algorithms operate on."
