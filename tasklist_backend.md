

# ✅ 1주일 MVP 스펙 요약 (노코드 알림 에이전트 빌더)

## 기능 범위 (최소 필수)

| 기능               | 포함 여부 | 설명                             |
| ---------------- | ----- | ------------------------------ |
| 자연어 전략 생성        | ✅ 포함  | GPT 호출로 전략 DSL(JSON) 생성        |
| 카드형 Stepper UI   | ✅ 포함  | Step1\~4 카드로 전략 입력             |
| 전략 저장/불러오기       | ✅ 포함  | 전략 JSON 저장/조회                  |
| 가격 조건 감시         | ✅ 포함  | 일정 주기로 가격 API polling          |
| 알림 발송 (Telegram) | ✅ 포함  | Telegram Bot API로 알림           |
| 에이전트 실행/중지       | ✅ 포함  | 간단한 Agent lifecycle 제어         |
| 실시간 로그           | ✅ 포함  | 트리거 이력 보기 가능 (DB 또는 메모리 캐시 기반) |
| 뉴스/경제지표 감시       | ❌ 제외  | 후순위 (Phase 2)                  |
| 전략 공유            | ❌ 제외  | 후순위 (Phase 2)                  |
| 백테스트/모의계좌        | ❌ 제외  | 후순위 (Phase 2)                  |

---

# 📁 폴더 구조 (Node + TypeScript + Express 기반)

```
project-root/
├── src/
│   ├── index.ts              # 서버 진입점
│   ├── routes/
│   │   └── strategies.ts     # 전략 관련 API
│   │   └── agents.ts         # 에이전트 제어 API
│   ├── services/
│   │   └── gpt.ts            # 자연어 전략 생성기
│   │   └── telegram.ts       # 알림 발송기
│   │   └── priceWatcher.ts   # 가격 감시 워커
│   ├── models/
│   │   └── strategy.ts       # 전략 타입
│   │   └── agent.ts          # 실행 중인 에이전트
│   ├── db/
│   │   └── store.ts          # (In-memory or SQLite)
│   └── utils/
│       └── conditionCheck.ts # 전략 충족 여부 판단
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

# 🛠️ 기술 스택 요약

| 목적    | 선택 기술                             |
| ----- | --------------------------------- |
| 서버    | Express.js (with TypeScript)      |
| DB    | SQLite 또는 Lowdb (간단한 파일형 JSON DB) |
| 감시 주기 | Node setInterval 기반               |
| 알림    | Telegram Bot API                  |
| 배포    | Docker (나중에 CI에 포함 예정)            |

---

# ✅ Task List (역할 분할 가능)

## 🔹 0. 초기 세팅

* [ ] TypeScript + Node + Express 프로젝트 초기화
* [ ] ESLint + Prettier 설정
* [ ] Dockerfile 작성 (Node 20 + Alpine 기반)
* [ ] `.env` 구성 (GPT 키, Telegram 토큰)

---

## 🔹 1. 전략 생성 (LLM API)

* [ ] POST /ai/strategy/draft

  * 프롬프트 입력 → GPT 호출
  * 전략 DSL 반환 (Trigger/Filter/Action 구조)
* [ ] GPT 요청 포맷 템플릿화 (System Prompt 포함)
* [ ] Mock 응답도 가능하도록 fallback 설정

---

## 🔹 2. 전략 저장/조회

* [ ] 전략 모델 정의 (name, nodes\[], risk, createdAt 등)
* [ ] GET /strategies → 전략 리스트
* [ ] GET /strategies/\:id → 단일 전략
* [ ] POST /strategies → 저장
* [ ] (선택) PUT /strategies/\:id → 수정

💡 SQLite 사용 시 better-sqlite3 또는 Prisma 추천
(빠르고 주니어도 다루기 쉬움)

---

## 🔹 3. 에이전트 실행/중지

* [ ] AgentManager 클래스 구현

  * 감시 주기 등록
  * 조건 충족 시 알림 발송
  * 중복 발송 방지 쿨다운 타이머 포함
* [ ] POST /agents → 실행 시작
* [ ] DELETE /agents/\:id → 중지
* [ ] GET /agents → 실행 중 에이전트 목록

💡 실행 상태는 DB + 메모리 병행 (단순 object map 사용 가능)

---

## 🔹 4. 가격 감시 워커

* [ ] 가격 정보 가져오기: 코인(Upbit), 주식(예: AlphaVantage)
* [ ] 전략 조건 비교 (`conditionCheck.ts`)

  * Trigger: price\_change\_pct, price\_threshold 등
  * Filter: RSI 등 (단순 값 비교만)
* [ ] 쿨다운 시간 확인 후 알림 전송 여부 판단

💬 무료 API 추천: [CoinGecko](https://www.coingecko.com/en/api), [AlphaVantage](https://www.alphavantage.co/)

---

## 🔹 5. Telegram 알림 연동

* [ ] Telegram Bot 생성 + Chat ID 등록
* [ ] POST /notifications/test → 알림 테스트
* [ ] 실사용 시 메시지 포맷 지정 (전략명, 조건, 시각 포함)

---

## 🔹 6. 실시간 로그 저장

* [ ] 로그 모델 정의 (agent\_id, ts, value, message)
* [ ] 로그는 SQLite 또는 Lowdb에 저장
* [ ] GET /logs/\:agentId → 최근 알림/트리거 내역 반환

---

## 🔹 7. 테스트 & 스크립트

* [ ] Jest or Vitest로 주요 로직 테스트
* [ ] 감시 루프 시뮬레이터 (강제 조건 충족)

---

## 🔹 8. 기타

* [ ] Swagger/OpenAPI로 간단한 API 문서 자동 생성
* [ ] 환경변수 관리 (`dotenv`)
* [ ] Telegram 키 없을 시 알림 생략 처리

---

## ⏱ 예상 작업 배분 (1주)

| 담당 | 주요 Task                | 소요   |
| -- | ---------------------- | ---- |
| 1명 | 서버 & 라우팅, DB           | 1.5일 |
| 1명 | LLM 전략 생성 API + 템플릿    | 0.5일 |
| 1명 | 감시 로직 + conditionCheck | 1.5일 |
| 1명 | Telegram 알림 + 쿨다운 체크   | 0.5일 |
| 1명 | 로그 관리 + 전체 연결          | 1일   |
| 1명 | Dockerfile + 테스팅       | 0.5일 |

---

## ✅ 완성 후 기대 화면 예시 (동작 확인용)

* [x] 프롬프트 입력 → 전략 생성됨
* [x] Stepper UI로 수정 → 저장
* [x] 전략 실행 → 일정 주기 감시
* [x] 조건 충족 → Telegram 메시지 발송
* [x] 실행 중 전략/알림 로그 조회 가능
