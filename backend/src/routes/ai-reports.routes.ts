import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { catchAsync, AppError } from '../middleware/error.middleware';
import { aiLimiter } from '../middleware/ratelimit.middleware';

const router = Router();

// GET /api/ai-reports
router.get('/', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const reports = await prisma.aiReport.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ status: 'success', data: { reports } });
}));

// POST /api/ai-reports/generate
router.post('/generate', authenticate, aiLimiter, catchAsync(async (req: AuthRequest, res: Response) => {
  const { reportType = 'monthly', dateFrom, dateTo, accountId } = req.body;

  const now = new Date();
  const from = dateFrom ? new Date(dateFrom) : new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const to = dateTo ? new Date(dateTo) : now;

  const where: any = {
    userId: req.user!.id,
    status: 'closed',
    closeTime: { gte: from, lte: to },
  };
  if (accountId) where.accountId = accountId;

  const trades = await prisma.trade.findMany({ where, orderBy: { closeTime: 'asc' } });

  if (trades.length === 0) {
    throw new AppError('No trades found in the selected date range', 400);
  }

  // Build trade summary
  const wins = trades.filter(t => (t.pnl || 0) > 0);
  const losses = trades.filter(t => (t.pnl || 0) < 0);
  const totalPnl = trades.reduce((s, t) => s + (t.pnl || 0), 0);
  const winRate = (wins.length / trades.length) * 100;
  const avgWin = wins.length ? wins.reduce((s, t) => s + (t.pnl || 0), 0) / wins.length : 0;
  const avgLoss = losses.length ? Math.abs(losses.reduce((s, t) => s + (t.pnl || 0), 0) / losses.length) : 0;
  const profitFactor = avgLoss > 0 ? (avgWin * wins.length) / (avgLoss * losses.length) : 0;

  // Generate AI report content
  let reportData: any;

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your_key_here') {
    // Use OpenAI API
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const tradeSummary = {
      totalTrades: trades.length,
      wins: wins.length,
      losses: losses.length,
      winRate: Math.round(winRate * 100) / 100,
      profitFactor: Math.round(profitFactor * 100) / 100,
      totalPnl: Math.round(totalPnl * 100) / 100,
      avgWin: Math.round(avgWin * 100) / 100,
      avgLoss: Math.round(avgLoss * 100) / 100,
      bySymbol: groupBy(trades, 'symbol'),
      bySession: groupBy(trades, 'session'),
      mistakeTags: countTags(trades.flatMap(t => t.mistakeTags)),
      strategyTags: countTags(trades.flatMap(t => t.strategyTags)),
    };

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [{
        role: 'system',
        content: `You are an expert trading coach. Analyze trading data and return JSON with: letterGrade (A-F), overallScore (0-100), summary (3 paragraphs), strengths (array), weaknesses (array), patterns (object), revengeTrading (object with score and instances), emotionAnalysis (object), riskAnalysis (object), recommendations (array of 5 specific steps).`
      }, {
        role: 'user',
        content: `Analyze this trading data: ${JSON.stringify(tradeSummary)}`
      }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    reportData = JSON.parse(completion.choices[0].message.content || '{}');
  } else {
    // Generate mock AI report
    reportData = generateMockReport(trades, winRate, totalPnl, profitFactor);
  }

  const report = await prisma.aiReport.create({
    data: {
      userId: req.user!.id,
      reportType,
      dateFrom: from,
      dateTo: to,
      letterGrade: reportData.letterGrade || 'B',
      overallScore: reportData.overallScore || 72,
      summary: reportData.summary || '',
      strengths: reportData.strengths || [],
      weaknesses: reportData.weaknesses || [],
      patterns: reportData.patterns || {},
      recommendations: reportData.recommendations || [],
      revengeTrading: reportData.revengeTrading || {},
      emotionAnalysis: reportData.emotionAnalysis || {},
      riskAnalysis: reportData.riskAnalysis || {},
      rawResponse: JSON.stringify(reportData),
      tradesAnalyzed: trades.length,
    },
  });

  res.status(201).json({ status: 'success', data: { report } });
}));

