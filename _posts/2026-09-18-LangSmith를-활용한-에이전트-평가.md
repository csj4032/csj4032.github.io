---
title: "21장 — LangSmith를 활용한 에이전트 평가"
chapter: 21
description: "LLM Judge를 직접 구현합니다. 골든 데이터셋을 코드로 만들고, gpt-4o를 판단자로 세워 정확성을 채점하고, LangChain 허브의 프롬프트로 환각을 검증합니다. aevaluate로 여러 평가자를 병렬 실행하고 experiment_prefix로 실험을 구분하는 법, 그리고 80점이 나온 이유가 검색 실패였다는 진단까지 정리합니다."
categories:
 - book
 - ai-agent-langchain-langgraph
tags:
 - langsmith
 - llm-judge
 - evaluation
 - langgraph
 - hallucination
---

[15장](/book/ai-agent-langchain-langgraph/2026/09/18/LangSmith%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%9C-%EC%97%90%EC%9D%B4%EC%A0%84%ED%8A%B8-%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81/)에서 본 대로 LangSmith는 LangGraph 에이전트의 모든 실행 트레이스를 자동으로 캡처합니다. **별도의 설정 없이도** 노드별 실행 로그, 상태 변화, 도구 사용 내역이 기록됩니다.

이 장의 주인공은 **실험(experiment)** 기능입니다.

> 여러 버전의 에이전트를 동시에 평가하며 최적의 성능을 찾는 데 매우 유용합니다. 새로운 세금 계산 에이전트를 배포하기 전에 **수백 개의 다양한 시나리오로 테스트**할 수 있으며, 에이전트가 점진적으로 발전할 때마다 **이전 버전과의 성능 차이를 객관적으로 비교**할 수 있습니다.

협업 측면의 값어치도 큽니다. **개발자, 제품 매니저, 비즈니스 이해관계자가 동일한 데이터와 지표를 바탕으로 의사결정**할 수 있어 팀 간 소통과 합의가 원활해집니다. 복잡한 멀티 에이전트 시스템에서는 **각 에이전트의 성능뿐 아니라 에이전트 간의 상호작용까지** 분석할 수 있습니다.

평가 대상은 [13장](/book/ai-agent-langchain-langgraph/2026/09/18/%EC%97%90%EC%9D%B4%EC%A0%84%ED%8A%B8-%EC%98%A4%EC%BC%80%EC%8A%A4%ED%8A%B8%EB%A0%88%EC%9D%B4%EC%85%98/)에서 슈퍼바이저의 하위 에이전트로 쓴 **소득세 에이전트**입니다. 한 가지 주의사항이 붙습니다.

> LangSmith에서 LangGraph로 생성한 에이전트를 테스트하는 방법은 공식 문서에 안내되어 있지만, **공식 문서를 그대로 따라 하면 오류가 발생할 수 있으므로 예시 코드를 잘 참고**하길 바랍니다(2025년 12월 기준).

## ① 골든 데이터셋을 코드로 만들기

```python
from langsmith import Client

client = Client()

dataset_name = "income_tax_dataset"
dataset = client.create_dataset(dataset_name)

client.create_examples(
    inputs=[                                    # 질문 목록
        {"question": "제1조에 따른 소득세법의 목적은 무엇인가요?"},
        {"question": "'거주자'는 소득세법에서 어떻게 정의되나요?"},
        # ...생략...
    ],
    outputs=[                                   # 질문에 대한 정답
        {"answer": "소득세법의 목적은 소득의 성격과 납세자의 부담능력에 따라 적정하게 과세함으로써…"},
        {"answer": "'거주자'는 한국에 주소를 두거나 183일 이상 거소를 둔 개인을 의미합니다."},
        # ...생략...
    ],
    metadata=[                                  # 각 질문이 활용해야 하는 콘텍스트 목록
        {"context": "제1조(목적) 이 법은 개인의 소득에 대하여…"},
        {"context": "제1조의2(정의) \"거주자\"란 국내에 주소를 두거나 183일 이상의 거소를 둔 개인을 말한다."},
        # ...생략...
    ],
    dataset_id=dataset.id,
)
```

[19장](/book/ai-agent-langchain-langgraph/2026/09/18/LLM-%ED%8F%89%EA%B0%80%EB%A5%BC-%EC%9C%84%ED%95%9C-%EA%B3%A8%EB%93%A0-%EB%8D%B0%EC%9D%B4%ED%84%B0%EC%85%8B/)의 구성 요소가 그대로 코드가 됩니다. 총 20개 항목이 세 부분으로 이루어집니다.

| 필드 | 내용 |
| --- | --- |
| **`inputs`** | 사용자의 질문 |
| **`outputs`** | 소득세법 조문을 기반으로 작성된 **정확한 답변**(ground truth) |
| **`metadata`** | 각 질문-답변 쌍에 대한 **법조문 콘텍스트**. AI가 답변을 생성할 때 참고해야 할 **법적 근거** |

