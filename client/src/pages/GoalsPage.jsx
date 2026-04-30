// ─── GoalsPage.jsx ────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Check, X, TrendingUp, Trophy } from 'lucide-react';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../services/api';
import { getUser } from '../utils/auth';

const GOAL_EMOJIS = ['🎯', '🏠', '✈️', '🚗', '💻', '💍', '📚', '🏋️', '🌴', '💰'];
const DEADLINE_OPTIONS = [
    { label: '1 Month', months: 1 },
    { label: '3 Months', months: 3 },
    { label: '6 Months', months: 6 },
    { label: '1 Year', months: 12 },
    { label: '2 Years', months: 24 },
    { label: 'Custom', months: 0 },
];

const inputCls =
    'w-full bg-background border border-border-default text-text-default placeholder-text-secondary/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-150 hover:border-text-secondary/30';

// ─── GoalCard ─────────────────────────────────────────────────────────────────
const GoalCard = ({ goal, onDelete, onUpdate }) => {
    const { name, emoji, targetAmount, savedAmount, deadline, _id } = goal;
    const pct = Math.min(100, Math.round((savedAmount / targetAmount) * 100));
    const remaining = targetAmount - savedAmount;
    const isComplete = pct >= 100;
    const deadlineDate = deadline ? new Date(deadline) : null;
    const daysLeft = deadlineDate ? Math.max(0, Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24))) : null;
    const monthsLeft = daysLeft !== null ? Math.ceil(daysLeft / 30) : null;
    const requiredMonthly = monthsLeft > 0 ? Math.ceil(remaining / monthsLeft) : remaining;

    const [adding, setAdding] = useState(false);
    const [addAmt, setAddAmt] = useState('');

    const handleAddSavings = () => {
        const amt = parseFloat(addAmt);
        if (!amt || amt <= 0) return;
        onUpdate(_id, { savedAmount: Math.min(targetAmount, savedAmount + amt) });
        setAddAmt('');
        setAdding(false);
    };

    const barColor = isComplete ? '#1D9E75' : pct >= 70 ? '#639922' : pct >= 40 ? '#BA7517' : '#D85A30';

    return (
        <div className={`bg-card border rounded-xl overflow-hidden transition-all duration-200 ${isComplete ? 'border-success/40' : 'border-border-default'}`}>
            <div className="h-1 w-full" style={{ backgroundColor: barColor }} />
            <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-background border border-border-default flex items-center justify-center text-2xl shrink-0">{emoji}</div>
                        <div>
                            <p className="text-sm font-bold text-text-default leading-tight">{name}</p>
                            <p className="text-xs text-text-secondary mt-0.5">
                                {isComplete ? '✅ Completed!' : deadlineDate ? `Due ${deadlineDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : 'No deadline'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => { setAdding(!adding); setAddAmt(''); }} className="w-7 h-7 rounded-lg flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary/10 transition-all text-xs font-bold" title="Add savings"><Plus size={14} /></button>
                        <button onClick={() => onDelete(_id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-text-secondary hover:text-danger hover:bg-danger/10 transition-all" title="Delete goal"><Trash2 size={13} /></button>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-text-default tabular-nums">₹{savedAmount.toLocaleString('en-IN')} saved</span>
                        <span className="text-xs font-bold" style={{ color: barColor }}>{pct}%</span>
                    </div>
                    <div className="h-2.5 bg-background border border-border-default rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                    </div>
                </div>

                {!isComplete && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                        <div className="bg-background border border-border-default rounded-lg p-2 text-center">
                            <p className="text-[8px] font-bold text-text-secondary uppercase mb-0.5">Left</p>
                            <p className="text-[10px] font-black text-danger tabular-nums">₹{remaining.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-background border border-border-default rounded-lg p-2 text-center">
                            <p className="text-[8px] font-bold text-text-secondary uppercase mb-0.5">Days</p>
                            <p className="text-[10px] font-black text-text-default tabular-nums">{daysLeft !== null ? daysLeft : '—'}</p>
                        </div>
                        <div className="bg-background border border-border-default rounded-lg p-2 text-center">
                            <p className="text-[8px] font-bold text-text-secondary uppercase mb-0.5">Goal/Mo</p>
                            <p className="text-[10px] font-black text-primary tabular-nums">{monthsLeft > 0 ? `₹${requiredMonthly.toLocaleString('en-IN')}` : '—'}</p>
                        </div>
                    </div>
                )}

                {adding && !isComplete && (
                    <div className="mt-3 flex items-center gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xs">₹</span>
                            <input type="number" value={addAmt} onChange={(e) => setAddAmt(e.target.value)} placeholder="Amount" min="1" autoFocus className={`${inputCls} pl-7 py-2 text-xs`} />
                        </div>
                        <button onClick={handleAddSavings} className="w-8 h-8 rounded-xl bg-success/10 text-success flex items-center justify-center hover:bg-success/20 transition-all"><Check size={14} /></button>
                    </div>
                )}
                {isComplete && <div className="mt-3 flex items-center gap-2 bg-success/10 border border-success/20 rounded-xl px-3 py-2 text-xs font-semibold text-success"><Trophy size={14} /> Goal achieved! 🎉</div>}
            </div>
        </div>
    );
};

// ─── AddGoalModal ─────────────────────────────────────────────────────────────
const AddGoalModal = ({ onClose, onAdd }) => {
    const [form, setForm] = useState({ name: '', emoji: '🎯', targetAmount: '', savedAmount: '', deadlineOption: 3, customDeadline: '' });
    const [visible, setVisible] = useState(false);
    useEffect(() => { setVisible(true); }, []);

    const handleClose = () => { setVisible(false); setTimeout(onClose, 150); };

    const computeDeadline = () => {
        const opt = DEADLINE_OPTIONS.find((o) => o.months === form.deadlineOption);
        if (!opt || opt.months === 0) return form.customDeadline || null;
        const d = new Date(); d.setMonth(d.getMonth() + opt.months);
        return d.toISOString();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.targetAmount) return;
        onAdd({ name: form.name, emoji: form.emoji, targetAmount: parseFloat(form.targetAmount), savedAmount: parseFloat(form.savedAmount) || 0, deadline: computeDeadline() });
        handleClose();
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-150 ${visible ? 'bg-black/50 backdrop-blur-[2px]' : 'bg-black/0'}`} onClick={(e) => e.target === e.currentTarget && handleClose()}>
            <div className={`bg-card border border-border-default rounded-2xl w-full max-w-md shadow-2xl transition-all duration-150 ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-[0.98]'}`}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
                    <div><h2 className="text-base font-bold text-text-default">New Savings Goal</h2><p className="text-xs text-text-secondary mt-0.5">Set a target and track your progress</p></div>
                    <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-default transition-all"><X size={16} /></button>
                </div>
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    <div><label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Icon</label><div className="flex flex-wrap gap-2">{GOAL_EMOJIS.map((em) => (<button key={em} type="button" onClick={() => setForm({ ...form, emoji: em })} className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all ${form.emoji === em ? 'bg-primary/10 border-primary' : 'bg-background border-border-default hover:border-primary/50'}`}>{em}</button>))}</div></div>
                    <div><label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Goal Name</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Emergency Fund" required className={inputCls} /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Target (₹)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xs">₹</span><input type="number" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} placeholder="50000" min="1" required className={`${inputCls} pl-7`} /></div></div>
                        <div><label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Saved (₹)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xs">₹</span><input type="number" value={form.savedAmount} onChange={(e) => setForm({ ...form, savedAmount: e.target.value })} placeholder="0" min="0" className={`${inputCls} pl-7`} /></div></div>
                    </div>
                    <div><label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Deadline</label><div className="flex flex-wrap gap-2">{DEADLINE_OPTIONS.map((opt) => (<button key={opt.months} type="button" onClick={() => setForm({ ...form, deadlineOption: opt.months })} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${form.deadlineOption === opt.months ? 'bg-primary border-primary text-white' : 'bg-background border-border-default text-text-secondary hover:border-primary hover:text-primary'}`}>{opt.label}</button>))}</div>{form.deadlineOption === 0 && (<input type="date" value={form.customDeadline} onChange={(e) => setForm({ ...form, customDeadline: e.target.value })} className={`${inputCls} mt-2`} />)}</div>
                    <div className="flex gap-3 pt-2"><button type="button" onClick={handleClose} className="px-4 py-2.5 text-sm font-medium text-text-secondary border border-border-default rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all">Cancel</button><button type="submit" className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-sm transition-all shadow-sm">Create Goal</button></div>
                </form>
            </div>
        </div>
    );
};

