import { useState, useRef, useEffect } from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 3 }, (_, i) => 2024 + i); // Match Dashboard range

const FilterDropdown = ({ value, options, onChange, type = 'month' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const click = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', click);
    return () => document.removeEventListener('mousedown', click);
  }, []);

  const selectedLabel = type === 'month' 
    ? new Date(2000, value - 1).toLocaleString('en-IN', { month: 'short' })
    : value;

  return (
    <div className="relative" ref={ref}>
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          open ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-text-default hover:bg-card'
        }`}
      >
        {selectedLabel}
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-32 bg-card border border-border-default rounded-xl shadow-2xl z-[100] py-1 animate-in fade-in slide-in-from-top-2">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                opt.value === value ? 'bg-primary/10 text-primary font-bold' : 'text-text-default hover:bg-background'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ExpenseFilters = ({ month, year, onMonthChange, onYearChange }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 bg-background border border-border-default p-1 rounded-xl shadow-sm">
        <FilterDropdown 
          value={month} 
          options={MONTHS}
          onChange={onMonthChange}
          type="month"
        />
        <div className="w-px h-4 bg-border-default mx-1" />
        <FilterDropdown 
          value={year} 
          options={YEARS.map(y => ({ value: y, label: y.toString() }))}
          onChange={onYearChange}
          type="year"
        />
      </div>
    </div>
  );
};

export default ExpenseFilters;
