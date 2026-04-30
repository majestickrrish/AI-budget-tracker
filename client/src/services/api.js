import axios from 'axios';

// Base API URL — pointing to real backend
const API_URL = 'http://localhost:5000/api';

// Axios instance with auth header injected automatically
const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('budget_tracker_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Auth ──────────────────────────────────────────────────────────────────
export const loginUser = async (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const registerUser = async (name, email, password, confirmPassword) => {
  return api.post('/auth/register', { name, email, password, confirmPassword });
};

// ─── Expenses ──────────────────────────────────────────────────────────────

// GET /api/expenses?month=4&year=2026
export const getExpenses = async ({ month, year } = {}) => {
  const params = {};
  if (month !== undefined) params.month = month;
  if (year !== undefined) params.year = year;
  return api.get('/expenses', { params });
};

// POST /api/expenses
export const createExpense = async (expenseData) => {
  return api.post('/expenses', expenseData);
};

// DELETE /api/expenses/:id
export const deleteExpense = async (id) => {
  return api.delete(`/expenses/${id}`);
};

// PATCH /api/expenses/:id
export const updateExpense = async (id, expenseData) => {
  return api.patch(`/expenses/${id}`, expenseData);
};

// ─── Analytics ────────────────────────────────────────────────────────────
export const getAnalyticsSummary = (params) => api.get('/analytics/summary', { params });
export const getAIPredictions = () => api.get('/analytics/prediction');
export const getAnomalies = () => api.get('/analytics/anomalies');
export const getAIInsights = (params) => api.get('/analytics/insights', { params });
export const getHealthScore = (params) => api.get('/analytics/health-score', { params });

// ─── User Profile ──────────────────────────────────────────────────────────
export const updateProfile = (profileData) => api.put('/user/profile', profileData);

// ─── Savings Goals ─────────────────────────────────────────────────────────
export const getGoals = () => api.get('/goals');
export const createGoal = (goalData) => api.post('/goals', goalData);
export const updateGoal = (id, goalData) => api.patch(`/goals/${id}`, goalData);
export const deleteGoal = (id) => api.delete(`/goals/${id}`);