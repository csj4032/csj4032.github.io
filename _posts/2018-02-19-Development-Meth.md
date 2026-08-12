---
title: Software Development Methodology
description: 기술 면접 정리
categories:
 - Interview
tags:
 - OOP, SOLID, TDD
---

# 개발방법론

## OOP
* 데이터와 코드가 Encapsulated
* 데이터와 그 데이터를 조작하는 코드와 변경은 외부에 영향을 안 미침
* 외부에 노출된 인터페이스만 변경되지 않는다면 프로시저를 실행하는데 필요한 만큼의 데이터만 가짐
* IoC를 통해 High Level Policy(클라이언트, 비즈니스로직)를 Low Level Detail로 부터 보호하는 것

### 객체(Object)
* 객체는 데이터와 그 데이터를 조작하는 프로시저(오퍼레이션, 메서드, 함수)로 구성

## 디자인패턴 (Design Pattern)
* 패턴 분류 기준
  * 목적 (Purpose)
    * 생성 : 객체의 생성 과정에 관여하는 것
    * 구조 : 클래스나 객체의 합성에 관한 패턴
    * 행동 : 클래스나 객체들의 상호작용하는 방법과 책임을 분상하는 방법 정의
  * 범위 (Scope)
    * 클래스 : 클래스와 서브클래스 간의 관련성을 다루는 패턴
    * 객체 : 객체 관련성을 다루는 패턴, 런타임에 변경할 수 있으며 더 동적인 성격을 가짐

![디자인 패턴 영역](/assets/images/etc/javadevlopinterview/design-pattern.png)

### Iterator (B, O)
* 순서대로 지정해서 처리하기

### Adapter (S, C, O)
* 바꿔서 재이용하기

### Template Method (B, C)
* 하위 클래스에서 구체적으로 처리하기

### Factory Method (C, C)
* 하위 클래스에서 인스턴스 작성하기

### Singleton (C, O)
* 인스턴스를 한 개만 만들기

### Prototype (C, O)
* 복사해서 인스턴스 만들기

### Builder (C, O)
 * 복잡한 인스턴스 조립하기

### Abstract Factory (C, O)
* 관련 부품을 조합해서 제품 만들기

### Bridge (S, O)
* 기능 계층과 구현 계층 분리하기

### Strategy (B, O)
* 알고리즘을 모두 바꾸기

### Composite (S, O)
* 그릇과 내용물을 동일시하기

### Decorator (S, O)
* 장식과 내용물을 동일시하기
![Decorator](/assets/images/etc/javadevlopinterview/decoratorpattern.png)

### Visitor (B, O)
* 데이터 구조를 돌아다니면서 처리하기
![Visitor](/assets/images/etc/javadevlopinterview/visitorpattern.png)

### Chain of Responsibility (B, O)
* 복수의 오브젝트가 연결되어 있는 내부의 어딘가에서 일을 수행

### Facade (S, O)
* 복잡하게 얽힌 클래스를 개별적으로 제어하는 것이 아니라, 창구 역할을 하는 클래스를 하나 배치해서 시스템 전체의 조작성을 좋게 함

### Mediator (B, O)
* 복수의 클래스가 상호간에 직접 의사 소통을 하는 것이 아니라, 중개역을 하는 클래스를 하나 준비하고, 그 클래스하고만 의사 소통을 하게 해서 프로그램을 단순하게 만듬

### Observer (B, O)
* 상태가 변화하는 클래스와 그 변화를 통지받는 클래스를 분리해서 생각

### Memento (B, O)
* 현재의 상태를 저장해 두고 필요할 때 복귀시키는 Undo 기능을 설정

### State (B, O)
* 상태를 클래스로 표현하고 상태에 적합한 switch 문의 사용을 줄여줌

### Flyweight (S, O)
* 복수의 장소에서 동일한 것이 등장할 때 그것들을 공유해서 낭비를 없앰

### Proxy (S, O)
* 정말로 목적한 것이 필요하게 될 때까지 대리인을 사용해서 처리하는 진행

### Command (B, O)
* 요구나 명령을 형태로 만들어서 클래스로 표현

### Interpreter (B, C)
* 문법규칙을 클래스로 표현

## SOLID

### Single Responsibility Principle : 단일책임의 원칙
* Single Responsibility Principle 란 클래스는 하나의 책임을 가져야하며 그 책임에 대한 이유로 변경
* 책임 : '변경을 위한 이유', 한 클래스를 변경하기 위한 한 가지 이상의 이유를 생각할 수 있다면, 그 클래스는 한 가지 이상의 책임을 맡고 있는 것

### Open Close Principle : 개방폐쇄의 원칙
* 소프트웨어 개체(클래스, 모듈, 함수 등)는 확장에 대해 열려 있어야 하고, 수정에 대해서는 닫혀 있어야 함

