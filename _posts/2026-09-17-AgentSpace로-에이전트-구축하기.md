---
title: "25장 — AgentSpace로 에이전트 구축하기"
chapter: 25
description: "구글 AgentSpace로 코드 없이 에이전트를 만드는 과정을 따라갑니다. 조직 전반의 통합 검색, 사람·문서·데이터를 잇는 기업용 지식 그래프, 노코드 Agent Designer, A2A 기반 멀티 에이전트와 보안 기능을 정리하고, 구글 클라우드 콘솔의 앱 선택부터 Gmail·Jira·ServiceNow 연동, 프롬프트 갤러리와 직접 작성, 고급 설정, 채팅 인터페이스까지 여섯 화면을 짚어 봅니다."
categories:
 - book
 - agentic-design-patterns
tags:
 - agentic
 - agentspace
 - no-code
 - knowledge-graph
 - enterprise
---

[24장](/book/agentic-design-patterns/2026/09/16/%EC%97%90%EC%9D%B4%EC%A0%84%ED%8B%B1-%ED%94%84%EB%A0%88%EC%9E%84%EC%9B%8C%ED%81%AC-%EA%B0%84%EB%8B%A8%ED%9E%88-%EC%82%B4%ED%8E%B4%EB%B3%B4%EA%B8%B0/)에서 프레임워크를 추상화 수준으로 줄 세웠다면, 이 장은 그 줄의 **가장 오른쪽 끝**입니다. LangChain은 체인을, LangGraph는 노드와 엣지를, ADK와 CrewAI는 에이전트와 역할을 코드로 정의했습니다. AgentSpace에서는 **코드를 한 줄도 쓰지 않습니다.** 콘솔 화면에서 데이터 소스를 연결하고, 프롬프트를 고르고, 스위치를 켜면 에이전트가 만들어집니다.

책에서 가장 짧은 장(6쪽)이고 대부분이 화면 캡처라서, 이 글도 **개념 → 화면 흐름** 순으로 간단히 정리합니다.

## 개요

AgentSpace는 인공지능을 일상 워크플로에 녹여 넣어 **'에이전트가 주도하는 기업(agent-driven enterprise)'** 을 원활히 실현하도록 설계된 플랫폼입니다. 핵심은 문서, 이메일, 데이터베이스를 비롯해 **조직의 디지털 공간 전반을 아우르는 통합 검색** 기능입니다. 이 시스템은 구글의 제미나이 같은 고급 AI 모델을 활용해 다양한 출처의 정보를 이해하고 종합합니다.

이 플랫폼에서는 복잡한 작업을 수행하고 프로세스를 자동화할 수 있는 특화된 AI 에이전트를 만들고 배포할 수 있습니다. 이런 에이전트는 **단순한 챗봇이 아닙니다.** 스스로 추론하고 계획을 세우며 다단계 동작을 자율적으로 실행할 수 있습니다. 예를 들어 특정 주제를 조사하고, 인용을 포함한 보고서를 작성하고, 오디오 요약까지 만들 수 있습니다.

AgentSpace를 이루는 요소를 정리하면 이렇습니다.

| 구성 요소 | 역할 | 연결되는 장 |
| --- | --- | --- |
| **통합 검색** | 문서·이메일·데이터베이스 등 조직의 디지털 공간 전반을 한 번에 검색하고, 제미나이로 여러 출처의 정보를 종합 | [14장](/book/agentic-design-patterns/2026/09/06/%EC%A7%80%EC%8B%9D-%EA%B2%80%EC%83%89/) 지식 검색 |
| **기업용 지식 그래프** | **사람, 문서, 데이터 사이의 관계**를 매핑해 AI가 맥락을 이해하고 더 적합하고 개인화된 결과를 내게 함 | [22장](/book/agentic-design-patterns/2026/09/14/%EA%B3%A0%EA%B8%89-%ED%94%84%EB%A1%AC%ED%94%84%ED%8C%85-%EA%B8%B0%EB%B2%95/) 컨텍스트 엔지니어링 |
| **Agent Designer** | **노코드 인터페이스**. 깊이 있는 기술 전문성이 없어도 직접 정의한 에이전트를 만들 수 있음 | — |
| **멀티 에이전트 지원** | 서로 다른 AI 에이전트가 **A2A라는 개방형 프로토콜**로 소통하고 협업해, 더 복잡하고 조율된 워크플로를 구성 | [15장](/book/agentic-design-patterns/2026/09/07/%EC%97%90%EC%9D%B4%EC%A0%84%ED%8A%B8-%EA%B0%84-%ED%86%B5%EC%8B%A0/) 에이전트 간 통신 |
| **보안** | **역할 기반 접근 제어**와 **데이터 암호화** 같은 기능으로 민감한 기업 정보를 보호 | [18장](/book/agentic-design-patterns/2026/09/10/%EA%B0%80%EB%93%9C%EB%A0%88%EC%9D%BC-%EC%95%88%EC%A0%84-%ED%8C%A8%ED%84%B4/) 가드레일/안전 패턴 |

