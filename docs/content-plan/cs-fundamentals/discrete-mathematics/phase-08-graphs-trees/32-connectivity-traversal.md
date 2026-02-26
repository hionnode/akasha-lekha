# Part 32: Connectivity and Traversal: BFS, DFS, and Euler's Bridges

> Rosen Sections: 10.4-10.5
> Blog file: `apps/web/src/content/blog/discrete-mathematics/32-connectivity-traversal.mdx`
> Estimated word count: 3,500-4,000

## Frontmatter

```yaml
---
title: "Connectivity and Traversal: BFS, DFS, and Euler's Bridges"
description: "Implement BFS and DFS, find connected components and cut vertices, trace Euler paths, and understand why the traveling salesman problem is NP-hard."
excerpt: "'Can I reach server B from server A?' is a connectivity question. BFS and DFS answer it. This post implements both traversals, finds connected components, and traces the path from Euler's bridges to the traveling salesman problem."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "graphs"]
series: "Discrete Mathematics for Developers"
seriesPart: 32
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

- **Scenario:** Your microservice architecture has 50 services. A network partition splits them into groups. Can service A still reach service B? Which services are completely isolated? If a single service goes down, does the entire system fragment? These are graph connectivity questions, and BFS/DFS answer them.
- **Reveal:** BFS (breadth-first search) and DFS (depth-first search) are the two fundamental graph traversals. BFS finds shortest paths in unweighted graphs. DFS finds connected components, detects cycles, and powers topological sort. Together, they solve most graph problems you will encounter.
- **Outcome:** By the end, you will implement BFS and DFS, find connected components, identify cut vertices and bridge edges, trace Euler paths, and understand the boundary between tractable (Euler paths) and NP-hard (Hamiltonian paths) graph problems.

## Section Outline

### 1. Why This Matters

- BFS and DFS are the two most fundamental algorithms in computer science. Most graph algorithms are built on top of one or both.
- Connectivity is the most basic graph question: "can I get from here to there?" Connected components partition a graph into reachable groups. Cut vertices and bridge edges identify single points of failure.
- The Euler path vs Hamiltonian path distinction is one of the clearest examples of the tractable/intractable boundary in computer science.

### 2. Paths and Circuits (10.4)

- **Path:** A sequence of vertices v0, v1, ..., vn where each consecutive pair is connected by an edge. Length = number of edges.
- **Simple path:** No repeated vertices.
- **Circuit (cycle):** A path that starts and ends at the same vertex.
- **Simple circuit:** No repeated vertices except start/end.
- **Distance:** The length of the shortest path between two vertices. If no path exists, distance is infinity.
- **Diameter:** The maximum distance between any two vertices in a connected graph.

### 3. Connectivity (10.4)

- **Connected graph:** There is a path between every pair of vertices.
- **Connected component:** A maximal connected subgraph. Every vertex belongs to exactly one component.
- **Strongly connected (directed graphs):** There is a directed path from every vertex to every other vertex.
- **Weakly connected (directed graphs):** Connected if you ignore edge directions.
- **Developer connection:** Microservice dependency graphs. If the graph is not strongly connected, some services cannot reach others. Connected components identify independent subsystems.

### 4. Cut Vertices and Bridge Edges

- **Cut vertex (articulation point):** A vertex whose removal disconnects the graph. Single point of failure.
- **Bridge edge:** An edge whose removal disconnects the graph.
- **Developer connection:** In a network topology, cut vertices are single points of failure. In a microservice architecture, a service that is a cut vertex means its failure partitions the system.
- Finding cut vertices: use DFS with discovery time and low values (Tarjan's algorithm, brief overview). Full implementation in Code Companion.

### 5. BFS Algorithm

- **Idea:** Explore vertices in order of their distance from the source. Use a queue. Visit all neighbors before moving to the next level.
- **Pseudocode:** Initialize queue with source. While queue is not empty: dequeue vertex, visit unvisited neighbors, enqueue them.
- **Properties:** Finds shortest paths in unweighted graphs. Time: O(V + E) with adjacency list. Explores in "rings" outward from the source.
- **Applications:** Shortest path in unweighted graphs, level-order tree traversal, finding connected components, bipartite checking, web crawling, social network "degrees of separation."
- **Code walkthrough:** Full BFS implementation with path reconstruction.

### 6. DFS Algorithm

- **Idea:** Explore as far as possible along each branch before backtracking. Use a stack (or recursion).
- **Pseudocode:** Initialize stack with source (or call recursive function). Visit unvisited neighbors by pushing them and diving deeper.
- **Properties:** Finds all reachable vertices. Time: O(V + E) with adjacency list. Explores "deep" before "wide."
- **Edge classification:** Tree edges (part of DFS tree), back edges (to ancestors -- indicate cycles), forward edges (to descendants), cross edges (between subtrees). Back edges detect cycles.
- **Applications:** Cycle detection, topological sort (on DAGs), connected components, finding cut vertices, maze solving.
- **Code walkthrough:** Full DFS implementation, both recursive and iterative.

### 7. Applications of BFS/DFS

- **Connected components:** Run BFS or DFS from each unvisited vertex. Each run discovers one component.
- **Cycle detection:** DFS finds a cycle if and only if it encounters a back edge.
- **Bipartite checking:** BFS can test bipartiteness: try to 2-color the graph level by level. If a conflict arises, the graph is not bipartite.
- **Topological sort:** DFS on a DAG, output vertices in reverse finish order. Dependency resolution (build systems, package managers).
- **ComparisonTable:** BFS vs DFS -- data structure (queue vs stack), order of exploration, what it finds (shortest paths vs deep paths), applications.

### 8. Euler Paths and Circuits (10.5)

- **History:** The Konigsberg bridge problem (1736). Euler asked: can you cross each bridge exactly once? He proved it impossible, founding graph theory.
- **Euler path:** A path that traverses every EDGE exactly once. Euler circuit: an Euler path that starts and ends at the same vertex.
- **Necessary and sufficient conditions:**
  - Euler circuit exists if and only if the graph is connected and every vertex has even degree.
  - Euler path exists if and only if the graph is connected and has exactly 0 or 2 vertices of odd degree.
- **Algorithm (Hierholzer's):** Find a circuit, then extend it by finding circuits from unvisited edges.
- **Developer connection:** Network traversal where you must test every link exactly once. Chinese postman problem (mail delivery minimizing repeated edges).

### 9. Hamiltonian Paths and Circuits

- **Hamiltonian path:** A path that visits every VERTEX exactly once. Hamiltonian circuit: a Hamiltonian path that returns to the start.
- **No known efficient test:** Unlike Euler paths (polynomial-time checkable conditions), no simple necessary and sufficient condition for Hamiltonian paths exists.
- **NP-complete:** Determining whether a Hamiltonian path exists is NP-complete.
- **Contrast with Euler paths:** Euler = every edge exactly once (polynomial). Hamiltonian = every vertex exactly once (NP-complete). This is one of the starkest tractability contrasts in graph theory.

### 10. Traveling Salesman Problem (NP-hard)

- **Problem:** Given a weighted complete graph, find the minimum-weight Hamiltonian circuit.
- **NP-hard:** No known polynomial-time algorithm. Best exact algorithms are exponential.
- **Practical approaches:** Approximation algorithms (nearest neighbor heuristic, Christofides algorithm for metric TSP), dynamic programming (Held-Karp, O(n^2 * 2^n)).
- **Developer connection:** Route optimization, delivery scheduling, circuit board drilling. In practice, heuristics and approximations are used for large instances.

### 11. Strong Connectivity in Directed Graphs

- **Strongly connected components (SCCs):** Maximal subsets where every vertex can reach every other.
- **Algorithms:** Kosaraju's (two DFS passes) or Tarjan's (single DFS with stack).
- **Application:** In a dependency graph, SCCs are circular dependencies. In a web graph, SCCs are groups of pages that all link to each other.
- Brief treatment -- mention algorithms by name, describe the idea, do not implement fully.

### Code Companion: traversal.py

- **BFS implementation:** `bfs(graph, source)` returning parent map for path reconstruction. `shortest_path(graph, source, target)` using BFS.
- **DFS implementation:** `dfs(graph, source)` both recursive and iterative. `dfs_with_classification(graph)` returning edge types.
- **Connected components:** `connected_components(graph)` using BFS/DFS.
- **Euler path detection:** `has_euler_path(graph)`, `has_euler_circuit(graph)`, `find_euler_path(graph)` using Hierholzer's algorithm.
- **Cycle detection:** `has_cycle(graph)` using DFS back edge detection.

### The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "BFS uses a queue, DFS uses a stack" -- correct but misses the implications: BFS finds shortest paths, DFS finds cycles and enables topological sort |
| :white_check_mark: **Right** | BFS explores in distance order (shortest paths in unweighted graphs, O(V+E)). DFS explores depth-first (cycle detection, topological sort, O(V+E)). Euler paths traverse every edge once (polynomial conditions). Hamiltonian paths visit every vertex once (NP-complete). |
| :x: **Too Formal** | BFS and DFS as graph search frameworks with formal correctness proofs via loop invariants. Complexity classes P, NP, NP-complete in full detail. |
| :warning: **Common Mistake** | Using BFS when DFS is needed (or vice versa). BFS for shortest paths, DFS for cycle detection and topological sort. Using the wrong traversal gives wrong results or worse performance. |

## Thread Progression

- **Proof Portfolio:** No new proofs. This part focuses on algorithms and their applications.
- **Code Companion:** `traversal.py` -- BFS, DFS (recursive and iterative), connected components, Euler path detection (Hierholzer's), cycle detection.
- **Rosen Exercises:**
  - **Essential:** 10.4: 1, 3, 5, 7, 11, 15; 10.5: 1, 3, 5, 7
  - **Recommended:** 10.4: 23; 10.5: 11, 15, 23
  - **Challenge:** 10.5: 25

## Further Resources

- **MIT 6.042J Lecture 6** -- Graph connectivity, BFS, DFS.
- **CLRS Chapter 22** -- BFS, DFS, topological sort, strongly connected components. The definitive algorithms textbook treatment.
- **VisuAlgo: Graph Traversal** -- Step-by-step BFS and DFS visualization. Invaluable for building intuition about traversal order.

## Key Takeaways

1. BFS (queue, level-order) finds shortest paths in unweighted graphs. DFS (stack/recursion, depth-first) detects cycles and enables topological sort. Both run in O(V + E).
2. Connected components partition a graph into reachable groups. Cut vertices and bridge edges are single points of failure. Identifying them is essential for reliability engineering.
3. Euler paths (every edge once) have polynomial-time conditions. Hamiltonian paths (every vertex once) are NP-complete. This contrast illustrates the P vs NP boundary in a concrete setting.

## Writer Notes

- BFS and DFS are the workhorses of graph algorithms. Do not rush them. Full pseudocode, full code, step-by-step trace on a small graph for each.
- The Euler vs Hamiltonian contrast is one of the best pedagogical examples of the tractable/intractable boundary. Highlight it: "same kind of question (traverse everything exactly once), wildly different difficulty (polynomial vs NP-complete), depending on whether 'everything' means edges or vertices."
- Cut vertices and bridge edges connect directly to reliability engineering. "If this service goes down, does the system fragment?" is a cut vertex question. Make this connection explicit.
- The TSP section should be brief -- it is NP-hard and deserves a mention, not a full treatment. Name the heuristics, state the complexity, move on.
- Forward-reference Part 33: "BFS finds shortest paths in unweighted graphs. Part 33 handles weighted graphs: Dijkstra's algorithm (the engine behind Google Maps), Bellman-Ford (negative weights), and Floyd-Warshall (all pairs)."
