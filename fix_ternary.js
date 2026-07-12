const fs = require('fs');
const path = require('path');

const files = [
  'Transactions.jsx',
  'Budget.jsx',
  'Savings.jsx'
].map(f => path.join(__dirname, 'frontend/src/pages', f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Find the </main> tag that is followed by the Modal section, or just the last </main> tag
  // By using regex, we can replace the last </main> in the file.
  
  if (content.includes('{loading ? (')) {
    // It has the loading ternary, let's check if it's closed
    if (!content.includes('</main>\n      )}')) {
        // It's not closed.
        // Let's replace the last </main> with </main>\n      )}
        const lastMainIndex = content.lastIndexOf('</main>');
        if (lastMainIndex !== -1) {
            content = content.substring(0, lastMainIndex) + '</main>\n      )}' + content.substring(lastMainIndex + 7);
            fs.writeFileSync(file, content);
            console.log('Fixed', path.basename(file));
        }
    }
  }
});
