import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseFilters from '../components/ExpenseFilters';
import EditExpenseModal from '../components/EditExpenseModal';
import { getExpenses, deleteExpense, updateExpense } from '../services/api';

const ExpensesPage = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingExpense, setEditingExpense] = useState(null);

  // ─── Fetch Expenses ──────────────────────────────────────────────────────
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getExpenses({ month, year });
      setExpenses(res.data.data.expenses || []);
    } catch (err) {
      console.error('[fetchExpenses]', err);
      setError('Could not load expenses. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // ─── Add ─────────────────────────────────────────────────────────────────
  // Called by ExpenseForm after a successful API call; prepend to list
  const handleAdd = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  // ─── Delete (Optimistic UI) ───────────────────────────────────────────────
  const handleDelete = async (id) => {
    const previous = expenses;
    setExpenses((prev) => prev.filter((e) => e._id !== id));
    try {
      await deleteExpense(id);
    } catch (err) {
      console.error('[handleDelete]', err);
      setExpenses(previous); // rollback
      alert('Failed to delete expense. Please try again.');
    }
  };

  // ─── Edit ─────────────────────────────────────────────────────────────────
  const handleEdit = (expense) => setEditingExpense(expense);

  const handleEditSave = async (id, updatedData) => {
    try {
      const res = await updateExpense(id, updatedData);
      const updated = res.data.data.expense;
      setExpenses((prev) => prev.map((e) => (e._id === id ? updated : e)));
      setEditingExpense(null);
    } catch (err) {
      console.error('[handleEditSave]', err);
      alert('Failed to update expense. Please try again.');
    }
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Layout>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-default">Expenses</h1>
          <p className="text-text-secondary text-sm mt-1">
            {loading ? 'Loading...' : `${expenses.length} expenses`} ·{' '}
            {!loading && (
              <>
                Total:{' '}
                <span className="text-danger font-semibold">₹{total.toLocaleString()}</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Month / Year filter dropdowns */}
      <ExpenseFilters
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
      />

      <ExpenseForm onAdd={handleAdd} />

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-card border border-border-default rounded-2xl p-12 text-center">
          <p className="text-text-secondary text-sm animate-pulse">Fetching expenses…</p>
        </div>
      ) : (
        <ExpenseList
          expenses={expenses}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}

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