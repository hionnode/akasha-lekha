# Thread Tracker — Discrete Mathematics for Developers

> Quick-reference lookup tables for the three progressive threads. Not narrative. Use for continuity checks when writing any part.

## Thread 1: Proof Portfolio

Readers accumulate a growing collection of proofs across the series. Each entry tracks which proof techniques are introduced and practiced.

| Part | New Proofs | Techniques Used | Cumulative Proof Count |
|:--:|---|---|:--:|
| 0 | — | — (series introduction, no proofs) | 0 |
| 1 | — | — (truth table verification only) | 0 |
| 2 | — | — (truth table verification only) | 0 |
| 3 | — | — (inference rule application only) | 0 |
| 4 | Even + even = even; if n² is odd then n is odd | Direct proof, contraposition | 2 |
| 5 | √2 is irrational; infinitude of primes | Contradiction, existence (constructive) | 4 |
| 6 | De Morgan's laws for sets; proof by cases example | Cases, multiple techniques combined | 6 |
| 7 | — (applications, no new proofs) | — | 6 |
| 8 | Set equality via mutual subset (A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)) | Set equality by mutual inclusion | 7 |
| 9 | Function composition associativity; f injective iff f has left inverse | Function property proofs | 9 |
| 10 | Equivalence relation properties | Relation property proofs | 10 |
| 11 | Every equivalence relation partitions the set | Constructive proof | 11 |
| 12 | — (computation-focused, no new proofs) | — | 11 |
| 13 | Sum of first n integers; correctness of recursive factorial | Weak induction | 13 |
| 14 | Binary search correctness; fundamental theorem of arithmetic | Strong induction | 15 |
| 15 | Height of binary tree ≤ n-1; well-formed formula structure | Structural induction | 17 |
| 16 | Merge sort is O(n log n) via recurrence | Recurrence solution + induction | 18 |
| 17 | — (algorithms, no new proofs) | — | 18 |
| 18 | 3n² + 5n + 2 is O(n²); Big-O transitivity | Proof from definition (ε-δ style) | 20 |
| 19 | — (applications, no new proofs) | — | 20 |
| 20 | Pigeonhole principle | Direct proof | 21 |
| 21 | Binomial theorem | Induction (back-reference to Phase 3) | 22 |
| 22 | Inclusion-exclusion for two sets | Direct proof | 23 |
| 23 | — (generating functions, computational focus) | — | 23 |
| 24 | a ≡ b (mod m) is an equivalence relation | Relation property proof (back-reference to Phase 2) | 24 |
| 25 | Euclidean algorithm correctness; Bezout's identity | Direct proof, constructive | 26 |
| 26 | RSA correctness (encryption then decryption recovers plaintext) | Number theory chain | 27 |
| 27 | — (probability, computational focus) | — | 27 |
| 28 | Bayes' theorem derivation | Direct proof from conditional probability definition | 28 |
| 29 | — (expected value, computational focus) | — | 28 |
| 30 | Handshaking lemma (sum of degrees = 2|E|) | Counting argument | 29 |
| 31 | — (representations, no new proofs) | — | 29 |
| 32 | — (algorithms, no new proofs) | — | 29 |
| 33 | Dijkstra's algorithm correctness | Induction on vertices processed | 30 |
| 34 | Tree with n vertices has n-1 edges | Induction on n | 31 |
| 35 | MST cut property | Contradiction | 32 |
| 36 | Boolean algebra identities | Algebraic proof from axioms | 33 |
| 37 | — (circuits, no new proofs) | — | 33 |
| 38 | Pumping lemma application (a^n b^n is not regular) | Contradiction (pumping lemma) | 34 |
| 39 | Halting problem undecidability | Diagonalization / contradiction | 35 |

**Final count: ~35 proofs using all major techniques.**

---

## Thread 2: Code Companion

Every part includes at least one substantial Python program. Programs accumulate across the series.

