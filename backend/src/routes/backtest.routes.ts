import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { catchAsync, AppError } from '../middleware/error.middleware';

const router = Router();

const backtestSchema = z.object({
  name: z.string().min(1),
  symbol: z.string().min(1),
  timeframe: z.string().min(1),
  startDate: z.string().transform(s => new Date(s)),
  endDate: z.string().transform(s => new Date(s)),
  startingBalance: z.number().positive(),
});

// GET /api/backtest
router.get('/', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const backtests = await prisma.backtest.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ status: 'success', data: { backtests } });
}));

// POST /api/backtest
router.post('/', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const data = backtestSchema.parse(req.body);
  const backtest = await prisma.backtest.create({
    data: { ...data, userId: req.user!.id },
  });
  res.status(201).json({ status: 'success', data: { backtest } });
}));

// GET /api/backtest/:id
router.get('/:id', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const backtest = await prisma.backtest.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });
  if (!backtest) throw new AppError('Backtest not found', 404);
  res.json({ status: 'success', data: { backtest } });
}));

// PUT /api/backtest/:id
router.put('/:id', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const existing = await prisma.backtest.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!existing) throw new AppError('Backtest not found', 404);

  const backtest = await prisma.backtest.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json({ status: 'success', data: { backtest } });
}));

// DELETE /api/backtest/:id
router.delete('/:id', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const existing = await prisma.backtest.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!existing) throw new AppError('Backtest not found', 404);

  await prisma.backtest.delete({ where: { id: req.params.id } });
  res.json({ status: 'success', message: 'Backtest deleted' });
}));

// GET /api/backtest/:id/candles
router.get('/:id/candles', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const { symbol, tf, from, to } = req.query as Record<string, string>;

  // Generate synthetic OHLCV data for backtesting
  const candles = generateSyntheticCandles(symbol || 'XAUUSD', tf || '1H', from, to);
  res.json({ status: 'success', data: { candles } });
}));

// POST /api/backtest/:id/trades
router.post('/:id/trades', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const backtest = await prisma.backtest.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!backtest) throw new AppError('Backtest not found', 404);

  const trades = (backtest.trades as any[] || []);
  trades.push(req.body);

  const wins = trades.filter((t: any) => t.pnl > 0);
  const totalPnl = trades.reduce((s: number, t: any) => s + (t.pnl || 0), 0);

  const updated = await prisma.backtest.update({
    where: { id: req.params.id },
    data: {
      trades,
      totalTrades: trades.length,
      winRate: trades.length > 0 ? (wins.length / trades.length) * 100 : 0,
      totalPnl,
      finalBalance: backtest.startingBalance + totalPnl,
    },
  });

  res.json({ status: 'success', data: { backtest: updated } });
}));

// GET /api/backtest/:id/results
router.get('/:id/results', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const backtest = await prisma.backtest.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!backtest) throw new AppError('Backtest not found', 404);

  const trades = (backtest.trades as any[]) || [];
  const wins = trades.filter((t: any) => t.pnl > 0);
  const losses = trades.filter((t: any) => t.pnl < 0);
  const avgWin = wins.length ? wins.reduce((s: number, t: any) => s + t.pnl, 0) / wins.length : 0;
  const avgLoss = losses.length ? Math.abs(losses.reduce((s: number, t: any) => s + t.pnl, 0) / losses.length) : 0;

  res.json({
    status: 'success',
    data: {
      backtest,
      results: {
        totalTrades: trades.length,
        winRate: trades.length > 0 ? (wins.length / trades.length) * 100 : 0,
        profitFactor: avgLoss > 0 ? (avgWin * wins.length) / (avgLoss * losses.length) : 0,
        totalPnl: backtest.totalPnl,
        finalBalance: backtest.finalBalance,
        maxDrawdown: backtest.maxDrawdown,
        avgWin,
        avgLoss,
        avgRR: backtest.avgRR,
      },
    },
  });
}));

function generateSyntheticCandles(symbol: string, tf: string, from?: string, to?: string) {
  const candles = [];
  const startDate = from ? new Date(from) : new Date('2024-01-01');
  const endDate = to ? new Date(to) : new Date('2024-03-01');
  const intervalMs = tf === '1m' ? 60000 : tf === '5m' ? 300000 : tf === '15m' ? 900000 : tf === '30m' ? 1800000 : tf === '1H' ? 3600000 : tf === '4H' ? 14400000 : tf === '1D' ? 86400000 : 604800000;

  let basePrice = symbol.includes('XAU') ? 2350 : symbol.includes('EUR') ? 1.0850 : symbol.includes('GBP') ? 1.2650 : symbol.includes('JPY') ? 150.50 : symbol.includes('BTC') ? 65000 : symbol.includes('NAS') ? 18500 : 100;
  const volatility = basePrice * 0.001;

  let current = startDate.getTime();
  const end = endDate.getTime();
  const maxCandles = 1000;
  let count = 0;

  while (current < end && count < maxCandles) {
    const open = basePrice + (Math.random() - 0.5) * volatility;
    const close = open + (Math.random() - 0.48) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.floor(Math.random() * 10000) + 1000;

    candles.push({
      time: Math.floor(current / 1000),
      open: Math.round(open * 100000) / 100000,
      high: Math.round(high * 100000) / 100000,
      low: Math.round(low * 100000) / 100000,
      close: Math.round(close * 100000) / 100000,
      volume,
    });

    basePrice = close;
    current += intervalMs;
    count++;
  }

  return candles;
}

export default router;
