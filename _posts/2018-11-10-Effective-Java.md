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
