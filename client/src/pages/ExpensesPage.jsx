import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { dummyExpenses } from '../data/dummyData';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState(dummyExpenses);

  const handleAdd = (newExpense) => {
    setExpenses([newExpense, ...expenses]);
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleEdit = (expense) => {
    // TODO Phase 2: open edit modal
    alert(`Edit functionality coming in Phase 2!\n\nExpense: ${expense.description}`);
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Expenses</h1>
            <p className="text-gray-400 text-sm mt-1">
              {expenses.length} expenses · Total: <span className="text-red-400 font-semibold">₹{total.toLocaleString()}</span>
            </p>
          </div>
        </div>

        <ExpenseForm onAdd={handleAdd} />
        <ExpenseList expenses={expenses} onDelete={handleDelete} onEdit={handleEdit} />
      </main>
    </div>
  );
};

export default ExpensesPage;
