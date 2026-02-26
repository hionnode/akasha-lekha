# Content Patterns — Discrete Mathematics for Developers

## The DIFCP Pipeline

Every major concept in the series follows this five-beat structure: **Definition, Intuition, Formal, Code, Practice.** The depth of each beat varies by topic, but the order is fixed.

### Pipeline Beats

| Beat | Purpose | What It Looks Like |
|---|---|---|
| **Definition** | Precise statement of the concept | Alert box with formal definition. 1-3 sentences. No ambiguity. |
| **Intuition** | "What this really means" in developer terms | Tip box or prose connecting to code patterns the reader recognizes. |
| **Formal** | Mathematical treatment | Truth tables, proofs, formal notation. The rigorous version. |
| **Code** | Python that makes it executable | Runnable code demonstrating or verifying the concept. |
| **Practice** | Rosen exercises for reinforcement | Curated problem numbers at three tiers. |

### DIFCP Section Template

When writing a DIFCP section for a concept:

```markdown
<Alert type="important" title="Definition: [Concept Name]">

[Precise mathematical definition. 1-3 sentences.]

</Alert>

<Alert type="tip" title="Developer Intuition">

[Connection to code. What does this look like in Python/JS? What bug does it explain? What tool uses this?]

</Alert>

### Formal Treatment

[Truth tables, proofs, derivations. The math.]

### Code

```python title="concept_demo.py"
[Complete, runnable Python that demonstrates or verifies the definition]
```

[1-2 sentences explaining what the code shows]
```

### DIFCP Writing Rules

1. **Definition must be precise enough to code against.** If you cannot write a Python function from the definition alone, the definition is too vague.

2. **Intuition must name real code.** Not "this is useful in programming" but "this is what `filter()` does" or "this is why your SQL JOIN returned duplicate rows."

3. **Formal treatment must use the notation established in STYLE-GUIDE.md.** Unicode symbols in prose, code blocks for multi-line expressions, Python for computation.

4. **Code must be runnable as-is.** No imports from external libraries (stdlib only). No placeholder `...` sections. The reader should be able to copy-paste into a Python file and run it.

5. **Practice exercises come from Rosen.** Always cite section and problem numbers. Three tiers: Essential, Recommended, Challenge.

### When to Skip Beats

Not every concept in every post needs all five beats at full depth:

- **Skip extended Formal** for concepts where the truth table IS the formal treatment (basic connectives in Part 1).
- **Collapse Intuition + Code** when the code IS the intuition (Code Companion sections).
- **Skip Practice** for supplementary/bridge concepts not covered by Rosen (Part 7: SAT solvers, Part 39: Turing machines).
- **Never skip Definition.** Every concept gets a precise statement, even if it is one sentence.

---

## The Formality Spectrum

Every post includes a "Formality Spectrum" box showing four levels. This replaces the AWS series' "Fine Line" box.

The Formality Spectrum anchors each post's level of rigor against two failure modes: too hand-wavy (breaks when edge cases hit) and too formal (kills motivation without adding practical value). It also flags the most common mistake students make with that concept.

### Format

```mdx
<Alert type="warning" title="The Formality Spectrum">

| | |
|---|---|
| :x: **Too Informal** | {Hand-wavy understanding that breaks when edge cases hit} |
| :white_check_mark: **Right** | {Precise enough to implement correctly, formal enough to prove things} |
| :x: **Too Formal** | {Measure-theoretic or category-theoretic overkill that kills motivation} |
| :warning: **Common Mistake** | {Specific error students make with this concept} |

</Alert>
```

### Placement

- After the main content sections, before What's Coming
- One per post (never multiple Formality Spectrum boxes)
- The "Right" row should match exactly what the post teaches

### Writing Guidelines

- **Too Informal**: A concrete misunderstanding that causes bugs or wrong proofs. Not "doesn't understand deeply enough" but "will write `!(a && b)` as `(!a && !b)` and ship a bug."
- **Right**: Specific enough to be actionable. Should read like a one-sentence summary of the post's core lesson.
- **Too Formal**: Should be something a real math course would cover that is overkill for developers. Name the specific topic (propositional logic via the Sheffer stroke, set theory via ZFC axioms) and why it is too much right now.
- **Common Mistake**: The specific wrong thing students do. Not "be careful with negation" but "negating p → q as p → ¬q instead of the correct p ∧ ¬q."

