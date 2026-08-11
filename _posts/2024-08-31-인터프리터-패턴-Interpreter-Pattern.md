---
title: "인터프리터 패턴 (Interpreter Pattern)"
description: "인터프리터 패턴(Interpreter Pattern)은 언어의 문법을 정의하고, 이를 이용해 문장을 해석하는 디자인 패턴이다. 이 패턴은 문법 규칙을 클래스로 표현하고, 이를 사용하여 언어의 문장을 해석하거나 평가할"
categories:
 - programming
 - design-pattern
source: "https://blog.naver.com/csj4032/223567385197"
---

인터프리터 패턴(Interpreter Pattern)은 **언어의 문법을 정의하고, 이를 이용해 문장을 해석**하는 디자인 패턴이다. 이 패턴은 문법 규칙을 클래스로 표현하고, 이를 사용하여 언어의 문장을 해석하거나 평가할 수 있도록 합니다. 인터프리터 패턴은 주로 **간단한 언어나 표현식을 파싱하고 평가**해야 하는 경우에 사용된다.

## "언어의 미로에서 의미의 실을 풀어내는 지혜의 등불"

인터프리터 패턴(Interpreter Pattern)은 다음과 같은 상황에서 유용하게 사용될 수 있습니다:

  1. **특정 도메인 언어를 해석할 필요가 있을 때**:
    * 도메인 특정 언어(DSL, Domain-Specific Language)를 설계하고, 그 언어로 작성된 표현식을 해석해야 할 때 인터프리터 패턴이 유용합니다. 이러한 언어는 특정 문제를 해결하기 위해 설계된 간단한 언어로, 인터프리터 패턴을 사용해 그 언어의 문법을 정의하고 해석할 수 있습니다. SQL과 같은 쿼리 언어, 간단한 수학 표현식 계산기, 간단한 스크립트 언어 등이 이에 해당됩니다.
  2. **자주 변하는 규칙이나 문법을 처리해야 할 때**:
    * 규칙이나 문법이 자주 변경되거나 확장될 필요가 있는 경우, 인터프리터 패턴은 유연성을 제공합니다. 새로운 규칙을 추가하려면 새로운 표현 클래스만 추가하면 되므로, 변경에 따른 유지보수가 용이합니다. 비즈니스 규칙을 표현하는 시스템에서, 규칙이 자주 변경될 때 인터프리터 패턴을 사용하면 규칙을 쉽게 수정하거나 확장할 수 있습니다.
  3. **복잡한 문법 구조를 객체로 표현해야 할 때**:
    * 인터프리터 패턴은 문법을 객체 구조로 표현하기 때문에, 복잡한 문법을 명확하고 체계적으로 표현할 수 있습니다. 이를 통해 문법의 해석 과정을 더 잘 이해하고 관리할 수 있습니다. 컴파일러에서 추상 구문 트리(AST)를 구성하고 이를 해석하는 경우, 인터프리터 패턴을 사용해 문법 규칙을 객체로 표현하고 관리할 수 있습니다.
  4. **언어 해석이 자주 필요하지만 성능이 크게 중요하지 않은 경우**:
    * 인터프리터 패턴은 반복적으로 문장을 해석하거나 평가할 필요가 있지만, 성능이 크게 중요하지 않은 상황에서 적합하다. 자주 사용되거나 복잡한 규칙을 처리할 때는 성능이 문제가 될 수 있으나, 간단한 언어나 규칙을 해석할 때는 효율적으로 사용할 수 있다. 간단한 스크립트 언어를 해석하여 실행하는 경우, 성능보다는 해석의 유연성이 더 중요할 때 유용하다.

