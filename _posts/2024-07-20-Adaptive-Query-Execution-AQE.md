---
title: "Adaptive Query Execution (AQE)"
description: "스파크 3.0 이전에는 주로 룰 기반 최적화(Rule-Based Optimization, RBO)와 비용 기반 최적화(Cost-Based Optimization, CBO)만 사용되었습니다. Adaptive Query"
categories:
 - data-engineering
 - spark
source: "https://blog.naver.com/csj4032/223519550322"
---

스파크 3.0 이전에는 주로 룰 기반 최적화(Rule-Based Optimization, RBO)와 비용 기반 최적화(Cost-Based Optimization, CBO)만 사용되었습니다. Adaptive Query Execution (AQE)는 Apache Spark 3.0에서 도입된 기능으로, 쿼리 실행 중 실시간 통계를 이용해 쿼리 계획을 동적으로 최적화하여 성능을 향상시킵니다. Adaptive Query Execution 알아보기 이전에 간단하게 룰 기반 최적화(Rule-Based Optimization, RBO), 비용 기반 최적화(Cost-Based Optimization, CBO)를 알아 보겠습니다.

## 룰 기반 최적화 (Rule-Based Optimization, RBO)[1]

룰 기반 최적화(RBO)는 사전 정의된 일련의 규칙을 사용하여 쿼리 실행 계획을 변환하고 최적화하는 방식입니다. 스파크의 Catalyst 옵티마이저는 여러 가지 규칙을 사용하여 쿼리 계획을 점진적으로 개선합니다.

주요 규칙은 다음과 같습니다

  * 프로젝션 푸시다운: 불필요한 열을 제거하여 데이터 스캔 시 필요한 열만 읽도록 최적화합니다.
  * 필터 푸시다운: 필터 조건을 데이터 소스 가까이에 이동시켜 불필요한 데이터를 읽지 않도록 최적화합니다.
  * 상수 접합: 상수를 포함하는 표현식을 미리 계산하여 실행 계획을 단순화합니다.
  * 서브쿼리 제거: 서브쿼리를 평면화하여 쿼리 실행을 단순화하고 성능을 향상시킵니다.
  * 조인 순서 최적화: 가장 작은 테이블부터 조인을 수행하여 중간 결과의 크기를 줄입니다.
  * 공통 서브쿼리 제거: 여러 번 사용되는 동일한 서브쿼리를 한 번만 실행하도록 최적화합니다.

## 비용 기반 최적화(Cost-Based Optimization, CBO)[2]

비용 기반 최적화(CBO)는 데이터 통계를 활용하여 쿼리 실행 계획을 최적화하는 방법입니다.

CBO는 다음과 같은 통계를 사용하여 최적화를 수행합니다:

  * 행 수: 테이블에 있는 총 행 수.
  * 고유 값 수: 각 열에 있는 고유 값의 수.
  * NULL 값 수: 각 열에 있는 NULL 값의 수.
  * 최대/최소 값: 각 열의 최대값과 최소값.

이러한 통계를 바탕으로 CBO는 최적의 조인 방법, 조인 순서 등을 결정합니다. 예를 들어, 브로드캐스트 해시 조인과 정렬 병합 조인 중에서 선택하거나, 해시 조인의 빌드 측을 결정하는 등의 작업을 수행합니다.

## Adaptive Query Execution 주요 기능

