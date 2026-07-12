const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend/src/pages');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(srcDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace bg-bg-main with bg-transparent on the root containers
  content = content.replace(/className="([^"]*)bg-bg-main([^"]*)"/g, 'className="$1bg-transparent$2"');
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
