---
title: "Cost-Based Optimizer (CBO)란?"
description: "CBO는 쿼리 실행 계획을 최적화하기 위해 비용을 기반으로 다양한 실행 계획 중에서 최적의 계획을 선택하는 시스템입니다. 비용 모델을 사용하여 각 실행 계획의 예상 실행 비용을 평가하고, 가장 낮은 비용을 가진 계획"
categories:
 - data-engineering
 - spark
source: "https://blog.naver.com/csj4032/223525265413"
---

CBO는 쿼리 실행 계획을 최적화하기 위해 비용을 기반으로 다양한 실행 계획 중에서 최적의 계획을 선택하는 시스템입니다. 비용 모델을 사용하여 각 실행 계획의 예상 실행 비용을 평가하고, 가장 낮은 비용을 가진 계획을 선택합니다.

## 스파크에서의 CBO 기능

Spark의 CBO는 다양한 쿼리 최적화 기능을 제공하며, 이를 통해 쿼리 성능을 향상시킨다. Spark 의 CBO는 다음과 같은 주요 기능을 포함한다.

* **통계 정보 사용**
  * 통계 정보는 Cost-Based Optimizer(CBO)가 최적의 쿼리 실행 계획을 선택할 수 있도록 돕는 중요한 데이터
  * Spark 통계 정보는 테이블 및 열에 대한 다양한 통계를 수집하여 쿼리 최적화에 활용
  * 테이블 및 열에 대한 통계 정보를 수집하고 사용, 이러한 통계 정보는 카디널리티, NULL 값의 비율, 데이터 분포 등입니다.
  * 통계 정보는 ANALYZE TABLE 명령어를 통해 수집
  * **통계 정보의 종류**
    1. 테이블 통계(Table Statistics):
      * 행 수(Row Count): 테이블에 있는 총 행 수.
      * 테이블 크기(Table Size): 테이블의 총 데이터 크기 (바이트 단위).
    2. 열 통계(Column Statistics):
      * 카디널리티(Cardinality): 특정 열에 있는 고유 값의 수.
      * NULL 값의 수(Null Count): 특정 열에 있는 NULL 값의 수.
      * 최솟값 및 최댓값(Minimum and Maximum Values): 특정 열의 최소값과 최대값.
      * 평균 및 최대 길이(Average and Maximum Length): 문자열 열의 평균 길이 및 최대 길이.
      * 히스토그램(Histogram): 데이터 분포를 나타내는 히스토그램
  * **통계 정보 수집 방법**
    * ANALYZE TABLE : 명령어를 사용하여 통계 정보를 수집 이 명령어는 테이블 또는 특정 열에 대한 통계를 수집하는 데 사용
  * **통계 정보 활용**
    * **조인 순서 결정**: 여러 테이블 간의 조인 순서를 결정할 때, 가장 비용이 적게 드는 순서를 선택
    * **조인 유형 선택**: 브로드캐스트 조인 또는 셔플 조인을 선택할 때, 통계를 기반으로 적절한 조인 유형을 결정
    * **필터 푸시다운**: 가능한 한 빨리 필터를 적용하여 처리할 데이터의 양을 줄임
  * **통계 정보 확인**
    * 수집된 통계 정보를 확인하려면 다음과 같은 명령어를 사용할 수 있습니다:

```text
from pyspark.sql.functions import *
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("Cost-Based Optimizer")\
.config("spark.sql.cbo.enabled", "true")\
.config("spark.sql.cbo.joinReorder.enabled", "true")\
.getOrCreate()

items = spark.range(1000000000).select(col("id").alias("i_item_id"), lit((rand()*1000).cast("int")).alias("i_price"), col("id").alias("i_tag_id"))
sales = spark.range(3000000000).select(col("id").alias("s_item_id"), (date_add(current_date(), - ((rand()*360)).cast("int")).alias("s_date")).alias("s_date"))
tags = spark.range(1000000).select(col("id").alias("t_tag_id"))

items.write.partitionBy("i_item_id").mode("overwrite").saveAsTable("ITEMS")
sales.write.mode("overwrite").saveAsTable("SALES")
delivery.write.mode("overwrite").saveAsTable("DELIVERY")

spark.sql("ANALYZE TABLE sales COMPUTE STATISTICS")
spark.sql("DESC EXTENDED sales").show(20, False)

+----------------------------+----------------------------------------------------------------------------------+-------+
|col_name                    |data_type                                                                         |comment|
+----------------------------+----------------------------------------------------------------------------------+-------+
|i_item_id                   |bigint                                                                            |NULL   |
|i_price                     |int                                                                               |NULL   |
|                            |                                                                                  |       |
|# Detailed Table Information|                                                                                  |       |
|Catalog                     |spark_catalog                                                                     |       |
|Database                    |default                                                                           |       |
|Table                       |items                                                                             |       |
|Created Time                |Thu Jul 25 09:19:30 KST 2024                                                      |       |
|Last Access                 |UNKNOWN                                                                           |       |
|Created By                  |Spark 3.5.1                                                                       |       |
|Type                        |MANAGED                                                                           |       |
|Provider                    |parquet                                                                           |       |
|Statistics                  |15410579958 bytes, 3000000000 rows                                                        |       |
|Location                    |file:/spark-warehouse/items                                                       |       |
+----------------------------+----------------------------------------------------------------------------------+-------+
```

  * **타입별 통계 값**

