import React, { useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import confetti from "canvas-confetti";
import { parseTaskInput } from "@/utils/nlpParser";
import {
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  Tag,
  AlertCircle,
  Timer,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Plus,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function LinearTaskList() {
  const tasks = useTaskStore((s) => s.tasks);
  const activeFilter = useTaskStore((s) => s.activeFilter);
  const selectedTag = useTaskStore((s) => s.selectedTag);
  const searchQuery = useTaskStore((s) => s.searchQuery);
  const toggleTaskStatus = useTaskStore((s) => s.toggleTaskStatus);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const addTask = useTaskStore((s) => s.addTask);
  const setSelectedTaskForDrawer = useTaskStore((s) => s.setSelectedTaskForDrawer);
  const setSelectedTaskIdForFocus = useTaskStore((s) => s.setSelectedTaskIdForFocus);
  const setViewMode = useTaskStore((s) => s.setViewMode);

  // NLP inline input state
  const [nlpInput, setNlpInput] = useState("");
  const [energyFilter, setEnergyFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const parsedNlp = parseTaskInput(nlpInput);

  const handleAddNlp = (e) => {
    e.preventDefault();
    if (!parsedNlp.cleanTitle.trim()) return;

    addTask({
      title: parsedNlp.cleanTitle,
      dueDate: parsedNlp.dueDate ? (typeof parsedNlp.dueDate === "string" ? parsedNlp.dueDate : parsedNlp.dueDate.toISOString()) : null,
      priority: parsedNlp.priority || "medium",
      energy: parsedNlp.energy || "medium",
      estimatedMinutes: parsedNlp.estimatedMinutes || 30,
      tags: parsedNlp.tags || [],
      project: activeFilter !== "all" && activeFilter !== "today" && activeFilter !== "upcoming" && activeFilter !== "completed" ? activeFilter : "General",
    });

    setNlpInput("");
  };

  const handleToggle = (id) => {
    const task = tasks.find((t) => t._id === id);
    if (task && task.status !== "completed") {
      // Confetti burst on complete
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#6366f1", "#a855f7", "#10b981", "#06b6d4"],
        });
      } catch (e) {}
    }
    toggleTaskStatus(id);
  };

  // Filter tasks
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const filteredTasks = tasks.filter((task) => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = (task.description || "").toLowerCase().includes(q);
      const matchTag = (task.tags || []).some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }

    // Tag
    if (selectedTag && !(task.tags || []).includes(selectedTag)) {
      return false;
    }

    // Energy
    if (energyFilter !== "all" && task.energy !== energyFilter) {
      return false;
    }

    // Priority
    if (priorityFilter !== "all" && task.priority !== priorityFilter) {
      return false;
    }

    // Navigation filter
    if (activeFilter === "today") {
      if (!task.dueDate) return false;
      const d = new Date(task.dueDate);
      return d >= startOfToday && d <= endOfToday;
    }
    if (activeFilter === "upcoming") {
      if (!task.dueDate) return false;
      const d = new Date(task.dueDate);
      return d > endOfToday && task.status !== "completed";
    }
    if (activeFilter === "completed") {
      return task.status === "completed";
    }
    if (activeFilter !== "all") {
      return (task.project || "General") === activeFilter;
    }

    return true;
  });

  // Group into Overdue, Today, Upcoming, and Completed
  const overdueTasks = filteredTasks.filter((t) => {
    if (t.status === "completed" || !t.dueDate) return false;
    return new Date(t.dueDate) < startOfToday;
  });

  const todayTasks = filteredTasks.filter((t) => {
    if (t.status === "completed" || !t.dueDate) return false;
    const d = new Date(t.dueDate);
    return d >= startOfToday && d <= endOfToday;
  });

  const upcomingAndBacklog = filteredTasks.filter((t) => {
    if (t.status === "completed") return false;
    if (!t.dueDate) return true;
    return new Date(t.dueDate) > endOfToday;
  });

  const completedTasks = filteredTasks.filter((t) => t.status === "completed");

  const renderTaskRow = (task) => {
    const isCompleted = task.status === "completed";
    const subtasks = task.subtasks || [];
    const completedSubs = subtasks.filter((s) => s.completed).length;

    // Priority stripe color
    const priorityColor =
      task.priority === "urgent"
        ? "border-l-red-500"
        : task.priority === "high"
        ? "border-l-amber-500"
        : task.priority === "medium"
        ? "border-l-indigo-500"
        : "border-l-slate-700";

    return (
      <div
        key={task._id}
        className={`group flex items-center justify-between gap-3 p-3 sm:px-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 border-l-4 ${priorityColor} transition-all shadow-sm`}
      >
        {/* Left: Checkbox & Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={() => handleToggle(task._id)}
            className="text-slate-500 hover:text-indigo-400 transition-colors shrink-0 p-0.5"
            title={isCompleted ? "Mark incomplete" : "Mark done"}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300" />
            )}
          </button>

          <div
            onClick={() => setSelectedTaskForDrawer(task._id)}
            className="min-w-0 flex-1 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-xs sm:text-sm font-semibold truncate ${
                  isCompleted ? "line-through text-slate-500" : "text-white group-hover:text-indigo-300"
                } transition-colors`}
              >
                {task.title}
              </span>

              {/* Subtask pill */}
              {subtasks.length > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800 text-slate-400 font-mono">
                  <Layers className="w-2.5 h-2.5" />
                  {completedSubs}/{subtasks.length}
                </span>
              )}
            </div>

            {/* Sub-meta row */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-slate-500">
              {task.dueDate && (
                <span className="flex items-center gap-1 text-slate-400 font-mono">
                  <Calendar className="w-3 h-3 text-indigo-400" />
                  {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              )}

              {task.estimatedMinutes && (
                <span className="flex items-center gap-1 text-slate-400 font-mono">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {task.estimatedMinutes}m
                </span>
              )}

              {task.energy === "quick_win" && (
                <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-semibold">
                  ⚡ Quick Win
                </span>
              )}

              {task.energy === "high" && (
                <span className="text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded font-semibold">
                  🔴 Deep Work
                </span>
              )}

              {task.project && task.project !== "General" && (
                <span className="text-slate-400 bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800">
                  {task.project}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              setSelectedTaskIdForFocus(task._id);
              setViewMode("focus");
            }}
            className="p-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white transition-all text-xs"
            title="Start Pomodoro Focus on this task"
          >
            <Timer className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setSelectedTaskForDrawer(task._id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs"
            title="Inspect task"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
      {/* ⚡ Inline Fast NLP Task Capture Bar (Linear Style) */}
      <form
        onSubmit={handleAddNlp}
        className="bg-slate-900/90 border border-slate-800 focus-within:border-indigo-500/80 rounded-2xl p-3 shadow-xl transition-all relative ring-1 ring-white/5"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 ml-1" />
          <input
            type="text"
            value={nlpInput}
            onChange={(e) => setNlpInput(e.target.value)}
            placeholder="Type task with natural language (e.g. Finish report tomorrow 5pm #study !urgent ~45m @high)..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none font-medium"
          />
          <button
            type="submit"
            disabled={!nlpInput.trim()}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs disabled:opacity-40 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Live Token Parsing Preview */}
        {nlpInput.trim().length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 mt-2 border-t border-slate-800/80 text-[11px]">
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              Detected:
            </span>
            {parsedNlp.dueDate && (
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md font-mono">
                📅 {new Date(parsedNlp.dueDate).toLocaleDateString()}
              </span>
            )}
            {parsedNlp.priority && (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md font-mono uppercase">
                !{parsedNlp.priority}
              </span>
            )}
            {parsedNlp.energy && (
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-md font-mono">
                ⚡ {parsedNlp.energy}
              </span>
            )}
            {parsedNlp.estimatedMinutes && (
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-md font-mono">
                ~{parsedNlp.estimatedMinutes}m
              </span>
            )}
            {(parsedNlp.tags || []).map((t, idx) => (
              <span
                key={idx}
                className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-md font-mono"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </form>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Energy Filter */}
          <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setEnergyFilter("all")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                energyFilter === "all" ? "bg-slate-800 text-white font-semibold" : "text-slate-400 hover:text-white"
              }`}
            >
              All Energy
            </button>
            <button
              onClick={() => setEnergyFilter("quick_win")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                energyFilter === "quick_win"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ⚡ Quick Wins
            </button>
            <button
              onClick={() => setEnergyFilter("high")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                energyFilter === "high"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🔴 Deep Work
            </button>
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-900/60 border border-slate-800/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">🔴 Urgent</option>
            <option value="high">🟠 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Task Sections */}
      <div className="space-y-6">
        {/* Overdue Section */}
        {overdueTasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Overdue ({overdueTasks.length})</span>
            </div>
            <div className="space-y-2">{overdueTasks.map(renderTaskRow)}</div>
          </div>
        )}

        {/* Due Today Section */}
        {todayTasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Due Today ({todayTasks.length})</span>
            </div>
            <div className="space-y-2">{todayTasks.map(renderTaskRow)}</div>
          </div>
        )}

        {/* Upcoming & Backlog Section */}
        {upcomingAndBacklog.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Upcoming & Backlog ({upcomingAndBacklog.length})</span>
            </div>
            <div className="space-y-2">{upcomingAndBacklog.map(renderTaskRow)}</div>
          </div>
        )}

        {/* Completed Section */}
        {completedTasks.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed Archive ({completedTasks.length})</span>
            </div>
            <div className="space-y-2">{completedTasks.map(renderTaskRow)}</div>
          </div>
        )}

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-16 bg-slate-900/30 border border-slate-800/80 rounded-3xl p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">Inbox Zero Achieved</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You are completely caught up! Type in the box above to capture a new task, or relax and recharge.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
