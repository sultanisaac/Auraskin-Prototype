# Cal.com Integration Plan

## Project Context
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Routing**: Single Page Application (SPA) using Anchor Links (Currently no React Router)

## A) Recommended Embed Approach
**Recommendation**: Use the **Advanced JS Embed (React Component)** via the `@calcom/embed-react` package.
**Reasoning**: 
- **Performance & Control**: The React package provides a cleaner API for React applications compared to managing a raw `<iframe>` or injecting vanilla JS snippets.
- **Dynamic Config**: It allows passing dynamic configuration (brand colors, theme, pre-filling email) directly through React props.
- **Hydration/Mounting Safety**: The React package handles component mounting, unmounting, and script loading cleanly without risking layout shifts or SSR conflicts.
- **Flexibility**: It provides built-in components for both inline embeds (`<Cal />`) and programmatically triggered modals (`getCalApi`), supporting both of your requested flows flawlessly.

## B) Step-by-Step Tasks List
- [ ] **Task 1:** Install the `@calcom/embed-react` package via npm.
- [ ] **Task 2:** Set up a `.env` file to store the Cal.com `VITE_CAL_LINK`.
- [ ] **Task 3:** Initialize the Cal.com namespace in `App.tsx` using the `getCalApi` hook to preload the widget for instant modal popups.
- [ ] **Task 4:** Create a reusable inline component (e.g., `<CalEmbed />`) and replace the current custom `BookingFunnel` form section in `src/App.tsx`.
- [ ] **Task 5:** Implement the modal/popup approach for the global "Book Consultation" CTA buttons (Header, Final CTA, and Sticky Mobile Action Bar).
- [ ] **Task 6:** Pass brand styles (colors/theme) to the Cal.com config via props to match AuraSkin's aesthetics.
- [ ] **Task 7:** Implement a fallback UI (direct link button) in case the Cal.com embed script fails to load.

## C) Files and Components to Modify
1. **`package.json`**
   - Add `@calcom/embed-react` dependency.
2. **`.env`** *(New File)*
   - Add `VITE_CAL_LINK="auraskin/consultation"` (placeholder).
3. **`src/App.tsx`**
   - **Remove**: The custom `react-hook-form` + `zod` multi-step form inside the `BookingFunnel` component.
   - **Add**: Import `Cal` and `getCalApi` from `@calcom/embed-react`.
   - **Update**: Re-wire the "Book Now" and "Book Consultation" buttons to trigger the Cal.com modal instead of anchoring down the page.
   - **Replace**: Inject the `<Cal />` component into the `BookingFunnel` section for inline booking.

## D) Environment and Configuration Needed
**Environment Variables (`.env`):**
```env
VITE_CAL_LINK="your-username/your-event-type"
```

**Brand Configuration (Passed via Props):**
To align with AuraSkin's luxury brand, we will inject these styles into the widget's config object:
- `theme`: `"light"`
- `brandColor`: `"#0F4C5C"` (Deep Emerald)
- `hideEventTypeDetails`: `false` (or `true` if we want a cleaner look since the website already explains it).
- `layout`: `"month_view"`

*Note on Limitations*: Cal.com's iframe explicitly prevents raw CSS injection for security reasons. We are strictly limited to the UI configuration parameters exposed by their API. We cannot change their internal fonts or border radiuses beyond what the config allows.

## E) QA Checklist
- [ ] **Responsiveness**: Verify the inline embed does not break layout bounds on small mobile screens (min-width/iframe height issues).
- [ ] **Safari/Chrome ITP**: Ensure 3rd-party cookie blocking (Intelligent Tracking Prevention in Safari) doesn't break the booking flow inside the iframe.
- [ ] **Adblockers**: Test with uBlock Origin / Brave Shields. Ensure the embed script isn't aggressively blocked.
- [ ] **Timezone Check**: Ensure the embed accurately detects and displays the user's local timezone (WIB/Jakarta time).
- [ ] **GDPR/Cookie Banner**: Verify the `hide_gdpr_banner` flag behaves correctly and aligns with the site's privacy policy.
- [ ] **Cumulative Layout Shift (CLS)**: Ensure a skeleton loader or fixed height container is used so the page doesn't jump when the iframe loads.

## F) Rollout Plan
1. **Feature Branching**: Development is done on the isolated `v0` branch.
2. **Implementation**: Execute the steps. Since no backend changes are required, local Vite preview is sufficient for testing.
3. **Fallback Mechanism**: Add a basic error boundary. If the widget fails to load within 5 seconds, fallback to displaying a standard `<a href="https://cal.com/..." target="_blank">Book on Cal.com</a>` button.
4. **Staging Review**: Deploy the branch to Vercel/Netlify staging to test on actual mobile devices.
5. **Merge**: Once verified, merge to main.

## G) Future Upgrades
- **Form Prefill (Frictionless UX)**: Add a lightweight landing page form capturing Name/Email, then pass these into the Cal.com embed using the `config={{ name: '...', email: '...' }}` property. This hooks the user early before showing them the calendar.
- **UTM Tracking**: Pass `utm_source`, `utm_medium` from the page URL parameters directly into the Cal.com embed configuration so conversions can be attributed to specific ad campaigns.
- **Webhook Automations**: When the user upgrades their Cal.com plan, configure webhooks to Zapier/Make. Upon a successful booking, automatically add the lead to the clinic's CRM and send a customized, branded WhatsApp confirmation message.
