import Layout from '../components/Layout';
import InsightCards from '../components/InsightCards';
import SpendingLineChart from '../components/SpendingLineChart';
import SpendingPieChart from '../components/SpendingPieChart';

const InsightsPage = () => (
  <Layout>
    <div className="mb-6">
      <h1 className="text-xl sm:text-2xl font-bold text-text-default">AI Insights</h1>
      <p className="text-text-secondary text-sm mt-1">Smart financial analysis powered by AI</p>
    </div>
    <div className="mb-6">
      <InsightCards />
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <SpendingLineChart />
      <SpendingPieChart />
    </div>
  </Layout>
);

export default InsightsPage;
