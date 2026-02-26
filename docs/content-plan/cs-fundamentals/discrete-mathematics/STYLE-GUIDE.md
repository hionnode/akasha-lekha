# Style Guide — Discrete Mathematics for Developers

This is the canonical style guide for the 39-part "Discrete Mathematics for Developers" series on [works-on-my.cloud](https://works-on-my.cloud). Every post in the series must conform to these rules. When in doubt, re-read this document before writing.

---

## Audience

The reader is a **developer with 1-5 years of experience** who wants to understand the math behind their tools. Not a math student. Not an academic.

Specifically, they:

- Write code daily and have shipped real software (side projects, startup MVPs, jobs).
- Have encountered boolean logic, recursion, hash tables, and graph traversal in code but lack the formal vocabulary to reason about them precisely.
- Want to understand *why* algorithms work, not just memorize Big-O tables.
- Are curious about the foundations but have been intimidated by math notation and proof writing.
- Would rather see a Python implementation alongside a theorem than read a page of symbols.
- Are spending their own time, so every paragraph must earn its place.

Do not write for:

- Complete beginners who need to learn what a variable or loop is.
- Math undergraduates preparing for a pure math exam.
- Academics who want measure-theoretic rigor or category theory connections.
- People who want a reference manual instead of a learning path.

When you write, imagine a single person: a developer with 3 years of experience who keeps hearing "you should learn discrete math" and finally decided to do it, but will bounce if the first page looks like a textbook.

---

## Voice and Tone

**Direct, opinionated, second person ("you"), active voice.** Every sentence should sound like a mentor explaining math at a whiteboard, not a professor lecturing to 200 students.

Core principles:

- **No hedging.** Do not write "might", "could perhaps", "it depends" without immediately resolving it. If a concept has multiple valid interpretations, state them and pick the one that matters for developers.
- **Conversational but technically precise.** The tone is informal. The content is not. Use correct mathematical terminology. Explain notation on first use, then use it freely. Never sacrifice precision for friendliness.
- **The voice of a mentor explaining, not a senior managing.** This series has no AI agent thread. The relationship is: you know the math, the reader knows the code, and together you connect them. You explain *why* each step works, not just *what* the step is.
- **Show confidence in explanations.** When multiple proof strategies exist, name them, pick one, and explain why. The reader came here for clarity, not a survey of approaches.
- **Humor is dry, brief, and earned.** A well-placed observation about how every developer has botched a De Morgan negation lands well. Forced jokes, puns, and "fun facts" do not.

Examples of good voice:

> "You write `if (!user.isActive && !user.isAdmin)` and then spend five minutes staring at it trying to negate the whole thing. The problem is not your brain. The problem is that you are doing De Morgan's law in your head without knowing the rules."

> "Induction feels like recursion because it is recursion. The base case is the base case. The inductive step is the recursive call. If you can write a recursive function, you can write an induction proof."

Examples of bad voice:

> "Propositional logic is a fundamental branch of mathematical logic that has numerous applications in computer science and related fields."

> "Fun fact: George Boole invented Boolean algebra in 1854! That's over 170 years ago!"

---

## Opening Pattern

Every post opens with the same three-beat structure. No exceptions.

**Beat 1: A code scenario the reader recognizes (2-4 sentences max).**
This is not a generic statement about why the topic matters. It is a specific coding situation. The reader should think "I literally did that last week."

**Beat 2: The "what's really happening" reveal (1-2 sentences).**
Name the mathematical concept hiding inside the code scenario. This is the bridge moment: "you already know this, you just don't have the vocabulary."

**Beat 3: An outcome promise ("By the end, you'll...").**
Name the concrete capability. Not "you'll understand propositional logic" but "you'll be able to simplify any boolean expression using algebraic laws and prove it correct with a truth table."

Example for Part 1:

> You write `if (!user.isActive && !user.isAdmin)` and pause. Negate the whole condition in your head. If you hesitated, even for a second, you just ran into De Morgan's law.
>
> Every `if` statement is a proposition. Every `&&` is conjunction. Every `||` is disjunction. You have been doing propositional logic your entire career.
>
> **By the end of this post,** you will know the formal rules behind boolean expressions, be able to simplify any compound condition using algebraic laws, and have a Python truth table generator that verifies your work.

---

## Title and Subtitle Convention

Every post title follows the format: `"{Topic}: {Developer-Angle Subtitle}"`

**Title rules:**

- 5-12 words, descriptive of what the reader will learn.
- The topic portion names the mathematical concept directly.
- The subtitle connects to code or developer experience. It tells the reader why this matters to them.
- Never clickbait. Never questions as titles.

**Examples:**

- "Propositions and Logic Gates: What `if` Statements Really Mean"
- "Predicate Logic: From Booleans to Quantifiers"
- "Mathematical Induction: Recursion's Formal Twin"
- "Graph Fundamentals: Everything Is a Graph"
- "RSA and Cryptography: Why Number Theory Matters"

**Anti-examples:**

- "Introduction to Propositional Logic" (no developer angle)
- "Everything You Need to Know About Sets" (too broad)
- "Can You Solve This Proof?" (question title)

---

## Section Flow

Every post follows this standard structure. Not every section appears in every post, but the order is fixed.

### 1. Why This Matters

The developer motivation. Make it concrete and specific. Name real code patterns, real bugs, real tools that use this math. This is not "logic is important" but "every `if` statement is a proposition, and the reason you botch complex conditions is that you are doing algebra without knowing the rules."

2-3 paragraphs maximum.

### 2. Definition / Intuition Sections (varies by topic)

The meat of the post. Each major concept gets the DIFCP treatment (see CONTENT-PATTERNS.md): Definition, Intuition, Formal, Code, Practice. Use H2 and H3 headers liberally. Never let a section run longer than a screen without a visual break.

### 3. Code Companion

A complete, runnable Python program that makes the math executable. This is not an afterthought. It is a core teaching tool. The reader should be able to copy-paste it, run it, modify it, and see the math in action.

### 4. The Formality Spectrum

A structured section in every post showing the range from too informal to too formal for that topic, plus a common mistake. See CONTENT-PATTERNS.md for the full specification.

### 5. What's Coming

2-3 sentences teasing the next part. Name specific concepts. Build anticipation by connecting the current part's output to the next part's input.

### 6. Practice with Rosen (8th Edition)

Curated exercises at three tiers: Essential (do these), Recommended (if time), Challenge (stretch). Specific section and problem numbers.

### 7. Further Resources

2-4 curated references: MIT 6.042J lectures, Book of Proof chapters, videos, courses. Each with a one-line description of what it covers. This section is a curated summary of references that were also embedded inline throughout the post (see Embedded References below), plus 1-2 additional items.

### 8. Key Takeaways

3-5 numbered items. Each is exactly one sentence. These are the ideas the reader should remember a month from now.

---

## Math Notation Conventions

**The codebase has no KaTeX or MathJax support.** Until `remark-math` + `rehype-katex` are added (planned for Phase 3+), all notation uses these conventions:

### Unicode Symbols in Prose

Use Unicode math symbols directly in prose text:

| Symbol | Meaning | Unicode |
|--------|---------|---------|
| ¬ | NOT / negation | U+00AC |
| ∧ | AND / conjunction | U+2227 |
| ∨ | OR / disjunction | U+2228 |
| ⊕ | XOR / exclusive or | U+2295 |
| → | implication | U+2192 |
| ↔ | biconditional | U+2194 |
| ∀ | for all | U+2200 |
| ∃ | there exists | U+2203 |
| ∈ | element of | U+2208 |
| ∉ | not element of | U+2209 |
| ⊆ | subset or equal | U+2286 |
| ⊂ | proper subset | U+2282 |
| ∅ | empty set | U+2205 |
| ∪ | union | U+222A |
| ∩ | intersection | U+2229 |
| ℕ | natural numbers | U+2115 |
| ℤ | integers | U+2124 |
| ℝ | real numbers | U+211D |
| ∎ | end of proof (QED) | U+220E |

### Formal Expressions in Code Blocks

For multi-line formal expressions, use plain code blocks:

```
∀x ∈ ℕ: P(x) → P(x + 1)
```

### Python for Computation

All computational expressions use Python. This keeps the math executable and avoids notation-only comprehension barriers.

### When KaTeX Is Added

When `remark-math` + `rehype-katex` are added in a future update, inline math uses `$...$` and display math uses `$$...$$`. Until then, never use dollar-sign math delimiters in posts.

---

## Proof Writing Style

Proofs are a core skill in this series. Every proof follows a consistent format:

### Proof Structure

1. **Theorem statement** in an Alert component with `type="important"`
2. **Proof strategy** stated in one sentence ("We prove this by contradiction..." / "We proceed by induction on n...")
3. **Proof body** with each step explained: what the step is AND why it works
4. **QED marker** (∎) at the end

### Proof Voice

- Explain every step, not just the "clever" ones. The reader is learning proof technique, not just this specific result.
- When a step uses a previously proven result, reference it: "By De Morgan's law (which we proved in Part 1)..."
- Use "we" in proofs: "We assume...", "We need to show...", "We have shown..."
- Never write "it is obvious that" or "clearly." If it were obvious, you would not need a proof.

---

## Python Conventions

- **Version:** Python 3.10+ (for match/case, union types with `|`)
- **Type hints:** Always include type hints on function signatures
- **Dependencies:** Standard library only, except `matplotlib` where explicitly noted for visualization
- **Runnable:** Every code block must be copy-paste runnable. No `...` placeholders, no "fill in the blank"
- **Style:** Functions over classes unless the concept naturally maps to OOP (graphs, trees)
- **Naming:** `snake_case` for functions and variables, `PascalCase` for classes, `UPPER_CASE` for constants

---

## Prose Rules

These rules are non-negotiable. Apply them to every paragraph.

**Paragraph length:** Maximum 4 lines in the editor. If a paragraph runs longer, break it. Short paragraphs are easier to scan.

**Bold:** Use sparingly. Bold the first occurrence of a key term when you define it. Bold critical warnings. Do not bold for general emphasis.

**Comparisons:** Use tables, not prose. When comparing two or more approaches, a table communicates differences faster than paragraphs.

**Code blocks:** Always include `title="filename.py"` metadata so the reader knows what the code is. Use `terminal` meta for output blocks.

**Numbers over qualifiers:** Prefer concrete numbers. Write "5 connectives" not "several connectives." Write "2^n rows" not "exponentially many rows."

**Punctuation:** No em dashes. Use commas, periods, or parentheses instead.

**Cross-references:** Write "Part N" when referencing other parts. Link to the post: "As we proved in [Part 4](/blog/discrete-mathematics/04-proof-techniques-direct)".

**Openings:** Never write "In this article we will..." or "Today we're going to..." Start doing the thing. The opening pattern replaces all preamble.

**Lists:** Bulleted for unordered items, numbered only when order matters.

---

## Embedded References

Each post should weave in 2-4 references at the point of maximum relevance, not only in the end-of-post Further Resources section.

### Why

A reference is most valuable when the reader is actively thinking about the concept it covers. "MIT 6.042J Lecture 3 walks through this same proof in the first 20 minutes" is more useful immediately after the proof than buried in a list at the bottom of the post.

### How

- After a proof or theorem: point to a lecture or textbook section that covers the same argument differently.
- After a concept with more depth than the post provides: name the resource and what the reader gains.
- When simplifying: acknowledge the simplification and name where the full treatment lives.

### Rules

- 2-4 inline references per post. Not every section needs one.
- Each reference names the specific resource (lecture number, chapter, section) and what the reader gains.
- Never interrupt a proof or definition to insert a reference. Place after the concept is complete.
- Use a `:::tip` directive or a brief parenthetical, not a full section break.
- Resources mentioned inline must also appear in the end-of-post Further Resources section.

---

## Conceptual On-Ramp

Before any formal "Definition:" box, spend 2-3 sentences connecting to what the reader already knows. The progression is always: **familiar code -> new vocabulary -> formal definition.**

### Rules

- The first formal definition in any post should never be the first thing after the opening hook. There must be a "Why This Matters" section between the hook and the first definition.
- Before each Definition alert box, include 2-3 sentences that build from something the reader already uses in code to the formal concept being introduced. Start with `isActive` and `hasPermission`, then introduce "propositional variable."
- Do not dump multiple formal definitions back-to-back without connecting prose. Each definition needs its on-ramp.
- The on-ramp is not padding. It is the bridge between "I know this from code" and "now I know the formal name." Without it, the post reads like a textbook.

### Example

Bad (textbook energy):
> **Definition:** A proposition is a declarative sentence that is either true or false, but not both.

Good (on-ramp):
> You already work with propositions. Every boolean variable is one. `isActive`, `hasPermission`, `isConnected`. The formal name is **proposition**. The formal rule is: exactly two values, true or false, nothing else.
>
> **Definition:** A proposition is a declarative sentence that is either true or false, but not both.

---

## What NOT to Do

These are hard rules, not suggestions.

- **Don't write like a textbook.** Textbooks are dry, exhaustive, and third person. This series is opinionated, selective, and second person. If a sentence would fit in Rosen unchanged, rewrite it.
- **Don't hedge every explanation with "it depends."** If it depends, say on what, and give the developer-relevant answer.
- **Don't use academic jargon without explanation.** "Tautology" needs a definition on first use. "Modus ponens" needs to be connected to something the reader recognizes.
- **Don't explain basic programming concepts.** The reader knows what variables, loops, functions, and boolean expressions are. Start from there.
- **Don't pad word count.** Every sentence must teach something or connect math to code. If a paragraph does neither, delete it.
- **Don't use emojis in prose.** The only exception is The Formality Spectrum boxes, where the standard markers are used.
- **Don't write disclaimers.** Do not write "this is simplified" or "a full treatment would require..." Own the level of coverage. If something is intentionally simplified, the Formality Spectrum box handles that.
- **Don't skip the "why."** Every theorem, every definition, every proof technique must be motivated by a developer use case. If you cannot name a use case, reconsider whether the concept belongs in this series (it does, because Rosen covers it, so find the use case).
