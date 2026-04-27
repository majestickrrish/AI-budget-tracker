// Auth utility — dummy implementation using localStorage
// Swap these for real API calls in Phase 2 when backend is ready

const TOKEN_KEY = 'budget_tracker_token';
const USER_KEY = 'budget_tracker_user';

export const fakeLogin = (email, password) => {
  // TODO: Replace with real API call — POST /api/auth/login
  const fakeToken = 'fake-jwt-token-' + Date.now();
  const fakeUser = { email, name: email.split('@')[0] };
  localStorage.setItem(TOKEN_KEY, fakeToken);
  localStorage.setItem(USER_KEY, JSON.stringify(fakeUser));
  return { token: fakeToken, user: fakeUser };
};

export const fakeRegister = (name, email, password) => {
  // TODO: Replace with real API call — POST /api/auth/register
  const fakeToken = 'fake-jwt-token-' + Date.now();
  const fakeUser = { email, name };
  localStorage.setItem(TOKEN_KEY, fakeToken);
  localStorage.setItem(USER_KEY, JSON.stringify(fakeUser));
  return { token: fakeToken, user: fakeUser };
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const isAuthenticated = () => !!getToken();

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};
