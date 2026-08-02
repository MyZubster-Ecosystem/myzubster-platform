const express = require('express');
const router = express.Router();
const Robot = require('../models/Robot');

// Registra robot
router.post('/register', async (req, res) => {
  try {
    const robot = new Robot(req.body);
    await robot.save();
    res.json({ success: true, robot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Richiedi ricarica (x402)
router.get('/ricarica', async (req, res) => {
  try {
    const { robotId, amount } = req.query;
    const robot = await Robot.findOne({ id: robotId });
    if (!robot) return res.status(404).json({ error: 'Robot not found' });

    const fee = parseFloat(amount) * 0.02;
    const boscoFee = parseFloat(amount) * 0.08;
    const total = parseFloat(amount) + fee + boscoFee;

    res.status(402).json({
      status: 'payment_required',
      amount: total,
      fee: fee,
      boscoFee: boscoFee,
      address: robot.walletAddress,
      memo: `Ricarica robot ${robotId}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Alias per charge (x402 standard)
router.get('/charge', async (req, res) => {
  try {
    const { robotId, amount } = req.query;
    const robot = await Robot.findOne({ id: robotId });
    if (!robot) return res.status(404).json({ error: 'Robot not found' });

    const fee = parseFloat(amount) * 0.02;
    const boscoFee = parseFloat(amount) * 0.08;
    const total = parseFloat(amount) + fee + boscoFee;

    res.status(402).json({
      status: 'payment_required',
      amount: total,
      fee: fee,
      boscoFee: boscoFee,
      address: robot.walletAddress,
      memo: `Recharge for robot ${robotId}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ottieni robot
router.get('/:robotId', async (req, res) => {
  try {
    const robot = await Robot.findOne({ id: req.params.robotId });
    if (!robot) return res.status(404).json({ error: 'Robot not found' });
    res.json(robot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Aggiorna posizione
router.post('/:robotId/location', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const robot = await Robot.findOneAndUpdate(
      { id: req.params.robotId },
      { location: { lat, lng }, lastSeen: new Date() },
      { new: true }
    );
    res.json(robot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
