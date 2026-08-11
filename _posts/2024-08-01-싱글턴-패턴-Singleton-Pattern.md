---
title: "싱글턴 패턴 (Singleton Pattern)"
description: "싱글턴 패턴(Singleton Pattern)은 클래스의 인스턴스가 오직 하나만 생성되도록 보장하며, 이 인스턴스에 대한 전역적인 접근점을 제공합니다. 이를 통해 애플리케이션 전체에서 공통된 자원을 공유하고 관리할 "
categories:
 - programming
 - design-pattern
source: "https://blog.naver.com/csj4032/223533379183"
---

싱글턴 패턴(Singleton Pattern)은 클래스의 인스턴스가 오직 하나만 생성되도록 보장하며, 이 인스턴스에 대한 전역적인 접근점을 제공합니다. 이를 통해 애플리케이션 전체에서 공통된 자원을 공유하고 관리할 수 있습니다.

**"싱글턴 패턴은 유일무이한 존재가 모든 곳에 동시에 존재하며, 그 자체로 완전함을 이루는 프로그래밍의 철학적 표현"**

싱글턴 패턴을 사용하기 좋은 상황은 다음과 같습니다:

  1. **애플리케이션에서 하나의 인스턴스만 필요할 때**
    * 예: 애플리케이션 설정 관리, 로깅 클래스, 캐시 관리 등. 이러한 경우 하나의 인스턴스가 여러 곳에서 공유되며 동일한 상태를 유지
  2. **공통된 자원에 대한 접근이 필요할 때**
    * 예: 데이터베이스 연결 풀. 데이터베이스 연결을 관리하는 객체는 하나만 존재해야 하며, 이를 통해 여러 스레드가 동시에 접근
  3. **전역적인 접근이 필요할 때**
    * 예: 애플리케이션 내의 전역 설정 객체. 설정 객체는 애플리케이션 전체에서 접근할 수 있어야 하며, 변경된 설정이 즉시 반영
  4. **상태를 공유해야 할 때**
    * 예: 상태가 유지되어야 하는 클래스. 게임의 스코어보드, 사용자 세션 관리 등과 같이 상태가 공유되어야 하는 경우에 유용
  5. **리소스를 효율적으로 관리할 때**
    * 예: 프린터 스풀러. 프린터 스풀러는 하나만 존재해야 하며, 여러 클라이언트가 프린터 작업을 요청할 때 이를 관리

## 장점

  1. **인스턴스가 하나임을 보장**: 애플리케이션 전체에서 하나의 인스턴스만 존재하게 하여 자원의 낭비를 줄임
  2. **전역 접근**: 어디서든 동일한 인스턴스에 접근할 수 있어 데이터를 공유하거나 설정을 유지하는 데 유용
  3. **제어된 인스턴스 생성**: 인스턴스 생성 시점을 제어할 수 있어 리소스 관리를 효율적으로 할 수 있음

## 단점

  1. **테스트 어려움**: 싱글턴 인스턴스를 모의 객체(mock)로 대체하기 어려워 테스트가 복잡해질 수 있음
  2. **전역 상태**: 전역 상태를 유지하기 때문에, 잘못 사용하면 프로그램의 복잡성을 증가시키고 디버깅을 어렵게 만들 수 있음
  3. **멀티스레드 문제**: 멀티스레드 환경에서 동기화 문제를 일으킬 수 있어 적절한 동기화 메커니즘이 필요

```java
public class Singleton {
    // 유일한 인스턴스를 위한 정적 변수를 선언
    private static Singleton instance;

    // private 생성자를 통해 외부에서 인스턴스 생성을 금지
    private Singleton() {}

    // 유일한 인스턴스를 반환하는 정적 메서드
    public static Singleton getInstance() {
        if (instance == null) {
            // 멀티스레드 환경에서 안전하게 동작하도록 동기화 처리
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }

    // 예시 메서드
    public void showMessage() {
        System.out.println("Hello, I am a Singleton!");
    }
}

public class Main {
    public static void main(String[] args) {
        // 유일한 인스턴스를 가져와서 메서드 호출
        Singleton singleton = Singleton.getInstance();
        singleton.showMessage();
    }
}
```

