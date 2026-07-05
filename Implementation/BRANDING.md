# AuraSkin Jakarta — Brand Guidelines

> *"Natural Beauty. Expert Results."*

This document defines the visual identity, tone, and design system for the AuraSkin Jakarta prototype. All developers and designers should reference this file before making UI/content decisions.

---

## 1. Brand Identity

| Property       | Value                                                  |
|----------------|--------------------------------------------------------|
| **Brand Name** | AuraSkin                                               |
| **Sub-Brand**  | AuraSkin Jakarta                                       |
| **Tagline**    | Natural Beauty. Expert Results.                        |
| **Category**   | Premium Medical Aesthetic Clinic                       |
| **Location**   | SCBD Tower 2, Jl. Jend. Sudirman, Jakarta Selatan 12190 |
| **Contact**    | +62 812-8888-2828                                      |
| **Instagram**  | 250K+ followers                                        |

### Brand Personality
- **Luxury** — premium, aspirational, high-end aesthetic
- **Trust** — board-certified doctors, FDA-approved, transparent pricing
- **Science-backed** — clinical expertise, real results, evidence-based
- **Warmth** — personalized care, no pushy sales, patient-first approach
- **Empowerment** — helping women feel confident in their own skin

---

## 2. Color Palette

All color tokens are defined in `tailwind.config.js`.

| Token         | Hex       | Name              | Usage                                         |
|---------------|-----------|-------------------|-----------------------------------------------|
| `primary`     | `#0F4C5C` | Deep Emerald Teal | Primary CTAs, headings, brand accent, links   |
| `secondary`   | `#D4B483` | Champagne Gold    | Star ratings, highlights, trust badges, hover |
| `background`  | `#FAF8F4` | Warm Ivory        | Page background, section fills, cards         |
| `accent`      | `#E8DCCB` | Blush Sand        | Before/After cards, form inputs, dividers     |
| `text`        | `#1F2937` | Graphite          | Body copy, labels, secondary text             |

### Extended Palette (in-component use)
| Purpose               | Value / Class            |
|-----------------------|--------------------------|
| Dark background       | `#111827` (gray-900)     |
| Muted text            | `#6B7280` (gray-500)     |
| Light border          | `#F3F4F6` (gray-100)     |
| WhatsApp CTA          | `#22C55E` (green-500)    |
| Error states          | `#EF4444` (red-500)      |
| Prototype badge       | `#FBBF24` bg / `#78350F` text (yellow-400/900) |

### Cal.com Brand Config
```json
{
  "theme": "light",
  "brandColor": "#0F4C5C",
  "layout": "month_view",
  "hideEventTypeDetails": false
}
```

---

## 3. Typography

| Role              | Font Family         | Weight     | Usage                               |
|-------------------|---------------------|------------|-------------------------------------|
| **Display / H1**  | Playfair Display    | 700 (Bold) | Hero headline, section titles       |
| **Headings H2–H3**| Playfair Display    | 700        | Section headings, card titles       |
| **Body / UI**     | Inter               | 400 / 500  | Body copy, labels, nav, buttons     |
| **Emphasis**      | Inter               | 600 / 700  | CTAs, prices, stats, badge text     |

### Type Scale (Reference)
| Level     | Size Class          | Usage                         |
|-----------|---------------------|-------------------------------|
| Hero H1   | `text-4xl`–`text-6xl` | Main headline (responsive)  |
| Section H2| `text-4xl`          | All major section titles      |
| Card H3   | `text-xl`–`text-2xl`| Treatment & doctor names      |
| Body      | `text-base`–`text-lg`| Paragraphs, descriptions     |
| Label     | `text-sm`           | Form labels, captions         |
| Micro     | `text-xs`–`text-[10px]`| Badges, tags, tracking text|

---

## 4. UI Component Patterns

### Button Variants
| Variant     | Style                                          | Use Case                          |
|-------------|------------------------------------------------|-----------------------------------|
| `primary`   | `bg-primary text-white` + shadow               | Main CTAs (Book, Confirm)         |
| `secondary` | `bg-secondary text-white`                      | High-contrast CTA on dark bg      |
| `outline`   | `border-2 border-primary text-primary`         | Secondary actions, treatment cards|
| `ghost`     | `text-primary hover:bg-primary/10`             | Tertiary / navigation actions     |

All buttons use: `rounded-md px-6 py-3 font-medium transition-all duration-300`

### Border Radius Convention
| Element              | Radius             |
|----------------------|--------------------|
| Cards, modals        | `rounded-2xl` / `rounded-3xl` |
| Buttons              | `rounded-md`       |
| Inputs               | `rounded-xl`       |
| Avatar / Badges      | `rounded-full`     |
| Hero image           | `rounded-[2rem]`   |

### Spacing
- Section vertical padding: `py-24`
- Max content width: `max-w-7xl mx-auto`
- Horizontal padding: `px-4 sm:px-6 lg:px-8`

