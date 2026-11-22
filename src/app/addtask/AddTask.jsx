"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@/store/useTaskStore";
import UserContext from "@/context/userContext";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";
import {
    Plus,
    Calendar,
    Clock,
    Zap,
    AlertCircle,
    Tag,
    Sparkles,
    CheckCircle2,
    X,
    ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function AddTask() {
    const router = useRouter();
    const context = useContext(UserContext);
    const addTask = useTaskStore((s) => s.addTask);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [energy, setEnergy] = useState("medium");
    const [estimatedMinutes, setEstimatedMinutes] = useState(30);
    const [dueDate, setDueDate] = useState("");
    const [project, setProject] = useState("General");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState([]);
    const [subtasks, setSubtasks] = useState([]);
    const [newSubtask, setNewSubtask] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);

    const handleAddTag = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const clean = tagInput.replace(/^#/, "").trim().toLowerCase();
            if (clean && !tags.includes(clean)) {
                setTags([...tags, clean]);
            }
            setTagInput("");
        }
    };

    const removeTag = (t) => {
        setTags(tags.filter((item) => item !== t));
    };

    const handleAddSubtask = (e) => {
        e.preventDefault();
        if (!newSubtask.trim()) return;
        setSubtasks([
            ...subtasks,
            { id: `sub_${Date.now()}`, title: newSubtask.trim(), completed: false },
        ]);
        setNewSubtask("");
    };

    const removeSubtask = (id) => {
        setSubtasks(subtasks.filter((s) => s.id !== id));
    };

    const handleAiDeconstruct = async () => {
        if (!title.trim()) {
            toast.info("Please enter a task title first!");
            return;
        }
        setIsAiLoading(true);
        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "decompose",
                    taskTitle: title,
                    taskDescription: description,
                }),
            });
            const data = await res.json();
            if (data?.result?.subtasks) {
                setSubtasks([...subtasks, ...data.result.subtasks]);
                if (data.result.suggestedPriority) setPriority(data.result.suggestedPriority);
                if (data.result.suggestedEnergy) setEnergy(data.result.suggestedEnergy);
                if (data.result.estimatedMinutes) setEstimatedMinutes(data.result.estimatedMinutes);
                toast.success("AI broke this down into concrete micro-steps!");
            }
        } catch (err) {
            toast.error("Could not deconstruct with AI.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Task title cannot be empty");
            return;
        }

        const taskData = {
            title: title.trim(),
            description: description.trim(),
            status: "pending",
            priority,
            energy,
            estimatedMinutes: Number(estimatedMinutes) || 30,
            dueDate: dueDate ? new Date(dueDate).toISOString() : null,
            project: project.trim() || "General",
            tags,
            subtasks,
            userId: context?.user?._id || "guest_user",
        };

        try {
            await addTask(taskData);
            try {
                confetti({
                    particleCount: 30,
                    spread: 50,
                    origin: { y: 0.7 },
                });
            } catch (e) {}

            toast.success("Task added to TaskFlow!");
            router.push("/showtask");
        } catch (error) {
            console.error(error);
            toast.error("Error adding task");
        }
    };

    const handleClear = () => {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setEnergy("medium");
        setEstimatedMinutes(30);
        setDueDate("");
        setProject("General");
        setTags([]);
        setSubtasks([]);
    };

    return (
        <div className="min-h-screen bg-slate-950 py-10 px-4 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/showtask"
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                                Create New Task
                            </h2>
                            <p className="text-xs text-slate-400">
                                Crafted for clarity and flow states · Built by Utsav
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleAiDeconstruct}
                        disabled={!title.trim() || isAiLoading}
                        className="flex items-center gap-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-40"
                    >
                        <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? "animate-spin" : ""}`} />
                        <span>{isAiLoading ? "Analyzing..." : "AI Breakdown"}</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                            Task Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Finish economics thesis chapter 2"
                            required
                            className="w-full bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                            Description / Context
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Add reference links, acceptance criteria, or context..."
                            className="w-full bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                        />
                    </div>

                    {/* Priority & Energy Selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Priority */}
                        <div>
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                                Priority Level
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full bg-slate-800/80 border border-slate-700/80 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="urgent">🔴 Urgent (!urgent)</option>
                                <option value="high">🟠 High (!high)</option>
                                <option value="medium">🔵 Medium (!medium)</option>
                                <option value="low">⚪ Low (!low)</option>
                            </select>
                        </div>

                        {/* Energy */}
                        <div>
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                                Required Mental Energy
                            </label>
                            <select
                                value={energy}
                                onChange={(e) => setEnergy(e.target.value)}
                                className="w-full bg-slate-800/80 border border-slate-700/80 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="quick_win">⚡ Quick Win (Under 15 mins)</option>
                                <option value="low">🔋 Low / Brain Dead Friendly</option>
                                <option value="medium">⚡ Normal Energy</option>
                                <option value="high">🔥 High Cognitive Load</option>
                            </select>
                        </div>
                    </div>

                    {/* Due Date & Estimated Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                                Due Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full bg-slate-800/80 border border-slate-700/80 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                                Est. Duration
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="5"
                                    max="480"
                                    step="5"
                                    value={estimatedMinutes}
                                    onChange={(e) => setEstimatedMinutes(e.target.value)}
                                    className="w-full bg-slate-800/80 border border-slate-700/80 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <span className="text-xs text-slate-400">mins</span>
                            </div>
                        </div>
                    </div>

                    {/* Project & Tags */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                                Project / Category
                            </label>
                            <input
                                type="text"
                                value={project}
                                onChange={(e) => setProject(e.target.value)}
                                placeholder="e.g. Work, College, Personal"
                                className="w-full bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                                Tags (press Enter or comma)
                            </label>
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="Type tag and press enter"
                                className="w-full bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Tag Pills */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {tags.map((t) => (
                                <span
                                    key={t}
                                    className="flex items-center gap-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs px-2.5 py-1 rounded-lg"
                                >
                                    #{t}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(t)}
                                        className="hover:text-rose-400"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Micro-Steps / Subtasks */}
                    <div>
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                            Micro-Steps / Subtasks ({subtasks.length})
                        </label>

                        {subtasks.length > 0 && (
                            <div className="space-y-1.5 mb-3">
                                {subtasks.map((sub) => (
                                    <div
                                        key={sub.id}
                                        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-800/60 border border-slate-700/40"
                                    >
                                        <span className="text-xs text-slate-300 font-medium">
                                            • {sub.title}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeSubtask(sub.id)}
                                            className="text-slate-500 hover:text-rose-400 p-1"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newSubtask}
                                onChange={(e) => setNewSubtask(e.target.value)}
                                placeholder="Add a 2-minute starter step..."
                                className="flex-1 bg-slate-800/60 border border-slate-700/60 text-xs md:text-sm text-white placeholder-slate-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={handleAddSubtask}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2 rounded-xl font-semibold border border-slate-700 transition-colors"
                            >
                                Add Step
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="px-5 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-semibold transition-colors"
                        >
                            Clear
                        </button>
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
