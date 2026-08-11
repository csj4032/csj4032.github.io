---
title: "Airflow Dynamic Task Mapping"
description: "Dynamic Task Mapping은 Apache Airflow에서 DAG 작성 시점이 아닌 런타임에 이전 태스크의 출력 결과를 기반으로 동적으로 태스크 개수를 결정할 수 있는 기능입니다. 기존의 정적인 for l"
categories:
 - data-engineering
 - airflow
source: "https://blog.naver.com/csj4032/223906825278"
---

Dynamic Task Mapping은 Apache Airflow에서 DAG 작성 시점이 아닌 런타임에 이전 태스크의 출력 결과를 기반으로 동적으로 태스크 개수를 결정할 수 있는 기능입니다. 기존의 정적인 for loop 방식과 달리 스케줄러가 태스크 실행 직전에 필요한 만큼의 태스크 복사본을 자동으로 생성하여 병렬 처리를 수행합니다. expand() 함수를 사용하여 리스트나 이전 태스크의 출력을 각각의 개별 태스크로 매핑할 수 있으며, Map-Reduce 패턴을 통해 매핑된 태스크들의 결과를 수집하고 후속 처리하는 것도 가능합니다. 이를 통해 입력 데이터의 크기가 가변적인 ETL 파이프라인이나 동적 데이터 처리 워크플로우를 효율적으로 구현할 수 있습니다.

## 1. Simple Mapping (단순 매핑)

Dynamic Task Mapping의 가장 기본적인 형태로, DAG 파일에 직접 정의된 리스트를 expand() 함수를 사용한다.

```text
@task def add_one(x: int): 
    return x + 1 
# 정적 리스트를 사용한 매핑 
add_one.expand(x=[1, 2, 3, 4, 5])
```

## 2. Task-generated Mapping

**Task-generated Mapping**은 for 루프 대신 태스크가 동적으로 반복할 리스트나 딕셔너리를 생성하여 매핑을 수행하는 방식으로, make_list() 태스크가 반환한 값들을 기반으로 consumer 태스크가 각 값마다 개별 실행됩니다. 단, TriggerRule.ALWAYS와는 함께 사용할 수 없으며, 이를 시도하면 DAG 파싱 시점에 오류가 발생한다.

```text
@task def make_list(): 
    return [1, 2, 3, 4, 5] 

@task def add_one(x: int): 
    return x + 1 # 업스트림 태스크의 결과를 매핑 add_one.expand(x=make_list())
```

## 3. Repeated Mapping

**Repeated mapping**은 하나의 매핑된 태스크의 결과를 다음 매핑된 태스크의 입력으로 사용하는 방식입니다. 이 코드는 **Repeated mapping**의 예시로, make_list() 태스크가 생성한 리스트의 각 값에 대해 add_one 태스크가 실행되고, 그 결과를 다시 multiply_by_two 태스크의 입력으로 사용하여 연속적인 동적 매핑을 수행합니다. 즉, 첫 번째 매핑 결과가 두 번째 매핑의 입력이 되는 체인 형태의 태스크 매핑이다.

```text
result1 = add_one.expand(x=make_list()) 
result2 = multiply_by_two.expand(x=result1)
```

## 4. Mapping over multiple parameters

Mapping over multiple parameters는 여러 매개변수를 동시에 확장할 때 모든 매개변수 조합의 "교차곱(cross product)"을 생성하여 매핑된 태스크를 실행하는 방식입니다. 예시에서 x=[2,4,8]과 y=[5,10]을 expand하면 3×2=6개의 모든 조합으로 태스크가 실행되지만, 실행 순서는 보장되지 않는다.

```text
# Cross product 생성 
process_data.expand( x=[1, 2, 3], y=['a', 'b'] ) 
# 결과: (1,a), (1,b), (2,a), (2,b), (3,a), (3,b)
```

## 5. Named Mapping (이름 기반 매핑)

Named mapping은 매핑된 태스크의 기본 정수 인덱스(0, 1, 2...)를 의미있는 이름으로 바꿔주는 기능으로, map_index_template에 Jinja 템플릿을 제공하여 태스크 입력값 기반의 이름을 지정할 수 있습니다. 이 코드는 Named mapping의 예시로, @task 데코레이터에 map_index_template="{{ task.filename }}"를 설정하여 매핑된 각 태스크 인스턴스가 Airflow UI에서 "file1.txt", "file2.txt"로 표시되도록 합니다. 기본 정수 인덱스(0, 1) 대신 파일명으로 태스크를 식별할 수 있어 가독성과 디버깅이 용이해집니다.

