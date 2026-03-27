import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { catchAsync } from '../middleware/error.middleware';

const router = Router();

// GET /api/analytics/overview
router.get('/overview', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const { from, to, account, symbol } = req.query as Record<string, string>;
  const where: any = { userId: req.user!.id, status: 'closed' };

  if (from || to) {
    where.closeTime = {};
    if (from) where.closeTime.gte = new Date(from);
    if (to) where.closeTime.lte = new Date(to);
  }
  if (account) where.accountId = account;
  if (symbol) where.symbol = { in: symbol.split(',') };

  const trades = await prisma.trade.findMany({ where, orderBy: { closeTime: 'asc' } });

  const wins = trades.filter(t => (t.pnl || 0) > 0);
  const losses = trades.filter(t => (t.pnl || 0) < 0);
  const breakeven = trades.filter(t => (t.pnl || 0) === 0);
  const totalPnl = trades.reduce((s, t) => s + (t.pnl || 0), 0);
  const avgWin = wins.length ? wins.reduce((s, t) => s + (t.pnl || 0), 0) / wins.length : 0;
  const avgLoss = losses.length ? Math.abs(losses.reduce((s, t) => s + (t.pnl || 0), 0) / losses.length) : 0;
  const bestTrade = trades.reduce((best, t) => (t.pnl || 0) > (best.pnl || 0) ? t : best, trades[0] || { pnl: 0 });
  const worstTrade = trades.reduce((worst, t) => (t.pnl || 0) < (worst.pnl || 0) ? t : worst, trades[0] || { pnl: 0 });
  const profitFactor = avgLoss > 0 ? (avgWin * wins.length) / (avgLoss * losses.length) : 0;
  const avgRR = trades.filter(t => t.riskReward).length > 0
    ? trades.filter(t => t.riskReward).reduce((s, t) => s + (t.riskReward || 0), 0) / trades.filter(t => t.riskReward).length : 0;
  const totalPips = trades.reduce((s, t) => s + (t.pips || 0), 0);
  const totalLots = trades.reduce((s, t) => s + t.lotSize, 0);
  const avgLotSize = trades.length ? totalLots / trades.length : 0;
  const avgDuration = trades.filter(t => t.duration).length > 0
    ? trades.filter(t => t.duration).reduce((s, t) => s + (t.duration || 0), 0) / trades.filter(t => t.duration).length : 0;

  // Max drawdown
  let peak = 0, maxDD = 0, maxDDPct = 0, cumPnl = 0;
  trades.forEach(t => {
    cumPnl += t.pnl || 0;
    if (cumPnl > peak) peak = cumPnl;
    const dd = peak - cumPnl;
    if (dd > maxDD) { maxDD = dd; maxDDPct = peak > 0 ? (dd / peak) * 100 : 0; }
  });

  // Streaks
  let winStreak = 0, lossStreak = 0, maxWinStreak = 0, maxLossStreak = 0;
  trades.forEach(t => {
    if ((t.pnl || 0) > 0) { winStreak++; lossStreak = 0; }
    else { lossStreak++; winStreak = 0; }
    maxWinStreak = Math.max(maxWinStreak, winStreak);
    maxLossStreak = Math.max(maxLossStreak, lossStreak);
  });

  res.json({
    status: 'success',
    data: {
      totalPnl: Math.round(totalPnl * 100) / 100,
      totalPnlPct: 0,
      winRate: trades.length ? Math.round((wins.length / trades.length) * 10000) / 100 : 0,
      profitFactor: Math.round(profitFactor * 100) / 100,
      totalTrades: trades.length,
      winningTrades: wins.length,
      losingTrades: losses.length,
      breakevenTrades: breakeven.length,
      avgWin: Math.round(avgWin * 100) / 100,
      avgLoss: Math.round(avgLoss * 100) / 100,
      bestTrade: Math.round((bestTrade?.pnl || 0) * 100) / 100,
      worstTrade: Math.round((worstTrade?.pnl || 0) * 100) / 100,
      avgRR: Math.round(avgRR * 100) / 100,
      maxDrawdown: Math.round(maxDD * 100) / 100,
      maxDrawdownPct: Math.round(maxDDPct * 100) / 100,
      longestWinStreak: maxWinStreak,
      longestLossStreak: maxLossStreak,
      avgDuration: Math.round(avgDuration),
      totalLots: Math.round(totalLots * 100) / 100,
      avgLotSize: Math.round(avgLotSize * 100) / 100,
      totalPips: Math.round(totalPips * 10) / 10,
    },
  });
}));

// GET /api/analytics/equity-curve
router.get('/equity-curve', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const { from, to } = req.query as Record<string, string>;
  const where: any = { userId: req.user!.id, status: 'closed' };
  if (from || to) {
    where.closeTime = {};
    if (from) where.closeTime.gte = new Date(from);
    if (to) where.closeTime.lte = new Date(to);
  }

  const trades = await prisma.trade.findMany({ where, orderBy: { closeTime: 'asc' }, select: { closeTime: true, pnl: true } });
  let cum = 0;
  const data = trades.map(t => { cum += t.pnl || 0; return { date: t.closeTime?.toISOString().split('T')[0], pnl: Math.round(cum * 100) / 100 }; });
  res.json({ status: 'success', data });
}));

