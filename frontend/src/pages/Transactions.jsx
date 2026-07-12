import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import API_URL from '../config/api'
import ThemeSelector from '../components/ThemeSelector'
import { useTheme } from '../context/ThemeContext'

export default function Transactions() {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path) => location.pathname === path
  const { currency } = useTheme()
  const [transactions, setTransactions] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // Filters
  const [search, setSearch] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [order, setOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'expense',
    category: '',
    description: ''
  })

  const categories = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Healthcare', 'Salary', 'Other']

  useEffect(() => {
    fetchTransactions()
    fetchStats()
  }, [search, minAmount, maxAmount, typeFilter, categoryFilter, sortBy, order, page])

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        page,
        limit: 10,
        sortBy,
        order,
        ...(search && { search }),
        ...(minAmount && { minAmount }),
        ...(maxAmount && { maxAmount }),
        ...(typeFilter && { type: typeFilter }),
        ...(categoryFilter && { category: categoryFilter })
      })

      const response = await fetch(`${API_URL}/api/transaction?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setTransactions(data.transactions)
      setPagination(data.pagination)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/transaction/stats/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const url = editingId
        ? `${API_URL}/api/transaction/${editingId}`
        : `${API_URL}/api/transaction`

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
        setFormData({ name: '', amount: '', type: 'expense', category: '', description: '' })
        fetchTransactions()
        fetchStats()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return
    try {
      const token = localStorage.getItem('token')
      await fetch(`${API_URL}/api/transaction/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchTransactions()
      fetchStats()
    } catch (error) {
      console.error(error)
    }
  }

  const handleEdit = (transaction) => {
    setEditingId(transaction.id)
    setFormData({
      name: transaction.name,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      description: transaction.description || ''
    })
    setShowModal(true)
  }

  const resetFilters = () => {
    setSearch('')
    setMinAmount('')
    setMaxAmount('')
    setTypeFilter('')
    setCategoryFilter('')
    setPage(1)
  }

  // Removed if (loading) return

  return (
    <div className="min-h-screen pb-16">
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
                <button
                  onClick={() => navigate('/savings')}
                  className={`px-3.5 py-1.5 rounded-lg text-sm transition-all duration-300 font-semibold border-b-2 ${
                    isActive('/savings')
                      ? 'text-primary font-bold border-primary'
                      : 'text-main hover:text-muted hover:bg-main/5 border-transparent'
                  }`}
                >
                  Vaults
                </button>
              </div>
              <ThemeSelector />
              <button
                onClick={() => {
                  localStorage.clear()
                  navigate('/')
                }}
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
              Loading transactions...
            </p>
          </div>
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-6">
              <p className="text-sm text-muted">Total Income</p>
              <p className="text-2xl font-bold text-income">{currency.symbol}{stats.totalIncome.toFixed(2)}</p>
            </div>
            <div className="glass-card p-6">
              <p className="text-sm text-muted">Total Expenses</p>
              <p className="text-2xl font-bold text-expense">{currency.symbol}{stats.totalExpenses.toFixed(2)}</p>
            </div>
            <div className="glass-card p-6">
              <p className="text-sm text-muted">Balance</p>
              <p className="text-2xl font-bold text-balance">{currency.symbol}{stats.balance.toFixed(2)}</p>
            </div>
            <div className="glass-card p-6">
              <p className="text-sm text-muted">Estimated In-Hand</p>
              <p className="text-2xl font-bold text-in-hand">{currency.symbol}{stats.estimatedInHand.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="glass-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-main rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
            <input
              type="number"
              placeholder="Min amount"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="px-4 py-2 border border-main rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
            <input
              type="number"
              placeholder="Max amount"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="px-4 py-2 border border-main rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-main rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-main rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-main rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="name">Sort by Name</option>
            </select>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="px-4 py-2 border border-main rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-white text-gray-900 border border-main rounded-lg hover:bg-gray-100 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={() => {
                setEditingId(null)
                setFormData({ name: '', amount: '', type: 'expense', category: '', description: '' })
                setShowModal(true)
              }}
              className="px-4 py-2 bg-primary text-inverse rounded-lg hover:opacity-90 transition-opacity ml-auto font-medium"
            >
              + Add Transaction
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-main border-b border-main">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-main">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-bg-main transition-colors">
                    <td className="px-6 py-4 text-main">{t.name}</td>
                    <td className={`px-6 py-4 font-semibold ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
                      {currency.symbol}{t.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.type === 'income' ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-main">{t.category}</td>
                    <td className="px-6 py-4 text-muted">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 space-x-3">
                      <button onClick={() => handleEdit(t)} className="text-blue-500 hover:text-blue-700 transition-colors font-medium">Edit</button>
                      <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700 transition-colors font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-6 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-surface text-main border border-main rounded-lg disabled:opacity-30 hover:bg-bg-main transition-colors"
            >
              Previous
            </button>
            <span className="text-muted font-medium">Page {page} of {pagination.totalPages}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= pagination.totalPages}
              className="px-4 py-2 bg-surface text-main border border-main rounded-lg disabled:opacity-30 hover:bg-bg-main transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </main>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-6 text-main">{editingId ? 'Edit' : 'Add'} Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Transaction Name</label>
                <input
                  type="text"
                  placeholder="e.g. Grocery Shopping"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-main rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Amount ({currency.symbol})</label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2.5 border border-main rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-main rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary outline-none"
                    required
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-main rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary outline-none"
                    required
                  >
                    <option value="">Select</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Description (Optional)</label>
                <textarea
                  placeholder="Notes about this transaction..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-main rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-primary outline-none transition-all"
                  rows="3"
                />
              </div>
              <div className="flex space-x-4 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-3 rounded-xl hover:opacity-90 transition-opacity font-bold shadow-lg shadow-primary/20"
                >
                  {editingId ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingId(null)
                  }}
                  className="flex-1 bg-surface text-main border border-main py-3 rounded-xl hover:bg-bg-main transition-colors font-bold"
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

