---
title: Refactoring
description: 리팩토링 코드 품질을 개선하는 객체지향 사고법 책 정리
categories:
 - book
tags:
 - Refactoring
comments: true
---

# Refactoring

## CHAPTER 01 맛보기 예제

### 원래의 프로그램
* 비디오 대여점에서 고객의 대여료 내역을 계산하고 출력하는 간단한 프로그램

![리팩토링 전 클래스 관계를 나타낸 다이어그램](/assets/images/books/컴퓨터공학/개발방법론/Refactoring/figure_1-1.png)

### 리팩토링 첫 단계

### statement 메서드 분해와 기능 재분배

### 가격 책정 부분의 조건문을 재정의로 교체

### 고찰

## CHAPTER 02 리팩토링 개론

### 리팩토링은 무엇인가

### 리팩토링은 왜 해야 하나

### 리팩토링은 어떨 때 필요한가

### 팀장에게 어떻게 말을 꺼내나

### 리팩토링 관련 문제들

### 리팩토링과 설계

### 리팩토링과 성능

### 리팩토링의 유래

## CHAPTER 03 코드의 구린내

### 중복 코드 Duplicated Code

### 장황한 메서드 Long Method

### 방대한 클래스 Large Class

### 과다한 매개변수 Long Parameter List

### 수정의 산발 Divergent Change

### 기능의 산재 Shotgun Surgery

### 잘못된 소속 Feature Envy

### 데이터 뭉치 Data Clumps

### 강박적 기본 타입 사용 Primitive Obsession

### switch 문 Switch Statements

### 평행 상속 계층 Parallel Inheritance Hierarchies

### 직무유기 클래스 Lazy Class

### 막연한 범용 코드 Speculative Generality

### 임시 필드 Temporary Field

### 메시지 체인 Message Chains

### 과잉 중개 메서드 Middle Man

### 지나친 관여 Inappropriate Intimacy

### 인터페이스가 다른 대용 클래스 Alternative Classes with Different Interfaces

### 미흡한 라이브러리 클래스 Incomplete Library Class

### 데이터 클래스 Data Class

### 방치된 상속물 Refused Bequest

### 불필요한 주석 Comments

## CHAPTER 04 테스트 작성

### JUnit 테스트 프레임워크

### 테스트 추가

## CHAPTER 05 리팩토링 기법 카탈로그에 대해

### 참조 검색

### 리팩토링 기법의 성숙도

## CHAPTER 06 메서드 정리

### 메서드 추출 Extract Method

### 메서드 내용 직접 삽입 Inline Method

### 임시변수 내용 직접 삽입 Inline Temp

### 임시변수를 메서드 호출로 전환 Replace Temp with Query

### 직관적 임시변수 사용 Introduce Explaining Variable

### 임시변수 분리 Split Temporary Variable

### 매개변수로의 값 대입 제거 Remove Assignments to Parameters

### 메서드를 메서드 객체로 전환 Replace Method with Method Object

### 알고리즘 전환 Substitute Algorithm

## CHAPTER 07 객체 간의 기능 이동

### 메서드 이동 Move Method

### 필드 이동 Move Field

### 클래스 추출 Extract Class

### 클래스 내용 직접 삽입 Inline Class

### 대리 객체 은폐 Hide Delegate

### 과잉 중개 메서드 제거 Remove Middle Man

### 외래 클래스에 메서드 추가 Introduce Foreign Method

### 국소적 상속확장 클래스 사용 Introduce Local Extension

## CHAPTER 08 데이터 체계화

### 필드 자체 캡슐화 Self Encapsulate Field

### 데이터 값을 객체로 전환 Replace Data Value with Object

### 값을 참조로 전환 Change Value to Reference

### 참조를 값으로 전환 Change Reference to Value

### 배열을 객체로 전환 Replace Array with Object

### 관측 데이터 복제 Duplicate Observed Data

