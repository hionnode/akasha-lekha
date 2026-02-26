# Discrete Mathematics — Series Outline

> **Subject 1 of the CS Fundamentals track**
> 39 parts across 9 phases | ~150 hours of study | 60/40 theory/practice split
> Primary text: Rosen, *Discrete Mathematics and Its Applications* (8th ed)

## Approach

**Format:** Blog series — 39 MDX posts using existing Astro infrastructure.

Proofs are text-native. You can't CLI-verify "write a proof by induction." The passive consumption risk is mitigated by three active practice layers:

**Active layer 1 — Python Code Companion.** Every part includes inline Python code that makes the math executable. Readers don't just read theorems — they run code that verifies claims computationally, building intuition before formal proof. Bonus: readers get hands-on Python practice alongside the math.

**Active layer 2 — Rosen Exercises (the textbook as exercise book).** Rosen is positioned as the supplementary practice textbook. Readers follow the web series, then do Rosen exercises to cement understanding. Each part ends with a structured exercise section:

```markdown
## Practice with Rosen (8th Edition)

**Essential (do these):** Section X.Y: problems 1, 3, 7, 11, 15
**Recommended (if time):** Section X.Y: problems 23, 25, 31
**Challenge (stretch):** Section X.Y: problems 41, 47
```

**Active layer 3 — Curated high-quality resources.** Each part references the best supplementary materials for that topic:

```markdown
## Further Resources

- **MIT 6.042J Lecture N** — [specific topic coverage]
- **Book of Proof, Chapter N** — [for proof practice]
- **3Blue1Brown: [video title]** — [for visual intuition]
- **Coursera UCSD Discrete Math: Week N** — [for executable Python exercises]
```

This three-layer approach (read the post with Python → practice with Rosen → go deeper with curated resources) turns a passive blog into an active learning path without engineering investment.

---

## Running Threads

Three threads run across the entire series, accumulating material as readers progress.

### Proof Portfolio

Starting Part 4, readers build a growing collection of proofs. Each phase adds 2–4 proofs using new techniques. Target: ~22 proofs by series end.

| Phase | Proof Techniques Introduced | Proofs Added |
|-------|-----------------------------|:------------:|
| 1 (Logic) | Direct, contraposition, contradiction, cases, existence, constructive | 4–6 |
| 2 (Sets/Functions/Relations) | Set equality via mutual subset, function property proofs | 2–3 |
| 3 (Induction) | Weak induction, strong induction, structural induction | 3–4 |
| 4 (Algorithms) | Big-O proofs from definition | 2 |
| 5 (Counting) | Combinatorial proofs, bijective proofs | 2–3 |
| 6 (Number Theory) | Modular arithmetic proofs | 2 |
| 7 (Probability) | Probabilistic argument | 1 |
| 8 (Graphs) | Graph property proofs (handshaking lemma, tree characterization) | 2–3 |

### Code Companion

Every part includes Python that verifies or demonstrates the math. Not code for code's sake — code that makes the math executable.

Examples by phase:
- **Logic:** Truth table generators, SAT solver demo, propositional logic evaluator
- **Sets/Relations:** Set operations, relation property checker, topological sort
- **Induction:** Recursive vs iterative implementations with correctness verification
- **Algorithms:** Timing experiments, Big-O bound verification, complexity comparison plots
- **Counting:** Combinatorics calculators, birthday paradox Monte Carlo
- **Number Theory:** Extended Euclidean algorithm, RSA implementation
- **Probability:** Monte Carlo simulations, Bayesian updater
- **Graphs:** BFS/DFS, Dijkstra, MST algorithms, graph visualization

### Rosen Exercise Mapping

Each part ends with curated Rosen exercises at three tiers. The mapping ensures complete coverage of Rosen's exercise corpus for the sections covered, while prioritizing exercises that reinforce the developer angle.

---

## Reordering Rationale (vs Rosen's Chapter Order)

Rosen's chapter order reflects traditional math-department sequencing. We reorder for developer relevance and pedagogical flow.

