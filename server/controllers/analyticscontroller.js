const Expense = require('../models/Expense');
const { sendSuccess, sendError } = require('../utils/response');

const DISCRETIONARY_CATEGORIES = new Set([
  'Food & Dining',
  'Shopping',
  'Entertainment',
  'Travel',
]);

const ESSENTIAL_CATEGORIES = new Set([
  'Groceries',
  'Bills & Utilities',
  'Health & Medical',
  'Transport',
  'Education',
]);

const round2 = (value) => Number(value.toFixed(2));

const getMonthRange = (month, year) => {
  const selectedMonth = Number.parseInt(month, 10) || new Date().getMonth() + 1;
  const selectedYear = Number.parseInt(year, 10) || new Date().getFullYear();
  const startDate = new Date(selectedYear, selectedMonth - 1, 1);
  const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999);
  return { selectedMonth, selectedYear, startDate, endDate };
};

const getExpensesInRange = async (userId, startDate, endDate) => {
  return Expense.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: -1 });
};

const getCategoryBreakdown = (expenses) => {
  const grouped = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Other';
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([category, amount]) => ({ category, amount: round2(amount) }))
    .sort((a, b) => b.amount - a.amount);
};

const getSummary = async (req, res) => {
  try {
    const { selectedMonth, selectedYear, startDate, endDate } = getMonthRange(req.query.month, req.query.year);
    const expenses = await getExpensesInRange(req.userId, startDate, endDate);
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categoryBreakdown = getCategoryBreakdown(expenses);
    const avgPerExpense = expenses.length ? totalSpent / expenses.length : 0;

    return sendSuccess(res, {
      message: 'Analytics summary fetched successfully.',
      data: {
        totalSpent: round2(totalSpent),
        avgPerExpense: round2(avgPerExpense),
        transactionCount: expenses.length,
        categoryBreakdown,
      },
      meta: {
        month: selectedMonth,
        year: selectedYear,
      },
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      message: 'Failed to generate summary.',
      code: 'ANALYTICS_SUMMARY_FAILED',
      details: error.message,
    });
  }
};

const getPrediction = async (req, res) => {
  try {
    // Use recent 90 days to estimate upcoming monthly spending.
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);
    const expenses = await getExpensesInRange(req.userId, startDate, endDate);

    const spentIn90Days = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const dailyAverage = spentIn90Days / 90;
    const predictedNextMonthSpend = dailyAverage * 30;

    const byCategory = getCategoryBreakdown(expenses).slice(0, 3);

    return sendSuccess(res, {
      message: 'Expense prediction generated successfully.',
      data: {
        predictedNextMonthSpend: round2(predictedNextMonthSpend),
        dailyAverage: round2(dailyAverage),
        basisWindowDays: 90,
        topLikelySpendCategories: byCategory,
      },
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      message: 'Failed to generate prediction.',
      code: 'ANALYTICS_PREDICTION_FAILED',
      details: error.message,
    });
  }
};

const getAnomalies = async (req, res) => {
  try {
    // Find unusual transactions in recent 90 days using mean + 2*std dev.
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);
    const expenses = await getExpensesInRange(req.userId, startDate, endDate);

    if (!expenses.length) {
      return sendSuccess(res, {
        message: 'No anomalies found.',
        data: { threshold: 0, anomalies: [] },
      });
    }

    const amounts = expenses.map((expense) => expense.amount);
    const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const variance = amounts.reduce((sum, amount) => sum + (amount - mean) ** 2, 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    const threshold = mean + (2 * stdDev);

    const anomalies = expenses
      .filter((expense) => expense.amount > threshold)
      .map((expense) => ({
        id: expense._id,
        amount: round2(expense.amount),
        category: expense.category,
        description: expense.description,
        date: expense.date,
      }));

    return sendSuccess(res, {
      message: 'Anomaly analysis completed.',
      data: {
        threshold: round2(threshold),
        anomalies,
      },
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      message: 'Failed to analyze anomalies.',
      code: 'ANALYTICS_ANOMALIES_FAILED',
      details: error.message,
    });
  }
};

