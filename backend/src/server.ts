import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.routes';
import tradeRoutes from './routes/trades.routes';
import dashboardRoutes from './routes/dashboard.routes';
import analyticsRoutes from './routes/analytics.routes';
import accountRoutes from './routes/accounts.routes';
import backtestRoutes from './routes/backtest.routes';
import aiReportRoutes from './routes/ai-reports.routes';
import communityRoutes from './routes/community.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
import calendarRoutes from './routes/calendar.routes';
import settingsRoutes from './routes/settings.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000', /^http:\/\/localhost:\d+$/, /^https:\/\/.*\.vercel\.app$/],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', /^http:\/\/localhost:\d+$/, /^https:\/\/.*\.vercel\.app$/],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Make io accessible in routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/backtest', backtestRoutes);
app.use('/api/ai-reports', aiReportRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Socket.io
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
  });

  socket.on('leave-room', (roomId: string) => {
    socket.leave(roomId);
  });

  socket.on('send-message', (data) => {
    io.to(data.roomId).emit('new-message', data);
  });

  socket.on('typing', (data) => {
    socket.to(data.roomId).emit('typing', data);
  });

  socket.on('react-message', (data) => {
    io.to(data.roomId).emit('message-reacted', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`🚀 TradeFXBook API running on port ${PORT}`);
});

export { app, io };
