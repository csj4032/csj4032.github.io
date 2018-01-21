---
title: Effective Java 2판
description: Effective Java 책 정리
categories:
 - book
tags:
 - java
---

# 이펙티브 자바

## 1장 서론
* 클래스의 멤버로는 필드, 메서드, 멤버 클래스 그리고 멤버 인터페이스 등
* 메서드의 시그너처는 그 이름과 형식 인자 자료형들로 구성 (반환값 자료형 X)
* package private라는 용어를 사용한다. 기술적으로 정확한 용어는 기본 접근 권한(default access)
* 공개 API(exported API)라는 용어는 단순히 API라고도 하는데, 프로그래머들이 클래스, 인터페이스, 패키지를 사용할 때 이용하는 클래스, 인터페이스, 생성자, 멤버, 그리고 직렬화 형식(serialized form)을 가리키는 말이다.
* 클래스, 인터페이스, 생성자, 멤버, 그리고 직렬화 형식은 전부 API 요소 (element)다.
* 공개 API는 API를 정의하는 패키지 바깥에서 접근할 수 있는 API 요소들로 구성된다.
* 간단히 말해서 어떤 패키지의 공개 API는 패키지에 포함된 모든 모든 public 클래스와 인터페이스의 public/protected 멤버와 생성 자다.

## 2장 객체의 생성과 삭제

### 규칙 1 생성자 대신 정적 팩터리 메서드를 사용할 수 없는지 생각해 보라
* 클래스를 통해 객체를 만드는 일반적인 방법은 public으로 선언된 생성자 (constructor)를 이용하는 것이다.
* Design Patterns(디자인 패턴)에 등장하는 팩터리 메서드(Factory Method) 개념과 다르다는 점에 유의하자.

```java
public class Sample {
    public static Boolean valueOf(boolean b) {
      return b ? Boolean.TRUE : Boolean.FALSE;
    }
}
```

```java
public class Sample {
    public static BigInteger probablePrime(int bitLength, Random rnd) {
      if (bitLength < 2)
          throw new ArithmeticException("bitLength < 2");
    
      return (bitLength < SMALL_PRIME_THRESHOLD ? smallPrime(bitLength, DEFAULT_PRIME_CERTAINTY, rnd) : largePrime(bitLength, DEFAULT_PRIME_CERTAINTY, rnd));
    }
}
```

* 장점
  * 생성자와는 달리 정적 팩터리 메서드에는 이름이 있다는 것이다.
    * 정적 팩터리 메서드는 이름을 잘 짓기만 한다면 시용하기도 쉽움 
    * 클라이언트 코드의 가독성(readability)도 높아짐
  * 생성자와는 달리 호출할 때마다 새로운 객체를 생성할 필요는 없다는 것이다.
  * 개체 통제 클래스를 작성하는 이유
    * 개체 수를 제어하면 싱글턴(singleton) 패턴을 따르도록 할 수 있다.
    * 객체 생성이 불기능한 클래스를 만들 수도 있다.
    * 변경이 불가능한 클래스의 경우 두 개의같은 객체가 존재하지 못하도록 할 수도 있다.
  * 정적 팩터리 메서드를 사용하면 같은 객체를 반복해서 반환할 수 있으므로 어떤 시점에 어떤 객체가 얼마나 존재할지를 정밀하게 제어할 수 있다.
  * 생성자와는 달리 변환값 자료형의 하위 자료형 객체를 반환할 수 있다든 것이다.
    * 반환되는 객체의 클래스를 훨씬 유연하게 결정할 수 있다.
  * 형인자 자료형(parameterized type) 객체를 만들 때 편하다는 점이다.

* 단점
  * public나 protected로 선언된 생성자가 없으므로 하위 클래스를 만들 수 없다는 것이다.
  * 정적 팩터리 메서드가 다른 정적 메서드와 확연히 구분되지 않는다는 것이다.

| 메서드명 | 설명 |
|---|---|
| valueOf | 인자로 주어진 값과 같은 값을 갖는 객체를 반환한다는 뜻이다.|
| of | valueOf를 더 간단하게 쓴 것이다.|
| getInstance | 인자에 기술된 객체를 반환하지만, 인자와 같은 값을 갖지 않을 수도 있다.|
| newInstance | getlnstance와 같지만 호출할 때마다 다른 객체를 반환한다.|
| getType | getlnstance와 같지만, 반환될 객체의 클래스와 다른 클래스에 팩터리 메서드가 있을 때 사용한다.|
| newType | newlnstance와 같지만, 반환될 객체의 클래스와 다른 클래스에 팩터리 메서드가 있을 때 시용한다.|

