---
title: "템플릿 메서드 패턴 (Template Method Pattern)"
description: "템플릿 메서드(Template Method) 패턴은 행동(Behavioral) 디자인 패턴 중 하나로, 알고리즘의 구조를 정의하고, 그 알고리즘의 일부 단계를 서브클래스에서 구현하도록 하는 패턴입니다. 이 패턴을 사"
categories:
 - programming
 - design-pattern
source: "https://blog.naver.com/csj4032/223554327774"
---

템플릿 메서드(Template Method) 패턴은 행동(Behavioral) 디자인 패턴 중 하나로, 알고리즘의 구조를 정의하고, 그 알고리즘의 일부 단계를 서브클래스에서 구현하도록 하는 패턴입니다. 이 패턴을 사용하면 알고리즘의 골격을 상위 클래스에서 정의하고, 세부적인 구현은 하위 클래스에서 결정할 수 있습니다.

## "삶의 큰 틀은 정해져 있으나, 그 안에서 각자의 색깔로 채워가는 자유와 책임의 균형."

## 템플릿 메서드(Template Method) 패턴은 다음과 같은 상황에서 유용하게 사용될 수 있습니다:

  1. 알고리즘의 구조는 동일하지만, 일부 단계의 구현이 다양할 때:
    * 여러 클래스에서 공통적인 알고리즘을 사용해야 하지만, 알고리즘의 일부 단계가 클래스마다 다르게 구현되어야 하는 경우에 유용하다. 예를 들어, 문서 작성 프로세스에서 문서의 구조는 동일하지만, 문서 형식(예: Word, PDF, HTML)에 따라 제목이나 내용 추가 방식이 다를 때 템플릿 메서드 패턴을 사용할 수 있다.
  2. 알고리즘의 골격을 재사용하면서 하위 클래스에서 세부 구현을 제공하고 싶을 때:
    * 상위 클래스에서 알고리즘의 전체적인 흐름을 정의하고, 그 알고리즘의 일부 세부적인 단계만 하위 클래스에서 오버라이드하여 구체적인 동작을 제공하고자 할 때 유용합니다. 예를 들어, 데이터 처리 파이프라인에서 데이터 수집, 처리, 저장의 전체적인 흐름은 동일하지만, 데이터 처리 방식이 다를 경우 각 처리 방식을 하위 클래스에서 구현할 수 있다.
  3. 서로 다른 구현을 가진 여러 클래스를 동일한 알고리즘으로 처리해야 할 때:
    * 여러 클래스에서 동일한 알고리즘을 사용할 때, 각각의 클래스에서 동일한 알고리즘을 반복 구현하는 대신, 상위 클래스에 템플릿 메서드를 정의하여 알고리즘을 일관되게 관리할 수 있다. 예를 들어, 다양한 형식의 레포트를 생성하는 시스템에서, 레포트 생성의 기본 구조를 템플릿 메서드로 정의하고, 레포트의 내용 작성 방식을 하위 클래스에서 구현할 수 있다.
  4. 알고리즘의 특정 단계에서 선택적인 오버라이드가 필요할 때:
    * 알고리즘의 특정 단계가 선택적으로 오버라이드될 수 있도록 해야 할 때, 템플릿 메서드 패턴을 활용할 수 있다. 후크(Hook) 메서드를 사용하여 하위 클래스에서 선택적으로 메서드를 오버라이드할 수 있도록 함으로써, 알고리즘의 유연성을 높일 수 있다. 예를 들어, 게임 개발에서 게임의 기본 로직은 동일하지만, 특정 이벤트(예: 보너스 이벤트)는 게임마다 다르게 구현해야 할 때 사용할 수 있다.
  5. 클라이언트가 알고리즘의 특정 단계에만 관여해야 할 때:
    * 클라이언트가 알고리즘의 전체적인 구조를 알 필요 없이, 특정 단계에만 관여해야 하는 경우 유용하다. 클라이언트는 알고리즘의 전체적인 흐름에 신경 쓰지 않고, 필요한 부분만 오버라이드하여 사용하면 된다. 예를 들어, 네트워크 통신에서 연결 설정, 데이터 전송, 연결 해제의 흐름을 템플릿 메서드로 정의하고, 데이터 전송 방식을 클라이언트에서 정의할 수 있다.

