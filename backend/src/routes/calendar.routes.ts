import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { catchAsync } from '../middleware/error.middleware';

const router = Router();

// GET /api/calendar
router.get('/', authenticate, catchAsync(async (req: AuthRequest, res: Response) => {
  const { from, to, impact, currency } = req.query as Record<string, string>;

  const now = new Date();
  const dateFrom = from ? new Date(from) : new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateTo = to ? new Date(to) : new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

  const where: any = { date: { gte: dateFrom, lte: dateTo } };
  if (impact) where.impact = impact;
  if (currency) where.currency = { in: currency.split(',') };

  let events = await prisma.economicEvent.findMany({
    where,
    orderBy: { date: 'asc' },
  });

  // If no events in DB, return sample data
  if (events.length === 0) {
    events = generateSampleEvents(dateFrom, dateTo) as any;
  }

  res.json({ status: 'success', data: { events } });
}));

function generateSampleEvents(from: Date, to: Date) {
  const sampleEvents = [
    { title: 'Non-Farm Payrolls', country: 'US', currency: 'USD', impact: 'high', forecast: '200K', previous: '187K' },
    { title: 'CPI m/m', country: 'US', currency: 'USD', impact: 'high', forecast: '0.3%', previous: '0.2%' },
    { title: 'ECB Interest Rate Decision', country: 'EU', currency: 'EUR', impact: 'high', forecast: '4.50%', previous: '4.50%' },
    { title: 'GDP q/q', country: 'UK', currency: 'GBP', impact: 'high', forecast: '0.2%', previous: '0.1%' },
    { title: 'Unemployment Rate', country: 'US', currency: 'USD', impact: 'medium', forecast: '3.8%', previous: '3.7%' },
    { title: 'Retail Sales m/m', country: 'US', currency: 'USD', impact: 'medium', forecast: '0.4%', previous: '0.6%' },
    { title: 'PMI Manufacturing', country: 'US', currency: 'USD', impact: 'medium', forecast: '49.5', previous: '49.2' },
    { title: 'BOE Interest Rate Decision', country: 'UK', currency: 'GBP', impact: 'high', forecast: '5.25%', previous: '5.25%' },
    { title: 'Core PCE Price Index m/m', country: 'US', currency: 'USD', impact: 'high', forecast: '0.2%', previous: '0.3%' },
    { title: 'Trade Balance', country: 'JP', currency: 'JPY', impact: 'low', forecast: '-¥0.5T', previous: '-¥0.6T' },
    { title: 'Employment Change', country: 'AU', currency: 'AUD', impact: 'medium', forecast: '25.0K', previous: '14.6K' },
    { title: 'FOMC Meeting Minutes', country: 'US', currency: 'USD', impact: 'high', forecast: '', previous: '' },
    { title: 'Consumer Confidence', country: 'EU', currency: 'EUR', impact: 'low', forecast: '-15.5', previous: '-16.1' },
    { title: 'BOJ Interest Rate Decision', country: 'JP', currency: 'JPY', impact: 'high', forecast: '-0.10%', previous: '-0.10%' },
  ];

  const events = [];
  const current = new Date(from);
  let eventIdx = 0;

  while (current <= to && events.length < 30) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const numEvents = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numEvents && eventIdx < sampleEvents.length; i++) {
        const event = sampleEvents[eventIdx % sampleEvents.length];
        const hour = 8 + Math.floor(Math.random() * 9);
        const minute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
        const eventDate = new Date(current);
        eventDate.setHours(hour, minute, 0, 0);

        events.push({
          id: `evt_${events.length}`,
          ...event,
          date: eventDate.toISOString(),
          actual: Math.random() > 0.5 ? event.forecast : null,
          createdAt: new Date().toISOString(),
        });
        eventIdx++;
      }
    }
    current.setDate(current.getDate() + 1);
  }

  return events;
}

export default router;
