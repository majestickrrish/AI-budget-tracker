import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  PieChart as PieChartIcon,
  ArrowRight,
  DollarSign,
  Activity,
  Layers,
  Inbox,
  AlertCircle,
} from 'lucide-react';
import Layout from '../components/Layout';
import { getExpenses } from '../services/api';

// ─── Category config ────────────────────────────────────────────────────────
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

// ─── Stat Card ───────────────────────────────────────────────────────────────
const DashboardStat = ({ icon: Icon, label, value, sub, accent = 'primary' }) => {
  const accentMap = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
  };
  return (
    <div className="bg-card border border-border-default rounded-xl p-5 flex items-start gap-4 transition-all duration-150 hover:shadow-sm hover:border-border-default/80 min-w-0">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${accentMap[accent]}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">{label}</p>
        <p className="text-lg font-bold text-text-default break-words leading-snug">{value}</p>
        {sub && <p className="text-xs text-text-secondary mt-1 opacity-70 truncate">{sub}</p>}
      </div>
    </div>
  );
};

// ─── Empty state ─────────────────────────────────────────────────────────────
const WidgetEmpty = ({ message = 'No data available' }) => (
  <div className="flex flex-col items-center justify-center h-full py-12 gap-3">
    <div className="w-10 h-10 rounded-xl bg-background border border-border-default flex items-center justify-center">
      <Inbox size={18} className="text-text-secondary opacity-40" />
    </div>
    <p className="text-xs text-text-secondary text-center max-w-[160px] opacity-70 leading-relaxed">
      {message}
    </p>
  </div>
);