---

## 5. Iconography

Library: **Lucide React**

| Icon           | Usage                            |
|----------------|----------------------------------|
| `Sparkles`     | AuraSkin logo mark               |
| `Calendar`     | Booking / scheduling CTAs        |
| `ShieldCheck`  | Trust / certification badge      |
| `Star`         | Ratings, social proof            |
| `Award`        | Doctor credentials               |
| `Heart`        | Personalized care                |
| `MessageCircle`| WhatsApp / consultation chat     |
| `Check`        | Feature lists, trust badges      |
| `ChevronDown`  | Dropdowns, FAQ accordion         |
| `ArrowRight`   | Directional / before-after       |
| `Phone`        | Mobile contact bar               |
| `MapPin`       | Clinic location                  |
| `Instagram`    | Social media footer link         |
| `Loader2`      | Loading / submitting state       |
| `X`            | Modal close button               |

---

## 6. Animation & Motion

Library: **Framer Motion**

| Pattern              | Config                                              |
|----------------------|-----------------------------------------------------|
| Fade-in (page entry) | `initial={{ opacity: 0 }} animate={{ opacity: 1 }}` |
| Slide-in left (Hero) | `initial={{ x: -50 }} animate={{ x: 0 }}` 0.8s     |
| Scale-in (Hero img)  | `initial={{ scale: 0.9 }} animate={{ scale: 1 }}` 0.8s|
| Card hover lift      | `whileHover={{ y: -10 }}`                           |
| Card hover scale     | `whileHover={{ scale: 1.03 }}`                      |
| Modal entry          | `opacity: 0 → 1`, `scale: 0.95 → 1`, `y: 20 → 0`, 0.25s |
| Modal exit           | Reverse via `AnimatePresence`                       |
| Image zoom on hover  | `group-hover:scale-110 transition-transform duration-500` |

---

## 7. Content & Tone of Voice

| Principle       | Description                                                       |
|-----------------|-------------------------------------------------------------------|
| **Confident**   | Direct, expert language — "Board-Certified", "FDA Approved"       |
| **Warm**        | Empathetic, never clinical-cold — "We care about your skin goals" |
| **Premium**     | Avoid discount language. Lead with value, not price.              |
| **Clear**       | Short sentences. No jargon. Results-focused.                      |
| **Trustworthy** | Always quantify claims — "20,000+ Treatments", "4.9 Rating"       |

### Key Messaging Pillars
1. **Expert Credentials** — 15+ certified doctors, 10 years experience
2. **Proven Results** — 20,000+ treatments, before/after documentation
3. **Transparent Pricing** — No hidden fees, price listed upfront
4. **Free Consultation** — Low-barrier first step, no obligation

---

## 8. Social Proof & Trust Signals

| Signal                 | Value / Format                             |
|------------------------|--------------------------------------------|
| Patient count          | 20,000+                                    |
| Google/review rating   | 4.9 ⭐                                    |
| Review count           | 1,500+                                     |
| Instagram followers    | 250K                                       |
| Doctor count           | 15+                                        |
| Years in business      | 10 Years                                   |
| Certifications         | FDA Approved, Licensed Clinic, Certified Doctors |

---

## 9. Layout Structure (Landing Page)

| # | Section             | Purpose                            |
|---|---------------------|------------------------------------|
| 1 | TopBar              | Urgency — slot availability        |
| 2 | Header              | Navigation + primary Book CTA      |
| 3 | Hero                | Main value prop + dual CTA         |
| 4 | TrustBadges         | Quick credential scan              |
| 5 | BeforeAfter         | Visual proof of results            |
| 6 | Treatments          | Services overview + pricing        |
| 7 | WhyChooseUs         | Differentiators (6 pillars)        |
| 8 | SocialProof         | Reviews + stats                    |
| 9 | Experts             | Doctor profiles                    |
| 10| Pricing             | Transparent price list             |
| 11| InlineBookingSection| Cal.com live calendar embed        |
| 12| FAQ                 | Objection handling                 |
| 13| FinalCTA            | Last-chance conversion push        |
| 14| Footer              | Contact, hours, links              |

---

## 10. Booking Flow

**Trigger**: Any "Book Consultation" / "Book Now" button dispatches `openBookingModal` event.

**Step 1 — Pre-Consultation Modal**
- Fields: Full Name, WhatsApp Number, Treatment Interest, Preferred Date, Preferred Time
- Validation via `react-hook-form` + `zod`
- Submit → closes modal, opens Cal.com popup

**Step 2 — Cal.com Widget Popup**
- Loads `https://cal.com/sultan-isaac-jgohpm/auraskin-prototype`
- Pre-seeded with user's name and treatment notes
- Brand config: `theme: light`, `brandColor: #0F4C5C`

**Fallback**: Inline `<Cal />` embed always visible in Section 11.

---

*Last updated: May 2026 | Prototype v0*
