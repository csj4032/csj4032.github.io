---
title: "옵저버 패턴 (Observer Pattern)"
description: "옵저버 패턴(Observer Pattern)은 행동(Behavioral) 디자인 패턴 중 하나로, 주체(Subject)와 옵저버(Observer) 간의 일대다(one-to-many) 관계를 정의한다. 주체의 상태가 "
categories:
 - programming
 - design-pattern
source: "https://blog.naver.com/csj4032/223558029520"
---

옵저버 패턴(Observer Pattern)은 행동(Behavioral) 디자인 패턴 중 하나로, 주체(Subject)와 옵저버(Observer) 간의 일대다(one-to-many) 관계를 정의한다. 주체의 상태가 변경되면, 그 변경 사항을 모든 옵저버에게 자동으로 통지하고, 옵저버들은 그에 따라 행동을 취한다. 이 패턴은 발행-구독(publish-subscribe) 패턴이라고도 불리며, 주로 이벤트 처리 시스템이나 상태 변화에 따라 행동을 취해야 하는 시스템에서 사용된다.

## "변화는 전파되고, 주의 깊은 이들은 그에 반응한다. 세상은 이런 상호작용으로 움직인다."

옵저버 패턴(Observer Pattern)은 다음과 같은 상황에서 유용하게 사용될 수 있습니다:

  1. **객체의 상태 변화에 따라 다른 객체들도 자동으로 갱신되어야 할 때**:
    * 한 객체의 상태가 변경될 때, 이와 관련된 다른 객체들도 자동으로 그 변경 사항을 반영해야 하는 경우 옵저버 패턴이 유용하다. 주체 객체의 상태가 변경되면 등록된 옵저버들에게 자동으로 통지가 이루어져, 옵저버들이 상태를 갱신할 수 있다. 주식 거래 시스템에서 주식의 가격이 변동되면, 이를 모니터링하는 투자자들에게 자동으로 가격 변동 사항을 통지할 수 있다.
  2. **객체 간의 느슨한 결합이 필요할 때**:
    * 객체들이 서로 강하게 결합되지 않고 독립적으로 동작해야 할 때 옵저버 패턴이 유용합니다. 주체와 옵저버는 느슨하게 결합되어 있어, 주체는 옵저버의 구체적인 구현에 대해 알 필요가 없다. 이는 시스템의 유연성과 확장성을 높이는 데 기여한다. 소셜 미디어 플랫폼에서 사용자 A가 콘텐츠를 게시하면, 그 콘텐츠를 팔로우하는 사용자 B와 C에게 자동으로 업데이트를 통지한다. 사용자 A는 자신을 팔로우하는 사용자가 누구인지 알 필요가 없다.
  3. **다수의 객체가 특정 객체의 상태에 의존할 때**:
    * 여러 객체가 특정 객체의 상태에 의존하고 있으며, 이 객체의 상태가 변경될 때 모든 의존 객체들이 이에 반응해야 할 때 옵저버 패턴을 사용하면 유용하다. 주체 객체의 상태 변경을 효율적으로 관리할 수 있다. 모델-뷰-컨트롤러(MVC) 아키텍처에서 모델 객체의 상태가 변경되면, 이 모델을 참조하는 모든 뷰 객체들이 자동으로 갱신되어야 한다.
  4. **데이터의 변경 사항이 다양한 방식으로 표현되어야 할 때**:
    * 주체의 데이터 변경 사항이 여러 다른 형태로 표현되어야 할 때, 옵저버 패턴을 사용하면 데이터를 갱신된 상태로 다양한 방식으로 표현할 수 있다. 각각의 옵저버는 주체의 상태 변경을 수신하여 이를 자신만의 방식으로 처리할 수 있다. 기상 데이터 시스템에서 온도, 습도, 기압 등의 데이터가 변경될 때, 이를 각각의 다른 디스플레이(예: 그래픽, 텍스트, 경고 메시지)로 표현할 수 있다.
  5. **이벤트 기반 시스템을 구현할 때**:
    * 시스템이 이벤트 중심으로 설계되어야 할 때 옵저버 패턴이 유용하다. 이벤트 발생 시 이를 수신하여 처리하는 구조를 쉽게 구현할 수 있다. GUI 응용 프로그램에서 버튼 클릭, 텍스트 입력 등의 이벤트가 발생하면, 해당 이벤트를 처리하는 여러 리스너들이 자동으로 호출되어 필요한 작업을 수행할 수 있다.