* [표 getType, newType 질문](https://stackoverflow.com/questions/39217359/static-factory-methods-gettype-newtype-examples)

### 규칙 2 생성자 인자가 많을 때는 Builder 패턴 적용을 고려하라.
* 정적 팩터리나 생성자는 같은 문제를 갖고 있다. 선택적 인자가 많은 상황에 적응하지 못한다는 것.

```java
// 점층적 생성자 패턴 - 더 많은 인자 개수에 잘 적응하지 못한다
public class NutritionFacts
  private final int servingSize;
  private final int servings;
  private final int calories;
  private final int fat;
  private final int sodium;
  private final int carbohydrate;

  public NutritionFacts(int servingSize, int servings) {
    this(servingSize, servings, 0);
  }

  public NutritionFacts(int servingSize, int servings, int calories) {
    this(servingSize, servings, calories, 0);
  }

  public NutritionFacts(int servingSize, int servings, int calories, int fat) {
    this(servingSize, servings, calories, fat, 0);
  }

  public NutritionFacts(int servingSize, int servings, int calories, int fat, int sodium) {
    this(servingSize, servings, calories, fat, sodium, 0);
  }

  public NutritionFacts(int servingSize, int servings, int calories, int fat, int sodium, int carbohydrate) {
    this.servingSize=servingSize;
    this.servings=servings;
    this.calories=calories;
    this.fat=fat;
    this.sodium=sodium;
    this.carbohydrate=carbohydrate;
  }
}

```
* 선택적 인자가 많은 상황
  * 점층적 생성자 패턴(telescoping constructor pattern)
    * 인자 수가 늘어나면 클라이언트 코드를 작성하기가 어려워지고, 무엇보다 읽기 어려운 코드가 되고 만다.
    * 클라이언트가 두 개 인자의 순서를 실수로 뒤집어도 컴파일러는 알지 못하며, 프로그램 실행 도중에 문제가 생기게 되는 것이다.
  * 자바빈 패턴
    * 1회의 함수 호출로 객체 생성을 끝낼 수 없으므로, 객체 일관성(consistency)이 일시적으로 깨질 수 있음
    * 생성자의 인자가 유효한지 검사하여 일관성을 보장하는 단순한 방법을 여기서는 사용할 수 없음
    * 변경 불가능(immutable) 클래스를 만들 수 없다는 것

```java
public class NutritionFacts {
  private int servingSize = -1;
  private int servings = -1;
  private int calories = 0;
  private int fat = 0;
  private int sodium = 0;
  private int carbohydrate = 0;

  public NutritionFacts() {}
  public void setServingSize(int val) { servingSize = val;}
  public void setServings(int val) { servings = val;}
  public void setCalories(int val) { calories = val;}
  public void setFat(int val) { fat = val;}
  public void setSodium(int val) { sodium = val;}
  public void setCarbohydrate(int val) { car.bohydrate = val;}
}

```

* 빌더 패턴은 인자가 많은 생성자나 정적 팩터리가 필요한 클래스를 설계할 때, 특히 대부분의 인자가 선택적 인자인 상황에 유용
* 생성자와 마찬가지로, 빌더 패턴을 사용하면 인자에 불변식(invariant)을 적용할 수 있음
* 빌더 객체는 여러 개의 varargs 인자를 받을 수 있다는 것
* 빌더 패턴은 하나의 빌더 객체로 여러 객체를 만들 수 있음
* 빌더 객체는 어떤 필드의 값은 자동으로 채울 수도 있음
* 단점
  * 객체를 생성하려면 우선 빌더 객체를 생성 
  * 실무에서 빌더 객체를 만드는 오버헤드가 문제가 될 소지는 없어 보이지만, 성능이 중요한 상황에선 그렇지 않을 수도 있음
* 빌더 패턴은 인자가 많은 생성자나 정적 팩터리가 필요한 클래스를 설계할 때, 특히 대부분의 인자가 선택적 인자인 상황에 유용

* Q : 불변식이란(Invariant)?
* A : an invariant is a condition that can be relied upon to be true during execution of a program, or during some portion of it. It is a logical assertion that is held to always be true during a certain phase of execution.
* R : https://en.wikipedia.org/wiki/Invariant_(computer_science)

### 규칙 3 private 생성자나 enum 자료형은 싱글턴 패턴을 따르도록 설계하라

```java
// public final 필드를 이용한 싱굴턴
public class Elvis {
  public static final Elvis INSTANCE = new Elvis();
  private Elvis() {}

  public void leaveTheBuilding( ) { }
}
```

```java
// 정적 펙터리를 이용한 싱글턴
public class Elvis {
  private static final Elvis INSTANCE = new Elvis();
  private Elvis() { }
  public static Elvis getInstance() { return INSTANCE; }

  public void leaveTheBuilding( ) { }
}
```

```java
// Enum 싱글턴 - 이렇게 하는 쪽이 더 낫다
public enum Elvis {
  INSTANCE;

  public void leaveTheBuilding() { }
}
```

* 클래스를 싱글턴으로 만들면 클라이언트를 테스트하기가 어려워질 수가 있음
* serialize된 객체가 역직렬화(desenalize)될 때마다 새로운 객체가 생기게 된다.
* 원소가 하나뿐인 enum 자료형이야말로 싱글턴을 구현하는 가장 좋은 방법

* [참고 싱글턴](https://blog.seotory.com/post/2016/03/java-singleton-pattern)

### 규칙 4 객체 생성을 막을 때는 private 생성자를 사용하라
* 원소가 하나뿐인 enum 자료형이야말로 싱글턴을 구현하는 가장 좋은 방법
* 객체를 만들 수 없도록 하려고 클래스를 abstract로 선언해 봤자 소용
* private 생성자를 클래스에 넣어서 객체 생성을 방지하자는 것

```java
// 객쳬룰 만둘 수 없는 유틸리티 클래스
public class UtilityClass {
  // 기본 생성자가 자동 생성되지 못하도록 하여 객체 생성 방지
  private UtilityClass() {
    throw new AssertionError();
  }
}
```

### 규칙 5 불필요한 객체는 만들지 말라
* JDK 1.5부터는 쓸데없이 객체를 만들 새로운 방법이 더 생겼다. 자동 객체화 (autoboxing)라는 것인데, 프로그래머들이 자바의 기본 자료형(primitive type) 그 객체 표현형을 섞어 사용할 수 있도록 해 준다.
* 객체 표현형 대신 기본 자료형을 사용하고, 생각지도 못한 자동 객체화가 발생하지 않도록 유의하라는 것이다.
* 직접 관리하는 객체 풀(Object pool)을 만들어 객체 생성을 피하는 기법은 객체 생성 비용이 극단적으로 높지 않다면 사용하지 않는 것이 좋다.
  * 코드가 어지러워짐
  * 메모리 요구량이 증가 하며, 성능도 떨어짐
  * 최신 JVM은 고도로 최적화된 쓰레기 수집기를 갖고 있어서, 가벼운(lightweight) 객체라면 객체 풀보다 월등한 성능을 보여줌
* *방어적 복사가 요구되는 상황에서 객체를 재사용하는 데 드는 비용은 쓸데없이 같은 객체를 여러 벌 만드는 비용보다 훨씬 높다는 것에 유의하자.*

### 규칙 6 유효기간이 지난 객체 참조는 폐기하라
* 만기 참조란, 다시 이용되지 않을 참조
* 자동적으로 쓰레기 객체를 수집하는 언어에서 발생하는 메모니 누수 문제 (의도치 않은 객체 보유)
* *쓸 일 없는 객체 참조는 무조건 null*
* 만기 참조가 몇 개라도 있으면 굉장히 많은 객체가 쓰레기 수집에서 제외될 가능성이 있음
* 객체 참조를 null 처리하는 것은 규범(norm)이라기보단 예외적인 조치가 되어야 한다.
* 자체적으로 관리하는 메모리가 있는 클래스를 만들 때는 메모리 누수가 발생하지 않도록 주의해아 한다.
* 더 이상 사용되지 않는 원소 안에 있는 객체 참조는 반드시 null로 바꿔 주어야 한다.
* 캐시도 메모리 누수가 흔히 발생하는 장소다.
* WeakHashMap은 캐시 안에 보관되는 항목의 수명이 키에 대한 외부 참조의 수명에 따라 결정되는 상황에서만 적용 가능하다는 것을 기억하자.
* 메모리 누수가 흔히 발견되는 또 한 곳은 리스너 등의 역호출자다.

Q : '더 이상 사용되지 않는 원소 안에 있는 객체 참조는 반드시 null로 바꿔 주어야 한다.' 잘못된 사례는 ?

### 규칙 7 종료자 사용을 피하라
* 종료자(finalizer)는 예측 불가능하며, 대체로 위험하고, 일반적으로 불필요
* 긴급한(time-critical) 작업을 종료자 안에서 처리하면 안됨
* 중요 상태 정보(critical persistent state)는 종료자로 갱신하면 안됨
* 종료자는 그런 자원을 발견하게 될 경우 반드시 경고 메시지를 로그(1og)

## 3장 모든 객체의 공통 메서드

### 규칙 8 equals를 재정의할 때는 일반 규약을 따르라
* 각각의 객체가 고유하다
* 클래스에 논리적 동일성(logical equality), 검사 방법이 있건 없건 상관없다.
* 상위 클래스에서 재정의한 equals가 하위 클래스에서 사용히기에도 적당하다.
* 클래스가 private 또는 package-private로 선언되었고, equals 메서드를 호출할 일이 없다.
* 반사성(Reflexivity): 모든 객체는 자기 자신과 같아야 한다는 뜻이다.
* 대칭성(Symmetry): 두 객체에게 서로 같은지 물으면 같은 답이 나와야 한다는 것이다. 첫 번째 요구사항과는 달리, 실수하면 쉽게 깨지는 요구사항이다.

```java

// 대칭성 위반!
public final class CaseInsensitiveString {
    private final String s;
    
    public CaseInsensitiveString(String s) {
        if (S==nuU)
            throw new NullPointerException();
        this.s=s;
    }
    
    // 대칭성 위반!
    @Override public boolean equals(Object o) {
        if (o instanceof CaselnsensitiveString)
            return s.equalsIgnoreCase(((CaseInsensitiveString) o).s) ;
        if (o instanceof String) //한방향으로만정상동작!
            return s.equalsIgnoreCase((String) o);
        return false;
    }
}
```

* 추이성(Transitivity): 첫 번째 객체가 두 번째 객체와같고, 두 번째 객체가 세 번째 객체와 같다면 첫 번째 객체와 세 번째 객체도 같아야 한다는 것이다.
* 일관성(Consistency): 일단 같다고 판정된 객체들은 추후 변경되지 않는 한 계속 같아야 한다는 것이다.
* 널(Null)에 대한 비 동치성(Non-nullity): 모든 객체는 null과 동치 관계에 있지 아니한다는 요구조건이다.
* equals가 따라야 할 규약을 어기면, 그 객체를 만난 다른 객체들이 어떻게 행동할지 예측할 수 없게 된다.
* 객체 생성가능(instantiable) 클래스를 계승하여 새로운 값 컴포넌트를 추가하면서 equals 규약을 어기지 않을 방법은 없다.
* 신뢰성이 보장되지 않는 자원(unreliable resource)들을 비교히는 equals를 구현하는 것은 삼가라.
* equals 메서드를 구현하기 위해 따라야 할 지침
  * == 연산자를 사용하여 equals의 인지가 자기 자신인지 검사하라.
  * instanceOf 연산지를 사용하여 인자의 자료형이 정확한지 검사하라.
  * equals의 인자를 정확한 자료형으로 변환하라.
  * '중요' 필드 각각이 인자로 주어진 객체의 해당 필드와 일치하는지 검사한다.
  * equals 메서드 구현을 끝냈다면, 대칭성, 추이성, 일관성의 세 속성이 만족되는지 검토하라.

### 규칙 9 equals를 재정의할 때는 반드시 hashCode도 재정의하라
* equals 메서드를 재정의하는 클래스는 반드시 hashCode 메서드도 재정의 해야 한다.
  * HashMap, HashSet, HashTable 같은 해시(hash) 기반 컬렉션과 함께 시용하면 오동작
* hashCode를 재정의하지 않으면 위반되는 핵심 규약은 두 번째다. 같은 객체는 같은 혜시 코드 값을 가져야 한다는 규약이 위반되는 것이다.
* HashMap은 성능 최적화를 위해 내부에 보관된 항목의 해시 코드를 캐시해 두고, 캐시된 해시 코드가 없는 객체는 동일성 검사조차 하지 않음

### 규칙 10 toString은 항상 재정의하라
* toString을 잘 만들어 놓으면 클래스를 좀 더 쾌적하게 사용할 수 있다.
* 가능하다면 toString 메서드는 객체 내에 중요 정보를 전부 담아 반환해야 한다.
* toString이 반환하는 문자열의 형식을 명시하건 그렇지 않건 간에, 어떤 의도인지는 문서에 분명하게 남겨야 한다.
* toString이 반환하는 문자열에 포함되는 정보들은 전부 프로그래밍을 통해서 가져올 수 있도록(programmatic access) 하라.

```java
public class PhoneNumber {
    /**
    * 전화번호를 문자열로 변환해서 반환한다.
    * 문자열은 "(XXX) YYY-ZZZZ'' 형식으로, 14개 문자로 구성된다.
    * XXX는 지역번호, YYY는 국번, ZZZZ는 회선 번호다. 각 문자(X, Y, Z)는
    * 하나의 숫자다.
    *
    * 전화번호의 각 필드가 주어진 자리를 다 채우지 못할 경우 필드 앞에는
    * 0이 불는다. 예를 들어, 회선 번호가 123일 경우, 위의 문자열 마지막 필드에
    * 채워지는 문자열은 "0123"이 된다.
    *
    * 지역번호를 닫는 괄호와 국번 사이에는 공백이 온다는 것에 주의하자.
    */
    @Override
    public String toString() {
        return String.format("(%03d) %03d-%04d" ,areaCode, prefix, lineNumber);
    }
}
```

### 규칙 11 clone을 재정의할 때는 신중하라
* Cloneable은 어떤 객체가 복제(clone)를 허용한다는 사실을 알리는 데 쓰려고 고안된 믹스인(mixin) 인터페이스다
* 비-final 클래스에 clone을 재정의할 때는 반드시 super.clone을 호출해 얻은 객체를 반환해야 한다.
* 실질적으로 cloneable 인터페이스를 구현하는 클래스는 제대로 동작하는 pubEc clone 메서드를 제공해야 한다.
* 라이브러리가 할 수 있는 일을 클라이언트에게 미루지 말라는 것이다.
* 사실상, clone 메서드는 또 다른 형태의 생성자다. 원래 객체를 손상시키는 일이 없도록 해야 하고, 복사본의 불변식(invariant)도 제대로 만족시켜야 한다.
* clone의 아키텍처는 변경 가능한 객체를 참조하는 final 필드의 일반적 용법과 호환되지 않는다.

### 규칙 12 Comparable 구현을 고려하라
* compareTo를 구현할 때는 모든 x와 y에 대해 sgn(x.compareTo(y)) == -sgn(y,compareTo(x))가 만족되도록 해야 한다. (y.compareTo(x)가 예외를 발생시킨다면 x.compareTo(y)도 그래야 하고, 그 역도 성립해야 한다.)
* compareTo를 구현할 때는 추이성(transitivity)이 만족되도록 해야 한다. 즉, (x.compareTo(y)) 0 && y.compareTo(z)) 0)이면 x.compareTo(z)) 0이어야 한다.
* 마지막으로, x.compareTo(y) == 0이면 sgn(x.compareTo(z)) == sgn(y.compareTo(z))의 관계가 모든 z에 대해 성립하도록 해야 한다.
* 강력히 추천하지만 절대적으로 요구되는 것은 아닌 조건 하나는 (x.compareTo(y) == 0) == (x.equals(y))이다.

## 4장 클래스와 인터페이스

### 규칙 13 클래스와 멤버의 접근 권한은 최소화하라
* 정보 은닉
  * 시스템을 구성하는 모듈 사이의 의존성을 낮춰서(decouple), 각자 개별적으로 개발하고, 시험하고, 최적화하고, 이해하고, 변경할 수 있도록 한다는 사실에 기초
  * 좋은 성능을 자동적으로 보장하는 것은 아니지만, 효과적인 성능 튜닝(tuning)을 가능하게 하는 것은 사실
  * 소프트웨어의 재시용 가능성을 높인다. 모듈간 의존성이 낮으므로 각 모듈은 다른 소프트웨어 개발에도 유용하게 쓰일 수 있음
  * 대규모 시스템 개발 과정의 위험성(risk)도 낮춤
* 캡슐화 (encapsulation)
* 각 클래스와 멤버는 기능한 한 접근 불가능하도록 만들라는 것.
* private - 이렇게 선언된 멤버는 선언된 최상위 레벨 클래스 내부에서만 접근 가능하다.
* package-private - 이렇게 선언된 멤버는 같은 패키지 내의 아무 클래스나 사용할 수 있다. 기본 접근 권한(default access)으로 알려져 있는데, 멤버를 선언할 때 아무런 접근 권한 수정자(access modifier)도 붙이지 않으면, 이 권한이 주어지기 때문.
* protected - 이렇게 선언된 멤버는 선언된 클래스 및 그 하위 클래스만 사용할 수 있다(몇 가지 제약 사항에 대해서는 [JLS, 6.6.2] 참고). 선언된 클래스와 같은 패키지에 있는 클래스에서도 시용이 기능하다.
* public - 이렇게 선언된 멤버는 어디서도 사용이 가능하다.
* 메서드의 접근 권한을 줄일 수 없는 경우가 하나 있다. 상위 클래스 메서드를 재정의할 때는 원래 메서드의 접근 권한보다 낮은 권한을 설정할 수 없다.

* 객체 필드(instance field)는 절대로 public으로 선언하면 안 된다.
* 변경 가능 public 필드를 가진 클래스는 다중 스레드에 안전하지않다.
* 요약 
  * public static final 배열 필드를 두거나, 배열 필드를 반환하는 접근지(accessor)를 정의하면 안 된다.
  * 접근 권한은 가능한 낮추라. 최소한의 pubic API를 설계한 다음, 다른 모든 클래스, 인터페이스, 멤버는 API에서 제외하라. 
  * public static final 필드를 제외한 어떤 필드도 public 필드로 선언하지 마라.
  * public static final 필드가 참조하는 객체는 변경 불가능 객체로 만들라.

* Q : 정보 은닉 VS 캡슐화
* Q : 최상위 레벨 클래스 란?
* Q : 변경 가능 public 필드를 가진 클래스는 다중 스레드에 안전은 하지 못한 이유 혹은 사례

```java
import java.util.ArrayList;

public class ThreadNonSafe implements Runnable {

	private int index;
	private Member member;
	
	public static final Number[] numbers = {1, 2, 3, 4, 5};
    public static final List<String> numberList;
    public static final List<String> unmodifiableListNumberList;

    static {
        numberList = Arrays.asList("one", "two", "three");
        //numberList = new ArrayList<>(Arrays.asList("one", "two", "three"));
        unmodifiableListNumberList = Collections.unmodifiableList(numberList);
    }

	public ThreadNonSafe(int index, Member member) {

    	//numberList.add("four");
    	//numberList.remove("four");
    	//unmodifiableListNumberList.add("four");

		this.index = index;
		this.member = member;
	}

	@Override
	public void run() {
		try {
			member.age++;
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println(this.index + " " + member.age);
	}


	public static void main(String[] args) throws InterruptedException {
		ArrayList<Thread> threads = new ArrayList<Thread>();
		Member member = Member.builder().id(1L).name("Genius").age(37).build();
		for (int i = 0; i < 5000; i++) {
			Thread t = new Thread(new ThreadNonSafe(i, member));
			t.start();
			threads.add(t);
		}

		for (int i = 0; i < threads.size(); i++) {
			Thread t = threads.get(i);
			try {
				t.join();
			} catch (Exception e) {
			}
		}

		System.out.println(member.age);
	}
}
```

