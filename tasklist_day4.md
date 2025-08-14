# 📅 Day 4 개발 계획 - 알림 시스템 및 대시보드 구현

## 🎯 Day 4 목표
**"Telegram 알림 시스템 및 Agent 관리 대시보드 완성"**
- Telegram Bot 연동 및 알림 발송 시스템 구현
- Agent 상태 관리 대시보드 UI 구축
- 실시간 로그 뷰어 구현
- 전체 시스템 통합 및 End-to-End 테스트

---

## ⏰ 시간 배분 (8시간 기준)

| 시간대 | 작업 영역 | 예상 소요시간 |
|-------|---------|------------|
| 09:00-10:30 | Telegram Bot 연동 및 알림 시스템 | 1.5h |
| 10:30-12:00 | 알림 큐 및 메시지 포맷팅 시스템 | 1.5h |
| 13:00-15:00 | Agent 대시보드 UI 구현 | 2h |
| 15:00-16:30 | 로그 뷰어 및 실시간 업데이트 | 1.5h |
| 16:30-18:00 | 전체 시스템 통합 및 E2E 테스트 | 1.5h |

---

## 🔥 우선순위 Task List

### 🔹 1단계: Telegram Bot 연동 및 알림 시스템 (09:00-10:30)

#### Telegram Bot 설정
- [ ] **Telegram Bot API 클라이언트** (`src/services/notifications/telegram.ts`)
  ```typescript
  export class TelegramService {
    private botToken: string;
    
    async sendMessage(chatId: string, message: string): Promise<boolean>
    async testConnection(chatId: string): Promise<boolean>
    async getMe(): Promise<BotInfo>
  }
  ```
- [ ] **Bot 토큰 환경 설정** (`.env`)
- [ ] **Chat ID 유효성 검증**

#### 알림 전송 로직
- [ ] **알림 전송자** (`src/services/notifications/notification-sender.ts`)
  ```typescript
  interface NotificationPayload {
    agentId: string;
    strategy: Strategy;
    triggerData: TriggerData;
    timestamp: Date;
  }
  
  export class NotificationSender {
    async send(payload: NotificationPayload, channels: string[]): Promise<NotificationResult[]>
  }
  ```

#### 메시지 템플릿
- [ ] **메시지 포맷터** (`src/services/notifications/message-formatter.ts`)
  ```typescript
  export class MessageFormatter {
    formatPriceAlert(strategy: Strategy, triggerData: TriggerData): string
    formatErrorMessage(error: Error): string
  }
  ```
- [ ] **알림 템플릿 정의**
  ```typescript
  const PRICE_ALERT_TEMPLATE = `
  🚨 ${strategyName} 알림
  
  📊 ${asset}: ${currentPrice} (${changePercent}%)
  ⏰ ${timestamp}
  📝 ${condition}
  `;
  ```

---

### 🔹 2단계: 알림 큐 및 메시지 포맷팅 시스템 (10:30-12:00)

#### 알림 큐 시스템
- [ ] **알림 큐 관리** (`src/services/notifications/notification-queue.ts`)
  ```typescript
  interface QueuedNotification {
    id: string;
    agentId: string;
    payload: NotificationPayload;
    retryCount: number;
    scheduledAt: Date;
  }
  
  export class NotificationQueue {
    add(notification: QueuedNotification): Promise<void>
    process(): Promise<void>
    retry(notificationId: string): Promise<void>
    clear(agentId: string): Promise<void>
  }
  ```

#### 쿨다운 통합
- [ ] **Agent 관리자에 알림 연동** (`src/services/monitoring/agent-manager.ts`)
  ```typescript
  // 기존 AgentManager 확장
  export class AgentManager {
    private async handleTrigger(agent: Agent, evaluationResult: EvaluationResult): Promise<void> {
      if (this.cooldownManager.isInCooldown(agent.id)) return;
      
      await this.notificationQueue.add({
        agentId: agent.id,
        payload: this.buildNotificationPayload(agent, evaluationResult),
        retryCount: 0,
        scheduledAt: new Date()
      });
      
      this.cooldownManager.setCooldown(agent.id, agent.config.cooldownMs);
    }
  }
  ```

#### 알림 테스트 API
- [ ] **알림 테스트 API** (`src/routes/notifications/test.ts`)
  ```typescript
  POST /notifications/test
  Body: {
    channel: 'telegram';
    chatId: string;
    message?: string;
  }
  Response: { success: boolean, message: string }
  ```

