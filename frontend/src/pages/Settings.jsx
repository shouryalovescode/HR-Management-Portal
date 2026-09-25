import React, { useEffect, useState } from "react";
import {
  Bell,
  Moon,
  Sun,
  Shield,
  LogOut,
  Check,
  User,
  Settings as SettingsIcon,
  Monitor
} from "lucide-react";
import toast from "react-hot-toast";
import AppLayout from "../components/AppLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Toggle({ enabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={enabled}
      className={`relative shrink-0 w-12 h-6 rounded-full transition-colors duration-200 ${
        enabled ? "bg-blue-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          enabled ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const { user, logout } = useAuth();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [notifications, setNotifications] = useState(
    localStorage.getItem("notifications") !== "false"
  );

  const [compactMode, setCompactMode] = useState(
    localStorage.getItem("compactMode") === "true"
  );

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(
      "notifications",
      notifications ? "true" : "false"
    );
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(
      "compactMode",
      compactMode ? "true" : "false"
    );
  }, [compactMode]);

  const handleLogout = () => {
    toast.success("Logged out successfully.");

    setTimeout(() => {
      logout();
    }, 500);
  };

  const resetSettings = () => {
    setDarkMode(false);
    setNotifications(true);
    setCompactMode(false);

    localStorage.setItem("theme", "light");
    localStorage.setItem("notifications", "true");
    localStorage.setItem("compactMode", "false");

    toast.success("Settings restored to default.");
  };

  return (
    <AppLayout title="Settings">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your account preferences and application settings.
          </p>
        </div>

        {/* ACCOUNT */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm">

          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">

              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <User size={19} className="text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Account
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Your current account information
                </p>
              </div>

            </div>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Full Name
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {user?.name || "Not available"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Email Address
              </p>

              <p className="mt-1 font-semibold text-slate-900 break-all">
                {user?.email || "Not available"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Role
              </p>

              <p className="mt-1 font-semibold text-slate-900 capitalize">
                {user?.role || "user"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Authentication
              </p>

              <p className="mt-1 font-semibold text-emerald-600">
                JWT Secured
              </p>
            </div>

          </div>
        </section>

        {/* APPEARANCE */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm">

          <div className="p-6 border-b border-slate-100">

            <div className="flex items-center gap-3">

              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                {darkMode ? (
                  <Moon size={19} className="text-indigo-600" />
                ) : (
                  <Sun size={19} className="text-indigo-600" />
                )}
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Appearance
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Customize how the application looks.
                </p>
              </div>

            </div>

          </div>

          <div className="p-6 space-y-5">

            {/* DARK MODE */}
            <div className="flex items-center justify-between gap-5">

              <div className="flex items-center gap-4">

                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  {darkMode ? (
                    <Moon size={18} className="text-slate-700" />
                  ) : (
                    <Sun size={18} className="text-slate-700" />
                  )}
                </div>

                <div>
                  <p className="font-medium text-slate-900">
                    Dark mode
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Switch between light and dark appearance.
                  </p>
                </div>

              </div>

              <Toggle
                enabled={darkMode}
                onClick={() => {
                  setDarkMode((value) => !value);

                  toast.success(
                    !darkMode
                      ? "Dark mode enabled."
                      : "Light mode enabled."
                  );
                }}
              />

            </div>

            {/* COMPACT MODE */}
            <div className="flex items-center justify-between gap-5">

              <div className="flex items-center gap-4">

                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Monitor
                    size={18}
                    className="text-slate-700"
                  />
                </div>

                <div>
                  <p className="font-medium text-slate-900">
                    Compact mode
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Use a more compact interface layout.
                  </p>
                </div>

              </div>

              <Toggle
                enabled={compactMode}
                onClick={() => {
                  setCompactMode((value) => !value);

                  toast.success(
                    !compactMode
                      ? "Compact mode enabled."
                      : "Compact mode disabled."
                  );
                }}
              />

            </div>

          </div>
        </section>

        {/* NOTIFICATIONS */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm">

          <div className="p-6 border-b border-slate-100">

            <div className="flex items-center gap-3">

              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Bell
                  size={19}
                  className="text-emerald-600"
                />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Notifications
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Control application notification preferences.
                </p>
              </div>

            </div>

          </div>

          <div className="p-6">

            <div className="flex items-center justify-between gap-5">

              <div>
                <p className="font-medium text-slate-900">
                  Application notifications
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Receive alerts and updates from the system.
                </p>
              </div>

              <Toggle
                enabled={notifications}
                onClick={() => {
                  setNotifications((value) => !value);

                  toast.success(
                    !notifications
                      ? "Notifications enabled."
                      : "Notifications disabled."
                  );
                }}
              />

            </div>

          </div>
        </section>

        {/* SECURITY */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm">

          <div className="p-6 border-b border-slate-100">

            <div className="flex items-center gap-3">

              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Shield
                  size={19}
                  className="text-blue-600"
                />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Security
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Information about your current session.
                </p>
              </div>

            </div>

          </div>

          <div className="p-6">

            <div className="flex items-center gap-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

              <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check
                  size={18}
                  className="text-emerald-600"
                />
              </div>

              <div>
                <p className="font-medium text-emerald-900">
                  Secure session active
                </p>

                <p className="text-xs text-emerald-700 mt-1">
                  Your account is authenticated using JWT.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ACTIONS */}
        <section className="flex flex-col sm:flex-row gap-3">

          <button
            type="button"
            onClick={resetSettings}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Restore default settings
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600 transition flex items-center justify-center gap-2"
          >
            <LogOut size={17} />
            Sign out
          </button>

        </section>

        {/* FOOTER */}
        <div className="text-center py-4">

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <SettingsIcon size={14} />
            Infinite Computer Solutions Employee Management System
          </div>

          <p className="text-[11px] text-slate-400 mt-1">
            © {new Date().getFullYear()} Infinite Computer Solutions
          </p>

        </div>

      </div>
    </AppLayout>
  );
}