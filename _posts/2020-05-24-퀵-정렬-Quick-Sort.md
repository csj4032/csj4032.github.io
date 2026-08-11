---
title: "퀵 정렬 (Quick Sort)"
description: "퀵 정렬(Quick Sort)은 분할 정복(divide and conquer) 알고리즘을 사용하는 매우 효율적인 정렬 알고리즘 중 하나입니다. 평균적으로 O(n log n)의 시간 복잡도를 가지며, 최악의 경우 O("
categories:
 - algorithm
 - sort
source: "https://blog.naver.com/csj4032/221976395494"
---

퀵 정렬(Quick Sort)은 분할 정복(divide and conquer) 알고리즘을 사용하는 매우 효율적인 정렬 알고리즘 중 하나입니다. 평균적으로 O(n log n)의 시간 복잡도를 가지며, 최악의 경우 O(n^2)의 시간 복잡도를 가질 수 있습니다. 퀵 정렬은 재귀적으로 리스트를 분할하여 정렬합니다.

## 퀵 정렬의 동작 원리

  1. **기준점(Pivot) 선택**:
    * 배열에서 기준점(pivot)을 선택합니다. 기준점을 선택하는 방법에는 여러 가지가 있지만, 일반적으로 첫 번째 원소, 마지막 원소, 중간값, 또는 랜덤하게 선택할 수 있습니다.
  2. **분할(Divide)**:
    * 기준점(pivot)을 기준으로 배열을 두 개의 부분 배열로 분할합니다.
    * 기준점보다 작은 원소들은 기준점의 왼쪽 부분 배열에, 기준점보다 큰 원소들은 기준점의 오른쪽 부분 배열에 위치시킵니다.
  3. **재귀적 정렬(Conquer)**:
    * 분할된 두 부분 배열에 대해 재귀적으로 퀵 정렬을 적용합니다.
  4. **합병(Combine)**:
    * 부분 배열들이 정렬되면, 전체 배열도 정렬됩니다.

## 퀵 정렬의 예

배열 [3, 6, 8, 10, 1, 2, 1]를 퀵 정렬하는 과정을 예시로 들어보겠습니다.

  1. **초기 배열**: [3, 6, 8, 10, 1, 2, 1]
    * 기준점(pivot)을 3으로 선택합니다.
    * 기준점을 기준으로 배열을 분할합니다:
    * 왼쪽: [1, 2, 1]
    * 기준점: 3
    * 오른쪽: [6, 8, 10]
  2. **재귀적 정렬**:
    * 왼쪽 배열 [1, 2, 1]에 대해 퀵 정렬을 적용합니다.
    * 오른쪽 배열 [6, 8, 10]에 대해 퀵 정렬을 적용합니다.
  3. **왼쪽 배열 [1, 2, 1] 정렬**:
    * 기준점을 1로 선택합니다.
    * 왼쪽: []
    * 기준점: 1
    * 오른쪽: [2, 1]
    * [2, 1]을 정렬:
    * 기준점을 2로 선택:
    * 왼쪽: [1]
    * 기준점: 2
    * 오른쪽: []
    * 정렬된 왼쪽 배열: [1, 1, 2]
  4. **오른쪽 배열 [6, 8, 10] 정렬**:
    * 이미 정렬된 상태입니다.
  5. **결합**:
    * 전체 정렬된 배열: [1, 1, 2, 3, 6, 8, 10]

## 퀵 정렬의 시간 복잡도

  * **최선의 경우**: O(n log n)
  * **평균적인 경우**: O(n log n)
  * **최악의 경우**: O(n^2) (이미 정렬된 배열에 대해 퀵 정렬을 적용할 때 발생할 수 있음)

## 퀵 정렬의 장단점

  * **장점**:
    * 평균적인 경우 매우 빠릅니다.
    * 추가 메모리 공간이 거의 필요하지 않습니다(제자리 정렬).
    * 구현이 비교적 간단합니다.
  * **단점**:
    * 최악의 경우 시간 복잡도가 O(n^2)입니다.
    * 안정 정렬이 아닙니다(같은 값의 원소들이 원래의 순서를 유지하지 않습니다).

```java
public class QuickSort {

    // 배열을 퀵 정렬하는 메서드
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            // 분할 인덱스를 받습니다.
            int pi = partition(arr, low, high);

            // 분할 인덱스를 기준으로 배열을 두 부분으로 나누어 정렬합니다.
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    // 배열을 분할하고 분할 인덱스를 반환하는 메서드
    public static int partition(int[] arr, int low, int high) {
        int pivot = arr[high]; // 기준점을 배열의 마지막 원소로 선택합니다.
        int i = (low - 1); // 작은 원소의 인덱스를 나타냅니다.

        for (int j = low; j < high; j++) {
            // 현재 원소가 기준점보다 작은 경우
            if (arr[j] < pivot) {
                i++;

                // arr[i]와 arr[j]를 교환합니다.
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }

        // arr[i+1]과 기준점(arr[high])을 교환합니다.
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;

        return i + 1;
    }

    // 배열을 출력하는 메서드
    public static void printArray(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i] + " ");
        }
        System.out.println();
    }

    // 메인 메서드
    public static void main(String[] args) {
        int[] arr = { 10, 7, 8, 9, 1, 5 };

        System.out.println("정렬 전 배열:");
        printArray(arr);

        // 퀵 정렬 수행
        quickSort(arr, 0, arr.length - 1);

        System.out.println("정렬 후 배열:");
        printArray(arr);
    }
}
```

[csj4032/enjoy-algorithm](https://github.com/csj4032/enjoy-algorithm/blob/master/basic/src/main/java/sort/QuickSort.java)
