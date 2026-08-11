---
title: "Airflow Trigger Rules"
description: "Airflow의 기본 동작은 모든 상위 Task가 성공해야 해당 Task를 실행하는 것입니다. 하지만 trigger_rule 매개변수를 사용하면 이러한 기본 동작을 다양한 방식으로 변경할 수 있어, 복잡한 워크플로우"
categories:
 - data-engineering
 - airflow
source: "https://blog.naver.com/csj4032/223899778358"
---

Airflow의 기본 동작은 모든 상위 Task가 성공해야 해당 Task를 실행하는 것입니다. 하지만 trigger_rule 매개변수를 사용하면 이러한 기본 동작을 다양한 방식으로 변경할 수 있어, 복잡한 워크플로우 시나리오에 대응할 수 있다.

**즉시 실행 계열**: one_failed, one_success, one_done은 모든 상위 Task의 완료를 기다리지 않고 조건이 충족되는 즉시 실행됩니다. 예를 들어 one_failed는 첫 번째 실패가 감지되면 바로 에러 처리 Task를 시작하므로 빠른 대응이 가능하다.

**완료 기반 계열**: all_success, all_failed, all_done, all_skipped는 모든 상위 Task의 완료를 기다린 후 해당 상태를 확인하여 실행 여부를 결정합니다. all_done은 성공/실패와 관계없이 모든 Task가 완료되면 실행되므로 정리 작업에 유용하다.

**조건부 실행 계열**: none_failed, none_failed_min_one_success, none_skipped는 특정 상태가 없을 때 실행되는 조건들로, 분기 워크플로우에서 특히 중요합니다. none_failed_min_one_success는 실패가 없으면서 최소 하나는 성공한 경우에만 실행되어, 분기 후 결과 수집에 가장 적합하다.

## trigger_rule의 옵션들은 다음과 같다:

* all_success (기본값): 모든 상위 Task가 성공했을 때
* all_failed: 모든 상위 Task가 failed 또는 upstream_failed 상태일 때
* all_done: 모든 상위 Task의 실행이 완료되었을 때
* all_skipped: 모든 상위 Task가 skipped 상태일 때
* one_failed: 최소 하나의 상위 Task가 실패했을 때 (모든 상위 Task의 완료를 기다리지 않음)
* one_success: 최소 하나의 상위 Task가 성공했을 때 (모든 상위 Task의 완료를 기다리지 않음)
* one_done: 최소 하나의 상위 Task가 성공하거나 실패했을 때
* none_failed: 모든 상위 Task가 failed 또는 upstream_failed 상태가 아닐 때 - 즉, 모든 상위 Task가 성공하거나 건너뛰어졌을 때
* none_failed_min_one_success: 모든 상위 Task가 failed 또는 upstream_failed 상태가 아니면서, 최소 하나의 상위 Task가 성공했을 때
* none_skipped: skipped 상태인 상위 Task가 없을 때 - 즉, 모든 상위 Task가 success, failed, 또는 upstream_failed 상태일 때
* always: 의존성과 관계없이 언제든지 이 Task를 실행

