const fs = require('fs');
const path = require('path');

const files = [
  'Transactions.jsx',
  'Budget.jsx',
  'Savings.jsx',
  'CurrencyConverter.jsx'
].map(f => path.join(__dirname, 'frontend/src/pages', f));

const navRegex = /<nav className="sticky top-0 z-40[\s\S]*?<\/nav>/;
const wrapperRegex = /<div className="min-h-screen[^"]*">/;

const newNav = `<nav className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-main/80 shadow-sm transition-all duration-300">
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
                  className={\`px-3.5 py-1.5 rounded-lg text-sm transition-all duration-300 font-semibold border-b-2 \${
                    isActive('/dashboard') || isActive('/')
                      ? 'text-primary font-bold border-primary'
                      : 'text-main hover:text-muted hover:bg-main/5 border-transparent'
                  }\`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/transactions')}
                  className={\`px-3.5 py-1.5 rounded-lg text-sm transition-all duration-300 font-semibold border-b-2 \${
                    isActive('/transactions')
                      ? 'text-primary font-bold border-primary'
                      : 'text-main hover:text-muted hover:bg-main/5 border-transparent'
                  }\`}
                >
                  Transactions
                </button>
                <button
                  onClick={() => navigate('/budget')}
                  className={\`px-3.5 py-1.5 rounded-lg text-sm transition-all duration-300 font-semibold border-b-2 \${
                    isActive('/budget')
                      ? 'text-primary font-bold border-primary'
                      : 'text-main hover:text-muted hover:bg-main/5 border-transparent'
                  }\`}
                >
                  Budget
                </button>
                <button
                  onClick={() => navigate('/converter')}
                  className={\`px-3.5 py-1.5 rounded-lg text-sm transition-all duration-300 font-semibold border-b-2 \${
                    isActive('/converter')
                      ? 'text-primary font-bold border-primary'
                      : 'text-main hover:text-muted hover:bg-main/5 border-transparent'
                  }\`}
                >
                  Converter
                </button>
                <button
                  onClick={() => navigate('/savings')}
                  className={\`px-3.5 py-1.5 rounded-lg text-sm transition-all duration-300 font-semibold border-b-2 \${
                    isActive('/savings')
                      ? 'text-primary font-bold border-primary'
                      : 'text-main hover:text-muted hover:bg-main/5 border-transparent'
                  }\`}
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
      </nav>`;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(navRegex, newNav);
  
  if (file.includes('CurrencyConverter.jsx')) {
      content = content.replace(wrapperRegex, '<div className="min-h-screen bg-bg-main font-sans text-main">');
  } else {
      content = content.replace(wrapperRegex, '<div className="min-h-screen pb-16 bg-bg-main font-sans text-main">');
  }
  
  fs.writeFileSync(file, content);
  console.log('Fixed', path.basename(file));
});
