import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout, getUser } from '../utils/auth';
import ThemeToggle from './ThemeToggle';
import { Wallet, LayoutDashboard, ReceiptText, Bot, LogOut, X } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/expenses', icon: <ReceiptText size={18} />, label: 'Expenses' },
  { to: '/insights', icon: <Bot size={18} />, label: 'AI Insights' },
];

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const user = getUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border-default">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm shrink-0">
              <Wallet size={16} />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-text-default">AI Budget</p>
              <p className="text-[11px] text-primary font-semibold tracking-wide">TRACKER</p>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={closeSidebar}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-default hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="px-5 py-4 border-b border-border-default">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary text-xs font-bold uppercase shrink-0">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-default capitalize truncate leading-tight">
              {user?.name || 'User'}
            </p>
            <p className="text-[11px] text-text-secondary truncate mt-0.5">{user?.email || ''}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest px-3 pb-2 opacity-60">
          Menu
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-default'
              }`
            }
          >
            <span className="flex items-center justify-center w-5 shrink-0">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Theme Toggle & Logout */}
      <div className="px-3 pb-5 pt-2 border-t border-border-default space-y-0.5">
        <ThemeToggle variant="sidebar" />
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-danger/10 hover:text-danger transition-all duration-150"
        >
          <span className="flex items-center justify-center w-5 shrink-0">
            <LogOut size={16} />
          </span>
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-60 bg-card border-r border-border-default flex flex-col z-50
          transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-60">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-card border-b border-border-default px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              id="hamburger-btn"
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Open menu"
            >
              <span className="w-[18px] h-0.5 bg-text-secondary rounded-full" />
              <span className="w-[18px] h-0.5 bg-text-secondary rounded-full" />
              <span className="w-[14px] h-0.5 bg-text-secondary rounded-full self-start ml-[2px]" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
                <Wallet size={14} />
              </div>
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