import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Remove boot splash once React is mounted.
// Timing: motto finishes animating ~3.95s after page load; fade at 3.4s so
// the last word is visible during the fade, then unmount.
const boot = document.getElementById('boot');
if (boot) {
  setTimeout(() => {
    boot.classList.add('hide');
    setTimeout(() => boot.remove(), 450);
  }, 3400);
}