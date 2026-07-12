import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budget from './pages/Budget'
import CurrencyConverter from './pages/CurrencyConverter'
import Savings from './pages/Savings'
import Landing from './pages/Landing'
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token')
  })

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/transactions" 
          element={isAuthenticated ? <Transactions /> : <Navigate to="/" />} 
        />
        <Route 
          path="/budget" 
          element={isAuthenticated ? <Budget /> : <Navigate to="/" />} 
        />
        <Route 
          path="/savings" 
          element={isAuthenticated ? <Savings /> : <Navigate to="/" />} 
        />
        <Route 
          path="/converter" 
          element={isAuthenticated ? <CurrencyConverter setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} 
        />
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} />
      </Routes>
    </Router>
  )
}

export default App
