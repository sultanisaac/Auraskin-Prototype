const fs = require('fs');

let content = fs.readFileSync('Implementation/E-COMMERCE.md', 'utf8');

content = content.replace('- [ ] Stock is decremented after successful order', '- [x] Stock is decremented after successful order');
content = content.replace('- [ ] Out-of-stock items cannot be added to cart', '- [x] Out-of-stock items cannot be added to cart');

fs.writeFileSync('Implementation/E-COMMERCE.md', content);
console.log('Phase 9.1 stock tasks checked off.');
