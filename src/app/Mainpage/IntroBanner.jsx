"use client";
import React, { useContext } from "react";
import Link from "next/link";
import UserContext from "@/context/userContext";
import { Sparkles, ArrowRight, Download, CheckCircle2, Zap, Shield, Compass } from "lucide-react";

export default function IntroBanner() {
  const { user } = useContext(UserContext);

  return (
    <div className="relative w-full overflow-hidden bg-slate-950 py-16 md:py-24 border-b border-slate-800/80">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Creator Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            Built by Utsav · The Flow-First To-Do Engine
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Stop managing lists. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
              Start working in flow.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Crafted for developers, creators, and neurodiverse professionals. Eliminate executive dysfunction with
            natural-language capture, energy-aware prioritization, deep-work Pomodoro mode, and 100% offline persistence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/showtask"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-7 py-3.5 rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-95 transition-all text-sm sm:text-base"
            >
              Launch Workspace
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="/app-debug.apk"
              download="TaskFlow-by-Utsav.apk"
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold px-6 py-3.5 rounded-2xl active:scale-95 transition-all text-sm sm:text-base"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Download Android APK
            </a>
          </div>

          {/* Value Props Pills */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Natural-Language Input
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> "What Should I Do Now?" Recommender
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-400" /> 100% Offline First + Cloud Sync
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
