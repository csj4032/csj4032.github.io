---
title: "Airflow Depends On Past"
description: "시간 순서 보장이 중요한 작업에서는 depends_on_past=True를 사용해야 합니다. 누적 데이터 처리나 순차적 ETL 작업처럼 이전 시간 데이터가 처리되지 않으면 다음 데이터 처리가 의미없거나 오류가 발생할"
categories:
 - data-engineering
 - airflow
source: "https://blog.naver.com/csj4032/223899943276"
---

시간 순서 보장이 중요한 작업에서는 depends_on_past=True를 사용해야 합니다. 누적 데이터 처리나 순차적 ETL 작업처럼 이전 시간 데이터가 처리되지 않으면 다음 데이터 처리가 의미없거나 오류가 발생할 수 있기 때문이다. 또한 일별 거래 데이터 처리나 로그 파일 처리에서 데이터 연속성과 중복 방지가 필요한 경우에도 적합하다. 백필 작업에서 정확한 상태 복원이 필요하거나 외부 API 상태 업데이트처럼 상태 일관성이 중요한 작업에서도 반드시 사용해야 한다.

병렬 처리가 필요하거나 태스크들이 시간적으로 독립적인 경우에는 사용하지 않아야 한다. 이전 태스크 실패와 상관없이 계속 실행되어야 하는 작업이나 별도의 Trigger Rule이 설정된 경우에도 불필요하며, 오히려 워크플로우의 유연성을 해칠 수 있다.

depends_on_past=True 설정은 Task 단위로 적용되어 이전 DAG Run에서 동일한 Task가 실패했을 경우 현재 Task의 실행을 차단하지만, DAG의 다른 Task들이 여전히 실행 중이거나 대기 상태라면 전체 DAG Run은 running 상태를 유지한다.

이로 인해 차단된 Task와 연결된 하위 Task들도 실행되지 못하면서 DAG가 멈춘 것처럼 보일 수 있으며, 이를 해결하려면 이전에 실패한 Task를 재실행하거나 수동으로 성공 상태로 변경(clear)하거나 depends_on_past=False로 설정을 변경해야 한다.

```sql
import json
import logging
import random
from datetime import datetime, timedelta
from pathlib import Path
from dataclasses import dataclass, asdict

import duckdb
from airflow.decorators import dag, task
from airflow.exceptions import AirflowFailException
from airflow.utils.trigger_rule import TriggerRule
from faker import Faker


# User 정의를 dataclass로 단순화
@dataclass
class User:
    name: str
    email: str
    created_at: datetime = datetime.now()

    def to_tuple(self):
        return (self.name, self.email, self.created_at)


DUCKDB_PATH = "/opt/airflow/data/airflow_data.duckdb"


def get_duckdb_connection():
    Path(DUCKDB_PATH).parent.mkdir(parents=True, exist_ok=True)
    return duckdb.connect(DUCKDB_PATH)


_default_args = {
    "owner": "MMIX",
    "start_date": datetime(1970, 1, 1),
    "retries": 1,
    "retry_delay": timedelta(seconds=5),
}


@dag(
    dag_id="example_depends_past",
    default_args=_default_args,
    schedule_interval="* * * * *",
    catchup=False,
    description="An example DAG demonstrating depends_on_past in Airflow",
    tags=["Example", "Depends", "Past", "Dag", "Task"]
)
def example_depends_past():
    @task(task_id="init_schema_table_task")
    def init_schema_table() -> None:
        with get_duckdb_connection() as conn:
            conn.execute("CREATE SCHEMA IF NOT EXISTS duckdb")
            conn.execute("""
                         CREATE TABLE IF NOT EXISTS duckdb.users
                         (
                             name
                             VARCHAR,
                             email
                             VARCHAR,
                             created_at
                             TIMESTAMP
                         )
                         """)

    @task(task_id="extract_task")
    def extract() -> str:
        faker = Faker()
        user_data = {
            "name": faker.name(),
            "email": faker.email(),
            "created_at": datetime.now().isoformat()
        }
        return json.dumps(user_data)

    @task(task_id="transform_task")
    def transform(user_json: str) -> User:
        user_dict = json.loads(user_json)
        return User(
            name=user_dict["name"],
            email=user_dict["email"],
            created_at=datetime.fromisoformat(user_dict["created_at"])
        )

    @task(task_id="load_task", depends_on_past=True)
    def load(user: User) -> None:
        if random.random() < 0.33:
            raise AirflowFailException("Simulated failure in load task")
        with get_duckdb_connection() as conn:
            conn.execute("INSERT INTO duckdb.users VALUES (?, ?, ?)", user.to_tuple())

    @task(task_id="all_done_task", trigger_rule=TriggerRule.ALL_DONE)
    def all_done() -> None:
        with get_duckdb_connection() as conn:
            result = conn.execute("SELECT name, email, created_at FROM duckdb.users").fetchall()
            for name, email, created_at in result:
                logging.info(f"User: {name}, Email: {email}, Created At: {created_at}")

    user_data = extract()
    user = transform(user_data)
    init = init_schema_table()
    load_result = load(user)
    done = all_done()

    init >> user_data >> user >> load_result >> done


example_depends_past()
```

이 Airflow DAG는 depends_on_past=True 설정의 동작을 실습하기 위한 ETL 파이프라인으로, 매분마다 실행되면서 Faker로 생성한 가짜 사용자 데이터를 DuckDB 데이터베이스에 저장하는 워크플로우이다.

핵심은 load Task에 depends_on_past=True와 33% 확률의 의도적인 실패(AirflowFailException)를 설정하여, 이전 DAG Run에서 load Task가 실패했을 경우 다음 실행에서 해당 Task가 차단되는 현상을 재현할 수 있도록 구성했다.

마지막 all_done Task는 TriggerRule.ALL_DONE을 사용해 앞선 Task들의 성공/실패와 관계없이 실행되어 현재까지 저장된 사용자 데이터를 조회하고 로그로 출력하여 전체 워크플로우의 상태를 확인할 수 있게 한다.

![이전 Dag 실패 때문에 현재 Dag가 계속 멈춤 상태](/assets/images/posts/2025-06-15-Airflow-Depends-On-Past/01.png)

![이전 실패 Dag를 매뉴얼 하게 성공으로 변경 후 Dag 진행](/assets/images/posts/2025-06-15-Airflow-Depends-On-Past/02.png)
