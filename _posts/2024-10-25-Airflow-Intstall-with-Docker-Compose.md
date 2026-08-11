---
title: "Airflow Intstall with Docker Compose"
description: "Apache Airflow를 Docker Compose로 설치하는 과정은 환경 구성을 쉽게 만들어줍니다. 다음은 단계별로 상세한 설명입니다."
categories:
 - data-engineering
 - airflow
source: "https://blog.naver.com/csj4032/223633401108"
---

Apache Airflow를 Docker Compose로 설치하는 과정은 환경 구성을 쉽게 만들어줍니다. 다음은 단계별로 상세한 설명입니다.

## 1. 사전 준비

* **Docker**와 **Docker Compose**가 설치되어 있어야 합니다.
* 각 설치를 확인하려면 다음 명령어를 입력하세요

```bash
docker --version
docker-compose --version
```

## 2. 작업 디렉터리 생성 및 이동

먼저 Airflow 설정을 위한 디렉터리를 생성하고 이동합니다.

```text
mkdir airflow-docker && cd airflow-docker
```

## 3. Docker Compose 파일 생성

이제 이 디렉터리에서 docker-compose.yml 파일을 생성합니다. 이 파일에서 Airflow 웹서버, 스케줄러, 작업자, 데이터베이스 등의 구성을 정의합니다.

```yaml
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#

# Basic Airflow cluster configuration for CeleryExecutor with Redis and PostgreSQL.
#
# WARNING: This configuration is for local development. Do not use it in a production deployment.
#
# This configuration supports basic configuration using environment variables or an .env file
# The following variables are supported:
#
# AIRFLOW_IMAGE_NAME           - Docker image name used to run Airflow.
#                                Default: apache/airflow:2.10.2
# AIRFLOW_UID                  - User ID in Airflow containers
#                                Default: 50000
# AIRFLOW_PROJ_DIR             - Base path to which all the files will be volumed.
#                                Default: .
# Those configurations are useful mostly in case of standalone testing/running Airflow in test/try-out mode
#
# _AIRFLOW_WWW_USER_USERNAME   - Username for the administrator account (if requested).
#                                Default: airflow
# _AIRFLOW_WWW_USER_PASSWORD   - Password for the administrator account (if requested).
#                                Default: airflow
# _PIP_ADDITIONAL_REQUIREMENTS - Additional PIP requirements to add when starting all containers.
#                                Use this option ONLY for quick checks. Installing requirements at container
#                                startup is done EVERY TIME the service is started.
#                                A better way is to build a custom image or extend the official image
#                                as described in https://airflow.apache.org/docs/docker-stack/build.html.
#                                Default: ''
#
# Feel free to modify this file to suit your needs.
---
x-airflow-common:
  &airflow-common
  # In order to add custom dependencies or upgrade provider packages you can use your extended image.
  # Comment the image line, place your Dockerfile in the directory where you placed the docker-compose.yaml
  # and uncomment the "build" line below, Then run `docker-compose build` to build the images.
  # image: ${AIRFLOW_IMAGE_NAME:-apache/airflow:2.10.2}
  build: .
  environment:
    &airflow-common-env
    AIRFLOW__CORE__EXECUTOR: CeleryExecutor
    AIRFLOW__CORE__FERNET_KEY: ''
    AIRFLOW__CORE__DAGS_ARE_PAUSED_AT_CREATION: 'true'
    AIRFLOW__CORE__LOAD_EXAMPLES: 'false'
    AIRFLOW__CORE__ENABLE_XCOM_PICKLING: 'true'
    AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://airflow:airflow@postgres/airflow
    AIRFLOW__CELERY__RESULT_BACKEND: db+postgresql://airflow:airflow@postgres/airflow
    AIRFLOW__CELERY__BROKER_URL: redis://:@redis:6379/0
    AIRFLOW__API__AUTH_BACKENDS: 'airflow.api.auth.backend.basic_auth,airflow.api.auth.backend.session'
    # yamllint disable rule:line-length
    # Use simple http server on scheduler for health checks
    # See https://airflow.apache.org/docs/apache-airflow/stable/administration-and-deployment/logging-monitoring/check-health.html#scheduler-health-check-server
    # yamllint enable rule:line-length
    AIRFLOW__SCHEDULER__ENABLE_HEALTH_CHECK: 'true'
    # WARNING: Use _PIP_ADDITIONAL_REQUIREMENTS option ONLY for a quick checks
    # for other purpose (development, test and especially production usage) build/extend Airflow image.
    _PIP_ADDITIONAL_REQUIREMENTS: ${_PIP_ADDITIONAL_REQUIREMENTS:-}
    # The following line can be used to set a custom config file, stored in the local config folder
    # If you want to use it, outcomment it and replace airflow.cfg with the name of your config file
    # AIRFLOW_CONFIG: '/opt/airflow/config/airflow.cfg'
  volumes:
    - ${AIRFLOW_PROJ_DIR:-.}/output:/opt/airflow/output
    - ${AIRFLOW_PROJ_DIR:-.}/dags:/opt/airflow/dags
    - ${AIRFLOW_PROJ_DIR:-.}/logs:/opt/airflow/logs
    - ${AIRFLOW_PROJ_DIR:-.}/config:/opt/airflow/config
    - ${AIRFLOW_PROJ_DIR:-.}/plugins:/opt/airflow/plugins
  user: "${AIRFLOW_UID:-50000}:0"
  depends_on:
    &airflow-common-depends-on
    redis:
      condition: service_healthy
    postgres:
      condition: service_healthy

services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_USER: airflow
      POSTGRES_PASSWORD: airflow
      POSTGRES_DB: airflow
    volumes:
      - postgres-db-volume:/var/lib
```

