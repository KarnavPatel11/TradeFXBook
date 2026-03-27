import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { catchAsync, AppError } from '../middleware/error.middleware';

const router = Router();

const tradeSchema = z.object({
  symbol: z.string().min(1),
  direction: z.enum(['BUY', 'SELL']),
  entryPrice: z.number().positive(),
  exitPrice: z.number().positive().optional(),
  stopLoss: z.number().positive().optional(),
  takeProfit: z.number().positive().optional(),
  lotSize: z.number().positive(),
  openTime: z.string().transform(s => new Date(s)),
  closeTime: z.string().transform(s => new Date(s)).optional(),
  pnl: z.number().optional(),
  pnlPercent: z.number().optional(),
  pips: z.number().optional(),
  riskReward: z.number().optional(),
  riskPercent: z.number().optional(),
  commission: z.number().optional(),
  swap: z.number().optional(),
  duration: z.number().optional(),
  status: z.enum(['open', 'closed']).default('open'),
  session: z.string().optional(),
  strategyTags: z.array(z.string()).default([]),
  mistakeTags: z.array(z.string()).default([]),
  emotionRating: z.number().min(1).max(5).optional(),
  tradeRating: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
  preTradePlan: z.string().optional(),
  postTradeNotes: z.string().optional(),
  screenshots: z.array(z.string()).default([]),
  checklistItems: z.any().optional(),
  accountId: z.string().optional(),
  importedFrom: z.string().optional(),
});

// GET /api/trades
router.get('/', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const {
    page = '1', limit = '20', symbol, direction, status,
    session, dateFrom, dateTo, outcome, sort = 'openTime',
    order = 'desc', accountId, emotionRating, tradeRating, tag,
  } = req.query as Record<string, string>;

  const where: any = { userId: req.user!.id };

  if (symbol) where.symbol = { in: symbol.split(',') };
  if (direction) where.direction = direction;
  if (status) where.status = status;
  if (session) where.session = { in: session.split(',') };
  if (accountId) where.accountId = accountId;
  if (emotionRating) where.emotionRating = parseInt(emotionRating);
  if (tradeRating) where.tradeRating = parseInt(tradeRating);
  if (tag) where.strategyTags = { hasSome: tag.split(',') };

  if (dateFrom || dateTo) {
    where.openTime = {};
    if (dateFrom) where.openTime.gte = new Date(dateFrom);
    if (dateTo) where.openTime.lte = new Date(dateTo);
  }

  if (outcome === 'win') where.pnl = { gt: 0 };
  else if (outcome === 'loss') where.pnl = { lt: 0 };
  else if (outcome === 'breakeven') where.pnl = 0;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [trades, total] = await Promise.all([
    prisma.trade.findMany({
      where,
      orderBy: { [sort]: order },
      skip,
      take: parseInt(limit),
      include: { account: { select: { brokerName: true, accountNumber: true } } },
    }),
    prisma.trade.count({ where }),
  ]);

  res.json({
    status: 'success',
    data: {
      trades,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
}));

// POST /api/trades
router.post('/', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const data = tradeSchema.parse(req.body);

  const trade = await prisma.trade.create({
    data: {
      ...data,
      userId: req.user!.id,
    },
  });

  // Update user stats
  const stats = await prisma.trade.aggregate({
    where: { userId: req.user!.id, status: 'closed' },
    _sum: { pnl: true },
    _count: true,
  });

  const winCount = await prisma.trade.count({
    where: { userId: req.user!.id, status: 'closed', pnl: { gt: 0 } },
  });

  await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      totalPnl: stats._sum.pnl || 0,
      totalTrades: stats._count,
      winRate: stats._count > 0 ? (winCount / stats._count) * 100 : 0,
    },
  });

  res.status(201).json({ status: 'success', data: { trade } });
}));

// GET /api/trades/:id
router.get('/:id', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const trade = await prisma.trade.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
    include: { account: { select: { brokerName: true, accountNumber: true } } },
  });

  if (!trade) throw new AppError('Trade not found', 404);
  res.json({ status: 'success', data: { trade } });
}));

// PUT /api/trades/:id
router.put('/:id', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const existingTrade = await prisma.trade.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });
  if (!existingTrade) throw new AppError('Trade not found', 404);

  const data = tradeSchema.partial().parse(req.body);
  const trade = await prisma.trade.update({
    where: { id: req.params.id },
    data,
  });

  res.json({ status: 'success', data: { trade } });
}));

// DELETE /api/trades/:id
router.delete('/:id', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const existingTrade = await prisma.trade.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });
  if (!existingTrade) throw new AppError('Trade not found', 404);

  await prisma.trade.delete({ where: { id: req.params.id } });
  res.json({ status: 'success', message: 'Trade deleted' });
}));

// GET /api/trades/export
router.get('/export/csv', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const trades = await prisma.trade.findMany({
    where: { userId: req.user!.id },
    orderBy: { openTime: 'desc' },
  });

  const headers = 'Symbol,Direction,Entry,Exit,SL,TP,Lots,Open Time,Close Time,P&L,Pips,R:R,Session,Status\n';
  const csv = trades.map(t =>
    `${t.symbol},${t.direction},${t.entryPrice},${t.exitPrice || ''},${t.stopLoss || ''},${t.takeProfit || ''},${t.lotSize},${t.openTime.toISOString()},${t.closeTime?.toISOString() || ''},${t.pnl || ''},${t.pips || ''},${t.riskReward || ''},${t.session || ''},${t.status}`
  ).join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=trades.csv');
  res.send(headers + csv);
}));

export default router;
