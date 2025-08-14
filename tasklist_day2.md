# 📅 Day 2 개발 계획 - 전략 관리 시스템 구축

## 🎯 Day 2 목표
**"전략 CRUD 및 카드형 Stepper UI 핵심 구현"**
- 전략 저장/조회/수정 API 완성
- 4단계 카드형 Stepper UI 기본 구조 완성
- 실시간 전략 미리보기 기능 구현
- 데이터베이스 연동 (SQLite) 완료

---

## ⏰ 시간 배분 (8시간 기준)

| 시간대 | 작업 영역 | 예상 소요시간 |
|-------|---------|------------|
| 09:00-10:30 | 데이터베이스 설정 및 전략 CRUD API | 1.5h |
| 10:30-12:00 | Stepper UI 기본 구조 및 네비게이션 | 1.5h |
| 13:00-15:00 | 4단계 카드 컴포넌트 구현 | 2h |
| 15:00-16:30 | 전략 미리보기 패널 구현 | 1.5h |
| 16:30-18:00 | 상태 관리 고도화 및 통합 테스트 | 1.5h |

---

## 🔥 우선순위 Task List

### 🔹 1단계: 데이터베이스 설정 및 전략 CRUD API (09:00-10:30)

#### 데이터베이스 설정
- [ ] **SQLite 설치 및 설정**
  ```bash
  npm install sqlite3 better-sqlite3
  ```
- [ ] **DB 연결 모듈 구현** (`src/db/connection.ts`)
  ```typescript
  export class DatabaseManager {
    private db: Database;
    constructor() {
      this.db = new Database('alerts.db');
      this.initTables();
    }
  }
  ```
- [ ] **마이그레이션 파일 작성** (`src/db/migrations/001_initial.sql`)
- [ ] **전략 리포지토리 구현** (`src/db/repositories/strategy.ts`)

#### 전략 CRUD API 구현
- [ ] **전략 모델 완성** (`src/models/strategy/types.ts`)
- [ ] **전략 저장 API** (`src/routes/strategies/create.ts`)
  ```typescript
  POST /strategies
  Body: Strategy
  Response: { id: string, ...savedStrategy }
  ```
- [ ] **전략 조회 API** (`src/routes/strategies/read.ts`)
  ```typescript
  GET /strategies -> 전략 리스트
  GET /strategies/:id -> 단일 전략
  ```
- [ ] **전략 수정 API** (`src/routes/strategies/update.ts`)

---

### 🔹 2단계: Stepper UI 기본 구조 및 네비게이션 (10:30-12:00)

#### Stepper 컨테이너 구현
- [ ] **Stepper 래퍼 컴포넌트** (`components/stepper/stepper-wrapper.tsx`)
  ```typescript
  interface StepperProps {
    currentStep: number;
    totalSteps: number;
    onStepChange: (step: number) => void;
  }
  ```
- [ ] **단계 헤더 컴포넌트** (`components/stepper/step-header.tsx`)
  - Flow Mini-map: Trigger → Filter → Action → Risk
  - 현재 단계 하이라이트
- [ ] **단계 네비게이션 컴포넌트** (`components/stepper/step-navigation.tsx`)
  - Back/Next 버튼
  - 마지막 단계에서 "Save & Activate" 버튼

#### Stepper 상태 관리
- [ ] **Stepper 스토어 슬라이스** (`store/slices/stepper.ts`)
  ```typescript
  interface StepperState {
    currentStep: number;
    completedSteps: number[];
    nextStep: () => void;
    previousStep: () => void;
    jumpToStep: (step: number) => void;
  }
  ```
- [ ] **Form 유효성 검증 로직**

---

### 🔹 3단계: 4단계 카드 컴포넌트 구현 (13:00-15:00)

#### Step 1: Trigger 설정
- [ ] **Trigger Step 컴포넌트** (`components/stepper/steps/trigger-step.tsx`)
- [ ] **가격 조건 입력 컴포넌트** (`components/forms/condition-inputs/price-trigger.tsx`)
  ```typescript
  interface PriceTriggerProps {
    asset: string;
    changePercent: number;
    timeframe: string;
    onChange: (trigger: PriceTrigger) => void;
  }
  ```
- [ ] **시간 범위 선택 컴포넌트** (`components/forms/condition-inputs/time-range.tsx`)

#### Step 2: Filter 설정
- [ ] **Filter Step 컴포넌트** (`components/stepper/steps/filter-step.tsx`)
- [ ] **RSI 필터 입력 컴포넌트** (`components/forms/condition-inputs/rsi-filter.tsx`)
  ```typescript
  interface RSIFilterProps {
    value: number;
    comparison: 'lt' | 'gt';
    period: number;
    onChange: (filter: RSIFilter) => void;
  }
  ```

#### Step 3: Action 설정
- [ ] **Action Step 컴포넌트** (`components/stepper/steps/action-step.tsx`)
- [ ] **Telegram 설정 컴포넌트** (`components/forms/action-inputs/telegram-setup.tsx`)
  ```typescript
  interface TelegramSetupProps {
    chatId: string;
    isEnabled: boolean;
    onTest: () => Promise<boolean>;
    onChange: (config: TelegramConfig) => void;
  }
  ```

#### Step 4: Risk 설정
- [ ] **Risk Step 컴포넌트** (`components/stepper/steps/risk-step.tsx`)
- [ ] **쿨다운 선택 컴포넌트** (`components/forms/risk-inputs/cooldown-selector.tsx`)
- [ ] **알림 제한 컴포넌트** (`components/forms/risk-inputs/alert-limits.tsx`)

---

### 🔹 4단계: 전략 미리보기 패널 구현 (15:00-16:30)

