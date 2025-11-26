const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  getFeatureTree,
  saveFeatureSelection,
  getUserFeatureSelections
} = require('../controllers/featureController');

router.get('/tree', authMiddleware, getFeatureTree);
router.post('/selection', authMiddleware, saveFeatureSelection);
router.get('/selection', authMiddleware, getUserFeatureSelections);

module.exports = router;
