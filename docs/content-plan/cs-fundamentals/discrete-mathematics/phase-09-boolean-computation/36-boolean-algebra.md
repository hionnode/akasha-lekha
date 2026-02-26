# Part 36: Boolean Algebra: From Logic Gates to Bit Manipulation

> Rosen Sections: 12.1-12.3
> Blog file: `apps/web/src/content/blog/discrete-mathematics/36-boolean-algebra.mdx`
> Estimated word count: 2,500-3,000

## Frontmatter

```yaml
---
title: "Boolean Algebra: From Logic Gates to Bit Manipulation"
description: "Master Boolean functions, DNF/CNF representations, Karnaugh maps, and logic gates — connecting propositional logic to bitwise operations, feature flags, and permission bitmasks."
excerpt: "Bitwise operations (&, |, ^, ~), feature flag evaluation, permission bitmasks — Boolean algebra is propositional logic made computational. This post bridges Part 1's logic to how CPUs actually process information."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "boolean-algebra"]
series: "Discrete Mathematics for Developers"
seriesPart: 36
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
import PanelSwitcher from '../../../components/shared/PanelSwitcher.astro';
import Panel from '../../../components/shared/Panel.astro';
```

## Opening Hook

- **Scenario:** You write `permissions & WRITE_FLAG` to check a permission bitmask. You evaluate `features | NEW_FEATURE` to enable a feature flag. You XOR two values for a quick swap. Every bitwise operation is Boolean algebra applied to individual bits. In Part 1, you learned propositional logic as an abstract system. Here, you see it implemented in silicon.
- **Reveal:** Boolean algebra is propositional logic with an algebraic structure: identities, complements, distributive laws, and simplification rules. Boolean functions map bit patterns to outputs. Logic gates implement these functions in hardware. Karnaugh maps simplify them. This is the bridge from "logic as reasoning" to "logic as computation."
- **Outcome:** By the end, you will represent any Boolean function in DNF and CNF, simplify expressions with Karnaugh maps, identify all standard logic gates, and connect Boolean algebra to feature flags, permission systems, and the physical gates that power CPUs.

## Section Outline

### 1. Why This Matters

- Boolean algebra is the mathematical foundation of digital logic. Every CPU instruction, every logic gate, every circuit is a Boolean function.
- Developers use Boolean algebra daily: bitwise operations, feature flags, permission bitmasks, conditional logic. Understanding the algebraic structure makes these operations predictable.
- This part bridges Part 1 (propositional logic) to how hardware actually computes. Part 1 gave you truth tables. Part 36 gives you the algebra and the gates.
- **Forward reference:** The Computer Architecture track will go deeper into digital logic, circuit design, and CPU construction. This part provides the mathematical foundation.

### 2. Boolean Functions (12.1)

- **Definition:** A Boolean function f: {0,1}^n -> {0,1} maps n input bits to one output bit.
- **Representation:** A Boolean function on n variables is completely defined by its truth table (2^n rows).
- **How many Boolean functions on n variables?** 2^(2^n). For 2 variables: 16 functions. For 3 variables: 256 functions. For 10 variables: 2^1024 -- a vast space.
- **Code connection:** Any function that takes booleans and returns a boolean is a Boolean function. `isEligible(age >= 18, hasID, notBanned)` is a Boolean function of 3 variables.

### 3. Representing Boolean Functions (12.2)

#### 3a. Disjunctive Normal Form (DNF)

- **Definition:** An OR of ANDs. Each AND term (minterm) corresponds to one row of the truth table where the output is 1.
- **Construction:** For each row where f = 1, write a term that ANDs all variables (complementing those that are 0 in that row). OR all terms together.
- **Example:** Build DNF from a truth table. Show that every Boolean function has a DNF representation.
- **Code analogy:** `if (a && b && !c) || (!a && b && c)` is a DNF expression.

#### 3b. Conjunctive Normal Form (CNF)

