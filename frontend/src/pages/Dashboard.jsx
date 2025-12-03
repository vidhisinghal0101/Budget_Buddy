import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Dashboard({ setIsAuthenticated }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [budgetGoals, setBudgetGoals] = useState([])
  const [loading, setLoading] = useState(true)

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
      
      // Fetch stats
      const statsRes = await fetch('http://localhost:4000/api/transaction/stats/summary', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const statsData = await statsRes.json()
      setStats(statsData)

      // Fetch recent transactions
      const transRes = await fetch('http://localhost:4000/api/transaction?limit=5&sortBy=date&order=desc', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const transData = await transRes.json()
      setRecentTransactions(transData.transactions)

      // Fetch category breakdown
      const categoryRes = await fetch('http://localhost:4000/api/transaction/stats/category', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const categoryData = await categoryRes.json()
      setCategoryData(categoryData)

      // Fetch monthly trends
      const monthlyRes = await fetch('http://localhost:4000/api/transaction/stats/monthly', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const monthlyData = await monthlyRes.json()
      setMonthlyData(monthlyData)

      // Fetch budget goals
      const budgetRes = await fetch('http://localhost:4000/api/budget', {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">₹</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-800">Budget Buddy</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/transactions')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Transactions
              </button>
              <button
                onClick={() => navigate('/budget')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Budget
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-gray-600">Loading dashboard...</div>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-xl p-8 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'User'}!</h1>
                  <p className="mt-2 text-emerald-100">Here's your financial overview</p>
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
                <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-emerald-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Income</p>
                      <p className="text-2xl font-bold text-emerald-600">₹{stats.totalIncome.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 mt-1">{stats.incomeCount || 0} transactions</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Expenses</p>
                      <p className="text-2xl font-bold text-red-600">₹{stats.totalExpenses.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 mt-1">{stats.expenseCount || 0} transactions</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Current Balance</p>
                      <p className="text-2xl font-bold text-blue-600">₹{stats.balance.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 mt-1">Net savings</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Estimated In-Hand</p>
                      <p className="text-2xl font-bold text-orange-600">₹{stats.estimatedInHand.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 mt-1">After all expenses</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
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
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense by Category</h3>
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
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    No expense data yet
                  </div>
                )}
              </div>

              {/* Monthly Trend Line Chart */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Trends</h3>
                {monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    No monthly data yet
                  </div>
                )}
              </div>
            </div>

            {/* Budget Goals & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Budget Goals */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Budget Goals</h3>
                  <button
                    onClick={() => navigate('/transactions')}
                    className="text-sm text-emerald-600 hover:text-emerald-700"
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
                            <span className="font-medium">{goal.category}</span>
                            <span className="text-gray-600">
                              ₹{goal.spent.toFixed(0)} / ₹{goal.limit.toFixed(0)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-orange-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No budget goals set</p>
                    <button
                      onClick={() => navigate('/transactions')}
                      className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm"
                    >
                      Create your first goal
                    </button>
                  </div>
                )}
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
                  <button
                    onClick={() => navigate('/transactions')}
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    View All
                  </button>
                </div>
                {recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {recentTransactions.map((t) => (
                      <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            t.type === 'income' ? 'bg-emerald-100' : 'bg-red-100'
                          }`}>
                            <span className="text-lg">
                              {t.type === 'income' ? '↑' : '↓'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{t.name}</p>
                            <p className="text-xs text-gray-500">{t.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(t.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No transactions yet</p>
                    <button
                      onClick={() => navigate('/transactions')}
                      className="mt-2 text-emerald-600 hover:text-emerald-700 text-sm"
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
    </div>
  )
}
