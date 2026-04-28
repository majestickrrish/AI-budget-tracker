import { dummyInsights } from '../data/dummyData';
import { Bot, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

const colorMap = {
  warning: 'border-warning/30 bg-warning/5 hover:border-warning/50',
  danger: 'border-danger/30 bg-danger/5 hover:border-danger/50',
  primary: 'border-primary/30 bg-primary/5 hover:border-primary/50',
  success: 'border-success/30 bg-success/5 hover:border-success/50',
};

const iconMap = {
  1: <TrendingUp size={20} className="text-warning" />,
  2: <AlertTriangle size={20} className="text-danger" />,
  3: <Bot size={20} className="text-primary" />,
  4: <CheckCircle2 size={20} className="text-success" />,
};

const InsightCards = () => (
  <div className="bg-card border border-border-default rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-5">
      <Bot size={24} className="text-primary" />
      <h3 className="text-text-default font-semibold text-base">AI Insights</h3>
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
              <p className="text-sm font-semibold text-text-default mb-1">{insight.title}</p>
              <p className="text-xs text-text-secondary leading-relaxed">{insight.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default InsightCards;
