---
title: "Sort Merge Join (SMJ)"
description: "Shuffle Sort Merge Join (SMJ)는 대규모 데이터셋을 효율적으로 조인하기 위한 알고리즘입니다. SMJ는 특히 메모리에 전체 데이터를 담기 어려운 경우와 조인 키가 미리 정렬되지 않은 상황에서 유용"
categories:
 - data-engineering
 - spark
source: "https://blog.naver.com/csj4032/223519558713"
---

Shuffle Sort Merge Join (SMJ)는 대규모 데이터셋을 효율적으로 조인하기 위한 알고리즘입니다. SMJ는 특히 메모리에 전체 데이터를 담기 어려운 경우와 조인 키가 미리 정렬되지 않은 상황에서 유용합니다. SSMJ는 데이터를 셔플, 정렬, 병합하는 세 단계로 나누어 조인 작업을 수행합니다.

## SMJ의 단계별 설명

1. **셔플 단계 (Shuffling Phase)**:
  * **데이터 파티셔닝**: 두 입력 데이터셋을 조인 키를 기준으로 해시 파티셔닝하여, 같은 키를 가진 레코드가 동일한 파티션으로 이동합니다.
  * **네트워크 전송**: 이 과정에서 데이터는 네트워크를 통해 클러스터의 다른 노드로 이동합니다. 이는 셔플링 단계에서 네트워크 비용이 발생하는 이유입니다.
2. **정렬 단계 (Sorting Phase)**:
  * **파티션 내 정렬**: 각 파티션 내에서 데이터를 조인 키를 기준으로 정렬합니다. 정렬된 데이터는 병합 단계에서 효율적인 조인을 가능하게 합니다.
3. **병합 단계 (Merging Phase)**:
  * **병합 조인**: 정렬된 각 파티션을 병합하면서 조인 키가 같은 레코드를 찾습니다. 정렬된 두 리스트를 병합하는 방식으로, 조인 키를 비교하며 일치하는 레코드를 조인합니다.

## SMJ의 예제

아래는 PySpark를 사용하여 SMJ를 수행하는 예제 코드입니다:

```text
spark = SparkSession.builder \
    .appName("Shuffle Sort Merge Join") \
    .config("spark.sql.adaptive.enabled", "true") \
    .getOrCreate()


df1 = spark.read.option("header", "true").csv("./data/retail-data/all/online-retail-dataset.csv")
df2 = spark.read.option("header", "true").csv("./data/retail-data/all/online-retail-dataset.csv")

df3 = df1.join(df2, "InvoiceNo", "inner")

df3.explain("extended")

df3.selectExpr("*").show()
```

