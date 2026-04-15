require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');
const dashboardRoutes = require('./routes/dashboard');
const { authenticateToken } = require('./middleware/auth');
const { seedAdmin } = require('./utils/seed');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/public')));

app.use('/api/auth', authRoutes);
app.use('/api/leads', authenticateToken, leadRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'LeadPulse CRM Running', time: new Date().toISOString() });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected:', process.env.MONGO_URI);
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`\n🚀 LeadPulse CRM is running!`);
      console.log(`   Open in browser: http://localhost:${PORT}`);
      console.log(`   Admin Email:     ${process.env.ADMIN_EMAIL}`);
      console.log(`   Admin Password:  ${process.env.ADMIN_PASSWORD}\n`);
    });
  })
  .catch(err => {
    console.error('\n❌ MongoDB connection failed!');
    console.error('   Error:', err.message);
    console.error('   Make sure MongoDB is installed and running.');
    console.error('   See README.md for help.\n');
    process.exit(1);
  });
