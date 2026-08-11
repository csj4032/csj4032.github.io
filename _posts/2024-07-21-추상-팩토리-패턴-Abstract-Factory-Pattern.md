---
title: "추상 팩토리 패턴 (Abstract Factory Pattern)"
description: "추상 팩토리 패턴은 생성 디자인 패턴 중 하나로, 구체적인 클래스를 지정하지 않고 관련성 있는 객체들의 그룹을 생성할 수 있는 인터페이스를 제공하는 패턴입니다. 이 패턴은 상호 관련되거나 독립적인 여러 객체를 생성해"
categories:
 - programming
 - design-pattern
source: "https://blog.naver.com/csj4032/223520399344"
---

## 개요

추상 팩토리 패턴은 생성 디자인 패턴 중 하나로, 구체적인 클래스를 지정하지 않고 관련성 있는 객체들의 그룹을 생성할 수 있는 인터페이스를 제공하는 패턴입니다. 이 패턴은 상호 관련되거나 독립적인 여러 객체를 생성해야 하는 경우에 유용합니다.

**"관련된 객체들의 군(群)을 생성하기 위한 인터페이스를 제공하며, 구체적인 클래스를 지정하지 않고도 다양한 제품군을 생성할 수 있게 하는 패턴."**

추상 팩토리 패턴(Abstract Factory Pattern)은 다음과 같은 상황에서 사용하면 효과적입니다:

  1. **관련 객체들의 그룹을 생성해야 할 때**:
    * 시스템이 여러 관련된 객체 그룹 중 하나를 선택해서 생성하고자 할 때 유용합니다. 예를 들어, GUI 툴킷에서 여러 테마(예: 윈도우, 맥, 리눅스)를 지원해야 할 경우, 각 테마마다 버튼, 체크박스, 텍스트박스 등을 그룹화하여 생성할 수 있습니다.
  2. **제품군(Product Family)을 지원해야 할 때**:
    * 객체들이 특정 제품군에 속해있으며, 이 제품군이 확장될 가능성이 있을 때 사용합니다. 즉, 새로운 제품군을 추가해야 할 때 기존 코드를 수정하지 않고 새로운 구상 팩토리를 추가하는 것만으로 확장이 가능합니다.
  3. **클라이언트 코드가 구체적인 클래스에 의존하지 않도록 해야 할 때**:
    * 클라이언트 코드가 객체의 생성, 구성, 표현에 대한 구현 세부 사항과 독립적으로 동작해야 할 때 유용합니다. 이렇게 하면 시스템의 유연성과 확장성이 높아집니다.
  4. **여러 객체가 함께 작동해야 할 때**:
    * 특정 제품군에 속하는 객체들이 서로 협력하여 동작해야 할 경우, 추상 팩토리를 사용하면 서로 호환되는 객체들이 생성되도록 보장할 수 있습니다.
  5. **다형성을 극대화하고자 할 때**:
    * 객체 생성 코드가 인터페이스나 추상 클래스와 같은 상위 타입에 의존하도록 하여 다형성을 극대화하고자 할 때 효과적입니다.

## 구성 요소

  1. **추상 팩토리(Abstract Factory)**: 다양한 제품군을 생성하기 위한 인터페이스를 정의합니다.
  2. **구체 팩토리(Concrete Factory)**: 추상 팩토리를 구현하여 특정 제품군에 대한 구체적인 객체를 생성합니다.
  3. **추상 제품(Abstract Product)**: 제품이 가져야 할 인터페이스를 정의합니다.
  4. **구체 제품(Concrete Product)**: 추상 제품 인터페이스를 구현하여 구체적인 객체를 생성합니다.
  5. **클라이언트(Client)**: 추상 팩토리와 추상 제품 인터페이스를 사용하여 구체적인 제품을 생성하고 사용합니다.

## 구성 요소 설명

  * **AbstractFactory**: 제품 객체들을 생성하는 인터페이스를 선언합니다.
  * **ConcreteFactory**: AbstractFactory 인터페이스를 구현하여, 해당되는 제품군의 객체들을 생성합니다.
  * **AbstractProduct**: 생성될 객체들이 공통으로 가지는 인터페이스를 정의합니다.
  * **ConcreteProduct**: AbstractProduct 인터페이스를 구현하여 구체적인 제품을 생성합니다.
  * **Client**: AbstractFactory 인터페이스를 통해 객체를 생성하여 사용합니다.

## 장점

  1. **서로 관련된 객체들을 일관성 있게 생성**: 제품군에 속하는 객체들을 일관되게 생성할 수 있습니다.
  2. **클라이언트 코드에서 구체적인 클래스의 사용을 배제**: 클라이언트는 구체적인 클래스에 의존하지 않고 인터페이스에 의존하게 됩니다.
  3. **새로운 제품군 추가가 용이**: 새로운 제품군을 추가할 때 기존 코드를 변경할 필요 없이 새로운 팩토리 클래스만 추가하면 됩니다.

