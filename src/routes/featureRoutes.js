const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const {
  getFeatureTree,
  saveFeatureSelection,
  getUserFeatureSelections
} = require('../controllers/featureController');

router.get('/tree', authMiddleware, apiLimiter, getFeatureTree);
router.post('/selection', authMiddleware, apiLimiter, saveFeatureSelection);
router.get('/selection', authMiddleware, apiLimiter, getUserFeatureSelections);

module.exports = router;
