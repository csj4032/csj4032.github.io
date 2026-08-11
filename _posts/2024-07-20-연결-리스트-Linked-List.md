---
title: "연결 리스트 (Linked List)"
description: "연결 리스트는 각 노드가 데이터와 다음 노드에 대한 참조(포인터)를 포함하는 선형 데이터 구조입니다. 연결 리스트는 배열과 달리 동적 크기를 가지며, 요소의 삽입과 삭제가 용이합니다."
categories:
 - algorithm
 - data-structure
source: "https://blog.naver.com/csj4032/223519196730"
---

연결 리스트는 각 노드가 데이터와 다음 노드에 대한 참조(포인터)를 포함하는 선형 데이터 구조입니다. 연결 리스트는 배열과 달리 동적 크기를 가지며, 요소의 삽입과 삭제가 용이합니다.

## 종류

* **단일 연결 리스트 (Singly Linked List)**:
  * 각 노드는 데이터와 다음 노드에 대한 참조를 가집니다.
  * 마지막 노드의 다음 참조는 NULL입니다.

```java
// Node 클래스는 연결 리스트의 각 노드를 나타냅니다.
class Node {
    int data; // 노드의 데이터를 저장하는 변수
    Node next; // 다음 노드를 가리키는 포인터

    // 생성자를 통해 노드를 초기화합니다.
    Node(int data) {
        this.data = data;
        this.next = null;
    }
}

// SinglyLinkedList 클래스는 단일 연결 리스트를 관리하는 여러 메서드를 포함합니다.
class SinglyLinkedList {
    Node head; // 리스트의 첫 번째 노드를 가리키는 포인터

    // 리스트의 끝에 새로운 노드를 추가하는 메서드입니다.
    public void insert(int data) {
        Node newNode = new Node(data); // 새로운 노드를 생성합니다.

        // 리스트가 비어있으면, 새로운 노드를 head로 설정합니다.
        if (head == null) {
            head = newNode;
        } else {
            Node temp = head;
            // 리스트의 끝까지 이동합니다.
            while (temp.next != null) {
                temp = temp.next;
            }
            // 새로운 노드를 리스트의 끝에 추가합니다.
            temp.next = newNode;
        }
    }

    // 리스트의 모든 요소를 출력하는 메서드입니다.
    public void printList() {
        Node temp = head;
        while (temp != null) {
            System.out.print(temp.data + " ");
            temp = temp.next;
        }
    }

    // 주어진 값을 가진 노드를 삭제하는 메서드입니다.
    public void deleteByValue(int value) {
        if (head == null) {
            System.out.println("List is empty."); // 리스트가 비어있으면 메시지를 출력합니다.
            return;
        }

        // head 노드가 삭제할 값을 가지면 head를 다음 노드로 설정합니다.
        if (head.data == value) {
            head = head.next;
            return;
        }

        // 삭제할 값을 가진 노드를 찾기 위해 리스트를 순회합니다.
        Node temp = head;
        Node prev = null;

        while (temp != null && temp.data != value) {
            prev = temp;
            temp = temp.next;
        }

        // 리스트에 값이 없는 경우 메시지를 출력합니다.
        if (temp == null) {
            System.out.println("Value not found in the list.");
            return;
        }

        // 노드를 리스트에서 제거합니다.
        prev.next = temp.next;
    }

    // 주어진 값을 가진 노드를 찾는 메서드입니다.
    public boolean find(int value) {
        Node temp = head;
        while (temp != null) {
            if (temp.data == value) {
                return true; // 값을 찾으면 true를 반환합니다.
            }
            temp = temp.next;
        }
        return false; // 값을 찾지 못하면 false를 반환합니다.
    }
}

// Main 클래스는 단일 연결 리스트의 여러 기능을 테스트합니다.
public class Main {
```

* **이중 연결 리스트 (Doubly Linked List)**
  * 각 노드는 데이터, 다음 노드에 대한 참조, 이전 노드에 대한 참조를 가집니다.
  * 양방향으로 순회가 가능합니다.

