const express = require('express');
const router = express.Router();
const { register, login } = require('../utils/auth');

/**
 * Test registration endpoint
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const result = await register(email, password, role);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role
      },
      token: result.token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Test login endpoint
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    
    res.json({
      message: 'Login successful',
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role
      },
      token: result.token
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