생성된 데이터셋은 LangSmith 대시보드의 **[Datasets & Experiments]** 탭에서도 확인할 수 있습니다.

## ② LLM Judge — 정확성 평가자

```python
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv

load_dotenv()

judge_llm = init_chat_model("gpt-4o")     # 평가에 활용할 모델(판단자)

async def correct(outputs: dict, reference_outputs: dict) -> bool:
    instructions = (
        "Given an actual answer and an expected answer, determine whether"
        " the actual answer contains all of the information in the"
        " expected answer. Respond with 'CORRECT' if the actual answer"
        " does contain all of the expected information and 'INCORRECT'"
        " otherwise. Do not include anything else in your response."
    )

    # 그래프는 State 딕셔너리를 리턴하며 마지막 메시지가 AI의 최종 답변이 된다.
    actual_answer = outputs["messages"][-1].content
    expected_answer = reference_outputs["answer"]

    # 실제 답변과 기대 답변을 명확히 구분하여 제시
    user_msg = (
        f"ACTUAL ANSWER: {actual_answer}"
        f"\n\nEXPECTED ANSWER: {expected_answer}"
    )

    response = await judge_llm.ainvoke([
        {"role": "system", "content": instructions},
        {"role": "user", "content": user_msg},
    ])

    return response.content.upper() == "CORRECT"
```

설계 포인트가 여럿입니다.

- `correct` 함수는 **비동기**이며 두 파라미터를 받습니다. `outputs`는 LangGraph 에이전트가 생성한 응답, `reference_outputs`는 **골든 데이터셋에서 가져온 기대 정답**입니다.
- 평가 지시는 **영어로 작성**하고, **CORRECT 또는 INCORRECT로만 응답하도록 요구**하며 추가 설명을 포함하지 않도록 명시합니다.
- LangGraph의 출력인 State 딕셔너리에서 **마지막 AI 메시지**를 실제 답변으로 꺼냅니다.
- `upper()`로 **대소문자 구분 없이** 처리해 불리언으로 반환합니다.

> 이 평가 시스템은 대규모 평가를 수작업 없이 수행할 수 있어 자동화가 가능하고, 동일한 기준으로 모든 응답을 평가하며 일관성을 유지합니다. 골든 데이터셋의 크기가 커져도 효율적으로 처리할 수 있어 확장성이 뛰어나며, **인간 편향이 개입할 여지가 적어 객관성을 유지**합니다.

## ③ 평가 파이프라인 구성과 실행

```python
from langsmith import aevaluate
from income_tax_agent import income_tax_agent

# 입력을 State 형식으로 변환하는 함수
def example_to_state(inputs: dict) -> dict:
    return {"messages": [{"role": "user", "content": inputs['question']}]}

# LCEL 선언적 구문으로 파이프라인 구성
# langgraph 그래프는 langchain runnable이기 때문에 가능하다.
target = example_to_state | income_tax_agent

experiment_results = await aevaluate(
    target,                      # 평가할 파이프라인
    data="income_tax_dataset",   # 평가에 사용할 데이터셋 이름
    evaluators=[correct],        # 평가에 사용할 평가 함수 리스트
)
```

여기서 [6장](/book/ai-agent-langchain-langgraph/2026/09/18/Chroma%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%9C-%EB%B2%A1%ED%84%B0-%EC%A0%80%EC%9E%A5%EC%86%8C-%EA%B5%AC%EC%84%B1/)의 Runnable 개념이 다시 빛납니다. **LangGraph의 모든 그래프가 LangChain Runnable 인터페이스를 구현하고 있어** 일반 함수와 그래프를 파이프 연산자로 이어 붙일 수 있습니다.

`aevaluate`는 세 파라미터를 받습니다. `target`(평가 파이프라인), `data`(데이터셋), 그리고 **`evaluators`** 인데, **리스트를 인수로 받기 때문에 LLM Judge를 동시에 실행할 수 있는 것이 특징**입니다.

### 결과: 80점, 그런데 원인은 검색 실패

대시보드에서 `Correct 0.80 AVG`를 확인할 수 있습니다. 흥미로운 건 **틀린 답변의 원인**입니다.

```
ai: 현재 소득세 과세기간에 대한 검색 요청에 오류가 발생했습니다…        → 0.00
ai: 소득세법에서 '내국법인'의 정의를 검색하는데 문제가 발생했습니다…     → 1.00
ai: 현재 제공된 정보에서 '비거주자'의 정의를 찾을 수 없습니다. 추가적인…  → 0.00
```

