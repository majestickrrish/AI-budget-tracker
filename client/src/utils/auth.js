// Auth utility — dummy implementation using localStorage
// Swap these for real API calls in Phase 2 when backend is ready

const TOKEN_KEY = 'budget_tracker_token';
const USER_KEY = 'budget_tracker_user';

export const setCredentials = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
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
