import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API_URL from '../config/api'
import ThemeToggle from '../components/ThemeToggle'

export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setIsAuthenticated(true)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent flex relative">
      <ThemeToggle className="absolute top-6 right-6 z-50" />
      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative z-10">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-flex items-center space-x-2 mb-10">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
                <span className="text-sm font-black text-primary">₹</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-main">Budget Buddy</span>
            </Link>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-main mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-secondary text-lg">Enter your details to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-expense/10 border border-expense/30 text-expense px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-white/10 text-main rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-secondary uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border border-white/10 text-main rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-secondary font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary-hover font-bold transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Value Proposition Panel */}
      <div className="hidden lg:flex w-1/2 bg-surface relative overflow-hidden border-l border-white/5 items-center justify-center p-12">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-lg space-y-12">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl border border-primary/20 mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-main">Understand your wealth trajectory.</h2>
            <p className="text-secondary text-lg leading-relaxed">
              Budget Buddy transforms raw transaction data into actionable financial intelligence, helping you make informed decisions effortlessly.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-bg-main p-6 rounded-2xl border border-white/5">
              <p className="text-3xl font-extrabold text-primary mb-1">100%</p>
              <p className="text-sm font-semibold text-secondary">Private & Secure</p>
            </div>
            <div className="bg-bg-main p-6 rounded-2xl border border-white/5">
              <p className="text-3xl font-extrabold text-primary mb-1">0</p>
              <p className="text-sm font-semibold text-secondary">Hidden Fees</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
