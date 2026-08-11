---
title: "Broadcast Hash Join (BHJ)"
description: "Broadcast Hash Join (BHJ)는 Apache Spark에서 작은 데이터셋과 큰 데이터셋을 조인할 때 사용하는 효율적인 조인 방법입니다. 이 방식은 작은 데이터셋을 클러스터의 모든 작업자 노드에 브로드"
categories:
 - data-engineering
 - spark
source: "https://blog.naver.com/csj4032/223522853353"
---

Broadcast Hash Join (BHJ)는 Apache Spark에서 작은 데이터셋과 큰 데이터셋을 조인할 때 사용하는 효율적인 조인 방법입니다. 이 방식은 작은 데이터셋을 클러스터의 모든 작업자 노드에 브로드캐스트하여 각 노드에서 로컬 해시 조인을 수행하는 방식입니다.

다음은 BHJ의 작동 방식을 상세하게 설명합니다.

## Broadcast Hash Join의 작동 방식

  1. **작은 데이터셋 브로드캐스트**:
    * 조인을 수행하기 전, 작은 데이터셋이 클러스터의 모든 노드로 브로드캐스트됩니다. 이를 통해 모든 작업자 노드는 작은 데이터셋의 전체 복사본을 갖게 됩니다.
    * Spark의 브로드캐스트 변수 메커니즘을 사용하여 작은 데이터셋을 효율적으로 각 노드에 배포합니다.
  2. **로컬 해시 테이블 생성**:
    * 각 작업자 노드는 브로드캐스트된 작은 데이터셋을 이용해 해시 테이블을 생성합니다. 이 해시 테이블은 조인 키를 해시 키로 사용하여 빠르게 조회할 수 있도록 합니다.
    * 해시 테이블 생성 과정에서는 작은 데이터셋의 각 행을 해시 키를 기준으로 저장합니다.
  3. **로컬 해시 조인 수행**:
    * 큰 데이터셋의 각 파티션에서 각 행에 대해 해시 키(조인 키)를 계산합니다.
    * 계산된 해시 키를 사용하여 해시 테이블에서 매칭되는 행을 조회합니다.
    * 매칭되는 행이 있으면 두 행을 결합하여 조인 결과를 생성합니다. 매칭되지 않는 경우, 해당 행은 조인 결과에서 제외됩니다.

## 성능 고려 사항

  1. **메모리 사용량:**
    * 작은 데이터셋이 각 노드의 메모리에 적재되므로, 작은 데이터셋이 충분히 작아야 합니다. 그렇지 않으면 메모리 부족 문제가 발생할 수 있습니다.
  2. **네트워크 부하:**
    * 작은 데이터셋을 브로드캐스트할 때 초기 네트워크 부하가 발생하지만, 이는 조인 과정에서의 성능 향상으로 보상됩니다.
  3. **조인 효율성:**
    * BHJ는 작은 참조 테이블과 큰 사실 테이블 간의 조인과 같은 경우에 매우 효율적입니다. 큰 데이터셋의 각 파티션에서 로컬 해시 조인을 수행하기 때문에 전체적인 성능이 크게 향상됩니다.

## 주요 설정 항목

  1. **spark.sql.autoBroadcastJoinThreshold**
    * 설명: 자동 브로드캐스트 조인 임계값을 설정합니다. 작은 데이터셋이 이 임계값보다 작으면 자동으로 브로드캐스트됩니다.
    * 기본값: 10MB (10485760 bytes)

```text
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", "10485760")  # 10MB
```

  1. **spark.sql.broadcastTimeout**
    * 브로드캐스트 작업이 타임아웃되기까지의 시간을 설정합니다. 큰 데이터셋을 브로드캐스트할 때 시간이 오래 걸릴 수 있으므로, 적절한 타임아웃 값을 설정하는 것이 중요합니다.
    * **기본값**: 300초 (5분)

