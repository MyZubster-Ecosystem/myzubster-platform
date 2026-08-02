const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10003;

app.use(cors());
app.use(express.json());

// MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myzubster';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Routes
const robotRoutes = require('./routes/robot');
const escrowRoutes = require('./routes/escrow');
const paymentRoutes = require('./routes/payments');
const marketplaceRoutes = require('./routes/marketplace');

app.use('/api/robot', robotRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/marketplace', marketplaceRoutes);

app.get('/', (req, res) => {
  res.json({
    name: 'MyZubster Gateway',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      robot: '/api/robot',
      escrow: '/api/escrow',
      payments: '/api/payments',
      marketplace: '/api/marketplace'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 MyZubster Gateway running on port ${PORT}`);
});