> **잘못된 답변의 원인을 살펴보면 데이터를 가져오는 데 실패해서 답변 생성에 필요한 문서를 확보하지 못한 것으로 확인**됩니다. 이러한 평가를 통해 **데이터를 조금 더 세밀하게 정제해야 retrieval 효율이 개선되어 에이전트의 성능도 향상된다**는 것을 확인할 수 있습니다.

생성이 아니라 **검색이 문제**라는 진단입니다. [18장](/book/ai-agent-langchain-langgraph/2026/09/18/LLM-%ED%8F%89%EA%B0%80-%EC%A7%80%ED%91%9C/)에서 "검색 품질이 곧 최종 응답의 품질"이라고 한 대목이 실측으로 확인된 셈입니다.

### 실험 이름은 직접 짓는다

실험 이름이 **'cooked-knife-56'** 처럼 나오는 것은 **이름을 지정하지 않으면 LangSmith가 자동으로 임의의 값을 부여**하기 때문입니다.

```python
experiment_results = await aevaluate(
    target,
    data="income_tax_dataset",
    evaluators=[correct],
    experiment_prefix='gpt-4o',                  # 추가
    description='답변 정확도(correctness) 측정',  # 추가
)
```

> 평가는 주로 **어떤 모델이 우리의 에이전트에 적합한지 판단하거나 데이터 전처리 성능을 측정**하려고 수행합니다. 따라서 `experiment_prefix`에 **모델 이름이나 사용한 벡터 저장소 이름, 또는 데이터 전처리 방식**을 추가하면 실험 이름에 반영됩니다. 그리고 `description`에 설명을 작성해서 **협업하는 다른 엔지니어들이 같은 실험을 반복하는 것을 방지**할 수 있습니다.

동일한 데이터셋에 여러 실험을 수행하면 **LangSmith가 자동으로 결과를 비교 분석**해 막대그래프로 보여 줍니다. `cooked-knife-56`은 약 80%, `gpt-4o-69902b0b`는 약 65%의 정확도를 보이는 식입니다.

## ④ 환각을 검증하는 LLM Judge

이번에는 `metadata`의 `context`를 활용해 **답변이 문서에 기반해 생성됐는지** 검증합니다. LangSmith 허브의 **`langchain-ai/rag-answer-hallucination`** 프롬프트를 씁니다.

{% raw %}
```
SYSTEM
You are a teacher grading a quiz.
You will be given FACTS and a STUDENT ANSWER.

Here is the grade criteria to follow:
(1) Ensure the STUDENT ANSWER is grounded in the FACTS.
(2) Ensure the STUDENT ANSWER does not contain "hallucinated" information outside the scope of the FACTS.

Score:
A score of 1 means that the student's answer meets all of the criteria. This is the highest (best) score.
A score of 0 means that the student's answer does not meet all of the criteria. This is the lowest possible score.

Explain your reasoning in a step-by-step manner to ensure your reasoning and conclusion are correct.
Avoid simply stating the correct answer at the outset.

HUMAN
FACTS: {{documents}}
STUDENT ANSWER: {{student_answer}}
```
{% endraw %}

**평가자에게 '선생님'이라는 페르소나를 부여하고 학생의 답변을 채점하는 방식**입니다. [3장](/book/ai-agent-langchain-langgraph/2026/09/18/%ED%94%84%EB%A1%AC%ED%94%84%ED%8A%B8-%EC%97%94%EC%A7%80%EB%8B%88%EC%96%B4%EB%A7%81-%EA%B8%B0%EC%B4%88/)의 페르소나와 CoT("step-by-step manner")가 평가 프롬프트에 그대로 쓰였습니다.

```python
from langchain import hub

grade_prompt_hallucinations = hub.pull("langchain-ai/rag-answer-hallucination")

async def hallucination(outputs) -> dict:
    # messages 리스트의 구조:
    #  - 마지막 메시지(-1): LLM의 최종 답변
    #  - 마지막에서 두 번째 메시지(-2): retrieval_tool의 실행 결과로 얻은 법조문 콘텍스트
    context = outputs["messages"][-2].content
    actual_answer = outputs["messages"][-1].content

    # 프롬프트 템플릿과 LLM을 연결하여 평가 파이프라인 구성
    answer_grader = grade_prompt_hallucinations | judge_llm

    # 환각 점수는 0~1 사이의 값으로, 1에 가까울수록 콘텍스트에 충실한 답변을 의미
    score = answer_grader.invoke({"documents": [context],
                                  "student_answer": actual_answer})
    score = score["Score"]

    return score == 1
```

> **RAG 파이프라인의 메시지 구조를 이해하는 것이 이 코드의 핵심**입니다. 에이전트가 동작할 때 `retrieval_tool`이 먼저 실행되어 관련 문서를 검색하고, 그 결과를 콘텍스트로 사용해 LLM이 답변을 생성합니다. 따라서 messages 리스트에서 **마지막에서 두 번째 메시지가 검색된 문서**를, **마지막 메시지가 최종 답변**을 담고 있습니다.

