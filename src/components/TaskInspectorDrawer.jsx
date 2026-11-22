import React, { useState, useEffect } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import {
  X,
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  Tag,
  Calendar,
  Folder,
  Trash2,
  Sparkles,
  Timer,
  Plus,
  AlertCircle,
  Check,
} from "lucide-react";

export default function TaskInspectorDrawer() {
  const selectedTaskId = useTaskStore((s) => s.selectedTaskForDrawer);
  const setSelectedTaskForDrawer = useTaskStore((s) => s.setSelectedTaskForDrawer);
  const tasks = useTaskStore((s) => s.tasks);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const toggleTaskStatus = useTaskStore((s) => s.toggleTaskStatus);
  const addSubtask = useTaskStore((s) => s.addSubtask);
  const toggleSubtask = useTaskStore((s) => s.toggleSubtask);
  const deleteSubtask = useTaskStore((s) => s.deleteSubtask);
  const aiDeconstructTask = useTaskStore((s) => s.aiDeconstructTask);
  const setSelectedTaskIdForFocus = useTaskStore((s) => s.setSelectedTaskIdForFocus);
  const setViewMode = useTaskStore((s) => s.setViewMode);

  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isDeconstructing, setIsDeconstructing] = useState(false);

  const task = tasks.find((t) => t._id === selectedTaskId);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedTaskForDrawer(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedTaskForDrawer]);

  if (!task) return null;

  const handleAddSub = (e) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      addSubtask(task._id, newSubtaskTitle.trim());
      setNewSubtaskTitle("");
    }
  };

  const handleAiDeconstruct = async () => {
    setIsDeconstructing(true);
    try {
      await aiDeconstructTask(task._id);
    } finally {
      setIsDeconstructing(false);
    }
  };

  const handleLaunchFocus = () => {
    setSelectedTaskIdForFocus(task._id);
    setViewMode("focus");
    setSelectedTaskForDrawer(null);
  };

  const isCompleted = task.status === "completed";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {/* Backdrop */}
      <div
        onClick={() => setSelectedTaskForDrawer(null)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm pointer-events-auto transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 w-full max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleTaskStatus(task._id)}
              className={`p-1.5 rounded-lg border transition-all ${
                isCompleted
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
              }`}
              title={isCompleted ? "Mark Pending" : "Mark Complete"}
            >
              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            </button>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Task Details
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLaunchFocus}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all"
              title="Launch Pomodoro Focus session on this task"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Focus</span>
            </button>

            <button
              onClick={() => {
                deleteTask(task._id);
                setSelectedTaskForDrawer(null);
              }}
              className="p-1.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSelectedTaskForDrawer(null)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Title input */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Title
            </label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => updateTask(task._id, { title: e.target.value })}
              className={`w-full text-base sm:text-lg font-bold bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 text-white focus:outline-none transition-colors py-1 ${
                isCompleted ? "line-through text-slate-500" : ""
              }`}
              placeholder="Task Title..."
            />
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/80">
            {/* Status */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                Status
              </label>
              <select
                value={task.status}
                onChange={(e) => updateTask(task._id, { status: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                Priority
              </label>
              <select
                value={task.priority}
                onChange={(e) => updateTask(task._id, { priority: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

            {/* Energy */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                Energy Level
              </label>
              <select
                value={task.energy || "medium"}
                onChange={(e) => updateTask(task._id, { energy: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="quick_win">⚡ Quick Win (Low effort)</option>
                <option value="low">🟢 Low Focus</option>
                <option value="medium">🟡 Medium Focus</option>
                <option value="high">🔴 Deep Work Focus</option>
              </select>
            </div>

            {/* Est Minutes */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                Est Duration
              </label>
              <select
                value={task.estimatedMinutes || 30}
                onChange={(e) => updateTask(task._id, { estimatedMinutes: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="5">5 minutes</option>
                <option value="15">15 minutes</option>
                <option value="25">25 minutes (1 Pomodoro)</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={task.dueDate ? task.dueDate.split("T")[0] : ""}
                onChange={(e) =>
                  updateTask(task._id, {
                    dueDate: e.target.value ? new Date(e.target.value).toISOString() : null,
                  })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            {/* Project */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                Project
              </label>
              <input
                type="text"
                value={task.project || "General"}
                onChange={(e) => updateTask(task._id, { project: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                placeholder="Project..."
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Description / Notes
            </label>
            <textarea
              rows={3}
              value={task.description || ""}
              onChange={(e) => updateTask(task._id, { description: e.target.value })}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
              placeholder="Add extra context, links, or instructions..."
            />
          </div>

          {/* Subtasks Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Subtasks ({task.subtasks?.filter((s) => s.completed).length || 0}/
                {task.subtasks?.length || 0})
              </label>

              {/* AI Breakdown Button */}
              <button
                type="button"
                onClick={handleAiDeconstruct}
                disabled={isDeconstructing}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-[11px] font-semibold transition-all disabled:opacity-50"
                title="AI: Break this task into 3-5 bite-sized actionable subtasks"
              >
                <Sparkles className={`w-3 h-3 ${isDeconstructing ? "animate-spin text-amber-400" : ""}`} />
                <span>{isDeconstructing ? "Deconstructing..." : "AI Breakdown"}</span>
              </button>
            </div>

            {/* Subtasks List */}
            <div className="space-y-1.5">
              {(task.subtasks || []).map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/40 border border-slate-800/80 group hover:border-slate-700 transition-all"
                >
                  <button
                    onClick={() => toggleSubtask(task._id, sub.id)}
                    className="flex items-center gap-2.5 flex-1 text-left min-w-0"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                        sub.completed
                          ? "bg-indigo-600 border-indigo-500 text-white"
                          : "border-slate-700 hover:border-indigo-400"
                      }`}
                    >
                      {sub.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-xs truncate ${
                        sub.completed ? "line-through text-slate-500" : "text-slate-300"
                      }`}
                    >
                      {sub.title}
                    </span>
                  </button>

                  <button
                    onClick={() => deleteSubtask(task._id, sub.id)}
                    className="text-slate-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete subtask"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Subtask Input */}
            <form onSubmit={handleAddSub} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="+ Add a subtask (press Enter)..."
                className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-medium"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold disabled:opacity-40 transition-colors"
              >
                Add
              </button>
            </form>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(task.tags || []).map((tg, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-slate-800 text-indigo-300 px-2 py-0.5 rounded-lg border border-slate-700 font-mono"
                >
                  #{tg}
                </span>
              ))}
              {(!task.tags || task.tags.length === 0) && (
                <span className="text-xs text-slate-600 italic">No tags assigned (use #tag in title)</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
