---
title: "퍼사드 패턴 (Facade Pattern)"
description: "퍼사드(Facade) 패턴은 복잡한 서브시스템에 단순한 인터페이스를 제공하여 서브시스템을 쉽게 사용할 수 있도록 하는 구조적 디자인 패턴이다. 이 패턴은 클라이언트가 복잡한 서브시스템의 내부 구현을 알 필요 없이 간"
categories:
 - programming
 - design-pattern
source: "https://blog.naver.com/csj4032/223540976646"
---

퍼사드(Facade) 패턴은 복잡한 서브시스템에 단순한 인터페이스를 제공하여 서브시스템을 쉽게 사용할 수 있도록 하는 구조적 디자인 패턴이다. 이 패턴은 클라이언트가 복잡한 서브시스템의 내부 구현을 알 필요 없이 간단한 인터페이스를 통해 서브시스템을 사용할 수 있게 한다.

## "패턴은 복잡한 내면을 단순한 외면으로 연결하여, 심오한 이해 없이도 쉽게 다가설 수 있는 길을 연다."

퍼사드(Facade) 패턴을 사용하면 좋은 경우는 다음과 같습니다:

  1. **복잡한 서브시스템을 단순화하고 싶을 때**:
    * 서브시스템이 매우 복잡하고, 이를 사용하는 클라이언트 코드가 단순하고 명확해지도록 하고 싶은 경우. 퍼사드 패턴을 통해 클라이언트가 서브시스템의 복잡성을 알 필요 없이 사용
  2. **서브시스템과** 클라이언트 간의 결합도를 줄이고 싶을 때:
    * 클라이언트가 서브시스템의 세부 구현에 의존하지 않도록 하여, 서브시스템의 변경이 클라이언트에 영향을 미치지 않게 하고 싶은 경우. 퍼사드 패턴을 통해 서브시스템의 변경이 클라이언트 코드에 미치는 영향을 최소화
  3. **레거시 코드를 감싸고 싶을 때:**
    * 레거시 시스템을 현대화하거나, 기존의 복잡한 인터페이스를 단순화하여 새로운 시스템에서 쉽게 사용할 수 있도록 하고 싶은 경우. 퍼사드 패턴을 통해 레거시 시스템을 감싸서 단순한 인터페이스를 제공
  4. **서로 다른 여러 서브시스템을 통합하고 싶을 때:**
    * 여러 서브시스템을 하나의 단일 인터페이스로 통합하여 일관된 방식으로 접근하고 사용할 수 있도록 하고 싶은 경우. 퍼사드 패턴을 통해 여러 서브시스템의 기능을 하나의 단순한 인터페이스로 제공
  5. **테스트 및 유지보수성을 향상시키고 싶을 때:**
    * 서브시스템의 복잡한 내부 구조를 감추어 클라이언트 코드의 테스트 및 유지보수성을 높이고 싶은 경우. 퍼사드 패턴을 통해 단순한 인터페이스를 제공함으로써 테스트와 유지보수가 수월

## 장점

  1. **복잡성 감소**:
    * 퍼사드 패턴은 복잡한 서브시스템을 단순한 인터페이스로 감싸기 때문에, 클라이언트는 서브시스템의 내부 구현을 알 필요 없이 단순하게 사용할 수 있음
  2. **결합도 감소**:
    * 클라이언트와 서브시스템 간의 결합도를 줄여주고 클라이언트는 퍼사드를 통해서만 서브시스템에 접근하므로, 서브시스템의 변경이 클라이언트에 직접적인 영향을 미치지 않음
  3. **유지보수성 향상**:
    * 퍼사드를 사용하면 클라이언트 코드의 유지보수성이 향상되고 클라이언트는 복잡한 서브시스템의 여러 부분을 알 필요 없이 퍼사드 인터페이스만 사용하면 되므로 코드의 가독성이 높아지고 유지보수가 용이해짐
  4. **재사용성 증가**:
    * 퍼사드 패턴은 코드 재사용성을 증가시킵니다. 여러 클라이언트가 동일한 퍼사드 인터페이스를 사용할 수 있으므로, 코드의 중복을 줄이고 재사용성을 높일 수 있음
  5. **인터페이스 단순화**:
    * 복잡한 서브시스템의 인터페이스를 단순화하여 클라이언트가 더 쉽게 사용할 수 있음

단점

  1. **추가 계층 도입**:
    * 퍼사드 패턴은 추가적인 계층을 도입하기 때문에 퍼사드 클래스 자체가 복잡해질 수 있고 이는 퍼사드 클래스를 유지보수하는 데 어려움을 초래할 수 있음
  2. **서브시스템 기능 노출의 한계**:
    * 퍼사드 패턴은 서브시스템의 모든 기능을 노출하기 어려우며 퍼사드가 제공하는 인터페이스를 통해 서브시스템의 특정 기능만 사용할 수 있으며, 모든 기능을 지원하려면 퍼사드 클래스를 계속 확장해야 함
  3. **성능 오버헤드**:
    * 퍼사드 패턴을 사용하면 퍼사드 클래스에서 추가적인 메서드 호출이 발생할 수 있으므로 성능 오버헤드가 발생할 수 있고 이는 특히 성능이 중요한 시스템에서 문제가 될 수 있음
  4. **디자인 제약**:
    * 퍼사드 패턴은 서브시스템의 인터페이스를 단순화하기 때문에, 서브시스템의 기능을 완벽하게 사용할 수 없게 만들 수도 있으며 이는 클라이언트가 특정 기능에 접근해야 할 때 문제를 일으킬 수 있음

## 퍼사드(Facade) 패턴을 사용한 그래픽 시스템 예제:

