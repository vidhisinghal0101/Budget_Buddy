import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ThemeSelector from '../components/ThemeSelector'
import { useTheme } from '../context/ThemeContext'

// Searchable currency dropdown
function CurrencySelect({ value, onChange, label }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)

  const selected = SUPPORTED_CURRENCIES.find(c => c.code === value)

  const filtered = SUPPORTED_CURRENCIES.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.includes(search)
  )

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [])

  const handleSelect = (code) => {
    onChange(code)
    setOpen(false)
    setSearch('')
  }

  return (
    <div className="flex-1 relative" ref={ref}>
      <label className="block text-sm font-medium text-muted mb-2">{label}</label>
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setSearch('') }}
        className="w-full px-4 py-3 border border-main rounded-xl text-main bg-surface focus:ring-2 focus:ring-primary outline-none text-left flex items-center justify-between"
      >
        <span className="font-semibold">{selected?.symbol} {selected?.code} — {selected?.name}</span>
        <svg className={`w-4 h-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1 w-full bg-surface border border-main rounded-xl shadow-2xl overflow-hidden"
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Search input */}
          <div className="p-2 border-b border-main">
            <input
              type="text"
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search currency..."
              className="w-full px-3 py-2 text-sm border border-main rounded-lg bg-bg-main text-main focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          {/* Options list */}
          <ul className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-muted text-center">No results found</li>
            ) : (
              filtered.map(c => (
                <li
                  key={c.code}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(c.code)}
                  className={`px-4 py-2.5 text-sm cursor-pointer flex items-center gap-2 transition-colors
                    ${c.code === value
                      ? 'bg-primary text-white font-semibold'
                      : 'text-main hover:bg-main/5'}`}
                >
                  <span className="w-8 text-center font-bold">{c.symbol}</span>
                  <span className="font-medium">{c.code}</span>
                  <span className="text-xs opacity-70">— {c.name}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

const SUPPORTED_CURRENCIES = [
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'AFN', name: 'Afghan Afghani', symbol: '؋' },
  { code: 'ALL', name: 'Albanian Lek', symbol: 'L' },
  { code: 'AMD', name: 'Armenian Dram', symbol: '֏' },
  { code: 'ANG', name: 'Netherlands Antillean Guilder', symbol: 'ƒ' },
  { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz' },
  { code: 'ARS', name: 'Argentine Peso', symbol: 'AR$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'AWG', name: 'Aruban Florin', symbol: 'Afl' },
  { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼' },
  { code: 'BAM', name: 'Bosnia-Herzegovina Convertible Mark', symbol: 'KM' },
  { code: 'BBD', name: 'Barbadian Dollar', symbol: 'Bds$' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD' },
  { code: 'BIF', name: 'Burundian Franc', symbol: 'Fr' },
  { code: 'BMD', name: 'Bermudian Dollar', symbol: 'BD$' },
  { code: 'BND', name: 'Brunei Dollar', symbol: 'B$' },
  { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs.' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'BSD', name: 'Bahamian Dollar', symbol: 'B$' },
  { code: 'BTN', name: 'Bhutanese Ngultrum', symbol: 'Nu' },
  { code: 'BWP', name: 'Botswanan Pula', symbol: 'P' },
  { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br' },
  { code: 'BZD', name: 'Belize Dollar', symbol: 'BZ$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CDF', name: 'Congolese Franc', symbol: 'Fr' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CLP', name: 'Chilean Peso', symbol: 'CL$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'COP', name: 'Colombian Peso', symbol: 'CO$' },
  { code: 'CRC', name: 'Costa Rican Colón', symbol: '₡' },
  { code: 'CUP', name: 'Cuban Peso', symbol: 'CU$' },
  { code: 'CVE', name: 'Cape Verdean Escudo', symbol: 'CV$' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
  { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'DOP', name: 'Dominican Peso', symbol: 'RD$' },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'دج' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£' },
  { code: 'ERN', name: 'Eritrean Nakfa', symbol: 'Nfk' },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'FJD', name: 'Fijian Dollar', symbol: 'FJ$' },
  { code: 'FKP', name: 'Falkland Islands Pound', symbol: 'FK£' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'GEL', name: 'Georgian Lari', symbol: '₾' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' },
  { code: 'GIP', name: 'Gibraltar Pound', symbol: 'GI£' },
  { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D' },
  { code: 'GNF', name: 'Guinean Franc', symbol: 'Fr' },
  { code: 'GTQ', name: 'Guatemalan Quetzal', symbol: 'Q' },
  { code: 'GYD', name: 'Guyanese Dollar', symbol: 'G$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'HNL', name: 'Honduran Lempira', symbol: 'L' },
  { code: 'HTG', name: 'Haitian Gourde', symbol: 'G' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د' },
  { code: 'IRR', name: 'Iranian Rial', symbol: '﷼' },
  { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr' },
  { code: 'JMD', name: 'Jamaican Dollar', symbol: 'J$' },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'JD' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'KGS', name: 'Kyrgystani Som', symbol: 'с' },
  { code: 'KHR', name: 'Cambodian Riel', symbol: '៛' },
  { code: 'KMF', name: 'Comorian Franc', symbol: 'Fr' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD' },
  { code: 'KYD', name: 'Cayman Islands Dollar', symbol: 'CI$' },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸' },
  { code: 'LAK', name: 'Laotian Kip', symbol: '₭' },
  { code: 'LBP', name: 'Lebanese Pound', symbol: 'L£' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs' },
  { code: 'LRD', name: 'Liberian Dollar', symbol: 'L$' },
  { code: 'LSL', name: 'Lesotho Loti', symbol: 'L' },
  { code: 'LYD', name: 'Libyan Dinar', symbol: 'LD' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD' },
  { code: 'MDL', name: 'Moldovan Leu', symbol: 'L' },
  { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar' },
  { code: 'MKD', name: 'Macedonian Denar', symbol: 'ден' },
  { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K' },
  { code: 'MNT', name: 'Mongolian Tögrög', symbol: '₮' },
  { code: 'MOP', name: 'Macanese Pataca', symbol: 'P' },
  { code: 'MRU', name: 'Mauritanian Ouguiya', symbol: 'UM' },
  { code: 'MUR', name: 'Mauritian Rupee', symbol: 'Rs' },
  { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: 'Rf' },
  { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT' },
  { code: 'NAD', name: 'Namibian Dollar', symbol: 'N$' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'NIO', name: 'Nicaraguan Córdoba', symbol: 'C$' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: 'Rs' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.' },
  { code: 'PAB', name: 'Panamanian Balboa', symbol: 'B/.' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/.' },
  { code: 'PGK', name: 'Papua New Guinean Kina', symbol: 'K' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs' },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł' },
  { code: 'PYG', name: 'Paraguayan Guaraní', symbol: '₲' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei' },
  { code: 'RSD', name: 'Serbian Dinar', symbol: 'din' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'Fr' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR' },
  { code: 'SBD', name: 'Solomon Islands Dollar', symbol: 'SI$' },
  { code: 'SCR', name: 'Seychellois Rupee', symbol: 'Rs' },
  { code: 'SDG', name: 'Sudanese Pound', symbol: 'ج.س.' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'SHP', name: 'Saint Helena Pound', symbol: 'SH£' },
  { code: 'SLL', name: 'Sierra Leonean Leone', symbol: 'Le' },
  { code: 'SOS', name: 'Somali Shilling', symbol: 'Sh' },
  { code: 'SRD', name: 'Surinamese Dollar', symbol: 'SR$' },
  { code: 'STN', name: 'São Tomé and Príncipe Dobra', symbol: 'Db' },
  { code: 'SYP', name: 'Syrian Pound', symbol: 'LS' },
  { code: 'SZL', name: 'Swazi Lilangeni', symbol: 'L' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'TJS', name: 'Tajikistani Somoni', symbol: 'SM' },
  { code: 'TMT', name: 'Turkmenistani Manat', symbol: 'T' },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'DT' },
  { code: 'TOP', name: 'Tongan Paʻanga', symbol: 'T$' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'TTD', name: 'Trinidad and Tobago Dollar', symbol: 'TT$' },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'Sh' },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'Sh' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U' },
  { code: 'UZS', name: 'Uzbekistani Som', symbol: 'лв' },
  { code: 'VES', name: 'Venezuelan Bolívar', symbol: 'Bs.S' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  { code: 'VUV', name: 'Vanuatu Vatu', symbol: 'Vt' },
  { code: 'WST', name: 'Samoan Tala', symbol: 'T' },
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'Fr' },
  { code: 'XCD', name: 'East Caribbean Dollar', symbol: 'EC$' },
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'Fr' },
  { code: 'XPF', name: 'CFP Franc', symbol: 'Fr' },
  { code: 'YER', name: 'Yemeni Rial', symbol: '﷼' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK' },
  { code: 'ZWL', name: 'Zimbabwean Dollar', symbol: 'Z$' },
]

export default function CurrencyConverter({ setIsAuthenticated }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path) => location.pathname === path
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

  const getSymbol = (code) => SUPPORTED_CURRENCIES.find(c => c.code === code)?.symbol || code

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-main">Currency Converter</h1>
          <p className="text-main opacity-80 mt-2 font-medium">Real-time exchange rates powered by ExchangeRate-API</p>
          {lastUpdated && (
            <p className="text-xs text-main opacity-60 mt-1 font-medium">Last updated: {lastUpdated}</p>
          )}
        </div>

        {/* Main Converter Card */}
        <div className="glass-card p-8 mb-8">
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
            <CurrencySelect
              value={fromCurrency}
              onChange={setFromCurrency}
              label="From"
            />

            {/* Swap Button */}
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

            <CurrencySelect
              value={toCurrency}
              onChange={setToCurrency}
              label="To"
            />
          </div>

          {/* Result */}
          <div className="mt-8">
            {loading ? (
              <div className="text-center py-6">
                <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted mt-2">Fetching live rates...</p>
              </div>
            ) : error ? (
              <div className="bg-expense/10 border border-expense/30 text-expense px-4 py-3 rounded-xl text-center font-medium">
                {error}
              </div>
            ) : result ? (
              <div className="glass-card border-2 border-primary/50 p-6 text-center">
                <p className="text-secondary text-sm font-semibold mb-1">
                  {getSymbol(fromCurrency)} {amount} equals
                </p>
                <p className="text-4xl font-bold text-primary">
                  {getSymbol(toCurrency)} {parseFloat(result).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                {rate && (
                  <p className="text-secondary text-sm font-semibold mt-2">
                    {getSymbol(fromCurrency)} 1 = {getSymbol(toCurrency)} {rate.toFixed(2)}
                  </p>
                )}
                <button
                  onClick={fetchRates}
                  className="mt-4 text-sm font-bold text-primary hover:opacity-80 flex items-center gap-1 mx-auto"
                >
                  <span>🔄</span> Refresh rate
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Popular Pairs */}
        <div className="glass-card p-6">
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
                {getSymbol(pair.from)} {pair.from} → {getSymbol(pair.to)} {pair.to}
                {allRates[pair.to] && fromCurrency === pair.from && (
                  <span className="block text-xs opacity-75 mt-0.5">
                    1 {pair.from} = {allRates[pair.to]?.toFixed(2)} {pair.to}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
