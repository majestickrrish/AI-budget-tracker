const express = require('express');
const cors = require('cors');
const Demo = require('./models/Demo');

const authRoutes = require('./routes/authroutes');
const testRoutes = require('./routes/testroutes');
const expenseRoutes = require('./routes/expenseroutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Existing test route (keep as is)
app.get('/api/test', async (req, res) => {
  try {
    let testData = await Demo.findOne();
    if (!testData) {
      testData = await Demo.create({ message: "API working" });
    }
    res.json({ message: testData.message, fromDatabase: true });
  } catch (error) {
    console.error('DB test error:', error);
    res.status(500).json({ message: "Backend is running, but Database query failed.", error: error.message });
  }
});

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/expenses', expenseRoutes);

module.exports = app;