지식 그래프가 눈여겨볼 부분입니다. "지난주 회의록 찾아 줘"라는 요청은 단순 검색으로는 모호하지만, **누가 요청했는지, 그 사람이 어느 팀이고 어떤 회의에 참석했는지**를 알면 정확히 좁힐 수 있습니다. 22장에서 말한 **암묵적 데이터**(사용자 신원, 관계, 이력)를 플랫폼이 미리 구조화해 두는 셈입니다.

> 결국 AgentSpace의 목표는 **지능형·자율 시스템을 조직의 운영 체계에 직접 접목해 생산성과 의사결정 능력을 높이는 데** 있다.

## AgentSpace UI로 에이전트를 구축하는 방법

책은 여섯 개의 화면으로 에이전트 하나를 만드는 과정을 보여 줍니다.

```
 ① 앱 유형 선택 ─▶ ② 서비스 연동 ─▶ ③ 프롬프트 선택 ─▶ ④ 프롬프트 직접 작성 ─▶ ⑤ 고급 설정 ─▶ ⑥ 채팅
   (콘솔)          (Gmail·Jira 등)   (갤러리)            (선택 사항)            (지식 그래프 등)   (사용)
```

### ① 앱 유형 선택 (그림 25.1)

구글 클라우드 콘솔에서 **AI Applications**를 선택해 AgentSpace에 접근합니다. "Which app type do you want to build?" 화면에서 **Search and assistant** 범주의 두 가지 앱 중 하나를 고릅니다.

| 앱 유형 | 화면 설명 |
| --- | --- |
| **Agentspace** (Preview) | 기업 규정을 준수하는 검색 및 어시스턴트 도구. 제미나이로 구동되며, 직원이 방대한 회사 데이터에서 답을 쉽게 찾고, 콘텐츠 생성을 자동화하고, 연결된 앱으로 작업을 실행하는 일을 **하나의 인터페이스**에서 할 수 있게 함 |
| **Custom search (general)** | 사이트, 콘텐츠, 카탈로그, 혼합 데이터에 맞춤형 검색·개인화·생성형 경험을 구축. 데이터 소스: 정형 카탈로그(예: 호텔, 디렉터리), 비정형(예: 메타데이터가 있는 문서), 커넥터(예: Google Workspace), 공개 사이트 |

에이전트를 만들려면 왼쪽의 **Agentspace**를 고릅니다.

### ② 서비스 연동 (그림 25.2)

에이전트는 캘린더, 구글 메일, 워크데이, 지라, 아웃룩, 서비스나우 등 다양한 서비스와 연결할 수 있습니다. "Add an action" 화면은 **Source → Configuration** 두 단계로 이루어져 있고, 첫 단계에서 "Connect a service for your action"을 고릅니다.

| 구분 | 서비스 |
| --- | --- |
| **Google sources** | Calendar, Google Gmail |
| **Third-party sources** | Jira, Workday, Outlook, ServiceNow |

여기서 연결하는 것은 **에이전트가 실행할 수 있는 행동(action)** 입니다. [5장](/book/agentic-design-patterns/2026/08/28/%EB%8F%84%EA%B5%AC-%EC%82%AC%EC%9A%A9/)의 도구 사용에서 함수 정의와 API 키 설정을 코드로 하던 일을, 여기서는 **Connect 버튼 하나**로 합니다. 지라 티켓을 만들거나 캘린더에 일정을 잡는 도구가 이렇게 에이전트에게 주어집니다.

### ③ 프롬프트 갤러리에서 선택 (그림 25.3)

그런 다음 에이전트는 구글이 미리 만들어 둔 **프롬프트 갤러리**에서 하나를 골라 사용할 수 있습니다. 갤러리에는 `All`, `Google-made`, `Our prompts` 탭이 있고, 구글이 만든 프롬프트로는 다음과 같은 것이 보입니다.

