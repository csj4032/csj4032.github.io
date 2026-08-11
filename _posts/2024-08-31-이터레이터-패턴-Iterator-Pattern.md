---
title: "이터레이터 패턴(Iterator Pattern)"
description: "이터레이터 패턴(Iterator Pattern)은 컬렉션(예: 리스트, 집합, 트리) 내의 요소들에 순차적으로 접근할 수 있는 방법을 제공하는 행동(Behavioral) 디자인 패턴입니다. 이터레이터 패턴을 사용하면"
categories:
 - programming
 - design-pattern
source: "https://blog.naver.com/csj4032/223567339528"
---

이터레이터 패턴(Iterator Pattern)은 **컬렉션(예: 리스트, 집합, 트리) 내의 요소들에 순차적으로 접근할 수 있는 방법을 제공**하는 행동(Behavioral) 디자인 패턴입니다. 이터레이터 패턴을 사용하면 내부 구조를 노출하지 않고도 컬렉션의 각 요소에 접근할 수 있으며, 이 과정에서 컬렉션의 구현 방식을 클라이언트와 분리할 수 있습니다.

## "순서의 실로 엮인 지식의 구슬들, 하나씩 만지며 전체를 이해하다."

이터레이터 패턴(Iterator Pattern)은 다음과 같은 상황에서 유용하게 사용될 수 있습니다:

  1. **컬렉션의 내부 구조를 숨기고 싶은 경우**:
    * 이터레이터 패턴을 사용하면 클라이언트가 컬렉션의 내부 구조를 알 필요 없이, 컬렉션 내의 요소들을 탐색할 수 있다. 이를 통해 클라이언트와 컬렉션 간의 결합도를 낮출 수 있으며, 컬렉션의 내부 구조가 변경되더라도 클라이언트 코드에 영향을 미치지 않는다. 다양한 자료구조(List, Set, Tree 등)를 가진 객체에서, 자료구조의 세부 구현을 드러내지 않고 동일한 방식으로 요소들을 탐색해야 할 때 유용하다.
  2. **여러 유형의 컬렉션을 동일한 방식으로 순회하고 싶은 경우**:
    * 이터레이터 패턴은 다양한 종류의 컬렉션에 대해 일관된 탐색 인터페이스를 제공한다. 이로 인해 클라이언트는 컬렉션의 타입에 상관없이 동일한 방식으로 요소들을 탐색할 수 있다. 리스트, 집합, 해시맵 등 서로 다른 데이터 구조를 동일한 인터페이스로 탐색하고자 할 때 유용하다.
  3. **컬렉션을 다양한 방법으로 탐색하고 싶은 경우**:
    * 이터레이터 패턴은 컬렉션을 탐색하는 방법을 유연하게 변경할 수 있다. 기본적인 순차 탐색뿐만 아니라, 역순 탐색, 조건부 탐색 등 다양한 탐색 방법을 구현할 수 있다. 트리 구조에서 전위 순회, 중위 순회, 후위 순회와 같은 다양한 방법으로 탐색해야 하는 경우에 적하다.
  4. **컬렉션을 순회하는 코드의 중복을 줄이고 싶은 경우**:
    * 이터레이터 패턴을 사용하면 순회 로직을 재사용할 수 있으므로, 컬렉션을 탐색하는 코드의 중복을 줄일 수 있다. 이는 코드의 유지보수성을 높이고, 오류 발생 가능성을 줄여줍니다. 동일한 컬렉션을 여러 곳에서 순회할 필요가 있을 때, 이터레이터를 사용해 순회 로직을 캡슐화함으로써 코드의 중복을 방지할 수 있다.
  5. **컬렉션이 제공하는 기본 탐색 방법 외의 방식으로 접근하고 싶은 경우**:
    * 기본적으로 제공되는 탐색 방법 외에 추가적인 탐색 로직이 필요한 경우, 이터레이터 패턴을 사용하여 이를 구현할 수 있다. 이는 컬렉션의 기본 탐색 방법을 확장하는 데 유용하다. 특정 조건에 맞는 요소들만 순회하거나, 요소들의 순서를 변경하여 탐색하고자 할 때 유용하다.

