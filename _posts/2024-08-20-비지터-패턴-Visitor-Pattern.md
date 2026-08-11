---
title: "비지터 패턴 (Visitor Pattern)"
description: "비지터(Visitor) 패턴은 객체의 구조와 별도로 새로운 기능을 추가하고자 할 때 사용하는 행동 디자인 패턴 중 하나이다. 이 패턴은 객체 구조를 변경하지 않고도 기능을 확장할 수 있도록 도와준다. 객체 구조를 방"
categories:
 - programming
 - design-pattern
source: "https://blog.naver.com/csj4032/223554278952"
---

비지터(Visitor) 패턴은 객체의 구조와 별도로 새로운 기능을 추가하고자 할 때 사용하는 행동 디자인 패턴 중 하나이다. 이 패턴은 객체 구조를 변경하지 않고도 기능을 확장할 수 있도록 도와준다. 객체 구조를 방문하는 방문자(Visitor)를 정의하고, 이 방문자가 객체의 각 요소에 대해 수행할 작업을 정의하는 방식으로 동작한다.

## "구조는 변하지 않되, 새로운 시각으로 세상을 바라보는 여행자의 지혜."

비지터(Visitor) 패턴은 다음과 같은 상황에서 유용하게 사용될 수 있다:

  1. **컴파일러의 추상 구문 트리 처리**
    * 컴파일러의 추상 구문 트리 구조를 변경하지 않고도 새로운 분석, 최적화, 코드 생성과 같은 기능을 쉽게 추가할 수 있다. 컴파일러는 구문 트리의 각 노드를 방문하면서 특정 작업을 수행하는데, 비지터 패턴을 적용하면 각 작업을 독립적인 방문자 클래스로 분리할 수 있다. 이를 통해 코드의 유지보수성과 확장성이 크게 향상되며, 새로운 기능 추가 시 기존 코드를 수정할 필요 없이 새로운 방문자 클래스를 추가하기만 하면 된다.
  2. **문서 처리 시스템**
    * 문서의 구조를 변경하지 않고도 새로운 포맷(예: PDF, HTML, XML)으로의 변환 기능을 손쉽게 추가할 수 있다. 문서의 각 요소(텍스트, 이미지, 표 등)에 대해 변환 작업을 수행하는 방문자 클래스를 생성하면, 기존의 문서 구조를 수정할 필요 없이 새로운 변환 작업을 추가할 수 있습니다. 이를 통해 다양한 문서 포맷에 대한 대응이 용이해지고, 시스템의 유연성이 증가한다.
  3. **파일 시스템 탐색**
    * 비지터 패턴을 활용하면 파일 시스템의 디렉터리 구조를 유지하면서, 파일 크기 계산, 압축, 권한 검사 등 새로운 파일 작업을 쉽게 추가할 수 있다. 파일과 디렉터리 각각에 대한 작업을 독립적인 방문자 클래스로 분리함으로써, 기존 파일 시스템 구조를 변경하지 않고도 다양한 파일 작업을 유연하게 확장할 수 있다. 이로 인해 파일 시스템에 새로운 기능을 추가할 때 코드의 재사용성과 유지보수성이 높진다.
  4. **쇼핑몰 장바구니 할인 계산**
    * 장바구니의 구조를 변경하지 않고도 다양한 할인 정책(예: 제품별, 이벤트별 할인을 적용할 수 있는 정책)을 유연하게 적용할 수 있다. 각 제품에 대해 서로 다른 할인 정책을 구현한 방문자 클래스를 생성하고, 장바구니에 새로운 할인 정책을 추가할 때는 해당 방문자 클래스를 추가하면 된다. 이를 통해 시스템의 확장성이 향상되며, 할인 정책 변경 시에도 기존 코드를 안전하게 유지할 수 있다.
  5. **그래픽 객체의 렌더링**
    * 그래픽 객체(예: 원, 사각형, 선 등)의 구조를 유지하면서, 새로운 렌더링 방식(예: 화면 렌더링, 인쇄용 렌더링)을 쉽게 확장할 수 있다. 각 그래픽 객체에 대해 서로 다른 렌더링 방법을 구현한 방문자 클래스를 생성하여, 특정 렌더링 작업이 필요할 때 해당 방문자를 사용하면 된다. 이를 통해 새로운 렌더링 방식이나 출력을 추가할 때, 기존 그래픽 객체의 구조를 수정할 필요 없이 확장이 가능하다.