| Change | Rosen Order | Our Order | Rationale |
|--------|:-----------:|:---------:|-----------|
| Relations moved early | Ch 9 (after counting, number theory, probability) | Phase 2 (with sets/functions) | Relations ARE sets of ordered pairs. Rosen separates them by 7 chapters — we reunite them. Immediate database tie-in (foreign keys, JOIN = relation composition). |
| Induction before algorithms | Ch 5 (after number theory) | Phase 3 (before algorithms) | Formal complexity proofs require induction. Developers know recursion, so induction feels like "formalizing what you already do." |
| Algorithms after induction | Ch 3 (immediately after logic) | Phase 4 (after induction) | Now students can *prove* Big-O bounds, not just memorize them. Rosen's early placement means students can't verify the claims being made. |
| Recurrences with induction | Ch 8 §8.1–8.2 (in "Advanced Counting") | Phase 3 (with induction) | Recurrences are solved by induction. Placing them in "Advanced Counting" obscures their connection to recursive thinking. |
| Number theory after counting | Ch 4 (early) | Phase 6 (after counting) | Modular arithmetic uses counting concepts. And the RSA payoff is more powerful when readers have enough math to follow the full proof. |
| Boolean algebra + automata compressed | Ch 12–13 (full chapters) | Phase 9 (bridge, 4 parts) | Bridge phase: Boolean algebra forwards to Computer Architecture track, automata forwards to Theory of Computation. Complete coverage but lighter depth — readers will get full treatment in those tracks. |

### Rosen Chapter → Phase Mapping

| Rosen Chapter | Rosen Topic | Our Phase | Parts |
|:-------------:|-------------|:---------:|:-----:|
| Ch 1 | Logic and Proofs | Phase 1 | 1–7 |
| Ch 2 | Sets, Functions, Sequences, Sums | Phase 2 | 8–9, 12 |
| Ch 3 | Algorithms | Phase 4 | 17–19 |
| Ch 4 | Number Theory and Cryptography | Phase 6 | 24–26 |
| Ch 5 | Induction and Recursion | Phase 3 | 13–15 |
| Ch 6 | Counting | Phase 5 | 20–22 |
| Ch 7 | Discrete Probability | Phase 7 | 27–29 |
| Ch 8 §8.1–8.2 | Recurrence Relations | Phase 3 | 16 |
| Ch 8 §8.3–8.5 | Advanced Counting | Phase 5 | 22–23 |
| Ch 9 | Relations | Phase 2 | 10–12 |
| Ch 10 | Graphs | Phase 8 | 30–33 |
| Ch 11 | Trees | Phase 8 | 34–35 |
| Ch 12 | Boolean Algebra | Phase 9 | 36–37 |
| Ch 13 | Modeling Computation | Phase 9 | 38–39 |

All 13 Rosen chapters are covered. No sections omitted.

---

## Phase Breakdown

### Phase 1: Logic — The Language of Precise Thinking

**Parts 0–7 | Rosen Chapter 1 + supplementary**

The foundation everything else builds on. Part 0 is the series introduction: motivation, orientation, and a roadmap for all 39 parts. Parts 1-7 formalize the logic developers already use daily — `if/else`, `&&`/`||`, type systems — then teach proof techniques (the key skill barrier for the entire series).

Three parts on proof techniques is intentional. The research identifies "proof writing barrier" as the primary challenge for this subject. Rushing proofs here means struggling everywhere else.

