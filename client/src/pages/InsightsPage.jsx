import Sidebar from '../components/Sidebar';
import InsightCards from '../components/InsightCards';
import SpendingLineChart from '../components/SpendingLineChart';
import SpendingPieChart from '../components/SpendingPieChart';

const InsightsPage = () => (
  <div className="min-h-screen bg-gray-950 flex">
    <Sidebar />
    <main className="flex-1 ml-64 p-8 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">AI Insights</h1>
        <p className="text-gray-400 text-sm mt-1">Smart financial analysis powered by AI</p>
      </div>
      <div className="mb-8">
        <InsightCards />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SpendingLineChart />
        <SpendingPieChart />
      </div>
    </main>
  </div>
);

export default InsightsPage;
