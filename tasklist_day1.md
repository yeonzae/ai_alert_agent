# 📅 Day 1 개발 계획 - 프로젝트 기반 구축

## 🎯 Day 1 목표
**"MVP 개발의 견고한 기반 마련"**
- 양쪽 프로젝트(백엔드/프론트엔드) 초기 세팅 완료
- 핵심 타입 정의 및 기본 구조 구축
- GPT 연동을 통한 자연어 → 전략 변환 파이프라인 구현
- 기본적인 API-Frontend 연동 검증

---

## ⏰ 시간 배분 (8시간 기준)

| 시간대 | 작업 영역 | 예상 소요시간 |
|-------|---------|------------|
| 09:00-10:30 | 프로젝트 초기 세팅 (BE + FE) | 1.5h |
| 10:30-12:00 | 핵심 타입 정의 및 기본 구조 | 1.5h |
| 13:00-15:00 | GPT 연동 및 전략 생성 API | 2h |
| 15:00-16:30 | 기본 UI 구조 및 상태관리 | 1.5h |
| 16:30-18:00 | API-Frontend 연동 및 테스트 | 1.5h |

---

## 🔥 우선순위 Task List

### 🔹 1단계: 프로젝트 초기 세팅 (09:00-10:30)

#### Backend 세팅
- [ ] **백엔드 폴더 생성 및 초기화**
  ```bash
  mkdir ai-alert-backend && cd ai-alert-backend
  npm init -y
  ```
- [ ] **TypeScript + Express 설치 및 설정**
  ```bash
  npm install express typescript @types/node @types/express
  npm install -D nodemon ts-node eslint prettier
  ```
- [ ] **프로젝트 구조 생성**
  ```
  src/
  ├── config/
  ├── routes/
  ├── services/
  ├── models/
  ├── db/
  └── utils/
  ```
- [ ] **기본 설정 파일 작성**
  - `tsconfig.json`
  - `.env.example` (GPT_API_KEY, TELEGRAM_BOT_TOKEN)
  - `package.json` scripts 설정

#### Frontend 세팅
- [ ] **프론트엔드 프로젝트 생성**
  ```bash
  npx create-next-app@latest ai-alert-frontend --typescript --tailwind --app
  ```
- [ ] **필수 패키지 설치**
  ```bash
  npm install zustand axios zod lucide-react framer-motion
  ```
- [ ] **프로젝트 구조 생성**
  ```
  app/, components/, hooks/, store/, types/, utils/
  ```
- [ ] **글로벌 스타일 기본 설정** (glassmorphism 기초)

---

### 🔹 2단계: 핵심 타입 정의 및 기본 구조 (10:30-12:00)

#### 공통 타입 정의
- [ ] **Strategy 타입 정의** (`types/strategy.ts`)
  ```typescript
  interface Strategy {
    id: string;
    name: string;
    nodes: StrategyNode[];
    risk: RiskSettings;
    createdAt: Date;
  }
  
  interface StrategyNode {
    id: string;
    type: 'trigger' | 'filter' | 'action';
    condition: TriggerCondition | FilterCondition | ActionCondition;
  }
  ```

- [ ] **Agent 타입 정의** (`types/agent.ts`)
  ```typescript
  interface Agent {
    id: string;
    strategyId: string;
    status: 'active' | 'stopped' | 'error';
    lastTrigger?: Date;
    config: AgentConfig;
  }
  ```

#### 백엔드 기본 구조
- [ ] **Express 서버 기본 세팅** (`src/index.ts`)
- [ ] **환경설정 모듈** (`src/config/environment.ts`)
- [ ] **라우터 기본 구조** (`src/routes/index.ts`)

#### 프론트엔드 기본 구조
- [ ] **Zustand 스토어 기본 설정** (`store/index.ts`)
- [ ] **API 클라이언트 설정** (`utils/api/client.ts`)
- [ ] **기본 UI 컴포넌트** (`components/ui/button.tsx`, `card.tsx`)

---

### 🔹 3단계: GPT 연동 및 전략 생성 API (13:00-15:00)

#### GPT 서비스 구현
- [ ] **GPT 클라이언트 구현** (`services/ai/gpt-client.ts`)
  ```typescript
  export async function generateStrategy(prompt: string): Promise<Strategy>
  ```

- [ ] **프롬프트 템플릿 작성** (`services/ai/prompt-templates.ts`)
  ```typescript
  const SYSTEM_PROMPT = `
  당신은 투자 알림 전략을 JSON 형태로 변환하는 전문가입니다.
  사용자의 자연어 입력을 받아 다음 형태로 변환해주세요:
  - Trigger: 가격 조건 (asset, change_pct, timeframe)
  - Filter: 기술적 지표 (type, params, condition)
  - Action: 알림 설정 (channel, message_template)
  - Risk: 위험 관리 (cooldown, max_alerts_per_day)
  `;
  ```

- [ ] **전략 파서 구현** (`services/ai/strategy-parser.ts`)
- [ ] **API 라우트 구현** (`routes/ai/strategy-draft.ts`)
  ```typescript
  POST /ai/strategy/draft
  Body: { prompt: string }
  Response: { strategy: Strategy }
  ```

