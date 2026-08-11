---
title: "Tungsten UnsafeRow Format"
description: "Tungsten UnsafeRow 포맷은 아파치 스파크(Apache Spark)의 고성능 실행 엔진인 텅스텐(Tungsten)에서 사용하는 핵심적인 메모리 내 데이터 표현 방식이다. 이는 자바 객체 대신 원시 메모리"
categories:
 - data-engineering
 - spark
source: "https://blog.naver.com/csj4032/223923130905"
---

Tungsten UnsafeRow 포맷은 **아파치 스파크(Apache Spark)의 고성능 실행 엔진인 텅스텐(Tungsten)에서 사용하는 핵심적인 메모리 내 데이터 표현 방식**이다. 이는 자바 객체 대신 원시 메모리(off-heap/on-heap)에 직접 데이터를 바이너리 형태로 저장하여, JVM 객체 모델의 오버헤드와 가비지 컬렉션(GC)의 부담을 회피한다.

UnsafeRow는 데이터를 **하나의 연속된 메모리 블록**에 C의 struct처럼 배치합니다. 이 메모리 블록은 각 필드의 null 여부를 추적하는 비트마스크, 정수(Integer)나 더블(Double)과 같은 고정 크기 데이터 영역, 그리고 문자열(String)이나 배열(Array) 같은 가변 크기 데이터 영역으로 구성됩니다. 이러한 구조는 데이터를 역직렬화할 필요 없이 직접 접근하고 조작할 수 있게 해준다.

Project Tungsten은 2015년 4월에 공식적으로 시작된 프로젝트로, Spark 실행 엔진 역사상 가장 큰 변화를 목표로 했습니다. 이 프로젝트는 2014년 Spark가 대규모 정렬에서 세계 기록을 세우고 Python부터 SQL, 머신러닝까지 전체 엔진에서 주요 개선을 달성한 이후, 성능 최적화의 다음 단계로 기획되었다.

개발 동기는 Spark 워크로드 분석에서 나왔습니다. 기존에 예상했던 I/O와 네트워크 통신 병목현상과 달리, 실제로는 CPU와 메모리 사용에서 점점 더 성능 제약을 받고 있다는 것을 발견했습니다. 특히 사용자 애플리케이션을 프로파일링한 결과, CPU 시간의 상당 부분이 메인 메모리에서 데이터를 가져오기 위해 대기하는 시간으로 소모되고 있음이 밝혀졌습니다. 이러한 분석을 바탕으로 Tungsten은 메모리와 CPU 효율성을 근본적으로 개선하여 Spark 성능을 현대 하드웨어의 한계에 가깝게 끌어올리는 것을 목표로 설계되었다.

## 핵심 기능과 구성요소

## 1. 메모리 관리 및 바이너리 처리

애플리케이션 시맨틱을 활용하여 메모리를 명시적으로 관리하고 JVM 객체 모델과 가비지 컬렉션의 오버헤드를 제거한다.

Tungsten은 sun.misc.Unsafe API를 사용하여 off-heap 메모리를 직접 조작하며, 이는 JVM의 가비지 컬렉션 프로세스의 오버헤드를 피한다.

## 2. UnsafeRow Format

UnsafeRow는 Apache Spark V1.4부터 Tungsten에서 사용되는 핵심 구성요소로, Java 객체 대신 raw memory로 백업되는 mutable internal raw-memory 바이너리 행 형식입니다. UnsafeRow 객체는 3개 영역으로 구성되며, 모든 영역과 필드는 8바이트로 정렬되어 64비트 CPU 레지스터에 완벽하게 맞다.

## 3. 캐시 인식 컴퓨팅

L1/L2/L3 CPU 캐시를 더 효과적으로 사용하여 데이터 처리 속도를 향상시킵니다. 메인 메모리보다 수십 배 빠른 캐시의 활용도를 극대한다.메모리 계층에서 캐시 지역성을 최대화하도록 설계된 알고리즘과 데이터 구조를 사용한다.

