"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/analytics.ts
const express_1 = require("express");
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
//  /api/track
router.post('/track', authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const { feature_name } = req.body;
        const userId = req.user.userId;
        if (!feature_name)
            return res.status(400).json({ error: 'feature_name is required' });
        const click = await prisma.featureClicks.create({
            data: { userId, feature_name },
        });
        res.status(201).json({ message: 'Click tracked successfully', click });
    }
    catch (error) {
        console.error('Track error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//  /api/analytics
router.get('/analytics', authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const { startDate, endDate, age, gender } = req.query;
        const filterConditions = {};
        if (startDate && endDate) {
            filterConditions.timestamp = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        const userFilter = {};
        if (age) {
            const ageGroup = String(age);
            if (ageGroup === '<18')
                userFilter.age = { lt: 18 };
            else if (ageGroup === '18-40')
                userFilter.age = { gte: 18, lte: 40 };
            else if (ageGroup === '>40')
                userFilter.age = { gt: 40 };
        }
        if (gender)
            userFilter.gender = gender;
        if (Object.keys(userFilter).length > 0)
            filterConditions.user = userFilter;
        const barChartData = await prisma.featureClicks.groupBy({
            by: ['feature_name'],
            where: filterConditions,
            _count: { feature_name: true },
        });
        const formattedBarChart = barChartData.map((item) => ({
            feature: item.feature_name,
            clicks: item._count.feature_name,
        }));
        const lineChartRawData = await prisma.featureClicks.findMany({
            where: filterConditions,
            select: { feature_name: true, timestamp: true },
            orderBy: { timestamp: 'asc' },
        });
        res.json({ barChart: formattedBarChart, lineChart: lineChartRawData });
    }
    catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