| # | Title | Rosen Sections | Developer Tie-in |
|:-:|-------|:--------------:|-----------------|
| 0 | Discrete Mathematics for Developers: Why This Math Is Your Math | — | Series introduction. Four real developer scenarios where not knowing discrete math caused costly bugs. Roadmap for 9 phases and 39 parts. |
| 1 | Propositions and Logic Gates: What `if` Statements Really Mean | 1.1–1.2 | Boolean expressions in code, De Morgan's laws (every dev has negated a compound condition wrong), short-circuit evaluation as logical implication, truth tables as exhaustive testing |
| 2 | Predicate Logic: From Booleans to Quantifiers | 1.3–1.4 | SQL `WHERE` clauses = predicate logic; `.every()` = ∀, `.some()` = ∃; nested quantifiers = nested loops; negation of quantifiers = "why your bug exists" |
| 3 | Rules of Inference: Why Your Arguments Have Structure | 1.5–1.6 | Modus ponens in type checking ("if x: int, then x+1: int"), pattern matching as disjunctive syllogism, type inference as a chain of inferences |
| 4 | Proof Techniques I: Direct Proof and Contraposition | 1.7 partial | "If input satisfies precondition P, output satisfies postcondition Q" is literally a direct proof. Contraposition: "if output is wrong, input was wrong" = debugging by contrapositive. |
| 5 | Proof Techniques II: Contradiction, Cases, Existence | 1.7–1.8 partial | Proof by contradiction = "assume the system works, derive something impossible." Cases = exhaustive pattern matching. Existence proofs = "there exists a valid configuration." The halting problem as the most famous proof by contradiction. |
| 6 | Proof Techniques III: Strategy and Common Mistakes | 1.8 partial | Code review as proof verification — checking each step, not just the conclusion. Common proof mistakes mapped to common code review catches. Strategy: how to choose which technique to use. |
| 7 | Logic in Practice: SAT Solvers, Type Systems, and Formal Verification | Supplementary | Package managers use SAT solvers (apt, npm resolution). TypeScript's type system as a theorem prover. TLA+/Alloy for system verification. Where "informal logic" breaks down at scale. |

**Key proof portfolio items:** Parity proofs (even + even = even), irrationality of √2, infinitude of primes, De Morgan's laws for sets.

**Code companion highlights:** Truth table generator, propositional logic evaluator, simple SAT solver demo.

---

### Phase 2: Sets, Functions, and Relations

**Parts 8–12 | Rosen Chapters 2 + 9**

The big reorder: Rosen puts Relations in Chapter 9 (after counting, number theory, and probability). We pull them forward because relations are sets of ordered pairs — they belong with sets and functions.

| # | Title | Rosen Sections | Developer Tie-in |
|:-:|-------|:--------------:|-----------------|
| 8 | Sets and Set Operations | 2.1–2.2 | JavaScript/Python `Set` objects, SQL `UNION`/`INTERSECT`/`EXCEPT`, Redis sets and sorted sets, set-theoretic database foundations. Venn diagrams as the "hello world" of discrete math visualization. |
| 9 | Functions: The Most Important Concept in Programming | 2.3, 2.5 | Injection/surjection/bijection mapped to real code: hash functions are neither injective nor surjective (collisions, limited range), `JSON.parse ∘ JSON.stringify` isn't identity (loses functions, undefined), pure functions, `map`/`filter`/`reduce` as function composition. Sequences (2.4) covered as functions from ℕ. |
| 10 | Relations and Their Properties | 9.1–9.3 | Database relationships, foreign keys, reflexive/symmetric/transitive mapped to real relations: "is a friend of" (symmetric?), "is a prerequisite for" (transitive), "is in the same subnet as" (equivalence). Representing relations as matrices and digraphs. |
| 11 | Equivalence Relations, Partial Orders, and Closures | 9.4–9.6 | Equivalence classes = `GROUP BY`. Partial orders = dependency DAGs, semantic versioning. Topological sort as linearization of partial order. Transitive closure = "reachability" in a dependency graph. Hasse diagrams for version constraints. |
| 12 | Matrices for Relations and Computation | 2.6, 9.3 partial | Adjacency matrices, Boolean matrix multiplication for path finding, sparse vs dense tradeoffs (when to use adjacency list vs matrix), matrix composition = relation composition. Bridge to graph representations in Phase 8. |

**Key proof portfolio items:** Prove set equality via mutual subset inclusion, prove function properties (injective, surjective), prove relation properties.

