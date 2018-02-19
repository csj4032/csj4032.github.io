---
title: Java Developer Interview
description: 자바 개발자 기술 면접 정리
categories:
 - Interviwe
tags:
 - java, os, network, database
---

# OS

## 쓰레드와 프로세스의 차이
* 프로세스와 쓰레드는 서로 관계가 있으나 기본적으로는 다름
* 프로세스는 실행되고 있는 프로그램 개체
* **프로세스는 CPU 시간이나 메모리 등이 시스템 자원이 할당되는 독립적인 객체**
* 각 프로세스는 별도의 주소 공간에서 실행되며, 한 프로세스는 다른 프로세스의 변수나 자료구조에 접근 할 수 없음
* 어떤 프로세스는 다른 프로세스의 자원을 접근하려면 프로세스 간 통신(IPC)을 사용하여야 함
* 프로세스간 통신 방법으로는 파이프나 파일, 소켓 등이 있음
* 쓰레드는 프로세스와 같은 스택 공간을 사용하며, 여러 쓰레드는 그 상태의 일부를 서로 공유
* 통상 같은 메모리를 읽고 쓰는 여러 프로세스를 생성 할 수 있음
* 프로세스가 다른 프로세스의 메모리를 읽고 쓰는 여러 프로세스를 생성 할 수 있음
* 프로세스가 다른 프로세스의 메모리를 직접적으로 접근할 수 없는 것과는 다름
* 각각의 쓰레드에는 별도의 레지스터와 스택이 배정
* 다른 쓰레드가 해당 스택 메모리를 읽고 쓰는 것은 허용
* 쓰레드는 프로세스의 특정한 수행 경로
* 한 쓰레드가 프로세스 자원을 변경하면, 다른 이웃 쓰레드도 그 변경 결과를 즉시 볼 수 있음

# Java

## 자료형

* 논리형 : true, false 중 하나를 값으로 갖으며, 조건식과 논리적 계산에 사용
  * boolean : 1byte (false, true)
* 문자형 : 문자를 저장하는데 사용되며, 변수 당 하나의 문자만을 저장할 수 있음
  * char : 2byte (u0000~uffff, 0~2^16)
* 정수형 : 정수 값을 저장하는 데 사용된다 주로 사용되는 것은 int, long
  * byte : 1byte (-128 ~ 127, -2^7~2^7)
  * short : 2byte (-32768 ~ 32767, -2^15~2^15-1)
  * int : 4byte (-2147483648 ~ 2147483647, -2^31~2^31-1)
  * long : 8byte (-9223372036854775808 ~ 9223372036854775807, -2^63~2^63-1)
* 실수형 : 실수 값을 저장하는데 사용됨 float, double
  * float : 4byte
  * double : 8byte

## 접근제어자

* 종류
  * default : 같은 패키지(폴더)에 있는 객체들만 허용
  * public : 모든 접근을 허용
  * private : 현재 객체 내에서만 허용
  * protected : 같은 패키지(폴더)에 있는 객체와 상속관계의 객체들만 허용

* 사용
  * 클래스 : public, default
  * 생성자 : public, protected, default, private
  * 멤버변수 : public, protected, default, private
  * 멤버메소드 : public, protected, default, private
  * 지역변수 : 접근제한자 사용 불허

## Overloading VS Overriding
* Overloading
  * 클래스의 메서드끼리 이름은 같은데 매개변수가 다르며 메서드 오버로딩이 일어남
  * 메서드를 호출할 때 어떤 메서드를 사용하지는 컴파일 할 때 결정
* Overriding
  * 자식 클래스에 있는 인스턴스 메서드가 부모 클래스의 접근 가능한 메서드와 동일한 이름과 매개변수를 가지면 오버라이딩 함
  * 오버라이딩 되면 **동적 디스패치**가 가능해짐
  * 오버라이딩은 객체 지향 프로그램밍의 가장 핵심이 되는 기능

## Dynamic dispatch VS Static dispatch
* Dynamic dispatch
  * 컴퓨터 과학에서 동적 디스패치는 런타임에 호출 할 다형성 작업 (메서드 또는 함수)의 구현을 선택하는 프로세스입니다. 이것은 일반적으로 OOP (Object-Oriented Programming) 언어 및 시스템에 사용되며 그 주요한 특성으로 간주됩니다.

