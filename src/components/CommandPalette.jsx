"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "@/store/useTaskStore";
import {
    Search,
    ListTodo,
    Kanban,
    Calendar,
    Compass,
    Sparkles,
    Download,
    Info,
    Moon,
    X,
    Check,
} from "lucide-react";

export default function CommandPalette() {
    const isOpen = useTaskStore((s) => s.isCommandPaletteOpen);
    const toggleCommandPalette = useTaskStore((s) => s.toggleCommandPalette);
    const tasks = useTaskStore((s) => s.tasks);
    const setViewMode = useTaskStore((s) => s.setViewMode);
    const toggleRecommendModal = useTaskStore((s) => s.toggleRecommendModal);
    const toggleAbout = useTaskStore((s) => s.toggleAbout);
    const toggleTheme = useTaskStore((s) => s.toggleTheme);
    const exportTasks = useTaskStore((s) => s.exportTasks);
    const setSelectedTaskIdForFocus = useTaskStore((s) => s.setSelectedTaskIdForFocus);

    const [query, setQuery] = useState("");

    // Listen for Ctrl+K / Cmd+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                toggleCommandPalette();
            }
            if (e.key === "Escape" && isOpen) {
                toggleCommandPalette(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, toggleCommandPalette]);

    if (!isOpen) return null;

    // Filter tasks and actions
    const matchingTasks = tasks.filter((t) =>
        t.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    const actions = [
        {
            id: "what-now",
            title: "What Should I Do Right Now?",
            icon: Compass,
            action: () => {
                toggleCommandPalette(false);
                toggleRecommendModal(true);
            },
        },
        {
            id: "view-list",
            title: "Switch to List View",
            icon: ListTodo,
            action: () => {
                setViewMode("list");
                toggleCommandPalette(false);
            },
        },
        {
            id: "view-kanban",
            title: "Switch to Kanban Board",
            icon: Kanban,
            action: () => {
                setViewMode("kanban");
                toggleCommandPalette(false);
            },
        },
        {
            id: "view-calendar",
            title: "Switch to Calendar View",
            icon: Calendar,
            action: () => {
                setViewMode("calendar");
                toggleCommandPalette(false);
            },
        },
        {
            id: "export-json",
            title: "Export Tasks (JSON)",
            icon: Download,
            action: () => {
                exportTasks("json");
                toggleCommandPalette(false);
            },
        },
        {
            id: "about-utsav",
            title: "About TaskFlow (Built by Utsav)",
            icon: Info,
            action: () => {
                toggleCommandPalette(false);
                toggleAbout(true);
            },
        },
    ].filter((a) => a.title.toLowerCase().includes(query.toLowerCase()));

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Type a command or search tasks..."
                            autoFocus
                            className="w-full bg-transparent text-white placeholder-slate-400 text-base focus:outline-none"
                        />
                        <button
                            onClick={() => toggleCommandPalette(false)}
                            className="text-slate-400 hover:text-white p-1"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Results list */}
                    <div className="max-h-96 overflow-y-auto p-3 space-y-4 custom-scrollbar">
                        {/* Matching Tasks */}
                        {matchingTasks.length > 0 && (
                            <div>
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
                                    Tasks
                                </span>
                                <div className="space-y-1">
                                    {matchingTasks.map((t) => (
                                        <button
                                            key={t._id}
                                            onClick={() => {
                                                setSelectedTaskIdForFocus(t._id);
                                                setViewMode("focus");
                                                toggleCommandPalette(false);
                                            }}
                                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-slate-800/80 text-sm text-slate-200 transition-colors"
                                        >
                                            <span className="truncate">{t.title}</span>
                                            <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                                {t.priority}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        {actions.length > 0 && (
                            <div>
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
                                    Actions & Navigation
                                </span>
                                <div className="space-y-1">
                                    {actions.map((act) => {
                                        const Icon = act.icon;
                                        return (
                                            <button
                                                key={act.id}
                                                onClick={act.action}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-indigo-600/20 hover:text-indigo-300 text-sm text-slate-300 transition-colors"
                                            >
                                                <Icon className="w-4 h-4 text-slate-400" />
                                                <span>{act.title}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {matchingTasks.length === 0 && actions.length === 0 && (
                            <div className="p-8 text-center text-slate-500 text-sm">
                                No matching commands or tasks found.
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                        <span>Navigate with ⬆⬇, Enter to select</span>
                        <span>Esc to close</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
