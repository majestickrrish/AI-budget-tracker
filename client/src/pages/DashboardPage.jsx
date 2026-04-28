import { useState } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import SpendingPieChart from '../components/SpendingPieChart';
import SpendingLineChart from '../components/SpendingLineChart';
import RecentExpenses from '../components/RecentExpenses';
import InsightCards from '../components/InsightCards';
import { dummyExpenses, totalSpending, avgMonthlySpending } from '../data/dummyData';
import { IndianRupee, CalendarDays, Tag, Activity } from 'lucide-react';

const DashboardPage = () => {
  const [expenses, setExpenses] = useState(dummyExpenses);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-default">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">Your financial overview for April 2025</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<IndianRupee />} label="Total Spent (Apr)" value={`₹${totalSpending.toLocaleString()}`} sub="↑ 8% vs last month" accent="danger" />
        <StatCard icon={<CalendarDays />} label="Avg Monthly" value={`₹${avgMonthlySpending.toLocaleString()}`} sub="Last 6 months" accent="primary" />
        <StatCard icon={<Tag />} label="Top Category" value="Food" sub="₹3,800 this month" accent="warning" />
        <StatCard icon={<Activity />} label="Health Score" value="Good" sub="Savings rate is healthy" accent="success" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-6">
        <SpendingLineChart />
        <SpendingPieChart />
      </div>

      {/* Recent Expenses */}
      <div className="mb-6">
        <RecentExpenses expenses={expenses} />
      </div>

      {/* AI Insights */}
      <InsightCards />
    </Layout>
  );
};

export default DashboardPage;
