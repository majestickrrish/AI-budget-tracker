import { useState } from 'react';
import Layout from '../components/Layout';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { dummyExpenses } from '../data/dummyData';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState(dummyExpenses);

  const handleAdd    = (e) => setExpenses([e, ...expenses]);
  const handleDelete = (id) => setExpenses(expenses.filter((e) => e.id !== id));
  const handleEdit   = (expense) => alert(`Edit coming in Phase 2!\n\n${expense.description}`);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Layout>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-default">Expenses</h1>
          <p className="text-text-secondary text-sm mt-1">
            {expenses.length} expenses · Total:{' '}
            <span className="text-danger font-semibold">₹{total.toLocaleString()}</span>
          </p>
        </div>
      </div>

      <ExpenseForm onAdd={handleAdd} />
      <ExpenseList expenses={expenses} onDelete={handleDelete} onEdit={handleEdit} />
    </Layout>
  );
};

export default ExpensesPage;