---

## Proof Block Pattern

Proofs are a core deliverable of the series. Every proof uses this consistent format.

### Format

```mdx
<Alert type="important" title="Theorem: [Name]">

[Statement of the theorem]

</Alert>

**Proof.** [Strategy sentence: "We prove this by contradiction." / "We proceed by induction on n."]

[Body of proof. Each step states WHAT it does and WHY it works.]

[Final sentence establishing the conclusion.]  ∎
```

### Example

```mdx
<Alert type="important" title="Theorem: De Morgan's First Law">

For any propositions p and q: ¬(p ∧ q) ≡ ¬p ∨ ¬q

</Alert>

**Proof.** We prove logical equivalence by showing both expressions have identical truth tables.

| p | q | p ∧ q | ¬(p ∧ q) | ¬p | ¬q | ¬p ∨ ¬q |
|---|---|-------|----------|----|----|---------|
| T | T |   T   |    F     | F  | F  |    F    |
| T | F |   F   |    T     | F  | T  |    T    |
| F | T |   F   |    T     | T  | F  |    T    |
| F | F |   F   |    T     | T  | T  |    T    |

The columns for ¬(p ∧ q) and ¬p ∨ ¬q are identical in all four rows. Since both expressions evaluate to the same truth value for every possible assignment of p and q, they are logically equivalent.  ∎
```

### Proof Writing Rules

1. **State the proof strategy upfront.** The reader should know whether this is direct, contradiction, induction, etc. before the first step.
2. **Explain every step.** "By the definition of..." / "Since we assumed..." / "Applying De Morgan's law from Part 1..."
3. **Never write "clearly" or "obviously."** If it were obvious, you would not need a proof.
4. **End with ∎ (QED marker).** Every proof ends with the Unicode tombstone character.
5. **Use "we" throughout.** "We assume...", "We need to show...", "We have established..."

---

## Code Companion Pattern

Every post includes a substantial Python program. This is not a toy example. It makes the math executable.

### Format

```markdown
## Code Companion: [What We're Building]

[1-2 sentences on what the program does and why it is useful]

```python title="concept_name.py"
[Complete, runnable Python with type hints]
[Comments explain non-obvious logic, not every line]
```

[Brief explanation of key output or how to modify it]
```

### Code Companion Rules

1. **Complete and runnable.** No external dependencies. No setup required beyond Python 3.10+.
2. **Type hints on all function signatures.** The reader is a developer; match their expectations.
3. **Meaningful variable names.** `proposition` not `p` (unless `p` is the mathematical convention being taught).
4. **Output demonstrates the concept.** The program should print something that verifies or illustrates the math.
5. **Include a `if __name__ == "__main__":` block** with example usage.

---

## Rosen Exercise Section

Every post ends with curated exercises from Rosen (8th edition).

### Format

```markdown
## Practice with Rosen (8th Edition)

**Essential (do these):** Section X.Y: 1, 3, 7, 11, 15
**Recommended (if time):** Section X.Y: 23, 25, 31
**Challenge (stretch):** Section X.Y: 41, 47
```

### Selection Guidelines

- **Essential:** 5-7 problems that directly reinforce the post's core concepts. Include at least one proof exercise (starting Part 4).
- **Recommended:** 3-5 problems that extend the concepts or require combining ideas.
- **Challenge:** 2-3 problems that are genuinely hard. These are for readers who want depth.
- **Total per post:** 10-15 problems across all three tiers.
- **Cross-section coverage:** If a post covers multiple Rosen sections, include problems from each.

---

## Inline Reference Pattern

Embed references at the point of maximum relevance, not just at the end of the post. This connects the reader to deeper material exactly when they are most motivated to explore it.

### Placement Rules

**After a proof or theorem:**
> MIT 6.042J Lecture 3 walks through this same proof with visual diagrams.

**After a concept that has more depth:**
> Rosen Section 1.1 covers this with 20+ practice problems if you want to drill it.

