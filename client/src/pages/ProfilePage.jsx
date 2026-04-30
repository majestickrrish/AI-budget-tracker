// ─── ProfilePage.jsx ────────────────────────────────────────────────────────────
import { useState, useEffect, useMemo } from 'react';
import { User, Mail, Wallet, Receipt, Check, Save, AlertCircle, Plus, X, Calendar, ArrowLeft } from 'lucide-react';
import { getUser, setCredentials } from '../utils/auth';
import { updateProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';

const inputCls =
    'w-full bg-background border border-border-default text-text-default placeholder-text-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-150 hover:border-text-secondary/30';

const ProfilePage = () => {
    const navigate = useNavigate();
    const user = useMemo(() => getUser(), []);
    const userId = user?._id || 'guest';

    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        monthlyBudget: '',
        fixedExpenses: []
    });

    const [newFixed, setNewFixed] = useState({ label: '', amount: '', dueDate: '1' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Initial load from user object or fallback - run only on mount or if userId changes
    useEffect(() => {
        const onboarding = (() => {
            try { return JSON.parse(localStorage.getItem(`onboarding_${userId}`)) || {}; } 
            catch { return {}; }
        })();

        setForm({
            name: user?.name || '',
            email: user?.email || '',
            monthlyBudget: user?.monthlyBudget || onboarding.monthlyBudget || '',
            fixedExpenses: user?.fixedExpenses || onboarding.fixedExpenses || []
        });
    }, [userId, user?.name, user?.monthlyBudget]); // Stable dependencies

    const handleAddFixed = () => {
        if (!newFixed.label || !newFixed.amount) return;
        setForm(prev => ({
            ...prev,
            fixedExpenses: [...prev.fixedExpenses, { 
                id: Date.now(), 
                label: newFixed.label, 
                amount: Number(newFixed.amount),
                dueDate: Number(newFixed.dueDate) || 1
            }]
        }));
        setNewFixed({ label: '', amount: '', dueDate: '1' });
    };

    const handleRemoveFixed = (id) => {
        setForm(prev => ({
            ...prev,
            fixedExpenses: prev.fixedExpenses.filter(e => e.id !== id && e._id !== id)
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        const updateData = {
            name: form.name,
            monthlyBudget: Number(form.monthlyBudget),
            fixedExpenses: form.fixedExpenses.map(({ label, amount, dueDate }) => ({ label, amount, dueDate })),
            onboardingCompleted: true
        };

        try {
            const res = await updateProfile(updateData);
            if (res.data?.data?.user) {
                const token = localStorage.getItem('budget_tracker_token');
                setCredentials(token, res.data.data.user);
            }
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError('Failed to sync with server. Changes saved locally.');
            localStorage.setItem(`onboarding_${userId}`, JSON.stringify(updateData));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-xl bg-card border border-border-default flex items-center justify-center text-text-secondary hover:text-text-default hover:border-primary transition-all"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-text-default">Profile Settings</h1>
                        <p className="text-sm text-text-secondary">Manage your account and financial baseline</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Section: Account */}
                    <div className="bg-card border border-border-default rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-border-default bg-primary/5 flex items-center gap-2">
                            <User size={16} className="text-primary" />
                            <h3 className="text-sm font-bold text-text-default uppercase tracking-wider">Account Information</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Display Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary opacity-50" />
                                    <input 
                                        type="text" 
                                        value={form.name} 
                                        onChange={e => setForm({...form, name: e.target.value})}
                                        className={`${inputCls} pl-11`}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary opacity-50" />
                                    <input 
                                        type="email" 
                                        value={form.email} 
                                        disabled
                                        className={`${inputCls} pl-11 bg-background opacity-60 cursor-not-allowed`}
                                    />
                                </div>
                                <p className="text-[10px] text-text-secondary mt-2 italic">* Email cannot be changed for security</p>
                            </div>
                        </div>
                    </div>

                    {/* Section: Budget */}
                    <div className="bg-card border border-border-default rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-border-default bg-primary/5 flex items-center gap-2">
                            <Wallet size={16} className="text-primary" />
                            <h3 className="text-sm font-bold text-text-default uppercase tracking-wider">Financial Baseline</h3>
                        </div>
                        <div className="p-6">
                            <div className="max-w-xs">
                                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Monthly Budget (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-bold text-sm">₹</span>
                                    <input 
                                        type="number" 
                                        value={form.monthlyBudget} 
                                        onChange={e => setForm({...form, monthlyBudget: e.target.value})}
                                        className={`${inputCls} pl-8 text-lg font-bold`}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <p className="text-[11px] text-text-secondary mt-2">This is used to calculate your budget progress on the dashboard.</p>
                            </div>
                        </div>
                    </div>

                    {/* Section: Fixed Expenses */}
                    <div className="bg-card border border-border-default rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-border-default bg-primary/5 flex items-center gap-2">
                            <Receipt size={16} className="text-primary" />
                            <h3 className="text-sm font-bold text-text-default uppercase tracking-wider">Recurring Expenses</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-12 gap-2 mb-6 bg-background p-4 rounded-xl border border-border-default">
                                <div className="col-span-5">
                                    <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1.5 ml-1">Label</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Rent" 
                                        value={newFixed.label}
                                        onChange={e => setNewFixed({...newFixed, label: e.target.value})}
                                        className={inputCls} 
                                    />
                                </div>
                                <div className="col-span-4">
                                    <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1.5 ml-1">Amount (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xs">₹</span>
                                        <input 
                                            type="number" 
                                            placeholder="0" 
                                            value={newFixed.amount}
                                            onChange={e => setNewFixed({...newFixed, amount: e.target.value})}
                                            className={`${inputCls} pl-7`} 
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1.5 ml-1 text-center">Day</label>
                                    <div className="relative">
                                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary opacity-50" />
                                        <input 
                                            type="number" 
                                            min="1" max="31" 
                                            value={newFixed.dueDate}
                                            onChange={e => setNewFixed({...newFixed, dueDate: e.target.value})}
                                            className={`${inputCls} pl-8 text-center`} 
                                        />
                                    </div>
                                </div>
                                <div className="col-span-1 flex items-end">
                                    <button 
                                        type="button" 
                                        onClick={handleAddFixed}
                                        className="w-full h-[42px] rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-all shadow-sm"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {form.fixedExpenses.length > 0 ? (
                                    form.fixedExpenses.map((fe, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-background border border-border-default rounded-xl px-4 py-3 group hover:border-primary/30 transition-all">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-text-default">{fe.label}</span>
                                                <span className="text-[10px] text-text-secondary flex items-center gap-1 font-semibold uppercase tracking-wider">
                                                    <Calendar size={10} /> Due on Day {fe.dueDate}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-black text-danger">₹{Number(fe.amount).toLocaleString('en-IN')}</span>
                                                <button 
                                                    type="button"
                                                    onClick={() => handleRemoveFixed(fe.id || fe._id)}
                                                    className="w-7 h-7 rounded-lg bg-danger/10 text-danger flex items-center justify-center hover:bg-danger/20 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 border-2 border-dashed border-border-default rounded-2xl opacity-40">
                                        <p className="text-xs font-semibold text-text-secondary">No fixed expenses added yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer / Status */}
                    <div className="flex items-center justify-between pt-4 pb-10">
                        <div className="flex-1">
                            {error && (
                                <div className="flex items-center gap-2 text-danger text-xs font-bold animate-pulse">
                                    <AlertCircle size={14} /> {error}
                                </div>
                            )}
                            {success && (
                                <div className="flex items-center gap-2 text-success text-xs font-bold">
                                    <Check size={14} /> Profile updated successfully!
                                </div>
                            )}
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-primary/20"
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
    );
};

export default ProfilePage;
