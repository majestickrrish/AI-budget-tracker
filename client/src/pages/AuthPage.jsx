import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setCredentials } from '../utils/auth';
import { loginUser, registerUser } from '../services/api';

/* ─── AuthPage — Sliding Panel Auth ─────────────────────────────────────────
   Two form panels + one gradient overlay panel live side by side.
   A single boolean flips which side the overlay sits on,
   revealing whichever form is "behind" it.
────────────────────────────────────────────────────────────────────────────── */

const AuthPage = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [mode, setMode] = useState(
    location.pathname === '/register' ? 'register' : 'login'
  );

  const isRegister = mode === 'register';

  // Keep URL in sync
  useEffect(() => {
    navigate(isRegister ? '/register' : '/login', { replace: true });
  }, [mode]);

  // ── Sign In state ──────────────────────────────────────────────────────────
  const [loginForm,    setLoginForm]    = useState({ email: '', password: '' });
  const [loginError,   setLoginError]   = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // ── Sign Up state ──────────────────────────────────────────────────────────
  const [regForm,    setRegForm]    = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [regError,   setRegError]   = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginForm.email || !loginForm.password) { setLoginError('Please fill in all fields.'); return; }
    setLoginLoading(true);
    try {
      const res = await loginUser(loginForm.email, loginForm.password);
      const { token, user } = res.data.data;
      setCredentials(token, user);
      navigate('/dashboard');
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoginLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    const { name, email, password, confirmPassword } = regForm;
    if (!name || !email || !password || !confirmPassword) { setRegError('Please fill in all fields.'); return; }
    if (password.length < 6) { setRegError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setRegError('Passwords do not match.'); return; }
    setRegLoading(true);
    try {
      const res = await registerUser(name, email, password, confirmPassword);
      const { token, user } = res.data.data;
      setCredentials(token, user);
      navigate('/dashboard');
    } catch (err) {
      setRegError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setRegLoading(false); }
  };

  // ── Shared classes ─────────────────────────────────────────────────────────
  const inputCls = 'w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all';
  const btnPrimary = 'w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm tracking-widest uppercase transition-all shadow-lg shadow-indigo-500/30 mt-1';
  const btnOutline = 'px-8 py-3 border-2 border-white/70 hover:border-white text-white font-bold rounded-full text-xs tracking-widest uppercase transition-all hover:bg-white/10';

  return (
    <div className="h-screen bg-gray-950 flex flex-col items-center justify-center px-4 overflow-hidden">

      {/* ── Logo ── */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-indigo-500/30">💰</div>
        <div>
          <p className="text-white font-bold text-base leading-tight">AI Budget Tracker</p>
          <p className="text-indigo-400 text-xs font-medium">Smart finance, powered by AI</p>
        </div>
      </div>

      {/* ── Card ── */}
      <div
        className="relative flex w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/60 shrink-0"
        style={{ maxWidth: 860, height: 'min(520px, calc(100vh - 120px))' }}
      >

        {/* ════════ Sign In Panel ════════ */}
        <div
          className="absolute top-0 left-0 h-full bg-gray-900 flex flex-col items-center justify-center px-10 transition-all duration-700"
          style={{
            width: '50%',
            transform: isRegister ? 'translateX(100%)' : 'translateX(0)',
            opacity:   isRegister ? 0 : 1,
            zIndex:    isRegister ? 1 : 5,
            pointerEvents: isRegister ? 'none' : 'auto',
          }}
        >
          <h2 className="text-2xl font-black text-white mb-1">Sign In</h2>
          <p className="text-gray-400 text-xs mb-6">Use your email and password</p>

          <form id="login-form" onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <input id="login-email" type="email" value={loginForm.email}
              onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
              placeholder="Email" autoComplete="email" className={inputCls} />
            <input id="login-password" type="password" value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              placeholder="Password" autoComplete="current-password" className={inputCls} />

            {loginError && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 text-center">
                {loginError}
              </p>
            )}
            <button id="login-submit-btn" type="submit" disabled={loginLoading} className={btnPrimary}>
              {loginLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* ════════ Sign Up Panel ════════ */}
        <div
          className="absolute top-0 left-0 h-full bg-gray-900 flex flex-col items-center justify-center px-10 transition-all duration-700"
          style={{
            width: '50%',
            transform: isRegister ? 'translateX(100%)' : 'translateX(0)',
            opacity:   isRegister ? 1 : 0,
            zIndex:    isRegister ? 5 : 1,
            pointerEvents: isRegister ? 'auto' : 'none',
          }}
        >
          <h2 className="text-2xl font-black text-white mb-1">Create Account</h2>
          <p className="text-gray-400 text-xs mb-5">Fill in your details to get started</p>

          <form id="register-form" onSubmit={handleRegister} className="w-full flex flex-col gap-3">
            <input id="register-name" type="text" value={regForm.name}
              onChange={e => setRegForm({ ...regForm, name: e.target.value })}
              placeholder="Full Name" autoComplete="name" className={inputCls} />
            <input id="register-email" type="email" value={regForm.email}
              onChange={e => setRegForm({ ...regForm, email: e.target.value })}
              placeholder="Email" autoComplete="email" className={inputCls} />
            <input id="register-password" type="password" value={regForm.password}
              onChange={e => setRegForm({ ...regForm, password: e.target.value })}
              placeholder="Password (min 6 chars)" autoComplete="new-password" className={inputCls} />
            <input id="register-confirmpassword" type="password" value={regForm.confirmPassword}
              onChange={e => setRegForm({ ...regForm, confirmPassword: e.target.value })}
              placeholder="Confirm Password" autoComplete="new-password" className={inputCls} />

            {regError && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 text-center">
                {regError}
              </p>
            )}
            <button id="register-submit-btn" type="submit" disabled={regLoading} className={btnPrimary}>
              {regLoading ? 'Creating account…' : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* ════════ Gradient Overlay Panel — slides left ↔ right ════════ */}
        <div
          className="absolute top-0 h-full flex flex-col items-center justify-center text-center px-10 transition-all duration-700"
          style={{
            width: '50%',
            left: isRegister ? '0%' : '50%',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #6d28d9 100%)',
            zIndex: 10,
          }}
        >
          {/* Decorative circles */}
          <div className="absolute top-[-60px] right-[-60px] w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute bottom-[-40px] left-[-40px] w-32 h-32 rounded-full bg-white/5" />

          <div className="relative z-10">
            {isRegister ? (
              // Register mode → overlay on LEFT → show "Welcome Back"
              <>
                <div className="text-5xl mb-4">👋</div>
                <h2 className="text-3xl font-black text-white mb-3">Welcome Back!</h2>
                <p className="text-indigo-200 text-sm leading-relaxed mb-8">
                  Already have an account?<br />Sign in to keep tracking your finances.
                </p>
                <button id="overlay-signin-btn" onClick={() => setMode('login')} className={btnOutline}>
                  Sign In
                </button>
              </>
            ) : (
              // Login mode → overlay on RIGHT → show "Hello, Friend"
              <>
                <div className="text-5xl mb-4">🚀</div>
                <h2 className="text-3xl font-black text-white mb-3">Hello, Friend!</h2>
                <p className="text-indigo-200 text-sm leading-relaxed mb-8">
                  New here? Enter your details and start<br />your AI-powered finance journey.
                </p>
                <button id="overlay-signup-btn" onClick={() => setMode('register')} className={btnOutline}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AuthPage;
