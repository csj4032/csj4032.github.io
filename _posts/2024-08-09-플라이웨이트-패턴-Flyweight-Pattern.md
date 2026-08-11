---
title: "플라이웨이트 패턴 (Flyweight Pattern)"
description: "플라이웨이트(Flyweight) 패턴은 많은 수의 작은 객체를 효율적으로 공유하여 메모리 사용을 절약하는 구조적 디자인 패턴이다. 이 패턴은 객체의 수가 매우 많을 때, 가능한 한 동일한 객체를 공유하여 메모리 사용"
categories:
 - programming
 - design-pattern
source: "https://blog.naver.com/csj4032/223542036413"
---

플라이웨이트(Flyweight) 패턴은 많은 수의 작은 객체를 효율적으로 공유하여 메모리 사용을 절약하는 구조적 디자인 패턴이다. 이 패턴은 객체의 수가 매우 많을 때, 가능한 한 동일한 객체를 공유하여 메모리 사용량을 최소화하는 데 중점을 둡니다. 특히 객체 생성 비용이 클 때 유용하다.

## "공유의 지혜로 작은 것들이 큰 가치를 만든다."

플라이웨이트(Flyweight) 패턴을 사용하면 좋은 경우는 다음과 같다:

  1. **동일한 객체가 다수 생성될 때**
    * 동일한 도형 객체를 공유하여 메모리 사용량을 절감할 수 있습니다. 예를 들어, 모든 원 객체가 동일한 색상과 크기를 가진다면, 이를 하나의 플라이웨이트 객체로 만들어 공유할 수 있음
  2. **객체 생성 비용이 클 때**
    * 동일한 글꼴과 크기, 색상을 공유하는 플라이웨이트 객체를 사용하여 문자 객체를 생성함으로써, 생성 비용을 줄일 수 있음
  3. **시스템에 작은 객체가 많이 필요할 때**
    * 동일한 핀 스타일을 사용하는 위치 핀들을 하나의 플라이웨이트 객체로 공유하여 메모리 사용을 최소화할 수 있음
  4. **객체 수가 제한된 자원에서 매우 클 때**
    * 동일한 종류의 센서 데이터를 공유하여 메모리 사용을 최적화할 수 있음
  5. **객체가 다수 생성되지만 대부분 동일한 상태를 가질 때**
    * 동일한 속성을 공유하는 캐릭터 객체를 플라이웨이트 패턴으로 구현하여 메모리와 성능을 최적화할 수 있음
  6. **객체의 개별 상태를 외부에서 관리할 수 있을 때**
    * 공통된 색상을 플라이웨이트 객체로 공유하고, 픽셀 위치와 같은 개별 상태는 외부에서 관리하도록 하여 메모리를 절약할 수 있음

## 장점

  1. **메모리 절약**:
    * 플라이웨이트 패턴의 가장 큰 장점은 메모리 사용을 크게 줄일 수 있다는 점입니다. 동일한 객체를 여러 개 생성하는 대신, 하나의 객체를 공유하여 메모리 사용량을 최소화할 수 있음
  2. **객체 생성 비용 감소**:
    * 객체를 반복적으로 생성할 필요가 없어지므로 객체 생성 비용이 줄어듭니다. 이는 특히 객체 생성이 복잡하고 비용이 큰 경우에 유리
  3. **시스템 성능 향상**:
    * 메모리 사용이 최적화되고 객체 생성 비용이 줄어들면, 시스템 전체의 성능이 향상될 수 있습니다. 메모리 관리의 효율성이 높아져 가비지 컬렉션 등의 비용도 감소
  4. **유지보수 용이성**:
    * 공유 객체를 관리하는 팩토리 클래스를 사용하기 때문에, 객체의 생성을 중앙에서 통제할 수 있습니다. 이를 통해 객체의 변경이나 확장이 용이함