| Number / Data / Timestamp Type | String/Binary Type |
| --- | --- |
| Distinct Count | Distinct Count |
| Max | Null Count |
| Min | Average Length |
| Null Count | Max Length |
| Average Length (Fixed length) |  |
| Max Length (Fixed length) |  |

---

* **비용 모델**
  * Cost-Based Optimizer(CBO)는 다양한 실행 계획 중에서 최적의 계획을 선택하기 위해 비용 모델을 사용하며 비용 모델은 쿼리 실행의 각 단계에 대한 예상 비용을 계산하는데, 이러한 비용은 주로 I/O, CPU, 메모리, 네트워크 트래픽 등의 리소스 사용량을 기반으로 한다.
    * **비용 추정**:
      * items 테이블 스캔 비용: 1000000000행 * 5.261948136 바이트 = 5261948136 바이트 (I/O 비용)
      * sales 테이블 스캔 비용: 3000000000행 * 5.136859986 바이트 = 15410579958 바이트 (I/O 비용)
      * 조인 비용: 1000000000행 * 3000000000 행 (네트워크 비용)
    * **쿼리 실행 계획**:
      * CBO는 필터링 후 salse와 items를 조인하는 계획이 더 적은 비용이 든다고 판단합니다.
      * 최종 실행 계획:
      * 테이블 sales 를 스캔하고 필터링.
      * 필터링된 sales 를 테이블 item와 조인.

```text
items.join(sales, items.i_item_id == sales.s_item_id, "inner").filter(col("s_item_id") < 100000).explain()

== Physical Plan ==
AdaptiveSparkPlan isFinalPlan=false
+- BroadcastHashJoin [i_item_id#18454L], [s_item_id#18460L], Inner, BuildRight, false
   :- Filter (i_item_id#18454L < 100000)
   :  +- Project [id#18452L AS i_item_id#18454L, cast((rand(4971833261948634089) * 1000.0) as int) AS i_price#18455]
   :     +- Range (0, 1000000000, step=1, splits=10)
   +- BroadcastExchange HashedRelationBroadcastMode(List(input[0, bigint, false]),false), [plan_id=201]
      +- Filter (s_item_id#18460L < 100000)
         +- Project [id#18458L AS s_item_id#18460L, date_add(2024-07-25, -cast((rand(3022353961121153843) * 360.0) as int)) AS s_date#18462]
            +- Range (0, 3000000000, step=1, splits=10)
```

    * spark.sql.cbo.enabled 속성을 false 할 경우 : SortMergeJoin으로 실행 계획은 세운다.

```text
items.join(sales, items.i_item_id == sales.s_item_id, "inner").filter(col("s_item_id") < 100000).explain()

== Physical Plan ==
AdaptiveSparkPlan isFinalPlan=false
+- SortMergeJoin [i_item_id#18454L], [s_item_id#18460L], Inner
   :- Sort [i_item_id#18454L ASC NULLS FIRST], false, 0
   :  +- Exchange hashpartitioning(i_item_id#18454L, 200), ENSURE_REQUIREMENTS, [plan_id=232]
   :     +- Filter (i_item_id#18454L < 100000)
   :        +- Project [id#18452L AS i_item_id#18454L, cast((rand(4971833261948634089) * 1000.0) as int) AS i_price#18455]
   :           +- Range (0, 1000000000, step=1, splits=10)
   +- Sort [s_item_id#18460L ASC NULLS FIRST], false, 0
      +- Exchange hashpartitioning(s_item_id#18460L, 200), ENSURE_REQUIREMENTS, [plan_id=233]
         +- Filter (s_item_id#18460L < 100000)
            +- Project [id#18458L AS s_item_id#18460L, date_add(2024-07-25, -cast((rand(3022353961121153843) * 360.0) as int)) AS s_date#18462]
               +- Range (0, 3000000000, step=1, splits=10)
```