## 장점

  1. **느슨한 결합(Loose Coupling)**
    * 옵저버 패턴은 주체(Subject)와 옵저버(Observer) 간의 결합도를 낮춘다. 주체는 옵저버가 누구인지 알 필요가 없으며, 옵저버도 주체의 내부 구조에 대해 알 필요가 없다. 주체는 옵저버의 인터페이스만 알고 있으며, 이를 통해 옵저버에게 통지한다. 이 느슨한 결합 덕분에 시스템의 유연성과 확장성이 높아지며, 새로운 옵저버를 쉽게 추가하거나 제거할 수 있습니다. 또한, 주체와 옵저버의 독립적인 변경이 가능해져 유지보수성이 향상된다.
  2. **자동화된 상태 갱신**
    * 주체의 상태가 변경되면, 모든 옵저버들에게 자동으로 통지가 이루어져 상태가 갱신된다. 옵저버는 주체의 상태를 수동으로 확인할 필요 없이, 변경 사항이 있을 때마다 자동으로 통지받아 업데이트를 수행한다. 자동화된 상태 갱신으로 인해 시스템의 신뢰성이 높아지며, 상태 변경 시 옵저버들이 항상 최신 상태를 유지할 수 있다.
  3. **확장성 및 재사용성 증가**
    * 옵저버 패턴을 사용하면 새로운 옵저버를 쉽게 추가할 수 있다. 주체와 옵저버 간의 인터페이스가 명확하게 정의되어 있기 때문에, 시스템의 다른 부분에 영향을 주지 않고도 새로운 옵저버를 추가할 수 있다. 시스템의 확장성이 높아지며, 주체나 옵저버의 코드를 재사용할 수 있다. 이를 통해 새로운 기능을 추가할 때 코드의 중복을 줄이고 개발 효율성을 높일 수 있다.
  4. **주체와 옵저버의 독립적 변경 가능**
    * 주체와 옵저버는 서로 독립적으로 변경될 수 있다. 옵저버가 추가되거나 제거되더라도 주체의 동작은 변하지 않으며, 주체가 변경되더라도 옵저버에게 통지되는 방식은 유지된다. 이 독립성 덕분에 시스템의 유지보수가 쉬워지며, 각 구성 요소를 독립적으로 개발하고 테스트할 수 있다.

## 단점

  1. **복잡성 증가**
    * 옵저버 패턴을 사용하면 주체와 여러 옵저버 간의 상호작용이 복잡해질 수 있다. 옵저버의 수가 많아지거나, 옵저버 간의 의존성이 발생할 경우 시스템의 복잡도가 증가하게 된다. 복잡성이 증가하면 시스템의 디버깅이 어려워지고, 버그가 발생할 가능성이 높아진다. 또한, 옵저버들이 서로 의존하게 되면, 상태 갱신의 순서에 따라 예기치 않은 동작이 발생할 수 있다.
  2. **상태 불일치 가능성**
    * 옵저버들이 주체의 상태 변경을 서로 다른 시간에 통지받거나, 각기 다른 방식으로 처리할 경우, 옵저버들 간에 상태 불일치가 발생할 수 있다. 특히, 주체가 자주 상태를 변경하는 경우 이러한 문제가 발생할 가능성이 크다. 상태 불일치는 시스템의 일관성을 해치며, 특히 분산 시스템에서는 심각한 문제를 초래할 수 있다.
  3. **의도하지 않은 성능 저하**
    * 주체가 상태를 변경할 때 많은 옵저버들에게 통지를 보내야 하므로, 옵저버의 수가 많아질수록 성능이 저하될 수 있다. 또한, 옵저버가 복잡한 연산을 수행하는 경우, 전체 시스템의 성능에 부정적인 영향을 미칠 수 있다. 성능 저하는 시스템의 응답 속도를 느리게 하며, 특히 실시간 처리가 중요한 시스템에서는 큰 문제가 될 수 있다.
  4. **메모리 누수 가능성**
    * 옵저버가 주체에 등록된 상태에서 옵저버를 제거하지 않으면, 메모리 누수가 발생할 수 있다. 주체가 옵저버의 참조를 유지하고 있는 한, 옵저버 객체는 가비지 컬렉션의 대상이 되지 않는다. 메모리 누수는 장시간 실행되는 애플리케이션에서 메모리 부족 문제를 일으킬 수 있으며, 시스템의 안정성을 저하시킬 수 있다.
  5. **옵저버 관리의 복잡성**
    * 주체는 옵저버 목록을 관리해야 하며, 옵저버 추가 및 제거 시 복잡성이 증가할 수 있다. 옵저버 관리가 제대로 이루어지지 않으면, 예상치 못한 동작이나 성능 문제가 발생할 수 있다. 관리 복잡성은 시스템의 유지보수를 어렵게 만들며, 특히 큰 시스템에서는 옵저버 관리가 중요한 이슈가 될 수 있다.

