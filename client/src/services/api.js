import axios from 'axios';

// Base API URL — will point to real backend in Phase 2
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
// TODO Phase 2: GET /api/expenses
export const getExpenses = async () => {
  // return api.get('/expenses');
  return Promise.resolve({ data: [] });
};

// TODO Phase 2: POST /api/expenses
export const createExpense = async (expenseData) => {
  // return api.post('/expenses', expenseData);
  return Promise.resolve({ data: { ...expenseData, _id: Date.now().toString() } });
};

// TODO Phase 2: DELETE /api/expenses/:id
export const deleteExpense = async (id) => {
  // return api.delete(`/expenses/${id}`);
  return Promise.resolve({ data: { message: 'Deleted' } });
};

// TODO Phase 2: PUT /api/expenses/:id
export const updateExpense = async (id, expenseData) => {
  // return api.put(`/expenses/${id}`, expenseData);
  return Promise.resolve({ data: expenseData });
};
