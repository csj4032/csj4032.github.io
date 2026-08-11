---
title: "MSK 커넥터 vs Spark Streaming 비교"
description: "Kafka(MSK)에서 BigQuery로 데이터를 흘려보내는 두 가지 방식을 POC로 비교했습니다. 완전관리형 커넥터의 편의성과 Spark Structured Streaming의 변환 유연성 사이에서 무엇을 기준으로 골라야 하는지 정리합니다."
categories:
 - data-engineering
 - spark
tags:
 - kafka
 - msk
 - spark
 - bigquery
 - streaming
---

Kafka(MSK)에 쌓이는 이벤트를 BigQuery로 옮겨야 할 일이 생겼습니다. 방법은 크게 두 갈래입니다. 관리형 커넥터에 맡기거나, Spark Structured Streaming으로 직접 파이프라인을 짜거나. 둘 다 POC를 돌려보고 나서 정리한 기록입니다.

결론부터 말하면 **"어느 쪽이 더 좋은가"가 아니라 "지금 토픽 구조에서 무엇이 가능한가"가 실질적인 갈림길**이었습니다.

## 두 방식의 구조

```
[방식 1] 커넥터에 맡기기
  MSK ──> Kafka Connect (BigQuery Sink) ──> BigQuery
          └ 관리형. 설정 JSON 하나로 끝

[방식 2] 직접 짜기
  MSK ──> Spark Structured Streaming ──> BigQuery
          └ EMR 위에서 실행. 중간에 원하는 변환을 끼워넣을 수 있음
```

핵심 차이는 **중간에 변환을 끼워넣을 자리가 있느냐**입니다. 커넥터는 토픽의 레코드를 거의 그대로 테이블에 밀어넣고, Spark는 그 사이에 마음대로 손댈 수 있습니다. 이 차이가 뒤에 나올 모든 장단점의 뿌리입니다.

## 1. MSK 커넥터

### 설정 예시

```json
{
  "connector.class": "com.wepay.kafka.connect.bigquery.BigQuerySinkConnector",
  "tasks.max": "1",
  "topics": "sensor-rule-signal-v1,sensor-self-signal-v1",
  "project": "mmix-prod-data-iron",
  "datasets": "stg_platform",
  "defaultDataset": "stg_platform",
  "keyfile": "/etc/gcp/key.json",
  "autoCreateTables": "false",
  "sanitizeTopics": "true",
  "allowNewBigQueryFields": "true",
  "allowBigQueryRequiredFieldRelaxation": "true",
  "bigQueryPartitionDecorator": "false",
  "value.converter": "org.apache.kafka.connect.json.JsonConverter",
  "value.converter.schemas.enable": "false",
  "key.converter": "org.apache.kafka.connect.storage.StringConverter"
}
```

### 설정 항목 읽기

처음 보면 그냥 나열처럼 보이지만, 이 중 몇 개는 나중에 문제가 되는 지점과 직접 연결됩니다.

| 옵션 | 의미 | 주의할 점 |
| --- | --- | --- |
| `sanitizeTopics` | 토픽 이름을 BigQuery 테이블명 규칙에 맞게 치환 | `-` 가 `_` 로 바뀌므로 실제 테이블명이 토픽명과 달라집니다 |
| `autoCreateTables` | 테이블 자동 생성 | `false` 면 테이블을 미리 만들어 둬야 합니다 |
| `allowNewBigQueryFields` | 레코드에 새 필드가 오면 컬럼 추가 | 스키마 진화를 커넥터에 맡기는 옵션 |
| `allowBigQueryRequiredFieldRelaxation` | `REQUIRED` 컬럼을 `NULLABLE` 로 완화 | 이게 없으면 값이 빠진 레코드에서 적재가 막힙니다 |
| `bigQueryPartitionDecorator` | `$yyyymmdd` 데코레이터로 파티션 지정 | `false` 면 수집 시각 기준 파티셔닝으로 동작합니다 |
| `value.converter.schemas.enable` | JSON에 스키마를 동봉할지 | **`false` 라는 점이 뒤에 나올 문제의 핵심입니다** |

