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

## 컴파일 과정 및 실행
* 소스코드를 작성
* 컴파일러(Compiler)는 자바 소스코드를 이용하여 클래스 파일을 생성
* 컴파일 된 클래스 파일은 Java VM(Java Virtual Machine)이 인식할 수 있는 바이너리 파일
* Java VM(JVM)은 클래스 파일의 바이너리 코드를 해석하여 프로그램을 수행
* 수행 결과가 컴퓨터에 반영

## JVM

## Garbage Collector

## String, StringBuilder, StringBuffer 차이

## Tread

## TreadLocal

# 개발방법론

## OOP

## AOP

## 디자인페턴

## SOLID

## 추상화

## 정보은닉과 캡슐화 차이

# Database

# Network

## HTTP와 HTTPS 차이 및 S가 보호하는 OSI7계층 위치
* HTTP : 인터넷에서 하이퍼텍스트(hypertext) 문서를 교환하기 위하여 사용되는 통신규약이다. 하이퍼텍스트는 문서 중간중간에 특정 키워드를 두고 문자나 그림을 상호 유기적으로 결합하여 연결시킴으로써, 서로 다른 문서라 할지라도 하나의 문서인 것처럼 보이면서 참조하기 쉽도록 하는 방식을 의미
* HTTPS : 인터넷 상에서 정보를 암호화하는 SSL(Secure Socket Layer) 프로토콜을 이용하여 데이터를 전송하고 있다는 것을 의미
* HTTPS OSI7 계층 위치 : 5계층 (Session) FIFO(파이프), 넷바이오스, SAP, SDP, SSL, TLS

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