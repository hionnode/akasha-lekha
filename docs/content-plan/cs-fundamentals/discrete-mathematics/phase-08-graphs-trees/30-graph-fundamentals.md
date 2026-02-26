# Part 30: Graph Fundamentals: Everything Is a Graph

> Rosen Sections: 10.1-10.2
> Blog file: `apps/web/src/content/blog/discrete-mathematics/30-graph-fundamentals.mdx`
> Estimated word count: 3,000-3,500

## Frontmatter

```yaml
---
title: "Graph Fundamentals: Everything Is a Graph"
description: "Learn graph models, directed and undirected graphs, degree, and the handshaking lemma — the formal foundation behind dependency graphs, state machines, and networks."
excerpt: "Dependency graphs, entity-relationship diagrams, state machines, the internet itself — everything is a graph. This post formalizes the data structure you already use everywhere and proves the handshaking lemma."
date: "TBD"
author: "works-on-my.cloud"
tags: ["discrete-math", "cs-fundamentals", "graphs"]
series: "Discrete Mathematics for Developers"
seriesPart: 30
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

- **Scenario:** You run `npm install` and it resolves a dependency graph. You draw an entity-relationship diagram for a database. You debug a TCP state machine. You trace a request through a microservice architecture. Every one of these is a graph -- vertices connected by edges, with structure that determines behavior.
- **Reveal:** Graph theory formalizes these structures. Directed vs undirected, weighted vs unweighted, cyclic vs acyclic -- these distinctions determine which algorithms work, which problems are tractable, and which are NP-hard. You have been working with graphs your entire career. Now you get the vocabulary and the theorems.
- **Outcome:** By the end, you will define graphs formally, distinguish directed/undirected/multi/simple graphs, compute degrees, prove the handshaking lemma, identify special graph families (complete, bipartite, cycles), and build a Graph class that grows across the next five parts.

## Section Outline

### 1. Why This Matters

- Graphs are the most directly applicable topic in discrete math. Every dependency system (package managers, build tools, CI/CD pipelines), every network (the internet, social graphs, microservice architectures), every state machine (TCP, UI reducers, game logic) is a graph.
- Graph algorithms are among the most-asked topics in technical interviews. BFS, DFS, shortest paths, topological sort -- all built on the fundamentals from this post.
- This is the first of six parts on graphs and trees. The Graph class built here will be extended across Parts 31-35.

### 2. Graph Models (10.1)

- **Definition:** A graph G = (V, E) consists of a set V of vertices (nodes) and a set E of edges (connections between vertices).
- **Undirected graph:** Edges are unordered pairs {u, v}. The connection is symmetric: if u connects to v, then v connects to u. Example: Facebook friendships.
- **Directed graph (digraph):** Edges are ordered pairs (u, v). The connection has direction: u -> v does not imply v -> u. Example: Twitter follows, dependency graphs.
- **Simple graph:** At most one edge between any pair of vertices, no self-loops.
- **Multigraph:** Multiple edges allowed between the same pair of vertices. Example: multiple flight routes between two cities.
- **Pseudograph:** Self-loops allowed (an edge from a vertex to itself). Example: a state machine where a state can transition to itself.
- **Weighted graph:** Each edge has an associated weight (cost, distance, capacity). Example: road networks with distances, network links with bandwidth.
- **Developer gallery:** Show the same real-world system as each graph type. npm dependency = directed simple graph. Database ER diagram = undirected simple graph. Network topology with redundant links = multigraph.

### 3. Graph Terminology (10.2)

- **Adjacency:** Vertices u and v are adjacent if there is an edge between them. Also called "neighbors."
- **Degree:** The degree of a vertex is the number of edges incident to it. For directed graphs: in-degree (edges coming in) and out-degree (edges going out).
- **Isolated vertex:** Degree 0. No connections.
- **Pendant vertex:** Degree 1. Connected to exactly one other vertex.
- **Path:** A sequence of vertices where each consecutive pair is connected by an edge.
- **Cycle:** A path that starts and ends at the same vertex.
- **DAG (Directed Acyclic Graph):** A directed graph with no cycles. The foundation of topological sorting, build systems, and CI/CD pipelines.

### 4. The Handshaking Lemma (Proof Portfolio +1)

- **Statement:** In any undirected graph, the sum of all vertex degrees equals twice the number of edges. sum(deg(v)) = 2|E|.
- **Proof:** Each edge {u, v} contributes 1 to deg(u) and 1 to deg(v). Therefore each edge contributes exactly 2 to the total degree sum. Summing over all edges gives 2|E|.
- **Corollary:** The number of vertices with odd degree is always even.
- **Developer insight:** If you are building a graph and the sum of degrees is odd, you have a bug. The handshaking lemma is a quick sanity check on graph data structures.
- **Directed version:** In a directed graph, sum of in-degrees equals sum of out-degrees equals |E|.

### 5. Special Graph Families

- **Complete graph K_n:** Every vertex connected to every other. K_5 has 10 edges (C(5,2)). Models "everyone knows everyone" networks.
- **Bipartite graph:** Vertices split into two groups, edges only between groups. Models assignment problems (workers to tasks, students to courses).
- **Complete bipartite graph K_{m,n}:** Every vertex in group 1 connected to every vertex in group 2. m*n edges.
- **Cycle graph C_n:** n vertices forming a single cycle. Models circular dependencies, ring topologies.
- **Wheel graph W_n:** A cycle with one additional central vertex connected to all cycle vertices.
- **n-cube Q_n:** Vertices are n-bit strings, edges connect strings differing in exactly one bit. Q_3 is a cube. Models Hamming distance, Gray codes, hypercube networks.
- **Table:** Summary of special graphs with vertex count, edge count, and real-world analogy for each.

### 6. Subgraphs and Graph Unions

- **Subgraph:** G' = (V', E') where V' is a subset of V and E' is a subset of E restricted to V'. "A piece of the graph."
- **Induced subgraph:** Given a subset of vertices, include all edges between them. "Take these vertices and keep all their connections."
- **Graph union:** Combine two graphs by taking the union of their vertex and edge sets.
- **Developer connection:** Filtering a microservice dependency graph to show only the services relevant to a particular request path is extracting an induced subgraph.

### 7. Bipartite Graphs and Matching

- **Bipartite test:** A graph is bipartite if and only if it contains no odd-length cycles. This can be checked with BFS (preview of Part 32).
- **Matching:** A set of edges with no shared vertices. Maximum matching: the largest possible matching.
- **Application:** Assigning tasks to workers where each worker can handle certain tasks. This is a bipartite matching problem. Hall's theorem gives the condition for a perfect matching.
- Brief preview only -- matching algorithms are beyond the scope of this part.

### Code Companion: graph.py

- **Graph class:** Supports both directed and undirected graphs. Methods: `add_vertex()`, `add_edge()`, `neighbors()`, `degree()`, `in_degree()`, `out_degree()`, `is_adjacent()`, `vertices()`, `edges()`.
- **Multiple representations:** Internally stores adjacency list. Methods to export as adjacency matrix and edge list (preview of Part 31).
- **Handshaking verification:** Method that computes sum of degrees and verifies it equals 2*|E|.
- **Special graph generators:** `complete_graph(n)`, `bipartite_graph(m, n)`, `cycle_graph(n)`, `path_graph(n)`.
- This class is designed to be extended across Parts 31-35 with traversal, shortest path, and spanning tree methods.

### The Formality Spectrum

| | |
|---|---|
| :x: **Too Informal** | "A graph is just nodes and lines" -- misses the distinction between directed/undirected, simple/multi, weighted/unweighted, which determines which algorithms work |
| :white_check_mark: **Right** | A graph G = (V, E) is a set of vertices and edges. Directed edges are ordered pairs; undirected edges are unordered pairs. Degree counts incident edges. The handshaking lemma (sum of degrees = 2\|E\|) is a fundamental constraint. Special families (complete, bipartite, cycles) capture common patterns. |
| :x: **Too Formal** | Category-theoretic definition of graphs as functors. Spectral graph theory (eigenvalues of adjacency matrices). Algebraic graph theory. |
| :warning: **Common Mistake** | Confusing directed and undirected when modeling real-world systems. "A depends on B" is directed (A -> B). "A is friends with B" is undirected ({A, B}). Getting this wrong leads to incorrect algorithms. |

## Thread Progression

- **Proof Portfolio:** +1 new proof (handshaking lemma: sum of degrees = 2|E|). Running total: 29 proofs.
- **Code Companion:** `graph.py` -- Graph class with adjacency list, degree computation, special graph generators. Designed for extension across Parts 31-35.
- **Rosen Exercises:**
  - **Essential:** 10.1: 1, 3, 5, 7, 11, 15; 10.2: 1, 3, 5, 7, 11
  - **Recommended:** 10.2: 15, 23, 25
  - **Challenge:** 10.2: 31

## Further Resources

- **MIT 6.042J Lectures 5-6** -- Graph definitions, properties, and the handshaking lemma.
- **VisuAlgo: Graph Visualization** -- Interactive tool for building and exploring graphs. Useful for developing intuition about graph properties.
- **CLRS Chapter 22 (Introduction)** -- Graph representations and basic properties. The standard algorithms textbook treatment.

## Key Takeaways

1. A graph G = (V, E) models any system of pairwise relationships. Directed vs undirected, weighted vs unweighted -- these choices determine which algorithms apply and which problems are tractable.
2. The handshaking lemma (sum of degrees = 2|E|) is a fundamental constraint on all undirected graphs. If your degree sum is odd, your data is wrong.
3. Special graph families (complete, bipartite, cycles, hypercubes) capture common structural patterns. Recognizing them in real-world systems tells you which algorithms and theorems apply.

## Writer Notes

- This is the entry point for the longest phase in the series (6 parts). Open with a gallery of graphs developers already use: npm dependency trees, ER diagrams, TCP state machines, microservice architectures, the internet. The pitch: "you've been working with graphs your entire career."
- The Graph class built here is intentionally extensible. Design the interface so that Parts 31-35 add methods to the same class. Readers build one growing codebase, not six disconnected scripts.
- The handshaking lemma proof is short and satisfying -- a good warm-up proof for this phase. Use it to demonstrate that graph properties can be proved, not just observed.
- Keep the bipartite matching section brief. Mention Hall's theorem by name but do not prove it. The point is awareness, not mastery -- matching algorithms are a full topic on their own.
- Forward-reference Part 31 (representations): "You have a Graph class with an adjacency list. Part 31 explores when adjacency matrices are better, how to convert between representations, and when the choice affects performance by orders of magnitude."
