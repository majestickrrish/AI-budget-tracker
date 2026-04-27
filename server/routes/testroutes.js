const express = require('express');
const router = express.Router();
const { testProtected } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Protected test route
router.get('/protected', protect, testProtected);

module.exports = router;