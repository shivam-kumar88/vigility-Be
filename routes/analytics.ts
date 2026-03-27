// routes/analytics.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

//  /api/track
router.post('/track', authenticateToken, async (req: Request, res: Response): Promise<any> => {
  try {
    const { feature_name } = req.body;
    const userId = (req as any).user.userId;

    if (!feature_name) return res.status(400).json({ error: 'feature_name is required' });

    const click = await prisma.featureClicks.create({
      data: { userId, feature_name },
    });

    res.status(201).json({ message: 'Click tracked successfully', click });
  } catch (error) {
    console.error('Track error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//  /api/analytics
router.get('/analytics', authenticateToken, async (req: Request, res: Response): Promise<any> => {
  try {
    const { startDate, endDate, age, gender } = req.query;
    const filterConditions: any = {};

    if (startDate && endDate) {
      filterConditions.timestamp = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const userFilter: any = {};
    if (age) {
      const ageGroup = String(age);
      if (ageGroup === '<18') userFilter.age = { lt: 18 };
      else if (ageGroup === '18-40') userFilter.age = { gte: 18, lte: 40 };
      else if (ageGroup === '>40') userFilter.age = { gt: 40 };
    }
    if (gender) userFilter.gender = gender;

    if (Object.keys(userFilter).length > 0) filterConditions.user = userFilter;

    const barChartData = await prisma.featureClicks.groupBy({
      by: ['feature_name'],
      where: filterConditions,
      _count: { feature_name: true },
    });

    const formattedBarChart = barChartData.map((item:any) => ({
      feature: item.feature_name,
      clicks: item._count.feature_name,
    }));

    const lineChartRawData = await prisma.featureClicks.findMany({
      where: filterConditions,
      select: { feature_name: true, timestamp: true },
      orderBy: { timestamp: 'asc' },
    });

    res.json({ barChart: formattedBarChart, lineChart: lineChartRawData });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;