전달 형식도 중요합니다. **콘텍스트는 `documents` 키에 리스트 형태로, LLM의 답변은 `student_answer` 키에 전달**하는데, 이는 허브 프롬프트 템플릿이 기대하는 입력 형식과 일치합니다.

마지막 `score == 1`은 **답변이 완전히 콘텍스트에 기반하고 있는지를 불리언으로 반환**합니다. **환각이 없는 상황에만 참(True)이 되므로 답변의 신뢰성을 엄격하게 검증하는 방식**입니다.

> 이러한 환각 평가 시스템은 RAG 시스템의 신뢰성을 확보하는 데 매우 중요합니다. 특히 **법률, 의료, 금융 등 정확성이 중요한 도메인**에서 에이전트를 운영할 때는 이러한 검증 메커니즘이 필수적입니다.

## ⑤ 여러 평가자를 병렬로

운영 배포 전에 두 가지 테스트를 동시에 진행하려면 **평가자를 리스트로 전달**하면 됩니다.

```python
experiment_results = await aevaluate(
    target,
    data="income_tax_dataset",
    evaluators=[correct, hallucination],      # 검증할 평가자 리스트 전달
    experiment_prefix='gpt-4o',
    description='1.0.1 운영 배포 전 최종 점검'
)
```

대시보드에는 **좌측 차트에 정확성(correct) 점수, 우측 차트에 환각 발생률**이 나란히 표시되고, 하단 테이블에서 각 실험의 세부 결과와 **응답 지연 시간(P50/P99 Latency)** 까지 종합적으로 분석할 수 있습니다. 예시 실험에서는 Correct 0.75, Hallucination 0.67이 나왔습니다.

> 이러한 멀티 평가자 접근법을 활용하면 시스템의 다양한 측면을 동시에 검증해 **운영 배포 전보다 신뢰할 수 있는 품질 검증**이 가능하다. 특히 세무 상담과 같이 정확성이 중요한 도메인에서는 **정확성과 환각 방지를 동시에 평가하는 것이 필수적**이다.

## 왜 이렇게까지 하나

책이 21장을 닫는 문단들이 4부 전체의 결론이기도 합니다.

> 하지만 LLM 성능 평가의 진정한 중요성은 단순한 효율성을 넘어서 **신뢰성과 안정성을 확보**하는 데 있습니다. AI 시스템이 실제 비즈니스 환경에서 사용될수록 그 답변에 대한 **책임과 신뢰성**이 더욱 중요해집니다. 세금 계산이나 법률 조언과 같은 민감한 영역에서는 작은 오류도 큰 문제로 이어질 수 있습니다. 따라서 에이전트의 답변이 정확한지, 환각이 없는지, 일관성 있게 고품질의 응답을 제공하는지 **지속적으로 검증하는 것은 선택이 아닌 필수**입니다.
>
> LLM 성능 평가는 또한 에이전트의 발전 과정을 **과학적으로 관리**할 수 있게 해줍니다. 매번의 개선 사항이 실제로 성능을 향상시키는지, 어떤 변경 사항이 의도하지 않은 부작용을 초래하지 않았는지 객관적인 데이터로 확인할 수 있습니다. 이는 개발팀이 **직관이나 추측에 의존하는 대신 데이터에 기반한 합리적 결정**을 내릴 수 있게 해줍니다.
>
> 결국 체계적인 LLM 성능 평가는 **AI 에이전트가 실험실을 벗어나 실제 세계에서 가치를 창출하는 도구로 발전하는 데 필수적인 기반**이 됩니다.

## 정리

- 골든 데이터셋은 **`client.create_examples(inputs, outputs, metadata)`** 로 코드에서 만든다. `metadata`의 `context`가 나중에 환각 검증의 근거가 된다.
- LLM Judge는 **비동기 함수 하나**다. `outputs`(실제)와 `reference_outputs`(기대)를 받아 **CORRECT/INCORRECT만 답하게** 하고 불리언을 반환한다.
- `target = example_to_state | agent` — **LangGraph 그래프가 Runnable이라서** 파이프로 이어진다.
- 점수만 보지 말고 **틀린 이유를 본다.** 여기서는 생성이 아니라 **검색 실패**가 원인이었다.
- 실험 이름은 `experiment_prefix`로 짓고 `description`을 남긴다. **동료가 같은 실험을 반복하지 않게** 하는 장치다.
- 환각 검증은 허브의 **`rag-answer-hallucination`** 프롬프트를 쓰고, `messages[-2]`(검색 문서)와 `messages[-1]`(답변)을 비교한다. **`score == 1`만 True** 로 삼아 엄격하게 본다.
- `evaluators=[correct, hallucination]` — **리스트로 넘기면 병렬로 돈다.**