**When simplifying something that has a fuller treatment elsewhere:**
> We are covering the essentials here. Sipser Chapter 2 gives the complete formal treatment if you want the full picture.

### Rules

- 2-4 inline references per post (not every section needs one)
- Each reference names the specific resource and what the reader gains from it
- Never interrupt a proof or definition to insert a reference — place after the concept is complete
- Use a `:::tip` directive or a brief parenthetical, not a full section break
- Resources mentioned inline should also appear in the end-of-post Further Resources section as a curated summary

---

## Further Resources Section

Every post includes 2-4 curated external references at the end. This section serves as a curated summary of inline references plus 1-2 additional items.

### Format

```markdown
## Further Resources

- **MIT 6.042J Lecture N** — [specific topic covered in that lecture]
- **Book of Proof, Chapter N** — [what this chapter covers that supplements the post]
- **[Video/Course Name]** — [what the reader gains from this resource]
```

### Resource Selection

- **MIT 6.042J** (Mathematics for Computer Science): Free video lectures. Reference the specific lecture number that covers the post's topic.
- **Book of Proof** (Richard Hammack): Free online textbook. Excellent for proof practice. Reference specific chapters.
- **3Blue1Brown / other visual resources:** For topics where visual intuition helps (graphs, probability, linear algebra connections).
- **Coursera UCSD Discrete Math:** For readers who want more structured practice with automated grading.

### Relationship to Inline References

The end-of-post section is not the only place references appear. Inline references (see above) embed resources where they are most useful. The Further Resources section collects everything mentioned inline into one list and adds 1-2 resources that do not fit naturally inline but are still valuable for the topic.

---

## Post Length Guidelines

| Category | Parts | Word Count | Rationale |
|---|---|---|---|
| Standard | Most parts | 2,500-4,000 | Normal concept depth |
| Proof-heavy | Phase 1 (4-7) | 4,000-5,500 | Proof techniques need extended examples |
| Algorithm-heavy | Phase 4 (17-19), Phase 8 (30-35) | 3,000-4,500 | More code, less prose |
| Bridge | Phase 9 (36-39) | 2,000-3,000 | Forward references, lighter depth |
| Capstone topics | 23, 26, 29 | 3,500-5,000 | Major applications (RSA, generating functions, expected value) |

### Managing Length

- **If a post is running long**, reduce the number of DIFCP cycles. Give 3-4 concepts full treatment and handle the rest with definitions + code only.
- **If a post is running short**, add depth to the Code Companion or include an additional proof.
- **Code blocks don't count toward word count.** A post with 2,500 words of prose and 100 lines of Python is fine.
- **The Formality Spectrum, Practice with Rosen, Further Resources, and Key Takeaways are mandatory regardless of length.**

---

## Cross-Referencing

### Back-References

When referring to something established in an earlier part:

```markdown
As we proved in [Part 1](/blog/discrete-mathematics/01-propositions-and-logic-gates), De Morgan's laws let us push negation through conjunctions and disjunctions.
```

- Use inline markdown links
- Reference the specific concept, not just "see Part N"
- Maximum 3-4 back-references per post
- Back-references should never be required reading

### Forward-References

When teasing upcoming content:

```markdown
:::note
**Coming in Part 13:** Mathematical induction formalizes the recursive thinking you already use. If you can write a recursive function, you can write an induction proof.
:::
```

- Use `:::note` directive
- Be specific about what's coming
- Maximum 2 forward-references per post

### What's Coming Section

Every post ends with a brief What's Coming section:

```markdown
## What's Coming

Next in **Part N: [Title]**, we [specific topic]. [One sentence on how it builds on the current part.]
```

---

## Key Takeaways Pattern

3-5 numbered items at the very end of the post.

```markdown
## Key Takeaways

1. {One sentence, actionable or memorable}
2. {One sentence}
3. {One sentence}
```

- Each takeaway is exactly one sentence
- Mix of practical ("De Morgan's laws: push the negation in, flip the operator") and conceptual ("Every if statement is a proposition, and the rules of logic are its specification")
- At least one takeaway should be quotable out of context
- Avoid restating checklist items
