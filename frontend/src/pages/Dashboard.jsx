import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  UserPlus,
  Activity,
  Gauge,
} from "lucide-react";

import AppLayout from "../components/AppLayout.jsx";
import StatCard from "../components/StatCard.jsx";
import { StatCardSkeleton } from "../components/Skeleton.jsx";
import { employeesApi } from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";

/* =========================================================
   HELPERS
========================================================= */

const COLORS = [
  "#bfdbfe",
  "#60a5fa",
  "#2563eb",
  "#1d4ed8",
];

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatTimeAgo(dateString) {
  if (!dateString) return "Recently";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const diff = Date.now() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);

  return `${months}mo ago`;
}

/* =========================================================
   DASHBOARD
========================================================= */

export default function Dashboard() {
  const { user } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [growthData, setGrowthData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [activity, setActivity] = useState([]);

  const [loading, setLoading] = useState(true);

  /* =========================================================
     LOAD EVERYTHING FROM DATABASE
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);

        const { data } = await employeesApi.list({
          page: 1,
          limit: 1000,
        });

        const list = Array.isArray(data)
          ? data
          : data?.users || data?.data || [];

        if (!mounted) return;

        setEmployees(list);

        /* =====================================================
           BASIC STATISTICS
        ===================================================== */

        const total = data?.total ?? list.length;

        const active = list.filter(
          (employee) =>
            String(employee.status || "active").toLowerCase() !==
            "inactive"
        ).length;

        const ages = list
          .map((employee) => Number(employee.age))
          .filter((age) => Number.isFinite(age) && age > 0);

        const avgAge = ages.length
          ? Math.round(
              ages.reduce((sum, age) => sum + age, 0) /
                ages.length
            )
          : "—";

        /* =====================================================
           NEW EMPLOYEES THIS MONTH
        ===================================================== */

        const now = new Date();

        const newHires = list.filter((employee) => {
          if (!employee.created_at) return false;

          const created = new Date(employee.created_at);

          return (
            created.getMonth() === now.getMonth() &&
            created.getFullYear() === now.getFullYear()
          );
        }).length;

        setStats({
          total,
          active,
          avgAge,
          newHires,
        });

        /* =====================================================
           AGE DISTRIBUTION
        ===================================================== */

        const ageGroups = [
          {
            name: "18–25",
            min: 18,
            max: 25,
          },
          {
            name: "26–35",
            min: 26,
            max: 35,
          },
          {
            name: "36–45",
            min: 36,
            max: 45,
          },
          {
            name: "46+",
            min: 46,
            max: Infinity,
          },
        ];

        const calculatedAgeData = ageGroups.map(
          (group, index) => ({
            name: group.name,
            value: ages.filter(
              (age) =>
                age >= group.min &&
                age <= group.max
            ).length,
            color: COLORS[index],
          })
        );

        setAgeData(calculatedAgeData);

        /* =====================================================
           EMPLOYEE GROWTH
           
           Shows cumulative employee count for the
           last 7 months using created_at.
        ===================================================== */

        const months = [];

        for (let i = 6; i >= 0; i--) {
          const date = new Date(
            now.getFullYear(),
            now.getMonth() - i,
            1
          );

          months.push({
            year: date.getFullYear(),
            month: date.getMonth(),
            label: date.toLocaleDateString(undefined, {
              month: "short",
            }),
          });
        }

        const calculatedGrowth = months.map((month) => {
          const count = list.filter((employee) => {
            if (!employee.created_at) return false;

            const created = new Date(employee.created_at);

            return (
              created <
              new Date(
                month.year,
                month.month + 1,
                1
              )
            );
          }).length;

          return {
            month: month.label,
            employees: count,
          };
        });

        setGrowthData(calculatedGrowth);

        /* =====================================================
           RECENT ACTIVITY
           
           Uses actual employees ordered by created_at.
        ===================================================== */

        const recentEmployees = [...list]
          .filter((employee) => employee.created_at)
          .sort(
            (a, b) =>
              new Date(b.created_at) -
              new Date(a.created_at)
          )
          .slice(0, 5);

        const recentActivity = recentEmployees.map(
          (employee) => ({
            name: employee.name || "Employee",
            action: employee.department
              ? `was added to ${employee.department}`
              : "was added to the organization",
            time: formatTimeAgo(employee.created_at),
          })
        );

        setActivity(recentActivity);
      } catch (error) {
        console.error(
          "Dashboard data error:",
          error
        );

        if (mounted) {
          setEmployees([]);
          setStats({
            total: 0,
            active: 0,
            avgAge: "—",
            newHires: 0,
          });
          setGrowthData([]);
          setAgeData([]);
          setActivity([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     UI
  ========================================================= */

  return (
    <AppLayout title="Dashboard">

      {/* =====================================================
          WELCOME BANNER
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          relative
          overflow-hidden
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          via-blue-500
          to-sky-400
          p-8
          text-white
          mb-6
          shadow-lg
          shadow-blue-100
        "
      >

        <div className="absolute -top-10 -right-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">

          <p className="text-white/80 text-sm">
            {new Date().toLocaleDateString(
              undefined,
              {
                weekday: "long",
                month: "long",
                day: "numeric",
              }
            )}
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
            Employee Management Dashboard
          </h1>

          <p className="text-white/85 mt-2 max-w-xl">
            Welcome back
            {user?.name
              ? `, ${user.name}`
              : ""}
            . Here's how your organization is
            doing today.
          </p>

        </div>
      </motion.div>

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {loading || !stats ? (
          Array.from({
            length: 4,
          }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))
        ) : (
          <>
            <StatCard
              icon={Users}
              label="Total Employees"
              value={stats.total}
              delta=""
              tone="up"
            />

            <StatCard
              icon={UserPlus}
              label="New Employees"
              value={stats.newHires}
              delta=""
              tone="up"
            />

            <StatCard
              icon={Gauge}
              label="Average Age"
              value={stats.avgAge}
              delta=""
              tone="up"
            />

            <StatCard
              icon={Activity}
              label="Active Users"
              value={stats.active}
              delta=""
              tone="up"
            />
          </>
        )}

      </div>

      {/* =====================================================
          CHARTS
      ===================================================== */}

      <div className="grid lg:grid-cols-3 gap-4 mb-6">

        {/* ===================================================
            EMPLOYEE GROWTH
        =================================================== */}

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between mb-4">

            <div>
              <h3 className="font-semibold text-slate-800">
                Employee Growth
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Employee count over the last 7 months
              </p>
            </div>

            <span className="text-xs text-slate-400">
              Live data
            </span>

          </div>

          {loading ? (
            <div className="h-[240px] flex items-center justify-center text-sm text-slate-400">
              Loading growth data...
            </div>
          ) : growthData.length === 0 ? (
            <div className="h-[240px] flex items-center justify-center text-sm text-slate-400">
              No employee growth data available.
            </div>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={240}
            >
              <AreaChart data={growthData}>

                <defs>
                  <linearGradient
                    id="growthFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#3b82f6"
                      stopOpacity={0.3}
                    />

                    <stop
                      offset="100%"
                      stopColor="#3b82f6"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 12,
                    fill: "#64748b",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 12,
                    fill: "#94a3b8",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border:
                      "1px solid #dbeafe",
                    background: "#ffffff",
                    fontSize: 12,
                    boxShadow:
                      "0 4px 14px rgba(15, 23, 42, 0.08)",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="employees"
                  name="Employees"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fill="url(#growthFill)"
                />

              </AreaChart>
            </ResponsiveContainer>
          )}

        </div>

        {/* ===================================================
            AGE DISTRIBUTION
        =================================================== */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <h3 className="font-semibold text-slate-800 mb-4">
            Age Distribution
          </h3>

          {loading ? (
            <div className="h-[200px] flex items-center justify-center text-sm text-slate-400">
              Loading age data...
            </div>
          ) : (
            <>
              <ResponsiveContainer
                width="100%"
                height={200}
              >
                <PieChart>

                  <Pie
                    data={ageData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >

                    {ageData.map(
                      (entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.color}
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border:
                        "1px solid #dbeafe",
                      background: "#ffffff",
                      fontSize: 12,
                      boxShadow:
                        "0 4px 14px rgba(15, 23, 42, 0.08)",
                    }}
                  />

                </PieChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-2 mt-2">

                {ageData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 text-xs text-slate-500"
                  >

                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        background:
                          item.color,
                      }}
                    />

                    <span>
                      {item.name}
                    </span>

                    <span className="font-semibold text-slate-700">
                      {item.value}
                    </span>

                  </div>
                ))}

              </div>
            </>
          )}

        </div>

      </div>

      {/* =====================================================
          RECENT ACTIVITY
      ===================================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

        <div className="flex items-center justify-between mb-4">

          <h3 className="font-semibold text-slate-800">
            Recent Activity
          </h3>

          <span className="text-xs text-slate-400">
            Latest employee records
          </span>

        </div>

        {loading ? (
          <div className="py-8 text-center text-sm text-slate-400">
            Loading activity...
          </div>
        ) : activity.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400">
            No recent employee activity.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {activity.map(
              (item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex items-center gap-3 py-3"
                >

                  <div
                    className="
                      h-9
                      w-9
                      rounded-full
                      bg-blue-50
                      text-blue-600
                      flex
                      items-center
                      justify-center
                      text-xs
                      font-semibold
                      shrink-0
                      border
                      border-blue-100
                    "
                  >
                    {getInitials(item.name)}
                  </div>

                  <p className="text-sm flex-1 min-w-0 truncate">

                    <span className="font-medium text-slate-800">
                      {item.name}
                    </span>

                    {" "}

                    <span className="text-slate-400">
                      {item.action}
                    </span>

                  </p>

                  <span className="text-xs text-slate-400 shrink-0">
                    {item.time}
                  </span>

                </div>
              )
            )}

          </div>
        )}

      </div>

    </AppLayout>
  );
}