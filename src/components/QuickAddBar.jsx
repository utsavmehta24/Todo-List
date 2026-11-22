"use client";
import React, { useState, useTransition } from "react";
import { parseNaturalLanguageTask } from "@/utils/nlpParser";
import { useTaskStore } from "@/store/useTaskStore";
import { Sparkles, Plus, Calendar, Tag, AlertCircle, Zap, Clock, Compass } from "lucide-react";
import confetti from "canvas-confetti";

export default function QuickAddBar() {
    const [input, setInput] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);
    const addTask = useTaskStore((s) => s.addTask);
    const toggleRecommendModal = useTaskStore((s) => s.toggleRecommendModal);

    // Live NLP preview
    const parsed = parseNaturalLanguageTask(input);
    const hasSpecialTokens =
        parsed.tags.length > 0 ||
        parsed.priority !== "medium" ||
        parsed.dueDate !== null ||
        parsed.energy !== "medium" ||
        parsed.estimatedMinutes !== 30;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        await addTask(parsed);
        setInput("");
        
        try {
            confetti({
                particleCount: 25,
                spread: 45,
                origin: { y: 0.8 },
                colors: ["#6366f1", "#3b82f6", "#10b981"],
            });
        } catch (e) {
            // Ignore confetti errors
        }
    };

    const handleAiDeconstruct = async () => {
        if (!input.trim()) return;
        setIsAiLoading(true);
        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "decompose",
                    taskTitle: parsed.title,
                }),
            });
            const data = await res.json();
            if (data?.result?.subtasks) {
                await addTask({
                    ...parsed,
                    subtasks: data.result.subtasks,
                    priority: data.result.suggestedPriority || parsed.priority,
                    energy: data.result.suggestedEnergy || parsed.energy,
                    estimatedMinutes: data.result.estimatedMinutes || parsed.estimatedMinutes,
                });
                setInput("");
            }
        } catch (err) {
            console.error("AI Deconstruct failed:", err);
            await addTask(parsed);
            setInput("");
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl mb-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder='Try: "Draft paper tomorrow 5pm #college !high ~45m @high"'
                            className="w-full bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl font-medium text-sm md:text-base transition-all duration-200 shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">Add Task</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleAiDeconstruct}
                        disabled={!input.trim() || isAiLoading}
                        title="Break into micro-steps with AI"
                        className="flex items-center gap-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Sparkles className={`w-4 h-4 ${isAiLoading ? "animate-spin" : ""}`} />
                        <span className="hidden md:inline">{isAiLoading ? "Deconstructing..." : "AI Breakdown"}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => toggleRecommendModal(true)}
                        title="Overwhelmed? Let TaskFlow pick your next task"
                        className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200"
                    >
                        <Compass className="w-4 h-4" />
                        <span className="hidden md:inline">What Now?</span>
                    </button>
                </div>

                {/* Real-time NLP parsing badges */}
                {input.trim() && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <span className="text-slate-400 font-medium">Detected:</span>
                        {parsed.title && (
                            <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-md border border-slate-700">
                                📝 {parsed.title}
                            </span>
                        )}
                        {parsed.dueDate && (
                            <span className="flex items-center gap-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-md">
                                <Calendar className="w-3 h-3" />
                                {new Date(parsed.dueDate).toLocaleDateString(undefined, {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                })}
                            </span>
                        )}
                        {parsed.priority !== "medium" && (
                            <span
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-md border ${
                                    parsed.priority === "urgent"
                                        ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                                        : parsed.priority === "high"
                                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                        : "bg-slate-700 text-slate-300 border-slate-600"
                                }`}
                            >
                                <AlertCircle className="w-3 h-3" />
                                Priority: {parsed.priority}
                            </span>
                        )}
                        {parsed.energy !== "medium" && (
                            <span className="flex items-center gap-1 bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2.5 py-1 rounded-md">
                                <Zap className="w-3 h-3" />
                                Energy: {parsed.energy}
                            </span>
                        )}
                        {parsed.estimatedMinutes !== 30 && (
                            <span className="flex items-center gap-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-md">
                                <Clock className="w-3 h-3" />
                                ~{parsed.estimatedMinutes}m
                            </span>
                        )}
                        {parsed.tags.map((t) => (
                            <span
                                key={t}
                                className="flex items-center gap-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-md"
                            >
                                <Tag className="w-3 h-3" />#{t}
                            </span>
                        ))}
                    </div>
                )}
            </form>
        </div>
    );
}
