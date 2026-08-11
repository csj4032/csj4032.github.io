---
title: "프로토타입 패턴 (Prototype Pattern)"
description: "Prototype 패턴은 객체를 직접 만들지 않고 기존 객체를 복제하여 새로운 객체를 생성하는 디자인 패턴이다. 이 패턴은 새로운 객체를 생성하는 데 드는 비용이 큰 경우 유용하며 Prototype 패턴을 사용하면 "
categories:
 - programming
 - design-pattern
source: "https://blog.naver.com/csj4032/223534041667"
---

Prototype 패턴은 객체를 직접 만들지 않고 기존 객체를 복제하여 새로운 객체를 생성하는 디자인 패턴이다. 이 패턴은 새로운 객체를 생성하는 데 드는 비용이 큰 경우 유용하며 Prototype 패턴을 사용하면 객체의 복제 과정을 통해 새로운 객체를 생성할 수 있다.

## "본질을 복제하여 새로운 존재를 탄생시키는 창조의 반복"

Prototype 패턴을 사용하기 좋은 상황은 다음과 같다:

  1. **객체 생성 비용이 높은 경우**:
    * 객체를 생성하는 비용이 높을 때(예: 복잡한 초기화, 많은 자원 할당 등), 기존 객체를 복제하여 새로운 객체를 생성하는 것이 효율적
  2. **비슷한 객체가 많이 필요할 때**:
    * 동일하거나 유사한 객체가 여러 개 필요한 경우, 원본 객체를 복제하여 여러 인스턴스를 생성할 수 있고. 이는 메모리와 시간 측면에서 효율적
  3. **객체의 구체적인 클래스에 의존하지 않고 객체를 생성해야 할 때**:
    * 객체 생성 코드가 구체적인 클래스에 의존하지 않게 하려면, Prototype 패턴을 사용하여 클론 메서드를 통해 객체를 생성할 수 있음
  4. **런타임에 객체의 타입을 동적으로 결정해야 할 때**:
    * 프로그램 실행 중에 객체의 타입을 동적으로 결정하고, 객체를 생성해야 하는 경우에 Prototype 패턴을 사용할 수 있고. 이는 특히 플러그인 시스템이나 동적 객체 생성 시스템에서 유용
  5. **객체의 상태를 다양하게 변경하여 새로운 객체를 생성해야 할 때**:
    * 원본 객체를 복제한 후, 복제된 객체의 상태를 변경하여 새로운 객체를 생성할 수 있고 이는 복잡한 상태를 가진 객체를 생성하는 경우에 유용
  6. **객체가 생성될 때 마다 다른 객체가 참조를 유지해야 할 때**:
    * 원본 객체가 유지하는 참조를 복제하여 새로운 객체에서도 동일한 참조를 유지하고자 할 때, Prototype 패턴이 유용할 수 있음

## 장점

  1. **객체 생성 비용 절감**: 객체를 복제하는 것이 새로운 객체를 생성하는 것보다 비용이 적게 들 때 유리
  2. **간단한 객체 생성**: 복잡한 객체의 생성 과정을 단순화할 수 있음
  3. **런타임에 클래스 확장**: 런타임에 객체의 복제 및 수정이 가능하므로 동적으로 새로운 객체를 생성할 수 있음
  4. **상속의 대안**: 서브클래싱을 통해 객체를 생성하는 대신, 객체를 복제하여 다양한 형태의 객체를 생성할 수 있음

## 단점

  1. **복제 비용**: 객체 복제의 비용이 클 수 있습니다. 특히 깊은 복사(Deep Copy)를 구현할 경우, 성능에 영향을 미칠 수 있음
  2. **복잡성 증가**: 객체 복제 로직을 구현해야 하므로 코드의 복잡성이 증가할 수 있음
  3. **복제 불가능한 객체**: 복제할 수 없는 객체의 경우 Prototype 패턴을 사용할 수 없다. 예를 들어, 복제가 허용되지 않는 자원(파일 핸들, 네트워크 연결 등)을 가진 객체는 복제할 수 없음

## 예시 코드: 게임 캐릭터 생성

게임에서 다양한 캐릭터를 생성해야 하는 경우, Prototype 패턴을 사용하여 기본 캐릭터를 복제하여 새로운 캐릭터를 생성할 수 있다.

```java
import java.util.HashMap;
import java.util.Map;

// Prototype 인터페이스
interface Character extends Cloneable {
    Character clone();
    void display();
}
```

```java
// ConcretePrototype 클래스
class Warrior implements Character {
    private String name;
    private int level;

    public Warrior(String name, int level) {
        this.name = name;
        this.level = level;
    }

    @Override
    public Character clone() {
        return new Warrior(name, level);
    }

    @Override
    public void display() {
        System.out.println("Warrior: " + name + ", Level: " + level);
    }
}

class Mage implements Character {
    private String name;
    private int level;

    public Mage(String name, int level) {
        this.name = name;
        this.level = level;
    }

    @Override
    public Character clone() {
        return new Mage(name, level);
    }

    @Override
    public void display() {
        System.out.println("Mage: " + name + ", Level: " + level);
    }
}
```