## 장점

  1. **코드 재사용성 증가**
    * 템플릿 메서드 패턴은 알고리즘의 골격을 상위 클래스에서 정의하여, 중복된 코드를 제거하고 재사용성을 높여준다. 알고리즘의 공통적인 부분은 상위 클래스에서 한 번만 구현되며, 서브클래스에서 특정 단계만 오버라이드하여 다른 동작을 추가할 수 있다.문서 작성 프로세스에서 공통된 문서 열기, 닫기 등의 작업은 상위 클래스에 정의하고, 각 문서 유형별로 제목이나 내용 추가와 같은 세부 사항은 서브클래스에서 구현할 수 있다.
  2. **알고리즘의 구조와 세부 구현의 분리**
    * 템플릿 메서드 패턴은 알고리즘의 구조와 세부 구현을 분리하여 관리할 수 있다. 상위 클래스는 알고리즘의 전체적인 흐름을 제어하고, 서브클래스는 개별 단계의 구현만 담당한다. 이는 코드의 가독성과 유지보수성을 크게 향상시킨다. 데이터 처리 파이프라인에서 전체적인 데이터 처리 흐름은 상위 클래스에서 정의되고, 데이터 수집, 처리, 저장의 세부 구현은 서브클래스에서 제공된다.
  3. **알고리즘의 변경 없이 세부 동작 변경 가능**
    * 알고리즘의 골격을 변경하지 않고도 서브클래스에서 특정 단계의 구현만 수정하여 동작을 변경할 수 있다. 이를 통해 시스템의 유연성을 유지하면서도 새로운 요구사항에 쉽게 대응할 수 있다. 게임 개발에서 게임의 기본 로직은 그대로 두고, 특정 게임 이벤트(예: 보너스 이벤트)만 다르게 구현할 수 있다.
  4. **일관된 알고리즘 구조 보장**
    * 템플릿 메서드 패턴은 알고리즘의 골격을 상위 클래스에서 고정함으로써, 서브클래스가 그 구조를 변경하지 못하게 할 수 있다. 이를 통해 일관된 알고리즘 구조를 보장할 수 있다. 다양한 파일 형식을 처리하는 시스템에서 파일 열기, 처리, 닫기의 순서가 동일하게 유지되도록 보장할 수 있다.
  5. **후크(Hook) 메서드를 통한 유연성 제공**
    * 템플릿 메서드 패턴은 후크 메서드(옵션 메서드)를 사용하여 서브클래스가 필요에 따라 특정 단계의 기본 동작을 재정의할 수 있도록 유연성을 제공한다. 이는 서브클래스가 알고리즘의 특정 부분에만 영향을 미치도록 할 수 있다. 소프트웨어 설치 과정에서 기본 설치 후 옵션 설정을 후크 메서드로 제공하여, 서브클래스에서 추가 설정을 구현할 수 있다.