옵저버 패턴(Observer Pattern)을 사용한 예제:

각 투자자는 특정 주식을 모니터링하며, 주식 가격이 변동될 때 자동으로 통지를 받아 새로운 가격을 확인

```java
import java.util.ArrayList;
import java.util.List;

// 옵저버 인터페이스
interface Observer {
    void update(String stockSymbol, double stockPrice);
}

// 주체 인터페이스
interface Subject {
    void addObserver(Observer observer);
    void removeObserver(Observer observer);
    void notifyObservers();
}

// 주체 클래스: Stock (주식)
class Stock implements Subject {
    private List<Observer> observers;
    private String stockSymbol;
    private double stockPrice;

    public Stock(String stockSymbol, double stockPrice) {
        this.stockSymbol = stockSymbol;
        this.stockPrice = stockPrice;
        this.observers = new ArrayList<>();
    }

    @Override
    public void addObserver(Observer observer) {
        observers.add(observer);
    }

    @Override
    public void removeObserver(Observer observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(stockSymbol, stockPrice);
        }
    }

    public void setStockPrice(double stockPrice) {
        this.stockPrice = stockPrice;
        notifyObservers();  // 주가 변경 시 모든 옵저버에게 통지
    }

    public String getStockSymbol() {
        return stockSymbol;
    }

    public double getStockPrice() {
        return stockPrice;
    }
}

// 구체적인 옵저버 클래스: Investor (투자자)
class Investor implements Observer {
    private String investorName;

    public Investor(String investorName) {
        this.investorName = investorName;
    }

    @Override
    public void update(String stockSymbol, double stockPrice) {
        System.out.println("Investor " + investorName + " notified. " +
                           "Stock: " + stockSymbol + " is now " + stockPrice);
    }
}

// 클라이언트 코드
public class StockObserverPatternExample {
    public static void main(String[] args) {
        // 주식 생성
        Stock appleStock = new Stock("AAPL", 150.0);
        Stock googleStock = new Stock("GOOGL", 2800.0);

        // 투자자 생성 및 옵저버 등록
        Investor investor1 = new Investor("Alice");
        Investor investor2 = new Investor("Bob");

        appleStock.addObserver(investor1);
        appleStock.addObserver(investor2);
        googleStock.addObserver(investor1);

        // 주가 변경
        appleStock.setStockPrice(155.0);
        googleStock.setStockPrice(2850.0);

        // 투자자 제거 후 주가 변경
        appleStock.removeObserver(investor2);
        appleStock.setStockPrice(160.0);
    }
}
```

![](/assets/images/posts/2024-08-23-옵저버-패턴-Observer-Pattern/01.png)

## 코드 설명:

  1. **Observer 인터페이스**:
    * Observer 인터페이스는 옵저버들이 구현해야 하는 update(String stockName, float price) 메서드를 정의한다. 이 메서드는 주체로부터 주식 가격 변경 통지를 받아 해당 정보를 업데이트한다.
  2. **Subject 인터페이스**:
    * Subject 인터페이스는 옵저버를 추가하거나 제거하는 메서드(addObserver(Observer observer), removeObserver(Observer observer))와, 주식 가격이 변경될 때 모든 옵저버에게 통지하는 메서드(notifyObservers())를 정의한다.
  3. **Stock 클래스 (주체)**:
    * Stock 클래스는 주식 정보를 제공하는 주체입니다. 이 클래스는 옵저버 목록을 관리하며, 주식 가격이 변경될 때마다 notifyObservers()를 호출하여 모든 옵저버에게 통지한다.
  4. **Investor 클래스 (옵저버)**:
    * Investor 클래스는 주식을 모니터링하는 투자자를 나타내는 구체적인 옵저버 클래스입니다. 투자자는 주식 가격이 변경될 때 통지를 받아 새로운 가격 정보를 출력한다.
  5. **클라이언트 코드**:
    * 클라이언트는 Stock 객체를 생성하고, Investor를 옵저버로 등록합니다. 주식 가격이 변경될 때마다 투자자들은 자동으로 통지를 받아 최신 가격 정보를 출력한다

