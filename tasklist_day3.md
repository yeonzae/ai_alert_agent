# 📅 Day 3 개발 계획 - 가격 모니터링 시스템 구축

## 🎯 Day 3 목표
**"가격 감시 워커 및 조건 평가 시스템 완성"**
- 외부 API(CoinGecko, AlphaVantage) 연동 완성
- 실시간 가격 모니터링 워커 구현
- 전략 조건 평가 엔진 구축
- Agent 생성 및 관리 시스템 구현

---

## ⏰ 시간 배분 (8시간 기준)

| 시간대 | 작업 영역 | 예상 소요시간 |
|-------|---------|------------|
| 09:00-10:30 | 외부 가격 API 연동 | 1.5h |
| 10:30-12:00 | 조건 평가 엔진 구현 | 1.5h |
| 13:00-15:00 | Agent 관리 시스템 구현 | 2h |
| 15:00-16:30 | 가격 모니터링 워커 구현 | 1.5h |
| 16:30-18:00 | Agent 생성/제어 API 및 테스트 | 1.5h |

---

## 🔥 우선순위 Task List

### 🔹 1단계: 외부 가격 API 연동 (09:00-10:30)

#### 데이터 소스 연동
- [ ] **CoinGecko API 클라이언트** (`src/services/data-sources/coingecko.ts`)
  ```typescript
  export class CoinGeckoClient {
    async getCurrentPrice(coinId: string): Promise<PriceData>
    async getPriceHistory(coinId: string, days: number): Promise<PriceHistory[]>
    async searchCoins(query: string): Promise<CoinInfo[]>
  }
  ```
- [ ] **AlphaVantage API 클라이언트** (`src/services/data-sources/alphavantage.ts`)
  ```typescript
  export class AlphaVantageClient {
    async getQuote(symbol: string): Promise<StockData>
    async getDailyPrices(symbol: string): Promise<DailyPrice[]>
  }
  ```
- [ ] **Rate Limiter 구현** (`src/services/data-sources/rate-limiter.ts`)
  ```typescript
  export class RateLimiter {
    async throttle(key: string, maxRequests: number, windowMs: number): Promise<void>
  }
  ```

#### Price Fetcher 통합
- [ ] **가격 데이터 Fetcher** (`src/services/monitoring/price-fetcher.ts`)
  ```typescript
  interface PriceData {
    symbol: string;
    price: number;
    change24h: number;
    volume: number;
    timestamp: Date;
  }
  
  export class PriceFetcher {
    async fetchPrice(asset: string, type: 'crypto' | 'stock'): Promise<PriceData>
  }
  ```
- [ ] **에러 핸들링 및 Fallback 로직**
- [ ] **API 키 관리 및 환경 설정**

---

### 🔹 2단계: 조건 평가 엔진 구현 (10:30-12:00)

#### 조건 평가자 구현
- [ ] **조건 평가 엔진** (`src/services/monitoring/condition-evaluator.ts`)
  ```typescript
  interface EvaluationResult {
    conditionMet: boolean;
    currentValue: number;
    targetValue: number;
    message: string;
  }
  
  export class ConditionEvaluator {
    evaluatePriceChange(
      priceData: PriceData, 
      condition: PriceTrigger
    ): EvaluationResult
    
    evaluateRSI(
      priceHistory: PriceHistory[], 
      condition: RSIFilter
    ): EvaluationResult
  }
  ```

#### 기술적 지표 계산
- [ ] **RSI 계산 유틸리티** (`src/utils/helpers/technical-indicators.ts`)
  ```typescript
  export function calculateRSI(prices: number[], period: number = 14): number[]
  export function calculateSMA(prices: number[], period: number): number[]
  ```
- [ ] **가격 변동률 계산** (`src/utils/helpers/math-utils.ts`)
  ```typescript
  export function calculatePercentageChange(oldPrice: number, newPrice: number): number
  export function calculateVolatility(prices: number[]): number
  ```

#### 조건 검증 로직
- [ ] **전략 유효성 검증** (`src/models/strategy/validation.ts`)
- [ ] **조건 충족 히스토리 추적**