`tasks.max` 가 `1` 인 것도 눈여겨볼 만합니다. Connect의 병렬도는 태스크 수로 정해지고 태스크 하나는 여러 파티션을 나눠 맡습니다. 처리량이 부족하면 이 값을 올리되, **파티션 수를 넘겨봐야 유휴 태스크만 생깁니다.**

### 장점

- 완전관리형이라 운영 부담이 적습니다. 프로세스가 죽으면 알아서 재시작되고, 오프셋 관리도 Connect가 합니다
- 설정 JSON 하나로 끝납니다. 배포 파이프라인도, 코드 저장소도 필요 없습니다
- `topics.regex` 를 쓰면 신규 토픽을 자동으로 감지해 테이블 생성과 적재까지 이어집니다

### 단점 — 그리고 이번에 막힌 지점

문서상 단점보다 **실제로 막힌 지점**이 중요했습니다. 현재 토픽에는 **같은 키에 배열과 단일값이 섞여** 들어옵니다.

```json
// 같은 토픽, 같은 필드인데 레코드마다 모양이 다름
{ "signals": [1, 2, 3] }
{ "signals": 1 }
```

이게 왜 문제인지는 BigQuery의 타입 모델을 보면 분명해집니다. BigQuery의 컬럼은 **모드(mode)가 하나로 고정**됩니다. `REPEATED`(배열)이거나 `NULLABLE`(단일값)이거나 둘 중 하나이지, 레코드마다 왔다 갔다 할 수 없습니다.

여기에 `value.converter.schemas.enable=false` 가 겹칩니다. 스키마가 동봉되지 않으니 커넥터는 **레코드를 보고 타입을 추론**하는 수밖에 없는데, 첫 레코드가 배열이면 `REPEATED` 로 굳고 그 뒤에 오는 단일값이 거부됩니다. 반대 순서면 반대로 막힙니다. `allowNewBigQueryFields` 나 `allowBigQueryRequiredFieldRelaxation` 은 **컬럼 추가와 NULL 허용을 다룰 뿐 모드 충돌은 해결하지 못합니다.**

정리하면 이건 커넥터의 결함이 아니라 **토픽 스키마 설계 문제**입니다. 그래서 해법도 커넥터 설정이 아니라 그 앞단에 있습니다.

- **토픽 구조를 고친다** — 항상 배열로 보내도록 발행 측을 통일합니다. 가장 깨끗하지만 백엔드 팀과의 협의와 기존 소비자 영향 검토가 필요합니다
- **SMT(Single Message Transform)를 끼운다** — Connect 파이프라인 중간에 변환을 넣는 방법입니다. 다만 기본 제공 SMT로는 이런 정규화가 어렵고 커스텀 SMT를 직접 만들어야 해서, "관리형이라 편하다"는 장점이 상당 부분 사라집니다
- **문제 필드를 문자열로 받는다** — 원본 JSON을 통째로 문자열 컬럼에 넣고 BigQuery에서 `JSON_VALUE` 등으로 파싱합니다. 적재는 즉시 뚫리지만 조회 비용과 쿼리 복잡도가 downstream으로 넘어갑니다

## 2. Spark Streaming

### 코드 예시

```py
# Spark 세션 생성
spark = SparkSession.builder \
    .appName("MSK-to-GCP") \
    .config("spark.jars.packages",
            "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.0,"
            "com.google.cloud.spark:spark-bigquery-with-dependencies_2.12:0.32.0") \
    .config("spark.sql.streaming.checkpointLocation", "./checkpoints") \
    .getOrCreate()

# MSK 연결 및 데이터 읽기
df = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", kafka_bootstrap_servers) \
    .option("subscribe", kafka_topic) \
    .option("startingOffsets", "earliest") \
    .load()

# 토픽별 분기 처리 및 BigQuery 저장
def process_batch(batch_df, batch_id):
    df_self = batch_df.filter(col("topic") == "sensor-self-signal-v1")
    df_rule = batch_df.filter(col("topic") == "sensor-rule-signal-v1")
    # 각 토픽별 스키마 파싱 및 BigQuery 저장

query = df.writeStream \
    .foreachBatch(process_batch) \
    .trigger(processingTime="10 seconds") \
    .start()
```

