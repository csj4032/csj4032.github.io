---
title: "Airflow Command Line Interface"
description: "Apache Airflow CLI(Command Line Interface)는 터미널에서 Airflow를 직접 제어할 수 있는 강력한 운영 도구이다. 웹 UI 없이도 DAG 실행부터 서비스 기동, 설정 확인, 데이터"
categories:
 - data-engineering
 - airflow
source: "https://blog.naver.com/csj4032/224098106727"
---

Apache Airflow CLI(Command Line Interface)는 터미널에서 Airflow를 직접 제어할 수 있는 강력한 운영 도구이다. 웹 UI 없이도 DAG 실행부터 서비스 기동, 설정 확인, 데이터베이스 관리까지 대부분의 기능을 수행할 수 있어, 자동화 스크립트 작성이나 CI/CD 파이프라인 통합, 원격 서버 운영 환경에서 특히 유용하게 쓰인다. 명령줄에서 바로 Airflow를 다룰 수 있다는 점은 DevOps·DataOps 엔지니어에게 매우 중요한 생산성 요소가 된다.

Airflow CLI가 제공하는 기능은 크게 DAG 운영, 서비스 관리, 개발 지원, 메타데이터 관리 네 가지로 나눠볼 수 있다. DAG 운영 측면에서는 DAG를 실행하거나 중지하고, 과거 날짜에 대한 백필을 수행하며, 개별 Task의 상태를 확인하거나 재실행하는 작업을 수행한다. 서비스 관리 영역에서는 스케줄러, 트리거러, DAG 프로세서 같은 핵심 백엔드 서비스를 시작하고 모니터링할 수 있다. 개발·디버깅 과정에서는 설정을 점검하고 템플릿을 렌더링하며, 외부 시스템과의 연결을 테스트하거나 플러그인 정보를 확인할 수 있다. 마지막으로 메타데이터와 시스템 설정을 다루는 기능을 통해 데이터베이스 초기화, 마이그레이션, 정리 작업, 연결/변수/풀 관리, 설정 값 검증 등을 수행할 수 있다.

Airflow 운영에서 자주 사용되는 핵심 명령으로는 scheduler, triggerer, dag-processor, api-server, standalone 등이 있다. 스케줄러는 DAG의 실행을 관리하는 중심 서비스이며, 트리거러는 비동기 기반의 deferrable 작업을 보조한다. DAG 프로세서는 DAG 파일을 지속적으로 파싱·감시하는 역할을 하고, API 서버는 FastAPI 기반 Airflow API를 제공하는 백엔드 엔드포인트다. 개발 환경에서는 standalone 명령 하나로 DB 초기화부터 웹 UI, 스케줄러까지 한 번에 띄울 수 있어 빠른 검증이 가능하다.

DAG 관리 기능은 실무에서 가장 많이 사용된다. dags 명령을 이용하면 DAG 목록을 조회하거나 상세 정보를 확인할 수 있으며, DAG을 일시정지하거나 다시 활성화할 수 있다. tasks 명령은 개별 태스크 단위의 상태 확인과 테스트 실행, 템플릿 렌더링에 활용된다. 특히 tasks test는 DB 기록 없이 로컬에서 Task를 즉시 실행해볼 수 있어 개발 단계에서 매우 유용하다. 과거 기간에 대해 DAG을 재실행해야 할 때는 backfill 명령을 사용하여 원하는 날짜 구간을 지정해 백필 작업을 수행한다.

운영과 유지보수 과정에서는 db, connections, variables, pools, config 같은 명령들이 필수적이다. 데이터베이스 스키마를 초기화하거나 최신 버전으로 마이그레이션하고, 오래된 로그·태스크 인스턴스 정보를 정리할 때는 db clean이 자주 사용된다. 외부 시스템과의 연결을 추가하거나 조회할 때는 connections 명령을, 런타임 설정 값을 관리할 때는 variables을, 리소스 제어가 필요할 때는 pools를 사용한다. 또한 config 명령으로 현재 설정값이 어느 파일·환경변수에서 로딩되었는지 확인할 수 있어 설정 충돌 문제를 해결하는 데 도움이 된다.

