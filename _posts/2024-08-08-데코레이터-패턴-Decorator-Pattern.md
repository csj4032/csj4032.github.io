---
title: "데코레이터 패턴 (Decorator Pattern)"
description: "데코레이터 패턴은 객체에 동적으로 새로운 기능을 추가하기 위한 구조적 디자인 패턴이다. 이 패턴은 상속을 사용하지 않고도 객체의 기능을 확장할 수 있도록 해준다. 데코레이터 패턴은 원래 객체를 감싸는 방식으로 기능을"
categories:
 - programming
 - design-pattern
source: "https://blog.naver.com/csj4032/223540872276"
---

## 개요

데코레이터 패턴은 객체에 동적으로 새로운 기능을 추가하기 위한 구조적 디자인 패턴이다. 이 패턴은 상속을 사용하지 않고도 객체의 기능을 확장할 수 있도록 해준다. 데코레이터 패턴은 원래 객체를 감싸는 방식으로 기능을 추가하며, 이 감싸는 객체를 데코레이터라고 부른다.

## "겉모습은 변해도 본질은 그대로"

이 패턴을 사용하기 좋은 상황은 다음과 같습니다:

  1. **객체에 다양한 기능을 동적으로 추가하고 싶은 경우**:
    * 실행 시간에 객체의 기능을 유연하게 추가하거나 변경해야 하는 경우에 적합합니다. 예를 들어, 텍스트 편집기에서 다양한 텍스트 서식(글꼴, 색상, 크기 등)을 동적으로 적용해야 하는 경우.
  2. **상속 대신 조합을 통해 기능 확장을 원할 때**:
    * 상속을 사용하면 클래스가 복잡해지고, 다중 상속이 불가능한 언어에서는 여러 기능을 결합하기 어려워집니다. 데코레이터 패턴은 상속 대신 객체 조합을 통해 기능을 확장함
  3. **기능의 조합을 다양하게 구성해야 할 때**:
    * 여러 기능을 조합하여 다양한 조합의 객체를 생성해야 하는 경우에 유용합니다. 예를 들어, 다양한 종류의 보고서(서식 추가, 통계 추가 등)를 생성해야 하는 경우
  4. **기존 클래스의 수정 없이 새로운 기능을 추가하고 싶을 때**:
    * 기존 클래스의 코드를 수정하지 않고 새로운 기능을 추가해야 할 때 적합합니다. 이는 개방-폐쇄 원칙(OCP: Open/Closed Principle)을 준수하는 설계 방식
  5. **객체의 주요 기능과 추가 기능을 분리하여 관리하고 싶을 때**:
    * 객체의 핵심 기능과 추가 기능을 분리하여 각각 독립적으로 관리하고 싶을 때 사용합니다. 이는 단일 책임 원칙(SRP: Single Responsibility Principle)을 준수하는 설계 방식

## 장점

  1. **객체의 기능을 동적으로 추가 가능**:
    * 데코레이터 패턴을 사용하면 실행 시간에 객체에 새로운 기능을 유연하게 추가할 수 있고 이는 컴파일 시점에 기능을 확정짓지 않아도 되므로, 다양한 상황에 대처할 수 있음
  2. **유연한 구조**:
    * 데코레이터를 여러 개 중첩하여 사용할 수 있으므로, 다양한 기능을 조합하여 복잡한 기능을 구현할 수 있고 이는 상속을 통한 기능 확장보다 훨씬 유연
  3. **개방-폐쇄 원칙 준수**:
    * 클래스의 기존 코드를 수정하지 않고도 새로운 기능을 추가할 수 있으므로, 개방-폐쇄 원칙(OCP: Open/Closed Principle)을 준수할 수 있음
  4. **단일 책임 원칙 준수**:
    * 각 데코레이터는 독립적인 기능을 추가하므로, 단일 책임 원칙(SRP: Single Responsibility Principle)을 준수할 수 있으며 이는 각 클래스가 하나의 책임만 가지도록 설계하는 원칙임
  5. **재사용성 증가**:
    * 데코레이터는 여러 객체에 걸쳐 재사용될 수 있다. 예를 들어, 텍스트에 색상을 추가하는 데코레이터는 다양한 텍스트 객체에 재사용될 수 있음
  6. **기능의 조합 가능**:
    * 여러 데코레이터를 조합하여 다양한 기능을 구현할 수 있으며 이는 상속을 통해 기능을 확장하는 것보다 훨씬 더 많은 조합을 가능하게 함

