# CampusFlow — Project Architecture & Operational Brain

> **Quick Reference**: This `brain.md` document summarizes the architecture, design tokens, operational workflows, and screen catalog for the CampusFlow project. Use this file for rapid analysis without needing to scan the entire codebase.

---

## 1. Project Overview & Identity
- **Product Name**: CampusFlow
- **Tagline**: Intelligent Campus Operations
- **Category**: University Facility Management & Autonomous Workforce Dispatch SaaS
- **Primary Deliverable**: Complete multi-page interactive web application in `code.html` (mirrored in `index.html`) running on `http://localhost:8080`.
- **Target Architecture**: Next.js 15 App Router, Tailwind CSS, TypeScript, Prisma ORM, and Redis SLA Delay Queues.

---

## 2. Design System Tokens & High-Craft Button Architecture (Anti-AI Slop)
- **Palette**:
  - Canvas / Surface: Grounded Slate Canvas `#f8fafc` (`bg-surface`)
  - Primary Surface Containers: Optical White (`#ffffff`) with 1px border `rgba(15, 23, 42, 0.08)`
  - Primary Typography / Brand: Executive Midnight Slate (`#0f172a`)
  - Semantic Status:
    - Active / Resolved: Deep Hunter Emerald (`#047857` / `#059669`) with structured badge `#ecfdf5`
    - High Priority / In Progress: Institutional Cobalt (`#1d4ed8` / `#2563eb`) with container `#eff6ff`
    - Warning / Verification: Amber Warning (`#d97706`) with container `#fffbeb`
    - Critical / 30m SLA Expiry: Crimson Alert (`#dc2626`) with container `#fef2f2`
- **Elimination of AI Slop Tropes**:
  - **No Generic 9999px Pills (`rounded-full`) on interactive controls**: Replaced with engineered `rounded-lg` (8px) and `rounded-md` (6px).
  - **No Saturated Gradient Fills**: Eliminated garish purple-to-indigo/cyan gradient fills on buttons in favor of solid high-contrast executive slate (`#0f172a`) and deep institutional emerald (`#059669`).
  - **No Diffuse Glowing Halos**: Eliminated blurry ambient colored glows (`blur-2xl`, `blur-3xl`, neon drop-shadows) in favor of crisp 1px borders and layered micro-shadows (`shadow-[0_1px_2px_rgba(0,0,0,0.05)]`).
  - **Tactile Feedback**: Replaced floaty hover effects with physical active depression (`active:translate-y-[0.5px]`).
- **Button & Component Geometry**:
  - **Primary Action**: `rounded-lg` (8px), `bg-slate-900 text-white font-semibold border border-slate-950/20 shadow-sm active:translate-y-[0.5px]`.
  - **Accent / Hero Action**: `rounded-lg` (8px), `bg-emerald-600 text-white font-semibold border border-emerald-700/60 shadow-sm hover:bg-emerald-700 active:translate-y-[0.5px]`.
  - **Secondary Action**: `rounded-lg` (8px), `bg-white text-slate-800 font-semibold border border-slate-300 shadow-sm hover:bg-slate-50 active:bg-slate-100`.
  - **Floating Navigation Shell**: Modern architectural bar `rounded-2xl` (16px) with `border border-slate-200/90 shadow-sm backdrop-blur-md` (replacing the AI-slop floating capsule).
  - **Status & Telemetry Badges**: Engineered status chips `rounded-md` (6px) with `font-mono text-[10px] sm:text-[11px] px-2.5 py-0.5 border`.

---

