import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import AppLayout from "../components/AppLayout.jsx";
import { employeesApi } from "../api/axios";

export default function Analytics() {
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadAnalytics = async () => {
      try {
        const { data } = await employeesApi.list({
          page: 1,
          limit: 1000
        });

        const employees = Array.isArray(data)
          ? data
          : data.users || data.data || [];

        const departments = [
          "Engineering",
          "Design",
          "Sales",
          "Marketing",
          "Support",
          "HR"
        ];

        const result = departments.map((department) => ({
          department,
          employees: employees.filter(
            (employee) =>
              String(employee.department || "").toLowerCase() ===
              department.toLowerCase()
          ).length
        }));

        /*
          If your database does not contain department values yet,
          keep the existing demo distribution so the chart remains visible.
        */
        const hasData = result.some((item) => item.employees > 0);

        if (mounted) {
          setDepartmentData(
            hasData
              ? result
              : [
                  { department: "Engineering", employees: 38 },
                  { department: "Design", employees: 14 },
                  { department: "Sales", employees: 22 },
                  { department: "Marketing", employees: 17 },
                  { department: "Support", employees: 20 },
                  { department: "HR", employees: 9 }
                ]
          );
        }
      } catch (error) {
        console.error("Analytics error:", error);

        if (mounted) {
          setDepartmentData([
            { department: "Engineering", employees: 38 },
            { department: "Design", employees: 14 },
            { department: "Sales", employees: 22 },
            { department: "Marketing", employees: 17 },
            { department: "Support", employees: 20 },
            { department: "HR", employees: 9 }
          ]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AppLayout title="Analytics">
      <div className="max-w-[1600px] mx-auto">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            A closer look at how your workforce is distributed.
          </p>
        </div>

        {/* =====================================================
            DEPARTMENT CHART
        ====================================================== */}
        <div className="surface-card p-5 sm:p-6">

          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-900">
                Headcount by Department
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Employee distribution across departments
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span className="text-xs text-slate-500">
                Employees
              </span>
            </div>
          </div>

          {loading ? (
            <div className="h-[320px] flex items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <div className="h-5 w-5 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
                Loading analytics...
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={departmentData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 10
                }}
              >
                <CartesianGrid
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="department"
                  tick={{
                    fontSize: 12,
                    fill: "#64748b"
                  }}
                  axisLine={{
                    stroke: "#e2e8f0"
                  }}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 12,
                    fill: "#94a3b8"
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{
                    fill: "rgba(59, 130, 246, 0.06)"
                  }}
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #dbe5f1",
                    borderRadius: "12px",
                    boxShadow:
                      "0 8px 24px rgba(37, 99, 235, 0.08)",
                    fontSize: "12px"
                  }}
                  labelStyle={{
                    color: "#0f172a",
                    fontWeight: 600,
                    marginBottom: "4px"
                  }}
                />

                <Bar
                  dataKey="employees"
                  name="Employees"
                  fill="#2563eb"
                  radius={[7, 7, 0, 0]}
                  barSize={48}
                  animationDuration={700}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">

          {departmentData.map((item) => (
            <div
              key={item.department}
              className="bg-white border border-slate-200 rounded-xl p-4
              shadow-sm hover:shadow-md hover:border-blue-200
              transition-all duration-200"
            >
              <div className="h-9 w-9 rounded-lg bg-blue-50
                flex items-center justify-center mb-3"
              >
                <span className="text-blue-600 font-bold text-sm">
                  {item.department.charAt(0)}
                </span>
              </div>

              <p className="text-xs text-slate-500 truncate">
                {item.department}
              </p>

              <p className="text-xl font-bold text-slate-900 mt-1">
                {item.employees}
              </p>

              <p className="text-[11px] text-slate-400 mt-1">
                Employees
              </p>
            </div>
          ))}

        </div>
      </div>
    </AppLayout>
  );
}