이 시스템은 이미지 로드, 처리, 렌더링뿐만 아니라, 다양한 이미지 효과 적용 및 저장 기능을 포함하고 퍼사드 패턴을 사용하여 이러한 복잡한 기능을 단순한 인터페이스로 감싸도록 한다.

```java
// 서브시스템 클래스 1 - 이미지 로더
class ImageLoader {
    public void load(String filename) {
        System.out.println("Loading image: " + filename);
    }
}

// 서브시스템 클래스 2 - 이미지 프로세서
class ImageProcessor {
    public void process() {
        System.out.println("Processing image");
    }
}

// 서브시스템 클래스 3 - 이미지 렌더러
class ImageRenderer {
    public void render() {
        System.out.println("Rendering image");
    }
}

// 서브시스템 클래스 4 - 이미지 필터
class ImageFilter {
    public void applyFilter(String filter) {
        System.out.println("Applying filter: " + filter);
    }
}

// 서브시스템 클래스 5 - 이미지 세이버
class ImageSaver {
    public void save(String filename) {
        System.out.println("Saving image as: " + filename);
    }
}

// 서브시스템 클래스 1 - 이미지 로더
class ImageLoader {
    public void load(String filename) {
        System.out.println("Loading image: " + filename);
    }
}

// 서브시스템 클래스 2 - 이미지 프로세서
class ImageProcessor {
    public void process() {
        System.out.println("Processing image");
    }
}

// 서브시스템 클래스 3 - 이미지 렌더러
class ImageRenderer {
    public void render() {
        System.out.println("Rendering image");
    }
}

// 서브시스템 클래스 4 - 이미지 필터
class ImageFilter {
    public void applyFilter(String filter) {
        System.out.println("Applying filter: " + filter);
    }
}

// 서브시스템 클래스 5 - 이미지 세이버
class ImageSaver {
    public void save(String filename) {
        System.out.println("Saving image as: " + filename);
    }
}

public class FacadePatternExample {
    public static void main(String[] args) {
        GraphicsFacade facade = new GraphicsFacade();
        
        // 개별 작업 수행
        facade.loadImage("example.jpg");
        facade.processImage();
        facade.applyImageFilter("Sepia");
        facade.renderImage();
        facade.saveImage("processed_example.jpg");

        System.out.println();

        // 복합 작업 수행
        facade.loadProcessRenderSave("example2.jpg", "Grayscale", "processed_example2.jpg");
    }
}
```

![](/assets/images/posts/2024-08-08-퍼사드-패턴-Facade-Pattern/01.png)

## 코드 설명

  1. **서브시스템 클래스**:
    * ImageLoader, ImageProcessor, ImageRenderer, ImageFilter, ImageSaver 클래스는 각각 이미지 로드, 처리, 렌더링, 필터 적용, 저장 기능을 담당
  2. **퍼사드 클래스**:
    * GraphicsFacade 클래스는 서브시스템 클래스들을 포함하고 있으며, 클라이언트가 쉽게 사용할 수 있는 메서드를 제공합니다. 예를 들어, loadImage, processImage, renderImage, applyImageFilter, saveImage 메서드를 통해 서브시스템의 기능을 단순화
    * loadProcessRenderSave 메서드는 여러 작업을 결합하여 클라이언트가 한 번의 호출로 일련의 작업을 수행할 수 있도록 함
  3. **클라이언트 코드**:
    * FacadePatternExample 클래스의 main 메서드는 GraphicsFacade 객체를 생성하고, 개별 작업과 복합 작업을 수행 클라이언트는 퍼사드 인터페이스를 통해 복잡한 그래픽 시스템을 간단하게 사용할 수 있음

## 관련 패턴

  1. **어댑터(Adapter) 패턴**
    * 퍼사드 패턴과 어댑터 패턴 모두 인터페이스를 단순화하거나 변환하여 클라이언트가 쉽게 사용할 수 있도록 하고 퍼사드는 여러 서브시스템을 단순한 인터페이스로 감싸고, 어댑터는 하나의 클래스의 인터페이스를 변환
  2. **컴포지트(Composite) 패턴**
    * 퍼사드 패턴과 컴포지트 패턴 모두 복잡한 구조를 단순하게 만들고, 클라이언트가 쉽게 사용할 수 있도록 하며 퍼사드는 서브시스템의 복잡성을 감추고, 컴포지트는 객체 구조의 복잡성을 감춤
  3. **프록시(Proxy) 패턴**
    * 퍼사드 패턴과 프록시 패턴 모두 다른 객체에 대한 접근을 단순화하거나 제어하는 역할을 하며 퍼사드는 복잡한 서브시스템에 대한 단순한 인터페이스를 제공하고, 프록시는 접근 제어와 관련된 기능을 추가함
  4. **디코레이터(Decorator) 패턴**
    * 퍼사드 패턴과 디코레이터 패턴 모두 객체의 인터페이스를 단순화하거나 확장하여 클라이언트가 쉽게 사용할 수 있도록 하고 퍼사드는 단순화를, 디코레이터는 기능 확장을 주로 다룸
  5. **브리지(Bridge) 패턴**
    * 퍼사드 패턴과 브리지 패턴 모두 복잡성을 관리하는 데 도움을 주며 퍼사드는 단순한 인터페이스를 제공하여 복잡성을 감추고, 브리지 패턴은 추상화와 구현을 분리하여 복잡성을 줄임
  6. **싱글톤(Singleton) 패턴**
    * 퍼사드 패턴과 싱글톤 패턴은 함께 사용되어 퍼사드 객체가 전역적으로 하나만 존재하도록 할 수 있으며 이를 통해 클라이언트는 퍼사드 인터페이스를 언제나 동일한 방식으로 사용할 수 있음
