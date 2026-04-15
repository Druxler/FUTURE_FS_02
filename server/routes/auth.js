const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required.' });
    const user = await User.findOne({ email: email.toLowerCase(), isActive: true });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials.' });
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET, { expiresIn: '8h' }
    );
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { res.status(500).json({ message: 'Server error.', error: err.message }); }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

router.post('/create-agent', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists.' });
    const user = new User({ name, email, password, role: role || 'agent' });
    await user.save();
    res.status(201).json({ message: 'Agent created.', user: { id: user._id, name, email, role: user.role } });
  } catch (err) { res.status(500).json({ message: 'Server error.', error: err.message }); }
});

router.get('/agents', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const agents = await User.find({ isActive: true }).select('-password').sort({ createdAt: -1 });
    res.json(agents);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

module.exports = router;
