---
title: "책임 연쇄 패턴 (Chain of Responsibility Pattern)"
description: "책임 연쇄 패턴(Chain of Responsibility Pattern)은 행동(Behavioral) 디자인 패턴 중 하나로, 여러 객체들이 요청을 처리할 기회를 가지도록 하는 패턴입니다. 이 패턴에서는 요청이 처"
categories:
 - programming
 - design-pattern
source: "https://blog.naver.com/csj4032/223568571006"
---

책임 연쇄 패턴(Chain of Responsibility Pattern)은 행동(Behavioral) 디자인 패턴 중 하나로, **여러 객체들이 요청을 처리할 기회를 가지도록** 하는 패턴입니다. 이 패턴에서는 요청이 처리될 때까지 객체의 체인을 따라 전달되며, 각 객체는 요청을 처리할지 여부를 결정합니다. 처리되지 않은 경우, 다음 객체로 요청이 전달됩니다. 이 과정에서 클라이언트는 어떤 객체가 요청을 처리할지 알 필요가 없으며, 요청을 여러 객체가 처리할 수 있습니다.

## "지혜의 릴레이, 각자의 능력으로 문제의 불꽃을 전하며 해결의 빛을 밝히다."

**책임 연쇄 패턴(Chain of Responsibility Pattern)은 다양한 상황에서 유용하게 사용될 수 있습니다:**

  1. **사용자 입력 검증**
    * 웹 애플리케이션이나 데스크탑 애플리케이션에서 사용자 입력을 검증할 때, 입력 데이터가 여러 단계의 검증을 거쳐야 하는 경우가 많습니다. 예를 들어, 입력 값이 null인지 확인하고, 다음으로 데이터 타입이 올바른지 확인하며, 마지막으로 값이 특정 범위 내에 있는지 등을 검증할 수 있다. 책임 연쇄 패턴을 사용하면 각 검증을 처리하는 객체들을 체인으로 연결해, 유연하게 검증 로직을 구성할 수 있다. 로그인 시스템에서 사용자의 입력된 이메일과 비밀번호를 여러 단계로 검증할 때, 각 검증을 책임 연쇄 패턴으로 구성할 수 있다.
  2. **지원 요청 처리 시스템**
    * 고객 지원 요청이 여러 수준의 지원 담당자에게 전달되어 처리되는 상황에 적합하다. 예를 들어, 고객의 요청이 1차 지원팀에 의해 처리되지 않으면, 요청이 자동으로 2차 지원팀으로 전달되고, 그래도 해결되지 않으면 3차 지원팀으로 전달될 수 있다. 고객 문의나 불만 접수 시스템에서, 고객의 문제를 적절한 담당자가 순차적으로 처리할 수 있도록 책임 연쇄 패턴을 사용하여 구성할 수 있다.
  3. **로깅 시스템**
    * 시스템의 로깅을 단계별로 처리해야 할 때, 책임 연쇄 패턴이 유용하다. 예를 들어, 로그 메시지를 생성하면, 먼저 디버그 수준에서 로그를 기록하고, 그다음에 정보 수준에서 기록하며, 마지막으로 오류 수준에서 기록하는 등의 처리가 가능하다. 이러한 경우, 각각의 로그 수준을 처리하는 객체들을 체인으로 연결할 수 있다. 복잡한 애플리케이션에서 다양한 로그 수준을 지원해야 하는 경우, 각 로그 수준을 책임 연쇄 패턴으로 구현할 수 있다.
  4. **권한 관리 시스템**
    * 시스템에서 사용자 요청을 처리할 때, 사용자의 권한을 순차적으로 확인하여 적절한 수준에서 접근을 허용하거나 거부하는 구조에 책임 연쇄 패턴이 사용될 수 있다. 각 권한 수준에 대해 별도의 객체가 요청을 처리하고, 권한이 부족할 경우 다음 권한 수준의 객체로 요청을 넘길 수 있다. 파일 시스템에서 파일에 접근할 때, 사용자의 접근 권한을 단계별로 검토하는 경우에 책임 연쇄 패턴이 유용하다.
  5. **금융 거래 승인 시스템**
    * 금융 시스템에서 거래 승인 절차를 단계별로 수행해야 할 때, 책임 연쇄 패턴을 사용할 수 있다. 예를 들어, 소액 거래는 자동으로 승인되지만, 고액 거래는 관리자의 승인을 받아야 하는 시스템을 책임 연쇄 패턴으로 구현할 수 있다. 은행에서 고객이 특정 금액 이상의 거래를 요청했을 때, 자동 승인, 부서 관리자 승인, 최고 관리자의 최종 승인 등의 절차를 구현할 수 있다.

