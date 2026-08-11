---
title: "Spark Core · mapPartitions · coalesce"
description: "Spark의 병렬도는 Core 수가 아니라 파티션 수가 결정합니다. Core와 파티션의 관계, mapPartitions가 실제로 유리한 지점, coalesce가 설정한 대로 동작하지 않는 이유를 정리합니다."
categories:
 - data-engineering
 - spark
tags:
 - spark
 - partition
 - mapPartitions
 - coalesce
 - repartition
 - aqe
---

Spark 작업이 느릴 때 가장 먼저 의심하게 되는 건 클러스터 크기입니다. Executor를 늘리고 Core를 늘렸는데도 속도가 그대로인 경우가 있는데, 대개는 **파티션 수가 병목**입니다.

Core는 병렬도의 상한선일 뿐이고, 실제로 몇 개의 Task가 도는지는 파티션이 정합니다. 이 구분이 흐릿하면 `coalesce`를 잘못 넣어 32개 Core 중 4개만 쓰는 상황이 쉽게 만들어집니다.

## 1. Core란 무엇인가

Spark에서 Executor는 하나의 JVM 프로세스를 의미하며, Executor Core는 동시에 하나의 Task를 실행할 수 있는 **슬롯**을 의미합니다. 예를 들어 아래처럼 설정하면 총 16개의 Core가 생기고, 이론적으로 동시에 최대 16개의 Task를 실행할 수 있습니다.

```
executor.instances = 4
executor.cores     = 4
                     ────
총 Core            = 16
```

여기서 중요한 점은 Core가 **병렬도의 상한선**이라는 사실입니다. Core 수는 동시에 실행 가능한 Task의 최대 개수를 의미할 뿐이며, 실제로 몇 개의 Task가 실행되는지는 Core 수가 아니라 해당 Stage의 파티션 수에 의해 결정됩니다. Core는 "실행 슬롯"이고, 실제 작업 수는 파티션이 정합니다.

`executor.cores`를 무작정 키우는 것도 답이 아닙니다. 한 JVM 안에서 Core들이 힙을 공유하기 때문에, Core를 늘릴수록 Task 하나가 쓸 수 있는 메모리는 줄어듭니다. 경험적으로 Executor당 4~5개 정도가 무난한 지점으로 알려져 있습니다. HDFS 계열 스토리지에서는 Core를 너무 많이 잡으면 I/O 처리량이 오히려 떨어지기도 합니다.

## 2. mapPartitions의 병렬 실행 기준

한 Stage의 Task 개수는 입력 RDD 또는 DataFrame의 파티션 수와 같습니다. `mapPartitions()`는 파티션 하나당 하나의 Task를 만들고, 각 Task는 Core 하나를 써서 실행됩니다.

파티션이 5개인데 클러스터 Core가 32개라면 동시에 실행되는 Task는 5개뿐이고 나머지 27개 Core는 놉니다. 반대로 파티션이 100개이고 Core가 32개라면 32개가 먼저 돌고 나머지 68개는 대기하다 순차적으로 실행됩니다. 결국 동시 실행 Task 수는 언제나 이렇게 정해집니다.

```
동시 실행 Task = min(전체 Core 수, 파티션 수)
```

### map과 무엇이 다른가

병렬도 측면에서는 `map()`과 `mapPartitions()`가 똑같이 파티션 수를 따릅니다. 다른 것은 **함수가 호출되는 횟수**입니다. `map()`은 row마다 함수를 부르고, `mapPartitions()`는 파티션 전체를 iterator로 한 번 받습니다.

```python
# map: row 개수만큼 함수 호출
rdd.map(lambda row: transform(row))

# mapPartitions: 파티션 개수만큼 함수 호출
rdd.mapPartitions(lambda it: process_partition(it))
```

이 차이가 결정적으로 드러나는 곳이 **초기화 비용이 큰 작업**입니다. row마다 DB 커넥션을 맺으면 100만 건에 100만 번 연결하지만, 파티션 단위로 하면 파티션 수만큼만 맺습니다.

```python
def enrich(rows):
    # 파티션당 한 번만 실행된다
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    try:
        for row in rows:
            cur.execute("SELECT name FROM users WHERE id = %s", (row.user_id,))
            hit = cur.fetchone()
            yield Row(user_id=row.user_id, name=hit[0] if hit else None)
    finally:
        # 파티션이 끝나면 반드시 닫는다
        cur.close()
        conn.close()

enriched = df.rdd.mapPartitions(enrich).toDF()
```

