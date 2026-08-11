---
title: "Binary Search (이진 탐색)"
description: "이진 탐색(Binary Search)은 정렬된 배열 또는 리스트에서 특정 값을 효율적으로 찾기 위한 알고리즘입니다. 값을 탐색할 때, 중간값(middle)을 기준으로 탐색 범위를 절반으로 줄여나가는 방식으로 동작합니"
categories:
 - algorithm
 - search
source: "https://blog.naver.com/csj4032/223701432913"
---

이진 탐색(Binary Search)은 **정렬된 배열 또는 리스트**에서 특정 값을 효율적으로 찾기 위한 알고리즘입니다. 값을 탐색할 때, 중간값(middle)을 기준으로 탐색 범위를 절반으로 줄여나가는 방식으로 동작합니다.

* **시간 복잡도**: O(logn)
* **공간 복잡도**: O(1) (반복적 구현) 또는 O(logn) (재귀적 구현)

## Binary Search의 동작 원리

1. 초기화:
  1. 탐색 범위의 왼쪽 인덱스
  2. 탐색 범위의 오른쪽 인덱스
2. 중간값 계산:
  1. 중간 인덱스 mid 계산 : mid = left + (right-left) / 2
3. 비교
  1. 배열의 중간값 array[mid] 와 target 을 비교:
    1. array[mid]==target: 목표값을 찾았으므로 중간 인덱스를 반환.
    2. array[mid]<target: 목표값이 오른쪽 절반에 있으므로 left=mid+1.
    3. array[mid]>target: 목표값이 왼쪽 절반에 있으므로 right=mid−1.
4. 반복
  1. 위 과정을 left≤right인 동안 반복
5. 종료
  1. 탐색 범위를 모두 확인한 후에도 값을 찾지 못하면 −1 반환.
* 반복적 구현

```java
public class BinarySearch {
    public static int binarySearch(int[] array, int target) {
        int left = 0;
        int right = array.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (array[mid] == target) {
                return mid;
            } else if (array[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return -1; // 값이 존재하지 않을 경우
    }
}
```

* 재귀적 구현

```java
public class BinarySearchRecursive {
    public static int binarySearch(int[] array, int target, int left, int right) {
        if (left > right) {
            return -1; // 값이 존재하지 않을 경우
        }

        int mid = left + (right - left) / 2;

        if (array[mid] == target) {
            return mid;
        } else if (array[mid] < target) {
            return binarySearch(array, target, mid + 1, right);
        } else {
            return binarySearch(array, target, left, mid - 1);
        }
    }
}
```