## 장점

  1. **컬렉션의 내부 구조 은닉**
    * 이터레이터 패턴은 클라이언트가 컬렉션의 내부 구조를 알지 못하더라도 요소들을 탐색할 수 있도록 한다. 이는 컬렉션의 구현 세부 사항을 감추면서도, 클라이언트가 요소들에 접근할 수 있게 해준다. 결과적으로, 컬렉션의 내부 구조가 변경되더라도 클라이언트 코드에 영향을 미치지 않게 되어 시스템의 유연성이 증가한다.
  2. **일관된 탐색 인터페이스 제공**
    * 이터레이터 패턴은 다양한 종류의 컬렉션에 대해 일관된 탐색 방법을 제공한다. 클라이언트는 이터레이터 인터페이스를 사용해 컬렉션의 타입에 상관없이 동일한 방식으로 요소를 순회할 수 있다. 이는 코드의 가독성과 유지보수성을 높여준다.
  3. **순회 로직의 단순화**
    * 이터레이터 패턴을 사용하면 복잡한 순회 로직을 캡슐화하여, 클라이언트가 쉽게 요소들을 순회할 수 있다. 이는 코드의 중복을 줄이고, 각 컬렉션의 순회 방법을 별도로 관리할 수 있도록 도와준다.
  4. **다양한 순회 방법 제공 가능**
    * 이터레이터 패턴을 사용하면 컬렉션의 요소를 다양한 방식으로 순회할 수 있다. 기본적인 순차 탐색뿐만 아니라, 역순 탐색, 조건부 탐색 등 다양한 탐색 방법을 구현할 수 있어 유연성이 높다.
  5. **컬렉션과 탐색 로직의 분리**
    * 이터레이터 패턴은 컬렉션 클래스와 탐색 로직을 분리한다. 이로 인해 컬렉션 클래스는 데이터 관리에 집중할 수 있으며, 탐색 로직은 이터레이터 클래스에서 관리되므로 역할 분담이 명확해진다.

## 단점

  1. **이터레이터 객체의 추가 오버헤드**
    * 이터레이터 패턴을 사용하면 각 컬렉션에 대해 이터레이터 객체를 생성해야 하므로, 객체 생성에 따른 오버헤드가 발생할 수 있다. 특히, 이터레이터가 자주 생성되고 소멸되는 경우 성능 저하를 초래할 수 있다.
  2. **단일 방향 탐색 제한**
    * 기본적인 이터레이터는 컬렉션을 단일 방향으로만 탐색할 수 있다. 예를 들어, 앞에서 뒤로 순차적으로만 탐색이 가능하며, 역방향 탐색이나 특정 조건에 따른 탐색은 별도의 구현이 필요하다.
  3. **컬렉션의 수정에 대한 제한**
    * 이터레이터를 사용하여 컬렉션을 순회하는 동안, 컬렉션을 수정(추가, 삭제)하는 것은 일반적으로 금지된다. 이러한 수정이 이터레이터의 상태를 무효화할 수 있기 때문이다. 일부 이터레이터는 컬렉션의 요소를 안전하게 제거할 수 있는 방법을 제공하지만, 이는 모든 이터레이터에서 지원되지 않을 수 있다.
  4. **복잡한 이터레이터 구현**
    * 복잡한 데이터 구조나 다양한 순회 방식이 필요한 경우, 이터레이터 패턴의 구현이 복잡해질 수 있다. 특히, 비선형 데이터 구조(예: 트리, 그래프)의 경우 이터레이터를 구현하는 데 추가적인 노력이 필요하다.
  5. **컬렉션 크기에 따른 성능 문제**
    * 이터레이터가 큰 컬렉션을 순회할 때, 특히 컬렉션이 메모리 내에 상주하지 않거나 지연 로딩되는 경우, 성능 문제가 발생할 수 있다. 이터레이터가 모든 요소를 순회할 필요가 있는 경우, 컬렉션이 큰 경우에 비효율적일 수 있다.

## 이터레이터 패턴 (Iterator Pattern)을 사용한 예제:

이 예제에서는 회사의 조직도를 표현하는 트리 구조에서 다양한 방식으로 이터레이터를 사용해 조직을 순회할 수 있는 기능을 제공

