import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { catchAsync } from '../middleware/error.middleware';

const router = Router();

// GET /api/leaderboard
router.get('/', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const { period = 'monthly', page = '1' } = req.query as Record<string, string>;
  const limit = 20;
  const skip = (parseInt(page) - 1) * limit;

  const users = await prisma.user.findMany({
    where: { totalTrades: { gt: 0 } },
    orderBy: { totalPnl: 'desc' },
    take: limit,
    skip,
    select: {
      id: true, name: true, username: true, avatarUrl: true,
      totalPnl: true, winRate: true, totalTrades: true,
    },
  });

  const leaderboard = users.map((user, index) => ({
    ...user,
    rank: skip + index + 1,
    profitFactor: 0,
    badges: getBadges(user),
  }));

  const total = await prisma.user.count({ where: { totalTrades: { gt: 0 } } });

  res.json({
    status: 'success',
    data: {
      leaderboard,
      pagination: { page: parseInt(page), limit, total, totalPages: Math.ceil(total / limit) },
    },
  });
}));

// GET /api/leaderboard/my-rank
router.get('/my-rank', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { totalPnl: true, winRate: true, totalTrades: true },
  });

  const rank = await prisma.user.count({
    where: { totalPnl: { gt: user?.totalPnl || 0 }, totalTrades: { gt: 0 } },
  });

  res.json({
    status: 'success',
    data: { rank: rank + 1, ...user },
  });
}));

// GET /api/users/:username/profile
router.get('/users/:username/profile', catchAsync(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { username: req.params.username },
    select: {
      id: true, name: true, username: true, avatarUrl: true, bio: true,
      totalPnl: true, winRate: true, totalTrades: true, createdAt: true,
      _count: { select: { followers: true, following: true } },
    },
  });

  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({
    status: 'success',
    data: { user: { ...user, badges: getBadges(user) } },
  });
}));

// POST /api/users/:username/follow
router.post('/users/:username/follow', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const target = await prisma.user.findUnique({ where: { username: req.params.username } });
  if (!target) return res.status(404).json({ message: 'User not found' });
  if (target.id === req.user!.id) return res.status(400).json({ message: 'Cannot follow yourself' });

  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId: req.user!.id, followingId: target.id } },
    create: { followerId: req.user!.id, followingId: target.id },
    update: {},
  });

  res.json({ status: 'success', message: 'Following' });
}));

// DELETE /api/users/:username/follow
router.delete('/users/:username/follow', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const target = await prisma.user.findUnique({ where: { username: req.params.username } });
  if (!target) return res.status(404).json({ message: 'User not found' });

  await prisma.follow.deleteMany({
    where: { followerId: req.user!.id, followingId: target.id },
  });

  res.json({ status: 'success', message: 'Unfollowed' });
}));

function getBadges(user: { winRate: number; totalTrades: number; totalPnl: number }) {
  const badges: string[] = [];
  if (user.winRate > 70 && user.totalTrades >= 20) badges.push('🎯 Sniper');
  if (user.totalTrades >= 50) badges.push('⚡ Speed Trader');
  if (user.totalPnl > 5000) badges.push('📈 Compounder');
  if (user.totalTrades >= 100) badges.push('🦁 Risk Taker');
  return badges;
}

export default router;
