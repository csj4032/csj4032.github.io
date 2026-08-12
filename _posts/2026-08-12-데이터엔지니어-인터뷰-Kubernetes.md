---
title: "데이터 엔지니어 인터뷰 — Kubernetes"
description: "파드와 컨트롤러, 리소스 requests/limits와 OOMKilled, 스토리지와 스테이트풀 워크로드, Spark on K8s와 Airflow 실행 환경을 데이터 엔지니어 관점에서 정리합니다."
categories:
 - Interview
tags:
 - kubernetes
 - k8s
 - devops
 - interview
---

## 기본 개념

### 파드(Pod)란 무엇인가요

배포의 최소 단위입니다. 컨테이너 하나 이상을 묶어 **네트워크 네임스페이스와 볼륨을 공유**하게 합니다. 같은 파드 안의 컨테이너는 `localhost`로 통신합니다.

파드는 일회용입니다. 죽으면 되살아나는 것이 아니라 **새 파드가 생깁니다.** IP도 바뀝니다. 그래서 파드 IP를 직접 참조하면 안 되고 Service를 거쳐야 합니다.

사이드카 패턴(로그 수집기, 프록시)이 파드 개념을 쓰는 대표적인 예입니다.

### Deployment, StatefulSet, DaemonSet, Job의 차이는 무엇인가요

| 컨트롤러 | 용도 | 특징 |
| --- | --- | --- |
| Deployment | 무상태 앱 | 파드가 동등하게 취급됨, 롤링 업데이트 |
| StatefulSet | 상태를 가진 앱 | 안정적인 이름(`app-0`, `app-1`)과 전용 볼륨, 순서 보장 |
| DaemonSet | 노드마다 하나 | 로그 수집, 모니터링 에이전트 |
| Job / CronJob | 완료되면 끝나는 작업 | 배치 잡, 스케줄 실행 |

데이터 쪽에서는 Kafka·Zookeeper·데이터베이스가 StatefulSet, 배치 파이프라인이 Job 형태로 돕니다.

### Service와 Ingress는 어떻게 다른가요

**Service**는 파드 집합에 안정적인 접근점을 제공합니다. 타입에 따라 클러스터 내부(ClusterIP), 노드 포트(NodePort), 클라우드 로드밸런서(LoadBalancer)로 노출됩니다.

**Ingress**는 L7(HTTP) 라우팅입니다. 호스트·경로 기준으로 여러 Service에 분배하고 TLS를 종료합니다. Ingress Controller가 실제로 이 규칙을 구현합니다.

### ConfigMap과 Secret의 차이는 무엇인가요

둘 다 설정을 파드에 주입하는 리소스이고, 사용법도 거의 같습니다(환경변수 또는 볼륨 마운트).

Secret은 base64로 인코딩되어 저장되는데, **이건 암호화가 아닙니다.** 실제 보안을 위해서는 etcd 저장 시 암호화를 켜고, RBAC로 접근을 제한하고, 외부 시크릿 관리자(Vault, AWS Secrets Manager, External Secrets Operator)를 쓰는 것이 일반적입니다.

## 리소스 관리

### requests와 limits의 차이를 설명해보세요

**requests**는 스케줄러가 노드를 고를 때 쓰는 값입니다. "이만큼은 보장받아야 한다"는 뜻이고, 노드의 남은 용량 계산에 들어갑니다.

**limits**는 런타임 상한입니다. 이 이상 쓰면 제재를 받습니다.

제재 방식이 CPU와 메모리에서 다릅니다.

- **CPU 초과** — throttling. 느려질 뿐 죽지 않습니다
- **메모리 초과** — **OOMKilled**. 즉시 종료됩니다

메모리는 압축 불가능한(incompressible) 자원이라 회수할 방법이 없기 때문입니다.

### QoS 클래스는 무엇인가요

노드에 자원이 부족할 때 어떤 파드를 먼저 쫓아낼지 정하는 등급입니다.

