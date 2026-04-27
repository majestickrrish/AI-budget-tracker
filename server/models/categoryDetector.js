const CATEGORY_KEYWORDS = {
  'Food & Dining': [
    'food', 'restaurant', 'pizza', 'burger', 'lunch', 'dinner', 'breakfast',
    'cafe', 'coffee', 'eat', 'meal', 'snack', 'biryani', 'zomato', 'swiggy',
    'dominos', 'mcdonalds', 'kfc', 'subway', 'drink', 'juice', 'tea',
  ],
  'Transport': [
    'uber', 'ola', 'taxi', 'cab', 'bus', 'metro', 'train', 'fuel', 'petrol',
    'diesel', 'auto', 'rickshaw', 'flight', 'ticket', 'transport', 'fare',
    'rapido', 'bike', 'parking',
  ],
  'Shopping': [
    'shop', 'amazon', 'flipkart', 'myntra', 'clothes', 'shirt', 'shoes',
    'dress', 'jacket', 'bag', 'watch', 'accessory', 'mall', 'store', 'buy',
    'purchase', 'order', 'fashion',
  ],
  'Entertainment': [
    'movie', 'netflix', 'spotify', 'prime', 'hotstar', 'game', 'cinema',
    'theatre', 'concert', 'show', 'subscription', 'youtube', 'entertainment',
    'fun', 'party', 'club', 'pub',
  ],
  'Health & Medical': [
    'doctor', 'hospital', 'medicine', 'pharmacy', 'medical', 'health',
    'clinic', 'lab', 'test', 'checkup', 'dental', 'gym', 'fitness',
    'supplement', 'vitamin',
  ],
  'Education': [
    'course', 'book', 'school', 'college', 'university', 'tuition', 'class',
    'study', 'education', 'udemy', 'coursera', 'fees', 'exam', 'stationery',
    'notebook', 'pen',
  ],
  'Bills & Utilities': [
    'bill', 'electricity', 'water', 'gas', 'internet', 'wifi', 'mobile',
    'recharge', 'phone', 'utility', 'rent', 'maintenance', 'insurance',
    'emi', 'loan',
  ],
  'Travel': [
    'travel', 'hotel', 'resort', 'airbnb', 'vacation', 'holiday', 'trip',
    'tour', 'booking', 'makemytrip', 'goibibo', 'oyo', 'luggage', 'visa',
  ],
  'Groceries': [
    'grocery', 'groceries', 'vegetable', 'fruit', 'milk', 'bread', 'egg',
    'rice', 'dal', 'atta', 'supermarket', 'bigbasket', 'blinkit', 'zepto',
    'instamart', 'market',
  ],
};

/**
 * Detect category from description using keyword matching
 * @param {string} description
 * @returns {string} category
 */
const detectCategory = (description) => {
  if (!description) return 'Other';

  const lower = description.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => lower.includes(keyword))) {
      return category;
    }
  }

  return 'Other';
};

module.exports = { detectCategory };