---

* **조인 순서 최적화**
  * 다중 테이블 조인 쿼리에서 조인의 순서는 쿼리 성능에 큰 영향을 미친다. 잘못된 순서로 조인을 수행하면 불필요한 데이터 처리가 발생하고, 이는 성능 저하로 이어질 수 있다. 예를 들어, 작은 테이블과 먼저 조인하여 필터링된 결과를 얻는 것이 더 효율적일 수 있음
  * **조인 순서 결정**
    * CBO는 가능한 모든 조인 순서를 생성하고, 각 순서에 대해 비용을 평가합니다. 이 과정에서 카디널리티 추정, 필터 적용 등을 고려
    * 가장 낮은 비용을 가진 조인 순서를 선택하여 최적의 실행 계획을 수립
  * **비용 모델 평가**
    1. 조인 순서 1: (A JOIN B) JOIN C:
      * A와 B의 조인 비용 평가.
      * 중간 결과를 C와 조인하는 비용 평가.
    2. 조인 순서 2: (B JOIN C) JOIN A:
      * B와 C의 조인 비용 평가.
      * 중간 결과를 A와 조인하는 비용 평가.
    3. 조인 순서 3: (A JOIN C) JOIN B:
      * A와 C의 조인 비용 평가.
      * 중간 결과를 B와 조인하는 비용 평가
    * CBO는 각 조인 순서에 대해 예상되는 비용을 계산하고, 가장 낮은 비용을 가진 순서를 선택합니다.
    * spark.sql.cbo.joinReorder.enabled 조인 순서 최적화 기능을 활성화

```text
items\
    .join(sales, items.i_item_id == sales.s_item_id, "inner")\
    .join(delivery, items.i_item_id == delivery.d_item_id, "inner")\
    .explain()

// spark.sql.cbo.joinReorder.enabled 비활성화
// items, sales 조인 할 경우 1000000000 * 3000000000 연산 후
// items, sales 조인 한 1000000000 결과를 delivery 10000000 와 조인  1000000000*10000000 연산
// 3010000000000000000 연산
== Physical Plan ==
AdaptiveSparkPlan isFinalPlan=false
+- BroadcastHashJoin [i_item_id#552L], [d_item_id#565L], Inner, BuildRight, false
   :- SortMergeJoin [i_item_id#552L], [s_item_id#558L], Inner
   :  :- Sort [i_item_id#552L ASC NULLS FIRST], false, 0
   :  :  +- Exchange hashpartitioning(i_item_id#552L, 200), ENSURE_REQUIREMENTS, [plan_id=804]
   :  :     +- Project [id#550L AS i_item_id#552L, cast((rand(-5261119287267526073) * 1000.0) as int) AS i_price#553]
   :  :        +- Range (0, 1000000000, step=1, splits=10)
   :  +- Sort [s_item_id#558L ASC NULLS FIRST], false, 0
   :     +- Exchange hashpartitioning(s_item_id#558L, 200), ENSURE_REQUIREMENTS, [plan_id=805]
   :        +- Project [id#556L AS s_item_id#558L, date_add(2024-07-25, -cast((rand(9003687459514621853) * 360.0) as int)) AS s_date#560]
   :           +- Range (0, 3000000000, step=1, splits=10)
   +- BroadcastExchange HashedRelationBroadcastMode(List(input[0, bigint, false]),false), [plan_id=810]
      +- Project [id#563L AS d_item_id#565L]
         +- Range (0, 100000, step=1, splits=10)

// spark.sql.cbo.joinReorder.enabled 활성화
// items, delivery 조인 할 경우 1000000000 * 10000000 연산 후
// items, delivery 조인 한 10000000 결과를 sales 3000000000 와 조인 10000000*3000000000 연산
// 40000000000000000 (75% 효율적)
== Physical Plan ==
== Physical Plan ==
AdaptiveSparkPlan isFinalPlan=false
+- Project [i_item_id#517L, i_price#518, s_item_id#523L, s_date#525, d_item_id#530L]
   +- BroadcastHashJoin [i_item_id#517L], [s_item_id#523L], Inner, BuildLeft, false
      :- BroadcastExchange HashedRelationBroadcastMode(List(input[0, bigint, false]),false), [plan_id=768]
      :  +- BroadcastHashJoin [i_item_id#517L], [d_item_id#530L], Inner, BuildRight, false
      :     :- Project [id#515L AS i_item_id#517L, cast((rand(-2124962161327826762) * 1000.0) as int) AS i_price#518]
      :     :  +- Range (0, 1000000000, step=1, splits=10)
      :     +- BroadcastExchange HashedRelationBroadcastMode(List(input[0, bigint, false]),false), [plan_id=765]
      :        +- Project [id#528L AS d_item_id#530L]
      :           +- Range (0, 100000, step=1, splits=10)
      +- Project [id#521L AS s_item_id#523L, date_add(2024-07-25, -cast((rand(-8662857221730607014) * 360.0) as int)) AS s_date#525]
         +- Range (0, 3000000000, step=1, splits=10)
```

