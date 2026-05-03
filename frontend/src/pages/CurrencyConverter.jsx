import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeSelector from '../components/ThemeSelector'
import { useTheme } from '../context/ThemeContext'

const SUPPORTED_CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
]

export default function CurrencyConverter({ setIsAuthenticated }) {
  const navigate = useNavigate()
  const { currency } = useTheme()

  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('INR')
  const [amount, setAmount] = useState('1')
  const [result, setResult] = useState(null)
  const [rate, setRate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [allRates, setAllRates] = useState({})

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    navigate('/login')
  }

  const fetchRates = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`)
      if (!res.ok) throw new Error('Failed to fetch rates')
      const data = await res.json()
      if (data.result === 'error') throw new Error(data['error-type'] || 'API error')
      setAllRates(data.rates)
      const fetchedRate = fromCurrency === toCurrency ? 1 : data.rates[toCurrency]
      if (!fetchedRate) throw new Error(`Rate for ${toCurrency} not available`)
      setRate(fetchedRate)
      setResult((parseFloat(amount) * fetchedRate).toFixed(4))
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      setError(err.message || 'Could not fetch exchange rates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      fetchRates()
    }
  }, [fromCurrency, toCurrency])

  useEffect(() => {
    if (rate && amount) {
      setResult((parseFloat(amount) * rate).toFixed(4))
    }
  }, [amount, rate])

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setResult(null)
    setRate(null)
  }

  const popularPairs = [
    { from: 'USD', to: 'INR' },
    { from: 'EUR', to: 'INR' },
    { from: 'GBP', to: 'INR' },
    { from: 'USD', to: 'EUR' },
    { from: 'USD', to: 'AED' },
    { from: 'USD', to: 'JPY' },
  ]

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-surface shadow-sm border-b border-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">{currency.symbol}</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-main">Budget Buddy</span>
            </div>
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <button onClick={() => navigate('/dashboard')} className="px-2 py-2 text-muted hover:text-main transition-colors font-medium">Dashboard</button>
                <button onClick={() => navigate('/transactions')} className="px-2 py-2 text-muted hover:text-main transition-colors font-medium">Transactions</button>
                <button onClick={() => navigate('/budget')} className="px-2 py-2 text-muted hover:text-main transition-colors font-medium">Budget</button>
                <button onClick={() => navigate('/converter')} className="px-2 py-2 text-primary font-semibold border-b-2 border-primary transition-colors">Converter</button>
              </div>
              <ThemeSelector />
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-main">Currency Converter</h1>
          <p className="text-muted mt-2 italic">Real-time exchange rates powered by ExchangeRate-API</p>
          {lastUpdated && (
            <p className="text-xs text-muted mt-1">Last updated: {lastUpdated}</p>
          )}
        </div>

        {/* Main Converter Card */}
        <div className="bg-surface rounded-2xl shadow-lg border border-main p-8 mb-8">
          {/* Amount Row */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted mb-2">Amount</label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-main rounded-xl text-main text-lg font-semibold focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-surface"
              placeholder="Enter amount"
            />
          </div>

          {/* From | Swap | To Row */}
          <div className="flex items-center gap-4">
            {/* From */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-muted mb-2">From</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-main rounded-xl text-main bg-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                {SUPPORTED_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</option>
                ))}
              </select>
            </div>

            {/* Swap Button — perfectly centered */}
            <div className="flex flex-col items-center justify-end pb-0.5 mt-6">
              <button
                onClick={swapCurrencies}
                className="p-3 bg-primary text-white rounded-full hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:scale-110"
                title="Swap currencies"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>

            {/* To */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-muted mb-2">To</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-main rounded-xl text-main bg-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                {SUPPORTED_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Result */}
          <div className="mt-8">
            {loading ? (
              <div className="text-center py-6">
                <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted mt-2">Fetching live rates...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-center">
                {error}
              </div>
            ) : result ? (
              <div className="bg-primary bg-opacity-10 rounded-2xl p-6 text-center">
                <p className="text-muted text-sm mb-1">{amount} {fromCurrency} equals</p>
                <p className="text-4xl font-bold text-primary">
                  {parseFloat(result).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {toCurrency}
                </p>
                {rate && (
                  <p className="text-muted text-sm mt-2">
                    1 {fromCurrency} = {rate.toFixed(6)} {toCurrency}
                  </p>
                )}
                <button
                  onClick={fetchRates}
                  className="mt-4 text-sm text-primary hover:opacity-80 underline"
                >
                  🔄 Refresh rate
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Popular Pairs */}
        <div className="bg-surface rounded-2xl shadow-lg border border-main p-6">
          <h2 className="text-lg font-semibold text-main mb-4">Popular Pairs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {popularPairs.map(pair => (
              <button
                key={`${pair.from}-${pair.to}`}
                onClick={() => { setFromCurrency(pair.from); setToCurrency(pair.to) }}
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all hover:shadow-md ${
                  fromCurrency === pair.from && toCurrency === pair.to
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                    : 'border-main text-main hover:border-primary hover:text-primary bg-surface'
                }`}
              >
                {pair.from} → {pair.to}
                {allRates[pair.to] && fromCurrency === pair.from && (
                  <span className="block text-xs opacity-75 mt-0.5">1 {pair.from} = {allRates[pair.to]?.toFixed(2)} {pair.to}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
