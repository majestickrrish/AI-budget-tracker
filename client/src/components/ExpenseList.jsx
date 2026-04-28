import { Edit2, Trash2, FolderOpen } from 'lucide-react';

// Maps every category from the backend schema to a color pair
const categoryColors = {
  'Food & Dining':    'bg-orange-500/20 text-orange-400',
  'Transport':        'bg-primary/20 text-primary',
  'Shopping':         'bg-yellow-500/20 text-yellow-400',
  'Entertainment':    'bg-warning/20 text-warning',
  'Health & Medical': 'bg-danger/20 text-danger',
  'Education':        'bg-blue-500/20 text-blue-400',
  'Bills & Utilities':'bg-success/20 text-success',
  'Travel':           'bg-purple-500/20 text-purple-400',
  'Groceries':        'bg-green-500/20 text-green-400',
  'Other':            'bg-border-default text-text-secondary',
};

const ExpenseList = ({ expenses, onDelete, onEdit }) => {
  if (!expenses.length) {
    return (
      <div className="bg-card border border-border-default rounded-2xl p-12 text-center">
        <div className="mb-3 flex justify-center">
          <FolderOpen size={48} className="text-text-secondary opacity-50" />
        </div>
        <p className="text-text-secondary text-sm">No expenses yet. Add your first one above!</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border-default rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border-default">
        <h3 className="text-text-default font-semibold text-base">All Expenses</h3>
        <p className="text-xs text-text-secondary opacity-80 mt-0.5">{expenses.length} records</p>
      </div>

      <div className="divide-y divide-border-default">
        {expenses.map((expense) => (
          <div
            key={expense._id}
            className="flex items-center justify-between px-6 py-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 ${
                  categoryColors[expense.category] || categoryColors.Other
                }`}
              >
                {expense.category}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-text-default font-medium truncate">{expense.description}</p>
                <p className="text-xs text-text-secondary opacity-80 mt-0.5">
                  {new Date(expense.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 ml-4">
              <span className="text-sm font-bold text-danger">
                −₹{expense.amount.toLocaleString()}
              </span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  id={`edit-expense-${expense._id}`}
                  onClick={() => onEdit(expense)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent hover:border-border-default bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary hover:text-primary transition-all"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  id={`delete-expense-${expense._id}`}
                  onClick={() => onDelete(expense._id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent hover:border-border-default bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary hover:text-danger transition-all"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;