| 클래스 | 조건 | 축출 우선순위 |
| --- | --- | --- |
| Guaranteed | 모든 컨테이너에 requests == limits | 가장 나중 |
| Burstable | requests < limits | 중간 |
| BestEffort | 아무것도 지정 안 함 | 가장 먼저 |

중요한 배치 잡이라면 Guaranteed로 두는 편이 안전합니다.

### 파드가 OOMKilled 되었습니다. 어떻게 접근하나요

```bash
kubectl describe pod <pod>          # Last State: Terminated, Reason: OOMKilled
kubectl get pod <pod> -o jsonpath='{.status.containerStatuses[0].lastState}'
```

JVM 애플리케이션에서 특히 자주 겪습니다. 컨테이너 메모리 limit과 **JVM 힙 설정이 따로 놀기 때문**입니다. 힙 외에 메타스페이스, 스레드 스택, 네이티브 버퍼가 추가로 필요한데 힙을 limit과 같게 잡으면 반드시 넘칩니다.

```
컨테이너 limit = JVM 힙 + 메타스페이스 + 스택 + 네이티브 + 여유
```

`-XX:MaxRAMPercentage`로 힙을 컨테이너 limit의 비율(예: 75%)로 잡는 방식이 안전합니다.

PySpark처럼 파이썬 프로세스가 따로 뜨는 경우도 마찬가지입니다. JVM 힙 밖에서 메모리를 쓰므로 오버헤드를 별도로 잡아야 합니다.

### 파드가 Pending 상태입니다. 원인은 무엇일까요

스케줄링이 안 된 상태입니다. `kubectl describe pod`의 Events를 보면 이유가 나옵니다.

- **Insufficient cpu/memory** — 요청량을 만족하는 노드가 없음. requests를 줄이거나 노드를 늘림
- **node(s) had taint** — toleration이 없어 배치 불가
- **PVC 바인딩 대기** — 볼륨이 준비 안 됨
- **node affinity 불일치** — 조건에 맞는 노드 없음

## 스토리지와 스케줄링

### PV, PVC, StorageClass의 관계를 설명해보세요

**PV(PersistentVolume)**는 실제 스토리지 자원, **PVC(PersistentVolumeClaim)**는 그에 대한 요청, **StorageClass**는 동적 프로비저닝 방식의 정의입니다.

파드는 PVC를 참조하고, StorageClass가 있으면 PVC 생성 시 PV가 자동으로 만들어집니다.

접근 모드가 중요합니다. `ReadWriteOnce`는 노드 하나에서만 마운트 가능해서, 여러 파드가 공유해야 하면 `ReadWriteMany`를 지원하는 스토리지(NFS, EFS)가 필요합니다. EBS 같은 블록 스토리지는 RWO만 됩니다.

### taint와 toleration, nodeSelector, affinity를 구분해보세요

- **taint / toleration** — 노드가 "나한테 아무거나 오지 마"라고 표시하고, 파드가 toleration으로 예외를 얻습니다. GPU 노드나 전용 노드 격리에 씁니다
- **nodeSelector / nodeAffinity** — 파드가 "이런 노드로 가고 싶다"고 요청합니다
- **podAffinity / podAntiAffinity** — 다른 파드와 같이/따로 배치합니다. 복제본을 서로 다른 노드에 흩뜨릴 때 antiAffinity를 씁니다

taint는 **노드가 미는 것**, affinity는 **파드가 당기는 것**으로 기억하면 구분이 쉽습니다.

### HPA와 Cluster Autoscaler는 무엇이 다른가요

**HPA(Horizontal Pod Autoscaler)**는 지표(CPU, 메모리, 커스텀)에 따라 **파드 수**를 조절합니다.

**Cluster Autoscaler**는 스케줄되지 못한 파드가 있으면 **노드 수**를 늘립니다.

둘은 함께 동작합니다. HPA가 파드를 늘렸는데 자리가 없으면 Pending이 되고, 그걸 보고 Cluster Autoscaler가 노드를 추가합니다.

