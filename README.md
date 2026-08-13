# Salon Barber — Premium Barbershop & Salon Prototype

## Overview
Salon Barber is a premium web application designed for a high-end salon and barbershop. The application delivers an elegant, high-performance landing page combined with a dedicated e-commerce store, a custom booking system, and a transparent service model. 

It is a full-stack monolithic application powered by **Next.js (App Router)**. It features both the public-facing client portal and a secure internal **Admin Dashboard** for staff to manage appointments, store products, and orders in real-time.

## Key Features
* **Unified Full-Stack Architecture**: Both the public website and the CRM admin dashboard are housed in a single Next.js codebase, utilizing React Server Components and Server Actions for maximum performance and security.
* **Custom Booking Workflow**: Built to replace third-party schedulers. A custom React Hook Form with Zod validation collects client details and securely synchronizes with the database.
* **E-Commerce Storefront**: A fully integrated digital storefront for premium hair and styling products. Includes a dynamic shopping cart, product catalog, and secure checkout.
* **Payment & Shipping Integrations**: Integrated with **Xendit** for secure payment processing and **Biteship** for real-time shipping rate calculation.
* **Integrated Admin Dashboard**: Accessible via `/admin` (secured via PIN), allowing staff to view the calendar, manage clients, approve/decline bookings, manage store products, and track orders seamlessly.
* **Automated Email Notifications**: Integrated SMTP email service (via Nodemailer) that automatically sends branded email confirmations to clients for booking and order updates.
* **Premium Brand System**: A luxury-focused visual design utilizing a sophisticated color palette with fluid animations powered by Framer Motion.

## Tech Stack
* **Framework**: Next.js 14+ (App Router) & React 18
* **Language**: TypeScript
* **Database / Caching**: Vercel KV (Redis REST API) for fast appointment, product, and order data management
* **Payments & Logistics**: Xendit API, Biteship API
* **Email Service**: Nodemailer (SMTP integration for patient notifications)
* **Styling**: Tailwind CSS & Autoprefixer
* **Form & Validation**: React Hook Form & Zod
* **Animations**: Framer Motion
* **Icons**: Lucide React
* **Deployment**: Vercel

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sultanisaac/Auraskin-Prototype.git
   cd Auraskin-Prototype
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a local `.env` file based on `.env.example` and ensure you connect to your Vercel KV instance, SMTP server for emails, Xendit, and Biteship APIs:
   ```env
   KV_REST_API_URL="your-vercel-kv-url"
   KV_REST_API_TOKEN="your-vercel-kv-token"
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   XENDIT_SECRET_KEY="your-xendit-secret-key"
   BITESHIP_API_KEY="your-biteship-api-key"
   ```

4. **Run Development Server:**
   ```bash
   # Starts the development server at http://localhost:3000
   npm run dev
   ```

## Project Structure
```text
Auraskin-Prototype/
├── src/
│   ├── app/                # Next.js App Router (Public routes, /store & /admin dashboard)
│   ├── actions/            # Next.js Server Actions (Database, Payments & Email logic)
│   ├── components/         # Reusable UI elements (Buttons, Layouts, Modals)
│   ├── pages/              # Client-side page components
│   └── lib/                # Utility functions, email templates, and configurations
├── public/                 # Static assets (Logos, Images)
├── tailwind.config.js      # Custom theme configurations
└── next.config.mjs         # Next.js configuration
```

## Admin Dashboard Access
The admin dashboard is located at `/admin`. It is protected by a PIN system (Default PIN: `271302` for testing purposes) to ensure only authorized staff can manage client data, product inventory, and order statuses.

## License
*Proprietary / Closed Source*
