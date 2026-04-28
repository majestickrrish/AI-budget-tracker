const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require('../controllers/expensecontroller');
const { protect } = require('../middleware/authmiddleware');

// All expense routes are protected
router.post('/', protect, createExpense);
router.get('/', protect, getExpenses);
router.patch('/:id', protect, updateExpense);
router.delete('/:id', protect, deleteExpense);

module.exports = router;