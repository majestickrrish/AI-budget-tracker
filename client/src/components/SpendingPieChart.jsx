import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SpendingPieChart = ({ data = [] }) => {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-card border border-border-default rounded-2xl p-6 h-full flex flex-col">
      <h3 className="text-text-default font-semibold text-base mb-5">Spending by Category</h3>
      
      {hasData ? (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span className="text-text-secondary text-xs">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
          <div className="w-12 h-12 rounded-2xl bg-background border border-border-default flex items-center justify-center mb-4 opacity-40">
            📊
          </div>
          <p className="text-sm font-semibold text-text-default">No breakdown available</p>
          <p className="text-xs text-text-secondary mt-1">Start adding expenses to see insights</p>
        </div>
      )}
    </div>
  );
};

export default SpendingPieChart;
