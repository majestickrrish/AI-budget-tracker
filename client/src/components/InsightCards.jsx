import { dummyInsights } from '../data/dummyData';
import { Bot, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

const colorMap = {
  amber: 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50',
  red: 'border-red-500/30 bg-red-500/5 hover:border-red-500/50',
  indigo: 'border-indigo-500/30 bg-indigo-500/5 hover:border-indigo-500/50',
  green: 'border-green-500/30 bg-green-500/5 hover:border-green-500/50',
};

const iconMap = {
  1: <TrendingUp size={20} className="text-amber-400" />,
  2: <AlertTriangle size={20} className="text-red-400" />,
  3: <Bot size={20} className="text-indigo-400" />,
  4: <CheckCircle2 size={20} className="text-green-400" />,
};

const InsightCards = () => (
  <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-5">
      <Bot size={24} className="text-indigo-400" />
      <h3 className="text-white font-semibold text-base">AI Insights</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {dummyInsights.map((insight) => (
        <div
          key={insight.id}
          className={`border rounded-xl p-4 transition-all duration-200 cursor-default ${colorMap[insight.color]}`}
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5">{iconMap[insight.id]}</span>
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
