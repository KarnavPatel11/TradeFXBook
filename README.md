# TradeFXBook

A full-stack, production-ready trading journal & analytics SaaS web application built with Next.js 14 and Express. 
Inspired by platforms like TradeFXBook, this project provides a comprehensive suite of tools for traders to track, analyze, and improve their performance entirely for free.

## Features Included
- **Advanced Dashboard**: Track P&L, Win Rate, Profit Factor, and visualize your equity curve.
- **Trade Journal**: Comprehensive logging with screenshot support and detailed analytics per trade.
- **Analytics Engine**: Breakdown of performance by day, session, symbol, and drawdown curves.
- **MT4/MT5 Integration**: Connect and sync accounts seamlessly (via MetaApi SDK).
- **Backtesting Simulator**: Replay the market with a Candlestick chart player and simulated trade entry panel.
- **AI Reports**: Automated trading psychology and strategy adherence reports powered by OpenAI heuristics.
- **Community Hub**: Real-time chat with channels, members panel, and trade sharing.
- **Global Leaderboard**: Compete with other traders and generate verified share cards for social media.
- **Economic Calendar**: Track high-impact fundamental events.

## Tech Stack
### Frontend
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Zustand (State Management)
- Recharts & Lightweight Charts (Data Visualization)
- Radix UI (Accessible Components)
- Framer Motion (Animations)
- Lucide React (Icons)

### Backend
- Node.js & Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- Socket.io (Real-time updates)
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis (Optional, for advanced caching)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill the variables.
4. Run `npx prisma db push`
5. Run `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env.local`
4. Run `npm run dev`

The application will be running on `http://localhost:3000`.

## License
MIT