## 장점

  1. **문법의 표현과 관리가 용이함**
    * 인터프리터 패턴은 문법을 객체로 표현하기 때문에 복잡한 문법 규칙을 명확하게 관리할 수 있다. 각 규칙이 별도의 클래스로 표현되며, 이를 통해 문법의 구조를 잘 이해하고 유지보수할 수 있다.
  2. **유연한 확장성**
    * 새로운 문법 규칙이 필요할 때마다 새로운 클래스를 추가하는 방식으로 패턴을 확장할 수 있다. 기존 코드에 최소한의 변경만으로 기능을 확장할 수 있으므로 유연성이 매우 높다.
  3. **코드 재사용성**
    * 각 문법 규칙이 개별 클래스로 캡슐화되어 있으므로, 동일한 규칙을 여러 곳에서 재사용할 수 있다. 이를 통해 코드 중복을 줄이고 유지보수성을 높일 수 있다.
  4. **직관적인 문법 표현**
    * 문법 규칙을 객체로 표현함으로써, 문법 구조를 직관적으로 이해할 수 있다. 패턴 자체가 문법의 구조를 반영하므로, 코드가 문법을 쉽게 나타낼 수 있다.

## 단점

  1. **복잡성 증가**
    * 문법이 복잡해질수록 클래스의 수가 급격히 증가하게 된다. 이는 코드베이스의 복잡성을 증가시키고, 유지보수의 어려움을 초래할 수 있다. 특히, 복잡한 문법을 해석해야 하는 경우 수많은 클래스가 생성되어 관리가 어려워질 수 있다.
  2. **성능 문제**
    * 인터프리터 패턴은 해석 중 많은 객체 생성과 메서드 호출을 필요로 하며, 이는 성능 저하로 이어질 수 있다. 특히 대규모 데이터나 복잡한 표현식을 해석할 때 성능이 큰 문제가 될 수 있다.
  3. **유지보수의 어려움**
    * 문법이 복잡해지면, 이를 표현하는 클래스 계층도 복잡해진다. 이러한 복잡한 클래스 계층은 유지보수가 어려워질 수 있으며, 새로운 기능을 추가하거나 기존 기능을 수정할 때 오류가 발생할 가능성이 높아진다.
  4. **메모리 사용량 증가**
    * 인터프리터 패턴은 많은 객체를 생성하므로, 메모리 사용량이 증가할 수 있다. 특히, 수많은 표현식이나 문장을 동시에 해석해야 하는 경우, 메모리 사용량이 급증할 수 있다.

**인터프리터패턴(InterpreterPattern)을 사용한 예제:**

이 예제에서는 SQL의 일부 기능을 해석하는 간단한 SQL 해석기를 구현

```sql
SELECT name, age FROM users WHERE age > 30 AND city = 'New York'
```

