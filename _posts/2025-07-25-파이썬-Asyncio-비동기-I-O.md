---
title: "파이썬 Asyncio 비동기 I/O"
description: "asyncio는 파이썬에서 단일 스레드 기반의 동시성 프로그래밍을 구현하기 위한 표준 라이브러리로, async/await 문법을 통해 비동기 코루틴을 정의하고 실행할 수 있게 한다. 이벤트 루프가 핵심 역할을 담당하"
categories:
 - programming
 - python
source: "https://blog.naver.com/csj4032/223946634973"
---

**asyncio**는 파이썬에서 **단일 스레드 기반의 동시성 프로그래밍**을 구현하기 위한 표준 라이브러리로, async/await 문법을 통해 비동기 코루틴을 정의하고 실행할 수 있게 한다. **이벤트 루프**가 핵심 역할을 담당하여 여러 코루틴들을 스케줄링하고, await 키워드를 만나면 현재 작업을 일시 중지하고 다른 준비된 작업으로 제어권을 전환한다.

이 방식은 **I/O 바운드 작업**(네트워크 요청, 파일 읽기/쓰기, 데이터베이스 쿼리 등)에서 대기 시간을 활용해 다른 작업을 처리함으로써 전체적인 프로그램 효율성을 크게 향상시킨다. 하나의 스레드에서 여러 작업이 **협력적으로** 실행되기 때문에 스레드 생성 비용이나 동기화 문제 없이도 높은 동시성을 달성할 수 있어, 웹 서버나 실시간 애플리케이션 개발에 매우 효과적이다.

## 핵심 개념

asyncio는 몇 가지 핵심적인 개념을 기반으로 동작합니다. **코루틴(Coroutine)**은 async def 키워드로 정의된 특별한 함수로, 일반 함수와 달리 실행 도중에 일시 중지되었다가 나중에 다시 실행될 수 있다. 이는 asyncio 동시성 코드의 가장 기본적인 단위가 된다.

**이벤트 루프(Event Loop)**는 asyncio의 심장과 같은 존재로, 어떤 코루틴을 실행할지 관리하고 스케줄링하는 역할을 담당한다. 현재 실행 중인 코루틴이 await를 만나 멈추면, 이벤트 루프는 다른 대기 중인 코루틴을 찾아 실행한다.

**태스크(Task)**는 코루틴을 이벤트 루프에서 실제로 실행하도록 "예약"한 객체다. **asyncio.create_task()** 함수를 사용하여 코루틴을 태스크로 만들 수 있다.

**async/await 키워드**는 비동기 프로그래밍의 핵심 문법이다. async def는 함수를 코루틴으로 만들고, await는 코루틴의 실행을 일시 중지한 후 뒤에 오는 작업이 완료될 때까지 이벤트 루프에 제어권을 넘긴다. 작업이 완료되면 await 다음 줄부터 실행을 재개한다.

## 코루틴(Coroutine) 상세 설명

**코루틴**은 **async def** 키워드로 정의되는 특별한 함수로, 실행 중에 일시 정지와 재개가 가능한 함수다. 일반 함수는 호출되면 끝까지 실행되어야 하지만, 코루틴은 await 키워드를 만나면 실행을 멈추고 제어권을 이벤트 루프에 양보할 수 있다.

코루틴의 가장 중요한 특징은 **협력적 멀티태스킹**을 구현한다는 점이다. 이는 코루틴이 스스로 적절한 시점에 제어권을 양보함으로써 다른 코루틴들과 CPU 시간을 나누어 사용한다는 의미다. 예를 들어, 네트워크 요청을 기다리는 동안 다른 코루틴이 데이터베이스 쿼리를 처리할 수 있다.

```python
async def fetch_data(url):
    print(f"{url} 요청 시작")
    await asyncio.sleep(2)  # 네트워크 대기 시뮬레이션
    print(f"{url} 응답 완료")
    return f"Data from {url}"
```

