---
title: "Airflow Object Storage"
description: "Object Storage 는 Airflow 2.8에서 도입된 Object Storage API를 사용하여 S3, GCS, Azure Blob Storage 등의 객체 스토리지를 관리하는 방법을 보여줍니다. 이 튜토"
categories:
 - data-engineering
 - airflow
source: "https://blog.naver.com/csj4032/223906885811"
---

Object Storage 는 Airflow 2.8에서 도입된 Object Storage API를 사용하여 S3, GCS, Azure Blob Storage 등의 객체 스토리지를 관리하는 방법을 보여줍니다. 이 튜토리얼은 웹 API 접근, 결과 저장 및 분석이라는 데이터 엔지니어링과 데이터 사이언스 워크플로우에서 자주 사용되는 패턴을 다룬다.

## 필수 요구사항:

* **DuckDB**: pip install duckdb (인프로세스 분석 데이터베이스)
* **Amazon 프로바이더**: pip install apache-airflow-providers-amazon[s3fs] (S3 버킷 필요)
* **pandas**: pip install pandas
* 다른 스토리지 프로바이더 사용 시 s3://를 gs://(GCS) 등으로 변경 가능

**Creating an ObjectStoragePath**는 객체 스토리지의 경로를 나타내는 path-like 객체로 Object Storage API의 기본 구성 요소입니다. ObjectStoragePath("s3://bucket/")처럼 URL의 사용자명 부분에 connection ID를 지정하거나, ObjectStoragePath("s3://bucket/", conn_id="aws_default")처럼 키워드 인수로 전달할 수 있으며, 명시적 키워드 인수가 URL의 사용자명보다 우선합니다.

## 주요 특징:

* DAG 루트에서 안전하게 인스턴스화 가능 (실제 사용 시까지 연결 생성하지 않음)
* 글로벌 스코프에서 생성하여 여러 태스크에서 재사용 가능
* connection ID 생략 시 백엔드의 기본 연결 사용

```sql
from datetime import datetime, timedelta
import duckdb
import logging
import pandas as pd
from airflow.decorators import dag
from airflow.decorators import task
from airflow.io.path import ObjectStoragePath
from faker import Faker

OBJECT_STORAGE_PATH = ObjectStoragePath("s3://bucket/object-storage-path/")

_default_args = {
    "owner": "MMIX",
    "start_date": datetime(1970, 1, 1),
    "retries": 1,
    "retry_delay": timedelta(seconds=5)
}


@dag(
    dag_id="example_object_storage_path",
    default_args=_default_args,
    schedule_interval=None,
    catchup=False,
    description="An example DAG demonstrating ETL with Airflow",
    tags=["Example", "Object", "Storage", "Path"]
)
def example_object_storage_path() -> None:
    @task(task_id="write_to_object_storage")
    def write_to_object_storage() -> ObjectStoragePath:
        faker = Faker()
        people = [{"name": faker.name(), "email": faker.email(), "job": faker.job(), "address": faker.address()} for _ in range(10000)]
        dataframe = pd.DataFrame(people)
        object_path = OBJECT_STORAGE_PATH / "people.csv"
        with object_path.open("wb") as file:
            dataframe.to_csv(file, index=False, header=True)
        return object_path

    @task(task_id="read_from_object_storage")
    def read_from_object_storage(object_path: ObjectStoragePath) -> pd.DataFrame:
        conn = duckdb.connect(database=":memory:")
        conn.register_filesystem(object_path.fs)
        conn.execute(f"CREATE OR REPLACE TABLE people AS SELECT * FROM read_csv('{object_path}')")
        people = conn.execute("SELECT name, email, job, address FROM people").fetchdf()
        logging.info(f"Read {len(people)} records from {object_path}")
        return people

    read_from_object_storage(write_to_object_storage())


example_object_storage_path()
```

이 코드는 Airflow의 Object Storage API를 활용한 ETL 파이프라인 예제로, S3 버킷(s3://bucket/object-storage-path/)에 데이터를 저장하고 읽어오는 과정을 보여줍니다. write_to_object_storage 태스크는 Faker 라이브러리를 사용해 10,000개의 가짜 사람 데이터(이름, 이메일, 직업, 주소)를 생성하고 pandas DataFrame으로 변환한 후 ObjectStoragePath를 통해 S3에 CSV 파일로 저장한다.

![AWS S3 people.csv](/assets/images/posts/2025-06-21-Airflow-Object-Storage/01.png)

read_from_object_storage 태스크는 저장된 CSV 파일의 경로를 XCom으로 받아와서 DuckDB의 인메모리 데이터베이스에 파일시스템을 등록하고, read_csv 함수로 데이터를 읽어 SQL 쿼리를 실행합니다. 두 태스크는 ObjectStoragePath 객체를 통해 연결되어 있으며, 객체 스토리지에 대한 연결 세부사항이 투명하게 처리되어 간단하고 효율적인 데이터 처리 워크플로우를 구현합니다. DAG는 수동 실행(schedule_interval=None)으로 설정되어 있고 catchup을 비활성화하여 과거 실행을 방지한다.

![example_object_storage_path graph](/assets/images/posts/2025-06-21-Airflow-Object-Storage/02.png)

![example_object_storage_path log](/assets/images/posts/2025-06-21-Airflow-Object-Storage/03.png)