| 이름 | 표시 이름 | 상태 |
| --- | --- | --- |
| `goog_analyze_data` | Analyze Data | Enabled |
| `goog_book_time_off` | Book Time Off | Enabled |
| `goog_chat_with_content` | Chat with Content | Enabled |
| `goog_chat_with_documents` | Chat with Documents | Enabled |
| `goog_create_jira_ticket` | Create Jira Ticket | Enabled |
| `goog_deep_research` | Deep Research | Enabled |
| `goog_draft_an_email` | Draft Email | Disabled |
| `goog_draft_email` | Draft Email | Enabled |
| `goog_explain_technical_documentation` | Explain Technical Documentation | Enabled |
| `goog_find_information` | Find Information | Enabled |
| `goog_generate_code` | Generate Code | Enabled |
| `goog_generate_image` | Generate Image | Enabled |
| `goog_generate_marketing_copy` | Generate Marketing Copy | Enabled |

목록을 보면 성격이 두 가지로 나뉩니다. `Book Time Off`, `Create Jira Ticket`처럼 **②에서 연결한 서비스로 행동하는** 프롬프트와, `Analyze Data`, `Explain Technical Documentation`처럼 **①의 통합 검색 위에서 이해하고 생성하는** 프롬프트입니다. 각 항목에 `Enabled`/`Disabled` 스위치가 있어, 조직에서 쓸 프롬프트만 골라 켤 수 있습니다.

### ④ 프롬프트 직접 작성 (그림 25.4)

또는 프롬프트를 직접 만들 수 있고, 이렇게 만든 프롬프트는 에이전트가 사용합니다. "Create prompt" 화면의 필드는 다음과 같습니다(책의 예시 값 포함).

```
Name *              write
Display name *      writing assistant
Title *             My personal writing assistant
Description *       Help me to write concise sentences
Prompt type         User query
User query *        You are a writing assistant who helps me to write concise sentences
Activation behavior New session
Icon                (아이콘 선택)
[●] Enabled
```

`User query` 칸이 실제 프롬프트이고, 나머지는 **이 프롬프트를 어떻게 부르고 보여 줄지**에 대한 메타데이터입니다. 22장 관점에서 보면 `User query`의 "You are a writing assistant…"는 **역할 프롬프팅**이고, `Description`은 사용자가 갤러리에서 이 프롬프트를 고를 때 보는 설명입니다. 22장의 구글 Gems가 개인용 사전 정의 지시였다면, 이 화면은 그것을 **조직 단위로 배포하는 버전**에 가깝습니다.

### ⑤ 고급 설정 (그림 25.5)

AgentSpace는 다양한 고급 기능을 갖추고 있습니다. 자체 데이터를 저장할 수 있는 데이터 저장소 연동, 구글 지식 그래프나 자체 지식 그래프 연동, 에이전트를 웹에 공개하는 웹 인터페이스, 사용량을 모니터링하는 애널리틱스 등입니다.

왼쪽 메뉴와 **Configurations → Knowledge Graph** 탭의 설정은 이렇습니다.

| 왼쪽 메뉴 | 내용 |
| --- | --- |
| Connected data stores | 연결된 데이터 저장소 |
| Actions | ②에서 연결한 행동 |
| Prompt gallery | ③·④의 프롬프트 |
| Preview | 미리 보기 |
| **Configurations** | Autocomplete, Search UI, Control, Assistant, **Knowledge Graph**, Feature Management 탭 |
| Integration | 웹 인터페이스 등 외부 공개 |
| Analytics | 사용량 모니터링 |

Knowledge Graph 탭에는 두 개의 스위치가 있습니다.

- **Enable Google Cloud Knowledge Graph**: 외부 데이터 소스를 통합해 검색 결과를 확장하고, 추가 인사이트로 검색 결과의 관련성을 높인다.
- **Enable Private Knowledge Graph**: **조직 내부 데이터**를 활용해 더 풍부한 검색 결과와 더 맥락에 맞는 정확한 질의 주석을 제공한다. 화면에는 "이 기능을 켠 뒤 데이터를 다시 생성하는 데 **최대 24시간**이 걸릴 수 있다"는 안내가 붙어 있다.

개요에서 말한 "사람, 문서, 데이터 사이의 관계를 매핑하는 기업용 지식 그래프"가 바로 두 번째 스위치입니다. 켜자마자 반영되지 않고 **하루 가까이 걸린다**는 점에서, 이것이 질의 시점에 즉석으로 만드는 것이 아니라 **미리 색인해 두는 구조**라는 것을 알 수 있습니다.

### ⑥ 채팅 인터페이스 (그림 25.6)

설정을 마치면 AgentSpace 채팅 인터페이스를 사용할 수 있습니다. 화면에는 "Google Agentspace" 제목 아래 **"Hello, student"** 인사말과 **"Search your data and ask questions"** 입력창, 그리고 **Sources** 버튼이 있습니다.