```java
// Node 클래스는 이중 연결 리스트의 각 노드를 나타냅니다.
class Node {
    int data; // 노드의 데이터를 저장하는 변수
    Node prev; // 이전 노드를 가리키는 포인터
    Node next; // 다음 노드를 가리키는 포인터

    // 생성자를 통해 노드를 초기화합니다.
    Node(int data) {
        this.data = data;
        this.prev = null;
        this.next = null;
    }
}

// DoublyLinkedList 클래스는 이중 연결 리스트를 관리하는 여러 메서드를 포함합니다.
class DoublyLinkedList {
    Node head; // 리스트의 첫 번째 노드를 가리키는 포인터

    // 리스트의 끝에 새로운 노드를 추가하는 메서드입니다.
    public void insert(int data) {
        Node newNode = new Node(data); // 새로운 노드를 생성합니다.

        // 리스트가 비어있으면, 새로운 노드를 head로 설정합니다.
        if (head == null) {
            head = newNode;
        } else {
            Node temp = head;
            // 리스트의 끝까지 이동합니다.
            while (temp.next != null) {
                temp = temp.next;
            }
            // 새로운 노드를 리스트의 끝에 추가합니다.
            temp.next = newNode;
            newNode.prev = temp;
        }
    }

    // 리스트의 모든 요소를 출력하는 메서드입니다.
    public void printList() {
        Node temp = head;
        while (temp != null) {
            System.out.print(temp.data + " ");
            temp = temp.next;
        }
    }

    // 주어진 값을 가진 노드를 삭제하는 메서드입니다.
    public void deleteByValue(int value) {
        if (head == null) {
            System.out.println("List is empty."); // 리스트가 비어있으면 메시지를 출력합니다.
            return;
        }

        Node temp = head;

        // 삭제할 값을 가진 노드를 찾기 위해 리스트를 순회합니다.
        while (temp != null && temp.data != value) {
            temp = temp.next;
        }

        // 리스트에 값이 없는 경우 메시지를 출력합니다.
        if (temp == null) {
            System.out.println("Value not found in the list.");
            return;
        }

        // 노드를 리스트에서 제거합니다.
        if (temp.prev != null) {
            temp.prev.next = temp.next;
        } else {
            head = temp.next;
        }
        if (temp.next != null) {
            temp.next.prev = temp.prev;
        }
    }

    // 주어진 값을 가진 노드를 찾는 메서드입니다.
    public boolean find(int value) {
        Node temp = head;
        while (temp != null) {
            if (temp.data == value) {
                return true; // 값을 찾으면 true를 반환합니다.
            }
            temp = temp.next;
        }
        return false; // 값을 찾지 못하면 false를 반환합니다.
    }
}

// Main 클래스는 이중 연결 리스트의 여러 기능을 테스트합니다.
public class Main {
    public static void main(String[] args) {
        DoublyLinkedList list = new DoublyLinkedList();

        // 요소를 삽입합니다.
        list.insert(10);
        list.insert(20);
        list.insert(30);
        list.insert(40);

        // 리스트를 출력합니다.
        System.out.println("Doubly Linked list:");
        list.printList();

        // 요소를 삭제합니다.
        System.out.println("\nDeleting 20:");
        list.deleteByValue(20);
        list.printList();

        // 요소를 찾습니다.
        System.out.println("\nFinding 30:");
        System.out.println(list.find(30) ? "Element found." : "Element not found.");
    }
}
```

* **원형 연결 리스트 (Circular Linked List)**
  * 단일 또는 이중 연결 리스트의 변형으로, 마지막 노드가 첫 번째 노드를 가리킵니다.
  * 리스트의 끝을 쉽게 확인할 수 있습니다.

