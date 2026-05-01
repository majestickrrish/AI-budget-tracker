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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled
          ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-sm group-hover:shadow-blue-200 dark:group-hover:shadow-blue-900 transition-shadow duration-200">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 14L7 9L10 12L14 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="14" cy="5" r="1.5" fill="white" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight text-[15px]">
              AI Budget<span className="text-blue-500">Tracker</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/login"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-150 px-3 py-1.5"
            >
              Login
            </a>
            <a
              href="/register"
              className="text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-150 shadow-sm"
            >
              Get Started Free
            </a>
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150"
            >
              {menuOpen ? (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4l12 12M16 4L4 16" />
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 6h14M3 10h14M3 14h14" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-100 dark:border-slate-800 mt-1 pt-3 flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-500 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/login"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150"
            >
              Login
            </a>
            <a
              href="/register"
              className="w-full text-center text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg transition-colors duration-150"
            >
              Get Started Free
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
