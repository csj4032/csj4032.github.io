---
title: "파이썬 둘러보기 Built-in Functions"
description: "Python Built-in Functions는 Python 인터프리터에 기본적으로 내장되어 있어 별도의 import 없이 바로 사용할 수 있는 함수들이다. print(), len(), type(), range(),"
categories:
 - programming
 - python
source: "https://blog.naver.com/csj4032/223923023951"
---

**Python Built-in Functions**는 Python 인터프리터에 기본적으로 내장되어 있어 별도의 import 없이 바로 사용할 수 있는 함수들이다. print(), len(), type(), range(), input() 등 일상적인 프로그래밍에서 자주 사용되는 기본적인 기능들을 제공한다. 데이터 타입 변환(int(), str(), list()), 수학 연산(abs(), max(), min()), 반복 처리(map(), filter(), zip()) 등 다양한 카테고리의 함수들이 포함되어 있다. 이러한 내장 함수들은 Python 프로그래밍의 기초가 되며, 코드의 가독성과 효율성을 높이는 데 핵심적인 역할을 한다.

## 1. 타입 변환 함수 (Type Conversion Functions)

데이터의 타입을 다른 타입으로 변환할 때 사용합니다.

* int(x): x를 정수형으로 변환합니다.

```python
print(int(3.14))    # 결과: 3
print(int("123"))   # 결과: 123
```

* float(x): x를 부동소수점형으로 변환합니다.

```python
print(float(5))     # 결과: 5.0
print(float("3.14")) # 결과: 3.14
```

* str(x): x를 문자열로 변환합니다.

```python
print(str(123))     # 결과: '123'
print(str([1, 2]))  # 결과: '[1, 2]'
```

* list(iterable): 반복 가능한(iterable) 객체를 리스트로 변환합니다.

```python
print(list("hello")) # 결과: ['h', 'e', 'l', 'l', 'o']
print(list((1, 2, 3))) # 결과: [1, 2, 3]
```

* tuple(iterable): 반복 가능한 객체를 튜플로 변환합니다.

```python
print(tuple([1, 2, 3])) # 결과: (1, 2, 3)
print(tuple("abc"))    # 결과: ('a', 'b', 'c')
```

* dict(iterable): (키, 값) 쌍을 가진 반복 가능한 객체를 딕셔너리로 변환합니다.

```python
print(dict([('a', 1), ('b', 2)])) # 결과: {'a': 1, 'b': 2}
print(dict(c=3, d=4))           # 결과: {'c': 3, 'd': 4}
```

* set(iterable): 반복 가능한 객체를 집합(set)으로 변환합니다. 중복을 제거합니다.

```python
print(set([1, 2, 2, 3])) # 결과: {1, 2, 3}
print(set("hello"))    # 결과: {'h', 'e', 'l', 'o'}
```

* bool(x): x를 불리언(True/False) 값으로 변환합니다. (비어있는 컬렉션, 0, None은 False)

```python
print(bool(1))      # 결과: True
print(bool(0))      # 결과: False
print(bool(""))     # 결과: False
print(bool("hello")) # 결과: True
```

* chr(i): 아스키(ASCII) 또는 유니코드(Unicode) 정수 값 i에 해당하는 문자를 반환합니다.

```python
print(chr(65))    # 결과: 'A'
print(chr(97))    # 결과: 'a'
print(chr(44032)) # 결과: '가'
```

* ord(c): 문자 c에 해당하는 아스키 또는 유니코드 정수 값을 반환합니다.

```python
print(ord('A'))   # 결과: 65
print(ord('가'))  # 결과: 44032
```

## 2. 수학 및 숫자 관련 함수 (Math & Numeric Functions)

숫자 연산이나 관련된 작업을 수행합니다.

* abs(x): x의 절댓값을 반환합니다.

```python
print(abs(-5))   # 결과: 5
print(abs(3.14)) # 결과: 3.14
```

* max(iterable) / max(arg1, arg2, ...): 주어진 인자 또는 반복 가능한 객체에서 최댓값을 반환합니다.

```python
print(max(1, 5, 2))      # 결과: 5
print(max([10, 20, 5]))  # 결과: 20
```

* min(iterable) / min(arg1, arg2, ...): 주어진 인자 또는 반복 가능한 객체에서 최솟값을 반환합니다.

```python
print(min(1, 5, 2))      # 결과: 1
print(min([10, 20, 5]))  # 결과: 5
```

* sum(iterable, start=0): 반복 가능한 객체의 모든 항목을 더한 값을 반환합니다. start 값부터 합산을 시작합니다.

```python
print(sum([1, 2, 3]))         # 결과: 6
print(sum([1, 2, 3], 10))     # 결과: 16 (10 + 1 + 2 + 3)
```

