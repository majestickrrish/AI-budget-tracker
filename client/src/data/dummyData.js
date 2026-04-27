// Dummy data for Phase 1 — replace with API calls in Phase 2

export const dummyExpenses = [
  { id: 1, description: 'Grocery Shopping', amount: 2400, category: 'Food', date: '2025-04-25' },
  { id: 2, description: 'Netflix Subscription', amount: 649, category: 'Entertainment', date: '2025-04-23' },
  { id: 3, description: 'Electricity Bill', amount: 1800, category: 'Utilities', date: '2025-04-20' },
  { id: 4, description: 'Uber Rides', amount: 950, category: 'Transport', date: '2025-04-18' },
  { id: 5, description: 'Gym Membership', amount: 1200, category: 'Health', date: '2025-04-15' },
  { id: 6, description: 'Online Course', amount: 3500, category: 'Education', date: '2025-04-12' },
  { id: 7, description: 'Restaurant Dinner', amount: 1400, category: 'Food', date: '2025-04-10' },
  { id: 8, description: 'Spotify Premium', amount: 119, category: 'Entertainment', date: '2025-04-08' },
];

export const categoryPieData = [
  { name: 'Food', value: 3800, color: '#6366f1' },
  { name: 'Entertainment', value: 768, color: '#f59e0b' },
  { name: 'Utilities', value: 1800, color: '#10b981' },
  { name: 'Transport', value: 950, color: '#3b82f6' },
  { name: 'Health', value: 1200, color: '#ec4899' },
  { name: 'Education', value: 3500, color: '#8b5cf6' },
];

export const monthlyTrendData = [
  { month: 'Nov', spending: 9200 },
  { month: 'Dec', spending: 14500 },
  { month: 'Jan', spending: 11800 },
  { month: 'Feb', spending: 8900 },
  { month: 'Mar', spending: 13200 },
  { month: 'Apr', spending: 12018 },
];

export const dummyInsights = [
  {
    id: 1,
    icon: '📈',
    title: 'Spending up 8% this month',
    description: 'Your food expenses increased significantly. Consider meal prepping to cut costs.',
    color: 'amber',
  },
  {
    id: 2,
    icon: '⚠️',
    title: 'Anomaly Detected',
    description: 'An unusually high expense of ₹3,500 for Education was detected on Apr 12.',
    color: 'red',
  },
  {
    id: 3,
    icon: '🤖',
    title: 'AI Prediction',
    description: 'Based on trends, you are projected to spend ₹13,400 next month.',
    color: 'indigo',
  },
  {
    id: 4,
    icon: '✅',
    title: 'Financial Health: Good',
    description: 'Your savings rate is healthy. Keep utilities and transport stable.',
    color: 'green',
  },
];

export const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Education', 'Shopping', 'Other'];

export const totalSpending = dummyExpenses.reduce((sum, e) => sum + e.amount, 0);
export const avgMonthlySpending = Math.round(monthlyTrendData.reduce((sum, m) => sum + m.spending, 0) / monthlyTrendData.length);
