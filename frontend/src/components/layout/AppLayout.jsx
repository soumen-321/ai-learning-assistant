

import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  Layers,
  HelpCircle,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AppLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Documents", path: "/documents", icon: FileText },
    { label: "Flashcards", path: "/flashcards", icon: Layers },
    { label: "Profile", path: "/profile", icon: User },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans select-none overflow-hidden">
      {/* Clean White Sidebar with Corner Leaf Accent */}
      <aside className="relative w-64 border-r border-slate-100 bg-white flex flex-col justify-between p-6 shrink-0 shadow-[2px_0_12px_-4px_rgba(0,0,0,0.02)]">
        
        {/* Soft Botanical Leaf SVG Accent */}
        <svg
          className="absolute -bottom-6 -left-6 w-48 h-48 opacity-25 pointer-events-none z-0"
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20,140 C10,90 40,40 100,20 C110,60 90,110 20,140 Z"
            fill="#34D399"
          />
          <path
            d="M20,140 C50,110 100,100 130,50 C140,90 110,130 20,140 Z"
            fill="#059669"
          />
        </svg>

        <div className="space-y-8 relative z-10">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3 pl-1">
            <div className="w-10 h-10 rounded-2xl bg-[#00B884] text-white flex items-center justify-center shadow-md shadow-[#00B884]/20 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-slate-900 leading-tight block">
                AI Learn
              </span>
              <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
                Your Study Companion
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#00B884] text-white shadow-md shadow-[#00B884]/25 translate-x-0.5"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout Footer */}
        <div className="border-t border-slate-100 pt-5 flex items-center justify-between px-1 relative z-10">
          <div className="text-xs min-w-0 pr-2">
            <p className="font-bold text-slate-800 truncate">
              {user?.name || "Soumen Rakshit"}
            </p>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {user?.email || "soumen@gmail.com"}
            </p>
          </div>
          <button
            onClick={logout}
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;