**Code companion highlights:** Set operation library, relation property checker, topological sort implementation, transitive closure via matrix exponentiation.

---

### Phase 3: Induction, Recursion, and Recursive Thinking

**Parts 13–16 | Rosen Chapter 5 + Chapter 8 §8.1–8.2**

The "aha moment" phase. Developers already think recursively — induction formalizes that intuition. We pair it with recurrences (pulled from Rosen's Chapter 8) because recurrences are solved by induction.

| # | Title | Rosen Sections | Developer Tie-in |
|:-:|-------|:--------------:|-----------------|
| 13 | Mathematical Induction: Recursion's Formal Twin | 5.1 | Every recursive function implicitly uses induction: base case = base case, recursive call = inductive step, "it works for n−1" = inductive hypothesis. Prove correctness of recursive sum, factorial, Fibonacci. The connection: if you can write a recursive function, you can write an induction proof — they're the same mental motion. |
| 14 | Strong Induction and Well-Ordering | 5.2 | Binary search correctness proof (strong induction: the sub-problem could be any size ≤ n/2, not just n−1). Well-ordering: "every nonempty set of natural numbers has a least element" — why infinite descent works, why your recursive algorithm terminates. |
| 15 | Recursive Definitions and Structural Induction | 5.3–5.4 | Recursive data structures (linked lists, trees, JSON), ASTs, DOM trees. Structural induction: proving things about all valid HTML documents by induction on tree structure. Recursive definition of well-formed formulas → parsing. |
| 16 | Solving Recurrence Relations and Program Analysis | 5.5, 8.1–8.2 | Master theorem for divide-and-conquer analysis. Solving T(n) = 2T(n/2) + O(n) to get merge sort's O(n log n). Linear recurrences for Fibonacci and dynamic programming. This is where "algorithmic complexity" stops being memorization and starts being derivation. |

**Key proof portfolio items:** Sum formula by induction, binary search correctness, tree height bounds, recurrence solutions.

**Code companion highlights:** Recursive vs iterative comparison with correctness checks, recurrence relation solver, merge sort analysis verification.

---

### Phase 4: Algorithms and Complexity

**Parts 17–19 | Rosen Chapter 3**

Placed after induction so students can *prove* complexity bounds, not just memorize them.

| # | Title | Rosen Sections | Developer Tie-in |
|:-:|-------|:--------------:|-----------------|
| 17 | Algorithms and Pseudocode: Precision in Description | 3.1 | Algorithm vs implementation. Why pseudocode matters: the same algorithm can be O(n) in one language and O(n²) in another (string concatenation in a loop). Searching and sorting as case studies. The difference between "I wrote code that works" and "I can explain why it works." |
| 18 | Growth of Functions: Big-O, Big-Omega, Big-Theta | 3.2 | Formal definitions with ε-δ style proofs. Proving (not memorizing) that binary search is O(log n), merge sort is O(n log n). Common pitfalls: O is an upper bound (not tight), "O(1) means fast" is wrong (could be O(10⁹)). Amortized analysis preview. |
| 19 | Algorithm Complexity: Analysis in Practice | 3.3 | Tractable vs intractable. P vs NP — what it means practically (when to reach for approximation or heuristics). When O(n²) is actually fine (n < 1000, constant matters). Space-time tradeoffs. NP-completeness as "don't bother looking for a polynomial algorithm." |

**Key proof portfolio items:** Prove f(n) = 3n² + 5n + 2 is O(n²) from definition, prove Big-O transitivity, prove binary search is O(log n).

**Code companion highlights:** Timing experiments comparing growth rates, Big-O bound verification via ratio test, complexity comparison plots with matplotlib.

---

### Phase 5: Counting and Combinatorics

**Parts 20–23 | Rosen Chapter 6 + Chapter 8 §8.3–8.5**

From "how many?" to "why that many?" Part 23 (generating functions) is the most academic part in the series — flagged as optional for practitioners.

| # | Title | Rosen Sections | Developer Tie-in |
|:-:|-------|:--------------:|-----------------|
| 20 | Basics of Counting: Product Rule, Sum Rule, Pigeonhole | 6.1, 6.2 | Product rule: password strength calculation. Sum rule: API endpoint routing. Pigeonhole principle: hash collision inevitability (if you have more items than buckets, collisions are guaranteed), birthday paradox, UUID collision probability. Why 128-bit UUIDs are "good enough" but 32-bit aren't. |
| 21 | Permutations, Combinations, and Binomial Coefficients | 6.3–6.4 | Feature flag combinations: n flags → 2ⁿ configurations to test. Shuffle algorithms (Fisher-Yates correctness via counting). Binomial coefficients in Pascal's triangle. The binomial theorem and why it matters for probability. |
| 22 | Advanced Counting: Inclusion-Exclusion and Applications | 6.5–6.6, 8.5 | Inclusion-exclusion for survey-style problems ("how many users use feature A or B?"), derangements (secret Santa), Euler's totient function (which integers are coprime to n — used in RSA). Query filtering with overlapping conditions. |
| 23 | Generating Functions and Advanced Techniques | 8.3–8.4 | The most academic part. Generating functions as a problem-solving tool. Catalan numbers: the number of valid parenthesizations, BST shapes, triangulations. Why this matters: understanding why certain data structures have the performance characteristics they do. Flagged as optional for pure practitioners. |

**Key proof portfolio items:** Pigeonhole principle applications, combinatorial identity proofs, inclusion-exclusion derivation.

**Code companion highlights:** Password strength calculator, birthday paradox Monte Carlo, Fisher-Yates correctness verification, Catalan number generator.

---

### Phase 6: Number Theory and Cryptography

**Parts 24–26 | Rosen Chapter 4**

The big payoff phase. Every developer uses cryptography — this is where they learn *why* it works.

| # | Title | Rosen Sections | Developer Tie-in |
|:-:|-------|:--------------:|-----------------|
| 24 | Divisibility, Modular Arithmetic, and Integer Representations | 4.1–4.2 | Modular arithmetic is everywhere: hash functions (`hash % bucketCount`), circular buffers (`index % size`), clock arithmetic, load balancing (round-robin). Integer representations: binary, hex, two's complement — why `parseInt('08')` was a JS footgun. |
| 25 | Primes, GCD, and the Euclidean Algorithm | 4.3–4.4 | Fundamental theorem of arithmetic (unique factorization). Euclidean algorithm: one of the oldest algorithms, still used in cryptographic libraries. Extended Euclidean algorithm for modular inverse — the key to RSA decryption. Primality testing: trial division vs Miller-Rabin. |
| 26 | Cryptography: RSA and Why Number Theory Matters | 4.5–4.6 | Full RSA walkthrough: key generation, encryption, decryption, with the math. TLS handshake — how HTTPS actually works. Diffie-Hellman key exchange. Digital signatures (JWT signing). Why quantum computing threatens RSA (Shor's algorithm, briefly). Password hashing: why bcrypt, not SHA-256. |

**Key proof portfolio items:** Prove Euclidean algorithm correctness, prove Fermat's little theorem, prove RSA correctness.

**Code companion highlights:** Extended Euclidean algorithm, RSA implementation from scratch (small primes for pedagogy), Diffie-Hellman demo, Miller-Rabin primality test.

---

### Phase 7: Discrete Probability

**Parts 27–29 | Rosen Chapter 7**

Probability for engineers — focused on the results that matter for system design and reliability.

| # | Title | Rosen Sections | Developer Tie-in |
|:-:|-------|:--------------:|-----------------|
| 27 | Probability Foundations: Sample Spaces and Events | 7.1 | Random number generation (PRNGs, CSPRNGs), A/B testing (is this result significant or chance?), hash collision probability (birthday problem revisited with probability framework), Monte Carlo methods. |
| 28 | Conditional Probability and Bayes' Theorem | 7.2–7.3 | Spam filtering (naive Bayes), false positive rates in monitoring (if your test is 99% accurate and the event is rare, most positives are false), medical testing analogy, base rate neglect in alerting systems. |
| 29 | Expected Value, Variance, and Probabilistic Analysis | 7.4 | Randomized quicksort expected time (O(n log n) in expectation), Bloom filter false positive rate, SLO/SLA calculations ("99.9% uptime means 8.7 hours of downtime per year"), coupon collector problem (how many random API calls to hit all endpoints?), linearity of expectation as a problem-solving superpower. |

**Key proof portfolio items:** Birthday problem derivation, Bayes' theorem proof, expected value of geometric distribution.

**Code companion highlights:** Monte Carlo simulations (π estimation, birthday paradox), Bayesian updater, Bloom filter implementation, SLO calculator.

---

### Phase 8: Graphs and Trees

**Parts 30–35 | Rosen Chapters 10–11**

The longest phase because graphs are the most directly applicable topic. Every data structure, every network, every dependency system is a graph.

| # | Title | Rosen Sections | Developer Tie-in |
|:-:|-------|:--------------:|-----------------|
| 30 | Graph Fundamentals: Everything Is a Graph | 10.1–10.2 | Dependency graphs (npm, pip), entity-relationship diagrams, state machines (TCP, UI flows), social networks, the internet itself. Graph terminology: vertices, edges, directed/undirected, weighted, DAGs. Special graphs: complete, bipartite, cycles. |
| 31 | Graph Representations and Isomorphism | 10.3 | Adjacency list vs adjacency matrix: when to use which (sparse graphs = list, dense = matrix, cache performance matters). Edge list representation. Isomorphism: "are these two graphs structurally identical?" — graph canonicalization, the GI problem. |
| 32 | Connectivity, Paths, and Traversal | 10.4–10.5 | BFS and DFS as the foundation of graph algorithms. Connected components (network segmentation). Euler paths and circuits (the Konigsberg bridge problem, optimizing mail routes). Hamiltonian paths (TSP approximation). Strong connectivity in directed graphs. |
| 33 | Shortest Paths, Planarity, and Coloring | 10.6–10.8 | Dijkstra's algorithm (OSPF routing, Google Maps). Bellman-Ford (handles negative weights). Floyd-Warshall (all-pairs). Planarity: Kuratowski's theorem, circuit board layout. Graph coloring: register allocation, scheduling (exam timetabling, task scheduling), the four-color theorem. |
| 34 | Trees: The Recursive Data Structure | 11.1–11.3 | DOM trees, ASTs (how your code is compiled), file systems, B-trees (database indices), tries (autocomplete), Huffman coding (compression), binary search trees. Tree traversals: inorder, preorder, postorder mapped to concrete use cases. |
| 35 | Spanning Trees and Minimum Spanning Trees | 11.4–11.5 | Network design (minimize cable length). Kruskal's and Prim's algorithms. Backtracking as DFS on a solution tree. Spanning tree protocol (STP) in network switches. Cluster analysis via MST. |

**Key proof portfolio items:** Handshaking lemma, tree characterization theorem (n−1 edges), Dijkstra correctness, MST cut property.

**Code companion highlights:** Graph class with multiple representations, BFS/DFS implementations, Dijkstra with priority queue, Kruskal with union-find, graph visualization with networkx.

---

### Phase 9: Boolean Algebra and Modeling Computation (Bridge)

**Parts 36–39 | Rosen Chapters 12–13**

Bridge phase — these topics get full treatment in dedicated tracks (Computer Architecture for Boolean algebra, Theory of Computation for automata). Here we cover the essentials and plant forward references.

| # | Title | Rosen Sections | Developer Tie-in | Forward Reference |
|:-:|-------|:--------------:|-----------------|-------------------|
| 36 | Boolean Algebra: From Logic Gates to Circuits | 12.1–12.3 | Bitwise operations in code (`&`, `|`, `^`, `~`), feature flag evaluation as Boolean function, Boolean function minimization (Karnaugh maps). | → Computer Architecture track (digital logic) |
| 37 | Boolean Circuits and Digital Logic | 12.4 | How CPUs add numbers (half adder, full adder, ripple-carry). Logic gate composition. Circuit complexity as a model of computation. | → Nand2Tetris-style track |
| 38 | Finite Automata and Regular Languages | 13.1–13.3 | Regex internals (NFA → DFA conversion, why `.*` can be slow), lexers/tokenizers, TCP state machine, React `useReducer` as a finite automaton. Pumping lemma: why you can't parse HTML with regex. | → Theory of Computation track |
| 39 | Turing Machines and the Limits of Computation | 13.4–13.5 | The halting problem (you can't write a perfect linter). Rice's theorem (you can't decide any non-trivial property of programs). Undecidability in practice: why static analysis is always incomplete, why type inference has limits. Church-Turing thesis. | → Theory of Computation track |

**Key proof portfolio items:** Boolean algebra identities, pumping lemma application, halting problem undecidability.

**Code companion highlights:** Bitwise operation visualizer, half/full adder simulator, NFA-to-DFA converter, regex engine, Turing machine simulator.

---

## Complete Rosen Section Coverage

Verification that every Rosen section (8th ed) maps to a part in this series.

| Rosen Section | Topic | Part |
|:-------------:|-------|:----:|
| 1.1 | Propositional Logic | 1 |
| 1.2 | Applications of Propositional Logic | 1 |
| 1.3 | Propositional Equivalences | 2 |
| 1.4 | Predicates and Quantifiers | 2 |
| 1.5 | Nested Quantifiers | 3 |
| 1.6 | Rules of Inference | 3 |
| 1.7 | Introduction to Proofs | 4, 5 |
| 1.8 | Proof Methods and Strategy | 5, 6 |
| 2.1 | Sets | 8 |
| 2.2 | Set Operations | 8 |
| 2.3 | Functions | 9 |
| 2.4 | Sequences and Summations | 9 |
| 2.5 | Cardinality of Sets | 9 |
| 2.6 | Matrices | 12 |
| 3.1 | Algorithms | 17 |
| 3.2 | The Growth of Functions | 18 |
| 3.3 | Complexity of Algorithms | 19 |
| 4.1 | Divisibility and Modular Arithmetic | 24 |
| 4.2 | Integer Representations and Algorithms | 24 |
| 4.3 | Primes and Greatest Common Divisors | 25 |
| 4.4 | Solving Congruences | 25 |
| 4.5 | Applications of Congruences | 26 |
| 4.6 | Cryptography | 26 |
| 5.1 | Mathematical Induction | 13 |
| 5.2 | Strong Induction and Well-Ordering | 14 |
| 5.3 | Recursive Definitions and Structural Induction | 15 |
| 5.4 | Recursive Algorithms | 15 |
| 5.5 | Program Correctness | 16 |
| 6.1 | The Basics of Counting | 20 |
| 6.2 | The Pigeonhole Principle | 20 |
| 6.3 | Permutations and Combinations | 21 |
| 6.4 | Binomial Coefficients and Identities | 21 |
| 6.5 | Generalized Permutations and Combinations | 22 |
| 6.6 | Generating Permutations and Combinations | 22 |
| 7.1 | An Introduction to Discrete Probability | 27 |
| 7.2 | Probability Theory | 28 |
| 7.3 | Bayes' Theorem | 28 |
| 7.4 | Expected Value and Variance | 29 |
| 8.1 | Applications of Recurrence Relations | 16 |
| 8.2 | Solving Linear Recurrence Relations | 16 |
| 8.3 | Divide-and-Conquer Algorithms and Recurrence Relations | 23 |
| 8.4 | Generating Functions | 23 |
| 8.5 | Inclusion-Exclusion | 22 |
| 8.6 | Applications of Inclusion-Exclusion | 22 |
| 9.1 | Relations and Their Properties | 10 |
| 9.2 | n-ary Relations and Their Applications | 10 |
| 9.3 | Representing Relations | 10, 12 |
| 9.4 | Closures of Relations | 11 |
| 9.5 | Equivalence Relations | 11 |
| 9.6 | Partial Orderings | 11 |
| 10.1 | Graphs and Graph Models | 30 |
| 10.2 | Graph Terminology and Special Types of Graphs | 30 |
| 10.3 | Representing Graphs and Graph Isomorphism | 31 |
| 10.4 | Connectivity | 32 |
| 10.5 | Euler and Hamilton Paths | 32 |
| 10.6 | Shortest-Path Problems | 33 |
| 10.7 | Planar Graphs | 33 |
| 10.8 | Graph Coloring | 33 |
| 11.1 | Introduction to Trees | 34 |
| 11.2 | Applications of Trees | 34 |
| 11.3 | Tree Traversal | 34 |
| 11.4 | Spanning Trees | 35 |
| 11.5 | Minimum Spanning Trees | 35 |
| 12.1 | Boolean Functions | 36 |
| 12.2 | Representing Boolean Functions | 36 |
| 12.3 | Logic Gates | 36 |
| 12.4 | Minimization of Circuits | 37 |
| 13.1 | Languages and Grammars | 38 |
| 13.2 | Finite-State Machines with Output | 38 |
| 13.3 | Finite-State Machines with No Output | 38 |
| 13.4 | Language Recognition | 39 |
| 13.5 | Turing Machines | 39 |

**Coverage: 100% — all 65 sections across 13 chapters mapped.**

---

## Phase Summary Table

| Phase | Title | Parts | Rosen Chapters | Key Outcome |
|:-----:|-------|:-----:|:--------------:|-------------|
| 1 | Logic | 1–7 | Ch 1 + supp. | Can read and write formal proofs |
| 2 | Sets, Functions, Relations | 8–12 | Ch 2 + Ch 9 | Understands formal foundations of data modeling |
| 3 | Induction & Recursion | 13–16 | Ch 5 + Ch 8 §8.1–8.2 | Can prove correctness and analyze recursive algorithms |
| 4 | Algorithms & Complexity | 17–19 | Ch 3 | Can prove (not memorize) complexity bounds |
| 5 | Counting | 20–23 | Ch 6 + Ch 8 §8.3–8.5 | Can reason about combinatorial quantities |
| 6 | Number Theory & Crypto | 24–26 | Ch 4 | Understands why cryptography works |
| 7 | Probability | 27–29 | Ch 7 | Can reason about probabilistic systems |
| 8 | Graphs & Trees | 30–35 | Ch 10 + Ch 11 | Can model and solve graph problems |
| 9 | Boolean Algebra & Computation | 36–39 | Ch 12 + Ch 13 | Bridge to Architecture and Theory of Computation |
| | **Total** | **39** | **All 13** | |

---

## Prerequisites and Dependencies

**Before starting this series:** Basic programming experience (Python preferred). Comfort with variables, loops, functions, conditionals. No prior math beyond high school algebra required.

**This series feeds into:**
- **Data Structures & Algorithms** — uses proof techniques, complexity analysis, graph theory, counting, probability
- **Computer Architecture** — uses Boolean algebra, digital logic (Phase 9 bridge)
- **Theory of Computation** — uses automata, Turing machines, formal languages (Phase 9 bridge)
- **Databases** — uses relations, set theory, counting
- **Operating Systems** — uses graph theory (scheduling), probability (page replacement), number theory (hashing)

---

## Estimated Pacing

| Pace | Time per Part | Total Duration | Target Reader |
|------|:------------:|:--------------:|---------------|
| Intensive | 3–4 hours | ~4 months | Full-time student |
| Steady | 5–6 hours | ~6 months | Working developer, 1 part/week |
| Relaxed | 8–10 hours | ~9 months | Working developer, deep practice |

Includes reading, Python exercises, and Rosen practice problems. Parts vary: proof-heavy parts (Phase 1) take longer than algorithm parts (Phase 8) where developers have existing intuition.
