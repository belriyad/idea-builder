const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { apiLimiter, paymentLimiter } = require('../middleware/rateLimiter');
const {
  createPRD,
  getTemplates,
  updateTemplate,
  customizePRD,
  previewPRD,
  exportPRD,
  submitForReview,
  getReviewStatus
} = require('../controllers/prdController');

// PRD generation (requires payment)
router.post('/generate', authMiddleware, paymentLimiter, createPRD);

// Template management
router.get('/templates', authMiddleware, apiLimiter, getTemplates);
router.put('/template', authMiddleware, apiLimiter, updateTemplate);

// Customization
router.post('/customize', authMiddleware, apiLimiter, customizePRD);
router.get('/preview', authMiddleware, apiLimiter, previewPRD);
router.post('/export', authMiddleware, apiLimiter, exportPRD);

// Human review
router.post('/review', authMiddleware, paymentLimiter, submitForReview);
router.get('/review/status', authMiddleware, apiLimiter, getReviewStatus);

module.exports = router;
