# 📅 Day 6 개발 계획 - 배포 준비 및 고급 기능

## 🎯 Day 6 목표
**"배포 준비 완료 및 사용자 경험 향상을 위한 고급 기능 구현"**
- Docker 컨테이너화 및 배포 환경 구축
- 환경 변수 및 설정 관리 시스템 구현
- 전략 복제/공유 기능 구현
- 백업 및 데이터 내보내기 기능 추가
- 모니터링 및 헬스체크 시스템 구축

---

## ⏰ 시간 배분 (8시간 기준)

| 시간대 | 작업 영역 | 예상 소요시간 |
|-------|---------|------------|
| 09:00-10:30 | Docker 설정 및 배포 환경 구축 | 1.5h |
| 10:30-12:00 | 환경 변수 및 설정 관리 시스템 | 1.5h |
| 13:00-15:00 | 전략 복제/공유 및 백업 기능 | 2h |
| 15:00-16:30 | 모니터링 및 헬스체크 시스템 | 1.5h |
| 16:30-18:00 | 배포 테스트 및 문서 작성 | 1.5h |

---

## 🔥 우선순위 Task List

### 🔹 1단계: Docker 설정 및 배포 환경 구축 (09:00-10:30)

#### Backend Docker 설정
- [ ] **Backend Dockerfile** (`ai-alert-backend/Dockerfile`)
  ```dockerfile
  FROM node:20-alpine
  
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  
  COPY dist ./dist
  COPY src/db/migrations ./src/db/migrations
  
  EXPOSE 3001
  CMD ["npm", "start"]
  ```
- [ ] **Docker Compose 설정** (`docker-compose.yml`)
  ```yaml
  version: '3.8'
  services:
    backend:
      build: ./ai-alert-backend
      ports:
        - "3001:3001"
      environment:
        - NODE_ENV=production
        - DATABASE_URL=file:./data/alerts.db
      volumes:
        - ./data:/app/data
    
    frontend:
      build: ./ai-alert-frontend
      ports:
        - "3000:3000"
      environment:
        - NEXT_PUBLIC_API_URL=http://localhost:3001
  ```

#### Frontend Docker 설정
- [ ] **Frontend Dockerfile** (`ai-alert-frontend/Dockerfile`)
  ```dockerfile
  FROM node:20-alpine AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build
  
  FROM node:20-alpine
  WORKDIR /app
  COPY --from=builder /app/.next ./.next
  COPY --from=builder /app/public ./public
  COPY --from=builder /app/package*.json ./
  RUN npm ci --only=production
  EXPOSE 3000
  CMD ["npm", "start"]
  ```

#### 배포 스크립트
- [ ] **빌드 스크립트** (`scripts/build.sh`)
  ```bash
  #!/bin/bash
  echo "Building AlertAgent..."
  cd ai-alert-backend && npm run build
  cd ../ai-alert-frontend && npm run build
  docker-compose build
  ```
- [ ] **배포 스크립트** (`scripts/deploy.sh`)
- [ ] **헬스체크 스크립트** (`scripts/healthcheck.sh`)

---

### 🔹 2단계: 환경 변수 및 설정 관리 시스템 (10:30-12:00)

#### 환경 설정 통합 관리
- [ ] **Backend 환경 설정** (`src/config/environment.ts`)
  ```typescript
  interface Config {
    port: number;
    database: {
      path: string;
      maxConnections: number;
    };
    apis: {
      openai: {
        apiKey: string;
        model: string;
      };
      telegram: {
        botToken: string;
      };
      coingecko: {
        baseUrl: string;
        rateLimit: number;
      };
      alphaVantage: {
        apiKey: string;
        rateLimit: number;
      };
    };
    monitoring: {
      defaultInterval: number;
      maxConcurrentAgents: number;
    };
  }
  
  export const config = loadConfig();
  ```

#### 설정 유효성 검증
- [ ] **설정 검증 스키마** (`src/config/validation.ts`)
  ```typescript
  import { z } from 'zod';
  
  const configSchema = z.object({
    port: z.number().min(1000).max(65535),
    apis: z.object({
      openai: z.object({
        apiKey: z.string().min(1, "OpenAI API key is required")
      }),
      telegram: z.object({
        botToken: z.string().min(1, "Telegram bot token is required")
      })
    })
  });
  ```

#### Frontend 환경 설정
- [ ] **환경별 설정 파일**
  - `.env.local` (개발환경)
  - `.env.production` (운영환경)
  - `.env.example` (예시)
- [ ] **Runtime 환경 변수 검증**

#### 설정 관리 UI
- [ ] **설정 페이지** (`app/settings/page.tsx`)
  ```typescript
  interface SettingsPageProps {}
  
  const SettingsPage = () => (
    <div className="container mx-auto p-6">
      <h1>시스템 설정</h1>
      <ApiKeySettings />
      <NotificationSettings />
      <MonitoringSettings />
    </div>
  );
  ```
- [ ] **API 키 설정 컴포넌트** (`components/settings/api-key-settings.tsx`)
- [ ] **알림 설정 컴포넌트** (`components/settings/notification-settings.tsx`)

