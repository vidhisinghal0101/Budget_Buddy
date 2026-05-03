import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import API_URL from '../config/api'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setStatus('error')
      setErrorMsg('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setStatus('error')
      setErrorMsg('Password must be at least 6 characters long.')
      return
    }

    setStatus('loading')
    setErrorMsg('')
    
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password')
      }

      setStatus('success')
    } catch (error) {
      console.error(error)
      setStatus('error')
      setErrorMsg(error.message || 'Failed to connect to the server. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 shadow-lg shadow-primary/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Set New Password</h2>
            <p className="text-gray-500 mt-2">Enter your new secure password</p>
          </div>

          {status === 'success' ? (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-4 rounded-xl text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="font-medium">Password Reset Successful</p>
                <p className="text-sm mt-1">You can now login with your new password.</p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-primary text-white py-3 rounded-xl hover:opacity-90 transition-all font-bold shadow-lg shadow-primary/20"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-primary text-white py-3 rounded-xl hover:opacity-90 transition-all font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Updating...' : 'Reset Password'}
              </button>
            </form>
          )}

          <div className="text-center text-sm text-gray-600">
            Back to{' '}
            <Link to="/login" className="text-primary hover:opacity-80 font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