## 장점

  1. **객체 간 결합도 감소**
    * 책임 연쇄 패턴은 요청을 처리할 객체를 명시적으로 지정하지 않고, 여러 객체 중 하나가 처리하게 한다. 클라이언트는 요청의 처리자가 누구인지 알 필요가 없으며, 처리 객체들 간의 결합도가 낮아진다. 이는 시스템의 유연성을 높이고, 유지보수를 용이하게 만든다.
  2. **요청 처리의 유연성**
    * 이 패턴을 사용하면 여러 객체가 동일한 요청을 처리할 수 있으며, 각 객체가 요청을 처리하거나 다음 객체로 넘길 수 있다. 요청 처리의 순서나 방식이 변경될 수 있으며, 새로운 처리자를 추가하거나 제거하기 쉽다.
  3. **코드의 재사용성 향상**
    * 각 처리자가 독립적으로 요청을 처리하므로, 동일한 요청 처리 로직을 여러 곳에서 재사용할 수 있다. 이를 통해 코드 중복을 줄이고, 시스템의 유지보수성을 높일 수 있다.
  4. **확장성이 좋음**
    * 새로운 처리자를 쉽게 추가할 수 있다. 기존 코드에 영향을 주지 않고 체인에 새로운 객체를 추가하거나 기존 객체를 제거할 수 있어, 시스템의 확장성이 높다.

## 단점

  1. **디버깅과 트러블슈팅의 어려움**
    * 요청이 여러 객체를 통해 전달되므로, 요청이 어디서 처리되었는지 추적하기 어렵다. 이는 디버깅과 트러블슈팅을 복잡하게 만들 수 있다.
  2. **처리자의 누락 가능성**
    * 요청이 체인의 끝까지 전달되었음에도 불구하고 처리되지 않을 수 있다. 이는 특정 요청에 대해 적절한 처리자가 없을 때 발생할 수 있으며, 이 경우 요청이 처리되지 않은 채 남게 된다.
  3. **과도한 객체 생성**
    * 각 처리자가 독립적으로 구현되므로, 처리할 요청이 많아지면 많은 수의 객체가 생성될 수 있다. 이는 시스템의 성능에 영향을 미칠 수 있으며, 특히 자원이 제한된 환경에서 문제가 될 수 있다.
  4. **적절한 처리자 순서 설정의 어려움**
    * 체인 내의 처리자 순서를 잘못 설정하면, 특정 요청이 의도한 처리자에게 도달하지 못할 수 있다. 이는 요청 처리의 논리를 복잡하게 만들고, 실수로 인한 오류 발생 가능성을 높다.

**책임 연쇄 패턴(Chain of Responsibility Pattern) 예제**:

로그 메시지를 처리하는 시스템을 구현합니다. 로그 메시지는 서로 다른 중요도(디버그, 정보, 오류)에 따라 처리 각 로그 수준에 대해 별도의 처리자를 구현

```java
// Handler 인터페이스
abstract class Logger {
    public static int DEBUG = 1;
    public static int INFO = 2;
    public static int ERROR = 3;

    protected int level;

    // 다음 책임 처리자를 가리킵니다.
    protected Logger nextLogger;

    public void setNextLogger(Logger nextLogger) {
        this.nextLogger = nextLogger;
    }

    public void logMessage(int level, String message) {
        if (this.level <= level) {
            write(message);
        }
        if (nextLogger != null) {
            nextLogger.logMessage(level, message);
        }
    }

    abstract protected void write(String message);
}

// Concrete Handler 클래스
class DebugLogger extends Logger {
    public DebugLogger(int level) {
        this.level = level;
    }

    @Override
    protected void write(String message) {
        System.out.println("Debug Logger: " + message);
    }
}

class InfoLogger extends Logger {
    public InfoLogger(int level) {
        this.level = level;
    }

    @Override
    protected void write(String message) {
        System.out.println("Info Logger: " + message);
    }
}

class ErrorLogger extends Logger {
    public ErrorLogger(int level) {
        this.level = level;
    }

    @Override
    protected void write(String message) {
        System.out.println("Error Logger: " + message);
    }
}

// 클라이언트 코드
public class ChainPatternDemo {
    private static Logger getChainOfLoggers() {
        Logger errorLogger = new ErrorLogger(Logger.ERROR);
        Logger infoLogger = new InfoLogger(Logger.INFO);
        Logger debugLogger = new DebugLogger(Logger.DEBUG);

        errorLogger.setNextLogger(infoLogger);
        infoLogger.setNextLogger(debugLogger);

        return errorLogger;
    }

    public static void main(String[] args) {
        Logger loggerChain = getChainOfLoggers();

        loggerChain.logMessage(Logger.DEBUG, "This is a debug level message.");
        loggerChain.logMessage(Logger.INFO, "This is an info level message.");
        loggerChain.logMessage(Logger.ERROR, "This is an error level message.");
    }
}
```

