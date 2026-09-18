---
title: "4장 — LangChain 입문"
chapter: 4
description: "LangChain의 구성 요소와 LangGraph가 주목받는 이유, 링크드인 SQLBot 같은 프로덕션 사례, uv 기반 가상환경과 노트북 설정, ChatOpenAI로 첫 LLM 호출을 하고 AIMessage 응답 구조와 토큰 사용량을 읽는 법을 정리합니다."
categories:
 - book
 - ai-agent-langchain-langgraph
tags:
 - langchain
 - langgraph
 - chatopenai
 - uv
 - llm
---

LangChain은 LLM으로 애플리케이션을 개발하는 오픈소스 프레임워크입니다. **개발 과정을 간소화하고 최적화하는 것**을 목표로 다양한 도구와 API를 제공합니다.

## LangChain의 구성

주요 기능은 네 가지입니다.

| 기능 | 내용 |
| --- | --- |
| **프롬프트 관리** | 재사용 가능한 **프롬프트 템플릿**으로 일관된 출력을 보장하고 프롬프트 엔지니어링을 효율적으로 수행 |
| **메모리 시스템** | 대화 기록을 관리하고 콘텍스트를 유지해 자연스러운 대화형 애플리케이션을 구현 |
| **체인 구성** | 복잡한 작업을 여러 단계로 나눠 처리하는 체인 시스템으로 모듈화된 개발이 가능 |
| **에이전트 프레임워크** | LLM으로 자율적으로 의사결정하고 작업을 수행하는 에이전트를 구현 |

여러 모듈로 구성되어 있고, 각 모듈은 확장 가능한 표준 인터페이스와 외부 기능 통합을 제공합니다.

- **`langchain-core`**: 프롬프트 템플릿, 아웃풋 파서 등 기본적인 추상화와 인터페이스를 제공하는 핵심 라이브러리
- **LCEL**: 여러 단계를 거치는 작업 흐름(체인)을 **코드 몇 줄로 간단하고 직관적으로** 만들 수 있게 해주는 문법
- **LangGraph**: **복잡한 워크플로와 에이전트 시스템을 구축하는 그래프 기반 프레임워크**
- **LangServe**: LangChain 애플리케이션을 API로 제공하는 서빙 프레임워크
- **LangSmith**: 개발, 테스트, 모니터링을 위한 디버깅 및 관찰 도구

LangChain은 특히 **LLM을 추론 엔진(inference engine)으로 사용하는** 복잡한 솔루션에서 효율이 좋습니다. 챗봇, 지능형 검색, 질문 답변, 요약 서비스, 로봇 프로세스 자동화가 가능한 가상 에이전트 등이 그 예입니다.

## LangGraph는 어디에 쓰이고 있나

에이전트가 주목받으면서 에이전트 시스템 구축에 쓰이는 LangGraph도 함께 주목받기 시작했습니다. 2024년 12월 31일 LangChain이 공개한 바에 따르면 **일래스틱서치, 우버, 링크드인** 같은 회사들이 LangGraph로 에이전트를 구축해 운영 환경에 적용하고 있습니다.

책이 특히 인상적인 사례로 꼽는 것이 **링크드인의 SQLBot**입니다. 자연어 질문을 SQL 쿼리로 변환해 데이터 접근을 간소화하는 내부 AI 도구로, LangGraph와 LangChain 기반의 **다중 에이전트 시스템(multi-agent system, MAS)** 입니다. 전문가의 도움 없이도 필요한 데이터를 찾고 분석할 수 있게 지원합니다.

여기서 LangGraph의 역할이 명확합니다. **다단계 워크플로를 설계하고, 각 단계에서 필요한 정보를 저장하며, 점진적으로 SQL 쿼리를 생성**합니다. 구체적으로는 이런 단계들을 관리합니다.

```
질문 분류 → 테이블 및 필드 검색 → 쿼리 작성 → 자동 오류 수정 및 검증 → 최적의 SQL
```

