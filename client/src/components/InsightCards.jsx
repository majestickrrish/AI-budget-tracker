import { Bot, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

const InsightCards = ({ insights = [] }) => {
  const hasInsights = insights && insights.length > 0;

  return (
    <div className="bg-card border border-border-default rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Bot size={24} className="text-primary" />
        <h3 className="text-text-default font-semibold text-base">AI Insights</h3>
      </div>
      
      {hasInsights ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="border border-border-default bg-background/50 rounded-xl p-4 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-default mb-1">{insight.title}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-background border border-border-default flex items-center justify-center mb-4 opacity-40">
            <Bot size={24} className="text-text-secondary" />
          </div>
          <p className="text-sm font-semibold text-text-default">AI is analyzing your spending...</p>
          <p className="text-xs text-text-secondary mt-1">Check back soon for personalized insights</p>
        </div>
      )}
    </div>
  );
};

export default InsightCards;
