---
title: "파이썬 Iterator, Generator, Coroutine 예외처리"
description: "이전 글에서 다루었던 파이썬 Iterator, Generator, Coroutine [[https://blog.naver.com/csj4032/223936360808](https://blog.naver.com/csj"
categories:
 - programming
 - python
source: "https://blog.naver.com/csj4032/223936858166"
---

이전 글에서 다루었던 **파이썬 Iterator, Generator, Coroutine** [[https://blog.naver.com/csj4032/223936360808](https://blog.naver.com/csj4032/223936360808)]  내용에 이어 각각의 예외처리의 실용적인 처리 방법에 대해서 살펴보겠다.

## 이터레이터 (Iterator)

## StopIteration: 정상적인 종료 신호

**StopIteration** 예외는 이터레이터가 모든 값을 반환했을 때 발생하는 특별한 예외로, 오류가 아닌 정상적인 반복 종료를 의미한다. 파이썬의 for 루프는 이 예외를 자동으로 포착하여 반복을 종료하므로 개발자가 직접 처리할 필요가 없다. 하지만 **next()**함수를 직접 호출할 때는 이 예외를 적절히 처리해야 무한 루프나 프로그램 중단을 방지할 수 있다.

StopIteration은 이터레이터 프로토콜의 핵심 요소로, 이터레이터가 언제 끝나는지를 명확히 알려주는 표준화된 방법이다. 이는 파이썬의 **"명시적인 것이 암시적인 것보다 낫다"**는 철학을 잘 보여주는 예로, 반복의 끝을 특별한 값이나 상태로 표현하는 대신 예외 메커니즘을 활용하여 명확하게 의사소통한다.

## 예시 코드: for 루프와 수동 제어 비교

```python
# 간단한 이터레이터 생성
my_list = [10, 20, 30]
my_iterator = iter(my_list)

# --- 1. for 루프 사용 (자동 처리) ---
print("--- for 루프 (자동으로 StopIteration 처리) ---")
# for 루프는 StopIteration이 발생하면 자동으로 반복을 멈춥니다.
for item in my_list:
    print(item)


# --- 2. while 루프와 next() 사용 (수동 처리) ---
print("\n--- while 루프 (수동으로 StopIteration 처리) ---")
my_iterator = iter(my_list) # 이터레이터를 다시 생성
while True:
    try:
        # next() 함수로 다음 값을 수동으로 가져옴
        item = next(my_iterator)
        print(item)
    except StopIteration:
        # StopIteration 예외가 발생하면 루프를 중단
        print("반복이 종료되었습니다.")
        break
```

## 실행 결과

![예시 코드: for 루프와 수동 제어 비교 실행 결과](/assets/images/posts/2025-07-17-파이썬-Iterator-Generator-Coroutine-예외처리/01.png)

## 사용자 정의 예외: 오류 상황 처리

사용자 정의 예외 처리는 이터레이터가 데이터를 생성하거나 처리하는 과정에서 실제 오류가 발생했을 때 사용된다. 예를 들어 파일을 읽는 이터레이터에서 파일이 손상되었거나, 네트워크 이터레이터에서 연결이 끊어졌거나, 데이터베이스 이터레이터에서 쿼리 오류가 발생한 경우 등이 해당된다. 이런 상황에서는 적절한 예외를 발생시켜 호출자가 문제 상황을 인지하고 대응할 수 있도록 해야 한다.

사용자 정의 예외를 사용할 때는 예외의 종류를 세분화하여 호출자가 상황에 맞는 처리를 할 수 있도록 하는 것이 중요하다. 일시적인 네트워크 오류는 재시도할 수 있지만, 파일 권한 오류나 데이터 형식 오류는 다른 방식으로 처리해야 하기 때문이다.

## 예시 코드: 유효하지 않은 데이터를 만났을 때 오류 발생

아래 예제는 숫자 리스트를 순회하다가 음수를 만나면 **ValueError**를 발생시키는 이터레이터 클래스입니다. 소비자는 이 오류를 감지하고 적절한 조치를 취할 수 있다.

```python
class PositiveNumberIterator:
    """
    양수만 처리하는 이터레이터.
    음수를 만나면 ValueError를 발생시킵니다.
    """
    def __init__(self, data):
        self.data = data
        self.index = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.index >= len(self.data):
            raise StopIteration

        current_value = self.data[self.index]
        self.index += 1

        if current_value < 0:
            # 유효하지 않은 데이터를 만나면 예외를 직접 발생시킴
            raise ValueError(f"유효하지 않은 값: 음수({current_value})는 처리할 수 없습니다.")
        
        return current_value

# 데이터
data_with_error = [10, 25, -5, 40]

# 이터레이터 사용 및 예외 처리
iterator = PositiveNumberIterator(data_with_error)

print("--- 사용자 정의 예외 처리 ---")
try:
    # for 루프 전체를 try 블록으로 감쌈
    for number in iterator:
        print(f"처리된 숫자: {number}")
except ValueError as e:
    # 이터레이터에서 발생한 ValueError를 여기서 잡음
    print(f"\n오류 발생! 작업을 중단합니다.")
    print(f"원인: {e}")
finally:
    print("\n작업이 종료되었습니다.")
```

## 실행 결과

![예시 코드: 유효하지 않은 데이터를 만났을 때 오류 발생 실행 결과](/assets/images/posts/2025-07-17-파이썬-Iterator-Generator-Coroutine-예외처리/02.png)

이처럼 이터레이터 내부에서 발생한 예외는 for 루프를 실행하는 외부 코드 블록으로 전달되어, 프로그램이 비정상적으로 종료되지 않고 오류 상황을 우아하게 처리할 수 있도록 해준다.

## 예외 처리의 설계 원칙

이터레이터에서 예외 처리를 설계할 때는 일관성과 예측 가능성을 고려해야 한다. **StopIteration**은 반복의 정상적인 종료만을 위해 사용하고, 실제 오류 상황에는 의미 있는 이름을 가진 별도의 예외 클래스를 정의하는 것이 좋다. 또한 예외 메시지에는 문제 상황과 가능한 해결 방법에 대한 충분한 정보를 포함해야 한다.

예외가 발생한 후의 이터레이터 상태도 중요한 고려사항이다. 일부 오류는 복구 가능하여 이터레이터가 계속 사용될 수 있지만, 심각한 오류는 이터레이터를 더 이상 사용할 수 없는 상태로 만들 수 있다. 이런 상태 변화를 명확히 문서화하고 일관되게 구현하는 것이 안정적인 이터레이터 설계의 핵심이다.

## 실용적 예외 처리 전략

실제 애플리케이션에서는 이터레이터의 예외 처리를 호출자의 맥락에 맞게 조정하는 것이 중요하다. 배치 처리 시스템에서는 일부 데이터의 오류가 전체 처리를 중단시키지 않도록 예외를 포착하여 로깅하고 계속 진행하는 방식이 적절할 수 있다. 반면 실시간 시스템에서는 데이터 무결성이 중요하므로 오류 발생 시 즉시 처리를 중단하고 알림을 보내는 것이 나을 수 있다.

이터레이터의 예외 처리는 단순히 오류를 잡는 것을 넘어서 시스템의 안정성과 사용자 경험을 결정하는 중요한 요소다. 적절한 예외 설계와 처리를 통해 견고하고 신뢰할 수 있는 데이터 처리 파이프라인을 구축할 수 있다.

## 제너레이터 (Generator)

## 제너레이터 내부에서 예외 처리 (try...except)

제너레이터 함수 안에서 일반 함수처럼 **try...except** 구문을 사용하여 스스로 오류를 처리할 수 있습니다. 이를 통해 특정 데이터 처리 중 오류가 발생하더라도, 전체 작업이 중단되지 않고 다음 작업을 계속 이어갈 수 있다.

## 예시 코드: 숫자 나누기 제너레이터

아래 예제는 숫자 리스트를 받아 10을 각 숫자로 나누는 작업을 수행합니다. 리스트에 0이 포함되어 있어 **ZeroDivisionError**가 발생하지만, 제너레이터가 이를 직접 처리하고 다음 숫자로 넘어간다.

```python
def safe_divider(numbers):
    """
    숫자 리스트를 받아 10을 각 숫자로 나눕니다.
    0으로 나누는 오류는 내부에서 처리합니다.
    """
    print(">> 제너레이터: 안전한 나누기 작업 시작")
    for num in numbers:
        try:
            # 10을 현재 숫자로 나누는 작업을 시도
            result = 10 / num
            yield result
        except ZeroDivisionError:
            # ZeroDivisionError가 발생하면, 오류 메시지를 출력하고 다음 숫자로 넘어감
            print(f">> 제너레이터: 오류! '{num}'(으)로는 나눌 수 없습니다. 건너뜁니다.")
            # 이 경우 아무것도 yield하지 않고 다음 루프로 진행
    print(">> 제너레이터: 모든 작업 완료")

# 데이터
data = [2, 5, 0, 10, 4]

# 제너레이터 사용
print("소비자: 작업 시작")
for value in safe_divider(data):
    print(f"소비자: 결과 {value} 받음")
print("소비자: 작업 종료")
```

## 실행 결과

![예시 코드: 숫자 나누기 제너레이터 실행 결과](/assets/images/posts/2025-07-17-파이썬-Iterator-Generator-Coroutine-예외처리/03.png)

## 제너레이터 외부(소비자)에서 예외 처리

제너레이터 내부에서 처리되지 않은 예외는 제너레이터를 호출한 외부(소비자)로 전파됩니다. 소비자는 **for** 루프 전체를 **try...except** 블록으로 감싸서 제너레이터에서 발생한 오류를 잡아낼 수 있다.

## 예시 코드: 유효성 검사 제너레이터

```python
def process_positive_numbers(numbers):
    """
    양수만 처리하는 제너레이터. 음수를 만나면 오류를 발생시킴.
    """
    print(">> 제너레이터: 양수 처리 시작")
    for num in numbers:
        if num < 0:
            # 유효하지 않은 데이터를 만나면 예외를 발생시킴
            raise ValueError(f"유효하지 않은 값: 음수({num})는 처리할 수 없습니다.")
        yield num * 2
    print(">> 제너레이터: 처리 완료")

# 데이터
data = [10, 20, -5, 30]

# 제너레이터 사용 (소비자 측에서 예외 처리)
print("소비자: 작업 시작")
try:
    for value in process_positive_numbers(data):
        print(f"소비자: 결과 {value} 받음")
except ValueError as e:
    # 제너레이터에서 발생한 ValueError를 여기서 잡음
    print(f"소비자: 오류 발생! 작업을 중단합니다. (원인: {e})")
print("소비자: 작업 종료")
```

## 실행 결과

![예시 코드: 유효성 검사 제너레이터 실행 결과](/assets/images/posts/2025-07-17-파이썬-Iterator-Generator-Coroutine-예외처리/04.png)

## 외부에서 제너레이터 안으로 예외 주입 (.throw())

제너레이터의 **.throw()** 메서드를 사용하면, 소비자가 제너레이터가 멈춰 있는 **yield** 지점으로 예외를 "주입"할 수 있습니다. 이는 외부에서 제너레이터의 실행 흐름을 제어하거나, 작업을 정상적으로 종료시키고 싶을 때 유용합니다. 제너레이터는 주입된 예외를 내부의 **try...except**로 잡을 수 있다.

## 예시 코드: 무한 루프 제너레이터 제어하기

아래 예제는 무한히 실행되는 제너레이터를 외부에서 **GeneratorExit** 예외를 주입하여 안전하게 종료시키는 방법을 보여준다.

```python
def infinite_counter():
    """1씩 무한히 증가하는 카운터 제너레이터"""
    print(">> 제너레이터: 카운터 시작")
    count = 0
    try:
        while True:
            yield count
            count += 1
    except GeneratorExit:
        # .close()가 호출되거나 외부에서 GeneratorExit 예외가 주입되면 실행됨
        print(">> 제너레이터: 종료 신호를 받았습니다. 리소스를 정리합니다.")
    finally:
        # 예외 발생 여부와 상관없이 항상 실행
        print(">> 제너레이터: 최종 마무리 작업 실행.")

# 제너레이터 사용
counter = infinite_counter()
print(f"소비자: {next(counter)} 받음")
print(f"소비자: {next(counter)} 받음")

# .throw()를 사용해 특정 예외를 주입
try:
    # 제너레이터가 멈춰있는 yield 지점으로 예외를 던짐
    counter.throw(ValueError, "외부에서 발생시킨 오류!")
except ValueError as e:
    print(f"소비자: 제너레이터로부터 '{e}' 예외를 다시 받았습니다.")

# .close() 메서드는 내부적으로 GeneratorExit 예외를 주입함
# counter.close()
```

## 실행 결과

![예시 코드: 무한 루프 제너레이터 제어하기 실행 결과](/assets/images/posts/2025-07-17-파이썬-Iterator-Generator-Coroutine-예외처리/05.png)

이처럼 **.throw()**는 제너레이터를 단순한 데이터 생산자를 넘어, 외부와 상호작용하며 실행을 제어할 수 있는 강력한 코루틴으로 만들어주는 핵심 기능 중 하나이다.

## 코루틴 (Coroutine)

## 초기 코루틴 코루틴 내부에서 예외 처리 (try...except)

코루틴은 **.send()**를 통해 받은 값을 처리하는 과정에서 발생할 수 있는 오류를 **try...except**로 직접 처리할 수 있습니다. 이를 통해 잘못된 값이 들어오더라도 코루틴이 중단되지 않고 계속 실행 상태를 유지할 수 있다.

## 예시 코드: 숫자가 아닌 값을 받았을 때 처리하기

아래 코루틴은 숫자를 받아 누적 합계를 계산하지만, 만약 문자열 같은 숫자가 아닌 값이 들어오면 **TypeError**를 잡아서 오류를 알리고 합계에 포함하지 않는다.

```python
def sum_coroutine():
    """
    숫자를 받아 누적 합계를 계산하는 코루틴.
    숫자가 아닌 값이 들어오면 내부에서 예외를 처리합니다.
    """
    print("코루틴: 합계 계산기 시작. 숫자를 보내주세요.")
    total = 0
    try:
        while True:
            # 외부에서 값을 받고, 현재까지의 합계를 반환
            received = yield total
            
            try:
                # 받은 값을 숫자로 변환 시도
                total += int(received)
            except (ValueError, TypeError):
                # 숫자로 변환할 수 없는 값이면 예외 처리
                print(f"코루틴: 경고! 숫자가 아닌 값 '{received}'(이)가 들어왔습니다. 무시합니다.")
    finally:
        print("코루틴: 종료되었습니다.")

# 코루틴 사용
summer = sum_coroutine()
next(summer) # 프라이밍

print(f"현재 합계: {summer.send(10)}")
print(f"현재 합계: {summer.send(20)}")
print(f"현재 합계: {summer.send('hello')}") # 숫자가 아닌 값 보내기
print(f"현재 합계: {summer.send(30)}")

summer.close()
```

## 실행 결과

![예시 코드: 숫자가 아닌 값을 받았을 때 처리하기 실행 결과](/assets/images/posts/2025-07-17-파이썬-Iterator-Generator-Coroutine-예외처리/06.png)

## 초기 코루틴 코루틴 외부(호출자)에서 예외 처리

코루틴 내부에서 처리되지 않은 예외는 **.send()**를 호출한 외부 코드로 전파됩니다. 호출자는 **try...except** 블록으로 **.send()** 호출을 감싸서 코루틴에서 발생한 예외를 처리할 수 있다.

## 예시 코드: 특정 단어를 받으면 종료 예외 발생

아래 코루틴은 문자열을 받다가 **'exit'**라는 특정 단어를 받으면 **RuntimeError**를 발생시켜 종료 신호를 보낸다.

```python
def message_handler_coroutine():
    """
    메시지를 처리하다가 'exit'를 받으면 오류를 발생시키는 코루틴.
    """
    print("코루틴: 메시지 핸들러 시작.")
    while True:
        message = yield
        if message == 'exit':
            raise RuntimeError("종료 명령을 받았습니다.")
        print(f"코루틴: 메시지 '{message}' 처리 완료.")

# 코루틴 사용 및 외부에서 예외 처리
handler = message_handler_coroutine()
next(handler) # 프라이밍

try:
    handler.send("첫 번째 메시지")
    handler.send("두 번째 메시지")
    handler.send("exit") # 이 지점에서 RuntimeError 발생
    handler.send("이 메시지는 처리되지 않습니다.")
except RuntimeError as e:
    # 코루틴에서 발생한 RuntimeError를 여기서 잡음
    print(f"\n호출자: 코루틴에서 오류 발생! (원인: {e})")
finally:
    print("호출자: 작업을 종료합니다.")
```

## 실행 결과

![예시 코드: 특정 단어를 받으면 종료 예외 발생 실행 결과](/assets/images/posts/2025-07-17-파이썬-Iterator-Generator-Coroutine-예외처리/07.png)

## 초기 코루틴 외부에서 코루틴 안으로 예외 주입 (.throw())

호출자는 **.throw()**메서드를 사용하여 코루틴이 멈춰 있는 **yield** 지점으로 예외를 강제로 주입할 수 있습니다. 코루틴은 주입된 예외를 내부의 **try...except** 블록으로 잡아서 특별한 동작(예: 상태 초기화, 리소스 정리)을 수행할 수 있다.

## 예시 코드: 외부에서 상태를 리셋하는 코루틴

```python
# 사용자 정의 예외
class ResetError(Exception):
    pass

def resettable_adder():
    """
    외부에서 ResetError 예외를 주입받으면 합계를 초기화하는 코루틴.
    """
    print("코루틴: 리셋 가능한 합계 계산기 시작.")
    total = 0
    while True:
        try:
            # yield 표현식 전체를 try 블록으로 감쌈
            value = yield total
            if value is not None:
                total += value
        except ResetError:
            # 외부에서 ResetError가 주입되면 합계를 0으로 초기화
            print("코루틴: 리셋 신호를 받았습니다. 합계를 초기화합니다.")
            total = 0

# 코루틴 사용
adder = resettable_adder()
next(adder) # 프라이밍

print(f"현재 합계: {adder.send(10)}")
print(f"현재 합계: {adder.send(20)}")

# .throw()를 사용해 ResetError 예외를 주입
print("\n>> 리셋 예외 주입 <<")
print(f"현재 합계: {adder.throw(ResetError)}") # throw도 값을 반환함

print(f"\n현재 합계: {adder.send(5)}")

adder.close()
```

## 실행 결과

![예시 코드: 외부에서 상태를 리셋하는 코루틴 실행 결과](/assets/images/posts/2025-07-17-파이썬-Iterator-Generator-Coroutine-예외처리/08.png)

이처럼 **yield/send** 기반의 초기 코루틴은 예외 처리를 통해 외부 코드와 정교하게 상호작용하며 복잡한 제어 흐름을 만들어낼 수 있다.

## 기본: 단일 코루틴의 예외 처리

하나의 코루틴을 **await**로 호출할 때는, 일반적인 동기 함수처럼 **try...except**블록으로 감싸서 예외를 처리할 수 있다.

```python
import asyncio

async def risky_operation(should_fail: bool):
    print("위험한 작업을 시작합니다...")
    await asyncio.sleep(1)
    if should_fail:
        raise ValueError("의도적으로 발생시킨 오류입니다!")
    return "작업 성공"

async def main():
    # --- 성공하는 경우 ---
    try:
        result = await risky_operation(should_fail=False)
        print(f"결과: {result}")
    except ValueError as e:
        print(f"오류를 잡았습니다: {e}")

    print("-" * 20)

    # --- 실패하는 경우 ---
    try:
        result = await risky_operation(should_fail=True)
        print(f"결과: {result}")
    except ValueError as e:
        print(f"오류를 잡았습니다: {e}")

asyncio.run(main())
```

## 실행 결과

![기본: 단일 코루틴의 예외 처리 실행 결과](/assets/images/posts/2025-07-17-파이썬-Iterator-Generator-Coroutine-예외처리/09.png)

이처럼 await 호출을 **try** 블록 안에 넣으면 해당 코루틴에서 발생한 예외를 직접 잡아서 처리할 수 있다.

## gather의 기본 동작과 문제점

**asyncio.gather**는 여러 코루틴을 동시에 실행할 때 가장 많이 사용되는 함수지만, 예외 처리에서 중요한 특성을 이해해야 한다. 기본적으로 **gather**는 하나의 작업에서라도 예외가 발생하면 가장 먼저 발생한 예외를 즉시 발생시키고 전체 실행을 중단한다. 이는 "**빠른 실패(fail-fast)**" 원칙에 따른 것이지만 실제 애플리케이션에서는 여러 문제를 야기할 수 있다.

예를 들어 10개의 API 요청 중 하나가 실패했을 때, 나머지 9개의 성공한 요청 결과를 모두 잃어버리게 된다. 또한 이미 시작된 다른 작업들이 완료되지 못한 채 중단되어 리소스가 제대로 정리되지 않을 수 있다. 특히 파일 처리나 데이터베이스 연결 같은 리소스를 다루는 작업에서는 이런 갑작스러운 중단이 심각한 문제를 일으킬 수 있다.

## return_exceptions=True의 중요성

이 문제를 해결하는 핵심은 **return_exceptions=True** 옵션을 사용하는 것이다. 이 옵션을 설정하면 **gather**는 예외가 발생해도 실행을 중단하지 않고 모든 작업이 완료될 때까지 기다린다. 성공한 작업의 결과는 정상적으로 반환되고, 실패한 작업의 결과는 예외 객체 자체가 반환된다.

이 방식의 가장 큰 장점은 부분적인 실패 상황에서도 성공한 작업들의 결과를 활용할 수 있다는 것이다. 예를 들어 여러 외부 API에서 데이터를 수집하는 경우, 일부 API가 실패하더라도 성공한 API들의 데이터는 정상적으로 처리할 수 있다. 또한 모든 작업이 자연스럽게 완료되므로 리소스 정리나 정리 작업(cleanup)도 안전하게 수행될 수 있다.

## 실제 활용에서의 이점

**return_exceptions=True**를 사용하면 예외 처리가 더욱 세밀하고 유연해진다. 각 작업의 결과를 개별적으로 검사하여 성공과 실패를 구분할 수 있고, 실패한 작업에 대해서는 재시도 로직을 구현하거나 대체 데이터를 사용하는 등의 복구 전략을 적용할 수 있다. 이는 실제 운영 환경에서 시스템의 안정성과 복원력을 크게 향상시키는 중요한 패턴이다.

결과적으로 **asyncio.gather**에서 예외 처리의 핵심은 기본 동작의 한계를 이해하고 **return_exceptions=True** 옵션을 적절히 활용하는 것이다. 이를 통해 부분적 실패에도 견고하게 대응할 수 있는 비동기 애플리케이션을 구축할 수 있다.

## 예제 코드: return_exceptions=True 활용

```python
import asyncio

async def job(name: str, delay: int, should_fail: bool):
    await asyncio.sleep(delay)
    if should_fail:
        raise TypeError(f"'{name}' 작업에서 타입 오류 발생!")
    return f"'{name}' 작업 완료"

async def main():
    tasks = [
        job("작업 A (성공)", 2, False),
        job("작업 B (실패)", 1, True),
        job("작업 C (성공)", 3, False)
    ]

    print("여러 작업을 동시에 실행합니다 (return_exceptions=True 사용)")
    
    # return_exceptions=True 옵션으로 모든 작업이 끝날 때까지 기다림
    results = await asyncio.gather(*tasks, return_exceptions=True)

    print("\n--- 모든 작업 결과 ---")
    for result in results:
        # 결과가 예외 객체인지 확인
        if isinstance(result, Exception):
            print(f"처리된 오류: {result} (타입: {type(result)})")
        else:
            print(f"성공적인 결과: {result}")

asyncio.run(main())
```

## 실행 결과

![예제 코드: return_exceptions=True 활용 실행 결과](/assets/images/posts/2025-07-17-파이썬-Iterator-Generator-Coroutine-예외처리/10.png)

이 방식을 사용하면, 일부 작업이 실패하더라도 전체 프로그램이 중단되지 않고, 성공한 작업과 실패한 작업을 모두 확인하여 후속 조치를 취할 수 있다.

## 타임아웃 처리 (asyncio.TimeoutError)

## I/O 작업의 타임아웃 문제

네트워크 요청과 같은 I/O 작업은 본질적으로 예측할 수 없는 지연이 발생할 가능성이 있다. 서버가 응답하지 않거나, 네트워크 연결이 불안정하거나, 원격 서비스가 과부하 상태일 때 요청이 무한정 대기할 수 있다. 이런 상황에서 적절한 타임아웃 처리 없이는 애플리케이션이 멈춘 것처럼 보이거나 리소스가 고갈될 수 있어 사용자 경험과 시스템 안정성에 심각한 영향을 미친다.

특히 웹 애플리케이션이나 API 서버에서는 사용자 요청에 대한 응답 시간이 중요한 성능 지표가 되므로, 외부 서비스 호출이 지연되더라도 일정 시간 내에 응답을 보장해야 한다. 타임아웃 처리는 이런 요구사항을 만족시키는 핵심 기법이다.

## asyncio.wait_for를 활용한 타임아웃

**asyncio.wait_for**는 특정 코루틴에 시간 제한을 걸어주는 가장 기본적인 방법이다. 지정된 시간 내에 작업이 완료되지 않으면 **asyncio.TimeoutError**를 발생시켜 코드가 무한 대기에 빠지는 것을 방지한다. 이 함수는 개별 작업에 대한 타임아웃을 설정할 때 유용하며, 타임아웃이 발생하면 해당 작업을 자동으로 취소하여 리소스를 정리한다.

**wait_for**의 장점은 기존 코루틴을 수정하지 않고도 외부에서 타임아웃을 적용할 수 있다는 점이다. 또한 타임아웃 시간을 동적으로 조정할 수 있어 상황에 따라 유연하게 대응할 수 있다. 예를 들어 중요한 작업에는 더 긴 타임아웃을, 부가적인 작업에는 짧은 타임아웃을 설정하는 것이 가능하다.

## asyncio.timeout의 현대적 접근

**Python 3.11**부터 도입된 **asyncio.timeout**은 컨텍스트 매니저 형태로 타임아웃을 설정하는 더욱 직관적인 방법이다. 이는 여러 작업을 하나의 타임아웃 범위 안에서 실행할 수 있게 해주며, 코드의 가독성을 크게 향상시킨다. 특히 여러 단계로 구성된 복잡한 비동기 작업에서 전체적인 시간 제한을 설정할 때 매우 유용하다.

**asyncio.timeout**은 중첩 사용이 가능하여 세밀한 타임아웃 제어가 가능하고, 예외 처리도 더욱 명확하게 할 수 있다. 또한 타임아웃이 발생했을 때 정확히 어느 지점에서 시간 초과가 일어났는지 파악하기 쉬워 디버깅에도 도움이 된다.

## 실용적 타임아웃 전략

효과적인 타임아웃 처리를 위해서는 적절한 시간 설정과 예외 처리 전략이 중요하다. 너무 짧은 타임아웃은 정상적인 요청도 실패로 만들 수 있고, 너무 긴 타임아웃은 문제 상황에서 빠른 대응을 어렵게 만든다. 일반적으로 외부 API 호출에는 5-30초, 데이터베이스 쿼리에는 1-10초 정도의 타임아웃이 적절하다.

타임아웃이 발생했을 때는 단순히 오류를 반환하는 것보다 재시도 로직, 캐시된 데이터 사용, 기본값 반환 등의 복구 전략을 함께 구현하는 것이 좋다. 이를 통해 일시적인 네트워크 문제나 서버 과부하 상황에서도 애플리케이션이 안정적으로 동작할 수 있다.

```python
import asyncio

async def long_running_task():
    print("오래 걸리는 작업 시작...")
    await asyncio.sleep(5) # 5초가 걸리는 작업
    print("작업 완료!")

async def main():
    try:
        # 2초 안에 작업이 끝나지 않으면 TimeoutError 발생
        await asyncio.wait_for(long_running_task(), timeout=2)
    except asyncio.TimeoutError:
        print("오류: 작업 시간이 초과되었습니다!")

asyncio.run(main())
```

## 실행 결과

![실용적 타임아웃 전략 실행 결과](/assets/images/posts/2025-07-17-파이썬-Iterator-Generator-Coroutine-예외처리/11.png)

## 작업 취소 처리 (asyncio.CancelledError)

## 작업 취소의 필요성

비동기 프로그래밍에서 작업 취소는 시스템의 안정성과 성능을 위해 필수적인 기능이다. 사용자가 웹 페이지를 닫거나, 애플리케이션이 종료되거나, 시스템 리소스가 부족할 때 실행 중인 작업들을 적절히 중단해야 한다. 또한 더 이상 필요하지 않은 백그라운드 작업이나 시간이 오래 걸리는 작업을 중간에 취소함으로써 불필요한 리소스 사용을 방지할 수 있다.

특히 여러 작업을 동시에 실행하는 상황에서는 일부 작업이 완료되면 나머지 작업들을 취소하는 패턴이 자주 사용된다. 예를 들어 여러 미러 서버에서 동일한 파일을 다운로드할 때, 하나의 다운로드가 완료되면 나머지 다운로드 작업들을 취소하여 네트워크 대역폭을 절약할 수 있다.

## asyncio.CancelledError의 동작 원리

**task.cancel()** 메서드가 호출되면 해당 작업에 취소 요청이 전달되지만, 작업이 즉시 중단되는 것은 아니다. 실제 취소는 다음 **await**지점에서 **asyncio.CancelledError** 예외가 발생하는 방식으로 구현된다. 이는 작업이 안전한 지점에서만 중단될 수 있도록 보장하여 데이터 손상이나 리소스 누수를 방지한다.

**CancelledError**는 특별한 예외로, 일반적인 예외와 달리 작업의 비정상적인 종료를 의미하지 않는다. 대신 외부 요청에 의한 정상적인 취소를 나타내며, 적절히 처리되지 않으면 상위 코루틴으로 전파되어 전체 작업이 취소될 수 있다. 따라서 **CancelledError**를 포착하여 필요한 정리 작업을 수행한 후 다시 발생시키는 것이 일반적인 패턴이다.

## 리소스 정리의 중요성

작업이 취소될 때 가장 중요한 것은 사용 중인 리소스를 적절히 정리하는 것이다. 파일 핸들, 데이터베이스 연결, 네트워크 소켓, 메모리 버퍼 등은 작업이 중단되더라도 명시적으로 해제해야 한다. 이러한 정리 작업이 누락되면 시스템 리소스가 고갈되거나 데이터 일관성이 깨질 수 있다.

특히 데이터베이스 트랜잭션이나 파일 쓰기 작업처럼 원자성이 중요한 작업에서는 취소 시점에서 적절한 롤백이나 임시 파일 삭제가 필요하다. 또한 외부 서비스와의 연결이나 잠금(lock) 같은 공유 자원도 다른 작업들이 정상적으로 동작할 수 있도록 즉시 해제해야 한다.

## 효과적인 취소 처리 전략

효과적인 취소 처리를 위해서는 **try-finally**블록이나 컨텍스트 매니저를 활용하는 것이 좋다. 이를 통해 예외 발생 여부와 관계없이 정리 작업이 확실히 실행되도록 보장할 수 있다. 또한 취소 가능한 지점을 적절히 배치하여 사용자 경험을 향상시키는 것도 중요하다.

작업의 성격에 따라 취소 정책을 다르게 적용하는 것도 고려해야 한다. 중요한 데이터 처리 작업은 완료까지 취소를 무시하도록 하고, 사용자 인터페이스 관련 작업은 즉시 응답할 수 있도록 자주 취소를 확인하는 방식으로 구현할 수 있다. 이런 세밀한 제어를 통해 안정성과 반응성을 모두 확보할 수 있는 비동기 애플리케이션을 구축할 수 있다.

````python
async def cleanup_task():
    try:
        print("정리 작업 시작... (5초간 실행)")
        await asyncio.sleep(5)
    except asyncio.CancelledError:
        print("작업이 취소되었습니다. 리소스를 정리합니다.")
        # 여기에 파일 닫기, DB 커넥션 종료 등 필수 정리 코드 작성
        raise # CancelledError는 다시 발생시켜주는 것이 좋음
    finally:
        print("Finally 블록은 항상 실행됩니다.")

async def main():
    task = asyncio.create_task(cleanup_task())
    await asyncio.sleep(1) # 1초 후 작업을 취소
    task.cancel()

    try:
        await task
    except asyncio.CancelledError:
        print("메인에서 작업 취소를 확인했습니다.")

asyncio.run(main())
```finally` 블록은 예외 발생 여부와 상관없이 항상 실행되므로, 리소스 정리는 `finally`에 두는 것이 가장 안전합니다.
````

![효과적인 취소 처리 전략 실행 결과](/assets/images/posts/2025-07-17-파이썬-Iterator-Generator-Coroutine-예외처리/12.png)

---

파이썬의 **Iterator, Generator, Coroutine**에서 예외 처리는 단순히 오류를 잡는 것을 넘어 안정적이고 견고한 애플리케이션을 구축하는 핵심 요소다. 각 기술마다 고유한 예외 처리 패턴과 전략이 있으며, 이를 올바르게 이해하고 적용하는 것이 중요하다.

Iterator에서는 StopIteration과 사용자 정의 예외를 명확히 구분하여 처리해야 하고, **Generator**에서는 내부 처리와 외부 전파, 그리고 .throw() 메서드를 통한 예외 주입까지 다양한 방식을 활용할 수 있다. 현대 **Coroutine**에서는 **asyncio.gathe**r의 **return_exceptions=True** 옵션, 타임아웃 처리, 작업 취소 처리 등을 통해 비동기 환경에서 발생할 수 있는 복잡한 예외 상황들을 효과적으로 관리할 수 있다.

특히 실제 운영 환경에서는 부분적인 실패 상황에서도 시스템이 계속 동작할 수 있도록 하는 복원력 있는 설계가 필요하다. 예외 처리는 이런 복원력을 구현하는 핵심 도구이며, 적절한 예외 처리 전략을 통해 사용자 경험과 시스템 안정성을 모두 향상시킬 수 있다.

이러한 예외 처리 패턴들을 숙달하면 더욱 안정적이고 신뢰할 수 있는 파이썬 애플리케이션을 개발할 수 있을 것이다. 각 상황에 맞는 적절한 예외 처리 방식을 선택하고 일관성 있게 적용하는 것이 좋은 파이썬 개발자가 되는 중요한 단계라고 할 수 있다.
