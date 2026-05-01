export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-card">
      <div className="max-w-5xl mx-auto px-8 sm:px-12 lg:px-16 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
                  <path d="M3 14L7 9L10 12L14 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="14" cy="5" r="1.5" fill="white" />
                </svg>
              </div>
              <span className="font-black text-text-default text-xl tracking-tighter">
                AI Budget<span className="text-primary">Tracker</span>
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm opacity-80">
              The AI-powered finance assistant that helps you track, predict, and optimize your spending — automatically and securely.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-6 opacity-60">Product</p>
            <ul className="space-y-4">
              {[
                { label: "Features", href: "#features" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Dashboard", href: "#dashboard-preview" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-text-secondary hover:text-primary transition-colors duration-200 font-medium">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-6 opacity-60">Account</p>
            <ul className="space-y-4">
              {[
                { label: "Login", href: "/login" },
                { label: "Register", href: "/register" },
                { label: "Contact Support", href: "mailto:hello@aibudgettracker.com" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-text-secondary hover:text-primary transition-colors duration-200 font-medium flex items-center gap-2"
                  >
                    {link.label}
                    {link.external && (
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M2 8L8 2M5 2h3v3" />
                      </svg>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border-default pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-text-secondary opacity-60 font-medium">
            © {year} AI BudgetTracker. Built with intelligence.
          </p>
          <div className="flex items-center gap-8">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <a key={item} href="#" className="text-xs text-text-secondary opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200 font-medium">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
