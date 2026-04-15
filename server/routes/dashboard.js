const express = require('express');
const Lead = require('../models/Lead');
const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const query = req.user.role !== 'admin' ? { assignedTo: req.user.id } : {};
    const [total, newL, contacted, qualified, converted, lost, bySource, byProvince, recent, valResult] = await Promise.all([
      Lead.countDocuments(query),
      Lead.countDocuments({ ...query, status: 'New' }),
      Lead.countDocuments({ ...query, status: 'Contacted' }),
      Lead.countDocuments({ ...query, status: 'Qualified' }),
      Lead.countDocuments({ ...query, status: 'Converted' }),
      Lead.countDocuments({ ...query, status: 'Lost' }),
      Lead.aggregate([{ $match: query }, { $group: { _id: '$source', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Lead.aggregate([{ $match: { ...query, province: { $ne: null } } }, { $group: { _id: '$province', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Lead.find(query).sort({ createdAt: -1 }).limit(5).select('name email status source createdAt priority'),
      Lead.aggregate([{ $match: { ...query, status: 'Converted' } }, { $group: { _id: null, total: { $sum: '$value' } } }])
    ]);
    res.json({
      overview: { total, newL, contacted, qualified, converted, lost, totalValue: valResult[0]?.total || 0, conversionRate: total > 0 ? ((converted / total) * 100).toFixed(1) : 0 },
      bySource, byProvince, recent
    });
  } catch (err) { res.status(500).json({ message: 'Server error.', error: err.message }); }
});

module.exports = router;
