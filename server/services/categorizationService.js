const natural = require('natural');
const { detectCategory } = require('../utils/categoryDetector');
const Expense = require('../models/expense');

// The fallback model is intentionally simple: Naive Bayes is fast,
// lightweight, and easy to explain in a viva.
const classifier = new natural.BayesClassifier();
let isClassifierTrained = false;

// Sample training data for the ML fallback.
// These examples teach the classifier what descriptions typically
// belong to each category when rules cannot identify them.
const SAMPLE_TRAINING_DATA = [
  ['bought pizza from dominos', 'Food & Dining'],
  ['coffee at starbucks', 'Food & Dining'],
  ['lunch at restaurant', 'Food & Dining'],
  ['ordered biryani on zomato', 'Food & Dining'],
  ['snacks and drinks', 'Food & Dining'],

  ['uber ride to office', 'Transport'],
  ['bus ticket', 'Transport'],
  ['fuel for car', 'Transport'],
  ['metro pass', 'Transport'],
  ['taxi fare', 'Transport'],

  ['bought shirt from amazon', 'Shopping'],
  ['shopping at mall', 'Shopping'],
  ['new shoes', 'Shopping'],
  ['online order flipkart', 'Shopping'],
  ['clothes purchase', 'Shopping'],

  ['netflix subscription', 'Entertainment'],
  ['movie tickets', 'Entertainment'],
  ['spotify premium', 'Entertainment'],
  ['concert tickets', 'Entertainment'],
  ['gaming purchase', 'Entertainment'],

  ['doctor consultation', 'Health & Medical'],
  ['medicine from pharmacy', 'Health & Medical'],
  ['gym membership', 'Health & Medical'],
  ['dental checkup', 'Health & Medical'],
  ['medical test', 'Health & Medical'],

  ['online course udemy', 'Education'],
  ['books for study', 'Education'],
  ['college fees', 'Education'],
  ['stationery items', 'Education'],
  ['tuition payment', 'Education'],

  ['electricity bill', 'Bills & Utilities'],
  ['internet recharge', 'Bills & Utilities'],
  ['mobile bill', 'Bills & Utilities'],
  ['water bill', 'Bills & Utilities'],
  ['gas bill', 'Bills & Utilities'],

  ['hotel booking', 'Travel'],
  ['flight tickets', 'Travel'],
  ['vacation package', 'Travel'],
  ['airbnb stay', 'Travel'],
  ['travel insurance', 'Travel'],

  ['grocery shopping', 'Groceries'],
  ['vegetables from market', 'Groceries'],
  ['milk and bread', 'Groceries'],
  ['supermarket bill', 'Groceries'],
  ['fruits purchase', 'Groceries'],
];

function normalizeDescription(description = '') {
  return description.trim().toLowerCase();
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
    return classifier.classify(normalizeDescription(description)) || 'Other';
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