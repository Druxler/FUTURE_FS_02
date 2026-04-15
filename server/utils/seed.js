const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@yourcompany.co.za';
    const exists = await User.findOne({ email });
    if (!exists) {
      await new User({ name: 'System Admin', email, password: process.env.ADMIN_PASSWORD || 'Admin@123', role: 'admin' }).save();
      console.log('✅ Admin created:', email);
    } else {
      console.log('ℹ️  Admin already exists:', email);
    }
  } catch (err) { console.error('Seed error:', err.message); }
};

module.exports = { seedAdmin };
