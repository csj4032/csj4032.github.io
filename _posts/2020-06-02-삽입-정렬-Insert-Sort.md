---
title: "삽입 정렬(Insert Sort)"
description: "삽입 정렬(Insertion Sort)은 비교 기반의 정렬 알고리즘 중 하나로, 원소를 하나씩 정렬된 배열 부분으로 삽입해 나가는 방식으로 동작합니다. 이는 마치 카드를 한 장씩 손에 들고 적절한 위치에 삽입하여 정"
categories:
 - algorithm
 - sort
source: "https://blog.naver.com/csj4032/221986877480"
---

삽입 정렬(Insertion Sort)은 비교 기반의 정렬 알고리즘 중 하나로, 원소를 하나씩 정렬된 배열 부분으로 삽입해 나가는 방식으로 동작합니다. 이는 마치 카드를 한 장씩 손에 들고 적절한 위치에 삽입하여 정렬하는 것과 유사합니다.

## 삽입 정렬의 동작 원리

  1. **초기 상태**: 배열의 첫 번째 원소는 이미 정렬된 상태로 간주합니다.
  2. **반복**:
    * 정렬되지 않은 배열에서 다음 원소를 선택합니다.
    * 선택한 원소를 이미 정렬된 부분 배열의 적절한 위치에 삽입합니다.
    * 이를 반복하여 배열 전체가 정렬될 때까지 진행합니다.

## 삽입 정렬의 단계별 설명

  1. **첫 번째 원소를 기준으로 정렬 시작**:
    * 첫 번째 원소는 이미 정렬된 상태로 간주합니다.
  2. **두 번째 원소부터 마지막 원소까지 반복**:
    * 현재 위치의 원소를 선택합니다.
    * 정렬된 부분 배열에서 선택한 원소의 적절한 위치를 찾습니다.
    * 적절한 위치를 찾으면, 그 위치에 원소를 삽입하고, 나머지 원소들을 오른쪽으로 이동시킵니다.

## 예제

배열 [5, 2, 9, 1, 5, 6] 를 삽입 정렬하는 과정을 단계별로 설명합니다.

  1. **초기 배열**: [5, 2, 9, 1, 5, 6]
  2. **첫 번째 단계**:
    * 첫 번째 원소는 이미 정렬된 상태로 간주합니다: [5] | 2, 9, 1, 5, 6
    * 두 번째 원소 2를 적절한 위치에 삽입합니다: [2, 5] | 9, 1, 5, 6
  3. **두 번째 단계**:
    * 세 번째 원소 9를 적절한 위치에 삽입합니다: [2, 5, 9] | 1, 5, 6
  4. **세 번째 단계**:
    * 네 번째 원소 1을 적절한 위치에 삽입합니다: [1, 2, 5, 9] | 5, 6
  5. **네 번째 단계**:
    * 다섯 번째 원소 5를 적절한 위치에 삽입합니다: [1, 2, 5, 5, 9] | 6
  6. **다섯 번째 단계**:
    * 여섯 번째 원소 6을 적절한 위치에 삽입합니다: [1, 2, 5, 5, 6, 9]

최종적으로 배열이 정렬됩니다.

## 삽입 정렬의 특징

  * **시간 복잡도**:
  * 최악의 경우: O(n^2)
  * 최선의 경우: O(n) (배열이 이미 정렬되어 있는 경우)
  * 평균 경우: O(n^2)
  * **공간 복잡도**: O(1) (추가적인 메모리를 거의 사용하지 않음)
  * **안정성**: 삽입 정렬은 안정 정렬입니다. 즉, 같은 값을 가지는 원소들의 상대적인 순서는 변하지 않습니다.
  * **적용 사례**:
  * 거의 정렬된 배열을 정렬할 때 효율적입니다.
  * 소규모 배열을 정렬할 때 사용됩니다.

```java
public class InsertionSort {

    // 삽입 정렬 메서드
    public static void insertionSort(int[] arr) {
        // 배열의 두 번째 원소부터 마지막 원소까지 반복
        for (int i = 1; i < arr.length; i++) {
            // 현재 원소를 key로 설정
            int key = arr[i];
            // 정렬된 부분의 마지막 인덱스
            int j = i - 1;
            // key보다 큰 원소를 오른쪽으로 한 칸씩 이동
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            // key를 정렬된 부분의 적절한 위치에 삽입
            arr[j + 1] = key;
        }
    }

    // 배열 출력 메서드
    public static void printArray(int[] arr) {
        for (int j : arr) System.out.print(j + " ");
        System.out.println();
    }

    // 메인 메서드
    public static void main(String[] args) {
        int[] arr = {5, 2, 9, 1, 5, 6};
        System.out.println("정렬 전 배열:");
        printArray(arr);
        // 삽입 정렬 수행
        insertionSort(arr);
        System.out.println("정렬 후 배열:");
        printArray(arr);
    }
}
```

[https://github.com/csj4032/enjoy-algorithm/blob/master/basic/src/main/java/sort/InsertionSort.java](https://github.com/csj4032/enjoy-algorithm/blob/master/basic/src/main/java/sort/InsertionSort.java)

[csj4032/enjoy-algorithm](https://github.com/csj4032/enjoy-algorithm/blob/master/basic/src/main/java/sort/InsertionSort.java)
