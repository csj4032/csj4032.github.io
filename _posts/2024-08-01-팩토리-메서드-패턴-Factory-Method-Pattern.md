---
title: "팩토리 메서드 패턴(Factory Method Pattern)"
description: "팩토리 메서드 패턴(Factory Method Pattern)은 객체를 생성하기 위한 인터페이스를 정의하지만, 어떤 클래스의 인스턴스를 만들지는 서브클래스에서 결정하게 만드는 패턴입니다. 이를 통해 객체 생성의 책임"
categories:
 - programming
 - design-pattern
source: "https://blog.naver.com/csj4032/223532907537"
---

## 개요

팩토리 메서드 패턴(Factory Method Pattern)은 객체를 생성하기 위한 인터페이스를 정의하지만, 어떤 클래스의 인스턴스를 만들지는 서브클래스에서 결정하게 만드는 패턴입니다. 이를 통해 객체 생성의 책임을 서브클래스로 분리하여 코드의 유연성과 확장성을 높입니다.

## "객체 생성을 서브클래스에서 담당하게 하여 객체 생성 코드를 캡슐화하고 확장성을 높이는 디자인 패턴"

팩토리 메서드 패턴을 사용하기 좋은 상황은 다음과 같습니다:

  1. **객체 생성 로직이 복잡한 경우**:
    * 객체 생성 과정이 복잡하거나 여러 단계를 거치는 경우, 팩토리 메서드 패턴을 사용하면 객체 생성 코드를 한 곳에 모아 관리할 수 있습니다.
  2. **객체 생성 시점이 동적으로 결정되는 경우**:
    * 런타임에 객체의 구체적인 타입이 결정되어야 하는 상황에서, 팩토리 메서드 패턴을 사용하면 유연하게 대응할 수 있습니다.
  3. **코드의 확장성이 필요한 경우**:
    * 새로운 타입의 객체를 추가해야 할 때, 클라이언트 코드를 수정하지 않고도 새로운 서브클래스를 추가하는 것만으로 기능을 확장할 수 있습니다.
  4. **객체 생성이 자주 변경될 가능성이 있는 경우**:
    * 객체 생성 로직이 자주 변경되는 경우, 팩토리 메서드 패턴을 사용하면 변경이 발생해도 클라이언트 코드에 영향을 최소화할 수 있습니다.
  5. **여러 관련된 객체를 생성해야 하는 경우**:
    * 관련된 여러 객체를 생성하는 경우, 팩토리 메서드 패턴을 사용하면 객체 생성 코드를 일관되게 유지할 수 있습니다.
  6. **클래스 계층 구조에서 객체를 생성해야 하는 경우**:
    * 상위 클래스에서 객체를 생성하는 코드를 제공하고, 하위 클래스에서 구체적인 객체를 생성해야 하는 상황에서 유용합니다.

## 장점

  1. **객체 생성 코드의 분리**: 객체 생성 코드를 클라이언트 코드와 분리하여 유지보수성을 높입니다.
  2. **유연성 증가**: 객체 생성 로직을 서브클래스에서 결정하므로, 새로운 객체 타입을 추가할 때 클라이언트 코드를 수정할 필요가 없습니다.
  3. **단일 책임 원칙 준수**: 객체 생성의 책임을 별도의 클래스(팩토리 클래스)로 분리하여 클래스의 책임을 명확히 합니다.
  4. **제품군 관리 용이**: 관련 제품들을 하나의 팩토리 메서드로 관리할 수 있어, 제품군 관리가 용이합니다.

## 단점

  1. **복잡성 증가**: 클래스의 계층 구조가 깊어지고, 코드의 복잡성이 증가할 수 있습니다.
  2. **구현의 번거로움**: 새로운 제품을 추가할 때마다 새로운 서브클래스를 만들어야 하므로, 코드 작성이 번거로울 수 있습니다.
  3. **성능 저하 가능성**: 서브클래스에서 객체를 생성하므로, 객체 생성 시 성능이 저하될 수 있습니다.

## 예시 코드

* **Product 인터페이스**

```text
interface Product {
    void use();
}
```

* **ConcreteProduct 클래스들**

```java
class ConcreteProductA implements Product {
    @Override
    public void use() {
        System.out.println("Using Product A");
    }
}

class ConcreteProductB implements Product {
    @Override
    public void use() {
        System.out.println("Using Product B");
    }
}
```

* **Creator 클래스**

