---
title: "Apache Airflow Branching"
description: "BranchPythonOperator의 핵심 개념은 일반 PythonOperator와 유사하지만, 실행할 함수가 task_id나 task_id 리스트를 반환해야 한다는 점이 다릅니다. 반환된 task_id에 해당하는"
categories:
 - data-engineering
 - airflow
source: "https://blog.naver.com/csj4032/223899260586"
---

**BranchPythonOperator의 핵심 개념**은 일반 PythonOperator와 유사하지만, 실행할 함수가 task_id나 task_id 리스트를 반환해야 한다는 점이 다릅니다. 반환된 task_id에 해당하는 경로만 실행되고 나머지는 모두 건너뛰어지며, 반환되는 task_id는 반드시 BranchPythonOperator의 직접적인 하위 Task여야 합니다.

**중요한 제약사항**으로는 depends_on_past=True 설정을 가진 Task를 Branch 하위에 두면 논리적 문제가 발생한다는 점입니다. 이는 건너뛴 Task들이 "skipped" 상태가 되어 과거 성공에 의존하는 Task들이 차단될 수 있기 때문입니다. 또한 빈 경로는 허용되지 않으므로 필요시 DummyOperator를 사용해야 하며, 모든 상위 Task가 건너뛰어지면 하위 Task들도 자동으로 건너뛰어집니다.

**고급 활용법**으로는 XCom을 통해 이전 Task의 결과값을 받아 동적으로 분기를 결정하는 방법과, BaseBranchOperator를 상속받아 커스텀 분기 Operator를 만드는 방법이 제시되어 있습니다. 예시 코드에서는 날짜가 매월 1일인 경우 daily_task와 monthly_task 두 개를 모두 실행하고, 다른 날에는 daily_task만 실행하는 로직을 보여주어 실제 업무에서 활용할 수 있는 패턴을 제공합니다.

```python
import json
import logging
from datetime import datetime, timedelta

from airflow.decorators import dag, task
from airflow.utils.trigger_rule import TriggerRule
from faker import Faker

# Default DAG arguments
_default_args = {
    "owner": "MMIX",
    "start_date": datetime(1970, 1, 1),
    "retries": 1,
    "retry_delay": timedelta(seconds=5)
}


# Define the DAG
@dag(
    dag_id="example_branching",
    default_args=_default_args,
    schedule_interval=None,
    catchup=False,
    description="An example DAG demonstrating branching in Airflow",
    tags=["Example", "Branch", "Dag", "Task"]
)
def example_branching():
    logging.info("Branching Example DAG started")

    @task
    def extract_alphabet() -> str:
        return Faker().random_sample(["A", "B", "C", "D"], length=1)[0]

    @task.branch(task_id="branch_task")
    def branch(alphabet: str) -> str:
        logging.info(f"Branching based on alphabet: {alphabet}")
        if alphabet == "A":
            return ["branch_a_task", "branch_b_task"]
        elif alphabet == "B":
            return "branch_b_task"
        elif alphabet == "C":
            return "branch_c_task"
        elif alphabet == "D":
            return "branch_d_task"

    @task(task_id="branch_a_task")
    def branch_a():
        logging.info("Branch A Task executed")

    @task(task_id="branch_a_alpha_task")
    def branch_a_alpha():
        logging.info("Branch A Alpha Task executed")

    @task(task_id="branch_a_beta_task")
    def branch_a_beta():
        logging.info("Branch A Beta Task executed")

    @task.branch(task_id="branch_b_task")
    def branch_b():
        alphabet: str = Faker().random_sample(["A", "B"], length=1)[0]
        logging.info(f"Branch B Alpha Task executed with alphabet: {alphabet}")
        if alphabet == "A":
            return "branch_b_alpha_task"
        else:
            return "branch_b_beta_task"

    @task(task_id="branch_b_alpha_task")
    def branch_b_alpha():
        logging.info("Branch B Alpha Task executed")

    @task(task_id="branch_b_beta_task")
    def branch_b_beta():
        logging.info("Branch B Beta Task executed")

    @task(task_id="branch_c_task")
    def branch_c():
        logging.info("Branch C Task executed")

    @task(task_id="branch_d_task")
    def branch_d():
        logging.info("Branch D Task executed")

    @task(trigger_rule=TriggerRule.NONE_FAILED_MIN_ONE_SUCCESS)
    def join():
        logging.info("All branches completed successfully")

    extract_alphabet_operation = extract_alphabet()
    branch_operation = branch(extract_alphabet_operation)
    branch_a = branch_a()
    branch_a_alpha = branch_a_alpha()
    branch_a_beta = branch_a_beta()
    branch_b = branch_b()
    branch_b_alpha = branch_b_alpha()
    branch_b_beta = branch_b_beta()
    branch_c = branch_c()
    branch_d = branch_d()

    branch_operation >> [branch_a, branch_b, branch_c, branch_d]
    branch_a >> branch_a_alpha >> branch_a_beta
    branch_b >> [branch_b_alpha, branch_b_beta]
    [branch_a_beta, branch_b_alpha, branch_b_beta, branch_c, branch_d] >> join()


# Run the DAG
example_branching()
```

