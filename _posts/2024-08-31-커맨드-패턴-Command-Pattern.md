---
title: "커맨드 패턴 (Command Pattern)"
description: "커맨드 패턴(Command Pattern)은 행동(Behavioral) 디자인 패턴 중 하나로, 요청을 객체로 캡슐화하여 클라이언트가 요청에 대한 매개변수화, 요청 큐잉, 로깅, 실행 취소(Undo) 등의 기능을 추"
categories:
 - programming
 - design-pattern
source: "https://blog.naver.com/csj4032/223567410573"
---

커맨드 패턴(Command Pattern)은 행동(Behavioral) 디자인 패턴 중 하나로, **요청을 객체로 캡슐화하여** 클라이언트가 요청에 대한 매개변수화, 요청 큐잉, 로깅, 실행 취소(Undo) 등의 기능을 추가할 수 있도록 합니다. 이 패턴은 **요청을 수행하는 객체와 요청을 생성하는 객체를 분리**하여, 클라이언트가 요청의 구체적인 내용을 알 필요 없이 요청을 수행할 수 있게 합니다.

## "의지의 씨앗, 행동의 그릇에 담겨 시간과 공간을 초월하여 꽃피우다."

## 커맨드 패턴(Command Pattern)은 다양한 상황에서 유용하게 사용될 수 있습니다:

  1. **요청을 매개변수화해야 할 때:**
    * 클라이언트가 어떤 명령을 수행할지 나중에 결정할 수 있도록, 요청을 매개변수화해야 하는 경우에 커맨드 패턴이 유용하다. 예를 들어, 작업을 큐에 넣거나, 실행 취소(Undo) 기능을 구현할 때 각 명령을 객체로 캡슐화하여 처리할 수 있다. 리모컨의 버튼을 누르면 실행할 명령을 여러 개 설정해둘 수 있는 가전 제품 제어 시스템에서 유용하게 사용된다.
  2. **작업의 실행 취소(Undo) 기능이 필요한 경우:**
    * 사용자가 실행한 작업을 취소할 수 있도록 해야 할 때, 커맨드 패턴이 특히 유용하다. 각 명령 객체에 대해 undo() 메서드를 구현하면, 작업을 취소할 때 이전 상태로 쉽게 되돌릴 수 있다. 텍스트 에디터에서 작업을 취소하는 기능을 구현할 때, 커맨드 패턴을 사용하여 사용자가 수행한 모든 명령을 추적하고 되돌릴 수 있다.
  3. **작업을 큐에 저장하거나 스케줄링해야 할 때:**
    * 명령을 큐에 저장하거나 나중에 실행되도록 스케줄링해야 할 때 커맨드 패턴이 유용하다. 작업이 언제든지 실행되도록 스케줄링되거나, 특정 시점에 명령이 큐에서 순차적으로 처리될 수 있다. 이메일 시스템에서 특정 시간에 발송될 이메일을 큐에 저장해두었다가 그 시간이 되면 발송하는 기능을 구현할 때 사용할 수 있다.
  4. **클라이언트와 작업 수행 객체 간의 결합도를 줄여야 할 때:**
    * 명령을 캡슐화하여 클라이언트가 명령의 구체적인 수행 방법에 대해 알 필요가 없게 만든다. 이를 통해 클라이언트와 작업을 수행하는 객체 간의 결합도를 낮출 수 있다. GUI 버튼이 다양한 명령을 실행하도록 구성될 때, 버튼과 실행할 명령 간의 결합을 줄이기 위해 커맨드 패턴을 사용할 수 있다.
  5. **작업 로그 기록 및 재실행이 필요할 때:**
    * 시스템에서 수행된 작업을 로그로 남기고, 나중에 이를 재실행하거나 분석할 필요가 있을 때 커맨드 패턴이 유용하다. 명령 객체를 사용하여 작업을 기록하고, 필요할 때 재실행할 수 있다. 은행 거래 시스템에서 모든 거래를 기록해두고 필요 시 재실행하거나 복원할 수 있는 기능을 구현할 때 사용된다.

