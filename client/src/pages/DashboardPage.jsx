import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  PieChart as PieChartIcon, 
  ArrowRight, 
  DollarSign, 
  Activity, 
  Calendar,
  Layers
} from 'lucide-react';
import Layout from '../components/Layout';
import { getExpenses } from '../services/api';

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  'Food & Dining':    { color: '#D85A30', bg: 'bg-orange-100 dark:bg-orange-900/30', emoji: '🍕' },
  'Groceries':        { color: '#639922', bg: 'bg-green-100 dark:bg-green-900/30',   emoji: '🛒' },
  'Transport':        { color: '#378ADD', bg: 'bg-blue-100 dark:bg-blue-900/30',     emoji: '🚕' },
  'Entertainment':    { color: '#BA7517', bg: 'bg-yellow-100 dark:bg-yellow-900/30', emoji: '🎬' },
  'Health & Medical': { color: '#E24B4A', bg: 'bg-red-100 dark:bg-red-900/30',       emoji: '💊' },
  'Education':        { color: '#378ADD', bg: 'bg-blue-100 dark:bg-blue-900/30',     emoji: '📚' },
  'Bills & Utilities':{ color: '#1D9E75', bg: 'bg-teal-100 dark:bg-teal-900/30',    emoji: '⚡' },
  'Travel':           { color: '#7F77DD', bg: 'bg-purple-100 dark:bg-purple-900/30', emoji: '✈️' },
  'Shopping':         { color: '#D4537E', bg: 'bg-pink-100 dark:bg-pink-900/30',     emoji: '🛍️' },
  'Other':            { color: '#888780', bg: 'bg-gray-100 dark:bg-gray-900/30',     emoji: '📦' },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const DashboardStat = ({ icon: Icon, label, value, sub, accent = 'primary' }) => {
  const accentMap = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
  };

  return (
    <div className="bg-card border border-border-default rounded-2xl p-6 flex items-start gap-4 transition-all hover:border-text-secondary shadow-sm min-w-0">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${accentMap[accent]}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-secondary font-medium mb-1">{label}</p>
        <p className="text-base sm:text-lg font-bold text-text-default break-words leading-tight">{value}</p>
        {sub && <p className="text-xs text-text-secondary mt-1.5 opacity-80 truncate">{sub}</p>}
      </div>
    </div>
  );
};

