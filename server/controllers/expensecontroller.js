const Expense = require('../models/Expense');
const { categorizeExpense } = require('../services/categorizationService');
const { sendSuccess, sendError } = require('../utils/response');

// ─── Create Expense ───────────────────────────────────────────────────────────
const createExpense = async (req, res) => {
  try {
    const { amount, description, date, isRecurring } = req.body;

    // Validate input
    if (!amount || !description || !date) {
      return sendError(res, {
        statusCode: 400,
        message: 'Amount, description, and date are required.',
        code: 'MISSING_FIELDS',
        details: {
          required: ['amount', 'description', 'date'],
          received: Object.keys(req.body),
        },
      });
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      return sendError(res, {
        statusCode: 400,
        message: 'Amount must be a positive number.',
        code: 'INVALID_AMOUNT',
      });
    }

    // Hybrid categorization:
    // 1. Try rule-based matching first
    // 2. If no rule matches, use the Naive Bayes fallback
    const category = categorizeExpense(description);

    // Create expense
    const expense = await Expense.create({
      userId: req.userId,
      amount: Number(amount),
      description,
      category,
      date: new Date(date),
      isRecurring: isRecurring || false,
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Expense created successfully.',
      data: { expense },
    });
  } catch (err) {
    console.error('[createExpense]', err.message);
    return sendError(res, {
      statusCode: 500,
      message: 'Something went wrong while creating expense.',
      code: 'CREATE_EXPENSE_FAILED',
      details: err.message,
    });
  }
};

// ─── Get Expenses ─────────────────────────────────────────────────────────────
const getExpenses = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Validate month and year
    const selectedMonth = parseInt(month) || new Date().getMonth() + 1;
    const selectedYear = parseInt(year) || new Date().getFullYear();

    if (selectedMonth < 1 || selectedMonth > 12) {
      return sendError(res, {
        statusCode: 400,
        message: 'Month must be between 1 and 12.',
        code: 'INVALID_MONTH',
      });
    }

    // Build date range for the selected month/year
    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);

    const expenses = await Expense.find({
      userId: req.userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    // Calculate total spending
    const totalSpending = expenses.reduce((sum, e) => sum + e.amount, 0);

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Expenses fetched successfully.',
      data: {
        expenses,
        totalSpending: parseFloat(totalSpending.toFixed(2)),
      },
      meta: {
        month: selectedMonth,
        year: selectedYear,
        count: expenses.length,
      },
    });
  } catch (err) {
    console.error('[getExpenses]', err.message);
    return sendError(res, {
      statusCode: 500,
      message: 'Something went wrong while fetching expenses.',
      code: 'GET_EXPENSES_FAILED',
      details: err.message,
    });
  }
};

// ─── Update Expense ───────────────────────────────────────────────────────────
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, date, isRecurring } = req.body;

    // Find expense and verify ownership
    const expense = await Expense.findOne({ _id: id, userId: req.userId });
    if (!expense) {
      return sendError(res, {
        statusCode: 404,
        message: 'Expense not found.',
        code: 'EXPENSE_NOT_FOUND',
      });
    }

    // Validate amount if provided
    if (amount !== undefined && (isNaN(amount) || Number(amount) <= 0)) {
      return sendError(res, {
        statusCode: 400,
        message: 'Amount must be a positive number.',
        code: 'INVALID_AMOUNT',
      });
    }

    // Update fields
    if (amount !== undefined) expense.amount = Number(amount);
    if (date !== undefined) expense.date = new Date(date);
    if (isRecurring !== undefined) expense.isRecurring = isRecurring;

    // Re-run the same hybrid categorization flow if description changes
    if (description !== undefined) {
      expense.description = description;
      expense.category = categorizeExpense(description);
    }

    await expense.save();

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Expense updated successfully.',
      data: { expense },
    });
  } catch (err) {
    console.error('[updateExpense]', err.message);
    return sendError(res, {
      statusCode: 500,
      message: 'Something went wrong while updating expense.',
      code: 'UPDATE_EXPENSE_FAILED',
      details: err.message,
    });
  }
};

// ─── Delete Expense ───────────────────────────────────────────────────────────
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    // Find expense and verify ownership
    const expense = await Expense.findOne({ _id: id, userId: req.userId });
    if (!expense) {
      return sendError(res, {
        statusCode: 404,
        message: 'Expense not found.',
        code: 'EXPENSE_NOT_FOUND',
      });
    }

    await expense.deleteOne();

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Expense deleted successfully.',
      data: null,
    });
  } catch (err) {
    console.error('[deleteExpense]', err.message);
    return sendError(res, {
      statusCode: 500,
      message: 'Something went wrong while deleting expense.',
      code: 'DELETE_EXPENSE_FAILED',
      details: err.message,
    });
  }
};

module.exports = { createExpense, getExpenses, updateExpense, deleteExpense };