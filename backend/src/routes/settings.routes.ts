import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { catchAsync, AppError } from '../middleware/error.middleware';

const router = Router();

// PUT /api/settings/profile
router.put('/profile', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const { name, username, bio, avatarUrl, timezone, currency } = req.body;

  if (username) {
    const existing = await prisma.user.findFirst({
      where: { username, id: { not: req.user!.id } },
    });
    if (existing) throw new AppError('Username already taken', 400);
  }

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { name, username, bio, avatarUrl, timezone, currency },
    select: {
      id: true, email: true, name: true, username: true,
      avatarUrl: true, bio: true, timezone: true, currency: true, theme: true,
    },
  });

  res.json({ status: 'success', data: { user } });
}));

// PUT /api/settings/password
router.put('/password', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { passwordHash: true },
  });

  if (!user?.passwordHash) throw new AppError('Cannot change password for OAuth accounts', 400);

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) throw new AppError('Current password is incorrect', 400);

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { passwordHash },
  });

  res.json({ status: 'success', message: 'Password changed successfully' });
}));

// PUT /api/settings/theme
router.put('/theme', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const { theme } = req.body;

  await prisma.user.update({
    where: { id: req.user!.id },
    data: { theme },
  });

  res.json({ status: 'success', message: 'Theme updated' });
}));

// GET /api/settings/notifications
router.get('/notifications', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const { limit = '20', unreadOnly } = req.query as Record<string, string>;

  const where: any = { userId: req.user!.id };
  if (unreadOnly === 'true') where.read = false;

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: parseInt(limit),
  });

  const unreadCount = await prisma.notification.count({
    where: { userId: req.user!.id, read: false },
  });

  res.json({ status: 'success', data: { notifications, unreadCount } });
}));

// PUT /api/settings/notifications/read-all
router.put('/notifications/read-all', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  await prisma.notification.updateMany({
    where: { userId: req.user!.id, read: false },
    data: { read: true },
  });

  res.json({ status: 'success', message: 'All notifications marked as read' });
}));

// DELETE /api/settings/account
router.delete('/account', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  await prisma.user.delete({ where: { id: req.user!.id } });
  res.clearCookie('refreshToken');
  res.json({ status: 'success', message: 'Account deleted' });
}));

export default router;
