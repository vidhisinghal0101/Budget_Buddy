import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Transactions() {
  const navigate = useNavigate()
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

      const response = await fetch(`http://localhost:4000/api/transaction?${params}`, {
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
      const response = await fetch('http://localhost:4000/api/transaction/stats/summary', {
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
        ? `http://localhost:4000/api/transaction/${editingId}`
        : 'http://localhost:4000/api/transaction'
      
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
      await fetch(`http://localhost:4000/api/transaction/${id}`, {
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">₹</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Budget Buddy</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/budget')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Budget
              </button>
              <button
                onClick={() => {
                  localStorage.clear()
                  navigate('/login')
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-emerald-100">
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-emerald-600">₹{stats.totalIncome.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-red-100">
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">₹{stats.totalExpenses.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-blue-100">
              <p className="text-sm text-gray-600">Balance</p>
              <p className="text-2xl font-bold text-blue-600">₹{stats.balance.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-orange-100">
              <p className="text-sm text-gray-600">Estimated In-Hand</p>
              <p className="text-2xl font-bold text-orange-600">₹{stats.estimatedInHand.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Min amount"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Max amount"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="name">Sort by Name</option>
            </select>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Reset Filters
            </button>
            <button
              onClick={() => {
                setEditingId(null)
                setFormData({ name: '', amount: '', type: 'expense', category: '', description: '' })
                setShowModal(true)
              }}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600"
            >
              + Add Transaction
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{t.name}</td>
                  <td className={`px-6 py-4 font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                    ₹{t.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${t.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{t.category}</td>
                  <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button onClick={() => handleEdit(t)} className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {page} of {pagination.totalPages}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= pagination.totalPages}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit' : 'Add'} Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Transaction name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                rows="3"
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600"
                >
                  {editingId ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingId(null)
                  }}
                  className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
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