```python
@task(map_index_template="{{ task.filename }}") 
def process_file(filename): 
    return f"Processed {filename}" process_file.expand(filename=["file1.txt", "file2.txt"])
```

## 6. Mapping with non-TaskFlow operators

Mapping with non-TaskFlow operators는 클래식 스타일 오퍼레이터에서도 partial()과 expand()를 사용할 수 있음을 보여주며, task_id, queue, pool 등 BaseOperator의 대부분 인수는 매핑할 수 없어 partial()에 전달해야 한다. 이 코드는 **non-TaskFlow operators**에서 동적 매핑을 사용하는 예시로, BashOperator의 task_id는 partial()로 고정하고 bash_command만 expand()로 확장하여 "echo hello"와 "echo world" 명령을 각각 실행하는 두 개의 태스크 인스턴스를 생성합니다. task_id같은 BaseOperator 인수는 매핑할 수 없어 반드시 partial()에 전달해야 합니다.

```text
BashOperator.partial(task_id="run_command").expand(bash_command=["echo hello", "echo world"])
```

## expand_kwargs 사용

```text
configs = [{"bash_command": "echo 1", "env": {"VAR": "A"}},{"bash_command": "echo 2", "env": {"VAR": "B"}}]
BashOperator.partial(task_id="dynamic_task").expand_kwargs(configs)
```

## 7. Mapping over result of classic operators

Mapping over result of classic operators는 클래식 오퍼레이터의 결과를 매핑할 때 오퍼레이터 자체가 아닌 .output을 명시적으로 참조한다. 예시에서 ExtractOperator의 결과를 extract.output으로 참조하여 TransformOperator의 입력으로 매핑하고, 다시 transform.output을 LoadOperator의 입력으로 연결하는 ETL 파이프라인을 구성합니다. 각 단계에서 .output을 명시적으로 사용해야 이전 태스크의 실행 결과를 다음 매핑된 태스크로 전달할 수 있다.

```text
# 데이터 입력 리스트 생성
extract = ExtractOperator(task_id="extract")
# 각 입력을 변환하기 위해 오퍼레이터 확장
transform = TransformOperator.partial(task_id="transform").expand(input=extract.output)
# 변환된 입력들을 수집하여 각각을 타겟에 로드하기 위해 오퍼레이터 확장
load = LoadOperator.partial(task_id="load").expand(input=transform.output)
```

## 8. Mixing TaskFlow and classic operators

**Mixing TaskFlow and classic operators**는 클래식 오퍼레이터와 TaskFlow 함수를 함께 사용하여 동적 매핑을 구현한다. S3ListOperator(클래식)로 S3 버킷의 파일 목록을 가져온 후, count_lines TaskFlow 함수를 list_filenames.output으로 동적 매핑하여 각 파일의 라인 수를 계산합니다. 클래식 오퍼레이터의 결과를 TaskFlow 함수의 매핑 입력으로 사용하는 혼합 방식을 보여주는 실용적인 S3 파일 처리 예시다.

```python
list_filenames = S3ListOperator(
        task_id="get_input",
        bucket="example-bucket",
        prefix='incoming/provider_a/{{ data_interval_start.strftime("%Y-%m-%d") }}',
    )

    # TaskFlow 함수로 각 파일의 라인 수 계산
    @task
    def count_lines(aws_conn_id, bucket, filename):
        hook = S3Hook(aws_conn_id=aws_conn_id)
        return len(hook.read_key(filename, bucket).splitlines())

    @task
    def total(lines):
        return sum(lines)

    # 클래식 오퍼레이터 결과를 TaskFlow 함수에 매핑
    counts = count_lines.partial(aws_conn_id="aws_default", bucket=list_filenames.bucket).expand(
        filename=list_filenames.output
    )
    
    total(lines=counts)
```

## 9. Assigning multiple parameters to a non-TaskFlow operator

**Assigning multiple parameters to a non-TaskFlow operator**는 upstream 태스크가 downstream 오퍼레이터에 여러 인수를 전달해야 할 때 expand_kwargs() 함수를 사용하여 매핑 딕셔너리 시퀀스를 전달하는 방법입니다.

## 10. Mapping over a task group

**Mapping over a task group**은 @task_group 데코레이터가 적용된 함수에 expand() 또는 expand_kwargs()를 사용하여 매핑된 태스크 그룹을 생성하는 방법입니다. 태스크 그룹 함수 내에서는 전달된 인수가 실제 값이 아닌 참조(reference)이므로 if not value 같은 조건문이 예상대로 작동하지 않으며, 실제 값은 태스크로 전달될 때만 해석된다. 예시에서 file_transforms 태스크 그룹이 두 개의 인스턴스로 확장되어 각각 "data1.json"과 "data2.json"을 처리하지만, 태스크 그룹 함수 내에서 filename 값에 따른 조건부 로직은 직접 사용할 수 없고 반드시 태스크를 통해 처리해야 합니다.

