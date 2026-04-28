const express = require('express');
const router = express.Router();
const { register, login, getMe, testProtected } = require('../controllers/authcontroller');
const { protect } = require('../middleware/authmiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;