import { dummyInsights } from '../data/dummyData';

const colorMap = {
  amber: 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50',
  red: 'border-red-500/30 bg-red-500/5 hover:border-red-500/50',
  indigo: 'border-indigo-500/30 bg-indigo-500/5 hover:border-indigo-500/50',
  green: 'border-green-500/30 bg-green-500/5 hover:border-green-500/50',
};

const InsightCards = () => (
  <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-5">
      <span className="text-lg">🤖</span>
      <h3 className="text-white font-semibold text-base">AI Insights</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {dummyInsights.map((insight) => (
        <div
          key={insight.id}
          className={`border rounded-xl p-4 transition-all duration-200 cursor-default ${colorMap[insight.color]}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">{insight.icon}</span>
            <div>
              <p className="text-sm font-semibold text-white mb-1">{insight.title}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{insight.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default InsightCards;
