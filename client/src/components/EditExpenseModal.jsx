import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Calendar, Repeat, ChevronDown } from 'lucide-react';

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

const InputField = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide">
      {label}
    </label>
    {children}
  </div>
);

const inputClass =
  'w-full bg-background border border-border-default text-text-default placeholder-text-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-150 hover:border-text-secondary/30';

// Custom Dropdown that opens UPWARD for the modal
const CustomDropdown = ({ value, options, onChange, placeholder = 'Select Category' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = value || placeholder;

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${inputClass} flex items-center justify-between text-left`}
      >
        <span className={!value ? 'text-text-secondary/50' : 'text-text-default'}>
          {selectedLabel}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-full bg-card border border-border-default rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="max-h-40 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-border-default">
            <button
              type="button"
              onClick={() => { onChange(''); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-background transition-colors italic"
            >
              Auto-detect by AI
            </button>
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  opt === value 
                    ? 'bg-primary text-white font-bold' 
                    : 'text-text-default hover:bg-background'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const EditExpenseModal = ({ expense, onClose, onSave }) => {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    date: '',
    category: '',
    isRecurring: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);

  // Animate in on mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Pre-fill form
  useEffect(() => {
    if (expense) {
      setForm({
        description: expense.description || '',
        amount: expense.amount || '',
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : '',
        category: expense.category || '',
        isRecurring: expense.isRecurring || false,
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryChange = (val) => {
    setForm(prev => ({ ...prev, category: val }));
  };

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 150);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handleClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;

    setLoading(true);
    setError(null);
    try {
      await onSave(expense._id, {
        description: form.description,
        amount: parseFloat(form.amount),
        date: form.date,
        category: form.category,
        isRecurring: form.isRecurring,
      });
    } catch {
      setError('Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-150 ${visible ? 'bg-black/50 backdrop-blur-[2px]' : 'bg-black/0'
        }`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className={`bg-card border border-border-default rounded-2xl w-full max-w-md shadow-2xl flex flex-col transition-all duration-150 ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-[0.98]'
          }`}
        style={{ maxHeight: 'calc(100vh - 2rem)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default shrink-0">
          <div>
            <h2 className="text-base font-bold text-text-default">Edit Expense</h2>
            <p className="text-xs text-text-secondary mt-0.5">Update the details below</p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-default hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-150 shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} id="edit-expense-form" className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger text-xs rounded-xl px-4 py-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-danger shrink-0" />
              {error}
            </div>
          )}

          {/* Description */}
          <InputField label="Description">
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Grocery shopping"
              required
              autoFocus
              className={inputClass}
            />
          </InputField>

          {/* Amount + Date row */}
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Amount (₹)">
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
                className={inputClass}
              />
            </InputField>
            <InputField label="Date">
              <div className="relative">
                <input
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
            </InputField>
          </div>

          {/* Category - Now using Custom Upward Dropdown */}
          <InputField label="Category">
            <CustomDropdown 
              value={form.category}
              options={CATEGORIES}
              onChange={handleCategoryChange}
              placeholder="Auto-detect by AI"
            />
          </InputField>

          {/* Recurring toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none group py-1">
            <div className="relative shrink-0">
              <input
                type="checkbox"
                name="isRecurring"
                checked={form.isRecurring}
                onChange={handleChange}
                className="sr-only"
              />
              <div
                className={`w-9 h-5 rounded-full transition-colors duration-200 ${form.isRecurring ? 'bg-primary' : 'bg-border-default'
                  }`}
              >
                <div
                  className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform duration-200 ${form.isRecurring ? 'translate-x-[18px]' : 'translate-x-0.5'
                    }`}
                />
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-text-default flex items-center gap-1.5">
                <Repeat size={13} className="text-text-secondary" />
                Recurring expense
              </span>
              <p className="text-xs text-text-secondary opacity-70 mt-0.5">
                Mark if this repeats monthly
              </p>
            </div>
          </label>

          {/* AI note */}
          <p className="text-xs text-text-secondary opacity-60 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-primary inline-block" />
            Category will be re-detected by AI if description changes
          </p>
        </form>

        {/* Actions — always visible at bottom */}
        <div className="px-6 py-4 border-t border-border-default flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-default border border-border-default rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-150"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-expense-form"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-150 shadow-sm"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditExpenseModal;