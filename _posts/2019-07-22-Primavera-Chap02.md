---
title: Primavera Chap02
description: 스프링 부트 개발 환경 - 스프링부트로 만드는 커뮤니티 사이트
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
아래의 순서로 프로젝트를 Import 합니다. (모든 인텔리제이 IDE 캡쳐 이미지는 버전에 따라 상이 할 수 있습니다.)
1. File > Open
![File > Open](/assets/images/books/primavera/chap02/file-open.png)

2. File Select (build.gradle)
![File Select](/assets/images/books/primavera/chap02/file-select.png)

3. Import Project from Gradle
![Import Project from Gradle](/assets/images/books/primavera/chap02/import-project-from-gradle.png)

4. Project Structure
![Project Structure](/assets/images/books/primavera/chap02/project-structure.png)

### Run
프로젝트가 정상적으로 프로젝트가 Import 된 후 HelloApplication 를 Run 시켜줍니다. 정상적으로 스프링 부트 서비스가 구동된다면 아래 2번의 이미지와 같은 로그를 확인 할 수 있습니다.

```java
package com.genius.primavera;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HelloApplication {

	public static void main(String[] args) {
		SpringApplication.run(HelloApplication.class, args);
	}
}
```

2. Console Log
![Console Log](/assets/images/books/primavera/chap02/console-log.png)

3. Run/Debug Configuration
![Run/Debug Configuration](/assets/images/books/primavera/chap02/run-debug-configuration.png)

### Run With Terminal
터미널이 조금 더 익숙한 개발자라면 아래 명령으로 스프링 부트를 서비스를 구동 시킬 수도 있습니다.

```console
 ~$ ./gradlew build && java -jar build/libs/hello-0.0.1-SNAPSHOT.jar
```

### 스프링 부트는 어떻게 실행 되는가?
스프링 부트는 어떤 과정을 거처 웹 브라우저에 'Hello World' 를 출력하는지 차근차근 알아보겠습니다.

HelloApplication 클래스의 main 메서드를 시작으로 SpringApplication 클래스 run 메소드를 실행 시킨다. run 메소드에는 스프링 어플리케이션을 실행 시키며 새로운 ApplicationContext 객체를 반환합니다.

SpringApplication 클래스의 내부 구현을 확인해보면 SpringApplication 클래스의 생성자 메소드에서 SpringFactoriesLoader를 이용하여 META-INF/spring.factories 파일 내부의 org.springframework.context.ApplicationListener의 값들을 읽어 드리는 것을 확인 할 수 있다.

로드된 ApplicationListener들은 스프링 부트 어플리케이션이 시작될 때 구현 해야할 코드를 담고 있다. 스프링의 Events에 대한 내용은 아래 링크를 참고 하기 바랍니다.

> ApplicationListener 종류

| 이름 | 설명 |
| --- | --- |
| ClearCachesApplicationListener | 컨텍스트가 로드되면 캐시를 정리하는 ApplicationListener. |
| ParentContextCloserApplicationListener | 상위 항목이 닫힌 경우 응용 프로그램 컨텍스트를 닫는 Listener.  |
| FileEncodingApplicationListener | 시스템 파일 인코딩이 환경에서 설정된 예상 값과 일치하지 않을 경우 응용 프로그램 시작을 중지하는 ApplicationListener. |
| AnsiOutputApplicationListener | spring.output.ansi.enabled 속성 값에 따라 AnsiOutput을 구성하는 ApplicationListener.  |
| ConfigFileApplicationListener | 잘 알려진 파일 위치에서 속성을 로드하여 컨텍스트 환경을 구성하는 EnvironmentPostProcessor. <br/> 기본적으로 속성은 다음 위치에 있는 'application.properties' 및/또는 'application.yml' 파일에서 로드된다. |
| DelegatingApplicationListener | context.listener.classes 환경 특성에 지정된 다른 리스너에게 위임하는 ApplicationListener. |
| ClasspathLoggingApplicationListener | DEBUG 레벨에서 스레드 컨텍스트 클래스 로더 (TCCL)의 클래스 경로를 로깅하여 ApplicationEnvironmentPreparedEvent 환경 준비 이벤트 및 ApplicationFailedEvent에 응답하는 SmartApplicationListener. |
| LoggingApplicationListener | LoggingSystem을 구성하는 ApplicationListener. |
| LiquibaseServiceLocatorApplicationListener | liquibase ServiceLocator를 Spring Boot 실행 파일 아카이브와 작동하는 버전으로 바꾸는 ApplicationListener. |

> SpringApplication 클래스 생성자

```java
/**
	 * Create a new {@link SpringApplication} instance. The application context will load
	 * beans from the specified primary sources (see {@link SpringApplication class-level}
	 * documentation for details. The instance can be customized before calling
	 * {@link #run(String...)}.
	 * @param resourceLoader the resource loader to use
	 * @param primarySources the primary bean sources
	 * @see #run(Class, String[])
	 * @see #setSources(Set)
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
		this.resourceLoader = resourceLoader;
		Assert.notNull(primarySources, "PrimarySources must not be null");
		this.primarySources = new LinkedHashSet<>(Arrays.asList(primarySources));
		this.webApplicationType = WebApplicationType.deduceFromClasspath();
		setInitializers((Collection) getSpringFactoriesInstances(ApplicationContextInitializer.class));
		setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));
		this.mainApplicationClass = deduceMainApplicationClass();
	}
```

> spring.factories 파일 내부 (org.springframework.context.ApplicationListener)

```java
# Application Listeners
org.springframework.context.ApplicationListener=\
org.springframework.boot.ClearCachesApplicationListener,\
org.springframework.boot.builder.ParentContextCloserApplicationListener,\
org.springframework.boot.context.FileEncodingApplicationListener,\
org.springframework.boot.context.config.AnsiOutputApplicationListener,\
org.springframework.boot.context.config.ConfigFileApplicationListener,\
org.springframework.boot.context.config.DelegatingApplicationListener,\
org.springframework.boot.context.logging.ClasspathLoggingApplicationListener,\
org.springframework.boot.context.logging.LoggingApplicationListener,\
org.springframework.boot.liquibase.LiquibaseServiceLocatorApplicationListener
```

# Github
* Source : [링크](https://github.com/csj4032/primavera/tree/master/hello)

# 참고
* Spring Boot Reference Guide : https://docs.spring.io/spring-boot/docs/current/reference/html/
* Spring Boot CLI Download : https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started-installing-spring-boot.html#getting-started-installing-the-cli
* Building Spring Boot 2 Applications with Gradle : https://guides.gradle.org/building-spring-boot-2-projects-with-gradle
* Spring Events : https://www.baeldung.com/spring-events