## 단점

  1. **클래스의 수가 증가**: 패턴을 구현하는 데 필요한 클래스의 수가 증가합니다.
  2. **구현이 복잡할 수 있음**: 다양한 제품군과 팩토리를 관리해야 하므로 복잡도가 증가할 수 있습니다.

## 예시: 문서 생성 애플리케이션

* **추상 팩토리 인터페이스**

```text
interface DocumentFactory {
    Text createText();
    Image createImage();
}
```

* **추상 제품 인터페이스**

```text
interface Text {
    void render();
}

interface Image {
    void render();
}
```

* **구체 제품**

```java
public class HTMLText implements Text {
    public void render() {
        System.out.println("<p>This is HTML text</p>");
    }
}

public class HTMLImage implements Image {
    public void render() {
        System.out.println("<img src='image.jpg'/>");
    }
}

public class PDFText implements Text {
    public void render() {
        System.out.println("This is PDF text");
    }
}

public class PDFImage implements Image {
    public void render() {
        System.out.println("PDF Image: image.jpg");
    }
}

public class WordText implements Text {
    public void render() {
        System.out.println("This is Word text");
    }
}

public class WordImage implements Image {
    public void render() {
        System.out.println("Word Image: image.jpg");
    }
}
```

* **구체 팩토리**

```java
public class HTMLFactory implements DocumentFactory {
    public Text createText() {
        return new HTMLText();
    }
    public Image createImage() {
        return new HTMLImage();
    }
}

public class PDFFactory implements DocumentFactory {
    public Text createText() {
        return new PDFText();
    }
    public Image createImage() {
        return new PDFImage();
    }
}

public class WordFactory implements DocumentFactory {
    public Text createText() {
        return new WordText();
    }
    public Image createImage() {
        return new WordImage();
    }
}
```

* **클라이언트 코드**

```java
public class Client {
    public static void clientCode(DocumentFactory factory) {
        Text text = factory.createText();
        Image image = factory.createImage();

        text.render();
        image.render();
    }

    public static void main(String[] args) {
        System.out.println("Client: Testing client code with the HTML factory:");
        clientCode(new HTMLFactory());

        System.out.println("\nClient: Testing client code with the PDF factory:");
        clientCode(new PDFFactory());

        System.out.println("\nClient: Testing client code with the Word factory:");
        clientCode(new WordFactory());
    }
}
```

![Class Diagram](/assets/images/posts/2024-07-21-추상-팩토리-패턴-Abstract-Factory-Pattern/01.png)

![Use Case](/assets/images/posts/2024-07-21-추상-팩토리-패턴-Abstract-Factory-Pattern/02.png)

## 관련패턴

  * **팩토리 메서드 패턴(Factory Method Pattern):**
    * 추상 팩토리 패턴은 팩토리 메서드 패턴을 사용하여 각 제품 객체를 생성하는 방법을 구체화할 수 있습니다. 추상 팩토리에서 정의된 인터페이스를 구현하는 구체적인 팩토리 클래스들이 개별 제품 생성에 팩토리 메서드를 사용할 수 있습니다.
  * **싱글턴 패턴(Singleton Pattern):**
    * 추상 팩토리 패턴과 함께 사용하면 구체적인 팩토리 클래스의 인스턴스를 하나만 생성하여 여러 곳에서 공유할 수 있습니다. 이는 팩토리 객체의 생성 비용을 줄이고 일관성을 유지하는 데 유용합니다.
  * **빌더 패턴(Builder Pattern):**
    * 빌더 패턴은 복잡한 객체의 생성 과정을 캡슐화합니다. 추상 팩토리 패턴과 함께 사용하면 복잡한 객체의 생성과 관련된 부분을 분리하여 다양한 빌더를 통해 유연하게 객체를 생성할 수 있습니다.
  * **프로토타입 패턴(Prototype Pattern):**
    * 프로토타입 패턴은 객체를 복제하여 새로운 객체를 생성하는 데 사용됩니다. 추상 팩토리 패턴과 함께 사용하면 팩토리가 새로운 객체를 생성하는 대신 프로토타입 객체를 복제하여 반환할 수 있습니다. 이를 통해 객체 생성 비용을 줄일 수 있습니다.
  * **디펜던시 인젝션 패턴(Dependency Injection Pattern):**
    * 추상 팩토리 패턴은 의존성 주입과 함께 사용되어 클라이언트 코드가 구체적인 클래스에 의존하지 않도록 합니다. DI 컨테이너를 통해 필요한 팩토리를 주입받아 객체를 생성하는 방식으로, 시스템의 유연성과 테스트 용이성을 높입니다.
