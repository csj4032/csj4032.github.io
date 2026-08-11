---
title: "파이썬 List Comprehension"
description: "파이썬의 컴프리헨션(Comprehension)은 반복 가능한 객체(iterable)를 기반으로 새로운 리스트, 딕셔너리, 세트 등을 간결하게 생성하는 기능입니다. 기존의 for 루프와 조건식을 한 줄에 작성하여 가독"
categories:
 - programming
 - python
source: "https://blog.naver.com/csj4032/223927935180"
---

## Comprehension?

파이썬의 컴프리헨션(Comprehension)은 반복 가능한 객체(iterable)를 기반으로 새로운 리스트, 딕셔너리, 세트 등을 간결하게 생성하는 기능입니다. 기존의 for 루프와 조건식을 한 줄에 작성하여 가독성을 높이고 코드를 효율적으로 줄일 수 있는 파이썬의 강력한 문법입니다.

## 리스트 컴프리헨션 (List Comprehension)

리스트 컴프리헨션은 대괄호 []를 사용하여 새로운 리스트를 생성하는 가장 일반적인 컴프리헨션 형태입니다.

## 1. 기본 객체 생성

```python
# 0부터 9까지의 숫자를 제곱하여 새로운 리스트 생성
squares = [x**2 for x in range(10)]
print(squares)
# 출력: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

이 코드는 range(10) 함수를 통해 0부터 9까지의 숫자를 하나씩 가져와서 변수 x에 할당합니다. 그 다음 각 x 값에 대해 제곱 연산(x**2)을 수행하고, 그 결과들을 모아서 새로운 리스트 squares를 만들어냅니다. 기존의 for 루프를 사용하는 것보다 훨씬 간결하면서도 직관적인 코드를 작성할 수 있습니다.

## 2. if 조건식을 이용한 필터링

```python
# 0부터 9까지의 숫자 중 짝수만 제곱하여 리스트 생성
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print(even_squares)
# 출력: [0, 4, 16, 36, 64]
```

리스트 컴프리헨션에서는 for문 뒤에 if 조건식을 추가하여 특정 조건에 맞는 요소들만 선택해서 새로운 리스트를 만들 수 있습니다. 여기서 if x % 2 == 0 조건은 x를 2로 나눈 나머지가 0인 경우, 즉 짝수인 경우에만 참이 됩니다. 따라서 0, 2, 4, 6, 8에 대해서만 제곱 연산을 수행하여 최종 리스트를 구성합니다.

## 3. if-else 조건식을 이용한 값 변경

```python
# 0부터 9까지의 숫자 중 짝수는 그대로, 홀수는 'odd' 문자열로 리스트 생성
mixed_list = [x if x % 2 == 0 else 'odd' for x in range(10)]
print(mixed_list)
# 출력: [0, 'odd', 2, 'odd', 4, 'odd', 6, 'odd', 8, 'odd']
```

조건에 따라 서로 다른 값을 리스트에 추가하고 싶을 때는 for문 앞에 if-else 조건식을 사용합니다. 각 숫자 x를 검사하여 짝수인 경우 그 숫자를 그대로 리스트에 추가하고, 홀수인 경우에는 'odd'라는 문자열을 대신 추가합니다. 중요한 점은 값을 변경하는 if-else 구문은 for문 앞에 위치한다는 것입니다.

## 4. 2중 for문을 사용한 복잡한 데이터 처리

```python
# 2단과 3단의 곱셈 결과를 하나의 리스트로 생성
gugudan = [dan * num for dan in [2, 3] for num in range(1, 10)]
print(gugudan)
# 출력: [2, 4, 6, 8, 10, 12, 14, 16, 18, 3, 6, 9, 12, 15, 18, 21, 24, 27]
```

리스트 컴프리헨션에서는 2중 for문을 사용하여 더 복잡한 데이터 처리를 할 수 있습니다. 먼저 바깥쪽 루프인 for dan in [2, 3]가 실행되어 dan 변수에 2가 할당됩니다. 그 다음 안쪽 루프인 for num in range(1, 10)이 1부터 9까지 차례대로 실행되면서 dan * num의 결과를 리스트에 추가합니다. dan이 2일 때의 모든 작업이 끝나면, 다시 바깥쪽 루프로 돌아가서 dan에 3이 할당되고 안쪽 루프가 다시 반복됩니다.

```python
# 2차원 리스트를 1차원으로 만들기 (Flatten)
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened_list = [element for row in matrix for element in row]
print(flattened_list)
# 출력: [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