## 단점

  1. **코드 복잡성 증가**:
    * 플라이웨이트 패턴을 사용하면 객체의 상태를 분리하여 외부에서 관리해야 하므로 코드가 복잡해질 수 있습니다. 객체의 외재 상태(Extrinsic State)를 관리하는 코드가 추가되면서 가독성과 유지보수성이 저하될 수 있
  2. **개발 시간 증가**:
    * 플라이웨이트 패턴은 객체 공유를 통해 메모리와 성능을 최적화하기 때문에, 이를 구현하고 유지하는 데 시간이 더 걸릴 수 있습니다. 특히 초기 설계 단계에서 객체의 상태를 어떻게 분리하고 관리할지 고민해야 함
  3. **객체 식별 어려움**:
    * 플라이웨이트 패턴에서는 동일한 객체가 여러 클라이언트에서 공유되기 때문에, 특정 객체가 어떤 클라이언트에 속하는지 구별하기 어려울 수 있습니다. 이는 객체 간의 독립성을 유지해야 하는 상황에서 문제가 될 수 있음
  4. **외부 상태 관리 필요**:
    * 플라이웨이트 객체는 공유 상태를 가지지만, 개별 상태는 외부에서 관리해야 합니다. 이로 인해 상태 관리가 복잡해질 수 있으며, 상태를 외부에서 전달해야 하는 불편함이 생길 수 있음
  5. **객체의 고유성 상실**:
    * 플라이웨이트 패턴을 사용하면 객체가 고유성을 상실하게 됩니다. 즉, 객체의 식별자가 없어지고, 동일한 객체가 여러 클라이언트에서 공유되므로, 객체의 변경이 모든 클라이언트에 영향을 미칠 수 있음

## 플라이웨이트(Flyweight) 패턴을 사용하는 지도 애플리케이션 예제:

이 예제에서는 지도에 표시되는 수많은 위치 핀(마커)를 효율적으로 관리하기 위해 플라이웨이트 패턴을 사용한다.

```text
interface MapMarker {
    void display(int x, int y);
}
```

```java
// 마커 클래스
class Marker implements MapElement {
    private final String color;
    private final String icon;

    public Marker(String color, String icon) {
        this.color = color;
        this.icon = icon;
    }

    @Override
    public void display(int x, int y) {
        System.out.println("Displaying marker at (" + x + ", " + y + ") with color " + color + " and icon " + icon);
    }
}

// 원형 도형 클래스
class Circle implements MapElement {
    private final String color;
    private final int radius;

    public Circle(String color, int radius) {
        this.color = color;
        this.radius = radius;
    }

    @Override
    public void display(int x, int y) {
        System.out.println("Displaying circle at (" + x + ", " + y + ") with color " + color + " and radius " + radius);
    }
}

// 사각형 도형 클래스
class Rectangle implements MapElement {
    private final String color;
    private final int width;
    private final int height;

    public Rectangle(String color, int width, int height) {
        this.color = color;
        this.width = width;
        this.height = height;
    }

    @Override
    public void display(int x, int y) {
        System.out.println("Displaying rectangle at (" + x + ", " + y + ") with color " + color + ", width " + width + ", and height " + height);
    }
}
```

```java
import java.util.HashMap;
import java.util.Map;

class MapElementFactory {
    private static final Map<String, MapElement> elements = new HashMap<>();

    public static MapElement getMarker(String color, String icon) {
        String key = "Marker-" + color + "-" + icon;
        if (!elements.containsKey(key)) {
            elements.put(key, new Marker(color, icon));
        }
        return elements.get(key);
    }

    public static MapElement getCircle(String color, int radius) {
        String key = "Circle-" + color + "-" + radius;
        if (!elements.containsKey(key)) {
            elements.put(key, new Circle(color, radius));
        }
        return elements.get(key);
    }

    public static MapElement getRectangle(String color, int width, int height) {
        String key = "Rectangle-" + color + "-" + width + "-" + height;
        if (!elements.containsKey(key)) {
            elements.put(key, new Rectangle(color, width, height));
        }
        return elements.get(key);
    }

    public static int getTotalElements() {
        return elements.size();
    }
}
```

```java
public class FlyweightPatternComplexExample {
    public static void main(String[] args) {
        // 마커 생성 및 표시
        MapElement marker1 = MapElementFactory.getMarker("Red", "Default");
        marker1.display(100, 200);

        MapElement marker2 = MapElementFactory.getMarker("Blue", "Default");
        marker2.display(150, 250);

        MapElement marker3 = MapElementFactory.getMarker("Red", "Default");
        marker3.display(200, 300);

        // 원형 도형 생성 및 표시
        MapElement circle1 = MapElementFactory.getCircle("Green", 50);
        circle1.display(400, 500);

        MapElement circle2 = MapElementFactory.getCircle("Green", 50);
        circle2.display(450, 550);

        MapElement circle3 = MapElementFactory.getCircle("Blue", 75);
        circle3.display(500, 600);

        // 사각형 도형 생성 및 표시
        MapElement rectangle1 = MapElementFactory.getRectangle("Yellow", 60, 30);
        rectangle1.display(300, 400);

        MapElement rectangle2 = MapElementFactory.getRectangle("Yellow", 60, 30);
        rectangle2.display(350, 450);

        MapElement rectangle3 = MapElementFactory.getRectangle("Red", 40, 20);
        rectangle3.display(400, 500);

        // 총 생성된 요소 객체 수 출력
        System.out.println("Total elements created: " + MapElementFactory.getTotalElements());
    }
}
```