## 장점

  1. **기능 확장의 용이성**
    * 비지터 패턴을 사용하면 객체 구조를 변경하지 않고도 새로운 기능을 쉽게 추가할 수 있습니다. 새로운 기능은 단순히 새로운 방문자 클래스를 추가함으로써 구현됩니다. 파일 시스템에서 파일 크기 계산, 압축, 권한 검사 등 여러 기능을 각각의 방문자 클래스로 구현할 수 있습니다. 추가적인 기능이 필요할 때마다 객체 구조를 수정하지 않고 새로운 방문자 클래스를 만들면 됩니다.
  2. **객체 구조와 연산의 분리**
    * 객체 구조와 그 구조에서 수행되는 연산(기능)을 분리할 수 있습니다. 이는 코드의 가독성과 유지보수성을 높이는 데 기여합니다. 컴파일러에서 추상 구문 트리(AST)와 이 트리에서 수행되는 타입 체크, 코드 생성, 최적화 등의 작업을 각각의 방문자 클래스로 분리할 수 있습니다. 이로 인해 코드의 논리적 분리와 이해가 용이해집니다.
  3. **다양한 연산의 적용**
    * 동일한 객체 구조에 대해 여러 가지 다른 연산을 적용할 수 있습니다. 각각의 연산은 별도의 방문자 클래스로 구현되어, 서로 다른 동작을 객체 구조에 적용할 수 있습니다. 문서 처리 시스템에서 동일한 문서 구조에 대해 HTML, PDF, Markdown 등의 변환을 수행하는 각각의 방문자 클래스를 만들 수 있습니다.
  4. **유지보수성 향상**
    * 연산이 새로운 방문자 클래스로 캡슐화되기 때문에, 각 연산이 독립적으로 관리될 수 있습니다. 이는 코드의 유지보수성을 높입니다. 쇼핑몰 장바구니 시스템에서 다양한 할인 정책을 각 방문자 클래스로 분리하여 관리하면, 특정 할인 정책을 변경하거나 제거할 때 다른 부분에 영향을 주지 않고 유지보수가 가능합니다.

## 단점

  1. **객체 구조의 변경이 어려움**
    * 비지터 패턴의 주요 단점은 객체 구조에 새로운 요소를 추가하거나 기존 요소를 변경해야 할 때 발생합니다. 새로운 요소가 추가되면 모든 방문자 클래스에 해당 요소를 처리하는 메서드를 추가해야 합니다. 만약 파일 시스템에 새로운 파일 유형이 추가된다면, 모든 기존 방문자 클래스에 이 새로운 파일 유형을 처리하는 로직을 추가해야 합니다. 이는 기존 방문자가 많을수록 번거롭고 오류를 일으킬 가능성이 있습니다.
  2. **객체 캡슐화 위반 가능성**
    * 비지터 패턴은 객체 내부의 상태나 행동에 직접 접근해야 하는 경우가 많아, 객체의 캡슐화를 위반할 가능성이 있습니다. 이는 객체의 세부 구현이 외부로 노출되기 쉽다는 의미입니다. 방문자가 특정 객체의 내부 상태에 의존하여 작업을 수행하는 경우, 객체의 내부 구현이 변경되면 방문자 클래스도 영향을 받아 수정이 필요해질 수 있습니다. 이는 코드의 결합도를 높이고, 유지보수를 어렵게 만듭니다.
  3. **복잡한 클래스 계층 구조**
    * 비지터 패턴을 적용하면 각 요소 클래스에 accept 메서드를 추가해야 하며, 이를 위해 요소 클래스와 방문자 클래스 간의 관계가 복잡해질 수 있습니다. 이러한 복잡성은 코드의 이해를 어렵게 할 수 있습니다. 다양한 요소와 방문자가 있는 복잡한 시스템에서, 각 요소에 대해 방문자를 처리하는 로직이 추가되어 코드의 복잡성이 증가할 수 있습니다.
  4. **더 많은 코드 작성 필요**
    * 비지터 패턴은 각 요소에 대해 별도의 방문자 메서드를 작성해야 하므로, 상대적으로 많은 양의 코드를 작성해야 할 수 있습니다. 특히 요소의 수가 많을수록 방문자 클래스가 방대해질 수 있습니다. 다양한 그래픽 객체(원, 사각형, 선 등)에 대해 서로 다른 렌더링 방법을 적용해야 하는 경우, 각 객체에 대한 visit 메서드를 각각의 방문자 클래스에 작성해야 하므로 코드가 방대해질 수 있습니다.