## 장점

  1. **요청 캡슐화로 클라이언트와 서버의 분리**:
    * 커맨드 패턴은 명령(요청)을 객체로 캡슐화하여, 클라이언트와 요청의 수신자(서버) 간의 결합도를 낮춘다. 클라이언트는 명령의 실행 방법을 알 필요가 없으며, 수신자는 클라이언트에 의해 호출된 명령을 받아서 처리합니다. 이를 통해 시스템의 유연성과 확장성이 높아진다.
  2. **작업의 실행 취소 및 재실행 기능 구현**:
    * 커맨드 패턴은 명령을 객체로 캡슐화함으로써, 작업의 실행 취소(Undo)와 재실행(Redo) 기능을 쉽게 구현할 수 있다. 각 명령 객체에 undo() 메서드를 추가하여, 명령을 되돌리거나 다시 수행할 수 있다.
  3. **작업의 큐잉 및 로깅이 용이**:
    * 커맨드 패턴을 사용하면 명령을 큐에 넣어 나중에 실행하거나, 명령을 로그로 기록하여 나중에 분석하거나 재실행할 수 있다. 이는 특히 작업을 지연 실행하거나 스케줄링해야 하는 시스템에서 유용하다.
  4. **새로운 명령 추가 시 시스템 확장성 용이**:
    * 커맨드 패턴은 새로운 명령을 추가할 때 기존 코드에 거의 영향을 미치지 않는다. 새로운 명령 클래스만 추가하면 되기 때문에, 시스템의 확장성이 높아진다.

## 단점

  1. **복잡성 증가**:
    * 커맨드 패턴을 사용하면 각 명령마다 별도의 클래스가 필요하기 때문에, 시스템의 복잡성이 증가할 수 있다. 특히, 많은 명령이 존재하는 경우 클래스 수가 급격히 늘어나고, 코드베이스가 방대해질 수 있다.
  2. **메모리 사용 증가**:
    * 커맨드 객체가 상태 정보를 유지해야 하거나, 이전 상태로 되돌리기 위해 명령의 상태를 저장해야 하는 경우, 메모리 사용이 증가할 수 있습니다. 특히 많은 수의 명령이 동시에 처리될 때, 메모리 오버헤드가 문제가 될 수 있다.
  3. **명령 객체의 관리 복잡성**:
    * 명령 객체가 상태를 유지하거나 복잡한 실행 로직을 포함할 경우, 명령 객체의 관리가 복잡해질 수 있다. 이는 특히 실행 취소 기능을 지원해야 하거나, 명령의 실행 결과를 관리해야 하는 시스템에서 문제를 일으킬 수 있다.

## 커맨드 패턴 (Command Pattern)을 사용한 예제:

스마트 홈 시스템을 주제로, 새로운 장치를 추가하는 방법을 설명

```java
// Command 인터페이스
interface Command {
    void execute();
}

// Receiver 클래스: Light (기존 장치)
class Light {
    public void on() {
        System.out.println("Light is ON");
    }

    public void off() {
        System.out.println("Light is OFF");
    }
}

// Concrete Command 클래스: LightOnCommand
class LightOnCommand implements Command {
    private Light light;

    public LightOnCommand(Light light) {
        this.light = light;
    }

    @Override
    public void execute() {
        light.on();
    }
}

// Concrete Command 클래스: LightOffCommand
class LightOffCommand implements Command {
    private Light light;

    public LightOffCommand(Light light) {
        this.light = light;
    }

    @Override
    public void execute() {
        light.off();
    }
}

// Invoker 클래스: RemoteControl
class RemoteControl {
    private Command command;

    public void setCommand(Command command) {
        this.command = command;
    }

    public void pressButton() {
        command.execute();
    }
}

// Client 클래스
public class SmartHomeSystem {
    public static void main(String[] args) {
        Light livingRoomLight = new Light();
        Command lightOn = new LightOnCommand(livingRoomLight);
        Command lightOff = new LightOffCommand(livingRoomLight);

        RemoteControl remote = new RemoteControl();

        // Light On
        remote.setCommand(lightOn);
        remote.pressButton();

        // Light Off
        remote.setCommand(lightOff);
        remote.pressButton();
    }
}
```

```java
// Receiver 클래스: AirConditioner (새로운 장치)
class AirConditioner {
    public void on() {
        System.out.println("AirConditioner is ON");
    }

    public void off() {
        System.out.println("AirConditioner is OFF");
    }
}

// Concrete Command 클래스: AirConditionerOnCommand
class AirConditionerOnCommand implements Command {
    private AirConditioner airConditioner;

    public AirConditionerOnCommand(AirConditioner airConditioner) {
        this.airConditioner = airConditioner;
    }

    @Override
    public void execute() {
        airConditioner.on();
    }
}

// Concrete Command 클래스: AirConditionerOffCommand
class AirConditionerOffCommand implements Command {
    private AirConditioner airConditioner;

    public AirConditionerOffCommand(AirConditioner airConditioner) {
        this.airConditioner = airConditioner;
    }

    @Override
    public void execute() {
        airConditioner.off();
    }
}

// Client 코드 확장
public class SmartHomeSystemWithAirConditioner {
    public static void main(String[] args) {
        // 기존 장치
        Light livingRoomLight = new Light();
        Command lightOn = new LightOnCommand(livingRoomLight);
        Command lightOff = new LightOffCommand(livingRoomLight);

        // 새로운 장치
        AirConditioner airConditioner = new AirConditioner();
        Command acOn = new AirConditionerOnCommand(airConditioner);
        Command acOff = new AirConditionerOffCommand(airConditioner);

        RemoteControl remote = new RemoteControl();

        // Light On
        remote.setCommand(lightOn);
        remote.pressButton();

        // AirConditioner On
        remote.setCommand(acOn);
        remote.pressButton();

        // AirConditioner Off
        remote.setCommand(acOff);
        remote.pressButton();

        // Light Off
        remote.setCommand(lightOff);
        remote.pressButton();
    }
}
```

