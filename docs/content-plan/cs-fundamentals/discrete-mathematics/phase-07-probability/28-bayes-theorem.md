# Part 28: Conditional Probability and Bayes' Theorem: Why Most Positive Tests Are Wrong

> Rosen Sections: 7.2-7.3
> Blog file: `apps/web/src/content/blog/discrete-mathematics/28-bayes-theorem.mdx`
> Estimated word count: 3,500-4,000

## Frontmatter

```yaml
---
title: "Conditional Probability and Bayes' Theorem: Why Most Positive Tests Are Wrong"
description: "Master conditional probability and Bayes' theorem — understand why 99% accurate monitoring alerts are mostly false positives and build a naive Bayes spam classifier."
excerpt: "If your monitoring alert is 99% accurate and the event is rare, most alerts are false positives. Bayes' theorem explains why — and it is the foundation of spam filters, medical testing, and every system that updates beliefs with evidence."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "probability"]
series: "Discrete Mathematics for Developers"
seriesPart: 28
featured: false
draft: true
---
```

## Component Imports

```mdx
import Alert from '../../../components/shared/Alert.astro';
import PanelSwitcher from '../../../components/shared/PanelSwitcher.astro';
import Panel from '../../../components/shared/Panel.astro';
```

## Opening Hook

- **Scenario:** Your monitoring system fires an alert: "99% accurate! Anomaly detected!" You page the on-call engineer. It is a false positive. Again. Your alert has a 99% detection rate, but the event occurs only 0.1% of the time. Do the math: most alerts are false.
- **Reveal:** This is base rate neglect -- ignoring how rare the event is. Bayes' theorem is the correction. It tells you: given a positive test result, what is the actual probability the event occurred? The answer depends on the base rate, and it is almost always lower than you expect.
- **Outcome:** By the end, you will compute conditional probabilities, derive and apply Bayes' theorem, understand why false positive rates dominate when base rates are low, and build a naive Bayes spam classifier from scratch.

## Section Outline

### 1. Why This Matters

- Every monitoring alert, every medical test, every spam filter, every anomaly detector faces the false positive problem. If the condition being detected is rare, even a highly accurate test produces mostly false positives.
- Developers design alerting systems and interpret their outputs constantly. Without Bayes' theorem, you cannot reason about alert quality.
- This is arguably the single most practically important concept in the entire probability phase.

### 2. Conditional Probability Definition and Formula

- **Definition:** P(A|B) = P(A intersection B) / P(B), provided P(B) > 0. "The probability of A given that B has occurred."
- **Intuition:** Once you know B happened, the sample space shrinks from S to B. You are now asking: within B, how much of A is left?
- **Example:** Drawing cards. P(Ace | Face card drawn) -- the sample space shrinks to the 12 face cards, none of which are aces, so the probability is 0.
- **Code connection:** Filtering a dataset. `df[df.status == "error"]` is restricting the sample space. Any further statistics on that filtered set are conditional probabilities.

### 3. Independence

- **Definition:** Events A and B are independent if P(A|B) = P(A), equivalently P(A intersection B) = P(A) * P(B).
- **Intuition:** Knowing B happened tells you nothing new about A. The conditional probability equals the unconditional probability.
- **Developer trap:** Assuming independence when events are correlated. CPU usage and memory usage on the same server are NOT independent. Request latency and error rate on the same service are NOT independent.
- **Testing for independence:** Compare P(A|B) to P(A). If they differ significantly, the events are dependent.

### 4. Bayes' Theorem Statement and Proof

- **Statement:** P(A|B) = P(B|A) * P(A) / P(B).
- **Expanded form:** P(A|B) = P(B|A) * P(A) / [P(B|A) * P(A) + P(B|A') * P(A')]. This is the total probability form, useful when B can occur via A or via not-A.
- **Derivation (Proof Portfolio +1):**
  1. Start from the definition: P(A|B) = P(A intersection B) / P(B).
  2. Similarly: P(B|A) = P(A intersection B) / P(A).
  3. Therefore: P(A intersection B) = P(B|A) * P(A).
  4. Substitute: P(A|B) = P(B|A) * P(A) / P(B).
  5. Expand P(B) using total probability: P(B) = P(B|A) * P(A) + P(B|A') * P(A').