* round(number, ndigits=None): number를 반올림하여 반환합니다. ndigits가 주어지면 소수점 ndigits 자리까지 반올림합니다.

```python
print(round(3.14159))    # 결과: 3 (정수로 반올림)
print(round(3.14159, 2)) # 결과: 3.14
```

* pow(base, exp, mod=None): base의 exp 제곱을 계산합니다. mod가 주어지면 결과를 mod로 나눈 나머지를 반환합니다.

```python
print(pow(2, 3))     # 결과: 8 (2의 3승)
print(pow(2, 3, 3))  # 결과: 2 ((2의 3승) % 3 = 8 % 3 = 2)
```

* divmod(a, b): 두 숫자 a를 b로 나눈 몫과 나머지를 튜플 형태로 반환합니다.

```python
print(divmod(10, 3)) # 결과: (3, 1) (몫은 3, 나머지는 1)
```

## 3. 입출력 함수 (I/O Functions)

사용자 입력을 받거나 결과를 출력할 때 사용합니다.

* print(*objects, sep=' ', end='\n', file=sys.stdout, flush=False): 화면에 값을 출력합니다.

```python
print("Hello", "World!") # 결과: Hello World!
print("Python", end=" ") # 결과: Python (줄바꿈 없음)
print("is fun.")         # 결과: is fun.
```

* input(prompt=None): 사용자로부터 입력을 받아 문자열로 반환합니다.

```text
# name = input("이름을 입력하세요: ")
# print(f"안녕하세요, {name}님!")
```

## 4. 컬렉션 및 반복자 함수 (Collection & Iterator Functions)

리스트, 튜플, 문자열 등 컬렉션 객체를 다루거나 반복자와 관련된 작업을 수행합니다.

* len(s): 객체 s의 길이(항목 수)를 반환합니다.

```python
print(len("Python"))    # 결과: 6
print(len([1, 2, 3, 4])) # 결과: 4
```

* sorted(iterable, *, key=None, reverse=False): 반복 가능한 객체의 정렬된 새 리스트를 반환합니다. 원본은 변경하지 않습니다.

```python
my_list = [3, 1, 4, 1, 5]
print(sorted(my_list))           # 결과: [1, 1, 3, 4, 5]
print(sorted(my_list, reverse=True)) # 결과: [5, 4, 3, 1, 1]
```

* reversed(seq): 시퀀스(sequence)의 요소를 역순으로 반복하는 역방향 반복자(iterator)를 반환합니다.

```python
for char in reversed("abc"):
    print(char)
# 결과:
# c
# b
# a
```

* enumerate(iterable, start=0): 반복 가능한 객체의 각 항목에 인덱스를 붙여 (인덱스, 값) 쌍을 반환하는 이터레이터입니다.

```python
fruits = ['apple', 'banana', 'cherry']
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
# 결과:
# 0: apple
# 1: banana
# 2: cherry
```

* zip(*iterables): 여러 반복 가능한 객체의 같은 인덱스에 있는 항목들을 묶어 튜플의 이터레이터를 반환합니다.

```python
names = ['Alice', 'Bob']
scores = [90, 85]
for name, score in zip(names, scores):
    print(f"{name}: {score}")
# 결과:
# Alice: 90
# Bob: 85
```

* all(iterable): 반복 가능한 객체의 모든 요소가 참(True)이면 True를 반환합니다. 비어있는 반복자는 True를 반환합니다.

```python
print(all([True, True, False])) # 결과: False
print(all([1, 2, 3]))          # 결과: True
print(all([]))                 # 결과: True
```

* any(iterable): 반복 가능한 객체의 요소 중 하나라도 참(True)이면 True를 반환합니다. 비어있는 반복자는 False를 반환합니다.

```python
print(any([True, True, False])) # 결과: True
print(any([0, "", False]))     # 결과: False
print(any([]))                 # 결과: False
```

* range(start, stop, step): 지정된 범위의 숫자를 생성하는 이터레이터(range 객체)를 반환합니다.

```python
for i in range(3): # 0, 1, 2
    print(i)
for i in range(1, 5): # 1, 2, 3, 4
    print(i)
for i in range(0, 10, 2): # 0, 2, 4, 6, 8
    print(i)
```

* map(function, iterable): 반복 가능한 객체의 모든 항목에 함수를 적용한 결과를 반환하는 이터레이터입니다.

```python
numbers = [1, 2, 3]
squared_numbers = list(map(lambda x: x*x, numbers))
print(squared_numbers) # 결과: [1, 4, 9]
```

* filter(function, iterable): 함수가 True를 반환하는 반복 가능한 객체의 항목만 걸러내어 반환하는 이터레이터입니다.