## 4. 코드 생성 (Whole-Stage Code Generation)

코드 생성을 사용하여 현대 컴파일러와 CPU를 활용하며, 가상 함수 디스패치를 제거하여 수십억 번 호출할 때 성능에 심대한 영향을 미치는 다중 CPU 호출을 줄인다.

Tungsten은 쿼리나 스테이지를 단일 JVM 바이트코드 함수로 컴파일하여 CPU 효율성을 높이고 전체 성능을 향상시킨다.

## 주요 장점

Tungsten UnsafeRow는 메모리 사용량을 약 75% 감소시키며(RDD 대비 DataFrame에서 3.8MB → 998.4KB), 특정 워크로드에서 최대 10배의 성능 향상을 제공합니다. off-heap 메모리 사용과 바이너리 형식으로 가비지 컬렉션 오버헤드를 대폭 줄이고, 직접 메모리 접근을 통해 데이터 전송 속도를 크게 향상시킵니다. 8바이트 정렬된 메모리 레이아웃으로 CPU 캐시 효율성을 극대화하고, CPU 레지스터를 활용한 데이터 처리로 메모리 접근 사이클을 대폭 감소시킵니다. 가상 함수 디스패치를 제거하고 whole-stage 코드 생성을 통해 CPU 효율성을 크게 개선한다.

## 주요 단점

sun.misc.Unsafe API 사용으로 인해 JVM 구현체나 버전에 따른 호환성 이슈가 발생할 수 있으며, 플랫폼 의존성이 높다. 바이너리 형태로 데이터가 저장되어 디버깅 시 데이터 내용을 직접 확인하기 어렵고, 문제 진단의 복잡성이 증가한다. off-heap 메모리 사용 시 컨테이너에서 충분한 공간 확보가 필요하며, 명시적 메모리 관리로 인한 설정 및 튜닝이 복잡해집니다. 복잡한 사용자 정의 타입에 대한 지원이 제한적이며, 저수준 최적화 기술에 대한 깊은 이해가 필요하여 학습 곡선이 높다.

```java
public class MixxUnsafeRow {

    private final byte[] buffer;

    public MixxUnsafeRow(int totalSize) {
        this.buffer = new byte[totalSize];
    }

    // int 필드 쓰기 (4 bytes)
    public void setInt(int offset, int value) {
        buffer[offset]     = (byte) (value >>> 24);
        buffer[offset + 1] = (byte) (value >>> 16);
        buffer[offset + 2] = (byte) (value >>> 8);
        buffer[offset + 3] = (byte) (value);
    }

    // int 필드 읽기
    public int getInt(int offset) {
        return ((buffer[offset] & 0xFF) << 24) |
               ((buffer[offset + 1] & 0xFF) << 16) |
               ((buffer[offset + 2] & 0xFF) << 8) |
               (buffer[offset + 3] & 0xFF);
    }

    // double 필드 쓰기 (8 bytes)
    public void setDouble(int offset, double value) {
        long bits = Double.doubleToLongBits(value);
        for (int i = 0; i < 8; i++) {
            buffer[offset + i] = (byte) (bits >>> (56 - i * 8));
        }
    }

    // double 필드 읽기
    public double getDouble(int offset) {
        long bits = 0;
        for (int i = 0; i < 8; i++) {
            bits |= ((long)(buffer[offset + i] & 0xFF)) << (56 - i * 8);
        }
        return Double.longBitsToDouble(bits);
    }

    // String 필드 쓰기 (offset에 저장된 길이 다음에 데이터)
    public void setString(int offset, String value) {
        byte[] strBytes = value.getBytes(StandardCharsets.UTF_8);
        setInt(offset, strBytes.length); // 길이 저장 (4 bytes)
        System.arraycopy(strBytes, 0, buffer, offset + 4, strBytes.length);
    }

    // String 필드 읽기
    public String getString(int offset) {
        int len = getInt(offset);
        return new String(buffer, offset + 4, len, StandardCharsets.UTF_8);
    }

    public static void main(String[] args) {
        MixxUnsafeRow row = new MixxUnsafeRow(64);

        row.setInt(0, 123);
        row.setDouble(4, 3.14);
        row.setString(12, "Apache Spark");

        System.out.println("Int 값: " + row.getInt(0));
        System.out.println("Double 값: " + row.getDouble(4));
        System.out.println("String 값: " + row.getString(12));

        System.out.println("Buffer 상태: " + Arrays.toString(row.buffer));
    }
}
```