코루틴은 호출해도 즉시 실행되지 않고 **코루틴 객체**를 반환한다. 실제 실행을 위해서는 await, asyncio.run(), 또는 태스크로 변환해야 한다. 이러한 지연 실행 방식 덕분에 여러 코루틴을 조합하고 스케줄링할 수 있다.

## 이벤트 루프(Event Loop) 상세 설명

**이벤트 루프**는 asyncio의 핵심 엔진으로, 모든 비동기 작업을 관리하고 조율하는 단일 스레드 기반의 실행 환경이다. 이벤트 루프는 크게 세 가지 주요 역할을 수행한다.

첫째, **코루틴 스케줄링**이다. 실행 가능한 코루틴들을 큐에서 관리하고, 어떤 코루틴을 다음에 실행할지 결정한다. 현재 실행 중인 코루틴이 await를 만나면, 해당 코루틴을 일시 중지시키고 다음 준비된 코루틴을 실행한다.

둘째, **I/O 모니터링**이다. 파일 읽기, 네트워크 요청, 데이터베이스 쿼리 등의 I/O 작업들을 감시하고, 완료된 작업이 있으면 해당 코루틴을 다시 실행 대기열에 추가한다. 이를 통해 I/O 대기 시간을 다른 작업 처리에 활용할 수 있다.

셋째, **콜백 및 타이머 관리**다. 지연된 함수 호출, 주기적 작업, 타임아웃 처리 등을 관리하여 정확한 시점에 해당 작업들이 실행되도록 한다.

```python
# 이벤트 루프의 동작 방식 예시
async def main():
    loop = asyncio.get_event_loop()
    print(f"현재 이벤트 루프: {loop}")
    
    # 여러 코루틴을 동시에 실행
    await asyncio.gather(
        fetch_data("API-1"),
        fetch_data("API-2"),
        fetch_data("API-3")
    )
```

이벤트 루프는 단일 스레드에서 동작하므로 **동기화 문제가 발생하지 않는다**. 또한 **컨텍스트 스위칭 비용이 적어** 수천 개의 동시 연결도 효율적으로 처리할 수 있다.

## 태스크(Task) 상세 설명

**태스크**는 코루틴을 이벤트 루프에서 실제로 실행하기 위해 래핑한 객체다. 코루틴 자체는 단순한 함수 객체이지만, 태스크는 실행 상태, 결과, 예외 등을 관리하는 완전한 실행 단위가 된다.

태스크의 가장 중요한 특징은 **독립적인 실행**이다. 태스크로 만들어진 코루틴은 다른 코루틴의 완료를 기다리지 않고 즉시 이벤트 루프에 스케줄링되어 실행을 시작한다. 이를 통해 진정한 동시성을 구현할 수 있다.

```python
async def long_running_task(name, duration):
    print(f"태스크 {name} 시작")
    await asyncio.sleep(duration)
    print(f"태스크 {name} 완료")
    return f"결과: {name}"

async def main():
    # 태스크 생성 - 즉시 실행 시작
    task1 = asyncio.create_task(long_running_task("A", 2))
    task2 = asyncio.create_task(long_running_task("B", 1))
    task3 = asyncio.create_task(long_running_task("C", 3))
    
    print("모든 태스크 생성 완료")
    
    # 태스크들의 완료를 기다림
    results = await asyncio.gather(task1, task2, task3)
    print(f"모든 결과: {results}")
```

태스크는 실행 상태를 추적할 수 있는 다양한 메서드를 제공한다. **task.done()**으로 완료 여부를 확인하고, **task.result()**로 결과를 얻으며, **task.cancel()**로 실행을 취소할 수 있다. 또한 예외가 발생한 경우 **task.exception()**으로 예외 정보를 확인할 수 있다.

**태스크와 단순 await의 차이점**은 실행 시점에 있다. **await coroutine()**은 해당 코루틴이 완료될 때까지 기다리는 순차적 실행이지만, **asyncio.create_task()**는 코루틴을 즉시 실행하기 시작하는 동시 실행이다. 이러한 차이로 인해 태스크는 여러 작업을 동시에 처리해야 하는 상황에서 필수적인 도구가 된다.

