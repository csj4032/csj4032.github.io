---
title: "Airflow Callbacks With Gmail"
description: "Airflow의 Task Callback은 Task나 DAG의 상태 변화를 감지하여 자동으로 실행되는 함수로, 특정 Task가 실패했을 때 알림을 보내거나 마지막 Task 성공 시 완료 알림을 보내는 등 로깅과 모니"
categories:
 - data-engineering
 - airflow
source: "https://blog.naver.com/csj4032/223900352842"
---

Airflow의 Task Callback은 Task나 DAG의 상태 변화를 감지하여 자동으로 실행되는 함수로, 특정 Task가 실패했을 때 알림을 보내거나 마지막 Task 성공 시 완료 알림을 보내는 등 로깅과 모니터링에 핵심적인 역할을 한다.

콜백 함수는 Worker에 의해 Task가 실제 실행될 때만 트리거되므로, CLI나 UI에서 수동으로 Task 상태를 변경한 경우에는 실행되지 않으며, Task 완료 후에 실행되기 때문에 콜백에서 발생한 오류는 Task 로그가 아닌 스케줄러 로그에 기록된다는 점을 주의해야 한다.

Airflow는 5가지 콜백 유형을 제공하는데, on_success_callback(성공 시), on_failure_callback(실패 시), on_retry_callback(재시도 시), on_execute_callback(실행 시작 직전), on_skipped_callback(스킵 시)이 있으며, 특히 on_skipped_callback은 AirflowSkipException이 발생했을 때만 호출되고 분기나 trigger rule로 인해 애초에 실행되지 않은 경우에는 호출되지 않는다.

이러한 콜백 시스템을 활용하면 복잡한 데이터 파이프라인에서 실시간 모니터링, 에러 알림, 성공/실패 통계 수집 등을 자동화할 수 있어 운영 효율성을 크게 향상시킬 수 있으며, 특히 프로덕션 환경에서 안정적인 워크플로우 관리를 위한 필수 기능이다.

```python
import logging
from datetime import datetime, timedelta

from airflow.decorators import dag, task
from airflow.exceptions import AirflowSkipException, AirflowFailException
from airflow.providers.smtp.hooks.smtp import SmtpHook
from airflow.utils.trigger_rule import TriggerRule

EMAIL_TO = "csj4032@gmail.com"
SMTP_CONN_ID = "mmix-smtp-conn-id"


def send_email(subject: str, body: str):
    logging.info(f"📧 Sending email: {subject.strip()}")
    smtp = SmtpHook(smtp_conn_id=SMTP_CONN_ID).get_conn()
    smtp.send_email_smtp(to=EMAIL_TO, subject=subject, html_content=body)


def build_callback(title: str, emoji: str, extra: str = ""):
    def callback(context):
        logging.info(f"{emoji} {title} callback executed")
        task_id = context['task_instance'].task_id
        dag_id = context['dag'].dag_id
        execution_date = context['execution_date']
        log_url = context['task_instance'].log_url if 'fail' in title.lower() else ""
        body = f"""
            {emoji} {title}!
            DAG: {dag_id}
            Task: {task_id}
            Execution Date: {execution_date}
            {extra}{f'Log URL: {log_url}' if log_url else ''}
            """
        subject = f"{emoji} Task {task_id} {title}"
        send_email(subject, body)

    return callback


success_callback = build_callback("Succeeded", "✅")
failure_callback = build_callback("Failed", "❌")
retry_callback = build_callback("Retried", "🔁")
skip_callback = build_callback("Skipped", "⏭️")
execute_callback = build_callback("Executed", "🔄")

_default_args = {
    "owner": "MMIX",
    "start_date": datetime(1970, 1, 1),
    "retries": 1,
    "retry_delay": timedelta(seconds=5),
}


@dag(
    dag_id="example_on_callback",
    default_args=_default_args,
    schedule_interval=None,
    catchup=False,
    description="An example DAG demonstrating trigger rules and callbacks",
    tags=["Example", "Callback", "Dag", "Task"]
)
def example_on_callback():
    @task(task_id="start_task", on_execute_callback=execute_callback)
    def start():
        logging.info("🚀 Start task executed")

    @task(task_id="success_task", on_success_callback=success_callback)
    def success():
        logging.info("✅ This task will succeed")

    @task(task_id="failure_task", on_failure_callback=failure_callback, on_retry_callback=retry_callback, trigger_rule=TriggerRule.ALWAYS)
    def failure():
        logging.info("❌ This task will intentionally fail")
        raise Exception("Intentional failure to trigger failure callback")

    @task(task_id="skip_task", on_skipped_callback=skip_callback, trigger_rule=TriggerRule.ALWAYS)
    def skip():
        logging.info("⏭️ This task will be skipped")
        raise AirflowSkipException("Intentional skip to trigger skip callback")

    @task(task_id="end_task", trigger_rule=TriggerRule.ALL_DONE)
    def end():
        logging.info("🔚 End task executed")

    start() >> [success(), failure(), skip()] >> end()


example_on_callback()
```

