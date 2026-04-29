const natural = require('natural');
const { detectCategory } = require('../utils/categoryDetector');
const Expense = require('../models/expense');

// The fallback model is intentionally simple: Naive Bayes is fast,
// lightweight,
const classifier = new natural.BayesClassifier();
let isClassifierTrained = false;
const ML_CONFIDENCE_THRESHOLD = 0.0008;
const ML_CONFIDENCE_MARGIN = 0.00015;
const GENERIC_LOW_SIGNAL_TOKENS = new Set([
  'payment',
  'paid',
  'spent',
  'expense',
  'expenses',
  'money',
  'transaction',
  'transfer',
  'bill',
]);

// Sample training data for the ML fallback.
// These examples teach the classifier what descriptions typically
// belong to each category when rules cannot identify them.
const SAMPLE_TRAINING_DATA = [
  ['bought pizza from dominos', 'Food & Dining'],
  ['coffee at starbucks', 'Food & Dining'],
  ['lunch at restaurant', 'Food & Dining'],
  ['ordered biryani on zomato', 'Food & Dining'],
  ['snacks and drinks', 'Food & Dining'],
  ['dinner at cafe', 'Food & Dining'],
  ['brunch with friends', 'Food & Dining'],
  ['food delivery swiggy', 'Food & Dining'],
  ['restarant dinner bill', 'Food & Dining'],
  ['dinning out tonight', 'Food & Dining'],
  ['street food momo', 'Food & Dining'],
  ['chai and samosa', 'Food & Dining'],

  ['uber ride to office', 'Transport'],
  ['bus ticket', 'Transport'],
  ['fuel for car', 'Transport'],
  ['metro pass', 'Transport'],
  ['taxi fare', 'Transport'],
  ['ola ride at night', 'Transport'],
  ['auto fare', 'Transport'],
  ['train pass recharge', 'Transport'],
  ['ubser ride to mall', 'Transport'],
  ['cab booking', 'Transport'],
  ['petrol pump payment', 'Transport'],
  ['bike service and fuel', 'Transport'],

  ['bought shirt from amazon', 'Shopping'],
  ['shopping at mall', 'Shopping'],
  ['new shoes', 'Shopping'],
  ['online order flipkart', 'Shopping'],
  ['clothes purchase', 'Shopping'],
  ['bought jeans online', 'Shopping'],
  ['makeup purchase', 'Shopping'],
  ['electronics order', 'Shopping'],
  ['shopping spree weekend', 'Shopping'],
  ['gift item from store', 'Shopping'],
  ['amazon order payment', 'Shopping'],
  ['flipkart sale purchase', 'Shopping'],

  ['netflix subscription', 'Entertainment'],
  ['movie tickets', 'Entertainment'],
  ['spotify premium', 'Entertainment'],
  ['concert tickets', 'Entertainment'],
  ['gaming purchase', 'Entertainment'],
  ['cinema popcorn and tickets', 'Entertainment'],
  ['ott subscription renewal', 'Entertainment'],
  ['playstation game purchase', 'Entertainment'],
  ['bowling night', 'Entertainment'],
  ['amusement park ticket', 'Entertainment'],
  ['weekend movie plan', 'Entertainment'],
  ['music app subscription', 'Entertainment'],

  ['doctor consultation', 'Health & Medical'],
  ['medicine from pharmacy', 'Health & Medical'],
  ['gym membership', 'Health & Medical'],
  ['dental checkup', 'Health & Medical'],
  ['medical test', 'Health & Medical'],
  ['hospital bill', 'Health & Medical'],
  ['blood test charges', 'Health & Medical'],
  ['physiotherapy session', 'Health & Medical'],
  ['health insurance copay', 'Health & Medical'],
  ['chemist store medicine', 'Health & Medical'],
  ['eye checkup', 'Health & Medical'],
  ['protein supplements', 'Health & Medical'],

  ['online course udemy', 'Education'],
  ['books for study', 'Education'],
  ['college fees', 'Education'],
  ['stationery items', 'Education'],
  ['tuition payment', 'Education'],
  ['exam registration fee', 'Education'],
  ['coaching class fee', 'Education'],
  ['notebooks and pens', 'Education'],
  ['certification course payment', 'Education'],
  ['school fee', 'Education'],
  ['library membership', 'Education'],
  ['study material purchase', 'Education'],

  ['electricity bill', 'Bills & Utilities'],
  ['internet recharge', 'Bills & Utilities'],
  ['mobile bill', 'Bills & Utilities'],
  ['water bill', 'Bills & Utilities'],
  ['gas bill', 'Bills & Utilities'],
  ['wifi bill payment', 'Bills & Utilities'],
  ['phone recharge', 'Bills & Utilities'],
  ['postpaid mobile payment', 'Bills & Utilities'],
  ['broadband charges', 'Bills & Utilities'],
  ['house rent transfer', 'Bills & Utilities'],
  ['loan emi payment', 'Bills & Utilities'],
  ['monthly insurance premium', 'Bills & Utilities'],

  ['hotel booking', 'Travel'],
  ['flight tickets', 'Travel'],
  ['vacation package', 'Travel'],
  ['airbnb stay', 'Travel'],
  ['travel insurance', 'Travel'],
  ['trip to goa', 'Travel'],
  ['holiday resort booking', 'Travel'],
  ['intercity bus for trip', 'Travel'],
  ['luggage purchase for travel', 'Travel'],
  ['outstation journey', 'Travel'],
  ['visa fees', 'Travel'],
  ['tour package payment', 'Travel'],

  ['grocery shopping', 'Groceries'],
  ['vegetables from market', 'Groceries'],
  ['milk and bread', 'Groceries'],
  ['supermarket bill', 'Groceries'],
  ['fruits purchase', 'Groceries'],
  ['daily grocery from dmart', 'Groceries'],
  ['grocry shopping weekly', 'Groceries'],
  ['atta rice dal purchase', 'Groceries'],
  ['blinkit grocery order', 'Groceries'],
  ['zepto vegetables', 'Groceries'],
  ['kitchen essentials', 'Groceries'],
  ['eggs and dairy items', 'Groceries'],
];

