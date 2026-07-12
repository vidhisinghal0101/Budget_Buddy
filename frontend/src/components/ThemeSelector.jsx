import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function ThemeSelector() {
  const { colorTheme, changeColorTheme, currency, changeCurrency, CURRENCIES } = useTheme();

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
      <ThemeToggle />
    </div>
  );
}