`yield`로 돌려주는 점이 중요합니다. 결과를 리스트에 모아 `return`하면 파티션 전체가 메모리에 올라갑니다. 제너레이터로 흘려보내야 Spark가 한 건씩 소비할 수 있습니다.

```python
# 나쁜 예 — 파티션 전체를 메모리에 적재
def bad(rows):
    conn = get_conn()
    result = [transform(r, conn) for r in rows]   # 여기서 전부 적재
    conn.close()
    return result
```

한 가지 더, 위 예제는 row 하나마다 쿼리를 날리고 있어 커넥션만 아꼈을 뿐 왕복 횟수는 그대로입니다. 실제로는 파티션 안에서 배치로 묶는 편이 낫습니다.

```python
def enrich_batched(rows, batch_size=1000):
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    try:
        buf = []
        for row in rows:
            buf.append(row)
            if len(buf) >= batch_size:
                yield from lookup_many(cur, buf)
                buf = []
        if buf:
            yield from lookup_many(cur, buf)
    finally:
        cur.close()
        conn.close()
```

### 외부 시스템 동시성 제어

여기서 파티션 수는 성능 문제를 넘어 **부하 문제**가 됩니다. 파티션이 200개면 외부 API에 최대 Core 수만큼의 동시 요청이 들어갑니다. 상대 시스템이 감당하지 못하면 파티션 수를 의도적으로 줄여 동시성을 제한하는 선택도 필요합니다.

## 3. 파티션 수를 확인하는 방법

추측하지 말고 찍어보는 게 빠릅니다.

```python
print(df.rdd.getNumPartitions())

# 파티션별 건수 분포 — skew 확인용
from pyspark.sql.functions import spark_partition_id, count

df.groupBy(spark_partition_id().alias("pid")) \
  .agg(count("*").alias("rows")) \
  .orderBy("rows", ascending=False) \
  .show(10)
```

파티션별 건수가 크게 벌어져 있으면 파티션 수를 늘려도 소용이 없습니다. 가장 큰 파티션 하나가 전체 Stage를 붙잡습니다.

관련 설정도 함께 봐두면 좋습니다.

| 설정 | 기본값 | 적용 대상 |
| --- | --- | --- |
| `spark.default.parallelism` | Core 수 | RDD 연산의 기본 파티션 수 |
| `spark.sql.shuffle.partitions` | 200 | **shuffle 이후** DataFrame 파티션 수 |
| `spark.sql.files.maxPartitionBytes` | 128MB | 파일을 읽을 때 파티션 하나의 크기 |

## 4. coalesce란 무엇인가

`coalesce(n)`은 파티션 수를 **줄이는** 연산입니다. 기본적으로 shuffle 없이 인접한 파티션을 병합합니다. 그래서 이후 Stage의 Task 수가 줄고, 병렬도도 함께 줄어듭니다.

파티션이 100개, Core가 32개라면 최대 32개가 동시에 돕니다. 여기에 `coalesce(4)`를 넣으면 이후 Stage의 Task는 4개만 생기고, 28개 Core는 놉니다.

```
coalesce 이전    파티션 100  →  동시 실행 32
coalesce(4) 이후 파티션   4  →  동시 실행  4   (28 Core 유휴)
```

coalesce는 데이터를 재분배하는 연산이 아니라 그냥 합치는 연산입니다. 계산 단계 중간에 무심코 넣으면 전체 처리 속도가 크게 떨어집니다.

**위치가 전부입니다.** 무거운 계산이 끝나고 저장 직전에 두면 파일 개수만 줄이는 의도대로 동작하지만, 계산 앞에 두면 그 뒤 모든 작업의 병렬도가 묶입니다.

```python
# 나쁜 예 — 이후 계산 전체가 4 병렬로 묶인다
df.coalesce(4).filter(...).withColumn(...).write.parquet(path)

# 좋은 예 — 계산은 넓게, 저장 직전에만 줄인다
df.filter(...).withColumn(...).coalesce(4).write.parquet(path)
```

## 5. repartition과 coalesce의 차이