```python
import logging
from datetime import datetime, timedelta

from airflow.decorators import dag, task
from airflow.exceptions import AirflowSkipException, AirflowFailException
from airflow.utils.trigger_rule import TriggerRule

# Default DAG arguments
_default_args = {
    "owner": "MMIX",
    "start_date": datetime(1970, 1, 1),
    "retries": 1,
    "retry_delay": timedelta(seconds=5)
}


# Define the DAG
@dag(
    dag_id="example_trigger_rule",
    default_args=_default_args,
    schedule_interval=None,
    catchup=False,
    description="An example DAG demonstrating trigger rules in Airflow",
    tags=["Example", "Trigger", "Rule", "Dag", "Task"]
)
def example_trigger():
    logging.info("Trigger Rule Example DAG started")

    @task
    def start() -> str:
        logging.info("Start Task executed")
        return "Start Task completed"

    @task(task_id="success_task")
    def success() -> str:
        logging.info("Success Task executed")
        return "Success Task completed"

    @task(task_id="failed_task")
    def failed() -> None:
        logging.info("Failed Task executed, this will raise an exception")
        raise AirflowFailException("This task is intentionally failed to demonstrate trigger rules")

    @task(task_id="skipped_task")
    def skipped() -> None:
        logging.info("Skip Task executed, this will skip the task")
        raise AirflowSkipException("This task is intentionally skipped to demonstrate trigger rules")

    @task(task_id="end_task", trigger_rule=TriggerRule.ALWAYS)
    def end() -> str:
        logging.info("End Task executed")
        return "End Task completed"

    def create_logging_task(task_id: str, trigger_rule: str):
        @task(task_id=task_id, trigger_rule=trigger_rule)
        def _task():
            logging.info(f"{task_id} executed.")

        return _task()

    start_operation = start()
    success_operation = success()
    failed_operation = failed()
    skipped_operation = skipped()
    end_operation = end()

    trigger_rule_tasks = {
        "all_success_task": TriggerRule.ALL_SUCCESS,
        "all_failed_task": TriggerRule.ALL_FAILED,
        "all_skipped_task": TriggerRule.ALL_SKIPPED,
        "all_done_task": TriggerRule.ALL_DONE,
        "one_failed_task": TriggerRule.ONE_FAILED,
        "one_success_task": TriggerRule.ONE_SUCCESS,
        "one_done_task": TriggerRule.ONE_DONE,
        "none_failed_task": TriggerRule.NONE_FAILED,
        "none_failed_min_one_success_task": TriggerRule.NONE_FAILED_MIN_ONE_SUCCESS,
        "none_skipped_task": TriggerRule.NONE_SKIPPED,
    }
    created_operations = {
        task_id: create_logging_task(task_id, rule)
        for task_id, rule in trigger_rule_tasks.items()
    }

    branches = [success_operation, failed_operation, skipped_operation]
    for branch in branches:
        start_operation >> branch

    for operation in created_operations.values():
        for branch in branches:
            branch >> operation

    for task_id, operation in created_operations.items():
        if task_id != "all_done_task":
            start_operation >> operation
            operation >> end_operation

    created_operations["all_done_task"] >> end_operation


example_trigger()
```

이 Airflow DAG는 Trigger Rules의 모든 유형을 체계적으로 학습할 수 있도록 설계된 종합적인 실습 예제로, start Task를 시작점으로 하여 의도적으로 성공(success), 실패(failed), 스킵(skipped) 상태를 만드는 세 개의 기본 Task를 AirflowFailException과 AirflowSkipException을 사용해 생성합니다.

create_logging_task 함수를 통해 ALL_SUCCESS, ALL_FAILED, ONE_SUCCESS, ONE_FAILED, NONE_FAILED_MIN_ONE_SUCCESS 등 10가지 서로 다른 Trigger Rule을 가진 Task들을 동적으로 생성하며, 각 Trigger Rule Task는 앞서 만든 성공/실패/스킵 Task들을 모두 상위 Task로 받아 자신의 실행 조건에 따라 동작합니다.

워크플로우의 구조는 start → [success, failed, skipped] → [각종 trigger rule tasks] → end 순서로 진행되며, 이를 통해 각 Trigger Rule이 어떤 상위 Task 조건에서 실행되고 어떤 조건에서 건너뛰어지는지 실제 로그를 통해 확인할 수 있습니다.

마지막 end Task는 TriggerRule.ALWAYS로 설정되어 모든 상위 Task들의 상태와 관계없이 항상 실행되어 워크플로우의 완전한 종료를 보장하며, 이러한 구조를 통해 복잡한 분기 워크플로우나 에러 처리 시나리오에서 활용할 수 있는 Trigger Rules의 실제 동작 방식을 체계적으로 학습할 수 있도록 구성된 교육용 DAG입니다.

![Trigger Rule Graph](/assets/images/posts/2025-06-15-Airflow-Trigger-Rules/01.png)
