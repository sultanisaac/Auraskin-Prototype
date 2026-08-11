# 🛍️ E-Commerce Store — Implementation Plan

> **Auraskin** — Guest Checkout Store powered by **Xendit** (Payments) & **Biteship** (Logistics)

---

## 📌 Overview

A frictionless, no-login-required online store for Auraskin products (e.g., serums, moisturizers, skincare bundles). Customers browse, add to cart, fill in their shipping address, choose a courier, and pay — all in one seamless flow. Order management is handled by the admin dashboard.

### Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router) |
| Cart State | Zustand + LocalStorage |
| Database | Vercel KV (Redis) |
| Payments | Xendit (Invoice / QRIS / VA / eWallet) |
| Logistics | Biteship (Live Rates + Order Creation) |
| Email Notifications | Nodemailer (already configured) |
| Admin Dashboard | Existing `/admin` panel (extended) |

---

## 🗂️ Phase Overview

| Phase | Title | Status |
|---|---|---|
| Phase 1 | Foundation & Database Setup | ⬜ Not Started |
| Phase 2 | Product Catalog & Store UI | ⏳ In Progress |
| Phase 3 | Cart System | ✅ Completed |
| Phase 4 | Checkout Flow — Address & Shipping | ✅ Completed |
| Phase 5 | Payment Integration (Xendit) | ✅ Completed |
| Phase 6 | Webhook & Logistics Automation (Biteship) | ✅ Completed |
| Phase 7 | Email Confirmations & Receipts | ✅ Completed |
| Phase 8 | Admin Order Management | ✅ Completed |
| Phase 9 | Polish, Testing & Deployment | ⬜ Not Started |

---

## ✅ Phase 1 — Foundation & Database Setup

**Goal:** Create all the database tables and environment configuration needed before writing any UI code.

### 1.1 Environment Variables
Add the following keys to `.env.local`:
```bash
# Xendit
XENDIT_SECRET_KEY=xnd_development_...
XENDIT_CALLBACK_TOKEN=...

# Biteship
BITESHIP_API_KEY=biteship_test....

# Store Config
NEXT_PUBLIC_STORE_URL=https://your-domain.vercel.app
STORE_WEBHOOK_SECRET=your-random-secret
```

### 1.2 Supabase Database Tables

