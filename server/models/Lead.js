const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  company: { type: String, trim: true },
  province: {
    type: String,
    enum: ['Gauteng','Western Cape','KwaZulu-Natal','Eastern Cape','Limpopo','Mpumalanga','North West','Free State','Northern Cape','Other']
  },
  city: { type: String, trim: true },
  source: {
    type: String,
    enum: ['Website Form','WhatsApp','Referral','Cold Call','Social Media','Email Campaign','Walk-In','Other'],
    default: 'Website Form'
  },
  status: {
    type: String,
    enum: ['New','Contacted','Qualified','Proposal Sent','Converted','Lost'],
    default: 'New'
  },
  priority: { type: String, enum: ['Low','Medium','High'], default: 'Medium' },
  value: { type: Number, default: 0 },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: [noteSchema],
  followUpDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

leadSchema.pre('save', function (next) { this.updatedAt = new Date(); next(); });

module.exports = mongoose.model('Lead', leadSchema);
