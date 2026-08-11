---
title: "메멘토 패턴(Memento Pattern)"
description: "메멘토 패턴(Memento Pattern)은 객체의 상태를 캡슐화하여, 해당 객체의 상태를 나중에 복원할 수 있도록 하는 행동(Behavioral) 디자인 패턴입니다. 이 패턴은 객체의 내부 상태를 저장하고, 이전 "
categories:
 - programming
 - design-pattern
source: "https://blog.naver.com/csj4032/223563586810"
---

메멘토 패턴(Memento Pattern)은 객체의 상태를 캡슐화하여, 해당 객체의 상태를 나중에 복원할 수 있도록 하는 행동(Behavioral) 디자인 패턴입니다. 이 패턴은 **객체의 내부 상태를 저장**하고, **이전 상태로 돌아갈 수 있는 기능**을 제공하는데 유용합니다. 메멘토 패턴을 사용하면 객체의 상태를 저장하고 복원할 수 있으면서도, 객체의 내부 구조가 외부에 노출되지 않도록 할 수 있습니다.

**"과거는 미래의 씨앗이며, 현재의 거울이다. 우리의 경험은 언제든 되돌아갈 수 있는 소중한 지혜의 보고이다."**

메멘토 패턴(Memento Pattern)은 다음과 같은 상황에서 유용하게 사용될 수 있습니다:

  1. **객체의 상태를 되돌리거나 복원해야 할 때**:
    * 사용자가 객체의 상태를 이전 상태로 되돌릴 수 있도록 하는 기능이 필요할 때, 메멘토 패턴이 유용하다. 메멘토 패턴을 통해 객체의 상태를 저장하고, 필요할 때 해당 상태로 복원할 수 있다. 텍스트 편집기에서 사용자가 작업 중인 문서를 편집하다가 실수를 했을 때, "Undo" 기능을 통해 이전 상태로 되돌릴 수 있다.
  2. **객체의 내부 상태를 외부에 노출하지 않으면서 상태를 저장해야 할 때**:
    * 객체의 내부 상태를 캡슐화하고, 외부에서 해당 상태에 접근하거나 변경하지 못하도록 해야 하는 경우, 메멘토 패턴을 사용하여 상태를 안전하게 저장할 수 있다. 객체의 상태를 외부에 노출하지 않으면서도, 상태를 저장하고 복원할 수 있는 기능을 제공한다. 데이터베이스 트랜잭션 관리 시스템에서 트랜잭션의 상태를 안전하게 저장하고, 필요할 때 복원하여 트랜잭션을 롤백할 수 있다.
  3. **복잡한 객체의 상태를 관리해야 할 때**:
    * 객체의 상태가 복잡하여 상태를 관리하기 어려운 경우, 메멘토 패턴을 사용하여 상태를 간단하게 저장하고 복원할 수 있다. 특히, 여러 단계의 작업이나 복잡한 계산 과정에서 중간 상태를 저장해둘 필요가 있는 경우에 유용하다. 그래픽 소프트웨어에서 사용자가 이미지 편집 중에 여러 단계의 필터를 적용할 때, 중간 상태를 저장해두고 필요할 때 이전 상태로 되돌릴 수 있다.
  4. **실험적 변경을 적용한 후 상태를 복구해야 할 때**:
    * 사용자가 실험적이거나 위험한 변경을 적용하기 전에 상태를 저장해두고, 변경 결과가 예상과 다를 경우 상태를 복구할 수 있도록 해야 하는 경우, 메멘토 패턴이 유용합니다. 변경을 적용하기 전에 현재 상태를 저장하고, 필요시 원래 상태로 되돌릴 수 있다. 금융 소프트웨어에서 사용자가 특정 시뮬레이션을 실행하기 전에 현재 데이터를 저장하고, 시뮬레이션 결과가 좋지 않을 경우 데이터를 원래 상태로 복구할 수 있다.
  5. **다중 체크포인트를 저장하고 관리해야 할 때**:
    * 객체의 상태를 여러 시점에 걸쳐 저장하고, 각각의 체크포인트로 되돌려야 하는 경우 메멘토 패턴을 사용하여 상태를 관리할 수 있다. 여러 시점의 상태를 저장하고, 필요할 때 각각의 상태로 돌아갈 수 있다. 비디오 게임에서 플레이어가 특정 지점에서 저장(Save)하고, 게임 진행 중에 실패할 경우 해당 지점으로 다시 돌아가는 기능을 구현할 수 있다.
  6. **복잡한 알고리즘의 중간 결과를 저장해야 할 때**:
    * 복잡한 알고리즘을 수행하면서 중간 결과를 저장해두고, 필요할 때 해당 중간 결과를 다시 사용할 수 있는 기능이 필요할 때 메멘토 패턴을 사용할 수 있습니다. 중간 결과를 저장하여, 알고리즘이 중단되거나 오류가 발생했을 때 중간 상태로 돌아가 작업을 계속할 수 있다. 긴 계산 과정을 거치는 과학적 시뮬레이션에서 중간 결과를 저장해두고, 오류가 발생했을 때 중단된 지점부터 다시 계산을 시작할 수 있다.