---

* **Predicate Pushdown**
  * Predicate Pushdown은 Spark의 Cost-Based Optimizer(CBO)에서 중요한 최적화 기법이다. 이 기법은 가능한 한 빨리, 즉 데이터 소스 레벨에서 필터링 조건을 적용하여 처리할 데이터의 양을 줄이는 것을 목표로 하며 이를 통해 I/O 비용을 절감하고 쿼리 성능을 크게 향상시킬 수 있음
  * **주요 개념과 원리**
    1. Predicate Pushdown의 개념:
      * Predicate: SQL 쿼리의 WHERE 절에 사용되는 조건을 의미
      * Pushdown: 가능한 한 빨리 필터링 조건을 적용하는 것을 의미합니다. 일반적으로 데이터 소스 또는 스캔 단계에서 필터를 적용
    2. 작동 원리:
      * Spark는 쿼리 최적화 단계에서 WHERE 절의 조건을 분석
      * 조건이 데이터 소스에서 직접 적용 가능하다면, 해당 조건을 데이터 소스 스캔 단계로 "Pushdown"
      * 이를 통해 Spark는 데이터 소스로부터 불필요한 데이터를 읽어오는 것을 방지하고, 전체 쿼리 실행 시간을 단축
  * **Predicate Pushdown의 장점**
    1. I/O 비용 절감:
      * 필터 조건을 데이터 소스에서 직접 적용함으로써 불필요한 데이터를 읽어오는 것을 방지하여 디스크 I/O 비용을 절감합니다.
    2. 메모리 사용 최적화:
      * 읽어오는 데이터 양을 줄이기 때문에 메모리 사용량이 감소합니다. 이는 특히 메모리 제약이 있는 환경에서 중요합니다.
    3. 네트워크 비용 절감:
      * 분산 환경에서 데이터 셔플링을 최소화하여 네트워크 비용을 절감합니다.