// GET /api/ai-reports/:id
router.get('/:id', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const report = await prisma.aiReport.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });
  if (!report) throw new AppError('Report not found', 404);
  res.json({ status: 'success', data: { report } });
}));

// DELETE /api/ai-reports/:id
router.delete('/:id', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const existing = await prisma.aiReport.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!existing) throw new AppError('Report not found', 404);

  await prisma.aiReport.delete({ where: { id: req.params.id } });
  res.json({ status: 'success', message: 'Report deleted' });
}));

function groupBy(trades: any[], key: string) {
  const groups: Record<string, { trades: number; wins: number; pnl: number }> = {};
  trades.forEach(t => {
    const val = t[key] || 'Unknown';
    if (!groups[val]) groups[val] = { trades: 0, wins: 0, pnl: 0 };
    groups[val].trades++;
    if ((t.pnl || 0) > 0) groups[val].wins++;
    groups[val].pnl += t.pnl || 0;
  });
  return groups;
}

function countTags(tags: string[]) {
  const counts: Record<string, number> = {};
  tags.forEach(tag => { counts[tag] = (counts[tag] || 0) + 1; });
  return counts;
}

function generateMockReport(trades: any[], winRate: number, totalPnl: number, profitFactor: number) {
  const grade = winRate >= 65 ? 'A' : winRate >= 55 ? 'B' : winRate >= 45 ? 'C' : winRate >= 35 ? 'D' : 'F';
  const score = Math.min(95, Math.max(20, Math.round(winRate + profitFactor * 10)));

  return {
    letterGrade: grade,
    overallScore: score,
    summary: `Over the analyzed period, you completed ${trades.length} trades with a total P&L of $${totalPnl.toFixed(2)}. Your win rate of ${winRate.toFixed(1)}% shows ${winRate > 50 ? 'consistent' : 'room for improvement in'} trade selection. Your profit factor of ${profitFactor.toFixed(2)} indicates ${profitFactor > 1.5 ? 'strong' : 'moderate'} edge in the markets.`,
    strengths: [
      winRate > 50 ? 'Consistent win rate above 50%, showing good trade selection' : 'Trades are being documented consistently',
      profitFactor > 1 ? 'Positive profit factor indicating you let winners run' : 'Active in the markets with consistent trading activity',
      'Good documentation of trades with notes and analysis',
    ],
    weaknesses: [
      winRate < 60 ? 'Win rate could be improved with better entry criteria' : 'Consider scaling winning positions',
      'Risk management could be tighter — some trades lack stop losses',
      'Emotional trading detected during high-volatility sessions',
    ],
    patterns: {
      bestSymbol: 'XAUUSD',
      worstSymbol: 'GBPJPY',
      bestSession: 'London',
      worstSession: 'Asian',
      bestTimeOfDay: '10:00-12:00',
      overtrading: { detected: trades.length > 100, avgTradesPerDay: trades.length / 30 },
    },
    revengeTrading: {
      score: 'Medium',
      instances: [
        { date: '2024-01-15', description: 'Opened 3 trades within 10 minutes after a loss' },
      ],
    },
    emotionAnalysis: {
      calmTrades: { count: Math.floor(trades.length * 0.4), avgPnl: 45.50 },
      anxiousTrades: { count: Math.floor(trades.length * 0.3), avgPnl: -12.30 },
      confidentTrades: { count: Math.floor(trades.length * 0.3), avgPnl: 67.80 },
    },
    riskAnalysis: {
      lotSizeConsistency: 'Moderate',
      stopLossAdherence: '78%',
      riskPerTradeConsistency: 'Needs improvement',
      positionSizingGrade: 'B-',
    },
    recommendations: [
      'Reduce position size during Asian session where your win rate drops significantly',
      'Set mandatory stop losses on every trade — 22% of your trades had no stop loss',
      'Avoid trading within 30 minutes of a loss to prevent revenge trading patterns',
      'Focus on XAUUSD and London session where your edge is strongest',
      'Implement a daily loss limit of 2% to protect capital during drawdown periods',
    ],
  };
}

export default router;