#### Mock 데이터 및 Fallback
- [ ] **GPT 응답 예시 데이터 준비**
- [ ] **GPT API 실패 시 fallback 로직**

---

### 🔹 4단계: 기본 UI 구조 및 상태관리 (15:00-16:30)

#### 자연어 입력 UI
- [ ] **전략 생성 페이지** (`app/strategies/new/page.tsx`)
- [ ] **자연어 입력 컴포넌트** (`components/forms/strategy-prompt.tsx`)
  - 예시 프롬프트 버튼 3-4개
  - 텍스트 영역 + 생성 버튼
  - 로딩 상태 UI

#### 상태 관리 구현
- [ ] **전략 스토어 슬라이스** (`store/slices/strategy.ts`)
  ```typescript
  interface StrategyState {
    currentStrategy: Strategy | null;
    isGenerating: boolean;
    generateStrategy: (prompt: string) => Promise<void>;
  }
  ```

#### 기본 레이아웃
- [ ] **루트 레이아웃** (`app/layout.tsx`)
- [ ] **네비게이션 기본 구조**
- [ ] **Glassmorphism 스타일 유틸리티**

---

### 🔹 5단계: API-Frontend 연동 및 테스트 (16:30-18:00)

#### API 연동 구현
- [ ] **전략 생성 API 호출** (`utils/api/strategies.ts`)
  ```typescript
  export async function createStrategyDraft(prompt: string): Promise<Strategy>
  ```

- [ ] **에러 핸들링** (`utils/api/error-handler.ts`)
- [ ] **토스트 알림 시스템** (`components/ui/toast.tsx`)

#### 통합 테스트
- [ ] **백엔드 서버 실행 확인**
  ```bash
  cd ai-alert-backend && npm run dev
  ```
- [ ] **프론트엔드 개발 서버 실행**
  ```bash
  cd ai-alert-frontend && npm run dev
  ```
- [ ] **프롬프트 입력 → GPT 호출 → 응답 표시** 플로우 테스트
- [ ] **기본 에러 상황 테스트**

#### 문서화
- [ ] **API 문서 기초 작성** (사용된 엔드포인트들)
- [ ] **개발 환경 설정 가이드 작성**

---

## ✅ Day 1 완료 기준

### 필수 완료 사항
1. **프로젝트 세팅 완료**: 양쪽 프로젝트 실행 가능한 상태
2. **핵심 타입 정의 완료**: Strategy, Agent 등 기본 인터페이스 정의
3. **GPT API 연동 완료**: 자연어 → JSON 변환 작동
4. **기본 UI 완료**: 프롬프트 입력하고 결과 볼 수 있는 페이지
5. **API 통신 검증 완료**: Frontend ↔ Backend 기본 통신 확인

### 선택 완료 사항 (시간 여유 시)
- [ ] **ESLint/Prettier 완전 설정**
- [ ] **기본 테스트 설정**
- [ ] **Docker 설정 초안**
- [ ] **전략 미리보기 컴포넌트 시작**

---

## 🚨 리스크 관리

### 예상 이슈 및 대응
1. **GPT API 연동 문제**
   - **대응**: Mock 데이터로 대체, OpenAI API 키 확인
2. **CORS 이슈**
   - **대응**: Express CORS 미들웨어 설정
3. **TypeScript 설정 문제**
   - **대응**: 기본 설정 사용, 점진적 타입 적용
4. **시간 부족**
   - **우선순위**: GPT 연동 > 기본 UI > 타입 정의 > 프로젝트 세팅

### 시간 단축 팁
- **병렬 작업**: 백엔드 API 개발 중 프론트엔드 Mock 데이터로 UI 개발
- **기본 템플릿 활용**: Next.js 기본 템플릿, Express 보일러플레이트 사용
- **점진적 완성도**: 완벽한 구현보다는 작동하는 기본 버전 우선

---

## 📋 Day 1 체크리스트

### 프로젝트 세팅
- [ ] 백엔드 프로젝트 초기화 및 기본 구조 생성
- [ ] 프론트엔드 프로젝트 초기화 및 기본 구조 생성
- [ ] 필수 패키지 설치 및 설정
- [ ] 환경변수 설정 (.env 파일)

### 개발 구현
- [ ] 핵심 타입 정의 (Strategy, Agent)
- [ ] GPT 클라이언트 및 API 구현
- [ ] 자연어 입력 UI 구현
- [ ] 기본 상태관리 (Zustand) 설정
- [ ] API-Frontend 연동 완료

### 검증 및 테스트
- [ ] 백엔드 서버 정상 실행 확인
- [ ] 프론트엔드 개발 서버 정상 실행 확인
- [ ] 프롬프트 입력 → GPT 응답 → 화면 표시 플로우 작동 확인
- [ ] 기본 에러 핸들링 작동 확인

**Day 1 성공 지표**: "사용자가 자연어로 전략을 입력하면, GPT를 통해 JSON 전략이 생성되고 화면에 표시된다"