#### 알림 히스토리
- [ ] **알림 로그 확장** (`src/models/notification/history.ts`)
  ```typescript
  interface NotificationHistory {
    id: string;
    agentId: string;
    channel: 'telegram';
    status: 'sent' | 'failed' | 'pending';
    sentAt: Date;
    error?: string;
  }
  ```

---

### 🔹 3단계: Agent 대시보드 UI 구현 (13:00-15:00)

#### 대시보드 페이지 구조
- [ ] **대시보드 메인 페이지** (`app/dashboard/page.tsx`)
- [ ] **Agent 목록 API 연동** (`utils/api/agents.ts`)
  ```typescript
  export async function getActiveAgents(): Promise<Agent[]>
  export async function toggleAgent(agentId: string, action: 'pause' | 'resume' | 'stop'): Promise<void>
  ```

#### Agent 카드 컴포넌트
- [ ] **Agent 카드** (`components/dashboard/agent-card.tsx`)
  ```typescript
  interface AgentCardProps {
    agent: Agent;
    onToggle: (agentId: string, action: string) => void;
    onEdit: (agentId: string) => void;
    onDelete: (agentId: string) => void;
  }
  ```
- [ ] **상태 표시기** (`components/dashboard/status-indicators.tsx`)
  - Active: 녹색 점
  - Paused: 주황색 점  
  - Error: 빨간색 점
- [ ] **빠른 액션 버튼** (`components/dashboard/quick-actions.tsx`)
  - 일시정지/재개
  - 편집
  - 복제
  - 삭제

#### Agent 그리드 레이아웃
- [ ] **Agent 그리드** (`components/dashboard/agent-grid.tsx`)
- [ ] **빈 상태 처리**: Agent가 없을 때 표시할 UI
- [ ] **로딩 상태**: Agent 목록 로딩 중 표시

#### 실시간 상태 업데이트
- [ ] **Agent 스토어 슬라이스** (`store/slices/agent.ts`)
  ```typescript
  interface AgentState {
    agents: Agent[];
    isLoading: boolean;
    selectedAgent: Agent | null;
    fetchAgents: () => Promise<void>;
    updateAgentStatus: (agentId: string, status: AgentStatus) => void;
    deleteAgent: (agentId: string) => Promise<void>;
  }
  ```
- [ ] **실시간 업데이트** (폴링 또는 WebSocket)

---

### 🔹 4단계: 로그 뷰어 및 실시간 업데이트 (15:00-16:30)

#### 로그 페이지 구현
- [ ] **로그 메인 페이지** (`app/logs/page.tsx`)
- [ ] **Agent별 로그 페이지** (`app/logs/[agentId]/page.tsx`)

#### 로그 컴포넌트들
- [ ] **로그 엔트리 컴포넌트** (`components/logs/log-entry.tsx`)
  ```typescript
  interface LogEntryProps {
    log: NotificationLog;
    showAgentName?: boolean;
  }
  ```
- [ ] **로그 필터** (`components/logs/log-filter.tsx`)
  - 날짜 범위 선택
  - Agent 선택
  - 상태 필터 (성공/실패)
- [ ] **페이지네이션** (`components/logs/pagination.tsx`)

#### 로그 API 연동
- [ ] **로그 API 클라이언트** (`utils/api/logs.ts`)
  ```typescript
  export async function getLogs(
    agentId?: string, 
    filters?: LogFilters,
    pagination?: PaginationOptions
  ): Promise<PaginatedLogs>
  ```

#### 실시간 로그 업데이트
- [ ] **로그 스토어 슬라이스** (`store/slices/logs.ts`)
- [ ] **자동 새로고침**: 5초마다 최신 로그 업데이트
- [ ] **실시간 알림**: 새로운 트리거 발생 시 토스트 알림

#### 활동 타임라인
- [ ] **활동 타임라인 컴포넌트** (`components/dashboard/activity-timeline.tsx`)
  - 최근 24시간 활동 요약
  - 트리거 빈도 차트
  - 성공/실패 비율

---

### 🔹 5단계: 전체 시스템 통합 및 E2E 테스트 (16:30-18:00)

#### 시스템 통합
- [ ] **Agent 관리자에 알림 시스템 완전 통합**
- [ ] **에러 처리 고도화**
  - 알림 전송 실패 시 재시도
  - API 장애 시 graceful degradation
- [ ] **성능 최적화**
  - 불필요한 API 호출 최소화
  - 메모리 사용량 모니터링

