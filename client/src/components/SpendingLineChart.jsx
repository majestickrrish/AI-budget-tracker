import {
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';

const SpendingLineChart = ({ data = [] }) => {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-card border border-border-default rounded-2xl p-6 h-full flex flex-col">
      <h3 className="text-text-default font-semibold text-base mb-5">Monthly Spending Trend</h3>
      
      {hasData ? (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D85A30" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D85A30" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#73726c', fontSize: 12 }} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis
              tick={{ fill: '#73726c', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="spending"
              stroke="#D85A30"
              strokeWidth={2.5}
              fill="url(#spendingGradient)"
              dot={{ fill: '#D85A30', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#D85A30' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
          <div className="w-12 h-12 rounded-2xl bg-background border border-border-default flex items-center justify-center mb-4 opacity-40">
            📈
          </div>
          <p className="text-sm font-semibold text-text-default">No trend data</p>
          <p className="text-xs text-text-secondary mt-1">Data will accumulate as you log expenses</p>
        </div>
      )}
    </div>
  );
};

export default SpendingLineChart;