```java
// Node 클래스는 원형 연결 리스트의 각 노드를 나타냅니다.
class Node {
    int data; // 노드의 데이터를 저장하는 변수
    Node next; // 다음 노드를 가리키는 포인터

    // 생성자를 통해 노드를 초기화합니다.
    Node(int data) {
        this.data = data;
        this.next = null;
    }
}

// CircularLinkedList 클래스는 원형 연결 리스트를 관리하는 여러 메서드를 포함합니다.
class CircularLinkedList {
    Node head; // 리스트의 첫 번째 노드를 가리키는 포인터

    // 리스트의 끝에 새로운 노드를 추가하는 메서드입니다.
    public void insert(int data) {
        Node newNode = new Node(data); // 새로운 노드를 생성합니다.

        // 리스트가 비어있으면, 새로운 노드를 head로 설정하고 자기 자신을 가리키게 합니다.
        if (head == null) {
            head = newNode;
            newNode.next = head;
        } else {
            Node temp = head;
            // 리스트의 끝까지 이동합니다.
            while (temp.next != head) {
                temp = temp.next;
            }
            // 새로운 노드를 리스트의 끝에 추가하고, 새로운 노드의 다음을 head로 설정합니다.
            temp.next = newNode;
            newNode.next = head;
        }
    }

    // 리스트의 모든 요소를 출력하는 메서드입니다.
    public void printList() {
        if (head == null) {
            System.out.println("List is empty.");
            return;
        }
        
        Node temp = head;
        do {
            System.out.print(temp.data + " ");
            temp = temp.next;
        } while (temp != head);
        System.out.println();
    }

    // 주어진 값을 가진 노드를 삭제하는 메서드입니다.
    public void deleteByValue(int value) {
        if (head == null) {
            System.out.println("List is empty.");
            return;
        }

        Node current = head;
        Node previous = null;

        // head 노드가 삭제할 값을 가지는 경우 처리
        while (current.data == value && current.next != head) {
            previous = head;
            while (previous.next != head) {
                previous = previous.next;
            }
            head = current.next;
            previous.next = head;
            current = head;
        }

        // 리스트의 다른 노드에서 값을 찾기
        do {
            previous = current;
            current = current.next;
        } while (current != head && current.data != value);

        // 값을 찾았을 때 처리
        if (current.data == value) {
            previous.next = current.next;
        } else {
            System.out.println("Value not found in the list.");
        }
    }

    // 주어진 값을 가진 노드를 찾는 메서드입니다.
    public boolean find(int value) {
        if (head == null) {
            return false;
        }

        Node temp = head;
        do {
            if (temp.data == value) {
                return true;
            }
            temp = temp.next;
        } while (temp != head);

        return false;
    }
}

// Main 클래스는 원형 연결 리스트의 여러 기능을 테스트합니다.
public class Main {
    public static void main(String[] args) {
        CircularLinkedList list = new CircularLinkedList();

        // 요소를 삽입합니다.
        list.insert(10);
        list.insert(20);
        list.insert(30);
        list.insert(40);

        // 리스트를 출력합니다.
        System.out.println("Circular Linked list:");
        list.printList();

        // 요소를 삭제합니다.
        System.out.println("Deleting 20:");
        list.deleteByValue(20);
        list.printList();

        // 요소를 찾습니다.
        System.out.println("Finding 30:");
        System.out.println(list.find(30) ? "Element found." : "Element not found.");
    }
}
```

## 장점

  1. **동적 크기**: 배열과 달리, 연결 리스트는 런타임 시 크기를 동적으로 조절할 수 있습니다.
  2. **빠른 삽입과 삭제**: 리스트의 시작이나 중간에서 요소를 삽입하거나 삭제하는 데 O(1) 시간이 소요됩니다.
  3. **메모리 효율성**: 연결 리스트는 필요한 만큼의 메모리만 사용하므로, 메모리 낭비가 줄어듭니다.

## 단점

  1. **임의 접근 불가**: 배열과 달리, 연결 리스트는 인덱스를 사용한 임의 접근이 불가능하여 O(n) 시간이 소요됩니다.
  2. **추가 메모리 사용**: 각 노드가 데이터와 포인터를 저장해야 하므로 추가적인 메모리 공간이 필요합니다.
  3. **역순 접근 어려움**: 단일 연결 리스트의 경우 역순으로 데이터를 접근하는 것이 어렵습니다. 이를 해결하기 위해 이중 연결 리스트를 사용해야 하지만, 이는 더 많은 메모리를 소모합니다.
  4. **캐시 성능 저하**: 연결 리스트는 비연속적인 메모리 배치를 가지므로, 배열에 비해 캐시 효율성이 떨어질 수 있습니다.

## 성능 비교

  * **삽입/삭제**: O(1) 시간 (노드 위치를 알고 있는 경우)
  * **탐색**: O(n) 시간 (특정 값을 찾기 위해)
  * **임의 접근**: O(n) 시간 (인덱스를 통한 접근)
