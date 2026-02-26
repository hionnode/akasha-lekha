# Part 31: Graph Representations and Isomorphism: How to Store a Graph

> Rosen Sections: 10.3
> Blog file: `apps/web/src/content/blog/discrete-mathematics/31-graph-representations.mdx`
> Estimated word count: 2,500-3,500

## Frontmatter

```yaml
---
title: "Graph Representations and Isomorphism: How to Store a Graph"
description: "Compare adjacency lists, adjacency matrices, and edge lists — learn when each representation wins and how to check if two graphs are structurally identical."
excerpt: "Adjacency list or adjacency matrix? The answer depends on density, cache performance, and which operations you need. This post compares every graph representation and introduces graph isomorphism."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "graphs"]
series: "Discrete Mathematics for Developers"
seriesPart: 31
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

- **Scenario:** You need to store a graph with 10 million vertices and 50 million edges. An adjacency matrix would use 10^14 bits -- roughly 12 terabytes. An adjacency list uses about 200 megabytes. The representation you choose determines whether your graph fits in memory or crashes your machine.
- **Reveal:** Graph representation is not an academic exercise. Sparse graphs (most real-world graphs) demand adjacency lists. Dense graphs benefit from adjacency matrices (cache-friendly, constant-time edge lookup). The tradeoff is space vs time vs cache performance, and getting it wrong costs orders of magnitude.
- **Outcome:** By the end, you will implement all major graph representations, convert between them, understand their time and space complexities, and know how to check whether two graphs are structurally identical (graph isomorphism).

## Section Outline

### 1. Why This Matters

- The choice between adjacency list and adjacency matrix is one of the most common data structure decisions in practice. Social networks, road networks, dependency graphs, knowledge graphs -- each has different density and access patterns.
- Understanding representations is prerequisite to understanding algorithm complexity. BFS on an adjacency list is O(V+E). BFS on an adjacency matrix is O(V^2). Same algorithm, different cost.
- Graph isomorphism connects to practical problems: comparing database schemas, detecting duplicate network topologies, verifying circuit equivalence.

### 2. Adjacency List Representation

- **Structure:** For each vertex, store a list of its neighbors.
- **Space:** O(V + E). Proportional to the actual graph size, not the maximum possible size.
- **Edge lookup:** O(deg(v)) -- scan the neighbor list. Can improve to O(1) with hash sets.
- **Neighbor iteration:** O(deg(v)) -- direct access.
- **Best for:** Sparse graphs (E << V^2). Most real-world graphs are sparse.
- **Implementation:** Dictionary of lists, dictionary of sets, or array of lists depending on language and use case.
- **Code:** Show Python implementation with dict[int, set[int]].

### 3. Adjacency Matrix Representation

- **Structure:** V x V matrix M where M[i][j] = 1 (or weight) if edge (i,j) exists, 0 otherwise.
- **Space:** O(V^2). Fixed regardless of edge count.
- **Edge lookup:** O(1) -- direct index.
- **Neighbor iteration:** O(V) -- scan entire row.
- **Best for:** Dense graphs (E close to V^2), or when you need constant-time edge queries (e.g., repeated "is there an edge between u and v?" queries).
- **Cache performance:** Matrices are contiguous in memory. For dense graphs, this matters: sequential memory access is 100x faster than random access.
- **Implementation:** 2D numpy array or list of lists. For weighted graphs, store weights instead of 1s.

### 4. Edge List Representation

- **Structure:** A list of (u, v) pairs (or (u, v, weight) triples).
- **Space:** O(E).
- **Edge lookup:** O(E) -- linear scan.
- **Best for:** Algorithms that iterate over all edges (Kruskal's MST, Bellman-Ford). Also the natural format for graph input (CSV files, database tables).
- **Implementation:** List of tuples or structured array.

### 5. Incidence Matrix

- **Structure:** V x E matrix M where M[i][j] = 1 if vertex i is an endpoint of edge j.
- **Space:** O(V * E). Usually worse than other representations.
- **Use case:** Rare in practice. Appears in linear algebra formulations of graph problems and some network flow algorithms.
- Brief treatment -- mention for completeness, do not dwell.

### 6. Converting Between Representations

- **Adjacency list to adjacency matrix:** O(V^2) to initialize, O(E) to fill. Straightforward.
- **Adjacency matrix to adjacency list:** O(V^2) to scan all entries.
- **Edge list to adjacency list:** O(E). One pass.
- **Code:** Conversion functions for all pairs.
- **PanelSwitcher:** Show the same small graph in all four representations side by side.

### 7. Graph Isomorphism: Definition and Necessary Conditions

- **Definition:** Two graphs G1 = (V1, E1) and G2 = (V2, E2) are isomorphic if there exists a bijection f: V1 -> V2 such that (u, v) is an edge in G1 if and only if (f(u), f(v)) is an edge in G2.
- **Intuition:** Same structure, different labels. The graphs are "the same graph" up to renaming vertices.
- **Necessary conditions (invariants):** Same number of vertices, same number of edges, same degree sequence, same number of cycles of each length. None are sufficient alone.
- **Not sufficient:** Two graphs can satisfy all these conditions and still not be isomorphic. Example: specific 4-regular graphs on 8 vertices.

### 8. Graph Invariants

- **Degree sequence:** Sort all vertex degrees. Isomorphic graphs have identical degree sequences.
- **Number of connected components:** Must be the same.
- **Girth (shortest cycle length):** Must be the same.
- These are quick checks. If any invariant differs, the graphs are definitely not isomorphic. If all match, they might be.
- **Computational complexity:** Graph isomorphism is in NP but not known to be NP-complete. Babai's quasi-polynomial algorithm (2015) is a landmark result. For practical purposes, most graphs are easy to check.

### 9. Isomorphism Checking in Practice

- **Brute force:** Try all V! permutations. Factorial time. Only feasible for tiny graphs.
- **Heuristic:** Check invariants first (degree sequence, edge count). If they match, try to find a mapping greedily. Use backtracking with pruning.
- **Libraries:** NetworkX `is_isomorphic()`, VF2 algorithm. In practice, heuristic approaches work fast for most graphs.
- **Code:** Simple isomorphism checker using degree sequence + backtracking.

### 10. When Representation Choice Matters for Performance

- **Case study 1:** Social network graph (V = 10M, E = 50M, sparse). Adjacency list: 200 MB. Adjacency matrix: 12 TB. No choice.
- **Case study 2:** Small dense graph for all-pairs shortest paths (V = 500, E = 100K). Adjacency matrix: 250 KB, cache-friendly, O(1) edge lookup for Floyd-Warshall.
- **Case study 3:** Streaming edge data for MST (edges arrive one at a time). Edge list is natural. Convert to adjacency list only when needed.
- **ComparisonTable:** Representation vs space, edge lookup time, neighbor iteration time, best use case.

### Code Companion: graph_representations.py

- **All representations:** Adjacency list, adjacency matrix, edge list classes with a common interface.
- **Conversion functions:** `adj_list_to_matrix()`, `matrix_to_adj_list()`, `edge_list_to_adj_list()`, and all other conversions.
- **Isomorphism checker:** `are_isomorphic(G1, G2)` -- check invariants, then attempt backtracking mapping.
- **Benchmark:** Compare edge lookup and neighbor iteration times for sparse vs dense graphs across representations.

### The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "Just use a dictionary" -- ignores that adjacency matrices are better for dense graphs, cache performance, and specific algorithms |
| :white_check_mark: **Right** | Adjacency list is O(V+E) space with O(deg(v)) edge lookup. Adjacency matrix is O(V^2) space with O(1) edge lookup. Sparse graphs (most real-world graphs) use lists. Dense graphs or algorithms needing constant-time edge queries use matrices. Isomorphism requires a structure-preserving bijection. |
| :x: **Too Formal** | Spectral characterization of isomorphism via eigenvalues of the adjacency matrix. Category-theoretic definition of graph morphisms. |
| :warning: **Common Mistake** | Using an adjacency matrix for a sparse graph. A graph with 1M vertices and 5M edges has 10^12 matrix entries but only 5M nonzero ones. The matrix wastes 99.9995% of its space. |

## Thread Progression

- **Proof Portfolio:** No new proofs. This part focuses on representations and practical tradeoffs.
- **Code Companion:** `graph_representations.py` -- all four representations, conversion functions, isomorphism checker, performance benchmark.
- **Rosen Exercises:**
  - **Essential:** 10.3: 1, 3, 5, 7, 11, 15
  - **Recommended:** 10.3: 17, 23, 25
  - **Challenge:** 10.3: 31

## Further Resources

- **MIT 6.042J Lecture 6** -- Graph representations and their tradeoffs.
- **CLRS Chapter 22.1** -- Representing graphs. The canonical reference for adjacency list vs adjacency matrix analysis.
- **NetworkX documentation** -- Python library that implements all representations and includes the VF2 isomorphism algorithm.

## Key Takeaways

1. Adjacency lists are O(V+E) space and dominate for sparse graphs. Adjacency matrices are O(V^2) space with O(1) edge lookup and win for dense graphs or algorithms needing fast edge queries.
2. Graph isomorphism asks "are these two graphs structurally identical?" Quick invariant checks (degree sequence, edge count) rule out non-isomorphic graphs fast. Confirming isomorphism requires finding a mapping.
3. Representation choice is a performance decision with orders-of-magnitude impact. A 10M-vertex sparse graph fits in 200 MB as a list or 12 TB as a matrix.

## Writer Notes

- This is the most practical part in the graphs phase. Developers make representation choices constantly. Lead with the dramatic example: 200 MB vs 12 TB for the same graph.
- The isomorphism section should be accessible but honest about complexity. "This problem is in NP but not known to be NP-complete" is worth a sentence. Babai's quasi-polynomial algorithm is worth a sentence. Do not go deeper.
- The PanelSwitcher showing the same graph in all four representations is a key visual. Make sure the graph is small enough to be readable (5-7 vertices) but complex enough to show differences.
- Performance benchmarks in the Code Companion should use realistic sizes (10K vertices for sparse, 500 vertices for dense) so readers see real timing differences.
- Forward-reference Part 32: "You have the data structure. Part 32 gives you the algorithms: BFS and DFS, the two fundamental graph traversals that power everything from connectivity testing to topological sort."
