// ─── DashboardPage.jsx ──────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, PieChart as PieChartIcon, ArrowRight, DollarSign,
  Activity, Layers, Inbox, AlertCircle, Brain, Heart, Zap, Target,
  ArrowUpRight, ArrowDownRight, ShieldAlert, ChevronDown
} from 'lucide-react';
import { 
  getExpenses, 
  getAnalyticsSummary, 
  getAIPredictions, 
  getHealthScore, 
  getAIInsights, 
  getAnomalies 
} from '../services/api';
import { getUser } from '../utils/auth';

const CATEGORY_CONFIG = {
  'Food & Dining': { color: '#D85A30', bg: 'bg-orange-100 dark:bg-orange-900/30', emoji: '🍕' },
  'Groceries': { color: '#639922', bg: 'bg-green-100 dark:bg-green-900/30', emoji: '🛒' },
  'Transport': { color: '#378ADD', bg: 'bg-blue-100 dark:bg-blue-900/30', emoji: '🚕' },
  'Entertainment': { color: '#BA7517', bg: 'bg-yellow-100 dark:bg-yellow-900/30', emoji: '🎬' },
  'Health & Medical': { color: '#E24B4A', bg: 'bg-red-100 dark:bg-red-900/30', emoji: '💊' },
  'Education': { color: '#378ADD', bg: 'bg-blue-100 dark:bg-blue-900/30', emoji: '📚' },
  'Bills & Utilities': { color: '#1D9E75', bg: 'bg-teal-100 dark:bg-teal-900/30', emoji: '⚡' },
  'Travel': { color: '#7F77DD', bg: 'bg-purple-100 dark:bg-purple-900/30', emoji: '✈️' },
  'Shopping': { color: '#D4537E', bg: 'bg-pink-100 dark:bg-pink-900/30', emoji: '🛍️' },
  'Other': { color: '#888780', bg: 'bg-gray-100 dark:bg-gray-900/30', emoji: '📦' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-border-default/40 rounded-xl ${className}`} />
);

const WidgetEmpty = ({ message = 'No data available' }) => (
  <div className="flex flex-col items-center justify-center h-full py-10 gap-3">
    <div className="w-10 h-10 rounded-xl bg-background border border-border-default flex items-center justify-center">
      <Inbox size={18} className="text-text-secondary opacity-40" />
    </div>
    <p className="text-xs text-text-secondary text-center max-w-[160px] opacity-70 leading-relaxed">{message}</p>
  </div>
);

const SectionHeader = ({ icon: Icon, title, accent = 'text-primary' }) => (
  <div className="flex items-center gap-2 mb-5">
    <Icon size={15} className={`${accent} shrink-0`} />
    <h3 className="text-sm font-bold text-text-default">{title}</h3>
  </div>
);

const DashboardStat = ({ icon: Icon, label, value, sub, accent = 'primary', delta }) => {
  const accentMap = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    neutral: 'bg-border-default text-text-secondary',
  };
  return (
    <div className="bg-card border border-border-default rounded-xl p-5 flex items-start gap-4 hover:shadow-sm hover:border-border-default/80 transition-all duration-150 min-w-0">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${accentMap[accent]}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">{label}</p>
        <p className="text-lg font-bold text-text-default break-words leading-snug">{value}</p>
        {sub && <p className="text-xs text-text-secondary mt-1 opacity-70 truncate">{sub}</p>}
        {delta !== undefined && (
          <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${delta >= 0 ? 'text-danger' : 'text-success'}`}>
            {delta >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(delta)}% vs last month
          </div>
        )}
      </div>
    </div>
  );
};

