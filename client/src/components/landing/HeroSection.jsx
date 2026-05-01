import { Button } from "./LandingUI";

function MiniBarChart() {
  const bars = [40, 65, 45, 80, 55, 90, 70];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="flex items-end gap-2 h-24 w-full">
      {bars.map((h, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 flex-1 h-full justify-end">
          <div
            className="w-full rounded-sm bg-primary/80 hover:bg-primary transition-all duration-300"
            style={{ height: `${h}%`, minHeight: "4px" }}
          />
          <span className="text-[8px] font-bold text-text-secondary opacity-50 uppercase tracking-tighter">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function MiniDonut() {
  const segments = [
    { pct: 35, color: "var(--primary)" },
    { pct: 25, color: "var(--success)" },
    { pct: 20, color: "var(--warning)" },
    { pct: 20, color: "var(--border)" },
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
    <section className="relative pt-24 pb-16 overflow-hidden bg-background">
      {/* Subtle background orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-8 sm:px-12 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Copy */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full self-start border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              AI-Powered Finance Assistant
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black text-text-default leading-[1.15] tracking-tight">
              Take Control of Your Money with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover">
                AI-Powered Insights
              </span>
            </h1>
            
            <p className="text-lg text-text-secondary leading-relaxed max-w-xl opacity-90">
              Track expenses, predict spending, and get smart financial advice — all in one place. Your personal CFO that never sleeps.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button href="/register" variant="primary" className="w-full sm:w-auto px-7 py-3.5 text-base group/btn">
                Get Started Free
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-1 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Button>
              <Button href="#dashboard-preview" variant="secondary" className="w-full sm:w-auto px-7 py-3.5 text-base">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="9" cy="9" r="7"/>
                  <path d="M7.5 7.5l4 1.5-4 1.5V7.5z" fill="currentColor"/>
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
                <div key={item.label} className="flex items-center gap-1.5 text-xs text-text-secondary font-bold opacity-70">
                  <span className="text-success">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Mock Dashboard */}
          <div className="relative group">
            <div className="bg-card rounded-3xl shadow-2xl shadow-primary/10 border border-border-default p-6 space-y-5 transition-all duration-500 group-hover:border-primary/20">
              {/* Top bar */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">Total Balance</p>
                  <p className="text-2xl font-black text-text-default">₹1,24,450</p>
                </div>
                <div className="flex items-center gap-1.5 bg-success/10 text-success text-[10px] font-black px-3 py-1 rounded-full">
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M2 8l4-4 2 2 2-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  +8.2% this month
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Income", value: "₹52,000", color: "text-success" },
                  { label: "Expenses", value: "₹28,400", color: "text-danger" },
                  { label: "Savings", value: "₹14,300", color: "text-primary" },
                ].map((s) => (
                  <div key={s.label} className="bg-background/50 rounded-2xl p-3.5 text-center border border-border-default/50">
                    <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
                    <p className="text-[9px] font-bold text-text-secondary mt-1 uppercase tracking-tighter opacity-60">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Chart + Donut */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <div className="sm:col-span-3 bg-background/50 rounded-2xl p-5 border border-border-default/50">
                  <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest opacity-60 mb-4">Weekly Spending</p>
                  <div className="h-24 flex items-end">
                    <MiniBarChart />
                  </div>
                </div>
                <div className="sm:col-span-2 bg-background/50 rounded-2xl p-5 border border-border-default/50 flex flex-col items-center justify-center gap-3 overflow-hidden">
                  <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest opacity-60">By Category</p>
                  <div className="py-2">
                    <MiniDonut />
                  </div>
                </div>
              </div>

              {/* AI Insight */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-primary/20">
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.5 4.5H11L8 7L9.5 11L6 9L2.5 11L4 7L1 4.5H4.5L6 1Z" fill="white"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">AI Insight</p>
                  <p className="text-xs text-text-default font-medium leading-relaxed mt-1 opacity-90">
                    You're spending 23% more on dining this month. Cut ₹1,800 to hit your savings goal.
                  </p>
                </div>
              </div>

              {/* Health Score */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-success flex items-center justify-center">
                    <span className="text-xs font-black text-success">84</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-text-default">Health Score</p>
                    <p className="text-[9px] font-bold text-success uppercase">Good standing</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-black text-text-default">Next Bill</p>
                  <p className="text-[9px] font-bold text-warning uppercase">Netflix · in 3 days</p>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-card border border-border-default rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-bounce-slow">
              <div className="w-8 h-8 bg-warning/20 rounded-xl flex items-center justify-center text-lg">🎯</div>
              <div>
                <p className="text-xs font-black text-text-default leading-tight">Savings Goal</p>
                <p className="text-[10px] font-bold text-text-secondary opacity-70">72% complete</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
