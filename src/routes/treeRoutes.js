const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const {
  createTree,
  getTree,
  updateTree,
  deleteTree,
  exportTree
} = require('../controllers/treeController');

router.post('/', authMiddleware, apiLimiter, createTree);
router.get('/:id', authMiddleware, apiLimiter, getTree);
router.put('/:id', authMiddleware, apiLimiter, updateTree);
router.delete('/:id', authMiddleware, apiLimiter, deleteTree);
router.get('/:id/export', authMiddleware, apiLimiter, exportTree);

module.exports = router;