```text
abstract class Creator {
    public abstract Product factoryMethod();

    public void anOperation() {
        // 생성된 제품을 사용하는 코드
        Product product = factoryMethod();
        product.use();
    }
}
```

* **ConcreteCreator 클래스**

```text
class ConcreteCreatorA extends Creator {
    @Override
    public Product factoryMethod() {
        return new ConcreteProductA();
    }
}

class ConcreteCreatorB extends Creator {
    @Override
    public Product factoryMethod() {
        return new ConcreteProductB();
    }
}
```

* **클라이언트 코드**

```java
public class Client {
    public static void main(String[] args) {
        Creator creatorA = new ConcreteCreatorA();
        creatorA.anOperation();

        Creator creatorB = new ConcreteCreatorB();
        creatorB.anOperation();
    }
}
```

## 구성 요소

  1. **Product (제품)**: 팩토리 메서드가 생성하는 객체의 타입을 정의하는 인터페이스.
  2. **ConcreteProduct (구체 제품)**: Product 인터페이스를 구현하는 구체적인 클래스.
  3. **Creator (생성자)**: 팩토리 메서드를 선언하는 클래스. 구체적인 제품을 반환하는 팩토리 메서드를 정의.
  4. **ConcreteCreator (구체 생성자)**: Creator 클래스를 구현하고 팩토리 메서드를 오버라이드하여 구체 제품을 생성하는 클래스.

## 구성 요소 설명

  1. **Product (제품) :**팩토리 메서드가 생성할 객체의 인터페이스로, use 메서드를 정의합니다.
  2. **ConcreteProduct (구체 제품)**: Product 인터페이스를 구현한 클래스들로, ConcreteProductA와 ConcreteProductB는 각각 use 메서드를 구현
  3. **Creator (생성자)**: 팩토리 메서드인 factoryMethod를 선언하며, anOperation 메서드를 통해 생성된 제품을 사용하는 로직을 포함
  4. **ConcreteCreator (구체 생성자)**: Creator 클래스를 상속받아 factoryMethod를 오버라이드하고, 각각 ConcreteProductA와 ConcreteProductB 객체를 생성

![](/assets/images/posts/2024-08-01-팩토리-메서드-패턴-Factory-Method-Pattern/01.png)

## 관련 패턴

  1. **추상 팩토리 패턴(Abstract Factory Pattern)**
    * 관련된 객체들을 생성하는 인터페이스를 제공하며, 구체적인 클래스는 서브클래스에서 정의합니다. 여러 제품군을 생성해야 하는 경우에 유용하며 팩토리 메서드 패턴은 추상 팩토리 패턴의 구현 방식 중 하나로 사용될 수 있습니다. 추상 팩토리 패턴은 여러 관련 객체를 생성하는데, 각각의 객체 생성에 팩토리 메서드를 사용할 수 있습니다.
  2. **빌더 패턴(Builder Pattern)**
    * 복잡한 객체의 생성 과정을 단계별로 나누어 처리합니다. 동일한 생성 절차에서 서로 다른 표현 결과를 만들 수 있으며 빌더 패턴은 객체 생성의 세밀한 제어가 필요한 경우에 사용되며, 팩토리 메서드 패턴과 함께 복잡한 객체를 생성하는 데 사용될 수 있습니다.
  3. **프로토타입 패턴(Prototype Pattern)**
    * 생성할 객체의 원형(Prototype)을 이용하여 새로운 객체를 생성합니다. 객체를 복사하여 생성하는 방법이다. 팩토리 메서드 패턴이 객체를 새로 생성하는 반면, 프로토타입 패턴은 기존 객체를 복제하여 새로운 객체를 생성합니다. 둘 다 객체 생성에 관한 패턴입니다.
  4. **싱글톤 패턴(Singleton Pattern)**
    * 클래스의 인스턴스가 하나만 생성되도록 보장하며, 이를 전역적으로 접근할 수 있도록 한다. 팩토리 메서드 패턴을 사용하여 싱글톤 객체를 생성하고 관리할 수 있습니다. 팩토리 메서드를 통해 싱글톤 객체를 반환하는 방식으로 구현할 수 있습니다.
  5. **전략 패턴(Strategy Pattern)**
    * 알고리즘 군을 정의하고, 각각을 캡슐화하여 상호 교환 가능하게 합니다. 클라이언트는 알고리즘을 독립적으로 선택할 수 있고 팩토리 메서드 패턴은 객체 생성 전략을 캡슐화하는데 사용될 수 있으며, 생성된 객체가 특정 전략을 구현하도록 할 수 있습니다.
