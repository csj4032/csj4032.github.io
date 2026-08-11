---
title: "Airflow Callbacks With Slack"
description: "데이터 파이프라인을 운영하다 보면 작업 실패나 성공 여부를 실시간으로 모니터링해야 하는 경우가 많습니다. 특히 중요한 배치 작업이나 실시간 데이터 처리 파이프라인에서는 문제 발생 시 즉시 알림을 받아 빠르게 대응하는"
categories:
 - data-engineering
 - airflow
source: "https://blog.naver.com/csj4032/223902709182"
---

데이터 파이프라인을 운영하다 보면 작업 실패나 성공 여부를 실시간으로 모니터링해야 하는 경우가 많습니다. 특히 중요한 배치 작업이나 실시간 데이터 처리 파이프라인에서는 문제 발생 시 즉시 알림을 받아 빠르게 대응하는 것이 중요하다.

Apache Airflow는 강력한 Callbacks 기능을 제공하여 DAG나 Task의 상태 변화에 따라 자동으로 특정 함수를 실행할 수 있습니다. 이 기능을 Slack과 연동하면 팀 전체가 실시간으로 파이프라인 상태를 공유하고 협업할 수 있다.

이번 글에서는 Airflow Callbacks를 활용하여 Slack과 연동하는 방법과 실제 프로덕션 환경에서 사용할 수 있는 고급 패턴들을 소개하겠다.

## 라이브러리 설치 및 Slack 앱 설정