`repartition()`은 파티션을 늘리거나 줄일 수 있고 **항상 shuffle**이 발생합니다. 데이터가 네트워크를 타고 재분배되어 균등하게 흩어집니다. `coalesce()`는 기본적으로 shuffle 없이 줄이기만 하며, 단순 병합으로 동작합니다.

| | `repartition(n)` | `coalesce(n)` |
| --- | --- | --- |
| 증가 | 가능 | **불가** (요청해도 무시) |
| 감소 | 가능 | 가능 |
| shuffle | 항상 발생 | 기본적으로 없음 |
| 균등 분배 | 보장 | 보장 안 됨 |
| 비용 | 네트워크 I/O | 거의 없음 |

```python
# repartition: shuffle 발생, 균등 분배
df.repartition(10)

# 컬럼 기준 재분배 — 같은 키가 같은 파티션으로 모인다
df.repartition(10, "user_id")

# coalesce: shuffle 없음
df.coalesce(10)
```

여기서 자주 헷갈리는 부분이 있습니다. **`shuffle` 옵션은 RDD에만 있습니다.**

```python
# RDD — shuffle 인자를 받는다
rdd.coalesce(10, shuffle=True)     # repartition 과 사실상 동일

# DataFrame — 인자는 numPartitions 하나뿐
df.coalesce(10)
df.coalesce(10, shuffle=True)      # TypeError
```

DataFrame에서 shuffle을 동반한 재분배가 필요하면 `coalesce`가 아니라 `repartition`을 쓰면 됩니다. `rdd.coalesce(n, shuffle=True)`를 쓰는 순간 "shuffle 없이 줄인다"는 coalesce의 유일한 장점이 사라지므로, 사실상 `repartition(n)`을 돌려 말한 것과 같습니다.

## 6. Job · Stage · Task · Core 관계

실행 구조는 네 계층으로 정리됩니다. Job은 Action이 호출될 때 생기고, shuffle을 경계로 Stage가 나뉩니다. 각 Stage는 파티션 수만큼 Task를 만들고, Task 하나가 Core 하나를 씁니다.

```
Job                          ← Action 하나당 하나 (count, save, collect …)
 └── Stage                   ← shuffle 경계로 분리
       └── Task              ← 파티션 수만큼 생성
             └── Core        ← Task 하나가 Core 하나 점유
```

동일 Stage 안에서 동시에 실행되는 Task 수는 언제나 `min(Core 수, 파티션 수)`입니다. 파티션이 모자라면 Core가 놀고, 파티션이 많으면 Core 수만큼 돌고 나머지는 대기합니다.

Spark UI에서 확인할 때는 Stages 탭의 Task 수가 곧 그 Stage의 파티션 수입니다. Task 수가 200으로 딱 떨어진다면 `spark.sql.shuffle.partitions` 기본값이 그대로 걸린 것입니다.

## 7. coalesce가 예상과 다르게 보이는 경우

운영에서 가장 자주 겪는 상황입니다. `coalesce(4)`를 넣었는데 Spark UI에는 200개 Task가 찍히는 식입니다. 원인은 대개 셋 중 하나입니다.

### shuffle이 뒤따르는 경우

```python
df.coalesce(4).groupBy("col").count()
```

`groupBy`에서 shuffle이 일어나 **새 Stage**가 만들어집니다. 새 Stage의 파티션 수는 `spark.sql.shuffle.partitions`(기본 200)가 정하므로 앞의 `coalesce(4)`는 그 경계를 넘지 못합니다. coalesce가 무시된 것처럼 보이지만, 정확히는 **적용 범위가 shuffle 이전 Stage까지**인 것입니다.

줄이고 싶다면 shuffle 이후에 넣어야 합니다.

```python
df.groupBy("col").count().coalesce(4).write.parquet(path)
```

### AQE가 개입하는 경우

Spark 3부터 Adaptive Query Execution이 기본 활성이라, 런타임 통계를 보고 Spark가 파티션을 알아서 병합합니다. 명시한 값과 실행 계획의 파티션 수가 달라지는 이유입니다.

```python
spark.conf.get("spark.sql.adaptive.enabled")                     # 기본 true
spark.conf.get("spark.sql.adaptive.coalescePartitions.enabled")  # 기본 true

# 목표 파티션 크기 — AQE 는 이 크기에 맞춰 작은 파티션을 합친다
spark.conf.set("spark.sql.adaptive.advisoryPartitionSizeInBytes", "128MB")
```

