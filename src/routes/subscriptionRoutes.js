const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  getPlans,
  subscribe,
  cancelSubscription
} = require('../controllers/subscriptionController');

router.get('/plans', authMiddleware, getPlans);
router.post('/subscribe', authMiddleware, subscribe);
router.put('/cancel', authMiddleware, cancelSubscription);

module.exports = router;