이 Airflow DAG는 알파벳을 기반으로 한 다단계 분기 워크플로우를 구현한 예제입니다. 전체적인 흐름을 단계별로 설명하겠습니다.

## 워크플로우 시작과 첫 번째 분기

워크플로우는 extract_alphabet() Task에서 시작됩니다. 이 Task는 Faker 라이브러리를 사용해 A, B, C, D 중 하나를 랜덤하게 선택합니다.

선택된 알파벳은 branch() Task로 전달됩니다. 이 Task는 @task.branch 데코레이터를 사용한 분기 Task로, 받은 알파벳 값에 따라 다음에 실행할 Task를 결정합니다.

분기 조건은 다음과 같습니다:

  * **"A"인 경우**: branch_a_task와 branch_b_task 두 경로를 동시에 실행
  * **"B"인 경우**: branch_b_task만 실행
  * **"C"인 경우**: branch_c_task만 실행
  * **"D"인 경우**: branch_d_task만 실행

## 각 분기별 상세 실행 과정

## Branch A 경로

Branch A가 선택되면 세 개의 Task가 순차적으로 실행됩니다. 먼저 branch_a Task가 실행되고, 완료되면 branch_a_alpha Task가 시작되며, 마지막으로 branch_a_beta Task가 실행됩니다. 이는 branch_a >> branch_a_alpha >> branch_a_beta 의존성 설정으로 구현되어 있습니다.

## Branch B 경로 (중첩 분기)

Branch B는 특별한 구조를 가지고 있습니다. branch_b Task 자체가 또 다른 분기 Task로 정의되어 있어, 내부에서 새로운 조건 판단을 수행합니다.

이 Task 내부에서는 다시 A 또는 B 중 하나를 랜덤하게 선택하고:

  * **"A"가 선택되면**: branch_b_alpha_task 실행
  * **"B"가 선택되면**: branch_b_beta_task 실행

이렇게 해서 두 번째 단계의 분기가 이루어집니다.

## Branch C와 D 경로

Branch C와 Branch D는 각각 단일 Task로 구성된 간단한 경로입니다. 각자의 로그 메시지를 출력하고 완료됩니다.

## 워크플로우 종료와 결과 수집

모든 분기 경로가 완료되면 join() Task가 실행됩니다. 이 Task는 TriggerRule.NONE_FAILED_MIN_ONE_SUCCESS 설정을 사용하므로, 앞선 Task들 중 하나라도 성공하면 실행됩니다.

분기된 각 경로에서는 선택되지 않은 Task들이 "skipped" 상태가 되므로, 실제로 실행된 Task들의 결과만 join Task로 전달됩니다.

## 실제 실행 시나리오 예시

**시나리오 1**: 알파벳이 "A"로 선택된 경우

  1. extract_alphabet() → "A" 반환
  2. branch() → Branch A와 B 경로 모두 선택
  3. Branch A: branch_a → branch_a_alpha → branch_a_beta 순차 실행
  4. Branch B: branch_b에서 내부 분기 → branch_b_alpha 또는 branch_b_beta 중 하나 실행
  5. Branch C, D는 건너뜀 (skipped)
  6. join() → 모든 실행된 경로 완료 확인

**시나리오 2**: 알파벳이 "C"로 선택된 경우

  1. extract_alphabet() → "C" 반환
  2. branch() → Branch C만 선택
  3. branch_c Task만 실행
  4. 나머지 모든 Branch는 건너뜀
  5. join() → Branch C 완료 확인

![Branching Dag Graph](/assets/images/posts/2025-06-14-Apache-Airflow-Branching/01.png)

이러한 구조를 통해 조건에 따라 완전히 다른 실행 경로를 가지는 유연한 워크플로우를 구현할 수 있습니다.
