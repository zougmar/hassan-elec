import express from 'express';
import Request from '../models/Request.js';
import Service from '../models/Service.js';
import Project from '../models/Project.js';
import { protect, adminOrManager } from '../middleware/roles.js';

const router = express.Router();

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function getRangeBounds(period = 'month') {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const start = startOfDay(now);

  switch (period) {
    case 'day':
    case 'daily':
      // last 24 hours by hour — keep same day start
      break;
    case 'week':
    case 'weekly':
      start.setDate(start.getDate() - 6);
      break;
    case 'year':
    case 'yearly':
      start.setMonth(0, 1);
      break;
    case 'month':
    case 'monthly':
    default:
      start.setDate(1);
      break;
  }

  return { start, end, now };
}

function previousRange(period, start, end) {
  const duration = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - duration);
  return { start: prevStart, end: prevEnd };
}

function dateFormatForPeriod(period) {
  switch (period) {
    case 'day':
    case 'daily':
      return '%Y-%m-%d %H:00';
    case 'week':
    case 'weekly':
      return '%Y-%m-%d';
    case 'year':
    case 'yearly':
      return '%Y-%m';
    case 'month':
    case 'monthly':
    default:
      return '%Y-%m-%d';
  }
}

async function seriesForRange(start, end, period) {
  const format = dateFormatForPeriod(period);
  const rows = await Request.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: { $dateToString: { format, date: '$createdAt' } },
        total: { $sum: 1 },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
        done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return rows.map((r) => ({
    label: r._id,
    total: r.total,
    pending: r.pending,
    inProgress: r.inProgress,
    done: r.done
  }));
}

// GET /api/analytics/overview?period=daily|weekly|monthly|yearly&compare=1
router.get('/overview', protect, adminOrManager, async (req, res) => {
  try {
    const period = (req.query.period || 'monthly').toLowerCase();
    const compare = String(req.query.compare || '1') !== '0';
    const { start, end } = getRangeBounds(period);
    const current = await seriesForRange(start, end, period);

    let previous = [];
    if (compare) {
      const prev = previousRange(period, start, end);
      previous = await seriesForRange(prev.start, prev.end, period);
    }

    res.json({
      period,
      range: { start, end },
      current,
      previous
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/analytics/monthly?year=2026&view=monthly|yearly
router.get('/monthly', protect, adminOrManager, async (req, res) => {
  try {
    const view = String(req.query.view || 'monthly').toLowerCase() === 'yearly' ? 'yearly' : 'monthly';
    const year = Number(req.query.year) || new Date().getFullYear();

    const yearsAgg = await Request.aggregate([
      { $group: { _id: { $year: '$createdAt' } } },
      { $sort: { _id: -1 } }
    ]);
    const availableYears = yearsAgg.map((y) => y._id).filter(Boolean);

    if (view === 'yearly') {
      const rows = await Request.aggregate([
        {
          $group: {
            _id: { $year: '$createdAt' },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
            done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
            total: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const years = rows
        .filter((r) => r._id)
        .map((r) => ({
          year: r._id,
          label: String(r._id),
          pending: r.pending || 0,
          inProgress: r.inProgress || 0,
          done: r.done || 0,
          total: r.total || 0
        }));

      return res.json({ view, years, availableYears });
    }

    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);

    const rows = await Request.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
          done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
          total: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const byMonth = new Map(rows.map((r) => [r._id, r]));
    const months = Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      const row = byMonth.get(m);
      return {
        month: m,
        label: String(m).padStart(2, '0'),
        pending: row?.pending || 0,
        inProgress: row?.inProgress || 0,
        done: row?.done || 0,
        total: row?.total || 0
      };
    });

    res.json({
      view,
      year,
      months,
      availableYears
    });
  } catch (error) {
    console.error('Analytics monthly error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/analytics/status
router.get('/status', protect, adminOrManager, async (req, res) => {
  try {
    const [pending, inProgress, done] = await Promise.all([
      Request.countDocuments({ status: 'pending' }),
      Request.countDocuments({ status: 'in_progress' }),
      Request.countDocuments({ status: 'done' })
    ]);
    const total = pending + inProgress + done;
    res.json({
      total,
      items: [
        { key: 'pending', value: pending },
        { key: 'inProgress', value: inProgress },
        { key: 'done', value: done }
      ]
    });
  } catch (error) {
    console.error('Analytics status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/analytics/activity?period=daily|weekly|monthly
router.get('/activity', protect, adminOrManager, async (req, res) => {
  try {
    const period = (req.query.period || 'weekly').toLowerCase();
    const { start, end } = getRangeBounds(period);
    const series = await seriesForRange(start, end, period);
    res.json({ period, range: { start, end }, series });
  } catch (error) {
    console.error('Analytics activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/analytics/top-services?limit=10
router.get('/top-services', protect, adminOrManager, async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 20);
    const rows = await Request.aggregate([
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);

    res.json({
      items: rows
        .filter((r) => r._id)
        .map((r) => ({
          service: r._id,
          count: r.count
        }))
    });
  } catch (error) {
    console.error('Analytics top-services error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/analytics/performance
router.get('/performance', protect, adminOrManager, async (req, res) => {
  try {
    const [total, pending, inProgress, done, projects, services] = await Promise.all([
      Request.countDocuments(),
      Request.countDocuments({ status: 'pending' }),
      Request.countDocuments({ status: 'in_progress' }),
      Request.countDocuments({ status: 'done' }),
      Project.countDocuments(),
      Service.countDocuments()
    ]);

    res.json({
      indicators: [
        { key: 'totalRequests', value: total },
        { key: 'completed', value: done },
        { key: 'pending', value: pending },
        { key: 'inProgress', value: inProgress },
        { key: 'projects', value: projects },
        { key: 'services', value: services }
      ]
    });
  } catch (error) {
    console.error('Analytics performance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