이 예시에서는 2차원 리스트를 1차원으로 평평하게 만드는 작업을 수행합니다. 바깥쪽 루프 for row in matrix가 매트릭스의 각 행을 순서대로 꺼내오고, 안쪽 루프 for element in row가 해당 행의 각 요소를 개별적으로 꺼내와서 최종 리스트에 추가합니다.

```python
# 두 팀의 모든 선수 조합으로 가능한 경기 매치업 생성
team_a = ['A1', 'A2']
team_b = ['B1', 'B2']
matches = [(player_a, player_b) for player_a in team_a for player_b in team_b]
print(matches)
# 출력: [('A1', 'B1'), ('A1', 'B2'), ('A2', 'B1'), ('A2', 'B2')]
```

두 개의 리스트에서 모든 요소의 조합을 만드는 경우입니다. team_a에서 'A1'을 먼저 선택한 후, team_b의 모든 요소와 차례로 조합하여 튜플을 만듭니다. 'A1'에 대한 작업이 끝나면 'A2'를 선택하여 동일한 과정을 반복합니다.

## 딕셔너리 컴프리헨션 (Dictionary Comprehension)

딕셔너리 컴프리헨션은 중괄호 {}와 콜론 :을 사용하여 키-값 쌍으로 이루어진 새로운 딕셔너리를 생성하는 방법입니다.

## 1. 기본 객체 생성

```python
# 0부터 4까지의 숫자를 key로, 해당 숫자의 제곱을 value로 하는 딕셔너리 생성
square_dict = {x: x**2 for x in range(5)}
print(square_dict)
# 출력: {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

이 코드는 range(5)를 통해 0부터 4까지의 숫자를 하나씩 꺼내와서 각 숫자 x를 키로 사용하고, 그 숫자의 제곱인 x**2를 값으로 사용하여 딕셔너리를 생성합니다. 결과적으로 각 숫자와 그 제곱값이 쌍을 이루는 딕셔너리가 만들어집니다.

## 2. if 조건식을 이용한 필터링

```python
# 0부터 4까지의 숫자 중, 제곱한 값이 10 미만인 경우만 딕셔너리로 생성
filtered_dict = {x: x**2 for x in range(5) if x**2 < 10}
print(filtered_dict)
# 출력: {0: 0, 1: 1, 2: 4, 3: 9}
```

딕셔너리 컴프리헨션에서도 조건을 추가하여 원하는 키-값 쌍만 선택할 수 있습니다. if x**2 < 10 조건은 제곱한 값이 10보다 작은 경우에만 해당 키-값 쌍을 딕셔너리에 포함시킵니다. 4의 제곱은 16이므로 10 이상이 되어 조건에 맞지 않아 결과 딕셔너리에서 제외됩니다.

## 3. if-else 조건식을 이용한 값 변경

```python
# 0부터 4까지의 숫자 중, 짝수이면 'even', 홀수이면 'odd'를 value로 하는 딕셔너리 생성
type_dict = {x: 'even' if x % 2 == 0 else 'odd' for x in range(5)}
print(type_dict)
# 출력: {0: 'even', 1: 'odd', 2: 'even', 3: 'odd', 4: 'even'}
```

조건에 따라 딕셔너리의 값을 다르게 설정할 수 있습니다. 이 코드에서는 키는 숫자 x로 고정하고, 값은 해당 숫자가 짝수인지 홀수인지에 따라 'even' 또는 'odd' 문자열로 설정합니다.

## 4. 2중 for문을 사용한 딕셔너리 생성

```python
students = ['철수', '영희']
subjects = ['국어', '수학']

# 학생과 과목을 조합하여 점수는 0점으로 초기화한 딕셔너리 생성
score_sheet = {f'{student}_{subject}': 0 for student in students for subject in subjects}
print(score_sheet)
# 출력: {'철수_국어': 0, '철수_수학': 0, '영희_국어': 0, '영희_수학': 0}
```

두 개 이상의 리스트를 조합하여 복잡한 구조의 딕셔너리를 생성할 때 2중 for문이 유용합니다. 바깥쪽 루프 for student in students가 먼저 '철수'를 선택하고, 안쪽 루프 for subject in subjects가 '국어'와 '수학'을 차례로 선택하여 '철수_국어', '철수_수학' 형태의 키를 만듭니다. 철수에 대한 작업이 끝나면 '영희'에 대해서도 동일한 과정을 반복합니다.

## 세트 컴프리헨션 (Set Comprehension)

세트 컴프리헨션은 중괄호 {}를 사용하며, 리스트 컴프리헨션과 유사하지만 중복된 값을 허용하지 않는 세트를 생성합니다.

1. 기본 객체 생성

```python
# 중복을 제거한 나머지 값들의 세트
remainders = {x % 5 for x in range(10)}
print(remainders)
# 출력: {0, 1, 2, 3, 4}
```

이 코드는 0부터 9까지의 숫자를 5로 나눈 나머지 값들로 세트를 만듭니다. 나머지는 0, 1, 2, 3, 4만 가능하므로 중복이 자동으로 제거되어 5개의 요소만 포함하는 세트가 생성됩니다.

## 2. 2중 for문을 사용한 세트 생성

```python
# 두 리스트의 요소를 더한 값들의 집합 (중복 제외)
list1 = [1, 2]
list2 = [1, 2, 3]

