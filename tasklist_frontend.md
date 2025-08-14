
---

# ✅ 프론트엔드 개발 스펙 (MVP v1.0)

## 🔧 기술 스택

| 목적      | 선택                              |
| ------- | ------------------------------- |
| 프레임워크   | Next.js (13+ App Router)        |
| 상태관리    | Zustand                         |
| UI 컴포넌트 | Tailwind CSS + Custom Component |
| 폰트      | Playfair Display + Inter        |
| 아이콘     | Lucide / Tabler Icons           |
| HTTP    | Axios                           |
| 배포      | Docker 이미지화 예정                  |

---

## 📁 프로젝트 구조 예시

```
/app
  /strategies
    /new  → Stepper UI
    /[id] → 미리보기/수정
  /dashboard → 실행중 전략 목록
  /logs → 알림 이력
  /api → 클라이언트용 API fetch 모듈
/components
  /cardStepper
  /strategyPreview
  /conditionTags
/store
  /useStrategyStore.ts
/styles
  /globals.css
/types
  /strategy.ts
```

---

# ✅ Task List (기능 별 분할)

## 🔹 0. 프로젝트 세팅

* [ ] Next.js 프로젝트 생성 (App Router 기반)
* [ ] Tailwind CSS + Prettier 설정
* [ ] Google Fonts 설정 (Playfair + Inter)
* [ ] Zustand store 기본 세팅
* [ ] 모바일 대응 스타일 기본 반영

---

## 🔹 1. 자연어 전략 생성 UI

* [ ] 예시 프롬프트 3\~4개 버튼으로 제공
* [ ] 자연어 입력 창 + GPT 결과 요청 (`POST /ai/strategy/draft`)
* [ ] 생성된 전략 DSL → Zustand store에 저장
* [ ] 로딩 상태 UI / 에러 fallback 구성

---

## 🔹 2. 카드형 Stepper Form UI

> 💡 핵심 UI 구조

### 공통

* [ ] Flow Mini-map Header (Trigger → Filter → Action → Risk)
* [ ] Card Glassmorphism UI 구현 (blur, radius, shadow, padding)
* [ ] 단계 전환 애니메이션 (슬라이드 또는 페이드)
* [ ] Back / Next 버튼 고정 (하단)

### Step 1 - Trigger

* [ ] 가격 조건 입력 (Asset, %, 기간)
* [ ] 뉴스/지표 조건 Badge로 함께 표시
* [ ] 유효성 체크

### Step 2 - Filter

* [ ] RSI/Indicator 입력 (조건값 + 기간)
* [ ] 뉴스/지표 같이 보여주기
* [ ] 색상으로 타입 구분 (Price=Blue, News=Teal, 지표=Orange)

### Step 3 - Action

* [ ] 알림 채널 선택 UI (Telegram만 일단)
* [ ] Chat ID 입력창 + 테스트 버튼
* [ ] 선택은 optional

### Step 4 - Risk

* [ ] 쿨다운 시간 입력 (dropdown or slider)
* [ ] 최대 알림 수 제한 (optional)

---

## 🔹 3. 전략 저장 및 실행 API 연동

* [ ] 저장 버튼 → `POST /strategies`
* [ ] 실행 버튼 → `POST /agents`
* [ ] 성공 시 대시보드로 라우팅

---

## 🔹 4. 전략 미리보기 컴포넌트 (오른쪽 카드)

* [ ] 전략명 표시 (Serif 폰트)
* [ ] 조건 요약 (점 리스트)
* [ ] 알림 채널 아이콘 (Telegram)
* [ ] 미니 스파크라인 (mock data)
* [ ] 실시간 업데이트 (Zustand)

---

## 🔹 5. 대시보드

* [ ] 실행 중 전략 리스트 조회 (`GET /agents`)
* [ ] 카드형 UI로 표시 (전략명, 상태, 최근 트리거 시간)
* [ ] 중지 / 복제 / 수정 버튼

---

## 🔹 6. 알림 로그

* [ ] `/logs/:agentId` 요청 → 리스트
* [ ] 트리거 시간, 조건, 발송 상태
* [ ] 페이지네이션 or infinite scroll

---

## 🔹 7. 상태관리 (Zustand)

* [ ] useStrategyStore: 전략 DSL 전체 저장
* [ ] useAgentStore: 실행 중 전략 목록 관리
* [ ] useFormStepperStore: 현재 스텝 위치, 전환 메서드

---

## 🔹 8. 기타

* [ ] .env 설정 (GPT KEY 등)
* [ ] 기본 오류 Toast 시스템 추가
* [ ] 404 / 로딩 등 기본 페이지 구성

---

# 🧑‍💻 Task 분담 예시 (1주일)

| 역할   | 주요 Task                | 시간   |
| ---- | ---------------------- | ---- |
| FE 1 | 자연어 → Stepper 연결, 상태관리 | 1.5일 |
| FE 2 | Stepper 카드 UI 구현       | 2일   |
| FE 3 | 전략 미리보기 + 실행 API 연동    | 1일   |
| FE 4 | 대시보드 + 로그 페이지          | 1일   |
| FE 5 | 스타일 정리, 반응형, 다듬기       | 1일   |

---

## 💡 결과물 기준 예시

* [x] 예시 전략 클릭 → 자동 채움
* [x] Stepper UI에서 조건 수정 가능
* [x] 전략 저장 + 실행 → 대시보드에 표시
* [x] 조건 충족 시 Telegram 알림 수신
* [x] 로그 페이지에서 알림 이력 확인 가능

---
