import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Menu, LogOut, Moon, Sun, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Topbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const initials = (user?.name || user?.email || "U")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center gap-4 px-4 sm:px-6 bg-white/70 dark:bg-card-dark/70 backdrop-blur-xl border-b border-border dark:border-border-dark">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl2 hover:bg-primary-50 dark:hover:bg-white/5 text-gray-500"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {title && (
        <h1 className="hidden sm:block font-semibold text-lg tracking-tight">
          {title}
        </h1>
      )}

      <div className="flex-1 flex justify-center sm:justify-start max-w-md">
        <div className="relative w-full">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search anything…"
            className="w-full rounded-xl2 border border-border dark:border-border-dark bg-white/70 dark:bg-white/5 pl-10 pr-4 py-2 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/40 outline-none transition-colors"
          />
        </div>
      </div>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-xl2 hover:bg-primary-50 dark:hover:bg-white/5 text-gray-500 transition-colors"
        aria-label="Toggle dark mode"
      >
        {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
      </button>

      <button
        className="relative p-2 rounded-xl2 hover:bg-primary-50 dark:hover:bg-white/5 text-gray-500 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={19} />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary-500 animate-pulseSoft" />
      </button>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl2 hover:bg-primary-50 dark:hover:bg-white/5 transition-colors"
        >
          <div className="h-9 w-9 rounded-full bg-brand-gradient text-white text-sm font-semibold flex items-center justify-center">
            {initials}
          </div>
          <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 surface-card p-2 origin-top-right"
            >
              <div className="px-3 py-2 border-b border-border dark:border-border-dark mb-1">
                <p className="text-sm font-medium truncate">
                  {user?.name || "Signed in"}
                </p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