- **Terminology:** P(A) is the prior (before evidence), P(A|B) is the posterior (after evidence), P(B|A) is the likelihood, P(B) is the normalizing constant.

### 5. The False Positive Problem: Monitoring Systems

- **Setup:** An anomaly detector has 99% sensitivity (P(alert|anomaly) = 0.99) and 99% specificity (P(no alert|no anomaly) = 0.99). Anomalies occur 0.1% of the time (P(anomaly) = 0.001).
- **Question:** Given an alert fires, what is the probability of an actual anomaly?
- **Calculation:** P(anomaly|alert) = (0.99 * 0.001) / (0.99 * 0.001 + 0.01 * 0.999) = 0.00099 / 0.01098 = approximately 9%.
- **Result:** Despite 99% accuracy, only about 9% of alerts are true positives. This is why on-call engineers learn to ignore alerts.
- **Fix:** Increase specificity (reduce false positive rate), increase the base rate by narrowing the monitoring scope, or require multiple independent signals before alerting.

### 6. Base Rate Neglect

- The cognitive bias: people focus on the test accuracy (99%!) and ignore the base rate (0.1%). The base rate dominates when the event is rare.
- **Real-world examples:** Medical screening tests, security threat detection, fraud detection systems, rare bug detection in static analysis.
- **Rule of thumb:** When prevalence is much less than the false positive rate, most positives are false. This is not a flaw in the test -- it is a mathematical fact.

### 7. Medical Testing Analogy

- Walk through the classic medical testing example to reinforce the pattern.
- Disease prevalence: 1 in 1,000. Test sensitivity: 99%. Test specificity: 95%.
- P(disease|positive test) = (0.99 * 0.001) / (0.99 * 0.001 + 0.05 * 0.999) = approximately 1.9%.
- The numbers are shocking to most people. This is why positive screening tests require follow-up confirmation.

### 8. Naive Bayes Classification: Spam Filtering

- **The idea:** Classify an email as spam or not-spam based on the words it contains. Use Bayes' theorem to compute P(spam|words).
- **Naive assumption:** Treat each word as independent given the class. P(w1, w2, ..., wn | spam) = product of P(wi | spam). This is wrong in practice (words are correlated) but works surprisingly well.
- **Training:** Count word frequencies in spam vs not-spam emails. Compute P(word|spam) and P(word|not-spam) for each word.
- **Classification:** For a new email, compute P(spam|words) vs P(not-spam|words). Classify by whichever is larger.
- **Laplace smoothing:** Add 1 to all counts to handle words not seen in training data (avoid zero probabilities).
- **Code walkthrough:** Build the classifier step by step.

### 9. Updating Beliefs with Evidence

- Bayes' theorem is fundamentally about updating beliefs. The prior is your belief before evidence. The posterior is your belief after evidence.
- **Sequential updates:** If you get multiple pieces of evidence, apply Bayes' theorem iteratively. The posterior from the first update becomes the prior for the second.
- **Developer analogy:** Debugging. Your prior: "the bug is probably in the database layer." Evidence: "the unit tests pass." Updated posterior: "the bug is probably in the API layer." Each piece of evidence shifts your belief.

### 10. Bayesian vs Frequentist (Brief Mention)

- **Frequentist view:** Probability is the long-run frequency of events. You flip a coin 1,000 times, the fraction of heads approaches 0.5.
- **Bayesian view:** Probability is a degree of belief. You can assign a probability to a one-time event ("the probability this deploy causes an outage is 5%").
- This is a deep philosophical distinction. For this series, both views are useful. Frequentist for simulations and sampling. Bayesian for reasoning about evidence and updating beliefs.
- Not going deeper -- this is a mention, not a treatment.