**`products` table**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,           -- in IDR (e.g. 185000 = Rp185.000)
  images TEXT[],                    -- array of image URLs
  category TEXT,                    -- e.g. 'serum', 'moisturizer', 'bundle', 'toner'
  stock INTEGER DEFAULT 0,
  weight INTEGER DEFAULT 150,       -- in grams, for shipping calculation
  skin_type TEXT,                   -- e.g. 'oily', 'dry', 'combination', 'all'
  volume_ml INTEGER,                -- e.g. 30, 50, 100 (ml)
  ingredients TEXT,                 -- ingredient list for beauty compliance
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**`orders` table**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL, -- e.g. AURA-20260810-001
  status TEXT DEFAULT 'pending',     -- pending | paid | shipped | delivered | cancelled

  -- Customer Info (guest, no account needed)
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,

  -- Shipping Address
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,

  -- Line Items (snapshot of cart at time of order)
  items JSONB NOT NULL,

  -- Pricing
  subtotal INTEGER NOT NULL,
  shipping_cost INTEGER NOT NULL,
  total INTEGER NOT NULL,

  -- Logistics
  courier_name TEXT,                 -- e.g. 'jne', 'sicepat'
  courier_service TEXT,              -- e.g. 'YES', 'REG'
  biteship_order_id TEXT,
  tracking_id TEXT,

  -- Payment
  xendit_invoice_id TEXT,
  xendit_invoice_url TEXT,
  paid_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**`order_items` table** *(normalized for reporting)*
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,       -- snapshot
  product_price INTEGER NOT NULL,   -- snapshot
  quantity INTEGER NOT NULL,
  subtotal INTEGER NOT NULL
);
```

### 1.3 Deliverables
- [ ] Supabase migration files created
- [ ] All 3 tables live in Supabase
- [ ] All API keys added to `.env.local` and Vercel environment
- [ ] Row Level Security (RLS) policies configured (public read on products, insert-only on orders)

---

## ✅ Phase 2 — Product Catalog & Store UI

**Goal:** Build the `/store` page where customers can browse and view Auraskin products.

### 2.1 Pages & Routes
```
/store                → Product listing grid
/store/[slug]         → Single product detail page
```

### 2.2 Components to Build
- `ProductCard.tsx` — image, name, category badge, price, skin type tag, "Add to Cart" button
- `ProductGrid.tsx` — responsive grid (2 cols mobile, 3-4 cols desktop)
- `ProductDetail.tsx` — image gallery, description, ingredients accordion, volume, skin type badge, quantity selector
- `CategoryFilter.tsx` — filter bar: All / Serum / Moisturizer / Toner / Bundle

### 2.3 Data Fetching
- Fetch products server-side from Supabase using `supabaseAdmin`
- Filter only `is_active = true` products
- Support filtering by `category` and `skin_type`

### 2.4 Design Notes
- Match Auraskin's clean, minimal aesthetic (soft tones, pastel accents)
- Add a `NEW`, `BESTSELLER`, or `OUT OF STOCK` badge system
- Skincare-specific details: skin type tag, volume (ml), key ingredients
- Mobile-first responsive layout

### 2.5 Deliverables
- [ ] `/store` page live and populated with seeded product data
- [ ] `/store/[slug]` product detail page functional
- [x] Category filter working
- [x] Responsive across all screen sizes

---

## ✅ Phase 3 — Cart System

**Goal:** A persistent, client-side cart that works without any account.

### 3.1 State Management
Use **Zustand** with `persist` middleware to save the cart to **LocalStorage**.

```bash
npm install zustand
```

**Store shape:**
```typescript
interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  weight: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalWeight: () => number;
  getTotalItems: () => number;
}
```

### 3.2 Components to Build
- `CartIcon.tsx` — floating cart icon in Header with item count badge
- `CartDrawer.tsx` — slide-in panel from the right showing cart items
- `CartItem.tsx` — individual row with qty controls and remove button

### 3.3 Deliverables
- [x] Zustand cart store created and persisted to LocalStorage
- [x] Cart icon in header with live item count
- [x] Cart drawer opens/closes smoothly
- [x] Quantity update and item removal works

---

## ✅ Phase 4 — Checkout Flow: Address & Shipping

**Goal:** Collect customer info, shipping address, and fetch live shipping rates from Biteship.

### 4.1 Pages & Routes
```
/store/checkout       → Multi-step checkout page
```

### 4.2 Checkout Steps (Multi-step Form)
```
Step 1: Contact Info  → Name, Email, Phone
Step 2: Address       → Full address, City, Province, Postal Code
Step 3: Shipping      → Live rates from Biteship (shown after address is filled)
Step 4: Review        → Order summary before payment
```

### 4.3 Biteship Integration — Live Shipping Rates
Create a Next.js API route that calls Biteship:

```
POST /api/store/shipping-rates
```

**Request body:**
```json
{
  "destination_postal_code": "12345",
  "items": [{ "name": "Auraskin Serum", "weight": 150, "quantity": 1 }]
}
```

**Response:** Array of courier options (JNE, SiCepat, Anteraja, GoSend, etc.) with price and estimated delivery days. The user selects one.

### 4.4 Deliverables
- [x] Multi-step checkout form with validation (`react-hook-form` + `zod`)
- [x] `/api/store/shipping-rates` API route calling Biteship
- [x] Live shipping rates displayed with price and ETA
- [x] Selected rate saved to checkout state

---

## ✅ Phase 5 — Payment Integration (Xendit)

**Goal:** Create a Xendit Invoice and redirect the customer to pay.

### 5.1 API Route — Create Order & Invoice
```
POST /api/store/create-order
```

**Flow:**
1. Validate the request body (cart items, customer info, selected shipping)
2. Deduct stock in Supabase (optimistic, check stock first)
3. Generate a unique `order_number` (e.g. `AURA-20260810-001`)
4. Insert a new `orders` row with status `pending`
5. Call Xendit API to create an Invoice
6. Save `xendit_invoice_id` and `xendit_invoice_url` to the order
7. Return the `xendit_invoice_url` to the frontend
8. Frontend redirects the user to Xendit's hosted payment page

### 5.2 Xendit Invoice Config
```typescript
{
  external_id: orderNumber,
  amount: totalAmount,
  payer_email: customerEmail,
  description: `Auraskin Order ${orderNumber}`,
  invoice_duration: 86400,           // 24 hours to pay
  success_redirect_url: `/store/success?order=${orderNumber}`,
  failure_redirect_url: `/store/checkout?error=payment_failed`,
  currency: "IDR",
  items: cartItems.map(item => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }))
}
```

### 5.3 Success Page
```
/store/success        → "Thank you!" confirmation page with order number
```

### 5.4 Deliverables
- [x] `/api/store/create-order` API route complete
- [x] Stock validation before order creation
- [x] Xendit Invoice created and URL returned
- [x] Customer redirected to Xendit payment page
- [x] `/store/success` page with order number display

---

## ✅ Phase 6 — Webhook & Logistics Automation (Biteship)

**Goal:** When Xendit confirms payment, automatically mark the order as paid and create a Biteship shipment.

### 6.1 Webhook API Route
```
POST /api/webhooks/xendit
```

**Security:** Validate the `X-Callback-Token` header against `XENDIT_CALLBACK_TOKEN`.

**Flow on `PAID` status:**
1. Verify webhook signature
2. Find the order in Supabase by `xendit_invoice_id`
3. Update order status → `paid`, set `paid_at = NOW()`
4. Call Biteship API to create the shipment order
5. Save `biteship_order_id` and `tracking_id` to the order
6. Trigger customer email (Phase 7)
7. Trigger admin notification email

### 6.2 Biteship Shipment Creation
```typescript
// POST https://api.biteship.com/v1/orders
{
  shipper_contact_name: "Auraskin",
  shipper_contact_phone: "0811...",
  shipper_contact_email: "hello@auraskin.id",
  shipper_address: "...",             // your warehouse/office address
  destination_contact_name: customer_name,
  destination_contact_phone: customer_phone,
  destination_address: customer_address,
  courier_company: selected_courier,  // e.g. "jne"
  courier_type: selected_service,     // e.g. "yes"
  items: orderItems,
}
```

### 6.3 Deliverables
- [x] `/api/webhooks/xendit` route with signature verification
- [x] Order status updated to `paid` on successful payment
- [x] Biteship shipment automatically created
- [x] Tracking ID saved to order record

---

## ✅ Phase 7 — Email Confirmations & Receipts

**Goal:** Automatically send branded emails at each key order moment.

### 7.1 Email Templates to Build
| Trigger | Recipient | Email Template |
|---|---|---|
| Order Created | Customer | "Your Auraskin order is confirmed" |
| Payment Confirmed | Customer | Full receipt + Biteship tracking link |
| Order Shipped | Customer | Tracking number + courier info |
| New Order | Admin | Order details notification |

### 7.2 Email Content — Payment Confirmed
```
Subject: ✅ Payment Confirmed — Auraskin Order #AURA-20260810-001

