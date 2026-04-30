import { useState, useEffect } from 'react';
import { Calendar, Bell, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { getUser } from '../utils/auth';

const RemindersBar = () => {
  const user = getUser();
  const userId = user?._id || 'guest';
  
  // For now, we fetch from localStorage as a fallback until the backend teammate adds the profile API
  const [onboarding, setOnboarding] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`onboarding_${userId}`)) || null;
    } catch {
      return null;
    }
  });

  const fixedExpenses = onboarding?.fixedExpenses || [];
  
  if (fixedExpenses.length === 0) return null;

  const today = new Date().getDate();
  
  // Sort expenses by closeness to today
  const sortedExpenses = [...fixedExpenses].sort((a, b) => {
    const dayA = a.dueDate || 1;
    const dayB = b.dueDate || 1;
    return dayA - dayB;
  });

  return (
    <div className="bg-card border border-border-default rounded-2xl overflow-hidden shadow-sm h-fit">
      <div className="px-5 py-4 border-b border-border-default bg-primary/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-primary" />
          <h3 className="text-sm font-bold text-text-default">Bill Reminders</h3>
        </div>
        <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
          Monthly
        </span>
      </div>
      
      <div className="p-2 space-y-1">
        {sortedExpenses.map((expense, idx) => {
          const dueDate = expense.dueDate || 1;
          const isOverdue = today > dueDate;
          const isToday = today === dueDate;
          const isUpcoming = dueDate > today && dueDate <= today + 5;

          return (
            <div 
              key={`${expense.label}-${idx}`} 
              className={`flex items-center justify-between p-3 rounded-xl transition-all hover:bg-background group ${
                isToday ? 'bg-warning/5 border border-warning/20' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isOverdue ? 'bg-danger/10 text-danger' : 
                  isToday ? 'bg-warning/10 text-warning' : 
                  'bg-success/10 text-success'
                }`}>
                  <Calendar size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-default truncate w-24">
                    {expense.label}
                  </p>
                  <p className="text-[10px] text-text-secondary">
                    Due: Day {dueDate}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xs font-black text-text-default">
                  ₹{Number(expense.amount).toLocaleString('en-IN')}
                </p>
                {isToday ? (
                  <span className="text-[9px] font-bold text-warning uppercase">Due Today</span>
                ) : isOverdue ? (
                  <span className="text-[9px] font-bold text-danger uppercase">Overdue</span>
                ) : isUpcoming ? (
                  <span className="text-[9px] font-bold text-primary uppercase">Soon</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full py-3 px-4 text-[11px] font-bold text-text-secondary hover:text-primary transition-colors flex items-center justify-center gap-1 border-t border-border-default opacity-60">
        Manage Subscriptions <ChevronRight size={12} />
      </button>
    </div>
  );
};

export default RemindersBar;
