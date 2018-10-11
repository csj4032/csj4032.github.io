---
title: Bubble Sort
description: Bubble Sort Algorithm
categories:
 - algorithm
tags:
 - sort
---

# Bubble Sort

* 버블 정렬은 이웃한 두 요소의 대소 관계를 비교하여 교환을 반복

```java

public class BubbleSort {

	public static void sort(int[] a) {
		int n = a.length;
		for (int i = 0; i < n - 1; i++) {
			for (int j = n - 1; j > i; j--) {
				if (a[j - 1] > a[j]) {
					int temp = a[j];
					a[j] = a[j - 1];
					a[j - 1] = temp;
				}
			}
		}
	}
}

```
