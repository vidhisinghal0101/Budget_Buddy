import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config/api'
import ThemeSelector from '../components/ThemeSelector'
import { useTheme } from '../context/ThemeContext'

export default function Budget() {
  const navigate = useNavigate()
  const { currency } = useTheme()
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    category: '',
    limit: ''
  })

  const categories = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Healthcare', 'Other']

  useEffect(() => {
    fetchBudgets()
  }, [])

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/budget`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setBudgets(data)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const url = editingId
        ? `${API_URL}/api/budget/${editingId}`
        : `${API_URL}/api/budget`

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowModal(false)
        setEditingId(null)
        setFormData({ category: '', limit: '' })
        fetchBudgets()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save budget')
      }
    } catch (error) {
      console.error(error)
      alert('Failed to save budget')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this budget goal?')) return
    try {
      const token = localStorage.getItem('token')
      await fetch(`${API_URL}/api/budget/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchBudgets()
    } catch (error) {
      console.error(error)
    }
  }

  const handleEdit = (budget) => {
    setEditingId(budget.id)
    setFormData({
      category: budget.category,
      limit: budget.limit
    })
    setShowModal(true)
  }

  const getProgressColor = (percentage) => {
    if (percentage > 90) return 'bg-red-500'
    if (percentage > 70) return 'bg-orange-500'
    return 'bg-primary'
  }

  const getProgressTextColor = (percentage) => {
    if (percentage > 90) return 'text-red-600'
    if (percentage > 70) return 'text-orange-600'
    return 'text-primary'
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>

  return (
    <div className="min-h-screen">
      <nav className="bg-surface shadow-sm border-b border-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">{currency.symbol}</span>
              </div>
              <span className="text-xl font-semibold text-main">Budget Buddy</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-3 py-2 text-muted hover:text-main transition-colors font-medium"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/transactions')}
                  className="px-3 py-2 text-muted hover:text-main transition-colors font-medium"
                >
                  Transactions
                </button>
                <button
                  onClick={() => navigate('/converter')}
                  className="px-3 py-2 text-muted hover:text-main transition-colors font-medium"
                >
                  Converter
                </button>
              </div>
              <ThemeSelector />
              <button
                onClick={() => {
                  localStorage.clear()
                  navigate('/login')
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-main">Budget Goals</h1>
            <p className="text-muted mt-1">Set spending limits for each category</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null)
              setFormData({ category: '', limit: '' })
              setShowModal(true)
            }}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:opacity-90 transition-all font-bold shadow-lg shadow-primary/20"
          >
            + Create Budget Goal
          </button>
        </div>

        {budgets.length === 0 ? (
          <div className="bg-surface rounded-2xl shadow-md p-12 text-center border border-main">
            <div className="w-20 h-20 bg-bg-main rounded-full flex items-center justify-center mx-auto mb-4 border border-main">
              <svg className="w-10 h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-main mb-2">No Budget Goals Yet</h3>
            <p className="text-muted mb-6 max-w-sm mx-auto">Create your first budget goal to start tracking your spending limits and stay on top of your finances.</p>
            <button
              onClick={() => {
                setEditingId(null)
                setFormData({ category: '', limit: '' })
                setShowModal(true)
              }}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:opacity-90 transition-all font-bold"
            >
              Create Your First Budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => {
              const percentage = (budget.spent / budget.limit) * 100
              const remaining = budget.limit - budget.spent

              return (
                <div key={budget.id} className="bg-surface rounded-xl shadow-md p-6 border border-main hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-main">{budget.category}</h3>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-xs text-muted uppercase font-semibold">Spent</p>
                        <p className={`text-xl font-bold ${getProgressTextColor(percentage)}`}>
                          {currency.symbol}{budget.spent.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-xs text-muted uppercase font-semibold">Limit</p>
                        <p className="text-lg font-semibold text-main">{currency.symbol}{budget.limit.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between text-xs font-medium text-muted mb-1.5">
                        <span>Progress</span>
                        <span>{percentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-bg-main rounded-full h-3 border border-main overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center border-t border-main">
                      <span className="text-sm text-muted">Remaining</span>
                      <span className={`text-sm font-bold ${remaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {currency.symbol}{remaining.toFixed(2)}
                      </span>
                    </div>

                    {percentage > 90 && (
                      <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl flex items-center space-x-2">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-xs text-red-600 font-bold">Limit nearly reached!</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-2xl p-8 max-w-md w-full shadow-2xl border border-main animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-6 text-main">{editingId ? 'Edit' : 'Create'} Budget Goal</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-main rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary outline-none"
                  required
                  disabled={editingId}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {editingId && (
                  <p className="text-xs text-muted mt-2 italic">Category cannot be changed for existing goals</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-2">Monthly Limit ({currency.symbol})</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="5000"
                  value={formData.limit}
                  onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                  className="w-full px-4 py-2.5 border border-main rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>

              <div className="bg-bg-main border border-main rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-xl">💡</span>
                  <p className="text-xs text-muted leading-relaxed">
                    Set realistic limits based on your monthly income. We'll alert you when you reach 70% and 90% of your budget to help you save!
                  </p>
                </div>
              </div>

              <div className="flex space-x-4 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-3 rounded-xl hover:opacity-90 transition-all font-bold shadow-lg shadow-primary/20"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingId(null)
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-main py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