## 3. Five-Tier Role Hierarchy & Authentication Flow
- **Authentication Experience**:
  - **Sign In & Get Started Routing**:
    - **Sign In** (`?mode=signin`) routes directly to `login.html` with the **Sign In** tab selected.
    - **Get Started** (`?mode=signup`) routes directly to `login.html` with the **Sign Up / Create Account** tab selected.
    - Inside `login.html`, segmented tabs and contextual helper links allow instantaneous client-side switching between Sign In and Sign Up modes.
  - Dedicated Login/Signup screen featuring the exact 4 core fields:
    1. **Role Dropdown**: User, HOD/Warden, Worker, Admin, Super Admin.
    2. **Method Selector**: Segmented toggle between *University Email* and *Mobile Phone*.
    3. **Data Input**: Reactive identifier field (updates label, placeholder, and validation dynamically).
    4. **Password**: Pre-filled reactive input with password visibility toggle and dynamic default password hint.
  - **Default Credentials & Passwords**:
    - **Universal Default Password**: `Campus@2026` (accepted across all roles and accounts).
    - **Student / Complainant (`user`)**: `aarav.patel@eng.university.edu` / `+91 98765 43210` (Password: `Campus@2026` or `User@2026`)
    - **HOD / Warden (`authority`)**: `ramesh.sharma@faculty.university.edu` / `+91 98220 11200` (Password: `Campus@2026` or `Authority@2026`)
    - **Field Technician (`worker`)**: `rajesh.kumar@technician.university.edu` / `+91 98231 44102` (Password: `Campus@2026` or `Worker@2026`)
    - **Facilities Admin (`admin`)**: `vikram.rao@facilities.university.edu` / `+91 98110 33400` (Password: `Campus@2026` or `Admin@2026`)
    - **Super Admin (`super`)**: `aris.thorne@governance.university.edu` / `+91 98000 99999` (Password: `Campus@2026` or `Super@2026`)
  - **Google SSO**: Available exclusively when the `User` role is selected.
  - **Direct Role Redirection**: On submit, authenticates and routes directly to the corresponding role dashboard (`#user-overview`, `#authority-overview`, `#worker-overview`, `#admin-overview`, `#super-overview`).
  - **Authenticated Topbar**: Contains "Switch Role" and "Sign Out" actions to easily toggle between personas or return to the public landing page.
2. **HOD / Warden** (`AUTHORITY`):
   - Scope: Department heads and hostel wardens scoped to their jurisdiction (e.g., *Academic Block B & Labs*).
   - Capabilities: Verification queue, 1-tap Approve & Dispatch, Reject with stated reason, Request additional clarification.
3. **Worker / Field Technician** (`WORKER`):
   - Scope: Electricians, plumbers, HVAC technicians, carpenters, civil maintenance, sanitation staff.
   - Capabilities: Mobile-first interface with **ONLINE/OFFLINE** toggle, urgent incoming dispatch cards with **30-Minute Ticking Countdown Timer**, Accept/Decline actions, progress logging, and completion with photographic proof.
4. **Facilities Admin** (`ADMIN`):
   - Scope: Campus facilities superintendents and dispatch coordinators.
   - Capabilities: Master ticket database, workforce roster (95 technicians), worker account provisioning, department management, assignment telemetry monitoring, manual reassignment override.
5. **Super Admin** (`SUPER_ADMIN`):
   - Scope: Vice-Chancellors and Chief Information Officers.
   - Capabilities: Cross-campus node health, tenant management, 5-tier role and permission matrix, **Assignment Engine Configuration** (tuning weights for trade compatibility, skill matching, proximity, and fairness), and immutable SHA-256 audit logs.

---

## 4. End-to-End Operational Lifecycle & 30-Minute SLA Rule
1. **Report Issue**: User logs issue title, trade department, descriptive room location, priority, and photo proof.
2. **Authority Verification**: Scoped HOD/Warden inspects and approves request.
3. **Intelligent Worker Matching**: Algorithmic engine scores candidate technicians based on trade compatibility (35%), certified skills (25%), proximity (20%), and workload fairness (20%).
4. **30-Minute Dispatch Window**: Candidate technician receives urgent mobile alert with ticking countdown.
   - **Accept**: Worker locks into job; status transitions to `ACTIVE_IN_PROGRESS`.
   - **Decline / 30m Timeout**: Engine records response and automatically cascades to secondary standby unit (e.g., `WRK-0019 Vikram Singh`).
5. **Maintenance Execution**: Technician arrives on-site, logs status updates, and consumes inventory.
6. **Completion & Archival**: Technician uploads geostamped photo proof; complainant and warden are notified; record is sealed in the immutable audit log.

---

## 5. Screen Catalog (All 57 Pages Implemented in `code.html`)
- **Public Website (11)**:
  `#home`, `#about`, `#platform`, `#how-it-works`, `#departments`, `#department-details`, `#analytics`, `#login`, `#signup`, `#otp-verify`, `#account-recovery`.
