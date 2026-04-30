// ─── InsightsPage.jsx ────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import {
  Brain, Zap, TrendingUp, TrendingDown, ShieldAlert, Heart,
  AlertCircle, Inbox, BarChart2
} from 'lucide-react';
import { 
  getAnalyticsSummary, 
  getAIPredictions, 
  getHealthScore, 
  getAIInsights, 
  getAnomalies 
} from '../services/api';

const CATEGORY_COLORS = {
  'Food & Dining': '#D85A30', 'Groceries': '#639922', 'Transport': '#378ADD',
  'Entertainment': '#BA7517', 'Health & Medical': '#E24B4A', 'Education': '#378ADD',
  'Bills & Utilities': '#1D9E75', 'Travel': '#7F77DD', 'Shopping': '#D4537E', 'Other': '#888780',
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-border-default/40 rounded-xl ${className}`} />
);

// ─── WidgetEmpty ─────────────────────────────────────────────────────────────
const WidgetEmpty = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-70">
    <div className="w-10 h-10 rounded-xl bg-background border border-border-default flex items-center justify-center">
      <Inbox size={18} className="text-text-secondary opacity-50" />
    </div>
    <p className="text-xs text-text-secondary text-center max-w-[160px] leading-relaxed">{message}</p>
  </div>
);

// ─── Health Ring ──────────────────────────────────────────────────────────────
const HealthRing = ({ score }) => {
  const pct = Math.min(100, Math.max(0, score || 0));
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 70 ? '#1D9E75' : pct >= 40 ? '#BA7517' : '#E24B4A';
  const label = pct >= 70 ? 'Excellent' : pct >= 55 ? 'Good' : pct >= 40 ? 'Fair' : 'Needs Work';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={r} fill="none" stroke="var(--color-border-default)" strokeWidth="12" />
          <circle
            cx="64" cy="64" r={r} fill="none" stroke={color}
            strokeWidth="12" strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round" style={{ transition: 'stroke-dasharray 1.2s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-text-default leading-none">{pct}</span>
          <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wide">/ 100</span>
        </div>
      </div>
      <div className="text-center">
        <span className="text-sm font-bold" style={{ color }}>{label}</span>
        <p className="text-xs text-text-secondary mt-0.5">Financial Health Score</p>
      </div>
    </div>
  );
};

// ─── Insight Card ─────────────────────────────────────────────────────────────
const InsightCard = ({ type, message, category, amount }) => {
  const typeConfig = {
    warning: { icon: ShieldAlert, accent: 'text-warning', bg: 'bg-warning/5 border-warning/20' },
    tip: { icon: Zap, accent: 'text-primary', bg: 'bg-primary/5 border-primary/20' },
    success: { icon: TrendingDown, accent: 'text-success', bg: 'bg-success/5 border-success/20' },
    info: { icon: Brain, accent: 'text-primary', bg: 'bg-primary/5 border-primary/20' },
  };
  const cfg = typeConfig[type] || typeConfig.info;
  const Icon = cfg.icon;

  return (
    <div className={`border rounded-xl p-4 ${cfg.bg}`}>
      <div className="flex items-start gap-3">
        <div className={`shrink-0 mt-0.5 ${cfg.accent}`}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-default leading-relaxed">{message}</p>
          {category && (
            <span className="inline-flex items-center mt-2 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-background border border-border-default text-text-secondary">
              {category}
            </span>
          )}
          {amount && (
            <span className="ml-2 text-xs font-bold text-danger tabular-nums">
              ₹{Number(amount).toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Anomaly Card ─────────────────────────────────────────────────────────────
const AnomalyCard = ({ anomaly }) => {
  const description = anomaly?.description || anomaly?.message || 'Unusual spending pattern detected.';
  const severity = anomaly?.severity || 'medium';
  const colorMap = { high: 'text-danger border-danger/20 bg-danger/5', medium: 'text-warning border-warning/20 bg-warning/5', low: 'text-primary border-primary/20 bg-primary/5' };
  const cls = colorMap[severity] || colorMap.medium;

  return (
    <div className={`border rounded-xl p-4 ${cls}`}>
      <div className="flex items-start gap-3">
        <ShieldAlert size={15} className="shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide mb-1 opacity-70">
            {severity === 'high' ? 'High Severity' : severity === 'medium' ? 'Medium Severity' : 'Low Severity'}
          </p>
          <p className="text-sm leading-relaxed">{description}</p>
          {anomaly?.category && (
            <p className="text-xs mt-1 opacity-70">Category: {anomaly.category}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Prediction Chart ─────────────────────────────────────────────────────────
const PredictionSection = ({ prediction }) => {
  const predicted = prediction?.predictedNextMonthSpend ?? prediction?.prediction ?? null;
  const confidence = prediction?.confidence ?? prediction?.confidenceScore ?? null;
  const trend = prediction?.trend ?? null;
  const dailyAvg = prediction?.dailyAverage ?? prediction?.averageDaily ?? null;

  if (!predicted) return <WidgetEmpty message="Accumulate more expense data for spending predictions." />;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-background border border-border-default rounded-xl p-4 text-center">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Predicted Total</p>
          <p className="text-xl font-black text-text-default">₹{Math.round(predicted).toLocaleString('en-IN')}</p>
          <p className="text-xs text-text-secondary mt-1">This month</p>
        </div>
        {confidence !== null && (
          <div className="bg-background border border-border-default rounded-xl p-4 text-center">
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Confidence</p>
            <p className="text-xl font-black text-text-default">{Math.round(confidence * 100)}%</p>
            <p className="text-xs text-text-secondary mt-1">Prediction accuracy</p>
          </div>
        )}
        {dailyAvg !== null && (
          <div className="bg-background border border-border-default rounded-xl p-4 text-center">
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Daily Avg</p>
            <p className="text-xl font-black text-text-default">₹{Math.round(dailyAvg).toLocaleString('en-IN')}</p>
            <p className="text-xs text-text-secondary mt-1">Per day pace</p>
          </div>
        )}
      </div>
      {trend && (
        <div className={`flex items-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl border ${trend === 'up' ? 'bg-danger/8 border-danger/20 text-danger' : 'bg-success/8 border-success/20 text-success'}`}>
          {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          Spending is trending {trend === 'up' ? 'upward' : 'downward'} compared to previous periods
        </div>
      )}
    </div>
  );
};

// ─── InsightsPage ─────────────────────────────────────────────────────────────
const InsightsPage = () => {
  const [insights, setInsights] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [healthScore, setHealthScore] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.allSettled([
          getAIInsights(),
          getAnomalies(),
          getAIPredictions(),
          getHealthScore(),
          getAnalyticsSummary(),
        ]);

        const [ins, anom, pred, hs, sum] = results;
        if (ins.status === 'fulfilled') setInsights((ins.value?.data?.data || ins.value?.data)?.insights || []);
        if (anom.status === 'fulfilled') setAnomalies((anom.value?.data?.data || anom.value?.data)?.anomalies || []);
        if (pred.status === 'fulfilled') setPrediction(pred.value?.data?.data || pred.value?.data);
        if (hs.status === 'fulfilled') setHealthScore(hs.value?.data?.data || hs.value?.data);
        if (sum.status === 'fulfilled') setSummary(sum.value?.data?.data || sum.value?.data);

        if (results.every((r) => r.status === 'rejected')) {
          setError('Could not reach analytics API. Is the backend running?');
        }
      } catch (e) {
        setError('An unexpected error occurred while fetching insights.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const hsScore = healthScore?.score ?? healthScore?.healthScore ?? null;
  const categoryBreakdown = summary?.categoryBreakdown || summary?.categories || [];

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-default flex items-center gap-2">
          <Brain size={22} className="text-primary" />
          AI Insights
        </h1>
        <p className="text-text-secondary text-sm mt-1">Smart financial analysis powered by AI</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Skeletons */}
      {loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Skeleton className="lg:col-span-2 h-80" />
            <Skeleton className="h-80" />
          </div>
          <Skeleton className="h-64" />
          <Skeleton className="h-48" />
        </div>
      )}

      {!loading && (
        <div className="space-y-5 pb-10">

          {/* ── Row 1: Insights + Health Score ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* AI Insights list */}
            <div className="lg:col-span-2 bg-card border border-border-default rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-default flex items-center gap-2">
                <Zap size={15} className="text-primary" />
                <h3 className="text-sm font-bold text-text-default">AI Recommendations</h3>
                <span className="ml-auto text-[10px] font-bold text-text-secondary bg-background border border-border-default px-2.5 py-1 rounded-full">
                  {insights.length} INSIGHTS
                </span>
              </div>
              <div className="p-5 space-y-3">
                {insights.length > 0 ? (
                  insights.map((ins, i) => (
                    <InsightCard
                      key={i}
                      type={ins?.type || (i === 0 ? 'warning' : i % 2 === 0 ? 'tip' : 'info')}
                      message={ins?.message || ins?.insight || String(ins)}
                      category={ins?.category}
                      amount={ins?.amount}
                    />
                  ))
                ) : (
                  <WidgetEmpty message="Add more expenses to unlock personalized AI insights" />
                )}
              </div>
            </div>

            {/* Health Score */}
            <div className="bg-card border border-border-default rounded-xl p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-5">
                <Heart size={15} className="text-danger" />
                <h3 className="text-sm font-bold text-text-default">Financial Health</h3>
              </div>
              {hsScore !== null ? (
                <>
                  <div className="flex-1 flex items-center justify-center">
                    <HealthRing score={hsScore} />
                  </div>
                  {/* Health factors */}
                  <div className="mt-4 space-y-2 border-t border-border-default pt-4">
                    {(healthScore?.factors || healthScore?.breakdown || []).map((f, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary truncate">{f?.label || f?.name || `Factor ${i + 1}`}</span>
                        <span className={`font-bold ${f?.score >= 70 ? 'text-success' : f?.score >= 40 ? 'text-warning' : 'text-danger'}`}>
                          {f?.score ?? '—'}/100
                        </span>
                      </div>
                    ))}
                    {(!healthScore?.factors && !healthScore?.breakdown) && (
                      <p className="text-xs text-text-secondary opacity-70 text-center">
                        {hsScore >= 70 ? '✅ Your finances are in great shape!' : hsScore >= 40 ? '⚠️ Some areas need attention.' : '🔴 Review your spending habits.'}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1"><WidgetEmpty message="Add expenses to generate your health score" /></div>
              )}
            </div>
          </div>

          {/* ── Row 2: Anomalies ── */}
          {anomalies.length > 0 && (
            <div className="bg-card border border-border-default rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-default flex items-center gap-2">
                <ShieldAlert size={15} className="text-warning" />
                <h3 className="text-sm font-bold text-text-default">Spending Anomalies</h3>
                <span className="ml-auto text-[10px] font-bold text-warning bg-warning/10 border border-warning/20 px-2.5 py-1 rounded-full">
                  {anomalies.length} DETECTED
                </span>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {anomalies.map((a, i) => (
                  <AnomalyCard key={i} anomaly={a} />
                ))}
              </div>
            </div>
          )}

          {/* ── Row 3: Prediction ── */}
          <div className="bg-card border border-border-default rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border-default flex items-center gap-2">
              <TrendingUp size={15} className="text-primary" />
              <h3 className="text-sm font-bold text-text-default">Spending Prediction</h3>
            </div>
            <div className="p-5">
              <PredictionSection prediction={prediction} />
            </div>
          </div>

          {/* ── Row 4: Category breakdown from summary ── */}
          {categoryBreakdown.length > 0 && (
            <div className="bg-card border border-border-default rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border-default flex items-center gap-2">
                <BarChart2 size={15} className="text-primary" />
                <h3 className="text-sm font-bold text-text-default">Category Deep Dive</h3>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  {categoryBreakdown.map((cat, i) => {
                    const name = cat?.category || cat?.name || `Category ${i + 1}`;
                    const amt = cat?.total || cat?.amount || 0;
                    const pct = cat?.percentage || cat?.percent || 0;
                    const color = CATEGORY_COLORS[name] || '#888780';
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-text-default flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                            {name}
                          </span>
                          <span className="text-xs text-text-secondary tabular-nums font-medium">
                            {Math.round(pct)}% · ₹{Number(amt).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="h-1.5 bg-background rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${Math.min(100, pct)}%`, backgroundColor: color, opacity: 0.85 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default InsightsPage;