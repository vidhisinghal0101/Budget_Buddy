import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API_URL from '../config/api'
import ThemeToggle from '../components/ThemeToggle'

const STEPS = [
  { number: 1, label: 'Find Account' },
  { number: 2, label: 'Verify PIN' },
  { number: 3, label: 'New Password' },
]

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleStep1 = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
      const res = await fetch(`${API_URL}/api/auth/verify-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pin })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setStep(3)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStep3 = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pin, newPassword })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <ThemeToggle className="absolute top-6 right-6 z-50" />
      <div className="max-w-md w-full glass-card p-8 sm:p-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">

          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 shadow-lg shadow-primary/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
            <p className="text-gray-500 mt-1 text-sm">Recover your account in 3 steps</p>
          </div>

          {/* Success state */}
          {success ? (
            <div className="space-y-5">
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-5 rounded-xl text-center">
                <svg className="w-10 h-10 mx-auto mb-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="font-semibold text-lg">Password Reset!</p>
                <p className="text-sm mt-1">You can now sign in with your new password.</p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-primary text-white py-3 rounded-xl hover:opacity-90 transition-all font-bold shadow-lg shadow-primary/20"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <>
              {/* Progress indicator */}
              <div className="flex items-center justify-between">
                {STEPS.map((s, i) => (
                  <div key={s.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                        ${step > s.number
                          ? 'bg-primary text-white'
                          : step === s.number
                          ? 'bg-primary text-white ring-4 ring-primary/20'
                          : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {step > s.number ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : s.number}
                      </div>
                      <span className={`text-xs mt-1 font-medium ${step === s.number ? 'text-primary' : 'text-gray-400'}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-1 mb-4 transition-all ${step > s.number ? 'bg-primary' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Step 1 — Enter email */}
              {step === 1 && (
                <form onSubmit={handleStep1} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="you@example.com"
                      required
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-3 rounded-xl hover:opacity-90 transition-all font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Checking...' : 'Continue'}
                  </button>
                </form>
              )}

              {/* Step 2 — Enter PIN */}
              {step === 2 && (
                <form onSubmit={handleStep2} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter your 4-digit Recovery PIN</label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition tracking-widest text-center text-2xl"
                      placeholder="••••"
                      required
                      autoFocus
                    />
                    <p className="text-xs text-gray-400 mt-1">This is the PIN you set when you created your account.</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setStep(1); setError(''); setPin('') }}
                      className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-primary text-white py-3 rounded-xl hover:opacity-90 transition-all font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Verifying...' : 'Verify PIN'}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3 — New password */}
              {step === 3 && (
                <form onSubmit={handleStep3} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="Min. 6 characters"
                      required
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="Repeat password"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setStep(2); setError(''); setNewPassword(''); setConfirmPassword('') }}
                      className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-primary text-white py-3 rounded-xl hover:opacity-90 transition-all font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          <div className="text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-primary hover:opacity-80 font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
