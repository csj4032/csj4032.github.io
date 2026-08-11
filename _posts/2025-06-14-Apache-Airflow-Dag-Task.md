---
title: "Apache Airflow Dag, Task"
description: "DAG는 Directed Acyclic Graph의 줄임말로 \"방향성이 있는 비순환 그래프\"를 의미하며, Airflow에서는 여러 작업들이 어떤 순서와 의존관계로 실행되어야 하는지를 정의하는 워크플로우 전체를 나타낸"
categories:
 - data-engineering
 - airflow
source: "https://blog.naver.com/csj4032/223899149154"
---

DAG는 Directed Acyclic Graph의 줄임말로 "방향성이 있는 비순환 그래프"를 의미하며, Airflow에서는 여러 작업들이 어떤 순서와 의존관계로 실행되어야 하는지를 정의하는 워크플로우 전체를 나타낸다. DAG의 핵심 특징은 작업들이 정해진 방향으로만 흘러가며 같은 작업이 반복되는 순환 구조가 없다는 점으로, 예를 들어 데이터 추출, 변환, 적재 과정을 순차적으로 진행하는 ETL 파이프라인 전체가 하나의 DAG가 된다.

Task는 DAG 내에서 실제로 수행되는 작업의 최소 단위로, Python 함수 실행, Bash 명령어 실행, SQL 쿼리 실행 등 구체적으로 실행 가능한 개별 작업을 의미합니다. Task는 반드시 DAG 안에 포함되어야만 존재할 수 있으며, Airflow에서는 PythonOperator, BashOperator, SQLOperator 등 다양한 Operator를 사용하여 Task를 정의한다.

DAG와 Task의 관계를 회사 프로젝트에 비유하면, DAG는 프로젝트 전체의 일정표와 작업 흐름을 관리하는 역할이고, Task는 일정표에 명시된 "기획서 작성", "디자인 완성", "개발 완료" 같은 구체적인 개별 업무에 해당한다. 즉, DAG가 전체적인 작업의 순서와 의존성을 정의하면, 각 Task들이 그 흐름에 따라 순차적으로 실행되어 최종 목표를 달성하게 된다.

```python
import json
import logging
from datetime import datetime, timedelta

from airflow.decorators import dag, task
from faker import Faker

# Default DAG arguments
_default_args = {
    "owner": "MMIX",
    "start_date": datetime(1970, 1, 1),
    "retries": 1,
    "retry_delay": timedelta(seconds=5)
}


# User data class with __repr__ for readable logging
class User:
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email

    def __repr__(self):
        return f"User(name='{self.name}', email='{self.email}')"


# Define the DAG
@dag(
    dag_id="example_dag",
    default_args=_default_args,
    schedule_interval=None,
    catchup=False,
    description="An example DAG demonstrating ETL with Airflow",
    tags=["Example", "Dag", "Task"]
)
def example_dag():
    logging.info("Example DAG started")

    # Extract: Generate a fake user and return as JSON string
    @task
    def extract() -> str:
        logging.info("Extracting stringified JSON user data")
        faker = Faker()
        user_data = {
            "name": faker.name(),
            "email": faker.email()
        }
        return json.dumps(user_data)

    # Transform: Convert JSON string to a User object
    @task
    def transform(user_json: str) -> User:
        logging.info("Transforming JSON string to User object")
        user_dict = json.loads(user_json)
        return User(name=user_dict["name"], email=user_dict["email"])

    # Load: Simulate loading the user (e.g., print/log)
    @task
    def load(user: User) -> None:
        logging.info(f"{user} loaded successfully")

    # Define task dependencies
    extract_task = extract()
    transform_task = transform(extract_task)
    load_task = load(transform_task)

    extract_task >> transform_task >> load_task


# Instantiate the DAG
example_dag()
```

이 코드는 Airflow에서 DAG와 Task의 개념을 실습할 수 있는 간단한 ETL(Extract, Transform, Load) 파이프라인 예제이다.

**DAG 정의 부분**에서는 @dag 데코레이터를 사용하여 "example"이라는 이름의 워크플로우를 정의하고 있으며, 소유자는 "MMIX"로 설정되어 있고 수동 실행 방식(schedule_interval=None)으로 구성되어 있습니다. catchup=False 설정으로 과거 실행을 건너뛰도록 하고, "Example", "Dag", "Task" 태그를 붙여 관리하기 쉽게 만들었다.

**Task 구성**은 세 개의 단계로 이루어져 있는데, 먼저 extract Task에서 Faker 라이브러리를 사용해 가짜 사용자 데이터(이름과 이메일)를 생성하고 JSON 문자열로 반환한다. 다음으로 transform Task에서는 JSON 문자열을 파싱하여 User 객체로 변환하며, 마지막 load Task에서는 변환된 User 객체를 로그에 출력하여 데이터 적재를 시뮬레이션한다.

**작업 흐름**은 extract_task >> transform_task >> load_task 순서로 정의되어 있어, 데이터 추출이 완료되면 변환 작업이 시작되고, 변환이 끝나면 적재 작업이 실행되는 전형적인 ETL 파이프라인 구조를 보여준다. 이처럼 각 Task가 순차적으로 실행되면서 이전 Task의 결과를 다음 Task의 입력으로 사용하는 데이터 흐름을 구현하고 있다.

![Example Dag Graph](/assets/images/posts/2025-06-14-Apache-Airflow-Dag-Task/01.png)

![Example Dag Log](/assets/images/posts/2025-06-14-Apache-Airflow-Dag-Task/02.png)