### `foreachBatch` 를 쓰는 이유

`writeStream.format("bigquery")` 로 바로 쓰지 않고 `foreachBatch` 를 거치는 데는 이유가 있습니다.

하나의 스트림에서 **여러 토픽을 구독해 각각 다른 테이블로 보내야** 하기 때문입니다. Structured Streaming의 싱크는 기본적으로 스트림 하나에 대상 하나를 상정합니다. `foreachBatch` 는 마이크로배치를 **평범한 배치 DataFrame으로 넘겨주기 때문에**, 그 안에서는 필터든 조인이든 다중 write든 배치 API를 그대로 쓸 수 있습니다. 커넥터에서 불가능했던 배열/단일값 정규화도 바로 이 자리에서 처리합니다.

대신 대가가 있습니다. `foreachBatch` 안의 write는 Spark가 **트랜잭션으로 묶어주지 않습니다.** 배치를 두 번 쓰면 두 번 들어갑니다.

### 전달 보장과 재시작

`batch_id` 가 인자로 들어오는 것이 이 지점의 힌트입니다. Spark는 체크포인트에 오프셋과 커밋 로그를 남기고, 실패 시 **커밋되지 않은 마지막 배치를 같은 `batch_id` 로 다시 실행**합니다. 즉 기본 보장은 **at-least-once** 이고, 중복 없이 만들려면 쓰기 쪽이 멱등해야 합니다. `batch_id` 를 함께 저장해 두고 이미 처리한 배치를 건너뛰거나, 적재 후 MERGE로 중복을 제거하는 식의 처리를 직접 넣어야 합니다.

### 체크포인트 위치 — 실제로 확인이 필요했던 부분

원본 검토에서 "EMR 재부팅 시 checkpoint 유지 여부 확인 필요"로 남겨뒀던 항목인데, 위 설정을 보면 답이 나옵니다.

```py
.config("spark.sql.streaming.checkpointLocation", "./checkpoints")
```

`./checkpoints` 는 **드라이버 노드의 로컬 경로**입니다. EMR 인스턴스의 로컬 디스크는 휘발성이라, 클러스터를 내렸다 올리거나 노드가 교체되면 사라집니다. 체크포인트가 없어진 상태로 다시 뜨면 `startingOffsets: earliest` 설정에 따라 **처음부터 전부 다시 읽습니다.** 대량 중복 적재로 이어집니다.

그래서 운영에서는 체크포인트를 반드시 **영속 스토리지**에 두어야 합니다.

```py
.config("spark.sql.streaming.checkpointLocation", "s3://mmix-data/checkpoints/msk-to-bq/")
```

덧붙여 `startingOffsets` 는 **체크포인트가 없을 때만** 적용됩니다. 체크포인트가 있으면 그 오프셋이 우선하므로, 값을 바꿔도 반영되지 않는다면 체크포인트가 남아 있는 것입니다.

### 트리거 주기

`processingTime="10 seconds"` 는 지연과 비용의 절충점입니다. 짧게 잡을수록 신선하지만 작은 파일과 API 호출이 늘어납니다. BigQuery는 특히 잦은 소량 쓰기에서 손해가 커서, 지연 요구가 빡빡하지 않다면 주기를 늘리는 쪽이 유리합니다. 상시 스트리밍이 필요 없다면 `Trigger.AvailableNow` 로 **주기적 배치처럼 운용**하는 선택지도 있습니다. 클러스터를 늘 띄워둘 필요가 없어져 비용이 크게 줄어듭니다.

### 쓰기 방식

`spark-bigquery-connector` 는 두 가지 경로를 제공합니다.

- **indirect** (기본) — GCS에 임시 파일을 쓰고 BigQuery 로드 잡을 겁니다. 버킷이 추가로 필요하고 단계가 하나 늘어납니다
- **direct** — Storage Write API로 곧장 씁니다. 중간 단계가 없어 지연이 짧습니다

스트리밍이라면 `writeMethod` 를 `direct` 로 두는 편이 자연스럽습니다.

