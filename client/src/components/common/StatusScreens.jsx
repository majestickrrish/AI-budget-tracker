import { Loader2, RefreshCw, AlertCircle, WifiOff, Home } from 'lucide-react';

/**
 * Branded Full-Page Loader
 * Used for initial app load and major route transitions
 */
export const LoadingScreen = ({ message = 'Initializing AI Budget Tracker...' }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none animate-pulse" />
      
      <div className="relative mb-8 animate-in fade-in zoom-in-95 duration-500">
        {/* Branded Icon Container */}
        <div className="w-20 h-20 bg-card border border-border-default rounded-3xl flex items-center justify-center shadow-2xl">
          <Loader2 size={40} className="text-primary animate-spin" strokeWidth={2.5} />
        </div>
      </div>

      <div className="relative space-y-2 animate-in slide-in-from-bottom-2 duration-500 delay-100 px-4">
        <h2 className="text-xl font-black text-text-default tracking-tight">
          Just a moment
        </h2>
        <p className="text-sm font-bold text-text-secondary opacity-70 uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed">
          {message}
        </p>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-border-default/20">
        <div className="h-full bg-primary animate-progress-indeterminate shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
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
      message: 'Your device is offline. Please check your internet and try again.',
      accent: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/20'
    },
    server: {
      icon: AlertCircle,
      title: 'Maintenance',
      message: 'Our systems are receiving a quick update. We’ll be back online shortly.',
      accent: 'text-danger',
      bg: 'bg-danger/10',
      border: 'border-danger/20'
    },
    general: {
      icon: RefreshCw,
      title: 'Unexpected Glitch',
      message: 'Something went wrong while loading this page.',
      accent: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20'
    }
  };

  const config = configs[type] || configs.general;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Background Decor */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] ${config.bg.replace('/10', '/5')} rounded-full blur-[80px] sm:blur-[120px] pointer-events-none`} />

      <div className={`relative w-20 h-20 sm:w-24 sm:h-24 ${config.bg} ${config.border} border-2 rounded-3xl flex items-center justify-center mb-8 animate-in zoom-in-95 duration-300`}>
        <Icon size={36} className={`${config.accent} sm:hidden`} strokeWidth={2.5} />
        <Icon size={44} className={`${config.accent} hidden sm:block`} strokeWidth={2.5} />
      </div>

      <div className="relative max-w-xs sm:max-w-sm space-y-3 mb-10 animate-in slide-in-from-bottom-2 duration-500 delay-100">
        <h1 className="text-2xl sm:text-3xl font-black text-text-default tracking-tight leading-tight">
          {config.title}
        </h1>
        <p className="text-sm sm:text-base text-text-secondary font-medium leading-relaxed opacity-80 px-2">
          {error?.message || config.message}
        </p>
      </div>

      <div className="relative flex flex-col sm:flex-row gap-3 w-full max-w-[280px] sm:max-w-xs animate-in slide-in-from-bottom-2 duration-500 delay-200">
        <button
          onClick={resetAction}
          className="flex-1 py-3.5 sm:py-4 bg-primary hover:bg-primary-hover text-white font-black rounded-2xl text-sm transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 active:scale-95"
        >
          <RefreshCw size={18} strokeWidth={3} /> Try Again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="flex-1 py-3.5 sm:py-4 bg-card border border-border-default hover:border-primary hover:text-primary text-text-default font-black rounded-2xl text-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
        >
          <Home size={18} strokeWidth={2.5} /> Go Home
        </button>
      </div>

      <div className="absolute bottom-8 sm:bottom-12 animate-in fade-in duration-700 delay-500">
        <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black opacity-30">
          ID: {type.toUpperCase()}_{Date.now().toString(36).toUpperCase().slice(-6)}
        </p>
      </div>
    </div>
  );
};