## 단점

  1. **서브클래스에서의 의존성 증가**
    * 서브클래스가 상위 클래스에 정의된 템플릿 메서드의 구조에 의존하게 된다. 상위 클래스의 템플릿 메서드가 변경되면, 서브클래스에도 영향을 미치게 되므로 유연성이 떨어질 수 있다. 상위 클래스에서 템플릿 메서드의 순서를 변경하면, 서브클래스에서 의도한 동작이 달라질 수 있으며, 모든 서브클래스를 수정해야 할 수도 있다.
  2. **알고리즘 구조 변경의 어려움**
    * 템플릿 메서드 패턴에서 알고리즘의 구조가 상위 클래스에 고정되어 있으므로, 알고리즘의 흐름을 변경하려면 상위 클래스를 수정해야 한다. 이는 상위 클래스를 사용하는 모든 서브클래스에 영향을 미치며, 코드의 유연성을 제한할 수 있다. 문서 처리 시스템에서 문서 생성 흐름이 상위 클래스에 고정되어 있다면, 이 흐름을 변경하려면 모든 문서 타입에 영향을 미치는 상위 클래스를 수정해야 한다.
  3. **클래스 수 증가**
    * 템플릿 메서드 패턴을 사용하면 각 알고리즘의 변형마다 서브클래스를 만들어야 하므로, 클래스 수가 증가할 수 있다. 이는 코드의 복잡성을 높이고, 시스템을 관리하는 데 더 많은 노력이 필요하게 만든다. 다양한 파일 형식을 처리하는 시스템에서, 각 파일 형식마다 서브클래스를 만들어야 하므로 클래스 수가 급격히 늘어날 수 있다.
  4. **추상 메서드 구현의 강제성**
    * 템플릿 메서드 패턴에서 상위 클래스가 정의한 추상 메서드는 모든 서브클래스에서 반드시 구현해야 한다. 그러나 모든 서브클래스에서 의미 있는 구현을 제공하기 어려울 수 있으며, 불필요한 오버라이드가 발생할 수 있다. 데이터 처리 파이프라인에서 모든 서브클래스가 특정 데이터를 처리하는 추상 메서드를 구현해야 한다면, 일부 서브클래스에서는 해당 메서드를 구현할 필요가 없을 수 있다.
  5. **유연성의 제한**
    * 템플릿 메서드 패턴은 알고리즘의 구조를 고정하기 때문에, 서브클래스에서 이 구조를 변경하고자 할 때 유연성이 제한된다. 상위 클래스의 알고리즘 흐름을 따라야 하므로, 새로운 요구사항에 대한 대응이 어려울 수 있다. 특정 비즈니스 로직이 적용된 템플릿 메서드를 사용하는 시스템에서, 새로운 비즈니스 로직이 추가되어야 할 때 상위 클래스의 수정이 불가피할 수 있다.

템플릿 메서드 패턴을 사용한 예제:

이 시스템에서는 데이터 소스가 파일, 데이터베이스, 웹 API 등 다양한 형태일 수 있으며, 출력 형식도 콘솔, 파일, 또는 웹 브라우저

```java
// 상위 클래스 (Abstract Class)
abstract class DataProcessor {
    // 템플릿 메서드: 데이터 가져오기, 처리, 출력의 알고리즘 골격을 정의
    public final void process() {
        String data = fetchData();
        String processedData = processData(data);
        outputData(processedData);
    }

    // 추상 메서드 - 서브클래스에서 구현 필요
    protected abstract String fetchData();
    protected abstract String processData(String data);
    protected abstract void outputData(String data);
}

// 서브클래스 1 (Concrete Class)
class FileDataProcessor extends DataProcessor {
    private OutputHandler outputHandler;

    public FileDataProcessor(OutputHandler outputHandler) {
        this.outputHandler = outputHandler;
    }

    @Override
    protected String fetchData() {
        // 파일에서 데이터 읽기 로직 구현
        System.out.println("Fetching data from a file...");
        return "File Data";
    }

    @Override
    protected String processData(String data) {
        // 데이터를 처리하는 로직 구현
        System.out.println("Processing file data...");
        return "Processed " + data;
    }

    @Override
    protected void outputData(String data) {
        // 출력 핸들러를 통해 데이터를 출력
        outputHandler.handleOutput(data);
    }
}

// 서브클래스 2 (Concrete Class)
class DatabaseDataProcessor extends DataProcessor {
    private OutputHandler outputHandler;

    public DatabaseDataProcessor(OutputHandler outputHandler) {
        this.outputHandler = outputHandler;
    }

    @Override
    protected String fetchData() {
        // 데이터베이스에서 데이터 읽기 로직 구현
        System.out.println("Fetching data from the database...");
        return "Database Data";
    }

    @Override
    protected String processData(String data) {
        // 데이터를 처리하는 로직 구현
        System.out.println("Processing database data...");
        return "Processed " + data;
    }

    @Override
    protected void outputData(String data) {
        // 출력 핸들러를 통해 데이터를 출력
        outputHandler.handleOutput(data);
    }
}

// 서브클래스 3 (Concrete Class)
class APIDataProcessor extends DataProcessor {
    private OutputHandler outputHandler;

    public APIDataProcessor(OutputHandler outputHandler) {
        this.outputHandler = outputHandler;
    }

    @Override
    protected String fetchData() {
        // 웹 API에서 데이터 읽기 로직 구현
        System.out.println("Fetching data from the web API...");
        return "API Data";
    }

    @Override
    protected String processData(String data) {
        // 데이터를 처리하는 로직 구현
        System.out.println("Processing API data...");
        return "Processed " + data;
    }

    @Override
    protected void outputData(String data) {
        // 출력 핸들러를 통해 데이터를 출력
        outputHandler.handleOutput(data);
    }
}

// 출력 방식 인터페이스
interface OutputHandler {
    void handleOutput(String data);
}

// 콘솔 출력 핸들러 (Concrete Class)
class ConsoleOutputHandler implements OutputHandler {
    @Override
    public void handleOutput(String data) {
        System.out.println("Console Output: " + data);
    }
}

// 파일 출력 핸들러 (Concrete Class)
class FileOutputHandler implements OutputHandler {
    @Override
    public void handleOutput(String data) {
        System.out.println("Writing data to a file: " + data);
        // 실제 파일 쓰기 로직 구현
    }
}

// 웹 출력 핸들러 (Concrete Class)
class WebOutputHandler implements OutputHandler {
    @Override
    public void handleOutput(String data) {
        System.out.println("Displaying data on a web page: " + data);
        // 실제 웹 페이지로 출력하는 로직 구현
    }
}

// 클라이언트 코드
public class TemplateMethodPatternExample {
    public static void main(String[] args) {
        OutputHandler consoleHandler = new ConsoleOutputHandler();
        DataProcessor fileProcessor = new FileDataProcessor(consoleHandler);
        fileProcessor.process();

        System.out.println();

        OutputHandler fileHandler = new FileOutputHandler();
        DataProcessor databaseProcessor = new DatabaseDataProcessor(fileHandler);
        databaseProcessor.process();

        System.out.println();

        OutputHandler webHandler = new WebOutputHandler();
        DataProcessor apiProcessor = new APIDataProcessor(webHandler);
        apiProcessor.process();
    }
}
```