---

### 🔹 3단계: Agent 관리 시스템 구현 (13:00-15:00)

#### Agent 모델 완성
- [ ] **Agent 타입 정의** (`src/models/agent/types.ts`)
  ```typescript
  interface Agent {
    id: string;
    strategyId: string;
    status: 'active' | 'paused' | 'stopped' | 'error';
    config: AgentConfig;
    stats: AgentStats;
    createdAt: Date;
    lastTriggered?: Date;
  }
  
  interface AgentStats {
    totalTriggers: number;
    lastTriggerValue: number;
    averageInterval: number;
    errorCount: number;
  }
  ```

#### Agent 상태 관리자
- [ ] **Agent 상태 관리** (`src/models/agent/state-manager.ts`)
  ```typescript
  export class AgentStateManager {
    createAgent(strategyId: string, config: AgentConfig): Promise<Agent>
    updateStatus(agentId: string, status: AgentStatus): Promise<void>
    getActiveAgents(): Promise<Agent[]>
    cleanupInactiveAgents(): Promise<void>
  }
  ```

#### Agent 라이프사이클
- [ ] **Agent 라이프사이클 관리** (`src/models/agent/lifecycle.ts`)
  ```typescript
  export class AgentLifecycle {
    start(agentId: string): Promise<void>
    pause(agentId: string): Promise<void>
    stop(agentId: string): Promise<void>
    restart(agentId: string): Promise<void>
  }
  ```

#### Agent 데이터베이스
- [ ] **Agent 리포지토리** (`src/db/repositories/agent.ts`)
- [ ] **Agent 테이블 마이그레이션**

---

### 🔹 4단계: 가격 모니터링 워커 구현 (15:00-16:30)

#### 모니터링 워커
- [ ] **Agent 관리자** (`src/services/monitoring/agent-manager.ts`)
  ```typescript
  export class AgentManager {
    private activeAgents = new Map<string, NodeJS.Timeout>();
    
    startMonitoring(agent: Agent): void
    stopMonitoring(agentId: string): void
    pauseMonitoring(agentId: string): void
    getMonitoringStatus(): MonitoringStatus[]
  }
  ```

#### 모니터링 루프
- [ ] **모니터링 스케줄러** (`src/services/monitoring/scheduler.ts`)
  ```typescript
  export class MonitoringScheduler {
    scheduleAgent(agent: Agent, intervalMs: number): void
    unscheduleAgent(agentId: string): void
    rescheduleAgent(agentId: string, newInterval: number): void
  }
  ```

#### 쿨다운 관리자
- [ ] **쿨다운 관리** (`src/services/monitoring/cooldown-manager.ts`)
  ```typescript
  export class CooldownManager {
    isInCooldown(agentId: string): boolean
    setCooldown(agentId: string, durationMs: number): void
    getCooldownRemaining(agentId: string): number
  }
  ```

#### 메모리 최적화
- [ ] **메모리 관리**: 가격 데이터 캐시 및 정리
- [ ] **성능 모니터링**: 워커 성능 추적

---

### 🔹 5단계: Agent 생성/제어 API 및 테스트 (16:30-18:00)

#### Agent API 구현
- [ ] **Agent 생성 API** (`src/routes/agents/create.ts`)
  ```typescript
  POST /agents
  Body: {
    strategyId: string;
    config: {
      monitoringInterval: number; // 기본값: 60초
      notifications: NotificationConfig;
    }
  }
  Response: { agentId: string, status: 'active' }
  ```

- [ ] **Agent 제어 API** (`src/routes/agents/lifecycle.ts`)
  ```typescript
  GET /agents -> 활성 에이전트 목록
  DELETE /agents/:id -> 에이전트 중지
  PUT /agents/:id/pause -> 일시정지
  PUT /agents/:id/resume -> 재개
  ```

- [ ] **Agent 로그 API** (`src/routes/agents/logs.ts`)
  ```typescript
  GET /logs/:agentId -> 에이전트별 트리거 로그
  ```

