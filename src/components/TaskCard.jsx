"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "@/store/useTaskStore";
import confetti from "canvas-confetti";
import {
    CheckCircle2,
    Circle,
    Calendar,
    Clock,
    Zap,
    AlertCircle,
    Trash2,
    Sparkles,
    ChevronDown,
    ChevronUp,
    Plus,
    X,
    Play,
    Tag,
} from "lucide-react";

export default function TaskCard({ task }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);

    const toggleTaskStatus = useTaskStore((s) => s.toggleTaskStatus);
    const deleteTask = useTaskStore((s) => s.deleteTask);
    const updateTask = useTaskStore((s) => s.updateTask);
    const addSubtask = useTaskStore((s) => s.addSubtask);
    const toggleSubtask = useTaskStore((s) => s.toggleSubtask);
    const deleteSubtask = useTaskStore((s) => s.deleteSubtask);
    const setSelectedTaskIdForFocus = useTaskStore((s) => s.setSelectedTaskIdForFocus);
    const setViewMode = useTaskStore((s) => s.setViewMode);

    const isCompleted = task.status === "completed";
    const subtasks = task.subtasks || [];
    const completedSubtasks = subtasks.filter((s) => s.completed).length;

    // Calculate due status
    let dueStatus = null;
    if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const now = new Date();
        const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (diffHours < 0 && !isCompleted) {
            dueStatus = { label: "Overdue", color: "text-rose-400 bg-rose-500/10 border-rose-500/30" };
        } else if (diffHours <= 24 && !isCompleted) {
            dueStatus = { label: "Due Today", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
        } else {
            dueStatus = {
                label: dueDate.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
                color: "text-slate-400 bg-slate-800 border-slate-700",
            };
        }
    }

    const handleToggleComplete = () => {
        toggleTaskStatus(task._id);
        if (!isCompleted) {
            try {
                confetti({
                    particleCount: 35,
                    spread: 60,
                    origin: { y: 0.7 },
                    colors: ["#10b981", "#6366f1", "#f59e0b"],
                });
            } catch (e) {}
        }
    };

    const handleStartFocus = () => {
        setSelectedTaskIdForFocus(task._id);
        setViewMode("focus");
    };

    const handleAiDeconstruct = async () => {
        setIsAiLoading(true);
        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "decompose",
                    taskTitle: task.title,
                    taskDescription: task.description,
                }),
            });
            const data = await res.json();
            if (data?.result?.subtasks) {
                updateTask(task._id, {
                    subtasks: [...subtasks, ...data.result.subtasks],
                });
                setIsExpanded(true);
            }
        } catch (err) {
            console.error("AI Deconstruct failed:", err);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleAddSubtask = (e) => {
        e.preventDefault();
        if (!newSubtaskTitle.trim()) return;
        addSubtask(task._id, newSubtaskTitle.trim());
        setNewSubtaskTitle("");
    };

    const priorityBadge = {
        urgent: "bg-rose-500/20 text-rose-300 border-rose-500/30",
        high: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        medium: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
        low: "bg-slate-700/60 text-slate-300 border-slate-600/40",
    }[task.priority || "medium"];

    const energyBadge = {
        quick_win: { label: "⚡ Quick Win", class: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
        low: { label: "🔋 Low Energy", class: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
        medium: { label: "⚡ Normal", class: "bg-violet-500/20 text-violet-300 border-violet-500/30" },
        high: { label: "🔥 Deep Focus", class: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
    }[task.energy || "medium"];

    return (
        <motion.div
            layout
            layoutId={task._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 35 }}
            className={`group rounded-2xl border transition-all duration-200 ${
                isCompleted
                    ? "bg-slate-900/40 border-slate-800/60 opacity-60"
                    : "bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:shadow-xl shadow-lg"
            } p-4 md:p-5`}
        >
            <div className="flex items-start justify-between gap-3">
                {/* Checkbox & Title */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                        onClick={handleToggleComplete}
                        className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none flex-shrink-0"
                    >
                        {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        ) : (
                            <Circle className="w-6 h-6 hover:text-emerald-400" />
                        )}
                    </button>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3
                                className={`font-semibold text-base md:text-lg leading-snug break-words ${
                                    isCompleted ? "line-through text-slate-400" : "text-white"
                                }`}
                            >
                                {task.title}
                            </h3>

                            {/* Priority */}
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${priorityBadge}`}>
                                {task.priority}
                            </span>

                            {/* Energy */}
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${energyBadge.class}`}>
                                {energyBadge.label}
                            </span>
                        </div>

                        {task.description && (
                            <p className="text-slate-400 text-sm mb-3 line-clamp-2">{task.description}</p>
                        )}

                        {/* Metadata row */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                            {dueStatus && (
                                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] ${dueStatus.color}`}>
                                    <Calendar className="w-3 h-3" />
                                    {dueStatus.label}
                                </span>
                            )}

                            {task.estimatedMinutes && (
                                <span className="flex items-center gap-1 bg-slate-800 border border-slate-700/60 px-2 py-0.5 rounded-md">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    {task.estimatedMinutes}m
                                </span>
                            )}

                            {task.project && task.project !== "General" && (
                                <span className="flex items-center gap-1 bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded-md">
                                    📁 {task.project}
                                </span>
                            )}

                            {(task.tags || []).map((tag) => (
                                <span
                                    key={tag}
                                    className="flex items-center gap-0.5 bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700"
                                >
                                    <Tag className="w-2.5 h-2.5 text-slate-400" />
                                    {tag}
                                </span>
                            ))}

                            {subtasks.length > 0 && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700 transition-colors"
                                >
                                    <span>
                                        {completedSubtasks}/{subtasks.length} subtasks
                                    </span>
                                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    {!isCompleted && (
                        <button
                            onClick={handleStartFocus}
                            title="Focus on this task in deep work mode"
                            className="p-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors"
                        >
                            <Play className="w-4 h-4 fill-current" />
                        </button>
                    )}

                    <button
                        onClick={handleAiDeconstruct}
                        disabled={isAiLoading}
                        title="Deconstruct into micro-steps with AI"
                        className="p-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition-colors"
                    >
                        <Sparkles className={`w-4 h-4 ${isAiLoading ? "animate-spin" : ""}`} />
                    </button>

                    <button
                        onClick={() => deleteTask(task._id)}
                        title="Delete task"
                        className="p-2 rounded-xl hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Expandable Subtasks Checklist */}
            <AnimatePresence>
                {(isExpanded || subtasks.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-3 border-t border-slate-800/80 overflow-hidden"
                    >
                        {/* Progress Bar */}
                        {subtasks.length > 0 && (
                            <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3 overflow-hidden">
                                <div
                                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${(completedSubtasks / subtasks.length) * 100}%`,
                                    }}
                                />
                            </div>
                        )}

                        <div className="space-y-1.5 mb-3">
                            {subtasks.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
                                >
                                    <label className="flex items-center gap-2 flex-1 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={sub.completed}
                                            onChange={() => toggleSubtask(task._id, sub.id)}
                                            className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
                                        />
                                        <span
                                            className={`text-xs md:text-sm ${
                                                sub.completed ? "line-through text-slate-400" : "text-slate-300"
                                            }`}
                                        >
                                            {sub.title}
                                        </span>
                                    </label>
                                    <button
                                        onClick={() => deleteSubtask(task._id, sub.id)}
                                        className="text-slate-500 hover:text-rose-400 p-1"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add subtask input */}
                        <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newSubtaskTitle}
                                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                placeholder="Add a concrete micro-step..."
                                className="flex-1 bg-slate-800/60 border border-slate-700/60 text-xs md:text-sm text-white placeholder-slate-400 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                                type="submit"
                                disabled={!newSubtaskTitle.trim()}
                                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Step
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
