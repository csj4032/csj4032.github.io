---
title: about
layout: page
description: "18년 9개월차 개발자 MMIX입니다. Spark·Airflow·Kafka로 데이터 파이프라인을 만들고, AWS와 GCP를 오가는 데이터 플랫폼을 설계합니다. 경력과 기술 스택을 정리했습니다."
---

#### Name : MMIX

#### Job : 데이터 엔지니어 · 백엔드 개발자

#### Location : Seoul

#### Description : 게으르고 명석하지 못한 개발자

#### Career

데이터를 옮기고 쌓고 꺼내 쓰는 일이 주 무대입니다. Spark로 대용량을 처리하고 Airflow로 워크플로를 엮으며, Delta Lake 기반의 레이크하우스 구조를 들여다보고 있습니다. 파이프라인은 한 번 잘 도는 것보다 실패했을 때 어디서부터 다시 돌릴 수 있는지가 중요하다고 생각합니다.

저장소는 하나로 뭉치기보다 질문의 성격에 맞게 나눠 씁니다. 정합성이 필요한 정본은 MySQL, 관계 탐색은 Neo4j, 본문 검색과 임베딩은 Elasticsearch, 로그성 문서는 MongoDB, 캐시는 Redis·Couchbase 식으로 역할을 갈라 두는 편입니다.

요즘 만드는 것은 수집부터 발행까지 한 줄기로 묶은 자동화 플랫폼입니다. 공시·리서치 리포트·뉴스·시세를 모아 정본을 MySQL에 두고, 종목 사이의 관계는 Neo4j에, 본문은 임베딩해 Elasticsearch에 넣습니다. 그 위에 모멘텀·가치주 스크리닝과 백테스트를 얹었고, 가중치는 감으로 정하지 않고 라벨이 쌓인 뒤 실제 수익률과의 상관을 보고 조정합니다.

JVM(Java·Kotlin·Scala)과 Python을 오가며 이 파이프라인을 떠받치는 백엔드도 함께 만듭니다.

구조는 헥사고날로 두어 domain → application → infrastructure 방향을 테스트로 강제하고, 함수 길이나 파라미터 수 같은 규약도 게이트로 막아 둡니다. 잘 도는 코드보다 고쳐 쓸 수 있는 코드가 오래 간다고 생각합니다.

이 블로그의 알고리즘·자료구조·디자인 패턴·Spark·Airflow 글은 그 과정에서 다시 익힌 것들의 기록입니다.

#### Work

18년 9개월째 개발을 하고 있습니다. 웹 개발로 시작해 백엔드를 거쳐, 최근 몇 년은 데이터 엔지니어링에 집중하고 있습니다. 지금은 데이터 엔지니어 팀장으로 일합니다.

최근에 한 일들입니다.

- **워크플로 이관** — EC2에서 돌던 Airflow를 매니지드 환경으로 옮겼습니다. CI/CD와 형상관리 체계를 함께 세웠습니다.
- **멀티클라우드 데이터 플랫폼** — AWS의 실시간·IoT 데이터를 BigQuery로 모으는 하이브리드 구조를 설계했습니다. 메달리온 4계층으로 나누고, 웨어하우스 마이그레이션과 CDC 파이프라인을 붙였습니다.
- **실시간 스트리밍** — Kafka 클러스터를 개발·스테이징·운영으로 나눠 구축하고, Connect와 커스텀 SMT로 적재 경로를 만들었습니다.
- **데이터 품질** — 파이프라인 산출물에 Deequ와 Great Expectations로 검증을 걸었습니다.
- **검색과 RAG** — OpenSearch에 한국어 형태소 분석과 벡터 검색을 얹어 인덱싱 파이프라인을 만들었습니다.

그 전에는 추천과 검색이 주된 일이었습니다. 협업 필터와 Association Rule 기반 추천, 상품 데이터 마트, 사용자 행동 로그 ETL, 데이터브릭스 기반 웨어하우스 같은 것들입니다.

#### DevOps

데브옵스 담당이 공석인 기간 동안 데이터 플랫폼의 인프라를 직접 맡았습니다. 파이프라인을 만드는 일과 그것이 돌아갈 바닥을 까는 일이 분리되지 않는 상황이었는데, 덕분에 위에서 쓰는 것들이 아래에서 어떻게 서 있는지 알게 됐습니다.

- **분석·처리 환경 구축** — MWAA, EMR Studio, SageMaker를 세팅하고, EMR Spark 실행 이미지를 ECR로 관리했습니다.
- **스트리밍 인프라** — MSK 클러스터와 MSK Connect를 구성했습니다. 보안 그룹·서브넷·Secrets·KMS 같은 주변 설정까지 포함합니다.
- **AWS ↔ GCP 연동** — MSK Connect로 BigQuery에 실시간 적재하는 경로와, Aurora를 Datastream으로 BigQuery에 CDC 복제하는 경로를 각각 구성했습니다. 두 클라우드를 잇는 네트워크와 인증(OIDC) 설정이 실제로는 가장 손이 많이 갔습니다.
- **데이터베이스 운영** — RDS Aurora 파라미터 그룹을 관리했습니다.
- **인프라 설정 관리** — 이미 갖춰져 있던 Terraform 구성 위에서 필요한 부분만 수정하고 배포를 관리했습니다. Secrets Manager, IAM 역할·정책, 계정 권한이 주된 대상이었습니다.

전담은 아니었지만, 데이터 처리를 위한 AWS 인프라가 어떻게 구성되는지 이해하고 있고 필요한 설정은 직접 할 수 있습니다.

#### Data : Spark, Airflow(MWAA), Kafka(MSK), Hadoop, EMR, Databricks, Great Expectations, Pandas

#### Infra : Terraform, IAM, Secrets Manager, MSK Connect, Datastream, ECR, EMR Studio, SageMaker

#### Storage : BigQuery, MySQL·Aurora, PostgreSQL, Elasticsearch·OpenSearch, Redshift, MongoDB, Redis, InfluxDB

#### Languages : Java, Kotlin, Scala, Python, SQL, JavaScript

#### Cloud : AWS, GCP

#### Certificates : 빅데이터분석기사, ADSP, SQLD, DASP, 정보처리기사

#### Email : csj4032@gmail.com

#### LinkedIn : [linkedin.com/in/성조-최](https://www.linkedin.com/in/%EC%84%B1%EC%A1%B0-%EC%B5%9C-253723105/)

#### AWS 기술 블로그 기고 : [AWS 서비스를 활용한 검색 시스템 구축과 운영](https://aws.amazon.com/ko/blogs/tech/building-and-operating-search-system-using-aws-services/)

#### Github : [https://github.com/csj4032](https://github.com/csj4032)

#### Portfolio : [포트폴리오 보기](/portfolio/) · [PDF 내려받기](/assets/portfolio/csj4032-portfolio.pdf)

