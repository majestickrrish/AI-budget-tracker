import { SectionContainer, MockDashboardCard } from "./LandingUI";

function SpendingBar({ category, amount, max, color }) {
  const pct = Math.round((amount / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{category}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">${amount}</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

function LineChart() {
  const points = [30, 50, 40, 65, 45, 72, 55, 80, 60, 75, 65, 85];
  const w = 260, h = 80;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((p) => h - (p / 100) * h);
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <svg viewBox={`0 0 ${w} ${h + 16}`} className="w-full">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#areaGrad)"/>
      <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {xs.map((x, i) => (
        <text key={i} x={x} y={h + 13} textAnchor="middle" fontSize="7" fill="#94a3b8">{months[i]}</text>
      ))}
    </svg>
  );
}

const insights = [
  { type: "warning", icon: "⚠️", text: "Dining spend up 23% vs last month" },
  { type: "success", icon: "✅", text: "Utilities stayed $45 under budget" },
  { type: "info", icon: "💡", text: "Move $200 to savings to hit your goal" },
  { type: "danger", icon: "🔔", text: "Subscription anomaly detected: +$12.99" },
];

const insightColors = {
  warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/40 text-amber-700 dark:text-amber-400",
  success: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/40 text-green-700 dark:text-green-400",
  info: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/40 text-blue-700 dark:text-blue-400",
  danger: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/40 text-red-700 dark:text-red-400",
};

export default function DashboardPreview() {
  return (
    <div id="dashboard-preview" className="w-full py-16 bg-background scroll-mt-6">
      <SectionContainer>
        <div className="text-center mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">
            Your command center
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-text-default tracking-tight">
            Everything at a glance
          </h2>
          <p className="mt-4 text-text-secondary max-w-xl mx-auto leading-relaxed opacity-80">
            A beautiful, information-dense dashboard that makes complex finances feel simple.
          </p>
        </div>

        {/* Mock dashboard grid */}
        <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-inner">
          {/* Dashboard topbar */}
          <div className="flex items-center justify-between mb-4 px-1">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Dashboard · May 2026</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-slate-400">Live</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Health Score */}
            <MockDashboardCard className="flex flex-col items-center justify-center gap-3 py-6">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="8" className="dark:stroke-slate-700"/>
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#22c55e" strokeWidth="8"
                    strokeDasharray={`${(84/100)*238} 238`} strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">84</span>
                  <span className="text-[9px] text-slate-400">/100</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Financial Health</p>
                <p className="text-xs text-green-500 font-medium mt-0.5">Good Standing ↑</p>
              </div>
            </MockDashboardCard>

            {/* Spending breakdown */}
            <MockDashboardCard className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Spending Breakdown</p>
              <SpendingBar category="Housing" amount={1200} max={2000} color="#3b82f6"/>
              <SpendingBar category="Food & Dining" amount={620} max={2000} color="#f59e0b"/>
              <SpendingBar category="Transport" amount={280} max={2000} color="#8b5cf6"/>
              <SpendingBar category="Entertainment" amount={180} max={2000} color="#06b6d4"/>
              <SpendingBar category="Health" amount={95} max={2000} color="#22c55e"/>
            </MockDashboardCard>

            {/* AI Insights */}
            <MockDashboardCard className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">AI Insights & Alerts</p>
              {insights.map((item, i) => (
                <div key={i} className={`flex items-start gap-2 border rounded-lg px-3 py-2 text-xs ${insightColors[item.type]}`}>
                  <span className="mt-px">{item.icon}</span>
                  <span className="leading-snug">{item.text}</span>
                </div>
              ))}
            </MockDashboardCard>

            {/* Monthly trend */}
            <MockDashboardCard className="sm:col-span-2">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Spending Trend · 12 months</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">$2,840 <span className="text-xs text-green-500 font-medium">↓ 8% vs last month</span></p>
                </div>
                <div className="flex gap-1.5">
                  {["1M","3M","1Y"].map((t) => (
                    <button key={t} className={`text-[10px] px-2 py-1 rounded-md font-medium transition-colors ${t === "1Y" ? "bg-blue-500 text-white" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <LineChart />
            </MockDashboardCard>

            {/* Upcoming bills */}
            <MockDashboardCard>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">Upcoming Bills</p>
              <div className="space-y-2.5">
                {[
                  { name: "Netflix", due: "May 5", amount: "$15.99", urgent: true },
                  { name: "Spotify", due: "May 8", amount: "$9.99", urgent: false },
                  { name: "Electricity", due: "May 12", amount: "$94.00", urgent: false },
                  { name: "Internet", due: "May 15", amount: "$59.99", urgent: false },
                ].map((bill) => (
                  <div key={bill.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${bill.urgent ? "bg-amber-400" : "bg-slate-300 dark:bg-slate-600"}`}/>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{bill.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{bill.amount}</span>
                      <span className="text-[10px] text-slate-400 ml-1">{bill.due}</span>
                    </div>
                  </div>
                ))}
              </div>
            </MockDashboardCard>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