```text
items\
    .join(sales, items.i_item_id == sales.s_item_id, "inner")\
    .join(delivery, items.i_item_id == delivery.d_item_id, "inner")\
    .filter(col("s_item_id") > 100000)\
    .explain()

// salse 테이블의 s_item_id > 100000 조건만 추가했지만 나머지 테이블에도 100000 초과 조건이 추가됨
// 결국 모든 테이블의 id 는 100000 를 초과해야 조인의 결과로 도출
== Physical Plan ==
AdaptiveSparkPlan isFinalPlan=false
+- Project [i_item_id#2L, i_price#3, s_item_id#8L, s_date#10, d_item_id#15L]
   +- BroadcastHashJoin [i_item_id#2L], [s_item_id#8L], Inner, BuildLeft, false
      :- BroadcastExchange HashedRelationBroadcastMode(List(input[0, bigint, false]),false), [plan_id=51]
      :  +- BroadcastHashJoin [i_item_id#2L], [d_item_id#15L], Inner, BuildRight, false
      :     :- Filter (i_item_id#2L > 100000)
      :     :  +- Project [id#0L AS i_item_id#2L, cast((rand(-5198964857805332961) * 1000.0) as int) AS i_price#3]
      :     :     +- Range (0, 1000000000, step=1, splits=10)
      :     +- BroadcastExchange HashedRelationBroadcastMode(List(input[0, bigint, false]),false), [plan_id=48]
      :        +- Project [id#13L AS d_item_id#15L]
      :           +- Filter (id#13L > 100000)
      :              +- Range (0, 100000, step=1, splits=10)
      +- Filter (s_item_id#8L > 100000)
         +- Project [id#6L AS s_item_id#8L, date_add(2024-07-25, -cast((rand(-5221555635215990966) * 360.0) as int)) AS s_date#10]
            +- Range (0, 3000000000, step=1, splits=10)

flight = spark.read.parquet("/data/flight-data/parquet/*")
filtered_flight = flight.filter(col("DEST_COUNTRY_NAME") == "United States")
filtered_flight.explain("extended")

// DEST_COUNTRY_NAME PushedFilters 조건에 [IsNotNull(DEST_COUNTRY_NAME), EqualTo(DEST_COUNTRY_NAME,United States)]
// 조건이 추가됨
== Physical Plan ==
*(1) Filter (isnotnull(DEST_COUNTRY_NAME#62) AND (DEST_COUNTRY_NAME#62 = United States))
+- *(1) ColumnarToRow
   +- FileScan parquet [DEST_COUNTRY_NAME#62,ORIGIN_COUNTRY_NAME#63,count#64L] Batched: true, DataFilters: [isnotnull(DEST_COUNTRY_NAME#62), (DEST_COUNTRY_NAME#62 = United States)], Format: Parquet, Location: InMemoryFileIndex(1 paths)[file:/Users/choisj2/Workspace/everyone-spark/src/test/python/data/flig..., PartitionFilters: [], PushedFilters: [IsNotNull(DEST_COUNTRY_NAME), EqualTo(DEST_COUNTRY_NAME,United States)], ReadSchema: struct<DEST_COUNTRY_NAME:string,ORIGIN_COUNTRY_NAME:string,count:bigint>
```

---

* **Partition Awareness**
  * Partition Awareness은 데이터의 물리적 분할 방식을 이해하고 이를 기반으로 효율적인 쿼리 실행 계획을 수립하는 것을 의미
  * **주요 개념과 원리**
    1. Partition 이란?:
      * 데이터셋을 더 작은, 독립된 부분으로 나누는 방식입니다. 파티셔닝은 큰 테이블을 관리 가능한 작은 단위로 나누어 병렬 처리를 가능하게 함
      * 파티션 키(partition key)는 데이터를 분할하는 기준이 되는 열임
    2. 파티션 인식의 목적:
      * 데이터 로컬리티: 데이터가 어디에 저장되어 있는지를 알고, 데이터를 이동하지 않고 가능한 한 해당 위치에서 처리
      * 네트워크 I/O 감소: 데이터 이동을 최소화하여 네트워크 I/O를 줄임
      * 병렬 처리: 데이터의 각 파티션을 독립적으로 처리하여 전체 쿼리의 처리 속도를 높임
  * **Partition Awareness을 활용한 최적화**
    1. Partition Pruning:
      * 쿼리에서 특정 파티션에만 접근하도록 최적화합니다. WHERE 절에서 파티션 키를 사용하여 특정 파티션만 스캔하도록 하여 불필요한 데이터 접근을 줄임
    2. 파티션 재배치 및 정렬:
      * 조인 연산에서 두 테이블이 동일한 파티션 키를 가질 경우, 파티션별로 조인을 수행하여 효율성을 극대화
      * 파티션이 정렬된 상태로 유지되면, 정렬 기반 연산(예: merge sort join)이 더 빠르게 수행

