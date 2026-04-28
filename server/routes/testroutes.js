const express = require('express');
const router = express.Router();
const { testProtected } = require('../controllers/authcontroller');
const { protect } = require('../middleware/authmiddleware');

// Protected test route
router.get('/protected', protect, testProtected);

module.exports = router;