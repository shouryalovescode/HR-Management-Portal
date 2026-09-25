import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  UserCircle,
  ChevronsLeft,
  ChevronsRight,
  CalendarCheck,
  Building2,
  CalendarDays,
  LogOut,
  WalletCards,
  BriefcaseBusiness
} from "lucide-react";

const links = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard
  },
  {
    to: "/employees",
    label: "Employees",
    icon: Users
  },
  {
    to: "/attendance",
    label: "Attendance",
    icon: CalendarCheck
  },
  {
    to: "/departments",
    label: "Departments",
    icon: Building2
  },
  {
    to: "/leave-management",
    label: "Leave Management",
    icon: CalendarDays
  },
  {
    to: "/payroll",
    label: "Payroll",
    icon: WalletCards
  },
  {
  to: "/recruitment",
  label: "Recruitment",
  icon: BriefcaseBusiness
},
  {
    to: "/analytics",
    label: "Analytics",
    icon: BarChart3
  },
  {
    to: "/settings",
    label: "Settings",
    icon: Settings
  },
  {
    to: "/profile",
    label: "Profile",
    icon: UserCircle
  }
];

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onCloseMobile
}) {
  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");

    window.location.href = "/login";
  };

  // =====================================================
  // REFRESH CURRENT PAGE
  // =====================================================

  const handleBrandClick = () => {
    window.location.reload();
  };

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <motion.aside
        animate={{
          width: collapsed ? 84 : 264
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 30
        }}
        className={`fixed lg:sticky top-0 h-screen z-40 shrink-0 flex flex-col
          bg-white border-r border-slate-200
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          transition-transform duration-300`}
      >
        {/* =====================================================
            BRAND / REFRESH BUTTON
        ====================================================== */}

        <button
          type="button"
          onClick={handleBrandClick}
          className={`w-full flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          } px-5 h-16 border-b border-slate-200
          text-left hover:bg-slate-50 active:bg-slate-100
          transition-colors cursor-pointer`}
          title="Refresh page"
        >
          {/* Logo */}

          <div
            className={`${
              collapsed ? "h-10 w-10" : "h-11 w-11"
            } rounded-xl overflow-hidden bg-white
            flex items-center justify-center shrink-0`}
          >
            <img
              src="/infinite-logo.png"
              alt="Infinite Computer Solutions"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Company Name */}

          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <div className="font-bold text-[17px] tracking-tight text-slate-900 whitespace-nowrap">
                Infinite
              </div>

              <div className="text-[12px] font-medium text-blue-600 whitespace-nowrap">
                Computer Solutions
              </div>
            </div>
          )}
        </button>

        {/* =====================================================
            NAVIGATION
        ====================================================== */}

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5
                text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-slate-500 hover:bg-blue-50/70 hover:text-blue-600"
                }
                ${collapsed ? "justify-center" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={`shrink-0 ${
                      isActive
                        ? "text-blue-600"
                        : "text-slate-500 group-hover:text-blue-600"
                    }`}
                  />

                  {!collapsed && (
                    <span className="whitespace-nowrap">
                      {label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* =====================================================
            BOTTOM ACTIONS
        ====================================================== */}

        <div className="px-3 pb-2">
          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center gap-3
              px-3 py-2.5 rounded-xl
              text-red-500
              hover:bg-red-50
              hover:text-red-600
              transition-all duration-200
              text-sm font-medium
              ${collapsed ? "justify-center" : ""}`}
            title="Logout"
          >
            <LogOut
              size={19}
              strokeWidth={1.9}
              className="shrink-0"
            />

            {!collapsed && (
              <span className="whitespace-nowrap">
                Logout
              </span>
            )}
          </button>
        </div>

        {/* =====================================================
            COLLAPSE BUTTON
        ====================================================== */}

        <button
          type="button"
          onClick={onToggle}
          className={`hidden lg:flex items-center gap-2 mx-3 mb-4
            px-3 py-2.5 rounded-xl
            text-slate-400
            hover:bg-blue-50
            hover:text-blue-600
            transition-all duration-200
            text-sm font-medium
            ${collapsed ? "justify-center" : ""}`}
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          title={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          {collapsed ? (
            <ChevronsRight size={19} />
          ) : (
            <ChevronsLeft size={19} />
          )}

          {!collapsed && <span>Collapse</span>}
        </button>
      </motion.aside>
    </>
  );
}