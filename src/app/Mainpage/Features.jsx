import React from "react";
import Link from "next/link";
import {
    Sparkles,
    Zap,
    Compass,
    Clock,
    Kanban,
    ShieldCheck,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";

export default function MainFeatures() {
    const features = [
        {
            title: "Natural-Language Quick Add",
            desc: "Type 'Submit research paper tomorrow 4pm #college !high ~45m @high' and watch TaskFlow parse tags, priority, energy, and date in real time.",
            icon: Sparkles,
            color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
        },
        {
            title: "'What Should I Do Right Now?'",
            desc: "Overcome ADHD analysis paralysis. Pick your current mental energy and available time, and TaskFlow recommends the single highest-impact task.",
            icon: Compass,
            color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        },
        {
            title: "Deep Work Flow Timer",
            desc: "A built-in 25-minute Pomodoro focus timer tied directly to your active task, complete with Web Audio synthesizer chimes and confetti.",
            icon: Clock,
            color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
        },
        {
            title: "Kanban & Calendar Views",
            desc: "Fluid drag-and-drop Kanban board and monthly calendar matrix powered by Framer Motion spring physics.",
            icon: Kanban,
            color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
        },
        {
            title: "AI Micro-Step Deconstructor",
            desc: "Break overwhelming multi-hour projects into 3 to 5 bite-sized, low-friction micro-steps that eliminate avoidance behavior.",
            icon: Zap,
            color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
        },
        {
            title: "100% Offline First + Android APK",
            desc: "Never blocked by spotty WiFi or database outages. All tasks persist instantly in browser storage with an installable native Android app.",
            icon: ShieldCheck,
            color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
        },
    ];

    return (
        <section className="bg-slate-950 py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full">
                        Engineered for Human Brains
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        Built for execution, not endless planning.
                    </h2>
                    <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                        Traditional to-do apps guilt-trip you with 40 red overdue reminders. TaskFlow is designed around
                        energy, flow states, and friction reduction.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feat, i) => {
                        const Icon = feat.icon;
                        return (
                            <div
                                key={i}
                                className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-3xl p-7 transition-all duration-200 shadow-xl flex flex-col justify-between"
                            >
                                <div>
                                    <div
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${feat.color} group-hover:scale-110 transition-transform`}
                                    >
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                                        {feat.desc}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
                                    <Link
                                        href="/showtask"
                                        className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                                    >
                                        Try in Workspace <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                    <span className="text-slate-600 font-mono">0{i + 1}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
