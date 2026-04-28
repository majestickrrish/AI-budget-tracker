import { CalendarDays } from 'lucide-react';

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

// Show a rolling window of years: 3 years back → current year
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 4 }, (_, i) => currentYear - 3 + i);

const ExpenseFilters = ({ month, year, onMonthChange, onYearChange }) => {
    return (
        <div className="flex items-center gap-3 mb-6">
            <CalendarDays size={16} className="text-text-secondary shrink-0" />
            <span className="text-xs font-medium text-text-secondary shrink-0">Viewing:</span>

            <select
                id="filter-month"
                value={month}
                onChange={(e) => onMonthChange(Number(e.target.value))}
                className="bg-background border border-border-default text-text-default rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            >
                {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>
                        {m.label}
                    </option>
                ))}
            </select>

            <select
                id="filter-year"
                value={year}
                onChange={(e) => onYearChange(Number(e.target.value))}
                className="bg-background border border-border-default text-text-default rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            >
                {YEARS.map((y) => (
                    <option key={y} value={y}>
                        {y}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ExpenseFilters;