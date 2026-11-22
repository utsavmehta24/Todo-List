"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "@/store/useTaskStore";
import { recommendNextTask } from "@/utils/recommender";
import { Compass, X, Play, Clock, Zap, CheckCircle2 } from "lucide-react";

export default function RecommendationModal() {
    const isOpen = useTaskStore((s) => s.isRecommendModalOpen);
    const toggleRecommendModal = useTaskStore((s) => s.toggleRecommendModal);
    const tasks = useTaskStore((s) => s.tasks);
    const setSelectedTaskIdForFocus = useTaskStore((s) => s.setSelectedTaskIdForFocus);
    const setViewMode = useTaskStore((s) => s.setViewMode);

    const [energyLevel, setEnergyLevel] = useState("medium");
    const [availableMinutes, setAvailableMinutes] = useState(30);

    if (!isOpen) return null;

    const recommendation = recommendNextTask(tasks, {
        energyLevel,
        availableMinutes,
    });

    const handleStartFocus = (taskId) => {
        setSelectedTaskIdForFocus(taskId);
        setViewMode("focus");
        toggleRecommendModal(false);
    };

    const energyOptions = [
        { id: "quick_win", label: "⚡ Quick Win (<15m)", desc: "Build easy momentum" },
        { id: "low", label: "🔋 Low / Brain Fog", desc: "Routine & low resistance" },
        { id: "medium", label: "⚡ Normal Energy", desc: "Steady progress" },
        { id: "high", label: "🔥 Deep Flow", desc: "Complex creative problem solving" },
    ];

    const timeOptions = [15, 30, 45, 60, 90];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
                >
                    {/* Close button */}
                    <button
                        onClick={() => toggleRecommendModal(false)}
                        className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                            <Compass className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">What Should I Do Right Now?</h2>
                            <p className="text-xs text-slate-400">
                                Overcome decision freeze. Match your energy and time to ONE single focus item.
                            </p>
                        </div>
                    </div>

                    {/* 1. Energy selector */}
                    <div className="mb-5">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                            How is your energy right now?
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {energyOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setEnergyLevel(opt.id)}
                                    className={`p-3 rounded-xl border text-left transition-all ${
                                        energyLevel === opt.id
                                            ? "bg-indigo-600/30 border-indigo-500 text-white shadow-md"
                                            : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                                    }`}
                                >
                                    <div className="font-semibold text-xs text-white">{opt.label}</div>
                                    <div className="text-[10px] text-slate-400">{opt.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. Available time selector */}
                    <div className="mb-6">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                            Available time window
                        </label>
                        <div className="flex items-center gap-2">
                            {timeOptions.map((mins) => (
                                <button
                                    key={mins}
                                    type="button"
                                    onClick={() => setAvailableMinutes(mins)}
                                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                                        availableMinutes === mins
                                            ? "bg-emerald-600 text-white border-emerald-500 shadow-md"
                                            : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-white"
                                    }`}
                                >
                                    ~{mins}m
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Recommended Task Result */}
                    {recommendation ? (
                        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700 rounded-2xl p-5 mb-5 shadow-lg">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                                Recommended Focus
                            </span>
                            <h3 className="text-lg font-bold text-white mb-1">{recommendation.task.title}</h3>
                            <p className="text-xs text-emerald-300/90 italic mb-4">"{recommendation.reason}"</p>

                            <button
                                onClick={() => handleStartFocus(recommendation.task._id)}
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
                            >
                                <Play className="w-4 h-4 fill-current" />
                                Jump into Focus Mode
                            </button>
                        </div>
                    ) : (
                        <div className="p-6 bg-slate-800/40 rounded-2xl border border-slate-700/60 text-center text-slate-400 text-sm mb-4">
                            All pending tasks are clear for this energy bracket! Relax or take a well-deserved break.
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
