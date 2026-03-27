import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { catchAsync } from '../middleware/error.middleware';

const router = Router();

const channels = [
  { id: 'announcements', name: '📢 announcements', description: 'Official announcements', readOnly: true },
  { id: 'general', name: '💬 general-chat', description: 'General discussion' },
  { id: 'trade-ideas', name: '📊 trade-ideas', description: 'Share your trade setups' },
  { id: 'gold-xauusd', name: '🥇 gold-xauusd', description: 'Gold & XAUUSD discussion' },
  { id: 'forex-majors', name: '💶 forex-majors', description: 'Major currency pairs' },
  { id: 'indices', name: '📈 indices', description: 'Stock indices discussion' },
  { id: 'backtesting-lab', name: '🔬 backtesting-lab', description: 'Backtesting strategies' },
  { id: 'ai-signals', name: '🤖 ai-signals', description: 'AI-generated signals' },
  { id: 'education', name: '🎓 education', description: 'Learning resources' },
  { id: 'wins-and-losses', name: '🏆 wins-and-losses', description: 'Share your results' },
];

// GET /api/community/channels
router.get('/channels', authenticate, catchAsync(async (_req: AuthRequest, res: Response) => {
  res.json({ status: 'success', data: { channels } });
}));

// GET /api/community/messages/:roomId
router.get('/messages/:roomId', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const { cursor, limit = '50' } = req.query as Record<string, string>;

  const where: any = { roomId: req.params.roomId };
  if (cursor) {
    where.createdAt = { lt: new Date(cursor) };
  }

  const messages = await prisma.message.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: parseInt(limit),
    include: {
      user: {
        select: { id: true, name: true, username: true, avatarUrl: true, winRate: true, totalTrades: true },
      },
    },
  });

  res.json({
    status: 'success',
    data: {
      messages: messages.reverse(),
      hasMore: messages.length === parseInt(limit),
    },
  });
}));

// POST /api/community/messages
router.post('/messages', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const { content, roomId = 'general', attachments = [], replyToId } = req.body;

  const message = await prisma.message.create({
    data: {
      userId: req.user!.id,
      content,
      roomId,
      attachments,
      replyToId,
    },
    include: {
      user: {
        select: { id: true, name: true, username: true, avatarUrl: true, winRate: true, totalTrades: true },
      },
    },
  });

  res.status(201).json({ status: 'success', data: { message } });
}));

// PUT /api/community/messages/:id
router.put('/messages/:id', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const message = await prisma.message.updateMany({
    where: { id: req.params.id, userId: req.user!.id },
    data: { content: req.body.content, isEdited: true },
  });

  res.json({ status: 'success', data: { message } });
}));

// DELETE /api/community/messages/:id
router.delete('/messages/:id', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  await prisma.message.deleteMany({
    where: { id: req.params.id, userId: req.user!.id },
  });
  res.json({ status: 'success', message: 'Message deleted' });
}));

// POST /api/community/messages/:id/react
router.post('/messages/:id/react', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const { emoji } = req.body;
  const msg = await prisma.message.findUnique({ where: { id: req.params.id } });
  if (!msg) return res.status(404).json({ message: 'Message not found' });

  const reactions = (msg.reactions as Record<string, string[]>) || {};
  if (!reactions[emoji]) reactions[emoji] = [];

  const userId = req.user!.id;
  if (reactions[emoji].includes(userId)) {
    reactions[emoji] = reactions[emoji].filter(id => id !== userId);
  } else {
    reactions[emoji].push(userId);
  }

  await prisma.message.update({
    where: { id: req.params.id },
    data: { reactions },
  });

  res.json({ status: 'success', data: { reactions } });
}));

export default router;