### Code Companion: bayesian.py

- **Bayes updater:** Function that takes prior, likelihood, and evidence probability, returns posterior. Supports sequential updates with multiple evidence items.
- **Naive Bayes spam classifier:** Train on a small labeled dataset of emails. Classify new emails. Show accuracy, false positive rate, false negative rate.
- **Visualization:** Bar charts showing how posterior probability shifts as evidence accumulates.

### The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "Bayes' theorem flips the conditional" -- misses the role of base rates entirely, which is the whole point |
| :white_check_mark: **Right** | P(A\|B) = P(B\|A) * P(A) / P(B). The prior P(A) captures the base rate. When the event is rare, even a highly accurate test produces mostly false positives because P(B\|A') * P(A') dominates the denominator. |
| :x: **Too Formal** | Deriving Bayes' theorem from measure-theoretic probability, sigma-algebras, Radon-Nikodym derivatives |
| :warning: **Common Mistake** | Confusing P(A\|B) with P(B\|A). "The probability of having the disease given a positive test" is NOT "the probability of a positive test given the disease." This confusion is exactly what Bayes' theorem resolves. |

## Thread Progression

- **Proof Portfolio:** +1 new proof (Bayes' theorem derivation from conditional probability definition). Running total: 28 proofs.
- **Code Companion:** `bayesian.py` -- Bayes updater with sequential evidence support, naive Bayes spam classifier with Laplace smoothing.
- **Rosen Exercises:**
  - **Essential:** 7.2: 1, 3, 5, 7, 11, 15; 7.3: 1, 3, 5
  - **Recommended:** 7.2: 23; 7.3: 7, 11
  - **Challenge:** 7.3: 15

## Further Resources

- **MIT 6.042J Lectures 17-18** -- Conditional probability, independence, and Bayes' theorem with worked examples.
- **3Blue1Brown: "Bayes' theorem, the geometry of changing beliefs"** -- Visual, geometric intuition for how priors and evidence interact. One of the best explanations of Bayes' theorem available.
- **Paul Graham: "A Plan for Spam" (2002)** -- The essay that popularized naive Bayes spam filtering. Shows how the math translates directly to a working system.

## Key Takeaways

1. Conditional probability P(A|B) shrinks the sample space to B. Independence means knowing B tells you nothing about A. Most real-world events are NOT independent.
2. Bayes' theorem corrects for base rates: when the event is rare, even a 99% accurate test produces mostly false positives. This is not a flaw -- it is arithmetic.
3. Naive Bayes classification applies Bayes' theorem to feature vectors (treating features as independent). It is mathematically naive but practically powerful -- spam filters, sentiment analysis, and anomaly detection all use it.

## Writer Notes

- This is the most practically important part in the probability phase. The false positive problem affects every developer who builds or interprets monitoring, alerting, or anomaly detection systems. Make the monitoring example the centerpiece.
- The Bayes' theorem derivation is the only new proof in this phase. It is short (5 lines) and entirely mechanical -- a direct consequence of the conditional probability definition. Present it as "this is not a deep result, it is algebraic rearrangement" to demystify it.
- The medical testing analogy reinforces the monitoring example with a second domain. Two worked examples with different numbers drive the point home better than one.
- The naive Bayes spam classifier is the Code Companion's highlight. Build it from scratch -- tokenize emails, count word frequencies, apply Bayes' theorem, classify. This is a real ML algorithm implemented in under 50 lines of Python.
- Keep the Bayesian vs frequentist section brief (2-3 paragraphs). This is a mention, not a treatment. The series is discrete math, not philosophy of probability. Just plant the flag that both perspectives exist.
- Forward-reference Part 29 (expected value): "Bayes' theorem tells you the probability of an event. Part 29 tells you the expected impact -- what happens on average when you factor in all possible outcomes."
