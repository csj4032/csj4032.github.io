---
title: "파이썬 Iteration Protocol"
description: "파이썬의 이터레이션 프로토콜은 __iter__()와 __next__() 메서드를 통해 객체를 순차적으로 탐색할 수 있게 해주는 표준 인터페이스다. 제너레이터는 yield 키워드를 사용해서 메모리 효율적으로 값을 하나"
categories:
 - programming
 - python
source: "https://blog.naver.com/csj4032/223934421842"
---

파이썬의 이터레이션 프로토콜은 __iter__()와 __next__() 메서드를 통해 객체를 순차적으로 탐색할 수 있게 해주는 표준 인터페이스다. 제너레이터는 yield 키워드를 사용해서 메모리 효율적으로 값을 하나씩 생성하는 특별한 이터레이터로, 대용량 데이터나 무한 시퀀스를 처리할 때 매우 유용하다. 이터레이션을 커스터마이징하면 자신만의 클래스에서 for 루프나 next() 함수를 사용할 수 있게 만들 수 있어서 객체의 동작을 세밀하게 제어할 수 있다. 생산자-소비자 패턴과 파이프라인은 제너레이터를 연결해서 데이터를 단계별로 변환하고 처리하는 방식으로, 코드의 가독성과 재사용성을 크게 향상시키며 메모리 사용량도 최적화할 수 있다.

## 1. 기본 원리: 이터레이션 프로토콜

파이썬에서 for 루프가 동작하는 근본적인 원리를 **이터레이션 프로토콜(Iteration Protocol)**이라고 합니다. 어떤 객체가 이 프로토콜을 따르면 **반복 가능한(iterable)** 객체가 된다.

* **이터러블 (Iterable)**: __iter__ 메서드를 가진 객체. for 루프에 사용할 수 있습니다. 리스트, 튜플, 문자열 등이 대표적이다.
* **이터레이터 (Iterator)**: __next__ 메서드를 가진 객체. next() 함수를 호출할 때마다 다음 값을 반환하며, 더 이상 반환할 값이 없으면 StopIteration 예외를 발생시킨다.

## 이터레이션을 직접 구현하는 예시 (클래스 사용):

```python
# 0부터 지정된 숫자까지 세는 카운터 클래스
class NumberCounter:
    def __init__(self, max_num):
        self.max_num = max_num
        self.current = 0

    # for 문이 시작될 때 호출됨
    def __iter__(self):
        # 자기 자신(이터레이터)을 반환
        return self

    # next()가 호출될 때마다 실행됨
    def __next__(self):
        if self.current <= self.max_num:
            result = self.current
            self.current += 1
            return result
        else:
            # 반복이 끝나면 StopIteration 예외 발생
            raise StopIteration

# 사용법
counter = NumberCounter(3)
for num in counter:
    print(num)  # 0, 1, 2, 3이 차례로 출력

# next()로 직접 호출
# counter = NumberCounter(3)
# print(next(counter)) # 0
# print(next(counter)) # 1
```

이처럼 __iter__와 __next__를 직접 구현하는 것은 번거롭다. 이 과정을 매우 간단하게 만들어주는 것이 바로 제너레이터이다.

## 2. 제너레이터

**제너레이터(Generator)**는 이터레이터를 생성해주는 특별한 함수이다. return 대신 yield 키워드를 사용하며, yield를 만날 때마다 함수의 실행을 일시 중지하고 값을 반환한다. 다음에 next()가 호출되면 멈췄던 지점부터 다시 실행된다.

제너레이터는 필요할 때마다 값을 하나씩 생성하기 때문에 메모리를 매우 효율적으로 사용할 수 있다. 대용량 데이터를 처리할 때 모든 값을 메모리에 한 번에 저장하지 않고 필요한 순간에만 생성하므로 시스템 자원을 절약한다. 또한 무한 시퀀스나 매우 큰 범위의 데이터도 메모리 부족 없이 처리할 수 있어서 확장성이 뛰어나다. 코드가 간결하고 읽기 쉬우며, 상태를 자동으로 관리해주기 때문에 복잡한 반복 로직을 단순하게 구현할 수 있다. 이런 특징들로 인해 제너레이터는 파이썬에서 데이터 처리와 성능 최적화에 필수적인 도구가 되었다.

## 제너레이터 함수 예시:

```python
# 위 NumberCounter 클래스와 똑같이 동작하는 제너레이터 함수
def number_generator(max_num):
    print("제너레이터 시작!")
    current = 0
    while current <= max_num:
        # yield를 만나면 값을 반환하고 여기서 실행을 멈춤
        yield current
        current += 1
    print("제너레이터 종료!")

# 사용법
# 제너레이터 함수를 호출하면 제너레이터 객체가 반환됨
gen = number_generator(3)

# for 루프는 자동으로 next()를 호출하고 StopIteration을 처리해 줌
for num in gen:
    print(num)

# 출력 결과:
# 제너레이터 시작!
# 0
# 1
# 2
# 3
# 제너레이터 종료!
```