* **Dynamically Coalescing Shuffle Partitions [7]**
  * **동적 셔플 파티션 병합**은 Apache Spark 3.0의 Adaptive Query Execution (AQE) 기능 중 하나로, 쿼리 실행 중에 셔플 단계의 파티션 수를 동적으로 조정하여 성능을 최적화하는 기법입니다. 이는 초기 실행 계획에서 예상한 파티션 크기와 실제 런타임 통계 간의 차이를 줄여 불필요한 리소스 낭비를 방지하고, 더 효율적인 자원 사용을 가능하게 합니다.
  * . **주요 개념**
    * 초기 셔플 파티션 설정
      * 파티션 수가 너무 적으면 각 파티션의 데이터 크기가 매우 커질 수 있으며, 이러한 큰 파티션을 처리하는 작업은 데이터를 디스크에 기록해야 할 수도 있습니다(예: 정렬 또는 집계가 포함된 경우). 그 결과 쿼리 속도가 느려질 수 있습니다.
      * 파티션 수가 너무 많으면 각 파티션의 데이터 크기가 매우 작아질 수 있으며, 셔플 블록을 읽기 위해 많은 작은 네트워크 데이터 패치가 발생하게 됩니다. 이는 비효율적인 I/O 패턴으로 인해 쿼리 속도를 느리게 할 수 있습니다. 또한 작업 수가 많아지면 스파크 작업 스케줄러에 더 많은 부담을 줄 수 있습니다.
      * Spark는 기본적으로 spark.sql.shuffle.partitions 설정 값을 사용하여 셔플 파티션 수를 결정합니다. 이는 모든 셔플 작업에 적용되며, 대규모 데이터 처리 시 적절한 파티션 수를 설정하는 것이 중요합니다.
    * 런타임 통계 수집
      * 쿼리 실행 도중 각 셔플 파티션의 실제 크기와 데이터 분포를 모니터링합니다. 이 정보를 기반으로 현재 파티션 구성이 적절한지 평가합니다.
    * 파티션 병합 결정
      * 런타임 통계에 따라, 파티션 크기가 너무 작아 오버헤드가 큰 경우 작은 파티션을 병합하여 적절한 크기의 파티션으로 조정합니다.
      * 반대로, 특정 파티션이 너무 커서 병목 현상이 발생하는 경우 이를 더 작은 파티션으로 분할할 수도 있습니다.
  * 예시
    * For example, let's say we are running the query SELECT max(i)FROM tbl GROUP BY j. The input data tbl is rather small so there are only two partitions before grouping. The initial shuffle partition number is set to five, so after local grouping, the partially grouped data is shuffled into five partitions. Without AQE, Spark will start five tasks to do the final aggregation. However, there are three very small partitions here, and it would be a waste to start a separate task for each of them.[3]
    * Instead, AQE coalesces these three small partitions into one and, as a result, the final aggregation now only needs to perform three tasks rather than five.[3]

![No AQE [3]](/assets/images/posts/2024-07-20-Adaptive-Query-Execution-AQE/01.png)

![With AQE [3]](/assets/images/posts/2024-07-20-Adaptive-Query-Execution-AQE/02.png)

  * **장점**
    * **성능 향상**:
      * 적절한 파티션 크기를 유지하여 쿼리 성능을 최적화합니다. **너무 작은 파티션은 병합하여 오버헤드를 줄이고, 너무 큰 파티션은 분할하여 병목 현상을 줄입니다.[6,7]**
    * **리소스 효율성**:
      * 클러스터 리소스를 효율적으로 사용하여 전체 작업 시간과 자원 소비를 최소화합니다.
    * **적응성**:
      * 다양한 데이터 분포와 크기에 맞춰 동적으로 조정되어, 예기치 않은 데이터 특성 변화에도 대응할 수 있습니다.
