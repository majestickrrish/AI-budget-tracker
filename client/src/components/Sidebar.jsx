import { NavLink, useNavigate } from 'react-router-dom';
import { logout, getUser } from '../utils/auth';

const navItems = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/expenses', icon: '💸', label: 'Expenses' },
  { to: '/insights', icon: '🤖', label: 'AI Insights' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col shadow-2xl z-50">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg">
            💰
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">AI Budget</p>
            <p className="text-xs text-indigo-400 font-medium">Tracker</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold uppercase">
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <p className="text-sm font-semibold text-white capitalize">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 truncate max-w-[120px]">{user?.email || ''}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-6">
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
