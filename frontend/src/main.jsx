import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Scroll handler for parallax background effect
const updateScroll = () => {
  document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
};
window.addEventListener('scroll', updateScroll);
// Run once initially to handle page loads that are already scrolled
updateScroll();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)


