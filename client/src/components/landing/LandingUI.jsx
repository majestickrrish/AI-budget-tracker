// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({ children, variant = "primary", href, className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-background text-sm tracking-wide";
  const variants = {
    primary:
      "bg-primary hover:bg-primary-hover active:scale-[0.98] text-white shadow-lg shadow-primary/20 px-6 py-3",
    secondary:
      "bg-card hover:bg-background text-text-default border border-border-default shadow-sm px-6 py-3",
    ghost:
      "text-primary hover:bg-primary/5 px-4 py-2",
  };
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) return <a href={href} className={cls} {...props}>{children}</a>;
  return <button className={cls} {...props}>{children}</button>;
}

// ─── FeatureCard ──────────────────────────────────────────────────────────────
export function FeatureCard({ icon, title, description, accent = "blue" }) {
  const accents = {
    blue: "bg-primary/10 text-primary",
    cyan: "bg-cyan-500/10 text-cyan-500",
    violet: "bg-purple-500/10 text-purple-500",
    green: "bg-success/10 text-success",
    amber: "bg-warning/10 text-warning",
    rose: "bg-danger/10 text-danger",
  };
  return (
    <div className="group bg-card border border-border-default rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 ${accents[accent]}`}>
        {icon}
      </div>
      <h3 className="font-bold text-text-default text-base mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed opacity-80">{description}</p>
    </div>
  );
}

// ─── StepCard ─────────────────────────────────────────────────────────────────
export function StepCard({ number, title, description, icon }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 p-6 group">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-xl shadow-primary/20 group-hover:rotate-3 transition-transform">
          {icon}
        </div>
        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-text-default text-background text-[11px] font-black flex items-center justify-center shadow-lg border-2 border-background">
          {number}
        </span>
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-text-default text-base">{title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed max-w-[220px] opacity-80">{description}</p>
      </div>
    </div>
  );
}

// ─── SectionContainer ─────────────────────────────────────────────────────────
export function SectionContainer({ children, className = "", id }) {
  return (
    <section id={id} className={`w-full max-w-5xl mx-auto px-4 sm:px-10 lg:px-16 ${className}`}>
      {children}
    </section>
  );
}

// ─── MockDashboardCard ────────────────────────────────────────────────────────
export function MockDashboardCard({ children, className = "" }) {
  return (
    <div className={`bg-card border border-border-default rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow ${className}`}>
      {children}
    </div>
  );
}