```java
import java.util.*;

// Node 클래스 (조직도에서의 한 노드, 직원 혹은 부서)
class OrgNode {
    private String name;
    private List<OrgNode> subordinates;

    public OrgNode(String name) {
        this.name = name;
        this.subordinates = new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public void addSubordinate(OrgNode subordinate) {
        subordinates.add(subordinate);
    }

    public List<OrgNode> getSubordinates() {
        return subordinates;
    }
}

// Iterator 인터페이스
interface OrgIterator<T> {
    boolean hasNext();
    T next();
}

// 전위 순회 이터레이터
class PreOrderIterator implements OrgIterator<OrgNode> {
    private Stack<Iterator<OrgNode>> stack = new Stack<>();

    public PreOrderIterator(OrgNode root) {
        List<OrgNode> rootList = new ArrayList<>();
        rootList.add(root);
        stack.push(rootList.iterator());
    }

    @Override
    public boolean hasNext() {
        return !stack.isEmpty() && stack.peek().hasNext();
    }

    @Override
    public OrgNode next() {
        Iterator<OrgNode> iterator = stack.peek();
        OrgNode currentNode = iterator.next();
        if (!iterator.hasNext()) {
            stack.pop();
        }
        if (!currentNode.getSubordinates().isEmpty()) {
            stack.push(currentNode.getSubordinates().iterator());
        }
        return currentNode;
    }
}

// 후위 순회 이터레이터
class PostOrderIterator implements OrgIterator<OrgNode> {
    private Stack<OrgNode> stack = new Stack<>();
    private Set<OrgNode> visited = new HashSet<>();

    public PostOrderIterator(OrgNode root) {
        stack.push(root);
    }

    @Override
    public boolean hasNext() {
        return !stack.isEmpty();
    }

    @Override
    public OrgNode next() {
        while (hasNext()) {
            OrgNode currentNode = stack.peek();
            boolean allVisited = true;

            for (OrgNode subordinate : currentNode.getSubordinates()) {
                if (!visited.contains(subordinate)) {
                    stack.push(subordinate);
                    allVisited = false;
                }
            }

            if (allVisited) {
                visited.add(currentNode);
                return stack.pop();
            }
        }
        return null;
    }
}

// 레벨 순서 순회 이터레이터
class LevelOrderIterator implements OrgIterator<OrgNode> {
    private Queue<OrgNode> queue = new LinkedList<>();

    public LevelOrderIterator(OrgNode root) {
        queue.offer(root);
    }

    @Override
    public boolean hasNext() {
        return !queue.isEmpty();
    }

    @Override
    public OrgNode next() {
        OrgNode currentNode = queue.poll();
        queue.addAll(currentNode.getSubordinates());
        return currentNode;
    }
}

// 클라이언트 코드
public class ComplexIteratorPatternExample {
    public static void main(String[] args) {
        // 조직도 트리 구조 생성
        OrgNode ceo = new OrgNode("CEO");
        OrgNode headSales = new OrgNode("Head of Sales");
        OrgNode headMarketing = new OrgNode("Head of Marketing");

        OrgNode salesExec1 = new OrgNode("Sales Executive 1");
        OrgNode salesExec2 = new OrgNode("Sales Executive 2");

        OrgNode marketingExec1 = new OrgNode("Marketing Executive 1");
        OrgNode marketingExec2 = new OrgNode("Marketing Executive 2");

        ceo.addSubordinate(headSales);
        ceo.addSubordinate(headMarketing);

        headSales.addSubordinate(salesExec1);
        headSales.addSubordinate(salesExec2);

        headMarketing.addSubordinate(marketingExec1);
        headMarketing.addSubordinate(marketingExec2);

        // 전위 순회
        System.out.println("PreOrder Traversal:");
        OrgIterator<OrgNode> preOrderIterator = new PreOrderIterator(ceo);
        while (preOrderIterator.hasNext()) {
            OrgNode node = preOrderIterator.next();
            System.out.println(node.getName());
        }

        // 후위 순회
        System.out.println("\nPostOrder Traversal:");
        OrgIterator<OrgNode> postOrderIterator = new PostOrderIterator(ceo);
        while (postOrderIterator.hasNext()) {
            OrgNode node = postOrderIterator.next();
            System.out.println(node.getName());
        }

        // 레벨 순서 순회
        System.out.println("\nLevelOrder Traversal:");
        OrgIterator<OrgNode> levelOrderIterator = new LevelOrderIterator(ceo);
        while (levelOrderIterator.hasNext()) {
            OrgNode node = levelOrderIterator.next();
            System.out.println(node.getName());
        }
    }
}
```

![](/assets/images/posts/2024-08-31-이터레이터-패턴-Iterator-Pattern/01.png)

