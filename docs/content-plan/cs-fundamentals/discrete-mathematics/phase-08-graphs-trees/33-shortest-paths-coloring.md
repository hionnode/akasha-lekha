# Part 33: Shortest Paths, Planarity, and Graph Coloring: GPS, Circuit Boards, and Exam Schedules

> Rosen Sections: 10.6-10.8
> Blog file: `apps/web/src/content/blog/discrete-mathematics/33-shortest-paths-coloring.mdx`
> Estimated word count: 3,500-4,500

## Frontmatter

```yaml
---
title: "Shortest Paths, Planarity, and Graph Coloring: GPS, Circuit Boards, and Exam Schedules"
description: "Implement Dijkstra's and Bellman-Ford algorithms, understand planar graphs and Euler's formula, and apply graph coloring to register allocation and scheduling."
excerpt: "Google Maps uses Dijkstra. Your compiler uses graph coloring for register allocation. Circuit board layout uses planarity. This post covers shortest paths, planar graphs, and chromatic numbers — three pillars of applied graph theory."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "graphs"]
series: "Discrete Mathematics for Developers"
seriesPart: 33
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

- **Scenario:** Google Maps finds the fastest route between two cities. Your compiler decides which variables live in CPU registers. A university schedules exams so no student has two exams at the same time. Three completely different problems -- all solved by graph algorithms. Shortest paths, planarity, and graph coloring are where graph theory meets the real world.
- **Reveal:** Dijkstra's algorithm computes shortest paths in O((V + E) log V) with a priority queue. Graph coloring assigns colors (resources) to vertices (tasks) so no two adjacent vertices share a color. Planar graphs are those that can be drawn without edge crossings -- and Euler's formula constrains their structure.
- **Outcome:** By the end, you will implement Dijkstra's algorithm with correctness proof, understand Bellman-Ford for negative weights, apply Euler's formula to planar graphs, and solve scheduling problems with graph coloring.

## Section Outline

### 1. Why This Matters

- Shortest-path algorithms power routing (OSPF, Google Maps, GPS), network flow, and arbitrage detection (negative cycles).
- Graph coloring powers register allocation in compilers, exam scheduling, frequency assignment in wireless networks, and map coloring.
- Planarity determines whether a circuit board can be single-layer or needs multiple layers, and constrains graph structure via Euler's formula.
- This is the densest part in the graphs phase -- three major topics. Each is independently important.

### 2. Shortest-Path Problems (10.6)

- **Single-source shortest path:** Find the shortest path from one source vertex to all other vertices. Dijkstra (non-negative weights), Bellman-Ford (any weights).
- **All-pairs shortest path:** Find shortest paths between all pairs of vertices. Floyd-Warshall.
- **Unweighted shortest path:** BFS (covered in Part 32). Dijkstra is the weighted generalization.

### 3. Dijkstra's Algorithm

- **Idea:** Greedily extend the shortest known path. Maintain a priority queue of vertices ordered by tentative distance. Extract the minimum, relax its neighbors.
- **Pseudocode:** Full algorithm with priority queue.
- **Step-by-step trace:** Walk through a small weighted graph (6-8 vertices), showing the priority queue state at each step.
- **Correctness proof (Proof Portfolio +1):** By induction on the number of vertices processed.
  - **Base case:** The source vertex has distance 0, which is correct.
  - **Inductive step:** When vertex v is extracted from the priority queue, its tentative distance is its true shortest-path distance. Proof: if a shorter path existed, it would have to go through an unprocessed vertex with a smaller tentative distance, contradicting that v was the minimum in the queue.
- **Complexity:** O((V + E) log V) with a binary heap. O(V^2) without a priority queue (better for dense graphs).
- **Limitation:** Does not work with negative edge weights. Explain why: a negative edge could make a "longer" path shorter after more steps.

### 4. Bellman-Ford Algorithm

- **When to use:** Graphs with negative edge weights. Also detects negative-weight cycles.
- **Idea:** Relax all edges V-1 times. If any distance decreases on the V-th pass, a negative cycle exists.
- **Complexity:** O(V * E). Slower than Dijkstra but handles negative weights.
- **Application:** Currency arbitrage detection. If converting USD -> EUR -> GBP -> USD yields more than you started with, there is a negative cycle in the exchange rate graph.

### 5. Floyd-Warshall Algorithm

- **When to use:** All-pairs shortest paths. Small-to-medium graphs.
- **Idea:** Dynamic programming. For each intermediate vertex k, check if going through k improves the path from i to j.
- **Complexity:** O(V^3). Space: O(V^2).
- **Implementation:** Simple triple nested loop. Elegant but does not scale to large graphs.

### 6. Planar Graphs (10.7)

- **Definition:** A graph is planar if it can be drawn in the plane without edge crossings.
- **Why it matters:** Circuit board layout (single-layer vs multi-layer), geographic maps, VLSI design.
- **Euler's formula:** For a connected planar graph, V - E + F = 2, where F is the number of faces (regions).
- **Consequence:** For a simple connected planar graph with V >= 3, E <= 3V - 6. This limits edge density.
- **Kuratowski's theorem:** A graph is planar if and only if it does not contain a subdivision of K_5 or K_3,3. Provides a characterization, though testing planarity is done with efficient algorithms in practice.

### 7. Graph Coloring (10.8)

- **Definition:** A proper coloring assigns a color to each vertex so that no two adjacent vertices share the same color.
- **Chromatic number chi(G):** The minimum number of colors needed for a proper coloring.
- **Examples:** chi(K_n) = n (complete graph, every vertex is adjacent to every other). chi(C_n) = 2 if n is even, 3 if n is odd. chi(bipartite graph) = 2.
- **Greedy coloring algorithm:** Process vertices in some order, assign each the smallest available color. May not find the optimal coloring, but gives a valid coloring with at most Delta(G) + 1 colors (where Delta is the maximum degree).

### 8. Four-Color Theorem

- **Statement:** Every planar graph can be properly colored with at most 4 colors.
- **History:** Conjectured in 1852, proved in 1976 by Appel and Haken using a computer-assisted proof (the first major theorem proved with computer assistance). Controversial at the time.
- **Practical implication:** Maps can always be colored with 4 colors so no two adjacent regions share a color.
- Brief treatment -- state the theorem, note its historical significance, do not attempt a proof.

### 9. Applications of Graph Coloring

- **Register allocation:** Variables are vertices, edges connect variables whose lifetimes overlap. Colors are CPU registers. Minimize the number of registers needed. This is how compilers optimize variable storage.
- **Exam scheduling:** Courses are vertices, edges connect courses with common students. Colors are time slots. Minimize the number of time slots.
- **Frequency assignment:** Transmitters are vertices, edges connect transmitters whose signals would interfere. Colors are frequencies. Minimize the number of frequencies.
- **Map coloring:** Regions are vertices, edges connect adjacent regions. Colors are actual colors.
- **ComparisonTable:** Application vs graph model vs what vertices/edges/colors represent.

### Code Companion: shortest_path.py

- **Dijkstra with priority queue:** `dijkstra(graph, source)` returning distance dict and parent dict. Uses Python's `heapq`.
- **Bellman-Ford:** `bellman_ford(graph, source)` returning distances and detecting negative cycles.
- **Greedy coloring:** `greedy_color(graph)` returning a color assignment. Report chromatic number upper bound.
- **Path reconstruction:** `shortest_path(graph, source, target)` returning the actual path and its weight.
- **Negative cycle detection:** `has_negative_cycle(graph)` using Bellman-Ford's V-th iteration check.

### The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "Dijkstra finds the shortest path" -- misses the non-negative weight requirement, the priority queue mechanism, and the correctness argument |
| :white_check_mark: **Right** | Dijkstra's algorithm greedily extends shortest paths using a priority queue, runs in O((V+E) log V), and is correct for non-negative weights (proved by induction on vertices processed). Bellman-Ford handles negative weights in O(VE). Graph coloring assigns colors to vertices minimizing conflicts; the chromatic number is the minimum colors needed. |
| :x: **Too Formal** | Proving Euler's formula by induction on edges with full case analysis. Proving that graph coloring is NP-hard via reduction from 3-SAT. Proving the four-color theorem. |
| :warning: **Common Mistake** | Using Dijkstra with negative edge weights. It produces incorrect results because a "finalized" vertex may later be reachable via a cheaper path through a negative edge. Use Bellman-Ford instead. |

## Thread Progression

- **Proof Portfolio:** +1 new proof (Dijkstra correctness by induction on vertices processed). Running total: 30 proofs.
- **Code Companion:** `shortest_path.py` -- Dijkstra with priority queue, Bellman-Ford with negative cycle detection, greedy graph coloring.
- **Rosen Exercises:**
  - **Essential:** 10.6: 1, 3, 5, 7, 11; 10.7: 1, 3, 5; 10.8: 1, 3, 5, 7
  - **Recommended:** 10.6: 15; 10.7: 7, 11; 10.8: 11, 15
  - **Challenge:** (none specified -- the three-topic coverage is the challenge)

## Further Resources

- **MIT 6.042J Lectures 6-7** -- Shortest paths, Dijkstra's algorithm, graph coloring.
- **CLRS Chapter 24** -- Single-source shortest paths (Dijkstra, Bellman-Ford) with full correctness proofs and complexity analysis.
- **Computerphile: "Dijkstra's Algorithm"** -- Visual walkthrough of the algorithm with a clear worked example.

## Key Takeaways

1. Dijkstra's algorithm finds shortest paths in O((V+E) log V) for non-negative weights. Bellman-Ford handles negative weights in O(VE) and detects negative cycles. Floyd-Warshall computes all-pairs shortest paths in O(V^3).
2. Planar graphs can be drawn without crossings. Euler's formula (V - E + F = 2) constrains their structure. The four-color theorem guarantees they need at most 4 colors.
3. Graph coloring assigns resources to tasks avoiding conflicts. Register allocation, exam scheduling, and frequency assignment are all graph coloring problems.

## Writer Notes

- This is the densest part in Phase 8. Three major topics (shortest paths, planarity, coloring) each deserve full posts, but grouping them follows Rosen's structure and keeps the phase at 6 parts. Prioritize Dijkstra (most useful), then coloring (most applicable), then planarity (most theoretical).
- The Dijkstra correctness proof is the proof portfolio entry. It uses induction on vertices processed -- a direct callback to Phase 3. Emphasize the connection: "the induction technique from Part 10 is now proving algorithm correctness."
- The register allocation application of graph coloring is the strongest developer hook. "Your compiler does graph coloring every time it compiles a function" is a powerful statement. Make it concrete with a small example showing variable lifetimes and register assignment.
- Currency arbitrage (Bellman-Ford) is an engaging example of negative cycles. "If you can make money by cycling through exchange rates, there's a negative cycle in the graph."
- Floyd-Warshall gets brief treatment -- it is simple (triple nested loop) and well-known. Show the recurrence relation and the code, but do not dwell.
- Forward-reference Part 34: "Graphs model arbitrary relationships. Trees are graphs with special structure: connected, acyclic, and recursive. Part 34 explores the data structure that runs file systems, compilers, databases, and web browsers."