## 관련패턴

  1. **퍼블리셔-서브스크라이버(Publisher-Subscriber) 패턴**
    * 퍼블리셔-서브스크라이버 패턴은 옵저버 패턴과 매우 유사한 패턴으로, 이벤트 기반 아키텍처에서 주로 사용된다. 이 패턴에서 퍼블리셔(발행자)는 특정 이벤트가 발생했을 때 서브스크라이버(구독자)들에게 알린다. 옵저버 패턴은 주로 객체 간의 상태 변화를 감지하는 데 사용되며, 퍼블리셔-서브스크라이버 패턴은 이벤트 기반 메시징 시스템에서 사용된다. 퍼블리셔와 서브스크라이버는 서로 직접 참조하지 않기 때문에 더 느슨한 결합을 가진다.
  2. **모델-뷰-컨트롤러(MVC) 패턴**
    * MVC 패턴에서 옵저버 패턴은 일반적으로 모델과 뷰 간의 관계를 관리하는 데 사용된다. 모델이 상태를 변경하면, 이 변경 사항이 모든 뷰에게 통지되어 뷰가 자동으로 갱신됩니다. 모델은 주체(Subject)로, 뷰는 옵저버(Observer)로 동작하여, 모델의 상태 변화에 따라 뷰가 업데이트된다. 컨트롤러는 사용자의 입력을 처리하여 모델의 상태를 변경하고, 이로 인해 옵저버 패턴이 작동하게 된다.
  3. **이벤트 디스패처(Event Dispatcher) 패턴**
    * 이벤트 디스패처 패턴은 이벤트를 처리할 때 옵저버 패턴과 유사한 구조를 사용힌다. 이벤트 디스패처는 특정 이벤트가 발생했을 때 해당 이벤트를 처리할 리스너(옵저버)에게 통지한다. 옵저버 패턴은 주로 상태 변화에 따른 행동을 처리하는 데 사용되며, 이벤트 디스패처 패턴은 다양한 이벤트를 처리하기 위한 구조를 제공한다. 이벤트 디스패처 패턴에서는 여러 이벤트 타입을 다룰 수 있도록 확장된 옵저버 패턴을 사용할 수 있다.
  4. **의존성 주입(Dependency Injection) 패턴**
    * 의존성 주입 패턴은 객체 간의 의존성을 외부에서 주입하여, 객체의 생성과 사용을 분리하는 패턴다. 옵저버 패턴에서 옵저버 객체나 주체 객체를 외부에서 주입하는 방식으로 사용할 수 있다. 이를 통해 옵저버 패턴에서 주체와 옵저버 간의 결합도를 더욱 낮출 수 있으며, 주체와 옵저버의 생성을 클라이언트 코드로부터 분리할 수 있다.
  5. **플라이웨이트(Flyweight) 패턴**
    * 플라이웨이트 패턴은 메모리 사용을 줄이기 위해 동일한 객체를 공유하는 패턴이다. 옵저버 패턴에서 다수의 옵저버가 동일한 상태를 공유할 때, 플라이웨이트 패턴을 사용하여 옵저버 객체를 공유할 수 있다. 상태가 자주 변경되는 시스템에서 옵저버 객체가 많아질 경우, 플라이웨이트 패턴을 사용하여 메모리 사용을 최적화할 수 있다.
  6. **커맨드(Command) 패턴**
    * 커맨드 패턴은 요청을 객체로 캡슐화하여, 클라이언트가 요청을 실행할 수 있도록 하는 패턴이다. 옵저버 패턴과 함께 사용하여, 주체의 상태 변경 시 특정 명령을 실행할 수 있도록 할 수 있다. 옵저버 패턴에서 상태 변화가 발생하면, 이를 커맨드 객체로 캡슐화하여 특정 명령을 실행하는 방식으로 사용할 수 있다.
  7. **상태(State) 패턴**
    * 상태 패턴은 객체의 상태에 따라 행동을 변경하는 패턴이다. 옵저버 패턴과 상태 패턴은 객체의 상태 변화를 감지하고 처리하는 방식에서 유사하다. 옵저버 패턴은 상태 변화에 따른 동작을 처리하며, 상태 패턴은 객체가 상태에 따라 다른 동작을 하도록 설계한다. 옵저버 패턴을 사용하여 상태 변경을 감지하고, 상태 패턴을 사용해 상태에 따라 객체의 행동을 동적으로 변경할 수 있다.
