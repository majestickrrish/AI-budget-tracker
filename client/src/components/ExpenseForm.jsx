import { useState } from 'react';
import { CATEGORIES } from '../data/dummyData';

const ExpenseForm = ({ onAdd }) => {
  const [form, setForm] = useState({ description: '', amount: '', category: 'Food' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    setLoading(true);
    setTimeout(() => {
      onAdd({
        id: Date.now(),
        description: form.description,
        amount: parseFloat(form.amount),
        category: form.category,
        date: new Date().toISOString().split('T')[0],
      });
      setForm({ description: '', amount: '', category: 'Food' });
      setLoading(false);
    }, 400);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-6">
      <h3 className="text-white font-semibold text-base mb-5">Add New Expense</h3>
      <form id="expense-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
          <input
            id="expense-description"
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="e.g. Grocery shopping"
            required
            className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Amount (₹)</label>
          <input
            id="expense-amount"
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="0.01"
            required
            className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
          <select
            id="expense-category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-4 flex justify-end">
          <button
            id="add-expense-btn"
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
          >
            {loading ? 'Adding...' : '+ Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
