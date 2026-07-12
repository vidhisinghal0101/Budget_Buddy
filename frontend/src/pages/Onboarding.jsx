import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import API_URL from '../config/api'

export default function Onboarding({ setIsAuthenticated }) {
  const navigate = useNavigate()
  const { currency, changeCurrency, CURRENCIES } = useTheme()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Form State
  const [salary, setSalary] = useState('')
  const [budgets, setBudgets] = useState({
    Food: '',
    Bills: '',
    Transport: ''
  })

  // User state
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleNext = (e) => {
    e.preventDefault()
    setStep(step + 1)
  }

  const handleComplete = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      
      // 1. Update user salary and onboarding flag
      const userRes = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          salary: parseFloat(salary),
          onboardingComplete: true 
        })
      })

      if (!userRes.ok) throw new Error('Failed to update profile')

      // Update local storage user
      const userData = await userRes.json()
      localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), ...userData }))

      // 2. Create initial budgets
      for (const [category, limit] of Object.entries(budgets)) {
        if (!limit || parseFloat(limit) <= 0) continue
        
        await fetch(`${API_URL}/api/budget`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            category,
            limit: parseFloat(limit),
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear()
          })
        })
      }

      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="bg-surface rounded-3xl shadow-2xl p-8 sm:p-12 border border-white/5 relative overflow-hidden">
          
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out" 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl border border-primary/20 mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {step === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                {step === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                {step === 3 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
              </svg>
            </div>
            
            {step === 1 && (
              <>
                <h2 className="text-3xl font-extrabold text-main mb-2">Welcome to Budget Buddy</h2>
                <p className="text-secondary text-lg">Let's start by choosing your local currency.</p>
              </>
            )}
            {step === 2 && (
              <>
                <h2 className="text-3xl font-extrabold text-main mb-2">Income Baseline</h2>
                <p className="text-secondary text-lg">What is your expected monthly income?</p>
              </>
            )}
            {step === 3 && (
              <>
                <h2 className="text-3xl font-extrabold text-main mb-2">Set Initial Limits</h2>
                <p className="text-secondary text-lg">Let's set a target limit for your top 3 expenses.</p>
              </>
            )}
          </div>

          {error && (
            <div className="bg-expense/10 border border-expense/30 text-expense px-4 py-3 rounded-xl text-sm font-medium mb-6">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => changeCurrency(c.code)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      currency.code === c.code 
                        ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                        : 'bg-bg-main border-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className={`block text-3xl mb-2 ${currency.code === c.code ? 'text-primary' : 'text-muted'}`}>
                      {c.symbol}
                    </span>
                    <span className="block font-bold text-main">{c.code}</span>
                    <span className="block text-sm text-secondary">{c.name}</span>
                  </button>
                ))}
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
            <form onSubmit={handleNext} className="space-y-6">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted">
                  {currency.symbol}
                </span>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full bg-bg-main border border-white/10 text-main rounded-2xl pl-12 pr-4 py-6 text-3xl font-bold focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted/30"
                  placeholder="0.00"
                  required
                  min="0"
                  step="any"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-bg-main border border-white/10 hover:border-white/20 text-main py-4 rounded-xl font-bold transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!salary}
                  className="w-2/3 bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleComplete} className="space-y-6">
              <div className="space-y-4">
                {Object.keys(budgets).map((category) => (
                  <div key={category} className="bg-bg-main p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                    <span className="font-bold text-main">{category}</span>
                    <div className="relative w-1/2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-bold">
                        {currency.symbol}
                      </span>
                      <input
                        type="number"
                        value={budgets[category]}
                        onChange={(e) => setBudgets({ ...budgets, [category]: e.target.value })}
                        className="w-full bg-surface border border-white/10 text-main rounded-xl pl-8 pr-3 py-2.5 font-bold focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted/30 text-right"
                        placeholder="Limit"
                        min="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 bg-bg-main border border-white/10 hover:border-white/20 text-main py-4 rounded-xl font-bold transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? 'Setting up...' : 'Go to Dashboard'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}