우리나라에서는 우아한형제들이 LangChain으로 비슷한 시도를 했고, [LangGraph로 전환할 예정](https://techblog.woowahan.com/18144/)이라고 합니다.

## 환경 설정

### 가상환경은 uv로

저자는 **uv**를 주로 사용합니다. 머신러닝·딥러닝 엔지니어들은 콘다를 많이 쓰지만 **아나콘다는 용량이 너무 커서** uv로 진행한다는 이유입니다. 물론 pyenv, virtualenv 등 익숙한 것을 써도 됩니다.

```bash
$ uv init langgraph-book
Initialized project `langgraph-book` at `/Users/.../langgraph-book`
```

파이썬 버전은 **3.10 이상**이면 됩니다. uv의 장점은 깃허브에서 소스 코드를 클론해 실행할 때 **`uv sync` 한 번으로 파이썬 버전을 포함한 모든 패키지를 설치**할 수 있다는 점입니다.

### 에디터와 커서 이야기

실습을 노트북으로 진행하므로 에디터는 **VS Code 또는 커서(Cursor)** 를 씁니다. 커서에 대한 책의 서술이 솔직해서 기억할 만합니다.

> 초기에는 LangGraph를 비롯한 LangChain 관련 프레임워크를 커서에서 구현할 때, **LLM이 최신 데이터를 기반으로 학습되지 않아 최신 API 변화나 개선 사항을 반영한 최적화된 코드를 작성하지 못하는 경우가 많았습니다.** 이후 커서가 웹 검색을 지원하면서 참고할 문서의 링크를 프롬프트로 입력하면 만족할 만한 성능을 보이게 되었고, 2025년 6월 1.x 버전으로 업그레이드되면서 **커서의 제안을 노트북에 바로 적용**할 수 있어 디버깅에 용이해졌습니다.

### API 키와 환경변수

OpenAI Dashboard에서 [API keys]로 API 키를 발급받아 `.env` 파일에 저장합니다. 이때 이름이 중요합니다.

> OpenAI API 키는 환경변수로 설정하는 것이 좋습니다. 이름으로 **`OPENAI_API_KEY`를 사용하면 매번 API 키를 파라미터로 전달할 필요가 없습니다.** 다른 이름을 쓰면 매번 명시적으로 `api_key`를 전달해야 합니다.

다른 이름을 쓴 경우는 이렇게 됩니다.

```python
import os
from langchain_openai import ChatOpenAI

openai_api_key = os.getenv("OPENAI_KEY")
llm = ChatOpenAI(
    model="gpt-4o-mini",
    # 환경변수 이름이 OPENAI_API_KEY였다면 이 파라미터는 생략 가능하다.
    api_key=openai_api_key,
)
```

### 노트북 설정

확장자를 `.ipynb`로 지정해 노트북 파일을 만들고, 필요한 패키지를 설치합니다. **노트북 셀에서 `!` 키워드로 바로 설치**할 수 있고, `-q` 옵션으로 상세 로그를 숨길 수 있습니다. 소스 코드를 클론하고 `uv sync`를 했다면 생략해도 됩니다.

```python
!uv add -q python-dotenv langchain-openai
```

가상환경에서 처음 노트북을 쓰면 커널을 선택하라는 창이 뜹니다. **[Python Environments]** 를 고르고 앞서 만든 가상환경을 선택하면, `ipykernel`을 설치해야 한다는 알림이 나옵니다. 이 패키지를 설치하면 `python-dotenv`와 `langchain-openai`도 함께 설치됩니다.

## 첫 LLM 호출

환경변수를 불러옵니다. 잘 불러왔으면 셀 아래에 `True`가 표시됩니다.

```python
# 환경변수 파일(.env)을 불러온다.
from dotenv import load_dotenv
load_dotenv()
```

이제 `ChatOpenAI`로 모델을 초기화합니다.

```python
from langchain_openai import ChatOpenAI

# ChatOpenAI 모델 초기화(gpt-4o-mini 모델 사용)
llm = ChatOpenAI(model="gpt-4o-mini")
```

`model`을 명시하는 이유가 있습니다. **LangChain 1.x 출시 이후에도 `langchain-openai` 패키지가 아직 최신화되지 않아 기본 모델이 `gpt-3.5-turbo`로 설정되어 있기 때문**입니다. 지금은 성능도 좋고 비용도 저렴한 `gpt-4o-mini`가 있으니 인스턴스 생성 시 `model`을 같이 넘겨주면 됩니다. 환경변수 테스트 목적이므로 `gpt-5-mini`, `gpt-5-nano` 같은 더 최근 모델을 써도 무방합니다.

```python
# LLM에 질문하고 응답 생성
ai_message = llm.invoke("RAG 파이프라인은 무엇인가요?")
ai_message
```

> **`invoke` 메서드를 호출하는 것이 RAG 파이프라인에서 G(생성)에 해당합니다.**

## 응답(AIMessage) 뜯어보기

`invoke()`의 결과는 단순한 문자열이 아닙니다. 구성 요소를 알아 두면 운영에 쓸모가 많습니다.

| 필드 | 내용 |
| --- | --- |
| **`AIMessage`** | LangChain에서 AI의 응답을 나타내는 기본 메시지 타입 |
| **`content`** | AI가 생성한 실제 텍스트 응답 |
| **`additional_kwargs`** | 추가 파라미터를 담는 딕셔너리. `refusal: None`은 AI가 응답을 거부하지 않았음을 의미 |
| **`response_metadata`** | 응답 관련 상세 메타데이터 |
| **`id`** | 해당 실행의 고유 식별자 |
| **`usage_metadata`** | 리소스 사용량 상세 메타데이터 (`input_tokens`, `output_tokens`, `total_tokens` 등) |

`response_metadata` 안쪽이 특히 유용합니다.

- **`token_usage`**: `completion_tokens`(응답 생성에 쓴 토큰, 예시에서는 311), `prompt_tokens`(입력 프롬프트 토큰, 15), `total_tokens`(전체, 326)
- **`model`**: 실제 사용된 모델 이름 (`gpt-4o-mini-2024-07-18`)
- **`system_fingerprint`**: 시스템 식별자
- **`finish_reason`**: 응답 생성 종료 이유 (`stop`은 정상 완료)

이 정보는 **API 사용량 모니터링, 디버깅, 응답 품질 관리**에 쓸 수 있습니다. 특히 토큰 사용량을 추적하면 API 비용을 효율적으로 관리할 수 있고, `response_metadata`로 모델의 동작을 더 깊이 이해하고 최적화할 수 있습니다.

## 막히는 지점: quota 오류

`invoke`를 실행했는데 **quota가 초과되었다는 오류와 함께 답변이 생성되지 않는다면**, OpenAI Dashboard의 [Billing]에서 결제할 카드를 등록해야 합니다.

> 무료로 크레딧을 주는 것처럼 보이지만, **카드를 등록하지 않으면 OpenAI에서 제공하는 API를 호출할 수 없습니다.**

## 정리

- LangChain은 `langchain-core`·LCEL·**LangGraph**·LangServe·LangSmith로 이루어져 있고, 에이전트 시대에 주목받는 것은 **그래프 기반의 LangGraph**다.
- 링크드인 SQLBot이 보여 주듯, LangGraph의 값어치는 **다단계 워크플로를 관리하고 단계마다 상태를 저장**하는 데 있다.
- 환경변수 이름은 `OPENAI_API_KEY`로 두는 게 편하다. 다른 이름이면 매번 `api_key`를 넘겨야 한다.
- `ChatOpenAI`는 **기본 모델이 아직 `gpt-3.5-turbo`** 이므로 `model`을 반드시 지정한다.
- `invoke()`가 RAG의 **G**다. 반환된 `AIMessage`의 `response_metadata`로 **토큰 사용량과 비용**을 추적할 수 있다.
- 무료 크레딧이 있어 보여도 **카드 등록 없이는 API 호출이 안 된다.**
