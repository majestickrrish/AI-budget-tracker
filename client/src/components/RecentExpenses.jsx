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

const RecentExpenses = ({ expenses }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
    <h3 className="text-white font-semibold text-base mb-5">Recent Expenses</h3>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Description</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Category</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Date</th>
            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/50">
          {expenses.slice(0, 5).map((expense) => (
            <tr key={expense.id} className="hover:bg-gray-700/30 transition-colors duration-150">
              <td className="py-3 text-sm text-gray-200 font-medium">{expense.description}</td>
              <td className="py-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${categoryColors[expense.category] || categoryColors.Other}`}>
                  {expense.category}
                </span>
              </td>
              <td className="py-3 text-sm text-gray-400">{expense.date}</td>
              <td className="py-3 text-sm font-bold text-right text-red-400">
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
