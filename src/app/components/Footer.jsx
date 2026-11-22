import React from "react";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { Sparkles, Download, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-12 pb-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-extrabold text-lg tracking-tight">
                TaskFlow
              </span>
              <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
                Built by Utsav
              </span>
            </div>

            <p className="text-slate-400 text-xs md:text-sm max-w-md leading-relaxed">
              An energy-aware flow engine for modern task management. Built with Next.js,
              Tailwind CSS, Framer Motion, and native Android Jetpack Compose to eliminate
              executive dysfunction and decision paralysis.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com/utsavmehta24"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Utsav on GitHub"
              >
                <FaGithub size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/utsav-mehta-462653258/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Utsav on LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
              <a
                href="https://www.instagram.com/lucid24by7.io?igsh=MWJmZXp6dThuYTRjbw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/showtask" className="hover:text-white transition-colors">
                  Tasks Workspace
                </Link>
              </li>
              <li>
                <Link href="/addtask" className="hover:text-white transition-colors">
                  Add New Task
                </Link>
              </li>
              <li>
                <Link href="/Dashboard" className="hover:text-white transition-colors">
                  Personal Dashboard
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-white transition-colors">
                  User Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Apps & Downloads */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Native Mobile App
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Install the standalone Kotlin + Jetpack Compose Android app built for offline speed.
            </p>
            <a
              href="/app-debug.apk"
              download="TaskFlow-by-Utsav.apk"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              Download APK (11 MB)
            </a>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with care by</span>
            <a
              href="https://github.com/utsavmehta24"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-indigo-400 hover:text-indigo-300"
            >
              Utsav Mehta
            </a>
            <span>· © {new Date().getFullYear()} TaskFlow</span>
          </div>

          <div className="text-slate-500">
            MIT License · Open Source Task Flow Engine
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
