const categoryColors = {
  Food: 'bg-indigo-500/20 text-indigo-400',
  Entertainment: 'bg-amber-500/20 text-amber-400',
  Utilities: 'bg-green-500/20 text-green-400',
  Transport: 'bg-blue-500/20 text-blue-400',
  Health: 'bg-pink-500/20 text-pink-400',
  Education: 'bg-purple-500/20 text-purple-400',
  Shopping: 'bg-orange-500/20 text-orange-400',
  Other: 'bg-gray-500/20 text-gray-400',
};

const ExpenseList = ({ expenses, onDelete, onEdit }) => {
  if (!expenses.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 text-center">
        <p className="text-4xl mb-3">🗂️</p>
        <p className="text-gray-400 text-sm">No expenses yet. Add your first one above!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <h3 className="text-white font-semibold text-base">All Expenses</h3>
        <p className="text-xs text-gray-500 mt-0.5">{expenses.length} records</p>
      </div>

      <div className="divide-y divide-gray-700/50">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-700/30 transition-colors duration-150 group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 ${categoryColors[expense.category] || categoryColors.Other}`}>
                {expense.category}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-white font-medium truncate">{expense.description}</p>
                <p className="text-xs text-gray-500 mt-0.5">{expense.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 ml-4">
              <span className="text-sm font-bold text-red-400">−₹{expense.amount.toLocaleString()}</span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button
                  id={`edit-expense-${expense.id}`}
                  onClick={() => onEdit(expense)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-indigo-600 text-gray-400 hover:text-white transition-all duration-200 text-sm"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  id={`delete-expense-${expense.id}`}
                  onClick={() => onDelete(expense.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-red-600 text-gray-400 hover:text-white transition-all duration-200 text-sm"
                  title="Delete"
                >
                  🗑️
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
