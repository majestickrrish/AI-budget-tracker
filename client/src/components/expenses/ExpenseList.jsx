import { Edit2, Trash2, FolderOpen, Bookmark, Calendar } from 'lucide-react';

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
    className={`w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-text-secondary transition-all duration-150 bg-background sm:bg-transparent border border-border-default sm:border-none hover:bg-black/5 dark:hover:bg-white/5 ${hoverClass}`}
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
    <div className="bg-card border border-border-default rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border-default flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-text-default">All Expenses</h3>
          <p className="text-xs text-text-secondary opacity-70 mt-0.5">{expenses.length} records this month</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-text-secondary bg-background px-3 py-1.5 rounded-lg border border-border-default">
          <Bookmark size={10} className="text-warning shrink-0" />
          Manage your transactions below
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-border-default">
        {expenses.map((expense) => {
          const cfg = CATEGORY_CONFIG[expense.category] || CATEGORY_CONFIG['Other'];
          return (
            <div
              key={expense._id}
              className="group relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 px-5 py-4 sm:px-6 sm:py-4 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors duration-150"
            >
              {/* Category Column - FIXED WIDTH ON DESKTOP */}
              <div className="flex items-center justify-between sm:justify-start gap-3 sm:w-36 lg:w-44 shrink-0">
                <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-[9px] font-bold border uppercase tracking-wider min-w-[80px] text-center ${cfg.bg}`}>
                  {expense.category}
                </span>
                {/* Amount on Mobile Top Right */}
                <span className="sm:hidden text-base font-black text-danger tabular-nums">
                  −₹{expense.amount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Description + date Column */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-text-default truncate leading-tight">
                  {expense.description}
                </p>
                <div className="flex items-center gap-2 mt-1 opacity-70">
                   <Calendar size={10} className="text-text-secondary" />
                   <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-tighter">
                    {new Date(expense.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Desktop Amount - ALIGNED RIGHT */}
              <span className="hidden sm:block text-sm font-bold text-danger shrink-0 tabular-nums min-w-[100px] text-right">
                −₹{expense.amount.toLocaleString('en-IN')}
              </span>

              {/* Actions Column - FIXED WIDTH ON DESKTOP */}
              <div className="flex items-center gap-2 sm:gap-1 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-border-default/50 sm:border-none sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity duration-150 shrink-0 sm:w-28 justify-end">
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
