---
title: "9장 — LangChain을 활용하지 않는다면?"
chapter: 9
description: "같은 RAG를 python-docx, tiktoken, chromadb, OpenAI SDK만으로 직접 구현해 봅니다. 문서 로딩·청크 분할·id 생성·임베딩 설정·프롬프트 조립을 전부 수동으로 처리하면서, LangChain의 추상화가 실제로 무엇을 대신해 주고 있었는지 확인합니다."
categories:
 - book
 - ai-agent-langchain-langgraph
tags:
 - langchain
 - rag
 - chromadb
 - tiktoken
 - openai
---

LangChain은 RAG 구현에 필요한 다양한 컴포넌트를 **추상화하여** 제공합니다. 특히 LCEL을 활용하면 문서 로딩, 청크 분할, 임베딩, 검색, LLM 호출 등의 과정을 파이프라인으로 쉽게 연결할 수 있고, 단계별로 필요한 설정을 간단한 파라미터로 조정할 수 있습니다.

그렇다면 **LangChain을 활용하지 않고 RAG를 구성한다면** 어떨까요? 이 장은 그 질문에 코드로 답합니다. `Docx2txtLoader`와 `RecursiveCharacterTextSplitter`를 쓸 수 없으니 `python-docx`로 문서를 읽고, `tiktoken`으로 토큰 수를 세어 임베딩해야 합니다.

```bash
!uv add -q python-docx tiktoken
```

> `tiktoken`은 OpenAI의 토큰화를 지원하는 경량 패키지로, 텍스트를 효율적으로 토큰 단위로 변환하는 기능을 제공합니다. **OpenAI 토크나이저를 실행했을 때 뒤에서 돌아가는 코드**라고 이해하면 됩니다.

## ① 문서 로딩 — 단락을 직접 잇는다

```python
from docx import Document

document = Document('../documents/law_markdown.docx')

full_text = ''
for index, paragraph in enumerate(document.paragraphs):
    full_text += f'{paragraph.text}\n'
```

워드 문서를 로드할 때 **모든 단락을 하나의 문자열로 결합**해야 합니다. LangChain의 텍스트 분할, 청크 크기 조절, 중복 처리 등의 기능도 **모두 수동으로 구현**해야 합니다.

[7장](/book/ai-agent-langchain-langgraph/2026/09/18/retrieval-%ED%9A%A8%EC%9C%A8-%EA%B0%9C%EC%84%A0%EC%9D%84-%EC%9C%84%ED%95%9C-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%A0%84%EC%B2%98%EB%A6%AC/)에서 표를 마크다운으로 전처리해 뒀기 때문에 `paragraph` 단위로 읽는 것으로 충분합니다. 만약 문서 안에 표가 그대로 있다면 `Document`의 `Table` 속성을 따로 다뤄야 합니다.

## ② 청크 분할 — 토크나이저를 직접 돌린다

```python
import tiktoken

def split_text(full_text, chunk_size):
    # 토크나이저를 직접 초기화해야 한다. LangChain은 이런 저수준 설정을 자동으로 처리해준다.
    encoder = tiktoken.encoding_for_model("gpt-4o")

    # 전체 텍스트를 토큰으로 인코딩한다.
    total_encoding = encoder.encode(full_text)
    total_token_count = len(total_encoding)

    # 청크 단위로 텍스트를 분할한다.
    text_list = []
    for i in range(0, total_token_count, chunk_size):
        chunk = total_encoding[i: i+chunk_size]
        decoded = encoder.decode(chunk)
        text_list.append(decoded)

    return text_list

chunk_list = split_text(full_text, 1500)
```

여기서 두 가지를 짚습니다.

- **모델 종속성**: `tiktoken`은 **OpenAI 모델의 토큰 수를 계산하려고 제공되는 패키지**이기 때문에, 다른 모델을 쓰면서 `tiktoken`으로 토큰 수를 계산하면 오류가 발생할 수 있습니다.
- **코드량**: LangChain 없이 텍스트를 토큰 단위로 분할하는 작업은 매우 복잡합니다. **`RecursiveCharacterTextSplitter`를 쓰면 한 줄로 처리할 수 있는 작업을 여기서는 모두 수동으로 구현**해야 합니다.

게다가 이 방식에는 [6장](/book/ai-agent-langchain-langgraph/2026/09/18/Chroma%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%9C-%EB%B2%A1%ED%84%B0-%EC%A0%80%EC%9E%A5%EC%86%8C-%EA%B5%AC%EC%84%B1/)에서 본 `separators`나 `chunk_overlap` 같은 문맥 보존 장치가 없습니다. 그저 **1,500토큰마다 자를 뿐**입니다.

## ③ 벡터 저장소 — 임베딩 함수와 컬렉션을 직접 설정

```python
import chromadb
chroma_client = chromadb.Client()
```

임베딩 모델도 직접 붙여야 합니다. OpenAI의 `openai` 패키지가 아니라 `chromadb`가 제공하는 `OpenAIEmbeddingFunction` 클래스를 씁니다.

```python
from chromadb.utils.embedding_functions import OpenAIEmbeddingFunction

load_dotenv()
openai_api_key = os.getenv('OPENAI_API_KEY')

# 임베딩 함수를 직접 설정해야 한다.
openai_embedding = OpenAIEmbeddingFunction(
    api_key=openai_api_key,
    model='text-embedding-3-large')

# 컬렉션을 직접 생성하고 관리해야 한다.
collection_name = 'tax_collection'
tax_collection = chroma_client.get_or_create_collection(
    collection_name,
    embedding_function=openai_embedding)
```