## 동작 방식: 비동기 바리스타 비유

**asyncio**의 동작 원리를 카페 바리스타의 업무 방식으로 비유하면 매우 직관적으로 이해할 수 있다.

## 동기(Synchronous) 바리스타의 문제점

동기 바리스타는 철저히 순차적으로 일한다. 첫 번째 손님이 아메리카노를 주문하면, 주문을 받고 → 원두를 갈고 → 에스프레소를 추출하고(2분 대기) → 물을 넣고 → 포장하고 → 전달하는 모든 과정을 완료해야만 다음 손님을 받는다.

문제는 에스프레소가 추출되는 2분 동안 바리스타가 아무것도 하지 않고 기다린다는 점이다. 뒤에 10명의 손님이 줄을 서 있어도 커피 머신이 작동하는 동안에는 손가락만 빨고 있다. 이는 전체 카페의 효율성을 크게 떨어뜨린다.

```python
# 동기 바리스타 코드
def sync_barista():
    for customer in customers:
        print(f"{customer} 주문 접수")
        time.sleep(2)  # 커피 추출 시간 - 이 동안 아무것도 못함
        print(f"{customer} 커피 완성")
        
# 총 10명 처리 시간: 20분
```

![동기(Synchronous) 바리스타](/assets/images/posts/2025-07-25-파이썬-Asyncio-비동기-I-O/01.png)

## 비동기(Asynchronous) 바리스타의 효율성

비동기 바리스타는 훨씬 영리하게 일한다. A 손님의 아메리카노 주문을 받아 커피 머신 버튼을 누른 후, 커피가 추출되는 동안 기다리지 않고 즉시 B 손님의 주문을 받는다.

핵심은 바리스타가 '**커피 추출 완료**' 알람에 의존한다는 점이다. A 손님의 커피가 다 되면 머신에서 알람이 울리고, 그 순간 바리스타는 현재 하던 일을 잠시 멈추고 A 손님의 커피를 완성하여 전달한다. 그 후 다시 B 손님의 작업으로 돌아간다.

```python
# 비동기 바리스타 코드
async def async_barista():
    tasks = []
    for customer in customers:
        # 각 주문을 태스크로 만들어 동시에 처리 시작
        task = asyncio.create_task(make_coffee(customer))
        tasks.append(task)
    
    # 모든 커피가 완성될 때까지 대기
    await asyncio.gather(*tasks)

async def make_coffee(customer):
    print(f"{customer} 주문 접수")
    await asyncio.sleep(2)  # 커피 추출 - 이 동안 다른 주문 처리 가능
    print(f"{customer} 커피 완성")

# 총 10명 처리 시간: 약 2분 (거의 동시에 처리)
```

## 실제 동작 흐름

비동기 바리스타의 하루 일과를 통해 **asyncio**의 동작 원리를 살펴보자.

오전 9시, A 손님이 아메리카노를 주문하면 바리스타는 즉시 커피 머신을 가동시킨다. 하지만 커피가 추출되기를 기다리지 않고, 바로 B 손님의 라떼 주문을 받기 시작한다. 1분 후 B 손님의 커피 머신도 가동시키고, 다시 기다리지 않고 C 손님의 주문을 받는다.

2분이 지나자 A 손님의 커피가 완성되었다는 알람이 울린다. 바리스타는 즉시 A 손님에게 커피를 전달한 후, 다시 C 손님 주문 처리로 돌아간다. 3분째에는 B 손님의 커피 완성 알람이 울리고, 마찬가지로 즉시 전달한다.

이런 방식으로 바리스타는 커피 추출이라는 대기 시간을 다른 손님 응대에 활용하여, 같은 시간 동안 훨씬 많은 손님을 효율적으로 처리할 수 있다. 핵심은 한 작업이 완료되기를 기다리는 동안 다른 작업을 진행함으로써 전체적인 생산성을 극대화하는 것이다.

![비동기(Asynchronous) 바리스타](/assets/images/posts/2025-07-25-파이썬-Asyncio-비동기-I-O/02.png)