```java
// Client 코드
public class Game {
    private Map<String, Character> characterMap = new HashMap<>();

    public Game() {
        characterMap.put("Warrior", new Warrior("Default Warrior", 1));
        characterMap.put("Mage", new Mage("Default Mage", 1));
    }

    public Character createCharacter(String type) {
        return characterMap.get(type).clone();
    }

    public static void main(String[] args) {
        Game game = new Game();

        Character warrior = game.createCharacter("Warrior");
        warrior.display();

        Character mage = game.createCharacter("Mage");
        mage.display();

        // Customize cloned character
        Character customWarrior = game.createCharacter("Warrior");
        customWarrior.display();
    }
}
```

![](/assets/images/posts/2024-08-02-프로토타입-패턴-Prototype-Pattern/01.png)

## 코드 구성 설명

  1. **Character 인터페이스**
    * Character 인터페이스는 clone 메서드와 display 메서드를 정의
    * Cloneable 인터페이스를 구현하여 객체가 복제 가능하도록 함
  2. **Warrior 클래스**
    * Warrior 클래스는 Character 인터페이스를 구현
    * name과 level 필드를 가지고 있으며, 복제 메서드(clone)와 출력 메서드(display)를 구현
    * clone 메서드는 새로운 Warrior 객체를 생성하고, 현재 객체의 name과 level을 그대로 복사하여 반환
  3. **Mage 클래스**
    * Mage 클래스는 Character 인터페이스를 구현
    * name과 level 필드를 가지고 있으며, 복제 메서드(clone)와 출력 메서드(display)를 구현
    * clone 메서드는 새로운 Mage 객체를 생성하고, 현재 객체의 name과 level을 그대로 복사하여 반환
  4. **Game 클래스 (Client 코드)**
    * Game 클래스는 캐릭터 프로토타입을 저장하는 characterMap을 가지고 있음
    * 생성자에서 기본 캐릭터(Warrior와 Mage)를 초기화
    * createCharacter 메서드는 주어진 타입의 캐릭터를 복제하여 반환
    * main 메서드에서 Game 객체를 생성하고, 캐릭터를 복제하여 출력

## 관련 패턴

  1. **Factory Method 패턴**
    * Factory Method 패턴은 객체 생성의 책임을 서브클래스에 넘기는 패턴입니다. Prototype 패턴과 유사하게 객체를 생성하지만, Prototype 패턴은 객체를 복제하는 방식인 반면, Factory Method 패턴은 객체 생성을 위한 인터페이스를 정의하고 이를 구현하는 서브클래스가 구체적인 객체 생성을 담당한다. Prototype 패턴은 객체를 복제하여 생성하고, Factory Method 패턴은 서브클래스가 객체를 생성하도록 한다. 두 패턴 모두 객체 생성을 캡슐화하지만, 접근 방식이 다르다.
  2. **Abstract Factory 패턴**
    * Abstract Factory 패턴은 관련 객체의 군을 생성하기 위한 인터페이스를 제공합니다. 클라이언트는 구체적인 클래스에 의존하지 않고, 인터페이스를 통해 객체를 생성한다. Abstract Factory 패턴은 여러 종류의 객체를 생성할 때 유용하며, Prototype 패턴과 결합하여 객체 생성을 더욱 유연하게 할 수 있다. 예를 들어, Abstract Factory에서 Prototype 패턴을 사용하여 생성할 객체를 미리 정의할 수 있다.
  3. **Singleton 패턴**
    * Singleton 패턴은 클래스의 인스턴스를 하나만 존재하도록 보장합니다. 전역 접근점을 제공하며, 시스템 내에서 객체가 단 하나만 필요할 때 사용된다. Singleton 패턴과 Prototype 패턴은 반대의 개념으로 보일 수 있습니다. Singleton 패턴은 단일 객체를 보장하지만, Prototype 패턴은 복제를 통해 여러 객체를 생성한다. 그러나 두 패턴을 함께 사용하여 단일 인스턴스를 복제하는 전략을 구현할 수 있다.
  4. **Memento 패턴**
    * Memento 패턴은 객체의 내부 상태를 캡슐화하여 저장하고, 나중에 복원할 수 있도록 합니다. 객체의 상태를 저장하고 복원하는 기능을 제공하여 객체의 상태를 변경했다가 다시 복원할 수 있다. Prototype 패턴은 객체를 복제하여 새로운 인스턴스를 생성하고, Memento 패턴은 객체의 상태를 저장하고 복원한다. 둘 다 객체의 상태를 관리하는 데 도움이 되지만, 사용 목적이 다르다
  5. **Builder 패턴**
    * Builder 패턴은 복합 객체의 생성 과정을 단계별로 나누어 객체를 생성하는 패턴입니다. 복잡한 객체를 생성할 때 사용되며, 객체의 내부 표현을 생성 과정과 분리한다. Builder 패턴은 객체를 복잡하게 구성할 때 유용하며, Prototype 패턴과 결합하여 복제된 객체를 기반으로 복잡한 객체를 쉽게 구성할 수 있다.
