"use client";
import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "@/store/useTaskStore";
import UserContext from "@/context/userContext";
import TaskCard from "@/components/TaskCard";
import QuickAddBar from "@/components/QuickAddBar";
import KanbanView from "@/components/KanbanView";
import CalendarView from "@/components/CalendarView";
import FocusMode from "@/components/FocusMode";
import ProductivityInsights from "@/components/ProductivityInsights";
import RecommendationModal from "@/components/RecommendationModal";
import AboutModal from "@/components/AboutModal";
import CommandPalette from "@/components/CommandPalette";

import {
    ListTodo,
    Kanban,
    Calendar,
    Zap,
    TrendingUp,
    Search,
    Filter,
    Compass,
    Sparkles,
    CheckCircle2,
    Clock,
    AlertCircle,
    Info,
    RefreshCw,
} from "lucide-react";

export default function ShowTaskPage() {
    const context = useContext(UserContext);
    const tasks = useTaskStore((s) => s.tasks);
    const viewMode = useTaskStore((s) => s.viewMode);
    const setViewMode = useTaskStore((s) => s.setViewMode);
    const activeFilter = useTaskStore((s) => s.activeFilter);
    const setActiveFilter = useTaskStore((s) => s.setActiveFilter);
    const searchQuery = useTaskStore((s) => s.searchQuery);
    const setSearchQuery = useTaskStore((s) => s.setSearchQuery);
    const selectedTag = useTaskStore((s) => s.selectedTag);
    const setSelectedTag = useTaskStore((s) => s.setSelectedTag);
    const syncWithServer = useTaskStore((s) => s.syncWithServer);
    const syncStatus = useTaskStore((s) => s.syncStatus);
    const toggleRecommendModal = useTaskStore((s) => s.toggleRecommendModal);
    const toggleCommandPalette = useTaskStore((s) => s.toggleCommandPalette);
    const toggleAbout = useTaskStore((s) => s.toggleAbout);

    // Sync with backend when user is logged in
    useEffect(() => {
        if (context?.user?._id) {
            syncWithServer(context.user._id);
        }
    }, [context?.user, syncWithServer]);

    // Extract all unique projects & tags
    const projects = Array.from(new Set(tasks.map((t) => t.project || "General")));
    const allTags = Array.from(new Set(tasks.flatMap((t) => t.tags || [])));

    // Filtering logic
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const filteredTasks = tasks.filter((task) => {
        // Search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const matchTitle = task.title.toLowerCase().includes(q);
            const matchDesc = (task.description || "").toLowerCase().includes(q);
            const matchTag = (task.tags || []).some((t) => t.toLowerCase().includes(q));
            if (!matchTitle && !matchDesc && !matchTag) return false;
        }

        // Tag filter
        if (selectedTag && !(task.tags || []).includes(selectedTag)) {
            return false;
        }

        // Smart views
        if (activeFilter === "today") {
            if (!task.dueDate) return false;
            const due = new Date(task.dueDate);
            return due >= startOfToday && due <= endOfToday;
        }
        if (activeFilter === "upcoming") {
            if (!task.dueDate) return false;
            const due = new Date(task.dueDate);
            return due > endOfToday && task.status !== "completed";
        }
        if (activeFilter === "overdue") {
            if (!task.dueDate) return false;
            const due = new Date(task.dueDate);
            return due < startOfToday && task.status !== "completed";
        }
        if (activeFilter === "completed") {
            return task.status === "completed";
        }
        if (activeFilter !== "all") {
            // Project filter
            return (task.project || "General") === activeFilter;
        }

        return true;
    });

    const pendingCount = tasks.filter((t) => t.status !== "completed").length;
    const completedCount = tasks.filter((t) => t.status === "completed").length;
    const overdueCount = tasks.filter((t) => {
        if (!t.dueDate || t.status === "completed") return false;
        return new Date(t.dueDate) < startOfToday;
    }).length;

    const navTabs = [
        { id: "list", label: "Tasks", icon: ListTodo },
        { id: "kanban", label: "Kanban", icon: Kanban },
        { id: "calendar", label: "Calendar", icon: Calendar },
        { id: "focus", label: "Focus Mode", icon: Zap },
        { id: "insights", label: "Insights", icon: TrendingUp },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
            {/* Global Overlays */}
            <CommandPalette />
            <RecommendationModal />
            <AboutModal />

            {/* Header Hub */}
            <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    {/* Brand & Creator Identity */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-extrabold text-lg text-white tracking-tight">
                                    TaskFlow
                                </h1>
                                <button
                                    onClick={() => toggleAbout(true)}
                                    className="text-[10px] font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full transition-colors"
                                >
                                    Built by Utsav
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Desktop View Switcher */}
                    <nav className="hidden md:flex items-center bg-slate-950/80 border border-slate-800/80 p-1 rounded-2xl">
                        {navTabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = viewMode === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setViewMode(tab.id)}
                                    className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium text-xs transition-all duration-200 ${
                                        isActive
                                            ? "text-white bg-indigo-600 shadow-md shadow-indigo-600/30"
                                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Quick Action Helpers */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => toggleRecommendModal(true)}
                            title="What Should I Do Right Now?"
                            className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                        >
                            <Compass className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">What Now?</span>
                        </button>

                        <button
                            onClick={() => toggleCommandPalette(true)}
                            className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
                        >
                            <span>Search</span>
                            <kbd className="bg-slate-900 border border-slate-700 text-slate-400 text-[10px] px-1.5 py-0.5 rounded">
                                Ctrl K
                            </kbd>
                        </button>

                        <button
                            onClick={() => toggleAbout(true)}
                            title="About TaskFlow"
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                            <Info className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Mobile View Switcher Bar */}
                <div className="md:hidden flex items-center justify-around border-t border-slate-800/60 py-2 px-2 bg-slate-900/90 overflow-x-auto">
                    {navTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = viewMode === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setViewMode(tab.id)}
                                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-medium transition-colors ${
                                    isActive ? "text-indigo-400 font-bold" : "text-slate-400"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </header>

            {/* Main Application Body */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Views Dispatcher */}
                {viewMode === "kanban" ? (
                    <>
                        <QuickAddBar />
                        <KanbanView />
                    </>
                ) : viewMode === "calendar" ? (
                    <>
                        <QuickAddBar />
                        <CalendarView />
                    </>
                ) : viewMode === "focus" ? (
                    <FocusMode />
                ) : viewMode === "insights" ? (
                    <ProductivityInsights />
                ) : (
                    /* Default List View */
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                        {/* Sidebar Filters */}
                        <aside className="lg:col-span-1 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-5">
                            {/* Search */}
                            <div className="relative">
                                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Filter tasks..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Smart Views */}
                            <div>
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
                                    Smart Views
                                </span>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setActiveFilter("all")}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                                            activeFilter === "all" && !selectedTag
                                                ? "bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30"
                                                : "text-slate-300 hover:bg-slate-800/60"
                                        }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <ListTodo className="w-4 h-4 text-slate-400" /> All Tasks
                                        </span>
                                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                                            {tasks.length}
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => setActiveFilter("today")}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                                            activeFilter === "today"
                                                ? "bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30"
                                                : "text-slate-300 hover:bg-slate-800/60"
                                        }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-amber-400" /> Due Today
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => setActiveFilter("overdue")}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                                            activeFilter === "overdue"
                                                ? "bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30"
                                                : "text-slate-300 hover:bg-slate-800/60"
                                        }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-rose-400" /> Overdue
                                        </span>
                                        {overdueCount > 0 && (
                                            <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full">
                                                {overdueCount}
                                            </span>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => setActiveFilter("completed")}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                                            activeFilter === "completed"
                                                ? "bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30"
                                                : "text-slate-300 hover:bg-slate-800/60"
                                        }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Completed
                                        </span>
                                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                                            {completedCount}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Projects */}
                            {projects.length > 0 && (
                                <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
                                        Projects
                                    </span>
                                    <div className="space-y-1">
                                        {projects.map((proj) => (
                                            <button
                                                key={proj}
                                                onClick={() => setActiveFilter(proj)}
                                                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors ${
                                                    activeFilter === proj
                                                        ? "bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30"
                                                        : "text-slate-300 hover:bg-slate-800/60"
                                                }`}
                                            >
                                                <span>📁 {proj}</span>
                                                <span className="text-[10px] text-slate-500">
                                                    {tasks.filter((t) => (t.project || "General") === proj).length}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            {allTags.length > 0 && (
                                <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
                                        Tags
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {allTags.map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                                                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                                                    selectedTag === t
                                                        ? "bg-indigo-600 text-white border-indigo-500"
                                                        : "bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-white"
                                                }`}
                                            >
                                                #{t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </aside>

                        {/* Task List Feed */}
                        <section className="lg:col-span-3 space-y-4">
                            <QuickAddBar />

                            {/* Header details */}
                            <div className="flex items-center justify-between px-2 text-xs text-slate-400">
                                <span>
                                    Showing{" "}
                                    <strong className="text-white font-semibold">
                                        {filteredTasks.length}
                                    </strong>{" "}
                                    tasks {selectedTag && `tagged #${selectedTag}`}
                                </span>
                                <span>{pendingCount} remaining</span>
                            </div>

                            {/* Task Cards Stack */}
                            <div className="space-y-3 pb-12">
                                <AnimatePresence>
                                    {filteredTasks.map((task) => (
                                        <TaskCard key={task._id} task={task} />
                                    ))}
                                </AnimatePresence>

                                {filteredTasks.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-16 px-4 border border-dashed border-slate-800 rounded-3xl bg-slate-900/40"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-base font-bold text-white mb-1">
                                            Clear Horizon
                                        </h3>
                                        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                                            No tasks found under this filter. Add one with natural language above or celebrate your completed list!
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
}