#### 미리보기 컨테이너
- [ ] **미리보기 카드 컴포넌트** (`components/preview/preview-card.tsx`)
  ```typescript
  interface PreviewCardProps {
    strategy: Strategy;
    className?: string;
  }
  ```
- [ ] **조건 요약 컴포넌트** (`components/preview/condition-summary.tsx`)
  - 현재 설정된 조건들을 리스트 형태로 표시
  - 컬러 코딩으로 조건 타입 구분

#### 시각적 요소
- [ ] **채널 표시 컴포넌트** (`components/preview/channel-indicators.tsx`)
  - 설정된 알림 채널 아이콘 표시
- [ ] **미니 차트 컴포넌트** (`components/preview/mini-chart.tsx`)
  - Mock 데이터로 간단한 sparkline 차트
- [ ] **전략명 표시 및 편집** (Serif 폰트 적용)

#### 실시간 업데이트
- [ ] **Preview 상태 연동**: Stepper 입력 변경 시 즉시 반영
- [ ] **조건 유효성 표시**: 유효하지 않은 조건 시 경고 표시

---

### 🔹 5단계: 상태 관리 고도화 및 통합 테스트 (16:30-18:00)

#### 상태 관리 완성
- [ ] **전략 스토어 확장** (`store/slices/strategy.ts`)
  ```typescript
  interface StrategyState {
    currentStrategy: Strategy | null;
    isGenerating: boolean;
    isSaving: boolean;
    generateStrategy: (prompt: string) => Promise<void>;
    saveStrategy: () => Promise<string>;
    updateStrategyField: (field: keyof Strategy, value: any) => void;
  }
  ```
- [ ] **Form 데이터와 Store 동기화**
- [ ] **LocalStorage 연동** (`store/middleware/persistence.ts`)

#### API 연동 완성
- [ ] **전략 저장 API 연동** (`utils/api/strategies.ts`)
- [ ] **에러 핸들링 고도화** (`utils/api/error-handler.ts`)
- [ ] **토스트 알림 시스템 완성**

#### 통합 테스트
- [ ] **전체 Stepper 플로우 테스트**
  1. 자연어 입력 → 전략 생성
  2. 4단계 카드에서 수정
  3. 미리보기 실시간 업데이트 확인
  4. 전략 저장 → DB 저장 확인
- [ ] **에러 케이스 테스트**
- [ ] **브라우저 새로고침 시 상태 복구 테스트**

---

## 🎨 UI/UX 구현 세부사항

### Glassmorphism 스타일 적용
- [ ] **카드 스타일 유틸리티** (`utils/constants/colors.ts`)
  ```typescript
  export const glassmorphism = {
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '24px',
  };
  ```

### 컬러 시스템 구현
- [ ] **조건별 컬러 코딩**
  - Price Trigger: Pastel Blue (#E3F2FD)
  - RSI Filter: Pastel Green (#E8F5E8)
  - News: Pastel Teal (#E0F2F1)
  - Risk: Pastel Red (#FFEBEE)

### 애니메이션 구현
- [ ] **슬라이드 전환 애니메이션** (`components/animations/slide-transition.tsx`)
- [ ] **페이드 인 효과** (`components/animations/fade-in.tsx`)

---

## ✅ Day 2 완료 기준

### 필수 완료 사항
1. **데이터베이스 연동 완료**: SQLite 설정 및 전략 CRUD 작동
2. **Stepper UI 구조 완성**: 4단계 네비게이션 작동
3. **기본 입력 폼 완성**: 각 단계별 핵심 입력 요소 구현
4. **미리보기 기능 완성**: 실시간 전략 미리보기 작동
5. **상태 관리 완성**: Zustand를 통한 전체 상태 관리

### 선택 완료 사항 (시간 여유 시)
- [ ] **고급 유효성 검증** (Zod 스키마 활용)
- [ ] **애니메이션 효과 고도화**
- [ ] **모바일 반응형 대응**
- [ ] **키보드 네비게이션 지원**

---

## 🚨 리스크 관리

### 예상 이슈 및 대응
1. **SQLite 설정 문제**
   - **대응**: 문서 참조, 기본 설정 활용
2. **복잡한 상태 관리**
   - **대응**: 단계별 구현, 간단한 구조 우선
3. **UI 컴포넌트 복잡도**
   - **대응**: 기본 기능 우선, 스타일링은 나중에
4. **Form 유효성 검증 복잡성**
   - **대응**: 기본 검증만 구현, 고급 기능은 Day 3에

### 시간 단축 팁
- **컴포넌트 재사용**: 유사한 입력 요소들 공통화
- **Mock 데이터 활용**: 복잡한 로직 전에 UI 먼저 완성
- **점진적 스타일링**: 기능 완성 후 스타일 적용

---

## 📋 Day 2 체크리스트

### 데이터베이스 및 API
- [ ] SQLite 설정 및 테이블 생성
- [ ] 전략 CRUD API 구현 완료
- [ ] API 테스트 (Postman 등으로 확인)

### UI 컴포넌트
- [ ] Stepper 기본 구조 구현
- [ ] 4단계 카드 컴포넌트 구현
- [ ] 미리보기 패널 구현
- [ ] 기본 스타일링 적용

### 상태 관리
- [ ] Zustand 스토어 확장
- [ ] API 연동 완료
- [ ] LocalStorage 연동

### 통합 테스트
- [ ] 전체 플로우 작동 확인
- [ ] 에러 핸들링 확인
- [ ] 상태 동기화 확인

**Day 2 성공 지표**: "사용자가 4단계 카드를 통해 전략을 수정하고, 실시간 미리보기를 보면서 전략을 저장할 수 있다"