```text
spark.sql("ANALYZE TABLE items COMPUTE STATISTICS FOR COLUMNS i_item_id, i_price")
spark.sql("DESC EXTENDED sales").show(20, False)

+----------------------------+----------------------------------------------------------------------------------+-------+
|col_name                    |data_type                                                                         |comment|
+----------------------------+----------------------------------------------------------------------------------+-------+
|i_item_id                   |bigint                                                                            |NULL   |
|i_price                     |int                                                                               |NULL   |
|# Partition Information     |                                                                                  |       |
|# col_name                  |data_type                                                                         |comment|
|i_price                     |int                                                                               |NULL   |
|                            |                                                                                  |       |
|# Detailed Table Information|                                                                                  |       |
|Catalog                     |spark_catalog                                                                     |       |
|Database                    |default                                                                           |       |
|Table                       |items                                                                             |       |
|Created Time                |Thu Jul 25 14:27:51 KST 2024                                                      |       |
|Last Access                 |UNKNOWN                                                                           |       |
|Created By                  |Spark 3.5.1                                                                       |       |
|Type                        |MANAGED                                                                           |       |
|Provider                    |parquet                                                                           |       |
|Statistics                  |4907110100 bytes, 1000000000 rows                                                 |       |
|Location                    |file:/spark-warehouse/items                                                       |       |
|Partition Provider          |Catalog                                                                           |       |
+----------------------------+----------------------------------------------------------------------------------+-------+

// 이 명령어는 items 테이블의 s_item_id과 i_price 열에 대한 카디널리티, NULL 값의 수, 최소값, 최대값 등을 수집
spark.sql("DESC EXTENDED items i_item_id").show(20, False)

+--------------+----------+
|info_name     |info_value|
+--------------+----------+
|col_name      |i_item_id |
|data_type     |bigint    |
|comment       |NULL      |
|min           |0         |
|max           |999999999 |
|num_nulls     |0         |
|distinct_count|1000000000|
|avg_col_len   |8         |
|max_col_len   |8         |
|histogram     |NULL      |
+--------------+----------+

spark.sql("SELECT i_item_id, i_price FROM items WHERE i_price == 100").explain("extended")

// FileScan PartitionFilters에 i_price 조건을 확인 할 수 있다. [isnotnull(i_price#145273), (i_price#145273 = 100)]
== Physical Plan ==
*(1) ColumnarToRow
+- FileScan parquet spark_catalog.default.items[i_item_id#145272L,i_price#145273] Batched: true, DataFilters: [], Format: Parquet, Location: InMemoryFileIndex(1 paths)[file:/spark-war..., PartitionFilters: [isnotnull(i_price#145273), (i_price#145273 = 100)], PushedFilters: [], ReadSchema: struct<i_item_id:bigint>
```

---

* **Filter Selectivity**
  * **단일 논리 조건의 선택도**
    * 등호 조건(Equal-to (=) condition):
      * 주어진 값이 열의 최소값과 최대값 범위 내에 있는지 확인
      * 값이 범위 밖에 있으면 선택도는 0.0
      * 값이 범위 내에 있으면 선택도는 고유 값의 개수의 역수

```text
// 고유 값 개수(cardinality)가 1000인 경우
// 선택도는 fs(column = 'i_price') = 1 / 1000 = 0.001
spark.sql("SELECT i_item_id, i_price FROM items WHERE i_price == 1").explain("extended")
```

    * 미만 조건(Less-than (<) condition):
      * 설명: 주어진 값이 열의 최소값보다 작으면 선택도는 0.0
      * 값이 열의 최대값보다 크면 선택도는 1.0
      * 그렇지 않으면 최소값과 최대값을 기준으로 선택도를 비례하여 계산

```text
// 최소값(min)이 0, 최대값(max)이 999인 경우
// 선택도는 fs(i_price < 500) = (500 - 0) / (999 - 0) = 500 / 999 = 0.5005
spark.sql("SELECT i_item_id, i_price FROM items WHERE i_price < 500")
```

  * **복합 논리 조건의 선택도**
    * AND 조건: AND 연산자의 선택도는 각 조건의 선택도를 곱한 값

```text
// fs(i_item_id = 1 AND i_price = 100) = 1/1000000000 * 1/1000
spark.sql("SELECT i_item_id, i_price FROM items WHERE i_item_id  = 1 AND i_price = 100")
```

    * OR 조건: OR 연산자의 선택도는 각 조건의 선택도를 더하고, 공통되는 부분을 빼는 방식으로 계산

```text
// fs(i_item_id = 1 OR i_price = 100) = (1/1000000000 + 1/1000) - (1/1000000000 * 1/1000)
spark.sql("SELECT i_item_id, i_price FROM items WHERE i_item_id  = 1 OR i_price = 100")
```

    * NOT 조건: NOT 연산자의 선택도는 1에서 원래 조건의 선택도를 뺀 값

```text
// fs(NOT i_item_id =1) = 1.0 - fs(i_item_id = 1) = 1 - 0.001
spark.sql("SELECT i_item_id, i_price FROM items WHERE i_item_id != 1")
```

---