- **User Dashboard (8)**:
  `#user-overview`, `#user-report`, `#user-complaints`, `#user-complaint-details`, `#user-history`, `#user-notifications`, `#user-profile`.
- **Authority Dashboard (10)**:
  `#authority-overview`, `#authority-queue`, `#authority-review`, `#authority-approved`, `#authority-rejected`, `#authority-active`, `#authority-workers`, `#authority-analytics`, `#authority-notifications`, `#authority-settings`.
- **Worker Dashboard (10)**:
  `#worker-overview`, `#worker-incoming`, `#worker-assignment`, `#worker-active`, `#worker-progress`, `#worker-complete`, `#worker-completed`, `#worker-history`, `#worker-notifications`, `#worker-profile`.
- **Admin Dashboard (12)**:
  `#admin-overview`, `#admin-complaints`, `#admin-workers`, `#admin-create-worker`, `#admin-worker-details`, `#admin-departments`, `#admin-assignments`, `#admin-assignment-details`, `#admin-reports`, `#admin-notifications`, `#admin-settings`.
- **Super Admin Dashboard (11)**:
  `#super-overview`, `#super-users`, `#super-user-details`, `#super-roles`, `#super-permissions`, `#super-hierarchy`, `#super-assignment-engine`, `#super-settings`, `#super-audit-logs`, `#super-activity`, `#super-analytics`.
- **Operational States**:
  Empty Data, Skeleton Loading, 30m SLA Expiration / Cascade, 403 Jurisdiction Boundary, Offline Cached Mode, Cryptographically Signed Completion.

---

## 6. Illustrative Entity Roster
- **Primary Complaint**: `CF-2026-00124` — *Electrical Switchboard Malfunction & Sparking*, Academic Block B, Second Floor, Room 204.
- **Primary Technician**: `WRK-0018 Rajesh Kumar` — Senior Electrician, Shift A, 98.4% SLA Compliance.
- **Standby Technician**: `WRK-0019 Vikram Singh` — Electrician II, Shift A, Standby Unit.
- **Primary Authority**: `Dr. Ramesh Sharma` — HOD Electrical & Academic Block B Warden.
- **Primary Complainant**: `Aarav Patel (2024-ENG-UG-0142)` — Computer Science UG Student.
- **Facilities Lead**: `Vikramaditya Rao` — Chief Facilities Officer.
- **Super Admin**: `Dr. Aris Thorne` — Platform Operations Director.

---

## 7. Modular Frontend Architecture & Standalone Page Structure
The application has been decomposed into individual, standalone HTML files so `index.html` is no longer a monolithic bundle:

- **Root & Frontend Landing**: `index.html` and `code.html` now contain **only** the high-fidelity Landing Page (~800 lines vs previous 5,000+ lines).
- **Standalone Page Directories** (`pages/` and `frontend/pages/`):
  - `pages/public/` (11 pages): `landing.html`, `about.html`, `platform.html`, `how-it-works.html`, `departments.html`, `department-details.html`, `analytics.html`, `login.html`, `signup.html`, `otp-verify.html`, `account-recovery.html`.
  - `pages/user/` (7 pages): `overview.html`, `report-issue.html`, `my-complaints.html`, `complaint-details.html`, `history.html`, `notifications.html`, `profile.html`.
  - `pages/authority/` (10 pages): `overview.html`, `verification-queue.html`, `complaint-review.html`, `approved-requests.html`, `rejected-requests.html`, `active-maintenance.html`, `worker-monitoring.html`, `analytics.html`, `notifications.html`, `settings.html`.
  - `pages/worker/` (10 pages): `overview.html`, `incoming-dispatch.html` (30m ticking timer), `assignment-details.html`, `active-job.html`, `work-progress.html`, `job-complete.html`, `completed-jobs.html`, `history.html`, `notifications.html`, `profile.html`.
  - `pages/admin/` (11 pages): `overview.html`, `complaints-master.html`, `workers-directory.html`, `create-worker.html`, `worker-details.html`, `departments.html`, `assignment-telemetry.html`, `assignment-details.html`, `reports.html`, `notifications.html`, `settings.html`.
  - `pages/super/` (11 pages): `overview.html`, `user-directory.html`, `user-details.html`, `role-management.html`, `permission-matrix.html`, `department-hierarchy.html`, `assignment-engine-config.html`, `platform-settings.html`, `audit-logs.html`, `system-activity.html`, `global-analytics.html`.