```text
== Parsed Logical Plan ==
'Join UsingJoin(Inner, [InvoiceNo])
:- Relation [InvoiceNo#17,StockCode#18,Description#19,Quantity#20,InvoiceDate#21,UnitPrice#22,CustomerID#23,Country#24] csv
+- Relation [InvoiceNo#50,StockCode#51,Description#52,Quantity#53,InvoiceDate#54,UnitPrice#55,CustomerID#56,Country#57] csv

== Analyzed Logical Plan ==
InvoiceNo: string, StockCode: string, Description: string, Quantity: string, InvoiceDate: string, UnitPrice: string, CustomerID: string, Country: string, StockCode: string, Description: string, Quantity: string, InvoiceDate: string, UnitPrice: string, CustomerID: string, Country: string
Project [InvoiceNo#17, StockCode#18, Description#19, Quantity#20, InvoiceDate#21, UnitPrice#22, CustomerID#23, Country#24, StockCode#51, Description#52, Quantity#53, InvoiceDate#54, UnitPrice#55, CustomerID#56, Country#57]
+- Join Inner, (InvoiceNo#17 = InvoiceNo#50)
   :- Relation [InvoiceNo#17,StockCode#18,Description#19,Quantity#20,InvoiceDate#21,UnitPrice#22,CustomerID#23,Country#24] csv
   +- Relation [InvoiceNo#50,StockCode#51,Description#52,Quantity#53,InvoiceDate#54,UnitPrice#55,CustomerID#56,Country#57] csv

== Optimized Logical Plan ==
Project [InvoiceNo#17, StockCode#18, Description#19, Quantity#20, InvoiceDate#21, UnitPrice#22, CustomerID#23, Country#24, StockCode#51, Description#52, Quantity#53, InvoiceDate#54, UnitPrice#55, CustomerID#56, Country#57]
+- Join Inner, (InvoiceNo#17 = InvoiceNo#50)
   :- Filter isnotnull(InvoiceNo#17)
   :  +- Relation [InvoiceNo#17,StockCode#18,Description#19,Quantity#20,InvoiceDate#21,UnitPrice#22,CustomerID#23,Country#24] csv
   +- Filter isnotnull(InvoiceNo#50)
      +- Relation [InvoiceNo#50,StockCode#51,Description#52,Quantity#53,InvoiceDate#54,UnitPrice#55,CustomerID#56,Country#57] csv

== Physical Plan ==
AdaptiveSparkPlan isFinalPlan=false
+- Project [InvoiceNo#17, StockCode#18, Description#19, Quantity#20, InvoiceDate#21, UnitPrice#22, CustomerID#23, Country#24, StockCode#51, Description#52, Quantity#53, InvoiceDate#54, UnitPrice#55, CustomerID#56, Country#57]
   +- SortMergeJoin [InvoiceNo#17], [InvoiceNo#50], Inner
      :- Sort [InvoiceNo#17 ASC NULLS FIRST], false, 0
      :  +- Exchange hashpartitioning(InvoiceNo#17, 200), ENSURE_REQUIREMENTS, [plan_id=65]
      :     +- Filter isnotnull(InvoiceNo#17)
      :        +- FileScan csv [InvoiceNo#17,StockCode#18,Description#19,Quantity#20,InvoiceDate#21,UnitPrice#22,CustomerID#23,Country#24] Batched: false, DataFilters: [isnotnull(InvoiceNo#17)], Format: CSV, Location: InMemoryFileIndex(1 paths)[file:/data/reta..., PartitionFilters: [], PushedFilters: [IsNotNull(InvoiceNo)], ReadSchema: struct<InvoiceNo:string,StockCode:string,Description:string,Quantity:string,InvoiceDate:string,Un...
      +- Sort [InvoiceNo#50 ASC NULLS FIRST], false, 0
         +- Exchange hashpartitioning(InvoiceNo#50, 200), ENSURE_REQUIREMENTS, [plan_id=66]
            +- Filter isnotnull(InvoiceNo#50)
               +- FileScan csv [InvoiceNo#50,StockCode#51,Description#52,Quantity#53,InvoiceDate#54,UnitPrice#55,CustomerID#56,Country#57] Batched: false, DataFilters: [isnotnull(InvoiceNo#50)], Format: CSV, Location: InMemoryFileIndex(1 paths)[file:/data/reta..., PartitionFilters: [], PushedFilters: [IsNotNull(InvoiceNo)], ReadSchema: struct<InvoiceNo:string,StockCode:string,Description:string,Quantity:string,InvoiceDate:string,Un...
```

![SortMegerJoin](/assets/images/posts/2024-07-20-Sort-Merge-Join-SMJ/01.png)

## SMJ의 장점과 단점

## 장점:

  * 대규모 데이터 처리: 매우 큰 데이터셋을 효율적으로 처리할 수 있습니다.
  * 정렬된 데이터: 조인 키를 기준으로 정렬된 데이터는 병합 단계에서 빠르게 처리할 수 있습니다.

## 단점:

  * 네트워크 셔플 비용: 셔플 단계에서 네트워크를 통한 데이터 전송 비용이 발생합니다.
  * 메모리 사용: 각 파티션 내에서 정렬이 이루어지므로 메모리 사용량이 증가할 수 있습니다.

## SMJ의 최적화

  * 셔플 파티션 수 조정: spark.sql.shuffle.partitions 설정을 통해 셔플 파티션 수를 조정하여 성능을 최적화할 수 있습니다.
  * 적응형 쿼리 실행 (AQE): 스파크 3.0 이상에서는 AQE를 활성화하여 쿼리 실행 중에 동적으로 파티션 크기를 조정할 수 있습니다.
  * 스파크 3.2.0 부터 Spark.sql.adaptive.advisoryPartitionSizeInBytes 및 모든 파티션 크기는 이 구성보다 크지 않습니다. 조인 선택은 Spark.sql.join.preferSortMergeJoin 값에 관계없이 정렬 병합 조인 대신 섞인 해시 조인을 사용하는 것을 선호합니다.

```text
spark.conf.set("spark.sql.shuffle.partitions", "100")
spark.conf.set("spark.sql.adaptive.enabled", true)
```

## Reference

* [https://spark.apache.org/docs/latest/sql-performance-tuning.html#converting-sort-merge-join-to-shuffled-hash-join](https://spark.apache.org/docs/latest/sql-performance-tuning.html#converting-sort-merge-join-to-shuffled-hash-join)
