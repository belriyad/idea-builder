const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const {
  getProjects,
  submitBid,
  getProjectBids,
  createProject
} = require('../controllers/projectController');

// Public route to view projects with rate limiting
router.get('/', apiLimiter, getProjects);

// Protected routes with rate limiting
router.post('/', authMiddleware, apiLimiter, createProject);
router.post('/:id/bid', authMiddleware, apiLimiter, submitBid);
router.get('/:id/bids', authMiddleware, apiLimiter, getProjectBids);

module.exports = router;
