import { Edit2, Trash2, FolderOpen, Bookmark } from 'lucide-react';

const CATEGORY_CONFIG = {
  'Food & Dining': { color: '#D85A30', bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' },
  'Transport': { color: '#378ADD', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  'Shopping': { color: '#D4537E', bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20' },
  'Entertainment': { color: '#BA7517', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  'Health & Medical': { color: '#E24B4A', bg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
  'Education': { color: '#378ADD', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  'Bills & Utilities': { color: '#1D9E75', bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20' },
  'Travel': { color: '#7F77DD', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  'Groceries': { color: '#639922', bg: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
  'Other': { color: '#888780', bg: 'bg-border-default text-text-secondary border-border-default' },
};

const ActionButton = ({ id, onClick, title, hoverClass, children }) => (
  <button
    id={id}
    onClick={onClick}
    title={title}
    className={`w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary transition-all duration-150 hover:bg-black/5 dark:hover:bg-white/5 ${hoverClass}`}
  >
    {children}
  </button>
);

const ExpenseList = ({ expenses, onDelete, onEdit, onSaveShortcut }) => {
  if (!expenses.length) {
    return (
      <div className="bg-card border border-border-default rounded-2xl p-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-background border border-border-default flex items-center justify-center mx-auto mb-4">
          <FolderOpen size={24} className="text-text-secondary opacity-40" />
        </div>
        <p className="text-sm font-semibold text-text-default mb-1">No expenses found</p>
        <p className="text-xs text-text-secondary opacity-70">
          Add your first expense using the form above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border-default rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border-default flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-text-default">All Expenses</h3>
          <p className="text-xs text-text-secondary opacity-70 mt-0.5">{expenses.length} records</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-text-secondary bg-background px-3 py-1.5 rounded-lg border border-border-default">
          <Bookmark size={10} className="text-warning shrink-0" />
          Hover a row to bookmark or edit
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-border-default">
        {expenses.map((expense) => {
          const cfg = CATEGORY_CONFIG[expense.category] || CATEGORY_CONFIG['Other'];
          return (
            <div
              key={expense._id}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors duration-150 group"
            >
              {/* Category badge */}
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold border shrink-0 ${cfg.bg}`}
              >
                {expense.category}
              </span>

              {/* Description + date */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-default truncate leading-tight">
                  {expense.description}
                </p>
                <p className="text-xs text-text-secondary opacity-70 mt-0.5">
                  {new Date(expense.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {/* Amount */}
              <span className="text-sm font-bold text-danger shrink-0 tabular-nums">
                −₹{expense.amount.toLocaleString('en-IN')}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 shrink-0">
                <ActionButton
                  id={`shortcut-expense-${expense._id}`}
                  onClick={() => onSaveShortcut(expense)}
                  title="Save as shortcut"
                  hoverClass="hover:text-warning"
                >
                  <Bookmark size={14} />
                </ActionButton>
                <ActionButton
                  id={`edit-expense-${expense._id}`}
                  onClick={() => onEdit(expense)}
                  title="Edit expense"
                  hoverClass="hover:text-primary"
                >
                  <Edit2 size={14} />
                </ActionButton>
                <ActionButton
                  id={`delete-expense-${expense._id}`}
                  onClick={() => onDelete(expense._id)}
                  title="Delete expense"
                  hoverClass="hover:text-danger"
                >
                  <Trash2 size={14} />
                </ActionButton>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseList;