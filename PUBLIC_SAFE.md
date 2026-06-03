# Repository Cleanup Audit — PUBLIC_SAFE.md

This document categorizes all files and components in the `Auraskin-Prototype` repository to verify their safety for public release. 

---

## 1. Categorized Repository Files

### 🟥 CATEGORY: Remove Before Publishing
These files or artifacts contain exposed secrets or links that should not be visible in a public repository.

| File / Component | Location | Reason | Suggested Action |
|------------------|----------|--------|------------------|
| **Vapi.ai Secrets** | Git History (deleted file `src/hooks/useVapi.ts`) | Contains hardcoded Web SDK public token and Assistant ID. | Rewrite Git history using `git-filter-repo` to permanently erase this file and `src/components/VapiWidget.tsx`. |
| **Bolt.new Sandbox Link** | `README.md` | Contains a badge linking directly to the editor workspace of this project. | Overwrite the `README.md` with a clean public version (without the editor link). |

---

### 🟨 CATEGORY: Review Before Publishing
These files are not immediate security risks but contain internal planning, branding, or tooling references that may be proprietary or should be verified by the owner.

| File / Component | Location | Reason | Suggested Action |
|------------------|----------|--------|------------------|
| `BRANDING.md` | Root | Visual guidelines, copy guidelines, and color systems for AuraSkin Jakarta. | Review whether this guideline document is intended to be public or kept private. |
| `CAL.COM_INTEGRATION_PLAN.md` | Root | Planning document detailing embed approaches and QA checklists. Contains personal namespace links. | Review if the planning doc is required in the public repo. If kept, consider replacing personal developer namespaces with placeholders. |
| `.bolt/` directory | `.bolt/config.json`, `.bolt/prompt` | Contains configurations and system prompts used by the Bolt.new development environment. | Can be kept if you want the project to open smoothly in Bolt.new. Can be deleted if releasing as a standard Vite React project. |

---

### 🟩 CATEGORY: Safe to Publish
These files are standard source code, configuration files, and assets necessary for the project to run. They contain no private data.

* **Source Code:** All files in `src/` (except history references above):
  - `src/App.tsx`
  - `src/index.css`
  - `src/main.tsx`
  - `src/vite-env.d.ts`
  - `src/components/Button.tsx`, `src/components/Footer.tsx`, `src/components/Header.tsx`, `src/components/Layout.tsx`, `src/components/ScrollToHash.tsx`, `src/components/TopBar.tsx`
  - `src/pages/BookingPage.tsx`, `src/pages/Home.tsx`, `src/pages/PricingPage.tsx`
* **Configuration Files:**
  - `eslint.config.js`
  - `postcss.config.js`
  - `tailwind.config.js`
  - `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
  - `vite.config.ts`
* **Dependencies & Entrypoints:**
  - `package.json`, `package-lock.json`
  - `index.html`
* **Public Assets:**
  - `public/favicon.svg`
* **Git Meta:**
  - `.gitignore` (excludes `.env`, `dist/`, and `node_modules/` successfully)

---

## 2. General Cleanup Recommendations
1. **Do not delete anything automatically.** The cleanup process should be guided by this list.
2. **Review Mock Patient Data:** Confirm that Valerie K., Sarah M., Jessica T., and Anita W. (testimonials in `src/pages/Home.tsx` and `src/pages/BookingPage.tsx`) are indeed mock personas and that their pictures are public domain Unsplash URLs.
3. **Verify Licenses:** Ensure a License is added to specify the terms under which the code is released (see License section of `PUBLIC_RELEASE_AUDIT.md`).