먼저 pip install apache-airflow-providers-slack 명령어로 Slack 연동을 위한 공식 provider 패키지를 설치한다. 그 다음 [Slack API 페이지](https://api.slack.com/apps)에서 새 앱을 생성하고 "OAuth & Permissions"에서 chat:write, chat:write.public 스코프를 추가한 후 Bot Token(xoxb-로 시작)을 발급받는다.

그리고 메세지를 보낼 채널에 App를 채널 세부정보 열기를 통해서 추가한다.

![App 추가](/assets/images/posts/2025-06-17-Airflow-Callbacks-With-Slack/01.png)

* Airflow 설치 참고 : [https://blog.naver.com/csj4032/223633401108](https://blog.naver.com/csj4032/223633401108)
* Slack 앱 설정 참고 : [https://blog.naver.com/csj4032/223902539511](https://blog.naver.com/csj4032/223902539511)

## Airflow Connection 설정

**Airflow Variable**에는 채널명(예: #airflow-alerts), 워크스페이스 정보, 메시지 템플릿 등 민감하지 않은 설정값들을 저장하고, **Connection**에는 Slack Bot Token, Webhook URL 등 보안이 중요한 인증 정보를 암호화하여 저장할 수 있습니다.

![Variable](/assets/images/posts/2025-06-17-Airflow-Callbacks-With-Slack/02.png)

DAG 코드에서는 Variable.get('slack_channel')이나 SlackHook(slack_conn_id='slack_connection')과 같은 방식으로 이러한 정보들을 불러와 사용할 수 있어, 하드코딩을 피하고 환경별(개발/운영) 설정 관리와 보안성을 동시에 확보할 수 있으며, 설정 변경 시에도 코드 수정 없이 Airflow UI에서 쉽게 관리할 수 있다.

![Connection](/assets/images/posts/2025-06-17-Airflow-Callbacks-With-Slack/03.png)

```python
import logging
from datetime import datetime, timedelta

from airflow.decorators import dag, task
from airflow.exceptions import AirflowSkipException
from airflow.models import Variable
from airflow.providers.slack.operators.slack import SlackAPIPostOperator
from airflow.utils.trigger_rule import TriggerRule

SLACK_CONN_ID = Variable.get("mmix-slack-conn-id")
SLACK_CHANNEL = Variable.get("mmix-slack-channel-id")


def build_slack_callback(status: str, emoji: str):
    def _callback(context):
        dag_id = context['dag'].dag_id
        run_id = context['run_id']
        log_url = context['task_instance'].log_url

        SlackAPIPostOperator(
            task_id=f"slack_notify_{status.lower()}_{context['task_instance'].task_id}",
            slack_conn_id=SLACK_CONN_ID,
            username="MMIX",
            channel=SLACK_CHANNEL,
            text=(
                f"<!channel> {emoji} DAG *{dag_id}* {status}!\n"
                f"Run ID: `{run_id}`\n"
                f"Log: {log_url}"
            ),
        ).execute(context=context)

    return _callback


success_callback = build_slack_callback("Succeeded", "✅")
failure_callback = build_slack_callback("Failed", "❌")
retry_callback = build_slack_callback("Retried", "🔁")
skip_callback = build_slack_callback("Skipped", "⏭️")
execute_callback = build_slack_callback("Executed", "🔄")

DEFAULT_ARGS = {
    "owner": "MMIX",
    "start_date": datetime(1970, 1, 1),
    "retries": 1,
    "retry_delay": timedelta(seconds=5),
}


@dag(
    dag_id="example_on_callback_slack",
    default_args=DEFAULT_ARGS,
    schedule_interval=None,
    catchup=False,
    description=(
            "Slack 콜백(on_execute, on_success, on_failure, on_retry, on_skipped) 예제 DAG"
    ),
    on_success_callback=success_callback,
    on_failure_callback=failure_callback,
    tags=["Example", "Callback", "Dag", "Task", "Slack"],
)
def example_on_callback_slack():
    @task(task_id="start_task", on_execute_callback=execute_callback)
    def start():
        logging.info("🚀 Start task executed")

    @task(task_id="success_task", on_success_callback=success_callback)
    def success():
        logging.info("✅ This task will succeed")

    @task(task_id="failure_task",
          on_failure_callback=failure_callback,
          on_retry_callback=retry_callback,
          trigger_rule=TriggerRule.ALWAYS)
    def failure():
        logging.info("❌ This task will intentionally fail")
        raise Exception("Intentional failure to trigger failure callback")

    @task(task_id="skip_task",
          on_skipped_callback=skip_callback,
          trigger_rule=TriggerRule.ALWAYS)
    def skip():
        logging.info("⏭️ This task will be skipped")
        raise AirflowSkipException("Intentional skip to trigger skip callback")

    @task(task_id="end_task", trigger_rule=TriggerRule.ALL_DONE)
    def end():
        logging.info("🔚 End task executed")

    start() >> [success(), failure(), skip()] >> end()


example_on_callback_slack()
```

이 Airflow DAG는 Slack API를 활용한 종합적인 콜백 알림 시스템을 구현한 예제로, Task와 DAG의 다양한 실행 상태(성공, 실패, 재시도, 스킵, 실행 시작)에 따라 자동으로 Slack 채널에 알림을 전송하는 기능을 보여준다.

build_slack_callback 함수를 통해 상태별 콜백 함수들을 동적으로 생성하며, 각 콜백은 SlackAPIPostOperator를 사용하여 DAG ID, Run ID, 로그 URL과 함께 상태에 맞는 이모지와 메시지를 Slack 채널로 전송합니다. Slack 연결 정보(SLACK_CONN_ID)와 채널 정보(SLACK_CHANNEL)는 Airflow Variable로 관리하여 보안성과 유지보수성을 확보했다.

![Example On Callback Graph](/assets/images/posts/2025-06-17-Airflow-Callbacks-With-Slack/04.png)

워크플로우는 start Task에서 시작하여 success, failure, skip Task가 병렬로 실행되며, 각각 의도적으로 성공, 실패, 스킵 상태를 만들어 해당 콜백이 트리거되는 것을 확인할 수 있도록 구성되어 있습니다. DAG 레벨에서도 on_success_callback과 on_failure_callback을 설정하여 전체 DAG의 최종 상태도 Slack으로 알림받을 수 있어, 프로덕션 환경에서 실시간 모니터링과 즉각적인 대응이 가능한 실용적인 알림 시스템을 보여주는 교육용 DAG이다.

마지막 end Task는 TriggerRule.ALL_DONE으로 설정되어 앞선 모든 Task의 완료 여부와 관계없이 실행되어 워크플로우를 마무리하며, <!channel> 멘션을 사용하여 채널의 모든 구성원에게 중요한 알림을 즉시 전달할 수 있도록 구성했다.

![Slack Message](/assets/images/posts/2025-06-17-Airflow-Callbacks-With-Slack/05.png)
