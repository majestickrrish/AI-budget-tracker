// ─── Layout.jsx ──────────────────────────────────────────────────────────────
import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { logout, getUser } from '../../utils/auth';
import ThemeToggle from '../common/ThemeToggle';
import { Wallet, LayoutDashboard, ReceiptText, Bot, LogOut, X, Target, ChevronRight } from 'lucide-react';

import FloatingReminders from '../reminders/FloatingReminders';

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/expenses', icon: <ReceiptText size={18} />, label: 'Expenses' },
  { to: '/insights', icon: <Bot size={18} />, label: 'AI Insights' },
  { to: '/goals', icon: <Target size={18} />, label: 'Goals' },
];

// ─── SidebarContent (Moved outside to prevent re-mounting) ───────────────────
const SidebarContent = ({ user, closeSidebar, handleLogout }) => (
  <div className="flex flex-col h-full overflow-hidden">
    {/* Logo */}
    <div className="px-5 py-5 border-b border-border-default shrink-0">
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
        <button
          onClick={closeSidebar}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-default hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>
      </div>
    </div>

    {/* User Info (Clickable) */}
    <div className="px-3 py-4 border-b border-border-default shrink-0">
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex items-center gap-3 p-2 rounded-xl transition-all duration-150 group relative ${
            isActive ? 'bg-primary/5' : 'hover:bg-black/5 dark:hover:bg-white/5'
          }`
        }
        onClick={closeSidebar}
      >
        <div className="relative">
          <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary text-xs font-bold uppercase shrink-0 group-hover:scale-105 transition-transform">
            {user?.name?.[0] || 'U'}
          </div>
          {(() => {
            const userId = user?._id || 'guest';
            const onboarding = JSON.parse(localStorage.getItem(`onboarding_${userId}`) || '{}');
            if (!onboarding.monthlyBudget || onboarding.monthlyBudget === 0) {
              return (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-danger border-2 border-card rounded-full" />
              );
            }
            return null;
          })()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-text-default capitalize truncate leading-tight group-hover:text-primary transition-colors">
              {user?.name || 'User'}
            </p>
            {(() => {
              const userId = user?._id || 'guest';
              const onboarding = JSON.parse(localStorage.getItem(`onboarding_${userId}`) || '{}');
              if (!onboarding.monthlyBudget || onboarding.monthlyBudget === 0) {
                return (
                  <span className="text-[8px] font-black bg-danger/10 text-danger px-1.5 py-0.5 rounded uppercase tracking-tighter shrink-0">
                    Incomplete
                  </span>
                );
              }
              return null;
            })()}
          </div>
          <p className="text-[10px] text-text-secondary truncate mt-0.5 opacity-70 font-medium">Account Settings</p>
        </div>
        <ChevronRight size={14} className="text-text-secondary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0" />
      </NavLink>
    </div>

    {/* Nav Links */}
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest px-3 pb-2 opacity-60">
        Menu
      </p>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={closeSidebar}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-default'
            }`
          }
        >
          <span className="flex items-center justify-center w-5 shrink-0">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>

    {/* Footer: Theme & Logout */}
    <div className="px-3 pb-5 pt-2 border-t border-border-default space-y-0.5 shrink-0">
      <ThemeToggle variant="sidebar" />
      <button
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

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-background flex overflow-x-hidden">
      {/* Mobile Overlay (Ensure it's strictly hidden on lg+) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[9998] lg:hidden" 
          onClick={closeSidebar} 
        />
      )}

      {/* Sidebar (Top Layer - Ultimate Z-Index) */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-card border-r border-border-default flex flex-col z-[9999]
          transition-transform duration-300 ease-out shadow-xl lg:shadow-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <SidebarContent 
          user={user} 
          closeSidebar={closeSidebar} 
          handleLogout={handleLogout} 
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 relative z-10">
        
        {/* Mobile Header (Visible on small screens) */}
        <header className="lg:hidden sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border-default px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-background border border-border-default hover:border-primary/30 transition-all shadow-sm"
              aria-label="Open menu"
            >
              <span className="w-5 h-0.5 bg-text-default rounded-full" />
              <span className="w-5 h-0.5 bg-text-default rounded-full" />
              <span className="w-4 h-0.5 bg-text-default rounded-full self-start ml-2.5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm shrink-0">
                <Wallet size={15} />
              </div>
              <p className="text-text-default font-black text-sm tracking-tight">AI Budget</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {/* Dynamic Layout Wrapper */}
        <div className="flex-1 min-w-0">
          {/* Central Main Page Content (Keyed by Path) */}
          <main key={location.pathname} className="h-full p-4 sm:p-6 lg:p-8 xl:p-10 min-w-0 animate-in fade-in duration-300">
            {children}
          </main>
        </div>

        {/* Floating Components */}
        <FloatingReminders />
      </div>
    </div>
  );
};

export default Layout;