### 클래스의 단방향 연결을 양방향으로 전환 Change Unidirectional Association to Bidirectional

### 클래스의 양방향 연결을 단방향으로 전환 Change Bidirectional Association to Unidirectional

### 마법 숫자를 기호 상수로 전환 Replace Magic Number with Symbolic Constant

### 필드 캡슐화 Encapsulate Field

### 컬렉션 캡슐화 Encapsulate Collection

### 레코드를 데이터 클래스로 전환 Replace Record with Data Class

### 분류 부호를 클래스로 전환 Replace Type Code with Class

### 분류 부호를 하위클래스로 전환 Replace Type Code with Subclasses

### 분류 부호를 상태/전략 패턴으로 전환 Replace Type Code with State/Strategy

### 하위클래스를 필드로 전환 Replace Subclass with Fields

## CHAPTER 09 조건문 간결화

### 조건문 쪼개기 Decompose Conditional

### 중복 조건식 통합 Consolidate Conditional Expression

### 조건문의 공통 실행 코드 빼내기 Consolidate Duplicate Conditional Fragments

### 제어 플래그 제거 Remove Control Flag

### 여러 겹의 조건문을 감시 절로 전환 Replace Nested Conditional with Guard Clauses

### 조건문을 재정의로 전환 Replace Conditional with Polymorphism

### Null 검사를 널 객체에 위임 Introduce Null Object

### 어설션 넣기 Introduce Assertion

## CHAPTER 10 메서드 호출 단순화

### 메서드명 변경 Rename Method

### 매개변수 추가 Add Parameter

### 매개변수 제거 Remove Parameter

### 상태 변경 메서드와 값 반환 메서드를 분리 Separate Query from Modifier

### 메서드를 매개변수로 전환 Parameterize Method

### 매개변수를 메서드로 전환 Replace Parameter with Explicit Methods

### 객체를 통째로 전달 Preserve Whole Object

### 매개변수 세트를 메서드로 전환 Replace Parameter with Method

### 매개변수 세트를 객체로 전환 Introduce Parameter Object

### 쓰기 메서드 제거 Remove Setting Method

### 메서드 은폐 Hide Method

### 생성자를 팩토리 메서드로 전환 Replace Constructor with Factory Method

### 하향 타입 변환을 캡슐화 Encapsulate Downcast

### 에러 부호를 예외 통지로 교체 Replace Error Code with Exception

### 예외 처리를 테스트로 교체 Replace Exception with Test

## CHAPTER 11 일반화 처리

### 필드 상향 Pull Up Field

### 메서드 상향 Pull Up Method

### 생성자 내용 상향 Pull Up Constructor Body

### 메서드 하향 Push Down Method

### 필드 하향 Push Down Field

### 하위클래스 추출 Extract Subclass

### 상위클래스 추출 Extract Superclass

### 인터페이스 추출 Extract Interface

### 계층 병합 Collapse Hierarchy

### 템플릿 메서드 형성 Form Template Method

### 상속을 위임으로 전환 Replace Inheritance with Delegation

### 위임을 상속으로 전환 Replace Delegation with Inheritance

## CHAPTER 12 복합 리팩토링

### 상속 구조 정리 Tease Apart Inheritance

### 절차 코드를 객체로 전환 Convert Procedural Design to Objects

### 도메인 로직을 표현과 분리 Separate Domain from Presentation

### 계층구조 추출 Extract Hierarchy

### CHAPTER 13 리팩토링, 재사용, 현실성

### 개발자가 리팩토링을 꺼리는 이유

### 현실성 다시 검토하기

### 리팩토링 자료와 참고문헌

### 소프트웨어 재사용과 기술 변경이 미치는 영향

### 끝 인사

### 참고문헌

## CHAPTER 14 리팩토링 도구

### 도구를 이용한 리팩토링

### 리팩토링 도구의 기술적 요건

### 리팩토링 도구의 실무적 요건