```java

public class Dispatch{
  static abstract class Service{
    abstract void run();
  }
  static class MyService1 extends Service{
     @Override
     void run(){
       System.out.println("run1");
     }
  }
  static class MyService1 extends Service{
     @Override
     void run(){
       System.out.println("run2");
     }
  }
 
  public static void main(String[] args){
    MyService1 svc = new MyService1();
    svc.run(); //run1 - 정적 디스패치
    MyService2 svc2 = new MyService2();
    svc2.run(); //run2 - 정적 디스패치
    //동적디스패치
    Service svc3 = new MyService1();
    svc.run(); //run1 - 리시버파라메터(this)를 활용하면 메소드를 찾아냄
    //--------------------------------------
    List<Service> svc = Array.asList(new MyService1(), new MyService2());
    svc.forEach((Service s) -> s.run());
    svc.forEach(s -> s.run()); //인자의 타입추론메소드타입추론
    svc.forEach(Service::run); //Service::run으로 추론처리
  }
}

```

* Static dispatch
  * 컴퓨팅에서 정적 디스패치는 컴파일 시간 동안 완전히 해결 된 다형성의 한 형태입니다.

```java

public class Dispatch{
  static class Service{
    void run(){
      System.out.println("run()");
    }
    void run(int number){
      System.out.println("run(" + number + ")");
    }
    void run(String msg){
      System.out.println("run(" + msg + ")");
    }
  }
  public static void main(String[] args){
    new Service().run();
    new Service().run(1);
    new Service().run("Dispatch");
  }
}

```

## 컴파일 과정 및 실행
* 소스코드를 작성
* 컴파일러(Compiler)는 자바 소스코드를 이용하여 클래스 파일을 생성
* 컴파일 된 클래스 파일은 Java VM(Java Virtual Machine)이 인식할 수 있는 바이너리 파일
* Java VM(JVM)은 클래스 파일의 바이너리 코드를 해석하여 프로그램을 수행
* 수행 결과가 컴퓨터에 반영

## JVM

## Garbage Collector

## String, StringBuilder, StringBuffer 차이

### String
* String 클래스는 변경이 불가능한 immutable 클래스

### StringBuilder
* StringBuilder mutable 가변클래스 && 단일 스레드에서만 보장
* StringBuilder는 JDK 1.5 에서 새롭게 추가된 클래스이며, StringBuffer와 기능은 모두 같으나, synchronization(동기화) 보장하지 않기 때문에 단일 스레드에서만 안전

### StringBuffer
* StringBuffer 클래스는 변경이 가능한 mutable 클래스

