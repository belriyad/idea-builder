const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { apiLimiter, paymentLimiter } = require('../middleware/rateLimiter');
const {
  getPlans,
  subscribe,
  cancelSubscription
} = require('../controllers/subscriptionController');

router.get('/plans', authMiddleware, apiLimiter, getPlans);
router.post('/subscribe', authMiddleware, paymentLimiter, subscribe);
router.put('/cancel', authMiddleware, apiLimiter, cancelSubscription);

module.exports = router;
