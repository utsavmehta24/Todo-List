# TaskFlow — The Energy-Aware Flow Engine & Smart To-Do System

> **Built by Utsav** • [GitHub](https://github.com/utsavmehta24) • [LinkedIn](https://www.linkedin.com/in/utsav-mehta-462653258/) • [Instagram](https://instagram.com/lucid24by7.io)  
> *Transforming the humble to-do list into an intelligent, energy-aware executive assistant for high-stress creators, engineers, students, and neurodiverse (ADHD) professionals.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-Offline--First-orange)](https://github.com/pmndrs/zustand)
[![Android](https://img.shields.io/badge/Android-APK%20Ready-green?logo=android)](downloads/app-debug.apk)
[![Vitest](https://img.shields.io/badge/Vitest-100%25%20Passing-success)](https://vitest.dev/)

---

## 📱 Download Android App (APK)

Get the native Android companion app directly on your phone:
- **Download Link**: [⬇️ Download `app-debug.apk`](downloads/app-debug.apk) (Also available at [`public/app-debug.apk`](public/app-debug.apk))
- **File Size**: ~11.1 MB
- **Target OS**: Android 8.0+ (API level 26 to 34)
- **Built With**: Jetpack Compose, Material3, Hilt Dependency Injection, and Kotlin Coroutines.

---

## 🎯 Why TaskFlow? (Market Research & Niche)

Most to-do apps are digital graveyards of guilt. Users write lists of 40 items, experience intense **analysis paralysis**, close the tab, and feel worse than before.

Based on in-depth market research of user pain points across Reddit (`r/productivity`, `r/todoist`, `r/ADHD_Programmers`), Product Hunt, and G2 reviews (detailed in [`docs/RESEARCH.md`](docs/RESEARCH.md)), we discovered the **6 fatal flaws of modern task managers**:
1. **Analysis Paralysis**: Flat priority lists don't tell you *what to do next*.
2. **Disconnected Timers**: Separate Pomodoro apps lose context and require manual tracking.
3. **High Cognitive Entry Friction**: Multi-field dropdown forms take too long to create a task.
4. **Fragile Cloud Dependency**: One dropped Wi-Fi packet or remote DB hang breaks the app.
5. **Overwhelming Ambiguity**: Large monolithic tasks trigger dread without subtask breakdowns.
6. **No Energy Awareness**: High-focus tasks are scheduled when the user is completely depleted.

### The Solution: TaskFlow
**TaskFlow** is positioned as an **Energy-Aware Flow Engine**. It bridges the gap between your fluctuating energy levels and your task backlog, acting as an executive co-pilot.

---

## ✨ Features & Capabilities

### ⚡ 1. Natural-Language Quick Entry (NLP Parser)
Type your thoughts at the speed of thought. The built-in tokenizer parses tokens in real time:
- `#tag` or `#project` → Assigns category or project (e.g., `#dev`, `#study`, `#personal`).
- `!priority` → Sets urgency: `!urgent`, `!high`, `!medium`, `!low`.
- `@energy` → Flags required cognitive stamina: `@quick_win`, `@low`, `@medium`, `@high`.
- `~duration` → Sets estimated time (e.g., `~15m`, `~45m`, `~2h`, `~1.5h`).
- Due Dates → Automatically parses `today`, `tomorrow`, `in 3 days`, `monday`, or `at 5pm`.
- *Example input:* `Ship production release tomorrow 5pm #dev !urgent @high ~45m`

### 🧠 2. "What Should I Do Right Now?" Recommender Engine
Feeling overwhelmed? Hit **What Now?** or press `Ctrl+K`. TaskFlow calculates a composite score based on:
- Overdue deadlines & same-day urgency
- Task priority tier
- Match with your current energy level (Quick Win, Low, Medium, High)
- Match with your available time window (15m, 30m, 60m+)
- One-click **"Start Focus on This"** button immediately opens Deep Work mode.

### ⏱️ 3. Deep-Work Pomodoro Focus Mode
- Built-in 25-minute focus / 5-minute break timer tied directly to the active task.
- Clean circular SVG animated progress indicator with real-time percentage display.
- Browser-native Web Audio synthesizer chime triggers when the session completes (no audio assets required).
- Quick +5m extension, reset, and direct one-click task completion with confetti.

### 📊 4. Multi-View Matrix
Switch seamlessly between distinct mental models without losing context:
- **Tasks View**: Rich list with subtask checklists, energy badges, and inline actions.
- **Kanban Board**: Drag/click interactive columns (`To Do`, `In Progress`, `Done`) with Framer Motion spring physics.
- **Calendar View**: Visual month calendar showing task density on due dates with priority indicators.
- **Focus Mode**: Distraction-free single-task timer view.
- **Insights Tab**: Analytics dashboard.

### 🤖 5. Pluggable AI Assistant (Gemini API + Deterministic Engine)
- **1-Click Task Deconstruction**: Breaks large, vague tasks into 3–5 actionable, concrete subtasks.
- **Daily Focus Plan**: Analyzes your open tasks and drafts a prioritized morning briefing.
- **Zero-Failure Architecture**: If `GEMINI_API_KEY` is not provided or the network is offline, a built-in deterministic heuristic rule engine takes over seamlessly.

### 💾 6. 100% Offline-First Architecture
- Powered by Zustand with `persist` middleware storing state in `localStorage`.
- Works flawlessly with zero internet connection.
- Performs non-blocking, optimistic background sync with MongoDB Atlas when available.
- Network outages, slow connections, or DNS failures will **never** crash or freeze the UI.

### 📈 7. Productivity Insights & Data Ownership
- Daily completion streaks and completion rate meters.
- Task energy distribution visualizer (Quick Wins vs. Deep Work).
- **Full Data Portability**: 1-click **Export to JSON** and **Export to CSV**.
- **Data Import**: Restore or migrate backups instantly via JSON upload.

### ⌨️ 8. Command Palette (`Ctrl+K`) & Keyboard Shortcuts
- Press `Ctrl+K` or `Cmd+K` anywhere to open the command palette.
- Instantly search tasks, jump to Kanban/Calendar/Focus views, or trigger the Recommender.
- Press `Escape` to close modals.

---

## 🏗️ Architecture & How It Works

For an in-depth student-friendly breakdown of why every technology and pattern was chosen, see [`docs/DECISIONS.md`](docs/DECISIONS.md).

```
                      +---------------------------------------+
                      |         User Interface (Next.js)      |
                      |  QuickAddBar | Kanban | Focus | Stats |
                      +---------------------------------------+
                                         |
                                         v
                      +---------------------------------------+
                      |     Zustand Store (useTaskStore)      |
                      |  - Optimistic In-Memory State Updates  |
                      |  - Real-Time NLP Tokenizer            |
                      |  - Recommendation Scoring Engine      |
                      +---------------------------------------+
                                    /         \
                       (Synchronous)           (Asynchronous Background)
                                  /             \
                                 v               v
                +-------------------+      +---------------------------+
                |   localStorage    |      |    Next.js API Routes     |
                |  (Offline-First)  |      |   /api/tasks & /api/ai    |
                +-------------------+      +---------------------------+
                                                         |
                                                         v
                                           +---------------------------+
                                           |       MongoDB Atlas       |
                                           |  (Cloud Persistent Cache) |
                                           +---------------------------+
```

### 1. Dual-Layer Persistence Flow
When a task is created or edited:
1. It is instantly committed to Zustand state and persisted to `localStorage`.
2. The UI renders changes in `0ms` (no loading spinners or input lag).
3. A background HTTP request is dispatched to `/api/tasks`. If the network fails or MongoDB is unreachable, the error is quietly caught and logged; the user never loses their data.

### 2. Natural Language Tokenizer (`nlpParser.js`)
Regex patterns extract metadata flags from freeform text without external NLP library bloat:
```javascript
// Input: "Finish OS assignment tomorrow 5pm #college !high @medium ~45m"
// Output: {
//   cleanTitle: "Finish OS assignment",
//   priority: "high",
//   energy: "medium",
//   estimatedMinutes: 45,
//   tags: ["college"],
//   dueDate: "2026-11-23T17:00:00.000Z"
// }
```

### 3. Recommender Engine Scoring Function (`recommender.js`)
```
Score = UrgencyScore (0-50) + PriorityScore (0-30) + EnergyMatchScore (0-15) + TimeMatchScore (0-10)
```
- Overdue tasks receive maximum urgency points (+50).
- Unfinished subtasks are weighted into completion momentum.
- High-energy tasks are deprioritized when the user selects "Low Energy" or "Quick Win".

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Server-rendered shell, fast client routing, dynamic API routes |
| **Language** | JavaScript (ES6+) / TypeScript / Kotlin | Full-stack web and native mobile clients |
| **State Management** | Zustand (`persist` middleware) | Reactive, un-opinionated, zero-boilerplate local-first store |
| **Styling** | Tailwind CSS + Lucide Icons | Responsive modern design system with dark mode accents |
| **Micro-Interactions** | Framer Motion + Canvas-Confetti | Smooth layout springs, card entry animations, dopamine cues |
| **Audio Synthesizer**| HTML5 Web Audio API | Zero-asset, zero-latency chimes for Pomodoro timers |
| **Mobile App** | Android SDK 34, Jetpack Compose | Native Android application with Material3 styling |
| **Database** | MongoDB Atlas with Mongoose | Cloud synchronization and cross-device persistence |
| **AI Engine** | Google Gemini API + Local Fallback | Context-aware subtask deconstruction and daily planning |
| **Testing** | Vitest + Gradle Android Test | Automated test runners verifying core logic and compilation |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional for Android build)*: JDK 21 and Android SDK Platform 34

### 1. Clone & Install
```bash
git clone https://github.com/utsavmehta24/Todo-List.git
cd Todo-List
npm install
```

### 2. Configure Environment
Copy the example environment template:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your values (the app works completely in offline mode even without these!):
```env
# Optional: MongoDB Connection
dburl=mongodb+srv://<username>:<password>@cluster0.mongodb.net/test

# Optional: Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# NextAuth / App URL
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Unit Tests
```bash
npm test
```
All unit test suites for NLP parsing, the Recommender scoring engine, and store actions will run via Vitest.

### 5. Build for Production
```bash
npm run build
npm run start
```

### 6. Build & Install the Android Native App (APK)
```bash
cd android
./gradlew :app:assembleDebug
```
The compiled APK will be generated at:
`android/app/build/outputs/apk/debug/app-debug.apk` (also mirrored at `downloads/app-debug.apk` and `public/app-debug.apk`).

#### 📱 Native Android Features in Jetpack Compose:
- **⚡ 1-Tap Quick Demo Mode**: Test on physical phones immediately with pre-loaded demo tasks—no account signup or remote backend required.
- **⚡ NLP Quick-Add Bar**: Type `#tag`, `!priority`, `@energy`, `~time` into the bottom action bar with live visual chip parsing.
- **⏱️ Native Pomodoro Focus Mode**: Smooth circular canvas progress ring with 25m/5m cycles, pause/play/reset controls, and direct task completion.
- **📋 3-Column Kanban Board**: Native Material 3 columns (To Do, In Progress, Completed) with 1-tap state progression.
- **🎯 "What Should I Do Right Now?" Recommender**: Native Kotlin scoring algorithm isolating the highest-leverage task for your available stamina and time.
- **☑️ Subtasks Checklist**: Interactive checkboxes directly embedded inside task cards.
- **💾 Room Database v2**: Full local offline persistence with fallback destructive migration.
- **✨ Built by Utsav**: Attribution embedded in the TopBar, About dialog with GitHub/LinkedIn links, and Dashboard.

---

## 📂 Project Structure

```
todo-app/
├── android/                         # Native Android Jetpack Compose app
│   ├── app/src/main/java/          # Kotlin UI & ViewModels
│   ├── build.gradle.kts            # Configured with Java 21 & Android SDK 34
│   └── gradle/libs.versions.toml   # Dependency catalog
├── docs/                            # Engineering & Product Documentation
│   ├── AUDIT.md                    # Initial codebase audit & tech debt analysis
│   ├── RESEARCH.md                 # Market research, pain points & niche definition
│   └── DECISIONS.md                # Plain-language architecture decision log
├── downloads/
│   └── app-debug.apk               # Ready-to-install Android APK (11.1 MB)
├── public/
│   ├── app-debug.apk               # Web-servable Android APK
│   ├── manifest.json               # PWA Web App Manifest
│   └── sw.js                       # Service Worker for offline PWA caching
├── src/
│   ├── app/
│   │   ├── api/                    # Next.js API Routes (AI deconstruction, CRUD)
│   │   ├── Dashboard/              # Executive command dashboard
│   │   ├── showtask/               # Multi-view workspace (List, Kanban, Calendar)
│   │   ├── addtask/                # Enhanced task creation screen
│   │   ├── components/             # Global Navbar, Footer, and Modals
│   │   ├── layout.js               # Metadata, viewport, and theme configuration
│   │   └── page.js                 # Landing page
│   ├── components/                 # TaskFlow Interactive Components
│   │   ├── TaskCard.jsx            # Animated task card with subtasks & confetti
│   │   ├── QuickAddBar.jsx         # NLP natural language input bar
│   │   ├── KanbanView.jsx          # Drag-and-drop Kanban workflow
│   │   ├── CalendarView.jsx        # Month view calendar
│   │   ├── FocusMode.jsx           # Deep-work Pomodoro timer
│   │   ├── ProductivityInsights.jsx# Streaks, distribution charts & data backup
│   │   ├── CommandPalette.jsx      # Global Ctrl+K shortcut palette
│   │   ├── RecommendationModal.jsx # "What should I do right now?" modal
│   │   └── AboutModal.jsx          # "Built by Utsav" creator bio modal
│   ├── store/
│   │   └── useTaskStore.js         # Zustand offline-first store
│   └── utils/
│       ├── nlpParser.js            # NLP tokenizer engine
│       └── recommender.js          # Energy & urgency scoring engine
├── tests/                          # Vitest unit test suite
├── package.json                    # Project dependencies & metadata (Author: Utsav)
└── README.md                       # Product documentation
```

---

## 👨‍💻 Built by Utsav

This project is created and maintained by **Utsav**:
- **GitHub**: [@utsavmehta24](https://github.com/utsavmehta24)
- **LinkedIn**: [Utsav Mehta](https://www.linkedin.com/in/utsav-mehta-462653258/)
- **Instagram**: [@lucid24by7.io](https://instagram.com/lucid24by7.io)
- **Repository**: [https://github.com/utsavmehta24/Todo-List](https://github.com/utsavmehta24/Todo-List)

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