### ETC
* JDK 1.4 이하에서는 String 타입은 그대로 컴파일 되지만, JDK 1.5 이후부터 성능이슈로 인해 컴파일러가 자동으로 String 타입을 StringBuilder로 치환하여 컴파일
* JDK 1.9 
  * [Evolution of Strings in Java to Compact Strings and Indify String Concatenation](https://arnaudroger.github.io/blog/2017/06/14/CompactStrings.html)

## Tread

## TreadLocal
* 스레드 내부의 값과 값을 갖고 있는 객체를 연결해 스레드 한정 기법을 적용할 수 있도록 도와주는 좀더 형식적인 방법
* ThreadLocal 클래스에는 get과 set 메소드가 있는데 호출하는 스레드마다 다른 값을 사용할 수 있도록 관리해줌
* 스레드 로컬 변수는 변경 가능한 싱글턴이나 전역 변수 등을 기반으로 설계되어 있는 구조에서 변수가 임의로 공유되는 상황을 막기 위해 사용하는 경우가 많음
* ThreadLocal 클래스는 애플리케이션 프레임원을 구현할 때 상당히 많이 사용되는 편
  * 예를 들어 J2EE 컨테이너는 EJB를 사용하는 동안 해당 스레드와 트랜잭션 컨텍스트를 연결해 관리

## Collection

### List

#### ArrayList (List)
* 내부 배열에 기반을 둔 리스트 구현
* 리스트 요소에 대한 접근이 다른 리스트 기반 클래스보다 빠름
* 요소가 삽입될 때 추가될 공간을 만들기 위해 객체를 이동시켜야 하고 삭제할 때는 삭제된 공간을 없애기 위해 요소들이 이동해야 하기 때문에 이동이 많아져 요소의 삽입과 삭제가 느림
* 멀티쓰레드에 대한 동기화 안됨

#### Vector (List)
*  멀티쓰레드에 대한 동기화

#### LinkedList (Queue, List)
* 연결된 노드들을 기반으로 구현된 리스트
* 리스트에 있는 요소를 접근하기 위해서는 링크를 통해 접근해야 하기 때문에 접근 속도가 느림
* 노드에 대한 참조만을 변경하기 떄문에 삽입, 삭제 작업이 빠름

### Set

#### TreeSet (SortedSet, NavigableSet)
* 트리 자료 구조를 기반으로 구현
* 트리 자료 구조를 가지기 때문에 요소는 정렬된 저장
* 요소에 접근하기 위해서는 반드시 링크를 통해야 하기 떄문에 접근 속도가 다른 Set 보다 느림

#### HashSet (Set)
* 해쉬 테이블 자료 구조를 기반
* 요소에 대한 정렬을 보장하지 않음
* HashSet 은 TreeSet 보다 빠른 속도의 제공하며 null 참조가 저장되는 것을 허용

#### LinkedHasSet

#### EnumSet
* 비트셋을 기반으로 구현
* 저장되는 요소들은 열거형 Set 이 생성될 때 지정한 열거형에 포함되어 있는 상수
* null 요소가 허용 안됨, null 요소를 저장하려고 하면 NullPointException

### Queue
* 요소를 특정 순서로 지정하고 검색할 수 있는 컬렉션
* AbstractQueue, ArrayBlockingQueue, ArrayDeque, ConcurrentLinkedDeque, ConcurrentLinkedQueue, DelayQueue, LinkedBlockingDeque, LinkedBlockingQueue,
* LinkedList, LinkedTransferQueue, PriorityBlockingQueue, PriorityQueue, SynchronousQueue

#### Deque
* 큐의 머리와 꼬리 부분 모두에서 삽입과 제거를 할 수 있는 더블 앤드 큐
* ArrayDeque, ConcurrentLinkedDeque, LinkedBlockingDeque, LinkedList

### Map

#### HashMap
* 해쉬 테이블 자료 구조를 기반으로 하는 맵 구현
* null 키와 값을 가진 항목을 허용하는데 항목이 저장되는 순서는 보장 하지 않음

#### HashTable
* 키와 값으로 null이 허용되지 않음
* Thread safe

#### LinkedHashMap
* 기본적으로 HashMap을 상속받아 HashMap과 매우 흡사
* Map에 있는 엔트리들의 연결 리스트를 유지되므로 입력한 순서대로 반복 가능

#### TreeMap (SortedMap)
* 이진검색트리의 형태로 키와 값의 쌍으로 이루어진 데이터를 저장
* 검색과 정렬에 적합한 컬렉션

#### Properties (HashTable)
* (String, String) 형태로 저장하는 보다 단순화된 컬렉션

#### Java HashMap은 어떻게 동작하는가?
* HashMap과 HashTable을 정의한다면, '키에 대한 해시 값을 사용하여 값을 저장하고 조회하며, 키-값 쌍의 개수에 따라 동적으로 크기가 증가하는 associate array'

# 개발방법론

## OOP

## AOP

## 디자인패턴

## SOLID

### Single Responsibility Principle : 단일책임의 원칙
* Single Responsibility Principle 란 클래스는 하나의 책임을 가져야하며 그 책임에 대한 이유로 변경되어야 한다.
* 책임 : '변경을 위한 이유', 한 클래스를 변경하기 위한 한 가지 이상의 이유를 생각할 수 있다면, 그 클래스는 한 가지 이상의 책임을 맡고 있는 것

### Open Close Principle : 개방폐쇄의 원칙
* 소프트웨어 개체(클래스, 모듈, 함수 등)는 확장에 대해 열려 있어야 하고, 수정에 대해서는 닫혀 있어야 한다.

### The Liskov Substitution Principle : 리스코브 치환의 원칙
* 서브 타입은 그것의 기반 타입으로 치환 가능해야 한다.

### Interface Segregation Principle : 인터페이스 분리의 원칙
* 클라이언트가 자신이 사용하지 않는 메소드에 의존하도록 강제되어서는 안 된다.

### Dependency Inversion Principle : 의존성역전의 원칙
* 상위 수준의 모듈은 하위 수준의 모둘에 의존해서는 안된다. 둘 모두 추상화에 의존해야 한다.
* 추상화는 구체적으로 사항에 의존해서는 안 된다. 구체적인 사항은 추상화에 의존해야 한다.

## 추상화
* 사람이 객체를 인식할 때 객체의 중요 특징을 추출해 내는데, 이 과정을 "추상화"
* 클래스를 만들 때는 구현하고자 하는 객체의 명사적인 특징만 뽑아내는 것이 아니라 객체가 가지는 동사적인 특징까지도 모두 뽑아내는 추상화 작업이 필요
* 명사적인 특징을 뽑아내는 추상화 과정을 거쳐 멤버 변수가 탄생하고, 동사적인 특징을 뽑아내는 추상화 과정을 거쳐 멤버 함수가 탄생
* 추상화 과정에서 주의해야 할 것이 있는데, 추상화 작업 시 앞으로의 확장성을 많이 고려해서 작업

## 정보은닉과 캡슐화 차이
* 정보은닉
  * 모든 객체지향 언어적 요소를 활용하여 객체에 대한 구체적인 정보를 노출시키지 않도록 하는 기법
  * 종류
    * 객체의 구체적인 타입 은닉
    * 객체의 필드 및 메소드 은닉 (캡슐화)
    * 구현 은닉 (인터페이스 및 추상 클래스 기반의 구현)
* 캡슐화
  * Don't Tell Ask 데이터를 물어보지 않고, 기능을 실행해 달라고 말하라
  * 멤버변수와 멤버함수를 모두 묶어서 하나의 단위 (클래스, 객체)로 만드는 일련의 작업
  * 클래스의 내부가 바뀌어도 클래스를 참조하는 다른 클래스나 함수는 변경할 필요가 없음
  * 외부에서 직접 접근을 하면 안되고 오로지 함수를 통해서만 접근
  * 객체는 속성과 메소드로 만들짐 , 일부 속성과 메소드는 객체의 외부에서 접근 (interface) ,다른 속성,메소드는 객체 자신만의 사적인 용도로 예약되어 있고 이것을 구현 implement

* 데미테르의 법칙
  * 메서드에서 생성한 객체의 메서드만 호출
  * 파라미터로 받은 객체의 메서드만 호출
  * 필드로 참조하는 객체의 메서드만 호출

# Database

# Network

## HTTP와 HTTPS 차이 및 S가 보호하는 OSI7계층 위치
* HTTP : 인터넷에서 하이퍼텍스트(hypertext) 문서를 교환하기 위하여 사용되는 통신규약이다. 하이퍼텍스트는 문서 중간중간에 특정 키워드를 두고 문자나 그림을 상호 유기적으로 결합하여 연결시킴으로써, 서로 다른 문서라 할지라도 하나의 문서인 것처럼 보이면서 참조하기 쉽도록 하는 방식을 의미
* HTTPS : 인터넷 상에서 정보를 암호화하는 SSL(Secure Socket Layer) 프로토콜을 이용하여 데이터를 전송하고 있다는 것을 의미
* HTTPS OSI7 계층 위치 : 5계층 (Session) FIFO(파이프), 넷바이오스, SAP, SDP, SSL, TLS

## TCP UDP 차이

## REST API

## TCP 3-WAY HAND SHAKING
* TCP/IP 프로토콜을 이용해서 통신을 하는 응용프로그램이 데이터를 전송하기 전에 먼저 정확한 전송을 보장하기 위해 상대방 컴퓨터와 사전에 세션을 수립하는 과정을 의미
* 양쪽 모두 데이타를 전송할 준비가 되었다는 것을 보장하고, 실제로 데이타 전달이 시작하기전에 한쪽이 다른 쪽이 준비되었다는 것을 알수 있도록 함
* 양쪽 모두 상대편에 대한 초기 순차일련변호를 얻을 수 있도록 함
* 과정
  * A클라이언트는 B서버에 접속을 요청하는 SYN 패킷을 보낸다. 이때 A클라이언트는 SYN 을 보내고 SYN/ACK 응답을 기다리는SYN_SENT 상태가 되는 것이다.
  * B서버는 SYN요청을 받고 A클라이언트에게 요청을 수락한다는 ACK 와 SYN flag 가 설정된 패킷을 발송하고 A가 다시 ACK으로 응답하기를 기다린다. 이때 B서버는 SYN_RECEIVED 상태가 된다.
  * A클라이언트는 B서버에게 ACK을 보내고 이후로부터는 연결이 이루어지고 데이터가 오가게 되는것이다. 이때의 B서버 상태가 ESTABLISHED 이다.

# 알고리즘, 자료구조

# Reference

* [JVM Internal](http://d2.naver.com/helloworld/1230)
* [JDBC Internal - 타임아웃의 이해](http://d2.naver.com/helloworld/1321)
* [Java Garbage Collection](http://d2.naver.com/helloworld/1329)
* [Garbage Collection 모니터링 방법](http://d2.naver.com/helloworld/6043)
* [스레드 덤프 분석하기](http://d2.naver.com/helloworld/10963)
* [Garbage Collection 튜닝](http://d2.naver.com/helloworld/37111)
* [자바 애플리케이션 성능 튜닝의 도(道)](http://d2.naver.com/helloworld/184615)
* [Java Reference와 GC](http://d2.naver.com/helloworld/329631)
* [하나의 메모리 누수를 잡기까지](http://d2.naver.com/helloworld/1326256)
* [Spring - IoC & DI](http://isstory83.tistory.com/m/91)
* [캡슐화 (Encapsulation)](http://javacan.tistory.com/entry/EncapsulationExcerprtFromJavaBook)
* [객체지향의 올바른 이해 : 5. 정보 은닉(information hiding)](http://effectiveprogramming.tistory.com/entry/%EA%B0%9D%EC%B2%B4%EC%A7%80%ED%96%A5-%EC%A0%95%EB%B3%B4-%EC%9D%80%EB%8B%89information-hiding%EC%97%90-%EB%8C%80%ED%95%9C-%EC%98%AC%EB%B0%94%EB%A5%B8-%EC%9D%B4%ED%95%B4?category=660012)