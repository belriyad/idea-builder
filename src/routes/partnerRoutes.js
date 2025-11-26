const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { authLimiter, apiLimiter } = require('../middleware/rateLimiter');
const {
  partnerSignup,
  verifyEmail,
  sendConnectionRequest,
  getCollaborations,
  respondToCollaboration
} = require('../controllers/partnerController');

// Public routes with rate limiting
router.post('/signup', authLimiter, partnerSignup);
router.get('/verify', apiLimiter, verifyEmail);

// Protected routes with rate limiting
router.post('/request', authMiddleware, apiLimiter, sendConnectionRequest);
router.get('/collaborations', authMiddleware, apiLimiter, getCollaborations);
router.put('/response', authMiddleware, apiLimiter, respondToCollaboration);

module.exports = router;
