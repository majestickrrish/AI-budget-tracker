import { useState } from 'react';
import { Calendar, Zap, X, Plus, Bookmark } from 'lucide-react';
import { createExpense } from '../../services/api';

const today = () => new Date().toISOString().split('T')[0];

const inputClass =
  'w-full bg-background border border-border-default text-text-default placeholder-text-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-150 hover:border-text-secondary/30';

const ExpenseForm = ({ onAdd, shortcuts = [], onDeleteShortcut }) => {
  const [form, setForm] = useState({ description: '', amount: '', date: today() });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleQuickAdd = (item) => {
    setForm({ ...form, description: item.description, amount: item.amount.toString(), date: today() });
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
      onAdd(res.data.data.expense);
      setForm({ description: '', amount: '', date: today() });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border-default rounded-2xl overflow-hidden mb-6">
      {/* Card header */}
      <div className="px-6 py-4 border-b border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-text-default">Add New Expense</h3>
          <p className="text-xs text-text-secondary mt-0.5 opacity-70">
            Fill in the details below to record a transaction
          </p>
        </div>

        {/* AI badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary bg-primary/8 border border-primary/20 px-3 py-1.5 rounded-full self-start sm:self-auto shrink-0">
          <Zap size={11} />
          AI Category Detection
        </div>
      </div>

      {/* Shortcuts strip */}
      {shortcuts.length > 0 && (
        <div className="px-6 py-3 border-b border-border-default bg-background/40 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-secondary uppercase tracking-widest shrink-0">
            <Bookmark size={10} />
            Shortcuts
          </div>
          <div className="flex flex-wrap gap-1.5">
            {shortcuts.map((item) => (
              <div key={item.id} className="group relative">
                <button
                  type="button"
                  onClick={() => handleQuickAdd(item)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-card border border-border-default hover:border-primary hover:text-primary transition-all duration-150 text-xs font-medium text-text-default"
                >
                  {item.description}
                  <span className="text-text-secondary font-normal">₹{item.amount}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onDeleteShortcut(item.id); }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-sm"
                  aria-label="Remove shortcut"
                >
                  <X size={9} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form body */}
      <div className="px-6 py-5">
        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger text-xs rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-danger shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-success/10 border border-success/30 text-success text-xs rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
            Expense added successfully
          </div>
        )}

        <form id="expense-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            {/* Description — wider */}
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
                Description
              </label>
              <input
                id="expense-description"
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. Grocery shopping"
                required
                className={inputClass}
              />
            </div>

            {/* Amount */}
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
                Amount (₹)
              </label>
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
                className={inputClass}
              />
            </div>

            {/* Date */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
                Date
              </label>
              <div className="relative">
                <input
                  id="expense-date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className={`${inputClass} pl-10`}
                />
                <Calendar
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary opacity-50 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Submit row */}
          <div className="flex items-center justify-end mt-4 pt-4 border-t border-border-default/50">
            <button
              id="add-expense-btn"
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-150 shadow-sm flex items-center gap-2 min-h-[44px]"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding…
                </>
              ) : (
                <>
                  <Plus size={15} />
                  Add Expense
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
