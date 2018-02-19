---
title: Java Developer Interview
description: 자바 개발자 기술 면접 정리
categories:
 - Interviwe
tags:
 - java, os, network, database
---

# OS

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

## 컴파일 과정

## JVM

## Garbage Collector

## String, StringBuilder, StringBuffer 차이

## Tread

## TreadLocal

## 

# 개발방법론

## 디자인페턴

## SOLID

# Database

# Network

## REST API

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