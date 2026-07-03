import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API_URL from '../config/api'

export default function Signup({ setIsAuthenticated }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Calculate password strength
  const getPasswordStrength = () => {
    let score = 0
    if (!password) return 0
    if (password.length > 5) score += 1
    if (password.length > 8) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    return Math.min(score, 4)
  }
  
  const strength = getPasswordStrength()
  const strengthColors = ['bg-muted', 'bg-expense', 'bg-in-hand', 'bg-income', 'bg-primary']
  const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong']

  const handleStep1 = (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setStep(2)
  }

  const handleStep2 = async (e) => {
    e.preventDefault()
    setError('')

    if (!/^\d{4}$/.test(pin)) {
      setError('PIN must be exactly 4 digits')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, pin })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setIsAuthenticated(true)
      // Navigate to onboarding next! (But dashboard for now until onboarding is built)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-main flex">
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
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-main mb-2 tracking-tight">Create Account</h1>
            <p className="text-secondary text-lg">Join us today to master your finances.</p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-10 bg-primary shadow-[0_0_8px_rgba(139,92,246,0.5)]' : 'w-4 bg-primary'}`} />
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-10 bg-primary shadow-[0_0_8px_rgba(139,92,246,0.5)]' : 'w-4 bg-white/10'}`} />
          </div>

          {error && (
            <div className="bg-expense/10 border border-expense/30 text-expense px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface border border-white/10 text-main rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface border border-white/10 text-main rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface border border-white/10 text-main rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted mb-2"
                  placeholder="••••••••"
                  required
                />
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex-1 flex gap-1 h-1.5 rounded-full overflow-hidden bg-white/5">
                      {[1, 2, 3, 4].map((level) => (
                        <div key={level} className={`h-full flex-1 ${strength >= level ? strengthColors[strength] : 'bg-transparent'}`} />
                      ))}
                    </div>
                    <span className={`text-xs font-bold ${strength > 0 ? strengthColors[strength].replace('bg-', 'text-') : 'text-muted'}`}>
                      {strengthLabels[strength]}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wider">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface border border-white/10 text-main rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                Continue
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-6">
              <div className="text-center lg:text-left mb-6">
                <h3 className="text-xl font-bold text-main mb-2">Set Security PIN</h3>
                <p className="text-sm text-secondary">This 4-digit PIN will be used for quick access and sensitive actions.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wider">4-Digit PIN</label>
                <input
                  type="password"
                  maxLength="4"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-surface border border-white/10 text-main text-center text-2xl tracking-[1em] rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted placeholder:tracking-normal"
                  placeholder="••••"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-surface border border-white/10 hover:border-white/20 text-main py-4 rounded-xl font-bold transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || pin.length !== 4}
                  className="w-2/3 bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-secondary font-medium mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-hover font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Value Proposition Panel */}
      <div className="hidden lg:flex w-1/2 bg-surface relative overflow-hidden border-l border-white/5 items-center justify-center p-12">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tl from-primary/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-lg space-y-12">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl border border-primary/20 mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-main">Your money, on your terms.</h2>
            <p className="text-secondary text-lg leading-relaxed">
              We believe financial software should be fast, private, and beautiful. Join thousands of users taking control of their financial destiny today.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-bg-main p-6 rounded-2xl border border-white/5">
              <p className="text-3xl font-extrabold text-primary mb-1">~5 min</p>
              <p className="text-sm font-semibold text-secondary">Setup Time</p>
            </div>
            <div className="bg-bg-main p-6 rounded-2xl border border-white/5">
              <p className="text-3xl font-extrabold text-primary mb-1">0</p>
              <p className="text-sm font-semibold text-secondary">Spam Emails</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