## 장점

  1. **객체 상태의 캡슐화**
    * 메멘토 패턴은 객체의 상태를 캡슐화하여 외부에 노출하지 않고 안전하게 저장할 수 있다. Memento 객체는 Originator의 내부 상태를 캡슐화하기 때문에, 외부에서는 객체의 상태에 접근하거나 변경할 수 없다. 이를 통해 객체의 내부 구조를 보호하면서 상태를 저장하고 복원할 수 있다. 텍스트 편집기에서 사용자가 여러 번 "되돌리기(Undo)" 기능을 사용하더라도, 메멘토 패턴을 통해 객체의 상태가 안전하게 관리되고 외부에서 직접 상태를 변경할 수 없도록 할 수 있다.
  2. **복잡한 객체의 상태 관리**
    * 메멘토 패턴은 복잡한 객체의 상태를 관리하는 데 유용하다. 객체의 상태가 복잡하고 다양한 속성들로 이루어져 있을 때, 메멘토 패턴을 사용하면 객체의 상태를 간단히 저장하고 복원할 수 있다. 상태 저장과 복원을 통해 복잡한 작업을 더 쉽게 관리할 수 있다. 그래픽 소프트웨어에서 복잡한 이미지 편집 작업을 수행할 때, 각 단계의 상태를 저장해두고 필요할 때 쉽게 복원할 수 있다.
  3. **되돌리기(Undo) 및 복구(Redo) 기능 제공**
    * 메멘토 패턴은 되돌리기(Undo) 및 복구(Redo) 기능을 쉽게 구현할 수 있는 방법을 제공한다. 사용자가 작업을 수행하는 과정에서 실수를 하거나 이전 상태로 돌아가고 싶을 때, 메멘토 패턴을 사용하여 이러한 기능을 구현할 수 있다. 문서 편집기에서 사용자가 여러 번의 편집 작업을 수행한 후, 이전 상태로 되돌아가거나 다시 복구할 수 있는 기능을 구현할 수 있다.
  4. **객체의 원자적(Atomic) 상태 복원 가능**
    * 메멘토 패턴은 객체의 상태를 원자적으로(하나의 전체로) 저장하고 복원할 수 있다. 이를 통해 시스템의 일관성을 유지하고, 복구 작업이 중단되거나 실패했을 때도 안전하게 상태를 복원할 수 있다. 금융 애플리케이션에서 트랜잭션의 상태를 저장하고, 필요할 때 트랜잭션을 안전하게 롤백할 수 있다.
  5. **객체의 상태 저장 시점 관리**
    * 메멘토 패턴을 사용하면 객체의 상태를 저장할 시점을 관리할 수 있다. 특정 시점에 객체의 상태를 저장해두고, 이후 작업을 수행한 후 필요할 때 상태를 복원할 수 있다. 이를 통해 실험적 변경이나 위험한 작업을 수행할 때 안전장치를 마련할 수 있다. 데이터베이스 관리 시스템에서 대규모 변경 작업을 수행하기 전에 현재 상태를 저장하고, 작업이 실패하면 저장된 상태로 복원할 수 있다.

