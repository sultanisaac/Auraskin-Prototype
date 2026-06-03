# Security Audit Report - AuraSkin Prototype

This security audit report lists potential exposures, sensitive files, and recommended security fixes before releasing the `Auraskin-Prototype` repository to the public.

---

## 1. Summary of Findings

| ID | Finding | Location | Risk Severity | Status |
|----|---------|----------|---------------|--------|
| **SEC-01** | Exposed Vapi.ai Web Token & Assistant ID | Git History (`src/hooks/useVapi.ts`) | **MEDIUM** (Alert Risk) | Resolved in code, active in history |
| **SEC-02** | Hardcoded Developer Sandbox Link | `README.md` | **MEDIUM** | Active in workspace |
| **SEC-03** | Local Environment Configuration | `.env` | **LOW** | Ignored by Git (Safe) |
| **SEC-04** | Hardcoded Fallback Booking Link | `src/pages/BookingPage.tsx` | **LOW** | Active in workspace |
| **SEC-05** | Mock / Hardcoded Contact Information | `src/components/*`, `src/pages/*` | **INFO** | Active in workspace |

---

## 2. Detailed Findings & Recommendations

### SEC-01: Exposed Vapi.ai Web Token & Assistant ID (Git History)
* **Risk Severity:** **MEDIUM** (Low direct impact since user is not using Vapi; mainly triggers alerts on public release)
* **Description:** The deleted file `src/hooks/useVapi.ts` contained a hardcoded Vapi public token and assistant ID. Although the file was deleted in a commit, it is fully accessible in the git log history.
* **Exposed Value (Masked):** 
  - Token: `1382fbd1-xxxx-xxxx-xxxx-fe945af2130f`
  - Assistant ID: `77b165e8-xxxx-xxxx-xxxx-e0245ae43beb`
* **Impact:** Since the user does not use Vapi, these keys are default template resources from the initial environment starter. However, public release will cause automated security scanners to flag the repository.
* **Recommended Fix:** 
  1. No rotation needed if there is no active account associated with these.
  2. Rewrite git history using `git-filter-repo` to permanently purge `src/hooks/useVapi.ts` and `src/components/VapiWidget.tsx`.

---

### SEC-02: Hardcoded Developer Sandbox Link (README.md)
* **Risk Severity:** **MEDIUM**
* **Description:** The existing `README.md` file contains a direct edit link to the Bolt.new sandbox environment: `https://bolt.new/~/sb1-dsunyvgc`.
* **Impact:** Releasing this link publicly allows anyone to view and fork the original editor workspace on Bolt.new.
* **Recommended Fix:** Overwrite the existing `README.md` with a clean, production-ready document and remove the Bolt.new template badge.

---

### SEC-03: Local Environment Configuration (.env)
* **Risk Severity:** **LOW**
* **Description:** A local `.env` file exists containing the Cal.com link: `VITE_CALLINK=https://cal.com/sultan-isaac-jgohpm/auraskin-prototype`.
* **Impact:** This file is currently excluded via `.gitignore`, meaning it will not be uploaded when pushed to GitHub.
* **Recommended Fix:** Keep the file ignored. Add a `.env.example` file (completed) to provide a template for other developers.

---

### SEC-04: Hardcoded Fallback Booking Link (BookingPage.tsx)
* **Risk Severity:** **LOW**
* **Description:** In `src/pages/BookingPage.tsx`, there is a hardcoded fallback link:
  `const CAL_LINK = ... || 'sultan-isaac-jgohpm/auraskin-prototype';`
* **Impact:** Exposes the developer's personal Cal.com link as the fallback namespace if the environment variable `VITE_CALLINK` is not set.
* **Recommended Fix:** Keep it as a fallback, or replace it with a generic placeholder (e.g. `your-clinic-namespace/consultation`) and document it in `.env.example`.

---

### SEC-05: Mock / Hardcoded Contact Information (Multiple Files)
* **Risk Severity:** **INFORMATIONAL**
* **Description:** Hardcoded WhatsApp link (`https://wa.me/6281288882828`), phone number (`+62 812 8888 2828`), and office address (`SCBD Tower 2, Jl. Jend. Sudirman Kav. 52, 53, Jakarta Selatan 12190`) are hardcoded in layout, home, pricing, and booking pages.
* **Impact:** These are mock values for demonstration purposes, but they should be confirmed by the owner before deploying to production.
* **Recommended Fix:** Leave them in the code for the prototype design, but flag them for replacement when transitioning from prototype to production.
