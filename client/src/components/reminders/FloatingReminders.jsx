import { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import RemindersBar from './RemindersBar';
import { getUser } from '../../utils/auth';

const FloatingReminders = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = getUser();
  const userId = user?._id || 'guest';
  const panelRef = useRef(null);
  
  // Fetch onboarding data to check if we should show the FAB and if we need a badge
  const [onboarding, setOnboarding] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`onboarding_${userId}`)) || null;
    } catch {
      return null;
    }
  });

  const fixedExpenses = onboarding?.fixedExpenses || [];
  
  // Only show FAB if there are fixed expenses
  if (fixedExpenses.length === 0) return null;

  const today = new Date().getDate();
  const hasAlerts = fixedExpenses.some(exp => (exp.dueDate || 1) <= today);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target) && !event.target.closest('#reminders-fab')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
      {/* Panel */}
      <div 
        ref={panelRef}
        className={`
          mb-4 w-[320px] max-w-[calc(100vw-3rem)] transform transition-all duration-300 ease-out origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'}
          ring-1 ring-primary/20 shadow-[0_20px_70px_-10px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden backdrop-blur-xl
        `}
      >
        <RemindersBar onClose={() => setIsOpen(false)} />
      </div>

      {/* FAB */}
      <button
        id="reminders-fab"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95
          ${isOpen ? 'bg-text-default text-card' : 'bg-primary text-white'}
          pointer-events-auto
        `}
        aria-label="Toggle bill reminders"
      >
        {isOpen ? <X size={24} /> : <Bell size={24} />}
        
        {/* Pulse effect if alerts exist */}
        {!isOpen && hasAlerts && (
          <>
            <span className="absolute top-0 right-0 w-4 h-4 bg-danger rounded-full border-2 border-background animate-bounce" />
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-danger/30 rounded-full animate-ping" />
          </>
        )}
      </button>
    </div>
  );
};

export default FloatingReminders;
