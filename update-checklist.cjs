const fs = require('fs');
let content = fs.readFileSync('Implementation/E-COMMERCE.md', 'utf8');

// Update Phase 4 and 5 status
content = content.replace('| Phase 4 | Checkout Flow — Address & Shipping | ⬜ Not Started |', '| Phase 4 | Checkout Flow — Address & Shipping | ✅ Completed |');
content = content.replace('| Phase 5 | Payment Integration (Xendit) | ⬜ Not Started |', '| Phase 5 | Payment Integration (Xendit) | ✅ Completed |');

// Update Phase 6 status
content = content.replace('| Phase 6 | Webhook & Logistics Automation (Biteship) | ⬜ Not Started |', '| Phase 6 | Webhook & Logistics Automation (Biteship) | ✅ Completed |');

// Phase 4 tasks
content = content.replace('- [ ] Multi-step checkout form with validation', '- [x] Multi-step checkout form with validation');
content = content.replace('- [ ] `/api/store/shipping-rates` API route calling Biteship', '- [x] `/api/store/shipping-rates` API route calling Biteship');
content = content.replace('- [ ] Live shipping rates displayed with price and ETA', '- [x] Live shipping rates displayed with price and ETA');
content = content.replace('- [ ] Selected rate saved to checkout state', '- [x] Selected rate saved to checkout state');

// Phase 5 tasks
content = content.replace('- [ ] `/api/store/create-order` API route complete', '- [x] `/api/store/create-order` API route complete');
content = content.replace('- [ ] Stock validation before order creation', '- [x] Stock validation before order creation');
content = content.replace('- [ ] Xendit Invoice created and URL returned', '- [x] Xendit Invoice created and URL returned');
content = content.replace('- [ ] Customer redirected to Xendit payment page', '- [x] Customer redirected to Xendit payment page');
content = content.replace('- [ ] `/store/success` page with order number display', '- [x] `/store/success` page with order number display');

// Phase 6 tasks
content = content.replace('- [ ] `/api/webhooks/xendit` route with signature verification', '- [x] `/api/webhooks/xendit` route with signature verification');
content = content.replace('- [ ] Order status updated to `paid` on successful payment', '- [x] Order status updated to `paid` on successful payment');
content = content.replace('- [ ] Biteship shipment automatically created', '- [x] Biteship shipment automatically created');
content = content.replace('- [ ] Tracking ID saved to order record', '- [x] Tracking ID saved to order record');

fs.writeFileSync('Implementation/E-COMMERCE.md', content);
console.log('Phase 6 Markdown checklist updated.');