```python
numbers = [1, 2, 3, 4, 5]
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(even_numbers) # 결과: [2, 4]
```

## 5. 유틸리티 및 객체 관련 함수 (Utility & Object Functions)

객체의 타입, ID, 속성 등을 확인하거나 조작할 때 사용합니다.

* type(object): 객체의 타입을 반환합니다.

```python
print(type(10))     # 결과: <class 'int'>
print(type("hello")) # 결과: <class 'str'>
```

* id(object): 객체의 고유한 식별자(메모리 주소)를 반환합니다.

```python
a = [1, 2]
b = [1, 2]
c = a
print(id(a))
print(id(b)) # a와 b는 내용이 같아도 다른 객체이므로 ID가 다름
print(id(c)) # c는 a와 같은 객체를 참조하므로 ID가 같음
```

* dir(object): 객체가 가지고 있는 유효한 속성 목록을 반환합니다.

```text
# print(dir([])) # 리스트 객체의 모든 메서드와 속성 출력
# print(dir("hello")) # 문자열 객체의 모든 메서드와 속성 출력
```

* help(object): 객체에 대한 도움말 정보를 출력합니다.

```text
# help(print) # print 함수에 대한 도움말 출력
# help(list)  # list 클래스에 대한 도움말 출력
```

* isinstance(object, classinfo): 객체가 특정 클래스(또는 튜플로 주어진 클래스들)의 인스턴스인지를 확인하여 True/False를 반환합니다.

```python
print(isinstance(10, int))    # 결과: True
print(isinstance("abc", str))  # 결과: True
print(isinstance([], (list, tuple))) # 결과: True
```

* callable(object): 객체가 호출 가능한(함수, 메서드 등) 객체인지 확인하여 True/False를 반환합니다.

```python
def my_func(): pass
x = 10
print(callable(my_func)) # 결과: True
print(callable(x))       # 결과: False
```

* getattr(object, name[, default]): 객체에서 지정된 이름의 속성 값을 가져옵니다. 속성이 없으면 default를 반환하거나 AttributeError를 발생시킵니다.

```python
class MyClass:
    def __init__(self):
        self.value = 10
obj = MyClass()
print(getattr(obj, 'value'))   # 결과: 10
print(getattr(obj, 'non_existent', 'default_val')) # 결과: default_val
```

* setattr(object, name, value): 객체의 지정된 이름 name에 value를 속성으로 설정합니다.

```python
class MyClass: pass
obj = MyClass()
setattr(obj, 'new_attr', 100)
print(obj.new_attr) # 결과: 100
```

* hasattr(object, name): 객체에 지정된 이름의 속성이 있는지 확인하여 True/False를 반환합니다.

```python
class MyClass:
    def __init__(self):
        self.value = 10
obj = MyClass()
print(hasattr(obj, 'value'))      # 결과: True
print(hasattr(obj, 'another_attr')) # 결과: False
```

## 6. 기타 함수 (Miscellaneous Functions)

다양한 용도로 사용되는 내장 함수들입니다.

* open(file, mode='r', ...): 파일을 열고 파일 객체를 반환합니다. 파일을 읽거나 쓸 때 사용합니다.

```sql
with open('my_file.txt', 'w') as f:
     f.write("Hello, Python!")

with open('my_file.txt', 'r') as f:
     content = f.read()
     print(content) # 결과: Hello, Python!
```

* id(object): 객체의 고유 식별자(메모리 주소)를 반환합니다.

```python
a = [1, 2]
b = [1, 2]
print(id(a) == id(b)) # 결과: False (다른 객체)
c = a
print(id(a) == id(c)) # 결과: True (같은 객체 참조)
```

* hash(object): 객체의 해시 값을 반환합니다. 해시 가능한(hashable) 객체(숫자, 문자열, 튜플 등)에만 적용됩니다.

```python
print(hash(123))       # 결과: 123
print(hash("hello"))   # 결과: 특정 정수 값 (실행마다 다를 수 있음)
# print(hash([1, 2]))  # TypeError: unhashable type: 'list' (리스트는 해시 불가)
```

* format(value[, format_spec]): 값을 형식화된 문자열로 변환합니다. str.format()과 유사합니다.

```python
print(format(123.456, ".2f")) # 결과: 123.46 (소수점 둘째 자리까지)
print(format(10, "04d"))     # 결과: 0010 (4자리 정수로, 부족하면 0으로 채움)
```

이 외에도 exec(), eval(), super(), memoryview(), frozenset(), bytearray(), bytes() 등 더 많은 내장 함수들이 존재합니다. 파이썬 문서를 통해 모든 내장 함수에 대한 자세한 설명을 찾아볼 수 있습니다.
