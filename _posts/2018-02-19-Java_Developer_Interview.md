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

## final, finally, finalize()
* final
  * 원시 변수에 적용하면 : 해당 변수의 값은 변경이 불가능
  * 참조 변수에 적용하면 : 참조 변수가 힙 내의 다른 객체를 가리키도록 변경할 수 없음
  * 메서드에 적용하면 : 해당 메서드를 오버라이드할 수 없음
  * 클래스에 적용하면 : 해당 클래스의 하위 클래스를 정의할 수 없음
* finally
  * finally는 선택적으로 try 혹은 catch블록 뒤에 정의할 때 사용
  * finally 블록은 예외가 발생하더라도 항상 실행
  * finally 블록은 try와 catch 블록 다음과, 통제권이 이전으로 다시 돌아가기 전 사이에 실행
* finalize()
  * 가비지 컬렉터가 객체를 해제하기 전에 호출하는 메서드

## Overloading VS Overriding
* Overloading
  * 클래스의 메서드끼리 이름은 같은데 매개변수가 다르며 메서드 오버로딩이 일어남
  * 메서드를 호출할 때 어떤 메서드를 사용하지는 컴파일 할 때 결정
* Overriding
  * 자식 클래스에 있는 인스턴스 메서드가 부모 클래스의 접근 가능한 메서드와 동일한 이름과 매개변수를 가지면 오버라이딩 함
  * 오버라이딩 되면 **동적 디스패치** 가 가능해짐
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
  static class MyService2 extends Service{
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

## 하이딩

```java

class Base {
  public String className = "Base";
}

class Derived extends Base {
  private String className = "Derived";
}

public class PrivateMatter {
  public static void main(String[] args) {
    System.out.println(new Derived().className);  
  }
}

```

## 컴파일 과정 및 실행
* 소스코드를 작성
* 컴파일러(Compiler)는 자바 소스코드를 이용하여 클래스 파일을 생성
* 컴파일 된 클래스 파일은 Java VM(Java Virtual Machine)이 인식할 수 있는 바이너리 파일
* Java VM(JVM)은 클래스 파일의 바이너리 코드를 해석하여 프로그램을 수행
* 수행 결과가 컴퓨터에 반영

## JVM Internal

* 가상 머신(virtual machine)이란 여러 가지로 정의할 수 있지만, 프로그램을 실행하기 위해 물리적 머신(즉, 컴퓨터)과 유사한 머신을 소프트웨어로 구현한 것을 말한다고 할 수 있다.
* 지금은 비록 빛이 바랜 목표이긴 하나 자바는 원래 WORA(Write Once Run Anywhere)를 구현하기 위해 물리적인 머신과 별개의 가상 머신을 기반으로 동작하도록 설계되었다.
* 자바 바이트코드를 실행하고자 하는 모든 하드웨어에 JVM을 동작시킴으로써 자바 실행 코드를 변경하지 않고도 모든 종류의 하드웨어에서 동작되게 한 것

### 가상 머신

#### JVM의 특징

* 스택 기반의 가상 머신: 대표적인 컴퓨터 아키텍처인 인텔 x86 아키텍처나 ARM 아키텍처와 같은 하드웨어가 레지스터 기반으로 동작하는 데 비해 JVM은 스택 기반으로 동작
* 심볼릭 레퍼런스: 기본 자료형(primitive data type)을 제외한 모든 타입(클래스와 인터페이스)을 명시적인 메모리 주소 기반의 레퍼런스가 아니라 심볼릭 레퍼런스를 통해 참조
* 가비지 컬렉션(garbage collection): 클래스 인스턴스는 사용자 코드에 의해 명시적으로 생성되고 가비지 컬렉션에 의해 자동으로 파괴
* 기본 자료형을 명확하게 정의하여 플랫폼 독립성 보장: C/C++ 등의 전통적인 언어는 플랫폼에 따라 int 형의 크기가 변한다. JVM은 기본 자료형을 명확하게 정의하여 호환성을 유지하고 플랫폼 독립성을 보장
* 네트워크 바이트 오더(network byte order): 자바 클래스 파일은 네트워크 바이트 오더를 사용한다.
  * 인텔 x86 아키텍처가 사용하는 리틀 엔디안이나, RISC 계열 아키텍처가 주로 사용하는 빅 엔디안 사이에서 플랫폼 독립성을 유지하려면 고정된 바이트 오더를 유지해야 하므로 네트워크 전송 시에 사용하는 바이트 오더인 네트워크 바이트 오더를 사용한다.
  * 네트워크 바이트 오더는 빅 엔디안이다.
  * 오라클 핫스팟 JVM 외에도 IBM JVM을 비롯한 다양한 JVM이 존재

#### 자바 바이트코드
* WORA를 구현하기 위해 JVM은 사용자 언어인 자바와 기계어 사이의 중간 언어인 자바 바이트코드를 사용한다.
* 이 자바 바이트코드가 자바 코드를 배포하는 가장 작은 단위

#### JVM 구조

![JVM 구조](http://d2.naver.com/content/images/2015/06/helloworld-1230-1.png)

* 자바로 작성한 코드는 클래스 로더(Class Loader)가 컴파일된 자바 바이트코드를 런타임 데이터 영역(Runtime Data Areas)에 로드하고, 실행 엔진(Execution Engine)이 자바 바이트코드를 실행

#### 클래스 로더
  * 자바는 동적 로드, 즉 컴파일타임이 아니라 런타임에 클래스를 처음으로 참조할 때 해당 클래스를 로드하고 링크하는 특징이 있다. 이 동적 로드를 담당하는 부분이 JVM의 클래스 로더
  * 각 클래스 로더는 로드된 클래스들을 보관하는 네임스페이스(namespace)를 가짐 
  * 클래스를 로드할 때 이미 로드된 클래스인지 확인하기 위해서 네임스페이스에 보관된 FQCN(Fully Qualified Class Name)을 기준으로 클래스를 찾음
  * 비록 FQCN이 같더라도 네임스페이스가 다르면, 즉 다른 클래스 로더가 로드한 클래스이면 다른 클래스로 간주
  * 클래스 로더가 클래스 로드를 요청받으면, 클래스 로더 캐시, 상위 클래스 로더, 자기 자신의 순서로 해당 클래스가 있는지 확인 (즉, 이전에 로드된 클래스인지 클래스 로더 캐시를 확인하고, 없으면 상위 클래스 로더를 거슬러 올라가며 확인)
  * 부트스트랩 클래스 로더까지 확인해도 없으면 요청받은 클래스 로더가 파일 시스템에서 해당 클래스를 찾음

#### 클래스 로더 특징
* 계층 구조
  * 클래스 로더끼리 부모-자식 관계를 이루어 계층 구조로 생성 
  * 최상위 클래스 로더는 부트스트랩 클래스 로더(Bootstrap Class Loader)
* 위임 모델 
  * 계층 구조를 바탕으로 클래스 로더끼리 로드를 위임하는 구조로 동작 
  * 클래스를 로드할 때 먼저 상위 클래스 로더를 확인하여 상위 클래스 로더에 있다면 해당 클래스를 사용하고, 없다면 로드를 요청받은 클래스 로더가 클래스를 로드
* 가시성(visibility) 제한
  * 하위 클래스 로더는 상위 클래스 로더의 클래스를 찾을 수 있지만, 상위 클래스 로더는 하위 클래스 로더의 클래스를 찾을 수 없음
* 언로드 불가 
  * 클래스 로더는 클래스를 로드할 수는 있지만 언로드할 수는 없음 
  * 언로드 대신, 현재 클래스 로더를 삭제하고 아예 새로운 클래스 로더를 생성하는 방법을 사용할 수 있음

![클래스 로더 위임 모델](http://d2.naver.com/content/images/2015/06/helloworld-1230-2.png)

#### 클래스 로더 위임 모델
* 부트스트랩 클래스 로더: 
  * JVM을 기동할 때 생성되며, Object 클래스들을 비롯하여 자바 API들을 로드 
  * 다른 클래스 로더와 달리 자바가 아니라 네이티브 코드로 구현
  * the runtime classes in rt.jar, internationalization classes in i18n.jar, and others.
* 익스텐션 클래스 로더(Extension Class Loader)
  * 기본 자바 API를 제외한 확장 클래스들을 로드 다양한 보안 확장 기능 등을 여기에서 로드
  * classes in JAR files in the lib/ext directory of the JRE, and in the system-wide, platform-specific extension directory
* 시스템 클래스 로더(System Class Loader)
  * 부트스트랩 클래스 로더와 익스텐션 클래스 로더가 JVM 자체의 구성 요소들을 로드하는 것이라 한다면, 시스템 클래스 로더는 애플리케이션의 클래스들을 로드한다고 할 수 있음
  * loads files found in the classpath environment variable, -classpath or -cp command line option
* 사용자가 지정한 $CLASSPATH 내의 클래스들을 로드
* 사용자 정의 클래스 로더(User-Defined Class Loader): 애플리케이션 사용자가 직접 코드 상에서 생성해서 사용하는 클래스 로더
* 웹 애플리케이션 서버(WAS)와 같은 프레임워크는 웹 애플리케이션들, 엔터프라이즈 애플리케이션들이 서로 독립적으로 동작하게 하기 위해 사용자 정의 클래스 로더를 사용 (클래스 로더의 위임 모델을 통해 애플리케이션의 독립성을 보장)
* WAS의 클래스 로더 구조는 WAS 벤더마다 조금씩 다른 형태의 계층 구조를 사용

#### Run-Time Built-in Class Loaders (JDK 9+)
* Application class loader
  * 애플리케이션 클래스 로더는 일반적으로 애플리케이션 클래스 경로에서 클래스를 정의하는 데 사용됩니다. 도구 또는 내보내기 도구 API를 제공하는 JDK 모듈의 기본 로더입니다.
* Platform class loader
  * Java SE 및 JDK 모듈에서 선택 (보안 / 권한 기반)합니다. 예 : java.sql
* Bootstrap class loader
  * 핵심 Java SE 및 JDK 모듈을 정의합니다.


![클래스 로드 단계](http://d2.naver.com/content/images/2015/06/helloworld-1230-3.png)

* 로드(Loading)
  * 클래스를 파일에서 가져와서 JVM의 메모리에 로드
* Linking
  * 검증(Verifying)
    * 가져온 유형의 정확성 보장
    * 읽어 들인 클래스가 자바 언어 명세(Java Language Specification) 및 JVM 명세에 명시된 대로 잘 구성되어 있는지 검사 클래스 로드의 전 과정 중에서 가장 까다로운 검사를 수행하는 과정으로서 가장 복잡하고 시간이 많이 걸림
    * JVM TCK의 테스트 케이스 중에서 가장 많은 부분이 잘못된 클래스를 로드하여 정상적으로 검증 오류를 발생시키는지 테스트하는 부분
  * 준비(Preparing)
    * 클래스가 필요로 하는 메모리를 할당하고, 클래스에서 정의된 필드, 메서드, 인터페이스들을 나타내는 데이터 구조를 준비
  * 분석(Resolving)
    * 클래스의 상수 풀 내 모든 심볼릭 레퍼런스를 다이렉트 레퍼런스로 변경
* 초기화(Initialization)
  * 클래스 변수들을 적절한 값으로 초기화
  * static initializer들을 수행하고, static 필드들을 설정된 값으로 초기화

#### 런타임 데이터 영역
* 런타임 데이터 영역은 JVM이라는 프로그램이 운영체제 위에서 실행되면서 할당받는 메모리 영역
* 런타임 데이터 영역은 6개의 영역으로 나눌 수 있다.

![런타임 데이터 영역](http://d2.naver.com/content/images/2015/06/helloworld-1230-4.png)

* PC 레지스터(The PC Register)
  * PC(Program Counter) 레지스터는 각 스레드마다 하나씩 존재하며 스레드가 시작될 때 생성 
  * PC 레지스터는 현재 수행 중인 JVM 명령의 주소를 가짐

![JVM 스택 구성](http://d2.naver.com/content/images/2015/06/helloworld-1230-5.png)

* JVM 스택(Java Virtual Machine Stacks)
  * JVM 스택은 각 스레드마다 하나씩 존재하며 스레드가 시작될 때 생성
  * 스택 프레임(Stack Frame)이라는 구조체를 저장하는 스택
  * JVM은 오직 JVM 스택에 스택 프레임을 추가하고(push) 제거하는(pop) 동작만 수행
  * 예외 발생 시 printStackTrace() 등의 메서드로 보여주는 Stack Trace의 각 라인은 하나의 스택 프레임을 표현
    * 스택 프레임
      * JVM 내에서 메서드가 수행될 때마다 하나의 스택 프레임이 생성되어 해당 스레드의 JVM 스택에 추가되고 메서드가 종료되면 스택 프레임이 제거 
      * 각 스택 프레임은 지역 변수 배열(Local Variable Array), 피연산자 스택(Operand Stack), 현재 실행 중인 메서드가 속한 클래스의 런타임 상수 풀에 대한 레퍼런스를 가짐
      * 지역 변수 배열, 피연산자 스택의 크기는 컴파일 시에 결정되기 때문에 스택 프레임의 크기도 메서드에 따라 크기가 고정
      * 스레드에 의해 생성 된 프레임은 해당 스레드에 국한되며 다른 스레드에서 참조 할 수 없음
      * 지역 변수 배열 (Local Variables)
        * 0부터 시작하는 인덱스를 가진 배열
        * 0은 메서드가 속한 클래스 인스턴스의 this 레퍼런스이고, 1부터는 메서드에 전달된 파라미터들이 저장되며, 메서드 파라미터 이후에는 메서드의 지역 변수들이 저장
      * 피연산자 스택(Operand Stacks)
        * 메서드의 실제 작업 공간 
        * 각 메서드는 피연산자 스택과 지역 변수 배열 사이에서 데이터를 교환하고, 다른 메서드 호출 결과를 추가하거나(push) 꺼낸다(pop) 
        * 피연산자 스택(LIFO) 공간이 얼마나 필요한지는 컴파일할 때 결정할 수 있으므로, 피연산자 스택의 크기도 컴파일 시에 결정 [참고](https://docs.oracle.com/javase/specs/jvms/se15/html/jvms-2.html#jvms-2.5)
      * Dynamic Linking
        * 각 프레임에는 메서드 코드의 동적 연결을 지원하기 위해 현재 메서드 유형에 대한 런타임 상수 풀에 대한 참조가 포함
        * 메서드의 클래스 파일 코드는 호출 할 메서드와 기호 참조를 통해 액세스 할 변수를 나타냄
      * Normal Method Invocation Completion
      * Abrupt Method Invocation Completion
* Heap
  * JVM 성능 등의 이슈에서 가장 많이 언급되는 공간
  * Java Virtual Machine에는 모든 Java Virtual Machine 스레드간에 공유 
  * 힙은 모든 클래스 인스턴스 및 배열에 대한 메모리가 할당되는 런타임 데이터 영역
  * 힙은 가상 머신 시작시 생성
  * 개체에 대한 힙 저장소는 자동 저장소 관리 시스템 (가비지컬렉터)에 의해 회수
  * Java Virtual Machine은 특정 유형의 자동 스토리지 관리 시스템을 가정하지 않으며 스토리지 관리 기술은 구현 자의 시스템 요구 사항에 따라 선택할 수 있음
* 메서드 영역(Method Area)
  * 메서드 영역은 모든 스레드가 공유하는 영역으로 JVM이 시작될 때 생성 
  * JVM이 읽어 들인 각각의 클래스와 인터페이스에 대한 런타임 상수 풀, 필드와 메서드 정보, Static 변수, 메서드의 바이트코드 등을 보관 
  * 메서드 영역은 JVM 벤더마다 다양한 형태로 구현할 수 있으며, 오라클 핫스팟 JVM(HotSpot JVM)에서는 흔히 Permanent Area, 혹은 Permanent Generation(PermGen)이라고 불림 
  * 메서드 영역에 대한 가비지 컬렉션은 JVM 벤더의 선택 사항
* 런타임 상수 풀(Runtime Constant Pool)
  * 클래스 파일 포맷에서 constant_pool 테이블에 해당하는 영역 
  * 메서드 영역에 포함되는 영역이긴 하지만, JVM 동작에서 가장 핵심적인 역할을 수행하는 곳이기 때문에 JVM 명세에서도 따로 중요하게 기술 
  * 각 클래스와 인터페이스의 상수뿐만 아니라, 메서드와 필드에 대한 모든 레퍼런스까지 담고 있는 테이블 
  * 메서드나 필드를 참조할 때 JVM은 런타임 상수 풀을 통해 해당 메서드나 필드의 실제 메모리상 주소를 찾아서 참조
* Native Method Stacks
  * 자바 외의 언어로 작성된 네이티브 코드를 위한 스택 
  * JNI(Java Native Interface)를 통해 호출하는 C/C++ 등의 코드를 수행하기 위한 스택 
  * 언어에 맞게 C 스택이나 C++ 스택이 생성

#### 실행 엔진
* 클래스 로더를 통해 JVM 내의 런타임 데이터 영역에 배치된 바이트코드는 실행 엔진에 의해 실행
* 실행 엔진은 자바 바이트코드를 명령어 단위로 읽어서 실행한다. CPU가 기계 명령어을 하나씩 실행하는 것과 비슷
* 바이트코드의 각 명령어는 1바이트짜리 OpCode와 추가 피연산자로 이루어져 있으며, 실행 엔진은 하나의 OpCode를 가져와서 피연산자와 함께 작업을 수행한 다음, 다음 OpCode를 수행하는 식으로 동작
* 자바 바이트코드는 기계가 바로 수행할 수 있는 언어보다는 비교적 인간이 보기 편한 형태로 기술
* 실행 엔진은 이와 같은 바이트코드를 실제로 JVM 내부에서 기계가 실행할 수 있는 형태로 변경
* 인터프리터
  * 바이트코드 명령어를 하나씩 읽어서 해석하고 실행 
  * 하나씩 해석하고 실행하기 때문에 바이트코드 하나하나의 해석은 빠른 대신 인터프리팅 결과의 실행은 느리다는 단점을 가지고 있음 흔히 얘기하는 인터프리터 언어의 단점을 그대로 가지는 것이다. 
  * 바이트코드라는 '언어'는 기본적으로 인터프리터 방식으로 동작
* JIT(Just-In-Time) 컴파일러: 인터프리터의 단점을 보완하기 위해 도입된 것이 JIT 컴파일러이다.
  * 인터프리터 방식으로 실행하다가 적절한 시점에 바이트코드 전체를 컴파일하여 네이티브 코드로 변경하고, 이후에는 해당 메서드를 더 이상 인터프리팅하지 않고 네이티브 코드로 직접 실행하는 방식
  * 네이티브 코드를 실행하는 것이 하나씩 인터프리팅하는 것보다 빠르고, 네이티브 코드는 캐시에 보관하기 때문에 한 번 컴파일된 코드는 계속 빠르게 수행
* JIT 컴파일러가 컴파일하는 과정은 바이트코드를 하나씩 인터프리팅하는 것보다 훨씬 오래 걸리므로, 만약 한 번만 실행되는 코드라면 컴파일하지 않고 인터프리팅하는 것이 훨씬 유리
* JIT 컴파일러를 사용하는 JVM들은 내부적으로 해당 메서드가 얼마나 자주 수행되는지 체크하고, 일정 정도를 넘을 때에만 컴파일을 수행

![자바 컴파일러와 JIT  컴파일러](http://d2.naver.com/content/images/2015/06/helloworld-1230-7.png)

** 실행 엔진이 어떻게 동작하는지는 JVM 명세에 규정되지 않았다. 따라서 JVM 벤더들은 다양한 기법으로 실행 엔진을 향상시키고 다양한 방식의 JIT 컴파일러를 도입

![JIT 컴파일러](http://d2.naver.com/content/images/2015/06/helloworld-1230-8.png)

* JIT 컴파일러는 바이트코드를 일단 중간 단계의 표현인 IR(Intermediate Representation)로 변환하여 최적화를 수행하고 그 다음에 네이티브 코드를 생성
* 오라클 핫스팟 VM은 핫스팟 컴파일러라고 불리는 JIT 컴파일러를 사용
* 핫스팟이라 불리는 이유는 내부적으로 프로파일링을 통해 가장 컴파일이 필요한 부분, 즉 '핫스팟'을 찾아낸 다음, 이 핫스팟을 네이티브 코드로 컴파일하기 때문
* 핫스팟 VM은 한번 컴파일된 바이트코드라도 해당 메서드가 더 이상 자주 불리지 않는다면, 즉 핫스팟이 아니게 된다면 캐시에서 네이티브 코드를 덜어내고 다시 인터프리터 모드로 동작
* 핫스팟 VM은 서버 VM과 클라이언트 VM으로 나뉘어 있고, 각각 다른 JIT 컴파일러를 사용

![핫스팟 클라이언트 VM과 서버 VM](http://d2.naver.com/content/images/2015/06/helloworld-1230-9.png)

* 클라이언트 VM과 서버 VM은 각각 오라클 핫스팟 VM을 실행할 때 입력하는 -client, -server 옵션으로 실행
* 클라이언트 VM과 서버 VM은 동일한 런타임을 사용하지만 다른 JIT 컴파일러(Simple Compiler)를 사용
* 서버 VM에서 사용하는 Advanced Dynamic Optimizing Compiler가 더 복잡하고 다양한 성능 최적화 기법을 사용
* IBM JVM은 JIT 컴파일러뿐만 아니라 IBM JDK 6부터 AOT(Ahead-Of-Time) 컴파일러라는 기능을 도입
  * 한번 컴파일된 네이티브 코드를 여러 JVM이 공유 캐시를 통해 공유해서 사용하는 것을 의미
  * AOT 컴파일러를 통해 이미 컴파일된 코드는 다른 JVM에서도 컴파일하지 않고 사용할 수 있게 하는 것
  * 아예 AOT 컴파일러를 이용하여 JXE(Java Executable)라는 파일 포맷으로 프리컴파일(pre-compile)된 코드를 작성하여 빠르게 실행하는 방법도 제공
* 오라클 핫스팟 VM은 1.3부터 핫스팟 컴파일러를 내장하기 시작하였고, 안드로이드 Dalvik VM은 안드로이드 2.2부터 JIT 컴파일러를 도입

#### The Java Virtual Machine Specification, Java SE 7 Edition
* 자바 SE 5.0부터 도입된 Generics, 가변 인자 메서드 지원
* 자바 SE 6부터 변화된 바이트코드 검증 프로세스 기술
* 동적 타입 언어 지원을 위해 invokedynamic 명령어 및 관련 클래스 파일 포맷 추가
* 자바 언어 자체의 개념에 대한 내용을 삭제하고, 자바 언어 명세에서 찾도록 유도
* 자바 Thread와 Lock에 대한 내용을 삭제하고, 자바 언어 명세로 내용을 넘김

#### String in Switch Statements
* 자바 SE 7의 새로운 기능인 String in switch는 JVM 자체가 아니라 자바 컴파일러가 처리하고 있는 것이다. 마찬가지로 다른 자바 SE 7의 새로운 기능들도 자바 컴파일러가 처리할 것이라고 유추할 수 있다.

#### Tip
* Java 메서드 크기 65535바이트 제한
* Assertion -ea 필요

## Garbage Collector
* Java에서는 개발자가 프로그램 코드로 메모리를 명시적으로 해제하지 않기 때문에 가비지 컬렉터(Garbage Collector)가 더 이상 필요 없는 객체를 찾아 지우는 작업을 함

### 가비지 컬렉션 과정 - Generational Garbage Collection
* 가비지 컬렉터는 두 가지 가설 하에 만듬
* 대부분의 객체는 금방 접근 불가능 상태(unreachable)가 됨
* 오래된 객체에서 젊은 객체로의 참조는 아주 적게 존재
* HotSpot VM에서는 크게 2개로 물리적 공간을 나눔

### Root Set 과 Garbage
* Local variable Section, Opernad Statck 에 Object의 Reference 정보가 있드면 Reachable Object
* Method Area에 로딩된 클래스 중 constant pool 에 있는 Reference 정보를 토대로 Thread 에서 직접 참조하지 않지마 constant pool을 통해 간접 link 를 하고 있는 Object는 Reachable Object
* 아직 Memory에 남아 있으며 Natice Method Area 로 넘겨진 Object의 Reference 가 JIN 형태로 참조 관계가 있는 Object는 Reachable Ojbect
* 위 3 가지 경우를 제외하면 모두 GC 대상

![영역 및 데이터 흐름도](http://d2.naver.com/content/images/2015/06/helloworld-1329-1.png)

#### Young 영역의 구성
* Eden 영역, Suvivor 영역(2개)
* 처리 절차
  * 새로 생성한 대부분의 객체는 Eden 영역에 위치한다.
  * Eden 영역에서 GC가 한 번 발생한 후 살아남은 객체는 Survivor 영역 중 하나로 이동된다.
  * Eden 영역에서 GC가 발생하면 이미 살아남은 객체가 존재하는 Survivor 영역으로 객체가 계속 쌓인다.
  * 하나의 Survivor 영역이 가득 차게 되면 그 중에서 살아남은 객체를 다른 Survivor 영역으로 이동한다. 그리고 가득 찬 Survivor 영역은 아무 데이터도 없는 상태로 된다.
  * 이 과정을 반복하다가 계속해서 살아남아 있는 객체는 Old 영역으로 이동하게 된다.

![전과 후의 비교](https://d2.naver.com/content/images/2015/06/helloworld-1329-3.png)

#### Old 영역에 대한 GC
* GC 방식은 JDK 7을 기준으로 5가지 방식
  * Serial GC (-XX:+UseSerialGC)
    * Young 영역에서의 GC는 앞 절에서 설명한 방식을 사용
    * Old 영역의 GC는 mark-sweep-compact이라는 알고리즘을 사용
      * 절차
        1. Old 영역에 살아 있는 객체를 식별(Mark)
        2. 힙(heap)의 앞 부분부터 확인하여 살아 있는 것만 남김(Sweep)
        3. 각 객체들이 연속되게 쌓이도록 힙의 가장 앞 부분부터 채워서 객체가 존재하는 부분과 객체가 없는 부분으로 나눔(Compaction).
    * Serial GC는 적은 메모리와 CPU 코어 개수가 적을 때 적합한 방식
  * Parallel GC (-XX:+UseParallelGC)
    * Parallel GC는 GC를 처리하는 쓰레드가 여러 개
    * Parallel GC는 메모리가 충분하고 코어의 개수가 많을 때 유리
    * Parallel GC는 Throughput GC라고도 부름

![Serial GC와 Parallel GC의 차이](https://d2.naver.com/content/images/2015/06/helloworld-1329-4.png)

  * Parallel Old GC(Parallel Compacting GC)
    * Parallel GC와 비교하여 Old 영역의 GC 알고리즘만 다름
    * Mark-Summary-Compaction 단계를 거침
  * Concurrent Mark & Sweep GC(이하 CMS)
    * 절차
      1. 초기 Initial Mark 단계에서는 클래스 로더에서 가장 가까운 객체 중 살아 있는 객체만 찾는 것으로 끝냄
      2. Concurrent Mark 단계에서는 방금 살아있다고 확인한 객체에서 참조하고 있는 객체들을 따라가면서 확인 (다른 스레드가 실행 중인 상태에서 동시에 진행)
      3. Remark 단계에서는 Concurrent Mark 단계에서 새로 추가되거나 참조가 끊긴 객체를 확인
      4. Concurrent Sweep 단계에서는 쓰레기를 정리하는 작업을 실행 (다른 스레드가 실행 중인 상태에서 동시에 진행)
    * 다른 GC 방식보다 메모리와 CPU를 더 많이 사용
    * Compaction 단계가 기본적으로 제공되지 않음

![Serial GC와 CMS GC](https://d2.naver.com/content/images/2015/06/helloworld-1329-5.png)

  * G1(Garbage First) GC
    * G1 GC는 바둑판의 각 영역에 객체를 할당하고 GC를 실행
    * 해당 영역이 꽉 차면 다른 영역에서 객체를 할당하고 GC를 실행
    * Young의 세가지 영역에서 데이터가 Old 영역으로 이동하는 단계가 사라진 GC 방식
    * G1 GC는 장기적으로 말도 많고 탈도 많은 CMS GC를 대체하기 위해서 만들어 짐

#### Garbage Collector 관련 옵션
* Serial Collector : client class 의 기본 collector로 한 개의 thread가 serail로 수행

| Garbage Collector | Option | Young Generation Collection 알고리즘 | Old Generation Collection 알고리즘 |
|---|---|---|---|
| Serial Collector | -XX:+UseSerialGC | Serial | Serial Mark-Sweep-Compact |
| Parallel Collector | -XX:+UseParallelGC | Parallel Scavenge | Serial Mark-Sweep-Compact |
| Parallel Compacting Collector | -XX:+UseParallelOldGC | Parallel Scavenge | Parallel Mark-Sweep-Compact |
| CMS Collector | -XX:+UseConcMarkSweepGC | Parallel | Concurrent Mark-Sweep |
| Serial Collector | -XX:+UseG1GC | Snapshot-At-The-Beginning(SATB) |

#### Java8 Metaspace
* Java8에서 JVM 메모리 구조적인 개선 사항으로 Perm 영역이 Metaspcae 영역으로 전환되고 기존 Perm 영역은 사라짐

| 구분 | 상세구분 | ~ Java 7 | Java 8 |
|---|---|---|---|
| 저장 정보 | Class의 Meta 정보 | 저장 | 저장 |
| 저장 정보 | Method의 Meta 정보 | 저장 | 저장 |
| 저장 정보 | Static Object | 저장 | 저장 |
| 관리 포인트 | 메모리 관리(튜닝) | Heap 영역 튜닝외에 Perm 영역 별로 튜닝 | Heap 영역 튜닝 Native 영역 동적 조정 (별도 옵션으로 조절 가능) |
| GC 측명 | GC 수행 대상 | Full GC 수행 대상 | Full GC 수행 대상 |
| 메모리 측명 | 메모리 크기 (옵션) | -XX:PermSize -XX:MaxPermSize  | -XX:MetaspaceSize -XX:MaxMetaspaceSize |

## String, StringBuilder, StringBuffer 차이

### String
* String 클래스는 문자열을 나타냅니다.
* Java 프로그램의 모든 문자열 리터럴 (예 : "abc")은이 클래스의 인스턴스로 구현됩니다.
* 문자열은 일정합니다.
* 해당 값은 작성된 후에는 변경할 수 없습니다.
* 문자열 버퍼는 변경 가능한 문자열을 지원합니다.
* String 객체는 변경할 수 없기 때문에 공유 할 수 있습니다.

### StringBuffer
* thread로부터 안전하고 변경 가능한 일련의 문자. 문자열 버퍼는 String과 비슷하지만 수정할 수 있습니다.
* 어느 특정 시점에 특정 문자 시퀀스가 포함되지만 시퀀스의 길이와 내용은 특정 메서드 호출을 통해 변경할 수 있습니다.

### StringBuilder
* 문자의 변경 가능한 시퀀스. 이 클래스는 StringBuffer와 호환되는 API를 제공하지만 동기화가 보장되지는 않습니다.
* 이 클래스는 문자열 버퍼가 단일 스레드에 의해 사용되는 장소에서 StringBuffer의 드롭 인 대체품으로 사용하기 위해 설계되었습니다 (일반적으로 그렇듯이).
* 가능하면 대부분의 구현에서 빠르기 때문에이 클래스를 StringBuffer보다 우선적으로 사용하는 것이 좋습니다.

### ETC
* JDK 1.4 이하에서는 String 타입은 그대로 컴파일
* JDK 1.5 이후부터 성능이슈로 인해 컴파일러가 자동으로 String 타입을 StringBuilder로 치환하여 컴파일
* JDK 1.9 [Evolution of Strings in Java to Compact Strings and Indify String Concatenation](https://arnaudroger.github.io/blog/2017/06/14/CompactStrings.html)

## Tread

## TreadLocal
* 스레드 내부의 값과 값을 갖고 있는 객체를 연결해 스레드 한정 기법을 적용할 수 있도록 도와주는 좀더 형식적인 방법
* ThreadLocal 클래스에는 get과 set 메소드가 있는데 호출하는 스레드마다 다른 값을 사용할 수 있도록 관리해줌
* 스레드 로컬 변수는 변경 가능한 싱글턴이나 전역 변수 등을 기반으로 설계되어 있는 구조에서 변수가 임의로 공유되는 상황을 막기 위해 사용하는 경우가 많음
* ThreadLocal 클래스는 애플리케이션 프레임원을 구현할 때 상당히 많이 사용되는 편
  * 예를 들어 J2EE 컨테이너는 EJB를 사용하는 동안 해당 스레드와 트랜잭션 컨텍스트를 연결해 관리

## 동기화
* Java에서는 Monitor를 이용해 Thread를 동기화
* Java 객체는 하나의 Monitor를 가짐
* Monitor는 하나의 Thread 만 소유할 수 있음

### 재진입성
* 스레드가 다른 스레드가 가진 락을 요청하면 해당 스레드는 대기 상태로 들어간다. 하지만 암묵적인 락은 재진입 가능하기 때문에 특정 스레드가 자기가 이미 획특한 락을 다시 확보할 수 있음.
* 재진입성은 확보 요청 단위가 아닌 스레드 단위로 락을 얻는다는 것을 의미

## Blocking NoBlocking
* Blocking
  * I/O가 가득 수신할 때까지 주어진 스레드가 아무것도 하지 않는다고 가정
  * 메서드가 즉시 애플리케이션 플로우로 제어를 반환하지 않으므로 애플리케이션의 플로우가 블록됨

* NonBlocking
  * I/O 요청을 즉시 큐에 넣고 애플리키에션 플로우로 제어를 반환
  * Selector [참고](https://docs.oracle.com/javase/8/docs/api/java/nio/channels/Selector.html)
    * A multiplexor of SelectableChannel objects.
  * SelectionKey
    * A token representing the registration of a SelectableChannel with a Selector.
  * SelectableChannel [참고](https://docs.oracle.com/javase/8/docs/api/java/nio/channels/SelectableChannel.html)
    * A channel that can be multiplexed via a Selector.

![Java NIO: A Thread uses a Selector to handle 3 Channel's](http://tutorials.jenkov.com/images/java-nio/overview-selectors.png)

## Collection

### List

#### ArrayList (List)
* 내부 배열에 기반을 둔 리스트 구현
* 리스트 요소에 대한 접근이 다른 리스트 기반 클래스보다 빠름
* 요소가 삽입될 때 추가될 공간을 만들기 위해 객체를 이동시켜야 하고 삭제할 때는 삭제된 공간을 없애기 위해 요소들이 이동해야 하기 때문에 이동이 많아져 요소의 삽입과 삭제가 느림
* 멀티쓰레드에 대한 동기화 안됨

#### Vector (List)
* ArrayList와 비슷하지만 동기화 되어 있다는 차이가 있음
* ArrayList 문법은 거의 비슷합

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
* HashMap은 보조 해시 함수(Additional Hash Function)를 사용하기 때문에 보조 해시 함수를 사용하지 않는 HashTable에 비하여 해시 충돌(hash collision)이 덜 발생할 수 있어 상대으로 성능상 이점이 있음

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

#### 참조 https://d2.naver.com/helloworld/831311

# 개발방법론

## OOP
* 데이터와 코드가 Encapsulated
* 데이터와 그 데이터를 조작하는 코드와 변경은 외부에 영향을 안 미침
* 외부에 노출된 인터페이스만 변경되지 않는다면 프로시저를 실행하는데 필요한 만큼의 데이터만 가짐
* IoC를 통해 HIGH Level Policy(클라이언트, 비즈니스로직)를 Low Level Detail로 부터 보호하는 것

### 객체(Object)
* 객체는 데이터와 그 데이터를 조작하는 프로시저(오퍼레이션, 메서드, 함수)로 구성

## AOP

## 디자인패턴
* 패턴 분류 기준
  * 목적 (Purpose)
    * 생성 : 객체의 생성 과정에 관여하는 것
    * 구조 : 클래스나 객체의 합성에 관한 패턴
    * 행동 : 클래스나 객체들의 상호작용하는 방법과 책임을 분상하는 방법 정의
  * 범위 (Scope)
    * 클래스 : 클래스와 서브클래스 간의 관련성을 다루는 패턴
    * 객체 : 객체 관련성을 다루는 패턴, 런타임에 변경할 수 있으며 더 동적인 성격을 가짐

![디자인 패턴 영역](/assets/images/etc/javadevlopinterview/design-pattern.png)

### Iterator
* 순서대로 지정해서 처리하기

### Adapter
* 바꿔서 재이용하기

### Template Method
* 하위 클래스에서 구체적으로 처리하기

### Factory Method
* 하위 클래스에서 인스턴스 작성하기

### Singleton
* 인스턴스를 한 개만 만들기

### Prototype
* 복사해서 인스턴스 만들기

### Builder
 * 복잡한 인스턴스 조립하기

### Abstract Factory
* 관련 부품을 조합해서 제품 만들기

### Bridge
* 기능 계층과 구현 계층 분리하기

### Strategy
* 알고리즘을 모두 바꾸기

### Composite
* 그릇과 내용물을 동일시하기

### Decorator
* 장식과 내용물을 동일시하기
![Decorator](/assets/images/etc/javadevlopinterview/decoratorpattern.png)

### Visitor
* 데이터 구조를 돌아다니면서 처리하기
![Visitor](/assets/images/etc/javadevlopinterview/visitorpattern.png)

### Chain of Responsibility
* 복수의 오브젝트가 연결되어 있는 내부의 어딘가에서 일을 수행

### Facade
* 복잡하게 얽힌 클래스를 개별적으로 제어하는 것이 아니라, 창구 역할을 하는 클래스를 하나 배치해서 시스템 전체의 조작성을 좋게 함

### Mediator
* 복수의 클래스가 상호간에 직접 의사 소통을 하는 것이 아니라, 중개역을 하는 클래스를 하나 준비하고, 그 클래스하고만 의사 소통을 하게 해서 프로그램을 단순하게 만드듬

### Observer
* 상태가 변화하는 클래스와 그 변화를 통지받는 클래스를 분리해서 생각

### Memento
* 현재의 상태를 저장해 두고 필요할 때 복귀시키는 Undo 기능을 설정

### State
* 상태를 클래스로 표현하고 상태에 적합한 switch 문의 사용을 줄여줌

### Flyweight
* 복수의 장소에서 동일한 것이 등장할 때 그것들을 공유해서 낭비를 없앰

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
* 캡슐화 (encapsulation)
  * 객체가 내부적으로 기능을 어떻게 구현하는지를 감추는 것
  * 멤버변수와 멤버함수를 모두 묶어서 하나의 단위 (클래스, 객체)로 만드는 일련의 작업
  * 클래스의 내부가 바뀌어도 클래스를 참조하는 다른 클래스나 함수는 변경할 필요가 없음
  * 외부에서 직접 접근을 하면 안되고 오로지 함수를 통해서만 접근
  * 객체는 속성과 메소드로 만들짐 , 일부 속성과 메소드는 객체의 외부에서 접근 (interface) ,다른 속성,메소드는 객체 자신만의 사적인 용도로 예약되어 있고 이것을 구현 implement
* 캡슐화 원칙
  * Don't Tell Ask
    * 데이터를 물어보지 않고, 기능을 실행해 달라고 말하라
  * 데미테르의 법칙
    * 메서드에서 생성한 객체의 메서드만 호출
    * 파라미터로 받은 객체의 메서드만 호출
    * 필드로 참조하는 객체의 메서드만 호출

## Domain Driven Design
* 대다수 소프트웨어 프로젝트에서는 초점을 도메인과 도메인 로직에 맞춰야 한다.
* 복잡한 도메인 설계는 모델을 기반으로 삼아야 한다.
* DDD는 기술이나 원칙이 아님 이것은 사고하는 방법이며, 복잡한 도메인을 다뤄야 하는 소프트웨어 프로젝트의 진행 속도를 높이는 데 중요시해야 할 것들의 모음

### Entity
* 속성이 아닌 식별성을 기준으로 정의되는 도메인 객체
* 예) DB : ERD (Entity-Relationship Model), J2EE : Entity Bean

### Value Object
* 식별성이 아닌 속성을 이용해 정의되는 불변 객체
* 모든 것에 식별성을 부여하고 Entity로 관리한다면 복잡성 증가
* 과거 Java의 DTO(Data Transfer Object) 패턴의 Value Object와 관계없음
* Entity와 Value Object을 구별하는 첫 번째 조건은 식별성
* 식별셩을 가지면 Entity 그렇지 않으면 Value Object

### Service
* Domain Object에서 위치시키기 어려운 operation을 가지는 객체
* 여러 Domain Object 다루는 연산 Service의 오퍼레이션을 일반적으로 Stateless
* Domain Object에 해당하는 역할을 Service Operation으로 만드는 경우 도메인 역할을 침범하여 강 결합이 일어남

### Module
* 유사 작업 및 개념을 그룹화 하여 복잡도를 감소시키는 기법
* 응집도가 높은 모듈은간의 관계는 약 결합
* Java로 구현하는 경우 Package로 구성될 수 있다.

### Aggregate
* 연관된 Entity와 Value Object의 묶음. 일관성과 트랜잭션, 분산의 단위, 캡슐화를 통한 복잡성 관리
* 예를 들어 쇼핑몰 사이트에서 주문 Entity 내에 배송주소 정보를 우편번호, 주소1, 주소2, 상세주소, 이런식으로 각 칼럼으로 정의하는 것이 아니라, 주소라는 Value Object를 별도로 작성하고 주문 Entity는 주소 Value Object을 포함하는 방식으로 관계 일관성 및 단순성화를 유지한다.

### Factory
* 복잡한 Entity의 생성 절차에 캡슐화 할 수 있는 개념
* 생성하기 복잡한 Aggregate내의 여러 객체를 동시에 생성
* 생성시 Aggregate의 일관성 유지

### Repository
* 도메인 영역과 데이터 인프라스트럭쳐 계층의 분리하여 데이터 계층에 대한 결합도를 낮추기 위한 방안
* 생성된 Aggregate에 대한 영속성 관리, 조회, 등록, 수정, 삭제시 Aggregate의 일관성 유지
* DB및 데이터 저장소의 데이터를 조회하고 저장하는 경우 Repository를 활용한다.

### Bounded Context
* 각각의 업무는 분할된 컨텍스트로 나눌 수 있으며 각 Context에 사용되는 모델은 서로 분리되어야 하며, 각 하나의 Context는 하나의 팀에 할당되어 관리되는 것이 좋다. 또한 이러한 방향은 Micro Service Architecture에서 추구하는 방향이기도 하다.

# Database

### Transation
* 트랜잭션은 업무 처리를 위한 논리적인 작업 단위
* 작업의 논리적 단위가 단일 연산이 아닐 수 있음
* 은행의 "계좌이체" 트랜잭션을 예를 들면, 하나의 예금 계좌에서 인출하여 다른 예금 계좌에 입금하는 일련의 작업을 하나의 단위로 수행

#### ACID
* Atomicity(원자성)
  * 트랜젹션은 더 이상 분해가 불가능한 업무의 최소단위이므로, 전부 처리되거나 아예 하나도 처리되지 않아야 함
  * 트랜잭션의 모든 연산들이 정상적으로 수행 완료되거나 아니면 전혀 어떠한 연산도 수행되지 않은 상태를 보장
* Consistency(일관성)
  * 트랜잭션의 수행을 데이터베이스 상태 간의 전이(transition)로 봤을 때, 트랜잭션 수행 전후의 데이터베이스 상태는 각각 일관성이 보장
  * 일관된 상태의 데이터베이스에서 하나의 트랜잭션을 성공적으로 완료하고 나면 그 데이터베이스는 여전히 일관된 상태여야 함
  * 트랜잭션 실행의 결과로 데이터베이스 상태가 모순되지 않아야 함 
* Isolation(격리성)
  * 여러 트랜잭션이 동시에 수행되더라도 각각의 트랜잭션은 다른 트랜잭션의 수행에 영향을 받지 않고 독립적으로 수행
  * 실행 중인 트랜잭션의 중간결과를 다른 트랜잭션이 접근할 수 없음
* Durability(영구성)
  * 트랜잭션이 성공적으로 완료되어 커밋되고 나면, 해당 트랜잭션에 의한 모든 변경은 향후에 어떤 소프트웨어나 하드웨어 장애가 발생되더라도 보존
  * 트랜잭션이 일단 그 실행을 성공적으로 완료하면 그 결과는 데이터베이스에 영속적으로 저장

#### 낮은 단계의 격리성 수준에서 발생할 수 있는 현상
* Dirty Read
  * 다른 트랜잭션에 의해 수정됐지만 아직 커밋되지 않은 데이터를 읽는 것을 말함
  * 변경 후 아직 커밋되지 않은 값을 읽었는데 변경을 가한 트랜잭션이 최종적으로 롤백된다면 그 값을 읽은 트랜잭션은 비일관성 상태에 놓임
* Non Repeatable Read
  * 한 트랜잭션 내에서 같은 쿼리를 두 번 수행했는데, 그 사이에 다른 트랜잭션이 값을 수정 또는 삭제하는 바람에 두 쿼리 결과가 다르게 나타나는 현상
* Phantom Read
  * 한 트랜잭션 내에서 같은 쿼리를 두번 수행했는데, 첫 번째 쿼리에서 없던 유령 레코드가 두번째 쿼리에서 나타나는 현상

#### Transaction Isolation Level
* Read uncommitted
  * 트랜잭션에 처리중인 혹은 아직 커밋되지 않은 데이터를 다른 트랜잭션이 읽는 것을 허용
  * 어떤 사용자가 A라는 데이터를 B라는 데이터로 변경하는 동안 다른 사용자는 B라는 아직 완료되지 않은(Uncommitted 혹은 Dirty) 데이터 B를 읽을 수 있음
* Read committed 
  * 트랜잭션이 커밋되어 확정된 데이터만을 읽는 것을 허용
  * dirty read 방지
* Repeatable read 
  * 하나의 트랜잭션이 읽는 로우를 다른 트랜잭션이 수정하는 것을 막음
  * 트랜잭션이 완료될 때까지 SELECT 문장이 사용하는 모든 데이터에 shared lock이 걸리므로 다른 사용자는 그 영역에 해당되는 데이터에 대한 수정이 불가능
  * 선행 트랜잭션이 읽은 데이터는 트랜잭션이 종료될 때까지 후행 트랜잭션이 갱신하거나 삭제하는 것을 불허함으로써 같은 데이터를 두 번 쿼리했을 때 일관성 있는 결과를 리턴함
* Serializable
  * 트랜잭션을 순차적으로 진행
  * 완벽한 읽기 일관성 모드를 제공

| Isolation Level | Dirty Read | Nonrepeatable Read | Phantom Read | Serialization Anomaly |
|---|---|---|---|---|
| Read uncommitted | Possible | Possible | Possible | Possible |
| Read committed | Not possible | Possible | Possible | Possible |
| Repeatable read | Not possible | Not possible | Possible | Possible |
| Serializable | Not possible | Not possible | Not possible | Not possible |

# Network

## Http

### CSRF 
* Cross-Site Request Forgery
* CSRF는 웹사이트 취약점 공격의 하나로, 사용자가 자신의 의지와는 무관하게 공격자가 의도한 행위(수정, 삭제, 등록 등)를 특정 웹사이트에 요청하게 하는 공격을 말한다. 
사이트 간 스크립팅(XSS)을 이용한 공격이 사용자가 특정 웹사이트를 신용하는 점을 노린 것이라면, CSRF는 특정 웹사이트가 사용자의 웹 브라우저를 신용하는 상태를 노린 것이다. 
일단 사용자가 웹사이트에 로그인한 상태에서 사이트간 요청 위조 공격 코드가 삽입된 페이지를 열면, 공격 대상이 되는 웹사이트는 위조된 공격 명령이 믿을 수 있는 사용자로부터 발송된 것으로 판단하게 되어 공격에 노출된다.

### CORS
* Cross-Origin Resource Sharing
* 웹 애플리케이션은 리소스가 자신의 출처(도메인, 프로토콜, 포트)와 다를 때 교차 출처 HTTP 요청을 실행합니다.
* 교차 출처 요청의 예시: https://domain-a.com의 프론트 엔드 JavaScript 코드가 XMLHttpRequest를 사용하여 https://domain-b.com/data.json을 요청하는 경우.
![Decorator](https://mdn.mozillademos.org/files/14295/CORS_principle.png)
* 해결법
  * Access-Control-Allow-Origin response
  * JSONP

### Method

#### GET
* idempotent
* 서버에게 리소스를 달라고 요청하기 위해 쓰임
* HTTP/1.1은 서버가 이 메서드를 구현할 것을 요구

#### HEAD
* 정확히 GET 처러 행동하지만, 서버는 응답으로 헤더만을 돌려줌 (엔터티 본문 X)
* 리소스를 가져오지 않고도 그에 대해 무엇인가를 알아낼 수 있다.
* 응답의 상태 코드를 통해, 개체가 존재하는지 확인할 수 있다.
* 헤더를 확인하여 리소스가 변경되었는지 검사할 수 있다.

#### PUT
* 서버에서 문서를 씀
* 웹페이지를 만들고 웹 서버에 직접 게시할 수 있도록 해줌
* 서버가 요청의 본문을 가지고 요청 URL의 이름대로 새 문서를 만들거나, 이미 URL이 존재한다면 본문을 사용해서 교체하는 것
* 콘텐츠를 변경할 수 있게 해주기 떄문에, 많은 웹 서버가 PUT을 수행하기 전에 사용자에게 비밀번호를 입력해서 로그인을 하도록 요구

#### POST
* non-idempotent
* 서버에 입력 데이터를 전송하기 위해서 설계

#### TRACE
* 클라이언트에게 자신의 요청이 서버에 도달했을 때 어떻게 보이게 되는지 알려줌

#### OPTION
* 웹 서버에게 여려 가지 종류의 지원 범위에 대해서 물어봄

#### DELETE
* 서버에게 요청 URL로 지정한 리소스를 삭제할 것을 요청

### RESTful API
* Representational State Transfer 라는 용어의 약자로서 2000년도에 로이 필딩 (Roy Fielding)의 박사학위 논문에서 최초로 소개
* REST 요소
  * 자원 (Resource) - URL
  * 행위 (Verb) - HTTP Method
  * 표현 (Repesentations)
* REST 의 특정
  * Uniform (유니폼 인터페이스)
    * Uniform Interface는 URI로 지정한 리소스에 대한 조작을 통일되고 한정적인 인터페이스로 수행하는 아키텍처 스타일을 말함
  * Stateless (무상태성)
    * REST는 무상태성 성격 
    * 다시 말해 작업을 위한 상태정보를 따로 저장하고 관리하지 않음 
    * 세션 정보나 쿠키정보를 별도로 저장하고 관리하지 않기 때문에 API 서버는 들어오는 요청만을 단순히 처리하면 됨 
    * 서비스의 자유도가 높아지고 서버에서 불필요한 정보를 관리하지 않음으로써 구현이 단순해짐
  * Cacheable (캐시 가능)
    * REST의 가장 큰 특징 중 하나는 HTTP라는 기존 웹표준을 그대로 사용
    * 웹에서 사용하는 기존 인프라를 그대로 활용이 가능 
    * HTTP가 가진 캐싱 기능이 적용 가능 
    * HTTP 프로토콜 표준에서 사용하는 Last-Modified태그나 E-Tag를 이용하면 캐싱 구현이 가능
  * **Self-descriptiveness (자체 표현 구조)
    * REST의 또 다른 큰 특징 중 하나는 REST API 메시지만 보고도 이를 쉽게 이해 할 수 있는 자체 표현 구조로 되어 있다는 것
  * Client - Server 구조
    * REST 서버는 API 제공 
    * 클라이언트는 사용자 인증이나 컨텍스트(세션, 로그인 정보)등을 직접 관리하는 구조로 각각의 역할이 확실히 구분되기 때문에 클라이언트와 서버에서 개발해야 할 내용이 명확해지고 서로간 의존성이 줄어들게 됨
  * 계층형 구조
    * REST 서버는 다중 계층으로 구성될 수 있으며 보안, 로드 밸런싱, 암호화 계층을 추가해 구조상의 유연성을 둘 수 있고 PROXY, 게이트웨이 같은 네트워크 기반의 중간매체를 사용할 수 있게 함

## HTTP와 HTTPS 차이 및 S가 보호하는 OSI7계층 위치
* HTTP : 
  * 인터넷에서 하이퍼텍스트(hypertext) 문서를 교환하기 위하여 사용되는 통신규약 
  * 하이퍼텍스트는 문서 중간중간에 특정 키워드를 두고 문자나 그림을 상호 유기적으로 결합하여 연결시킴으로써, 서로 다른 문서라 할지라도 하나의 문서인 것처럼 보이면서 참조하기 쉽도록 하는 방식을 의미
* HTTPS
  * 전송 중의 메세지를 전송 계층 보안(TLS Transport Layer Security) 프로토콜을 사용해 암호화하는 HTTP의 보안 버전
  * 암호화 : 메세지는 전송 중에 제3자에게 읽힐 수 없음
  * 무결성 : 암호화된 메시지가 디지털 서명되고 서명이 복호화되기 전에는 암호학적으로 검증되기 때문에 전송 중에 변경되지 않음
  * 인증 : 서버는 클라이언트가 메시지를 주고 받으려던 바로 그 서버다.
* HTTPS 핸드세이크
  1. ClientHello 메세지 전송 (C->S, 비암호)
  2. ServerHello 메세지 전송 (C<-S, 비암호)
  3. 서버 HTTPS 인증서 제공 (ServerCertificate) (C<-S, 비암호)
  4. 암호화 방식에 따라 ServerKeyExchange 메세지 전송 (C<-S, 비암호)
  5. 클라이언트 HTTPS 인증서가 필요한지 여부 (CertificateRequest) 전송 (C<-S, 비암호)
  6. ServerHello가 완료됐다는 (ServerHelloDone) 메세지 전송 (C<-S, 비암호)
  7. 클라이언트 인증서 제공 (ClientCerificate) (C->S, 비암호)
  8. ServerHello 메세지 전송 (C->S, 공개키/개인키 암호)
  9. 클라이언트 인증서를 검증하는(CertificateVerify) 메세지 전송 (C->S, 공개키/개인키 암호)
  10. 클라이언트에서 이제부터 암호화가 시작됨을 알림 (ChangeCipherSpec) (C<->S, 비암호)
  11. ServerHello 메세지 전송 (C->S, 합의된 비밀키로 암호화)
  12. 서버측에서 클라이언트로 암호화가 시작됨을 알림 (ChangeCipherSpec) (C<-S, 비암호)
  13. 서버 측에서 핸드세이크가 끝났다는 메세지(Finsihed) 전송 (C<-S, 합의된 비밀키로 암호화)

## TCP UDP 차이
* TCP
  * 유니캐스트 연결 지향 (Connection-Oriented) 프로토콜
  * 기본적으로 IP 계층(혹은 아래 계층)에서의 패킷 손실, 중복, 혹은 오류에 의해 발생될 수 있는 모든 데이터 전송 문제를 검출하고 복구
* UDP
  * 단순한 데이터그램 지향 트랜스포트 계층 프로토콜
  * 연결의 설정과 종료를 포함하지 않는 비연결형 (Connectionless) 프로토콜
  * 오류 정정, 순서화, 중복 제거, 흐름 제어 혹은 혼잡 제어를 제공하지 않음
  * 오류 검출은 제공할 수 있으며, 트랜스포트 계층에서 종단간 검사합을 포함

## TCP 3-WAY HAND SHAKING
* TCP/IP 프로토콜을 이용해서 통신을 하는 응용프로그램이 데이터를 전송하기 전에 먼저 정확한 전송을 보장하기 위해 상대방 컴퓨터와 사전에 세션을 수립하는 과정을 의미
* 양쪽 모두 데이타를 전송할 준비가 되었다는 것을 보장하고, 실제로 데이타 전달이 시작하기전에 한쪽이 다른 쪽이 준비되었다는 것을 알수 있도록 함
* 양쪽 모두 상대편에 대한 초기 순차일련변호를 얻을 수 있도록 함
* 과정
  1. A클라이언트는 B서버에 접속을 요청하는 SYN 패킷을 보낸다. 이때 A클라이언트는 SYN 을 보내고 SYN/ACK 응답을 기다리는SYN_SENT 상태가 되는 것이다.
  2. B서버는 SYN요청을 받고 A클라이언트에게 요청을 수락한다는 ACK 와 SYN flag 가 설정된 패킷을 발송하고 A가 다시 ACK으로 응답하기를 기다린다. 이때 B서버는 SYN_RECEIVED 상태가 된다.
  3. A클라이언트는 B서버에게 ACK을 보내고 이후로부터는 연결이 이루어지고 데이터가 오가게 되는것이다. 이때의 B서버 상태가 ESTABLISHED 이다.

# 자료구조, 알고리즘

## 자료구조
* 자료구조는 컴퓨터 과학에서 효율적인 접근 및 수정을 가능케 하는 자료의 조직, 관리, 저장을 의미한다 자료 구조는 데이터 값의 모임, 또 데이터 간의 관계, 그리고 데이터에 적용할 수 있는 함수나 명령을 의미한다.

# Spring

## AOP
## Bean Scope
## Transaction Propagation
* Required
   * 현재 트랜잭션을 지원하고 존재하지 않는 경우 새 트랜잭션을 만듬
   * 동일한 이름의 EJB 트랜잭션 속성과 유사
   * 트랜잭션 주석의 기본 설정
* Supports
   * 현재 트랜잭션을 지원하고, 존재하지 않으면 비 트랜잭션으로 실행 
   * 동일한 이름의 EJB 트랜잭션 속성과 유사
   * 트랜잭션 동기화를 사용하는 트랜잭션 관리자의 경우 SUPPORTS는 동기화가 적용될 트랜잭션 범위를 정의하므로 트랜잭션이없는 것과 약간 다름 
   * 결과적으로 동일한 리소스 (JDBC 연결, Hibernate 세션 등)가 지정된 전체 범위에 대해 공유, 이는 트랜잭션 관리자의 실제 동기화 구성에 따라 다름
* Mandatory
   * 현재 트랜잭션을 지원하고, 존재하지 않으면 예외를 발생
   * 동일한 이름의 EJB 트랜잭션 속성과 유사
* RequiredNew
   * 새 트랜잭션을 만들고 현재 트랜잭션이 있으면 일시 중단
   * 동일한 이름의 EJB 트랜잭션 속성과 유사
   * 실제 거래 일시 중단은 모든 거래 관리자에게 즉시 적용되지는 않음 
   * 특히 JtaTransactionManager에 적용되며, javax.transaction.TransactionManager를 사용할 수 있어야함 (표준 Java EE에서 서버에 따라 다름)
* Not Supported
   * 비 트랜잭션 방식으로 실행하고 현재 트랜잭션이있는 경우 일시 중단 
   * 동일한 이름의 EJB 트랜잭션 속성과 유사
   * 실제 거래 일시 중단은 모든 거래 관리자에게 즉시 적용되지는 않음 
   * JtaTransactionManager에 적용되며, javax.transaction.TransactionManager를 사용할 수 있어야함 (표준 Java EE에서 서버에 따라 다름)
* Never
   * 비 트랜잭션 방식으로 실행하고 트랜잭션이있는 경우 예외를 발생 
   * 동일한 이름의 EJB 트랜잭션 속성과 유사합니다.
* Nested
   * 현재 트랜잭션이 있으면 중첩 트랜잭션 내에서 실행하고 그렇지 않으면 REQUIRED처럼 동작. 
   * EJB에는 유사한 기능이 없음
   * 중첩 된 트랜잭션의 실제 생성은 특정 트랜잭션 관리자에서만 작동 
   * 기본적으로 이것은 JDBC DataSourceTransactionManager에만 적용 
   * 일부 JTA 공급자는 중첩 된 트랜잭션도 지원할 수 있습니다.

# Redis
* 레디스는 고성능 키-값 저장소로서 문자열, 리스트, 해시, 셋, 정렬된 셋 형식으로 데이터를 지원하는 NoSQL
* 메모리 이외의 영구 저장소를 지원
## 레디스 데이터 구조
* 문자열 데이터
  * 최대 512MB
  * 문자열 데이터를 저장할 때는 인코딩된 문자열과 몇 가지 부가 정보가 포함된 구조체 (레디스 객체형)
* 해시 데이터
  * 문자열 필드와 값으로 이루어진 맵 구조
  * 해시 데이터에는 2^32-1 필드와 값을 저장 할 수 있음
  * 숫자로 바꾸면 약 42억
* 셋 데이터
  * 중복을 허용하지 않는 집합 형태의 자료구조
  * 2^32-1 개의 값을 저장
* 정렬된 셋 데이터
  * 셋 데이터와 동일한 특징을 가지면서 요소 정렬이라는 부가적인 특징을 가짐
  * 정렬된 셋 데이터는 셋 데이터 구조에 요소의 가중치 값이 추가
  * 가중치에 따라서 각 요소의 정렬이 수행
  * 기본 정렬 순서는 오름차순
* 리스트 데이터
  * 리스트 데이터는 저장 순서를 기억하는 데이터 구조로 중복 허용
  * 2^32-1 개의 값을 저장
  * 이중 연결 리스트 구현
## 확장과 분산 기법
  * 복재
    * 단일복제
      * 마스터, 단일 슬레이브 구조
      * 마스터 노드에 변경이 발생하면 실시간으로 슬레이브 노드에 데이터 변경상항을 기록
    * 다중복제
      * 다중 복제는 단일 복제의 단순 확장
    * 계층형복제
      * 마스터 노드에 너무 많은 슬레이브가 접속되어 쓰기 성능이 저하되는 문제를 해결하기 위한 복제 방법
      * 마스터 노드와 슬레이브 노브 1이 1차로 복제
      * 이후 슬레이브 2, 슬레이브 3, 슬레이브 4가 복제
  * 샤딩
    * 수직 샤딩
      * 데이터 성격을 기준으로 논리적 분할을 적용한 것
      * 사용자정보, 친구정보로 분리
    * 범위 지정 샤딩
      * 특정 키에 대하여 범위를 지정하여 저장될 노드를 결정하는것
      * 1~10,000 샤드1, 10,001 ~ 20,000 샤드 2
    * 해시 기반 샤딩
      * 키의 해시값을 구하여 해시값에 대한 특정 연산을 통해서 키가 저장될 위치를 구하는 방법
  * 샤딩과 복제 혼합
    * 두개의 샤드로 구성된 클러스터이며 각 샤드는 단일 복제를 사용

# 마이크로서비스 (MSA)
* 마이크로서비스
  * 작고 자율적으로 협업하는 서비스
## 마이크로서비스 아키텍처의 장점
* 크고 복잡한 애플리케이션을 지속적으로 전달/배포 할 수 있음
* 서비스 규모가 작아 관리하기 쉬움
* 서비스를 독립적으로 배포/확장할 수 있음
* 마이크로서비스 아키텍처 덕분에 팀이 자율적으로 움직임
* 결함 격리가 잘됨
* 새로운 기술을 실험하고 도입하기 쉬움
## 마이크로서비스 아키텍처의 단점
* 딱 맞는 서비스를 찾기가 쉽지 않음
* 분산 시스템은 너무 복잡해서 개발, 테스트, 배포가 어려움
* 여러 서비스에 걸친 기능을 배포할 때에는 잘 조정해야 함
* 마이크로서비스 아키텍처 도임 시점을 결정하기 어려움

# Reference

* [Java Virtual Machine Internals, Part 1: Class Loader](https://dzone.com/articles/java-virtual-machine-internals-class-loader)
* [Java Virtual Machine Internals, Part 2: Class File Format](https://dzone.com/articles/java-virtual-machine-internals-part-2-class-file-f)
* [JVM Internal](http://d2.naver.com/helloworld/1230)
* [Loading, Linking, and Initializing](https://docs.oracle.com/javase/specs/jvms/se15/html/jvms-5.html)
* [HotSpot Runtime Overview](https://openjdk.java.net/groups/hotspot/docs/RuntimeOverview.html)
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
* [Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
* [REST API 제대로 알고 사용하기 : TOAST Meetup](https://meetup.toast.com/posts/92)