* **Dynamically Switching Join Strategies [6]**
  * Apache Spark에서 동적으로 조인 전략을 변경하는 것은 데이터 크기와 분포, 클러스터 리소스 등의 변동에 따라 최적의 조인 전략을 선택하여 쿼리 성능을 최적화하는 중요한 기법입니다. Spark는 다양한 조인 전략을 제공하며, 각각의 전략은 특정 상황에서 더 효율적으로 작동합니다. Spark가 동적으로 조인 전략을 변경하는 방식을 이해하기 위해, 주요 조인 전략과 동적 변경의 원리를 살펴보겠습니다.
  * **주요 조인 전략**
    1. Broadcast Hash Join:
      * 작은 테이블을 모든 워커 노드로 브로드캐스트(복사)하여 조인을 수행합니다.
      * 작은 테이블과 큰 테이블을 조인할 때 매우 효율적입니다.
      * 브로드캐스트할 테이블의 크기가 spark.sql.autoBroadcastJoinThreshold 설정값보다 작을 때 사용됩니다.
    2. Sort-Merge Join:
      * 두 테이블이 조인 키로 정렬된 상태에서 병합하여 조인을 수행합니다.
      * 큰 테이블 간의 조인에 적합하며, 정렬된 데이터를 효율적으로 병합할 수 있습니다.
      * 두 테이블이 정렬되어 있어야 하며, 정렬 비용이 추가될 수 있습니다.
    3. Shuffle Hash Join:
      * 두 테이블의 데이터를 해시 파티셔닝하여 조인합니다.
      * 큰 테이블 간의 조인에 사용되며, 해시 파티셔닝과 셔플링이 발생합니다.
      * 메모리 사용량이 클 수 있으며, 메모리 제약이 있을 때는 비효율적일 수 있습니다.
    4. Broadcast Nested Loop Join:
      * 브로드캐스트된 작은 테이블의 각 행을 큰 테이블의 모든 행과 비교하여 조인합니다.
      * 매우 작은 테이블과의 조인에 사용됩니다.
      * 일반적으로 비효율적이기 때문에 특별한 경우에만 사용됩니다.
  * **동적 조인 전략 선택**
    * Spark는 쿼리를 최적화할 때 다양한 요소를 고려하여 조인 전략을 동적으로 선택합니다. 이 과정은 Spark의 Catalyst 옵티마이저와 CBO(Cost-Based Optimizer)에 의해 수행됩니다.
    2. **쿼리 계획 수립**:
      * Catalyst 옵티마이저는 쿼리를 분석하고, 여러 실행 계획을 생성합니다.
      * 각 실행 계획의 비용을 추정하고, 최적의 계획을 선택합니다.
    3. **통계 정보 사용**:
      * 테이블의 크기, 데이터 분포, 인덱스 정보 등을 바탕으로 각 조인 전략의 비용을 계산합니다.
      * 예를 들어, 작은 테이블은 브로드캐스트 조인, 큰 테이블은 셔플 해시 조인이나 정렬 병합 조인 등을 고려합니다.
    4. **환경 설정과 동적 조정**:
      * spark.sql.autoBroadcastJoinThreshold와 같은 설정값을 통해 브로드캐스트 조인의 임계값을 조정할 수 있습니다.
      * 쿼리 실행 중 상황에 따라 조인 전략을 변경할 수 있습니다. 예를 들어, 데이터 크기나 클러스터 리소스가 변동되면, Spark는 실행 계획을 재평가하여 최적의 조인 전략을 적용할 수 있습니다.
  * 예시
    * To solve this problem, AQE now replans the join strategy at runtime based on the most accurate join relation size. As can be seen in the following example, the right side of the join is found to be way smaller than the estimate and also small enough to be broadcast, so after the AQE reoptimization the statically planned sort merge join is now converted to a broadcast hash join.

![AQE Reoptimization](/assets/images/posts/2024-07-20-Adaptive-Query-Execution-AQE/03.png)

    * Physical Plan 에서는  Catalyst 옵티마이저가 CBO(Cost-Based Optimizer) 기반으로 SortMergeJoin으로 계획하지만 실제 런타임 시점에는 Dynamically Switching Join Strategies 의해서BoradcastHashJoin 전략으로 실행된다.
