import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { catchAsync } from '../middleware/error.middleware';
import { startOfDay, endOfDay, startOfWeek, startOfMonth, startOfYear, subDays } from 'date-fns';

const router = Router();

// GET /api/dashboard/stats
router.get('/stats', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const { period = 'month' } = req.query;
  const now = new Date();

  let dateFrom: Date;
  switch (period) {
    case 'today': dateFrom = startOfDay(now); break;
    case 'week': dateFrom = startOfWeek(now); break;
    case 'year': dateFrom = startOfYear(now); break;
    default: dateFrom = startOfMonth(now);
  }

  const where = { userId: req.user!.id, status: 'closed' as const, closeTime: { gte: dateFrom } };

  const [trades, allTrades] = await Promise.all([
    prisma.trade.findMany({ where, orderBy: { closeTime: 'desc' } }),
    prisma.trade.findMany({ where: { userId: req.user!.id, status: 'closed' }, orderBy: { closeTime: 'asc' } }),
  ]);

  const wins = trades.filter(t => (t.pnl || 0) > 0);
  const losses = trades.filter(t => (t.pnl || 0) < 0);
  const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const winRate = trades.length > 0 ? (wins.length / trades.length) * 100 : 0;
  const avgWin = wins.length > 0 ? wins.reduce((s, t) => s + (t.pnl || 0), 0) / wins.length : 0;
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((s, t) => s + (t.pnl || 0), 0) / losses.length) : 0;
  const profitFactor = avgLoss > 0 ? (avgWin * wins.length) / (avgLoss * losses.length) : 0;
  const avgRR = trades.filter(t => t.riskReward).reduce((s, t) => s + (t.riskReward || 0), 0) / (trades.filter(t => t.riskReward).length || 1);
  const avgDuration = trades.filter(t => t.duration).reduce((s, t) => s + (t.duration || 0), 0) / (trades.filter(t => t.duration).length || 1);

  // Calculate max drawdown
  let peak = 0;
  let maxDrawdown = 0;
  let cumPnl = 0;
  allTrades.forEach(t => {
    cumPnl += t.pnl || 0;
    if (cumPnl > peak) peak = cumPnl;
    const dd = peak - cumPnl;
    if (dd > maxDrawdown) maxDrawdown = dd;
  });

  // Today's stats
  const todayTrades = await prisma.trade.findMany({
    where: { userId: req.user!.id, status: 'closed', closeTime: { gte: startOfDay(now), lte: endOfDay(now) } },
  });
  const todayPnl = todayTrades.reduce((s, t) => s + (t.pnl || 0), 0);

  res.json({
    status: 'success',
    data: {
      todayPnl,
      totalPnl,
      winRate: Math.round(winRate * 10) / 10,
      profitFactor: Math.round(profitFactor * 100) / 100,
      totalTrades: trades.length,
      maxDrawdown: Math.round(maxDrawdown * 100) / 100,
      avgRiskReward: Math.round(avgRR * 100) / 100,
      avgDuration: Math.round(avgDuration),
      wins: wins.length,
      losses: losses.length,
    },
  });
}));

// GET /api/dashboard/equity-curve
router.get('/equity-curve', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const { days = '30' } = req.query;
  const dateFrom = subDays(new Date(), parseInt(days as string));

  const trades = await prisma.trade.findMany({
    where: { userId: req.user!.id, status: 'closed', closeTime: { gte: dateFrom } },
    orderBy: { closeTime: 'asc' },
    select: { closeTime: true, pnl: true },
  });

  let cumPnl = 0;
  const data = trades.map(t => {
    cumPnl += t.pnl || 0;
    return {
      date: t.closeTime?.toISOString().split('T')[0],
      pnl: Math.round(cumPnl * 100) / 100,
    };
  });

  res.json({ status: 'success', data });
}));

// GET /api/dashboard/recent-trades
router.get('/recent-trades', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const { limit = '10' } = req.query;

  const trades = await prisma.trade.findMany({
    where: { userId: req.user!.id },
    orderBy: { openTime: 'desc' },
    take: parseInt(limit as string),
    include: { account: { select: { brokerName: true } } },
  });

  res.json({ status: 'success', data: { trades } });
}));

// GET /api/dashboard/calendar-heatmap
router.get('/calendar-heatmap', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const { month } = req.query;
  const now = new Date();
  const year = month ? parseInt((month as string).split('-')[0]) : now.getFullYear();
  const m = month ? parseInt((month as string).split('-')[1]) - 1 : now.getMonth();

  const from = new Date(year, m, 1);
  const to = new Date(year, m + 1, 0, 23, 59, 59);

  const trades = await prisma.trade.findMany({
    where: { userId: req.user!.id, status: 'closed', closeTime: { gte: from, lte: to } },
    select: { closeTime: true, pnl: true },
  });

  const dailyPnl: Record<string, number> = {};
  trades.forEach(t => {
    const day = t.closeTime?.toISOString().split('T')[0] || '';
    dailyPnl[day] = (dailyPnl[day] || 0) + (t.pnl || 0);
  });

  const data = Object.entries(dailyPnl).map(([date, pnl]) => ({
    date,
    pnl: Math.round(pnl * 100) / 100,
  }));

  res.json({ status: 'success', data });
}));

// GET /api/dashboard/open-positions
router.get('/open-positions', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const trades = await prisma.trade.findMany({
    where: { userId: req.user!.id, status: 'open' },
    orderBy: { openTime: 'desc' },
    include: { account: { select: { brokerName: true } } },
  });

  res.json({ status: 'success', data: { positions: trades } });
}));

export default router;
