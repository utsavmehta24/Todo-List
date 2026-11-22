import React from "react";
import { useTaskStore } from "@/store/useTaskStore";
import {
  Menu,
  Search,
  Plus,
  ListFilter,
  Kanban,
  Calendar,
  Timer,
  LayoutGrid,
  TrendingUp,
  Download,
  Sparkles,
  Command,
} from "lucide-react";

export default function NavbarHeader({ onToggleSidebar, onOpenNewTask }) {
  const viewMode = useTaskStore((s) => s.viewMode);
  const setViewMode = useTaskStore((s) => s.setViewMode);
  const activeFilter = useTaskStore((s) => s.activeFilter);
  const searchQuery = useTaskStore((s) => s.searchQuery);
  const setSearchQuery = useTaskStore((s) => s.setSearchQuery);
  const toggleCommandPalette = useTaskStore((s) => s.toggleCommandPalette);
  const toggleFloatingWidget = useTaskStore((s) => s.toggleFloatingWidget);
  const isFloatingWidgetOpen = useTaskStore((s) => s.isFloatingWidgetOpen);

  const getTitle = () => {
    if (viewMode === "kanban") return "Kanban Workflow";
    if (viewMode === "calendar") return "Calendar Deadlines";
    if (viewMode === "focus") return "Deep Work Focus";
    if (viewMode === "widgets") return "Productivity Widgets Hub";
    if (viewMode === "insights") return "Productivity Insights";
    if (activeFilter === "today") return "Today's Priorities";
    if (activeFilter === "upcoming") return "Upcoming Workload";
    if (activeFilter === "completed") return "Completed Archive";
    if (activeFilter !== "all") return `Project: ${activeFilter}`;
    return "All Tasks Inbox";
  };

  const getSubtitle = () => {
    if (viewMode === "kanban") return "Move tasks seamlessly between states";
    if (viewMode === "calendar") return "Schedule and track deadlines chronologically";
    if (viewMode === "focus") return "Eliminate distractions with Pomodoro cycles";
    if (viewMode === "widgets") return "Glanceable desk widgets for flow and quick actions";
    if (viewMode === "insights") return "Analyze your execution speed and streaks";
    return "Capture with natural language · Prioritize with energy";
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800"
          title="Toggle Navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            {getTitle()}
          </h1>
          <p className="hidden sm:block text-[11px] text-slate-400">
            {getSubtitle()}
          </p>
        </div>
      </div>

      {/* Center: View Switcher Pills */}
      <div className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800/80 shadow-inner">
        <button
          onClick={() => setViewMode("list")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            viewMode === "list"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          List
        </button>
        <button
          onClick={() => setViewMode("kanban")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            viewMode === "kanban"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <Kanban className="w-3.5 h-3.5" />
          Kanban
        </button>
        <button
          onClick={() => setViewMode("calendar")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            viewMode === "calendar"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Calendar
        </button>
        <button
          onClick={() => setViewMode("focus")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            viewMode === "focus"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <Timer className="w-3.5 h-3.5" />
          Focus
        </button>
        <button
          onClick={() => setViewMode("widgets")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            viewMode === "widgets"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Widgets
        </button>
      </div>

      {/* Right: Search / Command Palette & New Task */}
      <div className="flex items-center gap-2">
        {/* Command Palette Trigger */}
        <button
          onClick={() => toggleCommandPalette(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80 text-xs font-medium transition-all shadow-sm group"
          title="Search & Quick Actions (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>

        {/* Floating Desk Widget Toggle */}
        <button
          onClick={() => toggleFloatingWidget()}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            isFloatingWidgetOpen
              ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/40 shadow-sm"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200"
          }`}
          title="Toggle Floating Sticky Desk Widget"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Desk Widget</span>
        </button>

        {/* New Task Button */}
        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
          <kbd className="hidden md:inline text-[9px] bg-indigo-700/60 px-1 py-0.2 rounded font-mono">
            N
          </kbd>
        </button>
      </div>
    </header>
  );
}
