const categoryColors = {
  Food: 'bg-primary/20 text-primary',
  Entertainment: 'bg-warning/20 text-warning',
  Utilities: 'bg-success/20 text-success',
  Transport: 'bg-primary/20 text-primary',
  Health: 'bg-danger/20 text-danger',
  Education: 'bg-primary/20 text-primary',
  Shopping: 'bg-warning/20 text-warning',
  Other: 'bg-border-default text-text-secondary',
};

const RecentExpenses = ({ expenses }) => (
  <div className="bg-card border border-border-default rounded-2xl p-6">
    <h3 className="text-text-default font-semibold text-base mb-5">Recent Expenses</h3>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-default">
            <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider pb-3">Description</th>
            <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider pb-3">Category</th>
            <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider pb-3">Date</th>
            <th className="text-right text-xs font-semibold text-text-secondary uppercase tracking-wider pb-3">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default">
          {expenses.slice(0, 5).map((expense) => (
            <tr key={expense.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-150">
              <td className="py-3 text-sm text-text-default font-medium">{expense.description}</td>
              <td className="py-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${categoryColors[expense.category] || categoryColors.Other}`}>
                  {expense.category}
                </span>
              </td>
              <td className="py-3 text-sm text-text-secondary">{expense.date}</td>
              <td className="py-3 text-sm font-bold text-right text-danger">
                −₹{expense.amount.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RecentExpenses;