* **Join Cardinality**
  * 조인 카디널리티는 관계형 데이터베이스나 Apache Spark와 같은 데이터 처리 시스템에서 두 테이블 간의 조인 연산 결과로 생성되는 행 수를 의미하며 정확한 조인 카디널리티를 추정하는 것은 Cost-Based Optimizer 가 효율적인 쿼리 실행 계획을 수립하는 데 중요
  * **조인 카디널리티 추정 방법**
    * 조인 카디널리티는 데이터에 대한 통계 정보(예: 조인 열의 고유 값 개수, 각 테이블의 행 수, 데이터 분포)를 기반으로 추정됩니다. 다음은 다양한 조인 유형에 대한 카디널리티 계산 방법입니다:
    * **Inner Join**
    * **Left Outer Join**
      * 왼쪽 외부 조인의 카디널리티는 일반적으로 내부 조인보다 큼
      * 오른쪽 테이블(B)에 일치하는 행이 없더라도 왼쪽 테이블(A)의 모든 행을 포함하기 때문
    * **Right Outer Join**
      * 오른쪽 외부 조인의 경우, 오른쪽 테이블(B)의 모든 행을 포함
    * **Full Outer Join**
      * 완전 외부 조인은 두 테이블의 모든 행을 포함합니다. 일치하는 행이 없더라도 포함

```text
// students: 10,000 행, student_id 열에 8,000개의 고유 값.
// courses: 50,000 행, student_id 열에 45,000개의 고유 값.

// Inner Join
// 10000×50000/max(8000,45000) = 45000/500000000 ≈ 11111
spark.sql("SELECT i_item_id, i_price FROM items INNER JOIN delivery ON items.i_item_id = delivery.d_item_id")

// Left Outer Join
// max(10000×50000/max(8000,45000), 10000) = max(11111, 10000) ≈ 11111
spark.sql("SELECT i_item_id, i_price FROM items LEFT OUTER JOIN delivery ON items.i_item_id = delivery.d_item_id")

// Right Outer Join
// max(10000×50000/max(8000,45000), 50000) = max(11111, 50000) ≈ 50000
spark.sql("SELECT i_item_id, i_price FROM items RIGHT OUTER JOIN delivery ON items.i_item_id = delivery.d_item_id")

// Full Outer Join
// 11111+50000−11111=50000
spark.sql("SELECT i_item_id, i_price FROM items FULL OUTER JOIN delivery ON items.i_item_id = delivery.d_item_id")
```

---

