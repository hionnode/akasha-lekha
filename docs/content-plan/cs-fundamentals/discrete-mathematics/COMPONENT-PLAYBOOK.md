# Component Playbook — Discrete Mathematics for Developers

Reference for all components available when writing the 39-part Discrete Mathematics blog series. Blog posts are MDX files in `apps/web/src/content/blog/discrete-mathematics/`. Components live in `apps/web/src/components/shared/`.

---

## Standard Import Block

Every DM series post should start with the relevant subset of this import block immediately after the frontmatter:

```mdx
import Alert from '../../../components/shared/Alert.astro';
import ValidationChecklist from '../../../components/shared/ValidationChecklist.astro';
import PanelSwitcher from '../../../components/shared/PanelSwitcher.astro';
import Panel from '../../../components/shared/Panel.astro';
import ComparisonTable from '../../../components/shared/ComparisonTable.astro';
import ComparisonHeader from '../../../components/shared/ComparisonHeader.astro';
import ComparisonRow from '../../../components/shared/ComparisonRow.astro';
```

**Only import components actually used in the post. Never import unused components.**

---

## Component Reference

### Quick Reference Table

| Content Need | Component | Import Required? | Notes |
|---|---|---|---|
| Theorem/definition box | `<Alert type="important">` | Yes | Formal mathematical statements |
| Intuition/dev connection | `<Alert type="tip">` or `:::tip` | Depends | Use component for longer blocks, directive for inline |
| The Formality Spectrum | `<Alert type="warning">` | Yes | Standard format, see CONTENT-PATTERNS.md |
| Common mistakes | `<Alert type="caution">` | Yes | Proof errors, notation pitfalls |
| Notes/context | `:::note` | No (remark plugin) | Inline directive |
| Tips (inline) | `:::tip` | No (remark plugin) | Inline directive |
| Warnings (inline) | `:::warning` | No (remark plugin) | Inline directive |
| Caution (inline) | `:::caution` | No (remark plugin) | Inline directive |
| Math vs Python tabs | `<PanelSwitcher>` + `<Panel>` | Yes | Side-by-side formal/code |
| Feature comparisons | `<ComparisonTable>` | Yes | Operator comparison tables |
| End-of-post checklist | `<ValidationChecklist>` | Yes | Understanding verification |
| Python code | `` ```python title="file.py" `` | No | Code companion blocks |
| Terminal output | `` ```bash terminal `` | No | Program output display |
| Formal notation | `` ``` `` (plain code block) | No | Multi-line formal expressions |
| Steps (inline) | `:::steps` | No (remark plugin) | Numbered proof steps |
| Code alternatives | `:::code-switcher` | No (remark plugin) | Alternative implementations |

---

## Detailed Usage Examples

---

### 1. Alert — Theorem / Definition Box

**Use `type="important"` for all theorem and definition statements.**

```mdx
<Alert type="important" title="Definition: Proposition">

A **proposition** is a declarative sentence that is either true or false, but not both.

"The sky is blue" is a proposition. "x + 1 = 3" is not a proposition (it depends on x). "Close the door" is not a proposition (it is a command, not a statement).

</Alert>
```

```mdx
<Alert type="important" title="Theorem: De Morgan's Laws">

For any propositions p and q:

```
¬(p ∧ q) ≡ ¬p ∨ ¬q
¬(p ∨ q) ≡ ¬p ∧ ¬q
```

In code: `!(a && b)` is the same as `(!a || !b)`.

</Alert>
```

---

### 2. Alert — Developer Intuition

**Use `type="tip"` for connecting math to code.**

```mdx
<Alert type="tip" title="Developer Intuition">

You already know conjunction. In Python, `and` returns `True` only when both operands are `True`. In JavaScript, `&&` does the same. The truth table for ∧ is the specification your programming language implements.

</Alert>
```

---

### 3. Alert — The Formality Spectrum

**Use `type="warning"` with the standard four-row table.**

```mdx
<Alert type="warning" title="The Formality Spectrum">

| | |
|---|---|
| :x: **Too Informal** | "AND means both things are true" — breaks when you hit edge cases like short-circuit evaluation or three-valued logic (SQL NULL) |
| :white_check_mark: **Right** | Conjunction (p ∧ q) is true when and only when both p and q are true. Maps to `&&` with identical truth table. |
| :x: **Too Formal** | Define conjunction via the Sheffer stroke, then derive all connectives from NAND |
| :warning: **Common Mistake** | Confusing ∧ (logical AND on propositions) with ∩ (intersection on sets). Same truth table, different domains. |

</Alert>
```

---

### 4. Alert — Common Mistakes

**Use `type="caution"` for proof errors and notation pitfalls.**

```mdx
<Alert type="caution" title="Common Mistake: Converse Error">

"If it rains, the ground is wet" does NOT mean "if the ground is wet, it rained." The sprinkler could be on. Confusing p → q with q → p (the converse) is one of the most common logical errors, in proofs and in code.

</Alert>
```

---

### 5. PanelSwitcher — Math vs Python

**Use for showing the same concept in formal notation and executable code.**

```mdx
<PanelSwitcher defaultActive="python">
  <Panel label="Formal" value="formal">

```
p ∧ q is true if and only if both p and q are true.

Truth table:
p | q | p ∧ q
T | T |   T
T | F |   F
F | T |   F
F | F |   F
```

  </Panel>
  <Panel label="Python" value="python">

