## Overview
Implement the Cal.com booking integration as defined in `CAL.COM_INTEGRATION_PLAN.md`.

## User Flow (Option A - Implemented)
1. User clicks any **Book Consultation** / **Book Now** CTA (Header, Hero, Treatments, Experts, Pricing, TopBar, Mobile Bar)
2. A smooth **animated modal** appears with a pre-consultation form (Name, WhatsApp, Treatment, Date, Time)
3. On form submission, the modal closes and the **Cal.com booking widget popup** opens
4. An **inline Cal.com embed** also lives in the Schedule Your Visit section as a fallback / direct booking path

## Tasks Completed
- [x] Task 1: Installed `@calcom/embed-react` package
- [x] Task 2: Updated `.env` with `VITE_CALLINK` (Vite-compatible prefix)
- [x] Task 3: Initialized Cal.com namespace + UI config via `getCalApi` hook (`useCalInit`)
- [x] Task 4: Replaced old `BookingFunnel` with `InlineBookingSection` (live `<Cal />` embed)
- [x] Task 5: Wired all Book CTA buttons to open `BookingModal` via custom event dispatcher
- [x] Task 6: Brand config passed (`brandColor: #0F4C5C`, `theme: light`, `layout: month_view`)

## Files Modified
- `src/App.tsx` — BookingModal, InlineBookingSection, all CTA wiring
- `.env` — `VITE_CALLINK` env variable
- `package.json` — added `@calcom/embed-react`

## Cal.com URL
`https://cal.com/sultan-isaac-jgohpm/auraskin-prototype`

## QA Checklist (Pending)
- [ ] Responsiveness on mobile
- [ ] Safari/ITP compatibility
- [ ] Adblocker test
- [ ] Timezone detection (WIB)
- [ ] CLS / skeleton loader
- [ ] Fallback link if widget fails to load
