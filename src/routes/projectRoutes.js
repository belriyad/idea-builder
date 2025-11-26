const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  getProjects,
  submitBid,
  getProjectBids,
  createProject
} = require('../controllers/projectController');

// Public route to view projects
router.get('/', getProjects);

// Protected routes
router.post('/', authMiddleware, createProject);
router.post('/:id/bid', authMiddleware, submitBid);
router.get('/:id/bids', authMiddleware, getProjectBids);

module.exports = router;
