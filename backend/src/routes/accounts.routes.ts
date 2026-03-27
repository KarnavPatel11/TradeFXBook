import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { catchAsync, AppError } from '../middleware/error.middleware';

const router = Router();

const connectSchema = z.object({
  brokerName: z.string().min(1),
  accountNumber: z.string().min(1),
  investorPassword: z.string().min(1),
  serverName: z.string().min(1),
  accountName: z.string().optional().default(''),
  platform: z.enum(['MT4', 'MT5']),
});

// GET /api/accounts
router.get('/', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const accounts = await prisma.brokerAccount.findMany({
    where: { userId: req.user!.id },
    include: { _count: { select: { trades: true } } },
  });
  res.json({ status: 'success', data: { accounts } });
}));

// POST /api/accounts/connect
router.post('/connect', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const data = connectSchema.parse(req.body);

  const account = await prisma.brokerAccount.create({
    data: {
      ...data,
      accountId: `${data.platform}-${data.accountNumber}`,
      accountName: data.accountName || `${data.brokerName} ${data.accountNumber}`,
      userId: req.user!.id,
      status: 'connected',
    },
  });

  res.status(201).json({ status: 'success', data: { account } });
}));

// POST /api/accounts/test-connection
router.post('/test-connection', authenticate, catchAsync(async (_req: AuthRequest, res: Response) => {
  // In production, this would test the MetaApi connection
  await new Promise(resolve => setTimeout(resolve, 1000));
  res.json({
    status: 'success',
    data: {
      connected: true,
      accountInfo: { balance: 10000, equity: 10250, currency: 'USD', leverage: 100 },
    },
  });
}));

// GET /api/accounts/:id
router.get('/:id', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const account = await prisma.brokerAccount.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
    include: { _count: { select: { trades: true } } },
  });
  if (!account) throw new AppError('Account not found', 404);
  res.json({ status: 'success', data: { account } });
}));

// PUT /api/accounts/:id
router.put('/:id', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const existing = await prisma.brokerAccount.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!existing) throw new AppError('Account not found', 404);

  const account = await prisma.brokerAccount.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json({ status: 'success', data: { account } });
}));

// DELETE /api/accounts/:id
router.delete('/:id', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const existing = await prisma.brokerAccount.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!existing) throw new AppError('Account not found', 404);

  await prisma.brokerAccount.delete({ where: { id: req.params.id } });
  res.json({ status: 'success', message: 'Account disconnected' });
}));

// POST /api/accounts/:id/sync
router.post('/:id/sync', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const account = await prisma.brokerAccount.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!account) throw new AppError('Account not found', 404);

  await prisma.brokerAccount.update({
    where: { id: req.params.id },
    data: { status: 'syncing', lastSyncAt: new Date() },
  });

  // In production, trigger MetaApi sync here
  setTimeout(async () => {
    await prisma.brokerAccount.update({
      where: { id: req.params.id },
      data: { status: 'connected' },
    });
  }, 3000);

  res.json({ status: 'success', message: 'Sync started' });
}));

// POST /api/accounts/:id/import-history
router.post('/:id/import-history', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const account = await prisma.brokerAccount.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
  if (!account) throw new AppError('Account not found', 404);

  res.json({ status: 'success', message: 'Import started', data: { imported: 0 } });
}));

// GET /api/accounts/:id/positions
router.get('/:id/positions', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const trades = await prisma.trade.findMany({
    where: { accountId: req.params.id, userId: req.user!.id, status: 'open' },
  });
  res.json({ status: 'success', data: { positions: trades } });
}));

// GET /api/accounts/:id/status
router.get('/:id/status', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const account = await prisma.brokerAccount.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
    select: { status: true, lastSyncAt: true, balance: true, equity: true },
  });
  if (!account) throw new AppError('Account not found', 404);
  res.json({ status: 'success', data: account });
}));

export default router;