sum_set = {x + y for x in list1 for y in list2}
print(sum_set)
# 출력: {2, 3, 4, 5}
```

두 리스트의 모든 요소 조합을 더한 결과로 세트를 만듭니다. 1+2=3과 2+1=3의 결과가 같으므로, 세트의 특성에 따라 최종 결과에는 3이 한 번만 포함됩니다.

## 튜플 생성 (제너레이터 표현식 활용)

파이썬에는 독립된 '튜플 컴프리헨션' 문법이 없습니다. 대신 소괄호 ()를 사용하여 제너레이터 표현식을 만들고, 이를 tuple() 생성자에 전달하여 튜플을 생성할 수 있습니다.

## 1. 기본 튜플 생성

```python
# 제너레이터 표현식을 tuple()로 감싸서 튜플 생성
squares_tuple = tuple(x**2 for x in range(10))
print(squares_tuple)
# 출력: (0, 1, 4, 9, 16, 25, 36, 49, 64, 81)

# 참고: 소괄호만 사용하면 제너레이터가 됩니다
generator_expr = (x**2 for x in range(5))
print(generator_expr)
# 출력: <generator object <genexpr> at 0x...>
```

제너레이터는 모든 값을 메모리에 미리 만들지 않고, 필요할 때마다 값을 생성하여 메모리를 효율적으로 사용할 수 있는 객체입니다. 튜플을 만들려면 반드시 tuple() 함수로 감싸주어야 합니다.

## 2. 2중 for문을 사용한 튜플 생성

```python
# 0~1까지의 x, y 좌표 쌍 생성
coordinates = tuple((x, y) for x in range(2) for y in range(2))
print(coordinates)
# 출력: ((0, 0), (0, 1), (1, 0), (1, 1))
```

2중 for문으로 좌표 쌍 (x, y)를 생성하는 제너레이터를 만든 뒤, tuple()을 통해 최종적으로 튜플 객체를 생성합니다. 결과는 각 좌표가 튜플로 표현된 좌표들의 튜플이 됩니다.

## 고급 활용 예시

## 1. 중첩 리스트 컴프리헨션

```python
# 3x3 행렬을 0으로 초기화하여 생성
matrix = [[0 for col in range(3)] for row in range(3)]
print(matrix)
# 출력: [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
```

바깥쪽 컴프리헨션 [... for row in range(3)]이 세 개의 행을 만들고, 안쪽 컴프리헨션 [0 for col in range(3)]은 각 행에 들어갈 [0, 0, 0] 리스트를 생성합니다. 이는 2중 for문으로 1차원 리스트를 만드는 것과는 다른 결과물인 2차원 리스트를 생성합니다.

## 2. 함수 호출과 함께 사용

```python
def get_length(text):
    return len(text)

words = ['apple', 'banana', 'cherry']
lengths = [get_length(word) for word in words]
print(lengths)
# 출력: [5, 6, 6]
```

컴프리헨션의 표현식 부분에서 함수를 호출하여 결과를 동적으로 생성할 수 있습니다. words 리스트의 각 단어를 get_length() 함수의 인자로 전달하고, 그 반환값으로 새로운 리스트를 구성합니다.

## 3. 2중 for문과 if 조건식 결합

```python
# 두 리스트의 곱셈 결과 중 10 이상인 값만 추출
list1 = [2, 3, 4]
list2 = [1, 2, 3, 4, 5]

products = [x * y for x in list1 for y in list2 if x * y >= 10]
print(products)
# 출력: [10, 12, 12, 15, 16, 20]
```

중첩된 for 루프에 if 조건식을 추가하여 복잡한 조건에 맞는 요소만 추출할 수 있습니다. 두 리스트의 모든 요소 조합을 곱한 후, 그 결과가 10 이상인 경우에만 최종 리스트에 포함시킵니다.

컴프리헨션은 파이썬에서 데이터를 효율적이고 간결하게 처리할 수 있는 강력한 도구입니다. 적절히 활용하면 코드의 가독성과 성능을 동시에 향상시킬 수 있습니다.
