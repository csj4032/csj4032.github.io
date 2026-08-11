---
title: "브리지 패턴 (Bridge Pattern)"
description: "브리지 패턴(Bridge Pattern)은 구조 패턴 중 하나로, 구현부에서 추상층을 분리하여 서로 독립적으로 변경할 수 있도록 하는 패턴이다. 이 패턴은 다중 상속의 복잡성을 줄이고, 코드의 유연성과 확장성을 높이"
categories:
 - programming
 - design-pattern
source: "https://blog.naver.com/csj4032/223539550437"
---

## 개요

브리지 패턴(Bridge Pattern)은 구조 패턴 중 하나로, 구현부에서 추상층을 분리하여 서로 독립적으로 변경할 수 있도록 하는 패턴이다. 이 패턴은 다중 상속의 복잡성을 줄이고, 코드의 유연성과 확장성을 높이기 위해 사용된다. 브리지 패턴은 특히 시스템이 다차원적인 변화를 겪을 때 유용하다.

## "구현과 추상의 독립을 통해 복잡성을 단순화하고 변화 속에서 유연함을 찾는 것"

브리지 패턴(Bridge Pattern)이 효과적인 상황은 다음과 같습니다:

  1. **구현과 인터페이스를 독립적으로 확장하고자 할 때**
    * 브리지 패턴은 기능 계층과 구현 계층을 분리하여 두 계층을 독립적으로 확장할 수 있게 한다. 예를 들어, 그래픽 라이브러리에서 도형을 그리는 기능과 도형을 실제로 그리는 구현을 분리하여, 도형의 종류를 추가하거나 그리는 방식을 변경할 때 상호 간섭 없이 작업할 수 있다.
  2. **제품군이 다양한 변형을 가질 때**
    * 제품군이 다양한 변형을 가지며 각 변형이 독립적으로 변경될 필요가 있을 때 유용하다. 예를 들어, GUI 프레임워크에서 버튼, 체크박스 등 다양한 위젯이 있고, 각 위젯이 여러 가지 렌더링 방법(예: Windows, macOS, Linux)을 지원해야 할 때 브리지 패턴을 사용하여 위젯과 렌더링 방법을 분리할 수 있다.
  3. **런타임에 구현을 바꾸어야 할 때**
    * 프로그램이 실행 중에 구현 부분을 변경해야 하는 경우 브리지 패턴을 사용하면 쉽게 교체할 수 있습니다. 예를 들어, 데이터베이스 연결을 추상화하고, 런타임에 MySQL, PostgreSQL 등의 구체적인 데이터베이스 구현을 바꾸어 사용할 수 있다.
  4. **복잡한 상속 구조를 피하고 싶을 때**
    * 기능 계층과 구현 계층을 각각 별도로 상속 계층을 구축하면, 클래스 수가 기하급수적으로 증가할 수 있습니다. 브리지 패턴을 사용하면 두 계층을 분리하여 복잡한 상속 구조를 피할 수 있다.

## 장점

  1. **구현과 인터페이스의 분리**:
    * 기능 계층과 구현 계층을 분리하여, 두 계층을 독립적으로 개발하고 확장할 수 있습니다. 이를 통해 기능 변경이 구현에 영향을 미치지 않으며, 구현 변경이 기능에 영향을 미치지 않음
  2. **확장성**:
    * 새로운 기능이나 구현을 추가할 때 기존 코드를 변경할 필요가 없습니다. 새로운 Abstraction과 Implementor를 쉽게 추가할 수 있음
  3. **유연성**:
    * 런타임 시에 구현을 변경할 수 있습니다. 객체의 구성 요소를 동적으로 변경할 수 있어 유연한 설계가 가능
  4. **단일 책임 원칙 준수**:
    * 추상화된 클래스는 고수준의 기능을 담당하고, 구현 클래스는 세부 구현을 담당하여 각 클래스가 단일 책임을 갖도록 한다. 이는 코드의 유지보수성과 이해도를 높임
  5. **코드 중복 감소**:
    * 공통된 구현을 Implementor 계층으로 옮겨 중복 코드를 줄이고, 코드 재사용성을 높일 수 있음

## 단점

  1. **복잡성 증가**:
    * 기능 계층과 구현 계층을 분리하기 때문에 코드의 구조가 복잡해질 수 있습니다. 클래스와 인터페이스의 수가 증가하여 코드가 더 많아지고, 설계가 복잡해질 수 있음
  2. **초기 설계 비용**:
    * 브리지 패턴을 사용하려면 초기 설계 단계에서 더 많은 시간과 노력이 필요합니다. 구현과 추상화의 분리를 고려해야 하므로, 작은 프로젝트나 단순한 시스템에서는 과도한 설계가 될 수 있음
  3. **성능 오버헤드**:
    * 기능 계층과 구현 계층 사이의 간접 호출로 인해 성능 오버헤드가 발생할 수 있습니다. 이는 성능이 중요한 시스템에서는 문제가 될 수 있음

## 예시 코드: 다양한 형태의 메시지 전송 시스템

이메일과 SMS를 통해 메시지를 전송하는 시스템을 만들고자 합니다. 메시지 전송 방식은 여러 가지가 있을 수 있고, 메시지 내용도 여러 가지 형식이 있을 수 있습니다. 이때 브리지 패턴을 사용하여 메시지 전송 방식과 메시지 내용을 분리할 수 있습니다.

