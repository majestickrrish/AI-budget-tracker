import { useState, useEffect } from "react";
import ThemeToggle from "../common/ThemeToggle";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Platform", href: "#dashboard-preview" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border-default shadow-sm"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                <path d="M3 14L7 9L10 12L14 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="14" cy="5" r="1.5" fill="white" />
              </svg>
            </div>
            <span className="font-black text-text-default tracking-tighter text-lg whitespace-nowrap">
              AI Budget<span className="text-primary">Tracker</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-bold text-text-secondary hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-5">
            <ThemeToggle />
            <a
              href="/login"
              className="text-sm font-bold text-text-secondary hover:text-primary transition-colors duration-200"
            >
              Login
            </a>
            <a
              href="/register"
              className="text-sm font-black bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95"
            >
              Get Started
            </a>
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded-xl text-text-secondary hover:bg-background transition-colors duration-200"
            >
              {menuOpen ? (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-8 border-t border-border-default mt-2 pt-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-base font-bold text-text-default hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <div className="h-px bg-border-default my-2" />
            <a
              href="/login"
              className="text-base font-bold text-text-default hover:text-primary transition-colors duration-200"
            >
              Login
            </a>
            <a
              href="/register"
              className="w-full text-center text-base font-black bg-primary hover:bg-primary-hover text-white px-5 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20"
            >
              Get Started Free
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
