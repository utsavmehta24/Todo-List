"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "@/store/useTaskStore";
import { X, Sparkles, Heart, Code2, ShieldCheck, Zap } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function AboutModal() {
    const isOpen = useTaskStore((s) => s.isAboutOpen);
    const toggleAbout = useTaskStore((s) => s.toggleAbout);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
                >
                    {/* Close button */}
                    <button
                        onClick={() => toggleAbout(false)}
                        className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        Built by Utsav
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
                        TaskFlow
                    </h2>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6">
                        An energy-aware, flow-driven productivity engine crafted for developers, creators,
                        and neurodiverse (ADHD) professionals who need clear execution without analysis paralysis.
                    </p>

                    {/* Features highlight grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-1">
                                <Zap className="w-4 h-4" /> Energy-First
                            </div>
                            <p className="text-[11px] text-slate-400">
                                Match tasks to your current mental energy & time slot.
                            </p>
                        </div>

                        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
                                <ShieldCheck className="w-4 h-4" /> 100% Offline
                            </div>
                            <p className="text-[11px] text-slate-400">
                                Instant local persistence with zero latency and cloud sync.
                            </p>
                        </div>
                    </div>

                    {/* Creator section */}
                    <div className="border-t border-slate-800 pt-5 mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="font-bold text-white text-base">Utsav Mehta</h3>
                                <p className="text-xs text-slate-400">Full-Stack Engineer & Creator</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <a
                                    href="https://github.com/utsavmehta24"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                    title="GitHub"
                                >
                                    <FaGithub className="w-4 h-4" />
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/utsav-mehta-462653258/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                    title="LinkedIn"
                                >
                                    <FaLinkedin className="w-4 h-4" />
                                </a>
                                <a
                                    href="https://www.instagram.com/lucid24by7.io?igsh=MWJmZXp6dThuYTRjbw=="
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                    title="Instagram"
                                >
                                    <FaInstagram className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Footer note */}
                    <div className="text-center text-xs text-slate-500">
                        Designed with care for human flow states · © {new Date().getFullYear()} Utsav Mehta
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
