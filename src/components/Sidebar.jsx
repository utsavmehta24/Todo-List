import React from "react";
import { useTaskStore } from "@/store/useTaskStore";
import {
  Inbox,
  CalendarDays,
  Calendar,
  Kanban,
  Timer,
  LayoutGrid,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Zap,
  Download,
  Sun,
  Moon,
  Pin,
  HelpCircle,
  Folder,
  Tag,
  ChevronRight,
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const viewMode = useTaskStore((s) => s.viewMode);
  const setViewMode = useTaskStore((s) => s.setViewMode);
  const activeFilter = useTaskStore((s) => s.activeFilter);
  const setActiveFilter = useTaskStore((s) => s.setActiveFilter);
  const selectedTag = useTaskStore((s) => s.selectedTag);
  const setSelectedTag = useTaskStore((s) => s.setSelectedTag);
  const tasks = useTaskStore((s) => s.tasks);
  const theme = useTaskStore((s) => s.theme);
  const toggleTheme = useTaskStore((s) => s.toggleTheme);
  const isFloatingWidgetOpen = useTaskStore((s) => s.isFloatingWidgetOpen);
  const toggleFloatingWidget = useTaskStore((s) => s.toggleFloatingWidget);
  const toggleRecommendModal = useTaskStore((s) => s.toggleRecommendModal);
  const toggleAbout = useTaskStore((s) => s.toggleAbout);
  const timer = useTaskStore((s) => s.timer);

  // Compute counts
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const inboxCount = tasks.filter((t) => t.status !== "completed").length;
  const todayCount = tasks.filter((t) => {
    if (t.status === "completed" || !t.dueDate) return false;
    const d = new Date(t.dueDate);
    return d >= startOfToday && d <= endOfToday;
  }).length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  const projects = Array.from(new Set(tasks.map((t) => t.project || "General")));
  const tags = Array.from(new Set(tasks.flatMap((t) => t.tags || [])));

  const navItems = [
    {
      id: "list-all",
      label: "Inbox",
      icon: Inbox,
      count: inboxCount,
      active: viewMode === "list" && activeFilter === "all" && !selectedTag,
      onClick: () => {
        setViewMode("list");
        setActiveFilter("all");
      },
    },
    {
      id: "list-today",
      label: "Today",
      icon: CalendarDays,
      count: todayCount,
      color: "text-amber-400",
      active: viewMode === "list" && activeFilter === "today",
      onClick: () => {
        setViewMode("list");
        setActiveFilter("today");
      },
    },
    {
      id: "list-upcoming",
      label: "Upcoming",
      icon: Calendar,
      active: viewMode === "list" && activeFilter === "upcoming",
      onClick: () => {
        setViewMode("list");
        setActiveFilter("upcoming");
      },
    },
    {
      id: "kanban",
      label: "Kanban Board",
      icon: Kanban,
      active: viewMode === "kanban",
      onClick: () => setViewMode("kanban"),
    },
    {
      id: "calendar",
      label: "Calendar Matrix",
      icon: Calendar,
      active: viewMode === "calendar",
      onClick: () => setViewMode("calendar"),
    },
    {
      id: "focus",
      label: "Focus Mode",
      icon: Timer,
      badge: timer.isRunning ? `${timer.minutes}:${timer.seconds < 10 ? "0" : ""}${timer.seconds}` : null,
      badgeColor: "bg-emerald-500/20 text-emerald-400 animate-pulse border border-emerald-500/30",
      active: viewMode === "focus",
      onClick: () => setViewMode("focus"),
    },
    {
      id: "widgets",
      label: "Widgets Hub",
      icon: LayoutGrid,
      isNew: true,
      active: viewMode === "widgets",
      onClick: () => setViewMode("widgets"),
    },
    {
      id: "insights",
      label: "Insights & Velocity",
      icon: TrendingUp,
      active: viewMode === "insights",
      onClick: () => setViewMode("insights"),
    },
    {
      id: "completed",
      label: "Completed",
      icon: CheckCircle2,
      count: completedCount,
      active: viewMode === "list" && activeFilter === "completed",
      onClick: () => {
        setViewMode("list");
        setActiveFilter("completed");
      },
    },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950/95 dark:bg-slate-950/95 bg-white border-r border-slate-800/80 dark:border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div
          onClick={() => toggleAbout(true)}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="About TaskFlow & Utsav"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white dark:text-white group-hover:text-indigo-400 transition-colors">
                TaskFlow
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[11px] font-medium text-indigo-400 dark:text-indigo-400">
              Built by Utsav
            </p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          title="Toggle Light / Dark Mode"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
        </button>
      </div>

      {/* "What Should I Do Right Now?" Recommender Launcher */}
      <div className="px-3 pt-3">
        <button
          onClick={() => toggleRecommendModal(true)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600/20 via-violet-600/20 to-cyan-500/10 border border-indigo-500/30 hover:border-indigo-400/60 text-indigo-300 hover:text-white transition-all text-xs font-semibold group shadow-sm"
        >
          <span className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            What Should I Do Now?
          </span>
          <span className="text-[10px] bg-indigo-500/30 px-1.5 py-0.5 rounded text-indigo-200">
            Flow
          </span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 py-1">
          Views
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                item.onClick();
                if (window.innerWidth < 768) setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                item.active
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${item.active ? "text-white" : item.color || "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.isNew && (
                  <span className="text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.2 rounded-md">
                    WIDGETS
                  </span>
                )}
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                      item.active ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {/* Projects Accordion */}
        {projects.length > 0 && (
          <div className="pt-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 py-1">
              Projects
            </div>
            {projects.map((proj) => {
              const count = tasks.filter((t) => (t.project || "General") === proj && t.status !== "completed").length;
              const isSelected = activeFilter === proj;
              return (
                <button
                  key={proj}
                  onClick={() => {
                    setViewMode("list");
                    setActiveFilter(proj);
                    if (window.innerWidth < 768) setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    isSelected
                      ? "bg-slate-800 text-indigo-400 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <Folder className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{proj}</span>
                  </span>
                  {count > 0 && (
                    <span className="text-[10px] text-slate-500 font-mono">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Tags Section */}
        {tags.length > 0 && (
          <div className="pt-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 py-1">
              Tags
            </div>
            <div className="flex flex-wrap gap-1 px-2 pt-1">
              {tags.map((tg) => {
                const isSelected = selectedTag === tg;
                return (
                  <button
                    key={tg}
                    onClick={() => {
                      setViewMode("list");
                      setSelectedTag(isSelected ? null : tg);
                      if (window.innerWidth < 768) setIsOpen(false);
                    }}
                    className={`text-[11px] px-2 py-0.5 rounded-lg border transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-500"
                        : "bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    #{tg}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-slate-800/80 space-y-2 bg-slate-950/60">
        {/* Floating Desk Widget Toggle */}
        <button
          onClick={() => toggleFloatingWidget()}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
            isFloatingWidgetOpen
              ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/40 shadow-sm"
              : "bg-slate-900/40 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
          }`}
          title="Toggle floating picture-in-picture mini desk companion"
        >
          <span className="flex items-center gap-2">
            <Pin className={`w-3.5 h-3.5 ${isFloatingWidgetOpen ? "text-cyan-400 rotate-45" : "text-slate-500"}`} />
            Floating Desk Widget
          </span>
          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${isFloatingWidgetOpen ? "bg-cyan-500/30 text-cyan-200" : "bg-slate-800 text-slate-500"}`}>
            {isFloatingWidgetOpen ? "ON" : "OFF"}
          </span>
        </button>

        {/* Android APK Download Action */}
        <a
          href="/app-debug.apk"
          download="TaskFlow-by-Utsav.apk"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all shadow-sm"
        >
          <span className="flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Android APK
          </span>
          <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-1.5 py-0.2 rounded font-mono">
            11.3 MB
          </span>
        </a>

        {/* Author Bio Link */}
        <div
          onClick={() => toggleAbout(true)}
          className="pt-1 flex items-center justify-between px-2 text-[11px] text-slate-500 hover:text-indigo-400 cursor-pointer transition-colors"
        >
          <span>Crafted by Utsav</span>
          <span className="text-[10px] font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
            v2.0
          </span>
        </div>
      </div>
    </aside>
  );
}
