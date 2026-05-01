const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testroutes');
const expenseRoutes = require('./routes/expenseroutes');
const analyticsRoutes = require('./routes/analyticsroutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health route that does not depend on database models.
app.get('/api/test', (req, res) => {
  res.json({ message: 'API working', fromDatabase: false });
});

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/analytics', analyticsRoutes);

module.exports = app;