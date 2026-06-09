# TradeFXBook — AI-Powered Trading Journal & Analytics Platform

A full-stack, production-ready trading journal & analytics SaaS web application built with Next.js 14, Express, PostgreSQL, and OpenAI GPT-4o. 
Provides a comprehensive suite of tools for traders to track, analyze, and improve their performance using AI-driven insights — entirely for free.

🔗 **GitHub**: [github.com/KarnavPatel11/TradeFXBook](https://github.com/KarnavPatel11/TradeFXBook)

## Features

- **Advanced Dashboard** — Track P&L, Win Rate, Profit Factor, equity curves, and calendar heatmaps
- **Trade Journal** — Comprehensive logging with screenshot support, tags, emotional tracking, and ratings
- **Analytics Engine** — Performance breakdowns by day, session, symbol, hour, drawdown curves, and distribution charts
- **MT4/MT5 Integration** — Connect and sync MetaTrader accounts seamlessly via MetaApi SDK
- **Backtesting Simulator** — Replay historical markets with candlestick charts across 7 timeframes (1m–1W)
- **AI Reports** — GPT-4o-powered trading performance analysis with psychology and strategy adherence reports
- **Community Hub** — Real-time Socket.io chat with channels, typing indicators, and trade sharing
- **Global Leaderboard** — Compete with traders and generate verified share cards
- **Economic Calendar** — Track high-impact fundamental events

## AI & Machine Learning Features

### OpenAI GPT-4o Integration
- **AI Trading Coach Reports** — Sends structured trade summary (win rate, profit factor, P&L by symbol/session, mistake tags) to GPT-4o which returns:
  - Letter grade (A–F) and overall score (0–100)
  - 3-paragraph performance summary
  - Strengths & weaknesses arrays
  - Personalized 5-step improvement plan

### Pattern Detection & Psychology Analysis
- **Revenge Trading Detection** — Identifies instances of rapid consecutive trades after losses
- **Emotional Pattern Analysis** — Correlates emotional states (calm, anxious, confident) with P&L outcomes
- **Overtrading Detection** — Flags excessive trading frequency using threshold analysis

### ML-Inspired Statistical Analytics
- **Equity Curve Modeling** — Cumulative sum tracking for portfolio growth visualization
- **Drawdown Analysis** — Peak-to-trough algorithm computing max drawdown ($) and max drawdown (%)
- **Win/Loss Streak Detection** — Sequential pattern analysis for behavioral pattern recognition
- **Performance Clustering** — Groups performance by symbol, session, day-of-week, and hour-of-day
- **Expectancy Modeling** — `(Win% × Avg Win) - (Loss% × Avg Loss)` per-trade expected value
- **Risk Analysis Scoring** — Lot size consistency, stop loss adherence %, position sizing grades

### AI Integration Flow
```
User → Generate Report → Backend fetches trades → Computes statistical summary
→ Sends to OpenAI GPT-4o → Returns structured JSON report
→ Stored in PostgreSQL → Rendered as interactive report card
```

## Tech Stack

### Frontend
- Next.js 14 (App Router) + React 18
- TypeScript
- Tailwind CSS + Framer Motion (Animations)
- Zustand (State Management)
- Recharts & TradingView Lightweight Charts (Data Visualization)
- Radix UI (Accessible Components)
- Lucide React (Icons)

### Backend
- Node.js & Express.js + TypeScript
- Prisma ORM + PostgreSQL
- Redis (Caching)
- Socket.io (Real-time WebSockets)
- JWT Authentication with Refresh Tokens
- Zod (Schema Validation)
- Rate Limiting on AI Endpoints

### AI / ML
- OpenAI GPT-4o API (Trading Reports, Psychology Analysis)
- Statistical Pattern Detection (Revenge Trading, Streaks, Overtrading)
- Heuristic-based Risk Scoring & Emotional Analysis

### Integrations
- MetaApi SDK (MT4/MT5 Broker Sync)
- Cloudinary (Image/Screenshot Uploads)
- Nodemailer (Email Notifications)

## Architecture

```
Frontend (Next.js 14)  ←→  Backend (Express.js)  ←→  PostgreSQL + Redis
                            ↕                         ↕
                       Socket.io (Chat)          Prisma ORM (10 Models)
                            ↕
                     OpenAI GPT-4o (AI Reports)
                            ↕
                     MetaApi SDK (MT4/MT5 Sync)
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis (Optional, for advanced caching)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill the variables
4. Run `npx prisma generate`
5. Run `npx prisma db push`
6. Run `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create `.env.local` with: `NEXT_PUBLIC_API_URL=http://localhost:4000/api`
4. Run `npm run dev`

The application will be running on `http://localhost:3000`.

## Database Schema (10 Models)

| Model | Description |
|-------|-------------|
| User | Authentication, profile, preferences |
| BrokerAccount | MT4/MT5 connected accounts |
| Trade | Individual trade records with tags, emotions, screenshots |
| JournalEntry | Daily trading journal with mood tracking |
| Backtest | Strategy backtesting sessions |
| AiReport | AI-generated performance analysis reports |
| Message | Community chat messages |
| Follow | Social following system |
| Leaderboard | Competitive rankings |
| EconomicEvent | Fundamental calendar events |

## API Routes (11 Modules)

| Route | Description |
|-------|-------------|
| `/api/auth` | Register, Login, JWT refresh, Password reset |
| `/api/trades` | CRUD operations for trades |
| `/api/dashboard` | Dashboard statistics |
| `/api/analytics` | Overview, equity curve, by-symbol, by-session, drawdown, distributions |
| `/api/accounts` | Broker account management & MT4/MT5 sync |
| `/api/backtest` | Backtesting sessions, candle data, trade simulation |
| `/api/ai-reports` | AI report generation & retrieval (GPT-4o) |
| `/api/community` | Chat messages & channels |
| `/api/leaderboard` | Global rankings |
| `/api/calendar` | Economic events |
| `/api/settings` | User preferences |

## License
MIT