- **Shared Assets**:
  - `css/style.css` (Design system styles, solid opaque `#f8fafc` canvas background).
  - `js/auth.js` (4-field login logic, role selector, Google SSO, and redirects).
  - `js/dispatch.js` (30-minute SLA countdown timer with dual selector update & tactile status badges).
  - `js/app.js` (Universal `navigateTo` dispatcher, full 5-role action suite, toast system, modals, interactive table filters, and mobile sidebar toggle).
- **Lower Layout & Footer**:
  - **Ghost Wireframe Resolution**: Completely eliminated Google Stitch template ghost shapes (underlying wireframe pills, horizontal bars, and empty circle placeholder) by fully integrating them into intentional, high-fidelity UI components.
  - **CTA Section**: Enclosed `Get Started` and `Explore Live Demo` in a pill container (`p-1.5 rounded-full bg-slate-950/80 border border-slate-800`), masked the bottom edge with a floating `Enterprise SLA Guaranteed • Sub-30m Dispatch` pill badge (`-mt-3.5 relative z-20`), and added an animated `Live Operations Status Ribbon` with pulsing gradient telemetry beam.
  - **Footer Symmetrical Grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8`)**:
    - **Col 1**: Prominent circular Institutional Operations Seal (`w-36 h-36 rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-slate-700`) + **Campus Security** card (SOC2 Type II, FERPA, SHA-256, 99.98% System Uptime SLA).
    - **Col 2**: CampusFlow Core Platform card with description and framed `[Get Started Free]` & `[Sign In]` pill actions.
    - **Col 3**: Platform Pages navigation list.
    - **Col 4**: Role Portals navigation list.
    - **Bottom Bar**: Legal & copyright bar with Privacy Policy, Terms of Service, Security Architecture.
  - **Full-Bleed Solid Backgrounds**: Explicit opaque `#f8fafc` on `html`/`body`, `#0f172a` on CTA card, and `#020617 !important` on footer with `relative z-30` preventing any canvas bleed-through.
- **Generator**:
  - `node build-tools/generate_standalone_pages.js` regenerates all standalone pages from `frontend/src/`.
- **Codebase Cleanliness & Redundancy Audit**:
  - Eliminated 22 obsolete scratch files, intermediate step backups (`original_code*`), stale Python generators in `build-tools/`, and redundant duplicate directories (`design-system/`, `docs/BRAIN.md`).
  - Freed ~653 KB of dead code and duplicate assets.
  - Consolidated single canonical generator in `build-tools/generate_standalone_pages.js` and linked `package.json` `"build"` scripts directly to it.

---

## 8. Supabase & PostgreSQL Cloud Database Architecture
- **Schema Location**: [`database/supabase_schema.sql`](database/supabase_schema.sql) and [`database/schema.prisma`](database/schema.prisma).
- **Hosting Target**: Supabase Managed PostgreSQL.
- **5 Core Tables**: `departments`, `users`, `complaints`, `assignment_attempts`, `audit_logs`.
- **4 Custom Enums**: `user_role`, `ticket_priority`, `complaint_status`, `assignment_status`.
- **Row Level Security (RLS)**: Enabled across all entities with scoped read/write policies.
- **Client SDK Integration**: [`lib/supabaseClient.js`](lib/supabaseClient.js) configured for both browser and Node.js.

---

