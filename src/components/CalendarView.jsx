"use client";
import React, { useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";

export default function CalendarView() {
    const tasks = useTaskStore((s) => s.tasks);
    const setSelectedTaskIdForFocus = useTaskStore((s) => s.setSelectedTaskIdForFocus);
    const setViewMode = useTaskStore((s) => s.setViewMode);

    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    // Map tasks by day of current month
    const tasksByDay = {};
    tasks.forEach((task) => {
        if (!task.dueDate) return;
        const d = new Date(task.dueDate);
        if (d.getFullYear() === year && d.getMonth() === month) {
            const dayNum = d.getDate();
            if (!tasksByDay[dayNum]) tasksByDay[dayNum] = [];
            tasksByDay[dayNum].push(task);
        }
    });

    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md mb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <CalendarIcon className="w-6 h-6 text-indigo-400" />
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                        {monthNames[month]} {year}
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={goToToday}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    >
                        Today
                    </button>
                    <button
                        onClick={prevMonth}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {dayLabels.map((day) => (
                    <div key={day} className="py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {/* Empty padding slots before first day */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[100px] rounded-xl bg-slate-950/30 border border-slate-800/30" />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dayTasks = tasksByDay[dayNum] || [];
                    const isToday =
                        dayNum === new Date().getDate() &&
                        month === new Date().getMonth() &&
                        year === new Date().getFullYear();

                    return (
                        <div
                            key={dayNum}
                            className={`min-h-[110px] rounded-xl border p-2 flex flex-col transition-all duration-200 ${
                                isToday
                                    ? "bg-indigo-950/30 border-indigo-500/50 shadow-inner"
                                    : "bg-slate-900/60 border-slate-800/60 hover:border-slate-700"
                            }`}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span
                                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                                        isToday ? "bg-indigo-600 text-white" : "text-slate-400"
                                    }`}
                                >
                                    {dayNum}
                                </span>
                                {dayTasks.length > 0 && (
                                    <span className="text-[10px] font-medium text-slate-500">
                                        {dayTasks.length} task{dayTasks.length > 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>

                            {/* Task Pills */}
                            <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                                {dayTasks.map((t) => (
                                    <button
                                        key={t._id}
                                        onClick={() => {
                                            setSelectedTaskIdForFocus(t._id);
                                            setViewMode("focus");
                                        }}
                                        title={`${t.title} (Priority: ${t.priority})`}
                                        className={`text-left px-2 py-1 rounded-md text-[11px] truncate font-medium transition-all ${
                                            t.status === "completed"
                                                ? "line-through text-slate-500 bg-slate-800/40"
                                                : t.priority === "urgent"
                                                ? "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30"
                                                : t.priority === "high"
                                                ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30"
                                                : "bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30"
                                        }`}
                                    >
                                        {t.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