- **Definition:** An AND of ORs. Each OR term (maxterm) corresponds to one row where the output is 0.
- **Construction:** For each row where f = 0, write a term that ORs all variables (complementing those that are 1 in that row). AND all terms together.
- **Connection to SAT:** CNF is the input format for SAT solvers. Satisfiability testing asks: is there an input that makes this CNF formula true?

#### 3c. Functional Completeness

- **Definition:** A set of operators is functionally complete if every Boolean function can be expressed using only those operators.
- {AND, OR, NOT} is functionally complete (obvious from DNF).
- {NAND} alone is functionally complete. {NOR} alone is functionally complete.
- **Why this matters:** NAND gates are the cheapest to manufacture. Real CPUs are built primarily from NAND gates. Everything reduces to NAND.

### 4. Logic Gates (12.3)

- **AND gate:** Output 1 if and only if all inputs are 1. Symbol, truth table.
- **OR gate:** Output 1 if at least one input is 1.
- **NOT gate (inverter):** Output is the complement of input.
- **NAND gate:** NOT AND. Output 0 only when all inputs are 1. Functionally complete alone.
- **NOR gate:** NOT OR. Output 1 only when all inputs are 0. Functionally complete alone.
- **XOR gate:** Output 1 when inputs differ. Used in parity checks, cryptography, adders.
- **PanelSwitcher:** Show each gate with symbol, truth table, and code equivalent (Python and JavaScript bitwise operators).

### 5. Boolean Algebra Identities (Proof Portfolio +1)

- **Identity laws:** x AND 1 = x, x OR 0 = x.
- **Domination laws:** x AND 0 = 0, x OR 1 = 1.
- **Idempotent laws:** x AND x = x, x OR x = x.
- **Complement laws:** x AND NOT x = 0, x OR NOT x = 1.
- **Commutative, associative, distributive laws.**
- **De Morgan's laws (revisited):** NOT(x AND y) = NOT x OR NOT y. NOT(x OR y) = NOT x AND NOT y.
- **Absorption:** x OR (x AND y) = x. x AND (x OR y) = x.
- **Proof:** Derive several identities from the Boolean algebra axioms (complement, identity, commutative, distributive). Show that truth table verification confirms each identity.
- **Code connection:** These are the same simplification rules your compiler applies to optimize boolean expressions.

### 6. Karnaugh Maps for Simplification

- **What they are:** A visual method for simplifying Boolean expressions with 2-4 variables. A grid layout of the truth table where adjacent cells differ by one variable.
- **How they work:** Group adjacent 1s into rectangles of size 1, 2, 4, 8 (powers of 2). Each group eliminates one variable. Read simplified expression from groups.
- **2-variable example:** Walk through a complete K-map simplification.
- **3-variable example:** Show the gray-code ordering, identify groups, read the simplified expression.
- **4-variable example:** Show wrapping (top-bottom, left-right adjacency).
- **Limitations:** K-maps are impractical beyond 4-5 variables. For larger problems, use Quine-McCluskey or computer-based simplification.

### 7. Connection to Feature Flags and Permission Systems

- **Permission bitmasks:** Unix file permissions (rwxrwxrwx) are 9-bit Boolean vectors. `chmod 755` = `111 101 101`. Checking permission: `perm & WRITE_BIT`.
- **Feature flags:** Each feature is a bit. `features |= NEW_FEATURE` to enable. `features &= ~OLD_FEATURE` to disable. `features & FEATURE_X` to check.
- **Bitwise tricks:** XOR swap (`a ^= b; b ^= a; a ^= b`). Check power of 2 (`n & (n-1) == 0`). Count set bits (Hamming weight). Clear lowest set bit (`n & (n-1)`).
- **ComparisonTable:** Bitwise operation vs Boolean algebra operation vs use case.

### Code Companion: boolean_algebra.py

