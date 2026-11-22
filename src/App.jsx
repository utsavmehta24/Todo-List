import React, { useState, useEffect } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import Sidebar from "@/components/Sidebar";
import NavbarHeader from "@/components/NavbarHeader";
import LinearTaskList from "@/components/LinearTaskList";
import KanbanView from "@/components/KanbanView";
import CalendarView from "@/components/CalendarView";
import FocusMode from "@/components/FocusMode";
import WidgetsHub from "@/components/WidgetsHub";
import ProductivityInsights from "@/components/ProductivityInsights";
import TaskInspectorDrawer from "@/components/TaskInspectorDrawer";
import FloatingMiniWidget from "@/components/FloatingMiniWidget";
import CommandPalette from "@/components/CommandPalette";
import RecommendationModal from "@/components/RecommendationModal";
import AboutModal from "@/components/AboutModal";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const viewMode = useTaskStore((s) => s.viewMode);
  const setViewMode = useTaskStore((s) => s.setViewMode);
  const theme = useTaskStore((s) => s.theme);
  const toggleCommandPalette = useTaskStore((s) => s.toggleCommandPalette);
  const isCommandPaletteOpen = useTaskStore((s) => s.isCommandPaletteOpen);
  const isRecommendModalOpen = useTaskStore((s) => s.isRecommendModalOpen);
  const isAboutOpen = useTaskStore((s) => s.isAboutOpen);
  const setSelectedTaskForDrawer = useTaskStore((s) => s.setSelectedTaskForDrawer);
  const addTask = useTaskStore((s) => s.addTask);

  // Sync dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Global Keyboard Shortcuts (Linear / Raycast style)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept when user is typing in an input or textarea
      const target = e.target;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Cmd+K or Ctrl+K for Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleCommandPalette();
        return;
      }

      if (isInput) return;

      // Quick numbers 1 to 5 to switch views
      if (e.key === "1") setViewMode("list");
      if (e.key === "2") setViewMode("kanban");
      if (e.key === "3") setViewMode("calendar");
      if (e.key === "4") setViewMode("focus");
      if (e.key === "5") setViewMode("widgets");

      // 'n' or 'c' to create new task
      if (e.key.toLowerCase() === "n" || e.key.toLowerCase() === "c") {
        e.preventDefault();
        const newTask = {
          title: "New Untitled Task",
          priority: "medium",
          energy: "medium",
          estimatedMinutes: 25,
        };
        addTask(newTask).then((created) => {
          if (created?._id) setSelectedTaskForDrawer(created._id);
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleCommandPalette, setViewMode, addTask, setSelectedTaskForDrawer]);

  const handleOpenNewTask = () => {
    const newTask = {
      title: "New Task",
      priority: "medium",
      energy: "medium",
      estimatedMinutes: 25,
    };
    addTask(newTask).then((created) => {
      if (created?._id) setSelectedTaskForDrawer(created._id);
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-indigo-500 selection:text-white font-sans">
      {/* Collapsible Linear-Style Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Mobile Backdrop overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-30 md:hidden transition-opacity"
        />
      )}

      {/* Main Workspace Stage */}
      <main className="flex-1 md:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Top Header */}
        <NavbarHeader
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onOpenNewTask={handleOpenNewTask}
        />

        {/* Dynamic Canvas Routing */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === "list" && <LinearTaskList />}
          {viewMode === "kanban" && (
            <div className="p-4 sm:p-6 max-w-7xl mx-auto">
              <KanbanView />
            </div>
          )}
          {viewMode === "calendar" && (
            <div className="p-4 sm:p-6 max-w-6xl mx-auto">
              <CalendarView />
            </div>
          )}
          {viewMode === "focus" && (
            <div className="p-4 sm:p-6 max-w-4xl mx-auto">
              <FocusMode />
            </div>
          )}
          {viewMode === "widgets" && <WidgetsHub />}
          {viewMode === "insights" && (
            <div className="p-4 sm:p-6 max-w-5xl mx-auto">
              <ProductivityInsights />
            </div>
          )}
        </div>
      </main>

      {/* Slide-Over Task Inspector Drawer */}
      <TaskInspectorDrawer />

      {/* Floating Picture-in-Picture Desk Widget */}
      <FloatingMiniWidget />

      {/* Modals & Command Palette */}
      {isCommandPaletteOpen && <CommandPalette />}
      {isRecommendModalOpen && <RecommendationModal />}
      {isAboutOpen && <AboutModal />}
    </div>
  );
}
