import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import SpendingPieChart from '../components/SpendingPieChart';
import SpendingLineChart from '../components/SpendingLineChart';
import RecentExpenses from '../components/RecentExpenses';
import InsightCards from '../components/InsightCards';
import { dummyExpenses, totalSpending, avgMonthlySpending } from '../data/dummyData';

const DashboardPage = () => {
  const [expenses, setExpenses] = useState(dummyExpenses);

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar />

      {/* Main content offset by sidebar width */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Your financial overview for April 2025</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <StatCard
            icon="💸"
            label="Total Spent (Apr)"
            value={`₹${totalSpending.toLocaleString()}`}
            sub="↑ 8% vs last month"
            accent="indigo"
          />
          <StatCard
            icon="📅"
            label="Avg Monthly"
            value={`₹${avgMonthlySpending.toLocaleString()}`}
            sub="Last 6 months"
            accent="green"
          />
          <StatCard
            icon="🏷️"
            label="Top Category"
            value="Food"
            sub="₹3,800 this month"
            accent="amber"
          />
          <StatCard
            icon="🧬"
            label="Health Score"
            value="Good"
            sub="Savings rate is healthy"
            accent="pink"
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <SpendingLineChart />
          <SpendingPieChart />
        </div>

        {/* Recent Expenses */}
        <div className="mb-8">
          <RecentExpenses expenses={expenses} />
        </div>

        {/* AI Insights */}
        <InsightCards />
      </main>
    </div>
  );
};

export default DashboardPage;
