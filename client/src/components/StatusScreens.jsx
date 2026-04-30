import { Loader2, RefreshCw, AlertCircle, WifiOff } from 'lucide-react';

/**
 * Branded Full-Page Loader
 * Used for initial app load and major route transitions
 */
export const LoadingScreen = ({ message = 'Initializing AI Budget Tracker...' }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="relative mb-8">
        {/* Animated Glow Effect */}
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
        
        {/* Branded Icon Container */}
        <div className="relative w-20 h-20 bg-card border border-border-default rounded-3xl flex items-center justify-center shadow-2xl">
          <Loader2 size={40} className="text-primary animate-spin" strokeWidth={2.5} />
        </div>
      </div>

      <h2 className="text-xl font-black text-text-default mb-2 tracking-tight">
        Just a moment
      </h2>
      <p className="text-sm text-text-secondary opacity-70 max-w-[240px] leading-relaxed">
        {message}
      </p>

      {/* Subtle Progress Bar */}
      <div className="mt-10 w-48 h-1 bg-border-default rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-progress-indeterminate" />
      </div>
    </div>
  );
};

/**
 * Professional Error/System Failure Screen
 */
export const ErrorScreen = ({ 
  type = 'general', 
  error, 
  resetAction = () => window.location.reload() 
}) => {
  const configs = {
    network: {
      icon: WifiOff,
      title: 'Connection Lost',
      message: 'It seems you are offline. Please check your internet connection.',
      accent: 'text-warning',
      bg: 'bg-warning/10'
    },
    server: {
      icon: AlertCircle,
      title: 'System Unavailable',
      message: 'Our servers are taking a short break. We’ll be back up in a moment.',
      accent: 'text-danger',
      bg: 'bg-danger/10'
    },
    general: {
      icon: RefreshCw,
      title: 'Something went wrong',
      message: 'An unexpected error occurred while processing your request.',
      accent: 'text-primary',
      bg: 'bg-primary/10'
    }
  };

  const config = configs[type] || configs.general;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-300">
      <div className={`w-20 h-20 ${config.bg} rounded-3xl flex items-center justify-center mb-6`}>
        <Icon size={36} className={config.accent} />
      </div>

      <h1 className="text-2xl font-black text-text-default mb-3">{config.title}</h1>
      <p className="text-sm text-text-secondary max-w-sm mb-10 leading-relaxed opacity-80">
        {error?.message || config.message}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={resetAction}
          className="flex-1 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} /> Try Again
        </button>
        <button
          onClick={() => window.history.back()}
          className="flex-1 py-3.5 bg-card border border-border-default hover:border-text-secondary text-text-default font-bold rounded-xl text-sm transition-all"
        >
          Go Back
        </button>
      </div>

      <p className="mt-12 text-[10px] text-text-secondary uppercase tracking-widest font-bold opacity-30">
        Error Code: {type.toUpperCase()}_{Date.now().toString(36).toUpperCase()}
      </p>
    </div>
  );
};