```python
@task_group
def file_transforms(filename):
    return convert_to_yaml(filename)

file_transforms.expand(filename=["data1.json", "data2.json"])
```

## 11. Placing limits on mapped tasks

매핑된 태스크에는 두 가지 제한을 설정할 수 있습니다: 첫째, max_map_length 설정(기본값 1024)으로 expand()가 생성할 수 있는 최대 태스크 인스턴스 수를 제한하며, 이를 초과하면 소스 태스크가 실패합니다. 둘째, max_active_tis_per_dag 설정으로 동시에 실행될 수 있는 매핑된 태스크의 수를 제한하여 시스템 리소스를 보호할 수 있으며, 이는 모든 활성 DagRun에 적용됩니다.

```python
# 최대 매핑 개수 제한 (기본값: 1024)
# airflow.cfg: [core] max_map_length = 1024

# 동시 실행 제한
@task(max_active_tis_per_dag=16)
def limited_task(x):
    return x * 2

BashOperator.partial(task_id="limited_task", max_active_tis_per_dag=16).expand(bash_command=commands)
```

## 12. 템플릿 필드와의 상호작용

Operator의 모든 인수는 매핑 가능하지만, 템플릿 필드로 표시된 필드가 매핑되면 템플릿 렌더링이 수행되지 않습니다. 예를 들어 ["{{ ds }}"]를 매핑하면 실제 날짜가 아닌 문자 그대로 {{ ds }}가 출력되므로, 템플릿 값을 사용하려면 task.render_template을 직접 호출하거나 컨텍스트에서 값을 미리 추출해야 한다.

```python
@task
def make_templates():
    return ["{{ ds }}"]  # 문자 그대로 출력됨

# 올바른 예: 수동으로 렌더링
@task
def make_templates(**context):
    ds = context["task"].render_template("{{ ds }}", context)
    return [ds]
```

## 13. Automatically skipping zero-length maps

빈 리스트나 딕셔너리가 전달되면 매핑된 태스크는 자동으로 SKIPPED 상태가 된다.

```python
@task
def empty_list():
    return []  # 빈 리스트

# 이 태스크는 SKIPPED 상태가 됨
process_items.expand(item=empty_list())
```

현재 Dynamic Task Mapping에서는 dict, list, 또는 태스크 결과로 XCom에 저장된 이러한 타입들만 매핑이 가능합니다. 업스트림 태스크가 매핑 불가능한 타입(예: 단순 문자열)을 반환하면 런타임에 UnmappableXComTypePushed 예외가 발생하며 매핑된 태스크가 실패한다.

Dynamic Task Mapping은 대용량 데이터 처리, 파일 배치 처리, 병렬 API 호출 등에서 매우 유용하며, Airflow의 확장성과 유연성을 크게 향상시키는 핵심 기능이다.

## 14. Values passed from the mapped task is a lazy proxy

**Values passed from the mapped task is a lazy proxy**는 매핑된 태스크들의 결과를 집계할 때 실제 리스트가 아닌 LazySelectSequence([15 items]) 형태의 지연 로딩 프록시 객체가 전달되어, 요청 시에만 개별 값을 검색한다는 개념입니다. XCom으로 이 프록시 객체를 전달하면 성능 경고가 발생하므로, 명시적으로 return list(values)를 사용하여 경고를 억제하고 성능 영향을 인지해야 합니다.

