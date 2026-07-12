const fs = require('fs');
const path = require('path');

const files = [
  'Transactions.jsx',
  'Budget.jsx',
  'Savings.jsx',
  'CurrencyConverter.jsx'
].map(f => path.join(__dirname, 'frontend/src/pages', f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<div className="min-h-screen pb-16 bg-bg-main font-sans text-main">/g, '<div className="min-h-screen pb-16">');
  content = content.replace(/<div className="min-h-screen bg-bg-main font-sans text-main">/g, '<div className="min-h-screen">');
  
  fs.writeFileSync(file, content);
  console.log('Fixed background transparency on', path.basename(file));
});
