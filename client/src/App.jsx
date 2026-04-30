// ─── App.jsx ──────────────────────────────────────────────────────────────────
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import InsightsPage from './pages/InsightsPage';
import GoalsPage from './pages/GoalsPage';
import ProfilePage from './pages/ProfilePage';
import { isAuthenticated, getUser } from './utils/auth';

// ─── Onboarding Gate ─────────────────────────────────────────────────────────
// Checks if the authenticated user has completed onboarding.
// If not, redirects to /onboarding before entering protected pages.
const OnboardingGate = ({ children }) => {
  const user = getUser();
  const userId = user?._id || 'guest';
  
  // Check backend flag first
  if (user?.onboardingCompleted) {
    return children;
  }

  // Fallback to localStorage check
  const onboarding = (() => {
    try { return JSON.parse(localStorage.getItem(`onboarding_${userId}`)); } catch { return null; }
  })();

  if (!onboarding?.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public routes ── */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        {/* ── Protected routes wrapped in Layout ── */}
        <Route
          element={
            <ProtectedRoute>
              <Layout>
                <Outlet />
              </Layout>
            </ProtectedRoute>
          }
        >
          {/* Routes requiring Onboarding Completion */}
          <Route element={<OnboardingGate><Outlet /></OnboardingGate>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
          </Route>
          
          {/* Routes accessible without onboarding */}
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* ── Onboarding (protected but pre-gate) ── */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* ── Defaults ── */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;