const HealthScoreRing = ({ score }) => {
  const pct = Math.min(100, Math.max(0, score || 0));
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const strokeDash = (pct / 100) * circ;
  const color = pct >= 70 ? '#1D9E75' : pct >= 40 ? '#BA7517' : '#E24B4A';
  const label = pct >= 70 ? 'Great' : pct >= 40 ? 'Fair' : 'Poor';

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--color-border-default)" strokeWidth="10" />
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={`${strokeDash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-text-default leading-none">{pct}</span>
          <span className="text-[9px] text-text-secondary font-semibold uppercase tracking-wide">/ 100</span>
        </div>
      </div>
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{label}</span>
    </div>
  );
};

// ─── Custom Filter Dropdown ───────────────────────────────────────────────────
const FilterDropdown = ({ value, options, onChange, type = 'month' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const click = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', click);
    return () => document.removeEventListener('mousedown', click);
  }, []);

  const selectedLabel = type === 'month' 
    ? new Date(2000, value - 1).toLocaleString('en-IN', { month: 'short' })
    : value;

  return (
    <div className="relative" ref={ref}>
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${open ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-text-default hover:bg-card'}`}
      >
        {selectedLabel}
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-32 bg-card border border-border-default rounded-xl shadow-2xl z-[100] py-1 animate-in fade-in slide-in-from-top-2">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-xs transition-colors ${opt.value === value ? 'bg-primary/10 text-primary font-bold' : 'text-text-default hover:bg-background'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const DashboardPage = () => {
  const now = new Date();
  const user = getUser();

  const [month, setMonth] = useState(() => {
    const saved = localStorage.getItem('global_filter_month');
    return saved ? parseInt(saved) : now.getMonth() + 1;
  });
  const [year, setYear] = useState(() => {
    const saved = localStorage.getItem('global_filter_year');
    return saved ? parseInt(saved) : now.getFullYear();
  });

  useEffect(() => {
    localStorage.setItem('global_filter_month', month);
    localStorage.setItem('global_filter_year', year);
  }, [month, year]);

  const monthLabel = useMemo(() => {
    const d = new Date(year, month - 1);
    return d.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  }, [month, year]);

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [healthScore, setHealthScore] = useState(null);
  const [insights, setInsights] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lineRef = useRef(null);
  const donutRef = useRef(null);
  const lineChart = useRef(null);
  const donutChart = useRef(null);

  const userId = user?._id || 'guest';
  const onboarding = (() => {
    try { return JSON.parse(localStorage.getItem(`onboarding_${userId}`)) || {}; } catch { return {}; }
  })();
  const monthlyBudget = onboarding.monthlyBudget || 0;

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [expRes, sumRes, predRes, hsRes, insRes, anomRes] = await Promise.allSettled([
        getExpenses({ month, year }),
        getAnalyticsSummary({ month, year }),
        getAIPredictions(), 
        getHealthScore({ month, year }),
        getAIInsights({ month, year }),
        getAnomalies(),
      ]);

      if (expRes.status === 'fulfilled') setExpenses(expRes.value?.data?.data?.expenses || []);
      if (sumRes.status === 'fulfilled') setSummary(sumRes.value?.data?.data || sumRes.value?.data);
      if (predRes.status === 'fulfilled') setPrediction(predRes.value?.data?.data || predRes.value?.data);
      if (hsRes.status === 'fulfilled') setHealthScore(hsRes.value?.data?.data || hsRes.value?.data);
      if (insRes.status === 'fulfilled') setInsights((insRes.value?.data?.data || insRes.value?.data)?.insights?.slice(0, 3) || []);
      if (anomRes.status === 'fulfilled') setAnomalies((anomRes.value?.data?.data || anomRes.value?.data)?.anomalies?.slice(0, 2) || []);
    } catch (e) {
      setError('Could not load dashboard data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const hasExpenses = expenses.length > 0;
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const avgPerTx = hasExpenses ? totalSpent / expenses.length : 0;
  const budgetUsedPct = monthlyBudget > 0 ? Math.round((totalSpent / monthlyBudget) * 100) : null;

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0];
  const maxCategoryAmt = topCategory ? topCategory[1] : 1;

  const daysInMonth = new Date(year, month, 0).getDate();
  const dailyTotals = Array(daysInMonth).fill(0);
  expenses.forEach((e) => {
    const d = new Date(e.date).getDate() - 1;
    if (d >= 0 && d < daysInMonth) dailyTotals[d] += e.amount;
  });

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const predictedTotal = prediction?.predictedNextMonthSpend ?? prediction?.prediction ?? null;
  const hsScore = healthScore?.score ?? healthScore?.healthScore ?? null;

  useEffect(() => {
    if (window.Chart) return;
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
    s.async = true;
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    if (loading || !hasExpenses) return;
    const initCharts = () => {
      if (!window.Chart) { setTimeout(initCharts, 100); return; }
      const isDark = document.documentElement.classList.contains('dark');
      const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
      const tickColor = isDark ? '#9a9a94' : '#73726c';

      if (lineRef.current) {
        lineChart.current?.destroy();
        lineChart.current = new window.Chart(lineRef.current, {
          type: 'line',
          data: {
            labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
            datasets: [{
              data: dailyTotals,
              borderColor: '#D85A30', fill: true, tension: 0.4, borderWidth: 2,
              pointRadius: 0, pointHoverRadius: 5,
              pointHoverBackgroundColor: '#D85A30', pointHoverBorderColor: '#fff', pointHoverBorderWidth: 2,
              backgroundColor: (ctx) => {
                const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
                g.addColorStop(0, 'rgba(216,90,48,0.12)');
                g.addColorStop(1, 'rgba(216,90,48,0)');
                return g;
              },
            }],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: isDark ? '#1c1c1a' : '#fff',
                titleColor: isDark ? '#fff' : '#1c1c1a', bodyColor: tickColor,
                borderColor: gridColor, borderWidth: 1, padding: 10, boxPadding: 3,
                callbacks: {
                  label: (c) => `Spent: ₹${c.raw.toLocaleString('en-IN')}`,
                  title: (c) => `${c[0].label} ${monthLabel.split(' ')[0]}`,
                },
              },
            },
            scales: {
              x: { grid: { display: false }, ticks: { color: tickColor, font: { size: 10 }, maxTicksLimit: 8 } },
              y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 10 }, callback: (v) => `₹${v}` }, beginAtZero: true },
            },
          },
        });
      }

      if (donutRef.current && sortedCategories.length) {
        donutChart.current?.destroy();
        donutChart.current = new window.Chart(donutRef.current, {
          type: 'doughnut',
          data: {
            labels: sortedCategories.map(([c]) => c),
            datasets: [{
              data: sortedCategories.map(([, v]) => v),
              backgroundColor: sortedCategories.map(([c]) => CATEGORY_CONFIG[c]?.color || '#888780'),
              borderWidth: 0, hoverOffset: 10, spacing: 2,
            }],
          },
          options: {
            responsive: true, maintainAspectRatio: false, cutout: '72%',
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: isDark ? '#1c1c1a' : '#fff',
                titleColor: isDark ? '#fff' : '#1c1c1a', bodyColor: tickColor,
                borderColor: gridColor, borderWidth: 1, padding: 10,
                callbacks: {
                  label: (c) => ` ₹${c.raw.toLocaleString('en-IN')}`,
                  title: (c) => c[0].label,
                },
              },
            },
          },
        });
      }
    };
    initCharts();
    return () => { lineChart.current?.destroy(); donutChart.current?.destroy(); };
  }, [loading, expenses, month, year]);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-default">Dashboard</h1>
          <p className="text-text-secondary text-sm mt-0.5">{monthLabel}</p>
        </div>
        
        <div className="flex items-center gap-1 bg-background border border-border-default p-1 rounded-xl shadow-sm self-stretch sm:self-auto">
          <FilterDropdown 
            value={month} 
            options={Array.from({ length: 12 }, (_, i) => ({ 
              value: i + 1, 
              label: new Date(2000, i).toLocaleString('en-IN', { month: 'long' }) 
            }))}
            onChange={setMonth}
            type="month"
          />
          <div className="w-px h-4 bg-border-default mx-1" />
          <FilterDropdown 
            value={year} 
            options={[2024, 2025, 2026].map(y => ({ value: y, label: y.toString() }))}
            onChange={setYear}
            type="year"
          />
          {!loading && hasExpenses && (
            <>
              <div className="w-px h-4 bg-border-default mx-1" />
              <span className="text-[10px] px-2.5 py-1 text-text-secondary font-bold whitespace-nowrap bg-card border border-border-default rounded-lg">
                {expenses.length} TX
              </span>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {!loading && anomalies.length > 0 && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
          <ShieldAlert size={16} className="text-warning shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-warning mb-0.5">Spending Anomaly Detected</p>
            <p className="text-xs text-text-secondary truncate">
              {anomalies[0]?.description || anomalies[0]?.message || 'Unusual spending pattern found this month.'}
            </p>
          </div>
          <Link to="/insights" className="text-xs font-semibold text-warning shrink-0 hover:opacity-80 transition-opacity">
            View →
          </Link>
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <Skeleton className="lg:col-span-3 h-64" />
            <Skeleton className="lg:col-span-2 h-64" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Skeleton className="lg:col-span-2 h-72" />
            <Skeleton className="h-72" />
          </div>
        </div>
      )}

      {!loading && (
        <div className="space-y-4 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardStat
              icon={DollarSign} label="Total Spent" accent="danger"
              value={`₹${totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
              sub={hasExpenses ? `Across ${expenses.length} transactions` : 'No records yet'}
            />
            <DashboardStat
              icon={Activity} label="Avg per Transaction" accent="primary"
              value={`₹${Math.round(avgPerTx).toLocaleString('en-IN')}`}
              sub={monthLabel}
            />
            <DashboardStat
              icon={TrendingUp} label="Top Category" accent="warning"
              value={topCategory ? topCategory[0] : '—'}
              sub={topCategory ? `${Math.round((topCategory[1] / totalSpent) * 100)}% of total` : 'No data'}
            />
            <DashboardStat
              icon={Brain} label="AI Prediction" accent="neutral"
              value={predictedTotal ? `₹${Math.round(predictedTotal).toLocaleString('en-IN')}` : '—'}
              sub={predictedTotal ? 'Projected month-end total' : 'Add more data for prediction'}
            />
          </div>

          {monthlyBudget > 0 && (
            <div className="bg-card border border-border-default rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target size={14} className="text-primary" />
                  <span className="text-sm font-bold text-text-default">Budget Progress</span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${budgetUsedPct > 90 ? 'bg-danger/10 text-danger' : budgetUsedPct > 70 ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                  {budgetUsedPct ?? 0}% used
                </span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${budgetUsedPct > 90 ? 'bg-danger' : budgetUsedPct > 70 ? 'bg-warning' : 'bg-success'}`}
                  style={{ width: `${Math.min(100, budgetUsedPct || 0)}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-text-secondary">₹{totalSpent.toLocaleString('en-IN')} spent</span>
                <span className="text-xs text-text-secondary">₹{monthlyBudget.toLocaleString('en-IN')} budget</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 bg-card border border-border-default rounded-xl p-5 min-h-[280px] flex flex-col">
              <SectionHeader icon={TrendingUp} title="Daily Spending Trend" />
              {hasExpenses ? (
                <div className="flex-1 relative min-h-0" style={{ height: '200px' }}><canvas ref={lineRef} /></div>
              ) : (
                <div className="flex-1"><WidgetEmpty message="Start adding expenses to see your spending trend" /></div>
              )}
            </div>
            <div className="lg:col-span-2 bg-card border border-border-default rounded-xl p-5 min-h-[280px] flex flex-col">
              <SectionHeader icon={PieChartIcon} title="Category Allocation" />
              {hasExpenses ? (
                <div className="flex-1 relative min-h-0" style={{ height: '200px' }}><canvas ref={donutRef} /></div>
              ) : (
                <div className="flex-1"><WidgetEmpty message="Category insights will appear once you add data" /></div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-card border border-border-default rounded-xl overflow-hidden flex flex-col min-h-[320px]">
              <div className="px-5 py-4 border-b border-border-default flex items-center justify-between shrink-0">
                <h3 className="text-sm font-bold text-text-default">Recent Transactions</h3>
                <Link to="/expenses" className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 group transition-colors">
                  View All <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-150" />
                </Link>
              </div>
              <div className="flex-1">
                {hasExpenses ? (
                  <div className="divide-y divide-border-default">
                    {recentExpenses.map((e) => {
                      const cfg = CATEGORY_CONFIG[e.category] || CATEGORY_CONFIG['Other'];
                      return (
                        <div key={e._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors duration-150">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${cfg.bg}`}>{cfg.emoji}</div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-text-default truncate leading-tight">{e.description}</p>
                            <p className="text-xs text-text-secondary mt-0.5 opacity-70 truncate">{e.category} · {new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                          </div>
                          <p className="text-sm font-bold text-danger shrink-0 tabular-nums">−₹{e.amount.toLocaleString('en-IN')}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <WidgetEmpty message="No recent transactions found" />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-card border border-border-default rounded-xl p-5 flex flex-col items-center">
                <SectionHeader icon={Heart} title="Financial Health" />
                {hsScore !== null ? (
                  <>
                    <HealthScoreRing score={hsScore} />
                    <p className="text-xs text-text-secondary text-center mt-3 opacity-70 leading-relaxed">
                      {hsScore >= 70 ? 'Your finances look healthy! Keep it up.' : hsScore >= 40 ? 'Room to improve — check insights.' : 'Spending needs attention. See AI Insights.'}
                    </p>
                  </>
                ) : (
                  <WidgetEmpty message="Add expenses to compute your health score" />
                )}
              </div>

              {insights.length > 0 && (
                <div className="bg-card border border-border-default rounded-xl p-5 flex-1">
                  <SectionHeader icon={Zap} title="AI Insights" />
                  <div className="space-y-3">
                    {insights.map((ins, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <p className="text-xs text-text-secondary leading-relaxed">{ins?.message || ins?.insight || String(ins)}</p>
                      </div>
                    ))}
                  </div>
                  <Link to="/insights" className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover mt-4 group transition-colors">
                    Full Analysis <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-150" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardPage;