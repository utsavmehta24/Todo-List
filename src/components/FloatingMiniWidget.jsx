import React, { useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import {
  Pin,
  X,
  Minimize2,
  Maximize2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function FloatingMiniWidget() {
  const isFloatingWidgetOpen = useTaskStore((s) => s.isFloatingWidgetOpen);
  const toggleFloatingWidget = useTaskStore((s) => s.toggleFloatingWidget);
  const timer = useTaskStore((s) => s.timer);
  const toggleTimer = useTaskStore((s) => s.toggleTimer);
  const resetTimer = useTaskStore((s) => s.resetTimer);
  const tasks = useTaskStore((s) => s.tasks);
  const selectedTaskIdForFocus = useTaskStore((s) => s.selectedTaskIdForFocus);
  const toggleTaskStatus = useTaskStore((s) => s.toggleTaskStatus);
  const addTask = useTaskStore((s) => s.addTask);
  const setViewMode = useTaskStore((s) => s.setViewMode);

  const [isMinimized, setIsMinimized] = useState(false);
  const [quickInput, setQuickInput] = useState("");

  if (!isFloatingWidgetOpen) return null;

  const currentTask = tasks.find((t) => t._id === selectedTaskIdForFocus) ||
    tasks.find((t) => t.status !== "completed") ||
    null;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (quickInput.trim()) {
      addTask({ title: quickInput.trim(), energy: "quick_win", priority: "medium" });
      setQuickInput("");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 ease-out select-none">
      {isMinimized ? (
        /* Minimized Pill */
        <div
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 bg-slate-900/95 border border-cyan-500/40 text-white px-3 py-2 rounded-full shadow-2xl cursor-pointer hover:border-cyan-400 group backdrop-blur-md"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold">
            {timer.minutes}:{timer.seconds < 10 ? "0" : ""}{timer.seconds}
          </span>
          <span className="text-[11px] text-slate-400 max-w-[120px] truncate">
            {currentTask ? currentTask.title : "TaskFlow"}
          </span>
          <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
        </div>
      ) : (
        /* Full Floating Card */
        <div className="w-80 bg-slate-900/95 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-2xl p-4 text-white space-y-3 ring-1 ring-cyan-500/20">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Pin className="w-3.5 h-3.5 rotate-45" />
              </div>
              <span className="text-xs font-bold tracking-tight text-white">
                TaskFlow Mini Desk
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Minimize to pill"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toggleFloatingWidget(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                title="Close floating widget"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Task */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 flex items-center justify-between">
              <span>Active Target</span>
              {currentTask && (
                <span className="text-indigo-400 font-mono text-[9px] uppercase">
                  {currentTask.priority}
                </span>
              )}
            </div>

            {currentTask ? (
              <div className="flex items-start gap-2">
                <button
                  onClick={() => toggleTaskStatus(currentTask._id)}
                  className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors"
                >
                  {currentTask.status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </button>
                <span
                  className={`text-xs font-medium line-clamp-2 ${
                    currentTask.status === "completed" ? "line-through text-slate-500" : "text-slate-200"
                  }`}
                >
                  {currentTask.title}
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No active task chosen.</p>
            )}
          </div>

          {/* Live Pomodoro Sprint */}
          <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800/80 rounded-2xl px-4 py-2.5">
            <div>
              <div className="text-2xl font-black font-mono tracking-tight text-white">
                {timer.minutes}:{timer.seconds < 10 ? "0" : ""}{timer.seconds}
              </div>
              <div className="text-[10px] text-slate-400">
                {timer.mode === "work" ? "Deep Work Sprint" : "Rest Break"}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleTimer}
                className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
              >
                {timer.isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>
              <button
                onClick={() => resetTimer("work")}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick NLP Task Capture */}
          <form onSubmit={handleQuickAdd} className="flex items-center gap-1.5">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="Quick capture task..."
              className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={!quickInput.trim()}
              className="p-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-40 transition-colors"
              title="Add task"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
          </form>

          {/* Footer jump */}
          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
            <span>Built by Utsav</span>
            <button
              onClick={() => {
                setViewMode("widgets");
                setIsMinimized(true);
              }}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
            >
              <span>Widget Hub</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