## 단점

  1. **메모리 사용 증가**
    * 메멘토 패턴은 객체의 상태를 저장하기 위해 Memento 객체를 생성하므로, 상태가 자주 변경되거나 상태 정보가 큰 경우 메모리 사용량이 크게 증가할 수 있다. 이로 인해 시스템 성능에 부정적인 영향을 미칠 수 있으며, 특히 메모리 제약이 있는 환경에서는 문제가 될 수 있다. 대규모 데이터가 포함된 객체의 상태를 자주 저장해야 하는 시스템에서는 메모리 사용량이 급격히 증가할 수 있다.
  2. **복잡성 증가**
    * 메멘토 패턴을 구현하려면 상태 저장과 복원을 관리하기 위한 추가적인 코드가 필요하며, 이로 인해 코드의 복잡성이 증가할 수 있다. 특히, 복잡한 객체의 상태를 저장할 때 코드가 더욱 복잡해질 수 있으며, 상태 저장 및 복원 로직을 관리하기 어렵게 만들 수 있다. 복잡한 게임에서 캐릭터의 상태를 저장하고 복원하는 기능을 구현할 때, 메멘토 패턴을 사용하면 많은 관리 코드가 필요할 수 있다.
  3. **객체 상태 관리의 어려움**
    * 메멘토 패턴을 사용할 때, 어떤 상태를 언제 저장하고 복원할지 결정하는 것이 어려울 수 있다. 잘못된 상태를 복원하거나 불필요한 상태를 저장하면 시스템의 일관성이 깨질 수 있으며, 저장된 상태와 복원된 상태 간의 불일치가 발생할 수 있다.
    * 복잡한 워크플로우 시스템에서 잘못된 시점에 상태를 저장하거나 복원하면, 작업 진행 상태가 불일치하여 혼란을 초래할 수 있다.
  4. **상태 복원 시 부작용 발생 가능성**
    * 상태 복원 시 객체의 현재 상태와 저장된 상태 간에 불일치가 발생할 수 있으며, 이로 인해 예상치 못한 부작용이 발생할 수 있습니다. 복원된 상태가 다른 객체나 시스템의 상태와 일치하지 않을 경우, 시스템의 일관성이 깨질 위험이 있다. 소프트웨어 개발 중 객체의 상태를 복원할 때, 외부 시스템이나 다른 객체와의 상태 불일치로 인해 예기치 않은 오류가 발생할 수 있다.
  5. **저장된 상태 관리의 어려움**
    * 메멘토 패턴을 사용할 때, 저장된 상태를 관리하는 것이 어려울 수 있다. 많은 상태를 저장해야 하는 경우, 어떤 상태가 유효하고 어떤 상태가 불필요한지 관리하는 것이 복잡해질 수 있다. 게임 개발 중 수많은 게임 상태를 저장하고 복원해야 하는 경우, 저장된 상태의 유효성을 판단하고 관리하는 것이 어려울 수 있다.

## 메멘토 패턴(Memento Pattern)을 활용한 예제:

메멘토 패턴을 사용하여 게임에서 캐릭터의 상태(체력, 마나, 위치 등)를 저장하고, 필요할 때 이전 상태로 복원하는 기능을 구현

```java
import java.util.Stack;

// Originator 클래스: 게임 캐릭터
class Character {
    private String name;
    private int health;
    private int mana;
    private int positionX;
    private int positionY;

    public Character(String name, int health, int mana, int positionX, int positionY) {
        this.name = name;
        this.health = health;
        this.mana = mana;
        this.positionX = positionX;
        this.positionY = positionY;
    }

    // 상태 저장
    public Memento save() {
        return new Memento(name, health, mana, positionX, positionY);
    }

    // 상태 복원
    public void restore(Memento memento) {
        this.name = memento.getName();
        this.health = memento.getHealth();
        this.mana = memento.getMana();
        this.positionX = memento.getPositionX();
        this.positionY = memento.getPositionY();
    }

    // 상태를 변경하는 메서드들 (예: 이동, 전투)
    public void move(int x, int y) {
        this.positionX += x;
        this.positionY += y;
        System.out.println(name + " moved to (" + positionX + ", " + positionY + ")");
    }

    public void takeDamage(int damage) {
        this.health -= damage;
        System.out.println(name + " took " + damage + " damage. Health is now " + health);
    }

    public void useMana(int amount) {
        this.mana -= amount;
        System.out.println(name + " used " + amount + " mana. Mana is now " + mana);
    }

    // 상태를 출력하는 메서드
    public void showStatus() {
        System.out.println("Character Status: " + name + " [Health: " + health + ", Mana: " + mana + ", Position: (" + positionX + ", " + positionY + ")]");
    }

    // Memento 클래스: 캐릭터의 상태를 캡슐화
    public static class Memento {
        private final String name;
        private final int health;
        private final int mana;
        private final int positionX;
        private final int positionY;

        public Memento(String name, int health, int mana, int positionX, int positionY) {
            this.name = name;
            this.health = health;
            this.mana = mana;
            this.positionX = positionX;
            this.positionY = positionY;
        }

        private String getName() { return name; }
        private int getHealth() { return health; }
        private int getMana() { return mana; }
        private int getPositionX() { return positionX; }
        private int getPositionY() { return positionY; }
    }
}

// Caretaker 클래스: 게임 기록 관리
class GameHistory {
    private Stack<Character.Memento> history = new Stack<>();

    public void saveState(Character character) {
        history.push(character.save());
    }

    public void undo(Character character) {
        if (!history.isEmpty()) {
            character.restore(history.pop());
        } else {
            System.out.println("No saved states to restore.");
        }
    }
}

// 클라이언트 코드
public class MementoPatternGameExample {
    public static void main(String[] args) {
        Character hero = new Character("Hero", 100, 50, 0, 0);
        GameHistory history = new GameHistory();

        hero.showStatus();
        
        // 상태 변경 및 저장
        hero.move(5, 5);
        history.saveState(hero);  // 상태 저장

        hero.takeDamage(20);
        hero.useMana(10);
        history.saveState(hero);  // 상태 저장

        hero.showStatus();
        
        // 상태 변경
        hero.move(-2, 3);
        hero.takeDamage(30);
        hero.showStatus();

        // 되돌리기(Undo) 실행
        history.undo(hero);
        hero.showStatus();

        history.undo(hero);
        hero.showStatus();
    }
}
```