## 코드 설명

  1. **OrgNode 클래스**:
    * 조직도 내의 각 노드를 표현하는 클래스입니다. 노드는 자신의 이름과 하위 부서를 포함할 수 있다.
  2. **OrgIterator 인터페이스**:
    * 조직도를 탐색하는 이터레이터 인터페이스입니다. hasNext()와 next() 메서드를 구현해야 한다.
  3. **PreOrderIterator (전위 순회)**:
    * 전위 순회 방식으로 조직도를 탐색하는 이터레이터이다. 이터레이터는 현재 노드를 방문한 후, 자식 노드를 순차적으로 방문한다.
  4. **PostOrderIterator (후위 순회)**:
    * 후위 순회 방식으로 조직도를 탐색하는 이터레이터이다. 모든 자식 노드를 방문한 후에 현재 노드를 방문한다.
  5. **LevelOrderIterator (레벨 순서 순회)**:
    * 레벨 순서 순회 방식으로 조직도를 탐색하는 이터레이터이다. 각 레벨의 노드를 방문한 후, 다음 레벨로 이동하여 노드를 탐색한다.
  6. **클라이언트 코드**:
    * 조직도 트리 구조를 생성하고, 전위 순회, 후위 순회, 레벨 순서 순회를 통해 조직도를 탐색한다.

## 관련패턴

  1. **컴포지트 패턴(Composite Pattern)**
    * 컴포지트 패턴은 객체들을 트리 구조로 구성하여 부분-전체 계층 구조를 나타내는 패턴이다. 컴포지트 패턴에서 각 노드(객체)는 하위 노드를 포함할 수 있으며, 이 구조에서 이터레이터 패턴이 자주 사용된다. 이터레이터 패턴은 트리 구조를 순회할 때 유용하며, 컴포지트 패턴과 함께 사용하면 전체 트리 구조를 일관되게 탐색할 수 있다. 특히, 복잡한 트리 구조에서 각 노드를 순차적으로 방문하거나, 특정 순회 방식을 적용하고자 할 때 이터레이터 패턴이 필요하다.
  2. **빌더 패턴(Builder Pattern)**
    * 빌더 패턴은 복잡한 객체를 단계별로 생성하는 패턴이다. 빌더 패턴은 객체의 내부 구조를 캡슐화하고, 객체 생성의 복잡성을 줄이는 데 중점을 둔다. 이터레이터 패턴은 빌더 패턴과 결합되어 복잡한 구조를 탐색하는 과정에서 유용하게 사용될 수 있다. 빌더 패턴을 사용하여 복잡한 객체를 생성하고, 이터레이터 패턴을 사용하여 생성된 객체를 순차적으로 탐색할 수 있다.
  3. **팩토리 패턴(Factory Pattern)**
    * 팩토리 패턴은 객체 생성을 캡슐화하여 클라이언트 코드와 객체 생성 로직을 분리하는 패턴이다. 팩토리 패턴과 이터레이터 패턴은 함께 사용될 수 있다. 팩토리 패턴을 사용하여 이터레이터 객체를 생성하는 로직을 캡슐화할 수 있으며, 다양한 컬렉션에 대해 다른 이터레이터를 반환하는 팩토리를 구현할 수 있다.
  4. **합성 패턴(Memento Pattern)**
    * 메멘토 패턴은 객체의 상태를 저장하고 복원할 수 있는 방법을 제공하는 패턴이다. 이터레이터 패턴과 함께 사용하면, 이터레이터가 탐색 중인 컬렉션의 상태를 저장하고, 나중에 복원할 수 있다. 복잡한 탐색 로직에서 특정 시점의 상태를 저장해두고 필요할 때 상태를 복원하는 기능이 필요할 때, 메멘토 패턴과 이터레이터 패턴이 함께 사용된다.
  5. **프록시 패턴(Proxy Pattern)**
    * 프록시 패턴은 다른 객체에 대한 접근을 제어하는 패턴이다. 이터레이터 패턴과 프록시 패턴을 결합하여, 이터레이터를 사용해 컬렉션을 순회할 때 특정 요소에 대한 접근을 제어하거나 로깅, 캐싱 등의 부가 기능을 제공할 수 있다. 프록시 패턴은 이터레이터가 특정 조건에서만 요소를 반환하거나, 요소에 대한 접근을 제한해야 하는 경우에 유용하게 사용된다.
  6. **방문자 패턴(Visitor Pattern)**
    * 방문자 패턴은 객체의 구조를 변경하지 않고도 객체의 요소들에 대해 새로운 작업을 추가할 수 있는 패턴이다. 이터레이터 패턴과 방문자 패턴은 함께 사용되어, 객체 구조를 탐색하면서 각 요소에 대해 특정 작업을 수행할 수 있다. 이터레이터는 컬렉션을 순회하고, 방문자 패턴은 순회 중에 각 요소에 대해 특정 작업을 수행하는 역할을 한다.
