---
title: Claude Code 통합 가이드
layout: page
---

하나의 Mac에서 2개의 Claude Code 인스턴스를 독립적으로 운영하면서, 각 계정별로 MCP 서버(Atlassian, Slack, GitHub, BigQuery, PostgreSQL, Google Workspace)와 Telegram 봇을 연결하는 방법을 정리합니다.

## 1. 개요

### MCP(Model Context Protocol)란?

Claude Code가 외부 서비스(Jira, Confluence, Slack, GitHub, Gmail, Google Drive, Calendar, DB 등)와 통신할 수 있게 해주는 프로토콜입니다. MCP 서버를 설정하면 Claude가 직접 Jira 이슈를 조회하거나, Slack 메시지를 읽고, 이메일을 보내고, DB를 쿼리할 수 있습니다.

### 왜 멀티 계정 분리가 필요한가

- 회사 계정과 개인 계정의 인증 정보(토큰, OAuth) 분리
- MCP 서버 포트/프로세스 충돌 방지
- 보안: secrets 파일 격리
- 업무용/개인용 등 목적별로 분리된 Telegram 봇 운영

### 핵심 원리

Claude Code는 `CLAUDE_CONFIG_DIR` 환경변수로 설정 디렉토리를 지정할 수 있습니다. 이 변수를 다르게 설정하면 완전히 독립된 2개의 Claude Code 환경을 만들 수 있습니다.

| 구분 | 계정 A (work) | 계정 B (genius) |
| --- | --- | --- |
| 설정 디렉토리 | `~/.claude-work/` | `~/.claude-genius/` |
| 환경변수 파일 | `~/.secrets/work.env` | `~/.secrets/genius.env` |
| Telegram 봇 | 별도 봇 토큰 A | 별도 봇 토큰 B |
| MCP 서버 | Atlassian, Slack, GitHub, BigQuery 등 | Atlassian 등 |

## 2. 디렉토리 구조

```text
~
├── .claude-work/                     # 계정 A (회사) 설정
│   ├── .mcp.json                     # MCP 서버 설정
│   ├── settings.json                 # Claude Code 설정
│   ├── channels/
│   │   └── telegram/
│   │       ├── .env                  # 봇 토큰 A
│   │       └── access.json           # 접근 허용 목록
│   └── plugins/cache/                # 플러그인 캐시
├── .claude-genius/                   # 계정 B (개인) 설정
│   ├── .mcp.json
│   ├── settings.json
│   ├── channels/
│   │   └── telegram/
│   │       ├── .env                  # 봇 토큰 B
│   │       └── access.json
│   └── plugins/cache/
└── .secrets/
    ├── work.env                      # 계정 A 환경변수 (chmod 600)
    └── genius.env                    # 계정 B 환경변수 (chmod 600)
```

**핵심**: `HOME`을 바꾸지 않고 `CLAUDE_CONFIG_DIR`만 바꿔서 Claude 설정만 분리합니다. 공통 MCP는 `~/.claude-work/.mcp.json`에, 프로젝트별 MCP는 프로젝트 루트의 `.mcp.json`에 설정합니다.

## 3. 환경변수 파일 구성

각 계정에서 사용할 환경변수(API 토큰, DB 접속정보 등)를 별도 파일로 관리합니다.

### ~/.secrets/work.env

```bash
# Atlassian
export ATLASSIAN_API_TOKEN="your-atlassian-api-token"
# Slack
export SLACK_BOT_TOKEN="xoxb-your-slack-bot-token"
# GitHub
export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_your-github-token"
# PostgreSQL
export PGHOST="db-host"
export PGPORT="5432"
export PGDATABASE="your_db"
export PGUSER="readonly_user"
export PGPASSWORD="your-password"
# Google Workspace (OAuth)
export GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="your-client-secret"
```

### ~/.secrets/genius.env

```bash
export ATLASSIAN_API_TOKEN="your-other-token"
# ... 필요한 환경변수 추가
```

### 보안 주의사항

```bash
chmod 600 ~/.secrets/*.env    # 본인만 읽기 가능
```

- `.mcp.json`에 토큰을 직접 넣지 않고 `${ENV_VAR}` 형태로 참조
- `source`로 주입된 환경변수는 MCP 자식 프로세스가 자동 상속
- 1Password CLI(`op`) 연동 시 더 안전하게 관리 가능

## 4. Shell 함수 설정 (~/.zshrc)