클래스로 복잡하게 구현했던 것과 달리, yield를 사용하니 코드가 훨씬 간결하고 직관적으로 변했다.

## 3. itertools

itertools 모듈은 파이썬에서 효율적인 반복 작업을 위한 강력한 도구들을 제공하는 표준 라이브러리다. 이 모듈은 무한 이터레이터, 유한 이터레이터, 조합 이터레이터 등 다양한 범주의 함수들을 포함하고 있어서 복잡한 데이터 처리 작업을 간단하게 만들어준다. count(), cycle(), repeat() 같은 무한 이터레이터와 chain(), compress(), dropwhile() 같은 데이터 변환 함수들이 특히 유용하다. 메모리 효율적인 반복 처리가 가능하고, 함수형 프로그래밍 스타일을 지원하여 코드의 가독성과 성능을 동시에 향상시킬 수 있다. 데이터 분석, 알고리즘 구현, 대용량 파일 처리 등에서 itertools는 필수적인 도구로 활용된다.

## itertools.combinations (조합)

리스트에서 순서에 상관없이 **중복을 허용하지 않고** N개의 원소를 뽑는 모든 경우를 계산합니다.

```python
from itertools import combinations

items = ['A', 'B', 'C', 'D']

# items 리스트에서 2개의 원소를 뽑는 모든 조합
result = list(combinations(items, 2))

print(result)
# 출력: [('A', 'B'), ('A', 'C'), ('A', 'D'), ('B', 'C'), ('B', 'D'), ('C', 'D')]
```

## itertools.permutations (순열)

리스트에서 순서를 고려하여 **중복을 허용하지 않고** N개의 원소를 뽑아 나열하는 모든 경우를 계산합니다.

```python
from itertools import permutations

items = ['A', 'B', 'C']

# items 리스트에서 2개의 원소를 뽑아 나열하는 모든 순열
result = list(permutations(items, 2))

print(result)
# 출력: [('A', 'B'), ('A', 'C'), ('B', 'A'), ('B', 'C'), ('C', 'A'), ('C', 'B')]
```

## itertools.product (데카르트 곱)

여러 리스트에서 각각 하나씩 원소를 뽑아 만들 수 있는 모든 경우를 계산합니다. 중첩된 for 루프와 동일한 결과를 냅니다.

```python
from itertools import product

colors = ['빨강', '파랑']
sizes = ['S', 'M', 'L']

# colors와 sizes에서 하나씩 뽑아 만들 수 있는 모든 조합
result = list(product(colors, sizes))

print(result)
# 출력:
# [('빨강', 'S'), ('빨강', 'M'), ('빨강', 'L'), 
#  ('파랑', 'S'), ('파랑', 'M'), ('파랑', 'L')]
```

## itertools.chain (연결)

여러 개의 리스트나 이터레이터를 하나의 리스트처럼 순서대로 연결합니다.

```python
from itertools import chain

list1 = [1, 2, 3]
list2 = ['A', 'B']
list3 = (True, False)

# 여러 리스트를 하나로 연결
result = list(chain(list1, list2, list3))

print(result)
# 출력: [1, 2, 3, 'A', 'B', True, False]
```

## itertools.cycle (순환)

리스트의 원소들을 무한히 반복하는 이터레이터를 만듭니다.

```python
from itertools import cycle

colors = ['빨강', '노랑', '파랑']
color_cycler = cycle(colors)

# cycle 객체는 무한하므로 5번만 출력
for i in range(5):
    print(next(color_cycler))

# 출력:
# 빨강
# 노랑
# 파랑
# 빨강
# 노랑
```

## itertools.zip_longest (긴 쪽 기준 압축)

내장 함수 zip과 유사하지만, 길이가 다른 리스트들을 묶을 때 짧은 쪽이 끝나도 긴 쪽이 끝날 때까지 지정된 값으로 채워서 계속 묶어줍니다.

```python
from itertools import zip_longest

names = ['Alice', 'Bob', 'Charlie']
scores = [95, 80]

# 길이가 다른 두 리스트를 묶음 (빈 값은 None으로 채움)
result_none = list(zip_longest(names, scores))

# 빈 값을 특정 값으로 채우기
result_fill = list(zip_longest(names, scores, fillvalue=0))

print(f"기본값(None)으로 채우기: {result_none}")
print(f"0으로 채우기: {result_fill}")
# 출력:
# 기본값(None)으로 채우기: [('Alice', 95), ('Bob', 80), ('Charlie', None)]
# 0으로 채우기: [('Alice', 95), ('Bob', 80), ('Charlie', 0)]
```

## 4. 데이터 흐름: 생산자, 소비자, 파이프라인

제너레이터는 데이터 파이프라인을 구축하는 데 매우 효과적이다.

* **생산자 (Producer)**: 데이터를 생성하여 yield하는 제너레이터 함수이다.
* **소비자 (Consumer)**: 생산자가 만든 데이터를 사용하는 for 루프나 함수이다.
* **파이프라인 (Pipeline)**: 여러 개의 생산자와 소비자를 연결하여 데이터 흐름을 만드는 것이다.

