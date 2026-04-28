import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getExpenses } from '../services/api';

// ── Minimal StatCard ──────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color = 'text-text-default' }) => (
  <div className="bg-card border border-border-default rounded-2xl p-5">
    <p className="text-xs font-medium text-text-secondary mb-2">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    {sub && <p className="text-xs text-text-secondary mt-1 opacity-70">{sub}</p>}
  </div>
);

const DashboardPage = () => {
  const now = new Date();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch current month for "this month" stats
        const currentMonthRes = await getExpenses({
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        });
        setExpenses(currentMonthRes.data.data.expenses || []);
      } catch (err) {
        console.error('[DashboardPage fetchAll]', err);
        setError('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Analytics ────────────────────────────────────────────────────────────
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const avgPerExpense = expenses.length
    ? totalSpent / expenses.length
    : 0;

  // Category breakdown — top category this month
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-default">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">
          {now.toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border-default rounded-2xl p-5 animate-pulse h-24"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Spent This Month"
            value={`₹${totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
            sub={`${expenses.length} transactions`}
            color="text-danger"
          />
          <StatCard
            label="Avg per Transaction"
            value={`₹${avgPerExpense.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
            sub="this month"
          />
          <StatCard
            label="Top Category"
            value={topCategory ? topCategory[0] : '—'}
            sub={
              topCategory
                ? `₹${topCategory[1].toLocaleString('en-IN', { maximumFractionDigits: 2 })} spent`
                : 'No data yet'
            }
            color="text-primary"
          />
        </div>
      )}
    </Layout>
  );
};

export default DashboardPage;