```java
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

// Context 클래스: 해석에 필요한 데이터베이스
class Context {
    private List<Row> data;

    public Context(List<Row> data) {
        this.data = data;
    }

    public List<Row> getData() {
        return data;
    }
}

// Row 클래스: 테이블의 한 행을 나타냄
class Row {
    String name;
    int age;
    String city;

    public Row(String name, int age, String city) {
        this.name = name;
        this.age = age;
        this.city = city;
    }

    @Override
    public String toString() {
        return "Row{name='" + name + "', age=" + age + ", city='" + city + "'}";
    }
}

// Abstract Expression
interface Expression {
    List<Row> interpret(Context context);
}

// Terminal Expression: SELECT
class SelectExpression implements Expression {
    private String[] columns;
    private Expression fromExpression;

    public SelectExpression(String[] columns, Expression fromExpression) {
        this.columns = columns;
        this.fromExpression = fromExpression;
    }

    @Override
    public List<Row> interpret(Context context) {
        List<Row> rows = fromExpression.interpret(context);
        // 이 예제에서는 모든 컬럼을 반환하는 단순한 SELECT 구현
        return rows.stream().map(row -> new Row(row.name, row.age, row.city)).collect(Collectors.toList());
    }
}

// Non-Terminal Expression: FROM
class FromExpression implements Expression {
    private String table;
    private Expression whereExpression;

    public FromExpression(String table, Expression whereExpression) {
        this.table = table;
        this.whereExpression = whereExpression;
    }

    @Override
    public List<Row> interpret(Context context) {
        // 이 예제에서는 'users' 테이블이 고정되어 있음
        if ("users".equalsIgnoreCase(table)) {
            return whereExpression.interpret(context);
        }
        return new ArrayList<>();
    }
}

// Non-Terminal Expression: WHERE
class WhereExpression implements Expression {
    private Expression conditionExpression;

    public WhereExpression(Expression conditionExpression) {
        this.conditionExpression = conditionExpression;
    }

    @Override
    public List<Row> interpret(Context context) {
        return context.getData().stream().filter(row -> conditionExpression.interpret(context).contains(row)).collect(Collectors.toList());
    }
}

// Terminal Expression: 조건
class ConditionExpression implements Expression {
    private String column;
    private String operator;
    private String value;

    public ConditionExpression(String column, String operator, String value) {
        this.column = column;
        this.operator = operator;
        this.value = value;
    }

    @Override
    public List<Row> interpret(Context context) {
        return context.getData().stream().filter(row -> {
            switch (column.toLowerCase()) {
                case "age":
                    return evaluateCondition(row.age);
                case "city":
                    return evaluateCondition(row.city);
                default:
                    return false;
            }
        }).collect(Collectors.toList());
    }

    private boolean evaluateCondition(int fieldValue) {
        int intValue = Integer.parseInt(value);
        switch (operator) {
            case ">":
                return fieldValue > intValue;
            case "<":
                return fieldValue < intValue;
            case "=":
                return fieldValue == intValue;
            default:
                return false;
        }
    }

    private boolean evaluateCondition(String fieldValue) {
        switch (operator) {
            case "=":
                return fieldValue.equals(value);
            default:
                return false;
        }
    }
}

// AND Expression
class AndExpression implements Expression {
    private Expression leftExpression;
    private Expression rightExpression;

    public AndExpression(Expression leftExpression, Expression rightExpression) {
        this.leftExpression = leftExpression;
        this.rightExpression = rightExpression;
    }

    @Override
    public List<Row> interpret(Context context) {
        List<Row> leftResult = leftExpression.interpret(context);
        List<Row> rightResult = rightExpression.interpret(context);
        return leftResult.stream().filter(rightResult::contains).collect(Collectors.toList());
    }
}

// 클라이언트 코드
public class InterpreterPatternSQLExample {
    public static void main(String[] args) {
        // 데이터 생성
        List<Row> data = new ArrayList<>();
        data.add(new Row("John", 25, "New York"));
        data.add(new Row("Jane", 35, "New York"));
        data.add(new Row("Doe", 45, "Chicago"));
        data.add(new Row("Smith", 55, "New York"));
        data.add(new Row("Emily", 30, "Los Angeles"));

        Context context = new Context(data);

        // SQL 해석: SELECT name, age FROM users WHERE age > 30 AND city = 'New York'
        Expression expression = new Se
```

![](/assets/images/posts/2024-08-31-인터프리터-패턴-Interpreter-Pattern/01.png)

## 코드 설명

  1. **Context 클래스:**
    * Context는 데이터베이스처럼 동작하며, 쿼리가 적용될 데이터를 제공한다. 이 예제에서는 users 테이블을 데이터로 사용한다.
  2. **Row 클래스:**
    * Row 클래스는 테이블의 한 행을 나타내며, 이름(name), 나이(age), 도시(city) 필드를 포함한다.
  3. **Expression 인터페이스 (Abstract Expression):**
    * 모든 표현식의 기본 인터페이스로, interpret 메서드를 정의한다. 이 메서드는 주어진 문맥(Context)에서 표현식을 해석한다.
  4. **SelectExpression (Terminal Expression):**
    * SELECT 구문을 표현하는 클래스이다. 이 클래스는 선택된 컬럼을 반환하는 역할을 하지만, 이 예제에서는 단순히 전체 행을 반환하도록 구현되었다.
  5. **FromExpression (Non-Terminal Expression):**
    * FROM 구문을 표현하는 클래스이다. 현재 이 예제에서는 "users" 테이블만 처리하도록 하드코딩되어 있으며, WHERE 절이 있는 경우 이를 통해 필터링된 데이터를 반환한다.
  6. **WhereExpression (Non-Terminal Expression):**
    * WHERE 구문을 처리하는 클래스입니다. 조건 표현식(ConditionExpression)으로 필터링된 결과를 반환한다.
  7. **ConditionExpression (Terminal Expression):**
    * WHERE 절의 조건을 처리하는 클래스이다. 특정 컬럼에 대해 주어진 조건을 평가하여, 조건에 맞는 행을 필터링한다.
  8. **AndExpression (Non-Terminal Expression):**
    * AND 연산을 처리하는 클래스이다. 두 개의 조건을 AND 연산자로 결합하여, 두 조건 모두 만족하는 행을 반환한다.
  9. **클라이언트 코드:**
    * 클라이언트 코드는 SQL 쿼리를 구성하는 표현식 트리를 생성하고, 이를 해석하여 결과를 출력한다. 이 예제에서는 나이가 30보다 크고 도시가 'New York'인 사용자를 필터링하여 name과 age를 선택한다.

