const express = require('express');
const router = express.Router();
const Escrow = require('../models/Escrow');
const Robot = require('../models/Robot');

// 1. Crea escrow
router.post('/create', async (req, res) => {
  try {
    const { robotId, clientAddress, amount, jobDescription } = req.body;
    const robot = await Robot.findOne({ id: robotId });
    if (!robot) return res.status(404).json({ error: 'Robot not found' });

    const fee = amount * 0.02;
    const boscoFee = amount * 0.08;
    const total = amount + fee + boscoFee;

    const escrow = new Escrow({
      id: `escrow_${Date.now()}`,
      robotId,
      clientAddress,
      amount: total,
      jobDescription,
      status: 'pending'
    });
    await escrow.save();

    res.json({
      success: true,
      escrow: {
        id: escrow.id,
        robotId,
        amount: total,
        fee,
        boscoFee,
        address: robot.walletAddress,
        status: 'pending'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Robot approva lavoro
router.post('/:escrowId/robot-approve', async (req, res) => {
  try {
    const escrow = await Escrow.findOne({ id: req.params.escrowId });
    if (!escrow) return res.status(404).json({ error: 'Escrow not found' });
    if (escrow.status !== 'in_progress') return res.status(400).json({ error: 'Invalid status' });

    escrow.robotApproved = true;
    escrow.status = 'completed';
    escrow.completedAt = new Date();
    await escrow.save();

    res.json({
      success: true,
      escrow,
      message: 'Robot approved work. Waiting for client confirmation.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Cliente approva lavoro
router.post('/:escrowId/client-approve', async (req, res) => {
  try {
    const escrow = await Escrow.findOne({ id: req.params.escrowId });
    if (!escrow) return res.status(404).json({ error: 'Escrow not found' });
    if (escrow.status !== 'completed') return res.status(400).json({ error: 'Invalid status' });

    escrow.clientApproved = true;
    await escrow.save();

    // Se robot e cliente hanno approvato → rilascia
    if (escrow.robotApproved && escrow.clientApproved) {
      escrow.status = 'released';
      escrow.releasedAt = new Date();
      await escrow.save();

      const robot = await Robot.findOne({ id: escrow.robotId });
      if (robot) {
        robot.jobsCompleted += 1;
        await robot.save();
      }

      res.json({
        success: true,
        escrow,
        distribution: {
          owner: escrow.amount * 0.90,
          myZubster: escrow.amount * 0.02,
          bosco: escrow.amount * 0.08
        },
        message: '✅ Funds released!'
      });
    }

    res.json({ success: true, escrow, message: 'Client approved. Waiting for robot confirmation.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Disputa
router.post('/:escrowId/dispute', async (req, res) => {
  try {
    const escrow = await Escrow.findOne({ id: req.params.escrowId });
    if (!escrow) return res.status(404).json({ error: 'Escrow not found' });
    if (escrow.status === 'released') return res.status(400).json({ error: 'Already released' });

    escrow.status = 'disputed';
    await escrow.save();

    // Simula AI decisione
    const aiDecision = {
      decision: Math.random() > 0.3 ? 'RELEASE' : 'REFUND',
      confidence: 0.85,
      reason: 'GPS logs show robot completed the job successfully.',
      timestamp: new Date()
    };

    res.json({
      success: true,
      escrow,
      aiDecision,
      message: 'Dispute opened. AI arbiter will review within 24h.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. AI risolve disputa
router.post('/:escrowId/ai-resolve', async (req, res) => {
  try {
    const escrow = await Escrow.findOne({ id: req.params.escrowId });
    if (!escrow) return res.status(404).json({ error: 'Escrow not found' });

    escrow.status = 'released';
    escrow.releasedAt = new Date();
    escrow.aiApproved = true;
    await escrow.save();

    res.json({
      success: true,
      escrow,
      message: 'AI resolved dispute. Funds released.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Ottieni stato escrow
router.get('/:escrowId', async (req, res) => {
  try {
    const escrow = await Escrow.findOne({ id: req.params.escrowId });
    if (!escrow) return res.status(404).json({ error: 'Escrow not found' });
    res.json(escrow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
