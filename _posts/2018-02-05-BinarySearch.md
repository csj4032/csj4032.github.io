---
title: Binary Search
description: Binary Search Algorithm
categories:
 - algorithm
tags:
 - search
---

# Binary Search

## 재귀적인 방법

```java

public class BinarySearch {

	public int binarySearch(int[] sortedArray, int key, int low, int high) {
		int middle = (low + high) / 2;

		if (high < low) {
			return -1;
		}

		if (key == sortedArray[middle]) {
			return middle;
		} else if (key < sortedArray[middle]) {
			return binarySearch(sortedArray, key, low, middle - 1);
		} else {
			return binarySearch(sortedArray, key, middle + 1, high);
		}
	}
}

```