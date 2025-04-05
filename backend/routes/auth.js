const express = require('express');
const router = express.Router();
const { verifyTokenAndAttachUser, checkAdmin } = require('../middleware/auth.middleware');

// Check if user is admin
router.get('/check-admin', verifyTokenAndAttachUser, checkAdmin, (req, res) => {
  try {
    // Set proper content type
    res.setHeader('Content-Type', 'application/json');

    res.json({ 
      isAdmin: true,
      email: req.user.email,
      role: req.user.role
    });
  } catch (error) {
    console.error('Error in check-admin route:', error);
    res.status(500).json({ 
      isAdmin: false,
      message: 'Error checking admin status',
      error: error.message
    });
  }
});

module.exports = router; 