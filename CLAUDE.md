# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AlertAgent is a no-code alert agent builder that allows users to create monitoring strategies using natural language. Users can set up alerts for stock prices, news, and economic indicators without coding.

**Current Status**: This is a planning repository containing PRD, design concepts, and wireframes. No code has been implemented yet.

## Architecture (MVP Spec)

### Tech Stack
- **Frontend**: Next.js 13+ (App Router) with Zustand for state management
- **Backend**: Express.js with TypeScript
- **Database**: SQLite or Lowdb (file-based JSON DB for MVP)
- **LLM Integration**: GPT-4 for natural language to strategy conversion
- **Real-time Monitoring**: Node.js setInterval-based workers
- **Notifications**: Telegram Bot API only (MVP focus)
- **Task Queue**: Simple in-memory management for MVP

### Core Components
- **Natural Language Processor**: Converts user prompts to typed JSON strategy definitions
- **Card-based Stepper Form**: 4-step wizard (Trigger → Filter → Action → Risk)
- **Real-time Monitor**: Async workers watching price/news/economic data
- **Notification System**: Multi-channel alert delivery
- **Strategy Dashboard**: Management interface for created agents

### Key API Endpoints
- `POST /ai/strategy/draft` - Convert natural language to strategy JSON
- `GET/POST /strategies` - Strategy CRUD operations
- `POST /agents` - Create and start monitoring agent
- `GET/DELETE /agents` - Agent lifecycle management
- `GET /logs/:agentId` - Retrieve trigger/alert history
- `POST /notifications/test` - Test notification channels

## Development Guidelines

### UI/UX Design System
- **Visual Style**: Glassmorphism with pastel accents
- **Typography**: Playfair Display (serif) for titles, Inter (sans-serif) for UI
- **Color Coding**: 
  - Price triggers: Pastel Blue
  - News triggers: Pastel Teal  
  - Economic indicators: Pastel Orange
  - Actions: Pastel Green
  - Risk settings: Pastel Red

### Data Models (Planned)
- **Strategy**: Core strategy definition with nodes/edges
- **Agent**: Active monitoring instance of a strategy
- **Notification**: Alert delivery records
- **User**: Basic user authentication

### Security Constraints
- No API keys required for basic functionality
- Uses public data sources only
- Minimal user data collection
- 30-second to 1-minute monitoring intervals (free tier)

## Project Structure

### Backend (Express.js + TypeScript) - Modular Architecture
```
src/
├── index.ts                    # Server entry point (~30 lines)
├── config/
│   ├── database.ts            # DB connection setup
│   ├── environment.ts         # Environment variables
│   └── express.ts             # Express middleware setup
├── routes/
│   ├── index.ts              # Route aggregation
│   ├── strategies/
│   │   ├── create.ts         # POST /strategies
│   │   ├── read.ts           # GET /strategies
│   │   └── update.ts         # PUT /strategies/:id
│   ├── agents/
│   │   ├── create.ts         # POST /agents
│   │   ├── lifecycle.ts      # GET/DELETE /agents
│   │   └── logs.ts           # GET /logs/:agentId
│   ├── ai/
│   │   └── strategy-draft.ts # POST /ai/strategy/draft
│   └── notifications/
│       └── test.ts           # POST /notifications/test
├── services/
│   ├── ai/
│   │   ├── gpt-client.ts     # GPT API wrapper
│   │   ├── prompt-templates.ts # System prompts
│   │   └── strategy-parser.ts # Parse GPT response
│   ├── notifications/
│   │   ├── telegram.ts       # Telegram API wrapper
│   │   ├── message-formatter.ts # Alert message templates
│   │   └── notification-queue.ts # Queue management
│   ├── monitoring/
│   │   ├── price-fetcher.ts  # External API calls
│   │   ├── condition-evaluator.ts # Strategy condition checks
│   │   ├── agent-manager.ts  # Agent lifecycle
│   │   └── cooldown-manager.ts # Rate limiting
│   └── data-sources/
│       ├── coingecko.ts      # Crypto price API
│       ├── alphavantage.ts   # Stock price API
│       └── rate-limiter.ts   # API call throttling
├── models/
│   ├── strategy/
│   │   ├── types.ts          # Strategy interfaces
│   │   ├── validation.ts     # Input validation
│   │   └── serialization.ts  # JSON serialization
│   ├── agent/
│   │   ├── types.ts          # Agent interfaces
│   │   ├── state-manager.ts  # Agent state tracking
│   │   └── lifecycle.ts      # Start/stop operations
│   └── notification/
│       ├── types.ts          # Notification interfaces
│       └── history.ts        # Notification logging
├── db/
│   ├── migrations/           # Database schema changes
│   ├── repositories/
│   │   ├── strategy.ts       # Strategy data access
│   │   ├── agent.ts          # Agent data access
│   │   └── notification.ts   # Log data access
│   ├── connection.ts         # DB connection manager
│   └── seeds/               # Test data
└── utils/
    ├── validation/
    │   ├── strategy.ts       # Strategy validation rules
    │   └── api-input.ts      # Request validation
    ├── errors/
    │   ├── types.ts          # Custom error classes
    │   └── handlers.ts       # Error handling middleware
    └── helpers/
        ├── date-utils.ts     # Date manipulation
        ├── math-utils.ts     # Percentage calculations
        └── logger.ts         # Structured logging
```

