const fs = require('fs');

let content = fs.readFileSync('Implementation/E-COMMERCE.md', 'utf8');

content = content.replace('| Phase 8 | Admin Order Management | ⏳ In Progress |', '| Phase 8 | Admin Order Management | ✅ Completed |');
content = content.replace('- [ ] `/admin/products` CRUD management page', '- [x] `/admin/products` CRUD management page (Connected to KV)');

fs.writeFileSync('Implementation/E-COMMERCE.md', content);
console.log('Phase 8 completed.');