```java
public interface MessageSender {
    void sendMessage(String message);
}

public class SMSSender implements MessageSender {
    @Override
    public void sendMessage(String message) {
        System.out.println("Sending SMS: " + message);
    }
}

public class EmailSender implements MessageSender {
    @Override
    public void sendMessage(String message) {
        System.out.println("Sending Email: " + message);
    }
}

public abstract class Message {
    protected MessageSender messageSender;

    protected Message(MessageSender messageSender) {
        this.messageSender = messageSender;
    }

    public abstract void send(String message);
}

public class TextMessage extends Message {

    public TextMessage(MessageSender messageSender) {
        super(messageSender);
    }

    @Override
    public void send(String message) {
        messageSender.sendMessage(message);
    }
}

public class EmailMessage extends Message {

    public EmailMessage(MessageSender messageSender) {
        super(messageSender);
    }

    @Override
    public void send(String message) {
        messageSender.sendMessage(message);
    }
}

public class BridgePatternDemo {
    public static void main(String[] args) {
        MessageSender smsSender = new SMSSender();
        MessageSender emailSender = new EmailSender();

        Message textMessage = new TextMessage(smsSender);
        textMessage.send("Hello via SMS!");

        Message emailMessage = new EmailMessage(emailSender);
        emailMessage.send("Hello via Email!");

        // Message와 MessageSender를 독립적으로 변경 가능
        textMessage = new TextMessage(emailSender);
        textMessage.send("Hello via Email using TextMessage!");

        emailMessage = new EmailMessage(smsSender);
        emailMessage.send("Hello via SMS using EmailMessage!");
    }
}
```

![브리지 패턴 클래스 다이어그램](/assets/images/posts/2024-08-07-브리지-패턴-Bridge-Pattern/01.png)

## 코드 구성 설명

1. MessageSender 인터페이스 (Implementor)
  * MessageSender는 메시지를 전송하는 방식에 대한 인터페이스
  * 이 인터페이스는 메시지를 전송하는 메서드 sendMessage를 정의
  * 구체적인 전송 방식은 이 인터페이스를 구현한 클래스들에서 정의
2. SMSSender 클래스 (ConcreteImplementor)
  * SMSSender 클래스는 MessageSender 인터페이스를 구현하여 SMS로 메시지를 전송하는 구체적인 방법을 정의
  * sendMessage 메서드를 통해 SMS 메시지를 전송
3. EmailSender 클래스 (ConcreteImplementor)
  * EmailSender 클래스는 MessageSender 인터페이스를 구현하여 이메일로 메시지를 전송하는 구체적인 방법을 정의
  * sendMessage 메서드를 통해 이메일 메시지를 전송
4. Message 추상 클래스 (Abstraction)
  * Message는 메시지 전송에 대한 추상화된 개념을 정의하는 추상 클래스입
  * 이 클래스는 MessageSender 타입의 인스턴스를 멤버 변수로 가지며, 생성자를 통해 초기화
  * send 메서드는 구체적인 메시지 전송 방법을 정의하는 추상 메서드
5. TextMessage 클래스 (RefinedAbstraction)
  * TextMessage 클래스는 Message 클래스를 확장한 구체적인 구현체
  * 이 클래스는 텍스트 메시지를 전송하는 방법을 정의
  * send 메서드를 통해 텍스트 메시지를 전송하며, 실제 전송은 messageSender 객체에 위임
6. EmailMessage 클래스 (RefinedAbstraction)
  * EmailMessage 클래스는 Message 클래스를 확장한 구체적인 구현체
  * 이 클래스는 이메일 메시지를 전송하는 방법을 정의
  * send 메서드를 통해 이메일 메시지를 전송하며, 실제 전송은 messageSender 객체에 위임

## 관련 패턴

1. **어댑터 패턴 (Adapter Pattern)**

  * 어댑터 패턴은 기존 클래스의 인터페이스를 다른 인터페이스로 변환하여 호환성을 제공하는 반면, 브리지 패턴은 기능과 구현을 독립적으로 분리하여 확장성을 높힌다. 어댑터 패턴은 주로 기존 코드와의 호환성을 위해 사용되고, 브리지 패턴은 처음부터 설계 시 기능 계층과 구현 계층을 분리한다.

2. **데코레이터 패턴 (Decorator Pattern)**

  * 데코레이터 패턴은 객체에 동적으로 새로운 행동을 추가하는 데 사용되며, 브리지 패턴은 기능과 구현을 분리하여 독립적으로 확장할 수 있게 한다. 데코레이터 패턴은 객체의 기능을 런타임에 추가하거나 변경할 때 사용되고, 브리지 패턴은 기능과 구현을 구조적으로 분리하는 데 중점을 둔다.

3. **퍼사드 패턴 (Facade Pattern)**

  * 퍼사드 패턴은 복잡한 서브시스템을 감추고 단순화된 인터페이스를 제공하여 사용 편의성을 높힌다. 브리지 패턴은 기능 계층과 구현 계층을 분리하여 독립적으로 확장할 수 있게 한다. 퍼사드 패턴은 시스템의 복잡성을 감추는 데 중점을 두고, 브리지 패턴은 기능과 구현을 구조적으로 분리한다.

4. **전략 패턴 (Strategy Pattern)**

  * 전략 패턴은 특정 행동을 정의하는 여러 알고리즘을 캡슐화하고, 필요에 따라 교체할 수 있게 한다. 브리지 패턴은 기능과 구현을 분리하여 각각 독립적으로 확장할 수 있게 한다. 전략 패턴은 런타임에 알고리즘을 교체하는 데 중점을 두고, 브리지 패턴은 기능과 구현을 독립적으로 관리할 수 있게 한다.