* **Optimal Plan Selection**
  * Optimal Plan Selection은 Cost-Based Optimizer가 다양한 쿼리 실행 계획 중에서 가장 비용 효율적인 계획을 선택하는 과정을 의미하며 이는 쿼리 성능을 최적화하기 위한 핵심 기능으로, CBO는 다양한 쿼리 계획을 평가하고 비용 모델을 사용하여 최적의 실행 계획을 결정함
  * **Optimal Plan Selection의 과정**
    * 통계 정보 수집
    * 다양한 실행 계획 생성
    * 비용 평가
  * **비용 기반 조인 재정렬 최적화**
    * Spark SQL은 비용 기반 조인 재정렬 최적화를 활용하여 최적의 조인 순서를 결정 이 과정에서 Selinger 1979 논문에서 제안된 동적 프로그래밍 알고리즘을 수정하여 사용
    * 최적의 M-Way Joins 순서 선택: M-Way Joins을 구성할 때, 같은 m 개의 항목에 대해 비용이 가장 낮은 최적의 계획만 유지
    * 조인 트리 유형: Left-Deep, Right-Deep, Bushy 트리를 포함한 모든 조합을 고려
    * 카테시안 곱(Cartesian Product) 후보 제거: 좌우 서브트리 모두에서 참조하는 조인 조건이 없는 경우 카테시안 곱 후보를 제거하여 검색 공간을 크게 줄임
  * **최적의 M-Way Joins 순서 선택 과정 - 1**
    * 레벨 0: 모든 항목(기본 조인 노드)을 레벨 0에 배치
    * 레벨 1: 레벨 0의 계획(단일 항목)에서 모든 2-방향 조인을 생성
    * 레벨 2: 이전 레벨(2-방향 조인 및 단일 항목)에서 모든 3-방향 조인을 생성
    * 레벨 3: 이전 레벨의 계획에서 모든 4-방향 조인을 생성
    * 레벨 n: 이 과정을 계속하여 모든 n-방향 조인을 생성하고, 그 중에서 최적의 계획을 선택
    * 각 레벨에서 같은 m 개의 항목에 대해 비용이 가장 낮은 계획만 유지합니다.
    * 3-방향 조인의 경우, {A, B, C} 항목에 대해 (A JOIN B) JOIN C, (A JOIN C) JOIN B, (B JOIN C) JOIN A 계획 중에서 가장 비용이 낮은 계획만 유지
  * **최적의 M-Way Joins 순서 선택 과정 - 2**
    * **주어진 조인 조건**
      * 테이블 A와 B는 A.k1 = B.k1 조건으로 조인
      * 테이블 B와 C는 B.k2 = C.k2 조건으로 조인
      * 테이블 C와 D는 C.k3 = D.k3 조건으로 조인
    * **단계별 조인 계획 최적화**
      * 레벨 0: 기본 테이블
        * p({A}): 테이블 A에 대한 기본 접근 경로
        * p({B}): 테이블 B에 대한 기본 접근 경로
        * p({C}): 테이블 C에 대한 기본 접근 경로
        * p({D}): 테이블 D에 대한 기본 접근 경로
        * 각 테이블은 단일 항목으로 간주되어 기본적으로 접근 가능한 상태
      * 레벨 1: 2-방향 조인
        * p({A, B}): 테이블 A와 B의 조인 계획. 조인 조건은 A.k1 = B.k1
        * p({B, C}): 테이블 B와 C의 조인 계획. 조인 조건은 B.k2 = C.k2
        * p({C, D}): 테이블 C와 D의 조인 계획. 조인 조건은 C.k3 = D.k3
        * 레벨 1에서는 가능한 모든 2-방향 조인 계획을 생성하고, 각 조인에 대한 접근 경로를 유지
      * 레벨 2: 3-방향 조인
        * p({A, B, C}): 테이블 A, B, C의 조인 계획. 이 계획은 A와 B를 먼저 조인하고, 그 결과를 C와 조인한 계획
        * p({B, C, D}): 테이블 B, C, D의 조인 계획. 이 계획은 B와 C를 먼저 조인하고, 그 결과를 D와 조인한 계획
        * 레벨 2에서는 가능한 모든 3-방향 조인 계획을 생성하고, 각 조인에 대한 접근 경로를 유지
        * 이 과정에서 중복된 계산을 피하고 최적의 경로를 유지
      * 레벨 3: 4-방향 조인
        * p({A, B, C, D}): 테이블 A, B, C, D의 조인 계획. 이 계획은 최종적인 조인 결과로, 모든 테이블이 주어진 조건에 따라 조인된 상태
        * 레벨 3에서는 최종적으로 모든 테이블이 조인된 계획을 생성하고, 이 계획이 최종 출력
    * CBO는 다양한 조인 순서와 접근 경로를 평가하여 최적의 쿼리 실행 계획을 선택 및 최적의 계획은 각 레벨에서 비용이 가장 낮은 경로를 유지함으로써 최종적으로 가장 효율적인 조인 결과를 도출
  * **조인 연산자의 비용 추정**
    * 첫 번째 부분(weight * cardinality): 대략 CPU 비용
    * 두 번째 부분((1.0 - weight) * size): 대략 I/O 비용
    * 조인 트리의 총 비용: 모든 중간 조인의 비용 합계

## Reference

1. [https://docs.databricks.com/en/optimizations/cbo.html](https://docs.databricks.com/en/optimizations/cbo.html)
2. [https://docs.gcp.databricks.com/en/optimizations/cbo.html](https://docs.gcp.databricks.com/en/optimizations/cbo.html)
3. [https://www.databricks.com/blog/2017/08/31/cost-based-optimizer-in-apache-spark-2-2.html](https://www.databricks.com/blog/2017/08/31/cost-based-optimizer-in-apache-spark-2-2.html)
4. [https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-aux-analyze-table.html](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-aux-analyze-table.html)
5. [https://dl.acm.org/doi/10.1145/582095.582099](https://dl.acm.org/doi/10.1145/582095.582099)
6. [https://github.com/apache/spark/blob/master/sql/catalyst/src/main/scala/org/apache/spark/sql/catalyst/optimizer/CostBasedJoinReorder.scala](https://github.com/apache/spark/blob/master/sql/catalyst/src/main/scala/org/apache/spark/sql/catalyst/optimizer/CostBasedJoinReorder.scala)