Karpenter는 Cluster Autoscaler보다 유연하게(인스턴스 타입을 파드 요구에 맞춰 즉석에서 선택) 노드를 프로비저닝합니다.

## 데이터 워크로드

### Spark on Kubernetes는 어떻게 동작하나요

`spark-submit`이 Driver 파드를 만들고, Driver가 Kubernetes API를 통해 Executor 파드를 직접 생성합니다. YARN 대신 K8s가 자원 관리를 맡습니다.

```bash
spark-submit \
  --master k8s://https://<api-server> \
  --deploy-mode cluster \
  --conf spark.kubernetes.container.image=<image> \
  --conf spark.executor.instances=10 \
  ...
```

YARN 대비 장점은 컨테이너 이미지로 의존성을 고정할 수 있다는 점, 다른 워크로드와 클러스터를 공유할 수 있다는 점입니다.

주의할 점도 있습니다.

- **셔플 데이터**가 Executor 파드의 로컬 디스크에 쌓입니다. 파드가 죽으면 재계산이 필요합니다. 동적 할당을 쓰려면 외부 셔플 서비스나 셔플 데이터 보존 설정이 필요합니다
- `spark.executor.memory`와 `memoryOverhead`의 합이 파드 메모리 limit이 되므로, 이걸 넘기면 OOMKilled입니다
- 노드 로컬 디스크(`emptyDir`) 용량이 부족하면 셔플 중 실패합니다

### Airflow를 K8s에서 운영할 때 무엇을 고려하나요

**KubernetesExecutor**는 태스크마다 파드를 띄웁니다. 태스크별로 다른 이미지·리소스를 쓸 수 있고 격리가 좋지만, 파드 시작 지연(수 초~수십 초)이 붙습니다. 짧은 태스크가 많으면 오버헤드가 큽니다.

**CeleryExecutor**는 워커를 미리 띄워두고 큐로 분배합니다. 시작이 빠르지만 워커 환경이 고정됩니다.

`KubernetesPodOperator`는 실행자와 무관하게 특정 태스크만 파드로 띄우는 방식입니다. 무거운 의존성을 가진 작업을 격리할 때 유용합니다.

**DAG 파일 배포 방식**도 정해야 합니다 — 이미지에 굽거나(재배포 필요), git-sync 사이드카를 쓰거나, 공유 볼륨을 마운트하거나.

### 배치 잡에 CronJob을 쓸 때 주의할 점은 무엇인가요

- **동시 실행 정책** — `concurrencyPolicy: Forbid`로 두지 않으면 이전 실행이 안 끝났는데 다음이 시작됩니다
- **`startingDeadlineSeconds`** — 컨트롤러가 잠시 멈춰 실행 시점을 놓쳤을 때 얼마나 늦게까지 실행할지
- **히스토리 제한** — `successfulJobsHistoryLimit`을 안 두면 완료된 Job 오브젝트가 계속 쌓입니다
- **재시도** — `backoffLimit`을 넘으면 실패로 확정됩니다. 멱등하지 않은 작업이면 재시도가 오히려 위험합니다

복잡한 의존 관계가 있는 파이프라인은 CronJob보다 Airflow 같은 오케스트레이터가 맞습니다.

### 문제가 생겼을 때 어떤 순서로 확인하나요

```bash
kubectl get pods                       # 상태 확인 (Pending / CrashLoopBackOff / OOMKilled)
kubectl describe pod <pod>             # Events — 스케줄링·이미지·볼륨 문제
kubectl logs <pod>                     # 현재 컨테이너 로그
kubectl logs <pod> --previous          # 재시작 전 로그 (크래시 원인)
kubectl get events --sort-by=.lastTimestamp
kubectl top pod                        # 실제 사용량
```

`CrashLoopBackOff`는 원인이 아니라 결과입니다. `--previous` 로그를 봐야 실제 이유가 나옵니다.