| Part | Program | Key Functions | What It Demonstrates |
|:--:|---|---|---|
| 0 | — (no code companion) | — | Series introduction, motivation only |
| 1 | `truth_table.py` | `truth_table()`, `evaluate()` | Generates truth tables for any propositional expression |
| 2 | `predicate_eval.py` | `for_all()`, `exists()`, `negate_quantifier()` | Evaluates quantified predicates over finite domains |
| 3 | `inference_checker.py` | `modus_ponens()`, `modus_tollens()`, `validate_argument()` | Validates inference rule applications |
| 4 | `proof_verifier.py` | `check_direct_proof()`, `check_contrapositive()` | Verifies proof steps computationally |
| 5 | `primality_check.py` | `is_prime()`, `find_primes()`, `sqrt2_rational_check()` | Demonstrates existence proofs computationally |
| 6 | `proof_strategy.py` | `suggest_technique()`, examples collection | Proof technique selection guide |
| 7 | `sat_solver.py` | `solve()`, `dpll()` | Simple SAT solver (DPLL algorithm) |
| 8 | `set_operations.py` | `union()`, `intersect()`, `difference()`, `power_set()` | Set operations and power set generation |
| 9 | `function_properties.py` | `is_injective()`, `is_surjective()`, `compose()` | Function property checking and composition |
| 10 | `relation_checker.py` | `is_reflexive()`, `is_symmetric()`, `is_transitive()` | Relation property verification |
| 11 | `topological_sort.py` | `topo_sort()`, `equivalence_classes()` | Topological sort, equivalence class finder |
| 12 | `matrix_relations.py` | `relation_to_matrix()`, `bool_multiply()`, `transitive_closure()` | Matrix operations for relations |
| 13 | `induction_demo.py` | `sum_n()`, `verify_induction()` | Recursive vs iterative with induction verification |
| 14 | `binary_search_proof.py` | `binary_search()`, `verify_correctness()` | Binary search with correctness checking |
| 15 | `recursive_structures.py` | `evaluate_ast()`, `structural_induction_check()` | AST evaluation, recursive data structures |
| 16 | `recurrence_solver.py` | `solve_linear_recurrence()`, `master_theorem()` | Recurrence relation solutions |
| 17 | `algorithm_comparison.py` | `linear_search()`, `binary_search()`, `measure_time()` | Algorithm timing comparison |
| 18 | `big_o_verifier.py` | `verify_big_o()`, `ratio_test()`, `plot_growth()` | Big-O bound verification via ratio test |
| 19 | `complexity_explorer.py` | `complexity_classes`, `timing_experiment()` | P vs NP exploration, timing experiments |
| 20 | `counting_tools.py` | `product_rule()`, `pigeonhole()`, `birthday_paradox()` | Counting principles + birthday paradox Monte Carlo |
| 21 | `combinatorics.py` | `permutations()`, `combinations()`, `fisher_yates()` | Permutations, combinations, shuffle verification |
| 22 | `inclusion_exclusion.py` | `inclusion_exclusion()`, `derangements()`, `euler_totient()` | Inclusion-exclusion applications |
| 23 | `generating_functions.py` | `catalan()`, `gf_multiply()`, `sequence_from_gf()` | Generating function operations |
| 24 | `modular_arithmetic.py` | `mod_exp()`, `mod_inverse()`, `chinese_remainder()` | Modular arithmetic operations |
| 25 | `euclidean.py` | `gcd()`, `extended_gcd()`, `miller_rabin()` | GCD, extended Euclidean, primality testing |
| 26 | `rsa.py` | `generate_keys()`, `encrypt()`, `decrypt()`, `sign()` | Complete RSA implementation |
| 27 | `probability_sim.py` | `monte_carlo_pi()`, `birthday_sim()`, `random_walk()` | Monte Carlo simulations |
| 28 | `bayesian.py` | `bayes_update()`, `spam_classifier()` | Bayesian updater, naive Bayes demo |
| 29 | `expected_value.py` | `expected_value()`, `bloom_filter()`, `slo_calculator()` | Expected value applications, Bloom filter |
| 30 | `graph.py` | `Graph` class, `add_edge()`, `neighbors()`, `degree()` | Graph data structure with multiple representations |
| 31 | `graph_representations.py` | `adj_list()`, `adj_matrix()`, `edge_list()`, `convert()` | Representation conversions, isomorphism check |
| 32 | `traversal.py` | `bfs()`, `dfs()`, `connected_components()`, `euler_path()` | Graph traversal algorithms |
| 33 | `shortest_path.py` | `dijkstra()`, `bellman_ford()`, `graph_coloring()` | Shortest path + coloring algorithms |
| 34 | `tree_algorithms.py` | `inorder()`, `preorder()`, `postorder()`, `huffman()` | Tree traversals, Huffman coding |
| 35 | `spanning_tree.py` | `kruskal()`, `prim()`, `union_find()` | MST algorithms with union-find |
| 36 | `boolean_algebra.py` | `truth_table_to_dnf()`, `simplify()`, `karnaugh()` | Boolean function simplification |
| 37 | `circuits.py` | `half_adder()`, `full_adder()`, `ripple_carry()` | Digital circuit simulation |
| 38 | `automata.py` | `NFA`, `DFA`, `nfa_to_dfa()`, `regex_match()` | NFA-to-DFA conversion, regex engine |
| 39 | `turing_machine.py` | `TuringMachine`, `run()`, `binary_add()` | Turing machine simulator |