- **Truth table to DNF converter:** `to_dnf(truth_table)` returning the DNF expression as a string and as a list of minterms.
- **Truth table to CNF converter:** `to_cnf(truth_table)` returning the CNF expression.
- **Karnaugh map solver:** `karnaugh_simplify(truth_table)` for 2-4 variable functions. Displays the K-map grid and the simplified expression.
- **Boolean expression evaluator:** Parse and evaluate Boolean expressions, verify algebraic identities.
- **Gate simulator:** Define circuits as compositions of gates, evaluate on inputs.

### The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "AND is &&, OR is \|\|" -- misses the algebraic structure, simplification rules, and the connection to physical gates |
| :white_check_mark: **Right** | Boolean functions map {0,1}^n to {0,1}. Every function has DNF and CNF representations. Boolean algebra axioms (identity, complement, distributive) enable algebraic simplification. {NAND} is functionally complete -- all logic reduces to one gate type. Karnaugh maps visually simplify expressions for up to 4 variables. |
| :x: **Too Formal** | Stone's representation theorem. Boolean algebras as complemented distributive lattices. Free Boolean algebras and term rewriting systems. |
| :warning: **Common Mistake** | Assuming more gates mean more computation. A simpler Boolean expression (fewer gates) does the same computation with less power, less heat, and less delay. Simplification is not cosmetic -- it has physical consequences. |

## Thread Progression

- **Proof Portfolio:** +1 new proof (Boolean algebra identities derived from axioms). Running total: 33 proofs.
- **Code Companion:** `boolean_algebra.py` -- truth table to DNF/CNF, Karnaugh map simplification, Boolean expression evaluator, gate simulator.
- **Rosen Exercises:**
  - **Essential:** 12.1: 1, 3, 5, 7; 12.2: 1, 3, 5; 12.3: 1, 3, 5
  - **Recommended:** 12.1: 11; 12.2: 7; 12.3: 7, 11
  - **Challenge:** (none specified -- the three-section coverage provides breadth)

## Further Resources

- **Nand2Tetris Chapters 1-2** -- Building logic gates from NAND, constructing combinational circuits. The most hands-on introduction to Boolean algebra in hardware.
- **Ben Eater YouTube: "Building an 8-bit breadboard computer"** -- Physical construction of logic gates and circuits. Seeing Boolean algebra in wires and LEDs is unforgettable.
- **MIT 6.004 Computation Structures** -- Digital logic foundations. Covers everything in this part at a deeper level.

## Key Takeaways

1. Every Boolean function has DNF (OR of ANDs) and CNF (AND of ORs) representations. DNF comes directly from the truth table rows where output is 1.
2. {NAND} alone is functionally complete -- every Boolean function can be built from NAND gates. This is why real CPUs are built primarily from NAND gates.
3. Karnaugh maps visually simplify Boolean expressions by grouping adjacent truth table entries. Fewer gates means less power, less heat, and faster circuits.

## Writer Notes

- This part explicitly bridges Part 1 (propositional logic) to hardware. Open with the callback: "In Part 1, you learned that every `if` statement is a proposition. In Part 36, you learn that every proposition is a circuit."
- Functional completeness of NAND is a profound result. "Every computation that can be expressed in Boolean logic can be built from a single gate type" is a statement worth pausing on. This is the theoretical basis of chip manufacturing.
- Karnaugh maps are a visual, satisfying technique. Include actual grid diagrams. K-maps are one of the few topics where a picture genuinely is worth a thousand words.
- The permission bitmask and feature flag sections are developer service. These are patterns every developer uses. Showing that they are Boolean algebra makes the theory feel immediately applicable.
- Forward-reference Part 37: "You have Boolean functions and logic gates. Part 37 wires them together: half adders, full adders, and the ripple-carry adder that lets a CPU add numbers."
- Forward-reference Computer Architecture track: "This part gives you the mathematical foundation. The Computer Architecture track builds complete circuits, ALUs, and eventually a working CPU from these gates."