#### End-to-End 테스트
- [ ] **완전한 플로우 테스트**
  1. 전략 생성 (자연어 → GPT → Stepper 수정)
  2. Agent 생성 및 활성화
  3. Mock 가격 데이터로 조건 충족
  4. Telegram 알림 발송 확인
  5. 대시보드에서 상태 확인
  6. 로그에서 기록 확인

#### 통합 테스트 시나리오
- [ ] **정상 케이스**
  ```
  시나리오: BTC 5% 하락 알림
  1. "BTC가 5% 떨어지면 알려줘" 입력
  2. Agent 생성 및 Telegram 설정
  3. BTC 가격 5% 하락 시뮬레이션
  4. Telegram 알림 수신 확인
  5. 쿨다운 동안 추가 알림 없음 확인
  ```

- [ ] **에러 케이스**
  ```
  시나리오: 잘못된 Chat ID
  1. 유효하지 않은 Telegram Chat ID 입력
  2. 알림 테스트 실패 확인
  3. 에러 메시지 표시 확인
  4. Agent 생성 차단 확인
  ```

#### 성능 테스트
- [ ] **다중 Agent 테스트**: 5-10개 Agent 동시 실행
- [ ] **메모리 누수 확인**: 장시간 실행 후 메모리 상태
- [ ] **API 응답 시간**: 주요 API 엔드포인트 성능 측정

#### 사용자 경험 검증
- [ ] **모바일 반응형 확인**
- [ ] **로딩 상태 UX 확인**
- [ ] **에러 메시지 명확성 확인**

---

## 📱 UI/UX 세부사항

### 대시보드 스타일
- [ ] **카드 레이아웃**: Glassmorphism 스타일 적용
- [ ] **상태별 색상 코딩**
  - Active: 초록색 (#4CAF50)
  - Paused: 주황색 (#FF9800)
  - Error: 빨간색 (#F44336)
- [ ] **호버 효과**: 카드 호버 시 약간의 확대 효과

### 로그 뷰어 스타일
- [ ] **시간순 정렬**: 최신 로그가 위에 표시
- [ ] **성공/실패 아이콘**: 직관적인 상태 표시
- [ ] **필터 UI**: 간단하고 사용하기 쉬운 필터 인터페이스

---

## ✅ Day 4 완료 기준

### 필수 완료 사항
1. **Telegram 알림 시스템 완료**: Bot 연동 및 메시지 발송 작동
2. **Agent 대시보드 완료**: Agent 목록, 상태 관리 UI 작동
3. **로그 시스템 완료**: 트리거 로그 조회 및 필터링 작동
4. **End-to-End 플로우 완료**: 전체 시스템 통합 작동 확인
5. **기본 에러 처리 완료**: 주요 에러 상황 처리

### 선택 완료 사항 (시간 여유 시)
- [ ] **고급 알림 템플릿** (커스텀 메시지)
- [ ] **실시간 WebSocket 연동**
- [ ] **알림 전송 통계** (성공률, 응답시간 등)
- [ ] **Agent 복제 기능**

---

## 🚨 리스크 관리

### 예상 이슈 및 대응
1. **Telegram Bot 설정 복잡성**
   - **대응**: 상세한 설정 가이드 제공, 테스트 API 활용
2. **실시간 업데이트 성능 이슈**
   - **대응**: 폴링 간격 조정, 효율적인 상태 관리
3. **메시지 전송 실패**
   - **대응**: 재시도 로직, 대체 알림 방법
4. **대량 로그 데이터 처리**
   - **대응**: 페이지네이션, 인덱스 최적화

---

## 📋 Day 4 체크리스트

### 알림 시스템
- [ ] Telegram Bot 연동 및 테스트
- [ ] 알림 큐 시스템 구현
- [ ] 메시지 포맷팅 및 템플릿
- [ ] 쿨다운 통합

### 대시보드 UI
- [ ] Agent 목록 표시
- [ ] 상태 관리 (일시정지/재개/중지)
- [ ] 실시간 상태 업데이트
- [ ] 반응형 디자인

### 로그 시스템
- [ ] 로그 뷰어 구현
- [ ] 필터링 및 페이지네이션
- [ ] Agent별 로그 조회
- [ ] 실시간 로그 업데이트

### 통합 테스트
- [ ] End-to-End 플로우 테스트
- [ ] 에러 케이스 테스트
- [ ] 성능 테스트
- [ ] 사용자 경험 검증

**Day 4 성공 지표**: "사용자가 대시보드에서 Agent를 관리하고, 조건 충족 시 Telegram으로 알림을 받으며, 로그에서 모든 활동을 확인할 수 있다"