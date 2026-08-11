---
title: "파이썬 둘러보기 Standard Library"
description: "파이썬 표준 라이브러리(Python Standard Library)는 파이썬을 설치할 때 기본으로 함께 제공되는 방대한 모듈의 집합이다. 이 라이브러리 덕분에 개발자는 운영체제 인터페이스, 웹 통신, 파일 처리 등 "
categories:
 - programming
 - python
source: "https://blog.naver.com/csj4032/223924524629"
---

파이썬 **표준 라이브러리(Python Standard Library)**는 파이썬을 설치할 때 기본으로 함께 제공되는 방대한 모듈의 집합이다. 이 라이브러리 덕분에 개발자는 운영체제 인터페이스, 웹 통신, 파일 처리 등 매우 다양한 종류의 일반적인 프로그래밍 작업을 별도의 설치 없이 즉시 수행할 수 있다. 파이썬의 "**배터리가 포함된(batteries-included)**" 철학을 대표하는 핵심 요소다.

다음은 파이썬 표준 라이브러리의 여러 모듈을 활용한 간단한 예시 코드입니다. 이 코드 하나로 파일 시스템 제어, 시간 확인, 웹 데이터 요청, 데이터 파싱, 무작위 선택 등 다양한 작업을 수행할 수 있다.

```sql
# 표준 라이브러리의 여러 모듈을 가져옵니다.
import os
import datetime
import json
import urllib.request
import random

print("--- 파이썬 표준 라이브러리 예시 코드 ---")

# 1. os 모듈: 파일 시스템 다루기 📂
print("\n## 1. os 모듈 예시 ##")
# 현재 디렉터리의 파일 및 폴더 목록을 출력합니다.
try:
    file_list = os.listdir('.')
    print(f"현재 디렉터리('.')의 내용: {file_list[:5]} ...") # 너무 길 수 있으니 5개만 출력
except Exception as e:
    print(f"파일 목록을 가져오는 데 실패했습니다: {e}")

# 2. datetime 모듈: 날짜와 시간 다루기 ⏰
print("\n## 2. datetime 모듈 예시 ##")
# 현재 날짜와 시간을 가져옵니다.
now = datetime.datetime.now()
# 원하는 형식으로 시간을 문자열로 변환합니다.
formatted_time = now.strftime("%Y년 %m월 %d일 %H시 %M분")
print(f"현재 시각: {formatted_time}")

# 3. urllib와 json 모듈: 웹 데이터 요청 및 처리 🌐
print("\n## 3. urllib & json 모듈 예시 ##")
# 테스트용 공개 API에 HTTP GET 요청을 보냅니다.
url = "https://jsonplaceholder.typicode.com/todos/1"
try:
    with urllib.request.urlopen(url) as response:
        # 응답 데이터를 읽고 UTF-8로 디코딩합니다.
        data_str = response.read().decode('utf-8')
        # JSON 문자열을 파이썬 딕셔너리로 변환합니다.
        todo_item = json.loads(data_str)
        print(f"웹에서 받아온 데이터: {todo_item}")
        print(f"할 일(title): {todo_item['title']}")
except Exception as e:
    print(f"웹 요청에 실패했습니다: {e}")

# 4. random 모듈: 무작위 데이터 생성 🎲
print("\n## 4. random 모듈 예시 ##")
# 주어진 리스트에서 무작위로 하나의 요소를 선택합니다.
fruits = ["사과", "바나나", "딸기", "오렌지", "포도"]
chosen_fruit = random.choice(fruits)
print(f"과일 목록: {fruits}")
print(f"무작위로 선택된 과일: {chosen_fruit}")

# 1부터 100 사이의 무작위 정수를 생성합니다.
random_number = random.randint(1, 100)
print(f"1부터 100 사이의 무작위 숫자: {random_number}")
```

이 코드는 **os** 모듈을 사용해 현재 디렉터리에 어떤 파일들이 있는지 목록을 가져오고, **datetime** 모듈로 지금의 날짜와 시각을 얻어와 '년-월-일 시:분'과 같은 특정 형식의 문자열로 변환하며, **urllib**와 **json** 모듈을 연동하여 웹 API로부터 받은 **JSON** 데이터를 파이썬 딕셔너리 객체로 손쉽게 파싱하고, 마지막으로 **random** 모듈을 통해 주어진 리스트에서 임의의 항목을 고르거나 특정 범위의 숫자를 생성하는 등 파이썬 표준 라이브러리가 제공하는 다채로운 핵심 기능들을 하나의 예제 안에서 통합적으로 보여준다.
