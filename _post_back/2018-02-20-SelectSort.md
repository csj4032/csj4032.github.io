---
title: Select Sort
description: Select Sort Algorithm
categories:
 - algorithm
tags:
 - sort
---

# Select Sort

```java

public class SelectSort {

    public void sort(int[] array) {
        int index, temp;
        for (int i = 0; i < array.length - 1; i++) {
            index = i;
            for (int j = i + 1; j < array.length; j++) {
                if (array[j] < array[index]) {
                    index = j;
                }
            }
            temp = array[index];
            array[index] = array[i];
            array[i] = temp;
        }
    }
}

```