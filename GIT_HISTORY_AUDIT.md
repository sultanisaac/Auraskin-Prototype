# Git History Audit Report - AuraSkin Prototype

This audit report inspects the entire Git history of the `Auraskin-Prototype` repository for potentially exposed secrets, credentials, or other sensitive information before public release.

## 1. Executive Summary & Findings
During the audit of the Git commit history, we scanned all commits, branches, deleted files, and old configurations. 

* **Secrets Found in Git History:** Yes (Legacy Vapi.ai keys from starter template)
* **Risk Level:** **LOW to MEDIUM** (User is not using Vapi at all; these are default template credentials. However, public code scanners will still flag them as potential exposures).
* **Primary Exposure:** Hardcoded API Web Token/Public Key and Assistant ID from **Vapi.ai** in a deleted file (`src/hooks/useVapi.ts`) that is still preserved in Git history.

---

## 2. Detailed Exposure Log

### Finding 1: Exposed Vapi.ai Web Token & Assistant ID (Template Default)
* **File Affected:** `src/hooks/useVapi.ts` (Deleted in later commits but fully readable in history)
* **Introduced In:** Commit `669fcaa` (*"Start repository"*)
* **Deleted In:** Commit `fae1e91` (*"feat: implement layout, navigation, and booking page with Cal.com integration"*)
* **Exposed Secrets (Masked):**
  - **Vapi Web Token (Public Key):** `1382fbd1-xxxx-xxxx-xxxx-fe945af2130f`
  - **Vapi Assistant ID:** `77b165e8-xxxx-xxxx-xxxx-e0245ae43beb`

> [!NOTE]
> Since the user does not have a Vapi.ai account and is not using Vapi in the active codebase (only Cal.com), these keys are legacy default values from the initial Bolt.new environment template. The risk of billing impact or direct exploitation on the user is negligible.

---

## 3. Risk Assessment
* **Severity:** **LOW to MEDIUM**
* **Threat Model:** Even though these are inactive/template placeholder keys, public scanning tools (like GitHub Advanced Security, GitGuardian, or Trufflehog) automatically search for high-entropy strings and patterns matching UUIDs or tokens. Having these in the git history will trigger automated alerts on repository release.
* **Other Scanned Items (Clean):**
  - **.env files:** Never committed to Git history. The `.env` file is properly ignored in `.gitignore`.
  - **Supabase credentials:** A dependency on `@supabase/supabase-js` was added in `package.json`, but no actual client credentials, database URLs, or Supabase service roles were ever written or committed.
  - **Cloud / SMTP / DB credentials:** None found.

---

## 4. Recommended Remediation Actions

### Action A: Git History Cleanup (Recommended before making the repo public)
To prevent security alerts on GitHub, it is recommended to completely delete the Vapi widget and hook files from the Git history so that they cannot be checked out or viewed via git log. Use `git-filter-repo` (the recommended modern tool) or `BFG Repo-Cleaner`.

Run the following command in your local workspace:

```bash
# Purge useVapi.ts and VapiWidget.tsx from all commits
git-filter-repo --path src/hooks/useVapi.ts --invert-paths
git-filter-repo --path src/components/VapiWidget.tsx --invert-paths
```

*Note: Running these commands will rewrite your git history, changing commit SHAs. You should force-push the clean history to a new clean public repository.*