// ─── Skeleton loader ──────────────────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-card border border-border-default rounded-2xl ${className}`} />
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const DashboardPage = () => {
  const now = new Date();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lineRef = useRef(null);
  const donutRef = useRef(null);
  const lineChart = useRef(null);
  const donutChart = useRef(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getExpenses({ month: now.getMonth() + 1, year: now.getFullYear() });
        setExpenses(res.data.data.expenses || []);
      } catch (err) {
        console.error('[DashboardPage]', err);
        setError('Could not load dashboard data. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Derived analytics ──────────────────────────────────────────────────────
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const avgPerTx   = expenses.length ? totalSpent / expenses.length : 0;

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0];
  const maxCategoryAmt = topCategory ? topCategory[1] : 1;

  // Daily spending for line chart
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dailyTotals = Array(daysInMonth).fill(0);
  expenses.forEach((e) => {
    const d = new Date(e.date).getDate() - 1;
    if (d >= 0 && d < daysInMonth) dailyTotals[d] += e.amount;
  });

  // Recent 5
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // ── Load Chart.js once ────────────────────────────────────────────────────
  useEffect(() => {
    if (window.Chart) return;
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
    s.async = true;
    document.head.appendChild(s);
  }, []);

  // ── Charts ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (loading || expenses.length === 0) return;

    const initCharts = () => {
      if (!window.Chart) { setTimeout(initCharts, 100); return; }

      const isDark   = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
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
              backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                gradient.addColorStop(0, 'rgba(216,90,48,0.12)');
                gradient.addColorStop(1, 'rgba(216,90,48,0)');
                return gradient;
              },
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 6,
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
                bodyColor: isDark ? '#9a9a94' : '#73726c',
                borderColor: gridColor,
                borderWidth: 1,
                padding: 12,
                boxPadding: 4,
                callbacks: { 
                  label: (c) => `Spent: ₹${c.raw.toLocaleString('en-IN')}`,
                  title: (c) => `Date: ${c[0].label} ${now.toLocaleString('en-IN', { month: 'short' })}`
                }
              },
            },
            scales: {
              x: { grid: { display: false }, ticks: { color: tickColor, font: { size: 10 }, maxTicksLimit: 10 } },
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
              borderWidth: 0,
              hoverOffset: 12,
              spacing: 2,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: { display: false },
              tooltip: { 
                backgroundColor: isDark ? '#1c1c1a' : '#fff',
                titleColor: isDark ? '#fff' : '#1c1c1a',
                bodyColor: isDark ? '#9a9a94' : '#73726c',
                borderColor: gridColor,
                borderWidth: 1,
                padding: 10,
                callbacks: { 
                  label: (c) => ` ₹${c.raw.toLocaleString('en-IN')}`,
                  title: (c) => c[0].label
                } 
              },
            },
          },
        });
      }
    };

    initCharts();
    return () => { lineChart.current?.destroy(); donutChart.current?.destroy(); };
  }, [loading, expenses]);

  // ── Render ─────────────────────────────────────────────────────────────────
  const monthLabel = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-default">Dashboard</h1>
          <p className="text-text-secondary text-sm mt-1">{monthLabel}</p>
        </div>
        {!loading && expenses.length > 0 && (
          <span className="text-xs px-3 py-1.5 rounded-full bg-card border border-border-default text-text-secondary font-medium">
            {expenses.length} ACTIVE TRANSACTIONS
          </span>
        )}
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <Skeleton className="lg:col-span-3 h-[280px]" />
            <Skeleton className="lg:col-span-2 h-[280px]" />
          </div>
        </div>
      )}

      {/* Full dashboard */}
      {!loading && expenses.length > 0 && (
        <div className="space-y-6 pb-10">

          {/* Stat cards - Professional style */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DashboardStat
              icon={DollarSign}
              label="Total spent"
              value={`₹${totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
              sub={`${expenses.length} transactions`}
              accent="danger"
            />
            <DashboardStat
              icon={Activity}
              label="Avg per transaction"
              value={`₹${Math.round(avgPerTx).toLocaleString('en-IN')}`}
              sub={monthLabel}
              accent="primary"
            />
            <DashboardStat
              icon={TrendingUp}
              label="Top category"
              value={topCategory ? topCategory[0] : '—'}
              sub={topCategory ? `${Math.round((topCategory[1] / totalSpent) * 100)}% of total spending` : ''}
              accent="warning"
            />
          </div>

          {/* Charts row - Professional with advanced tooltips */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 bg-card border border-border-default rounded-2xl p-6">
              <h3 className="text-sm font-bold text-text-default mb-6 flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" /> Daily Spending Trend
              </h3>
              <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                <canvas ref={lineRef} />
              </div>
            </div>
            <div className="lg:col-span-2 bg-card border border-border-default rounded-2xl p-6">
              <h3 className="text-sm font-bold text-text-default mb-6 flex items-center gap-2">
                <PieChartIcon size={16} className="text-primary" /> Category Allocation
              </h3>
              <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                <canvas ref={donutRef} />
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Recent transactions */}
            <div className="bg-card border border-border-default rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border-default flex items-center justify-between">
                <h3 className="text-sm font-bold text-text-default">Recent Transactions</h3>
                <Link to="/expenses" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group">
                  View All <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              <div className="divide-y divide-border-default">
                {recentExpenses.map((e) => {
                  const cfg = CATEGORY_CONFIG[e.category] || CATEGORY_CONFIG['Other'];
                  return (
                    <div key={e._id} className="flex items-center gap-4 px-6 py-4 hover:bg-background/40 transition-colors">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 ${cfg.bg}`}>
                        {cfg.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-text-default truncate">{e.description}</p>
                        <p className="text-xs text-text-secondary mt-0.5 font-medium truncate">
                          {e.category} • {new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <p className="text-base font-bold text-danger shrink-0">
                        −₹{e.amount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Spending Concentration - Restored Percentages */}
            <div className="bg-card border border-border-default rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-text-default mb-6 flex items-center gap-2">
                <Layers size={16} className="text-primary" /> Spending Concentration
              </h3>
              <div className="space-y-5">
                {sortedCategories.map(([cat, amt]) => {
                  const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['Other'];
                  const pct = Math.round((amt / totalSpent) * 100);
                  const barWidth = Math.round((amt / maxCategoryAmt) * 100);
                  return (
                    <div key={cat} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-text-default flex items-center gap-2 min-w-0">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                          <span className="truncate">{cat}</span>
                        </span>
                        <span className="text-text-secondary">{pct}% • ₹{amt.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="h-1.5 bg-background rounded-full overflow-hidden border border-border-default/30">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${barWidth}%`, backgroundColor: cfg.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && expenses.length === 0 && !error && (
        <div className="bg-card border border-border-default rounded-2xl p-16 text-center">
          <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mx-auto mb-4">
            <Calendar size={20} className="text-text-secondary" />
          </div>
          <p className="text-text-default font-medium mb-1">No expenses this month</p>
          <p className="text-text-secondary text-sm">Add your first expense to see spending insights here.</p>
        </div>
      )}
    </Layout>
  );
};

export default DashboardPage;