대개 AQE가 더 나은 판단을 하므로 끄기보다는 맡기는 편이 낫습니다. 정말 정확한 제어가 필요한 구간에서만 잠시 끄는 정도로 충분합니다.

### write 과정에서 재분할되는 경우

파티션 컬럼으로 저장하면 쓰기 직전에 내부 재분배가 일어납니다.

```python
df.coalesce(1).write.partitionBy("dt").parquet(path)
```

이 경우 `dt` 값마다 디렉터리가 갈리므로 최종 파일 개수는 `coalesce(1)`이 아니라 `dt`의 카디널리티를 따릅니다.

## 8. coalesce(1)이 위험한 이유

파일 하나로 만들고 싶어 `coalesce(1)`을 쓰는 경우가 많은데, 이건 전체 데이터를 **Task 하나**에 밀어 넣는 것과 같습니다.

- 병렬성이 완전히 사라져 앞 단계가 아무리 넓어도 마지막이 직렬로 묶입니다
- 한 Executor 힙에 전부 올라가 GC가 늘고 심하면 OOM이 납니다
- skew가 있으면 단순 병합이라 불균형이 그대로 남아 Straggler가 생깁니다

파일 개수를 줄이는 게 목적이라면 다른 방법이 있습니다.

```python
# 1) 파일당 최대 레코드 수로 제어 — 병렬성 유지
df.write.option("maxRecordsPerFile", 1_000_000).parquet(path)

# 2) 균등 분배가 필요하면 repartition — shuffle 비용을 내고 균형을 얻는다
df.repartition(8).write.parquet(path)

# 3) 정말 단일 파일이어야 한다면, 크기를 확인하고 마지막에만
small_df.coalesce(1).write.parquet(path)
```

정말 파일 하나가 필요한 경우는 대개 다운스트림이 Spark가 아닌 도구일 때입니다. 그렇다면 Spark에서 억지로 합치기보다, 적당한 크기로 저장한 뒤 별도 단계에서 병합하는 편이 안전합니다.

## 9. skew가 있을 때

특정 키에 데이터가 몰리면 파티션을 늘려도 그 키는 여전히 한 파티션에 들어갑니다. 이때는 키에 임의값을 붙여 흩뜨리는 방법을 씁니다.

```python
from pyspark.sql.functions import concat, lit, rand, floor, split, col

N = 10
salted = df.withColumn("skey", concat(col("key"), lit("_"), floor(rand() * N)))

partial = salted.groupBy("skey").count()

result = partial \
    .withColumn("key", split(col("skey"), "_").getItem(0)) \
    .groupBy("key") \
    .sum("count")
```

AQE의 skew join 최적화가 상당 부분 자동으로 처리해주기도 합니다.

```python
spark.conf.get("spark.sql.adaptive.skewJoin.enabled")   # 기본 true
```

## 정리

Spark에서 병렬도를 정하는 것은 Core 수가 아니라 파티션 수입니다. Core는 상한선일 뿐이고, 실제 동시 실행 Task 수는 언제나 `min(Core 수, 파티션 수)`입니다.

| 상황 | 선택 |
| --- | --- |
| 초기화 비용이 큰 외부 접근 | `mapPartitions` + 제너레이터 |
| 외부 시스템 동시성 제한 | 파티션 수를 의도적으로 줄임 |
| 저장 직전 파일 개수 줄이기 | `coalesce(n)` — 반드시 계산 **이후** |
| 균등 분배가 필요 | `repartition(n)` — shuffle 비용을 냄 |
| 파일 크기 제어 | `maxRecordsPerFile` |
| 특정 키 쏠림 | salting 또는 AQE skew join |

`coalesce`는 값이 아니라 **위치**가 성능을 결정합니다. 계산 앞에 두면 그 뒤 전부가 묶이고, 저장 직전에 두면 의도한 대로 파일 개수만 줄어듭니다.

## 참고

- [Spark RDD Programming Guide](https://spark.apache.org/docs/latest/rdd-programming-guide.html)
- [Spark SQL Performance Tuning](https://spark.apache.org/docs/latest/sql-performance-tuning.html)
- [Adaptive Query Execution](https://spark.apache.org/docs/latest/sql-performance-tuning.html#adaptive-query-execution)
- [Spark Configuration](https://spark.apache.org/docs/latest/configuration.html)
