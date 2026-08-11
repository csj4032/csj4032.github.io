---
title: "선택 정렬 ( Selection Sort)"
description: "선택 정렬(Selection Sort)은 간단하고 직관적인 정렬 알고리즘 중 하나로, 다음과 같은 과정을 반복합니다."
categories:
 - algorithm
 - sort
source: "https://blog.naver.com/csj4032/221971254643"
---

선택 정렬(Selection Sort)은 간단하고 직관적인 정렬 알고리즘 중 하나로, 다음과 같은 과정을 반복합니다.

  * 주어진 리스트에서 최솟값을 찾는다.
  * 그 최솟값을 리스트의 맨 앞에 있는 값과 교환한다.
  * 맨 앞의 값을 제외하고 나머지 리스트에 대해 위의 과정을 반복한다.

이 과정을 통해 리스트 전체가 정렬될 때까지 반복합니다. 선택 정렬의 시간 복잡도는 O(n^2)입니다. 이는 비교적 비효율적인 알고리즘으로, 특히 큰 데이터 세트에서는 비효율적입니다. 그러나 이해하기 쉽고 구현이 간단합니다.

```java
public class SelectionSort {
    public static void selectionSort(int[] array) {
        int n = array.length;

        for (int i = 0; i < n - 1; i++) {
            // 배열의 최솟값을 찾기 위해 최소값 인덱스를 초기화
            int minIndex = i;

            // 현재 범위에서 최소값을 찾음
            for (int j = i + 1; j < n; j++) {
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                }
            }

            // 찾은 최소값을 맨 앞의 값과 교환
            int temp = array[minIndex];
            array[minIndex] = array[i];
            array[i] = temp;
        }
    }

    public static void main(String[] args) {
        int[] array = {64, 25, 12, 22, 11};
        System.out.println("정렬 전 배열:");
        for (int num : array) {
            System.out.print(num + " ");
        }

        selectionSort(array);

        System.out.println("\n정렬 후 배열:");
        for (int num : array) {
            System.out.print(num + " ");
        }
    }
}
```

[csj4032/enjoy-algorithm](https://github.com/csj4032/enjoy-algorithm/blob/master/basic/src/main/java/sort/SelectSort.java)