### Frontend (Next.js 13+) - Component-First Architecture
```
app/
├── layout.tsx                 # Root layout
├── page.tsx                   # Landing page
├── globals.css               # Global styles
├── strategies/
│   ├── layout.tsx            # Strategy section layout
│   ├── page.tsx              # Strategy list
│   └── new/
│       ├── page.tsx          # Strategy creation entry
│       └── components/       # Page-specific components
├── dashboard/
│   ├── page.tsx              # Active agents dashboard
│   └── components/
│       ├── agent-card.ts     # Individual agent display
│       ├── status-toggle.tsx # Agent on/off switch
│       └── quick-actions.tsx # Stop/edit/clone buttons
├── logs/
│   ├── page.tsx              # Log viewer entry
│   ├── [agentId]/
│   │   └── page.tsx          # Agent-specific logs
│   └── components/
│       ├── log-entry.tsx     # Single log item
│       ├── log-filter.tsx    # Date/type filtering
│       └── pagination.tsx    # Log navigation
└── api/                      # Client-side API modules
    ├── strategies.ts         # Strategy API calls
    ├── agents.ts             # Agent API calls
    ├── ai.ts                 # GPT integration
    └── notifications.ts      # Notification testing

components/
├── ui/                       # Reusable UI components
│   ├── button.tsx           # Button variants
│   ├── card.tsx             # Glass card component
│   ├── input.tsx            # Form inputs
│   ├── toast.tsx            # Notification toasts
│   └── loading.tsx          # Loading states
├── forms/                   # Form components
│   ├── strategy-prompt.tsx  # Natural language input
│   ├── condition-inputs/    # Trigger/filter forms
│   │   ├── price-trigger.tsx
│   │   ├── rsi-filter.tsx
│   │   └── time-range.tsx
│   ├── action-inputs/       # Action configuration
│   │   ├── telegram-setup.tsx
│   │   └── notification-test.tsx
│   └── risk-inputs/         # Risk management
│       ├── cooldown-selector.tsx
│       └── alert-limits.tsx
├── stepper/                 # Multi-step wizard
│   ├── stepper-wrapper.tsx  # Main stepper container
│   ├── step-header.tsx      # Progress indicator
│   ├── step-navigation.tsx  # Back/next buttons
│   └── steps/               # Individual step components
│       ├── trigger-step.tsx
│       ├── filter-step.tsx
│       ├── action-step.tsx
│       └── risk-step.tsx
├── preview/                 # Strategy preview
│   ├── preview-card.tsx     # Main preview container
│   ├── condition-summary.tsx # Condition display
│   ├── channel-indicators.tsx # Notification channels
│   └── mini-chart.tsx       # Mock chart display
├── dashboard/               # Dashboard components
│   ├── agent-grid.tsx       # Agent card layout
│   ├── status-indicators.tsx # Visual status badges
│   └── activity-timeline.tsx # Recent activity
└── animations/              # Animation components
    ├── slide-transition.tsx # Step transitions
    ├── fade-in.tsx          # Content loading
    └── glassmorphism.tsx    # Glass effect utilities

hooks/
├── useStrategy.ts           # Strategy state management
├── useAgent.ts              # Agent operations
├── useStepper.ts            # Stepper navigation
├── useNotification.ts       # Toast notifications
├── useLocalStorage.ts       # Persistent storage
└── useApi.ts                # API error handling

store/
├── slices/
│   ├── strategy.ts          # Strategy store slice
│   ├── agent.ts             # Agent store slice
│   ├── stepper.ts           # Stepper state slice
│   └── ui.ts                # UI state (modals, loading)
├── index.ts                 # Store configuration
└── middleware/
    ├── persistence.ts       # LocalStorage sync
    └── logger.ts            # Development logging

types/
├── api.ts                   # API request/response types
├── strategy.ts              # Strategy domain types
├── agent.ts                 # Agent domain types
├── notification.ts          # Notification types
└── ui.ts                    # UI component props

utils/
├── validation/
│   ├── strategy-rules.ts    # Client-side validation
│   └── form-schemas.ts      # Zod schemas
├── formatting/
│   ├── currency.ts          # Price formatting
│   ├── dates.ts             # Date display
│   └── percentages.ts       # Percentage display
├── api/
│   ├── client.ts            # Axios configuration
│   ├── error-handler.ts     # API error processing
│   └── retry.ts             # Request retry logic
└── constants/
    ├── colors.ts            # Theme colors
    ├── animations.ts        # Animation settings
    └── api-endpoints.ts     # API URLs
```

