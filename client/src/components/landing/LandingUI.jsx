// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({ children, variant = "primary", href, className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 text-sm";
  const variants = {
    primary:
      "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-sm focus:ring-blue-400 px-5 py-2.5",
    secondary:
      "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm focus:ring-slate-300 px-5 py-2.5",
    ghost:
      "text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 focus:ring-blue-300 px-4 py-2",
  };
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) return <a href={href} className={cls} {...props}>{children}</a>;
  return <button className={cls} {...props}>{children}</button>;
}

// ─── FeatureCard ──────────────────────────────────────────────────────────────
export function FeatureCard({ icon, title, description, accent = "blue" }) {
  const accents = {
    blue: "bg-blue-50 dark:bg-blue-950 text-blue-500",
    cyan: "bg-cyan-50 dark:bg-cyan-950 text-cyan-500",
    violet: "bg-violet-50 dark:bg-violet-950 text-violet-500",
    green: "bg-green-50 dark:bg-green-950 text-green-500",
    amber: "bg-amber-50 dark:bg-amber-950 text-amber-500",
    rose: "bg-rose-50 dark:bg-rose-950 text-rose-500",
  };
  return (
    <div className="group bg-white dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60 rounded-xl p-6 shadow-sm hover:shadow-md dark:hover:shadow-slate-900 transition-all duration-200 hover:-translate-y-0.5">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${accents[accent]}`}>
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white text-[15px] mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

// ─── StepCard ─────────────────────────────────────────────────────────────────
export function StepCard({ number, title, description, icon }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 p-6">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-100 dark:shadow-blue-900/40">
          {icon}
        </div>
        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold flex items-center justify-center shadow-sm">
          {number}
        </span>
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white text-[15px]">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[220px]">{description}</p>
    </div>
  );
}

// ─── SectionContainer ─────────────────────────────────────────────────────────
export function SectionContainer({ children, className = "", id }) {
  return (
    <section id={id} className={`w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </section>
  );
}

// ─── MockDashboardCard ────────────────────────────────────────────────────────
export function MockDashboardCard({ children, className = "" }) {
  return (
    <div className={`bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm p-4 ${className}`}>
      {children}
    </div>
  );
}