이 Airflow DAG는 Task의 다양한 실행 상태(성공, 실패, 재시도, 스킵, 실행 시작)에 따라 자동으로 이메일 알림을 보내는 콜백(callback) 시스템을 구현한 예제이다.

build_callback 함수를 사용해 각 상태별로 이메일 제목과 내용을 동적으로 생성하는 콜백 함수들(success_callback, failure_callback, retry_callback 등)을 생성하고, 각 Task에 on_success_callback, on_failure_callback 등의 매개변수로 연결하여 해당 상태가 발생했을 때 자동으로 실행되도록 구성했다.

워크플로우는 start Task에서 시작하여 success, failure, skip Task가 병렬로 실행되며, 각각 의도적으로 성공, 실패, 스킵 상태를 만들어 해당 콜백이 트리거되는 것을 확인할 수 있도록 설계되었다. failure와 skip Task에는 TriggerRule.ALWAYS를 설정하여 이전 Task의 상태와 관계없이 실행되도록 하고, 마지막 end Task는 TriggerRule.ALL_DONE으로 모든 Task 완료 후 실행되어 전체 워크플로우를 마무리한다.

![Callbaks Graph](/assets/images/posts/2025-06-16-Airflow-Callbacks-With-Gmail/01.png)

SMTP 연결을 통해 실제 Gmail로 알림을 전송하므로, Task의 실행 상태를 실시간으로 모니터링하고 문제 발생 시 즉시 대응할 수 있는 실용적인 알림 시스템을 보여주는 DAG이다.

![전달 받은 메일](/assets/images/posts/2025-06-16-Airflow-Callbacks-With-Gmail/02.png)

구글 SMTP를 이용하기 위해서는 먼저 Google 계정의 2단계 인증을 활성화해야 하며, 이후 [myaccount.google.com](https://myaccount.google.com)의 "보안" 메뉴에서 "앱 비밀번호"를 검색하여 새로운 16자리 앱 전용 비밀번호를 생성해야 한다.

![앱 비밀번호 만들기](/assets/images/posts/2025-06-16-Airflow-Callbacks-With-Gmail/03.png)

생성된 앱 비밀번호는 일반 Gmail 비밀번호 대신 SMTP 인증에 사용되며, 한 번만 표시되므로 반드시 안전한 곳에 저장한 후 Airflow의 SMTP 연결 설정에서 이 앱 비밀번호를 사용하면 Gmail SMTP 서버(smtp.gmail.com:587)를 통해 이메일을 안전하게 전송할 수 있다.

Airflow Web UI에서 Admin > Connections 메뉴로 이동한 후 "+" 버튼을 클릭하여 새 연결을 생성하고, Connection Id는 코드에서 사용할 이름(예: mmix-smtp-conn-id), Connection Type은 "SMTP"를 선택한다.

Host에는 smtp.gmail.com, Login에는 Gmail 주소(예: your-email@gmail.com), Password에는 앞서 생성한 16자리 앱 비밀번호를 입력하고, Port는 587, Disable SSL 필드 체크하고 SSL 암호화를 비활성화한다.

설정 완료 후 "Test" 버튼을 클릭하여 연결이 성공하는지 확인하고 저장하면, Airflow DAG에서 SmtpHook(smtp_conn_id='mmix-smtp-conn-id')를 사용하여 Gmail SMTP 서버를 통해 이메일을 전송할 수 있다.

![Airflow Connection 편집](/assets/images/posts/2025-06-16-Airflow-Callbacks-With-Gmail/04.png)