```python
import base64
import logging
from datetime import datetime
from datetime import timedelta
from typing import Any

import requests
from airflow.decorators import dag, task, task_group
from airflow.hooks.base import BaseHook
from airflow.models import Variable, Param
from airflow.operators.empty import EmptyOperator
from airflow.providers.amazon.aws.hooks.redshift_sql import RedshiftSQLHook
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
from airflow.providers.amazon.aws.operators.emr import EmrServerlessStartJobOperator
from airflow.providers.amazon.aws.sensors.emr import EmrServerlessJobSensor
from airflow.providers.datadog.hooks.datadog import DatadogHook
from airflow.providers.google.cloud.hooks.gcs import GCSHook
from airflow.providers.google.suite.hooks.drive import GoogleDriveHook
from airflow.providers.influxdb.hooks.influxdb import InfluxDBHook
from airflow.providers.mysql.hooks.mysql import MySqlHook
from airflow.utils.task_group import TaskGroup
from airflow.utils.trigger_rule import TriggerRule
from opensearchpy import OpenSearch, RequestsHttpConnection

from common import willog_slack_operator as slack_operator

_default_args = {
    "owner": "MMIX",
    "start_date": datetime(1970, 1, 1),
    "retries": 1,
    "retry_delay": timedelta(seconds=5)
}


@dag(dag_id="example_dynamic_task_mapping",
     default_args=_default_args,
     schedule_interval=None,
     catchup=False,
     tags=["Example", "Dynamic", "Mapping", "Task"])
def example_dynamic_task_mapping() -> None:
    @task(task_id="times_two")
    def times_two(number: int) -> int:
        return number * 2

    @task
    def generate_list() -> list[Any]:
        return [1, 2, {"A": "B"}, "String"]

    @task(task_id="logging_list")
    def logging_list(arg: list[Any]) -> None:
        logging.info(f"Logging list: {arg}")

    @task_group(group_id="connected_aws_services_parallel")
    def connected_aws_services_parallel() -> None:
        @task
        def connected_service(default: str, name: str) -> str:
            logging.info(f"{default} Connecting to {name} service")
            return f"{default} Connected to {name}"

        for service in ["s3", "rds", "emr", "sagemaker"]:
            connected_service.override(task_id=f"connected_aws_services_parallel_{service}")("AWS", service)

    @task_group(group_id="connected_aws_services_sequential")
    def connected_aws_services_sequential() -> None:
        @task
        def connected_service(default: str, name: str) -> str:
            logging.info(f"{default} Connecting to {name} service")
            return f"{default} Connected to {name}"

        prev = None
        tasks = []
        for service in ["cloudwatch", "dynamodb", "sns"]:
            t = connected_service.override(task_id=f"connected_aws_services_sequential_{service}")("AWS", service)
            tasks.append(t)
            if prev:
                prev >> t
            prev = t

    @task_group(group_id="connected_aws_services_dynamic")
    def connected_aws_services_dynamic() -> None:
        @task
        def get_params() -> list[dict[str, Any]]:
            return [
                {"name": "s3", "price": 100},
                {"name": "rds", "price": 200},
                {"name": "emr", "price": 300},
                {"name": "sagemaker", "price": 400},
            ]

        @task
        def get_names() -> list[str]:
            return ["s3", "rds", "emr", "sagemaker"]

        @task
        def get_prices() -> list[int]:
            return [100, 200, 300, 400]

        @task
        def connected_service(default: str, name: str, price: int, **kwargs) -> str:
            logging.info(kwargs["ti"].xcom_pull(task_ids="connected_datadog_metric"))
            logging.info(f"{default} Connecting to {name} service with price {price}")
            return f"{default} Connected to {name} with price {price}"

        @task
        def connected_service_args(default: str, args: dict, **kwargs) -> str:
            logging.info(kwargs["ti"].xcom_pull(task_ids="connected_naver_api"))
            logging.info(f"{default} Connecting to {args['name']} service with price {args['price']}")
            return f"{default} Connecting to {args['name']} service with price {args['price']}"

        @task
        def connected_service_kwargs(default: str, name: str, price: int, **kwargs) -> str:
            logging.info(kwargs["ti"].xcom_pull(task_ids="connected_aws_platform"))
            logging.info(f"{default} Connecting to {name} service with price {price}")
            return f"{default} Connected to {name} with price {price}"

        connected_service.partial(default="AWS").expand(name=get_names(), price=get_prices())
        connected_service_args.partial(default="AWS").expand(args=get_params())
        connected_service_kwargs.partial(default="AWS").expand_kwargs(get_params())

    times_two_task = times_two.expand(number=[1, 2, 3, 4, 5])
    logging_list_task = logging_list.expand(arg=generate_list())

    connected_a
```

이 코드는 Airflow의 Dynamic Task Mapping 기능을 다양한 방식으로 활용하는 종합적인 예제입니다. 기본적인 expand() 함수를 사용한 단순 매핑부터 partial()과 expand_kwargs()를 조합한 고급 매핑까지 세 가지 패턴을 보여줍니다. 특히 AWS 서비스 연결을 시뮬레이션하는 태스크 그룹에서 병렬 처리, 순차 처리, 동적 매핑을 각각 구현하여 실제 데이터 파이프라인에서 활용할 수 있는 다양한 매핑 전략을 제시하고 있습니다. 코드는 숫자 리스트 처리부터 복잡한 딕셔너리 파라미터 전달까지 다루어 Dynamic Task Mapping의 실용적인 활용법을 잘 보여주는 학습용 예제로 활용할 수 있습니다.
