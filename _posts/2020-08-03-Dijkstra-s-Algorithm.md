---
title: "Dijkstra’s Algorithm"
description: "다익스트라 알고리즘은 그래프에서 특정 노드에서 다른 모든 노드까지의 최단 경로를 찾는 알고리즘입니다. 이 알고리즘은 도로 네트워크와 같은 여러 응용 분야에서 사용될 수 있습니다. 다익스트라 알고리즘의 주요 원리는 매"
categories:
 - algorithm
 - graph
source: "https://blog.naver.com/csj4032/222049783165"
---

다익스트라 알고리즘은 그래프에서 특정 노드에서 다른 모든 노드까지의 최단 경로를 찾는 알고리즘입니다. 이 알고리즘은 도로 네트워크와 같은 여러 응용 분야에서 사용될 수 있습니다. 다익스트라 알고리즘의 주요 원리는 매 반복마다 현재까지 알려진 최단 경로의 노드를 선택하고, 그 노드와 연결된 이웃 노드들의 거리를 업데이트하는 것입니다. 다음은 다익스트라 알고리즘을 자세히 설명하는 예시입니다.

## 예제 그래프

6개의 노드 (A, B, C, D, E, F)와 다음과 같은 가중치가 있는 그래프를 고려해봅시다:

  * **A에서 B까지: 4**
  * **A에서 C까지: 2**
  * **B에서 C까지: 5**
  * **B에서 D까지: 10**
  * **C에서 E까지: 3**
  * **E에서 D까지: 4**
  * **D에서 F까지: 11**
  * **E에서 F까지: 5**

![](/assets/images/posts/2020-08-03-Dijkstra-s-Algorithm/01.png)

## 단계별 설명

  1. **초기화**
    * 시작 노드(A)의 거리는 0으로 설정하고, 다른 모든 노드의 거리는 무한대로 설정합니다.
    * 초기 거리: {A: 0, B: ∞, C: ∞, D: ∞, E: ∞, F: ∞}
    * 방문하지 않은 노드 집합: {A, B, C, D, E, F}
  2. **현재 노드 선택**
    * 방문하지 않은 노드 중에서 거리가 가장 작은 노드를 선택합니다. 처음에는 A입니다.
  3. **이웃 노드 거리 업데이트**
    * 선택된 노드(A)의 이웃 노드(B, C)의 거리를 업데이트합니다.
    * A에서 B까지의 거리: 0 + 4 = 4
    * A에서 C까지의 거리: 0 + 2 = 2
    * 업데이트된 거리: {A: 0, B: 4, C: 2, D: ∞, E: ∞, F: ∞}
    * 방문하지 않은 노드 집합: {B, C, D, E, F}
  4. **다음 노드 선택**
    * 방문하지 않은 노드 중에서 거리가 가장 작은 노드인 C를 선택합니다**.**
  5. **이웃 노드 거리 업데이트**
    * C의 이웃 노드(B, E)의 거리를 업데이트합니다.
    * C에서 B까지의 새로운 거리: 2 + 5 = 7 (현재 B의 거리가 4이므로, 업데이트하지 않음)
    * C에서 E까지의 거리: 2 + 3 = 5
    * 업데이트된 거리: {A: 0, B: 4, C: 2, D: ∞, E: 5, F: ∞}
    * 방문하지 않은 노드 집합: {B, D, E, F}
  6. **다음 노드 선택**
    * 방문하지 않은 노드 중에서 거리가 가장 작은 노드인 B를 선택합니다.
  7. **이웃 노드 거리 업데이트**
    * B의 이웃 노드(D)의 거리를 업데이트합니다.
    * B에서 D까지의 거리: 4 + 10 = 14
    * 업데이트된 거리: {A: 0, B: 4, C: 2, D: 14, E: 5, F: ∞}
    * 방문하지 않은 노드 집합: {D, E, F}
  8. **다음 노드 선택**
    * 방문하지 않은 노드 중에서 거리가 가장 작은 노드인 E를 선택합니다.
  9. **이웃 노드 거리 업데이트**
    * E의 이웃 노드(D, F)의 거리를 업데이트합니다.
    * E에서 D까지의 거리: 5 + 4 = 9
    * E에서 F까지의 거리: 5 + 5 = 10
    * 업데이트된 거리: {A: 0, B: 4, C: 2, D: 9, E: 5, F: 10}
    * 방문하지 않은 노드 집합: {D, F}
  10. **다음 노드 선택**
    * 방문하지 않은 노드 중에서 거리가 가장 작은 노드인 D를 선택합니다.
  11. **이웃 노드 거리 업데이트**
    * D의 이웃 노드(F)의 거리를 업데이트합니다.
    * D에서 F까지의 새로운 거리: 9 + 11 = 20 (현재 F의 거리가 10이므로, 업데이트하지 않음)
    * 업데이트된 거리: {A: 0, B: 4, C: 2, D: 9, E: 5, F: 10}
    * 방문하지 않은 노드 집합: {F}
  12. **마지막 노드 선택**
    * 남은 노드 F를 선택합니다.
    * 모든 노드를 방문했으므로 알고리즘을 종료합니다.