## 간단한 쇼핑몰 장바구니 시스템 예:

이 예제에서는 다양한 제품에 대해 서로 다른 세금 계산 작업을 수행하는 방문자 클래스를 정의합니다.

```java
// Element 인터페이스
interface Item {
    void accept(Visitor visitor);
}

// ConcreteElement 클래스
class Book implements Item {
    private double price;
    private String isbn;

    public Book(double price, String isbn) {
        this.price = price;
        this.isbn = isbn;
    }

    public double getPrice() {
        return price;
    }

    public String getIsbn() {
        return isbn;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}

class Electronics implements Item {
    private double price;
    private String model;

    public Electronics(double price, String model) {
        this.price = price;
        this.model = model;
    }

    public double getPrice() {
        return price;
    }

    public String getModel() {
        return model;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}

class Grocery implements Item {
    private double price;
    private String name;

    public Grocery(double price, String name) {
        this.price = price;
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public String getName() {
        return name;
    }

    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}

// Visitor 인터페이스
interface Visitor {
    void visit(Book book);
    void visit(Electronics electronics);
    void visit(Grocery grocery);
}

// ConcreteVisitor 클래스
class TaxVisitor implements Visitor {
    private static final double BOOK_TAX_RATE = 0.1;
    private static final double ELECTRONICS_TAX_RATE = 0.2;
    private static final double GROCERY_TAX_RATE = 0.05;

    @Override
    public void visit(Book book) {
        double tax = book.getPrice() * BOOK_TAX_RATE;
        System.out.println("Book ISBN: " + book.getIsbn() + ", Tax: $" + tax);
    }

    @Override
    public void visit(Electronics electronics) {
        double tax = electronics.getPrice() * ELECTRONICS_TAX_RATE;
        System.out.println("Electronics Model: " + electronics.getModel() + ", Tax: $" + tax);
    }

    @Override
    public void visit(Grocery grocery) {
        double tax = grocery.getPrice() * GROCERY_TAX_RATE;
        System.out.println("Grocery Name: " + grocery.getName() + ", Tax: $" + tax);
    }
}

// 클라이언트 코드
public class VisitorPatternExample {
    public static void main(String[] args) {
        Item[] items = new Item[]{
            new Book(20.0, "123456"),
            new Electronics(100.0, "XYZ Model"),
            new Grocery(10.0, "Apple")
        };

        Visitor taxVisitor = new TaxVisitor();

        for (Item item : items) {
            item.accept(taxVisitor);
        }
    }
}
```

![](/assets/images/posts/2024-08-20-비지터-패턴-Visitor-Pattern/01.png)

## 코드 설명

  1. **Item 인터페이스 (Element)**:
    * Item 인터페이스는 accept(Visitor visitor) 메서드를 정의하여, 각 제품이 방문자를 받아들일 수 있게 한다.
  2. **Book, Electronics, Grocery 클래스 (ConcreteElement)**:
    * 각각의 클래스는 Item 인터페이스를 구현하고, 제품별 고유 정보를 가지고 있습니다. accept 메서드를 통해 방문자를 받아들이고, 방문자가 해당 제품에 대해 적절한 작업(여기서는 세금 계산)을 수행할 수 있도록 한다.
  3. **Visitor 인터페이스**:
    * Visitor 인터페이스는 visit(Book book), visit(Electronics electronics), visit(Grocery grocery) 메서드를 정의하여, 각각의 제품에 대해 다른 작업을 수행할 수 있도록 한다.
  4. **TaxVisitor 클래스 (ConcreteVisitor)**:
    * TaxVisitor 클래스는 Visitor 인터페이스를 구현하며, 각 제품에 대해 서로 다른 세율로 세금을 계산한다. 이 클래스는 각 제품에 대한 구체적인 세금 계산 로직을 포함하고 있다.
  5. **클라이언트 코드**:
    * Item 배열에 다양한 제품 객체를 담고, TaxVisitor를 사용해 각 제품에 대해 세금을 계산한다. accept 메서드를 호출하여, 각 제품이 TaxVisitor를 받아들여 세금 계산 작업을 수행하도록 한다.

