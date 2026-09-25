import React, { useMemo, useState } from "react";
import {
  Banknote,
  Search,
  CalendarDays,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock3,
  Users,
} from "lucide-react";
import AppLayout from "../components/AppLayout.jsx";

export default function Payroll() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [month, setMonth] = useState("August 2026");

  // Temporary data for UI.
  // We will connect this to PostgreSQL in the next step.
  const payroll = [
    {
      id: 1,
      employee: "Rahul Sharma",
      department: "Engineering",
      basicSalary: 45000,
      allowances: 5000,
      deductions: 2000,
      status: "Paid",
    },
    {
      id: 2,
      employee: "Priya Sharma",
      department: "HR",
      basicSalary: 40000,
      allowances: 4500,
      deductions: 1500,
      status: "Pending",
    },
    {
      id: 3,
      employee: "Aman Verma",
      department: "Finance",
      basicSalary: 52000,
      allowances: 6000,
      deductions: 2500,
      status: "Paid",
    },
    {
      id: 4,
      employee: "Kavya Reddy",
      department: "Design",
      basicSalary: 38000,
      allowances: 4000,
      deductions: 1200,
      status: "Pending",
    },
  ];

  const getNetSalary = (employee) =>
    employee.basicSalary +
    employee.allowances -
    employee.deductions;

  const filteredPayroll = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payroll.filter((employee) => {
      const matchesSearch =
        !query ||
        employee.employee.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        employee.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalPayroll = payroll.reduce(
    (sum, employee) => sum + getNetSalary(employee),
    0
  );

  const paidPayroll = payroll
    .filter((employee) => employee.status === "Paid")
    .reduce((sum, employee) => sum + getNetSalary(employee), 0);

  const pendingPayments = payroll.filter(
    (employee) => employee.status === "Pending"
  ).length;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <AppLayout title="Payroll">
      <div className="max-w-[1600px] mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Payroll
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage employee salaries, payments and payroll records.
            </p>
          </div>

          <button className="btn-primary">
            <Banknote size={17} />
            Generate Payroll
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">

          <SummaryCard
            icon={<Banknote size={19} />}
            label="Total Payroll"
            value={formatCurrency(totalPayroll)}
            type="blue"
          />

          <SummaryCard
            icon={<CheckCircle2 size={19} />}
            label="Paid This Month"
            value={formatCurrency(paidPayroll)}
            type="green"
          />

          <SummaryCard
            icon={<Clock3 size={19} />}
            label="Pending Payments"
            value={pendingPayments}
            type="amber"
          />

          <SummaryCard
            icon={<Users size={19} />}
            label="Employees"
            value={payroll.length}
            type="purple"
          />

        </div>

        {/* FILTERS */}
        <div className="surface-card p-4 mb-5">

          <div className="flex flex-col lg:flex-row gap-3">

            {/* SEARCH */}
            <div className="relative flex-1">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employee or department..."
                className="input-field pl-10"
              />

            </div>

            {/* MONTH */}
            <div className="relative lg:w-52">

              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />

              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="input-field pl-10"
              >
                <option>August 2026</option>
                <option>July 2026</option>
                <option>June 2026</option>
                <option>May 2026</option>
              </select>

            </div>

            {/* STATUS */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field lg:w-44"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>

            {/* REFRESH */}
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
              }}
              className="btn-secondary"
            >
              <RefreshCw size={16} />
              Reset
            </button>

          </div>

        </div>

        {/* PAYROLL TABLE */}
        <div className="surface-card overflow-hidden">

          <div className="p-5 border-b border-slate-200">

            <h2 className="font-semibold text-slate-900">
              Payroll Records
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              {filteredPayroll.length} employee
              {filteredPayroll.length !== 1 ? "s" : ""} found
            </p>

          </div>

          {filteredPayroll.length === 0 ? (

            <div className="py-16 text-center">

              <Banknote
                size={42}
                className="mx-auto text-slate-300 mb-3"
              />

              <p className="font-medium text-slate-700">
                No payroll records found
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Try changing your search or filters.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">

                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                      Employee
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                      Department
                    </th>

                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500">
                      Basic Salary
                    </th>

                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500">
                      Allowances
                    </th>

                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500">
                      Deductions
                    </th>

                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500">
                      Net Salary
                    </th>

                    <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500">
                      Status
                    </th>

                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredPayroll.map((employee) => {

                    const netSalary = getNetSalary(employee);

                    return (
                      <tr
                        key={employee.id}
                        className="border-b border-slate-100 hover:bg-slate-50/70 transition"
                      >

                        {/* EMPLOYEE */}
                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                              <Users
                                size={18}
                                className="text-blue-600"
                              />
                            </div>

                            <div>
                              <p className="font-semibold text-slate-800">
                                {employee.employee}
                              </p>

                              <p className="text-xs text-slate-400">
                                Employee
                              </p>
                            </div>

                          </div>

                        </td>

                        {/* DEPARTMENT */}
                        <td className="px-5 py-4 text-slate-600">
                          {employee.department}
                        </td>

                        {/* BASIC */}
                        <td className="px-5 py-4 text-right text-slate-600">
                          {formatCurrency(employee.basicSalary)}
                        </td>

                        {/* ALLOWANCES */}
                        <td className="px-5 py-4 text-right text-emerald-600">
                          +{formatCurrency(employee.allowances)}
                        </td>

                        {/* DEDUCTIONS */}
                        <td className="px-5 py-4 text-right text-red-500">
                          -{formatCurrency(employee.deductions)}
                        </td>

                        {/* NET */}
                        <td className="px-5 py-4 text-right">

                          <span className="font-bold text-slate-900">
                            {formatCurrency(netSalary)}
                          </span>

                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4 text-center">

                          {employee.status === "Paid" ? (

                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">
                              <CheckCircle2 size={13} />
                              Paid
                            </span>

                          ) : (

                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-medium">
                              <Clock3 size={13} />
                              Pending
                            </span>

                          )}

                        </td>

                        {/* ACTIONS */}
                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-2">

                            <button
                              className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                              title="View Payslip"
                            >
                              <Eye size={16} />
                            </button>

                            {employee.status === "Pending" && (
                              <button
                                className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                title="Mark as Paid"
                              >
                                <CheckCircle2 size={16} />
                              </button>
                            )}

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>
    </AppLayout>
  );
}


// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  icon,
  label,
  value,
  type = "blue",
}) {

  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="surface-card p-4">

      <div
        className={`h-10 w-10 rounded-xl flex items-center justify-center ${styles[type]}`}
      >
        {icon}
      </div>

      <p className="text-xs text-slate-400 mt-3">
        {label}
      </p>

      <p className="text-2xl font-bold text-slate-900 mt-1">
        {value}
      </p>

    </div>
  );
}