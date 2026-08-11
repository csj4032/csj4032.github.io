---
title: "병합 정렬 (Merge Sort)"
description: "병합 정렬(Merge Sort)은 \"분할 정복(Divide and Conquer)\" 알고리즘의 대표적인 예로, 리스트를 점점 더 작은 부분으로 나누어 각각을 정렬한 후, 다시 합쳐서 전체를 정렬하는 방식입니다. 병합"
categories:
 - algorithm
 - sort
source: "https://blog.naver.com/csj4032/223519415206"
---

병합 정렬(Merge Sort)은 "분할 정복(Divide and Conquer)" 알고리즘의 대표적인 예로, 리스트를 점점 더 작은 부분으로 나누어 각각을 정렬한 후, 다시 합쳐서 전체를 정렬하는 방식입니다. 병합 정렬의 기본 아이디어는 다음과 같습니다

  1. **분할(Divide)**: 리스트를 절반으로 나누어 두 개의 하위 리스트로 만든다.
  2. **정복(Conquer)**: 각 하위 리스트를 재귀적으로 병합 정렬을 이용해 정렬한다.
  3. **결합(Combine)**: 두 개의 정렬된 하위 리스트를 하나의 정렬된 리스트로 합친다.

이 과정을 반복하여 리스트를 완전히 정렬된 상태로 만듭니다. 병합 정렬의 시간 복잡도는 O(n log n)으로, 비교적 큰 데이터 세트에서도 효율적입니다.

```java
public class MergeSort {
    // 병합 정렬 함수
    public static void mergeSort(int[] array, int left, int right) {
        if (left < right) {
            // 중간 지점을 계산
            int mid = (left + right) / 2;

            // 중간 지점을 기준으로 리스트를 두 개의 하위 리스트로 나누고 재귀적으로 정렬
            mergeSort(array, left, mid);
            mergeSort(array, mid + 1, right);

            // 정렬된 두 하위 리스트를 병합
            merge(array, left, mid, right);
        }
    }

    // 병합 함수
    public static void merge(int[] array, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        // 두 개의 하위 리스트를 임시 배열에 저장
        int[] leftArray = new int[n1];
        int[] rightArray = new int[n2];

        for (int i = 0; i < n1; ++i)
            leftArray[i] = array[left + i];
        for (int j = 0; j < n2; ++j)
            rightArray[j] = array[mid + 1 + j];

        // 병합 과정
        int i = 0, j = 0;
        int k = left;
        while (i < n1 && j < n2) {
            if (leftArray[i] <= rightArray[j]) {
                array[k] = leftArray[i];
                i++;
            } else {
                array[k] = rightArray[j];
                j++;
            }
            k++;
        }

        // 남은 요소들 처리
        while (i < n1) {
            array[k] = leftArray[i];
            i++;
            k++;
        }

        while (j < n2) {
            array[k] = rightArray[j];
            j++;
            k++;
        }
    }

    // 테스트 함수
    public static void main(String[] args) {
        int[] array = {12, 11, 13, 5, 6, 7};
        System.out.println("정렬 전 배열:");
        for (int num : array) {
            System.out.print(num + " ");
        }

        mergeSort(array, 0, array.length - 1);

        System.out.println("\n정렬 후 배열:");
        for (int num : array) {
            System.out.print(num + " ");
        }
    }
}
```