## 비유에서 얻는 핵심 인사이트

* 이벤트 루프 = 바리스타: 모든 작업을 관리하고 조율하는 단일 주체
* await = 커피 머신 알람: 특정 작업 완료를 기다리는 신호
* 코루틴 = 개별 주문 처리 과정: 중간에 멈췄다가 재개 가능한 작업 단위
* I/O 작업 = 커피 추출: 시간이 오래 걸리지만 실제로는 기계가 하는 일

이 비유를 통해 **asyncio**가 왜 I/O 바운드 작업에 효과적인지, 그리고 단일 스레드로도 높은 동시성을 달성할 수 있는지 명확하게 이해할 수 있다. 바리스타가 한 명이지만(단일 스레드) 여러 커피를 동시에 만들 수 있는(동시성) 것과 정확히 같은 원리다.

## 주요 사용처

**asyncio**는 I/O 대기 시간이 긴 작업에서 진가를 발휘하며, 다음과 같은 영역에서 광범위하게 활용된다.

## 네트워크 프로그래밍

**웹 API 클라이언트**에서 **asyncio**는 특히 강력하다. 여러 API 엔드포인트에서 데이터를 동시에 가져올 때, 각 요청의 네트워크 응답을 기다리는 시간을 다른 요청 처리에 활용할 수 있다.

```python
import aiohttp
import asyncio

async def fetch_api_data(session, url):
    async with session.get(url) as response:
        return await response.json()

async def main():
    urls = [
        "https://api.github.com/users/octocat",
        "https://api.github.com/users/defunkt", 
        "https://api.github.com/users/pjhyett"
    ]
    
    async with aiohttp.ClientSession() as session:
        # 3개 API를 동시에 호출
        results = await asyncio.gather(*[
            fetch_api_data(session, url) for url in urls
        ])
    
    print(f"총 {len(results)}개 사용자 정보 수집 완료")
```

**웹 서버**에서도 **asyncio**는 수천 개의 동시 연결을 단일 스레드로 처리할 수 있게 해준다. 각 클라이언트 요청이 데이터베이스 쿼리나 외부 API 호출을 기다리는 동안, 서버는 다른 클라이언트의 요청을 처리할 수 있다.

**데이터베이스 연결**에서는 여러 쿼리를 병렬로 실행하여 전체 응답 시간을 크게 단축시킬 수 있다. 특히 마이크로서비스 아키텍처에서 여러 데이터 소스에서 정보를 수집해야 할 때 매우 효과적이다.

## 실시간 통신

**웹소켓(WebSocket)** 기반 애플리케이션에서 **asyncio**는 필수적이다. 각 클라이언트 연결이 독립적인 코루틴으로 관리되어, 한 클라이언트의 메시지 처리가 다른 클라이언트들의 통신을 차단하지 않는다.

```python
import websockets
import asyncio

async def handle_client(websocket, path):
    print(f"새 클라이언트 연결: {websocket.remote_address}")
    try:
        async for message in websocket:
            # 메시지를 받아 다른 모든 클라이언트에게 브로드캐스트
            await broadcast_message(message)
    except websockets.exceptions.ConnectionClosed:
        print(f"클라이언트 연결 종료: {websocket.remote_address}")

# 여러 클라이언트가 동시에 접속해도 각각 독립적으로 처리
start_server = websockets.serve(handle_client, "localhost", 8765)
asyncio.get_event_loop().run_until_complete(start_server)
```

**채팅 애플리케이션**에서는 수백 명의 사용자가 동시에 메시지를 주고받을 수 있으며, 각 사용자의 메시지 전송이나 파일 업로드가 다른 사용자들의 실시간 통신을 방해하지 않는다.

## 파일 시스템 접근

**대용량 파일 처리**나 **여러 파일 동시 작업**에서 **asyncio**는 상당한 성능 향상을 제공한다. 특히 로그 분석, 데이터 마이그레이션, 배치 처리 작업에서 효과적이다.

