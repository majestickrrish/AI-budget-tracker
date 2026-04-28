const StatCard = ({ icon, label, value, sub, accent = 'indigo' }) => {
  const accentMap = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 flex items-start gap-4 hover:border-gray-600 transition-all duration-200 hover:shadow-lg hover:shadow-black/20">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${accentMap[accent]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-400 font-medium mb-1">{label}</p>
        <p className="text-2xl font-bold text-white truncate">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
};

export default StatCard;
