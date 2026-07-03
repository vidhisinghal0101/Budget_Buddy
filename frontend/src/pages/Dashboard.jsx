import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import API_URL from '../config/api'
import ThemeSelector from '../components/ThemeSelector'
import { useTheme } from '../context/ThemeContext'

const FINANCE_QUOTES = [
  { text: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The safe way to double your money is to fold it over once and put it in your pocket.", author: "Kin Hubbard" },
  { text: "Many people take no care of their money till they come nearly to the end of it.", author: "Johann Wolfgang von Goethe" },
  { text: "It’s not how much money you make, but how much money you keep.", author: "Robert Kiyosaki" },
  { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" }
]

const TRANSACTION_CATEGORIES = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Healthcare', 'Salary', 'Other']
const BUDGET_CATEGORIES = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Healthcare', 'Other']

export default function Dashboard({ setIsAuthenticated }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path) => location.pathname === path
  const { colorTheme, currency } = useTheme()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [budgetGoals, setBudgetGoals] = useState([])
  const [loading, setLoading] = useState(true)

  // Modals state
  const [activeModal, setActiveModal] = useState(null) // 'income' | 'expense' | 'budget' | null
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Form states
  const [modalFormData, setModalFormData] = useState({
    name: '',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [modalBudgetData, setModalBudgetData] = useState({
    category: '',
    limit: ''
  })

  const [quote, setQuote] = useState(FINANCE_QUOTES[0])

  const themeColors = {
    emerald: '#10b981',
    blue: '#3b82f6',
    indigo: '#6366f1',
    purple: '#a855f7',
    rose: '#f43f5e',
    amber: '#f59e0b'
  }

  const primaryColor = themeColors[colorTheme] || themeColors.purple

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    // Pick a random quote
    const randomQuote = FINANCE_QUOTES[Math.floor(Math.random() * FINANCE_QUOTES.length)]
    setQuote(randomQuote)

    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        handleLogout()
        return
      }

      const statsRes = await fetch(`${API_URL}/api/transaction/stats/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (statsRes.status === 401 || statsRes.status === 403) {
        handleLogout()
        return
      }
      const statsData = await statsRes.json()
      if (!statsRes.ok) throw new Error(statsData.error || 'Failed to fetch stats')
      setStats(statsData)

      const transRes = await fetch(`${API_URL}/api/transaction?limit=5&sortBy=date&order=desc`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (transRes.status === 401 || transRes.status === 403) {
        handleLogout()
        return
      }
      const transData = await transRes.json()
      if (!transRes.ok) throw new Error(transData.error || 'Failed to fetch transactions')
      setRecentTransactions(transData.transactions)

      const categoryRes = await fetch(`${API_URL}/api/transaction/stats/category`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (categoryRes.status === 401 || categoryRes.status === 403) {
        handleLogout()
        return
      }
      const categoryData = await categoryRes.json()
      if (!categoryRes.ok) throw new Error(categoryData.error || 'Failed to fetch category stats')
      setCategoryData(categoryData)

      const monthlyRes = await fetch(`${API_URL}/api/transaction/stats/monthly`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (monthlyRes.status === 401 || monthlyRes.status === 403) {
        handleLogout()
        return
      }
      const monthlyData = await monthlyRes.json()
      if (!monthlyRes.ok) throw new Error(monthlyData.error || 'Failed to fetch monthly stats')
      setMonthlyData(monthlyData)

      const budgetRes = await fetch(`${API_URL}/api/budget`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (budgetRes.status === 401 || budgetRes.status === 403) {
        handleLogout()
        return
      }
      const budgetData = await budgetRes.json()
      if (!budgetRes.ok) throw new Error(budgetData.error || 'Failed to fetch budget goals')
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

  const handleActionSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    try {
      if (activeModal === 'income' || activeModal === 'expense') {
        const response = await fetch(`${API_URL}/api/transaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: modalFormData.name,
            amount: parseFloat(modalFormData.amount),
            type: activeModal,
            category: modalFormData.category,
            description: modalFormData.description,
            date: modalFormData.date || new Date().toISOString().split('T')[0]
          })
        })
        if (!response.ok) {
          const errData = await response.json()
          throw new Error(errData.error || 'Failed to add transaction')
        }
      } else if (activeModal === 'budget') {
        const response = await fetch(`${API_URL}/api/budget`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            category: modalBudgetData.category,
            limit: parseFloat(modalBudgetData.limit)
          })
        })
        if (!response.ok) {
          const errData = await response.json()
          throw new Error(errData.error || 'Failed to create budget')
        }
      }

      // Success
      setActiveModal(null)
      setModalFormData({
        name: '',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      })
      setModalBudgetData({
        category: '',
        limit: ''
      })
      fetchDashboardData()
    } catch (err) {
      alert(err.message)
    }
  }

  // Compute stats/insights
  const getInsight = () => {
    if (monthlyData.length >= 2) {
      const currentMonth = monthlyData[monthlyData.length - 1]
      const prevMonth = monthlyData[monthlyData.length - 2]
      if (prevMonth.expense > 0) {
        const diff = ((currentMonth.expense - prevMonth.expense) / prevMonth.expense) * 100
        if (diff < 0) {
          return `You spent ${Math.abs(diff).toFixed(0)}% less than last month. Excellent job keeping your expenses low!`
        } else if (diff > 0) {
          return `Your spending increased by ${diff.toFixed(0)}% compared to last month. Consider reviewing your categories.`
        }
      }
    }
    return "Track your income and expenses to unlock AI-powered personal finance insights here."
  }

  const getGreeting = () => {
    const hrs = new Date().getHours()
    if (hrs < 12) return 'Good morning'
    if (hrs < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Premium Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-main/80 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-lg">{currency.symbol}</span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-main">Budget Buddy</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`px-3.5 py-1.5 rounded-lg text-sm transition-all duration-300 font-semibold border-b-2 ${
                    isActive('/dashboard') || isActive('/')
                      ? 'text-primary font-bold border-primary'
                      : 'text-main hover:text-muted hover:bg-main/5 border-transparent'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/transactions')}
                  className={`px-3.5 py-1.5 rounded-lg text-sm transition-all duration-300 font-semibold border-b-2 ${
                    isActive('/transactions')
                      ? 'text-primary font-bold border-primary'
                      : 'text-main hover:text-muted hover:bg-main/5 border-transparent'
                  }`}
                >
                  Transactions
                </button>
                <button
                  onClick={() => navigate('/budget')}
                  className={`px-3.5 py-1.5 rounded-lg text-sm transition-all duration-300 font-semibold border-b-2 ${
                    isActive('/budget')
                      ? 'text-primary font-bold border-primary'
                      : 'text-main hover:text-muted hover:bg-main/5 border-transparent'
                  }`}
                >
                  Budget
                </button>
                <button
                  onClick={() => navigate('/converter')}
                  className={`px-3.5 py-1.5 rounded-lg text-sm transition-all duration-300 font-semibold border-b-2 ${
                    isActive('/converter')
                      ? 'text-primary font-bold border-primary'
                      : 'text-main hover:text-muted hover:bg-main/5 border-transparent'
                  }`}
                >
                  Converter
                </button>
              </div>
              <ThemeSelector />
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {loading ? (
        <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-20">
          <div className="flex flex-col items-center justify-center h-[50vh] space-y-5">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            </div>
            <p className="text-muted text-sm font-semibold tracking-wide animate-pulse">
              Loading dashboard analytics...
            </p>
          </div>
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 space-y-12">

          {/* Dashboard Hero Section */}
          <section className="glass-card p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-widest font-semibold text-primary">{getFormattedDate()}</p>
                <h1 className="text-4xl font-extrabold tracking-tight text-main">
                  {getGreeting()}, {user?.name || 'User'}
                </h1>
              </div>
              <div className="pt-2 border-t border-main/50">
                <blockquote className="text-sm italic text-muted font-medium">
                  "{quote.text}"
                </blockquote>
                <cite className="text-xs font-semibold text-primary block mt-1 not-italic">— {quote.author}</cite>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="flex flex-row md:flex-col lg:flex-row items-stretch gap-3 w-full md:w-auto">
              <button
                onClick={() => {
                  setActiveModal('income')
                  setModalFormData({ ...modalFormData, type: 'income', name: '', amount: '', category: '', description: '' })
                }}
                className="flex-1 px-5 py-3 rounded-xl bg-income/10 hover:bg-income/20 text-income font-bold text-sm tracking-wide transition-all border border-income/20 text-center"
              >
                + Add Income
              </button>
              <button
                onClick={() => {
                  setActiveModal('expense')
                  setModalFormData({ ...modalFormData, type: 'expense', name: '', amount: '', category: '', description: '' })
                }}
                className="flex-1 px-5 py-3 rounded-xl bg-expense/10 hover:bg-expense/20 text-expense font-bold text-sm tracking-wide transition-all border border-expense/20 text-center"
              >
                + Add Expense
              </button>
              <button
                onClick={() => {
                  setActiveModal('budget')
                  setModalBudgetData({ category: '', limit: '' })
                }}
                className="flex-1 px-5 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary-text font-bold text-sm tracking-wide transition-all border border-primary/20 text-center"
              >
                + Create Budget
              </button>
            </div>
          </section>

          {/* AI Spending Insight Banner */}
          {monthlyData.length >= 2 && (
            <section className="glass-card p-6 bg-primary/5 border border-primary/20 flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl shrink-0">
                ✨
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-main">Smart Spending Insight</h4>
                <p className="text-sm text-muted">{getInsight()}</p>
              </div>
            </section>
          )}

          {/* Financial Summary 4-Column Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Total Income */}
            <div className="glass-card p-8 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted uppercase tracking-wider">Total Income</p>
                <p className="text-3xl font-extrabold tracking-tight text-income">
                  {currency.symbol}{(stats?.totalIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted font-medium mt-1">{stats?.incomeCount || 0} deposits</p>
              </div>
              <div className="w-12 h-12 bg-income/10 rounded-2xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-income" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
            </div>

            {/* Total Expenses */}
            <div className="glass-card p-8 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted uppercase tracking-wider">Total Expenses</p>
                <p className="text-3xl font-extrabold tracking-tight text-expense">
                  {currency.symbol}{(stats?.totalExpenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted font-medium mt-1">{stats?.expenseCount || 0} bills</p>
              </div>
              <div className="w-12 h-12 bg-expense/10 rounded-2xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-expense" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              </div>
            </div>

            {/* Net Balance */}
            <div className="glass-card p-8 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted uppercase tracking-wider">Current Balance</p>
                <p className="text-3xl font-extrabold tracking-tight text-balance">
                  {currency.symbol}{(stats?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted font-medium mt-1">Net savings</p>
              </div>
              <div className="w-12 h-12 bg-balance/10 rounded-2xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-balance" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Estimated In-Hand */}
            <div className="glass-card p-8 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted uppercase tracking-wider">Estimated In-Hand</p>
                <p className="text-3xl font-extrabold tracking-tight text-in-hand">
                  {currency.symbol}{(stats?.estimatedInHand || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted font-medium mt-1">After salary + stats</p>
              </div>
              <div className="w-12 h-12 bg-in-hand/10 rounded-2xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-in-hand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
          </section>

          {/* Charts Row */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Expense Breakdown Pie Chart */}
            <div className="glass-card p-8 flex flex-col justify-between">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-main">Expense by Category</h3>
                <p className="text-xs text-muted font-medium">Distribution of current expenses</p>
              </div>
              {categoryData.length > 0 ? (
                <div className="h-[300px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={90}
                        fill={primaryColor}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'var(--box-bg)', backdropFilter: 'blur(16px)', borderRadius: '12px', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-muted space-y-2">
                  <span className="text-3xl">📊</span>
                  <p className="text-sm font-medium">No category breakdown available</p>
                </div>
              )}
            </div>

            {/* Monthly Trend Line Chart */}
            <div className="glass-card p-8 flex flex-col justify-between">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-main">Monthly Trends</h3>
                <p className="text-xs text-muted font-medium">Monthly income vs expense analysis</p>
              </div>
              {monthlyData.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData} margin={{ left: -10, right: 10, top: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.3} />
                      <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} />
                      <YAxis stroke="var(--text-muted)" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--box-bg)', backdropFilter: 'blur(16px)', borderRadius: '12px', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
                      <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-muted space-y-2">
                  <span className="text-3xl">📈</span>
                  <p className="text-sm font-medium">No trend records found</p>
                </div>
              )}
            </div>
          </section>

          {/* Details Row: Budget Goals & Recent Transactions */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Budget Goals Card */}
            <div className="glass-card p-8 lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-main">Budget Goals</h3>
                    <p className="text-xs text-muted font-medium">Monthly limits track</p>
                  </div>
                  <button
                    onClick={() => navigate('/budget')}
                    className="text-xs font-bold text-primary hover:opacity-85 border border-primary/20 px-3.5 py-1.5 rounded-lg bg-primary/5 transition-all"
                  >
                    Manage
                  </button>
                </div>

                {budgetGoals.length > 0 ? (
                  <div className="space-y-5">
                    {budgetGoals.map((goal) => {
                      const percentage = (goal.spent / goal.limit) * 100
                      return (
                        <div key={goal.id} className="space-y-1.5">
                          <div className="flex justify-between text-sm">
                            <span className="font-semibold text-main">{goal.category}</span>
                            <span className="text-muted font-medium text-xs">
                              {currency.symbol}{goal.spent.toFixed(0)} / {currency.symbol}{goal.limit.toFixed(0)}
                            </span>
                          </div>
                          <div className="w-full bg-main/20 rounded-full h-2 overflow-hidden border border-main/10">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-orange-500' : 'bg-primary'
                                }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-3">
                    <p className="text-sm text-muted">No budget limits defined yet.</p>
                    <button
                      onClick={() => setActiveModal('budget')}
                      className="text-xs font-bold text-primary hover:opacity-85 border border-primary/20 px-4 py-2 rounded-lg bg-primary/5 transition-all"
                    >
                      Set First Budget Limit
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Transactions List */}
            <div className="glass-card p-8 lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-main">Recent Activity</h3>
                    <p className="text-xs text-muted font-medium">Your latest logs</p>
                  </div>
                  <button
                    onClick={() => navigate('/transactions')}
                    className="text-xs font-bold text-primary hover:opacity-85 border border-primary/20 px-3.5 py-1.5 rounded-lg bg-primary/5 transition-all"
                  >
                    View All
                  </button>
                </div>

                {recentTransactions.length > 0 ? (
                  <div className="divide-y divide-main/40">
                    {recentTransactions.map((t) => (
                      <div key={t.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.type === 'income'
                              ? 'bg-income/10 text-income'
                              : 'bg-expense/10 text-expense'
                            }`}>
                            <span className="text-sm font-bold">
                              {t.type === 'income' ? '↑' : '↓'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-main">{t.name}</p>
                            <p className="text-xs text-muted font-medium">{t.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-extrabold ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
                            {t.type === 'income' ? '+' : '-'}{currency.symbol}{t.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted font-medium">
                            {new Date(t.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-3">
                    <p className="text-sm text-muted font-medium">No recent logs recorded.</p>
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => {
                          setActiveModal('income')
                          setModalFormData({ ...modalFormData, type: 'income', name: '', amount: '', category: '', description: '' })
                        }}
                        className="text-xs font-bold text-income hover:opacity-85 border border-income/20 px-3 py-1.5 rounded-lg bg-income/5 transition-all"
                      >
                        + Add Income
                      </button>
                      <button
                        onClick={() => {
                          setActiveModal('expense')
                          setModalFormData({ ...modalFormData, type: 'expense', name: '', amount: '', category: '', description: '' })
                        }}
                        className="text-xs font-bold text-expense hover:opacity-85 border border-expense/20 px-3 py-1.5 rounded-lg bg-expense/5 transition-all"
                      >
                        + Add Expense
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Account Settings / Delete Option */}
          <section className="flex justify-center pt-4">
            <button
              onClick={() => { setShowDeleteModal(true); setDeletePassword(''); setDeleteError('') }}
              className="px-6 py-2.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all font-semibold text-xs tracking-wider uppercase"
            >
              Delete Account
            </button>
          </section>
        </main>
      )}

      {/* Unified action modal overlay */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="glass-card p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold tracking-tight text-main capitalize">
                {activeModal === 'income' ? 'Add Income Record' : activeModal === 'expense' ? 'Add Expense Record' : 'Define Budget Limit'}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-muted hover:text-main text-xl font-bold p-1 transition-colors"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleActionSubmit} className="space-y-4">
              {activeModal === 'budget' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Category</label>
                    <select
                      value={modalBudgetData.category}
                      onChange={(e) => setModalBudgetData({ ...modalBudgetData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-main rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
                      required
                    >
                      <option value="">Select Category</option>
                      {BUDGET_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Monthly Limit ({currency.symbol})</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 5000"
                      value={modalBudgetData.limit}
                      onChange={(e) => setModalBudgetData({ ...modalBudgetData, limit: e.target.value })}
                      className="w-full px-4 py-3 border border-main rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Description Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Shopping or Salary Payment"
                      value={modalFormData.name}
                      onChange={(e) => setModalFormData({ ...modalFormData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-main rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Amount ({currency.symbol})</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={modalFormData.amount}
                        onChange={(e) => setModalFormData({ ...modalFormData, amount: e.target.value })}
                        className="w-full px-4 py-3 border border-main rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Category</label>
                      <select
                        value={modalFormData.category}
                        onChange={(e) => setModalFormData({ ...modalFormData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-main rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
                        required
                      >
                        <option value="">Select</option>
                        {TRANSACTION_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Date</label>
                    <input
                      type="date"
                      value={modalFormData.date}
                      onChange={(e) => setModalFormData({ ...modalFormData, date: e.target.value })}
                      className="w-full px-4 py-3 border border-main rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Notes (Optional)</label>
                    <textarea
                      placeholder="Add simple context notes..."
                      value={modalFormData.description}
                      onChange={(e) => setModalFormData({ ...modalFormData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-main rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
                      rows="2"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-3 rounded-xl border border-main text-muted hover:text-main hover:bg-main/5 transition-all text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-3 rounded-xl hover:opacity-90 transition-all font-bold text-sm tracking-wide shadow-lg shadow-primary/25"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="glass-card p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-red-500/20">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-red-500/10 rounded-full mb-4">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-main">Delete Account</h2>
              <p className="text-sm text-muted mt-2">
                This will permanently delete your account, all transactions, and budget goals. This action <span className="font-bold text-red-500">cannot be undone</span>.
              </p>
            </div>

            {deleteError && (
              <div className="bg-red-500/10 border border-red-500/25 text-red-500 px-4 py-3 rounded-xl text-sm mb-4">
                {deleteError}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">
                Enter your password to confirm
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full px-4 py-3 border border-main rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm transition-all"
                placeholder="Your password"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setDeletePassword(''); setDeleteError('') }}
                className="flex-1 py-3 rounded-xl border border-main text-muted hover:text-main hover:bg-main/5 transition-all text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
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
