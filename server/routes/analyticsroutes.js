const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getSummary,
  getPrediction,
  getAnomalies,
  getInsights,
  getHealthScore,
} = require('../controllers/analyticscontroller');

// All analytics routes are protected
router.get('/summary', protect, getSummary);
router.get('/prediction', protect, getPrediction);
router.get('/anomalies', protect, getAnomalies);
router.get('/insights', protect, getInsights);
router.get('/health-score', protect, getHealthScore);

module.exports = router;
