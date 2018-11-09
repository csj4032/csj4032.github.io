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

## 2장 객체 생성과 파괴

### 아이템 1. 생성자 대신 정적 팩터리 메서드를 고려하라

#### 첫 번째, 이름을 가질 수 있다.

✔ 생성자에 넘기는 매개변수와 생성자 자체만으로는 반환될 객체의 특성을 제대로 설명하지 못한다.
✔ 정적 팩터리는 이름만 잘 지으면 반환될 객체의 특성을 쉽게 표사할 수 있다.
