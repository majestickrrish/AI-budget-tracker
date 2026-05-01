import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = "", variant = "icon" }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    
    // Dispatch a custom event so other instances of ThemeToggle can sync
    window.dispatchEvent(new Event('theme-changed'));
  }, [theme]);

  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem('theme') || 'dark';
      if (newTheme !== theme) setTheme(newTheme);
    };
    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  if (variant === "sidebar") {
    return (
      <button
        onClick={toggleTheme}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-default transition-all ${className}`}
      >
        <span>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</span>
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`p-2.5 rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary hover:text-text-default flex items-center justify-center ${className}`}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;