인사말에 사용자 이름이 들어가고 입력창 문구가 "질문하세요"가 아니라 **"당신의 데이터를 검색하고 질문하세요"** 라는 점이, 이것이 범용 챗봇이 아니라 **조직 데이터와 연결된 에이전트**라는 것을 보여 줍니다. Sources 버튼으로 답변이 어느 데이터에서 왔는지 확인하거나 검색 범위를 고를 수 있습니다.

## 코드로 만들 때와 무엇이 다른가

24장의 프레임워크와 나란히 놓으면, AgentSpace가 **무엇을 대신 해 주는지**가 분명해집니다.

| 해야 할 일 | 코드 기반 (예: ADK) | AgentSpace |
| --- | --- | --- |
| 모델 연결 | `model="gemini-2.0-flash-exp"` | 플랫폼이 제미나이를 기본 제공 |
| 도구 정의 | 함수 작성 또는 `tools=[google_search]` | ② 서비스 Connect 버튼 |
| 지시문 | `instruction="""..."""` | ③ 갤러리 선택 또는 ④ 폼 작성 |
| 지식 검색(RAG) | 벡터 DB, 청킹, 임베딩 파이프라인 구축 | 통합 검색 + ⑤ 지식 그래프 스위치 |
| 권한·보안 | 직접 구현 | 역할 기반 접근 제어, 암호화 내장 |
| 배포·UI | 서버와 프런트엔드 구축 | ⑥ 채팅 인터페이스, Integration |
| 모니터링 | 로깅·트레이싱 직접 구성 | Analytics 메뉴 |

대신 치르는 비용도 24장의 결론 그대로입니다. 플랫폼이 정해 둔 모양 안에서는 매우 빠르지만, **루프의 조건이나 에이전트 간 배선을 세밀하게 바꾸고 싶어지는 순간** 할 수 있는 일이 급격히 줄어듭니다. 또한 모든 데이터가 한 벤더의 플랫폼을 거친다는 점도 조직 입장에서는 따져 볼 문제입니다.

## 정리

정리하면 AgentSpace는 **조직의 기존 디지털 인프라 안에서 AI 에이전트를 개발하고 배포할 수 있는 프레임워크**를 마련해 줍니다. 이 시스템의 아키텍처는 자율 추론, 기업 지식 그래프 매핑 같은 복잡한 백엔드 프로세스를 에이전트 구축용 그래픽 사용자 인터페이스와 연결합니다. 사용자는 이 인터페이스를 통해 다양한 데이터 서비스를 연동하고 프롬프트로 운영 파라미터를 정의해 에이전트를 설정할 수 있으며, 그 결과 **맥락을 이해하는 맞춤형 자동화 시스템**을 만들 수 있습니다.

> 이러한 접근 방식은 기저의 기술적 복잡성을 감춰 주므로, **깊이 있는 프로그래밍 전문성이 없어도** 특화된 멀티 에이전트 시스템을 만들 수 있다. 이는 자동화된 분석·운영 역량을 워크플로에 곧바로 탑재해 프로세스 효율을 높이고 데이터 기반 분석을 강화하는 것을 목표로 한다.

직접 해 보며 익히려면 **Google Cloud Skills Boost**의 'Build a Gen AI Agent with Agentspace' 같은 실습형 학습 모듈을 이용할 수 있습니다. 이런 모듈은 기술을 체계적으로 익히도록 돕는 환경을 마련해 줍니다.

## 마치며

책의 본문은 여기서 끝납니다. 1장의 프롬프트 체이닝에서 출발해 21개의 패턴을 거쳤고, 22장에서 그 모든 것의 바닥인 프롬프트를, 23장에서 에이전트의 손과 눈이 닿는 범위를, 24장에서 패턴을 코드로 옮기는 프레임워크를, 그리고 25장에서 **코드마저 사라진** 플랫폼을 봤습니다.

추상화가 올라갈수록 화면에 보이는 것은 줄어들지만, 그 아래에서 돌아가는 것은 같습니다. ③의 프롬프트 갤러리는 22장의 역할 프롬프팅이고, ②의 Connect 버튼은 5장의 도구 사용이며, ⑤의 지식 그래프는 14장의 지식 검색이고, 개요의 A2A는 15장의 에이전트 간 통신입니다. 노코드 플랫폼을 쓰더라도 **어떤 패턴이 어디서 동작하는지 알고 있어야** 에이전트가 이상하게 굴 때 어느 스위치를 봐야 할지 알 수 있습니다. 그것이 이 책이 패턴부터 가르친 이유일 것입니다.

### 참고 문헌

- [Create a no-code agent with Agent Designer](https://cloud.google.com/agentspace/agentspace-enterprise/docs/agent-designer)
- [Google Cloud Skills Boost](https://www.cloudskillsboost.google/)
