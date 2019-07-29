---
title: Primavera Chap02
description: 스프링 부트 개발 환경 설정 - 스프링부트로 만드는 커뮤니티 사이트
categories:
- Primavera
- Spring Boot
tags:
 - Spring Boot
comments: true
---

# 스프링 부트 개발 환경
신입 개발자 중 상당수는 스프링 부트를 배우려 한다. 그들에게 작은 도움이나마 되길 바라며 이 책을 집필한다.

## JDK 설치
자바 개발을 위해서는 JDK가 설치가 필요합니다.

1. JDK Download URL에 접속합니다.
  * https://www.oracle.com/technetwork/java/javase/downloads/jdk12-downloads-5295953.html
2. 사용권 계약 동의(Accept License Agreement)를 체크하고 OS 환경에 맞는 설치 파일을 내려 받습니다.

![jdk12-downloads](/assets/images/books/primavera/chap02/jdk12-downloads.png)

## IntelliJ IDEA 설치
* IntelliJ IDEA : [링크](https://www.jetbrains.com/idea/download)

![idea-download](/assets/images/books/primavera/chap02/idea-download.png)

## 스프링 부트 프로젝트 생성
스프링 부트 프로젝트를 생성하는 방법은 여러가지가 존재합니다. 그중에 잡근이 가장 용이한 [Spring Initializr](https://start.spring.io) 사이트를 통한 스프링 부트 프로젝트 생성 방법을 알아 보도록 하겠습니다.
프로젝트는 Gradle Project를 랭귀지는 Java 스프링 부트 버전은 최신 버전(2.1.6)을 선택합니다. 그리고 Project Metadata는 아래 이미지를 참고 하시기 바랍니다.

![Bootstrap your applications](/assets/images/books/primavera/chap02/bootstrap-your-applications.png)

간단한 스프링 부트 (Hello World)를 위한 Dependencies는 Spring Web Starter, Spring Configuration Processor 선택합나다. 선택 방법은 돋보기 모양 아이콘 Search dependencies add 혹은
리스트 모양의 아이콘 Developer Tools 이용하면 됩니다. 필요한 Dependencies를 선택한 후 Generate the project 버튼을 누르고 프로젝트 ZIP 파일을 내려 받습니다.

![dependencies](/assets/images/books/primavera/chap02/dependencies.png)

* Explore the project 메뉴는 프로젝트의 기본적인 형태 및 주요 파일들의 내용을 확인 할 수 있습니다.

## Hello World
Spring Initializr 내려 받은 파일은 적당한 폴더에 암축을 풀고 인텔리제이를 이용해 프로젝트를 Import 합니다. Import 하는 방법은 크게 2가지가 있다.

* File > Open 메뉴를 통한 build.gradle 파일을 선택하는 방법
* File > New > Project From Existing Sources 메뉴를 통한 방법

### Project Import
아래의 순서로 프로젝트를 Import 합니다.
1. File > Open
![file-open](/assets/images/books/primavera/chap02/file-open.png)

2. File Select (build.gradle)
![file-select](/assets/images/books/primavera/chap02/file-select.png)

3. Import Project from Gradle
![project-structure](/assets/images/books/primavera/chap02/import-project-from-gradle.png)

4. Project Structure
![project-structure](/assets/images/books/primavera/chap02/project-structure.png)

### Run
프로젝트가 정상적으로 Import 된 후 HelloApplication 를 Run 시켜줍니다.
1. Run 'HelloApplication'
![file-open](/assets/images/books/primavera/chap02/run-application.png)

2. Console Log
![file-open](/assets/images/books/primavera/chap02/console-log.png)

3. Run/Debug Configuration
![file-open](/assets/images/books/primavera/chap02/run-debug-configuration.png)

# Github
* Source : [링크](https://github.com/csj4032/primavera/tree/master/chap01)

# 참고
* Spring Boot Reference Guide : https://docs.spring.io/spring-boot/docs/current/reference/html/
* Spring Boot CLI Download : https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started-installing-spring-boot.html#getting-started-installing-the-cli
* Building Spring Boot 2 Applications with Gradle : https://guides.gradle.org/building-spring-boot-2-projects-with-gradle/
