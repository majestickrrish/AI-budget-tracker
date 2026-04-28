import { useState } from 'react';
import { createExpense } from '../services/api';

const CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Entertainment',
  'Health & Medical',
  'Education',
  'Bills & Utilities',
  'Travel',
  'Groceries',
  'Other',
];

const today = () => new Date().toISOString().split('T')[0];

const ExpenseForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    date: today(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;

    setLoading(true);
    setError(null);
    try {
      // Backend will auto-categorize via AI — we don't need to send category
      const res = await createExpense({
        description: form.description,
        amount: parseFloat(form.amount),
        date: form.date,
      });
      const newExpense = res.data.data.expense;
      onAdd(newExpense);
      setForm({ description: '', amount: '', date: today() });
    } catch (err) {
      console.error('[handleSubmit]', err);
      setError(
        err?.response?.data?.message || 'Failed to add expense. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border-default rounded-2xl p-6 mb-6">
      <h3 className="text-text-default font-semibold text-base mb-5">Add New Expense</h3>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-xs rounded-lg px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <form id="expense-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Description</label>
          <input
            id="expense-description"
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="e.g. Grocery shopping"
            required
            className="w-full bg-background border border-border-default text-text-default placeholder-text-secondary rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Amount (₹)</label>
          <input
            id="expense-amount"
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0"
            min="0.01"
            step="0.01"
            required
            className="w-full bg-background border border-border-default text-text-default placeholder-text-secondary rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Date</label>
          <input
            id="expense-date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full bg-background border border-border-default text-text-default rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        {/* AI categorization note + Submit */}
        <div className="sm:col-span-4 flex items-center justify-between">
          <p className="text-xs text-text-secondary opacity-70">
            ✨ Category auto-detected by AI
          </p>
          <button
            id="add-expense-btn"
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg"
          >
            {loading ? 'Adding…' : '+ Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;