#### 로그 시스템
- [ ] **알림 로그 모델** (`src/models/notification/types.ts`)
  ```typescript
  interface NotificationLog {
    id: string;
    agentId: string;
    triggeredAt: Date;
    condition: string;
    currentValue: number;
    targetValue: number;
    status: 'sent' | 'failed' | 'pending';
    channel: 'telegram' | 'email';
  }
  ```
- [ ] **로그 리포지토리** (`src/db/repositories/notification.ts`)

#### 통합 테스트
- [ ] **전체 파이프라인 테스트**
  1. 전략 생성 → Agent 생성
  2. 가격 데이터 Mock으로 조건 충족 시뮬레이션
  3. 조건 평가 → 로그 기록 확인
- [ ] **성능 테스트**: 여러 Agent 동시 실행
- [ ] **에러 복구 테스트**: API 장애 시 Agent 동작

---

## 📊 모니터링 시스템 아키텍처

### 데이터 흐름
```
[외부 API] → [PriceFetcher] → [ConditionEvaluator] → [NotificationQueue]
     ↓              ↓                ↓                    ↓
[RateLimiter] → [Cache] → [AgentManager] → [NotificationLog]
```

### 에러 처리 전략
- [ ] **Circuit Breaker**: API 장애 시 자동 차단
- [ ] **Exponential Backoff**: 재시도 간격 점진 증가
- [ ] **Graceful Degradation**: 부분 서비스 장애 시 대응

---

## ✅ Day 3 완료 기준

### 필수 완료 사항
1. **외부 API 연동 완료**: CoinGecko, AlphaVantage 가격 데이터 수집
2. **조건 평가 엔진 완료**: 가격 변동, RSI 등 조건 평가 작동
3. **Agent 관리 시스템 완료**: Agent 생성/시작/중지 기능
4. **모니터링 워커 완료**: 실시간 가격 감시 및 조건 검증
5. **로그 시스템 완료**: 트리거 이벤트 기록 및 조회

### 선택 완료 사항 (시간 여유 시)
- [ ] **고급 기술적 지표** (MACD, 볼린저 밴드 등)
- [ ] **성능 최적화** (캐싱, 배치 처리)
- [ ] **모니터링 대시보드** (Agent 상태 실시간 확인)
- [ ] **Alert 우선순위 시스템**

---

## 🚨 리스크 관리

### 예상 이슈 및 대응
1. **외부 API Rate Limit**
   - **대응**: Rate Limiter 구현, 캐싱 활용
2. **메모리 사용량 증가**
   - **대응**: 주기적 메모리 정리, 데이터 제한
3. **동시성 문제**
   - **대응**: 간단한 구조 유지, 락 메커니즘
4. **API 키 만료/오류**
   - **대응**: Fallback API, 에러 알림

### 성능 고려사항
- **기본 모니터링 주기**: 60초 (free tier)
- **동시 Agent 제한**: 초기 10개
- **가격 데이터 캐시**: 30초 TTL
- **로그 데이터 보관**: 30일

---

## 📋 Day 3 체크리스트

### 외부 API 연동
- [ ] CoinGecko API 클라이언트 구현 및 테스트
- [ ] AlphaVantage API 클라이언트 구현 및 테스트
- [ ] Rate Limiting 및 에러 핸들링

### 조건 평가 시스템
- [ ] 가격 변동 평가 로직
- [ ] RSI 계산 및 평가 로직
- [ ] 조건 평가 엔진 통합

### Agent 관리
- [ ] Agent 모델 및 상태 관리
- [ ] Agent 라이프사이클 관리
- [ ] 데이터베이스 저장 및 조회

### 모니터링 워커
- [ ] 실시간 모니터링 구현
- [ ] 쿨다운 관리 구현
- [ ] 성능 최적화

### API 및 로그
- [ ] Agent CRUD API 구현
- [ ] 로그 시스템 구현
- [ ] 전체 시스템 통합 테스트

**Day 3 성공 지표**: "사용자가 전략으로 Agent를 생성하면, 실시간으로 가격을 감시하고 조건 충족 시 로그에 기록된다"