![](/assets/images/posts/2024-08-09-플라이웨이트-패턴-Flyweight-Pattern/01.png)

## 코드 설명

  1. **MapMarker 인터페이스**:
    * MapMarker 인터페이스는 마커 객체가 가져야 할 기본 동작(display)을 정의, 이 동작은 지도상의 특정 위치에 마커를 표시
  2. **ConcreteMapMarker 클래스**:
    * Marker, Circle, Rectangle 클래스는 각각 MapElement 인터페이스를 구현하여, 마커, 원형 도형, 사각형 도형을 표현
    * 각 클래스는 공유 가능한 속성(예: 색상, 아이콘, 크기 등)을 내부 상태로 가지고 있으며, 이를 기반으로 지도에 해당 요소를 표시
  3. **MapMarkerFactory 클래스**:
    * MapElementFactory 클래스는 플라이웨이트 객체(마커, 원형 도형, 사각형 도형)를 생성하고 관리
    * 이미 생성된 객체는 Map에 저장되어 재사용되며, 새로운 객체가 필요할 때만 생성
  4. **FlyweightPatternExample 클래스**:
    * FlyweightPatternComplexExample 클래스는 클라이언트 코드로, 다양한 위치에 마커와 도형을 생성하고 표시
    * 동일한 색상과 아이콘, 크기를 가진 요소는 동일한 객체를 공유
    * 마지막으로, 총 생성된 요소 객체의 수를 출력

## 관련 패턴

  1. **싱글톤(Singleton) 패턴**
    * 싱글톤 패턴은 특정 클래스의 인스턴스가 오직 하나만 존재하도록 보장하는 패턴이다. 플라이웨이트 패턴과 싱글톤 패턴은 모두 객체를 공유하고, 인스턴스 수를 줄이는 것을 목표
  2. **2. 팩토리(Factory) 패턴**
    * 플라이웨이트 패턴에서 객체의 생성과 관리를 책임지는 팩토리 클래스를 자주 사용하고 팩토리 패턴은 객체 생성을 캡슐화하여 클라이언트 코드와 객체 생성 로직을 분리하는 역할
  3. **3. 프로토타입(Prototype) 패턴**
    * 프로토타입 패턴은 객체를 생성할 때, 기존 객체를 복사(clone)하여 새로운 객체를 만드는 패턴이며 플라이웨이트 패턴과 유사하게, 객체를 재사용하려는 목적이 있지만, 플라이웨이트 패턴은 객체의 공유에 중점을 두고, 프로토타입 패턴은 객체 복사에 중점
  4. **4. 데코레이터(Decorator) 패턴**
    * 데코레이터 패턴은 객체에 새로운 기능을 동적으로 추가하는 패턴이다. 플라이웨이트 패턴과 데코레이터 패턴 모두 객체를 효율적으로 관리하는 데 중점을 둡니다. 플라이웨이트 패턴은 공유를 통한 메모리 절약에, 데코레이터 패턴은 객체 기능의 동적 확장에 중점
  5. **5. 컴포지트(Composite) 패턴**
    * 컴포지트 패턴은 객체를 트리 구조로 구성하여 부분-전체 계층을 표현하는 패턴이고 플라이웨이트 패턴과 컴포지트 패턴은 모두 복잡한 객체 구조를 다루며, 객체 수를 줄이고, 효율성을 높이는 데 도움
  6. **6. 브리지(Bridge) 패턴**
    * 브리지 패턴은 구현과 추상을 분리하여 각각 독립적으로 변형할 수 있도록 하는 패턴이며 플라이웨이트 패턴과 브리지 패턴은 모두 객체 구조의 복잡성을 줄이고, 시스템의 유연성을 향상시키는 것을 목표
