"use client";
import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@/store/useTaskStore";
import UserContext from "@/context/userContext";
import RecommendationModal from "@/components/RecommendationModal";
import AboutModal from "@/components/AboutModal";
import CommandPalette from "@/components/CommandPalette";
import { FaGithub } from "react-icons/fa";
import {
    Sparkles,
    CheckCircle2,
    Flame,
    Zap,
    Play,
    Plus,
    Compass,
    ArrowRight,
    TrendingUp,
    Quote,
} from "lucide-react";

export default function Dashboard() {
    const router = useRouter();
    const context = useContext(UserContext);
    const tasks = useTaskStore((s) => s.tasks);
    const toggleRecommendModal = useTaskStore((s) => s.toggleRecommendModal);
    const setViewMode = useTaskStore((s) => s.setViewMode);
    const toggleAbout = useTaskStore((s) => s.toggleAbout);
    const timer = useTaskStore((s) => s.timer);

    const [quote, setQuote] = useState({ text: "", author: "" });

    // Fetch quote
    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const res = await fetch("/quotes.json");
                if (res.ok) {
                    const quotes = await res.json();
                    if (quotes?.length > 0) {
                        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
                    }
                }
            } catch (error) {
                setQuote({
                    text: "Action precedes motivation. Pick one single small step and flow will follow.",
                    author: "Utsav Mehta",
                });
            }
        };

        fetchQuotes();
    }, []);

    // Metric computations
    const pendingTasks = tasks.filter((t) => t.status !== "completed");
    const completedTasks = tasks.filter((t) => t.status === "completed");
    const streak = completedTasks.length > 0 ? 5 : 3;

    const userName = context?.user?.name || "Creator";

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <CommandPalette />
            <RecommendationModal />
            <AboutModal />

            <div className="max-w-5xl mx-auto space-y-8">
                {/* Greeting Hero */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-xl">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
                                <Sparkles className="w-3.5 h-3.5" />
                                Built by Utsav · Executive Hub
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                Welcome back, {userName}
                            </h1>
                            <p className="text-sm md:text-base text-slate-400 mt-1 max-w-xl">
                                You have{" "}
                                <strong className="text-indigo-400 font-bold">
                                    {pendingTasks.length} pending
                                </strong>{" "}
                                tasks today. What would you like to accomplish in this block?
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => toggleRecommendModal(true)}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-2xl shadow-xl shadow-emerald-600/20 active:scale-95 transition-all text-sm"
                            >
                                <Compass className="w-4 h-4" />
                                What Now?
                            </button>

                            <Link
                                href="/showtask"
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-3 rounded-2xl shadow-xl shadow-indigo-600/30 active:scale-95 transition-all text-sm"
                            >
                                Open Workspace
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Live Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Momentum
                            </span>
                            <Flame className="w-5 h-5 text-orange-400 fill-current" />
                        </div>
                        <div className="text-3xl font-black text-white">{streak} Days</div>
                        <span className="text-xs text-orange-400 font-medium">Daily Streak</span>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Tasks Pending
                            </span>
                            <Zap className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="text-3xl font-black text-white">{pendingTasks.length}</div>
                        <span className="text-xs text-indigo-400 font-medium">In Queue</span>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Completed
                            </span>
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="text-3xl font-black text-white">{completedTasks.length}</div>
                        <span className="text-xs text-emerald-400 font-medium">Archived</span>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Deep Focus
                            </span>
                            <Play className="w-5 h-5 text-purple-400 fill-current" />
                        </div>
                        <div className="text-3xl font-black text-white">{timer.totalCompletedSessions}</div>
                        <span className="text-xs text-purple-400 font-medium">Pomodoro Blocks</span>
                    </div>
                </div>

                {/* Action Center Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Quick Add Card */}
                    <Link
                        href="/addtask"
                        className="group bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 transition-all duration-200 shadow-xl flex flex-col justify-between"
                    >
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">New Task</h3>
                            <p className="text-xs text-slate-400">
                                Add rich tasks with tags, subtasks, priorities, and AI decomposition.
                            </p>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-400">
                            Create now <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                    </Link>

                    {/* Deep Focus Timer */}
                    <button
                        onClick={() => {
                            setViewMode("focus");
                            router.push("/showtask");
                        }}
                        className="group text-left bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 transition-all duration-200 shadow-xl flex flex-col justify-between"
                    >
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Play className="w-6 h-6 fill-current" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">Flow Mode Timer</h3>
                            <p className="text-xs text-slate-400">
                                Enter a zero-distraction 25-minute Pomodoro block tied to your active task.
                            </p>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-purple-400">
                            Enter flow <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                    </button>

                    {/* Motivational Thought */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                                <Quote className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">Focus Insight</h3>
                            <p className="text-xs text-slate-300 italic mb-2">
                                "{quote.text || "One small step completed beats ten plans unstarted."}"
                            </p>
                            <span className="text-[11px] font-semibold text-amber-400">
                                — {quote.author?.split(",")[0] || "Utsav Mehta"}
                            </span>
                        </div>
                        <div className="mt-4 text-[11px] text-slate-500">
                            Curated daily wisdom
                        </div>
                    </div>
                </div>

                {/* Creator Attribution Section */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm">
                            UM
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">Created by Utsav Mehta</h4>
                            <p className="text-xs text-slate-400">
                                Full-Stack Engineer & Product Designer · Open for collaborations
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => toggleAbout(true)}
                            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                        >
                            About Product
                        </button>
                        <a
                            href="https://github.com/utsavmehta24"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                        >
                            <FaGithub className="w-3.5 h-3.5" />
                            Follow on GitHub
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
