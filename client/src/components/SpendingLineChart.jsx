import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { monthlyTrendData } from '../data/dummyData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className="text-indigo-400 font-bold">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const SpendingLineChart = () => (
  <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
    <h3 className="text-white font-semibold text-base mb-5">Monthly Spending Trend</h3>
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={monthlyTrendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="spending"
          stroke="#6366f1"
          strokeWidth={2.5}
          fill="url(#spendingGradient)"
          dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: '#818cf8' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default SpendingLineChart;
