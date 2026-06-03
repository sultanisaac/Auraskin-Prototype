# AuraSkin — Premium Aesthetic Clinic Prototype

## Overview
AuraSkin is a premium medical aesthetic clinic prototype web application designed for a luxury clinic located in Jakarta's central business district (SCBD). The application delivers an elegant, high-performance landing page experience combined with a transparent pricing model and an interactive pre-consultation funnel integrated with Cal.com for appointment booking.

It is built as a highly responsive, modern single-page experience designed to convert prospective patients by establishing trust through credentials, showcasing before/after results, and simplifying the booking process.

---

## Features
* **Dual-Funnel Booking Journey**: A custom React Hook Form with Zod validation collects pre-consultation patient details, which are seamlessly passed to an embedded Cal.com scheduler to pre-fill appointments.
* **Treatment Catalog & Dynamic Filter**: Interactive pricing table with categories (Acne, Brightening, Laser, etc.) and search capabilities.
* **Before & After Showcases**: Immersive image comparison sliders demonstrating treatment results.
* **Interactive FAQ & Doctor Profiles**: Expandable accordions to handle user objections and credential-based cards highlighting specialist credentials.
* **Premium Brand System**: A luxury-focused visual design utilizing a sophisticated color palette (Deep Emerald Teal, Champagne Gold, Warm Ivory, and Graphite) with fluid animations powered by Framer Motion.
* **Sticky Action Bar**: A mobile-optimized layout with a WhatsApp quick-connect CTA and a sticky booking shortcut.

---

## Tech Stack
* **Framework**: React 18 (Vite & TypeScript)
* **Routing**: React Router DOM (v7)
* **Styling**: Tailwind CSS (v3) & Autoprefixer
* **Form & Validation**: React Hook Form & Zod
* **Animations**: Framer Motion
* **Scheduling**: Cal.com Embed React SDK (`@calcom/embed-react`)
* **Icons**: Lucide React
* **Image Slider**: React Compare Slider

---

## Installation
To set up the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/auraskin-prototype.git
   cd auraskin-prototype
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a local `.env` file in the root directory based on the `.env.example` template:
   ```bash
   cp .env.example .env
   ```

---

## Environment Variables
The application uses the following environment variable for scheduling:

* `VITE_CALLINK`: The URL of your Cal.com event type (e.g., `https://cal.com/your-username/your-event-name`).

Refer to [.env.example](.env.example) for placeholder values.

---

## Running Locally
To launch the development server and run the application locally:

```bash
# Starts the development server at http://localhost:5173
npm run dev
```

To build the application for production:
```bash
# Generates compiled assets inside the /dist folder
npm run build
```

To preview the production build locally:
```bash
# Serves the built assets
npm run preview
```

---

## Project Structure
```text
Auraskin-Prototype/
├── .bolt/                  # Bolt.new configuration templates
├── public/                 # Static assets (favicons, SVGs)
├── src/
│   ├── components/         # Reusable presentation components
│   │   ├── Button.tsx      # Custom button design system
│   │   ├── Footer.tsx      # Contact, hours, and navigation links
│   │   ├── Header.tsx      # Desktop navigation & mobile drawer menu
│   │   ├── Layout.tsx      # Core shell page wrapper & sticky actions
│   │   ├── ScrollToHash.tsx# Anchor navigation handler
│   │   └── TopBar.tsx      # Banner announcement widget
│   ├── pages/              # Primary route views
│   │   ├── BookingPage.tsx # Consultation form & Cal.com embed
│   │   ├── Home.tsx        # Hero, Treatments, Results, FAQs
│   │   └── PricingPage.tsx # Catalog filter & Search view
│   ├── App.tsx             # Route definitions & router setup
│   ├── index.css           # Global stylesheet & Tailwind directives
│   └── main.tsx            # Application entrypoint
├── index.html              # HTML base skeleton & Google Fonts loading
├── tailwind.config.js      # Custom theme configurations
└── vite.config.ts          # Build bundler configurations
```

---

## Deployment
This project is fully ready to deploy to static hosting services such as Vercel, Netlify, or GitHub Pages. 

### Vercel / Netlify
1. Connect your GitHub repository to Vercel/Netlify.
2. Set build command to `npm run build` and publish directory to `dist`.
3. Add the environment variable `VITE_CALLINK` under your project settings.

---

## License
*No license selected yet. Add a LICENSE file to define open-source terms.*

Recommended choices:
* **MIT License**: For open-source release with minimal restrictions.
* **Proprietary**: Restrict usage if the code remains closed-source/commercial.

---

## Contributing
1. Fork the project.
2. Create a feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

## Security Notes
* **Do not commit credentials**: Never check in your local `.env` file or raw API keys.
* **History Cleanliness**: The repository's git history has been audited. When modifying custom widgets (such as Vapi voice widgets or Stripe booking checkouts), ensure all secret tokens are supplied via environment variables rather than hardcoded.
