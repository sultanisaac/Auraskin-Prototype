# AuraSkin — Premium Aesthetic Clinic Prototype

## Overview
AuraSkin is a premium medical aesthetic clinic web application designed for a luxury clinic located in Jakarta's central business district (SCBD). The application delivers an elegant, high-performance landing page combined with a transparent pricing model and a custom, integrated booking system that links directly to the administrative CRM dashboard.

Designed as a modern single-page experience, it converts prospective patients by establishing trust through credentials, showcasing before/after results, and providing a seamless booking experience.

## Key Features
* **Custom Booking Workflow**: Built from the ground up to replace third-party schedulers. A custom React Hook Form with Zod validation collects patient details and securely synchronizes with a centralized Supabase database.
* **Treatment Catalog & Dynamic Filter**: Interactive pricing table with categories (Acne, Brightening, Laser, etc.) and search capabilities.
* **Before & After Showcases**: Immersive image comparison sliders demonstrating treatment results.
* **Interactive FAQ & Doctor Profiles**: Expandable accordions to handle user objections and credential-based cards highlighting specialist credentials.
* **Premium Brand System**: A luxury-focused visual design utilizing a sophisticated color palette (Deep Emerald Teal, Champagne Gold, Warm Ivory, and Graphite) with fluid animations powered by Framer Motion.
* **Admin Appointment Widget**: A top-right widget providing administrators quick access to appointment status management directly from the main portal.

## Tech Stack
* **Framework**: React 18 (Vite & TypeScript)
* **Routing**: React Router DOM
* **Database & Architecture**: Supabase (Shared architecture with Admin Dashboard)
* **Data Management**: Vercel KV for fast access/caching
* **Styling**: Tailwind CSS & Autoprefixer
* **Form & Validation**: React Hook Form & Zod
* **Animations**: Framer Motion
* **Icons**: Lucide React
* **Image Slider**: React Compare Slider

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
   Create a local `.env` file based on `.env.example` and ensure you connect to the centralized Supabase instance shared with the Admin Dashboard:
   ```bash
   cp .env.example .env
   ```

4. **Run Development Server:**
   ```bash
   # Starts the development server at http://localhost:5173
   npm run dev
   ```

## Project Structure
```text
Auraskin-Prototype/
├── src/
│   ├── components/         # Reusable UI elements (Button, Layout, PrototypeNotice)
│   ├── pages/              # Primary views (Home, Booking, Pricing)
│   ├── App.tsx             # Route definitions
│   └── index.css           # Global stylesheet & Tailwind directives
├── index.html              # HTML base skeleton
└── tailwind.config.js      # Custom theme configurations
```

## Integration Architecture
This public-facing application is closely integrated with the [AuraSkin Admin Dashboard](https://github.com/sultanisaac/Admin-Auraskin-Prototype). Booking requests submitted here are routed to the shared Supabase instance where they can be managed, confirmed, or declined by clinic staff.

## License
*Proprietary / Closed Source*
