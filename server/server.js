require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const { trainClassifierWithSampleData, trainClassifierWithExpenseData } = require('./services/categorizationService');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-budget-tracker';
const ENABLE_DB_TRAINING = process.env.ENABLE_DB_TRAINING !== 'false';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    // Initialize the categorization service with sample data.
    trainClassifierWithSampleData();

    // Train using past expense history from MongoDB to improve fallback predictions.
    if (ENABLE_DB_TRAINING) {
      await trainClassifierWithExpenseData();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    console.log('Please check your MONGO_URI in the .env file!');
  });