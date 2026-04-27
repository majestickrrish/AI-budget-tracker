const natural = require('natural');
const { detectCategory } = require('../utils/categoryDetector');
const Expense = require('../models/expense');

// Initialize the Naive Bayes classifier
// This stays lightweight and explainable for a viva.
const classifier = new natural.BayesClassifier();

// Sample training data for the fallback ML classifier
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

function trainClassifierWithSampleData() {
  console.log('Training classifier with sample data...');

  SAMPLE_TRAINING_DATA.forEach(([text, category]) => {
    classifier.addDocument(text, category);
  });

  classifier.train();
  console.log('Classifier trained successfully');
}

async function trainClassifierWithExpenseData(userId = null) {
  console.log('Training classifier with expense data from MongoDB...');

  try {
    const query = { category: { $ne: 'Other' } };
    if (userId) query.userId = userId;

    const expenses = await Expense.find(query).select('description category');
    if (expenses.length === 0) {
      console.log('No training expenses found.');
      return;
    }

    expenses.forEach((expense) => {
      if (expense.description) {
        classifier.addDocument(expense.description.toLowerCase(), expense.category);
      }
    });

    classifier.train();
    console.log('Classifier retrained from existing expenses');
  } catch (error) {
    console.error('Error training classifier with expense data:', error);
  }
}

function categorizeExpense(description) {
  if (!description) return 'Other';

  const ruleBasedCategory = detectCategory(description);
  if (ruleBasedCategory !== 'Other') {
    return ruleBasedCategory;
  }

  try {
    return classifier.classify(description.toLowerCase()) || 'Other';
  } catch (error) {
    console.error('ML classification error:', error);
    return 'Other';
  }
}

function getClassificationProbabilities(description) {
  if (!description) return [];

  try {
    return classifier.getClassifications(description.toLowerCase());
  } catch (error) {
    console.error('Error getting classification probabilities:', error);
    return [];
  }
}

module.exports = {
  trainClassifierWithSampleData,
  trainClassifierWithExpenseData,
  categorizeExpense,
  getClassificationProbabilities,
};