## 단점

  1. **많은 작은 객체 생성**:
    * 데코레이터 패턴을 많이 사용하면 객체의 수가 증가하여 시스템의 복잡성이 증가할 수 있고 각 데코레이터는 새로운 객체를 생성하므로, 객체 관리가 어려워질 수 있음
  2. **복잡성 증가**:
    * 데코레이터를 많이 중첩해서 사용하면 코드의 복잡성이 증가하고 이는 코드의 가독성을 떨어뜨리고, 유지보수를 어렵게 만들 수 있음
  3. **디버깅 어려움**:
    * 데코레이터를 중첩해서 사용하면 객체의 실행 흐름을 추적하기 어려워 디버깅이 복잡해질 수 있으며 특히, 많은 데코레이터가 적용된 경우에는 어떤 데코레이터가 어떤 기능을 추가했는지 파악하기 어려울 수 있음
  4. **객체 식별의 어려움**:
    * 데코레이터를 사용하면 원래 객체와 데코레이터 객체를 구분하기 어려울 수 있으며 이는 특정 기능이 어디서 추가되었는지 파악하기 어려울 수 있음
  5. **상속을 통한 접근 제한 문제**:
    * 데코레이터 패턴은 상속을 사용하지 않기 때문에, 상속을 통해 접근해야 하는 protected 멤버에 접근할 수 없고 이는 데코레이터 패턴을 사용할 때, 객체의 내부 상태에 접근해야 하는 경우 문제를 일으킬 수 있음

## 예제 코드와 함께 설명:

```java
// Component 인터페이스
interface Text {
    String getContent();
}

// ConcreteComponent 클래스
class PlainText implements Text {
    private String content;

    public PlainText(String content) {
        this.content = content;
    }

    @Override
    public String getContent() {
        return content;
    }
}

// Decorator 클래스
abstract class TextDecorator implements Text {
    protected Text decoratedText;

    public TextDecorator(Text decoratedText) {
        this.decoratedText = decoratedText;
    }

    @Override
    public String getContent() {
        return decoratedText.getContent();
    }
}

// Bold 데코레이터 클래스
class BoldText extends TextDecorator {
    public BoldText(Text decoratedText) {
        super(decoratedText);
    }

    @Override
    public String getContent() {
        return "<b>" + decoratedText.getContent() + "</b>";
    }
}

// Italic 데코레이터 클래스
class ItalicText extends TextDecorator {
    public ItalicText(Text decoratedText) {
        super(decoratedText);
    }

    @Override
    public String getContent() {
        return "<i>" + decoratedText.getContent() + "</i>";
    }
}

// Underline 데코레이터 클래스
class UnderlineText extends TextDecorator {
    public UnderlineText(Text decoratedText) {
        super(decoratedText);
    }

    @Override
    public String getContent() {
        return "<u>" + decoratedText.getContent() + "</u>";
    }
}

// FontSize 데코레이터 클래스
class FontSizeDecorator extends TextDecorator {
    private int fontSize;

    public FontSizeDecorator(Text decoratedText, int fontSize) {
        super(decoratedText);
        this.fontSize = fontSize;
    }

    @Override
    public String getContent() {
        return "<span style='font-size:" + fontSize + "px;'>" + decoratedText.getContent() + "</span>";
    }
}

// TextColor 데코레이터 클래스
class TextColorDecorator extends TextDecorator {
    private String color;

    public TextColorDecorator(Text decoratedText, String color) {
        super(decoratedText);
        this.color = color;
    }

    @Override
    public String getContent() {
        return "<span style='color:" + color + ";'>" + decoratedText.getContent() + "</span>";
    }
}

public class DecoratorPatternExample {
    public static void main(String[] args) {
        Text plainText = new PlainText("Hello, World!");

        // 여러 데코레이터를 중첩하여 텍스트에 다양한 서식을 적용합니다.
        Text boldText = new BoldText(plainText);
        Text italicText = new ItalicText(boldText);
        Text underlinedText = new UnderlineText(italicText);
        Text coloredText = new TextColorDecorator(underlinedText, "blue");
        Text sizedText = new FontSizeDecorator(coloredText, 16);

        System.out.println("Plain Text: " + plainText.getContent());
        System.out.println("Bold Text: " + boldText.getContent());
        System.out.println("Italic and Bold Text: " + italicText.getContent());
        System.out.println("Underlined, Italic, and Bold Text: " + underlinedText.getContent());
        System.out.println("Colored, Underlined, Italic, and Bold Text: " + coloredText.getContent());
        System.out.println("Sized, Colored, Underlined, Italic, and Bold Text: " + sizedText.getContent());
    }
}
```