```bash
# Claude Code 계정 분리 실행
claude-work() {
  (
    source ~/.secrets/work.env
    export CLAUDE_CONFIG_DIR="$HOME/.claude-work"
    claude --channels plugin:telegram@claude-plugins-official "$@"
  )
}

claude-genius() {
  (
    source ~/.secrets/genius.env
    export CLAUDE_CONFIG_DIR="$HOME/.claude-genius"
    claude --channels plugin:telegram@claude-plugins-official "$@"
  )
}
```

**핵심 포인트**

- `source ~/.secrets/xxx.env` — 해당 계정의 환경변수를 로드
- `CLAUDE_CONFIG_DIR=~/.claude-xxx` — 설정 디렉토리를 분리
- `--channels plugin:telegram@claude-plugins-official` — Telegram 채널 플러그인 활성화
- 서브셸 `( )`로 감싸서 환경변수가 현재 셸에 영향을 주지 않도록 격리
- `"$@"`로 추가 인자 전달 가능 (alias 대신 함수를 사용하는 이유)

## 5. MCP 서버 설정

### 5-1. 공통 MCP 설정 (~/.claude-work/.mcp.json)

```json
{
  "mcpServers": {
    "atlassian-local": {
      "command": "uvx",
      "args": [
        "mcp-atlassian",
        "--jira-url", "https://your-org.atlassian.net",
        "--jira-username", "you@your-org.com",
        "--jira-token", "${ATLASSIAN_API_TOKEN}"
      ],
      "env": {
        "ATLASSIAN_API_TOKEN": "${ATLASSIAN_API_TOKEN}"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_TEAM_ID": "T0XXXXXXXXX"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": [
        "-y", "@modelcontextprotocol/server-postgres",
        "postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?sslmode=require"
      ]
    },
    "google-workspace": {
      "command": "npx",
      "args": ["-y", "@dguido/google-workspace-mcp"],
      "env": {
        "GOOGLE_CLIENT_ID": "${GOOGLE_CLIENT_ID}",
        "GOOGLE_CLIENT_SECRET": "${GOOGLE_CLIENT_SECRET}",
        "GOOGLE_WORKSPACE_SERVICES": "gmail,drive,calendar"
      }
    },
    "bigquery": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-bigquery"],
      "env": {
        "GOOGLE_CLOUD_PROJECT": "your-gcp-project"
      }
    }
  }
}
```

**포인트**: 비밀 값(토큰, 비밀번호)은 `.mcp.json`에 넣지 않고 `${ENV_VAR}`로 secrets 파일의 환경변수를 참조합니다. ADC를 사용하는 경우 BigQuery의 `GOOGLE_APPLICATION_CREDENTIALS`는 생략 가능합니다.

### 5-2. 프로젝트별 MCP 설정

| 설정 위치 | 적용 범위 | 용도 |
| --- | --- | --- |
| `~/.claude-work/.mcp.json` | 모든 프로젝트 (공통) | Slack, Google, Jira, GitHub, PostgreSQL, BigQuery |
| 프로젝트 루트 `.mcp.json` | 해당 프로젝트만 | 프로젝트 전용 MCP (특정 DB, 특정 API 등) |

### 5-3. 연동된 MCP 서버 목록

| MCP 서버 | 용도 | 패키지 | 필요한 환경변수 |
| --- | --- | --- | --- |
| **Atlassian** | Jira 이슈 조회/생성, Confluence 페이지 읽기/쓰기 | `mcp-atlassian` (uvx) | `ATLASSIAN_API_TOKEN` |
| **Slack** | 채널 메시지 읽기, 메시지 전송, 스레드 조회 | `@modelcontextprotocol/server-slack` | `SLACK_BOT_TOKEN` |
| **GitHub** | 코드 검색, PR 리뷰, 이슈 관리 | `@modelcontextprotocol/server-github` | `GITHUB_PERSONAL_ACCESS_TOKEN` |
| **PostgreSQL** | DB 쿼리, 스키마 조회 | `@modelcontextprotocol/server-postgres` | `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` |
| **BigQuery** | 테이블 조회, SELECT 쿼리 실행 | `@modelcontextprotocol/server-bigquery` | `GOOGLE_CLOUD_PROJECT` |
| **Google Workspace** | Gmail 읽기/발송, Drive 파일 관리, Calendar 일정 조회 | `@dguido/google-workspace-mcp` | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |

## 6. BigQuery MCP 상세 설정

### 사전 준비

- Google Cloud 프로젝트 및 BigQuery 접근 권한
- GCP 서비스 계정 키(JSON) 또는 Application Default Credentials(ADC) 설정
- Node.js 18 이상

### GCP 인증 설정 (ADC 방식 권장)