개발과 디버깅을 지원하는 명령들도 있다. info를 통해 시스템 및 환경 정보를 확인할 수 있고, cheat-sheet 명령으로 자주 사용하는 CLI 명령 요약을 바로 조회할 수 있다. plugins 명령은 로딩된 플러그인을 점검할 때 유리하며, provider 시스템을 통해 Celery Executor, Kubernetes Executor, Edge Executor, AWS Provider 같은 확장 기능들도 자체적인 CLI 명령을 제공한다. 예를 들어 Celery Executor 운영 환경에서는 Celery 큐 및 워커와 관련된 명령이 추가되며, KubernetesExecutor 환경에서는 Pod 기반 실행을 모니터링하는 명령이 제공된다. FAB Provider를 활성화한 경우 사용자와 권한 관리를 위한 users/roles 명령도 포함된다.

실제 활용 사례를 보면 CLI는 운영 자동화 스크립트에서 DAG 배포·활성화·헬스체크를 수행하거나, 장애 발생 시 실패한 Task나 DAG Run을 확인하고 정리하는 데 자주 사용된다. 또한 로컬 개발 환경에서는 Task 또는 DAG 단위 테스트를 빠르게 수행하며, 원격 서버 관리에서는 서비스 기동·중지와 상태 점검을 CLI를 통해 수행한다. Airflow CLI는 웹 UI를 보완하는 강력한 운영 도구로서, 안정적인 워크플로우 운영과 효율적인 개발 지원에 없어서는 안 될 구성 요소이다.

## 1. 서비스 기동 및 운영

```text
# 스케줄러 실행 
airflow scheduler 

# 트리거러 실행 (deferrable task 지원) 
airflow triggerer 

# DAG 프로세서 실행 
airflow dag-processor 

# API 서버 실행 
airflow api-server -H 0.0.0.0 -p 8080 

# 개발용 올인원 실행 
airflow standalone
```

## 2. DAG 관리

```text
# DAG 리스트 조회 
airflow dags list 

# DAG 상세정보 
airflow dags details my_dag 

# DAG 수동 실행 
airflow dags trigger my_dag -c '{"key": "value"}' 

# DAG 중지 / 재개 
airflow dags pause my_dag airflow dags unpause my_dag 

# DAG Run 목록 (실패한 것만 보기) 
airflow dags list-runs my_dag --state failed
```

## 3. Task 관리

```text
# DAG 내 Task 목록 
airflow tasks list my_dag 

# Task 상태 조회 
airflow tasks state my_dag task_id 2024-01-01T00:00:00 

# 템플릿 렌더링 결과 확인 
airflow tasks render my_dag task_id 2024-01-01T00:00:00 

# Task 로컬 테스트(DB 기록 없음) 
airflow tasks test my_dag task_id 2024-01-01T00:00:00 

# Task clear 후 재실행 가능하게 만들기 
airflow tasks clear my_dag -s 2024-01-01 -e 2024-01-05 -y
```

## 4. Backfill (과거 구간 재실행)

```text
# 특정 날짜 구간 
backfill airflow backfill create \ 
--dag-id my_dag \ 
--from-date 2024-01-01 \ 
--to-date 2024-01-10
```

## 5. 메타데이터 DB

```text
# DB 연결 진단 
airflow db check 

# 스키마 마이그레이션 
airflow db migrate 

# 오래된 메타데이터 정리 
airflow db clean --clean-before-timestamp "2024-01-01 00:00:00" -y 

# 전체 초기화(개발 환경) 
airflow db reset -y
```

## 6. Connections (외부 시스템 연결)

```text
# 리스트 
airflow connections list 

# 조회 
airflow connections get my_conn 

# URI 방식 추가 
airflow connections add my_pg \ 
--conn-uri postgres://user:pass@host:5432/db 

# 삭제 
airflow connections delete my_pg
```

## 7. Variables / Pools

```text
# 변수 설정 / 조회 
airflow variables set MODE "dev" airflow variables get MODE 

# Pool 관리 
airflow pools list airflow pools set heavy_pool 5 "ETL 용도"
```

## 8. 설정 및 환경 정보

```text
# 특정 설정값 가져오기 
airflow config get-value core dags_folder 

# 전체 시스템 정보 확인 
airflow info -o yaml --anonymize
```
