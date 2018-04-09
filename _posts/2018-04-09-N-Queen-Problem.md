---
title: N-Queen Problem
description: N-Queens Problem
categories:
 - algorithm
tags:
 - Backtracking
---

# N-Queen Problem

```java

public class NQueenProblem {

	static int size;
	static int count;
	static int[] cols;

	public static void main(String[] args) {
		solve(new Scanner(System.in).nextInt());
	}

	private static void solve(int input) {
		size = input;
		cols = new int[size + 1];
		recursive(0);
		System.out.print(count);
	}

	private static boolean recursive(int row) {
		if (!promising(row)) {
			return false;
		} else if (row == size) {
			count++;
			return true;
		}

		for (int i = 1; i <= size; i++) {
			cols[row + 1] = i;
			if (recursive(row + 1)) return false;
		}
		return false;
	}

	private static boolean promising(int row) {
		for (int i = 1; i < row; i++) {
			if (cols[i] == cols[row]) return false;
			if ((row - i) == Math.abs(cols[row] - cols[i])) return false;
		}
		return true;
	}
}

```
