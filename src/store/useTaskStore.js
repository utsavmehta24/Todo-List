import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { addtask, deleteTasks, getTasksOfUsers, updateTaskOnServer } from "@/app/Services/Services";

const INITIAL_TASKS = [
    {
        _id: "demo-task-1",
        title: "Deploy TaskFlow v1.0 Production Release",
        description: "Verify PWA manifest, compile Android APK, check dark mode contrast, and push to remote.",
        status: "in_progress",
        priority: "urgent",
        energy: "high",
        estimatedMinutes: 45,
        dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        tags: ["engineering", "portfolio"],
        project: "TaskFlow",
        subtasks: [
            { id: "sub-1", title: "Run Playwright E2E and unit test suites", completed: true },
            { id: "sub-2", title: "Assemble Android release APK", completed: true },
            { id: "sub-3", title: "Verify 'Built by Utsav' meta tags and attribution", completed: true },
        ],
        recurring: "none",
        addedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        completedAt: null,
    },
    {
        _id: "demo-task-2",
        title: "Finish Machine Learning Paper Review",
        description: "Synthesize Section 3 on attention mechanisms and write 3 summary bullets.",
        status: "pending",
        priority: "high",
        energy: "medium",
        estimatedMinutes: 30,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        tags: ["college", "ai"],
        project: "Academics",
        subtasks: [
            { id: "sub-4", title: "Skim abstract and introduction", completed: true },
            { id: "sub-5", title: "Highlight methodology flaws", completed: false },
        ],
        recurring: "weekly",
        addedDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        completedAt: null,
    },
    {
        _id: "demo-task-3",
        title: "Hydrate & 5-Minute Sun Break",
        description: "Step away from screens, drink a tall glass of water, and stretch back muscles.",
        status: "pending",
        priority: "low",
        energy: "quick_win",
        estimatedMinutes: 5,
        dueDate: new Date().toISOString(),
        tags: ["health", "selfcare"],
        project: "Wellness",
        subtasks: [],
        recurring: "daily",
        addedDate: new Date().toISOString(),
        completedAt: null,
    },
];

