const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend/src/pages');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(srcDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace ONLY the bg-bg-main inside the min-h-screen div
  // The min-h-screen div is usually the first main wrapper.
  content = content.replace(/(className="min-h-screen[^"]*)bg-bg-main/g, '$1bg-transparent');
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