Hi [Customer Name],

Your payment has been confirmed! Here is your receipt:

Items: [list]
Shipping: Rp25.000 via JNE YES
Total: Rp210.000

Tracking: [Biteship tracking link]
Estimated delivery: 1-2 business days

Thank you for choosing Auraskin — glow from within. ✨
```

### 7.3 Deliverables
- [x] Email templates created in `src/lib/ecommerceEmailTemplates.ts`
- [x] Order creation email sent on `create-order`
- [x] Receipt email sent on Xendit webhook `PAID`
- [x] Admin notification email sent on new order

---

## ✅ Phase 8 — Admin Order Management

**Goal:** Give the admin a full view of all orders, with ability to update status and manage products.

### 8.1 New Admin Pages
```
/admin/orders              → All orders list (filterable by status)
/admin/orders/[id]         → Single order detail with status controls
/admin/products            → Product management (add/edit/toggle active/stock)
```

### 8.2 Order List Features
- Table view: Order #, Customer, Date, Status, Total, Courier
- Filter by: `pending`, `paid`, `shipped`, `delivered`, `cancelled`
- Click to open order detail
- Manual status override button (for edge cases)

### 8.3 Product Management Features
- Add new product with image upload
- Edit price, stock, description, skin type, volume
- Toggle `is_active` (show/hide from store)
- Low stock alert badge (< 5 units)
- **New:** Mobile-optimized card grid with real-time search filtering
- **New:** Long-press to enter Batch Selection Mode for deleting multiple products

### 8.4 Deliverables
- [x] `/admin/orders` list page
- [x] `/admin/orders/[id]` detail page with status controls
- [x] `/admin/products` CRUD management page (Connected to KV)
- [x] `/admin/products` Mobile UI/UX optimization (Grid, Search, Batch Delete)
- [x] Manual status update API route (Server Actions)

---

## ✅ Phase 9 — Polish, Testing & Deployment

**Goal:** Ensure the entire flow is bulletproof before going live.

### 9.1 End-to-End Testing Checklist
- [ ] Guest can browse store without logging in
- [ ] Cart persists after closing the browser tab
- [ ] Shipping rates load correctly from Biteship sandbox
- [ ] Xendit test invoice is created and payment succeeds with test credentials
- [ ] Webhook fires and order status updates to `paid`
- [ ] Biteship shipment is created automatically
- [ ] Receipt email is received by customer
- [ ] Admin receives new order notification
- [ ] Admin can view the order in `/admin/orders`
- [x] Stock is decremented after successful order
- [x] Out-of-stock items cannot be added to cart

### 9.2 Production Credentials Swap (Skipped for Prototype)
- [x] Replace all Xendit sandbox keys with production keys *(Skipped)*
- [x] Replace all Biteship test keys with production keys *(Skipped)*
- [x] Update Xendit webhook URL to production domain *(Done in Vercel)*
- [x] Test one live payment end-to-end *(Skipped)*

### 9.3 SEO & UX
- [x] `/store` page has proper metadata (title, description, OG image)
- [x] Product pages have unique metadata per product (great for SEO)
- [x] Loading skeletons on product grid while fetching
- [x] Error states (out of stock, payment failed, API errors) handled gracefully
- [x] Mobile responsive — entire checkout flow works on phone

---

## 📦 Suggested Product Seed Data

To seed the store for testing/demo:
```typescript
const products = [
  { name: "Auraskin Brightening Serum", price: 185000, weight: 80,  category: "serum",       skin_type: "all",         volume_ml: 30 },
  { name: "Auraskin Hydra Moisturizer", price: 165000, weight: 100, category: "moisturizer", skin_type: "dry",         volume_ml: 50 },
  { name: "Auraskin Pore Toner",        price: 145000, weight: 90,  category: "toner",        skin_type: "oily",        volume_ml: 100 },
  { name: "Auraskin Glow Bundle",       price: 420000, weight: 300, category: "bundle",       skin_type: "combination", volume_ml: null },
  { name: "Auraskin Niacinamide Serum", price: 195000, weight: 80,  category: "serum",        skin_type: "oily",        volume_ml: 30 },
];
```

---

## 🔗 Key API References

- **Xendit Docs:** https://developers.xendit.co/api-reference/
- **Biteship Docs:** https://biteship.com/id/docs
- **Supabase JS Docs:** https://supabase.com/docs/reference/javascript

---

*Last updated: 2026-08-10 | Status: Planning*
