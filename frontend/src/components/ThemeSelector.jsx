import { useTheme } from '../context/ThemeContext';

export default function ThemeSelector() {
  const { mode, colorTheme, toggleMode, changeColorTheme, currency, changeCurrency, CURRENCIES } = useTheme();

  const colors = [
    { name: 'emerald', class: 'bg-emerald-500' },
    { name: 'blue', class: 'bg-blue-500' },
    { name: 'indigo', class: 'bg-indigo-500' },
    { name: 'purple', class: 'bg-purple-500' },
    { name: 'rose', class: 'bg-rose-500' },
    { name: 'amber', class: 'bg-amber-500' },
  ];

  return (
    <div className="flex items-center space-x-4">
      {/* Currency Selector */}
      <div className="relative">
        <select
          value={currency.code}
          onChange={(e) => changeCurrency(e.target.value)}
          className="appearance-none bg-surface border border-main text-main text-sm rounded-lg px-3 py-1.5 pr-7 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          title="Select Currency"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.code}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
          <svg className="w-3 h-3 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Light/Dark Toggle */}
      <button
        onClick={toggleMode}
        className="p-2 rounded-lg bg-surface shadow-sm border border-main hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      >
        {mode === 'light' ? (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.071 16.071l.707.707M7.636 7.636l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        )}
      </button>

      {/* Color Palette */}
      <div className="flex items-center space-x-2 bg-surface p-1.5 rounded-full shadow-sm border border-main">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => changeColorTheme(color.name)}
            className={`w-5 h-5 rounded-full ${color.class} transition-transform hover:scale-125 ${
              colorTheme === color.name ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
            }`}
            title={`Set ${color.name} theme`}
          />
        ))}
      </div>
    </div>
  );
}
