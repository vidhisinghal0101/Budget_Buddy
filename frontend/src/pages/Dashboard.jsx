import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import API_URL from '../config/api'
import ThemeSelector from '../components/ThemeSelector'
import { useTheme } from '../context/ThemeContext'

export default function Dashboard({ setIsAuthenticated }) {
  const navigate = useNavigate()
  const { colorTheme, currency } = useTheme()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [budgetGoals, setBudgetGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  const themeColors = {
    emerald: '#10b981',
    blue: '#3b82f6',
    indigo: '#6366f1',
    purple: '#a855f7',
    rose: '#f43f5e',
    amber: '#f59e0b'
  }

  const primaryColor = themeColors[colorTheme] || themeColors.emerald

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')

      const statsRes = await fetch(`${API_URL}/api/transaction/stats/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const statsData = await statsRes.json()
      setStats(statsData)

      const transRes = await fetch(`${API_URL}/api/transaction?limit=5&sortBy=date&order=desc`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const transData = await transRes.json()
      setRecentTransactions(transData.transactions)

      const categoryRes = await fetch(`${API_URL}/api/transaction/stats/category`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const categoryData = await categoryRes.json()
      setCategoryData(categoryData)

      const monthlyRes = await fetch(`${API_URL}/api/transaction/stats/monthly`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const monthlyData = await monthlyRes.json()
      setMonthlyData(monthlyData)

      const budgetRes = await fetch(`${API_URL}/api/budget`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const budgetData = await budgetRes.json()
      setBudgetGoals(budgetData)

      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    navigate('/login')
  }

  const handleDeleteAccount = async () => {
    setDeleteError('')
    if (!deletePassword) {
      setDeleteError('Please enter your password')
      return
    }
    setDeleteLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ password: deletePassword })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to delete account')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setIsAuthenticated(false)
      navigate('/login')
    } catch (err) {
      setDeleteError(err.message)
    } finally {
      setDeleteLoading(false)
    }
  }

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
                  onClick={() => navigate('/transactions')}
                  className="px-3 py-2 text-muted hover:text-main transition-colors font-medium"
                >
                  Transactions
                </button>
                <button
                  onClick={() => navigate('/budget')}
                  className="px-3 py-2 text-muted hover:text-main transition-colors font-medium"
                >
                  Budget
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
                onClick={() => { setShowDeleteModal(true); setDeletePassword(''); setDeleteError('') }}
                className="px-4 py-2 border border-red-400 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition duration-200 font-medium text-sm"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <svg
              className="w-12 h-12 animate-spin text-gray-800 dark:text-gray-100"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="bg-primary rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'User'}!</h1>
                  <p className="mt-2 text-white text-opacity-80">Here's your financial overview</p>
                </div>
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : '₹'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-surface rounded-xl p-6 shadow-md border-l-4 border-emerald-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted">Total Income</p>
                      <p className="text-2xl font-bold text-emerald-600">{currency.symbol}{stats.totalIncome.toFixed(2)}</p>
                      <p className="text-xs text-muted mt-1">{stats.incomeCount || 0} transactions</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 dark:bg-opacity-20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-surface rounded-xl p-6 shadow-md border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted">Total Expenses</p>
                      <p className="text-2xl font-bold text-red-600">{currency.symbol}{stats.totalExpenses.toFixed(2)}</p>
                      <p className="text-xs text-muted mt-1">{stats.expenseCount || 0} transactions</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900 dark:bg-opacity-20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-surface rounded-xl p-6 shadow-md border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted">Current Balance</p>
                      <p className="text-2xl font-bold text-blue-600">{currency.symbol}{stats.balance.toFixed(2)}</p>
                      <p className="text-xs text-muted mt-1">Net savings</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-surface rounded-xl p-6 shadow-md border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted">Estimated In-Hand</p>
                      <p className="text-2xl font-bold text-orange-600">{currency.symbol}{stats.estimatedInHand.toFixed(2)}</p>
                      <p className="text-xs text-muted mt-1">After all expenses</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 dark:bg-opacity-20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Category Breakdown Pie Chart */}
              <div className="bg-surface rounded-xl p-6 shadow-md border border-main">
                <h3 className="text-lg font-semibold text-main mb-4">Expense by Category</h3>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill={primaryColor}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted">
                    No expense data yet
                  </div>
                )}
              </div>

              {/* Monthly Trend Line Chart */}
              <div className="bg-surface rounded-xl p-6 shadow-md border border-main">
                <h3 className="text-lg font-semibold text-main mb-4">Monthly Trends</h3>
                {monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                      <XAxis dataKey="month" stroke="var(--text-muted)" />
                      <YAxis stroke="var(--text-muted)" />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} />
                      <Legend />
                      <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                      <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted">
                    No monthly data yet
                  </div>
                )}
              </div>
            </div>

            {/* Budget Goals & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Budget Goals */}
              <div className="bg-surface rounded-xl p-6 shadow-md border border-main">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-main">Budget Goals</h3>
                  <button
                    onClick={() => navigate('/transactions')}
                    className="text-sm text-primary hover:opacity-80"
                  >
                    Manage
                  </button>
                </div>
                {budgetGoals.length > 0 ? (
                  <div className="space-y-4">
                    {budgetGoals.map((goal) => {
                      const percentage = (goal.spent / goal.limit) * 100
                      return (
                        <div key={goal.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-main">{goal.category}</span>
                            <span className="text-muted">
                              {currency.symbol}{goal.spent.toFixed(0)} / {currency.symbol}{goal.limit.toFixed(0)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-orange-500' : 'bg-primary'
                                }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted">
                    <p>No budget goals set</p>
                    <button
                      onClick={() => navigate('/transactions')}
                      className="mt-2 text-primary hover:opacity-80 text-sm font-medium"
                    >
                      Create your first goal
                    </button>
                  </div>
                )}
              </div>

              {/* Recent Transactions */}
              <div className="bg-surface rounded-xl p-6 shadow-md border border-main">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-main">Recent Transactions</h3>
                  <button
                    onClick={() => navigate('/transactions')}
                    className="text-sm text-primary hover:opacity-80"
                  >
                    View All
                  </button>
                </div>
                {recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {recentTransactions.map((t) => (
                      <div key={t.id} className="flex items-center justify-between p-3 bg-bg-main bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-40 rounded-lg border border-main border-opacity-50">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900 dark:bg-opacity-20' : 'bg-red-100 dark:bg-red-900 dark:bg-opacity-20'
                            }`}>
                            <span className="text-lg">
                              {t.type === 'income' ? '↑' : '↓'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-main">{t.name}</p>
                            <p className="text-xs text-muted">{t.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {t.type === 'income' ? '+' : '-'}{currency.symbol}{t.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted">
                            {new Date(t.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted">
                    <p>No transactions yet</p>
                    <button
                      onClick={() => navigate('/transactions')}
                      className="mt-2 text-primary hover:opacity-80 text-sm font-medium"
                    >
                      Add your first transaction
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Bottom actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
          >
            Logout
          </button>
          <button
            onClick={() => { setShowDeleteModal(true); setDeletePassword(''); setDeleteError('') }}
            className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-red-200">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mb-4">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Delete Account</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                This will permanently delete your account, all transactions, and budget goals. This action <span className="font-bold text-red-600">cannot be undone</span>.
              </p>
            </div>

            {deleteError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                {deleteError}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter your password to confirm
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition text-gray-900"
                placeholder="Your password"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setDeletePassword(''); setDeleteError('') }}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