```bash
gcloud auth application-default login
gcloud config set project <YOUR_GCP_PROJECT_ID>
```

### Claude Code에서 사용

공통 `.mcp.json`에 bigquery 서버를 등록하면(5-1 참고) Claude Code 실행 시 자동으로 연결됩니다.

```bash
# Claude Code 실행 후 MCP 연동 확인
/mcp
```

### Claude App (claude.ai)에서 사용

Claude App은 브라우저/데스크탑 앱에서 MCP 서버를 원격으로 연결하는 방식을 지원합니다. 로컬에 MCP 프록시 서버를 띄우고 claude.ai에서 URL로 연결합니다.

```bash
# mcp-proxy 설치
npm install -g @modelcontextprotocol/proxy

# BigQuery MCP 서버를 HTTP 프록시로 실행
GOOGLE_CLOUD_PROJECT=your-gcp-project \
  mcp-proxy --port 3100 npx -y @modelcontextprotocol/server-bigquery
```

claude.ai에서 등록:

1. [claude.ai](https://claude.ai) 접속 → 좌측 하단 **설정(Settings)**
2. **Integrations** 또는 **MCP Servers** 탭 선택
3. **Add MCP Server** → Name: `bigquery`, URL: `http://localhost:3100/sse`
4. **Save** 후 연결 상태 확인

### BigQuery 제공 도구

| 도구 | 설명 | 예시 |
| --- | --- | --- |
| `list-tables` | 전체 테이블 목록 조회 | "테이블 목록 보여줘" |
| `describe-table` | 테이블 스키마 조회 | "orders 테이블 컬럼 알려줘" |
| `execute-query` | SELECT 쿼리 실행 (읽기 전용) | "최근 주문 건수 집계해줘" |

> `execute-query`는 읽기 전용(SELECT)만 허용됩니다. INSERT/UPDATE/DELETE는 실행되지 않습니다.

데이터셋은 보통 환경 접두사로 나눠 둡니다. `prod_`, `stg_`, `da_` 처럼 구분해 두면 MCP로 조회할 때도 범위를 좁히기 쉽습니다.

## 7. Telegram 봇 연결

### 7-1. 봇 생성

1. Telegram에서 **@BotFather**에게 `/newbot` 명령어를 보냅니다.
2. 봇 이름과 username을 지정합니다. (예: `WorkAssistantBot`, `GeniusAssistantBot`)
3. 각각의 **Bot Token**을 발급받아 안전하게 보관합니다.
4. 이 과정을 2번 반복하여 2개의 봇 토큰을 확보합니다.

### 7-2. 봇 토큰 등록

각 계정별로 Claude Code를 실행한 뒤 Telegram 봇 토큰을 등록합니다.

```bash
# 계정 A 실행
claude-work

# Claude Code 프롬프트에서:
/telegram:configure
# → 봇 토큰 A를 입력
```

```bash
# 계정 B 실행 (별도 터미널)
claude-genius

# Claude Code 프롬프트에서:
/telegram:configure
# → 봇 토큰 B를 입력
```

### 7-3. 접근 권한 설정

1. 각 봇에게 Telegram으로 메시지를 보냅니다.
2. Claude Code에서 페어링 요청이 표시됩니다.
3. `/telegram:access` 명령으로 해당 사용자를 승인합니다.

`access.json` 구조:

```json
{
  "dmPolicy": "allowlist",
  "allowedUserIds": ["your-telegram-user-id"],
  "groupPolicy": "none"
}
```

`@userinfobot`에게 메시지를 보내면 자신의 Telegram 사용자 ID를 확인할 수 있습니다.

## 8. Google Workspace MCP 설정

Google Workspace MCP는 Gmail, Google Drive, Google Calendar에 접근할 수 있게 해줍니다. OAuth 2.0 인증이 필요하므로 초기 설정이 다른 MCP보다 복잡합니다.

### 8-1. Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성 또는 선택
2. **API 및 서비스 > 라이브러리**에서 Gmail API, Google Drive API, Google Calendar API 활성화
3. **API 및 서비스 > 사용자 인증 정보**에서 OAuth 2.0 클라이언트 ID 생성 (데스크톱 앱)
4. Client ID와 Client Secret을 `~/.secrets/work.env`에 저장

### 8-2. 첫 실행 시 OAuth 인증

Claude Code에서 Google Workspace MCP를 처음 사용하면 브라우저가 열리며 Google 계정 로그인 및 권한 동의를 요청합니다. 인증 완료 후 토큰이 `~/.config/google-workspace-mcp/tokens.json`에 저장됩니다.

### 8-3. 사용 가능한 기능

- **Gmail**: 메일 검색, 읽기, 발송, 삭제
- **Drive**: 파일 목록 조회, 파일 다운로드/업로드, 폴더 관리
- **Calendar**: 일정 조회, 일정 생성/수정/삭제, 빈 시간 찾기

## 9. 실행 및 확인

2개의 터미널을 열고 각각 실행합니다.

```bash
# 터미널 1
claude-work

# 터미널 2
claude-genius
```

각 Telegram 봇에게 메시지를 보내면 해당 Claude Code 인스턴스가 독립적으로 응답합니다.

### 활용 예시

```
# Jira + Slack 연동
"슬랙 장애 채널 메시지 + 관련 Jira 이슈 요약해줘"

# 데이터 파이프라인 점검
"이 DAG 파일 분석하고, DB 스키마 확인해서 문제점 알려줘"

# BigQuery 데이터 조회
"BigQuery 테이블 목록 보여줘"
"orders 테이블 스키마 확인해줘"
"최근 7일간 주문 건수를 날짜별로 집계하는 쿼리 실행해줘"

# 이메일 + 캘린더 관리
"읽지 않은 메일 확인하고, 오늘 일정 알려줘"

# 업무 자동화
"오늘 Jira 스프린트 상태 요약해서 Slack에 공유해줘"
```

## 10. 트러블슈팅

### 재시작 시 `~/.claude/` 기본 경로를 읽는 문제

- 원인: `CLAUDE_CONFIG_DIR`가 제대로 export 되지 않음
- 해결: alias 대신 함수 사용 + subshell 내에서 `export` 명시

### MCP 서버 연결 실패

```bash
# MCP 서버 상태 확인 (Claude Code 내에서)
/mcp
```

### Google Workspace API 활성화 안 됨

- 에러: `Gmail API has not been used in project XXX before or it is disabled`
- 해결: Google Cloud Console에서 해당 API(Gmail, Calendar, Drive)를 각각 활성화
- 활성화 후 전파에 몇 분 소요될 수 있음

### 브라우저 OAuth 꼬임

- 회사/개인 계정을 같은 브라우저에서 로그인하면 OAuth가 섞일 수 있음
- 해결: Chrome 프로필 분리 또는 브라우저 분리

### `/mcp` 명령에서 MCP 목록이 안 보이는 경우

- `/mcp` UI가 `CLAUDE_CONFIG_DIR`를 무시하고 기본 경로를 볼 수 있음
- 실제 MCP 동작은 정상 — 도구 호출로 확인 가능

## 11. Claude Code vs Claude App

| 항목 | Claude Code | Claude App |
| --- | --- | --- |
| 실행 환경 | 터미널(CLI) | 브라우저 / 데스크탑 앱 |
| 설정 방식 | `.mcp.json` 또는 전역 config | claude.ai 설정에서 URL 등록 |
| 인증 | 로컬 GCP 인증 사용 | 로컬 MCP 프록시 서버 필요 |
| 적합한 용도 | 코드 작성 중 데이터 확인, 쿼리 자동화 | 비개발자 포함 팀원 데이터 조회 및 분석 |
| 추가 설치 | `claude-code` CLI | `mcp-proxy` |

## 12. 주의사항

- **동시 실행 가능**: 2개의 인스턴스를 동시에 실행할 수 있으며, 각각 독립적으로 동작합니다.
- **봇 토큰 보안**: `~/.secrets/` 디렉토리의 파일 권한을 600으로 제한하세요.
- **계정 로그인**: 각 `CLAUDE_CONFIG_DIR`별로 별도의 Claude Code 계정 로그인이 필요합니다. 즉, 2개의 Claude 계정(구독)이 필요합니다.
- **프로젝트별 MCP**: 프로젝트 루트의 `.mcp.json`은 글로벌 설정과 별개로, 해당 프로젝트에서만 적용되는 MCP 서버를 추가로 설정할 수 있습니다.

## 13. 참고 링크

- [MCP 공식 문서](https://modelcontextprotocol.io)
- [Claude Code 공식 문서](https://docs.anthropic.com/claude-code)
- [BigQuery MCP 서버 (npm)](https://www.npmjs.com/package/@modelcontextprotocol/server-bigquery)
- [Atlassian MCP 서버](https://github.com/atlassian/mcp-atlassian)
- [Google Workspace MCP 서버](https://github.com/dguido/google-workspace-mcp)
- [Google Cloud ADC 설정](https://cloud.google.com/docs/authentication/application-default-credentials)