### 장점

- 변환이 자유롭습니다. 배열/단일값 혼재 같은 문제를 **토픽 구조를 바꾸지 않고** 흡수할 수 있습니다
- 여러 토픽을 하나의 스트림에서 분기 처리할 수 있습니다
- 적재 전에 필터링·조인·집계를 붙일 수 있어, downstream 비용을 앞단에서 줄일 여지가 있습니다

### 단점

- 완전관리형이 아니라 안정성을 직접 책임져야 합니다
- 관리 포인트가 많습니다. 코드 저장소, 배포, 모니터링, 클러스터 수명주기가 전부 대상입니다
- 신규 토픽 추가 시 코드 수정과 재시작이 필요합니다
- 체크포인트를 잘못 두면 위에서 본 것처럼 전량 재처리로 이어집니다
- 스키마 변경이 조용히 깨지기 쉽습니다. 파싱 스키마를 코드에 박아두면 새 필드는 그냥 버려지고, 아무도 모르는 채 흘러갑니다

## 비교 요약

| 항목 | MSK 커넥터 | Spark Streaming |
| --- | --- | --- |
| 관리 편의성 | ⭐⭐⭐ 완전관리형 | ⭐ 직접 관리 필요 |
| 초기 설정 | ⭐⭐⭐ 설정 JSON | ⭐⭐ 코드 작성 필요 |
| 데이터 변환 | ⭐ 제한적 | ⭐⭐⭐ 유연함 |
| 토픽 추가 | ⭐⭐⭐ 자동 감지 | ⭐ 코드 수정 필요 |
| 전달 보장 | at-least-once | at-least-once (멱등 처리는 직접) |
| 스키마 진화 | 옵션으로 컬럼 추가 대응 | 코드 수정 필요 |
| 장애 복구 | Connect가 담당 | 체크포인트 설계에 달림 |
| 비용 구조 | 커넥터 실행 시간 | 클러스터 상시 가동 |
| 현재 적용 가능 여부 | ❌ 토픽 구조 변경 필요 | ⭕ 즉시 적용 가능 |

## 무엇을 기준으로 고를까

POC를 돌려보고 정리한 판단 기준입니다.

**커넥터가 맞는 경우** — 토픽 스키마가 안정적이고, 하는 일이 사실상 "그대로 옮기기"이며, 토픽이 계속 늘어나는 상황. 변환이 필요 없다면 굳이 클러스터를 띄워 운영 부담을 질 이유가 없습니다.

**Spark가 맞는 경우** — 적재 전에 손볼 것이 있거나, 발행 측 스키마를 당장 바꿀 수 없거나, 여러 토픽을 묶어 처리해야 하는 상황.

지금 상황은 두 번째에 가깝습니다. 다만 이건 **토픽 구조 때문에 떠밀려 선택한 것**이지 Spark가 더 나아서가 아닙니다. 그래서 실제로는 이렇게 접근하는 편이 낫다고 봅니다.

1. 단기 — Spark Streaming으로 적재를 뚫습니다. 체크포인트는 반드시 S3에 두고, 멱등 처리를 함께 넣습니다
2. 병행 — 발행 측과 토픽 스키마 정규화를 협의합니다. 배열/단일값 혼재는 이 파이프라인만의 문제가 아니라 **모든 소비자가 각자 우회 코드를 들고 있어야 하는 비용**입니다
3. 장기 — 스키마가 정리되면 커넥터로 옮겨 운영 부담을 덜지 재검토합니다

정규화가 끝나면 굳이 Spark를 계속 유지할 이유가 줄어듭니다. **지금의 선택은 잠정적인 것**으로 두는 편이 맞다고 생각합니다.

## 참고

- [Kafka Connect BigQuery Sink Connector](https://github.com/confluentinc/kafka-connect-bigquery)
- [Structured Streaming Programming Guide](https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html)
- [Structured Streaming + Kafka Integration Guide](https://spark.apache.org/docs/latest/structured-streaming-kafka-integration.html)
- [spark-bigquery-connector](https://github.com/GoogleCloudDataproc/spark-bigquery-connector)
