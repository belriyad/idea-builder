const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  createTree,
  getTree,
  updateTree,
  deleteTree,
  exportTree
} = require('../controllers/treeController');

router.post('/', authMiddleware, createTree);
router.get('/:id', authMiddleware, getTree);
router.put('/:id', authMiddleware, updateTree);
router.delete('/:id', authMiddleware, deleteTree);
router.get('/:id/export', authMiddleware, exportTree);

module.exports = router;
