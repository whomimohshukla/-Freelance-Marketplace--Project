const express = require('express');
const router = express.Router();
const paymentsCtrl = require('../controllers/payments/payment.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware'); // assume you have role middleware

// Create order (client funds milestone/project)
router.post('/order', auth, role('client'), paymentsCtrl.createOrder);

// Razorpay webhook (must be raw body, so mount without bodyParser here)
router.post('/webhook', express.raw({ type: 'application/json' }), paymentsCtrl.webhook);

// Release escrow (client approval)
router.post('/projects/:pid/milestones/:mid/release', auth, role('Client'), paymentsCtrl.releaseEscrow);

// Refund (admin)
router.post('/:id/refund', auth, role('Admin'), paymentsCtrl.refund);

module.exports = router;