**Final count: 39 programs (one per part).**

---

## Thread 3: Rosen Section Coverage

Tracks which Rosen sections are covered as the series progresses.

| Part | Rosen Sections Covered | Cumulative Sections | Cumulative % |
|:--:|---|:--:|:--:|
| 0 | — (series introduction) | 0 | 0% |
| 1 | 1.1, 1.2 | 2 | 3% |
| 2 | 1.3, 1.4 | 4 | 6% |
| 3 | 1.5, 1.6 | 6 | 9% |
| 4 | 1.7 (partial) | 7 | 11% |
| 5 | 1.7-1.8 (partial) | 8 | 12% |
| 6 | 1.8 (partial) | 9 | 14% |
| 7 | Supplementary | 9 | 14% |
| 8 | 2.1, 2.2 | 11 | 17% |
| 9 | 2.3, 2.4, 2.5 | 14 | 22% |
| 10 | 9.1, 9.2, 9.3 (partial) | 17 | 26% |
| 11 | 9.4, 9.5, 9.6 | 20 | 31% |
| 12 | 2.6, 9.3 (partial) | 21 | 32% |
| 13 | 5.1 | 22 | 34% |
| 14 | 5.2 | 23 | 35% |
| 15 | 5.3, 5.4 | 25 | 38% |
| 16 | 5.5, 8.1, 8.2 | 28 | 43% |
| 17 | 3.1 | 29 | 45% |
| 18 | 3.2 | 30 | 46% |
| 19 | 3.3 | 31 | 48% |
| 20 | 6.1, 6.2 | 33 | 51% |
| 21 | 6.3, 6.4 | 35 | 54% |
| 22 | 6.5, 6.6, 8.5, 8.6 | 39 | 60% |
| 23 | 8.3, 8.4 | 41 | 63% |
| 24 | 4.1, 4.2 | 43 | 66% |
| 25 | 4.3, 4.4 | 45 | 69% |
| 26 | 4.5, 4.6 | 47 | 72% |
| 27 | 7.1 | 48 | 74% |
| 28 | 7.2, 7.3 | 50 | 77% |
| 29 | 7.4 | 51 | 78% |
| 30 | 10.1, 10.2 | 53 | 82% |
| 31 | 10.3 | 54 | 83% |
| 32 | 10.4, 10.5 | 56 | 86% |
| 33 | 10.6, 10.7, 10.8 | 59 | 91% |
| 34 | 11.1, 11.2, 11.3 | 62 | 95% |
| 35 | 11.4, 11.5 | 64 | 98% |
| 36 | 12.1, 12.2, 12.3 | 67 | 103%* |
| 37 | 12.4 | 68 | — |
| 38 | 13.1, 13.2, 13.3 | 71 | — |
| 39 | 13.4, 13.5 | 73 | — |

*Percentages exceed 100% because some sections (9.3) are split across two parts. Total unique sections covered: 65/65 = **100%**.

---

## Thread State at Phase Boundaries

Quick lookup: what state should each thread be in when entering/exiting a phase.

| Phase | Entering: Proof Count | Entering: Programs | Entering: Rosen Sections |
|---|:--:|:--:|:--:|
| Phase 1 (Parts 1-7) | 0 | 0 | 0/65 |
| Phase 2 (Parts 8-12) | 6 | 7 | 9/65 |
| Phase 3 (Parts 13-16) | 11 | 12 | 21/65 |
| Phase 4 (Parts 17-19) | 18 | 16 | 28/65 |
| Phase 5 (Parts 20-23) | 20 | 19 | 31/65 |
| Phase 6 (Parts 24-26) | 23 | 23 | 41/65 |
| Phase 7 (Parts 27-29) | 27 | 26 | 47/65 |
| Phase 8 (Parts 30-35) | 28 | 29 | 51/65 |
| Phase 9 (Parts 36-39) | 32 | 35 | 64/65 |
| **Series End** | **~35** | **39** | **65/65** |