## 9. Universal Client Navigation & Dashboard Interaction Architecture
- **Root Cause of Dead Buttons**: Standalone pages in `pages/*/*.html` relied on inline `onclick="navigateTo(...)"` and action handlers (`confirmRejectSubmit()`, `handleUserComplaintSubmit()`, `approveComplaint()`, etc.) that only existed in prototype single-page scripts and were absent from `js/app.js`, throwing `ReferenceError: navigateTo is not defined` in browser runtimes.
- **Universal Route Map**: Configured comprehensive `ROUTE_MAP` dictionary in `js/app.js` mapping all 57 view tokens to their standalone files across all 5 roles (`user`, `authority`, `worker`, `admin`, `super`) and public pages.
- **Context-Aware Path Resolution**: Evaluates `window.location.pathname` to construct relative target paths seamlessly whether accessed from `/pages/<role>/`, `/frontend/pages/<role>/`, local server root, or single-page view DOM containers.
- **Complete Action Suite Implemented**:
  - **User**: `handleUserComplaintSubmit` (form submit with dynamic ticket ID generation and success modal), `handleMockFileSelect`, `removeMockFile`.
  - **Authority**: `approveComplaint` (verification sign-off modal and dispatch notification), `openRejectModal` / `confirmRejectSubmit` (administrative justification log), `openRequestInfoModal` / `confirmRequestInfoSubmit` (student clarification query).
  - **Worker**: `acceptJobWorker` (shift queue lock-in and navigation to active job), `openWorkerDeclineModal` / `confirmWorkerDeclineSubmit` (cascade to secondary technician WRK-0019), `handleWorkerProgressSubmit` (milestone broadcast), `handleWorkerPhotoSelect`, `handleWorkerCompleteSubmit` (cryptographic seal), `toggleWorkerAvailability` (responsive Online/Offline switch with tactile status chips).
  - **Admin**: `openInterventionModal` / `confirmInterventionSubmit` (manual workforce override), `handleCreateWorkerSubmit` (technician account provisioning and directory redirect).
  - **Super Admin**: `updateWeights` (reactive 4-parameter scoring sliders), `updateTimeoutVal` (acceptance SLA slider), `saveAssignmentWeights` (telemetry hot-reload toast).
  - **System States QA Inspector**: `openSystemStatesModal`, `renderSystemState` (dynamic interactive previews for empty, loading, timeout, unauthorized, offline, and completed states).
  - **Real-Time Telemetry & Search**: `startSLACountdown` (synchronized 30m ticking countdown timer), `initInteractiveFilters` (dynamic live table search and department/status filtering).

---

## 10. Vercel Production Deployment Architecture (`vercel.json`)
- **Dual Deployment Architecture**: Configured to deploy out-of-the-box on standard Vercel accounts (Hobby/Pro/Enterprise) using Vercel Serverless Functions + Edge CDN static hosting, while preserving full local Node development compatibility.
- **Components**:
  - **Edge CDN Web Portal**: All 57 standalone pages (`pages/*/*.html`), root landing page (`index.html`), design system styles (`css/style.css`), and shared client navigation controller (`js/app.js`) are served globally from Vercel's Edge Network at sub-millisecond latencies.
  - **Serverless API Gateway (`api/index.ts`)**: Automatically mounts the Express application from `backend/server.ts` as a serverless function responding to `/api/*` requests (`/api/auth`, `/api/complaints`, `/api/dispatch`, `/api/health`).
  - **API Root Discovery**: Visiting `/api` returns an interactive JSON endpoint directory with cluster health telemetry.
- **Routing & Rewrite Rules (`vercel.json`)**:
  - `rewrites`: Maps `/api/(.*)` to `/api` (invoking `api/index.ts`).
  - `cleanUrls`: Enabled (`true`) for clean URL routing across dashboards without requiring `.html` extensions.
  - `headers`: Full CORS headers configured for `/api/(.*)` enabling authenticated cross-origin API consumers.
- **Build & Dependency Configuration**:
  - Root `package.json` contains all dependencies (`express`, `cors`, `socket.io`, `dotenv`, etc.) and `build` script (`node build-tools/generate_standalone_pages.js`) for automatic compilation on Vercel git push.
  - Root `tsconfig.json` and `backend/tsconfig.json` configure TypeScript compilation targeting `ES2022`.
  - `.vercelignore` excludes non-runtime directories (`.git`, `docs`, `tests`) to minimize deployment payload.
- **Local Fallback (`server.js`)**:
  - Running `node server.js` locally proxies `/api/*` requests to `BACKEND_URL` (or `http://localhost:4000`) and serves static files on port 8080.