function normalizeDescription(description = '') {
  // Normalize a few frequent real-world typos before rule/ML matching.
  const typoMap = {
    ubser: 'uber',
    dinning: 'dining',
    restarant: 'restaurant',
    grocry: 'grocery',
  };

  return description
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((token) => typoMap[token] || token)
    .join(' ');
}

function isLowSignalDescription(description) {
  const tokens = normalizeDescription(description).match(/[a-z]+/g) || [];
  const informativeTokens = tokens.filter(
    (token) => token.length >= 4 && !GENERIC_LOW_SIGNAL_TOKENS.has(token)
  );
  return informativeTokens.length === 0;
}

function addTrainingExamples(trainingData) {
  trainingData.forEach(([text, category]) => {
    classifier.addDocument(normalizeDescription(text), category);
  });
}

function finalizeTraining(successMessage) {
  classifier.train();
  isClassifierTrained = true;
  console.log(successMessage);
}

function trainClassifierWithSampleData() {
  console.log('Training classifier with sample data...');
  addTrainingExamples(SAMPLE_TRAINING_DATA);
  finalizeTraining('Classifier trained successfully with sample data');
}

async function trainClassifierWithExpenseData(userId = null) {
  console.log('Training classifier with expense data from MongoDB...');

  try {
    const query = { category: { $ne: 'Other' } };
    if (userId) {
      query.userId = userId;
    }

    const expenses = await Expense.find(query).select('description category');
    if (expenses.length === 0) {
      console.log('No training expenses found.');
      return;
    }

    const expenseTrainingData = expenses
      .filter((expense) => expense.description)
      .map((expense) => [expense.description, expense.category]);

    addTrainingExamples(expenseTrainingData);
    finalizeTraining('Classifier retrained successfully from expense history');
  } catch (error) {
    console.error('Error training classifier with expense data:', error);
  }
}

function classifyWithRules(description) {
  return detectCategory(description);
}

function classifyWithMachineLearning(description) {
  if (!isClassifierTrained) {
    return 'Other';
  }

  try {
    if (isLowSignalDescription(description)) {
      return 'Other';
    }

    const normalized = normalizeDescription(description);
    const ranked = classifier.getClassifications(normalized);
    const topPrediction = ranked[0];
    const secondPrediction = ranked[1];

    if (!topPrediction) {
      return 'Other';
    }

    const margin = secondPrediction ? (topPrediction.value - secondPrediction.value) : topPrediction.value;
    if (topPrediction.value < ML_CONFIDENCE_THRESHOLD || margin < ML_CONFIDENCE_MARGIN) {
      return 'Other';
    }

    return topPrediction.label;
  } catch (error) {
    console.error('ML classification error:', error);
    return 'Other';
  }
}

function categorizeExpense(description) {
  if (!description) {
    return 'Other';
  }

  // Step 1: Try the fast keyword-based system first.
  const ruleBasedCategory = classifyWithRules(description);
  if (ruleBasedCategory !== 'Other') {
    return ruleBasedCategory;
  }

  // Step 2: If rules fail, fall back to Naive Bayes.
  return classifyWithMachineLearning(description);
}

function getClassificationProbabilities(description) {
  if (!description || !isClassifierTrained) {
    return [];
  }

  try {
    return classifier.getClassifications(normalizeDescription(description));
  } catch (error) {
    console.error('Error getting classification probabilities:', error);
    return [];
  }
}

module.exports = {
  classifyWithRules,
  classifyWithMachineLearning,
  trainClassifierWithSampleData,
  trainClassifierWithExpenseData,
  categorizeExpense,
  getClassificationProbabilities,
};