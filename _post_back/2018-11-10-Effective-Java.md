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
* 메서드 시그니처는 메서드 이름과 입력 매개변수(parameter)의 타입

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
  * 같은 객체가 자주 요청되는 상황 이라면 성능을 상당히 끌어올려 준다.

* **세 번째, 반환 타입의 하위 타입 객체를 반환할 수 있는 능력이 있다.**
  * 인터페이스를 정적 팩터 리 메서드의 반환 타입으로 사용하는 인터페이스 기반 프레임워크(아이템 20) 를 만드는 핵심 기술
  * 인터페이스 기반 프레임워크 ?

* **네 번째, 입력 매개변수에 따라 매번 다른 클래스의 객체를 반환할 수 있다.**

```java
public static <E extends Enum<E>> EnumSet<E> noneOf(Class<E> elementType) {
       Enum<?>[] universe = getUniverse(elementType);
       if (universe == null)
           throw new ClassCastException(elementType + " not an enum");

       if (universe.length <= 64)
           return new RegularEnumSet<>(elementType, universe);
       else
           return new JumboEnumSet<>(elementType, universe);
}
```

* **다섯 번째, 정적 팩터리 메서드를 작성하는 시점에는 반환할 객체의 클래스가 존재하지 않아도 된다.**

```java
import java.sql.*;

public class JavaDatabaseConnectivity {

	public static void main(String[] args) throws SQLException {
		// 서비스 제공자 프레임워크는 다양한 서비스 제공자들이 하나의 서비스를 구성하는 시스템
		// 4. 서비스 제공자 인터페이스 (Driver)
		Driver driver = new com.mysql.cj.jdbc.Driver();
		// 2. 제공자 등록 API (구현체를 시스템에 등록하여 클라이언트가 쓸 수 있도록 함)
		DriverManager.registerDriver(driver);
		// 1. 서비스 인터페이스 (java.sql.Connection)
    // 3. 서비스 접근 API (구현체에 대한 접근이 가능하도록 한다 DriverManager.getConnection) getConnection() '유연한 정적 팩터라'
 		Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306", null);
		Statement statement = connection.createStatement();
		statement.execute("");
	}
}
```

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
  * 자바빈즈 패턴에서는 클래스를 불변(아이템 17)으로 만들 수 없으며 스레드 안전성을 얻으려면 프로그래머가 **추가 작업(?)**
* 빌더 패턴(Builder pattern)
  * 점층적 생성자 패턴의 안전성과 자바 빈즈 패턴의 가독성을 겸비
  * 객체를 만들려면, 그에 앞서 빌더부터 만들어야 한다.
  * 빌더 생성 비용이 크지는 않지만 성능에 민감한 상황에서는 문제가 될 수 있다.
* 빌더 패턴은 (파이썬 과 스칼라에 있는) 명명된 선택적 매개변수(named optional parameters)를 흉내 낸 것이다.
* 빌더 패턴은 **계층적으로 설계된 클래스** 와 함께 쓰기에 좋다.
* 하위 클래스의 메서드가 상위 클래스의 메서드가 정의한 반환 타입이 아닌, 그 하위 타입을 반환하는 기능을 공변 반환 타이핑(covariant return typing)이라 한다.

* 얼리고(freezing)?
* self type : 명시적으로 타입이 지정된 자기 참조

### 아이템 3. private 생성자나 열거 타입으로 싱글턴임을 보증하라

* 클래스를 싱글턴으로 만들면 이를 사용하는 클라이언트를 테스트하기가 어려워질 수 있다.
 * Mock 이란?
 * 테스트 란?

```java
public class Elvis {
  public static final Elvis INSTANCE = new Elvis();
  private Elvis() { ... }
  public void leaveTheBuilding() { ... }
}
```

 ```java
public class Elvis {
  private static final Elvis INSTANCE = new Elvis(); private Elvis() { ... }
  public static Elvis getInstance() { return INSTANCE; }
  public void leaveTheBuilding() { ... }
}
 ```

* 싱글턴을 만드는 방식
  * public static 멤버가 final 필드인 방식
    * 권한이 있는 클라이언트는 리플렉션 API 인 AccessibleObject.setAccessible을 사용해 private 생성자를 호출할 수 있다.
  * 정적 팩터리 메서드를 public static 멤버로 제공
    * API를 바꾸지 않고도 싱글턴이 아니게 변경할 수 있다는 점
    * 장점은 원한다면 정적 팩터리를 제네릭 싱글턴 팩터리로 만들 수 있다는 점

## 3장 모든 객체의 공통 메서드

### 아이템 10 equals는 일반 규약을 지켜 재정의하라

