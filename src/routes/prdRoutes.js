const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
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
router.post('/generate', authMiddleware, createPRD);

// Template management
router.get('/templates', authMiddleware, getTemplates);
router.put('/template', authMiddleware, updateTemplate);

// Customization
router.post('/customize', authMiddleware, customizePRD);
router.get('/preview', authMiddleware, previewPRD);
router.post('/export', authMiddleware, exportPRD);

// Human review
router.post('/review', authMiddleware, submitForReview);
router.get('/review/status', authMiddleware, getReviewStatus);

module.exports = router;
