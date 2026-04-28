import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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

const EditExpenseModal = ({ expense, onClose, onSave }) => {
    const [form, setForm] = useState({
        description: '',
        amount: '',
        date: '',
        isRecurring: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pre-fill form when modal opens
    useEffect(() => {
        if (expense) {
            setForm({
                description: expense.description || '',
                amount: expense.amount || '',
                date: expense.date
                    ? new Date(expense.date).toISOString().split('T')[0]
                    : '',
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
                isRecurring: form.isRecurring,
            });
        } catch (err) {
            setError('Failed to save changes.');
        } finally {
            setLoading(false);
        }
    };

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-card border border-border-default rounded-2xl w-full max-w-md shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
                    <h2 className="text-text-default font-semibold text-base">Edit Expense</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-default hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {error && (
                        <div className="bg-danger/10 border border-danger/30 text-danger text-xs rounded-lg px-3 py-2">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1.5">
                            Description
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            className="w-full bg-background border border-border-default text-text-default placeholder-text-secondary rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-text-secondary mb-1.5">
                                Amount (₹)
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                min="0.01"
                                step="0.01"
                                required
                                className="w-full bg-background border border-border-default text-text-default rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-text-secondary mb-1.5">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                required
                                className="w-full bg-background border border-border-default text-text-default rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            name="isRecurring"
                            checked={form.isRecurring}
                            onChange={handleChange}
                            className="w-4 h-4 rounded accent-primary"
                        />
                        <span className="text-sm text-text-secondary">Mark as recurring</span>
                    </label>

                    <p className="text-xs text-text-secondary opacity-70">
                        ✨ Category will be re-detected by AI if description changes
                    </p>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-sm text-text-secondary hover:text-text-default border border-border-default rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg"
                        >
                            {loading ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditExpenseModal;