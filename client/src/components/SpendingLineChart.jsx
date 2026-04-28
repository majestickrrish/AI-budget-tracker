import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { monthlyTrendData } from '../data/dummyData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border-default rounded-xl px-4 py-3 shadow-xl">
        <p className="text-text-secondary text-xs mb-1">{label}</p>
        <p className="text-primary font-bold">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const SpendingLineChart = () => (
  <div className="bg-card border border-border-default rounded-2xl p-6">
    <h3 className="text-text-default font-semibold text-base mb-5">Monthly Spending Trend</h3>
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={monthlyTrendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="spending"
          stroke="var(--primary)"
          strokeWidth={2.5}
          fill="url(#spendingGradient)"
          dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: 'var(--primary-hover)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default SpendingLineChart;