### The Liskov Substitution Principle : 리스코브 치환의 원칙
* 서브 타입은 그것의 기반 타입으로 치환 가능해야 한다.

### Interface Segregation Principle : 인터페이스 분리의 원칙
* 클라이언트가 자신이 사용하지 않는 메소드에 의존하도록 강제되어서는 안 된다.

### Dependency Inversion Principle : 의존성역전의 원칙
* 상위 수준의 모듈은 하위 수준의 모둘에 의존해서는 안된다. 둘 모두 추상화에 의존해야 한다.
* 추상화는 구체적으로 사항에 의존해서는 안 된다. 구체적인 사항은 추상화에 의존해야 한다.

## GRASP (General Responsibility Assignment Software Pattern)
* 크레이그 라만(Craig Larman)이 패턴 형식으로 제안
* 객체에게 책임을 할당할 때 지침으로 삼을 수 있는 원칙들의 집합을 패턴 형식으로 정리한 것

## 추상화
* 사람이 객체를 인식할 때 객체의 중요 특징을 추출해 내는데, 이 과정을 "추상화"
* 클래스를 만들 때는 구현하고자 하는 객체의 명사적인 특징만 뽑아내는 것이 아니라 객체가 가지는 동사적인 특징까지도 모두 뽑아내는 추상화 작업이 필요
* 명사적인 특징을 뽑아내는 추상화 과정을 거쳐 멤버 변수가 탄생하고, 동사적인 특징을 뽑아내는 추상화 과정을 거쳐 멤버 함수가 탄생
* 추상화 과정에서 주의해야 할 것이 있는데, 추상화 작업 시 앞으로의 확장성을 많이 고려해서 작업

## 정보은닉과 캡슐화 차이
* 정보은닉
  * 정보 은닉은 모듈을 분할하기 위한 기본 원리
  * 모든 객체지향 언어적 요소를 활용하여 객체에 대한 구체적인 정보를 노출시키지 않도록 하는 기법
  * 종류
    * 객체의 구체적인 타입 은닉
    * 객체의 필드 및 메소드 은닉 (캡슐화)
    * 구현 은닉 (인터페이스 및 추상 클래스 기반의 구현)
* 캡슐화 (encapsulation)
  * 데이터를 공용 메소드를 통해서만 접근하도록 허용하는 방법을 데이터 캡슐화
  * 객체가 내부적으로 기능을 어떻게 구현하는지를 감추는 것
  * 멤버변수와 멤버함수를 모두 묶어서 하나의 단위 (클래스, 객체)로 만드는 일련의 작업
  * 클래스의 내부가 바뀌어도 클래스를 참조하는 다른 클래스나 함수는 변경할 필요가 없음
  * 외부에서 직접 접근을 하면 안되고 오로지 함수를 통해서만 접근
  * 객체는 속성과 메소드로 만들짐, 일부 속성과 메소드는 객체의 외부에서 접근 (interface), 다른 속성, 메소드는 객체 자신만의 사적인 용도로 예약되어 있고 이것을 구현 implement
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
* 예를 들어 쇼핑몰 사이트에서 주문 Entity 내에 배송주소 정보를 우편번호, 주소1, 주소2, 상세주소, 이런식으로 각 칼럼으로 정의하는 것이 아니라, 주소라는 Value Object를 별도로 작성하고 주문 Entity는 주소 Value Object을 포함하는 방식으로 관계 일관성 및 단순성화를 유지

### Factory
* 복잡한 Entity의 생성 절차에 캡슐화 할 수 있는 개념
* 생성하기 복잡한 Aggregate내의 여러 객체를 동시에 생성
* 생성시 Aggregate의 일관성 유지

### Repository
* 도메인 영역과 데이터 인프라스트럭쳐 계층의 분리하여 데이터 계층에 대한 결합도를 낮추기 위한 방안
* 생성된 Aggregate에 대한 영속성 관리, 조회, 등록, 수정, 삭제시 Aggregate의 일관성 유지
* DB및 데이터 저장소의 데이터를 조회하고 저장하는 경우 Repository를 활용함

### Bounded Context
* 각각의 업무는 분할된 컨텍스트로 나눌 수 있으며 각 Context에 사용되는 모델은 서로 분리되어야 하며, 각 하나의 Context는 하나의 팀에 할당되어 관리되는 것이 좋음
* Micro Service Architecture에서 추구하는 방향

## Refactoring

## TDD

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

## Asynchronous Event-Driven Microservices
* Granularity
* Scalability
* Technological flexibility
* Business requirement flexibility
* Loosely coupling
* Continuous delivery support
* High testability

## Organizing Code
* Organizing by Layer
* Organizing by Feature
* An Architecturally Expressive Package Structure