// ─── GoalsPage ────────────────────────────────────────────────────────────────
const GoalsPage = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchGoals = async () => {
        setLoading(true);
        try {
            const res = await getGoals();
            setGoals(res.data?.data?.goals || []);
        } catch {
            setError('Backend goals API not ready. Falling back to local data.');
            const user = getUser();
            const local = JSON.parse(localStorage.getItem(`savings_goals_${user?._id}`)) || [];
            setGoals(local);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchGoals(); }, []);

    const handleAdd = async (goal) => {
        try {
            const res = await createGoal(goal);
            setGoals((prev) => [res.data.data.goal, ...prev]);
        } catch {
            // Fallback
            const newGoal = { ...goal, _id: Date.now().toString() };
            setGoals((prev) => [newGoal, ...prev]);
            const user = getUser();
            localStorage.setItem(`savings_goals_${user?._id}`, JSON.stringify([newGoal, ...goals]));
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteGoal(id);
            setGoals((prev) => prev.filter((g) => g._id !== id));
        } catch {
            setGoals((prev) => prev.filter((g) => g._id !== id));
            const user = getUser();
            localStorage.setItem(`savings_goals_${user?._id}`, JSON.stringify(goals.filter(g => g._id !== id)));
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            const res = await updateGoal(id, updatedData);
            setGoals((prev) => prev.map((g) => (g._id === id ? res.data.data.goal : g)));
        } catch {
            setGoals((prev) => prev.map((g) => (g._id === id ? { ...g, ...updatedData } : g)));
        }
    };

    const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
    const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);
    const completedGoals = goals.filter((g) => g.savedAmount >= g.targetAmount).length;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-start justify-between mb-6">
                <div><h1 className="text-xl font-bold text-text-default flex items-center gap-2"><Target size={20} className="text-primary" /> Savings Goals</h1><p className="text-text-secondary text-sm mt-0.5">Set targets and track your financial milestones</p></div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-all shadow-sm shrink-0"><Plus size={15} /> New Goal</button>
            </div>

            {error && <div className="text-[10px] text-warning mb-4 bg-warning/5 border border-warning/10 px-3 py-2 rounded-lg italic">{error}</div>}

            {!loading && goals.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-card border border-border-default rounded-xl p-4 flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"><Target size={16} /></div>
                        <div><p className="text-[10px] font-bold text-text-secondary uppercase mb-0.5">Total Goals</p><p className="text-lg font-black text-text-default">{goals.length}</p></div>
                    </div>
                    <div className="bg-card border border-border-default rounded-xl p-4 flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0"><TrendingUp size={16} /></div>
                        <div><p className="text-[10px] font-bold text-text-secondary uppercase mb-0.5">Total Saved</p><p className="text-lg font-black text-success">₹{totalSaved.toLocaleString('en-IN')}</p></div>
                    </div>
                    <div className="bg-card border border-border-default rounded-xl p-4 flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-warning/10 text-warning flex items-center justify-center shrink-0"><Trophy size={16} /></div>
                        <div><p className="text-[10px] font-bold text-text-secondary uppercase mb-0.5">Completed</p><p className="text-lg font-black text-text-default">{completedGoals}</p></div>
                    </div>
                </div>
            )}

            {loading ? <div className="p-20 text-center text-text-secondary text-sm">Loading goals...</div> : goals.length === 0 ? (
                <div className="bg-card border border-border-default rounded-2xl p-16 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-background border border-border-default flex items-center justify-center mb-4"><Target size={24} className="text-text-secondary opacity-40" /></div>
                    <p className="text-base font-bold text-text-default mb-1">No goals yet</p>
                    <p className="text-sm text-text-secondary opacity-70 mb-6 max-w-xs">Set savings goals to stay motivated and track your financial milestones.</p>
                    <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-all shadow-sm"><Plus size={15} /> Create First Goal</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-10">
                    {goals.map((goal) => (<GoalCard key={goal._id} goal={goal} onDelete={handleDelete} onUpdate={handleUpdate} />))}
                </div>
            )}
            {showModal && <AddGoalModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
        </div>
    );
};

export default GoalsPage;