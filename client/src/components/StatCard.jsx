const StatCard = ({ icon, label, value, sub, accent = 'primary' }) => {
  const accentMap = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
  };

  return (
    <div className="bg-card border border-border-default rounded-2xl p-6 flex items-start gap-4 hover:border-text-secondary transition-all hover:shadow-lg">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${accentMap[accent]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-secondary font-medium mb-1">{label}</p>
        <p className="text-2xl font-bold= text-text-default truncate">{value}</p>
        {sub && <p className="text-xs text-text-secondary mt-1 opacity-80">{sub}</p>}
      </div>
    </div>
  );
};

export default StatCard;