![](/assets/images/posts/2024-08-08-데코레이터-패턴-Decorator-Pattern/01.png)

## 코드 설명

  1. **Component 인터페이스 (Text)**: 모든 텍스트 객체가 구현해야 하는 getContent 메서드를 정의
  2. **ConcreteComponent 클래스 (PlainText)**: 기본 텍스트 객체로, 실제 텍스트 내용을 저장하고 getContent 메서드를 구현
  3. **Decorator 클래스 (TextDecorator)**: Text 인터페이스를 구현하는 추상 클래스 이 클래스는 다른 텍스트 객체를 감싸고 추가 기능을 제공할 수 있는 기본 구조를 정의
  4. **ConcreteDecorator 클래스 (BoldText, ItalicText, UnderlineText, FontSizeDecorator, TextColorDecorator)**: TextDecorator를 확장하여 원래 텍스트에 다양한 서식을 추가하는 구체적인 데코레이터 각 클래스는 getContent 메서드를 오버라이드하여 텍스트에 서식을 적용
  5. **클라이언트 코드 (DecoratorPatternExample)**: 다양한 데코레이터를 조합하여 텍스트에 서식을 동적으로 추가하고, 최종 결과를 출력

## 관련 패턴

  1. **어댑터(Adapter) 패턴**
    * 어댑터 패턴과 데코레이터 패턴 모두 객체의 인터페이스를 변경하여 클라이언트 코드에서 사용할 수 있도록 한다. 그러나 어댑터 패턴은 인터페이스 변환에 중점을 두고, 데코레이터 패턴은 기능 추가에 중점을 둠
  2. **컴포지트(Composite) 패턴**
    * 데코레이터 패턴과 컴포지트 패턴은 모두 재귀적 구조를 사용하며 컴포지트 패턴은 객체들의 계층 구조를 만들고, 데코레이터 패턴은 객체에 추가 기능을 동적으로 추가하는 데 사용됨
  3. **프록시(Proxy) 패턴**
    * 프록시 패턴과 데코레이터 패턴은 모두 다른 객체를 감싸는 구조를 가지고 있고 프록시 패턴은 접근 제어와 관련된 문제를 해결하는 데 사용되며, 데코레이터 패턴은 기능 추가에 중점을 둠
  4. **체인 오브 책임(Chain of Responsibility) 패턴**
    * 데코레이터 패턴과 마찬가지로, 체인 오브 책임 패턴은 객체의 기능을 확장하거나 수정하는 데 사용며 두 패턴 모두 요청을 처리하는 객체들을 연결하는 구조를 사용함
  5. **전략(Strategy) 패턴**
    * 데코레이터 패턴과 전략 패턴은 둘 다 객체의 동작을 변경할 수 있고 전략 패턴은 알고리즘을 변경하는 데 중점을 두고, 데코레이터 패턴은 객체에 새로운 기능을 추가하는 데 중점을 둠
  6. **퍼사드(Facade) 패턴**
    * 퍼사드 패턴은 시스템의 복잡성을 숨기기 위해 사용되며, 데코레이터 패턴은 객체의 기능을 확장하기 위해 사용되며 퍼사드 패턴과 데코레이터 패턴을 함께 사용하여 복잡한 시스템의 인터페이스를 단순화하면서도 기능을 확장할 수 있음
  7. **플라이웨이트(Flyweight) 패턴**
    * 데코레이터 패턴과 플라이웨이트 패턴은 모두 객체의 메모리 사용을 최적화하는 데 도움을 줄 수 있고 데코레이터 패턴을 사용하여 객체의 기능을 확장하면서도 플라이웨이트 패턴을 사용하여 메모리 사용을 줄일 수 있음
