const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const {
  createIdea,
  getIdea,
  updateIdea,
  deleteIdea,
  exportIdea
} = require('../controllers/ideaController');

// All routes require authentication and rate limiting
router.post('/', authMiddleware, apiLimiter, createIdea);
router.get('/:id', authMiddleware, apiLimiter, getIdea);
router.put('/:id', authMiddleware, apiLimiter, updateIdea);
router.delete('/:id', authMiddleware, apiLimiter, deleteIdea);
router.get('/export/:id', authMiddleware, apiLimiter, exportIdea);

module.exports = router;
