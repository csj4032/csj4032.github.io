---
title: Depth First Search
description: Depth First Search
categories:
 - algorithm
tags:
 - Stack
 - Recursive
 - Graph
comments: true
---

# Depth First Search

```java

public class DepthFirstSearch {
	private int n;
	private boolean graph[][];
	private boolean visits[];
	private StringBuilder visited;

	public DepthFirstSearch(int n) {
		this.n = n;
		this.graph = new boolean[n][n];
		this.visits = new boolean[n];
		this.visited = new StringBuilder("dfs = ");
	}

	private void dfs(int v) {
		visits[v] = true;
		visited.append(v + " ");
		for (int i = 0; i < n; i++) {
			if (graph[v][i] == true && visits[i] == false) {
				dfs(i);
			}
		}
	}

	public void dfs() {
		dfs(0);
		System.out.println(visited.toString());
	}

	public static void main(String[] args) {
		DepthFirstSearch dfs = new DepthFirstSearch(6);
		dfs.graph[0][1] = dfs.graph[1][0] = true;
		dfs.graph[1][2] = dfs.graph[2][1] = true;
		dfs.graph[1][3] = dfs.graph[3][1] = true;
		dfs.graph[1][4] = dfs.graph[4][1] = true;
		dfs.graph[2][4] = dfs.graph[4][2] = true;
		dfs.graph[3][4] = dfs.graph[3][4] = true;
		dfs.graph[4][5] = dfs.graph[5][4] = true;
		dfs.dfs();
	}
}

```