* **Dynamically Optimizing Skew Joins** [7]
  * 조인 작업 중 데이터의 불균형(스큐, skew)을 동적으로 최적화하여 성능을 향상시키는 기법을 의미합니다. 스파크는 대규모 데이터를 병렬 처리할 때 자주 사용되며, 데이터의 분포가 고르지 않을 경우 일부 작업이 다른 작업보다 훨씬 더 많은 데이터를 처리하게 되어 성능 저하를 초래할 수 있습니다.
  * **주요 기법**
    * **1. Adaptive Query Execution (AQE)**
      * 스파크 3.0에서 도입된 AQE는 실행 중간에 물리적 실행 계획을 동적으로 변경하여 최적의 성능을 도모합니다. AQE는 데이터의 분포를 분석하여 조인 방법을 변경하거나 리파티셔닝을 통해 데이터의 균형을 맞춥니다.
    * **2. Salting**
      * 스큐된 키를 가진 데이터를 여러 파티션에 분산시키기 위해 "소금(salt)"이라는 임의의 값을 추가합니다. 예를 들어, 스큐된 키에 임의의 값을 추가하여 다양한 파티션으로 나눌 수 있습니다. 이렇게 하면 데이터가 고르게 분산되어 조인 성능이 향상됩니다.
    * **3. Skew Join Optimization**
      * 스파크는 스큐된 키를 식별하고, 조인 작업에서 해당 키를 별도로 처리합니다. 스파크는 큰 데이터셋을 조인할 때 스큐된 데이터를 따로 처리하고, 나머지 데이터를 병렬로 처리하여 전체 성능을 개선할 수 있습니다.
    * **4. Broadcast Hash Join**
      * 작은 테이블을 브로드캐스트하여 모든 워커 노드에 복사하는 기법입니다. 큰 테이블과 작은 테이블을 조인할 때 작은 테이블을 브로드캐스트하면 스큐 문제를 줄일 수 있습니다. 다만, 작은 테이블이 메모리에 모두 올라갈 수 있을 정도로 충분히 작아야 합니다.
    * **예시**
      * Data skew occurs when data is unevenly distributed among partitions in the cluster. Severe skew can significantly downgrade query performance, especially with joins. AQE skew join optimization detects such skew automatically from shuffle file statistics. It then splits the skewed partitions into smaller subpartitions, which will be joined to the corresponding partition from the other side respectively. [3]
      * Let's take this example of table A join table B, in which table A has a partition A0 significantly bigger than its other partitions. [3]

![No AQE Skew Join [3]](/assets/images/posts/2024-07-20-Adaptive-Query-Execution-AQE/04.png)

![With AQE Skew Join [3]](/assets/images/posts/2024-07-20-Adaptive-Query-Execution-AQE/05.png)

```text
from pyspark.sql.functions import *
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("Adaptive Query Execution Demo") \
    .config("spark.sql.adaptive.enabled", "true") \
    .config("spark.sql.adaptive.coalescePartitions.minPartitionNum", 1)\
    .getOrCreate()

items = spark.range(30000000).select(col("id").alias("i_item_id"), lit((rand()*1000).cast("int")).alias("i_price"))
sales = spark.range(1000000000).select(
    when(rand() < 0.8, 100).otherwise((rand() * 30000000).cast("int")).alias("s_item_id"), 
    (lit((rand()*100)).cast("int")).alias("s_quantity"),
    (date_add(current_date(), - ((rand()*360)).cast("int")).alias("s_date")).alias("s_date"))

# Dynamically Coalesce Shuffle Partitions
sales.groupby(col("s_date")).agg(sum(col("s_quantity")).alias("q")).orderBy(col("q").desc()).select(col("s_date"), col("q")).show(1000)

# Dynamically Switch Join Strategies
sales.join(items, items.i_item_id == sales.s_item_id, "inner")\
    .filter(col("i_price") <10)\
    .groupby(col("s_date"))\
    .agg(sum(col("s_quantity") * col("i_price")).alias("total_sales"))\
    .orderBy(col("total_sales").desc())\
    .explain()

== Physical Plan ==
AdaptiveSparkPlan isFinalPlan=false
+- Sort [total_sales#52L DESC NULLS LAST], true, 0
   +- Exchange rangepartitioning(total_sales#52L DESC NULLS LAST, 200), ENSURE_REQUIREMENTS, [plan_id=101]
      +- HashAggregate(keys=[s_date#11], functions=[sum((s_quantity#9 * i_price#3))])
         +- Exchange hashpartitioning(s_date#11, 200), ENSURE_REQUIREMENTS, [plan_id=98]
            +- HashAggregate(keys=[s_date#11], functions=[partial_sum((s_quantity#9 * i_price#3))])
               +- Project [s_quantity#9, s_date#11, i_price#3]
                  +- SortMergeJoin [cast(s_item_id#8 as bigint)], [i_item_id#2L], Inner
                     :- Sort [cast(s_item_id#8 as bigint) ASC NULLS FIRST], false, 0
                     :  +- Exchange hashpartitioning(cast(s_item_id#8 as bigint), 200), ENSURE_REQUIREMENTS, [plan_id=90]
                     :     +- Filter isnotnull(s_item_id#8)
                     :        +- Project [CASE WHEN (rand(-924632588898868806) < 0.8) THEN 100 ELSE cast((rand(-5450329135034482535) * 3.0E7) as int) END AS s_item_id#8, cast((rand(-4623640845150663745) * 100.0) as int) AS s_quantity#9, date_add(2024-07-23, -cast((rand(-6800858320749385573) * 360.0) as int)) AS s_date#11]
                     :           +- Range (0, 1000000000, step=1, splits=10)
                     +- Sort [i_item_id#2L ASC NULLS FIRST], false, 0
                        +- Exchange hashpartitioning(i_item_id#2L, 200), ENSURE_REQUIREMENTS, [plan_id=91]
                           +- Filter (isnotnull(i_price#3) AND (i_price#3 < 10))
                              +- Project [id#0L AS i_item_id#2L, cast((rand(1769642186518054704) * 1000.0) as int) AS i_price#3]
                                 +- Range (0, 30000000, step=1, splits=10

sales.join(items, items.i_item_id == sales.s_item_id, "inner")\
    .filter(col("i_price") <10)\
    .groupby(col("s_date"))\
    .agg(sum(col("s_quantity") * col("i_price")).alias("total_sales"))\
    .orderBy(col("total_sales").desc())\
    .show(1000)

# Dynamically Optimize Skew Join
sales.join(items, items.i_item_id == sales.s_item_id, "inner")\
    .groupby(col("s_date"))\
    .agg(sum(col("s_quantity")*col("i_price")).alias("total_sales"))\
    .orderBy(col("total_sales").desc())\
    .show()
```

