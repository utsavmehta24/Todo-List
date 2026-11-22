import React, { useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import {
  Timer,
  Zap,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  FileText,
  Play,
  Pause,
  RotateCcw,
  Plus,
  ArrowRight,
  Pin,
  Quote,
  Target,
  BatteryCharging,
} from "lucide-react";

export default function WidgetsHub() {
  const tasks = useTaskStore((s) => s.tasks);
  const timer = useTaskStore((s) => s.timer);
  const toggleTimer = useTaskStore((s) => s.toggleTimer);
  const resetTimer = useTaskStore((s) => s.resetTimer);
  const setViewMode = useTaskStore((s) => s.setViewMode);
  const setSelectedTaskIdForFocus = useTaskStore((s) => s.setSelectedTaskIdForFocus);
  const toggleTaskStatus = useTaskStore((s) => s.toggleTaskStatus);
  const addTask = useTaskStore((s) => s.addTask);
  const scratchpadNote = useTaskStore((s) => s.scratchpadNote);
  const setScratchpadNote = useTaskStore((s) => s.setScratchpadNote);
  const isFloatingWidgetOpen = useTaskStore((s) => s.isFloatingWidgetOpen);
  const toggleFloatingWidget = useTaskStore((s) => s.toggleFloatingWidget);
  const toggleRecommendModal = useTaskStore((s) => s.toggleRecommendModal);

  const [scratchText, setScratchText] = useState(scratchpadNote);
  const [quickTaskInput, setQuickTaskInput] = useState("");

  // Statistics & Calculations
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const todayTasks = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    return d >= startOfToday && d <= endOfToday;
  });

  const completedToday = tasks.filter((t) => {
    if (t.status !== "completed" || !t.completedAt) return false;
    const d = new Date(t.completedAt);
    return d >= startOfToday && d <= endOfToday;
  }).length;

  const totalTasks = tasks.length;
  const totalCompleted = tasks.filter((t) => t.status === "completed").length;
  const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  const quickWins = tasks.filter((t) => t.energy === "quick_win" && t.status !== "completed").length;
  const deepWork = tasks.filter((t) => t.energy === "high" && t.status !== "completed").length;

  // Best recommended task
  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const recommendedTask = pendingTasks.find((t) => t.priority === "urgent") ||
    pendingTasks.find((t) => t.energy === "quick_win") ||
    pendingTasks[0];

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (quickTaskInput.trim()) {
      addTask({ title: quickTaskInput.trim(), energy: "quick_win", priority: "medium" });
      setQuickTaskInput("");
    }
  };

  const handleSaveScratchpad = (e) => {
    setScratchText(e.target.value);
    setScratchpadNote(e.target.value);
  };

  const quotes = [
    { text: "Simplicity is prerequisite for reliability.", author: "Edsger Dijkstra" },
    { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
    { text: "Focus is a muscle. You build it by choosing one thing and letting go of the rest.", author: "Deep Work Principle" },
    { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner: Floating Widget Callout */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-cyan-950/60 border border-indigo-500/30 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
            <Pin className="w-5 h-5 text-white rotate-45" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              Desk Companion Widget
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
                LIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Pin an always-on floating widget in the corner of your screen. Keep your active timer and next tasks visible while coding or studying.
            </p>
          </div>
        </div>

        <button
          onClick={() => toggleFloatingWidget()}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 whitespace-nowrap self-start sm:self-auto ${
            isFloatingWidgetOpen
              ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"
          }`}
        >
          <Pin className={`w-3.5 h-3.5 ${isFloatingWidgetOpen ? "rotate-45" : ""}`} />
          <span>{isFloatingWidgetOpen ? "Hide Floating Widget" : "Show Floating Widget"}</span>
        </button>
      </div>

      {/* Grid of Modular Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* WIDGET 1: ⏱️ Pomodoro Focus Timer Widget */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Timer className="w-4 h-4 text-emerald-400" />
              Focus Timer Widget
            </span>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              {timer.mode === "work" ? "25m Sprint" : "5m Break"}
            </span>
          </div>

          <div className="text-center py-4">
            <div className="text-5xl font-black font-mono tracking-tight text-white">
              {timer.minutes}:{timer.seconds < 10 ? "0" : ""}{timer.seconds}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Sessions Completed Today: <strong className="text-emerald-400 font-mono">{timer.totalCompletedSessions}</strong>
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={toggleTimer}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
            >
              {timer.isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{timer.isRunning ? "Pause" : "Start Sprint"}</span>
            </button>
            <button
              onClick={() => resetTimer("work")}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              title="Reset timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("focus")}
              className="px-3 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Full Screen
            </button>
          </div>
        </div>

        {/* WIDGET 2: 🎯 Next Best Action Recommender Widget */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 flex flex-col justify-between shadow-lg relative group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Zap className="w-4 h-4 text-amber-400" />
              Next Recommended Action
            </span>
            <button
              onClick={() => toggleRecommendModal(true)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Recalculate
            </button>
          </div>

          {recommendedTask ? (
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 my-2">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {recommendedTask.priority}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {recommendedTask.energy === "quick_win" ? "⚡ Quick Win" : "🔴 Deep Work"}
                </span>
              </div>
              <h3 className="font-bold text-sm text-white line-clamp-2">
                {recommendedTask.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                {recommendedTask.description || "High priority item scheduled for flow."}
              </p>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              All caught up! No pending tasks right now.
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            {recommendedTask && (
              <button
                onClick={() => {
                  setSelectedTaskIdForFocus(recommendedTask._id);
                  setViewMode("focus");
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-3 rounded-2xl text-xs transition-all shadow-md shadow-indigo-600/30"
              >
                <Play className="w-3.5 h-3.5" />
                Focus on This Now
              </button>
            )}
            <button
              onClick={() => toggleRecommendModal(true)}
              className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-semibold"
            >
              Filters
            </button>
          </div>
        </div>

        {/* WIDGET 3: 📊 Daily Velocity & Streak Meter Widget */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 flex flex-col justify-between shadow-lg group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Flame className="w-4 h-4 text-orange-400" />
              Daily Velocity Meter
            </span>
            <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded-full">
              Day 4 Streak 🔥
            </span>
          </div>

          <div className="space-y-3 py-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 font-medium">Overall Completion</span>
                <span className="text-white font-bold font-mono">{completionRate}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 text-center">
                <div className="text-xl font-bold font-mono text-white">{completedToday}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Done Today</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 text-center">
                <div className="text-xl font-bold font-mono text-indigo-400">{pendingTasks.length}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Remaining</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setViewMode("insights")}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors mt-2"
          >
            <span>View Full Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* WIDGET 4: 📅 Today's Agenda Timeline Widget */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 flex flex-col justify-between shadow-lg group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Today's Agenda
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">
              {todayTasks.length} Scheduled
            </span>
          </div>

          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {todayTasks.length > 0 ? (
              todayTasks.map((t) => (
                <div
                  key={t._id}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-all"
                >
                  <button
                    onClick={() => toggleTaskStatus(t._id)}
                    className="flex items-center gap-2 text-left min-w-0 flex-1"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        t.status === "completed" ? "text-emerald-400" : "text-slate-600 hover:text-indigo-400"
                      }`}
                    />
                    <span
                      className={`text-xs truncate font-medium ${
                        t.status === "completed" ? "line-through text-slate-500" : "text-slate-200"
                      }`}
                    >
                      {t.title}
                    </span>
                  </button>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {t.estimatedMinutes || 25}m
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                No deadlines due today. Great day for deep work!
              </div>
            )}
          </div>

          <form onSubmit={handleQuickAdd} className="flex items-center gap-2 pt-3">
            <input
              type="text"
              value={quickTaskInput}
              onChange={(e) => setQuickTaskInput(e.target.value)}
              placeholder="+ Quick capture (Enter)..."
              className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!quickTaskInput.trim()}
              className="p-1.5 rounded-xl bg-indigo-600 text-white disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* WIDGET 5: 📝 Sticky Brain-Dump Scratchpad Widget */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-5 flex flex-col justify-between shadow-lg group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <FileText className="w-4 h-4 text-purple-400" />
              Quick Scratchpad Widget
            </span>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-full">
              Autosaved
            </span>
          </div>

          <textarea
            rows={5}
            value={scratchText}
            onChange={handleSaveScratchpad}
            className="w-full bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-colors leading-relaxed resize-none"
            placeholder="Dump ideas, links, code snippets, or draft to-dos..."
          />

          <div className="flex items-center justify-between pt-2 text-[10px] text-slate-500">
            <span>Synced to local state</span>
            <button
              onClick={() => {
                setScratchText("");
                setScratchpadNote("");
              }}
              className="hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* WIDGET 6: 💡 Mindset & Daily Quotes Widget */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 rounded-3xl p-5 flex flex-col justify-between shadow-lg group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Quote className="w-4 h-4 text-indigo-400" />
              Mindset & Focus Quote
            </span>
            <button
              onClick={() => setQuoteIndex((prev) => (prev + 1) % quotes.length)}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Next Quote
            </button>
          </div>

          <div className="py-4 my-auto">
            <blockquote className="text-sm font-semibold text-white italic leading-relaxed">
              "{quotes[quoteIndex].text}"
            </blockquote>
            <p className="text-xs text-indigo-400 mt-2 font-medium">
              — {quotes[quoteIndex].author}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Curated for TaskFlow by Utsav</span>
            <span className="font-mono text-[10px] text-slate-400">
              {quoteIndex + 1}/{quotes.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