* 문제를 회피하는 가장 쉬운 길은 아예 재정 의하지 않는 것
* 재정의하지 않는 예
  * 각 인스턴스가 본질적으로 고유하다.
    * 값을 표현하는 게 아니라 동작하는 개체를 표현하는 클래스, Thread
  * 인스턴스의 ‘논리적 동치성(logical equality)’(logical equality)[https://en.wikipedia.org/wiki/Logical_equality]을 검사할 일이 없다.
  * 상위 클래스에서 재정의한 equals가 하위 클래스에도 딱 들어맞는다.
  * 클래스가 private이거나 package-private이고 equals 메서드를 호출할 일이 없다.
  * 값 클래스라 해도, 값이 같은 인스턴스가 둘 이상 만들어지지 않음을 보장 하는 인스턴스 통제 클래스(아이템 1)라면 equals를 재정의하지 않아도 된다.
* 재정의하는 예
  * 객체 식별성(object identity; 두 객체가 물리적으로 같은가)이 아니라 논리적 동치성을 확인해야 하는데, 상위 클래스의 equals가 논리적 동치성을 비교하도록 재정의되지 않았을 때
  * 두 값 객체를 equals로 비교하는 프로그래머는 객체가 같은지가 아니라 값이 같은지를 알고 싶어 할 것
* Map의 키와 Set의 원소로 사용할 수 있게 된다.(?)
* 동치관계를 만족시키기 위한 다섯 요건
 * 반사성은 단순히 말하면 객체는 자기 자신과 같아야 한다는 뜻이다.
 * 대칭성은 두 객체는 서로에 대한 동치 여부에 똑같이 답해야 한다는 뜻이다.
 * 추이성은 첫 번째 객체와 두 번째 객체가 같고, 두 번째 객체와 세 번째 객체가 같다면, 첫 번째 객체와 세 번째 객체도 같아야 한다는 뜻이다.
 * 일관성은 두 객체가 같다면 (어느 하나 혹은 두 객체 모두가 수정되지 않는 한) 앞으로도 영원히 같아야 한다는 뜻이다.
* 구체 클래스를 확장해 새로운 값을 추가하면서 equals 규약을 만족시킬 방법은 존재하지 않는다.
* 리스코프 치환 원칙(Liskov substitution principle)
  **q(x)를 자료형 T의 객체 x에 대해 증명할 수 있는 속성이라 하자. 그렇다면 S가 T의 하위형이라면 q(y)는 자료형 S의 객체 y에 대해 증명할 수 있어야 한다.**
* equals의 판단에 신뢰할 수 없는 자원이 끼어 들게 해서는 안 된다.
* java.net.URL의 equals는 주어진 URL과 매핑된 호스트의 IP 주소 를 이용해 비교

```java
import java.net.URL;

// 호스트 파일 수정 후
public class IPAddressExample {
	public static void main(String args[]) throws Exception {
		URL url = new URL("http://local-alimy.choibom.com");
		URL url1 = new URL("http://localhost");
		System.out.println(url.equals(url1));
	}
}
```

* equals는 항시 메모리에 존재하는 객체만을 사용한 결정적(deterministic) 계산만 수행(?)
* null-아님은 이름처럼 모든 객체가 null과 같지 않아야 한다는 뜻

### 아이템 11 equals를 재정의하려거든 hashCode도 재정의하라
* equals를 재정의한 클래스 모두에서 hashCode도 재정의해야 한다.
* 참조 타입 필드면서 이 클래스의 equals 메서드가 이 필드의 equals 를 재귀적으로 호출해 비교한다면, 이 필드의 hashCode를 재귀적으로 호출한다.(?)
* 성능을 높인답시고 해시코드를 계산할 때 핵심 필드를 생략해서는 안 된다.

### 아이템 12 toString을 항상 재정의하라
* 간결하면서 사람이 읽기 쉬운 형태의 유익한 정보
* toString을 잘 구현한 클래스는 사용하기에 훨씬 즐겁고, 그 클래스를 사용한 시스템은 디버깅하기 쉽다.
* 실전에서 toString은 그 객체가 가진 주요 정보 모두를 반환하는 게 좋다.
* 포맷을 명시하든 아니든 여러분의 의도는 명확히 밝혀야 한다.
* toString이 반환한 값에 포함된 정보를 얻어올 수 있는 API를 제공하자.

### 아이템 13 clone 재정의는 주의해서 진행하라
* Cloneable을 구현한 스레드 안전 클래스를 작성할 때는 clone 메서드 역시 적절히 동기화해줘야 한다.

### 아이템 14 Comparable을 구현할지 고려하라

## 4장 클래스와 인터페이스

### 아이템 15 클래스와 멤버의 접근 권한을 최소화하
**정보 은닉, 혹은 캡슐화라고 하는 이 개념은 소프트웨어 설계의 근간이 되는 원리다.**

### 아이템 20 추상 클래스보다는 인터페이스를 우선하라
* 두 메커니즘 모두 인스턴스 메서드를 구현 형태 로 제공할 수 있다.
* 둘의 가장 큰 차이는 추상 클래스가 정의한 타입을 구 현하는 클래스는 반드시 추상 클래스의 하위 클래스가 되어야 한다는 점이다.
* 자바 플랫폼에서도 Comparable(Josh Bloch, 1.2), Iterable, AutoCloseable (Josh Bloch, 1.7) 인터페이스가 새로 추가됐을 때 표준 라이브러리의 수많은 기 존 클래스가 이 인터페이스들을 구현한 채 릴리스됐다.

## 12장 직렬화

* 객체 직렬화란 자바가 객체를 바이트 스트림 으로 인코딩하고(직렬화) 그 바이트 스트림으로부터 다시 객체를 재구성하는 (역직렬화) 메커니즘

### 아이템 85 자바 직렬화의 대안을 찾으라

* 직렬화의 근본적인 문제는 공격 범위가 너무 넓고 지속적으로 더 넓어져 방 어하기 어렵다는 점
* 바이트 스트림을 역직렬화하는 과정에서 이 메서드는 그 타입들 안의 모든 코드를 수행할 수 있음
* HashSet 인스턴스 를 역직렬화하려면 그 원소들의 해시코드를 계산
* 직렬화 위험을 회피하는 가장 좋은 방법은 아무것도 역직렬화하지 않는 것
* 직렬화를 피할 수 없고 역직렬화한 데이터가 안전한지 완전히 확신할 수 없 다면 객체 역직렬화 필터링(java.io.ObjectInputFilter)을 사용하자
* 블랙리스트 방식보다는 화이트리스트 방식을 추천한다.