* **Dynamically Switching Join Strategies DAG**

![Dynamically Switching Join Strategies](/assets/images/posts/2024-07-20-Adaptive-Query-Execution-AQE/06.png)

* **Dynamically Switch Join Strategies DAG**

![](/assets/images/posts/2024-07-20-Adaptive-Query-Execution-AQE/07.png)

* **Dynamically Optimize Skew Join**

![](/assets/images/posts/2024-07-20-Adaptive-Query-Execution-AQE/08.png)

## Reference

1. [https://www.databricks.com/blog/2015/04/13/deep-dive-into-spark-sqls-catalyst-optimizer.html](https://www.databricks.com/blog/2015/04/13/deep-dive-into-spark-sqls-catalyst-optimizer.html)
2. [https://www.databricks.com/blog/2017/08/31/cost-based-optimizer-in-apache-spark-2-2.html](https://www.databricks.com/blog/2017/08/31/cost-based-optimizer-in-apache-spark-2-2.html)
3. [https://www.databricks.com/blog/2020/05/29/adaptive-query-execution-speeding-up-spark-sql-at-runtime.html](https://www.databricks.com/blog/2020/05/29/adaptive-query-execution-speeding-up-spark-sql-at-runtime.html)
4. [https://docs.databricks.com/en/_extras/notebooks/source/aqe-demo.html](https://docs.databricks.com/en/_extras/notebooks/source/aqe-demo.html)
5. [https://youtu.be/jzrEc4r90N8?si=17X45xw8UQ2OFFIW](https://youtu.be/jzrEc4r90N8?si=17X45xw8UQ2OFFIW)
6. [https://github.com/apache/spark/blob/master/sql/core/src/main/scala/org/apache/spark/sql/execution/adaptive/CoalesceShufflePartitions.scala](https://github.com/apache/spark/blob/master/sql/core/src/main/scala/org/apache/spark/sql/execution/adaptive/CoalesceShufflePartitions.scala)
7. [https://github.com/apache/spark/blob/master/sql/core/src/main/scala/org/apache/spark/sql/execution/adaptive/OptimizeSkewedJoin.scala](https://github.com/apache/spark/blob/master/sql/core/src/main/scala/org/apache/spark/sql/execution/adaptive/OptimizeSkewedJoin.scala)
