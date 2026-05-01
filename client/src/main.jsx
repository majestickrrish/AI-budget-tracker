import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Apply saved theme before React mounts to avoid flash
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)