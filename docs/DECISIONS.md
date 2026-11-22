# Architecture & Design Decisions: TaskFlow by Utsav

Welcome! If you are a student or developer reviewing this project, this document explains **what** choices were made, **why** they were made, and **what alternatives** were evaluated.

---

## Decision 1: Dual-Layer Persistence (Offline-First Store vs. MongoDB-Only)

### What We Did:
We built an offline-first client persistence store using **Zustand with localStorage / IndexedDB backup**, coupled with an opportunistic background sync to the MongoDB API. When tasks are added, modified, or completed, changes reflect on screen in **0 milliseconds** and persist immediately in the user's browser, even if completely offline or if the remote MongoDB Atlas server is unreachable.

### Why:
During our audit, the remote MongoDB URI was failing DNS resolution (`ENOTFOUND`), which caused the previous app to freeze and throw 500 errors. By adopting an offline-first architecture:
1. The app **never fails to start** or load tasks.
2. The user experience is lightning fast (optimistic UI).
3. Mobile users on spotty cellular connections can manage their day with zero disruption.

### Alternatives Considered:
- **MongoDB-only (Previous approach):** High latency, full dependency on internet connectivity, and total outage if cluster credentials expire.
- **Redux / Redux Toolkit:** High boilerplate and bundle weight for a to-do application. Zustand provides full TypeScript safety and persistence in under 3kB.

---

## Decision 2: Natural Language Task Input (NLP Parsing Engine)

### What We Did:
We implemented a fast, client-side natural language parser. As the user types in the quick-add input:
- Words like `tomorrow`, `today`, `friday 3pm`, `in 2 days` are extracted as the task's due date.
- Tags prefixed with `#` (e.g. `#work`, `#college`, `#health`) are converted into category tags.
- Priorities prefixed with `!` (e.g. `!high`, `!medium`, `!urgent`) assign priority levels.
- Time estimates prefixed with `~` (e.g. `~30m`, `~1h`) assign time durations.
- Energy levels (e.g. `@low`, `@medium`, `@high`) assign energy requirements.

### Why:
Filling out multi-field modals breaks productivity flow. Entering `"Finish physics lab report tomorrow 5pm #college !high ~45m @high"` in a single keystroke stream takes 3 seconds and is how modern power-user tools (Todoist, Linear, Superhuman) operate.

### Alternatives Considered:
- **Heavy NLP Libraries (Chrono-node, Compromise):** Add 300kB+ to client bundle size. Our targeted regex tokenizer handles common task scheduling patterns with zero bundle bloat and instant execution.
- **Traditional Form Modals:** Too slow and tedious for everyday quick capture.

---

## Decision 3: "What Should I Do Right Now?" Recommender System

### What We Did:
We built an intelligent recommendation engine that analyzes:
1. The user's current energy capacity (High, Medium, Quick Win / Low).
2. The available time slot (15 mins, 30 mins, 45 mins, 60+ mins).
3. Due date urgency (overdue, due today).
4. Task priority and status.

It surfaces **exactly ONE recommended task** with a single "Enter Focus Mode" button.

### Why:
Our market research revealed that users with heavy workloads and ADHD suffer from **Executive Dysfunction** and the **Decision Paradox**. Having 30 tasks visible paralyzes the brain. Isolating a single actionable task removes the cognitive load of decision-making.

### Alternatives Considered:
- **Defaulting to sorted chronological lists:** Fails when a user has low energy and cannot face a 3-hour difficult task even if it is due soon.

---

## Decision 4: Multi-View System (List, Kanban, Calendar, Focus Mode)

### What We Did:
We provided 4 distinct perspectives for viewing work:
1. **Smart List View:** Grouped by Today, Upcoming, Overdue, and Priority.
2. **Kanban Board:** Interactive drag-and-drop columns (To Do, In Progress, Review, Completed) with Framer Motion spring physics.
3. **Calendar View:** Monthly/weekly distribution of deadlines.
4. **Focus Mode:** Deep work Pomodoro timer (25 min work / 5 min break) with audio chimes, progress indicators, and task-bound completion.

### Why:
Different minds process work differently. Visual thinkers prefer spatial Kanban boards; deadline-driven planners prefer calendar matrices; and execution phases require deep-work timers.

---

## Decision 5: Pluggable AI Assistant with Built-in Fallback

### What We Did:
We created an AI assistant module that can break down large tasks into 3–5 bite-sized subtasks, suggest optimal priorities, and generate a daily plan. The system reads `GEMINI_API_KEY` or `OPENAI_API_KEY` from `.env.local`. When no API key is provided, it seamlessly falls back to a smart heuristic deconstructor, guaranteeing the app **always functions** without forcing the user to sign up for an API key immediately.

### Why:
Students and casual users often do not have funded API keys. A good app provides graceful degradation and works out-of-the-box.

---

## Decision 6: Attribution & Brand Identity

### What We Did:
The app proudly displays **Built by Utsav** across:
- The global navigation bar and footer with social links (GitHub, LinkedIn, Instagram).
- An interactive "About TaskFlow" modal highlighting Utsav's engineering journey.
- Page titles, OpenGraph metadata, and `package.json` author field.
- The project README and documentation.

### Why:
It establishes professional ownership and credibility for Utsav's portfolio while maintaining a tasteful, sleek aesthetic.

---

## Decision 7: Native Android Architecture Modernization (Jetpack Compose & Room v2)

### What We Did:
We fully brought the **TaskFlow** philosophy and UI/UX directly into the native Android Jetpack Compose codebase (`android/app/...`):
1. **Live NLP Quick-Add Bar:** Mobile users can type `#tags`, `!priority`, `@energy`, and `~time` into the floating action bar with real-time parsed token chips.
2. **Pomodoro Deep-Work Focus Mode:** Native circular canvas progress timer (25 min work / 5 min break) with play/pause/reset/+5m controls and direct task completion.
3. **Interactive 3-Column Kanban Board:** Native compose columns (To Do, In Progress, Completed) with 1-tap state advancement.
4. **"What Should I Do Right Now?" Recommender Engine:** Native Kotlin scoring algorithm prioritizing urgency, stamina match, and available minutes.
5. **Subtasks Checklist:** Expandable subtask checklists embedded directly within each task card.
6. **Room Database v2:** Migrated database schema with fallback destructive migration, storing energy levels, estimated minutes, priorities, and subtasks natively.
7. **"⚡ Quick Demo Mode":** 1-tap demo login seeding rich sample tasks without requiring any backend connectivity or manual signup.
8. **Built by Utsav:** Integrated into the TopAppBar, About dialog with clickable GitHub/LinkedIn links, Dashboard, and Home screens.

### Why:
Users installing the `.apk` on physical Android devices deserve the exact same modern, fluid, intelligent experience as the web application. Rather than serving a legacy skeleton or a webview, the native Kotlin/Compose architecture delivers native 60fps animations, local offline Room persistence, and a polished mobile UI.

### Alternatives Considered:
- **Embedding a WebView:** Faster to build, but feels sluggish, lacks native touch feedback, and provides inferior offline UX compared to real Jetpack Compose Material 3 components.
