// ─── OnboardingPage.jsx ──────────────────────────────────────────────────────
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Target, Receipt, ChevronRight, ChevronLeft, Check, Plus, X, Zap, Calendar, Home, Wifi, Smartphone, ShieldCheck, Dumbbell, Brain, LogOut } from 'lucide-react';
import { getUser, setCredentials, logout } from '../utils/auth';
import { updateProfile } from '../services/api';

const FIXED_EXPENSE_SUGGESTIONS = [
    { label: 'Rent / EMI', icon: Home },
    { label: 'Internet', icon: Wifi },
    { label: 'Electricity', icon: Zap },
    { label: 'Subscriptions', icon: Smartphone },
    { label: 'Insurance', icon: ShieldCheck },
    { label: 'Gym', icon: Dumbbell },
];

const inputCls =
    'w-full bg-background border border-border-default text-text-default placeholder-text-secondary/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-150 hover:border-text-secondary/30';

const OnboardingPage = () => {
    const navigate = useNavigate();
    const user = getUser();
    const [step, setStep] = useState(0); // 0=welcome, 1=budget, 2=fixed, 3=done
    const [monthlyBudget, setMonthlyBudget] = useState('');
    const [fixedExpenses, setFixedExpenses] = useState([]);
    const [newFixed, setNewFixed] = useState({ label: '', amount: '', dueDate: new Date().getDate().toString() });
    const [saving, setSaving] = useState(false);

    const totalFixed = fixedExpenses.reduce((s, e) => s + Number(e.amount), 0);
    const remaining = Number(monthlyBudget) - totalFixed;

    const addFixed = (label = newFixed.label, amount = newFixed.amount, dueDate = newFixed.dueDate) => {
        if (!label || !amount) return;
        setFixedExpenses((prev) => [...prev, { 
            id: Date.now(), 
            label, 
            amount: Number(amount),
            dueDate: Number(dueDate) || 1
        }]);
        setNewFixed({ label: '', amount: '', dueDate: new Date().getDate().toString() });
    };

    const removeFixed = (id) => setFixedExpenses((prev) => prev.filter((e) => e.id !== id));

    const handleFinish = async (isSkipped = false) => {
        setSaving(true);
        const onboardingData = {
            monthlyBudget: isSkipped ? 0 : Number(monthlyBudget),
            fixedExpenses: isSkipped ? [] : fixedExpenses.map(({ label, amount, dueDate }) => ({ label, amount, dueDate })),
            onboardingCompleted: true,
        };
        
        try {
            // Attempt to save to backend
            const res = await updateProfile(onboardingData);
            if (res.data?.data?.user) {
                // Update local auth state with new user data
                const token = localStorage.getItem('budget_tracker_token');
                setCredentials(token, res.data.data.user);
            }
        } catch (err) {
            console.error('Backend sync failed, falling back to localStorage:', err);
            // Fallback for current local dev if backend isn't ready
            const userId = user?._id || 'guest';
            localStorage.setItem(`onboarding_${userId}`, JSON.stringify(onboardingData));
        } finally {
            setSaving(false);
            navigate('/dashboard', { replace: true });
        }
    };

    const handleSkip = () => handleFinish(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const steps = [
        { label: 'Welcome', icon: Wallet },
        { label: 'Budget', icon: Target },
        { label: 'Fixed Costs', icon: Receipt },
        { label: 'Done', icon: Check },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10 relative">
            {/* Top Left Logout */}
            <div className="absolute top-6 left-6">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-card border border-border-default rounded-xl text-xs font-bold text-text-secondary hover:text-danger hover:border-danger/30 transition-all duration-200 shadow-sm"
                >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                </button>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-lg mb-8">
                <div className="flex items-center justify-between mb-3">
                    {steps.map((s, i) => {
                        const Icon = s.icon;
                        const done = i < step;
                        const active = i === step;
                        return (
                            <div key={s.label} className="flex flex-col items-center gap-1.5 flex-1 relative">
                                <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 z-10
                    ${done ? 'bg-success border-success text-white' : active ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 'bg-card border-border-default text-text-secondary'}`}
                                >
                                    {done ? <Check size={16} /> : <Icon size={16} />}
                                </div>
                                <span className={`text-[10px] font-semibold uppercase tracking-wide hidden sm:block ${active ? 'text-primary' : done ? 'text-success' : 'text-text-secondary opacity-60'}`}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div className="h-1 bg-border-default rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            <div className="w-full max-w-lg bg-card border border-border-default rounded-2xl shadow-2xl overflow-hidden">
                <div className="h-1 w-full bg-primary" />

                {step === 0 && (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-5 text-primary">
                            <Wallet size={28} />
                        </div>
                        <h1 className="text-2xl font-black text-text-default mb-2">
                            Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
                        </h1>
                        <p className="text-text-secondary text-sm leading-relaxed mb-2">
                            Let's set up your AI-powered financial dashboard in just a few steps.
                        </p>
                        <p className="text-text-secondary text-xs opacity-70 mb-8">
                            This helps our AI give you accurate insights and predictions.
                        </p>
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {[
                                { icon: Brain, title: 'AI Insights', desc: 'Smart analysis of your spending' },
                                { icon: Target, title: 'Budget Goals', desc: 'Set and track monthly targets' },
                                { icon: Zap, title: 'Auto Categories', desc: 'Expenses sorted automatically' },
                            ].map((f) => (
                                <div key={f.title} className="bg-background border border-border-default rounded-xl p-3 text-center">
                                    <div className="flex justify-center mb-1.5 text-primary">
                                        <f.icon size={20} />
                                    </div>
                                    <p className="text-xs font-bold text-text-default mb-0.5">{f.title}</p>
                                    <p className="text-[10px] text-text-secondary opacity-70 leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setStep(1)}
                            className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            Let's Get Started <ChevronRight size={16} />
                        </button>
                    </div>
                )}

                {step === 1 && (
                    <div className="p-8">
                        <div className="mb-6">
                            <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-4 text-primary">
                                <Target size={22} />
                            </div>
                            <h2 className="text-xl font-black text-text-default mb-1">Set Monthly Budget</h2>
                            <p className="text-text-secondary text-sm">
                                How much do you plan to spend in a month? This becomes your baseline.
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">
                                Monthly Budget (₹)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-semibold text-sm">₹</span>
                                <input
                                    type="number"
                                    value={monthlyBudget}
                                    onChange={(e) => setMonthlyBudget(e.target.value)}
                                    placeholder="e.g. 30000"
                                    min="1000"
                                    className={`${inputCls} pl-8`}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="mb-8">
                            <p className="text-xs text-text-secondary mb-2 font-semibold">Quick Select</p>
                            <div className="flex flex-wrap gap-2">
                                {[10000, 20000, 30000, 50000, 75000, 100000].map((amt) => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => setMonthlyBudget(amt.toString())}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150
                      ${monthlyBudget === amt.toString()
                                                 ? 'bg-primary border-primary text-white'
                                                 : 'bg-background border-border-default text-text-secondary hover:border-primary hover:text-primary'
                                            }`}
                                    >
                                        ₹{amt.toLocaleString('en-IN')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(0)}
                                className="px-4 py-3 border border-border-default rounded-xl text-sm font-semibold text-text-secondary hover:text-text-default hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-1.5"
                            >
                                <ChevronLeft size={15} /> Back
                            </button>
                            <button
                                onClick={() => { if (monthlyBudget && Number(monthlyBudget) > 0) setStep(2); }}
                                disabled={!monthlyBudget || Number(monthlyBudget) <= 0}
                                className="flex-1 py-3 bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm tracking-wide transition-all flex items-center justify-center gap-2"
                            >
                                Continue <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="p-8">
                        <div className="mb-5">
                            <div className="w-12 h-12 bg-warning/10 border border-warning/20 rounded-xl flex items-center justify-center mb-4 text-warning">
                                <Receipt size={22} />
                            </div>
                            <h2 className="text-xl font-black text-text-default mb-1">Fixed Monthly Costs</h2>
                            <p className="text-text-secondary text-sm">
                                Add recurring expenses so the AI can compute your true discretionary budget.
                            </p>
                        </div>

                        <div className="bg-background border border-border-default rounded-xl p-4 mb-5 grid grid-cols-3 gap-3 text-center">
                            <div>
                                <p className="text-[10px] text-text-secondary uppercase tracking-wide font-bold mb-0.5">Budget</p>
                                <p className="text-sm font-black text-text-default">₹{Number(monthlyBudget).toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-text-secondary uppercase tracking-wide font-bold mb-0.5">Fixed</p>
                                <p className="text-sm font-black text-danger">₹{totalFixed.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-text-secondary uppercase tracking-wide font-bold mb-0.5">Flexible</p>
                                <p className={`text-sm font-black ${remaining < 0 ? 'text-danger' : 'text-success'}`}>
                                    ₹{remaining.toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Quick Add</p>
                            <div className="flex flex-wrap gap-2">
                                {FIXED_EXPENSE_SUGGESTIONS.map((s) => {
                                    const Icon = s.icon;
                                    return (
                                        <button
                                            key={s.label}
                                            type="button"
                                            onClick={() => setNewFixed({ ...newFixed, label: s.label })}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                                              ${newFixed.label === s.label ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border-default text-text-secondary hover:border-primary hover:text-primary'}`}
                                        >
                                            <Icon size={12} /> {s.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-2 mb-4">
                            <div className="col-span-5">
                                <input
                                    type="text"
                                    value={newFixed.label}
                                    onChange={(e) => setNewFixed({ ...newFixed, label: e.target.value })}
                                    placeholder="Rent, WiFi..."
                                    className={inputCls}
                                />
                            </div>
                            <div className="col-span-4 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xs">₹</span>
                                <input
                                    type="number"
                                    value={newFixed.amount}
                                    onChange={(e) => setNewFixed({ ...newFixed, amount: e.target.value })}
                                    placeholder="Amount"
                                    className={`${inputCls} pl-7`}
                                />
                            </div>
                            <div className="col-span-2 relative">
                                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                                <input
                                    type="number"
                                    value={newFixed.dueDate}
                                    onChange={(e) => setNewFixed({ ...newFixed, dueDate: e.target.value })}
                                    placeholder="Day"
                                    min="1" max="31"
                                    className={`${inputCls} pl-8 text-center`}
                                    title="Due date (Day of month)"
                                />
                            </div>
                            <div className="col-span-1">
                                <button
                                    type="button"
                                    onClick={() => addFixed()}
                                    disabled={!newFixed.label || !newFixed.amount}
                                    className="w-full h-full rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-white flex items-center justify-center transition-all"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        {fixedExpenses.length > 0 && (
                            <div className="space-y-2 mb-5 max-h-36 overflow-y-auto pr-1">
                                {fixedExpenses.map((fe) => (
                                    <div key={fe.id} className="flex items-center justify-between bg-background border border-border-default rounded-xl px-4 py-2.5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-text-default">{fe.label}</span>
                                            <span className="text-[10px] text-text-secondary">Due: Day {fe.dueDate}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-danger tabular-nums">
                                                −₹{Number(fe.amount).toLocaleString('en-IN')}
                                            </span>
                                            <button
                                                onClick={() => removeFixed(fe.id)}
                                                className="w-5 h-5 rounded-full bg-danger/10 text-danger flex items-center justify-center hover:bg-danger/20 transition-colors"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="px-4 py-3 border border-border-default rounded-xl text-sm font-semibold text-text-secondary hover:text-text-default hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-1.5"
                            >
                                <ChevronLeft size={15} /> Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-sm tracking-wide transition-all flex items-center justify-center gap-2"
                            >
                                Continue <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-success/10 border border-success/20 rounded-full flex items-center justify-center mx-auto mb-5 text-success">
                            <Check size={28} />
                        </div>
                        <h2 className="text-2xl font-black text-text-default mb-2">You're all set!</h2>
                        <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                            Your AI financial assistant is ready. Here's a summary of your setup:
                        </p>

                        <div className="bg-background border border-border-default rounded-xl divide-y divide-border-default mb-8 text-left">
                            <div className="flex items-center justify-between px-5 py-3.5">
                                <span className="text-sm text-text-secondary">Monthly Budget</span>
                                <span className="text-sm font-bold text-text-default">₹{Number(monthlyBudget).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex items-center justify-between px-5 py-3.5">
                                <span className="text-sm text-text-secondary">Fixed Costs</span>
                                <span className="text-sm font-bold text-danger">₹{totalFixed.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex items-center justify-between px-5 py-3.5">
                                <span className="text-sm text-text-secondary">Discretionary Budget</span>
                                <span className={`text-sm font-bold ${remaining < 0 ? 'text-danger' : 'text-success'}`}>
                                    ₹{remaining.toLocaleString('en-IN')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between px-5 py-3.5">
                                <span className="text-sm text-text-secondary">Fixed Expenses Added</span>
                                <span className="text-sm font-bold text-text-default">{fixedExpenses.length}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 justify-center text-xs text-primary mb-6 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
                            <Zap size={13} />
                            AI will now use this data to provide personalized insights
                        </div>

                        <button
                            onClick={handleFinish}
                            disabled={saving}
                            className="w-full py-3.5 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-bold rounded-xl text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving…
                                </>
                            ) : (
                                <>Go to Dashboard <ChevronRight size={16} /></>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {step < 3 && (
                <button
                    onClick={handleSkip}
                    disabled={saving}
                    className="mt-5 text-xs text-text-secondary hover:text-text-default opacity-60 hover:opacity-100 transition-all disabled:opacity-30"
                >
                    {saving ? 'Saving...' : 'Skip for now →'}
                </button>
            )}
        </div>
    );
};

export default OnboardingPage;