---
title: Spring 5 Recipes
description: Spring 5 Recipes 책 정리
categories:
 - book
tags:
 - java
 - spring
---

# 스프링5 레시피

## 1장. 스프링 개발 툴
* 📜 [Maven, Gradle](https://docs.spring.io/spring-boot/docs/2.0.5.RELEASE/reference/htmlsingle/#_working_with_spring_boot)

### 레시피 1-1 STS로 스프링 애플리케이션 빌드하기
* Maven, Gradle
* Jar 또는 구성 파일 복사, 컴파일에 필요한 클래스패스 설정, JAR 의존체 다운로드

### 레시피 1-2 인텔리제이로 스프링 애플리케이션 빌드하기

### 레시피 1-3 메이븐 CLI로 스프링 애플리케이션 빌드하기

### 레시피 1-4 메이븐 래퍼로 스프링 애플리케이션 빌드하기

## 2장. 스프링 코어
* 스프링 프레임워크의 가장 중요한 의의가 이 POJO로 자바 애플리케이션을 개발하는 것이므로 스프링의 주요 기능은 대부분 IoC 컨테이너 안에서 POJO를 구성 및 관리하는 일과 연관
* 📜 https://docs.spring.io/spring/docs/5.1.0.RELEASE/spring-framework-reference/core.html#beans

## 레시피 2-1 자바로 POJO 구성하기

### 레시피 2-3 POJO 레퍼런스와 자동 연결을 이용해 다른 POJO와 상호 작용하기
* https://spring.io/blog/2013/12/03/spring-framework-4-0-and-java-generics
* http://blog.woniper.net/322
* http://gafter.blogspot.com/2006/12/super-type-tokens.html

### 레시피 2-5 @Scope를 붙여 POJO 스코프 지정하기

| 스코프 | 설명 |
| --- | --- |
| singleton | IoC 컨테이너당 빈 인스턴스 하나를 생성합니다. |
| prototype | 요청할 때마다 빈 인스턴스를 새로 만듭니다. |
| request | HTTP 요청당 하나의 빈 인스턴스를 생성합니다. 웹 애플리케이션 컨텍스트에만 해당됩니다. |
| session | HTTP 세션당 빈 인스턴스 하나를 생성합니다. 웹 애플리케이션 컨텍스트에만 해당됩니다. |
| globalSession | 전역 HTTP 세션당 빈 인스턴스 하나를 생성합니다. 포털 애플리케이션 컨텍스트에만 해당됩니다. |

* 📜 [5.1.0 REALEASE Bean Scopes](https://docs.spring.io/spring/docs/5.1.0.RELEASE/spring-framework-reference/core.html#beans-factory-scopes)

### 레시피 2-13 애너테이션을 활용해 애스펙트 지향 프로그래밍하기
* IoC 컨테이너에서 애스팩트 애너테이션 기능을 활성화하려면 구성 클래스 중 하나에 @EnableAspectJAutoProxy 붙임
* 기본적으로 스프링은 인터페이스 기반의 JDK 동적 프록시를 생성하여 AOP를 적용
* 인터페이스를 사용할 수 없거나 애플리케이션 설계상 사용하지 않을 경우엔 CGLIB 으로 프록시를 만들 수 있음
* @EnableAspectJAutoProxy 에서 proxyTargetClass 속성을 true 로 설정하면 동적 프록시 대신 CGLIB 을 사용

### 레시피 2-18 인트로덕션을 이용해 POJO에 기능 더하기

## 3장. 스프링 MVC

### 레시피 3-1 간단한 스프링 MVC 웹 애플리케이션 개발하기
* 스프링 MVC 컨트롤러는 코어 자바 EE 디자인 패컨 중 하나인 프론트 컨트롤러 패턴을 구현한 것
* MVC 프레임워크에서 모든 웹 요청은 반드시 디스패처 서블릿을 거쳐 처리됨

![스프링 MVC의 요청 처리 흐름](/assets/images/books/프로그래밍_언어/자바/spring5recipes/figure_3-1.png)

![스프링 MVC의 요청 처리 흐름 로그](/assets/images/books/프로그래밍_언어/자바/spring5recipes/figure_3-1-1.png)

* EnableWebMvc https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/servlet/config/annotation/EnableWebMvc.html

### 레시피 3-2 @RequestMapping에서 요청 매핑하기
* HTTP Method https://tools.ietf.org/html/rfc7231#section-4

### 레시피 3-3 핸들러 인터셉터로 요청 가로채기

### 레시피 3-4 유저 로케일 해석하기
![브라우저와 서버로 부터 온 전형적인 요청과 응답](/assets/images/books/프로그래밍_언어/자바/spring5recipes/figure_3-4-1.png)
* spring-custom-validation-message-source https://www.baeldung.com/spring-custom-validation-message-source

## 4장. 스프링 REST

## 5장. 스프링 MVC : 비동기 처리
* 리액티브 프로그래밍은 한 마디로 넌블로킹 함수형 프로그래밍을 실천하는 방법

## 6장. 스프링 소셜
* https://www.baeldung.com/facebook-authentication-with-spring-security-and-social

## 7장. 스프링 시큐리티

## 8장. 스프링 모바일

## 9장. 데이터 엑세스

## 10장. 스프링 트랜잭션 관리
* 트랜잭션의 속성 ACID
* 원자성 (Atomicity) : 트랜잭션은 연속적인 액션들로 이루어진 원자성 작업입니다. 트랜잭션의 액션은 전부다 수행되거나 아무것도 수행되지 안도록 보장합니다.
* 일관성 (Consistency) : 트랜잭션의 액션이 모두 완료되면 커밋되고 데이터 및 리소스는 비즈니스 규칙에 맞에 일관된 상태를 유지합니다.
* 격리성 (Isolation) : 동일한 데이터를 여러 트랜잭션이 동시에 처리할 경우 데이터가 변질되지 않게 하려면 각각의 트랜잭션을 격리해야 합니다.
* 지속성 (Durability) : 트랜잭션 완료 후 그 결과는 설령 시스템이 실패 하더라도 살아남아야 합니다. 보통 트랜잭션 결과물은 퍼시스턴스 저장소에 씌어집니다.
* 📜 [Spring AOP Capabilities and Goals](https://docs.spring.io/spring/docs/5.1.0.RELEASE/spring-framework-reference/core.html#aop-introduction-spring-defn)

## 11장. 스프링 배치

## 12장 스프링 NoSQL

## 13장. 스프링 자바 엔터프라이즈 서비스와 원격 기술

## 14장. 스프링 메시징

## 15장. 스프링 인티그레이션

## 16장. 스프링 테스트

## 17장. 그레일즈