export const useTaskStore = create(
    persist(
        (set, get) => ({
            tasks: INITIAL_TASKS,
            viewMode: "list", // 'list' | 'kanban' | 'calendar' | 'focus'
            activeFilter: "all", // 'all' | 'today' | 'upcoming' | 'overdue' | 'completed' | project name
            searchQuery: "",
            selectedTag: null,
            selectedTaskIdForFocus: "demo-task-1",
            theme: "dark", // 'dark' | 'light'
            isAboutOpen: false,
            isCommandPaletteOpen: false,
            isRecommendModalOpen: false,
            isFloatingWidgetOpen: false, // Floating Mini Desk Widget toggle
            selectedTaskForDrawer: null, // Slide-over Task Inspector drawer task ID
            scratchpadNote: "Welcome to TaskFlow! Use this sticky scratchpad to dump quick ideas, meeting notes, or temporary links. Autosaved locally.",
            syncStatus: "local_only", // 'synced' | 'syncing' | 'local_only' | 'error'

            // Focus Timer state
            timer: {
                minutes: 25,
                seconds: 0,
                isRunning: false,
                mode: "work", // 'work' | 'break'
                totalCompletedSessions: 0,
            },

            // Setters for UI Navigation
            setViewMode: (viewMode) => set({ viewMode }),
            setActiveFilter: (activeFilter) => set({ activeFilter, selectedTag: null }),
            setSelectedTag: (selectedTag) => set({ selectedTag, activeFilter: "all" }),
            setSearchQuery: (searchQuery) => set({ searchQuery }),
            setSelectedTaskIdForFocus: (id) => set({ selectedTaskIdForFocus: id }),
            setSelectedTaskForDrawer: (id) => set({ selectedTaskForDrawer: id }),
            toggleFloatingWidget: (open) => set((s) => ({ isFloatingWidgetOpen: open !== undefined ? open : !s.isFloatingWidgetOpen })),
            setScratchpadNote: (scratchpadNote) => set({ scratchpadNote }),
            toggleAbout: (open) => set((s) => ({ isAboutOpen: open !== undefined ? open : !s.isAboutOpen })),
            toggleCommandPalette: (open) => set((s) => ({ isCommandPaletteOpen: open !== undefined ? open : !s.isCommandPaletteOpen })),
            toggleRecommendModal: (open) => set((s) => ({ isRecommendModalOpen: open !== undefined ? open : !s.isRecommendModalOpen })),
            toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),

            // Task Actions
            addTask: async (taskInput) => {
                const newTask = {
                    _id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                    title: taskInput.title || "Untitled Task",
                    description: taskInput.description || "",
                    status: taskInput.status || "pending",
                    priority: taskInput.priority || "medium",
                    energy: taskInput.energy || "medium",
                    estimatedMinutes: taskInput.estimatedMinutes || 30,
                    dueDate: taskInput.dueDate || null,
                    tags: taskInput.tags || [],
                    project: taskInput.project || "General",
                    subtasks: taskInput.subtasks || [],
                    recurring: taskInput.recurring || "none",
                    addedDate: new Date().toISOString(),
                    completedAt: null,
                    userId: taskInput.userId || null,
                };

                // Optimistic Local State Update
                set((state) => ({
                    tasks: [newTask, ...state.tasks],
                }));

                // Attempt server sync in background if userId provided
                if (newTask.userId && newTask.userId !== "guest_user") {
                    try {
                        const serverRes = await addtask(newTask);
                        if (serverRes?._id) {
                            // Update with server Mongo ID
                            set((state) => ({
                                tasks: state.tasks.map((t) => (t._id === newTask._id ? { ...t, _id: serverRes._id } : t)),
                                syncStatus: "synced",
                            }));
                        }
                    } catch (err) {
                        set({ syncStatus: "local_only" });
                    }
                }
                return newTask;
            },

            updateTask: async (id, updates) => {
                set((state) => ({
                    tasks: state.tasks.map((t) => (t._id === id ? { ...t, ...updates } : t)),
                }));

                try {
                    await updateTaskOnServer(id, updates);
                } catch (err) {
                    // Ignore offline update error
                }
            },

            deleteTask: async (id) => {
                set((state) => ({
                    tasks: state.tasks.filter((t) => t._id !== id),
                    selectedTaskIdForFocus: state.selectedTaskIdForFocus === id ? null : state.selectedTaskIdForFocus,
                }));

                try {
                    await deleteTasks(id);
                } catch (err) {
                    // Offline fallback
                }
            },

            toggleTaskStatus: async (id) => {
                const task = get().tasks.find((t) => t._id === id);
                if (!task) return;

                const newStatus = task.status === "completed" ? "pending" : "completed";
                const completedAt = newStatus === "completed" ? new Date().toISOString() : null;

                set((state) => ({
                    tasks: state.tasks.map((t) =>
                        t._id === id ? { ...t, status: newStatus, completedAt } : t
                    ),
                }));

                try {
                    await updateTaskOnServer(id, { status: newStatus, completedAt });
                } catch (err) {
                    // Offline fallback
                }
            },

            // Subtask Management
            addSubtask: (taskId, title) => {
                if (!title.trim()) return;
                const newSub = { id: `sub_${Date.now()}`, title: title.trim(), completed: false };
                set((state) => ({
                    tasks: state.tasks.map((t) =>
                        t._id === taskId ? { ...t, subtasks: [...(t.subtasks || []), newSub] } : t
                    ),
                }));
            },

            toggleSubtask: (taskId, subtaskId) => {
                set((state) => ({
                    tasks: state.tasks.map((t) => {
                        if (t._id !== taskId) return t;
                        const updatedSubs = (t.subtasks || []).map((s) =>
                            s.id === subtaskId ? { ...s, completed: !s.completed } : s
                        );
                        // Auto-complete parent task if all subtasks completed
                        const allDone = updatedSubs.length > 0 && updatedSubs.every((s) => s.completed);
                        return {
                            ...t,
                            subtasks: updatedSubs,
                            status: allDone ? "completed" : t.status,
                            completedAt: allDone ? new Date().toISOString() : t.completedAt,
                        };
                    }),
                }));
            },

            deleteSubtask: (taskId, subtaskId) => {
                set((state) => ({
                    tasks: state.tasks.map((t) =>
                        t._id === taskId
                            ? { ...t, subtasks: (t.subtasks || []).filter((s) => s.id !== subtaskId) }
                            : t
                    ),
                }));
            },

            aiDeconstructTask: async (taskId) => {
                const task = get().tasks.find((t) => t._id === taskId);
                if (!task) return;

                let generatedSubtasks = [];
                try {
                    const res = await fetch("/api/ai", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "deconstruct", title: task.title, description: task.description }),
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (Array.isArray(data.subtasks) && data.subtasks.length > 0) {
                            generatedSubtasks = data.subtasks.map((s, idx) => ({
                                id: `sub_ai_${Date.now()}_${idx}`,
                                title: s.title || s,
                                completed: false,
                            }));
                        }
                    }
                } catch (e) {
                    // Fallback to local heuristic deconstruction
                }

                if (generatedSubtasks.length === 0) {
                    const lower = (task.title + " " + (task.description || "")).toLowerCase();
                    if (lower.includes("paper") || lower.includes("report") || lower.includes("write") || lower.includes("essay")) {
                        generatedSubtasks = [
                            { id: `sub_${Date.now()}_1`, title: "Outline core sections & arguments", completed: false },
                            { id: `sub_${Date.now()}_2`, title: "Draft main body paragraphs & citations", completed: false },
                            { id: `sub_${Date.now()}_3`, title: "Proofread and polish conclusion", completed: false },
                        ];
                    } else if (lower.includes("bug") || lower.includes("fix") || lower.includes("code") || lower.includes("feature")) {
                        generatedSubtasks = [
                            { id: `sub_${Date.now()}_1`, title: "Reproduce issue & inspect logs", completed: false },
                            { id: `sub_${Date.now()}_2`, title: "Implement fix / core logic", completed: false },
                            { id: `sub_${Date.now()}_3`, title: "Write unit test and verify edge cases", completed: false },
                        ];
                    } else if (lower.includes("exam") || lower.includes("study") || lower.includes("read")) {
                        generatedSubtasks = [
                            { id: `sub_${Date.now()}_1`, title: "Skim chapter headings & summarize notes", completed: false },
                            { id: `sub_${Date.now()}_2`, title: "Solve 3 practice questions", completed: false },
                            { id: `sub_${Date.now()}_3`, title: "Active recall review of formula sheet", completed: false },
                        ];
                    } else {
                        generatedSubtasks = [
                            { id: `sub_${Date.now()}_1`, title: "Define acceptance criteria & scope", completed: false },
                            { id: `sub_${Date.now()}_2`, title: "Execute the core 80% work block", completed: false },
                            { id: `sub_${Date.now()}_3`, title: "Review, refine, and check off", completed: false },
                        ];
                    }
                }

                set((state) => ({
                    tasks: state.tasks.map((t) =>
                        t._id === taskId
                            ? { ...t, subtasks: [...(t.subtasks || []), ...generatedSubtasks] }
                            : t
                    ),
                }));
                return generatedSubtasks;
            },

            reorderTasks: (newTasks) => {
                set({ tasks: newTasks });
            },

            // Focus Timer Actions
            setTimerMinutes: (minutes) =>
                set((state) => ({ timer: { ...state.timer, minutes, seconds: 0 } })),

            toggleTimer: () =>
                set((state) => ({ timer: { ...state.timer, isRunning: !state.timer.isRunning } })),

            resetTimer: (mode = "work") =>
                set((state) => ({
                    timer: {
                        ...state.timer,
                        minutes: mode === "work" ? 25 : 5,
                        seconds: 0,
                        isRunning: false,
                        mode,
                    },
                })),

            tickTimer: () => {
                const { timer } = get();
                if (!timer.isRunning) return;

                if (timer.seconds > 0) {
                    set((state) => ({ timer: { ...state.timer, seconds: state.timer.seconds - 1 } }));
                } else if (timer.minutes > 0) {
                    set((state) => ({
                        timer: { ...state.timer, minutes: state.timer.minutes - 1, seconds: 59 },
                    }));
                } else {
                    // Timer finished!
                    const isWork = timer.mode === "work";
                    const newMode = isWork ? "break" : "work";
                    const newMinutes = isWork ? 5 : 25;

                    set((state) => ({
                        timer: {
                            ...state.timer,
                            mode: newMode,
                            minutes: newMinutes,
                            seconds: 0,
                            isRunning: false,
                            totalCompletedSessions: isWork
                                ? state.timer.totalCompletedSessions + 1
                                : state.timer.totalCompletedSessions,
                        },
                    }));
                }
            },

            // Cloud Sync with MongoDB
            syncWithServer: async (userId) => {
                if (!userId || userId === "guest_user") return;
                set({ syncStatus: "syncing" });
                try {
                    const serverTasks = await getTasksOfUsers(userId);
                    if (Array.isArray(serverTasks) && serverTasks.length > 0) {
                        // Merge server tasks with local
                        const localTasks = get().tasks;
                        const mergedMap = new Map();

                        serverTasks.forEach((st) => mergedMap.set(st._id, st));
                        localTasks.forEach((lt) => {
                            if (!mergedMap.has(lt._id)) {
                                mergedMap.set(lt._id, lt);
                            }
                        });

                        set({ tasks: Array.from(mergedMap.values()), syncStatus: "synced" });
                    } else {
                        set({ syncStatus: "synced" });
                    }
                } catch (err) {
                    set({ syncStatus: "error" });
                }
            },

            // Import & Export
            exportTasks: (format = "json") => {
                const tasks = get().tasks;
                if (format === "json") {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
                    const a = document.createElement("a");
                    a.setAttribute("href", dataStr);
                    a.setAttribute("download", `taskflow_backup_${new Date().toISOString().slice(0, 10)}.json`);
                    a.click();
                } else if (format === "csv") {
                    const headers = ["Title", "Description", "Status", "Priority", "Energy", "EstMinutes", "DueDate", "Tags", "Project"];
                    const rows = tasks.map((t) => [
                        `"${(t.title || "").replace(/"/g, '""')}"`,
                        `"${(t.description || "").replace(/"/g, '""')}"`,
                        t.status,
                        t.priority,
                        t.energy,
                        t.estimatedMinutes,
                        t.dueDate || "",
                        `"${(t.tags || []).join(",")}"`,
                        t.project || "General",
                    ]);
                    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
                    const a = document.createElement("a");
                    a.setAttribute("href", encodeURI(csvContent));
                    a.setAttribute("download", `taskflow_backup_${new Date().toISOString().slice(0, 10)}.csv`);
                    a.click();
                }
            },

            importTasks: (importedData) => {
                if (!Array.isArray(importedData)) return false;
                const validated = importedData.map((item, index) => ({
                    _id: item._id || `imported_${Date.now()}_${index}`,
                    title: item.title || "Imported Task",
                    description: item.description || "",
                    status: item.status === "completed" ? "completed" : item.status === "in_progress" ? "in_progress" : "pending",
                    priority: ["urgent", "high", "medium", "low"].includes(item.priority) ? item.priority : "medium",
                    energy: ["quick_win", "low", "medium", "high"].includes(item.energy) ? item.energy : "medium",
                    estimatedMinutes: Number(item.estimatedMinutes) || 30,
                    dueDate: item.dueDate || null,
                    tags: Array.isArray(item.tags) ? item.tags : [],
                    project: item.project || "General",
                    subtasks: Array.isArray(item.subtasks) ? item.subtasks : [],
                    recurring: item.recurring || "none",
                    addedDate: item.addedDate || new Date().toISOString(),
                    completedAt: item.completedAt || null,
                }));

                set((state) => ({
                    tasks: [...validated, ...state.tasks],
                }));
                return true;
            },
        }),
        {
            name: "taskflow_utsav_tasks",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
