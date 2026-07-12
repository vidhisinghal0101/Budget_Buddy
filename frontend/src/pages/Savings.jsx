import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import API_URL from '../config/api'
import ThemeSelector from '../components/ThemeSelector'
import { useTheme } from '../context/ThemeContext'

export default function Savings() {
  const [vaults, setVaults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create' or 'edit'
  const [selectedVault, setSelectedVault] = useState(null)
  
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [transactionType, setTransactionType] = useState('deposit') // 'deposit' or 'withdraw'
  const [transactionAmount, setTransactionAmount] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    color: 'primary',
    targetDate: ''
  })
  
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path) => location.pathname === path
  const { currency } = useTheme()

  const colors = [
    { id: 'red', bg: 'bg-red-500', text: 'text-red-500' },
    { id: 'green', bg: 'bg-green-500', text: 'text-green-500' },
    { id: 'blue', bg: 'bg-blue-500', text: 'text-blue-500' },
    { id: 'yellow', bg: 'bg-yellow-400', text: 'text-yellow-400' },
    { id: 'purple', bg: 'bg-purple-500', text: 'text-purple-500' },
    { id: 'pink', bg: 'bg-pink-500', text: 'text-pink-500' },
    { id: 'teal', bg: 'bg-teal-500', text: 'text-teal-500' },
    { id: 'orange', bg: 'bg-orange-500', text: 'text-orange-500' },
  ]

  const fetchVaults = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return navigate('/')

      const res = await fetch(`${API_URL}/api/savings`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.status === 401 || res.status === 403) {
        localStorage.clear()
        navigate('/')
        return
      }
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch vaults')
      
      setVaults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVaults()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const token = localStorage.getItem('token')
      const url = modalMode === 'create' 
        ? `${API_URL}/api/savings`
        : `${API_URL}/api/savings/${selectedVault.id}`
        
      const method = modalMode === 'create' ? 'POST' : 'PUT'
      
      const payload = { ...formData }
      if (modalMode === 'create' && !payload.currentAmount) {
        payload.currentAmount = 0
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save vault')
      
      setShowModal(false)
      fetchVaults()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vault? Funds inside will just be returned to your general balance.')) return
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/savings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to delete vault')
      fetchVaults()
    } catch (err) {
      setError(err.message)
    }
  }

  const openCreateModal = () => {
    setModalMode('create')
    setFormData({ name: '', targetAmount: '', currentAmount: '', color: 'blue', targetDate: '' })
    setSelectedVault(null)
    setShowModal(true)
  }

  const openEditModal = (vault) => {
    setModalMode('edit')
    setFormData({
      name: vault.name,
      targetAmount: vault.targetAmount,
      currentAmount: vault.currentAmount,
      color: vault.color,
      targetDate: vault.targetDate ? vault.targetDate.split('T')[0] : ''
    })
    setSelectedVault(vault)
    setShowModal(true)
  }

  const handleDepositWithdraw = (vault, type) => {
    setSelectedVault(vault)
    setTransactionType(type)
    setTransactionAmount('')
    setShowTransactionModal(true)
  }

  const submitTransaction = async (e) => {
    e.preventDefault()
    if (!selectedVault) return
    
    const amount = parseFloat(transactionAmount)
    if (isNaN(amount) || amount <= 0) return alert('Invalid amount')

    let newAmount = selectedVault.currentAmount
    if (transactionType === 'deposit') newAmount += amount
    else newAmount = Math.max(0, newAmount - amount)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/savings/${selectedVault.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentAmount: newAmount })
      })
      if (!res.ok) throw new Error(`Failed to ${transactionType}`)
      setShowTransactionModal(false)
      fetchVaults()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Navigation */}
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
              Loading savings vaults...
            </p>
          </div>
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black mb-1">Savings Vaults</h1>
            <p className="text-secondary text-sm font-medium">Create goals and track your savings progress</p>
          </div>
          <button 
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 whitespace-nowrap"
          >
            + Create Vault
          </button>
        </div>

        {error && (
          <div className="bg-expense/10 border border-expense/30 text-expense px-4 py-3 rounded-xl text-sm font-medium mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaults.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-surface rounded-3xl border border-main/80">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-main mb-2">No Vaults Yet</h3>
              <p className="text-secondary font-medium mb-6">Create a savings goal to start tracking your progress!</p>
              <button 
                onClick={openCreateModal}
                className="px-6 py-2.5 bg-surface-hover text-primary font-bold rounded-xl border border-primary/30 hover:bg-primary/10 transition-colors"
              >
                Create First Vault
              </button>
            </div>
          ) : (
            vaults.map(vault => {
              const progress = Math.min(100, Math.round((vault.currentAmount / vault.targetAmount) * 100))
              const isCompleted = progress >= 100
              const colorObj = colors.find(c => c.id === vault.color) || colors[0]

              return (
                <div key={vault.id} className="bg-surface rounded-3xl p-6 border border-main/80 hover:border-primary/50 transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5 group relative overflow-hidden">
                  {/* Background Glow */}
                  <div className={`absolute -top-24 -right-24 w-48 h-48 ${colorObj.bg} opacity-[0.03] rounded-full blur-3xl group-hover:opacity-[0.08] transition-opacity duration-500`}></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-2xl">{isCompleted ? '🎉' : '🎯'}</span>
                        <h3 className="text-xl font-bold text-main">{vault.name}</h3>
                      </div>
                      {vault.targetDate && (
                        <p className="text-xs font-bold text-secondary uppercase tracking-wider">
                          Target: {new Date(vault.targetDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(vault)} className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-secondary hover:text-primary transition-colors" title="Edit Vault">✎</button>
                      <button onClick={() => handleDelete(vault.id)} className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-secondary hover:text-expense transition-colors" title="Delete Vault">✕</button>
                    </div>
                  </div>

                  <div className="mb-6 relative z-10">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <span className="text-3xl font-black text-main">₹{vault.currentAmount.toLocaleString()}</span>
                        <span className="text-secondary font-medium text-sm ml-1">/ ₹{vault.targetAmount.toLocaleString()}</span>
                      </div>
                      <span className={`text-lg font-black ${colorObj.text}`}>{progress}%</span>
                    </div>
                    
                    <div className="w-full h-3 bg-bg-main rounded-full overflow-hidden border border-main/80">
                      <div 
                        className={`h-full ${colorObj.bg} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 relative z-10">
                    <button 
                      onClick={() => handleDepositWithdraw(vault, 'deposit')}
                      className="py-2.5 bg-income/10 hover:bg-income/20 text-income font-bold rounded-xl border border-income/20 transition-colors"
                    >
                      + Deposit
                    </button>
                    <button 
                      onClick={() => handleDepositWithdraw(vault, 'withdraw')}
                      className="py-2.5 bg-expense/10 hover:bg-expense/20 text-expense font-bold rounded-xl border border-expense/20 transition-colors"
                    >
                      - Withdraw
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
        </main>
      )}

      {/* Transaction Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="glass-card p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold tracking-tight text-main capitalize">
                {transactionType} Funds
              </h2>
              <button
                onClick={() => setShowTransactionModal(false)}
                className="text-muted hover:text-main text-xl font-bold p-1 transition-colors"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={submitTransaction} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-secondary mb-1.5 uppercase tracking-wider">Amount ({currency.symbol})</label>
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={transactionAmount}
                  onChange={e => setTransactionAmount(e.target.value)}
                  className="w-full bg-bg-main border border-main/80 text-main rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder={`Amount to ${transactionType}`}
                  required
                  autoFocus
                />
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all capitalize">
                  Confirm {transactionType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-main/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface border border-main/80 p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-secondary hover:text-main transition-colors">✕</button>
            <h2 className="text-2xl font-black mb-6 text-main">
              {modalMode === 'create' ? 'Create Savings Vault' : 'Edit Vault'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-secondary mb-1.5 uppercase tracking-wider">Vault Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-bg-main border border-main/80 text-main rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted"
                  placeholder="e.g. New MacBook"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary mb-1.5 uppercase tracking-wider">Target Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  value={formData.targetAmount}
                  onChange={e => setFormData({...formData, targetAmount: e.target.value})}
                  className="w-full bg-bg-main border border-main/80 text-main rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted"
                  placeholder="e.g. 100000"
                />
              </div>

              {modalMode === 'create' && (
                <div>
                  <label className="block text-xs font-bold text-secondary mb-1.5 uppercase tracking-wider">Initial Deposit (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formData.currentAmount}
                    onChange={e => setFormData({...formData, currentAmount: e.target.value})}
                    className="w-full bg-bg-main border border-main/80 text-main rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted"
                    placeholder="e.g. 5000"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-secondary mb-1.5 uppercase tracking-wider">Target Date (Optional)</label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={e => setFormData({...formData, targetDate: e.target.value})}
                  className="w-full bg-bg-main border border-main/80 text-main rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary mb-2 uppercase tracking-wider">Vault Color</label>
                <div className="flex gap-3">
                  {colors.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setFormData({...formData, color: c.id})}
                      className={`w-8 h-8 rounded-full ${c.bg} ${formData.color === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-surface scale-110' : 'opacity-70 hover:opacity-100'} transition-all`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all">
                  {modalMode === 'create' ? 'Create Vault' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
