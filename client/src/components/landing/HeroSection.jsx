import { Button } from "./LandingUI";

function MiniBarChart() {
  const bars = [40, 65, 45, 80, 55, 90, 70];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="flex items-end gap-1.5 h-20 pt-2">
      {bars.map((h, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-md bg-gradient-to-t from-blue-500 to-cyan-400 opacity-80 hover:opacity-100 transition-opacity duration-150"
            style={{ height: `${h}%` }}
          />
          <span className="text-[9px] text-slate-400 dark:text-slate-500">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function MiniDonut() {
  const segments = [
    { pct: 35, color: "#3b82f6" },
    { pct: 25, color: "#06b6d4" },
    { pct: 20, color: "#8b5cf6" },
    { pct: 20, color: "#e2e8f0" },
  ];
  let offset = 0;
  const r = 28, c = 2 * Math.PI * r;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="rotate-[-90deg]">
      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * c;
        const gap = c - dash;
        const el = (
          <circle
            key={i}
            cx="40" cy="40" r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="10"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset * c / 100}
          />
        );
        offset += seg.pct;
        return el;
      })}
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Subtle background orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-br from-blue-100/60 via-cyan-100/30 to-transparent dark:from-blue-900/20 dark:via-cyan-900/10 dark:to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Copy */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full self-start border border-blue-100 dark:border-blue-800">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              AI-Powered Finance Assistant
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-[1.15] tracking-tight">
              Take Control of Your Money with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                AI-Powered Insights
              </span>
            </h1>
            
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
              Track expenses, predict spending, and get smart financial advice — all in one place. Your personal CFO that never sleeps.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button href="/register" variant="primary" className="w-full sm:w-auto px-7 py-3 text-base">
                Get Started Free
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12H19M13 6l6 6-6 6"/>
                </svg>
              </Button>
              <Button href="#dashboard-preview" variant="secondary" className="w-full sm:w-auto px-7 py-3 text-base">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="8" cy="8" r="6"/>
                  <path d="M6.5 6.5l4 1.5-4 1.5V6.5z" fill="currentColor"/>
                </svg>
                View Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-2">
              {[
                { label: "Free Forever Plan", icon: "✓" },
                { label: "No Credit Card Required", icon: "✓" },
                { label: "Setup in 2 min", icon: "✓" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="text-green-500 font-bold">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Mock Dashboard */}
          <div className="relative">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900 border border-slate-100 dark:border-slate-700 p-5 space-y-4">
              {/* Top bar */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Total Balance</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">$12,450.00</p>
                </div>
                <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 8l4-4 2 2 2-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  +8.2% this month
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Income", value: "$5,200", color: "text-green-500" },
                  { label: "Expenses", value: "$2,840", color: "text-red-400" },
                  { label: "Savings", value: "$1,430", color: "text-blue-500" },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                    <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Chart + Donut */}
              <div className="grid grid-cols-5 gap-3">
                <div className="col-span-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1">Weekly Spending</p>
                  <MiniBarChart />
                </div>
                <div className="col-span-2 bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 flex flex-col items-center justify-center gap-2">
                  <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">By Category</p>
                  <MiniDonut />
                </div>
              </div>

              {/* AI Insight */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl p-3 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.5 4.5H11L8 7L9.5 11L6 9L2.5 11L4 7L1 4.5H4.5L6 1Z" fill="white"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400">AI Insight</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug mt-0.5">
                    You're spending 23% more on dining this month. Cut $180 to hit your savings goal.
                  </p>
                </div>
              </div>

              {/* Health Score */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-green-400 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-green-500">84</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">Health Score</p>
                    <p className="text-[9px] text-green-500">Good standing</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">Next Bill</p>
                  <p className="text-[9px] text-amber-500">Netflix · in 3 days</p>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
              <span className="text-base">🎯</span>
              <div>
                <p className="text-[10px] font-bold text-slate-900 dark:text-white">Savings Goal</p>
                <p className="text-[9px] text-slate-400">72% complete</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
