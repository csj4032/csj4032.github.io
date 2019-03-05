---
title: Effective Java 3판
description: Effective Java 책 정리
categories:
 - book
tags:
 - java
comments: true
---

# 이펙티브 자바

---

## 1장 들어가기

## 2장 객체 생성과 파괴

### 아이템 1. 생성자 대신 정적 팩터리 메서드를 고려하라

* 클라이언트가 클래스의 인스턴스를 얻는 전통적인 수단은 public 생성자
* 클래스는 생성자와 별도로 정적 팩터리 메서드(static factory method)를 제공

```java
public static Boolean valueOf (boolean b) {
  return b ? Boolean.TRUE : Boolean.FALSE;
}
```

* **첫 번째, 이름을 가질 수 있다.**
  * 생성자에 넘기는 매개변수와 생성자 자체만으로는 반환될 객체의 특성을 제대로 설명하지 못한다.
  * 정적 팩터리는 이름만 잘 지으면 반환될 객체의 특성을 쉽게 표사할 수 있다.

* **두 번째, 호출될 때마다 인스턴스를 새로 생성하지는 않아도 된다.**
  * 불변 클래스는 인스턴스를 미리 만들어 놓거나 새로 생성한 인스턴스를 캐싱하여 재활용하는 식으로 불필요한 객체 생성을 피할 수 있다.

* **세 번째, 반환 타입의 하위 타입 객체를 반환할 수 있는 능력이 있다.**
  * 인터페이스를 정적 팩터 리 메서드의 반환 타입으로 사용하는 인터페이스 기반 프레임워크(아이템 20) 를 만드는 핵심 기술
  * 인터페이스 기반 프레임워크 ?

```java
public interface Java8StaticMethod {

	String STATIC_FIELD = "JAVA_8";

	class MemberClass {
		public MemberClass() {

		}
	}

	default void print(String str) {
		if (isNull(str))
			System.out.println(str);
	}

	// 자바 8에서도 인터페이스에는 public 정적 멤버만 허용
	static boolean isNull(String str) {
		return str == null ? true : "".equals(str) ? true : false;
	}
}
```

```java
public interface Java9StaticMethod {

	String STATIC_FIELD = "JAVA_9";

	class MemberClass {
		public MemberClass() {

		}
	}

	default void print(String str) {
		if (isNull(str))
			System.out.println(str);
	}

	// 자바9에서는 private 정적 메서드까지 허락
	private static boolean isNull(String str) {
		return str == null ? true : "".equals(str) ? true : false;
	}
}
```

* **네 번째, 입력 매개변수에 따라 메번 다른 클래스의 객체를 반환할 수 있다.**
  * 반환 타입의 하위 타입이기만 하면 어떤 클래스의 객체를 반환하든 상관없다.

* **다섯 번째, 정적 팩터리 메서드를 작성하는 시점에는 반환할 객체의 클래스가 존재하지 않아도 된다.**
  * 서비스 제공자 프레임워크
    1. 구현체의 동작을 정의하는 서비스 인터페이스(service interface)
    2. 제공자가 구현체를 등록 할 때 사용하는 제공자 등록 API(provider registration API),
    3. 클라이언트가 서비 스의 인스턴스를 얻을 때 사용하는 서비스 접근 API(service access API)
    4. 서비스 제공자 인터페이스(service provider interface)

| 핵심 컴포넌트 | JDBC |
| 서비스 인터페이스 | Connection |
| 제공자 등록 API | DriverManager.registerDriver |
| 서비스 접근 API | DriverManager.getConnection |
| 서비스 제공자 인터페이스 | Driver |

* 자바 5부터는 java.util.ServiceLoader라는 범용 서비스 제공자 프레임워크가 제공 (실제 자바 6 부터 제공 오역)
* **상속을 하려면 public이나 protected 생성자가 필요하니 정적 팩터리 메서드만 제공하면 하위 클래스를 만들 수 없다.**
* **두 번째, 정적 팩터리 메서드는 프로그래머가 찾기 어렵다.**

### 아이템 2. 생성자에 매개변수가 많다면 빌더를 고려하라

* 점층적 생성자 패턴(telescoping constructor pattern)
  * 매개변수 개수가 많아지면 클라이언트 코드를 작성하거나 읽기 어렵다.
* 자바빈즈 패턴(JavaBeans pattern)
  * 매개변수가 없는 생성자로 객체를 만든 후, 세터(setter) 메서드들을 호출해 원하는 매개변수의 값을 설정하는 방식
  * 자바빈즈 패턴에서는 객체 하나를 만들려면 메서드를 여러 개 호출
  * 객체가 완전히 생성되기 전까지는 일관성(consistency)이 무너진 상태에 놓이게 된다.
  * 자바빈즈 패턴에서는 클래스를 불변(아이템 17)으로 만들 수 없으며 스레드 안전성을 얻으려면 프로그래머가 추가 작업
* 빌더 패턴(Builder pattern)
  * 점층적 생성자 패턴의 안전성과 자바 빈즈 패턴의 가독성을 겸비
  * 객체를 만들려면, 그에 앞서 빌더부터 만들어야 한다.
  * 빌더 생성 비용이 크지는 않지만 성능에 민감한 상황에서는 문제가 될 수 있다.

* 얼리고(freezing)?

### 아이템 3. private 생성자나 열거 타입으로 싱글턴임을 보증하라

* 클래스를 싱글턴으로 만들면 이를 사용하는 클라이언트를 테스트하기가 어려워질 수 있다.
 * Mock 이란?
 * 테스트 란?
* 싱글턴을 만드는 방식
  * public static 멤버가 final 필드인 방식
  * 정적 팩터리 메서드를 public static 멤버로 제공

## 12장 직렬화

* 객체 직렬화란 자바가 객체를 바이트 스트림 으로 인코딩하고(직렬화) 그 바이트 스트림으로부터 다시 객체를 재구성하는 (역직렬화) 메커니즘

### 아이템 85 자바 직렬화의 대안을 찾으라

* 직렬화의 근본적인 문제는 공격 범위가 너무 넓고 지속적으로 더 넓어져 방 어하기 어렵다는 점
* 바이트 스트림을 역직렬화하는 과정에서 이 메서드는 그 타입들 안의 모든 코드를 수행할 수 있음
* HashSet 인스턴스 를 역직렬화하려면 그 원소들의 해시코드를 계산
* 직렬화 위험을 회피하는 가장 좋은 방법은 아무것도 역직렬화하지 않는 것
