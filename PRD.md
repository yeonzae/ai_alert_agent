# 📄 PRD — 노코드 알림 에이전트 빌더 (MVP v1.0)

## 1. 서비스 개요

| 항목  | 내용                                                             |
| --- | -------------------------------------------------------------- |
| 제품명 | (가칭) AlertAgent                                                |
| 목적  | 사용자가 자연어로 알림 전략을 만들고, 실시간 가격·뉴스·지표를 감시해 조건 충족 시 알림 발송          |
| 타깃  | 주식·ETF·코인 투자자, 코딩 없이 조건 알림을 설정하고 싶은 일반 사용자                     |
| 차별점 | ① 자연어→자동채움 + 카드형 Stepper 폼, ② 가격·뉴스·경제지표를 통합 감시, ③ 전략 공유/복제 가능 |

---

## 2. 핵심 기능

| 기능명              | 설명                                                 | 우선순위   |
| ---------------- | -------------------------------------------------- | ------ |
| 자연어 전략 입력        | 프롬프트 입력 시 LLM이 조건·행동·리스크 한도를 채운 전략 초안 생성           | HIGH   |
| 카드형 Stepper 폼 수정 | 전략 초안을 Trigger → Filter → Action → Risk 순서의 카드로 편집 | HIGH   |
| 감시 소스 설정         | 가격(티커·변동률·기간), 뉴스(키워드), 경제지표(일정) 설정                | HIGH   |
| 알림 채널 연동         | Telegram, Slack, Email, Push                       | HIGH   |
| 에이전트 생성/관리       | 생성된 알림 전략의 상태, 최근 트리거 기록, 알림 발송 내역 관리              | HIGH   |
| 전략 공유/복제         | 다른 사용자의 전략을 복제·편집 가능                               | MEDIUM |
| (옵션) 모의계좌 로그     | 알림 발생 시 가상 체결 기록 남겨 백테스트처럼 확인                      | LOW    |

---

## 3. UX 플로우

### 3.1 온보딩

* 첫 진입 시 "자연어로 전략을 입력해 보세요" 예시 3\~4개 노출
* 예: "나스닥이 하루 2% 이상 떨어지면 알려줘", "CPI 발표 1시간 전, USDJPY 알림"

### 3.2 전략 생성

1. **자연어 입력 → AI 변환**

   * GPT가 타입드 JSON(Trigger/Filter/Action/Risk) 생성
   * 예: Trigger: BTCUSDT 1d -5%, Action: Telegram Alert
2. **카드형 Stepper 폼 자동채움**

   * Step 1: 조건(Trigger)
   * Step 2: 필터(Filter)
   * Step 3: 행동(Action=알림)
   * Step 4: 리스크·쿨다운
3. **실시간 미리보기 카드**

   * 오른쪽에 전략 요약 카드 업데이트
   * 아이콘·색상·간단 차트 포함

💬 **커멘트**:

* 뉴스·경제지표 트리거를 Step 1에 같이 넣을지, 아니면 Step 1\~2를 가격/뉴스/지표 탭으로 나눌지 결정 필요.
* 경제지표 데이터 소스를 어디서 받을지도 확정 필요(무료 API vs 유료).

---

### 3.3 연결 설정

* Telegram: Bot 생성 → Chat ID 입력
* Slack: Webhook URL 입력
* Email: 인증코드 방식
* Push: 브라우저/모바일 푸시 권한 요청

💬 **커멘트**:

* 알림 채널 최소 1개 필수로 설정하게 할지 여부
* 초기 MVP에서는 Telegram + Email만 먼저 제공하고 Slack/Push는 후순위로 둘 수 있음.

---

### 3.4 에이전트 대시보드

* 카드 목록: 전략명, 상태(작동/중지), 최근 트리거 시각, 24h 알림 수
* 상태 토글(ON/OFF), 수정, 복제, 삭제 버튼
* 클릭 시 세부 로그 화면 진입

---

### 3.5 실시간 로그

* 트리거 발생 시간, 조건 충족값, 알림 채널, 발송 상태
* (옵션) 모의계좌 기록 — 가격·수익률 표시

---

## 4. 시스템 구성

| 구성요소        | 기술스택                                        |
| ----------- | ------------------------------------------- |
| Frontend    | Next.js, Zustand                            |
| Backend API | FastAPI or DRF                              |
| DB          | PostgreSQL                                  |
| LLM         | GPT-4 (전략 DSL 생성)                           |
| 실시간 감시      | Async 워커(python asyncio)                    |
| 알림 연동       | Telegram Bot API, Slack Webhook, SMTP Email |
| 큐/스케줄러      | Celery or RQ                                |

---

## 5. API 계약 (MVP 범위)

### 5.1 전략 생성 (AI)

`POST /ai/strategy/draft`

```json
{
  "prompt": "BTC가 하루 5% 하락하면 RSI<30일 때 알려줘"
}
```

**Response**

```json
{
  "strategy": {
    "name": "BTC RSI Alert",
    "nodes": [
      {"id":"t1","type":"trigger","op":"price_change_pct","window":"1d","cmp":"lte","value":-5},
      {"id":"f1","type":"filter","indicator":"rsi","params":{"length":14},"cmp":"lt","value":30},
      {"id":"a1","type":"action","action":"notify","channel":"telegram"}
    ],
    "risk": {"cooldown_sec":600}
  }
}
```

### 5.2 에이전트 생성

`POST /agents`

```json
{
  "strategy_id": "abc123",
  "sources": {"price":true,"news":false,"indicator":true},
  "notifications": {"telegram":{"chat_id":"..."}, "email":{"address":"..."}}
}
```

### 5.3 실시간 이벤트

`WS /agents/{id}/stream`

```json
{
  "ts":"2025-08-14T01:00:00Z",
  "event":"trigger_hit",
  "value":-5.1,
  "condition":"price_change_pct <= -5",
  "channel":"telegram"
}
```

---

## 6. 데이터 모델 (요약)

* **Strategy**: id, name, nodes\[], edges\[], risk, created\_by
* **Agent**: id, strategy\_id, status, sources, notifications, last\_trigger
* **Notification**: id, agent\_id, ts, channel, status
* **User**: id, email, auth info

---

## 7. 보안·제약

* API Key 없이 동작 (공개 데이터·뉴스 API 사용)
* 유저 데이터 최소 수집
* SLA: 감시 주기 최소 30초\~1분 (무료), Pro 10초 가능

---

## 8. 테스트 시나리오

| 시나리오                | 기대 결과                |
| ------------------- | -------------------- |
| "나스닥 2% 하락시 알려줘" 입력 | AI가 Trigger 노드 자동 생성 |
| Telegram 연결 + 조건 충족 | 실시간 메시지 수신           |
| 쿨다운 10분 설정          | 동일 조건 10분 이내 재발송 없음  |

---

## 9. 개발 우선순위

1. 자연어→전략 DSL 변환 API
2. 카드형 Stepper 폼 UI
3. 가격 감시 워커
4. 알림 채널 연동
5. 대시보드 + 로그
6. 뉴스·경제지표 감시 (Phase 2)

---

💡 **제안**
원하면 제가 이 PRD를 바탕으로 **UX 와이어프레임**(카드형 Stepper + 실시간 미리보기)도 만들어서, 개발자·디자이너가 바로 착수할 수 있게 해줄 수 있습니다.
그 과정에서 뉴스·경제지표 데이터 소스, 알림 채널 우선순위, 감시 주기 정책을 확정하면 더 안정적인 MVP 설계가 됩니다.
