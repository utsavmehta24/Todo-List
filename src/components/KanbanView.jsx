"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "@/store/useTaskStore";
import TaskCard from "./TaskCard";
import { ArrowRight, ArrowLeft, CheckCircle2, Circle, Clock, Flame } from "lucide-react";

const COLUMNS = [
    {
        id: "pending",
        title: "To Do",
        icon: Circle,
        color: "border-slate-700 bg-slate-900/60",
        badge: "bg-slate-800 text-slate-300",
    },
    {
        id: "in_progress",
        title: "In Progress",
        icon: Clock,
        color: "border-indigo-800/40 bg-indigo-950/20",
        badge: "bg-indigo-500/20 text-indigo-300",
    },
    {
        id: "completed",
        title: "Completed",
        icon: CheckCircle2,
        color: "border-emerald-800/40 bg-emerald-950/20",
        badge: "bg-emerald-500/20 text-emerald-300",
    },
];

export default function KanbanView() {
    const tasks = useTaskStore((s) => s.tasks);
    const updateTask = useTaskStore((s) => s.updateTask);
    const activeFilter = useTaskStore((s) => s.activeFilter);
    const searchQuery = useTaskStore((s) => s.searchQuery);
    const selectedTag = useTaskStore((s) => s.selectedTag);

    // Apply filters
    const filteredTasks = tasks.filter((task) => {
        if (selectedTag && !(task.tags || []).includes(selectedTag)) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const matchTitle = task.title.toLowerCase().includes(q);
            const matchDesc = (task.description || "").toLowerCase().includes(q);
            const matchTag = (task.tags || []).some((t) => t.toLowerCase().includes(q));
            if (!matchTitle && !matchDesc && !matchTag) return false;
        }
        return true;
    });

    const handleMoveStatus = (taskId, newStatus) => {
        updateTask(taskId, {
            status: newStatus,
            completedAt: newStatus === "completed" ? new Date().toISOString() : null,
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pb-12">
            {COLUMNS.map((col) => {
                const colTasks = filteredTasks.filter((t) => (t.status || "pending") === col.id);
                const Icon = col.icon;

                return (
                    <div
                        key={col.id}
                        className={`rounded-2xl border ${col.color} p-4 flex flex-col min-h-[500px] shadow-lg backdrop-blur-sm`}
                    >
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
                            <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4 text-slate-400" />
                                <h3 className="font-semibold text-white text-base">{col.title}</h3>
                            </div>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${col.badge}`}>
                                {colTasks.length}
                            </span>
                        </div>

                        {/* Cards Container */}
                        <motion.div layout className="flex flex-col gap-3 flex-1">
                            <AnimatePresence>
                                {colTasks.map((task) => (
                                    <div key={task._id} className="relative group/kanban">
                                        <TaskCard task={task} />

                                        {/* Quick Move Bar on card footer */}
                                        <div className="mt-1 flex items-center justify-end gap-1 opacity-0 group-hover/kanban:opacity-100 transition-opacity px-2 text-[11px] text-slate-400">
                                            {col.id !== "pending" && (
                                                <button
                                                    onClick={() => handleMoveStatus(task._id, "pending")}
                                                    className="hover:text-indigo-400 p-1 flex items-center gap-0.5"
                                                    title="Move to To Do"
                                                >
                                                    <ArrowLeft className="w-3 h-3" /> To Do
                                                </button>
                                            )}
                                            {col.id !== "in_progress" && (
                                                <button
                                                    onClick={() => handleMoveStatus(task._id, "in_progress")}
                                                    className="hover:text-indigo-400 p-1 flex items-center gap-0.5"
                                                    title="Move to In Progress"
                                                >
                                                    Progress <ArrowRight className="w-3 h-3" />
                                                </button>
                                            )}
                                            {col.id !== "completed" && (
                                                <button
                                                    onClick={() => handleMoveStatus(task._id, "completed")}
                                                    className="hover:text-emerald-400 p-1 flex items-center gap-0.5"
                                                    title="Mark Complete"
                                                >
                                                    Done <ArrowRight className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </AnimatePresence>

                            {colTasks.length === 0 && (
                                <div className="flex-1 flex flex-col items-center justify-center p-8 border border-dashed border-slate-800/80 rounded-xl text-center text-slate-500 text-sm">
                                    No tasks in {col.title}
                                </div>
                            )}
                        </motion.div>
                    </div>
                );
            })}
        </div>
    );
}
