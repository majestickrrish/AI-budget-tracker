const express = require('express');
const cors = require('cors');
const Demo = require('./models/Demo');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/test', async (req, res) => {
  try {
    // Attempt to fetch from the DB to prove it works dynamically
    let testData = await Demo.findOne();
    if (!testData) {
      // Seed first entry if empty
      testData = await Demo.create({ message: "API working" });
    }
    
    res.json({ message: testData.message, fromDatabase: true });
  } catch (error) {
    console.error('DB test error:', error);
    res.status(500).json({ message: "Backend is running, but Database query failed.", error: error.message });
  }
});

module.exports = app;