[4장](/book/ai-agent-langchain-langgraph/2026/09/18/LangChain-%EC%9E%85%EB%AC%B8/)에서 본 편의가 여기서 사라집니다.

> LangChain에서 OpenAI API 키를 활용할 때는 환경변수의 키를 `OPENAI_API_KEY`로 지정하면 별도의 값을 클래스에 지정하지 않아도 됐습니다. 그런데 `chromadb`에서 제공하는 클래스를 활용하려면 **`api_key`를 명시해야 합니다.**

## ④ id를 직접 만든다

```python
id_list = []
for index in range(len(chunk_list)):
    id_list.append(f'{index}')

tax_collection.add(documents=chunk_list, ids=id_list)
```

> Chroma는 각 청크에 고윳값을 할당하는데, **`langchain-chroma` 패키지는 자동으로 id를 생성하지만, Chroma 네이티브 패키지를 활용할 때는 id를 별도로 생성해야 합니다.** id는 고윳값이어야 하므로 겹치지 않도록 주의해야 합니다.

책은 관계형 데이터베이스의 `auto_increment primary key`와 유사하게 `chunk_list`의 index를 id로 씁니다.

## ⑤ 검색 — 결과 구조가 다르다

`.query()` 메서드는 LangChain의 `retriever.invoke()`와 유사한 결과를 줍니다.

```python
retrieved_doc = tax_collection.query(
    query_texts=question,   # 벡터 저장소 검색을 위한 질문
    n_results=1             # 벡터 저장소에서 불러올 문서 개수
)
```

다만 반환 구조가 다릅니다. `ids`, `embeddings`, `documents`, `uris`, `data`, `metadatas`, `distances`, `included`가 한꺼번에 담겨 오고, 여기서 주의할 점이 있습니다.

> **`documents` 안에 문서가 `list of lists`로 들어가 있다는 것입니다.**

그래서 실제 텍스트를 쓰려면 `retrieved_doc['documents'][0]`처럼 한 겹을 벗겨야 합니다. LangChain이라면 `Document` 객체의 `page_content`로 바로 접근했을 부분입니다.

## ⑥ LLM 호출 — 프롬프트를 손으로 조립

```python
from openai import OpenAI

# OpenAI 클라이언트를 직접 초기화해야 한다.
client = OpenAI()

# API 호출을 직접 구성하고 실행해야 한다.
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": f"종합부동산세 전문가입니다. 아래 내용을 참고해서 사용자의 질문에 답변해주세요 {retrieved_doc['documents'][0]}"},
        {"role": "user", "content": question}
    ]
)

# 응답에서 필요한 내용을 직접 추출해야 한다.
response.choices[0].message.content
```

주석이 이 장의 요지를 반복합니다. **LangChain은 프롬프트 관리, 콘텍스트 주입, 출력 파싱 등을 체계적으로 처리해주지만, 여기서는 모든 것을 수동으로 구성해야 합니다.** 응답 객체의 구조를 직접 다뤄야 하는 것도 마찬가지입니다.

답변 자체는 잘 나옵니다. 20억에서 9억을 공제하고 공정시장가액비율 60%를 적용해 과세표준 6.6억 원을 구하고, 세율을 적용하는 흐름입니다. **결과가 나쁜 게 아니라, 여기까지 오는 데 드는 코드가 문제**입니다.

## 그래서 LangChain을 쓰는가

> 간단한 retrieval을 구현하는 데도 **LangChain을 활용할 때보다 훨씬 더 많은 양의 코드를 작성해야 합니다.**

책은 균형 잡힌 결론을 냅니다. **회사 보안 규정 때문에 새로운 LLM 모델을 활용하거나 파이썬 패키지를 설치하거나 벡터 저장소를 변경해야 한다면**, 해당 LLM 모델과 벡터 저장소의 패키지를 설치하고 RAG를 구성하는 소스를 별도로 개발해야 할 것입니다.

> 하지만 LangChain을 활용하면, **LLM 애플리케이션을 구성하는 많은 요소가 추상화되어 있어 변수만 교체하면 쉽게 작업할 수 있습니다.**

그 주장을 다음 장에서 실제로 증명합니다. **벡터 저장소를 Chroma에서 Pinecone으로 바꾸고, LLM도 OpenAI에서 Claude로 바꿔** 보는 것입니다. 9장에서 손으로 짠 코드라면 거의 전부를 다시 써야 할 변경입니다.

## 정리

- LangChain을 빼면 **`python-docx` + `tiktoken` + `chromadb` + `openai`** 를 직접 조립해야 한다.
- 잃는 것: `separators`·`chunk_overlap` 같은 **문맥 보존 분할**, 환경변수 자동 처리, **id 자동 생성**, `Document` 추상화, 프롬프트 템플릿과 출력 파서.
- 얻는 것: 저수준 제어. 다만 `tiktoken`처럼 **특정 공급자에 묶인 도구**를 쓰게 되는 부작용도 따라온다.
- 판단 기준은 취향이 아니라 제약이다. **보안 규정이나 사내 패키지 정책** 때문에 직접 구현이 필요할 수 있다.
- 추상화의 값어치는 **교체할 때** 드러난다 — 다음 장에서 벡터 저장소와 LLM을 동시에 갈아 끼우며 확인한다.