```text
spark.conf.set("spark.sql.broadcastTimeout", "300")  # 5 minutes
```

  1. **spark.sql.join.preferSortMergeJoin**
    * **설명: Sort-Merge Join을 선호할지 여부를 설정합니다. 이 값을 false로 설정하면 Sort-Merge Join 대신 BHJ를 사용할 가능성이 높아집니다.**
    * **기본값**: true

```text
spark.conf.set("spark.sql.join.preferSortMergeJoin", "false")
```

  1. **spark.sql.adaptive.enabled**
    * **설명**: Adaptive Query Execution(AQE)을 활성화합니다. AQE가 활성화되면, 실행 중에 쿼리 계획을 동적으로 조정할 수 있습니다. 이 설정은 조인 전략 선택에도 영향을 미칠 수 있습니다.
    * **기본값**: false

```text
spark.conf.set("spark.sql.adaptive.enabled", "true")
```

## 사용 예제

* **BroadcastExchange**
  * BroadcastExchange는 Spark SQL의 물리적 실행 계획에서 작은 데이터셋을 브로드캐스트하는 연산자입니다. 이 연산자는 작은 데이터셋을 클러스터의 모든 노드로 전송하여 각 노드가 조인 작업을 로컬에서 수행할 수 있도록 합니다. BroadcastExchange는 다음과 같은 작업을 수행합니다:
      1. 데이터셋 브로드캐스트: 작은 데이터셋을 브로드캐스트 변수로 변환하여 클러스터의 모든 노드로 전송합니다.
      2. 물리적 실행 계획 생성: 브로드캐스트된 데이터셋을 기반으로 조인을 수행하기 위한 물리적 실행 계획을 생성합니다.
* **HashedRelationBroadcastMode**
  * HashedRelationBroadcastMode는 브로드캐스트된 데이터셋을 해시 테이블로 변환하여 각 노드에 저장하는 방식입니다. 이는 조인 키를 기준으로 해시 테이블을 생성하여 빠른 조회를 가능하게 합니다. HashedRelationBroadcastMode는 다음과 같은 작업을 수행합니다:
      1. 해시 테이블 생성: 작은 데이터셋을 해시 테이블로 변환하여 조인 키를 기준으로 매핑합니다.
      2. 브로드캐스트 변수 생성: 해시 테이블을 브로드캐스트 변수로 변환하여 클러스터의 모든 노드로 전송합니다.
      3. 조인 수행: 각 노드에서 큰 데이터셋과 브로드캐스트된 해시 테이블을 사용하여 로컬에서 조인 작업을 수행합니다.

```text
from pyspark.sql.functions import *
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("Broadcast Hash Join") \
    .config("spark.sql.adaptive.enabled", "true") \
    .getOrCreate()

items = spark.range(300000).select(col("id").alias("i_item_id"), lit((rand()*1000).cast("int")).alias("i_price"))
sales = spark.range(1000000000).select(col("id").alias("s_item_id"), (date_add(current_date(), - ((rand()*360)).cast("int")).alias("s_date")).alias("s_date"))
items.join(sales, items.i_item_id == sales.s_item_id).explain()

== Physical Plan ==
AdaptiveSparkPlan isFinalPlan=false
+- BroadcastHashJoin [i_item_id#2L], [s_item_id#8L], Inner, BuildLeft, false
   :- BroadcastExchange HashedRelationBroadcastMode(List(input[0, bigint, false]),false), [plan_id=20]
   :  +- Project [id#0L AS i_item_id#2L, cast((rand(6168008028341712180) * 1000.0) as int) AS i_price#3]
   :     +- Range (0, 300000, step=1, splits=10)
   +- Project [id#6L AS s_item_id#8L, date_add(2024-07-23, -cast((rand(-899123967341747277) * 360.0) as int)) AS s_date#10]
      +- Range (0, 1000000000, step=1, splits=10)

items.join(sales, items.i_item_id == sales.s_item_id).show()
```

![BroadcastHashJoin](/assets/images/posts/2024-07-23-Broadcast-Hash-Join-BHJ/01.png)
