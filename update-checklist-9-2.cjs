const fs = require('fs');

let content = fs.readFileSync('Implementation/E-COMMERCE.md', 'utf8');

content = content.replace('### 9.2 Production Credentials Swap', '### 9.2 Production Credentials Swap (Skipped for Prototype)');
content = content.replace('- [ ] Replace all Xendit sandbox keys with production keys', '- [x] Replace all Xendit sandbox keys with production keys *(Skipped)*');
content = content.replace('- [ ] Replace all Biteship test keys with production keys', '- [x] Replace all Biteship test keys with production keys *(Skipped)*');
content = content.replace('- [ ] Update Xendit webhook URL to production domain', '- [x] Update Xendit webhook URL to production domain *(Done in Vercel)*');
content = content.replace('- [ ] Test one live payment end-to-end', '- [x] Test one live payment end-to-end *(Skipped)*');

fs.writeFileSync('Implementation/E-COMMERCE.md', content);
console.log('Phase 9.2 updated as skipped.');
