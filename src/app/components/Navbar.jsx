"use client";
import React, { useContext, useState } from "react";
import Link from "next/link";
import UserContext from "@/context/userContext";
import { logOut } from "../Services/userService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Sparkles, Download, Menu, X, CheckSquare, PlusCircle, LayoutDashboard, LogIn, UserPlus, LogOut } from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const doLogout = async () => {
    try {
      await logOut();
      setUser({ name: "", email: "" });
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Error while Logging Out !!");
    }
  };

  const isLoggedIn = user?.email && user.email !== "";

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-lg tracking-tight group-hover:text-indigo-400 transition-colors">
                  TaskFlow
                </span>
                <span className="text-[10px] text-indigo-400 font-semibold -mt-1 tracking-wide">
                  Built by Utsav
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
            <Link
              href="/showtask"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
              Workspace
            </Link>

            <Link
              href="/addtask"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
              Add Task
            </Link>

            <Link
              href="/Dashboard"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />
              Dashboard
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* APK Download direct link */}
            <a
              href="/app-debug.apk"
              download="TaskFlow-by-Utsav.apk"
              title="Download Android APK"
              className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Android APK</span>
            </a>

            {!isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                  {user?.name || "User"}
                </span>
                <button
                  onClick={doLogout}
                  title="Sign out"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href="/app-debug.apk"
              download="TaskFlow-by-Utsav.apk"
              className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold"
              title="Download APK"
            >
              <Download className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-2">
            <Link
              href="/showtask"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              <CheckSquare className="w-4 h-4 text-indigo-400" /> Workspace
            </Link>
            <Link
              href="/addtask"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" /> Add Task
            </Link>
            <Link
              href="/Dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              <LayoutDashboard className="w-4 h-4 text-purple-400" /> Dashboard
            </Link>

            <a
              href="/app-debug.apk"
              download="TaskFlow-by-Utsav.apk"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
            >
              <Download className="w-4 h-4" /> Download Android APK (11 MB)
            </a>

            {!isLoggedIn ? (
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl bg-slate-800 text-slate-200 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between px-3">
                <span className="text-sm font-semibold text-slate-300">{user?.name}</span>
                <button
                  onClick={doLogout}
                  className="text-rose-400 text-sm font-semibold flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