## 관련패턴

  1. **컴포지트 패턴(Composite Pattern)**
    * 컴포지트 패턴은 객체들을 트리 구조로 구성하여 부분-전체 계층을 표현하는 패턴이다. 인터프리터 패턴에서 문법 규칙을 객체로 표현할 때, 특히 문법이 트리 구조로 표현될 때, 컴포지트 패턴이 자주 사용된다. 컴포지트 패턴은 인터프리터 패턴에서 복잡한 문법을 표현할 때 유용합니다. 예를 들어, 수학 표현식에서 연산자와 피연산자를 트리 구조로 나타내고, 이 트리를 순회하며 해석할 수 있다.
  2. **플라이웨이트 패턴(Flyweight Pattern)**
    * 플라이웨이트 패턴은 많은 수의 작은 객체를 효율적으로 관리하기 위해 공유할 수 있는 객체를 사용하는 패턴이다. 인터프리터 패턴에서 많은 수의 표현 객체가 생성되는 경우, 플라이웨이트 패턴을 사용하여 메모리 사용을 최적화할 수 있다. 특히, 동일한 하위 표현식이나 상수가 반복적으로 사용될 때, 이 패턴을 사용하면 메모리 절약과 성능 향상을 동시에 달성할 수 있다.
  3. **비지터 패턴(Visitor Pattern)**
    * 비지터 패턴은 객체의 구조를 변경하지 않고도 객체에 대해 새로운 작업을 추가할 수 있는 패턴이다. 인터프리터 패턴과 비지터 패턴은 자주 함께 사용되며, 비지터 패턴을 통해 인터프리터 패턴에서 해석 작업을 추가하거나 변경할 수 있다. 인터프리터 패턴의 해석 과정에서 새로운 작업을 추가하거나, 기존 해석 로직과 별도로 특정 작업(예: 디버깅, 로깅)을 수행할 때 비지터 패턴이 유용하다.
  4. **템플릿 메서드 패턴(Template Method Pattern)**
    * 템플릿 메서드 패턴은 알고리즘의 구조를 정의하고, 알고리즘의 일부 단계를 서브클래스에서 구현할 수 있게 하는 패턴이다. 인터프리터 패턴에서 복잡한 해석 작업을 여러 단계로 나눌 때, 각 단계를 템플릿 메서드 패턴으로 구현하여 공통 로직을 재사용할 수 있다. 인터프리터 패턴을 사용해 해석 작업을 수행할 때, 여러 변형된 해석 방법이 필요하다면 템플릿 메서드 패턴을 사용해 공통 구조를 재사용하면서 세부적인 구현을 다르게 할 수 있다.
  5. **체인 오브 책임 패턴(Chain of Responsibility Pattern)**
    * 체인 오브 책임 패턴은 요청을 처리할 수 있는 객체들이 체인 형태로 연결되어 있으며, 요청이 체인을 따라 전달되다가 적절한 객체가 처리하는 패턴이다. 인터프리터 패턴에서 복잡한 해석 작업을 여러 단계로 나누어 처리할 때 체인 오브 책임 패턴을 사용할 수 있다. 복잡한 문법 해석 과정에서 각 단계(예: 구문 분석, 의미 분석, 최적화 등)를 별도의 객체로 처리하고, 이들을 체인 형태로 연결하여 순차적으로 해석하는 방식으로 적용할 수 있다.