```python
import aiofiles
import asyncio

async def process_file(filename):
    async with aiofiles.open(filename, 'r') as file:
        content = await file.read()
        # 파일 내용 처리
        processed = content.upper()
        
    # 처리된 내용을 새 파일로 저장
    async with aiofiles.open(f"processed_{filename}", 'w') as output:
        await output.write(processed)

async def main():
    files = ["file1.txt", "file2.txt", "file3.txt", "file4.txt"]
    
    # 모든 파일을 동시에 처리
    await asyncio.gather(*[process_file(f) for f in files])
    print("모든 파일 처리 완료")
```

## 현대 웹 프레임워크와의 통합

**FastAPI**는 **asyncio**를 완전히 활용하여 설계된 현대적인 웹 프레임워크다. 각 API 엔드포인트가 코루틴으로 구현되어, 데이터베이스 쿼리나 외부 서비스 호출 중에도 다른 요청들을 처리할 수 있다.

```python
from fastapi import FastAPI
import asyncio

app = FastAPI()

@app.get("/users/{user_id}")
async def get_user_info(user_id: int):
    # 여러 데이터 소스에서 동시에 정보 수집
    user_data, posts_data, friends_data = await asyncio.gather(
        fetch_user_from_db(user_id),
        fetch_user_posts(user_id), 
        fetch_user_friends(user_id)
    )
    
    return {
        "user": user_data,
        "posts": posts_data,
        "friends": friends_data
    }
```

**aiohttp**는 클라이언트와 서버 양쪽에서 완전한 비동기 HTTP 처리를 제공한다. 이를 통해 마이크로서비스 간 통신, 대용량 데이터 수집, 부하 테스트 등의 작업을 효율적으로 수행할 수 있다.

이러한 프레임워크들이 **asyncio**를 기반으로 구축된 이유는 **높은 동시성**과 **낮은 리소스 사용량**을 동시에 달성할 수 있기 때문이다. 전통적인 스레드 기반 서버가 각 연결마다 별도 스레드를 생성하는 것과 달리, **asyncio** 기반 서버는 단일 스레드에서 수천 개의 동시 연결을 처리할 수 있어 메모리 사용량과 컨텍스트 스위칭 비용을 크게 절약한다.

---

**asyncio**는 파이썬 프로그래밍에서 **동시성 처리의 패러다임을 바꾼 혁신적인 도구**다. 단일 스레드 환경에서도 수천 개의 I/O 작업을 효율적으로 처리할 수 있게 해주어, 웹 서버, 실시간 애플리케이션, 대용량 데이터 처리 등 다양한 분야에서 놀라운 성능 향상을 제공한다.

특히 **비동기 바리스타 비유**에서 본 것처럼, 대기 시간을 낭비하지 않고 다른 유용한 작업에 활용한다는 핵심 아이디어는 현대 소프트웨어 개발에서 매우 중요한 개념이다. 이벤트 루프가 코루틴들을 조율하고, **await** 키워드가 적절한 시점에 제어권을 양보하며, 태스크가 독립적인 실행 단위로 동작하는 이 모든 과정이 조화롭게 어우러져 높은 효율성을 달성한다.

하지만 **asyncio**는 **만능 해결책이 아니다**. **CPU** 집약적 작업에는 부적합하고, 블로킹 함수 사용 금지, 복잡한 예외 처리, 어려운 디버깅 등의 제약사항들이 있다. 따라서 **asyncio**를 선택하기 전에 **문제의 성격을 정확히 파악**하고, I/O 바운드 작업이 주를 이루는지 신중히 판단해야 한다.

결국 **asyncio**의 진정한 가치는 **적절한 곳에 적절하게 사용할 때** 발휘된다. 네트워크 프로그래밍, 실시간 통신, 대용량 파일 처리 등에서 **asyncio**를 활용하면 기존 동기 방식으로는 불가능했던 수준의 성능과 확장성을 경험할 수 있을 것이다. 현대 파이썬 개발자라면 반드시 익혀야 할 핵심 기술이며, 앞으로도 파이썬 생태계의 발전을 이끌어갈 중요한 도구가 될 것이다.