## 최종 결과

A에서 각 노드까지의 최단 거리는 다음과 같습니다:

  * A에서 A: 0
  * A에서 B: 4
  * A에서 C: 2
  * A에서 D: 9
  * A에서 E: 5
  * A에서 F: 10

```java
import java.util.*;

class Node implements Comparator<Node> {
    public int node;
    public int cost;

    public Node() {}

    public Node(int node, int cost) {
        this.node = node;
        this.cost = cost;
    }

    @Override
    public int compare(Node node1, Node node2) {
        if (node1.cost < node2.cost)
            return -1;
        if (node1.cost > node2.cost)
            return 1;
        return 0;
    }
}

public class Dijkstra {

    private int distances[];
    private Set<Integer> settled;
    private PriorityQueue<Node> pq;
    private int numOfNodes;
    List<List<Node>> adj;

    public Dijkstra(int numOfNodes) {
        this.numOfNodes = numOfNodes;
        distances = new int[numOfNodes];
        settled = new HashSet<Integer>();
        pq = new PriorityQueue<Node>(numOfNodes, new Node());
    }

    public void dijkstra(List<List<Node>> adj, int src) {
        this.adj = adj;

        for (int i = 0; i < numOfNodes; i++)
            distances[i] = Integer.MAX_VALUE;

        pq.add(new Node(src, 0));
        distances[src] = 0;

        while (settled.size() != numOfNodes) {

            int u = pq.remove().node;

            if (settled.contains(u))
                continue;

            settled.add(u);

            e_Neighbours(u);
        }
    }

    private void e_Neighbours(int u) {
        int edgeDistance = -1;
        int newDistance = -1;

        for (int i = 0; i < adj.get(u).size(); i++) {
            Node v = adj.get(u).get(i);

            if (!settled.contains(v.node)) {
                edgeDistance = v.cost;
                newDistance = distances[u] + edgeDistance;

                if (newDistance < distances[v.node])
                    distances[v.node] = newDistance;

                pq.add(new Node(v.node, distances[v.node]));
            }
        }
    }

    public static void main(String arg[]) {
        int numOfNodes = 5;
        int src = 0;

        List<List<Node>> adj = new ArrayList<List<Node>>();

        for (int i = 0; i < numOfNodes; i++) {
            List<Node> item = new ArrayList<Node>();
            adj.add(item);
        }

        adj.get(0).add(new Node(1, 9));
        adj.get(0).add(new Node(2, 6));
        adj.get(0).add(new Node(3, 5));
        adj.get(0).add(new Node(4, 3));

        adj.get(2).add(new Node(1, 2));
        adj.get(2).add(new Node(3, 4));

        Dijkstra dpq = new Dijkstra(numOfNodes);
        dpq.dijkstra(adj, src);

        System.out.println("The shortest path from node :");

        for (int i = 0; i < dpq.distances.length; i++)
            System.out.println(src + " to " + i + " is " + dpq.distances[i]);
    }
}
```

## 참고

1.[https://blog.naver.com/kdr06006/221780930566](https://blog.naver.com/kdr06006/221780930566)

2. [https://blog.naver.com/waterkarma/222009333490](https://blog.naver.com/waterkarma/222009333490)
