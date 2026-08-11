---
title: "Apache Spark 4.2 / 4.3 신규 기능 정리"
description: "4.2.0은 플랫폼 레벨 릴리스(Java 25, Pandas 3, K8s, GEOSPATIAL, CDC CHANGES, QUALIFY, Real-Time Mode), 4.3.0은 SQL 엔진 내부 중심(압축 아카이브 읽기, UNNEST/JSON_TABLE, AQE 스큐 최적화)입니다. 실무 적용 관점에서 정리했습니다."
categories:
 - data-engineering
 - spark
tags:
 - spark
 - spark4
 - cdc
 - geospatial
 - aqe
 - sql
---

## TL;DR

**4.2.0**은 플랫폼 레벨 릴리스입니다 — Java 25, Pandas 3, K8s, Web UI 현대화, 보안, 그리고 **GEOSPATIAL 타입**·**CDC CHANGES 절**·**QUALIFY**·**Real-Time Mode**가 들어갔습니다. 지금 쓸 수 있습니다.

**4.3.0**은 SQL 엔진 내부 중심입니다 — **압축 아카이브 직접 읽기**, **UNNEST**/**JSON_TABLE**, AQE 스큐 최적화. 아직 릴리스 전(안정화 중)입니다.

> **검증 수준**: 아래 구문은 `branch-4.2` / `branch-4.3`의 ANTLR 문법(`SqlBaseParser.g4`), `FunctionRegistry`, `ExpressionDescription`, `docs/*.md`에 대조해 작성한 것입니다. **실행 검증은 하지 않았습니다.** 4.3.0은 릴리스 전이라 GA까지 변경될 수 있습니다. 조사 시점은 2026-08-05입니다.

## 1. 릴리스 현황

`https://spark.apache.org/docs/latest/`가 가리키는 것은 4.2.0입니다.

| 브랜치 | 버전 | 상태 |
| --- | --- | --- |
| `branch-4.2` | 4.2.0 | 릴리스 완료 (`v4.2.0` 태그 존재) |
| `branch-4.3` | 4.3.0-SNAPSHOT | 안정화 중 (컷 완료, RC 태그 없음) |
| `branch-4.x` | 4.4.0-SNAPSHOT | 개발 중 (다음 피처 릴리스) |
| `master` | 5.0.0-SNAPSHOT | 개발 중 (다음 메이저) |

Spark는 `branch-4.x`를 굴리다가 릴리스 시점에 `branch-4.3` 같은 브랜치를 잘라내고 `branch-4.x`의 버전을 올리는 방식입니다.

| 타입 | 4.2.0 | 4.3.0 |
| --- | --- | --- |
| Sub-task | 1043 | - |
| Bug | 275 | 151 |
| Improvement | 204 | 204 |
| Test | 97 | 46 |
| New Feature | 22 | 19 |
| Documentation | 16 | 13 |
| **합계** | **1778** | **867** |

### 지금 쓰는 버전 확인

새 문법을 시험하기 전에 어느 버전에 붙어 있는지부터 확인하는 편이 빠릅니다.

```python
print(spark.version)                      # 4.2.0
print(spark.sparkContext.version)

# 기능 플래그가 존재하는지 (없으면 그 버전에 아직 없음)
def has_conf(key):
    try:
        spark.conf.get(key)
        return True
    except Exception:
        return False

for key in [
    "spark.sql.path.enabled",                    # SET PATH (4.2)
    "spark.sql.files.archive.reader.enabled",    # 압축 아카이브 (4.3)
    "spark.sql.adaptive.enabled",
]:
    print(f"{key:45s} {has_conf(key)}")
```

함수가 등록돼 있는지는 카탈로그로 확인합니다.

```python
names = {f.name for f in spark.catalog.listFunctions()}
for fn in ["time_bucket", "counter_diff", "collect_union",
           "vector_cosine_similarity", "hmac"]:
    print(f"{fn:28s} {fn in names}")
```

## 2. Spark 4.2.0 신규 기능

### 2-1. 신규 문서 페이지로 본 사용자 노출 기능

`branch-4.1` → `branch-4.2`에서 새로 생긴 문서 페이지입니다. JIRA는 내부 리팩터링까지 다 잡히지만, **문서가 새로 생겼다는 건 사용자가 직접 쓰는 기능이 추가됐다는 뜻**이라 신규 기능을 역추적하는 가장 확실한 지표입니다.

| 기능 | 설명 |
| --- | --- |
| **GEOMETRY / GEOGRAPHY 타입** | OGC 표준 공간 데이터 타입. POINT, LINESTRING, POLYGON 등을 네이티브 타입으로 다룸 |
| **Real-Time Mode** | 마이크로배치보다 낮은 지연을 목표로 하는 스트리밍 실행 모드 |
| **QUALIFY** 절 | 윈도우 함수 결과를 서브쿼리 없이 필터링 |
| **SQL 스크립팅 커서** | OPEN / FETCH / CLOSE — SQL 스크립트에서 결과셋을 행 단위 순회 |
| **SET PATH** / `current_path()` | 함수·타입 이름 해석 경로를 세션 단위로 지정 (PostgreSQL의 search_path와 유사) |
| `SHOW COLLATIONS` | 사용 가능한 collation 목록 조회 |
| 파라미터 마커 | 쿼리 파라미터 바인딩 문법 문서화 |
| DSv2 데이터소스 문서 | DataSource V2 커넥터 작성 가이드 |
| ML 보안 / Connect 주의사항 | ML 모델 로딩 보안 모델, Connect 사용 시 함정 정리 |

### 2-2. 대형 에픽 — 4.2.0의 실제 무게중심

릴리스 준비 잡무(SPARK-54137, 510건)를 제외한 상위 에픽입니다.

| 건수 | 에픽 | 무엇을 하는가 |
| --- | --- | --- |
| 54 | SPARK-55760 Web UI Modernization | Bootstrap 4.6.2 → 5.3.8, D3.js 7.9.0, vis-timeline 7.7.3 업그레이드. **2020년 이후 미유지보수인 dagre-d3 교체**, DataTables 2.x, **jQuery 제거 로드맵**이 후속 과제 |
| 54 | SPARK-55139 Support Pandas 3 | pandas 3.0 대응. pandas API on Spark와 Pandas UDF 전반의 호환성 확보 |
| 35 | SPARK-55555 Heterogeneous K8s executor | 기존 executor 관리는 Dynamic Allocation / Resource Profile / Executor Rolling 세 가지였고 **대부분의 코드가 executor가 동질적이라고 가정**했음. **In-Place Pod Update**로 CPU·메모리 동적 조정, **AllowVolumeExpansion**으로 PVC 확장, OOM 대비 **Recovery-mode Executor**(executor JVM당 태스크 1개) 도입 |
| 29 | SPARK-51167 Java 25 | Java 25(LTS) 빌드·실행 지원 |
| 26 | SPARK-55556 Improve Security | 보안 개선 우산 티켓 |
| 22 | SPARK-51658 SPIP: Geospatial types | GEOMETRY(평면)와 GEOGRAPHY(타원체) 추가. OGC 표준 도형 지원 |
| 15 | SPARK-54955 Pandas UDF with PyArrow Backend | Pandas UDF 백엔드를 PyArrow로 전환 |
| 11 | SPARK-55668 SPIP: CDC Support | 커넥터마다 제각각이던 변경 데이터 조회를 `CHANGES` SQL 절로 표준화 |
| 14 | SPARK-56249 SPIP: Auto CDC | CDC 피드를 **소비**하는 쪽. SCD Type 1/2를 손으로 짠 MERGE 없이 처리 |
| 14 | SPARK-56603 K8s Resource Manager API | K8s 리소스 매니저 API 개선 |
| 13 | SPARK-55227 RDD API compatibility | Spark Connect에서 RDD API 호환 계층 |
| 12 | SPARK-54806 Search path support | `SET PATH`로 함수·타입 해석 경로 지정 |
| 9 | SPARK-55722 Vectorized Data Loading | 벡터화 데이터 로딩 경로 최적화 |

### 2-3. New Feature 22건 — 카테고리별

**SQL 쿼리 기능**

- **SPARK-56395 — SPIP: `NEAREST BY` Top-K Ranking Join.** 쿼리 측 각 행에 대해 base 측에서 점수 표현식 기준 top-K 행을 찾습니다. **시맨틱 검색·추천의 빌딩 블록**입니다.
- **SPARK-54713 — 벡터 유사도 / 거리 함수.** 코사인 유사도, 내적, L2 거리 등 7개. NEAREST BY와 짝을 이룹니다.
- **SPARK-56594 — `time_bucket`.** `date_trunc`과 달리 임의 간격(5분, 90초 등)과 origin 정렬이 가능합니다.
- **SPARK-55702 — 윈도우 집계 함수의 filter 술어.** 기존에는 `CASE WHEN`으로 우회해야 했습니다.
- **SPARK-55322 — `max_by`/`min_by`의 k > 1 오버로드.** 상위 k건을 배열로 반환합니다.
- **SPARK-55558 — Tuple/Theta 집합 연산.** 근사 카디널리티 집계를 조합할 수 있습니다.
- **SPARK-54806 — Search path 지원.**

**SQL 카탈로그 / DSv2**

- **SPARK-55855 — DSv2 Transaction API 기반.** begin / abort / commit 기계장치를 제공하고, 카탈로그가 트랜잭션 경계 안의 읽기·쓰기를 추적할 수 있게 합니다. **멀티 스테이트먼트 트랜잭션의 토대**입니다.
- SPARK-52729 — DSv2 카탈로그용 `MetadataOnlyTable` + CREATE/ALTER VIEW
- SPARK-54760 — `DelegatingCatalogExtension`이 V1·V2 함수 모두 지원
- SPARK-56598 / SPARK-56680 — `TruncatableTable` 커스텀 메트릭, DSv2 INSERT 연산 메트릭

**Connect / PySpark / Streaming**

- **SPARK-55227 — RDD API 호환성.** Connect 전환의 걸림돌 하나가 줄었습니다.
- SPARK-55606 / SPARK-55691 — `GetStatus` API (쿼리 실행 상태 조회)
- SPARK-56221 — `spark.catalog.*` vs DDL 커맨드 기능 패리티
- SPARK-56518 / SPARK-55705 / SPARK-55096 — `current_path` 함수, PyArrow 23, pandas 최소 버전
- **SPARK-54660 — Real-Time Mode 트리거를 Python에 추가.**

**관측성**

- SPARK-56509 / SPARK-56647 — Last Attempt Metrics. 태스크 재시도가 있었을 때 **마지막 성공 시도의 메트릭**을 쓰도록 해서 중복 집계를 막습니다.

### 2-4. 동작 변경 — 업그레이드 시 확인 필요

성능 개선은 대체로 그냥 이득이지만, 아래 넷은 **결과가 달라질 수 있는** 변경입니다.

- **SPARK-55964** — 기본적으로 시스템 스키마 shadowing을 막습니다. 시스템 스키마와 같은 이름을 쓰던 쿼리가 영향받습니다.
- **SPARK-56654** — JSON 파싱에 엄격한 유니코드 검증. 기존에 통과하던 잘못된 인코딩 데이터가 실패할 수 있습니다.
- **SPARK-56031** — `NATURAL JOIN`이 대소문자 무시 컬럼 매칭을 무시하던 문제 수정. **조인 결과가 달라질 수 있습니다.**
- **SPARK-56089** — `asinh`/`acosh`를 fdlibm 알고리즘에 정렬. 말단 자릿수가 바뀝니다.

성능 쪽에서는 이런 것들이 있습니다.

- **SPARK-56235** — `TaskSetManager.executorLost()`의 O(N) 스캔이 DriverEndpoint를 정체시키던 문제. executor가 자주 죽는 대규모 클러스터에서 드라이버 응답성에 직접 영향
- **SPARK-56034** — 우측이 broadcastable일 때 Union을 통과하는 Join 푸시다운
- **SPARK-44065** — `localShuffleReader`가 꺼져 있을 때의 BroadcastHashJoin 스큐 최적화
- **SPARK-55144** — stream-stream join용 새 상태 포맷 버전
- **SPARK-56066 / SPARK-56067** — PySpark에서 numpy·psutil을 lazy import. 워커 부트스트랩 시간 단축

### 2-5. CDC — CHANGES SQL 절 (SPARK-55668 SPIP)

4.2.0에서 가장 실무 영향이 큰데 눈에 잘 안 띄는 항목입니다.

**문제**: 행 단위 변경(insert/update/delete) 조회 문법이 커넥터마다 달랐습니다.

| 포맷 | 기존 방식 |
| --- | --- |
| Delta Lake | `table_changes()` 함수 |
| Iceberg | `.changes` 가상 테이블 |
| Hudi | 커스텀 incremental read 옵션 |

이 파편화 때문에 쿼리 이식성이 깨지고, 커넥터마다 후처리 로직을 새로 만들어야 했습니다. "무엇이 바뀌었는지 보여줘"에 대한 **엔진 레벨 표준이 없었습니다.**

**해결**: `CHANGES` SQL 절로 통합했습니다.

```sql
-- 버전 범위
SELECT * FROM my_table CHANGES FROM VERSION 10 TO VERSION 20;

-- 경계 포함/제외 지정
SELECT * FROM my_table CHANGES FROM VERSION 10 EXCLUSIVE TO VERSION 20 INCLUSIVE;

-- 타임스탬프 범위
SELECT * FROM my_table
CHANGES FROM TIMESTAMP '2026-08-01 00:00:00' TO TIMESTAMP '2026-08-05 00:00:00';

-- 끝 경계 생략 = 현재까지
SELECT * FROM my_table CHANGES FROM VERSION 10;
```

스트리밍용으로는 `streamChangesClause`가 따로 있습니다. 시작점 없이 `CHANGES`만 쓸 수 있고, 끝 경계가 없습니다(열린 구간).

**증분 적재 루프 예시**

`CHANGES`는 SQL 절이므로 PySpark에서는 `spark.sql()`로 감싸 씁니다. 마지막 처리 버전을 어디에 저장할지가 실제 설계의 핵심입니다.

```python
from pyspark.sql import SparkSession

CHECKPOINT_TABLE = "meta.cdc_watermark"

def last_version(table: str) -> int:
    row = spark.sql(f"""
        SELECT version FROM {CHECKPOINT_TABLE} WHERE table_name = '{table}'
    """).head()
    return row.version if row else 0

def load_increment(table: str):
    since = last_version(table)

    # EXCLUSIVE 로 마지막 처리분 중복을 피한다
    changes = spark.sql(f"""
        SELECT * FROM {table} CHANGES FROM VERSION {since} EXCLUSIVE
    """)

    if changes.isEmpty():
        print(f"{table}: 변경 없음 (version={since})")
        return

    changes.write.mode("append").saveAsTable(f"staging.{table}_changes")
    # 워터마크 갱신은 적재 성공을 확인한 뒤에
    ...
```

`EXCLUSIVE`를 빼면 마지막으로 처리한 버전이 다시 딸려 들어옵니다. 타겟이 멱등하지 않다면 중복 적재가 됩니다.

**Auto CDC (SPARK-56249)**는 반대편입니다. `CHANGES`가 변경 피드를 *생산*하는 쪽이라면, Auto CDC는 그 피드를 *소비*해서 타겟 테이블에 적용하는 쪽입니다. SCD Type 1(1:1 복제)과 Type 2(변경 이력 추적)를 Declarative Pipelines의 새 flow type으로 선언하면, 손으로 짜던 복잡한 MERGE가 필요 없어집니다. 기존 수작업 MERGE는 **삭제 처리와 순서 뒤바뀜**에서 오류가 잦았습니다.

## 3. Spark 4.3.0 SQL 118건

SQL 컴포넌트의 New Feature + Improvement 118건을 17개 주제로 분류했습니다. 4.3.0 전체 기능 223건 중 SQL이 118건으로 과반입니다.

| 주제 | 건수 | 설명 |
| --- | --- | --- |
| **압축 아카이브 읽기** | 13 | tar/zip/7z를 디렉터리처럼 취급. 별도 압축 해제 단계가 사라짐 |
| AQE / 셔플 / 파티셔닝 | 14 | SMJ→SHJ 동적 변환, 조인 NULL 키 스큐 분산, 파티션 병합의 O(n²) 제거 |
| Optimizer / Codegen | 13 | **SPARK-58210으로 일부 룰이 기본 활성화** — 업그레이드 시 플랜 변화 확인 필요 |
| DSv2 커넥터 API | 12 | 4.2.0의 Transaction API 기반 위에서 generated column, MERGE/DELETE dynamic option 성숙화 |
| **새 SQL 구문 / 함수** | 11 | `UNNEST`, `JSON_TABLE`, `BIN BY`, `counter_diff` |
| 에러 메시지 / ANSI | 7 | raw 예외를 Spark 에러 조건으로 전환 |
| Arrow / 컬럼너 | 6 | Arrow View 타입, 나노초 타임스탬프 무손실 표현(opt-in) |
| Variant / JSON | 5 | variant 추출 푸시다운을 Aggregate/Sort/Join까지 확장 |
| 윈도우 함수 | 5 | segment-tree 프레임 계산을 축소 프레임과 First/Last까지 확장 |
| JDBC dialect | 4 | MariaDB CAST 구문, Databricks dialect 에러 래핑, TABLESAMPLE 푸시다운 |
| Observability | 3 | SQL REST API에 `modifiedConfigs`·노드 설명 노출, AQE 룰별 소요 시간 |
| Hive | 3 | `SHOW CREATE TABLE`의 Hive DDL 렌더링 옵션 |
| 런타임 필터 / DPP | 2 | 캐시된 조인 입력에도 runtime Bloom filter 적용 |
| Datetime 성능 | 2 | `date_trunc`과 UTC `daysToMicros`의 fast path |
| Collation / XML | 2 | COLLATE 표현식 origin 보존, XML 스키마 증분 추론 |
| 리팩터링 / 테스트 / 문서 | 16 | 사용자 영향 없음 |

### 3-1. Real-Time Mode 확장

4.3.0 New Feature 19건 중 **10건이 streaming shuffle / pipelined shuffle** 한 갈래입니다.

4.2.0의 Real-Time Mode는 마이크로배치보다 낮은 지연을 목표로 하는데, **셔플이 걸리는 순간 배치 경계가 생겨** 그 이점이 사라집니다. 기존 셔플은 map 스테이지가 전부 끝나야 reduce가 시작되기 때문입니다. 그래서 셔플 자체를 파이프라인화하는 작업이 part 1~7로 쪼개져 진행 중이고, 이게 붙어야 RTM에서 **상태 저장(stateful) 쿼리**를 쓸 수 있습니다.

- **SPARK-56674, SPARK-57141, SPARK-57337, SPARK-57229, SPARK-57230, SPARK-57232** — wire protocol, ShuffleManager, 공유 transport, Netty 기반 writer/reader, e2e 테스트
- **SPARK-58185, SPARK-58263, SPARK-58398, SPARK-58454** — pipelined shuffle: 의존성 타입별 ShuffleManager 라우팅, DAGScheduler 스테이지 그룹 동시 스케줄링, group-atomic 실패 처리, MapOutputTracker 분리
- **SPARK-58508** — RTM 스트리밍 쿼리에 pipelined shuffle 활성화 (이 갈래의 목적지)
- **SPARK-58131** — RTM async progress tracking

## 4. 문법 레퍼런스

### 4-1. GEOMETRY / GEOGRAPHY (4.2.0)

OGC Simple Feature Access 기반입니다. 런타임 값은 **WKB(Well-Known Binary)**로 표현되고, **SRID**가 좌표계를 지정합니다. SQL에서는 **반드시** `(srid)` 또는 `(ANY)`를 붙여야 합니다.

```sql
CREATE TABLE points (id BIGINT, pt GEOMETRY(4326));      -- 고정 SRID
CREATE TABLE locations (id BIGINT, loc GEOGRAPHY(4326)); -- 지리 SRID만
CREATE TABLE mixed (id BIGINT, geom GEOMETRY(ANY));      -- 행마다 다른 SRID

SELECT ST_GeomFromWKB(wkb);          -- GEOMETRY, SRID 0 (미지정)
SELECT ST_GeomFromWKB(wkb, 3857);    -- GEOMETRY, Web Mercator
SELECT ST_GeogFromWKB(wkb);          -- GEOGRAPHY, 항상 SRID 4326
```

|  | GEOMETRY | GEOGRAPHY |
| --- | --- | --- |
| 좌표계 | 평면(Cartesian) | 지리(위경도, 도 단위) |
| 언제 쓰나 | 국소·투영 좌표(CAD, UTM, Web Mercator). 교차·합집합·클리핑·포함 같은 **평면 연산** | 전역 데이터. 거리·면적이 **지구 곡률을 반영**해야 할 때. 항공·해운·글로벌 모빌리티 |
| SRID | 모든 SRID (0 = 미지정 포함) | 지리 SRID만 (보통 4326 = WGS 84) |
| 엣지 보간 | - | 항상 SPHERICAL |

어느 쪽을 쓸지 헷갈릴 때의 기준은 단순합니다. **거리와 면적이 미터 단위로 정확해야 하고 범위가 넓으면 GEOGRAPHY**, 좁은 영역에서 도형 연산 위주면 GEOMETRY입니다. 투영 좌표계에서 전역 거리를 재면 위도가 올라갈수록 오차가 커집니다.

### 4-2. QUALIFY (4.2.0)

윈도우 함수가 평가된 **이후**에 행을 필터링합니다. `WHERE`는 윈도우 함수 평가 전에 동작하므로 랭킹 결과로 거를 수 없었고, 그래서 서브쿼리로 한 겹 감싸야 했습니다.

```sql
-- 4.2.0
SELECT city, car_model,
       RANK() OVER (PARTITION BY car_model ORDER BY quantity) AS rank
FROM dealer
QUALIFY rank = 1;

-- 4.2.0 이전 (서브쿼리 필요)
SELECT city, car_model, rank FROM (
  SELECT city, car_model,
         RANK() OVER (PARTITION BY car_model ORDER BY quantity) AS rank
  FROM dealer
) WHERE rank = 1;
```

**제약 3가지**

1. `SELECT` 리스트나 `QUALIFY` 조건 중 하나에 윈도우 함수가 최소 1개 있어야 합니다.
2. `QUALIFY` 조건에 집계 함수는 쓸 수 없습니다.
3. `SELECT` alias와 입력 컬럼 이름이 같으면 **입력 컬럼이 우선**합니다 — alias로 참조한다고 생각했는데 원본 컬럼이 잡히는 함정이 있습니다.

세 번째가 조용히 틀리기 쉬운 지점입니다. 아래처럼 alias와 컬럼명이 겹치면 의도와 다른 결과가 나옵니다.

```sql
-- 원본 테이블에 이미 rank 컬럼이 있다면?
SELECT city, RANK() OVER (ORDER BY qty) AS rank
FROM dealer
QUALIFY rank = 1;        -- 윈도우 결과가 아니라 원본 rank 컬럼을 봄

-- 안전하게: alias 이름을 겹치지 않게 두거나 식을 그대로 쓴다
SELECT city, RANK() OVER (ORDER BY qty) AS qty_rank
FROM dealer
QUALIFY qty_rank = 1;
```

### 4-3. 윈도우 FILTER · max_by k>1 · time_bucket (4.2.0)

```sql
-- 조건부 누적 집계 (SPARK-55702). 이전엔 CASE WHEN으로 우회
SELECT user_id, event_time,
       sum(amount) FILTER (WHERE status = 'PAID')
         OVER (PARTITION BY user_id ORDER BY event_time) AS paid_running_total
FROM orders;

-- 그룹별 top-k를 배열로 (SPARK-55322)
SELECT category, max_by(product_name, revenue, 3) AS top3
FROM sales GROUP BY category;

-- 임의 간격 + origin 정렬 버킷팅 (SPARK-56594)
SELECT time_bucket(INTERVAL '15' MINUTE,
                   TIMESTAMP '2024-01-01 11:27:00',
                   TIMESTAMP '1970-01-01 00:00:00');
-- 2024-01-01 11:15:00

SELECT time_bucket(INTERVAL '1' MONTH,
                   TIMESTAMP '2024-07-20 14:30:00',
                   TIMESTAMP '2024-06-15 09:00:00');
-- 2024-07-15 09:00:00  (origin 기준 15일 09:00으로 정렬)
```

`time_bucket`이 `date_trunc`과 다른 지점은 **origin**입니다. `date_trunc('hour', ...)`은 언제나 정시에 맞춰지지만, `time_bucket`은 기준점을 옮길 수 있어 "매시 15분에 시작하는 1시간 구간" 같은 것을 만들 수 있습니다. 정산 주기가 자정이 아닌 경우에 유용합니다.

기존 우회 방식과 비교하면 차이가 분명합니다.

```sql
-- 이전: 5분 버킷을 직접 계산
SELECT from_unixtime(floor(unix_timestamp(measured_at) / 300) * 300) AS bucket
FROM device_telemetry;

-- 4.2.0
SELECT time_bucket(INTERVAL '5' MINUTE, measured_at) AS bucket
FROM device_telemetry;
```

### 4-4. 벡터 함수 + NEAREST BY (4.2.0)

```sql
-- 등록된 벡터 함수 7개
vector_cosine_similarity(a, b)   -- 코사인 유사도
vector_inner_product(a, b)       -- 내적
vector_l2_distance(a, b)         -- L2(유클리드) 거리
vector_norm(a) / vector_normalize(a)
vector_avg(a) / vector_sum(a)    -- 집계

-- Top-K 랭킹 조인
-- 문법: (APPROX | EXACT) NEAREST [n] BY (DISTANCE | SIMILARITY) expr
SELECT q.id, d.doc_id, vector_cosine_similarity(q.vec, d.vec) AS score
FROM queries q JOIN docs d
EXACT NEAREST 5 BY SIMILARITY vector_cosine_similarity(q.vec, d.vec);
```

`EXACT`는 정확한 top-K, `APPROX`는 근사입니다. `SIMILARITY`는 클수록 가깝고 `DISTANCE`는 작을수록 가깝다는 의미라 **정렬 방향이 반대**입니다. 둘을 바꿔 쓰면 가장 먼 것이 나오므로 주의해야 합니다.

이전에는 이런 조회를 크로스 조인 후 윈도우 함수로 잘라내야 했습니다. 문서 100만 건 × 쿼리 1만 건이면 중간 결과가 100억 행이 됩니다.

```sql
-- 이전 방식 — 카테시안 곱을 만든 뒤 잘라냄
SELECT id, doc_id, score FROM (
  SELECT q.id, d.doc_id,
         vector_cosine_similarity(q.vec, d.vec) AS score,
         ROW_NUMBER() OVER (PARTITION BY q.id
                            ORDER BY vector_cosine_similarity(q.vec, d.vec) DESC) AS rn
  FROM queries q CROSS JOIN docs d
) WHERE rn <= 5;
```

### 4-5. SET PATH (4.2.0)

```sql
SET spark.sql.path.enabled = true;   -- 기본 false

SELECT current_path();
-- system.builtin,system.session,spark_catalog.default

SET PATH = spark_catalog.default, system.builtin;
```

PostgreSQL의 `search_path`와 같은 개념입니다. 카탈로그를 여러 개 붙여 쓰는 환경에서 함수를 매번 완전 수식명으로 부르지 않아도 됩니다. 다만 **해석 순서가 결과를 바꿀 수 있으므로**, 배치 잡에서는 경로에 의존하기보다 완전 수식명을 쓰는 편이 안전합니다.

### 4-6. 압축 아카이브 직접 읽기 (4.3.0)

```python
spark.conf.set("spark.sql.files.archive.reader.enabled", "true")   # 기본 false

df = spark.read.option("header", "true").csv("s3://bucket/logs/2026-08-05.tar.gz")
df = spark.read.json("/data/events.zip")
```

지원 확장자는 `.tar`, `.tar.gz`, `.tgz`, `.zip`, `.7z` 이고, CSV·JSON·XML·Avro·ORC·Parquet·text·binaryFile·Excel에 적용됩니다.

**실무 주의사항 3가지** (소스에서 확인한 실제 동작)

1. **V1 FileFormat 경로만 지원**합니다. DSv2 스캔은 아카이브를 만나면 raw 바이트를 잘못 읽는 대신 명시적으로 거부합니다.
2. **아카이브 1개 = 스플릿 1개**입니다. `isSplitable`이 false라 큰 아카이브는 병렬화가 안 됩니다. 수십 GB짜리 tar 하나를 통으로 읽으면 태스크 하나가 다 감당하므로 **적당한 크기로 쪼개 두는 편이 낫습니다.**
3. `SQLConf.ARCHIVE_FORMAT_READER_ENABLED`의 `.version()`이 `"5.0.0"`인데 실제로는 `branch-4.3`에 들어 있습니다. 4.3.0에 먼저 실립니다.

두 번째 제약은 [파티션과 병렬도](/data-engineering/spark/2026/08/11/Spark-Core-mapPartitions-coalesce/) 이야기와 그대로 이어집니다. 아카이브 하나가 스플릿 하나면 파티션도 하나이므로, Core를 아무리 늘려도 그 파일은 Task 하나가 처리합니다.

```python
# 아카이브가 날짜별 하나뿐이면 파티션도 하나
df = spark.read.csv("s3://logs/device/2026-08-05.tar.gz")
print(df.rdd.getNumPartitions())      # 1

# 시간대별로 쪼개 두면 파티션이 늘어난다
df = spark.read.csv("s3://logs/device/2026-08-05/*.tar.gz")
print(df.rdd.getNumPartitions())      # 아카이브 개수만큼
```

### 4-7. UNNEST / JSON_TABLE (4.3.0)

`UNNEST`는 `LATERAL VIEW explode`와 달리 표준 문법이고, **여러 배열을 병렬로 전개**합니다. `explode`를 두 번 쓰면 카테시안 곱이 되지만 `UNNEST`는 위치를 맞춰 나란히 펼칩니다.

```sql
-- 문법: UNNEST(expr [, expr ...]) [WITH ORDINALITY] alias
SELECT t.id, u.tag, u.pos
FROM posts t, UNNEST(t.tags) WITH ORDINALITY AS u(tag, pos);

-- 배열 여러 개 병렬 전개 (짧은 쪽은 NULL 패딩)
SELECT u.k, u.v FROM UNNEST(array('a','b','c'), array(1, 2)) AS u(k, v);
-- a 1 / b 2 / c NULL
```

차이를 눈으로 보면 이렇습니다.

```
explode 두 번    → 3 × 2 = 6행 (카테시안 곱)
UNNEST 병렬 전개 → 3행       (위치 정렬, 부족분 NULL)
```

`JSON_TABLE`은 `from_json` + `explode` + 필드 추출 3단계를 한 구문으로 처리합니다. 컬럼 정의는 `FOR ORDINALITY`(순번), `type EXISTS PATH`(존재 여부), `type PATH`(값 추출) 3종류입니다. 현재는 flat 서브셋만 지원하고 `NESTED`는 미지원입니다.

```sql
SELECT jt.*
FROM orders o,
     JSON_TABLE(
       o.payload, '$.items[*]'
       COLUMNS (
         seq      FOR ORDINALITY,
         sku      STRING  PATH '$.sku',
         qty      INT     PATH '$.qty',
         has_disc BOOLEAN EXISTS PATH '$.discount'
       )
       NULL ON ERROR
     ) AS jt;
```

`NULL ON ERROR`가 실무에서 중요합니다. 유입 JSON의 스키마가 조금씩 흔들려도 파이프라인 전체가 죽지 않습니다.

### 4-8. counter_diff · collect_union · hmac · instr (4.3.0)

`counter_diff`는 단조 증가 카운터를 delta로 바꾸되 **리셋을 자동 감지**합니다. 단순 `lag()` 차분은 재시작 시 큰 음수가 나옵니다.

```sql
SELECT m, t, c, counter_diff(c) OVER (PARTITION BY m ORDER BY t) AS diff
FROM VALUES
  ('http_requests', TIMESTAMP_NTZ '2026-01-01 00:00:00', 100),
  ('http_requests', TIMESTAMP_NTZ '2026-01-01 00:01:00', 200),
  ('http_requests', TIMESTAMP_NTZ '2026-01-01 00:02:00', 400),
  ('http_requests', TIMESTAMP_NTZ '2026-01-01 00:03:00',  50),
  ('http_requests', TIMESTAMP_NTZ '2026-01-01 00:04:00', 100)
  AS tab(m, t, c) ORDER BY t;
```

| t | c | diff | 설명 |
| --- | --- | --- | --- |
| 00:00 | 100 | NULL | 파티션 첫 행 |
| 00:01 | 200 | 100 | 200 - 100 |
| 00:02 | 400 | 200 | 400 - 200 |
| 00:03 | 50 | NULL | **값 감소 = 리셋으로 판단** |
| 00:04 | 100 | 50 | 리셋 이후 정상 차분 |

두 번째 인자 `start_time`(카운터가 마지막으로 0이 된 시각)을 주면 리셋을 **명시적으로** 신호할 수 있습니다. 값이 증가했더라도 `start_time`이 바뀐 행은 리셋으로 처리됩니다. 재부팅이 짧아 카운터가 이전 값을 넘긴 채 재시작된 경우를 잡는 장치입니다.

```sql
-- collect_union: 입력이 배열. 원소를 펼쳐 합집합.
-- collect_set(스칼라 -> 집합)과 다름. 버퍼 크기가 행 수가 아닌 원소 종류 수에 비례
SELECT collect_union(col) FROM VALUES (array(1,2)), (array(2,3)), (array(1)) AS tab(col);
-- [1, 2, 3]
-- 기존 우회: array_distinct(flatten(collect_list(col)))  <- 중간에 거대한 리스트 생성

-- hmac: 키 기반 메시지 인증 코드. 반환 BINARY라 보통 hex()로 감쌈
SELECT hex(hmac('key', 'message', 'SHA-512'));

-- instr에 start / occurrence 추가 -> n번째 구분자 위치를 바로 찾음
SELECT instr('a.b.c.d', '.', 1, 3);    -- 3번째 출현 위치
```

`collect_union`의 이점은 **메모리**입니다. 기존 `array_distinct(flatten(collect_list(col)))`은 중복을 포함한 전체 리스트를 먼저 만든 뒤 중복을 제거합니다. 행이 많고 원소 종류가 적은 경우(예: 사용자별 방문 카테고리) 차이가 큽니다.

### 4-9. BIN BY (4.3.0)

구간(시작~끝)을 가진 행을 고정 폭 bin 경계에 맞춰 쪼개고, 측정값을 겹치는 비율대로 나눠 담습니다.

```sql
SELECT bin_start, bin_end, sum(measure * ratio) AS allocated
FROM t
BIN BY (
  RANGE start_ts TO end_ts                        -- 구간 정의 컬럼
  BIN WIDTH INTERVAL '1' HOUR                     -- bin 폭
  ALIGN TO TIMESTAMP '2026-01-01 00:00:00'        -- bin 경계 기준점
  DISTRIBUTE UNIFORM (measure)                    -- 비율대로 분배할 컬럼
  BIN_START AS bin_start
  BIN_END AS bin_end
  BIN_DISTRIBUTE_RATIO AS ratio                   -- 이 bin이 차지하는 비율
) AS b
GROUP BY bin_start, bin_end ORDER BY bin_start;
```

## 5. 정리

| 주제 | 4.2.0 | 4.3.0 |
| --- | --- | --- |
| Real-Time Mode | RTM 트리거 도입 (Python 포함) | pipelined shuffle로 상태 저장 쿼리 지원 (10건) |
| DSv2 | Transaction API 기반 (begin/abort/commit) | generated column / dynamic option 성숙화 (12건) |
| CDC | `CHANGES` 절 표준화 + Auto CDC | - |
| 반정형 데이터 | 파라미터 마커, geospatial | 아카이브 읽기(13건), `JSON_TABLE`, `UNNEST` |
| 관측성 | Last Attempt Metrics | SQL REST API `modifiedConfigs`, AQE 룰 타이밍 |

**4.2.0은 플랫폼 레벨**(Java 25, Pandas 3, K8s 이질적 executor, Web UI, 보안, geospatial SPIP, CDC 표준화) 중심이고, **4.3.0은 SQL 엔진 내부**(옵티마이저·AQE·데이터소스) 중심으로 무게가 옮겨갔습니다.

## 6. 활용 사례

아래 시나리오의 테이블·컬럼명은 **설명을 위한 가상 스키마**입니다. 각 시나리오에 "지금 어떻게 하고 있나 → 무엇이 달라지나"를 붙였습니다.

### 사례 1. 배송 상태 증분 적재 — CHANGES + Auto CDC (4.2.0)

**상황**: OMS/TMS의 배송 상태 테이블을 데이터 레이크로 동기화. 전체 스냅샷을 매번 다시 읽으면 비용이 크고, 변경분만 가져오려면 테이블 포맷마다 다른 문법을 써야 합니다.

**기존**: Delta면 `table_changes()`, Iceberg면 `.changes`. 포맷을 바꾸면 파이프라인을 다시 씁니다. 또는 `updated_at` 컬럼으로 직접 구현하는데, 이러면 **삭제된 행을 못 잡습니다.**

```sql
-- 표준 문법으로 통일. 마지막 처리 버전 이후 변경분만
SELECT * FROM shipment_status
CHANGES FROM VERSION 1520 EXCLUSIVE;

-- 배치 윈도우로 처리
SELECT * FROM shipment_status
CHANGES FROM TIMESTAMP '2026-08-05 00:00:00' TO TIMESTAMP '2026-08-05 01:00:00';
```

| 패턴 | 용도 |
| --- | --- |
| SCD Type 1 | 화주·상품 마스터 1:1 복제 (최신 상태만 유지) |
| SCD Type 2 | 배송 상태·재고 변동 이력 추적 (변경 시점별 이력 보존) |

### 사례 2. IoT 센서 시계열 — time_bucket + counter_diff (4.2.0 / 4.3.0)

**상황**: 차량·컨테이너 디바이스가 온도, 위치, 누적 주행거리를 올립니다. 전송 주기가 불규칙하고, 디바이스가 재부팅되면 누적 카운터가 0으로 리셋됩니다.

**기존**: `date_trunc`은 5분·10분 같은 임의 간격을 못 자릅니다. `floor(unix_timestamp/300)*300` 식으로 계산하는데 가독성이 떨어지고 origin 정렬이 안 됩니다. 카운터 리셋은 `lag()` 차분 후 `CASE WHEN diff < 0`으로 직접 걸러야 합니다.

```sql
-- 5분 버킷 온도 집계 + 주행거리 구간 증가량
SELECT
  device_id,
  time_bucket(INTERVAL '5' MINUTE, measured_at) AS bucket,
  avg(temperature)  AS avg_temp,
  max(temperature)  AS max_temp,
  -- 누적 odometer -> 구간 주행거리. 재부팅 리셋은 NULL로 처리됨
  sum(counter_diff(odometer) OVER (PARTITION BY device_id ORDER BY measured_at))
    AS distance_delta
FROM device_telemetry
GROUP BY device_id, bucket;

-- 리셋 시각을 아는 경우 명시적으로 신호
SELECT device_id, measured_at,
       counter_diff(odometer, boot_time)
         OVER (PARTITION BY device_id ORDER BY measured_at) AS delta
FROM device_telemetry;
```

콜드체인 온도 이탈 탐지에도 같은 조합이 쓰입니다 — 버킷별 최고 온도가 기준을 넘은 구간만 추리면 됩니다.

### 사례 3. 최신 상태 / 상위 N 조회 — QUALIFY + max_by (4.2.0)

**상황**: "주문별 최신 배송 상태 1건", "화주별 물량 상위 3개 품목" 같은 조회. 데이터 팀에서 가장 자주 쓰는 패턴입니다.

```sql
-- 주문별 최신 배송 상태 1건
SELECT order_id, status, updated_at
FROM shipment_status
QUALIFY ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY updated_at DESC) = 1;

-- 창고별 재고조사 변동이 큰 로케이션 상위 5
SELECT warehouse_id, location_code, qty_diff
FROM stocktake_diff
QUALIFY RANK() OVER (PARTITION BY warehouse_id ORDER BY abs(qty_diff) DESC) <= 5;

-- 화주별 물량 상위 3개 품목 -> 배열 하나로
SELECT shipper_id, max_by(sku, total_qty, 3) AS top3_sku
FROM monthly_volume
GROUP BY shipper_id;
```

`max_by(x, y, k)`는 셔플을 한 번 덜 타므로 `ROW_NUMBER()` + 서브쿼리 조합보다 유리합니다. 다만 **결과가 배열**이라 이후 처리 방식이 달라집니다 — 행으로 펼치려면 `explode`(또는 4.3의 `UNNEST`)가 필요합니다.

### 사례 4. 위치 기반 배차·권역 판정 — GEOGRAPHY + NEAREST BY (4.2.0)

**상황**: 배송지에서 가장 가까운 집하지 찾기, 배송권역(폴리곤) 안에 드는지 판정.

**기존**: 위경도를 `DOUBLE` 두 컬럼으로 두고 Haversine 공식을 UDF나 수식으로 직접 구현. 폴리곤 포함 판정은 외부 라이브러리로 빼거나 근사 처리.

```sql
CREATE TABLE delivery_points (
  order_id   BIGINT,
  addr_point GEOGRAPHY(4326)
);

CREATE TABLE hubs (
  hub_id    STRING,
  hub_point GEOGRAPHY(4326)
);

-- 각 배송지에 대해 가장 가까운 집하지 3곳
SELECT d.order_id, h.hub_id
FROM delivery_points d JOIN hubs h
EXACT NEAREST 3 BY DISTANCE ST_Distance(d.addr_point, h.hub_point);
```

### 사례 5. 주문 payload 파싱 — JSON_TABLE + UNNEST (4.3.0)

**상황**: 주문·B/L·인보이스가 JSON으로 들어오고, 안에 품목 배열이 중첩돼 있습니다.

**기존**: `from_json`으로 스키마를 붙이고 → `explode`로 펼치고 → 필드를 하나씩 꺼내는 3단계.

```sql
SELECT o.order_id, jt.seq, jt.sku, jt.qty, jt.cbm
FROM orders o,
     JSON_TABLE(
       o.payload, '$.items[*]'
       COLUMNS (
         seq FOR ORDINALITY,
         sku STRING  PATH '$.sku',
         qty INT     PATH '$.qty',
         cbm DOUBLE  PATH '$.cbm',
         is_hazmat BOOLEAN EXISTS PATH '$.hazmat'
       )
       NULL ON ERROR
     ) AS jt;

-- 경유지 배열과 도착예정시각 배열을 위치 맞춰 병렬 전개
SELECT r.route_id, u.stop_seq, u.location_code, u.eta
FROM routes r,
     UNNEST(r.stop_codes, r.etas) WITH ORDINALITY AS u(location_code, eta, stop_seq);
```

### 사례 6. 보관료·사용량 기간 안분 — BIN BY (4.3.0)

**상황**: 입고~출고 기간이 여러 날/월에 걸친 재고의 보관료를 일별·월별로 나눠 계산.

**기존**: `sequence()` + `explode`로 날짜를 생성하고 각 날의 겹침 시간을 계산해 비율을 곱하는 식인데, 경계 처리에서 실수가 잦고 쿼리가 깁니다.

```sql
SELECT bin_start AS storage_date,
       sum(storage_fee * ratio) AS daily_fee
FROM inventory_periods
BIN BY (
  RANGE inbound_at TO outbound_at
  BIN WIDTH INTERVAL '1' DAY
  ALIGN TO TIMESTAMP '2026-01-01 00:00:00'
  DISTRIBUTE UNIFORM (storage_fee)
  BIN_START AS bin_start
  BIN_END   AS bin_end
  BIN_DISTRIBUTE_RATIO AS ratio
) AS b
GROUP BY bin_start
ORDER BY bin_start;
```

월 마감 정산, 화주별 일할 청구, 시간대별 차량 가동률 산출이 같은 형태입니다.

### 사례 7. 로그 아카이브 직접 조회 — 압축 아카이브 (4.3.0)

**상황**: 디바이스·차량 로그가 일자별 `.tar.gz`로 오브젝트 스토리지에 쌓입니다. 장애 조사 때 특정 날짜만 들여다보고 싶습니다.

**기존**: 해제용 배치 잡을 따로 돌려 임시 경로에 풀고, 그 경로를 읽고, 나중에 정리합니다. 조사 한 번에 스텝이 셋입니다.

```python
spark.conf.set("spark.sql.files.archive.reader.enabled", "true")

df = (spark.read
        .option("header", "true")
        .csv("s3://logs/device/2026-08-05.tar.gz"))

df.filter("level = 'ERROR'").groupBy("device_id").count().show()
```

**도입 전 확인**: 아카이브 1개가 스플릿 1개라 병렬화가 안 됩니다. 일자별 아카이브가 수십 GB라면 태스크 하나가 전부 처리하므로 오히려 느려집니다. **시간대별로 쪼개 두거나**, 정기 집계는 기존 방식(해제 후 Parquet 변환)을 유지하고 **애드혹 조사에만** 쓰는 것이 안전합니다. DSv2 커넥터를 쓰는 경로에서는 아예 동작하지 않습니다.

### 사례 8. 조인 스큐 — AQE 개선 (4.3.0)

**상황**: 조인 키 분포가 극단적으로 치우쳐 있거나 NULL이 많은 경우 특정 파티션에 데이터가 몰려 태스크 하나가 전체 잡을 지연시킵니다.

| 이슈 | 내용 |
| --- | --- |
| SPARK-56903 / SPARK-57282 | outer join·left anti join의 **NULL 키를 여러 셔플 파티션에 분산** |
| SPARK-58084 | AQE가 런타임 통계를 보고 **sort merge join을 shuffled hash join으로 전환** |
| SPARK-58290 | 스큐 파티션 병합의 **O(n²) 인덱스 접근 제거** |

대부분 자동 적용이라 쿼리 변경은 필요 없습니다. 다만 **SPARK-58210으로 일부 옵티마이저 룰이 기본 활성화**되므로, 업그레이드 후 주요 배치 잡의 실행 계획과 소요 시간을 비교해 보는 것이 좋습니다.

## 7. 업그레이드 점검

동작 변경이 있는 릴리스라 올리기 전에 확인할 것이 있습니다. 아래는 버전과 무관하게 쓸 수 있는 일반적인 절차입니다.

### 실행 계획 비교

옵티마이저 룰이 바뀌면 같은 쿼리가 다른 플랜을 탑니다. 주요 배치 잡의 플랜을 업그레이드 전후로 떠서 비교해 두면 원인 추적이 빨라집니다.

```python
def dump_plan(sql: str, path: str):
    plan = spark.sql(sql)._jdf.queryExecution().toString()
    with open(path, "w") as f:
        f.write(plan)

# 업그레이드 전
dump_plan(open("jobs/daily_agg.sql").read(), "plans/4.1/daily_agg.txt")

# 업그레이드 후 동일하게 떠서 diff
#   diff plans/4.1/daily_agg.txt plans/4.2/daily_agg.txt
```

### 설정 차이 확인

4.3.0의 SQL REST API에 `modifiedConfigs`가 노출되지만, 그 전에도 세션에서 직접 볼 수 있습니다.

```python
# 기본값과 다르게 설정된 항목만 추리기
defaults = {}   # 사전에 기본 세션에서 덤프해둔 값
current = dict(spark.sparkContext.getConf().getAll())

for k, v in sorted(current.items()):
    if k.startswith("spark.sql.") and defaults.get(k) != v:
        print(f"{k} = {v}")
```

### 동작 변경 항목 회귀 테스트

앞의 2-4에서 정리한 넷은 **결과가 달라질 수 있는** 변경입니다. 해당 패턴을 쓰는 쿼리가 있는지 먼저 훑는 편이 빠릅니다.

```bash
# NATURAL JOIN 사용처 (SPARK-56031)
grep -rin "natural join" --include="*.sql" --include="*.py" .

# asinh / acosh (SPARK-56089)
grep -rn "asinh\|acosh" --include="*.sql" --include="*.py" .

# 시스템 스키마와 이름이 겹치는 스키마 (SPARK-55964)
```

JSON 유니코드 검증(SPARK-56654)은 코드가 아니라 **데이터**가 문제이므로, 기존 원본 일부를 새 버전으로 읽어 보는 것 말고는 방법이 없습니다.

```python
# 샘플을 새 버전에서 읽어 실패 건수를 센다
df = spark.read.option("mode", "PERMISSIVE") \
    .option("columnNameOfCorruptRecord", "_corrupt") \
    .json("s3://raw/events/2026-08-01/*.json")

df.filter("_corrupt IS NOT NULL").count()
```

## 우선순위 정리

| 우선도 | 기능 | 왜 |
| --- | --- | --- |
| 높음 | CDC `CHANGES` + Auto CDC | 증분 적재 파이프라인의 구조를 바꿈. 다만 **커넥터 지원 확인이 선행** |
| 높음 | `QUALIFY`, `max_by(x,y,k)` | 도입 비용 0에 가깝고 기존 쿼리를 즉시 단순화 |
| 중간 | `time_bucket`, `counter_diff` | IoT·센서 시계열 처리 코드를 줄임. `counter_diff`는 4.3.0 대기 |
| 중간 | GEOGRAPHY + `NEAREST BY` | 위치 데이터 처리를 표준화. 기존 UDF 대체 검토 |
| 낮음 | `BIN BY`, 압축 아카이브 | 4.3.0 미릴리스. 제약이 있어 적용 범위를 먼저 좁혀야 함 |

## 부록: 조사 방법

Apache JIRA REST API는 인증 없이 조회할 수 있습니다.

```bash
# 타입별 건수
curl -sS -G 'https://issues.apache.org/jira/rest/api/2/search' \
  --data-urlencode 'jql=project=SPARK AND fixVersion=4.3.0 AND issuetype="New Feature"' \
  --data-urlencode 'maxResults=0'
```

문서 페이지 증분으로 사용자 노출 기능을 역추적하는 방법도 유용합니다.

```bash
git clone --filter=blob:none https://github.com/apache/spark.git
cd spark
git diff --name-status origin/branch-4.1 origin/branch-4.2 -- docs/ | grep '^A'
```

## 참고

- [Spark SQL Reference](https://spark.apache.org/docs/latest/sql-ref.html)
- [Spark SQL Performance Tuning](https://spark.apache.org/docs/latest/sql-performance-tuning.html)
- [Structured Streaming Programming Guide](https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html)
- [Apache Spark JIRA](https://issues.apache.org/jira/projects/SPARK)
