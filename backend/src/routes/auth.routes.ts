import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/ratelimit.middleware';
import { catchAsync, AppError } from '../middleware/error.middleware';

const router = Router();

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

const generateTokens = (user: { id: string; email: string; username: string }) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, username: user.username },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );

  return { accessToken, refreshToken };
};

// POST /api/auth/register
router.post('/register', authLimiter, catchAsync(async (req, res) => {
  const data = registerSchema.parse(req.body);

  const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingEmail) throw new AppError('Email already registered', 400);

  const existingUsername = await prisma.user.findUnique({ where: { username: data.username } });
  if (existingUsername) throw new AppError('Username already taken', 400);

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      username: data.username,
    },
    select: { id: true, email: true, name: true, username: true, avatarUrl: true },
  });

  const { accessToken, refreshToken } = generateTokens(user);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    status: 'success',
    data: { user, accessToken },
  });
}));

// POST /api/auth/login
router.post('/login', authLimiter, catchAsync(async (req, res) => {
  const data = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: {
      id: true, email: true, name: true, username: true,
      avatarUrl: true, passwordHash: true,
    },
  });

  if (!user || !user.passwordHash) {
    throw new AppError('Invalid email or password', 401);
  }

  const validPassword = await bcrypt.compare(data.password, user.passwordHash);
  if (!validPassword) {
    throw new AppError('Invalid email or password', 401);
  }

  const { passwordHash, ...userData } = user;
  const { accessToken, refreshToken } = generateTokens(userData);

  await prisma.user.update({
    where: { id: user.id },
    data: { isOnline: true },
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({
    status: 'success',
    data: { user: userData, accessToken },
  });
}));

// POST /api/auth/logout
router.post('/logout', authenticate, catchAsync(async (req: AuthRequest, res) => {
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { isOnline: false },
  });

  res.clearCookie('refreshToken');
  res.json({ status: 'success', message: 'Logged out' });
}));

// POST /api/auth/refresh
router.post('/refresh', catchAsync(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new AppError('Refresh token required', 401);

  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || 'refresh-secret'
  ) as { userId: string };

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, username: true, name: true, avatarUrl: true },
  });

  if (!user) throw new AppError('User not found', 401);

  const { accessToken, refreshToken } = generateTokens(user);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({ status: 'success', data: { accessToken } });
}));

// POST /api/auth/forgot-password 
router.post('/forgot-password', authLimiter, catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success (don't reveal if user exists)
  if (user) {
    const resetToken = jwt.sign(
      { userId: user.id, type: 'reset' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
    // In production, send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  res.json({
    status: 'success',
    message: 'If that email exists, a reset link has been sent',
  });
}));

// POST /api/auth/reset-password
router.post('/reset-password', authLimiter, catchAsync(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) throw new AppError('Token and password required', 400);

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
    userId: string;
    type: string;
  };

  if (decoded.type !== 'reset') throw new AppError('Invalid reset token', 400);

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { id: decoded.userId },
    data: { passwordHash },
  });

  res.json({ status: 'success', message: 'Password reset successful' });
}));

// GET /api/auth/me
router.get('/me', authenticate, catchAsync(async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true, email: true, name: true, username: true,
      avatarUrl: true, bio: true, emailVerified: true,
      totalPnl: true, winRate: true, totalTrades: true,
      timezone: true, currency: true, theme: true,
      createdAt: true, updatedAt: true,
    },
  });

  res.json({ status: 'success', data: { user } });
}));

// GET /api/auth/verify-email/:token
router.get('/verify-email/:token', catchAsync(async (req, res) => {
  const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET || 'secret') as {
    userId: string;
    type: string;
  };

  if (decoded.type !== 'verify-email') throw new AppError('Invalid verification token', 400);

  await prisma.user.update({
    where: { id: decoded.userId },
    data: { emailVerified: true },
  });

  res.json({ status: 'success', message: 'Email verified' });
}));

export default router;
