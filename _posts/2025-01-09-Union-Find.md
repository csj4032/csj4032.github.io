---
title: "Union-Find"
description: "Union-Find 자료구조는 Disjoint Set(서로소 집합) 자료구조라고도 불리며, 여러 개의 집합을 효율적으로 관리하기 위해 설계된 자료구조이다. 주로 그래프 알고리즘에서 최소 신장 트리(MST)를 찾는 K"
categories:
 - algorithm
 - data-structure
source: "https://blog.naver.com/csj4032/223720136927"
---

Union-Find 자료구조는 **Disjoint Set**(서로소 집합) 자료구조라고도 불리며, 여러 개의 집합을 효율적으로 관리하기 위해 설계된 자료구조이다. 주로 그래프 알고리즘에서 최소 신장 트리(MST)를 찾는 Kruskal 알고리즘이나 네트워크 연결성을 판별하는 문제에 사용된다.

Union-Find는 두 가지 주요 연산으로 이루어진다:

1. **Find(x):**
  * 원소 x
  * x가 속한 집합의 대표자를 찾는 연산.
  * 대표자는 집합을 구별하는 기준이 됨.
  * 이 연산은 경로 압축(Path Compression) 기법을 사용하여 효율성을 높임.
2. **Union(x, y):**
  * 두 원소 x
  * x와 y
  * y가 속한 집합을 하나로 합침
  * 이를 통해 두 집합을 하나의 집합으로 병합할 수 있음
  * 이 연산은 랭크(Rank) 또는 크기(Size) 기반 최적화를 사용하여 트리의 높이를 줄임

## 최적화 기법

1. **경로 압축(Path Compression):**
  * Find 연산 중, 탐색한 모든 노드가 직접 대표자를 가리키도록 업데이트
  * 이를 통해 트리의 깊이를 줄여 후속 연산의 효율성을 높임
2. **랭크 기반 병합(Union by Rank):**
  * Union 연산 중, 두 트리의 높이(Rank)를 비교하여 높이가 낮은 트리를 높이가 높은 트리의 자식으로 병합
  * 이는 트리의 깊이가 불필요하게 증가하는 것을 방지

## 사용 사례

1. **그래프 알고리즘:**
  * 최소 신장 트리(MST) 알고리즘(Kruskal).
  * 사이클 검출.
2. **네트워크 연결성 문제:**
  * 특정 네트워크에서 두 노드가 같은 네트워크에 속하는지 확인.
3. **클러스터링:**
  * 데이터를 서로소 집합으로 그룹화.
4. **동적 연결성 문제:**
  * 집합 간의 연결성을 동적으로 변경 및 확인하는 문제.

```java
public class UnionFind {
    private int[] parent; // 부모 노드를 저장하는 배열
    private int[] rank;   // 트리의 랭크(높이)를 저장하는 배열

    // 생성자: 초기화
    public UnionFind(int size) {
        parent = new int[size];
        rank = new int[size];
        
        // 초기 상태에서 각 노드는 자기 자신을 부모로 가짐
        for (int i = 0; i < size; i++) {
            parent[i] = i;
            rank[i] = 0; // 초기 랭크는 모두 0
        }
    }

    // Find 연산: 경로 압축 최적화를 포함
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // 부모를 루트로 설정 (경로 압축)
        }
        return parent[x];
    }

    // Union 연산: 랭크 기반 병합 최적화를 포함
    public void union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);

        // 이미 같은 집합이라면 병합할 필요가 없음
        if (rootX == rootY) {
            return;
        }

        // 랭크 기반 병합
        if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++; // 동일한 랭크라면 하나의 랭크 증가
        }
    }

    // 두 노드가 같은 집합에 속하는지 확인
    public boolean isConnected(int x, int y) {
        return find(x) == find(y);
    }
}
```
