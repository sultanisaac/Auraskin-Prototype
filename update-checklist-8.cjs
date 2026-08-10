const fs = require('fs');

let content = fs.readFileSync('Implementation/E-COMMERCE.md', 'utf8');

// Update Phase 8 status in the table
content = content.replace('| Phase 8 | Admin Order Management | ⬜ Not Started |', '| Phase 8 | Admin Order Management | ⏳ In Progress |');

// Phase 8 deliverables
content = content.replace('- [ ] `/admin/orders` list page', '- [x] `/admin/orders` list page');
content = content.replace('- [ ] `/admin/orders/[id]` detail page with status controls', '- [x] `/admin/orders/[id]` detail page with status controls');
content = content.replace('- [ ] Manual status update API route', '- [x] Manual status update API route (Server Actions)');

fs.writeFileSync('Implementation/E-COMMERCE.md', content);
console.log('Phase 8 checklist updated.');