const getInsights = async (req, res) => {
  try {
    const { startDate, endDate } = getMonthRange(req.query.month, req.query.year);
    const expenses = await getExpensesInRange(req.userId, startDate, endDate);
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const breakdown = getCategoryBreakdown(expenses);
    const topCategory = breakdown[0];
    const recurringCount = expenses.filter((expense) => expense.isRecurring).length;

    const insights = [];
    if (!expenses.length) {
      insights.push('No expenses found for selected period. Start by adding regular expenses.');
    } else {
      insights.push(`You recorded ${expenses.length} expenses with total spending of ${round2(totalSpent)}.`);
      if (topCategory) {
        insights.push(`Top spending category is ${topCategory.category} at ${topCategory.amount}.`);
      }
      if (recurringCount > 0) {
        insights.push(`You have ${recurringCount} recurring expenses this month.`);
      }
      if (breakdown.length >= 3) {
        insights.push('Your spending is diversified across multiple categories, which helps trend tracking.');
      }
    }

    return sendSuccess(res, {
      message: 'Insights generated successfully.',
      data: {
        insights,
      },
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      message: 'Failed to generate insights.',
      code: 'ANALYTICS_INSIGHTS_FAILED',
      details: error.message,
    });
  }
};

const getHealthScore = async (req, res) => {
  try {
    const { startDate, endDate } = getMonthRange(req.query.month, req.query.year);
    const expenses = await getExpensesInRange(req.userId, startDate, endDate);

    if (!expenses.length) {
      return sendSuccess(res, {
        message: 'Health score generated successfully.',
        data: {
          score: 50,
          rating: 'Neutral',
          factors: ['No expense history available for selected period.'],
        },
      });
    }

    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const discretionarySpent = expenses
      .filter((expense) => DISCRETIONARY_CATEGORIES.has(expense.category))
      .reduce((sum, expense) => sum + expense.amount, 0);
    const essentialSpent = expenses
      .filter((expense) => ESSENTIAL_CATEGORIES.has(expense.category))
      .reduce((sum, expense) => sum + expense.amount, 0);
    const recurringCount = expenses.filter((expense) => expense.isRecurring).length;

    const discretionaryRatio = totalSpent ? discretionarySpent / totalSpent : 0;
    const essentialRatio = totalSpent ? essentialSpent / totalSpent : 0;

    // Score bands are intentionally transparent so users can explain them.
    let score = 100;
    if (discretionaryRatio > 0.6) score -= 35;
    else if (discretionaryRatio > 0.45) score -= 20;
    else if (discretionaryRatio > 0.3) score -= 10;

    if (recurringCount > 8) score -= 15;
    else if (recurringCount > 4) score -= 8;

    if (essentialRatio < 0.25) score -= 10;
    if (expenses.length < 5) score -= 5; // less data gives lower confidence in habits

    score = Math.max(0, Math.min(100, score));
    const rating = score >= 80 ? 'Excellent' : score >= 65 ? 'Good' : score >= 45 ? 'Fair' : 'Needs Attention';

    const factors = [
      `Discretionary spend ratio: ${round2(discretionaryRatio * 100)}%`,
      `Essential spend ratio: ${round2(essentialRatio * 100)}%`,
      `Recurring transaction count: ${recurringCount}`,
    ];

    return sendSuccess(res, {
      message: 'Health score generated successfully.',
      data: {
        score,
        rating,
        factors,
      },
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      message: 'Failed to generate health score.',
      code: 'ANALYTICS_HEALTH_SCORE_FAILED',
      details: error.message,
    });
  }
};

module.exports = {
  getSummary,
  getPrediction,
  getAnomalies,
  getInsights,
  getHealthScore,
};
