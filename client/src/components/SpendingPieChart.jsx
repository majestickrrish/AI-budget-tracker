import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { categoryPieData } from '../data/dummyData';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-white font-semibold">{payload[0].name}</p>
        <p className="text-indigo-400 font-bold">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const SpendingPieChart = () => (
  <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
    <h3 className="text-white font-semibold text-base mb-5">Spending by Category</h3>
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={categoryPieData}
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={95}
          paddingAngle={4}
          dataKey="value"
        >
          {categoryPieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span className="text-gray-400 text-xs">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default SpendingPieChart;