```java
import lombok.Builder;

@Builder
public class Member {
	public long id;
	public String name;
	public int age;
}
```

### 규칙 14 public 클래스 안에는 public 필드를 두지 말고 접근자 메서드를 사용하라
* 선언된 패키지 밖에서도 사용 가능한 클래스에는 접근자 메서드를 제공하라.

```java
// 이런 저급한 클래스는 절대로 public으로 선언하지 말 것
class Point {
  public double x;
  public double y;
}
```

```java
// 접근자 메서드와 수정자룰 이용한 데이터 캡슐화
class Point {
  public double x;
  public double y;

  public Point(double x, double y) {
    this.x = x;
    this.y = y;
  }

  public double getX() { return x; }
  public double getY() { return y; }
  public void setX(double x) { this.x = x; }
  public void setY(double y) { this.y = y; }
}
```

* package-private 클래스나 private 중첩 클래스(nested class)는 데이터필드를 공개하더라도 잘못이라 말할 수 없다.
* 중첩 클래스 사용 이유 [Nested Classes](https://docs.oracle.com/javase/tutorial/java/javaOO/nested.html)
  * 한 곳에서만 사용되는 클래스를 논리적으로 그룹화하는 방법입니다. 한 클래스가 다른 한 클래스에 유용하면 그 클래스에이 클래스를 포함시키고 두 클래스를 함께 유지하는 것이 논리적입니다. 이러한 "헬퍼 클래스"를 중첩하면 패키지가보다 간결 해집니다.
  * 캡슐화를 증가시킵니다. A와 B라는 두 개의 최상위 클래스를 생각해 봅니다. 여기서 B는 그렇지 않으면 private으로 선언 될 A의 멤버에게 액세스해야합니다. A 클래스 내의 B 클래스를 숨김으로써 A 멤버는 비공개로 선언 될 수 있고 B 멤버는 비공개로 선언 될 수 있습니다. 또한 B 자체는 외부 세계로부터 숨길 수 있습니다.
  * 보다 읽기 쉽고 유지 보수가 쉬운 코드로 이어질 수 있습니다. 최상위 클래스의 작은 클래스를 중첩하면 코드가 사용되는 위치에 가깝게 배치됩니다.
* Q : 이런 클래스는 데이터 필드를 직접 조작할 수 있어서 캡슐화의 이점을 누릴 수가 없다(규칙 13). API를 변경하지 않고서는 내부 표현을 변경할 수 없고, 불변식(invariant)도 강제할 수 없고, 필드를 사용하는 순간에 어떤 동작이 실행되도록 만들 수도 없다.
* Q : private 중첩 클래스 란 ?

### 규칙 15 변경 가능성을 최소화하라
* 변경 불가능 클래스 규칙
  * 객체 상태를 변경하는 메서드(수정자 메서드 등)를 제공하지 않는다.
  * 계승할 수 없도록 한다.
  * 모든 필드를 final로 선언한다.
  * 모든 필드를 private로 선언한다.
  * 변경 기능 컴포넌트에 대한 독점적 접근권을 보장한다.
* 변경 불가능 객체는 단순하다.
* 변경 불가능 객체는 스레드에 안전, 어떤 동기화도 필요 없음
* 변경 불가능한 객체는 자유롭게 공유할 수 있다.
* 변경 불기능한 객체는 그 내부도 공유할 수 있다.
* 변경 불가능 객체는 다른 객체의 구성요소로도 홀륭하다.
* 변경 불기능 객체의 유일한 단점은 값마다 별도의 객체를 만들어야 한다는 점이다.
* Q : BitSet 클래스는 백만 개 비트 가운데 한 비트의 상태를 [상수 시간(constant time)](https://ko.wikipedia.org/wiki/%EC%8B%9C%EA%B0%84_%EB%B3%B5%EC%9E%A1%EB%8F%84)에 변경할 수 있도록 한다.
* Q : 예를 들어 BigInteger 클래스는 package-private로 선언된 변경 가능 "동료 클래스"(companion Class)를 사용해 [모듈라 멱승(modular exponentiation)](https://ko.khanacademy.org/computing/computer-science/cryptography/modarithmetic/a/fast-modular-exponentiation) 같은 연산의 속도를 높인다.

### 규칙 16 계승하는 대신 구성하라
* 메서드 호출과 달리, 계승은 캡슐화(encapsulation) 원칙을 위반한다.
* 계승은 하위 클래스가 상위 클래스의 하위 자료형(subtype)이 확실한 경우에만 바람직하다.
* 구성(composition) : 기존 클래스를 계승하는 대신, 새로운 클래스에 기존 클래스 객체를 참조하는 private 필드를 하나 두는 것, 기존 클래스가 새 클래스의 일부가 됨
* 전달(forwarding) : 새로운 클래스에 포함된 각각의 메서드는 기존 클래스에 있는 메서드 가운데 필요한 것을 호출해서 그 결과를 반환
* 전달 메서드 (forwarding method) : 전달 기법을 사용해 구현된 메서드
* 계승은 하위 클래스가 상위 클래스의 하위 자료형(subtype)이 확실한 경우에만 바람직하다. 다시 말해서, 클래스 B는 클래스 A와 "IS-A" 관계가 성립할 때만 A를 계승해야 한다.

```java
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;

public class InstrumentedHashSet<E> extends HashSet<E> {

	private int addCount = 0;

	public InstrumentedHashSet() {

	}

	public InstrumentedHashSet(int initCap, float loadFactor) {
		super(initCap, loadFactor);
	}

	@Override
	public boolean add(E e) {
		addCount++;
		return super.add(e);
	}

	@Override
	public boolean addAll(Collection<? extends E> c) {
		addCount += c.size();
		return super.addAll(c);
	}

	public int getAddCount() {
		return addCount;
	}

	public static void main(String[] args) {
		InstrumentedHashSet<String> s = new InstrumentedHashSet<>();
		s.addAll(Arrays.asList("Snap", "Crackle", "Por"));
		System.out.println(s.getAddCount());
	}
}
```

* Q : 기술적으로 보자면, 포장 객체가 자기 자신을 포장된(wrapped) 객체에 전달하지 않으면 위임이라고 부를 수 없다.
* A : To achieve the same effect with delegation, the receiver passes itself to the delegate to let the delegated operation refer to the receiver. [참고](https://en.wikipedia.org/wiki/Delegation_pattern) 

* Q : 역호출(callback) 프레임워크와 함께 사용하기에는 적합하지 않다.
* A : [참고](https://github.com/csj4032/enjoy-java-books/blob/master/effective-java/src/main/java/chapter04/item18/callback/TheSelfProblem.java)

### 규칙 17 계승을 위한 설계와 문서를 갖추거나, 그럴 수 없다면 계승을 금지하라
* 재정의 가능 메서드를 내부적으로 어떻게 사용하는지(self-use) 반드시 문서에 남기라는 것이다.
* 클래스 내부 동작에 개입할 수 있는 훅(hooks)을 신중하게 고른 protected 메서드 형태로 제공해야 한다.
* 계승을 위해 설계한 클래스를 테스트할 유일한 방법은 하위 클래스를 직접 만들어 보는 것이다.

### 규칙 18 추상 클래스 대신 인터페이스를 사용하라
* 이미 있는 클래스를 개조해서 새로운 인터페이스를 구현하도록 하는 것은 간단하다.
* 인터페이스는 믹스인(mixin)을 정의하는 데 이상적이다.
* 인터페이스는 비 계층적인(nonhierarchical) 자료형 프레임워크(type framework)를 만들 수 있도록 한다.
* 인터페이스를 사용하면 포장 클래스 숙어(wrapper class idiom)을 통해 안전하면서도 강력한 기능 개선이 기능하다.
* 추상 골격 구현(abstract skeletal implementation) 클래스를 중요 인터페이스마다 두면, 인터페이스의 점과 추상 클래스의 장점을 결합할 수 있다.
* 인터페이스보다는 추상 클래스가 발전시키기 쉽다
* 인터페이스가 공개되고 널리 구현된 다음에는, 인터페이스 수정이 거의 불기능

### 규칙 19 인터페이스는 자료형을 정의할 때만 사용하라
* 상수 인터페이스 패턴은 인터페이스를 잘못 사용한 것이다.
* 자바 플랫폼 라이브러리에도 상수 인터페이스가 몇 개 있음 (java.io.object StreamConstants 이런 인터페이스는 실수로 포함된 것이라 생각해야 하며, 절대로 따라해서는 안 됨)

### 규칙 20 태그 달린 클래스 대신 클래스 계층을 활용하라
* 태그 기반 클래스(tagged class)는 너저분한데다 오류 발생 가능성이 높고, 효율적이지도 않다.
* 태그 기반 클래스는 클래스 계충을 얼기설기 흉내 낸 것일 뿐이다.

### 규칙 21 전략을 표현하고 싶을 때는 함수 객체를 사용하라
* 함수 객체의 주된 용도는 전략 패턴(Strategy pattern)을 구현 
* 패턴을 구현하기 위해서는 전략을 표현하는 인터페이스를 선언하고, 실행 기능 전략 클래스가 전부 해당 인터페이스를 구현하도록야 함
* 실행 가능 전략이 한 번만 시용되는 경우에는 보통 그 전략을 익명 클래스 객체로 구현 
* 반복적으로 시용된다면 private static 멤버 클래스로 전략을 표현한 다음, 전략 인터페이스가 자료형인 public static final 필드를 통해 외부에 공개하는 것이 바람

```java
// 실행 가능 전략들을 외부에 공개하는 클래스
class Host {
  
	private static class StrLenCmp implements Comparator<String>, Serializable {

        public int compare(String s1, String s2) {
            return s1.length() - s2.length();
        }
    }

  // 이 비교자는 직렬화가 가능
  public static final Comparator<String> STRING_LENGTH_COMPARATOR = new StrLenCmp();
  
  // 나머지 생략
}
```

### 규칙 22 멤버 클래스는 가능하면 static으로 선언하라
* 중첩 클래스(nested class)
  * 다른 클래스 안에 정의된 클래스
  * 해당 클래스가 속한 클래스 안에서만 사용
* 중첩 클래스 정적 멤버 클래스 (static member class), 비-정적 멤버 클래스(nonstatic member class), 익명 클래스(anonymous class), 그리고 지역 클래스(local class)
* 내부 클래스(inner class) 비-정적 멤버 클래스(nonstatic member class), 익명 클래스(anonymous class), 그리고 지역 클래스(local class)
* 정적 멤버 클래스
  * 가장 간단한 중첩 클래스
  * 바깥 클래스의 모든 멤버에 (private로 선언된 것까지도) 접근할 수 있음
  * 바깥 클래스의 정적 멤버이며, 다른 정적 멤버와 동일한 접근 권한 규칙(accessibility rule)을 따름
  * private로 선언했다면 해당 중첩 클래스에 접근할 수 있는 것은 바깥 클래스
  * 흔한 용례 가운데 하나는, 바깥 클래스와 함께 사용할 때 만 유용한 public 도움 클래스(helper class)를 정의
  * 바깥 클래스 객체와 독립적으로 존재할 수 있음
  * private 정적 멤버 클래스는 바깥 클래스 객체의 컴포넌트(component)를 표현한느데 흔히 쓰임
* 비-정적 멤버 클래스
  * 문법적으로 보자면 정적 멤버 클래스와 비-정적 멤버 클래스의 차이는 멤버클래스 앞에 static이라는 키워드가 붙는다는 것
  * 바깥 클래스 객체와 자동적으로 연결
  * 바깥 클래스의 메서드를 호출할 수도 있고, this 한정(qualified this) 구문을 통해 바깥 객체에 대한 참조를 획득할 수도 있음
  * 바갇 클래스 객체 없이는 존재할 수 없음
  * 비-정적 멤버 클래스 객체와 바깥 객체와의 연결은 비-정적 멤버 클래스의 객체가 만들어지는 순간에 확립되고, 그 뒤에는 변경할 수 없음
  * 어댑티(Adapter)를 정의할 때 많이 쓰임
* 비-정적 멤버 클래스 안에서는 비깥 클래스의 메서드를 호출할 수도 있고, this 한정(qualified this) 구문을 통해 바깥 객체에 대한 참조를 획득할 수도 있다.
* 바깥 클래스 객체에 접근할 필요가 없는 멤버 클래스를 정의할 때는 항상 선언문 앞에 static을 붙여서 비-정적 멤버 클래스 대신 정적 멤버 클래스로 만들자.
* 익명 클래스
  * 이름이 없음
  * 바깥 클래스의 멤버가 아님
  * 사용하는 순간에 선언하고 객체를 만듬
* 지역 클래스
  * 지역 변수가 선언될 수 있는 곳이라면 어디서든 선언 할 수 있음
  * 지역 변수와 동일한 유효범위(scoping rule) 규칙을 따름

## 5장 제네릭 

### 규칙 23 새 코드에는 무인자 제네릭 자료형을 사용하지 마라
* 선언부에 형인자(type parameter)가 포함된 클래스나 인터페이스는 제네릭(generic) 클래스나 인터페이스라고 부름
* 무인자 자료형을 쓰면 형 안전성이 사라지고, 제네릭의 장점 중 하나인 표현력(expressiveness) 측면에서 손해를 보게 된다.
* List와 같은 무인자 자료형을 사용하면 형 안전성을 잃게 되지만, List\<Object\> 와 같은 형인자 자료형을 쓰면 그렇지 않다.
* List와 List\<Object\> 사이에는 무슨 차이가 있나? 간단히 말해서 List는 형 검사 절차를 완전히 생략한 것이고, List\<Object\>는 아무 객체나 넣을 수 있다는 것을 컴파일러에게 알리는 것
* 제네릭에 대한 하위 자료형 정의 규칙에 따르면 List\<String\>은 List의 하위 자료형(subtype)이지만 List\<Object\>의 하위 자료형은 아니기 때문
* 비한정적 와일드카드 자료형과 무인자 자료형의 차이
  * 와일드카드 자료형은 안전하지만 무인자 자료형은 그렇지 않다.
  * 무인자 자료형 컬렉션에는 아무 객체나 넣을 수 있어서, 컬렉션의 자료형 불변식(type invariant)이 쉽게 깨진다.
  * Collection\<?\>에는 null 이의의 어떤 원소도 넣을 수 없다.
  * Collection\<?\>에는 어떤 자료형의 객체를 꺼낼 수 있는지도 알 수 없다.
* 무인자 자료형을 사용하는 예외 두 가지
  * **제네릭 자료형 정보가 프로그램이 실행될 때 지워짐** [Erasure](https://docs.oracle.com/javase/tutorial/java/generics/erasure.html)
  * [클래스 리터럴(class literal)](https://docs.oracle.com/javase/tutorial/extra/generics/literals.html) 에는 반드시 무인자 자료형을 사용해야 한다.
  * 제네릭 자료형에 instanceof 연산자를 적용할 때는 다음과 같이 하는 것이 좋다.

```java
// instanceof 연산자에는 무인자 자료형을 써도 OK
if (o instanceof Set) {   //무인자자료형
  Set<?> m = (Set<?>) o;  //와일드카드자료형
}
```

```java
public class Raw {

    public static void main(String[] args) {
        List<String> strings = new ArrayList<string>();
        unsafeAdd(strings, new Integer(42));
        String s = strings.get(0);
    }
    
    private static void unsafeAdd(List list, Object o) {
        list.add(o);
    }
}
```

| 용어 | 예 | 규칙 |
| --- | --- | --- |
| 형인자 자료형(parameterized type) | List(String) | 23 |
| 실 형인자(actual type parameter) | String | 23 |
| 제네릭 자료형(generic type) | List<E> | 23, 26 |
| 형식 형인자 (formal type parameter)  | E | 23 |
| 비한정적 와일드카드 자료형 | List<?> | 23 |
| 무인자 자료형(raw type) | List | 23 |
| 한정적 형인자(bounded type parameter) | <E extends Number> | 26 |
| 재귀적 형 한정(recursive type bound)  | <T extends Comparable<T>> | 27 |
| 한정적 와일드카드 자료형(bounded  | List<? extends Number> | 28 |
| 제네릭 메서드(generic method) | static <E> List<E> asList<E[] a> | 27 |
| 자료형 토큰(type token) | String.class | 29 |

### 규칙 24 무점검 경고(unchecked warning)를 제거하라
* 모든 무점검 경고는, 기능하다면 없애야 한다. 
* 제거할 수 없는 경고 메시지는 형 안전성이 확실할 때만 @SuppressWarnings("unchecked") 어노테이션(annotation)을 사용해 억제하기 바란다.
* SuppressWarnings 어노테이션은 return 문에 붙일 수 없는데, **선언문**이 아니기 때문이다. 
* @SuppressWarnings 어노테이션은 개별 지역 변수 선언부터 클래스 전체에까지, 어떤 크기의 단위에도 적용할 수 있다. 하지만 @SuppressWarnings 어노테이션은 가능한 한 작은 범위에 적용하라.
* @SuppressWarnings("unchecked") 어노테이션을 사용할 때마다, 왜 형 안전성을 위반하지 않는지 밝히는 주석을 반드시 붙이라.

### 규칙 25 배열 대신 리스트를 써라
* 배열은 제네릭 자료형과 두 가지 중요한 차이점
  * 배열은 공변 자료형(covariant), 제네릭은 불변 자료형(invariant)
    * Sub가 Super의 하위 자료형(subtype)이라면 Sub[]도 Super[]의 하위 자료형이라는 것이다.
    * Type1과 Type2가 있을 때, List\<Type1\>은 List\<Type2\>의 상위 지료형이나 하위 자료형이 될 수 없다.
  * 배열은 실체화(reification) 되는 자료형
    * 배열의 각 원소의 자료형은 실행시간(runtime)에 결정된다는 것이다.
    * 제네릭은 삭제(erasure) 과정을 통해 구현된다.
    * 자료형에 관계된 조건들은 컴파일 시점에만 적용되고, 그 각 원소의 자료형 정보는 프로그램이 실행될 때는 삭제된다는 것이다.
    * 자료형 삭제(erasure) 덕에, 제네릭 자료형은 제네릭을 사용하지 않고 작성된 오래된 코드와도 문제 없이 연동한다.
    * new List\<E\>[], new List\<String\>[], new E[]는 전부 컴파일되지 않는 코드다. 컴파일하려고 하면 제네릭 배열 생성(generic array creation)이라는 오류가 발생할 것이다. 
    * E, List\<E\>, List\<String\>와 같은 자료형은 실체화 불기능(non-refiable) 자료형으로 알려져 있다.
    * 프로그램이 실행될 때 해당 자료형을 표현하는 정보의 양이 컴파일 시점에 필요한 정보의 양보다 적은 자료형이 실체화 불기능 자료형이다.
    * 제네릭 자료형에 담긴 원소들의 자료형으로 만든 배열을 반환하는 것은 일반적으로 불가능하다.
* covariant : Meaning, the subtyping relation of the simple types are preserved for the complex types. While "function from Animal to String" is a subtype of "function from Cat to String" because the function type constructor is contravariant in the argument type. Here the subtyping relation of the simple types is reversed for the complex types.
* invariant : In computer programming, specifically object-oriented programming, a class invariant (or type invariant) is an invariant used to constrain objects of a class.
* 항등원(恒等元,Identity element)은 군론 등의 대수학에서 다루는 기본적인 개념으로, 집합의 어떤 원소와 연산을 취해도, 자기 자신이 되게하는 원소를 말한다. 항등원이 무엇인지는 집합과 이항연산의 종류에 따라 달라진다.

### 규칙 26 가능하면 제네릭 자료형으로 만들 것
* 클래스를 제네릭화하는 첫 번째 단계는 선언부에 형인자(type parameter)를 추가하는 것이다.
* 배열을 사용하는 제네릭 자료형 구현
  * Object 배열을 만들어서 제네릭 배열 자료형으로 형변환
  * E[]에서 Object[]으로 변경
* 무점검 형변환(unchecked cast) 경고 억제의 위험성은 스칼라(scalar) 자료형보다 배열 자료형 쪽이 더 크기 때문에 두번째 해법이 더 낫다고 볼 수도 있다.

* Q : '순서는 어떤 JDK냐에 따라 달라질 수 있다.'

### 규칙 27 가능하면 제네릭 메서드로 만들 것
* 형인자를 선언하는 형인자 목록(type parameter list)은 메서드의 수정자(modifier)와 반환값 자료형 사이에 둔다.
* 제네릭 싱글턴 패턴(generic singleton pattern)이 있다. 때로는 변경이 불가능하지만 많은 자료형에 적용 기능한 객체를 만들어야 할 때 가 있다. 
* 형인자가 포함된 표현식으로 형인자를 한정하는 것도 가능하다. 이런 용법을 재귀적 자료형 한정(recursive type bound)이라 한다.
* 컴파일러가 자료형을 정확히 유추하지 못할 경우에는 명시적 형인자(explicit type parameter)를 통해 어떤 자료형을 쓸지 알려줄 수 있다. 

```java
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Maps;

import java.util.HashMap;

public class ExplicitType {
  public void explicit(HashMap<String, Number> param) {
    param = Maps.newHashMap(ImmutableMap.<String, Number>builder().put("A", 1).put("B", 2).build());
  }
}
```

* Q 자료형 유추 (type inference)
* Q 항등함수(identity function)
* Q 무상태(stateless) 함수

### 규칙 28 한정적 와일드카드를 써서 API 유연성을 높여라
* 유연성을 최대화하려면, 객체 생산자(producer)나 소비자(consumer) 구실을 하는 메서드 인자의 자료형은 와일드카드 자료형으로 하라는 것이다.
* PECS (Produce - Extends, Consumer - Super)
* 반환값에는 와일드카드 자료형을 쓰면 안 된다.
* 클래스 사용자가 와일드카드 자료형에 대해 고민하게 된다면, 그것은 아마도 클래스 API가 잘못 설계된 탓일 것이다.
* 컴파일러가 자료형을 정확히 유추하지 못할 경우에는 명시적 형인자(explicit parameter)를 통해 어떤 자료형을 쓸지 알려줄 수 있다.
* Comparable\<T\> 대신 항상 Comparable\<? super T\>를 사용해야 한다.
* 형인자가 메서드 선언에 단 한군데 나타난다면 해당 인자를 와일드카드로 바꾸라는 것이다.
* 생산자는 extends이고 소비지는 super라는(PECS) 기본적 규칙을 암기하라.
* 모든 Comparable과 Comparator는 소비지라는 것도 기억하자.

* R The Get and Put Principle: use an extends wildcard when you only get values out of a structure, use a super wildcard when you only put values into a structure, and don’t use a wildcard when you both get and put.
* Q 이원성(duality) :  수학과 물리학에서 자주 등장하는 표현이다. 보통 어떤 수학적 구조의 쌍대(雙對; dual)란 그 구조를 ‘뒤집어서’ 구성한 것을 말하는데, 엄밀한 정의는 세부 분야와 대상에 따라 각각 다르다. 쌍대의 쌍대는 자기 자신이므로 어떤 대상과 그 쌍대는 서로 일종의 한 ‘켤레’를 이룬다고 할 수 있으며, 이를 쌍대관계(雙對關係)라고 한다.

### 규칙 29 형 안전 다형성 컨테이너를 쓰면 어떨지 따져보라
* 컨테이너 대신 키(key)에 형인자를 지정하는 것이 기본적 아이디어다.
* 자바 15부터 Class가 제네릭 클래스가 되었으므로 가능하다.
* class 리터털의 자료형은 더 이상 Class가 아니며, Class\<T\>다. 예를 들어 String.class의 자료형은 Class\<String\>이고 Integer.class의 자료형은 Class\<Integer\>다.
* 컴파일 시간 자료형이나 실행시간 자료형 정보를 메서드들에 전달할 목적으로 Class 리터럴을 이용하는 경우, 그런 Class 리터럴을 자료형 토큰(type token)이라 부른다.

## 6장 열거형(enum)과 어노테이션

### 규칙 30 int 상수 대신 enum을 사용하라
* 열거 자료헝(enumerated type)은 고정 개수의 상수들로 값이 구성되는 자료형이다. (객체, 배열)
* 열거 상수 (enumeration constant)별로 하나의 객체를 public static final 필드 형태로 제공하는 것이다.
* 상수를 제공하는 필드가 enum 자료형과 클라이언트 사이에서 격리 계층(layer of insulation) 구실
* enum 자료형은 컴파일 시점 형 안전성(compile-time type safety)을 제공한다.
* enum 자료형은 임의의 메서드나 필드도 추가할 수 있도록 한다.
* 임의의 인터페이스를 구현할 수도 있다.
* enum 자료형에는 object에 정의된 모든 고품질 메서드들이 포함되어 있으며 Completable 인터페이스와 Serializable 인터페이스가 구현되어 있다.
* enum 상수의 직렬화 형식(serialized form)은 enum 자료형상의 변화 대부분을 견딜 수 있도록 설계되어 있다.
* enum 상수에 데이터를 넣으려면 객체 필드(instance field)를 선언하고 생성자를 통해 받은 데이터를 그 필드에 저장하면 된다.
* 외부(external) enum 자료형 상수별로 달리 동작하는 코드를 만들어야 할 때는 enum 상수에 switch 문을 적용하면 좋다.
* enum 사용
  * 고정된 상수 집합이 필요할 때
  * 원래 열거형인 자료형(natural enumerated type)
  * 컴파일 시점에 모든 가능한 값의 목록을 알 수 있는 집합

### 규칙 31 ordinal 대신 객체 필드를 사용하라
```java
// ordinal을 남용한 사례 - 따라하면 곤란
public enum Ensemble {
	SOLO, DUET, TRIO, QUARTET, QUINTET, SEXTET, SEPTET, OCTET, NONET, DECTET;

	public int numberOfMusicians() {
		return ordinal() + 1;
	}
}
```
* enum 상수에 연계되는 값을 ordinal을 사용해 표현하지 말라는 것이다. 그런 값이 필요하다면 그 대신 객체 필드(instance field)에 저장해야 한다.

### 규칙 32 비트 필드(bit field) 대신 EnumSet을 사용하라
* 집합을 비트 필드로 나타내면 비트 단위 산술 연산(bitwise arithmetic)을 통해 합집합이나 교집합 등의 집합 연산도 효율적으로 실행할 수 있다.
* 열거 자료형을 집합에 사용해야 한다고 해서 비트 필드로 표현하면 곤란하다
* RegularEnumSet, JumboEnumSet

```java
class RegularEnumSet<E extends Enum<E>> extends EnumSet<E> {
 public boolean add(E e) {
        typeCheck(e);

        long oldElements = elements;
        elements |= (1L << ((Enum<?>)e).ordinal());
        return elements != oldElements;
    }
}
```

### 규칙 33 ordinal을 배열 첨자로 사용하는 대신 EnumMap을 이용하라
* ordinal 값을 배열 첨자로 사용하는 것은 적절치 않다는 것이다. 대신 EnumMap을 써라.

### 규칙 34 확장 가능한 enum을 만들어야 한다면 인터페이스를 이용하라
* 계승 가능 enum 자료형은 만들 수 없지만, 인터페이스를 만들고 그 인터페이스를 구현하는 기본 enum 자료형을 만들면 계승 가능 enum 자료형을 흉내 낼 수 있다.

### 규칙 35 작명 패턴 대신 어노테이션을 사용하라
* 작명 패턴(naming pattern)
  * 철자를 틀리면 알아채기 힘든 문제가 생긴다.
  * 특정한 프로그램 요소에만 적용되도록 만들 수 없다는 것이다.
  * 프로그램 요소에 인자를 전달할 마땅한 방법이 없다는 것이다.

```java
// 표식 어노테이션 자료형(marker annotation type) 선언
import java.lang.annotation.*;

/**
* 어노데이션이 붙은 메서드가 데스트 메서드임을 표시.
* 무인자(parameterless) 정적 메서드에만 사용 가능
*/
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD )
public @interface Test {
}
```
* @Retention(RetentionPolicy.RUNTIME)은 Test가 실행시간(runtime)에도 유지되어야 하는 어노테이션이라는 뜻이다.
* @Target(ElementType.METHOD)는 Test가 메서드 선언부에서만 적용할 수 있는 어노테이션이라는 뜻이다.
* 어노테이션이 있으므로 더 이상은 작명 패턴에 기대면 안된다.
* 대부분의 프로그래머는, 도구 개발에 관심 있는 개발자가 아니라면, 어노테이션 자료형을 정의할 필요가 없다.

### 규칙 36 Override 어노테이션은 일관되게 사용하라
* 상위 클래스에 선언된 메서드를 재정의할 때는 반드시 선언부에 Override 어노테이션을 붇어야 한다.
* 비-abstract 클래스에서 abstract 메서드를 재정의할 때는 Override 어노테이션을 붙이지 않아도 된다.

### 규칙 37 자료형을 정의할 때 표식 인터페이스를 사용하라
* 표식 인터페이스(marker interface)는 아무 메서듣 선언하지 않는 인터페이스다.
* 표식 인터페이스를 구현하는 것은, 해당 클래스가 어떤 속성을 만족한다는 사실을 표시하는 것과 같다.
* 표식 인터페이스 장점
  * 가장 중요한 첫 번째 장점은, 표식 인터페이스는 결국 표식 붙은 클래스가 만드는 객체들이 구현하는 자료형이라는 점이다. 표식 어노테이션은 자료형이 아니다.
  * 표식 인터페이스가 어노테이션보다 나은 점 두 번째는, 적용 범위를 좀 더 세밀하게 지정할 수 있다는 것이다.
  * 표식 인터페이스는 자료형이므로, 표식 어노테이션을 쓴다면 프로그램 실행 중에나 발견하게 될 오류를 컴파일 시점에 발견할 수 있도록 한다.
* 표식 어노테이션의 주된 장점은, 프로그램 안에서 어노테이션 자료형을 쓰기 시작한 뒤에도 더 많은 정보를 추가할 수 있다는 것이다.
* 표식 어노테이션은 더 큰 어노테이션 기능의 일부라는 장점도 갖는다.
* 만일 ElementType.TYPE에 적용될 표식 어노데이션 자료형을 작성하고 있다면, 반드시 어노테이션 자료형으로 구현해야 하는지, 표식 인터페이스로 만드는 것이 바람직하지는 않은지 고민해보기 바란다.

## 7장 메서드

### 규칙 38 인자의 유효성을 검사하라
* 인자 유효성을 검사하지 않으면 생기는 문제
  * 처리 도중에 이상한 예외를 내면서 죽어버리는 것
  * 실행이 제대로 되는 것 같기는 한데 잘못된 결과가 나오는 것
* **클래스 불변식(invariant)을 위반하는 객체**가 만들어지는 것을 막으려면, 생성자에 전달되는 인자의 유효성을 반드시 검사해야 한다.
* 확증문을 클라이언트가 패키지를 어떻게 이용하건 확증 조건(asserted condition)은 항상 참이 되어야 한다고 주장하는 것이다.
* 유효성 검사 예외
  * 오버헤드가 너무 크거나 비현실적이고, 계산과정에서 유효성 검사가 자연스럽게 이루어지는 경우
* 암묵적인 유효성 검사 방법에 지나치게 기대다 보면, 실패 원자성(failure atomicity)을 잃게 된다는 점이다

### 규칙 39 필요하다면 방어적 복사본을 만들라
* 여러분이 만드는 클래스의 클라이언트가 불변식(invariant)을 망가뜨리기 위해 최선을 다할 것이라는 가정하에, 방어적으로 프로그래밍해야 한다.
* 생성자로 전달되는 변경 가능 객체를 반드시 방어적으로 복사
* 인자의 유효성을 검사하기 전에(규칙 38) 방어적 복사본을 만들었다는 것에 유의하자. 유효성 검사는 복사본에 대해서 시행한다.
  * 취약 구간(window of vulnerability)
  * 보안 커뮤니티에서는 이런 공격을 TICTOU 공격, 즉 time-of-check/time-of-use 공격
* Date 클래스는 final 클래스가 아니므로, clone 메서드가 반드시 java.util.Date 객체를 반환할 거라는 보장이 없다.
* 인자로 전달된 객체의 자료형이 제3자가 계승할 수 있는 자료형일 경우, 방어적 복사본을 만들 때 clone을 사용하지 않도록 해야 한다.
* 변경 기능 내부 필드에 대한 방어적 복사본을 반환하도 록 접근자를 수정해야 한다.

### 규칙 40 메서드 시그너처는 신중하게 설계하라
* 메서드 이름은 신중하게 고르라.
  * 모든 이름은 표준 작명 관습(standard naming conversion)을 따라야 한다.
  * 좀 더 널리 합의된 사항에도 부합하는 이름을 고르는 것이다.
* 편의 메서드(convenience method)를 제공하는 데 너무 열 올리지 마라.
  *  "맡은 일이 명확하고 거기 충실해야(pull its weight)" 한다.
  * 클래스나 인터페이스가 수행해야 하는 동작 각각에 대해서 기능적으로 완전한 메서드를 제공하라.
* 인자 리스트(parameter list)를 길게 만들지 마라.
* 자료형이 같은 인자들이 길게 연결된 인자 리스트는 특히 더 위험하다.
* 긴 인자 리스트를 짧게 줄이는 방법
  * 여러 메서드로 나누는 것
  * 도움 클래스(helper class)를 만들어 인자들을 그룹별로 나누는 것
  * 빌더 패턴(builder pattern)을 고쳐서 객체 생성 대신 메서드 호출에 적용하는 것
  * 인자의 자료형으로는 클래스보다 인터페이스가 좋다.
  * 인자 자료형으로 boolean을 쓰는 것보다는, 원소가 2개인 enum 자료형을 쓰는 것이 낫다.

### 규칙 41 오버로딩할 때는 주의하라
* 오버로딩된 메서드 가운데 어떤 것이 호출될지는 컴파일 시점에 결정되기 때문이다.
* 오버로딩된 메서드는 정적 (static)으로 선택되지만, 재정의된 메서드는 동적(dynamic)으로 선택되기 때문이다.
* 재정의된(Overridden) 메서드의 경우, 선택 기준은 메서드 호출 대상 객체의 자료형이다.
* 오버로딩을 사용할 때는 혼란스럽지 않게 사용할 수 있도록 주의해야 한다.
* 혼란을 피하는 안전하고 보수적인 전략은, 같은 수의 인자를 갖는 두 개의 오버로딩 메서드를 API에 포함시키지 않는 것이다.
* 생성자에는 다른 이름을 사용할 수 없다. 생성자가 많다면, 그 생성자들은 향상 오버로딩된다.
  * 생성자 대신 정적 팩터리 메서드를 사용하는 옵션을 시용할 수도 있다.
* *E와 int는 더 이상 완전히 다르다고 말할 수 없게 되었다.*

```java
public class SetList {

	public static void main(String[] args) {

		Object o = new char[]{123};
		char chars[] = new char[]{123};

		System.out.println(String.valueOf(chars));
		System.out.println(String.valueOf(o));

		Set<Integer> set = new TreeSet<>();
		List<Integer> list = new ArrayList<>();

        // List
        // boolean remove(Object o);
        // E remove(int index);
        
        // Set
        // boolean remove(Object o);
		for (int i = -3; i < 3; i++) {
			set.add(i);
			list.add(i);
		}

		for (int i = 0; i < 3; i++) {
			set.remove(i);
			list.remove(i);
		}

		System.out.println(set + " " + list);
	}
}

```

### 규칙 42 varargs는 신중히 사용하라
* 자바 15부터는 공식적으로는 가변 인자 메서드(variable arity method)라고 부르는 varargs 메서드가 추가
* 마지막 인자가 배열이라고 해서 무조건 뜯어고칠 생각은 버려라.
* varargs는 정말로 임의 개수의 인자를 처리할 수있는 메서드를 만들어야 할 때만 사용하라.
* varargs가 추가된 것은 자바 1.5부터 플랫폼에 추가된 printf 메서드와, varargs를 이용할 수 있도록 개선된 핵심 리플렉션(core reflection) 기능 때문이다.
* 마지막 인자가 배열이라고 해서 무조건 뜯어고칠 생각은 버려라.
* varargs는 정말로 임의 개수의 인자를 처리할 수있는 메서드를 만들어야 할 때만 사용하라.

### 규칙 43 null 대신 빈 배열이나 컬렉션을 반환하라

```java
// 컬렉션에서 배열울 만둘어 반환하는 올바른 방법
private final List<Cheese> cheeseslnStock = ...;
private static final Cheese[] EMPTY_CHEESE_ARRAY = new Cheese[O];

*
* @return 재고가 남은 모든 치즈 목록을 배열로 만들어 반환
*/
public Cheese[] getCheeses()
  return cheesesInStock.toArray(EMPTY_CHEESE_ARRAY);
}
```

* Collection.toArray(T[])의 명세를 보면, 인자로 주어진 배열이 컬렉션의 모든 원소를 담을 정도로 큰 경우에는 해당 배열을 반환값으로 시용한다고 되어 있다. 따라서 위의 숙어대로 하면 빈 배열은 절대로 자동 할당되지 않는다.
* null 대신에 빈 배열이나 빈 컬렉션을 반환하라는 것이다.

### 규칙 44 모든 API 요소에 문서화 주석을 달라
* 좋은 API 문서를 만들려면 API에 포함된 모든 클래스, 인터페이스, 생성자, 메서드, 그리고 필드 선언에 문서화 주석을 달아야 한다.
* 메서드에 대한 문서화 주석은 메서드와 클라이언트 사이의 규약(contract)을 간명하게 설명해야 한다.
* 문서화 주석에는 해당 메서드의 모든 선행츠건 (precondition)과 후행조건(postcondition)을 나열해야 한다.
* 선행조건과 후행조건 의에도, 메서드는 부작용(side effect)에 대해서도 문서화 해야 한다.
* 더 이상은 HTML \<code\>나 \<tt\>를 사용할 필요가 없다. Javadoc의 {@code} 태그를 쓰는 편이 더 낫다. HTML의 메타문자를 이스케이프 처리할 필요가 없기 때문이다.
* 메서드에 대한 문서화 주석은 메서드와 클라이언트 사이의 규약(contract)을 간명하게 설명해야 한다.
* 제네릭 자료형이나 메서드에 주석을 달 때는 모든 자료형 인자들을 설명해야 한다.
* enum 자료형에 주석을 달 때는 자료형이나 public 메서드뿐 아니라 상수 각각에도 주석을 달아 주어야 한다.
* 어노테이션 자료형에 주석을 달 때는 자료형뿐 아니라 모든 멤버에도 주석을 달아야 한다.
* 문서화 주석을 제대로 만들려면 오라클의 How to write Doc Commen데avadoc-gUide]를 꼭 읽어야 한다. 

## 8장 일반적인 프로그래밍 원칙들

### 규칙 45 지역 변수의 유효범위를 최소화하라
* 자바에서는 명령문(statement)을 둘 수 있는 자리에는 변수도 선언할 수 있다.
* 지역 변수의 유효범위를 최소화하는 가장 강력한 기법은, 처음으로 사용하는 곳에서 선언하는 것이다.
* 거의 모든 지역 변수 선언에는 초기값(initializer)이 포함되어야 한다.
* while 문보다는 for 문을 쓰는 것이 좋다.
* 메서드의 크기를 줄이고 특정한 기능에 집중하라는 것이다.

### 규칙 46 for 문보다는 for-each 문을 사용하라
* for-each 문은 전통적인 for 문에 비해 명료하고 버그 발생 가능성도 적으며, 성능도 for 문에 뒤지지 않는다.
* for-each 문으로는 컬렉션과 배열뿐 아니라 Iterable 인터페이스를 구현하는 어떤 객체도 순회할 수 있다.
* for-each 미적용
  * 필터링
  * 변환
  * 병렬 순회

### 규칙 47 어떤 라이브러리가 있는지 파악하고, 적절히 활용하라
* 라이브러리를 사용 장점
 * 표준 라이브러리(standard library)를 사용하면 그 라이브러리를 개발한 전문가의 지식뿐만 아니라 여러분보다 먼저 그 라이브러리를 시용한 사람들의 경험을 활용할 수 있다.
 * 실제로 하려는 일과 큰 관련성도 없는 문제에 대한 해결 방법을 임의로 구현하느라 시간을 낭비하지 않아도 된다는 것이다.
 * 여러분이 별다른 노력을 하지 않아도 그 성능이 점차로 개선된다는 것이다.
* 중요한 새 릴리스(major new release)가 나올 때마다 많은 기능이 새로 추가되는데, 그때마다 어떤 것들이 추가되었는지를 알이두는 것이 좋다.
* **자바 프로그래머라면 java.lang, java.util 안에 있는 내용은 잘 알고 있어야 하며, java.io의 내용도 어느 정도 알고 있어야 한다.**
* 릴리스 1.2에는 java.utl 패키지에 컬렉션 프레임워크(Collections Framework)가 추가되었다.
* 릴리스 1.5부터는 병행성(concurrency) 관련 유틸리티들이 java.util.concurrent 패키지에 추가되었다.
* 바퀴를 다시 발명하지 말라(don,t reinvent the wheel)

### 규칙 48 정확한 답이 필요하다면 float와 double은 피하라
* float와 double은 특히 돈과 관계된 계산에는 적합하지 않다.
* 돈 계산을 할 때는 BigDecimal, int 또는 long을 사용한다는 원칙을 지켜야 한다.
* 성능이 중요하고 소수점 아래 수를 직접 관리해도 상관없으며 계산할 수가 심하게 크지 않을 때는 int나 long을 쓰라
* 관계된 수치
  * 십진수 아홉 개 이하로 표현이 기능할 때는 int를 쓰라. 
  * 18개 이하로 표현 가능할 때는 long을 쓰라.
  * 그 이상일 때는 BigDecimal을 써야 한다.

### 규칙 49 객체화된 기본 자료형 대신 기본 자료형을 이용하라
* 기본 자료형과 객체화된 기본 자료형 차이점
  * 기본 지료형은 값만 가지지만 객체화된 기본 자료형은 값 외에도 신원(identity)을 가진다는 것
  * 기본 자료형에 저장되는 값은 전부 기능적으로 완전한 값(fully functional value)이지만, 객체화된 기본 자료형에 저장되는 값에는 그 이외에도 이무 기능도 없는 값, 즉 null이 하나 있다는 것
  * 기본 자료형은 시간이나 공간 요구량 측면에서 일반적으로 객체 표현형보다 효율적이라는 것
* 객체화된 기본 자료형에 == 연산자를 사용하는 것은 거의 항상 오류라고 봐야 한다.
* 기본자료형과 객체화된 기본 자료형올 한 연산 안에 엮어 놓으면 객체화된 기본 자료형은 자동으로 기본 자료형으로 변환된다.
* 객체화된 기본 자료형
  * 컬렉션의 요소, 키, 값으로 사용할 때다. 컬렉션에는 기본 자료형을 넣을 수 없으므로 객체화된 자료형
  * 형인자 자료형의 형인자료는 객체화된 기본 자료형
  * 리플렉션을 통해 메서드를 호출할 때도 객체화된 기본자료형을 사용
* 자동 객체화는 번거로운 일을 줄여주긴 하지만, 객체화된 기본 자료형을 사용할 때 생길 수 있는 문제들까지 없애주진 않는다.
* 객체화된 기본 자료형과 기본 자료형을 한 표현식 안에 뒤섞으면 비객체화가 자동으로 일어나며, 그 과정에서 NullPointerException이 발생할 수 있다.
* 기본 자료형 값을 객체화하는 과정에서 불필요한 객체들이 만들어지면 프로그램 성능이 저하될 수도 있다.

### 규칙 50 다른 자료형이 적절하다면 문자열 사용은 피하라
* 문자열은 값 자료형(value type)을 대신하기에는 부족하다.
* 적절한 값 자료형이 있다면 그것이 기본 자료형이건 아니면 객체 자료형이건 상관없이 해당 자료형을 사용
* 문자열은 enum 자료형을 대신하기에는 부족하다.
* 문자열은 혼합 자료형(aggregate type)을 대신하기엔 부족하다. 
* 문자열은 권한(capability)을 표현하기엔 부족하다.

```java
public class ThreadLocal {
  private ThreadLocal() {} //객체를만들수없다

  // 주어진 이름이 가리키는 스레드 지역 변수의 값 설정.
  public static void set(String key, Object value);
  
  // 주어진 이름이 가리키는 스레드 지역 변수의 값 반환.
  publicc static Object get(String key);
}
```

```java
public class ThreadLocal {
  privateThreadLocal(); //객체를만들수없다

  public static class Key { //(권한)
    Key();
  }

  // 유일성이 보장되는, 위조 불가능 키를 생성
  public static Key getKey() {
    return new Key();
  }

  public static void set(Key key, Object value);
  public static Object get(Key key);
}
```

```java
public class ThreadLocal {
  public ThreadLocal();
  public void set(Object value);
  public Object get();
}
```

```java
public class ThreadLocal<T> {
  public ThreadLocal();
  public void set(T value);
  public Object get();
}
```

### 규칙 51 문자열 연결 시 성능에 주의하라
* n개의 문자열에 연결 연산자를 반복 적용해서 연결하는 데 드는 시간은, n^2에 비례한다.

```java
// 문자열을 연결하는 잘못된 방법 - 성능이 엉망이다.
public class Sample {
    public String statement() {
      Strinq result= '';
      for (int i=0; i < numltems(); i++)
        result += lineForItem(i); //String concatenatlon
      return result;
    }
}
```

* 만족스런 성능을 얻으려면 String 대신 StringBulder를 써서 청구서를 저장해야 한다.
  * 릴리즈 1.5에 추가된 것으로, StringBuffer에서 동기화 synchronization 기능을 뺀 것이다.

```java
// 문자열을 연결하는 잘못된 방법 - 성능이 엉망이다.
public class Sample {
	public String statement() {
      StringBuilder b = new StringBuilder(numItems() * LINE_WIDTH);
      for (int i = 0; i < numItems(); i++)
        b.append(lineForItem(i));
      return b.toString();
    }
}
```

### 규칙 52 객체를 참조할 때는 그 인터페이스를 사용하라
* 만일 적당한 인터페이스 자료형이 있다면 인자나 반환값, 변수, 그리고 필드의 자료형은 클래스 대신 인터페이스로 선언하자.
* 인터페이스를 자료형으로 쓰는 습관을 들이면 프로그램은 더욱 유연해진다.
* 적당한 인터페이스가 없는 경우에는 객체를 클래스로 참조하는 것이 당연하다.
* 객체를 참조할 때 인터페이스를 사용하면 훨씬 유연한 프로그램을 만들 수 있다. 
* 인터페이스가 없는 경우에는 필요한 기능을 제공하는 클래스 7陷데 가장 일반적인 클래스를 클래스 계층 안에서 찾아서 이용해야 한다.

### 규칙 53 리플렉션 대신 인터페이스를 이용하라
* java.lang.reflect의 핵심 리플렉션 기능(core reflection facility)을 이용하면 메모리에 적재된(load) 클래스의 정보를 가져오는 프로그램을 작성할 수 있다.
* 명심할 것은, 일반적인 프로그램은 프로그램 실행 중에 리플렉션을 통해 객체를 이용하려 하면 안 된다는 것이다.
* 리플렉션을 아주 제한적으로만 사용하면 오버헤드는 피하면서도 리플렉션의 다양한 장점을 누릴 수 있다.
* 객체 생성은 리플렉션으로 하고 객체 참조는 인터페이스나 상위 클래스를 통하면 된다. 

### 규칙 54 네이티브 메서드는 신중하게 사용하라
* 네이티브 메서드를 통해 성능을 개선하는 것은 추천하고 싶지 않다.
* 네이티브 언어는 안전하지 않으므로 (규칙 39), 네이티브 메서드를 이용하는 프로그램은 메모리 훼손 문제(memory corruption error)로부터 자유로울 수 없다.
* 네이티브 언어는 플랫폼 종속적(platfbrm dependent)이므로, 이식성이 낮다.
* 네이티브 코드를 사용하는 프로그램은 디버깅하기도 훨씬 어렵다.
* 네이티브 코드를 넘나드는 데 필요한 기본적인 비용 때문에, 네이티브 메서드가 하는 일이 별로 없다면 오히려 성능을 떨어뜨릴 수도 있다.
* 네이티브 메서드를 시용하려면 이해하기도 어렵고 작성하기도 난감한 “접착 코드(glue Code)”를 작성해야 한다.
* 네이티브 코드에 있는 아주 작은 버그라도 시스템 전체를 훼손시킬 수 있다.

### 규칙 55 신중하게 최적화하라
* 성능 때문에 구조적인 원칙(architectural principle)을 희생하지 마라. 
* **빠른 프로그램이 아닌, 좋은 프로그램을 만들려 노력하라.**
* 설계를 할 때는 성능을 제약할 가능성이 있는 결정들은 피하라.
* API를 설계할 때 내리는 결정들이 성능에 어떤 영향을 끼칠지를 생각하라.
* 좋은 성능을 내기 위해 API를 급진적으로 바꾸는 것은 바람직하지 않다.
* "최적화를 시도할 때마다, 전후 성능을 측정하고 비교하라."

### 규칙 56 일반적으로 통용되는 작명 관습을 따르라
* 자바의 작명 관습
  * 철자 관련
  * 문법 관려
* 철자 관련
  * 패키지 
    * 이름은 마침표를 구분점으로 사용하는 계층적 이름이어야 한다.
    * 이름을 구성하는 각각의 컴포넌트는 알파벳 소문자로 구성하고, 숫자는 거의 사용하지 않는다.
    * 조직 바깥에서 이용될 패키지 이름은 해당 조직의 인터넷 도메인 이름으로 시작 (최상위 도메인 이름이 먼저 온다.) 
    * 예의적으로, 표준 라이브러리와 그 옵션 패키지 명은 java와 javax로 시작한다. (java나 javax로 시작하는 패키지 이름을 만들면 안 된다.)
    * 이름의 나머지 부분은 어떤 패키지인지 설명하는 하나 이상의 컴포넌트로 구성된다.
    * 패키지명 컴포넌트는 짧아야 하며, 보통 여덟 문자 이하로 만들어진다.
    * 의미가 확실한 약어를 활용하면 좋다.(utilities 대신 util, awt 같은 두문자도 사용)BotDetect CAPTCHA
  * 두문자의 경우 전부 대문자로 써야 하는지, 아니면 그 첫 글자만 대문자로 써야 하는지에 대해서는 합의된 것이 별로 없다. (예 : HTTPURL, HttpUrl)
  * 메서드와 필드 이름은 클래스나 인터페이스 이름과 동일한 철자 규칙을 따른다. 
    * 다만 첫 글자는 소문자로 한다.
    * 메서드나 필드 이름 맨 앞에 두문자를 두어야 하는 경우, 소문자로 해야 한다.
  * 상수 필드의 이름은 하나 이상의 대문자 단어로 구성되며, 단어 사이에는 밑줄 기호를 둔다. (예 : VALUES, NEGATIVE_INFINITY)
  * 지역 변수 이름은 멤버 이름과 같은 철자 규칙을 따르는데, 약어가 허용된다는 것만 다르다.
  * 자료형 인자의 이름은 보통 하나의 대문자다.
* 문법적(grammatical) 
  * 작명 관습은 더 가변적일 뿐만 아니라, 철자 관습에 비해 논쟁의 여지가 많다.
  * 패키지의 경우에는 문법적 작명 관습이라 할 만한 것이 없다.
  * enum 자료형을 비롯한 클래스에는 단수형의 명사나 명사구(noun phrase)가 이름으로 붙는다. (예 :  Timer, BufferedWinter, ChessPiece)
  * 인터페이스도 클래스와 비슷한 작명 규칙을 따른다.
   * able이나 ible 같은 형용사격 어미가 붙기도 한다. (예 : Runnable,Iterable, Accessible)
  * 어노테이션 자료형은 쓰임새가 너무 다양해서 딱히 지배적이라 할 만한 규칙이 없다.
    * 명사, 동사, 전치사, 형용사 기운데 어느 것이나 널리 쓰인다. (예 : BindingAnnotaUon, Inject, ImplementedBy, Singleton)
  * 어떤 동작을 수행하는 메서드는 일반적으로 동사나 동사구(목적어 포함)를 이름으로 갖는다. (예 :  append, drawImage)
  * boolean 값을 반환하는 메서드의 이름은 보통 is, 드물게는 has로 시작하고, 그 뒤에는 명사나 명사구, 또는 형용시나 형용시구가 붙는다. (isDigit, isProbablePrime, isEmpty, isEnabled, hashSiblings)
  * boolean 이의의 기능이나 객체 속성을 반환하는 메서드에는 보통 명사나 명사구, 또는 get으로 시작하는 동시구를 이름으로 붙언다. (size, hashCode, getTime)
  * 객체의 자료형을 변환하는 메서드, 다른 자료형의 독립적 객체를 반환하는 메서드에는 보통 toType 형태의 이름을 붙인다. (예 : toString, toArray)
  * 인자로 전달받은 객체와 다른 자료형의 뷰(view) 객체를 반환하는 메서드에는(규칙 5) asType 형태의 이름을 붙인다.
  * 호출 대상 객체와 동일한 기본 자료형 값을 반환하는 메서드에는 typeValue와 같은 형태의 이름을 붙인다.
  * 정적 팩터리 메서드에는 valueOf, of, getInstane, newInstance, getType, newType 같은 이름을 붙인다.
  * 필드 이름에는 특별한 문법적 관습이 없을 뿐더러, 클래스나 인터페이스, 메서드 이름 규칙에 비하면 별로 중요하지도 않다.
    * 잘 설계된 API에는 외부로 공개된 필드가 별로 없기 때문이다.
  * boolean 형의 필드에는 보통 boolean 메서드와 같은 이름을 붙이나, 접두어 is는 생략한다. (예 : initialized, Composite)
  * 다른 자료형의 필드에는 보통 명사나 명사구를 이름으로 쓴다. (height, digits, bodyStyle)
  * 지역 변수에도 비슷한 규칙이 적용되나, 훨씬 느슨하다.

## 9장 예외

### 규칙 57 예외는 예외적 상황에만 사용하라
* 이름이 말하듯이, 예의는 예의적인 상황에만 사용해야 한다. 평상시 제어 흐름(ordinary control flow)에 이용해서는 안 된다.
* 설계된 API는 클라이언트에게 평상시 제어 흐름의 일부로 예의를 사용하도록 강요해서는 안 된다.
* 특정한 예측 불가능 조건이 만족될 때만 호출할 수 있는 "상태 종속적(state-dependent)" 메서드를 가진 클래스에는 보통 해당 메서드를 호출해도 되는지를 알기 위한 "상태 검사(state一testing)" 메서드가 별도로 갖춰져 있다.
* 부적절한 상태의 객체에 상태 종속적 메서드를 호출하면 null 같은 특이값(distinguished value)이 반환되도록 구현하는 방법도 있다.
* 상태 검사 메서드와 특이값
  * 외부적인 동기화 메커니즘 없이 병렬적으로 사용될 수 있는 객체거나, 외부적인 요인으로 상태 변화가 일어날 수 있는 객체라면 반드시 특이값 방식으로 구현해야 한다.
  * 상태속적 메서드가 하는 일을 상태 검사 메서드가 중복해서 하는 바람에 성능이 어질까 우려된다면, 역시 특이값 방식을 따르는 것이 좋을 것이다.
  * 다른 모든 조건이 동일하다면 상태 검사 메서드를 두는 편이 대체로 바람직하다.

### 규칙 58 복구 가능 상태에는 점검지정 예외를 사용하고, 프로그래밍 오류에는 실행시점 예외를 이용하라
* 자바는 세 가지 종류의 'throwable'을 제공한다. 점검지정 예외(checked exception), 실행시점 예외(runtime exception), 그리고 오류(error)다.
* 무점검(unchecked) 'throwable'에는 실행시점 예외와 오류 두 가지가 있으며, 동작 방식은 같다.
  * 둘 다 catch로 처리할 필요가 없으며, 일반적으로는 처리해서도 안 된다.
* 오류(error)는 JVM이 자원 부족(resource deficiency)이나 불변식 위반(invanant failure) 등, 더 이상 프로그램을 실행할 수 없는 상태에 도달했음을 알리기 위해 시용한다.
* 점검지정 예외는 메서드를 호출하면 해당 예외와 관계된 상황이 발생할 수 있음을 API 사용자에게 알리는 구실을 한다.
* 프로그래밍 오류를 표현할 때는 실행시점 예의를 사용하라.
* 사용자 정의 무점검 throwable은 RuntimeException의 하위 클래스로 만들어야 한다.
* 복구가 기능할 것 같으면 점검지정 예의를 사용하라. 아니라면 실행시점 예의를 이용하라. 

### 규칙 59 불필요한 점검지정 예외 사용은 피하라
* 코드(code)를 반환하는 것과는 달리, 프로그래머로 하여금 예외적인 상황을 처리하도록 강제함으로써 안정성(reliability)을 높인다.
* 너무 남발하면 사용하기 불편한 API가 될수도 있다는 뜻이기도 하다. 

### 규칙 60 표준 예외를 사용하라
* 자바 플랫폼 라이브러리에는 대부분의 API가 필요로 하는 기본적인 무점검 예외들이 갖추어져 있다.
* IllegalArgumentException : 잘못된 값을 인자로 전달했을 때 일반적으로 발생하는 예외다.
* IllegalStateExecption : 현재 객체 상태로는 호출할 수 없는 메서드를 호출했을 때 일반적으로 발생하는 예외다.
* NullPointException : null 인자를 받으면 되는 메서드에 nuU을 전달한 경우
* IndexOutOfBoundsException : 어떤 순서열(sequence)의 첨자를 나타내는 인자에 참조 기능 범위를 벗어난 값이 전달되었을 때
* UnsupportedOperationException : 어떤 객체가 호출된 메서드를 지원하지 않을 때 발생

### 규칙 61 추상화 수준에 맞는 예외를 던져라
* 상위 계층에서는 하위 계층에서 발생하는 예외를 반드시 받아서 상위 계층 추상화 수준에 맞는 예외로 바꿔서 던져야 한다.
* 아무 생각 없이 아래 계충에서 생긴 예의를 밖으로 전달하기만 하는 것보다야 예의 변환 기법이 낫지만, 남용하면 안 된다.
* 하위 계층에서 발생한 예제 정보가 상위 계층 예의를 발생시킨 문제를 디버깅하는 데 유용할 때 사용한다.
* 하위 계층 예의(원인cause)는 상위 계층 예외로 전달되는데, 상위 계층 예외에 있는 접근자 메서드(Throwable.getCause)를 호출하면 해당 정보를 꺼낼 수 있다.

### 규칙 62 메서드에서 던져지는 모든 예외에 대해 문서를 남겨라
* 점검지정 예의는 독립적으로 선언하고, 해당 예의가 발생하는 상황은 Javadoc @throws 태그를 사용해서 정확하게 밝혀라.
* Javadoc @throws 태그를 사용해서 메서드에서 발생 가능한 모든 무점검 예외에 대한 문서를 남겨라. 하지만 메서드 선언부의 throws 뒤에 무점검 예의를 나열하진 마라.
* 같은 이유로 동일한 예의를 던지는 메서드가 많다면, 메서드마다 문서를 만드는 대신, 해당 예외에 대한 문서는 클래스의 문서화 주석(documentation comment)에 남겨도 된다. 

### 규칙 63 어떤 오류인지를 드러내는 정보를 상세한 메시지에 담으라
* 오류 정보를 포착해 내기 위해서는, 오류의 상세 메시지에 "예외에 관계된" 모든 인자와 필드의 값을 포함시켜야 한다. 

### 규칙 64 실패 원자성 달성을 위해 노력하라
* 실패 원자성(failure atomicity) : 메서드 호출이 정상적으로 처리되지 못한 객체의 상태는, 메서드 호출 전 상태와 동일해야 한다.
  * 변경 불가능 객체로 설계
  * 인자 유효성(validity)을 검사

```java
public Object pop()
  if (size == 0)
    throw new EmptyStackException();
  Object result = elements[--size];
  elementS[size] = null; //만기(obsolete) 참조 제거
  return result;
}
```

  * 연산 수행 도중에 발생하는 오류를 가로채는 복구 코드(recovery code)를 작성
  * 객체의 임시 복사본상에서 필요한 연산을 
* 실패 원자성은 일반적으로 권장되는 덕목이지만 언제나 달성할 수 있는 것은 아니다. 

### 규칙 65 예외를 무시하지 마라
* 빈 catch 블록은 예의를 선언한 목적, 그러니까 예외적 상황을 반드시 처리하도록 강제한다는 목적에 배치된다.
* 적어도 catch 블록 안에는 예의를 무시해도 괜찮은 이유라도 주석으로 남겨 두어야 한다.

## 10장 병행성

### 규칙 66 변경 가능 공유 데이터에 대한 접근은 동기화하라
* synchronized 키워드는 특정 메서드나 코드 블록을 한 번에 한 스레드만 시용하도록 보장한다.
* 동기화 없이는 한 스레드가 만든 변화를 다른 스레드가 확인할 수 없다.
* 동기화는 스레드가 일관성이 깨진 객체를 관측할 수 없도록 할 뿐 아니라, 동기화 메서드나 동기화 블록에 진입한 스레드가 동일한 락의 보호 아래 이루어진 모든 변경(modification)의 영향을 관측할 수 있도록 보장한다.
* 언어 명세상으로는 필드에서 읽어낸 값은 임의의 값이 될 수 없다고 되어 있으나, 그렇다고 어떤 스레드가 기록한 값을 반드시 다른 스레드가 보게 되리라는 보장은 없다. 
* synchronized 키워드는 특정 메서드나 코드 블록을 한 번에 한 스레드만 사용 하도록 보장한다.
* 상호배제성뿐 아니라 스레드 간의 안정적 통신을 위해서도 동기화는 반드시 필요하다.
* 메모리 모델은 한 스레드가 만든 변화를 다른 스레드가 볼 수 있게 되는 시점과, 그 절차를 규정한다.
* Thread.stop은 절대로 이용하지 마라.
* 읽기 연산과 쓰기 연산에 전부 적용하지 않으면 동기화는 아무런 효과도 없다.
* volatle이 상호 배제성을 실현하진 않지만, 어떤 스레드건 가장 최근에 기록된 값을 읽도록 보장한다.

### 규칙 67 과도한 동기화는 피하라
* 생존 오류나 안전 오류를 피하고 싶으면, 동기화 메서드나 블록 안에서 클라이언트에게 프로그램 제어 흐름(control)을 넘기지 마라.
* 동기화가 적용된 영역 안에서는 재정의(override) 가능 메서드나 클라이언트가 제공한 함수 객체(function object) 메서드를 호출하지 말라
* 불가해(alien) 메서드 ?
* 명심해야 할 것은, 동기화 영역 안에서 수행되는 작업의 양을 기능한 한 줄여야 한다는 것이다. 
* 락 분할(lock splitting), 락 스트라이핑(striping), 비봉쇄형 병행성 제어(nonblocking concurrency control)

### 규칙 68 스레드보다는 실행자와 태스크를 이용하라
* 릴리스 1.5부터 자바 플랫폼에는 java.util.concurrent가 추가되었다. 이 패키지에는 실행자 프레임워크(Executor Framework)라는 것이 들어 있는데, 유연성이 높은 인터페이스 기반 태스크(task) 실행 프레임워크다.
* 작은 프로그램이거나 부하가 크지 않은 서버를 만들 때는 보통 Executors.newCachedThreadPool이 좋다.
* 부하가 심한 환경에 들어갈 서버를 만들 때는 Executors.newFixedThreadPool을 이용해서 스레드 개수가 고정된 풀을 만들거나, 최대한 많은 부분을 직접 제어하기 위해 ThreadPoolExecutor 클래스를 사용하는 것이 좋다.
* 태스크에는 두 가지 종류
  * Runnable, Callable
* 실행자 프레임워크는 태스크를 실행하는 부분을 담당

### 규칙 69 wait나 notify 대신 병행성 유틸리티를 이용하라
* wait와 notify를 정확하게 사용하는 것이 어렵기 때문에, 이 고수준 유틸리티들을 반드시 이용해야 한다.
* Java.util.concurrent
  * 실행자 프레임워크
  * 병행 컬렉션
  * 동기자
* 컬렉션 외부에서 병행성을 처리하는 것은 불가능하다. 락을 걸어봐야 아무 효과가 없을 뿐 아니라 프로그램만 느려진다.
* Collections.synchronizedMap이나 HashTable 대신 ConcurrentHashMap을 사용하도록 하자.
* 컬렉션 인터페이스 기운데 몇몇은 봉쇄 연산(blocking operation)이 기능하도록 확장되었다.
* 동기자(synchronizer)는 스레드들이 서로를 기다릴 수 있도록 하여, 상호협력이 가능하게 한다.
* 카운트다운 래치(countdown latch)는 일회성 배리어(barrier)로서 하나 이상의 스레드가 작업을 마칠 때까지 다른 여러 스레드가 대기할 수 있도록 한다.
* 특정 구간의 실행시간을 쟬 때는 System.currentTimeMillis 대신 System.nanoTime을 사용해야 한다.
* wait 메서드를 호출할 때는 반드시 이 대기 순환문(wait loop) 숙어대로 하자.
* 새로 만드는 프로그램에 wait나 notify를 사용할 이유는 거의 없다.

### 규칙 70 스레드 안전성에 대해 문서로 남겨라
* synchronized 키워드는 메서드의 구현 상세(implementation detail)에 해당하는 정보이며, 공개 API의 일부가 아니다.
* 병렬적으로 사용해도 안전한 클래스가 되려면, 어떤 수준의 스레드 안전성을 제공하는 클래스인지 문서에 명확하게 남겨야 한다.
* 스레드 안전성을 그 수준별로 요약
  * 변경 불가능(immutable) 
  * 무조건적 스레드 안전성(unconditionally thread-safe)
  * 조건부 스레드 안전성(Conditionally thread-safe)
  * 스레드 안전성 없음
  * 다중 스레드에 적대적(thread-hostile)

### 규칙 71 초기화 지연은 신중하게 하라
* 대부분의 경우, 지연된 초기회를 하느니 일반 초기회를 하는 편이 낫다. 
* 초기화 순환성(initialization circularity) 문제를 해소하기 위해서 초기화를 지연시키는 경우에는 동기화된 접근자(synchronized accessor)를 사용하라.
* 성능 문제 때문에 정적필드 초기화를 지연시키고 싶올 때는 초기화 지연 담당 클래스(lazy initialization holder class) 숙어를 적용하라
* 성능 문제 때문에 객체 필드 초기화를 지연시키고 싶다면 이중 검사(double-check) 숙어를 사용하라. 

### 규칙 72 스레드 스케줄러에 의존하지 마라
* 정확성을 보장하거나 성능을 높이기 위해 스레드 스케줄러에 의존하는 프로그램은 이식성이 떨어진다(non-portable).
* 스레드는 필요한 일을 하고 있지 않을 때는 실행 중이어서는 안 된다.
* Thread.yield를 호출해서 문제를 해결하려고는 하지 마라.
* Thread.yield에는 테스트 가능한 의미(semantic)가 없다.
* 스레드 우선순위는 자바 플랫폼에서 가장 이식성이 낮은 부분 가운데 하나다.

### 규칙 73 스레드 그룹은 피하라
* 스레드 그룹은 이제 폐기된 추상화 단위다.
* 스레드를 논리적인 그룹으로 나누는 클래스를 만들어야 한다면, 스레드 풀 실행자(thread pool executor)를 이용하는 것이 바람직할 것이다.

## 11장 직렬화

### 규칙 74 Serializable 인터페이스를 구현할 때는 신중하라
* Serializable 구현과 관련된 가장 큰 문제는 일단 클래스를 릴리스하고 나면 클래스 구현을 유연하게 바꾸기 어려워진다는 것이다.
* Serializable을 구현하면 생기는 두 번째 문제는, 버그나 보안 취약점(security hole)이 발생할 기능성이 높아진다는 것이다.
* Serialization을 구현하면 생기는 세 번째 문제는, 새 버전 클래스를 내놓기 위한 데스트 부담이 늘어난다는 것이다.
* Serializable 인터페이스를 구현한다는 것은 가벼이 볼 수 없는 결정이다.
* 계승을 염두에 두고 설계하는 클래스는(규칙 17) Serializable을 구현하지 않는 것이 바람직하다. 또한 인터페이스는 가급적 Serializable을 계승하지 말아야 한다.
* 계승을 고려해 설계한 직렬화 불가능 클래스에는 무인자 생성자를 제공하는 것이 어떨지 반드시 따져봐야 한다.
* 내부 클래스(inner class)는(규칙 22) Serializable을 구현하면 안 된다.
* 내부 클래스의 기본 직렬화 형식은 정의될 수 없다(ill-defined).

### 규칙 75 사용자 지정 직렬화 형식을 사용하면 좋을지 따져 보라
* 어떤 직렬화 형식이 적절할지 따져보지도 않고 기본 직렬화 형식(default serialized form)을 그대로 받아들이지 마라.
* 기본 직렬화 형식은 그 객체의 물리적 표현이 논리적 내용과 동일할 때만 적절하다.
* 설사 기본 직렬화 형식이 만족스럽다 하더라도, 불변식(invariant)이나 보안 (security) 조건을 만족시키기 위해서는 readObject 메서드를 구현해야 마땅한 경우도 많다.
* 객체의 물리적 표현 형태가 논리적 내용과 많이 다를 경우 기본 직렬화 형식을 그대로 빈아들이면 아래의 네 가지 문제가 생기게 된다.
* 객체의 모든 필드가 transient 일 때는 defaultWriteObject나 defaultReadObject를 호출하지 않는 것도 기술적으로 가능하긴 하지만 권장하는 사항은 아니다.
* 객체의 논리적 상태를 구성하는 값이라는 확신이 들기 전에는 비-transient 필드로 만들어야겠다는 결정을 내리지 마라.
* 객체를 직렬화 할 때는 객체의 상태 전부를 읽는 메서드에 적용할 동기화 수단을 반드시 적용해야 한다.
* 어떤 직렬화 형식을 이용하건, 직렬화 가능 클래스를 구현할 때는 직렬 버전 UID(serial version UID)를 명시적으로 선언해야 한다.

### 규칙 76 readObject 메서드는 방어적으로 구현하라
* 객체를 역으로 직렬화할 때는 클라이언트가 가질 수 없어야 하는 객체 참조를 담은 모든 필드를 방어적으로 복사하도록 해야 한다.
* writeUnshared와 readUnshared 메서드는 사용하지 마라. 

### 규칙 77 개체 통제가 필요하다면 readResolve 대신 enum 자료형을 이용하라
* 사실, 개체 통제를 위해 readResolve를 활용할 때는, 객체 참조 자료형으로 선언된 모든 객체 필드를 반드시 transient로 선언해야 한다.
* readResolve 메서드의 접근 권한은 중요하다.

### 규칙 78 직렬화된 객체 대신 직렬화 프락시를 고려해 보라
* 직렬화 프락시 패턴
  * 바깥 클래스 객체의 논리적 상태를 간결하게 표현하는 직렬화 기능 클래스를 private static 중첩 클래스로 설계
  * 중첩 클래스를 직렬화 프락시(serialization proxy)라고 부름
  * 바깥 클래스를 인자 자료형으로 사용하는 생성자를 하나만 가짐
  * 생성자는 인자에서 데이터를 복사
 
 ```java
public final class Period implements Serializable {
	private final Date start;
	private final Date end;

	public Period(Date start, Date end) {
		this.start = new Date(start.getTime());
		this.end = new Date(end.getTime());
		if (this.start.compareTo(this.end) > 0)
			throw new IllegalArgumentException(start + " after " + end);
	}

	public Date start() {
		return new Date(start.getTime());
	}

	public Date end() {
		return new Date(end.getTime());
	}

	public String toString() {
		return start + " - " + end;
	}

	private static class SerializationProxy implements Serializable {
		private final Date start;
		private final Date end;

		SerializationProxy(Period p) {
			this.start = p.start;
			this.end = p.end;
		}

		private static final long serialVersionUID = 234098243823485285L;

		private Object readResolve() {
			return new Period(start, end);
		}
	}

	private Object writeReplace() {
		return new SerializationProxy(this);
	}

	private void readObject(ObjectInputStream stream)
			throws InvalidObjectException {
		throw new InvalidObjectException("Proxy required");
	}
}
```