이 코드는 Apache Spark의 UnsafeRow 메모리 레이아웃을 단순화하여 구현한 예제입니다. **MixxUnsafeRow** 클래스는 바이트 배열을 사용하여 다양한 데이터 타입(int, double, String)을 연속된 메모리 공간에 직접 저장하고 읽어오는 기능을 제공한다.

정수는 4바이트, 실수는 8바이트로 빅엔디안 방식으로 직렬화되며, 문자열은 UTF-8 인코딩 후 길이 정보(4바이트)와 함께 저장됩니다. 이러한 바이너리 형식은 Java 객체의 오버헤드를 제거하고 메모리 효율성을 높이는 Tungsten의 핵심 원리를 보여줍니다. main 메서드에서는 실제 데이터를 저장하고 조회하는 과정을 통해 UnsafeRow가 어떻게 raw memory에서 데이터를 직접 조작하는지 실습할 수 있도록 구성되어 있다.

![](/assets/images/posts/2025-07-05-Tungsten-UnsafeRow-Format/01.png)

이 다이어그램은 Apache Spark Tungsten 프로젝트의 UnsafeRow 메모리 레이아웃을 보여주는 구조도입니다. UnsafeRow는 세 개의 주요 영역으로 구성됩니다: **Null Bit Set** (보라색), **Fixed Length Values** (초록색), **Variable Length/Values** (주황색) 영역이다.

상단의 개념도에서 Null Bit Set은 각 필드의 null 여부를 1비트씩 추적하며 8바이트(64비트)로 구성되고, Fixed Length Values는 각 필드당 8바이트를 할당하여 고정 길이 데이터는 실제 값을, 가변 길이 데이터는 오프셋 정보를 저장합니다. Variable Length/Values 영역은 문자열과 같은 가변 길이 데이터의 실제 내용과 길이 정보를 저장한다.

하단의 구체적인 예제 UnsafeRow("mixx", 80, "kor", null)에서는 0x08이 4번째 필드(null)의 비트가 설정되었음을 나타내고, 24L과 40L은 각각 "mixx"와 "kor" 문자열의 오프셋 위치를 가리킵니다. 숫자 80은 정수 값으로 직접 저장되며, 4와 3은 각 문자열의 길이를 나타낸다. 이러한 Word-aligned 메모리 레이아웃은 CPU 캐시 효율성을 극대화하고 메모리 사용량을 최적화하여 Spark의 성능을 크게 향상시킨다.

Project Tungsten의 목표는 항상 Spark 애플리케이션이 bare metal이 제공하는 속도로 실행될 수 있도록 하는 것이었다. Project Tungsten: Bringing Apache Spark Closer to Bare Metal UnsafeRow를 포함한 Tungsten의 혁신은 Spark을 빅데이터 처리를 위한 강력하고 효율적인 도구로 계속 유지하는 핵심 요소가 되었다. 메모리 효율성과 성능 향상의 이점이 복잡성과 제약사항을 상쇄하며, 현대 빅데이터 처리에서 필수적인 기술로 자리잡았다.

---

## 참고문서