---

### 🔹 3단계: 전략 복제/공유 및 백업 기능 (13:00-15:00)

#### 전략 복제 기능
- [ ] **전략 복제 API** (`src/routes/strategies/clone.ts`)
  ```typescript
  POST /strategies/:id/clone
  Body: {
    name: string;
    modifications?: Partial<Strategy>;
  }
  Response: { clonedStrategy: Strategy }
  ```
- [ ] **전략 복제 서비스** (`src/services/strategy/cloner.ts`)
  ```typescript
  export class StrategyCloner {
    async cloneStrategy(
      originalId: string, 
      newName: string, 
      modifications?: Partial<Strategy>
    ): Promise<Strategy>
  }
  ```

#### 전략 템플릿 시스템
- [ ] **인기 전략 템플릿** (`src/data/strategy-templates.ts`)
  ```typescript
  export const strategyTemplates: StrategyTemplate[] = [
    {
      id: 'btc-dip-buy',
      name: 'BTC 하락 매수 기회',
      description: 'BTC가 5% 이상 하락하고 RSI가 30 이하일 때 알림',
      strategy: { /* 미리 정의된 전략 */ },
      category: 'crypto',
      popularity: 95
    },
    // 더 많은 템플릿...
  ];
  ```
- [ ] **템플릿 선택 UI** (`components/strategies/template-picker.tsx`)
- [ ] **템플릿 미리보기** (전략 생성 시 빠른 시작)

#### 전략 내보내기/가져오기
- [ ] **전략 내보내기 API** (`src/routes/strategies/export.ts`)
  ```typescript
  GET /strategies/:id/export
  Response: {
    version: '1.0',
    strategy: Strategy,
    exportedAt: Date,
    metadata: ExportMetadata
  }
  ```
- [ ] **전략 가져오기 API** (`src/routes/strategies/import.ts`)
- [ ] **JSON 파일 다운로드/업로드** UI

#### 백업 시스템
- [ ] **데이터 백업 API** (`src/routes/admin/backup.ts`)
  ```typescript
  POST /admin/backup
  Response: { backupId: string, downloadUrl: string }
  ```
- [ ] **자동 백업 스케줄러** (`src/services/backup/scheduler.ts`)
- [ ] **백업 복구 기능**

---

### 🔹 4단계: 모니터링 및 헬스체크 시스템 (15:00-16:30)

#### 시스템 헬스체크
- [ ] **헬스체크 엔드포인트** (`src/routes/health/index.ts`)
  ```typescript
  GET /health
  Response: {
    status: 'healthy' | 'degraded' | 'unhealthy',
    timestamp: Date,
    services: {
      database: ServiceStatus,
      externalApis: ApiStatus[],
      activeAgents: AgentStatus
    },
    uptime: number,
    version: string
  }
  ```

#### 시스템 메트릭스
- [ ] **메트릭 수집기** (`src/services/monitoring/metrics-collector.ts`)
  ```typescript
  export class MetricsCollector {
    getSystemMetrics(): SystemMetrics
    getAgentMetrics(): AgentMetrics
    getApiMetrics(): ApiMetrics
  }
  ```
- [ ] **성능 모니터링**
  - API 응답 시간
  - 메모리 사용량
  - Active Agent 수
  - 알림 전송 성공률

#### 로그 관리 시스템
- [ ] **구조화된 로깅** (`src/utils/logger/structured-logger.ts`)
  ```typescript
  export class StructuredLogger {
    info(message: string, context: LogContext): void
    warn(message: string, context: LogContext): void
    error(message: string, error: Error, context: LogContext): void
  }
  ```
- [ ] **로그 레벨 관리** (개발/운영 환경별)
- [ ] **로그 로테이션 및 보관**

#### 알림 시스템 모니터링
- [ ] **알림 전송 통계** (`src/services/monitoring/notification-stats.ts`)
  ```typescript
  interface NotificationStats {
    totalSent: number;
    successRate: number;
    averageDeliveryTime: number;
    failureReasons: { [reason: string]: number };
  }
  ```
- [ ] **실패한 알림 재시도 관리**
- [ ] **알림 채널 상태 모니터링**

#### 관리자 대시보드
- [ ] **시스템 상태 페이지** (`app/admin/status/page.tsx`)
  ```typescript
  const AdminStatusPage = () => (
    <div className="admin-dashboard">
      <SystemOverview />
      <ActiveAgentsMonitor />
      <ApiStatusMonitor />
      <RecentAlerts />
    </div>
  );
  ```
- [ ] **실시간 메트릭 차트** (Chart.js 또는 Recharts 활용)
- [ ] **시스템 제어 패널** (Agent 일괄 제어, 시스템 재시작 등)

---

### 🔹 5단계: 배포 테스트 및 문서 작성 (16:30-18:00)

#### 배포 환경 테스트
- [ ] **Docker 컨테이너 빌드 및 실행 테스트**
  ```bash
  # 빌드 테스트
  docker-compose build
  
  # 실행 테스트
  docker-compose up -d
  
  # 헬스체크
  curl http://localhost:3001/health
  curl http://localhost:3000
  ```

