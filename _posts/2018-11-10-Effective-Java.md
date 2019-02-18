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
