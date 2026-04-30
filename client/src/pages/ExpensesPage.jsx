// ─── ExpensesPage.jsx ────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseFilters from '../components/ExpenseFilters';
import EditExpenseModal from '../components/EditExpenseModal';
import { getExpenses, deleteExpense, updateExpense } from '../services/api';
import { getUser } from '../utils/auth';

const ExpensesPage = () => {
  const now = new Date();
  const user = getUser();
  const SHORTCUT_KEY = user ? `expense_shortcuts_${user._id}` : 'expense_shortcuts_guest';

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  const [shortcuts, setShortcuts] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SHORTCUT_KEY)) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(SHORTCUT_KEY, JSON.stringify(shortcuts));
  }, [shortcuts, SHORTCUT_KEY]);

  const handleSaveShortcut = (expense) => {
    const isDuplicate = shortcuts.some(
      (s) =>
        s.description.toLowerCase() === expense.description.toLowerCase() &&
        s.amount === expense.amount
    );
    if (isDuplicate) return;
    setShortcuts((prev) =>
      [{ id: Date.now(), description: expense.description, amount: expense.amount }, ...prev].slice(0, 5)
    );
  };

  const handleDeleteShortcut = (id) => setShortcuts((prev) => prev.filter((s) => s.id !== id));

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getExpenses({ month, year });
      setExpenses(res.data.data.expenses || []);
    } catch {
      setError('Could not load expenses. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const handleAdd = (newExpense) => setExpenses((prev) => [newExpense, ...prev]);

  const handleDelete = async (id) => {
    const previous = expenses;
    setExpenses((prev) => prev.filter((e) => e._id !== id));
    try {
      await deleteExpense(id);
    } catch {
      setExpenses(previous);
      alert('Failed to delete expense. Please try again.');
    }
  };

  const handleEdit = (expense) => setEditingExpense(expense);

  const handleEditSave = async (id, updatedData) => {
    try {
      const res = await updateExpense(id, updatedData);
      const updated = res.data.data.expense;
      setExpenses((prev) => prev.map((e) => (e._id === id ? updated : e)));
      setEditingExpense(null);
    } catch {
      alert('Failed to update expense. Please try again.');
    }
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Layout>
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-default">Expenses</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {loading ? (
              <span className="opacity-60">Loading…</span>
            ) : (
              <>
                {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'} ·{' '}
                <span className="text-danger font-semibold">
                  −₹{total.toLocaleString('en-IN')}
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <ExpenseFilters month={month} year={year} onMonthChange={setMonth} onYearChange={setYear} />

      {/* Form */}
      <ExpenseForm
        onAdd={handleAdd}
        shortcuts={shortcuts}
        onDeleteShortcut={handleDeleteShortcut}
      />

      {/* Error */}
      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-danger shrink-0" />
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="bg-card border border-border-default rounded-xl p-12 text-center">
          <div className="w-6 h-6 border-2 border-border-default border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-text-secondary text-sm">Fetching expenses…</p>
        </div>
      ) : (
        <ExpenseList
          expenses={expenses}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onSaveShortcut={handleSaveShortcut}
        />
      )}

      {/* Edit modal */}
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={handleEditSave}
        />
      )}
    </Layout>
  );
};

export default ExpensesPage;