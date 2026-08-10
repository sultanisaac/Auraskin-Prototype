const fs = require('fs');

let content = fs.readFileSync('Implementation/E-COMMERCE.md', 'utf8');

// Update Phase 7 status
content = content.replace('| Phase 7 | Email Confirmations & Receipts | ⬜ Not Started |', '| Phase 7 | Email Confirmations & Receipts | ✅ Completed |');

// Phase 7 tasks
content = content.replace('- [ ] HTML Email Templates developed', '- [x] HTML Email Templates developed');
content = content.replace('- [ ] Order Created email connected to checkout', '- [x] Order Created email connected to checkout');
content = content.replace('- [ ] Payment Confirmed receipt connected to webhook', '- [x] Payment Confirmed receipt connected to webhook');
content = content.replace('- [ ] Admin Notification connected to webhook', '- [x] Admin Notification connected to webhook');
content = content.replace('- [ ] Nodemailer configured and tested', '- [x] Nodemailer configured and tested');

fs.writeFileSync('Implementation/E-COMMERCE.md', content);
console.log('Phase 7 updated.');