// ─── Skeleton ────────────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-card border border-border-default rounded-xl ${className}`} />
);

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-5">
    <Icon size={15} className="text-primary shrink-0" />
    <h3 className="text-sm font-bold text-text-default">{title}</h3>
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
const DashboardPage = () => {
  const now = new Date();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lineRef = useRef(null);
  const donutRef = useRef(null);
  const lineChart = useRef(null);
  const donutChart = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getExpenses({ month: now.getMonth() + 1, year: now.getFullYear() });
        setExpenses(res.data.data.expenses || []);
      } catch {
        setError('Could not load dashboard data. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Derived analytics
  const hasExpenses = expenses.length > 0;
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const avgPerTx = hasExpenses ? totalSpent / expenses.length : 0;

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0];
  const maxCategoryAmt = topCategory ? topCategory[1] : 1;

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dailyTotals = Array(daysInMonth).fill(0);
  expenses.forEach((e) => {
    const d = new Date(e.date).getDate() - 1;
    if (d >= 0 && d < daysInMonth) dailyTotals[d] += e.amount;
  });

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Load Chart.js
  useEffect(() => {
    if (window.Chart) return;
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
    s.async = true;
    document.head.appendChild(s);
  }, []);

  // Init charts
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
              borderColor: '#D85A30',
              backgroundColor: (ctx) => {
                const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
                g.addColorStop(0, 'rgba(216,90,48,0.10)');
                g.addColorStop(1, 'rgba(216,90,48,0)');
                return g;
              },
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: '#D85A30',
              pointHoverBorderColor: '#fff',
              pointHoverBorderWidth: 2,
              fill: true,
              tension: 0.4,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: isDark ? '#1c1c1a' : '#fff',
                titleColor: isDark ? '#fff' : '#1c1c1a',
                bodyColor: tickColor,
                borderColor: gridColor,
                borderWidth: 1,
                padding: 10,
                boxPadding: 3,
                callbacks: {
                  label: (c) => `Spent: ₹${c.raw.toLocaleString('en-IN')}`,
                  title: (c) => `${c[0].label} ${now.toLocaleString('en-IN', { month: 'short' })}`,
                },
              },
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: tickColor, font: { size: 10 }, maxTicksLimit: 8 },
              },
              y: {
                grid: { color: gridColor },
                ticks: { color: tickColor, font: { size: 10 }, callback: (v) => `₹${v}` },
                beginAtZero: true,
              },
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
              borderWidth: 0,
              hoverOffset: 10,
              spacing: 2,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: isDark ? '#1c1c1a' : '#fff',
                titleColor: isDark ? '#fff' : '#1c1c1a',
                bodyColor: tickColor,
                borderColor: gridColor,
                borderWidth: 1,
                padding: 10,
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
  }, [loading, expenses]);

  const monthLabel = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <Layout>
      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-default">Dashboard</h1>
          <p className="text-text-secondary text-sm mt-0.5">{monthLabel}</p>
        </div>
        {!loading && hasExpenses && (
          <span className="text-[11px] px-3 py-1.5 rounded-full bg-card border border-border-default text-text-secondary font-semibold tracking-wide shrink-0">
            {expenses.length} TRANSACTIONS
          </span>
        )}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-20" /><Skeleton className="h-20" /><Skeleton className="h-20" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <Skeleton className="lg:col-span-3 h-64" />
            <Skeleton className="lg:col-span-2 h-64" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-72" /><Skeleton className="h-72" />
          </div>
        </div>
      )}

      {!loading && (
        <div className="space-y-4 pb-10">

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DashboardStat
              icon={DollarSign}
              label="Total Spent"
              value={`₹${totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
              sub={hasExpenses ? `Across ${expenses.length} transactions` : 'No records yet'}
              accent="danger"
            />
            <DashboardStat
              icon={Activity}
              label="Avg per Transaction"
              value={`₹${Math.round(avgPerTx).toLocaleString('en-IN')}`}
              sub={monthLabel}
              accent="primary"
            />
            <DashboardStat
              icon={TrendingUp}
              label="Top Category"
              value={topCategory ? topCategory[0] : '—'}
              sub={
                topCategory
                  ? `${Math.round((topCategory[1] / totalSpent) * 100)}% of total spend`
                  : 'No data available'
              }
              accent="warning"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 bg-card border border-border-default rounded-xl p-5 min-h-[280px] flex flex-col">
              <SectionHeader icon={TrendingUp} title="Daily Spending Trend" />
              {hasExpenses ? (
                <div className="flex-1 relative min-h-0" style={{ height: '200px' }}>
                  <canvas ref={lineRef} />
                </div>
              ) : (
                <div className="flex-1"><WidgetEmpty message="Start adding expenses to see your spending trend" /></div>
              )}
            </div>
            <div className="lg:col-span-2 bg-card border border-border-default rounded-xl p-5 min-h-[280px] flex flex-col">
              <SectionHeader icon={PieChartIcon} title="Category Allocation" />
              {hasExpenses ? (
                <div className="flex-1 relative min-h-0" style={{ height: '200px' }}>
                  <canvas ref={donutRef} />
                </div>
              ) : (
                <div className="flex-1"><WidgetEmpty message="Categorization insights will appear once you add data" /></div>
              )}
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Recent transactions */}
            <div className="bg-card border border-border-default rounded-xl overflow-hidden flex flex-col min-h-[320px]">
              <div className="px-5 py-4 border-b border-border-default flex items-center justify-between shrink-0">
                <h3 className="text-sm font-bold text-text-default">Recent Transactions</h3>
                <Link
                  to="/expenses"
                  className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 group transition-colors"
                >
                  View All
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-150" />
                </Link>
              </div>
              <div className="flex-1">
                {hasExpenses ? (
                  <div className="divide-y divide-border-default">
                    {recentExpenses.map((e) => {
                      const cfg = CATEGORY_CONFIG[e.category] || CATEGORY_CONFIG['Other'];
                      return (
                        <div
                          key={e._id}
                          className="flex items-center gap-3 px-5 py-3.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors duration-150"
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${cfg.bg}`}>
                            {cfg.emoji}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-text-default truncate leading-tight">{e.description}</p>
                            <p className="text-xs text-text-secondary mt-0.5 opacity-70 truncate">
                              {e.category} ·{' '}
                              {new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-danger shrink-0 tabular-nums">
                            −₹{e.amount.toLocaleString('en-IN')}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <WidgetEmpty message="No recent transactions found" />
                )}
              </div>
            </div>

            {/* Spending concentration */}
            <div className="bg-card border border-border-default rounded-xl p-5 flex flex-col min-h-[320px]">
              <SectionHeader icon={Layers} title="Spending Concentration" />
              <div className="flex-1">
                {hasExpenses ? (
                  <div className="space-y-4">
                    {sortedCategories.map(([cat, amt]) => {
                      const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['Other'];
                      const pct = Math.round((amt / totalSpent) * 100);
                      const barWidth = Math.round((amt / maxCategoryAmt) * 100);
                      return (
                        <div key={cat}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold text-text-default flex items-center gap-2 min-w-0">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: cfg.color }}
                              />
                              <span className="truncate">{cat}</span>
                            </span>
                            <span className="text-xs text-text-secondary font-medium tabular-nums shrink-0 ml-2">
                              {pct}% · ₹{amt.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="h-1 bg-background rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${barWidth}%`, backgroundColor: cfg.color, opacity: 0.85 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <WidgetEmpty message="Category breakdown will appear here" />
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </Layout>
  );
};

export default DashboardPage;