파이프라인의 가장 큰 장점은 **메모리 효율성**이다. 모든 데이터를 리스트에 담아두는 대신, 필요할 때마다 하나씩 생성하고 처리하여 전달하므로 대용량 데이터를 다룰 때 매우 유리하다.

## 파이프라인 예시:

```sql
# 생산자 1: 파일에서 한 줄씩 읽어옴
def read_lines_from_file(filename):
    with open(filename, 'r') as f:
        for line in f:
            yield line.strip()

# 생산자 2 (처리자): 특정 단어가 포함된 줄만 필터링
def filter_lines(lines_iterator, keyword):
    for line in lines_iterator:
        if keyword in line:
            yield line

# 소비자: 최종 결과를 화면에 출력
def print_lines(lines_iterator):
    for line in lines_iterator:
        print(f"찾은 결과: {line}")

# 가상의 로그 파일 생성
with open("log.txt", "w") as f:
    f.write("INFO: 작업 시작\n")
    f.write("WARN: 메모리 부족 경고\n")
    f.write("INFO: 데이터 처리 중\n")
    f.write("ERROR: 치명적인 오류 발생\n")
    f.write("WARN: 연결 시간 초과\n")

# 파이프라인 연결 및 실행
file_lines = read_lines_from_file("log.txt")
warn_lines = filter_lines(file_lines, "WARN")
print_lines(warn_lines)

# 출력 결과:
# 찾은 결과: WARN: 메모리 부족 경고
# 찾은 결과: WARN: 연결 시간 초과
```

## 5. 제너레이터 심화: send()와 코루틴

제너레이터는 yield로 값을 밖으로 내보낼 뿐만 아니라, send() 메서드를 통해 외부에서 값을 안으로 받을 수도 있다. 이를 통해 제너레이터와 외부 코드가 서로 상호작용하는 **코루틴(Coroutine)**을 만들 수 있다.

* yield가 표현식(received = yield)으로 사용되면, send()로 전달된 값이 received 변수에 저장된다.
* 코루틴을 처음 시작할 때는 next()나 send(None)을 호출하여 첫 번째 yield까지 실행시켜야 한다. 이를 **"프라이밍(priming)"**이라고 한다.

send()**를 이용한 코루틴 예시 (평균 계산기):**

```python
def average_calculator():
    """외부에서 숫자를 받아 실시간으로 평균을 계산하는 코루틴"""
    total = 0.0
    count = 0
    average = None
    while True:
        # yield를 통해 외부에서 값을 받고, 현재 평균을 밖으로 전달
        received_num = yield average
        if received_num is None:
            continue
            
        total += received_num
        count += 1
        average = total / count

# 사용법
avg_coroutine = average_calculator()

# 1. 코루틴 프라이밍 (첫 번째 yield까지 실행)
next(avg_coroutine) 

# 2. send()로 숫자 전달 및 평균 받기
print(f"평균: {avg_coroutine.send(10)}")  # 10을 보내고, 평균(10.0)을 받음
print(f"평균: {avg_coroutine.send(20)}")  # 20을 보내고, 평균(15.0)을 받음
print(f"평균: {avg_coroutine.send(30)}")  # 30을 보내고, 평균(20.0)을 받음
```

이처럼 send()를 사용하면 제너레이터가 단순히 데이터를 생산하는 것을 넘어, 외부와 능동적으로 소통하는 강력한 도구가 될 수 있다.

---

제너레이터와 이터레이터를 사용할 때는 몇 가지 중요한 주의사항이 있다. 제너레이터는 일회용이므로 한 번 소진되면 다시 사용할 수 없어서 재사용이 필요하면 새로 생성해야 한다. 코루틴에서 send() 메서드를 사용하기 전에는 반드시 next()나 send(None)으로 프라이밍을 해야 하며, 이를 빠뜨리면 오류가 발생한다. 무한 제너레이터를 사용할 때는 적절한 종료 조건을 설정하지 않으면 무한 루프에 빠질 수 있으므로 주의가 필요하다. 또

한 제너레이터 내부에서 예외가 발생하면 제너레이터가 종료되므로 예외 처리를 신중하게 고려해야 한다.

파이썬의 이터레이션 프로토콜과 제너레이터는 메모리 효율성과 코드 가독성을 동시에 제공하는 강력한 도구다. 특히 대용량 데이터 처리나 실시간 스트리밍 환경에서 이들의 진가가 발휘되며, itertools 모듈과 함께 사용하면 복잡한 데이터 파이프라인도 우아하게 구현할 수 있다. 생산자-소비자 패턴과 코루틴을 활용하면 비동기적이고 반응형인 프로그램을 만들 수 있어서 현대 파이썬 개발에서 필수적인 기술이 되었다. 이런 기법들을 숙달하면 파이썬의 진정한 힘을 느낄 수 있을 것이다.
