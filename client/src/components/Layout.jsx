import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout, getUser } from '../utils/auth';
import ThemeToggle from './ThemeToggle';

import { Wallet, LayoutDashboard, ReceiptText, Bot, LogOut } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/expenses', icon: <ReceiptText size={20} />, label: 'Expenses' },
  { to: '/insights', icon: <Bot size={20} />, label: 'AI Insights' },
];

/* ─── Layout ─────────────────────────────────────────────────────────────────
   Wraps all protected pages with a responsive sidebar.
   On mobile: sidebar is hidden behind a hamburger drawer.
   On desktop (lg+): sidebar is always visible on the left.
────────────────────────────────────────────────────────────────────────────── */
const Layout = ({ children }) => {
  const navigate = useNavigate();
  const user = getUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-border-default">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-text-default leading-tight">AI Budget</p>
              <p className="text-xs text-primary font-medium">Tracker</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-border-default">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold uppercase shrink-0">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-default capitalize truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-text-secondary truncate">{user?.email || ''}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-default'
              }`
            }
          >
            <span className="flex items-center justify-center">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Theme Toggle & Logout */}
      <div className="px-4 pb-6 space-y-1">
        <ThemeToggle variant="sidebar" />
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-danger/10 hover:text-danger transition-all"
        >
          <span><LogOut size={18} /></span>
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">

      {/* ── Mobile overlay backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar: desktop always visible, mobile drawer ── */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-card text-text-default flex flex-col shadow-2xl z-50
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <SidebarContent />
      </aside>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">

        {/* Mobile top bar with hamburger */}
        <header className="lg:hidden sticky top-0 z-30 bg-card border-b border-border-default px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              id="hamburger-btn"
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Open menu"
            >
              <span className="w-5 h-0.5 bg-text-secondary rounded" />
              <span className="w-5 h-0.5 bg-text-secondary rounded" />
              <span className="w-5 h-0.5 bg-text-secondary rounded" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white"><Wallet size={16} /></div>
              <p className="text-text-default font-bold text-sm">AI Budget Tracker</p>
            </div>
          </div>
          
          <ThemeToggle />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
