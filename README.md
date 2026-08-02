# AuraSkin — Premium Aesthetic Clinic Prototype

## Overview
AuraSkin is a premium medical aesthetic clinic web application designed for a luxury clinic located in Jakarta's central business district (SCBD). The application delivers an elegant, high-performance landing page combined with a transparent pricing model, dedicated treatment pages, and a custom booking system. 

It is a full-stack monolithic application powered by **Next.js (App Router)**. It features both the public-facing patient portal and a secure internal **Admin Dashboard** for clinic staff to manage, approve, and track appointments in real-time.

## Key Features
* **Unified Full-Stack Architecture**: Both the public website and the CRM admin dashboard are housed in a single Next.js codebase, utilizing React Server Components and Server Actions for maximum performance and security.
* **Custom Booking Workflow**: Built to replace third-party schedulers. A custom React Hook Form with Zod validation collects patient details and securely synchronizes with the database.
* **Integrated Admin Dashboard**: Accessible via `/admin` (secured via PIN), allowing clinic staff to view the calendar, manage patients, and approve/decline bookings seamlessly.
* **Automated Email Notifications**: Integrated SMTP email service (via Nodemailer) that automatically sends branded email confirmations to patients when their bookings are approved, declined, or canceled.
* **Treatment Catalog**: Dedicated pages for individual treatments (Acne, Brightening, Laser, etc.) with detailed clinical information, aftercare instructions, and direct booking links.
* **Premium Brand System**: A luxury-focused visual design utilizing a sophisticated color palette (Deep Emerald Teal, Champagne Gold, Warm Ivory, and Graphite) with fluid animations powered by Framer Motion.

## Tech Stack
* **Framework**: Next.js 14+ (App Router) & React 18
* **Language**: TypeScript
* **Database / Caching**: Vercel KV (Redis REST API) for fast appointment and patient data management
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
   Create a local `.env` file based on `.env.example` and ensure you connect to your Vercel KV instance and SMTP server for emails:
   ```env
   KV_REST_API_URL="your-vercel-kv-url"
   KV_REST_API_TOKEN="your-vercel-kv-token"
   EMAIL_USER="your-clinic-email@gmail.com"
   EMAIL_PASS="your-app-password"
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
│   ├── app/                # Next.js App Router (Public routes & /admin dashboard)
│   ├── actions/            # Next.js Server Actions (Database & Email logic)
│   ├── components/         # Reusable UI elements (Buttons, Layouts, Modals)
│   ├── pages/              # Client-side page components
│   └── lib/                # Utility functions, email templates, and configurations
├── public/                 # Static assets (Logos, Images)
├── tailwind.config.js      # Custom theme configurations
└── next.config.mjs         # Next.js configuration
```

## Admin Dashboard Access
The admin dashboard is located at `/admin`. It is protected by a PIN system (Default PIN: `271302` for testing purposes) to ensure only authorized staff can manage patient data and booking statuses.

## License
*Proprietary / Closed Source*
