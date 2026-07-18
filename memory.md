# IQ Intern - Project Memory & Change Log

This file tracks all codebase modifications, features added, refactoring actions, and configuration updates. It serves as a persistent project memory for developers and AI coding agents.

---

## ⚠️ Instructions for Developers and AI Agents

Whenever you modify any logic, file structure, or configurations in this repository:
1. **Append a Change Log entry**: Add a new entry to the [Chronological Change Log](#chronological-change-log) section below. Outline the date, description of changes, files modified, and impact.
2. **Auto-update [brain.md](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/brain.md)**: If your change introduces new features, sub-pages, database tables, environment variables, dependencies, or structural changes, you **MUST** immediately update the [brain.md](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/brain.md) file to keep the feature map synchronized.

---

## 📌 Current Project Status

- **Active Development**: Modifications to internship template layouts.
- **Unstaged Changes**:
  - `[MODIFY]` [internship_digital_marketing.html](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/public/templates/default/internship_digital_marketing.html) (Active work-in-progress layout updates).

---

## 📜 Chronological Change Log

### 2026-07-18 — Restored Original Web Color Schemes
- **Description**: Reverted all visual identity alterations (including dark gradient and blue-and-white theme changes) across all public pages, portal layouts, policies, legal templates, and CSS stylesheets, returning to the website's original design and color palettes. Kept compiler fixes and pathname checks in place.
- **Files Reverted**: All page files, layout modules, legal scripts, and `app/globals.css`.
- **Impact**: Full restoration of original site design colors as requested.

### 2026-07-18 — Disabled Turbopack & Extended Cache Cleansing
- **Description**: Replaced Next.js experimental Turbopack compilation with stable Webpack dev builds by appending `--webpack` to the `dev` script in `package.json`. Updated `clean-cache.js` to clear `.next/dev` and `.next/types` along with `.next/cache` to prevent LevelDB locks on Windows.
- **Files Modified**:
  - `[MODIFY]` [package.json](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/package.json) (Appended --webpack to dev script)
  - `[MODIFY]` [clean-cache.js](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/scripts/clean-cache.js) (Added .next/dev and .next/types paths)
- **Impact**: Completely resolves Turbopack native file compaction / write batch locking errors on Windows environments.

### 2026-07-18 — UI/UX Palette Customizations & SSR Error Protection
- **Description**: Migrated the light-themed page blocks on Home, About, Contact, and Internship catalog pages to follow the Blue & White premium SaaS design guidelines. Handled null checks on usePathname in Navbar component to avoid SSR rendering runtime errors.
- **Files Modified**:
  - `[MODIFY]` [page.tsx](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/app/page.tsx) (Home Page)
  - `[MODIFY]` [page.tsx](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/app/internships/page.tsx) (Internship Page Catalog)
  - `[MODIFY]` [page.tsx](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/app/about/page.tsx) (About Page)
  - `[MODIFY]` [page.tsx](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/app/contact/page.tsx) (Contact Page)
  - `[MODIFY]` [Navbar.tsx](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/components/Navbar.tsx) (Guarded usePathname evaluation)
- **Impact**: Standardizes the light/off-white layout text and cards typography system, and eliminates any potential 500 pre-rendering errors on initial local visits.

### 2026-07-18 — Global Visual Identity Migration to Premium Dark Theme
- **Description**: Migrated the entire platform visual identity to a premium dark gradient theme with yellow highlights and Inter typography.
- **Files Modified**:
  - `[MODIFY]` [globals.css](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/app/globals.css) (Reconfigured font-sans, colors, glassmorphism, inputs, buttons, and badges)
  - `[MODIFY]` [layout.tsx](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/app/student/layout.tsx) (Updated student header, sidebar, profile selectors, and loading skeletons)
  - `[MODIFY]` [layout.tsx](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/app/admin/layout.tsx) (Updated admin dashboard headers, sidebars, switch views, and backgrounds)
  - `[MODIFY]` [page.tsx](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/app/student/internships/page.tsx) (Standardized student track button themes)
  - `[MODIFY]` [page.tsx](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/app/internships/page.tsx) (Standardized public track catalog themes)
  - `[MODIFY]` [generate_legal.js](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/generate_legal.js) (Updated legal page compiler template)
  - `[MODIFY]` [page.tsx](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/app/refund-policy/page.tsx) (Updated to dark theme and Inter font)
  - `[MODIFY]` [page.tsx](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/app/cancellation-policy/page.tsx) (Updated to dark theme and Inter font)
- **Impact**: Unifies the platform identity with the modern, immersive "Certification Journey" palette system, offering high-contrast legibility and a premium tech-forward UX.

### 2026-07-16 — Premium Certificate Details Mapping & Supabase Sync
- **Description**: Configured template rendering parameters to support custom placeholders in the updated `certificate.html`. Mapped variables (e.g. `INTERN_NAME`, `COMPANY_NAME`, `ROLE_TITLE`, `START_DATE`, `END_DATE`, `VERIFICATION_URL`, etc.) with fallback properties and track-specific mentors/departments. Synchronized the local premium template to the Supabase database.
- **Files Modified**:
  - `[MODIFY]` [template-renderer.ts](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/lib/templates/template-renderer.ts)
  - `[MODIFY]` [certificate.html](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/public/templates/default/certificate.html)
- **Impact**: Ensures dynamically generated student certificates are accurately populated with professional credentials, verified details, and are live for all users on the platform.

### 2026-07-16 — Fixed Admin-to-Student Role Switch Redirection & Logout
- **Description**: Fixed a race condition where toggling the session role back to `"admin"` from Student View cleared the user session. Instead of reloading the current page (`window.location.reload()`) which re-rendered layout components under incorrect auth scopes, it now performs a direct navigation redirect (`window.location.href`) to the correct panel dashboard.
- **Files Modified**:
  - `[MODIFY]` [auth.ts](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/lib/supabase/auth.ts)
- **Impact**: Eliminates credentials verification delay and prevents unintended logouts when admins switch back and forth between student impersonation and administrator screens.

### 2026-07-16 — Created Project Brain and Memory Maps
- **Description**: Added developer reference documentation to mapping features and log project modifications.
- **Files Modified**:
  - `[NEW]` [brain.md](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/brain.md)
  - `[NEW]` [memory.md](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/memory.md)
- **Impact**: Provides instant architectural reference and change histories for future development sprints and AI context.

### Recent Update — Document Amount Conversion & Receipt Layout Modernization
- **Description**: Refactored the invoice generator mapping to convert paise currency values to Rupees, updated fallback loaders, and redesigned the default receipt layout.
- **Files Modified**:
  - `[MODIFY]` [generator.ts](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/lib/documents/generator.ts) (Paise-to-Rupees mapping, added mock payments amount)
  - `[MODIFY]` [template-loader.ts](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/lib/templates/template-loader.ts) (Added fallback receipt template support for amount values)
  - `[MODIFY]` [receipt.html](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/public/templates/default/receipt.html) (Minimal clean look, blue-to-white header gradient, Inter font, inline SVG icons)
  - `[MODIFY]` [page.tsx](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/app/student/internships/page.tsx) (Modernized inline receipt HTML layout)
  - `[MODIFY]` [page.tsx](file:///c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern/app/student/dashboard/page.tsx) (Modernized dashboard inline receipt view)
- **Impact**: Cleaned up invoice presentation to standard professional standards.

### Historic Commits Log
- **Payment Page Modification & Integration** (Commit `baea53b`, `140a0f9`): Integrated Razorpay SDK and refactored billing screen modals and processing status container page inside student directory.
- **Verification QR Codes** (Commit `588757b`, `338c6a1`): Added dynamic QR code generation helper library to verify issued PDF certificates and mapped verification paths.
- **Offer Letter Generation** (Commit `ac993aa`, `f5bbfeb`): Formulated document templates and handler API configurations to automatically create personalized offer letters for enrolled students.
- **SEO & Discoverability** (Commit `460729e`, `4588ab5`, `2b7640f`): Formulated dynamic search index tools `sitemap.ts`, `robots.ts`, and synchronized parameters with Google Search Console.
