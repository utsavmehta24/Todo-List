"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useTaskStore } from "@/store/useTaskStore";
import confetti from "canvas-confetti";
import { Play, Pause, RotateCcw, CheckCircle2, ArrowLeft, Volume2, Sparkles, Coffee } from "lucide-react";

export default function FocusMode() {
    const tasks = useTaskStore((s) => s.tasks);
    const selectedTaskId = useTaskStore((s) => s.selectedTaskIdForFocus);
    const setViewMode = useTaskStore((s) => s.setViewMode);
    const toggleTaskStatus = useTaskStore((s) => s.toggleTaskStatus);
    const toggleSubtask = useTaskStore((s) => s.toggleSubtask);

    const timer = useTaskStore((s) => s.timer);
    const toggleTimer = useTaskStore((s) => s.toggleTimer);
    const resetTimer = useTaskStore((s) => s.resetTimer);
    const tickTimer = useTaskStore((s) => s.tickTimer);

    // Active task
    const activeTask = tasks.find((t) => t._id === selectedTaskId) || tasks.find((t) => t.status !== "completed") || tasks[0];

    // Clock Interval
    useEffect(() => {
        let interval = null;
        if (timer.isRunning) {
            interval = setInterval(() => {
                tickTimer();
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timer.isRunning, tickTimer]);

    // Web Audio Synthesizer Chime
    const playChime = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.8);
        } catch (e) {}
    };

    const handleCompleteActiveTask = () => {
        if (!activeTask) return;
        toggleTaskStatus(activeTask._id);
        playChime();
        try {
            confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#6366f1", "#10b981", "#f59e0b"],
            });
        } catch (e) {}
    };

    // Calculate circular timer progress
    const totalSeconds = timer.mode === "work" ? 25 * 60 : 5 * 60;
    const currentSeconds = timer.minutes * 60 + timer.seconds;
    const progress = Math.max(0, Math.min(1, 1 - currentSeconds / totalSeconds));
    const strokeDashoffset = 565.48 * (1 - progress);

    const formattedMinutes = String(timer.minutes).padStart(2, "0");
    const formattedSeconds = String(timer.seconds).padStart(2, "0");

    return (
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto py-6 px-4">
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between mb-8">
                <button
                    onClick={() => setViewMode("list")}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Tasks
                </button>

                <div className="flex items-center gap-2">
                    <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                            timer.mode === "work"
                                ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        }`}
                    >
                        {timer.mode === "work" ? "⚡ Deep Work Session" : "☕ Rest & Recharge"}
                    </span>
                    <span className="text-xs text-slate-400">
                        {timer.totalCompletedSessions} completed today
                    </span>
                </div>
            </div>

            {/* Circular Timer Visual */}
            <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center mb-8">
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Track */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r="90"
                        className="stroke-slate-800"
                        strokeWidth="10"
                        fill="transparent"
                    />
                    {/* Animated Progress Ring */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r="90"
                        stroke={timer.mode === "work" ? "#6366f1" : "#10b981"}
                        strokeWidth="10"
                        strokeDasharray="565.48"
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-linear shadow-lg"
                    />
                </svg>

                {/* Inner Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-5xl md:text-6xl font-black tracking-tight text-white font-mono">
                        {formattedMinutes}:{formattedSeconds}
                    </span>
                    <span className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-semibold">
                        {timer.mode === "work" ? "Stay in flow" : "Breathe & stretch"}
                    </span>
                </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-4 mb-10">
                <button
                    onClick={() => resetTimer(timer.mode === "work" ? "break" : "work")}
                    className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Switch mode (Work / Break)"
                >
                    <Coffee className="w-5 h-5" />
                </button>

                <button
                    onClick={toggleTimer}
                    className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 active:scale-95 shadow-xl ${
                        timer.isRunning
                            ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
                    }`}
                >
                    {timer.isRunning ? (
                        <>
                            <Pause className="w-5 h-5 fill-current" /> Pause
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5 fill-current" /> Start Focus
                        </>
                    )}
                </button>

                <button
                    onClick={() => resetTimer(timer.mode)}
                    className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Reset Timer"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            {/* Currently Active Focused Task Card */}
            {activeTask ? (
                <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                                Currently Focused On
                            </span>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                                {activeTask.title}
                            </h2>
                            {activeTask.description && (
                                <p className="text-slate-400 text-sm">{activeTask.description}</p>
                            )}
                        </div>

                        <button
                            onClick={handleCompleteActiveTask}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 text-sm"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Done!
                        </button>
                    </div>

                    {/* Subtasks checklist */}
                    {(activeTask.subtasks || []).length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-800">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Micro-Steps
                            </h4>
                            <div className="space-y-2">
                                {activeTask.subtasks.map((sub) => (
                                    <label
                                        key={sub.id}
                                        className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={sub.completed}
                                            onChange={() => toggleSubtask(activeTask._id, sub.id)}
                                            className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
                                        />
                                        <span
                                            className={`text-sm ${
                                                sub.completed ? "line-through text-slate-500" : "text-slate-200"
                                            }`}
                                        >
                                            {sub.title}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center p-8 bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-400">
                    No active task selected. Pick one from the task list to start flow mode!
                </div>
            )}
        </div>
    );
}
