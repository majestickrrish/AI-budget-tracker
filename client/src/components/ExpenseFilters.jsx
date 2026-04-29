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
const YEARS = Array.from({ length: 4 }, (_, i) => currentYear - 3 + i);

const CustomDropdown = ({ label, value, options, onChange, width = 'w-40' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value || o === value)?.label || value;

  return (
    <div className={`relative ${width}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-card border border-border-default hover:border-primary text-text-default rounded-xl px-4 py-2 text-sm font-medium transition-all shadow-sm"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-card border border-border-default rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-48 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-border-default">
            {options.map((opt) => {
              const val = opt.value !== undefined ? opt.value : opt;
              const lab = opt.label !== undefined ? opt.label : opt;
              const isSelected = val === value;

              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    onChange(val);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    isSelected 
                      ? 'bg-primary text-white font-bold' 
                      : 'text-text-default hover:bg-background'
                  }`}
                >
                  {lab}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const ExpenseFilters = ({ month, year, onMonthChange, onYearChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
          <CalendarDays size={16} />
        </div>
        <span className="text-xs font-bold text-text-secondary uppercase tracking-widest shrink-0">Viewing Period</span>
      </div>

      <div className="flex items-center gap-2">
        <CustomDropdown
          label="Month"
          value={month}
          options={MONTHS}
          onChange={onMonthChange}
          width="w-44"
        />
        <CustomDropdown
          label="Year"
          value={year}
          options={YEARS.map(y => ({ value: y, label: y.toString() }))}
          onChange={onYearChange}
          width="w-32"
        />
      </div>
    </div>
  );
};

export default ExpenseFilters;