## 설명

* **PostgreSQL**: Airflow 메타데이터를 저장할 데이터베이스로 사용됩니다.
* **Redis**: CeleryExecutor의 메시지 브로커로 사용됩니다.
* **Airflow 웹 서버**: 8080 포트를 통해 접근 가능하며, 기본 웹 UI를 제공합니다.
* **Airflow 스케줄러**: DAG와 작업을 스케줄링하며, DAG 실행 상태를 관리합니다.
* **Airflow 작업자**: CeleryExecutor를 통해 작업을 병렬로 처리합니다.

## 4. 파일 및 디렉터리 준비

Airflow는 dags, logs, plugins 등의 디렉터리가 필요합니다. 다음 명령어를 통해 디렉터리를 생성하세요.

```text
mkdir -p ./logs ./plugins ./output ./config
```

## 5. Airflow 초기화

Airflow 를 초기화하려면 아래 명령어를 실행합니다.

```bash
echo "AIRFLOW_UID=$(id -u)" >> .env

docker-compose up -d airflow-init

# Docker version 27.2.0, build 3ab4256
docker compose up airflow-init
```

## 6. Docker Compose로 모든 서비스 시작

```text
docker-compose up
```

## 7. Airflow 웹 UI에 접근

모든 서비스가 정상적으로 시작되면, 브라우저에서 http://localhost:8080으로 이동하여 Airflow 웹 UI에 접근할 수 있습니다. 설정한 사용자 계정으로 로그인하면 DAG와 작업을 확인할 수 있습니다.

## 8. 종료 및 정리

작업이 끝나고 나면 다음 명령어로 모든 컨테이너를 종료하고 정리할 수 있습니다.

```bash
docker-compose down
docker compose down --volumes --rmi all
```

## 9. Apache Airflow 이미지를 커스터마이징

Docker Compose 환경에서 사용자 정의 Dockerfile을 추가하여 Apache Airflow 이미지를 커스터마이징할 수 있습니다. 사용자 정의 Dockerfile은 Airflow 컨테이너에 필요한 추가 패키지, 라이브러리, 또는 설정 파일을 설치하거나 복사하는 데 유용합니다.

## 단계별 설정 방법

1. 작업 디렉터리로 이동 기존의 Airflow 설정 디렉터리 (airflow-docker)로 이동합니다.
2. 사용자 정의 Dockerfile 작성 작업 디렉터리 내에 Dockerfile을 생성하고, 추가하고자 하는 설정을 작성합니다. 예를 들어, 특정 Python 라이브러리를 설치하거나 설정 파일을 복사할 수 있습니다.
3. Docker Compose 파일 수정 docker-compose.yml 파일에서 build 옵션을 사용하여 사용자 정의 Dockerfile을 참조하도록 설정합니다. 이를 통해 Docker Compose가 Apache Airflow 이미지를 Dockerfile을 사용해 빌드하고 실행합니다.

```text
FROM apache/airflow:2.10.2
ADD requirements.txt .
RUN pip install apache-airflow==${AIRFLOW_VERSION} -r requirements.txt
```
