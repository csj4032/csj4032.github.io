---
title: about
layout: page
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

18년 9개월째 개발을 하고 있고, 최근 몇 년은 데이터 엔지니어링에 집중하고 있습니다.

| 기간 | 회사 | 역할 |
| --- | --- | --- |
| 2025.04 – 재직 중 | 윌로그 | 데이터엔지니어 팀장 |
| 2024.10 – 2025.04 | 플로틱 | 데이터/백엔드 |
| 2020.12 – 2024.10 | 뉴넥스 | 데이터 엔지니어 |
| 2017 – 2020 | 위메프 | 추천·프로모션 시스템 |
| 2016 – 2017 | 메쉬코리아 | 백엔드 |
| 2013 – 2016 | 디케이테크인 (a Kakao company) | 백엔드 |
| 2007 – 2013 | 지앤솔루션 · 대형웍스 외 | 웹 개발 |

최근에 한 일들을 몇 가지 추리면 이렇습니다. EC2 위에서 돌던 Airflow를 MWAA로 전면 이관하고 CI/CD와 형상관리 체계를 세웠습니다. AWS의 실시간·IoT 데이터를 GCP BigQuery로 모으는 하이브리드 아키텍처를 설계하면서 메달리온 4계층 구조를 잡고, Redshift에서 BigQuery로의 마이그레이션과 Aurora CDC 파이프라인을 구축했습니다. MSK(Kafka) 클러스터를 개발·스테이징·운영 3종으로 올리고 Connect와 커스텀 SMT로 실시간 적재를 붙였습니다. 파이프라인 산출물에는 Deequ와 Great Expectations로 품질 검증을 걸었고, 검색 쪽은 OpenSearch에 Nori 형태소 분석과 KNN 벡터 검색을 얹어 RAG 인덱싱까지 이어붙였습니다.

그 전에는 추천과 검색이 주된 일이었습니다. 협업 필터와 Association Rule 기반 추천, 상품 데이터 마트, 사용자 행동 로그 ETL, 데이터브릭스 기반 웨어하우스 같은 것들입니다.

#### Data : Spark, Airflow(MWAA), Kafka(MSK), Hadoop, EMR, Databricks, Great Expectations, Pandas

#### Storage : BigQuery, MySQL·Aurora, PostgreSQL, Elasticsearch·OpenSearch, Redshift, MongoDB, Redis, InfluxDB

#### Languages : Java, Kotlin, Scala, Python, SQL, JavaScript

#### Cloud : AWS, GCP

#### Certificates : 빅데이터분석기사, ADSP, SQLD, DASP, 정보처리기사

#### Education : 경상대학교 (2006 졸업)

#### Email : csj4032@gmail.com

#### LinkedIn : [linkedin.com/in/성조-최](https://www.linkedin.com/in/%EC%84%B1%EC%A1%B0-%EC%B5%9C-253723105/)

#### AWS 기술 블로그 기고 : [AWS 서비스를 활용한 검색 시스템 구축과 운영](https://aws.amazon.com/ko/blogs/tech/building-and-operating-search-system-using-aws-services/)

#### Github : [https://github.com/csj4032](https://github.com/csj4032)

들여다보는 것들 — [delta](https://github.com/csj4032/delta) (Lakehouse 스토리지), [spark](https://github.com/csj4032/spark), [airflow](https://github.com/csj4032/airflow), [enjoy-workflow](https://github.com/csj4032/enjoy-workflow) · [enjoy-workreduce](https://github.com/csj4032/enjoy-workreduce)

읽고 정리한 것들 — [enjoy-algorithm](https://github.com/csj4032/enjoy-algorithm), [enjoy-design-pattern](https://github.com/csj4032/enjoy-design-pattern), [enjoy-java-books](https://github.com/csj4032/enjoy-java-books)

#### Online Judge :
> [백준 https://www.acmicpc.net/user/genius_choi](https://www.acmicpc.net/user/genius_choi)

> [코딩도장 http://codingdojang.com/profile/answer/3309/](http://codingdojang.com/profile/answer/3309/)
