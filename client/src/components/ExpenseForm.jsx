import { useState } from 'react';
import { Calendar, Zap, Coffee, ShoppingBag, Utensils, Car, X, Plus } from 'lucide-react';
import { createExpense } from '../services/api';

const today = () => new Date().toISOString().split('T')[0];

const ExpenseForm = ({ onAdd, shortcuts = [], onDeleteShortcut }) => {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    date: today(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleQuickAdd = (item) => {
    setForm({
      ...form,
      description: item.description,
      amount: item.amount.toString(),
      date: today(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;

    setLoading(true);
    setError(null);
    try {
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
      setError(err?.response?.data?.message || 'Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border-default rounded-2xl p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-text-default font-semibold text-base">Add New Expense</h3>
          <p className="text-xs text-text-secondary opacity-70 mt-0.5">Enter details or use a shortcut below</p>
        </div>

        {shortcuts.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-background px-2 py-1 rounded border border-border-default">Shortcuts</span>
            <div className="flex flex-wrap gap-1.5">
              {shortcuts.map((item) => (
                <div key={item.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(item)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border-default hover:border-primary hover:text-primary transition-all text-xs font-medium text-text-default"
                  >
                    {item.description}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDeleteShortcut(item.id); }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
            required
            className="w-full bg-background border border-border-default text-text-default placeholder-text-secondary rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Date</label>
          <div className="relative">
            <input
              id="expense-date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full bg-background border border-border-default text-text-default rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none"
            />
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary opacity-50 pointer-events-none" size={16} />
          </div>
        </div>

        {/* AI categorization note + Submit */}
        <div className="sm:col-span-4 flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 text-xs text-text-secondary opacity-70">
            <Zap size={12} className="text-primary" />
            <span>AI Category Detection Active</span>
          </div>
          <button
            id="add-expense-btn"
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            {loading ? 'Adding…' : <><Plus size={16} /> Add Expense</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;