```python title="conjunction.py"
def conjunction(p: bool, q: bool) -> bool:
    return p and q

# Verify: exhaustive truth table
for p in [True, False]:
    for q in [True, False]:
        print(f"{p} ∧ {q} = {conjunction(p, q)}")
```

  </Panel>
</PanelSwitcher>
```

---

### 6. ComparisonTable — Operator Mapping

**Use for mapping mathematical notation to code operators.**

```mdx
<ComparisonTable>
  <ComparisonHeader columns={["Math", "Python", "JavaScript", "Meaning"]} />
  <ComparisonRow feature="NOT" Math="¬p" Python="not p" JavaScript="!p" Meaning="Negation" />
  <ComparisonRow feature="AND" Math="p ∧ q" Python="p and q" JavaScript="p && q" Meaning="Conjunction" />
  <ComparisonRow feature="OR" Math="p ∨ q" Python="p or q" JavaScript="p || q" Meaning="Disjunction" />
  <ComparisonRow feature="XOR" Math="p ⊕ q" Python="p ^ q" JavaScript="p ^ q" Meaning="Exclusive or" />
  <ComparisonRow feature="Implies" Math="p → q" Python="not p or q" JavaScript="!p || q" Meaning="Implication" />
  <ComparisonRow feature="Iff" Math="p ↔ q" Python="p == q" JavaScript="p === q" Meaning="Biconditional" />
</ComparisonTable>
```

---

### 7. ValidationChecklist — Understanding Verification

**Use at end of post. Items verify understanding, not infrastructure.**

```mdx
<ValidationChecklist items={[
  {
    category: "Concepts",
    tasks: [
      "Can define what a proposition is and identify non-propositions",
      "Can build truth tables for compound expressions with 2-3 variables",
      "Can apply De Morgan's laws to negate compound boolean expressions"
    ]
  },
  {
    category: "Code",
    tasks: [
      "truth_table.py runs and produces correct output for all connectives",
      "Can modify the truth table generator to add a new expression"
    ]
  },
  {
    category: "Practice",
    tasks: [
      "Completed Essential exercises from Rosen 1.1-1.2",
      "Can map between mathematical notation and Python/JS operators"
    ]
  }
]} />
```

---

### 8. Remark Directives (No Import Needed)

**Callout directives:**

```mdx
:::tip
The precedence of logical operators (¬ before ∧ before ∨) is the same as the precedence of programming operators (! before && before ||). This is not a coincidence.
:::

:::note
Rosen uses T and F for truth values. Some textbooks use 1 and 0. Python uses True and False. They all mean the same thing.
:::

:::warning
Implication (p → q) is true when p is false, regardless of q. This is the most unintuitive part of propositional logic for programmers. "If pigs fly, then I'm the queen of England" is a true implication.
:::

:::caution
Do not confuse logical equivalence (≡) with equality (=). Two propositions are logically equivalent when they have the same truth table. They are not "equal" in the arithmetic sense.
:::
```

**Steps directive (for proof steps):**

```mdx
:::steps
1. Assume p → q is true
2. Assume p is true
3. By the definition of implication, q must be true
4. Therefore, from p and p → q, we conclude q (modus ponens)
:::
```

**Code switcher directive:**

````mdx
:::code-switcher
```python title="Iterative"
def power_set(s: set) -> list[set]:
    result = [set()]
    for elem in s:
        result += [subset | {elem} for subset in result]
    return result
```

```python title="Recursive"
def power_set(s: set) -> list[set]:
    if not s:
        return [set()]
    elem = s.pop()
    subsets = power_set(s)
    return subsets + [subset | {elem} for subset in subsets]
```
:::
````

---

## Components NOT Used in This Series

| Component | Reason |
|---|---|
| `GuideStep` | No step-by-step infrastructure setup. Posts teach concepts, not procedures. |
| `Command` / `CommandSequence` | No CLI commands to run. Python code uses standard code blocks. |
| `TerminalOutput` | Standard code blocks with `terminal` meta suffice for Python output. |
| `FileTree` | No file structures to display. |
| `EnvVars` / `EnvVar` | No environment variables. |
| `DiffViewer` / `DiffBlock` | No before/after code changes. |
| `ResourceStatus` | No cloud resources. |
| `ApiEndpoint` / `ResponseExample` | No APIs. |
| `ServiceMapping` / `Service` | No services. |

---

## Component Selection Decision Tree

```
Need to show...
|
+-- A mathematical definition or theorem?
|   --> <Alert type="important" title="Definition/Theorem: [Name]">
|
+-- A developer connection / intuition?
|   +-- Multi-paragraph?  --> <Alert type="tip" title="Developer Intuition">
|   +-- Inline (1-2 lines)? --> :::tip
|
+-- The Formality Spectrum?
|   --> <Alert type="warning" title="The Formality Spectrum">
|
+-- A common mistake or pitfall?
|   --> <Alert type="caution" title="Common Mistake: [Name]">
|
+-- Same concept in math notation AND Python?
|   --> <PanelSwitcher> + <Panel> (Math | Python)
|
+-- Operator or concept comparison?
|   --> <ComparisonTable> + <ComparisonHeader> + <ComparisonRow>
|
+-- End-of-post understanding check?
|   --> <ValidationChecklist>
|
+-- A proof with numbered steps?
|   --> :::steps
|
+-- Alternative implementations?
|   --> :::code-switcher
|
+-- Quick contextual note?
|   --> :::note
|
+-- Python code?
|   --> ```python title="filename.py"
|
+-- Program output?
|   --> ```bash terminal
|
+-- Formal notation (multi-line)?
|   --> Plain code block (no language tag)
```
