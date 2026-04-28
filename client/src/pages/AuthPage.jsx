import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setCredentials } from '../utils/auth';
import { loginUser, registerUser } from '../services/api';
import { Wallet, UserCircle, Rocket, Eye, EyeOff } from 'lucide-react';

/* ─── AuthPage ───────────────────────────────────────────────────────────────
   Mobile  (< md): Clean single-column card — form only, toggle link at bottom.
   Desktop (≥ md): Sliding panel animation with gradient overlay.
────────────────────────────────────────────────────────────────────────────── */

const AuthPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [mode, setMode] = useState(
    location.pathname === '/register' ? 'register' : 'login'
  );
  const isRegister = mode === 'register';

  useEffect(() => {
    navigate(isRegister ? '/register' : '/login', { replace: true });
  }, [mode]);

  // ── Sign In state ────────────────────────────────────────────────────────
  const [loginForm,    setLoginForm]    = useState({ email: '', password: '' });
  const [loginError,   setLoginError]   = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // ── Sign Up state ────────────────────────────────────────────────────────
  const [regForm,    setRegForm]    = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [regError,   setRegError]   = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // ── Password Visibility State ────────────────────────────────────────────
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── Handlers ─────────────────────────────────────────────────────────────
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

  // ── Shared classes ────────────────────────────────────────────────────────
  const inputCls   = 'w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all';
  const btnPrimary = 'w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm tracking-widest uppercase transition-all shadow-lg shadow-indigo-500/30 mt-1';
  const btnOutline = 'px-8 py-3 border-2 border-white/70 hover:border-white text-white font-bold rounded-full text-xs tracking-widest uppercase transition-all hover:bg-white/10';

  // ── Sign In form (reused in both mobile and desktop) ─────────────────────
  const signInFormContent = (
    <form id="login-form" onSubmit={handleLogin} className="w-full flex flex-col gap-4">
      <input id="login-email" type="email" value={loginForm.email}
        onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
        placeholder="Email" autoComplete="email" className={inputCls} />
      <div className="relative w-full">
        <input id="login-password" type={showPassword ? "text" : "password"} value={loginForm.password}
          onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
          placeholder="Password" autoComplete="current-password" className={inputCls} />
        <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex="-1"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>
      {loginError && (
        <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 text-center">{loginError}</p>
      )}
      <button id="login-submit-btn" type="submit" disabled={loginLoading} className={btnPrimary}>
        {loginLoading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );

  // ── Sign Up form ──────────────────────────────────────────────────────────
  const signUpFormContent = (
    <form id="register-form" onSubmit={handleRegister} className="w-full flex flex-col gap-3">
      <input id="register-name" type="text" value={regForm.name}
        onChange={e => setRegForm({ ...regForm, name: e.target.value })}
        placeholder="Full Name" autoComplete="name" className={inputCls} />
      <input id="register-email" type="email" value={regForm.email}
        onChange={e => setRegForm({ ...regForm, email: e.target.value })}
        placeholder="Email" autoComplete="email" className={inputCls} />
      <div className="relative w-full">
        <input id="register-password" type={showPassword ? "text" : "password"} value={regForm.password}
          onChange={e => setRegForm({ ...regForm, password: e.target.value })}
          placeholder="Password (min 6 chars)" autoComplete="new-password" className={inputCls} />
        <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex="-1"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>
      <div className="relative w-full">
        <input id="register-confirmpassword" type={showConfirmPassword ? "text" : "password"} value={regForm.confirmPassword}
          onChange={e => setRegForm({ ...regForm, confirmPassword: e.target.value })}
          placeholder="Confirm Password" autoComplete="new-password" className={inputCls} />
        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex="-1"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {regError && (
        <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 text-center">{regError}</p>
      )}
      <button id="register-submit-btn" type="submit" disabled={regLoading} className={btnPrimary}>
        {regLoading ? 'Creating account…' : 'Sign Up'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-8">

      {/* ══════════════════════════════════════════════════════
          MOBILE LAYOUT (hidden on md+)
          Clean single-column card, no sliding animation
      ══════════════════════════════════════════════════════ */}
      <div className="w-full max-w-sm md:hidden">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30"><Wallet size={20} /></div>
          <div>
            <p className="text-white font-bold text-base leading-tight">AI Budget Tracker</p>
            <p className="text-indigo-400 text-xs">Smart finance, powered by AI</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Gradient top strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 to-purple-600" />

          <div className="p-7">
            <h2 className="text-xl font-black text-white mb-1">
              {isRegister ? 'Create Account' : 'Welcome back'}
            </h2>
            <p className="text-gray-400 text-xs mb-6">
              {isRegister ? 'Fill in your details to get started' : 'Sign in to your account'}
            </p>

            {isRegister ? signUpFormContent : signInFormContent}

            {/* Toggle link */}
            <p className="text-center text-gray-500 text-xs mt-5">
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
              <button
                id={isRegister ? 'mobile-signin-link' : 'mobile-signup-link'}
                onClick={() => setMode(isRegister ? 'login' : 'register')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                {isRegister ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          DESKTOP LAYOUT (hidden on mobile, shown on md+)
          Full sliding panel animation
      ══════════════════════════════════════════════════════ */}
      <div className="hidden md:flex md:flex-col md:items-center w-full">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30"><Wallet size={18} /></div>
          <div>
            <p className="text-white font-bold text-base leading-tight">AI Budget Tracker</p>
            <p className="text-indigo-400 text-xs font-medium">Smart finance, powered by AI</p>
          </div>
        </div>

        {/* Sliding card */}
        <div
          className="relative flex w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/60 shrink-0"
          style={{ maxWidth: 860, height: 'min(520px, calc(100vh - 120px))' }}
        >
          {/* ── Sign In Panel ── */}
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
            {signInFormContent}
          </div>

          {/* ── Sign Up Panel ── */}
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
            <p className="text-gray-400 text-xs mb-4">Fill in your details to get started</p>
            {signUpFormContent}
          </div>

          {/* ── Gradient Overlay Panel ── */}
          <div
            className="absolute top-0 h-full flex flex-col items-center justify-center text-center px-10 transition-all duration-700"
            style={{
              width: '50%',
              left: isRegister ? '0%' : '50%',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #6d28d9 100%)',
              zIndex: 10,
            }}
          >
            <div className="absolute top-[-60px] right-[-60px] w-48 h-48 rounded-full bg-white/5" />
            <div className="absolute bottom-[-40px] left-[-40px] w-32 h-32 rounded-full bg-white/5" />
            <div className="relative z-10">
              {isRegister ? (
                <>
                  <div className="text-white mb-4 flex justify-center"><UserCircle size={56} strokeWidth={1.5} /></div>
                  <h2 className="text-3xl font-black text-white mb-3">Welcome Back!</h2>
                  <p className="text-indigo-200 text-sm leading-relaxed mb-8">
                    Already have an account?<br />Sign in to keep tracking.
                  </p>
                  <button id="overlay-signin-btn" onClick={() => setMode('login')} className={btnOutline}>Sign In</button>
                </>
              ) : (
                <>
                  <div className="text-white mb-4 flex justify-center"><Rocket size={56} strokeWidth={1.5} /></div>
                  <h2 className="text-3xl font-black text-white mb-3">Hello, Friend!</h2>
                  <p className="text-indigo-200 text-sm leading-relaxed mb-8">
                    New here? Enter your details and start<br />your AI-powered finance journey.
                  </p>
                  <button id="overlay-signup-btn" onClick={() => setMode('register')} className={btnOutline}>Sign Up</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AuthPage;
