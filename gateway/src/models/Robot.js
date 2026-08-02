const mongoose = require('mongoose');

const robotSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  owner: { type: String, required: true },
  walletAddress: { type: String, required: true },
  type: { type: String, enum: ['lawn_mower', 'irrigation', 'drone', 'delivery'], default: 'lawn_mower' },
  batteryLevel: { type: Number, default: 100 },
  isActive: { type: Boolean, default: true },
  reputation: { type: Number, default: 100 },
  jobsCompleted: { type: Number, default: 0 },
  location: { lat: Number, lng: Number },
  referrer: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now }
}, { collection: 'robots' });

module.exports = mongoose.model('Robot', robotSchema);