// GET /api/analytics/by-symbol
router.get('/by-symbol', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const trades = await prisma.trade.findMany({ where: { userId: req.user!.id, status: 'closed' } });
  const bySymbol: Record<string, { trades: number; wins: number; pnl: number }> = {};
  trades.forEach(t => {
    if (!bySymbol[t.symbol]) bySymbol[t.symbol] = { trades: 0, wins: 0, pnl: 0 };
    bySymbol[t.symbol].trades++;
    if ((t.pnl || 0) > 0) bySymbol[t.symbol].wins++;
    bySymbol[t.symbol].pnl += t.pnl || 0;
  });
  const data = Object.entries(bySymbol).map(([symbol, d]) => ({
    symbol, ...d, winRate: Math.round((d.wins / d.trades) * 10000) / 100, pnl: Math.round(d.pnl * 100) / 100,
  }));
  res.json({ status: 'success', data });
}));

// GET /api/analytics/by-session
router.get('/by-session', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const trades = await prisma.trade.findMany({ where: { userId: req.user!.id, status: 'closed' } });
  const bySession: Record<string, { trades: number; wins: number; pnl: number }> = {};
  trades.forEach(t => {
    const s = t.session || 'Unknown';
    if (!bySession[s]) bySession[s] = { trades: 0, wins: 0, pnl: 0 };
    bySession[s].trades++;
    if ((t.pnl || 0) > 0) bySession[s].wins++;
    bySession[s].pnl += t.pnl || 0;
  });
  const data = Object.entries(bySession).map(([session, d]) => ({
    session, ...d, winRate: Math.round((d.wins / d.trades) * 10000) / 100, pnl: Math.round(d.pnl * 100) / 100,
  }));
  res.json({ status: 'success', data });
}));

// GET /api/analytics/by-day-of-week
router.get('/by-day-of-week', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const trades = await prisma.trade.findMany({ where: { userId: req.user!.id, status: 'closed' } });
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const byDay: Record<string, { trades: number; wins: number; pnl: number }> = {};
  days.forEach(d => { byDay[d] = { trades: 0, wins: 0, pnl: 0 }; });
  trades.forEach(t => {
    const day = days[t.openTime.getDay()];
    byDay[day].trades++;
    if ((t.pnl || 0) > 0) byDay[day].wins++;
    byDay[day].pnl += t.pnl || 0;
  });
  const data = Object.entries(byDay).filter(([_, d]) => d.trades > 0).map(([day, d]) => ({
    day, ...d, winRate: d.trades > 0 ? Math.round((d.wins / d.trades) * 10000) / 100 : 0, pnl: Math.round(d.pnl * 100) / 100,
  }));
  res.json({ status: 'success', data });
}));

// GET /api/analytics/by-hour
router.get('/by-hour', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const trades = await prisma.trade.findMany({ where: { userId: req.user!.id, status: 'closed' } });
  const byHour: Record<number, { trades: number; wins: number; pnl: number }> = {};
  for (let h = 0; h < 24; h++) byHour[h] = { trades: 0, wins: 0, pnl: 0 };
  trades.forEach(t => {
    const h = t.openTime.getHours();
    byHour[h].trades++;
    if ((t.pnl || 0) > 0) byHour[h].wins++;
    byHour[h].pnl += t.pnl || 0;
  });
  const data = Object.entries(byHour).map(([hour, d]) => ({
    hour: parseInt(hour), ...d, avgPnl: d.trades > 0 ? Math.round((d.pnl / d.trades) * 100) / 100 : 0,
  }));
  res.json({ status: 'success', data });
}));

// GET /api/analytics/by-tag
router.get('/by-tag', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const trades = await prisma.trade.findMany({ where: { userId: req.user!.id, status: 'closed' } });
  const byTag: Record<string, { trades: number; wins: number; pnl: number }> = {};
  trades.forEach(t => {
    t.strategyTags.forEach(tag => {
      if (!byTag[tag]) byTag[tag] = { trades: 0, wins: 0, pnl: 0 };
      byTag[tag].trades++;
      if ((t.pnl || 0) > 0) byTag[tag].wins++;
      byTag[tag].pnl += t.pnl || 0;
    });
  });
  const data = Object.entries(byTag).map(([tag, d]) => ({
    tag, ...d, winRate: Math.round((d.wins / d.trades) * 10000) / 100, pnl: Math.round(d.pnl * 100) / 100,
  }));
  res.json({ status: 'success', data });
}));

// GET /api/analytics/drawdown
router.get('/drawdown', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const trades = await prisma.trade.findMany({ where: { userId: req.user!.id, status: 'closed' }, orderBy: { closeTime: 'asc' }, select: { closeTime: true, pnl: true } });
  let peak = 0, cum = 0;
  const data = trades.map(t => {
    cum += t.pnl || 0;
    if (cum > peak) peak = cum;
    const dd = peak > 0 ? ((peak - cum) / peak) * 100 : 0;
    return { date: t.closeTime?.toISOString().split('T')[0], drawdown: Math.round(dd * 100) / 100 };
  });
  res.json({ status: 'success', data });
}));

// GET /api/analytics/distributions
router.get('/distributions', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const trades = await prisma.trade.findMany({ where: { userId: req.user!.id, status: 'closed' }, select: { pnl: true, riskReward: true } });
  const pnlDist = trades.map(t => Math.round((t.pnl || 0) * 100) / 100);
  const rrDist = trades.filter(t => t.riskReward).map(t => Math.round((t.riskReward || 0) * 100) / 100);
  res.json({ status: 'success', data: { pnlDistribution: pnlDist, rrDistribution: rrDist } });
}));

export default router;
