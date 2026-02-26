# Part 35: Spanning Trees and Minimum Spanning Trees: Network Design on a Budget

> Rosen Sections: 11.4-11.5
> Blog file: `apps/web/src/content/blog/discrete-mathematics/35-spanning-trees.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "Spanning Trees and Minimum Spanning Trees: Network Design on a Budget"
description: "Implement Kruskal's and Prim's algorithms for minimum spanning trees, master the union-find data structure, and understand network design from STP to clustering."
excerpt: "Minimize cable length connecting offices. The spanning tree protocol prevents network loops. Cluster analysis groups similar data points. All three are minimum spanning tree problems — solved by Kruskal's and Prim's algorithms."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "trees"]
series: "Discrete Mathematics for Developers"
seriesPart: 35
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

- **Scenario:** You need to connect 20 offices with a private network. Each possible link has a cost. You want every office reachable from every other, with minimum total cable cost. You are not looking for shortest paths between individual pairs -- you want the cheapest network that connects everyone. This is the minimum spanning tree problem.
- **Reveal:** A spanning tree of a graph includes all vertices and enough edges to keep everything connected -- exactly V-1 edges, no cycles. The minimum spanning tree (MST) is the spanning tree with the smallest total edge weight. Kruskal's algorithm sorts edges by weight and adds them greedily; Prim's algorithm grows the tree from a starting vertex. Both are correct, and the cut property tells you why.
- **Outcome:** By the end, you will find spanning trees via BFS and DFS, implement Kruskal's algorithm with union-find, implement Prim's algorithm with a priority queue, prove the MST cut property, and connect the theory to network design, clustering, and the spanning tree protocol.

## Section Outline

### 1. Why This Matters

- Network design (minimizing cable cost, maximizing coverage) is a direct MST application. The spanning tree protocol (STP) in Ethernet switches uses spanning trees to prevent broadcast storms.
- Cluster analysis in machine learning uses MST: build the MST, then remove the heaviest edges to partition data into clusters.
- Union-find is one of the most important data structures in computer science, with applications far beyond MST (connected components, equivalence classes, Kruskal's algorithm).

### 2. Spanning Trees (11.4)

- **Definition:** A spanning tree of a connected graph G is a subgraph that is a tree and includes all vertices of G. It has exactly V-1 edges.
- **Existence:** Every connected graph has at least one spanning tree. (Proof: if the graph has a cycle, remove an edge from the cycle. The graph remains connected. Repeat until no cycles remain. The result is a spanning tree.)
- **Non-uniqueness:** A connected graph with cycles has multiple spanning trees. A complete graph K_n has n^(n-2) spanning trees (Cayley's formula).
- **Finding spanning trees:** BFS from any vertex produces a spanning tree (BFS tree). DFS from any vertex produces a spanning tree (DFS tree). These are the same spanning trees from Part 32, now recognized as such.

### 3. Backtracking as DFS on a Solution Tree

- **Backtracking algorithms** explore a tree of partial solutions. At each node, extend the partial solution. If a constraint is violated, prune (backtrack). If a complete valid solution is found, report it.
- This is DFS on an implicit tree of possibilities. The tree is never fully constructed -- only the current path is stored.
- **Connection to Part 32:** DFS was introduced for graph traversal. Here it appears as a problem-solving strategy on abstract solution trees. Same algorithm, different domain.
- **Examples:** N-queens problem, Sudoku solving, constraint satisfaction.

### 4. Minimum Spanning Trees (11.5)

- **Definition:** Given a weighted connected graph, the MST is the spanning tree with the minimum total edge weight.
- **Key insight:** An MST connects all vertices with the cheapest possible total cost. It does NOT give shortest paths between individual pairs (Dijkstra does that).
- **Properties:** The MST is unique if all edge weights are distinct. If weights are not distinct, there may be multiple MSTs with the same total weight.

### 5. The Cut Property (Proof Portfolio +1)

- **Statement:** For any cut (partition of vertices into two non-empty sets), the minimum-weight edge crossing the cut is in every MST (assuming unique weights) or in at least one MST (non-unique weights).
- **Proof by contradiction:**
  1. Suppose the minimum-weight edge e crossing a cut is NOT in some MST T.
  2. Adding e to T creates exactly one cycle (since T is a tree).
  3. This cycle must contain another edge e' crossing the same cut (because e connects the two sides, and the cycle must return).
  4. Since e has lower weight than e' (e is the minimum crossing edge), replacing e' with e gives a tree T' with lower total weight.
  5. This contradicts T being an MST.
- **Why this matters:** The cut property is why greedy algorithms (Kruskal, Prim) work for MST. At each step, they add the cheapest edge that extends the tree without creating a cycle -- which is always a minimum-weight cut edge.

### 6. Kruskal's Algorithm

- **Idea:** Sort all edges by weight. Process edges in order. Add an edge if it does not create a cycle (i.e., connects two different components).
- **Cycle detection:** Use union-find. Two vertices are in the same component if they have the same representative. Adding an edge between different components = union.
- **Pseudocode:** Sort edges. Initialize union-find with V singletons. For each edge (u, v, w) in sorted order: if find(u) != find(v), add edge to MST, union(u, v).
- **Complexity:** O(E log E) for sorting, plus near-O(E) for union-find operations. Total: O(E log E).
- **Best for:** Sparse graphs (E is small relative to V^2). Also natural when edges arrive as a sorted stream.

### 7. Union-Find Data Structure

- **Purpose:** Maintain a partition of elements into disjoint sets. Support two operations: `find(x)` (which set contains x?) and `union(x, y)` (merge the sets containing x and y).
- **Implementation with path compression and union by rank:**
  - Each element points to a parent. The root of each tree is the set representative.
  - `find(x)`: Follow parent pointers to the root. Path compression: make every node on the path point directly to the root.
  - `union(x, y)`: Find roots of x and y. Attach the shorter tree under the taller tree (union by rank).
- **Amortized complexity:** Nearly O(1) per operation (inverse Ackermann function). Effectively constant time for all practical inputs.
- **Applications beyond MST:** Connected components in dynamic graphs, equivalence class computation, percolation theory.

### 8. Prim's Algorithm

- **Idea:** Start from any vertex. Greedily add the cheapest edge connecting the current tree to a non-tree vertex. Repeat until all vertices are in the tree.
- **Implementation:** Priority queue of non-tree vertices, keyed by the weight of the cheapest edge connecting them to the tree. Extract minimum, add to tree, update keys of neighbors.
- **Complexity:** O((V + E) log V) with a binary heap. O(V^2) without a priority queue (better for dense graphs).
- **Comparison to Dijkstra:** Prim and Dijkstra have nearly identical code structure. Dijkstra's key is "distance from source." Prim's key is "weight of cheapest connecting edge." The difference is one line.
- **Best for:** Dense graphs or when you want to grow the MST from a specific starting vertex.

### 9. MST Applications

- **Network design:** Connect offices, servers, or data centers with minimum total cable/fiber cost. This is the original MST motivation.
- **Clustering:** Build the MST of a dataset (vertices = data points, edges = pairwise distances). Remove the k-1 heaviest edges to get k clusters. Single-linkage clustering.
- **Steiner trees (brief mention):** MST connects all given vertices. Steiner tree allows adding extra vertices to further reduce cost. NP-hard in general.
- **Approximation algorithms:** MST is used as a subroutine in approximation algorithms for TSP (the MST heuristic gives a 2-approximation for metric TSP).

### 10. Spanning Tree Protocol (STP)

- **Problem:** Ethernet switches in a network with redundant links create broadcast storms (packets loop forever).
- **Solution:** STP computes a spanning tree of the network. Only edges in the spanning tree forward traffic. Redundant links are disabled.
- **Root bridge election:** The switch with the lowest ID becomes the root. All other switches compute shortest paths to the root. Edges not on shortest paths are blocked.
- **Developer connection:** If you have ever wondered why a network takes 30-50 seconds to converge after a topology change, STP reconvergence is the reason. RSTP (Rapid STP) reduces this to seconds.

### Code Companion: spanning_tree.py

- **Kruskal's algorithm with union-find:** `kruskal(graph)` returning the MST edge list and total weight. Union-find implemented as a class with `find()` and `union()` using path compression and union by rank.
- **Prim's algorithm with priority queue:** `prim(graph, start)` returning the MST edge list and total weight. Uses Python's `heapq`.
- **Union-find class:** Standalone `UnionFind` class with `find()`, `union()`, `connected()`, `components()`.
- **Comparison:** Run both algorithms on the same graph, verify they produce the same total weight (possibly different trees if edge weights are not unique).

### The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "MST is the cheapest way to connect everything" -- misses that it connects vertices (not shortest paths between pairs), that greedy works because of the cut property, and the distinction between Kruskal and Prim |
| :white_check_mark: **Right** | A spanning tree includes all vertices with V-1 edges. The MST minimizes total edge weight. The cut property (proof by contradiction) guarantees that greedy edge selection is optimal. Kruskal sorts edges and uses union-find (O(E log E)). Prim grows from a vertex using a priority queue (O((V+E) log V)). |
| :x: **Too Formal** | Matroid theory (MST as a special case of matroid optimization). Proving that the greedy algorithm is optimal via the matroid intersection theorem. |
| :warning: **Common Mistake** | Confusing MST with shortest paths. The MST minimizes TOTAL edge weight across the entire tree. Dijkstra minimizes the path weight from a SOURCE to each vertex. They solve different problems and can give different answers. |

## Thread Progression

- **Proof Portfolio:** +1 new proof (MST cut property by contradiction). Running total: 32 proofs.
- **Code Companion:** `spanning_tree.py` -- Kruskal with union-find (path compression + union by rank), Prim with priority queue, standalone union-find class.
- **Rosen Exercises:**
  - **Essential:** 11.4: 1, 3, 5, 7, 11; 11.5: 1, 3, 5, 7
  - **Recommended:** 11.4: 15; 11.5: 11, 15
  - **Challenge:** 11.5: 23

## Further Resources

- **MIT 6.042J Lectures 10-11** -- Spanning trees, minimum spanning trees, Kruskal's and Prim's algorithms.
- **CLRS Chapter 23** -- Minimum spanning trees. Full correctness proofs for both algorithms via the cut property.
- **Computerphile: "Minimum Spanning Trees"** -- Visual comparison of Kruskal's and Prim's algorithms on the same graph.

## Key Takeaways

1. A spanning tree connects all vertices with V-1 edges and no cycles. The MST minimizes total weight. The cut property proves that greedy selection is optimal.
2. Kruskal sorts edges and uses union-find: O(E log E), best for sparse graphs. Prim grows from a vertex with a priority queue: O((V+E) log V), best for dense graphs.
3. Union-find with path compression and union by rank achieves nearly O(1) per operation. It is one of the most important data structures in computer science, applicable far beyond MST.

## Writer Notes

- This is the last part of Phase 8. Close the graphs/trees arc by noting what readers have built: a Graph class, four representations, two traversals, three shortest-path algorithms, tree data structures, and two MST algorithms. This is a substantial and practical body of knowledge.
- The cut property proof is the conceptual highlight. It explains WHY greedy works for MST -- a question that most algorithm courses skip or hand-wave. Walk through the contradiction carefully.
- Union-find deserves thorough treatment. Path compression and union by rank are both essential for the near-O(1) amortized bound. Show the before/after of path compression visually.
- The Prim/Dijkstra comparison is a key insight. "Change one line and Dijkstra becomes Prim." This connection helps readers remember both algorithms and understand their relationship.
- STP is a networking application that most developers encounter indirectly (slow network convergence, loop detection). Explaining the algorithm demystifies a common operational experience.
- Forward-reference Phase 9: "Graphs and trees model relationships. Phase 9 bridges to two new tracks: Boolean algebra connects logic to how CPUs compute, and automata theory connects graphs to what computation itself can and cannot do."
