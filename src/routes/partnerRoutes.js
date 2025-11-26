const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  partnerSignup,
  verifyEmail,
  sendConnectionRequest,
  getCollaborations,
  respondToCollaboration
} = require('../controllers/partnerController');

// Public routes
router.post('/signup', partnerSignup);
router.get('/verify', verifyEmail);

// Protected routes
router.post('/request', authMiddleware, sendConnectionRequest);
router.get('/collaborations', authMiddleware, getCollaborations);
router.put('/response', authMiddleware, respondToCollaboration);

module.exports = router;