## 구성 요소

  1. **Private Static Instance**
    * 클래스의 유일한 인스턴스를 저장하는 정적 변수, 클래스 외부에서 접근할 수 없도록 하여 인스턴스가 오직 하나만 생성되도록 보장
  2. **Private Constructor**
    * 클래스 외부에서 인스턴스를 생성할 수 없도록 하는 비공개 생성자, 새로운 인스턴스 생성을 제한하여 클래스의 유일한 인스턴스만 사용
  3. **Public Static Method (getInstance)**
    * 유일한 인스턴스를 반환하는 정적 메서드, 인스턴스가 존재하지 않으면 생성하고, 이미 존재하면 기존 인스턴스를 반환 멀티스레드 환경에서는 동기화를 통해 안전하게 인스턴스를 생성

![](/assets/images/posts/2024-08-01-싱글턴-패턴-Singleton-Pattern/01.png)

## 예시 코드: 추상 팩토리 패턴과 싱글턴 패턴의 결합

```java
// Abstract Factory
interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

// Concrete Factory for Windows
class WinFactory implements GUIFactory {
    @Override
    public Button createButton() {
        return new WinButton();
    }

    @Override
    public Checkbox createCheckbox() {
        return new WinCheckbox();
    }
}

// Concrete Factory for MacOS
class MacFactory implements GUIFactory {
    @Override
    public Button createButton() {
        return new MacButton();
    }

    @Override
    public Checkbox createCheckbox() {
        return new MacCheckbox();
    }
}

// Singleton Manager for Factories
public class FactoryManager {
    private static FactoryManager instance;
    private GUIFactory factory;

    private FactoryManager() {
        // default to Windows factory
        factory = new WinFactory();
    }

    public static FactoryManager getInstance() {
        if (instance == null) {
            synchronized (FactoryManager.class) {
                if (instance == null) {
                    instance = new FactoryManager();
                }
            }
        }
        return instance;
    }

    public void setFactory(GUIFactory factory) {
        this.factory = factory;
    }

    public GUIFactory getFactory() {
        return factory;
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        FactoryManager factoryManager = FactoryManager.getInstance();
        GUIFactory factory = factoryManager.getFactory();
        
        Button button = factory.createButton();
        button.paint();

        Checkbox checkbox = factory.createCheckbox();
        checkbox.paint();
    }
}
```

![추상 팩토리 패턴과 싱글턴 패턴의 결합](/assets/images/posts/2024-08-01-싱글턴-패턴-Singleton-Pattern/02.png)

## 관련 패턴

1. **추상 팩토리 패턴 (Abstract Factory Pattern)**

  * 추상 팩토리 패턴은 관련 객체들의 군을 생성하기 위한 인터페이스를 제공하며, 구체적인 클래스는 서브클래스에서 정의, 싱글턴 패턴을 사용하여 추상 팩토리의 인스턴스를 하나만 생성하도록 할 수있고 이를 통해 전역적으로 공유되는 팩토리 객체를 보장할 수 있음

2. **팩토리 메서드 패턴 (Factory Method Pattern)**

  * 팩토리 메서드 패턴은 객체 생성을 서브클래스에 위임하는 패턴, 싱글턴 패턴은 팩토리 메서드 패턴과 함께 사용되어 특정 클래스의 인스턴스를 하나만 생성하고 관리할 수 있음

3. **빌더 패턴 (Builder Pattern)**

  * 설명: 빌더 패턴은 복잡한 객체를 생성하는 과정을 단계별로 나누어 처리하는 패턴, 빌더 패턴을 싱글턴으로 구현하여, 복잡한 객체 생성 로직을 전역에서 단 하나의 빌더 인스턴스로 관리할 수 있음

4. **프로토타입 패턴 (Prototype Pattern)**

  * 프로토타입 패턴은 기존 객체를 복제하여 새로운 객체를 생성하는 패턴, 싱글턴 패턴은 인스턴스가 하나만 존재하는 것을 보장하는 반면, 프로토타입 패턴은 인스턴스를 복제합니다. 두 패턴은 객체 생성 방식에서 차이가 있지만, 필요에 따라 함께 사용될 수 있음

5. **퍼사드 패턴 (Facade Pattern)**

  * 설명: 퍼사드 패턴은 복잡한 시스템에 대한 간단한 인터페이스를 제공하는 패턴, 퍼사드 객체를 싱글턴으로 구현하여, 시스템 전체에서 하나의 퍼사드 인스턴스만 사용하도록 할 수 있음

6.**상태 패턴 (State Pattern)**

  * 상태 패턴은 객체의 상태에 따라 다른 행동을 수행하는 패턴, 싱글턴 패턴을 사용하여 상태 객체를 하나만 생성하고 공유하여, 전역 상태 관리에 사용될 수 있음