![](/assets/images/posts/2024-09-01-책임-연쇄-패턴-Chain-of-Responsibility-Pattern/01.png)

## 코드 설명

  1. **Logger 클래스 (Handler):**
    * Logger 클래스는 요청을 처리하거나 다음 객체로 전달하는 역할을 한다. 이 클래스는 logMessage() 메서드를 통해 로그 메시지를 처리하고, 처리할 수 없을 경우 다음 처리자에게 요청을 전달한다. 이 클래스는 추상 메서드 write()를 정의하여 각 수준에서 로그 메시지를 기록하는 방법을 구체적으로 구현하도록 한다.
  2. **DebugLogger, InfoLogger, ErrorLogger 클래스 (Concrete Handlers):**
    * DebugLogger, InfoLogger, ErrorLogger 클래스는 각각 로그 수준에 맞는 처리를 수행한다. 각 클래스는 write() 메서드를 구현하여 해당 로그 메시지를 콘솔에 출력한다.
  3. **ChainPatternDemo 클래스 (Client):**
    * ChainPatternDemo 클래스는 클라이언트 코드로, 로그 처리 체인을 구성하고, 다양한 수준의 로그 메시지를 전달하여 체인이 올바르게 작동하는지 확인한다.
  4. **getChainOfLoggers() 메서드:**
    * 이 메서드는 로그 처리 체인을 구성한다. 오류 로그는 가장 먼저 처리되고, 그다음 정보 로그, 마지막으로 디버그 로그가 처리된다. 요청은 체인을 따라 내려가며, 적절한 처리자가 메시지를 처리한다.

## 관련패턴

  1. **커맨드 패턴 (Command Pattern)**
    * 커맨드 패턴은 요청을 객체로 캡슐화하여, 요청에 대한 매개변수화, 요청 큐잉, 로깅, 실행 취소 등을 가능하게 하는 패턴입니다. 커맨드 패턴과 책임 연쇄 패턴은 종종 함께 사용되며, 커맨드 패턴에서 생성된 명령 객체를 책임 연쇄 패턴의 체인으로 전달할 수 있다.
  2. **데코레이터 패턴 (Decorator Pattern)**
    * 데코레이터 패턴은 객체에 추가적인 기능을 동적으로 추가할 수 있도록 하는 패턴이다. 이 패턴과 책임 연쇄 패턴은 모두 객체에 추가적인 행동을 더하는 데 사용될 수 있다.
  3. **인터프리터 패턴 (Interpreter Pattern)**
    * 인터프리터 패턴은 특정 도메인 언어의 문법을 해석하는 패턴이다. 이 패턴은 주로 책임 연쇄 패턴과 결합되어, 각 문법 규칙이 체인 내의 객체로 표현되고, 요청이 해당 규칙에 맞는 객체로 전달되어 해석될 수 있다.
  4. **옵저버 패턴 (Observer Pattern)**
    * 옵저버 패턴은 객체의 상태 변화에 따라 자동으로 특정 행동을 수행하는 객체들이 연결되는 패턴이다. 책임 연쇄 패턴과 옵저버 패턴은 요청 처리의 흐름을 동적으로 제어하는 데 함께 사용할 수 있다.
  5. **템플릿 메서드 패턴 (Template Method Pattern)**
    * 템플릿 메서드 패턴은 알고리즘의 구조를 정의하고, 알고리즘의 일부 단계를 서브클래스에서 구현할 수 있게 하는 패턴이다. 책임 연쇄 패턴에서 각 처리자가 요청을 처리하는 방식이 유사할 때, 템플릿 메서드 패턴을 사용해 공통 부분을 정의하고 각 처리자가 세부 사항을 구현할 수 있다.