![](/assets/images/posts/2024-08-20-템플릿-메서드-패턴-Template-Method-Pattern/01.png)

## 코드 설명

  1. **DataProcessor 클래스 (상위 클래스):**
    * DataProcessor 클래스는 데이터 처리와 출력의 전체적인 흐름을 정의하는 process() 템플릿 메서드를 포함한다. 이 메서드는 데이터를 가져오고, 처리하고, 출력하는 일련의 작업을 수행한다.
    * fetchData(), processData(), outputData() 메서드는 추상 메서드로 정의되며, 이 메서드들은 서브클래스에서 구체적으로 구현된다.
  2. **FileDataProcessor, DatabaseDataProcessor, APIDataProcessor 클래스 (서브클래스):**
    * 각 서브클래스는 DataProcessor를 상속받아, 각 데이터 소스에 특화된 데이터를 가져오는(fetchData()) 로직을 구현한다.
    * 이 서브클래스들은 각각 파일, 데이터베이스, 웹 API로부터 데이터를 읽고, 처리한 후, 지정된 출력 핸들러를 사용하여 결과를 출력한다.
  3. **OutputHandler 인터페이스:**
    * OutputHandler 인터페이스는 데이터 처리 결과를 출력하는 메서드(handleOutput(String data))를 정의한다. 이 인터페이스를 구현하여 다양한 출력 방식을 제공할 수 있다.
  4. **ConsoleOutputHandler, FileOutputHandler, WebOutputHandler 클래스 (출력 핸들러):**
    * 각 출력 핸들러는 OutputHandler 인터페이스를 구현하여, 데이터 처리 결과를 콘솔에 출력하거나, 파일에 쓰거나, 웹 페이지에 표시하는 역할을 한다.
  5. **클라이언트 코드:**
    * 클라이언트는 다양한 데이터 소스와 출력 형식을 결합하여 데이터를 처리하고 출력한다. OutputHandler와 DataProcessor의 조합을 통해 유연한 데이터 처리 및 출력이 가능하다.