## 관련 패턴

  1. 컴포지트(Composite) 패턴
    * 컴포지트 패턴은 객체를 트리 구조로 구성하여 개별 객체와 객체 그룹을 동일하게 다룰 수 있게 하는 패턴입니다. 비지터 패턴은 이러한 트리 구조의 각 요소에 대해 일관된 방식으로 작업을 수행할 때 유용합니다. 비지터 패턴은 컴포지트 패턴으로 구성된 트리 구조에서 각 노드를 순회하며 특정 작업을 수행할 수 있도록 도와줍니다. 예를 들어, 파일 시스템(디렉터리와 파일)을 컴포지트 패턴으로 구성한 후, 비지터 패턴을 사용해 파일 크기 계산, 파일 압축 등의 작업을 트리의 각 요소에서 수행할 수 있습니다.
  2. 인터프리터(Interpreter) 패턴
    * 인터프리터 패턴은 언어나 표현식의 문법을 정의하고, 이를 해석하는 클래스를 만드는 패턴입니다. 비지터 패턴은 이러한 구조를 가진 인터프리터에서 구문 트리의 각 노드를 처리할 때 유용하게 사용될 수 있습니다. 비지터 패턴은 인터프리터 패턴을 사용한 구문 해석기에서 구문 트리를 순회하며, 각 노드에 대해 다양한 작업(예: 평가, 타입 체크)을 수행할 수 있습니다. 수학 표현식 인터프리터에서, 비지터 패턴을 사용해 구문 트리의 각 노드(숫자, 연산자)를 순회하며 계산을 수행할 수 있습니다.
  3. 템플릿 메서드(Template Method) 패턴
    * 템플릿 메서드 패턴은 알고리즘의 골격을 정의하고, 세부 단계를 하위 클래스에서 구현하도록 하는 패턴입니다. 비지터 패턴은 이러한 알고리즘의 각 단계에서 객체 구조를 방문하며 특정 작업을 수행할 수 있습니다. 템플릿 메서드 패턴을 통해 알고리즘의 골격을 정의한 후, 비지터 패턴을 사용해 특정 단계에서 객체 구조를 순회하며 다양한 작업을 수행할 수 있습니다. 예를 들어, 문서 처리 시스템에서 특정 문서 포맷 변환 알고리즘의 골격을 템플릿 메서드로 정의하고, 비지터 패턴을 사용해 문서의 각 요소를 변환하는 작업을 수행할 수 있습니다.
  4. 이터레이터(Iterator) 패턴
    * 이터레이터 패턴은 집합체(예: 리스트, 트리)의 요소를 순차적으로 접근할 수 있는 방법을 제공하는 패턴입니다. 비지터 패턴은 이터레이터를 사용하여 객체 구조를 순회할 때, 각 요소에 대해 작업을 수행할 수 있습니다. 비지터 패턴은 이터레이터 패턴을 통해 순회되는 각 요소에서 구체적인 작업을 수행하는 데 활용될 수 있습니다. 예를 들어, 쇼핑몰의 장바구니에 담긴 상품 목록을 이터레이터 패턴으로 순회하면서, 비지터 패턴을 사용해 각 상품에 대한 세금 계산 작업을 수행할 수 있습니다.
  5. 이중 디스패치(Double Dispatch)
    * 비지터 패턴은 사실상 이중 디스패치(Double Dispatch)의 한 형태로 간주될 수 있습니다. 이중 디스패치란 호출되는 메서드가 두 개의 객체 타입(클래스의 타입과 메서드의 인자 타입)에 따라 다르게 결정되는 메커니즘을 말합니다. 비지터 패턴은 이중 디스패치를 통해 다양한 방문자와 요소가 만나면서 서로 다른 작업을 수행할 수 있게 합니다. 비지터 패턴에서 방문자가 특정 요소를 방문할 때, 해당 요소의 타입에 따라 알맞은 방문자 메서드가 호출됩니다. 이를 통해 각 요소에 맞는 작업을 수행할 수 있습니다.
  6. 디코레이터(Decorator) 패턴
    * 디코레이터 패턴은 객체에 새로운 기능을 추가할 때 사용하는 패턴으로, 비지터 패턴과 유사한 점이 있습니다. 두 패턴 모두 객체에 대한 접근을 간접적으로 관리하며, 새로운 기능을 쉽게 추가할 수 있도록 돕습니다. 비지터 패턴은 구조적으로 객체의 행동을 변경하지 않으면서도 다양한 작업을 수행할 수 있게 하고, 디코레이터 패턴은 객체의 기능을 동적으로 확장할 수 있습니다. 예를 들어, 문서 처리 시스템에서 문서의 렌더링 기능을 디코레이터 패턴으로 확장하고, 렌더링 중에 문서의 각 요소를 비지터 패턴으로 순회하며 특정 작업을 수행할 수 있습니다.
