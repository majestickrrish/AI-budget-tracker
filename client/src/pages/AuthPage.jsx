import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setCredentials } from '../utils/auth';
import { loginUser, registerUser } from '../services/api';

/* ─── Sliding Auth Page ─────────────────────────────────────────────────────
   Both Sign In and Sign Up forms live in one component simultaneously.
   A single boolean (rightPanelActive) triggers a synchronized choreography
   of CSS transforms — no routing, no conditional rendering, just motion.
────────────────────────────────────────────────────────────────────────────── */

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // If the user navigated to /register, start with the sign-up side open
  const [rightPanelActive, setRightPanelActive] = useState(
    location.pathname === '/register'
  );

  // ── Sign In state ──────────────────────────────────────────────────────────
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // ── Sign Up state ──────────────────────────────────────────────────────────
  const [registerForm, setRegisterForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  // Keep URL in sync when panel slides
  useEffect(() => {
    navigate(rightPanelActive ? '/register' : '/login', { replace: true });
  }, [rightPanelActive]);

  // ── Sign In submit ─────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginForm.email || !loginForm.password) {
      setLoginError('Please fill in all fields.');
      return;
    }
    setLoginLoading(true);
    try {
      const response = await loginUser(loginForm.email, loginForm.password);
      const { token, user } = response.data.data;
      setCredentials(token, user);
      navigate('/dashboard');
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Sign Up submit ─────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    const { name, email, password, confirmPassword } = registerForm;
    if (!name || !email || !password || !confirmPassword) {
      setRegisterError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setRegisterError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setRegisterError('Passwords do not match.');
      return;
    }
    setRegisterLoading(true);
    try {
      const response = await registerUser(name, email, password, confirmPassword);
      const { token, user } = response.data.data;
      setCredentials(token, user);
      navigate('/dashboard');
    } catch (err) {
      setRegisterError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  // ── Shared input styles ────────────────────────────────────────────────────
  const inputClass =
    'w-full bg-gray-800/60 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200';

  const btnPrimary =
    'w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 text-sm tracking-widest uppercase mt-1';

  const btnOutline =
    'px-10 py-3 border-2 border-white text-white font-bold rounded-full text-xs tracking-widest uppercase transition-all duration-200 hover:bg-white/10';

  return (
    <>
      {/* ── Keyframe animations injected via a style tag ── */}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .auth-container {
          position: relative;
          width: 900px;
          max-width: 100%;
          min-height: 580px;
          overflow: hidden;
          border-radius: 24px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6);
        }

        /* ── Sign Up panel (right side by default) ── */
        .sign-up-container {
          position: absolute;
          top: 0; left: 0;
          width: 50%; height: 100%;
          opacity: 0;
          z-index: 1;
          transition: all 0.6s ease-in-out;
        }
        .auth-container.right-panel-active .sign-up-container {
          transform: translateX(100%);
          opacity: 1;
          z-index: 5;
          animation: slideInLeft 0.6s ease-in-out;
        }

        /* ── Sign In panel (left side by default) ── */
        .sign-in-container {
          position: absolute;
          top: 0; left: 0;
          width: 50%; height: 100%;
          z-index: 2;
          transition: all 0.6s ease-in-out;
        }
        .auth-container.right-panel-active .sign-in-container {
          transform: translateX(100%);
        }

        /* ── Overlay wrapper (always 200% wide) ── */
        .overlay-container {
          position: absolute;
          top: 0; left: 50%;
          width: 200%; height: 100%;
          overflow: hidden;
          z-index: 100;
          transform: translateX(0);
          transition: transform 0.6s ease-in-out;
        }
        .auth-container.right-panel-active .overlay-container {
          transform: translateX(-50%);
        }

        /* ── The actual gradient overlay strip ── */
        .overlay {
          position: relative;
          left: -100%;
          width: 200%; height: 100%;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #4f46e5 100%);
          transform: translateX(0);
          transition: transform 0.6s ease-in-out;
        }
        .auth-container.right-panel-active .overlay {
          transform: translateX(50%);
        }

        /* ── Left overlay panel ── */
        .overlay-left {
          position: absolute;
          top: 0; left: 0;
          width: 50%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 0 48px;
          transform: translateX(-20%);
          transition: transform 0.6s ease-in-out;
        }
        .auth-container.right-panel-active .overlay-left {
          transform: translateX(0);
        }

        /* ── Right overlay panel ── */
        .overlay-right {
          position: absolute;
          top: 0; right: 0;
          width: 50%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 0 48px;
          transform: translateX(0);
          transition: transform 0.6s ease-in-out;
        }
        .auth-container.right-panel-active .overlay-right {
          transform: translateX(20%);
        }
      `}</style>

      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-8">
        {/* Logo above the card */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
            💰
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">AI Budget Tracker</p>
            <p className="text-indigo-400 text-xs font-medium">Smart finance, powered by AI</p>
          </div>
        </div>

        {/* ── Main sliding container ── */}
        <div className={`auth-container ${rightPanelActive ? 'right-panel-active' : ''}`}>

          {/* ── Sign Up Form ── */}
          <div className="sign-up-container bg-gray-900">
            <form
              id="register-form"
              onSubmit={handleRegister}
              className="h-full flex flex-col items-center justify-center px-10 gap-4"
            >
              <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
              <p className="text-gray-400 text-xs mb-2">Fill in your details to get started</p>

              <input
                id="register-name"
                type="text"
                name="name"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                placeholder="Full Name"
                autoComplete="name"
                className={inputClass}
              />
              <input
                id="register-email"
                type="email"
                name="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                placeholder="Email"
                autoComplete="email"
                className={inputClass}
              />
              <input
                id="register-password"
                type="password"
                name="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                placeholder="Password (min 6 chars)"
                autoComplete="new-password"
                className={inputClass}
              />
              <input
                id="register-confirmpassword"
                type="password"
                name="confirmPassword"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                placeholder="Confirm Password"
                autoComplete="new-password"
                className={inputClass}
              />

              {registerError && (
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 w-full text-center">
                  {registerError}
                </p>
              )}

              <button
                id="register-submit-btn"
                type="submit"
                disabled={registerLoading}
                className={btnPrimary}
              >
                {registerLoading ? 'Creating...' : 'Sign Up'}
              </button>
            </form>
          </div>

          {/* ── Sign In Form ── */}
          <div className="sign-in-container bg-gray-900">
            <form
              id="login-form"
              onSubmit={handleLogin}
              className="h-full flex flex-col items-center justify-center px-10 gap-4"
            >
              <h1 className="text-2xl font-bold text-white mb-1">Sign In</h1>
              <p className="text-gray-400 text-xs mb-2">Use your email and password</p>

              <input
                id="login-email"
                type="email"
                name="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="Email"
                autoComplete="email"
                className={inputClass}
              />
              <input
                id="login-password"
                type="password"
                name="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Password"
                autoComplete="current-password"
                className={inputClass}
              />

              {loginError && (
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 w-full text-center">
                  {loginError}
                </p>
              )}

              <button
                id="login-submit-btn"
                type="submit"
                disabled={loginLoading}
                className={btnPrimary}
              >
                {loginLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          {/* ── Overlay ── */}
          <div className="overlay-container">
            <div className="overlay">

              {/* Left overlay — shown when Sign Up is active */}
              <div className="overlay-left">
                <h1 className="text-3xl font-black text-white mb-3">Welcome Back!</h1>
                <p className="text-indigo-200 text-sm leading-relaxed mb-8">
                  Already have an account?<br />Sign in to continue tracking your finances.
                </p>
                <button
                  id="overlay-signin-btn"
                  onClick={() => setRightPanelActive(false)}
                  className={btnOutline}
                >
                  Sign In
                </button>
              </div>

              {/* Right overlay — shown when Sign In is active */}
              <div className="overlay-right">
                <h1 className="text-3xl font-black text-white mb-3">Hello, Friend!</h1>
                <p className="text-indigo-200 text-sm leading-relaxed mb-8">
                  New here? Enter your details and start<br />your AI-powered finance journey.
                </p>
                <button
                  id="overlay-signup-btn"
                  onClick={() => setRightPanelActive(true)}
                  className={btnOutline}
                >
                  Sign Up
                </button>
              </div>

            </div>
          </div>
        </div>

        <p className="text-gray-600 text-xs mt-8">
          © 2025 AI Budget Tracker · Built with ❤️ and indigo
        </p>
      </div>
    </>
  );
};

export default AuthPage;
