const express = require('express');
const Lead = require('../models/Lead');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { status, source, priority, province, search, page = 1, limit = 15 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (source) query.source = source;
    if (priority) query.priority = priority;
    if (province) query.province = province;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
    if (req.user.role !== 'admin') query.assignedTo = req.user.id;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ leads, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: 'Server error.', error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email').populate('createdBy', 'name');
    if (!lead) return res.status(404).json({ message: 'Lead not found.' });
    res.json(lead);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

router.post('/', async (req, res) => {
  try {
    const lead = new Lead({ ...req.body, createdBy: req.user.id });
    await lead.save();
    res.status(201).json(lead);
  } catch (err) { res.status(500).json({ message: 'Server error.', error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true, runValidators: true }).populate('assignedTo', 'name email');
    if (!lead) return res.status(404).json({ message: 'Lead not found.' });
    res.json(lead);
  } catch (err) { res.status(500).json({ message: 'Server error.', error: err.message }); }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found.' });
    res.json({ message: 'Lead deleted.' });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

router.post('/:id/notes', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Note content required.' });
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found.' });
    lead.notes.push({ content, createdBy: req.user.name });
    lead.updatedAt = new Date();
    await lead.save();
    res.json(lead);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, { status: req.body.status, updatedAt: new Date() }, { new: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found.' });
    res.json(lead);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

module.exports = router;
