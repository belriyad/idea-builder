const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  createIdea,
  getIdea,
  updateIdea,
  deleteIdea,
  exportIdea
} = require('../controllers/ideaController');

// All routes require authentication
router.post('/', authMiddleware, createIdea);
router.get('/:id', authMiddleware, getIdea);
router.put('/:id', authMiddleware, updateIdea);
router.delete('/:id', authMiddleware, deleteIdea);
router.get('/export/:id', authMiddleware, exportIdea);

module.exports = router;
