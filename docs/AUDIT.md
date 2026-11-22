# Repository Audit: Casual Todo's

**Project:** Casual Todo's / Todo-List Application  
**Author/Owner:** Utsav Mehta ([@utsavmehta24](https://github.com/utsavmehta24))  
**Auditor:** Senior Full-Stack Engineer & Product Designer  
**Date:** November 2026  
**Status:** Audit Completed  

---

## 1. Executive Summary

This repository contains a full-stack to-do application initially developed as a basic web app with Next.js 14 and a standalone native Android port using Jetpack Compose and Room. 

While the fundamental concept (accounts, task CRUD, reviews) is present, the web application suffers from architectural vulnerabilities, hardcoded mocks, database connection fragility, missing modern task-management features, and lack of offline-first capabilities.

---

## 2. Codebase Architecture & Structure

```
.
├── .env                          # Environment variables (contains DB URL, JWT secrets)
├── android/                      # Native Android Kotlin / Jetpack Compose application
│   ├── app/                      # Android application module
│   ├── build.gradle.kts          # Root Gradle build configuration
│   └── gradlew.bat               # Gradle wrapper
├── docs/                         # Architecture, audit, and design documentation
├── public/                       # Static public assets (e.g. quotes.json)
├── src/
│   ├── app/
│   │   ├── api/                  # Next.js App Router API Route Handlers
│   │   │   ├── current/          # Logged-in user endpoint
│   │   │   ├── login/            # Authentication endpoint
│   │   │   ├── logout/           # Session clearance endpoint
│   │   │   ├── reviews/          # User review submission & fetch
│   │   │   ├── users/            # User account queries
│   │   │   └── works/            # Task CRUD endpoints
│   │   ├── addtask/              # Task creation view
│   │   ├── Dashboard/            # User dashboard with quote widget
│   │   ├── login/ / signup/      # Auth views
│   │   ├── reviews/              # Review display view
│   │   ├── showtask/             # Task listing and status toggle
│   │   ├── write-review/         # Review creation view
│   │   ├── globals.css           # Global Tailwind CSS definitions
│   │   ├── layout.js             # Root application shell & Navbar/Footer
│   │   └── page.js               # Landing page
│   ├── context/                  # React Context (UserContext, UserProvider)
│   ├── helper/                   # Database (Mongoose) and HTTP client (Axios)
│   ├── middleware.js             # Route protection middleware via JWT cookies
│   └── model/                    # Mongoose schemas (User, Task, Review)
├── package.json
└── tailwind.config.js
```

---

## 3. Technology Stack Analysis

| Layer | Current Technology | Health / Status | Notes |
|---|---|---|---|
| **Web Framework** | Next.js 14.2.5 (App Router) | Active | Modern, JavaScript-based (needs TypeScript transition for safety). |
| **UI Library** | React 18.3.1 | Stable | Client and Server Components. |
| **Styling** | Tailwind CSS 3.4.1 | Basic | Generic dark palette (`bg-gray-800`), lacks consistent tokens and micro-interactions. |
| **Database** | MongoDB Atlas via Mongoose 8.5.1 | Critical Fragility | Remote cluster `rockingut.mzs7lfz.mongodb.net` fails DNS lookup; crashes app if offline. |
| **Authentication** | Custom JWT (`jsonwebtoken`) + Cookie | Working but basic | Cookie `authToken`, bcrypt hash. Lacks password recovery, session refresh. |
| **HTTP Client** | Axios 1.7.2 | Buggy configuration | `baseURL` set to `process.env.BASE_URL` (unavailable on client) with typo. |
| **Mobile Native** | Kotlin 2.0, Jetpack Compose, Room 2.6 | Functional | Local-first Android app in `android/` subproject. |

---

## 4. Identified Bugs, Fragilities & Technical Debt

### A. Critical Blockers & Build Errors
1. **Remote Database Single Point of Failure**: The MongoDB cluster URI in `.env` is unresolvable (`ENOTFOUND _mongodb._tcp.rockingut.mzs7lfz.mongodb.net`). Any failure in MongoDB Atlas halts both API execution and build-time prerendering.
2. **Build-Time Hang on `/login`**: In `src/app/login/page.jsx`, `connectDb()` and `user.find()` were called during static page generation. When DB is offline, `next build` hangs for 10s and crashes with `MongooseError: Operation user2.find() buffering timed out`.
3. **Double Protocol Typo**: In `.env`, `BASE_URL = http://http://localhost:3000`.
4. **Environment Leakage in Client**: `httpAxios` relies on `process.env.BASE_URL`, which is `undefined` in browser JavaScript without `NEXT_PUBLIC_`.

### B. Logic & UX Bugs
5. **Missing Return in `Services.js`**: `addtask` runs `.then((res) => { res.data })` without `return`, returning `undefined` to caller components.
6. **Hardcoded Mock User ID**: `AddTask.jsx` hardcodes `userId: "6696b6eb7453fe0af988a135"`, bypassing the logged-in user in `UserContext`.
7. **Form "Clear" Button Submits Form**: In `AddTask.jsx`, `<button>` lacks `type="button"`, causing the Clear button to unintentionally submit the task form.
8. **Viewport Overflow Clipping**: `showTask.jsx` enforces `h-screen` instead of `min-h-screen`, clipping task cards when exceeding 3 tasks.
9. **Stale Schema Timestamp**: `task.js` defines `default: Date.now()`, executing once at module evaluation rather than dynamically (`default: Date.now`).
10. **Duplicate Bcrypt Packages**: Both native `bcrypt` (slow C++ compilation) and `bcryptjs` are in dependencies.

### C. Missing Modern Product Capabilities
11. **No Offline Support**: Complete breakdown if offline. Zero client caching, no IndexedDB, no service worker or PWA manifest.
12. **Flat Task Model**: Only `title`, `description`, and `status`. Lacks priorities, tags, projects, due dates, subtasks, recurring cadence, or time estimates.
13. **No Keyboard / Command Shortcuts**: No Cmd/Ctrl+K palette, no quick shortcuts for power users.
14. **No Multiple Views**: Only a simple stacked list. No Kanban board, no Calendar view, no focus mode.
15. **No AI or Productivity Intelligence**: Big tasks cannot be automatically broken down; no smart recommendations for what to focus on next.

---

## 5. Modernization Strategy

1. **Dual Persistence (Offline-First + Cloud Sync)**: Implement client-side IndexedDB / local storage persistence (via Zustand + Dexie/IDB) so the user can immediately add, edit, filter, and plan tasks with zero latency and 100% offline uptime, with background sync to MongoDB when connected.
2. **Robust Fixes**: Fix Next.js static build prerendering, clean up Axios service layer, remove hardcoded user IDs, and fix button handlers.
3. **Modern UI/UX Overhaul**: Adopt shadcn/Radix design aesthetics, fluid Framer Motion animations, dark/light theme, responsive layout, and distinct brand identity for **Built by Utsav**.
4. **Feature Expansion**:
   - Natural language task entry (parsing dates, tags, and priorities).
   - Smart views (Today, Upcoming, Overdue, Completed, Projects, Tags).
   - Kanban Board + List + Calendar + Focus (Pomodoro) views.
   - AI Task Breakdown & Prioritization Assistant (pluggable provider).
   - Command Palette (`Ctrl + K`).
   - Productivity Insights & Weekly Review charts.
   - PWA installation & full offline functionality.