![](/assets/images/posts/2024-08-28-메멘토-패턴-Memento-Pattern/01.png)

## 코드 설명

  1. **Character 클래스 (Originator)**:
    * Character 클래스는 게임 캐릭터를 나타내며, 캐릭터의 상태(체력, 마나, 위치)를 관리합니다. save() 메서드를 통해 현재 상태를 Memento 객체로 저장할 수 있으며, restore(Memento memento) 메서드를 통해 이전 상태로 복원할 수 있다.
  2. **Memento 클래스**:
    * Memento 클래스는 Character의 상태를 캡슐화하여 저장하는 역할을 합니다. 이 클래스는 Character의 내부 상태(이름, 체력, 마나, 위치)를 저장하고, 복원할 때 사용된다.
  3. **GameHistory 클래스 (Caretaker)**:
    * GameHistory 클래스는 Memento 객체를 관리하는 역할을 한다. saveState(Character character) 메서드를 통해 상태를 저장하고, undo(Character character) 메서드를 통해 저장된 상태로 되돌릴 수 있다.
  4. **클라이언트 코드**:
    * 클라이언트는 Character 객체에서 상태를 변경하고, GameHistory를 사용하여 상태를 저장한다. 이후, 필요할 때 undo() 메서드를 통해 이전 상태로 되돌린다.

## 관련패턴

## 1. 커맨드 패턴(Command Pattern)

  * 커맨드 패턴은 요청을 객체로 캡슐화하여, 클라이언트가 요청을 실행할 수 있도록 하는 패턴이다. 메멘토 패턴과 커맨드 패턴은 함께 사용되어, 객체의 상태를 저장하거나 복원하는 기능을 제공할 수 있다. 특히, 메멘토 패턴을 사용하여 커맨드의 실행 전후 상태를 저장해두고, 필요시 상태를 복원할 수 있다.

## 2. 플라이웨이트 패턴(Flyweight Pattern)

  * 플라이웨이트 패턴은 메모리를 절약하기 위해 동일한 객체를 공유하는 패턴이다. 메멘토 패턴을 사용할 때, 저장된 상태가 매우 많거나 상태 정보가 크다면 메모리 사용이 문제가 될 수 있다. 이 경우, 플라이웨이트 패턴을 사용하여 저장된 상태를 공유할 수 있다.

## 4. 상태 패턴(State Pattern)

  * 상태 패턴은 객체의 상태에 따라 행동을 변경하는 패턴이다. 메멘토 패턴과 상태 패턴은 모두 객체의 상태를 관리하는 데 중점을 두고 있습니다. 상태 패턴을 통해 객체가 상태에 따라 다르게 동작하도록 하고, 메멘토 패턴을 사용하여 그 상태를 저장하고 복원할 수 있다.

## 5. 템플릿 메서드 패턴(Template Method Pattern)

  * 템플릿 메서드 패턴은 알고리즘의 구조를 정의하고, 알고리즘의 일부 단계를 서브클래스에서 구현하도록 하는 패턴이다. 메멘토 패턴은 상태 저장과 복원이라는 알고리즘의 일부를 템플릿 메서드 패턴을 통해 구현할 수 있다. 이 조합은 특히 복잡한 작업을 수행할 때 유용하다.

## 6. 브리지 패턴(Bridge Pattern)

  * 브리지 패턴은 추상화와 구현을 분리하여, 서로 독립적으로 변형할 수 있도록 하는 패턴이다. 메멘토 패턴은 상태 저장과 복원을 통해 구현 부분을 추상화할 수 있습니다. 이를 통해 상태 저장 로직을 쉽게 변경하거나 교체할 수 있다.

## 7. 옵저버 패턴(Observer Pattern)

  * 옵저버 패턴은 객체의 상태가 변경될 때 이를 감시하는 다른 객체들에게 통지하는 패턴이다. 메멘토 패턴을 옵저버 패턴과 결합하여, 상태가 변경될 때 자동으로 상태를 저장하거나 복원하는 기능을 구현할 수 있다.
