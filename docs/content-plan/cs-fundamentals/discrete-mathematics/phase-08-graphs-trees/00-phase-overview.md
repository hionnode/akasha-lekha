# Phase 8: Graphs and Trees (Parts 30-35)

## Phase Goal

Model and solve graph problems -- the most directly applicable topic for developers. The reader ends this phase able to represent graphs, implement traversal and shortest-path algorithms, work with trees as recursive data structures, and compute minimum spanning trees.

## Thread State

| Thread | Entering | Exiting |
|---|---|---|
| Proof Portfolio | 28 proofs | 32 proofs (+ handshaking lemma, Dijkstra correctness, tree n-1 edges, MST cut property) |
| Code Companion | 29 programs | 35 programs (`graph.py` through `spanning_tree.py`) |
| Rosen Sections | 51/65 | 64/65 (Ch 10 + Ch 11 complete, one section remaining in Ch 12) |

## Part Summary

| Part | Title | Key Deliverable | Thread Additions | Est. Words |
|:--:|---|---|---|:--:|
| 30 | Graph Fundamentals: Everything Is a Graph | Graph terminology, directed/undirected, weighted, DAGs, special graphs | Proof Portfolio +1 (handshaking lemma); `graph.py` — Graph class with multiple representations | 3,500-4,000 |
| 31 | Graph Representations and Isomorphism | Adjacency list vs matrix, edge list, isomorphism, representation tradeoffs | `graph_representations.py` — representation conversions, isomorphism check | 2,500-3,000 |
| 32 | Connectivity, Paths, and Traversal | BFS, DFS, connected components, Euler paths/circuits, Hamiltonian paths | `traversal.py` — BFS, DFS, connected components, Euler path finder | 3,500-4,000 |
| 33 | Shortest Paths, Planarity, and Coloring | Dijkstra, Bellman-Ford, Floyd-Warshall, planarity, graph coloring | Proof Portfolio +1 (Dijkstra correctness by induction); `shortest_path.py` — shortest path + coloring algorithms | 4,000-4,500 |
| 34 | Trees: The Recursive Data Structure | DOM trees, ASTs, B-trees, tries, Huffman coding, tree traversals | Proof Portfolio +1 (tree with n vertices has n-1 edges); `tree_algorithms.py` — traversals, Huffman coding | 3,500-4,000 |
| 35 | Spanning Trees and Minimum Spanning Trees | Kruskal's, Prim's, union-find, backtracking as DFS on solution tree, STP | Proof Portfolio +1 (MST cut property by contradiction); `spanning_tree.py` — Kruskal with union-find, Prim | 3,000-3,500 |

## Dependencies

- **Requires:** Phase 2 (relations as foundation -- graphs are built on relations and adjacency matrices), Phase 4 (complexity -- needed for algorithm analysis of BFS, Dijkstra, etc.)
- **Unlocks:** Phase 9 (bridge topics -- automata are special graphs), Data Structures and Algorithms track

## Writer Notes

- This is the longest phase (6 parts) because graphs are the most directly applicable topic in discrete math. Every dependency system, network, and data structure is a graph. Do not compress.
- Part 30 should open with a gallery of graphs developers already use: dependency graphs (npm, pip), entity-relationship diagrams, state machines (TCP, UI flows), social networks, the internet itself. The pitch: "you've been working with graphs your entire career."
- Part 31 (representations) is the most practical part: adjacency list vs adjacency matrix, when to use which, cache performance implications, sparse vs dense tradeoffs. Developers make this choice constantly.
- Part 33 is the densest part -- shortest paths plus planarity plus coloring. Dijkstra's algorithm (OSPF routing, Google Maps) is the centerpiece. Graph coloring ties to register allocation and scheduling.
- Part 34 (trees) is where developers have the strongest existing intuition. DOM trees, ASTs, file systems, database indices (B-trees) -- lean into "you already know this data structure, now let's formalize it."
- Dijkstra correctness (Part 33) is proved by induction on vertices processed -- a direct callback to Phase 3. MST cut property (Part 35) uses proof by contradiction -- a callback to Phase 1. These back-references demonstrate that proof techniques are tools, not one-off exercises.
- The Graph class built in Part 30 should be designed to be extended across Parts 31-35. Readers build one growing codebase, not six disconnected scripts.