1. [Databricks. (2015, April 28). "Project Tungsten: Bringing Apache Spark Closer to Bare Metal." Databricks Blog.](https://www.databricks.com/blog/2015/04/28/project-tungsten-bringing-spark-closer-to-bare-metal.html)
2. [Apache Spark Foundation. "History | Apache Spark." Apache Spark Documentation.](https://spark.apache.org/history.html)
3. [Apache Spark Foundation. "Spark Release 1.4.0." Apache Spark.](https://spark.apache.org/releases/spark-release-1-4-0.html)
4. [Apache Spark Foundation. "Spark Release 1.5.0." Apache Spark.](https://spark.apache.org/releases/spark-release-1-5-0.html)
5. [Databricks. "What is the Spark Tungsten Project?" Databricks Glossary.](https://www.databricks.com/glossary/tungsten)
6. [Laskowski, Jacek. "Tungsten Execution Backend (Project Tungsten)." The Internals of Spark SQL.](https://jaceklaskowski.gitbooks.io/mastering-spark-sql/spark-sql-tungsten.html)
7. [Laskowski, Jacek. "UnsafeRow — Mutable Raw-Memory Unsafe Binary Row Format." The Internals of Spark SQL.](https://jaceklaskowski.gitbooks.io/mastering-spark-sql/content/spark-sql-UnsafeRow.html)
8. ["Understanding the UnsafeRow object." Mastering Apache Spark 2.x - Second Edition. O'Reilly Media.](https://www.oreilly.com/library/view/mastering-apache-spark/9781786462749/)
9. [Cloudera Community. (2019, August 17). "What is Tungsten for Apache Spark?"](https://community.cloudera.com/t5/Community-Articles/What-is-Tungsten-for-Apache-Spark/ta-p/248445)
10. [Sobrado, Daniel. "Apache Spark: Introduction to project Tungsten."](https://www.danielsobrado.com/blog/spark-introduction-tungsten/)
11. [Waitingforcode.com. "Spark Project Tungsten."](https://www.waitingforcode.com/apache-spark-sql/spark-project-tungsten/read)
12. [Nath, Joydip. (2022, July 25). "The Project Tungsten." Medium.](https://joydipnath.medium.com/the-project-tungsten-e5accd8a7946)
13. [Mane, Sukumaar. (2023, May 12). "The Advantages of Apache Spark's Tungsten Project for Spark SQL." Medium.](https://medium.com/@sukumaar/the-advantages-of-apache-sparks-tungsten-project-for-spark-sql-d9719f0db0bb)
14. [Rajak, Deepak. (2021, February 9). "Catalyst and Tungsten: Apache Spark's Speeding Engine." LinkedIn.](https://www.linkedin.com/pulse/catalyst-tungsten-apache-sparks-speeding-engine-deepak-rajak)
15. [MFG Shop. (2024, December 8). "Understanding Tungsten in Apache Spark."](https://shop.machinemfg.com/understanding-tungsten-in-apache-spark/)
16. [StatusNeo. (2025, March 7). "Tungsten and Apache Spark: A Game-Changer for Big Data Performance."](https://statusneo.com/how-tungsten-improves-apache-spark/)
17. [SparkCodeHub. "Spark Tungsten Optimization: Maximize Speed with Low-Level Efficiency."](https://www.sparkcodehub.com/spark-tungsten-optimization)
18. [IOMETE. "Tungsten Project for Apache Spark."](https://iomete.com/resources/glossary/tungsten)
19. [Stack Overflow. "What is the role of Catalyst optimizer and Project Tungsten."](https://stackoverflow.com/questions/67188954/what-is-the-role-of-catalyst-optimizer-and-project-tungsten)
20. [Deep Dive into Project Tungsten: Bringing Spark Closer to Bare Metal](https://docs.huihoo.com/apache/spark/summit/2015/Deep-Dive-into-Project-Tungsten-Bringing-Spark-Closer-to-Bare-Metal.pdf)
21. [Deep Dive into Project Tungsten Bringing Spark Closer to Bare Metal Youtube](https://www.youtube.com/watch?v=5ajs8EIPWGI)
22. [Optimizing Batch and Streaming Aggregations Youtube](https://www.youtube.com/watch?v=BVsKJ6xQxsQ)
23. [A Developer's View into Spark's Memory Model Youtube](https://www.youtube.com/watch?v=-Aq1LMpzaKw)