## 관련 패턴

  1. **팩토리 메서드(Factory Method) 패턴**
    * 팩토리 메서드 패턴은 객체 생성의 책임을 서브클래스에 위임하는 생성(Creational) 디자인 패턴이다. 팩토리 메서드는 객체 생성 로직을 캡슐화하여 코드의 결합도를 낮추고 유연성을 높여준다. 템플릿 메서드 패턴과 팩토리 메서드 패턴은 상위 클래스에서 알고리즘의 골격을 정의하고, 그 알고리즘의 일부 단계를 서브클래스에서 구현하도록 한다는 점에서 유사하다. 팩토리 메서드 패턴은 템플릿 메서드 패턴 내에서 객체 생성의 일부를 처리하는 데 사용될 수 있다.
  2. **전략(Strategy) 패턴**
    * 전략 패턴은 알고리즘의 일부를 변경할 수 있도록 유연하게 설계하는 행동(Behavioral) 디자인 패턴이다. 이 패턴은 알고리즘을 정의하는 여러 클래스를 만들고, 런타임에 알고리즘을 선택할 수 있게 한다. 템플릿 메서드 패턴과 전략 패턴은 모두 알고리즘의 변형 가능성을 강조한다. 템플릿 메서드 패턴은 상위 클래스에서 알고리즘의 구조를 정의하고 서브클래스에서 구체적인 동작을 정의하는 반면, 전략 패턴은 알고리즘을 객체로 캡슐화하여 클라이언트에서 직접 설정할 수 있다.
  3. **디코레이터(Decorator) 패턴**
    * 디코레이터 패턴은 객체에 새로운 기능을 동적으로 추가할 수 있게 하는 구조적(Structural) 디자인 패턴이다. 이 패턴은 객체를 감싸는 방식으로 기능을 확장하며, 코드의 중복을 줄이고 유연성을 높힌다. 템플릿 메서드 패턴과 디코레이터 패턴은 모두 기존의 기능을 확장하거나 변경하는 데 사용된다. 디코레이터 패턴은 객체의 행동을 변경하는 데 유용하며, 템플릿 메서드 패턴과 함께 사용하여 알고리즘의 특정 단계에 추가 기능을 동적으로 적용할 수 있다.
  4. **브리지(Bridge) 패턴**
    * 브리지 패턴은 추상화와 구현을 분리하여, 두 부분을 독립적으로 변경할 수 있게 하는 구조적(Structural) 디자인 패턴이다. 이 패턴은 복잡한 시스템에서 여러 구현을 쉽게 교체하거나 확장할 수 있게 해준다. 템플릿 메서드 패턴과 브리지 패턴은 모두 시스템의 유연성을 높이는 데 기여한다. 템플릿 메서드 패턴이 알고리즘의 변형 가능성을 제공하는 반면, 브리지 패턴은 인터페이스와 구현을 분리하여 변형 가능성을 제공한다. 이 두 패턴은 함께 사용되어 시스템의 여러 측면에서 독립적인 변경을 가능하게 할 수 있다.
  5. **상태(State) 패턴**
    * 상태 패턴은 객체의 상태에 따라 행동을 변경할 수 있게 하는 행동(Behavioral) 디자인 패턴이다. 이 패턴은 상태를 객체로 캡슐화하여, 상태 전환을 통해 객체의 행동을 변경할 수 있다. 템플릿 메서드 패턴과 상태 패턴은 함께 사용되어, 알고리즘의 각 단계에서 객체의 상태에 따라 다른 동작을 수행할 수 있게 할 수 있다. 템플릿 메서드 패턴은 알고리즘의 구조를 정의하고, 상태 패턴은 알고리즘의 특정 단계에서 상태에 따른 변형을 제공할 수 있다.
  6. **헐리우드(Hollywood) 원칙**
    * 헐리우드 원칙은 "우리에게 전화하지 마세요, 우리가 당신에게 전화할게요."라는 철학을 기반으로 한 디자인 원칙이다. 이는 상위 수준의 모듈이 하위 수준의 모듈에 대해 너무 많이 알지 않도록 하여, 하위 모듈의 복잡성을 줄이고, 모듈 간의 결합도를 낮추는 데 중점을 둔다. 템플릿 메서드 패턴은 헐리우드 원칙의 구현 중 하나로 볼 수 있다. 상위 클래스가 알고리즘의 흐름을 제어하면서, 하위 클래스에 대한 호출을 통해 특정 단계를 구현하게 한다. 이로 인해 상위 클래스는 하위 클래스의 세부 사항을 알 필요가 없게 된다.