![](/assets/images/posts/2024-08-31-커맨드-패턴-Command-Pattern/01.png)

## 코드 설명

  1. **Command 인터페이스:**
    * 모든 명령 클래스는 Command 인터페이스를 구현하고, execute() 메서드를 정의한다. 이는 모든 장치 제어 명령이 동일한 인터페이스를 사용하도록 보장한다.
  2. **Light 및 AirConditioner 클래스 (Receivers):**
    * Light 클래스와 AirConditioner 클래스는 각각 기존의 조명 제어와 새로운 에어컨 제어를 수행한다.
  3. **Concrete Command 클래스:**
    * LightOnCommand, LightOffCommand는 기존 조명을 제어하는 명령 클래스 AirConditionerOnCommand, AirConditionerOffCommand는 새로운 에어컨을 제어하는 명령 클래스이다. 이 클래스를 추가함으로써 시스템에 에어컨 제어 기능이 추가된다.
  4. **RemoteControl 클래스 (Invoker):**
    * RemoteControl 클래스는 명령을 설정하고 실행하는 역할을 한다. setCommand() 메서드로 명령 객체를 설정하고, pressButton() 메서드로 명령을 실행한다.
  5. **Client 클래스:**
    * SmartHomeSystemWithAirConditioner 클래스는 클라이언트 코드로, 기존 장치와 새로운 장치를 모두 제어한다. 새로운 명령 클래스를 추가함으로써, 클라이언트 코드는 거의 수정하지 않고도 새로운 장치를 제어할 수 있다.

## 관련패턴

  1. **체인 오브 책임 패턴 (Chain of Responsibility Pattern)**
    * 체인 오브 책임 패턴은 요청을 처리할 수 있는 여러 객체들이 연결되어 있어, 요청이 적절한 객체에 도달할 때까지 체인을 따라 전달되는 패턴이다. 커맨드 패턴에서 생성된 명령 객체는 체인 오브 책임 패턴과 결합되어 처리될 수 있다. 예를 들어, 여러 명령이 순차적으로 실행되도록 체인을 구성할 수 있으며, 각 명령이 실행될 때 다음 명령이 자동으로 실행된다.
  2. **메멘토 패턴 (Memento Pattern)**
    * 메멘토 패턴은 객체의 내부 상태를 저장하고, 필요시 이를 복원할 수 있는 패턴이다. 커맨드 패턴과 메멘토 패턴은 함께 사용되어, 실행 취소(Undo) 및 재실행(Redo) 기능을 구현할 때 매우 유용하다. 커맨드 패턴은 명령을 캡슐화하고, 메멘토 패턴은 명령이 실행되기 전의 상태를 저장하여 나중에 복원할 수 있게 한다.
  3. **템플릿 메서드 패턴 (Template Method Pattern)**
    * 템플릿 메서드 패턴은 알고리즘의 구조를 정의하고, 알고리즘의 일부 단계를 서브클래스에서 구현할 수 있도록 하는 패턴이다. 커맨드 패턴에서 여러 명령이 공통의 실행 로직을 공유하면서도, 특정 부분을 다르게 구현해야 할 때 템플릿 메서드 패턴을 사용할 수 있다. 이를 통해 코드의 중복을 줄이고, 명령 클래스 간의 일관성을 유지할 수 있다.
  4. **전략 패턴 (Strategy Pattern)**
    * 전략 패턴은 알고리즘을 캡슐화하여 동적으로 교체할 수 있도록 하는 패턴이다. 커맨드 패턴과 전략 패턴은 유사한 구조를 가지며, 때로는 함께 사용됩니다. 커맨드 패턴이 요청을 캡슐화하는 반면, 전략 패턴은 실행 방법을 캡슐화한다. 두 패턴은 함께 사용되어 다양한 요청을 유연하게 처리할 수 있다.
  5. **옵저버 패턴 (Observer Pattern)**
    * 옵저버 패턴은 객체의 상태 변화를 관찰하고, 그 변화에 따라 자동으로 반응하는 객체들을 연결하는 패턴이다. 커맨드 패턴에서 명령이 실행될 때 특정 이벤트를 발생시키고, 옵저버 패턴을 사용하여 해당 이벤트를 감지하고 처리할 수 있다. 이는 명령 실행 후 후속 작업을 자동으로 처리할 때 유용하다.
