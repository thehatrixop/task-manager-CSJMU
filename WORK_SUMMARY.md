# CampusFlow — Quick Work Summary

CampusFlow is an intelligent university facility management and automated dispatch system connecting students, faculty, wardens, technicians, and administrators.

---

## 1. What Has Been Done (Zero to Now)

1. **Decomposed Monolith**: Split the original 5,000+ line file into **64 clean standalone pages** across 6 distinct roles.
2. **Anti-AI Slop Design**: Replaced wireframe artifacts and neon glows with crisp slate/emerald styling and tactile 8px buttons.
3. **Connected Real-Time Engine**: Removed hardcoded mock tickets. Dashboards now talk to each other in real-time across open tabs.
4. **Dual Verification Flow**:
   - **Students**: Complaints are held in the Warden's queue until approved.
   - **Faculty**: Complaints are **auto-verified instantly** and immediately dispatch a technician.
5. **User Request Management**:
   - Before verification: Edit details or delete/cancel the complaint.
   - After approval: Formally cancel with a stated rejection reason.
6. **YouTube-Style Search**: Replaced browser popups with an in-website search bar and live floating suggestions dropdown (`Ctrl+K`).
7. **Pinned Sidebar & Profile Dropdown**: Pinned the left sidebar to the screen and combined Profile, Switch Role, and Sign Out into a clean top-right avatar menu.
8. **Vercel & Supabase Ready**: Configured `vercel.json` with `public/` directory, serverless Express API, and ready-to-run PostgreSQL schema.

---

## 2. Six Roles & Login Credentials

> **Universal Password for all accounts**: `Campus@2026`

| Role | Name | Email / Phone | Key Feature | Portal Link |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | Aarav Patel | `aarav.patel@eng.university.edu` | Subject to Warden approval | [`/pages/user/overview.html`](http://localhost:8080/pages/user/overview.html) |
| **Faculty** | Prof. Ananya Sen | `prof.ananya@faculty.university.edu` | **Auto-verified** (no warden needed) | [`/pages/faculty/overview.html`](http://localhost:8080/pages/faculty/overview.html) |
| **Authority** | Dr. Ramesh Sharma | `ramesh.sharma@faculty.university.edu` | 1-tap Approve, Reject, or Clarify | [`/pages/authority/overview.html`](http://localhost:8080/pages/authority/overview.html) |
| **Worker** | Rajesh Kumar | `rajesh.kumar@technician.university.edu` | 30m ticking countdown timer | [`/pages/worker/overview.html`](http://localhost:8080/pages/worker/overview.html) |
| **Admin** | Vikramaditya Rao | `vikram.rao@facilities.university.edu` | Campus-wide live dispatch telemetry | [`/pages/admin/overview.html`](http://localhost:8080/pages/admin/overview.html) |
| **Super Admin** | Dr. Aris Thorne | `aris.thorne@governance.university.edu` | Platform settings & assignment weights | [`/pages/super/overview.html`](http://localhost:8080/pages/super/overview.html) |

---

## 3. How to Run Locally

```bash
node server.js
```
- Open browser at: **[http://localhost:8080/](http://localhost:8080/)**

---

## 4. Current Data & Storage State

- **Current Mode**: Browser `localStorage` + Serverless in-memory API (works instantly offline and for local demos).
- **Cloud Database (Ready to Connect)**:
  - PostgreSQL schema ready in [`database/supabase_schema.sql`](database/supabase_schema.sql).
  - Just add your Supabase URL & Anon Key to [`lib/supabaseClient.js`](lib/supabaseClient.js) to switch to cloud database mode.

---

## 5. Next Steps (Optional)

1. **Deploy to Vercel**: Push to GitHub is done; Vercel can deploy the `public/` folder directly.
2. **Connect Supabase**: Run the SQL schema in Supabase for cross-device cloud persistence.
3. **SMS Alerts**: Add Twilio or Firebase for mobile phone alerts when tickets dispatch.