## Development Best Practices

### File Size Guidelines
- **Maximum file size**: 200 lines per file
- **Target size**: 50-100 lines per file
- **Single responsibility**: Each file handles one specific concern
- **Modular imports**: Prefer named exports for better tree-shaking

### Code Organization Principles
1. **Domain-driven structure**: Group by feature, not by file type
2. **Shallow nesting**: Maximum 3 levels deep in folder structure
3. **Clear naming**: File names should indicate exact purpose
4. **Dependency injection**: Use dependency injection for better testability
5. **Error boundaries**: Isolate errors within specific modules

### Development Commands

### Backend Setup
```bash
npm init -y
npm install express typescript @types/node @types/express
npm install sqlite3 better-sqlite3 zod  # DB + validation
npm install axios dotenv winston         # HTTP + config + logging
npm install jest @types/jest ts-jest     # Testing
npm run dev    # Start development server
npm test       # Run test suite
npm run lint   # ESLint + Prettier
npm run build  # TypeScript compilation
```

### Frontend Setup  
```bash
npx create-next-app@latest --typescript --tailwind --app
npm install zustand axios zod          # State + HTTP + validation
npm install lucide-react framer-motion # Icons + animations
npm install @testing-library/react vitest # Testing
npm run dev      # Start development server
npm run build    # Production build
npm run test     # Run component tests
npm run lint     # ESLint + type checking
```

## Development Tasks (1-Week Sprint)

### MVP Feature Scope
- ✅ Natural language strategy generation (GPT integration)
- ✅ Card-based Stepper UI (4-step wizard)
- ✅ Strategy save/load functionality
- ✅ Price monitoring (crypto/stocks via free APIs)
- ✅ Telegram notifications only
- ✅ Agent lifecycle management
- ✅ Real-time trigger logs
- ❌ News/economic indicators (Phase 2)
- ❌ Strategy sharing (Phase 2)
- ❌ Backtesting features (Phase 2)

### Task Distribution
- **Backend (3.5 days)**: Server setup, LLM API, monitoring logic, Telegram integration
- **Frontend (3.5 days)**: Stepper UI, state management, dashboard, API integration
- **Integration (0.5 days)**: End-to-end testing, Docker setup

## Key Files
- `PRD.md`: Complete product requirements document
- `DESIGN_CONCEPT.md`: UI/UX design specifications with glassmorphism details
- `SCREEN_MERMAID`: Screen flow and API interaction diagrams
- `tasklist_backend.md`: Detailed backend development checklist
- `tasklist_frontend.md`: Frontend component and feature breakdown

## Environment Setup
- `.env` variables: GPT_API_KEY, TELEGRAM_BOT_TOKEN
- Free APIs: CoinGecko (crypto), AlphaVantage (stocks)
- Docker deployment ready