#### 통합 테스트 (Production-like 환경)
- [ ] **전체 플로우 테스트** (실제 API 키 사용)
  1. 전략 생성 → GPT API 호출 확인
  2. Agent 생성 → 실제 가격 API 호출 확인
  3. Telegram 알림 → 실제 메시지 발송 확인
- [ ] **부하 테스트** (여러 Agent 동시 실행)
- [ ] **장애 복구 테스트** (API 장애, DB 장애 시나리오)

#### 운영 문서 작성
- [ ] **배포 가이드** (`docs/DEPLOYMENT.md`)
  ```markdown
  # AlertAgent 배포 가이드
  
  ## 사전 요구사항
  - Docker & Docker Compose
  - OpenAI API Key
  - Telegram Bot Token
  
  ## 배포 단계
  1. 환경 변수 설정
  2. Docker 이미지 빌드
  3. 서비스 시작
  4. 헬스체크 확인
  ```

- [ ] **운영 가이드** (`docs/OPERATIONS.md`)
  - 모니터링 방법
  - 백업 및 복구 절차
  - 장애 대응 가이드
  - 성능 튜닝 가이드

- [ ] **API 문서 업데이트** (`docs/API.md`)
  - 모든 엔드포인트 문서화
  - 요청/응답 예시
  - 에러 코드 정의

#### 사용자 매뉴얼
- [ ] **사용자 가이드** (`docs/USER_GUIDE.md`)
  - 첫 사용자 온보딩
  - 전략 생성 가이드
  - Telegram 설정 방법
  - 문제 해결 FAQ

- [ ] **개발자 가이드** (`docs/DEVELOPMENT.md`)
  - 로컬 개발 환경 설정
  - 아키텍처 개요
  - 코드 컨벤션
  - 기여 방법

---

## 🔧 배포 환경 구성

### 환경별 설정
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    environment:
      - NODE_ENV=${NODE_ENV:-production}
      - LOG_LEVEL=${LOG_LEVEL:-info}
      - MAX_CONCURRENT_AGENTS=${MAX_CONCURRENT_AGENTS:-10}
    restart: unless-stopped
    
  frontend:
    environment:
      - NEXT_PUBLIC_API_URL=${API_URL}
    restart: unless-stopped
```

### 보안 고려사항
- [ ] **API 키 보안 저장** (환경 변수, Docker secrets)
- [ ] **HTTPS 설정** (리버스 프록시 또는 인증서)
- [ ] **CORS 설정** (운영 환경 도메인)
- [ ] **Rate Limiting** (API 남용 방지)

---

## ✅ Day 6 완료 기준

### 필수 완료 사항
1. **Docker 배포 환경 완료**: 컨테이너화 및 compose 설정
2. **환경 설정 관리 완료**: 환경별 설정 및 검증 시스템
3. **전략 복제/백업 완료**: 사용자 편의 기능 구현
4. **모니터링 시스템 완료**: 헬스체크 및 메트릭 수집
5. **운영 문서 완료**: 배포 및 운영 가이드

### 선택 완료 사항 (시간 여유 시)
- [ ] **CI/CD 파이프라인** (GitHub Actions)
- [ ] **로그 집계 시스템** (ELK Stack 연동)
- [ ] **고급 모니터링** (Prometheus, Grafana)
- [ ] **전략 평가 시스템** (성과 추적)

---

## 🚨 리스크 관리

### 예상 이슈 및 대응
1. **Docker 빌드 실패**
   - **대응**: 단계별 빌드 확인, 의존성 문제 해결
2. **환경 변수 관리 복잡성**
   - **대응**: 설정 검증 시스템, 명확한 문서화
3. **배포 환경과 개발 환경 차이**
   - **대응**: 동일한 Docker 환경 사용, 통합 테스트
4. **성능 이슈 (메모리, CPU)**
   - **대응**: 리소스 제한 설정, 모니터링 강화

---

## 📋 Day 6 체크리스트

### 배포 환경
- [ ] Backend Docker 설정 및 빌드
- [ ] Frontend Docker 설정 및 빌드
- [ ] Docker Compose 통합 설정
- [ ] 배포 스크립트 작성

### 환경 관리
- [ ] 환경 변수 통합 관리
- [ ] 설정 검증 시스템
- [ ] 환경별 설정 파일
- [ ] 설정 관리 UI

### 고급 기능
- [ ] 전략 복제 기능
- [ ] 전략 템플릿 시스템
- [ ] 백업/복구 시스템
- [ ] 데이터 내보내기/가져오기

### 모니터링
- [ ] 헬스체크 API
- [ ] 시스템 메트릭 수집
- [ ] 알림 통계 및 모니터링
- [ ] 관리자 대시보드

### 문서 및 테스트
- [ ] 배포 가이드 작성
- [ ] 운영 매뉴얼 작성
- [ ] API 문서 완성
- [ ] 통합 테스트 및 배포 검증

**Day 6 성공 지표**: "Docker로 완전히 컨테이너화된 AlertAgent를 운영 환경에 배포할 수 있고, 모니터링 및 관리 시스템이 정상 동작한다"