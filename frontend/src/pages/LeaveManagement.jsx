import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  CalendarDays,
  Plus,
  Search,
  X,
  Check,
  XCircle,
  Trash2,
  Clock3,
  FileText,
  User,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import AppLayout from "../components/AppLayout.jsx";
import api from "../api/axios";


// =====================================================
// MAIN COMPONENT
// =====================================================

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ===================================================
  // HOVER CALENDAR STATE
  // ===================================================

  const [hoveredLeave, setHoveredLeave] = useState(null);

  const [calendarPosition, setCalendarPosition] = useState({
    top: 0,
    left: 0,
  });

  const hideCalendarTimer = useRef(null);

  // ===================================================
  // FORM
  // ===================================================

  const [form, setForm] = useState({
    employee: "",
    leaveType: "Casual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // ===================================================
  // LOAD LEAVES
  // ===================================================

  const loadLeaves = async () => {
    setLoading(true);

    try {
      const response = await api.get("/leaves");

      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : data?.leaves ||
          data?.data ||
          data?.rows ||
          [];

      setLeaves(list);
    } catch (error) {
      console.error("Failed to load leaves:", error);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // LOAD EMPLOYEES
  // ===================================================

const loadEmployees = async () => {
  try {
    const { data } = await api.get("/users", {
      params: {
        page: 1,
        limit: 1000,
      },
    });

    console.log("EMPLOYEE DATA:", data);

    const list = Array.isArray(data)
      ? data
      : data?.users ||
        data?.data ||
        [];

    console.log("EMPLOYEE LIST:", list);

    setEmployees(list);
  } catch (error) {
    console.error(
      "Failed to load employees:",
      error?.response?.data || error.message
    );

    setEmployees([]);
  }
};

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    loadLeaves();
    loadEmployees();

    return () => {
      if (hideCalendarTimer.current) {
        clearTimeout(hideCalendarTimer.current);
      }
    };
  }, []);

  // ===================================================
  // CALENDAR HOVER
  // ===================================================

  const showCalendar = (event, leave) => {
    if (hideCalendarTimer.current) {
      clearTimeout(hideCalendarTimer.current);
      hideCalendarTimer.current = null;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    const popupWidth = 340;
    const popupHeight = 420;

    let left = rect.left;
    let top = rect.bottom + 10;

    if (left + popupWidth > window.innerWidth - 15) {
      left = window.innerWidth - popupWidth - 15;
    }

    if (top + popupHeight > window.innerHeight - 15) {
      top = rect.top - popupHeight - 10;
    }

    if (top < 15) {
      top = 15;
    }

    if (left < 15) {
      left = 15;
    }

    setCalendarPosition({
      top,
      left,
    });

    setHoveredLeave(leave);
  };

  const hideCalendar = () => {
    if (hideCalendarTimer.current) {
      clearTimeout(hideCalendarTimer.current);
    }

    hideCalendarTimer.current = setTimeout(() => {
      setHoveredLeave(null);
      hideCalendarTimer.current = null;
    }, 500);
  };

  const keepCalendarOpen = () => {
    if (hideCalendarTimer.current) {
      clearTimeout(hideCalendarTimer.current);
      hideCalendarTimer.current = null;
    }
  };

  // ===================================================
  // FORM HANDLERS
  // ===================================================

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      employee: "",
      leaveType: "Casual Leave",
      startDate: "",
      endDate: "",
      reason: "",
    });
  };

  // ===================================================
  // CREATE LEAVE
  // ===================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.employee.trim() ||
      !form.startDate ||
      !form.endDate ||
      !form.reason.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      alert("End date cannot be before start date.");
      return;
    }

    setSaving(true);

    try {
      await api.post("/leaves", {
        employee: form.employee.trim(),
        leaveType: form.leaveType,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason.trim(),
        status: "Pending",
      });

      alert("Leave request submitted successfully.");

      resetForm();
      setShowForm(false);

      await loadLeaves();
    } catch (error) {
      console.error("Create leave error:", error);

      alert(
        error?.response?.data?.message ||
          "Unable to submit leave request."
      );
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // UPDATE STATUS
  // ===================================================

  const updateStatus = async (leave, status) => {
    const id = leave.id ?? leave._id;

    if (!id) {
      alert("Leave ID is missing.");
      return;
    }

    try {
      await api.put(`/leaves/${id}`, {
        status,
      });

      await loadLeaves();
    } catch (error) {
      console.error("Status update error:", error);

      alert(
        error?.response?.data?.message ||
          "Unable to update leave status."
      );
    }
  };

  // ===================================================
  // DELETE
  // ===================================================

  const deleteLeave = async (leave) => {
    const id = leave.id ?? leave._id;

    if (!id) {
      alert("Leave ID is missing.");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this leave request?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/leaves/${id}`);

      await loadLeaves();
    } catch (error) {
      console.error("Delete leave error:", error);

      alert(
        error?.response?.data?.message ||
          "Unable to delete leave."
      );
    }
  };

  // ===================================================
  // FILTER
  // ===================================================

  const filteredLeaves = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leaves.filter((leave) => {
      const employee =
        leave.employee ||
        leave.employeeName ||
        leave.name ||
        "";

      const type =
        leave.leaveType ||
        leave.leave_type ||
        "";

      const status =
        leave.status ||
        "Pending";

      const matchesSearch =
        !query ||
        String(employee)
          .toLowerCase()
          .includes(query) ||
        String(type)
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        String(status).toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [leaves, search, statusFilter]);

  // ===================================================
  // STATISTICS
  // ===================================================

  const total = leaves.length;

  const pending = leaves.filter(
    (leave) =>
      String(
        leave.status || "Pending"
      ).toLowerCase() === "pending"
  ).length;

  const approved = leaves.filter(
    (leave) =>
      String(
        leave.status || ""
      ).toLowerCase() === "approved"
  ).length;

  const rejected = leaves.filter(
    (leave) =>
      String(
        leave.status || ""
      ).toLowerCase() === "rejected"
  ).length;

  // ===================================================
  // UI
  // ===================================================

  return (
    <AppLayout title="Leave Management">

      <div className="max-w-[1600px] mx-auto">

        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Leave Management
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage employee leave requests and approvals.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <Plus size={17} />
            Apply Leave
          </button>

        </div>

        {/* STAT CARDS */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">

          <StatCard
            icon={<FileText size={19} />}
            title="Total Requests"
            value={total}
            color="blue"
          />

          <StatCard
            icon={<Clock3 size={19} />}
            title="Pending"
            value={pending}
            color="amber"
          />

          <StatCard
            icon={<Check size={19} />}
            title="Approved"
            value={approved}
            color="green"
          />

          <StatCard
            icon={<XCircle size={19} />}
            title="Rejected"
            value={rejected}
            color="red"
          />

        </div>

        {/* SEARCH */}

        <div className="surface-card p-4 mb-5">

          <div className="flex flex-col lg:flex-row gap-3">

            <div className="relative flex-1">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search employee or leave type..."
                className="input-field pl-10"
              />

            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="input-field lg:w-48"
            >
              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Rejected">
                Rejected
              </option>
            </select>

            <button
              onClick={loadLeaves}
              className="btn-secondary"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

          </div>

        </div>

        {/* FORM */}

        {showForm && (
          <div className="surface-card p-5 sm:p-6 mb-5">

            <div className="flex items-center justify-between mb-5">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Apply for Leave
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Submit a new employee leave request.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X size={19} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >

              {/* EMPLOYEE NAME */}

              <div>

                <label className="text-xs font-medium text-slate-600">
                  Employee Name *
                </label>

                <div className="relative">

                  <User
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none"
                  />

                  <select
                    value={form.employee}
                    onChange={(e) =>
                      updateForm(
                        "employee",
                        e.target.value
                      )
                    }
                    className="input-field pl-10 mt-1 w-full"
                    required
                  >

                    <option value="">
                      Select employee
                    </option>

                    {employees.map(
                      (employee, index) => {
                        const name =
                          employee.name ||
                          employee.employee_name ||
                          employee.employeeName ||
                          employee.full_name ||
                          employee.fullName;

                        if (!name) {
                          return null;
                        }

                        return (
                          <option
                            key={
                              employee.id ||
                              employee._id ||
                              index
                            }
                            value={name}
                          >
                            {name}
                          </option>
                        );
                      }
                    )}

                  </select>

                </div>

              </div>

              {/* LEAVE TYPE */}

              <div>

                <label className="text-xs font-medium text-slate-600">
                  Leave Type *
                </label>

                <select
                  value={form.leaveType}
                  onChange={(e) =>
                    updateForm(
                      "leaveType",
                      e.target.value
                    )
                  }
                  className="input-field mt-1"
                >

                  <option>
                    Casual Leave
                  </option>

                  <option>
                    Sick Leave
                  </option>

                  <option>
                    Earned Leave
                  </option>

                  <option>
                    Annual Leave
                  </option>

                  <option>
                    Maternity Leave
                  </option>

                  <option>
                    Paternity Leave
                  </option>

                  <option>
                    Emergency Leave
                  </option>

                </select>

              </div>

              {/* START DATE */}

              <div>

                <label className="text-xs font-medium text-slate-600">
                  Start Date *
                </label>

                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    updateForm(
                      "startDate",
                      e.target.value
                    )
                  }
                  className="input-field mt-1"
                  required
                />

              </div>

              {/* END DATE */}

              <div>

                <label className="text-xs font-medium text-slate-600">
                  End Date *
                </label>

                <input
                  type="date"
                  value={form.endDate}
                  min={
                    form.startDate ||
                    undefined
                  }
                  onChange={(e) =>
                    updateForm(
                      "endDate",
                      e.target.value
                    )
                  }
                  className="input-field mt-1"
                  required
                />

              </div>

              {/* REASON */}

              <div className="md:col-span-2">

                <label className="text-xs font-medium text-slate-600">
                  Reason *
                </label>

                <textarea
                  value={form.reason}
                  onChange={(e) =>
                    updateForm(
                      "reason",
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Enter reason for leave..."
                  className="input-field mt-1 resize-none"
                  required
                />

              </div>

              {/* BUTTONS */}

              <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1"
                >

                  {saving ? (
                    <>
                      <RefreshCw
                        size={16}
                        className="animate-spin"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CalendarDays size={16} />
                      Submit Leave Request
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>
        )}

        {/* TABLE */}

        <div className="surface-card overflow-visible">

          <div className="p-5 border-b border-slate-200">

            <h2 className="font-semibold text-slate-900">
              Leave Requests
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              {filteredLeaves.length} request
              {filteredLeaves.length !== 1
                ? "s"
                : ""}
            </p>

          </div>

          {loading ? (

            <div className="py-16 flex justify-center">

              <div className="flex items-center gap-3 text-sm text-slate-500">

                <RefreshCw
                  size={18}
                  className="animate-spin"
                />

                Loading leave requests...

              </div>

            </div>

          ) : filteredLeaves.length === 0 ? (

            <div className="py-16 text-center">

              <CalendarDays
                size={42}
                className="mx-auto text-slate-300 mb-3"
              />

              <p className="font-medium text-slate-700">
                No leave requests found
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Apply for a leave to see it here.
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
                      Leave Type
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                      Duration
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                      Reason
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                      Status
                    </th>

                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredLeaves.map(
                    (leave) => {

                      const id =
                        leave.id ??
                        leave._id;

                      const employeeRecord = employees.find(
  (emp) =>
    String(emp.id ?? emp._id) ===
    String(leave.employee ?? leave.employee_id)
);

const employee =
  leave.employeeName ||
  leave.employee_name ||
  employeeRecord?.name ||
  leave.employee ||
  leave.name ||
  "Unknown Employee";

                      const leaveType =
                        leave.leaveType ||
                        leave.leave_type ||
                        "Leave";

                      const start =
                        leave.startDate ||
                        leave.start_date;

                      const end =
                        leave.endDate ||
                        leave.end_date;

                      const status =
                        leave.status ||
                        "Pending";

                      return (

                        <tr
                          key={id}
                          className="border-b border-slate-100 hover:bg-slate-50/70 transition"
                        >

                          {/* EMPLOYEE */}

                          <td className="px-5 py-4">

                            <div
                              className="flex items-center gap-3"
                              onMouseEnter={(event) => {
                                if (start && end) {
                                  showCalendar(
                                    event,
                                    leave
                                  );
                                }
                              }}
                              onMouseLeave={
                                hideCalendar
                              }
                            >

                              <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center">

                                <User
                                  size={16}
                                  className="text-blue-600"
                                />

                              </div>

                              <div>

                                <p className="font-medium text-slate-800 cursor-pointer hover:text-blue-600 transition-colors">
                                  {employee}
                                </p>

                                <p className="text-xs text-slate-400">
                                  Employee
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* TYPE */}

                          <td className="px-5 py-4">

                            <span className="font-medium text-slate-700">
                              {leaveType}
                            </span>

                          </td>

                          {/* DURATION */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2 text-slate-600">

                              <CalendarDays
                                size={15}
                              />

                              <span>
                                {formatDate(start)}
                              </span>

                              <span className="text-slate-300">
                                →
                              </span>

                              <span>
                                {formatDate(end)}
                              </span>

                            </div>

                          </td>

                          {/* REASON */}

                          <td className="px-5 py-4 max-w-[280px]">

                            <span className="text-slate-500">
                              {leave.reason ||
                                "No reason provided"}
                            </span>

                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">

                            <StatusBadge
                              status={status}
                            />

                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-4">

                            <div className="flex justify-end gap-1">

                              {String(status).toLowerCase() ===
                                "pending" && (
                                <>

                                  <button
                                    onClick={() =>
                                      updateStatus(
                                        leave,
                                        "Approved"
                                      )
                                    }
                                    className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-50"
                                    title="Approve"
                                  >
                                    <Check
                                      size={16}
                                    />
                                  </button>

                                  <button
                                    onClick={() =>
                                      updateStatus(
                                        leave,
                                        "Rejected"
                                      )
                                    }
                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                                    title="Reject"
                                  >
                                    <XCircle
                                      size={16}
                                    />
                                  </button>

                                </>
                              )}

                              <button
                                onClick={() =>
                                  deleteLeave(leave)
                                }
                                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                                title="Delete"
                              >
                                <Trash2
                                  size={16}
                                />
                              </button>

                            </div>

                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* =================================================
          FIXED CALENDAR POPUP
          ================================================= */}

      {hoveredLeave && (

        <div
          className="fixed z-[99999]"
          style={{
            top: calendarPosition.top,
            left: calendarPosition.left,
          }}
          onMouseEnter={keepCalendarOpen}
          onMouseLeave={hideCalendar}
        >

          <LeaveCalendarPopup
            employee={
              hoveredLeave.employee ||
              hoveredLeave.employeeName ||
              hoveredLeave.name ||
              "Unknown Employee"
            }
            startDate={
              hoveredLeave.startDate ||
              hoveredLeave.start_date
            }
            endDate={
              hoveredLeave.endDate ||
              hoveredLeave.end_date
            }
          />

        </div>

      )}

    </AppLayout>
  );
}


// =====================================================
// CALENDAR POPUP
// =====================================================

function LeaveCalendarPopup({
  employee,
  startDate,
  endDate,
}) {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  const [month, setMonth] = useState(
    new Date(
      start.getFullYear(),
      start.getMonth(),
      1
    )
  );

  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const firstDay = new Date(
    year,
    monthIndex,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    monthIndex + 1,
    0
  ).getDate();

  const previousMonth = () => {
    setMonth(
      new Date(
        year,
        monthIndex - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setMonth(
      new Date(
        year,
        monthIndex + 1,
        1
      )
    );
  };

  const isLeaveDay = (day) => {
    const current = new Date(
      year,
      monthIndex,
      day
    );

    return (
      current >= start &&
      current <= end
    );
  };

  // ===================================================
  // NATIONAL HOLIDAYS
  // ===================================================

  const getHoliday = (day) => {

    if (
      monthIndex === 0 &&
      day === 26
    ) {
      return "Republic Day";
    }

    if (
      monthIndex === 7 &&
      day === 15
    ) {
      return "Independence Day";
    }

    if (
      monthIndex === 9 &&
      day === 2
    ) {
      return "Gandhi Jayanti";
    }

    return null;
  };

  const monthName =
    month.toLocaleDateString(
      "en-IN",
      {
        month: "long",
        year: "numeric",
      }
    );

  const calendarDays = [];

  for (
    let i = 0;
    i < firstDay;
    i++
  ) {
    calendarDays.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    calendarDays.push(day);
  }

  return (

    <div
      className="
        w-[340px]
        rounded-2xl
        bg-white
        border
        border-slate-200
        shadow-[0_20px_60px_rgba(15,23,42,0.25)]
        p-5
      "
    >

      {/* HEADER */}

      <div className="flex items-center justify-between mb-4">

        <div>

          <p className="text-[11px] uppercase tracking-wider font-semibold text-blue-500">
            Leave Calendar
          </p>

          <p className="font-bold text-slate-900 mt-1">
            {employee}
          </p>

        </div>

        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">

          <CalendarDays
            size={20}
            className="text-blue-600"
          />

        </div>

      </div>

      {/* MONTH */}

      <div className="flex items-center justify-between mb-4">

        <button
          onClick={previousMonth}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100"
        >
          <ChevronLeft size={17} />
        </button>

        <p className="font-bold text-sm text-slate-800">
          {monthName}
        </p>

        <button
          onClick={nextMonth}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100"
        >
          <ChevronRight size={17} />
        </button>

      </div>

      {/* WEEK DAYS */}

      <div className="grid grid-cols-7 mb-1">

        {[
          "S",
          "M",
          "T",
          "W",
          "T",
          "F",
          "S",
        ].map((day, index) => (

          <div
            key={`${day}-${index}`}
            className="h-8 flex items-center justify-center text-[10px] font-bold text-slate-400"
          >
            {day}
          </div>

        ))}

      </div>

      {/* DAYS */}

      <div className="grid grid-cols-7 gap-1">

        {calendarDays.map(
          (day, index) => {

            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className="h-9"
                />
              );
            }

            const leaveDay =
              isLeaveDay(day);

            const holiday =
              getHoliday(day);

            return (

              <div
                key={day}
                title={
                  holiday ||
                  (leaveDay
                    ? "Employee is on leave"
                    : "")
                }
                className={`
                  h-9
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  text-xs
                  font-semibold
                  ${
                    leaveDay
                      ? "bg-red-500 text-white"
                      : holiday
                      ? "bg-blue-500 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }
                `}
              >
                {day}
              </div>

            );
          }
        )}

      </div>

      {/* LEGEND */}

      <div className="border-t border-slate-100 mt-4 pt-3">

        <div className="flex items-center gap-5 text-[11px] text-slate-500">

          <div className="flex items-center gap-2">

            <span className="h-3 w-3 rounded bg-red-500" />

            Employee Leave

          </div>

          <div className="flex items-center gap-2">

            <span className="h-3 w-3 rounded bg-blue-500" />

            National Holiday

          </div>

        </div>

        <div className="mt-3 text-[10px] text-slate-400">

          Leave:

          <span className="font-medium text-slate-500 ml-1">
            {formatDate(startDate)}
          </span>

          <span className="mx-1">
            →
          </span>

          <span className="font-medium text-slate-500">
            {formatDate(endDate)}
          </span>

        </div>

      </div>

    </div>
  );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  icon,
  title,
  value,
  color,
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };

  return (

    <div className="surface-card p-4">

      <div
        className={`h-10 w-10 rounded-xl flex items-center justify-center ${colors[color]}`}
      >
        {icon}
      </div>

      <p className="text-xs text-slate-400 mt-3">
        {title}
      </p>

      <p className="text-2xl font-bold text-slate-900 mt-1">
        {value}
      </p>

    </div>
  );
}


// =====================================================
// STATUS
// =====================================================

function StatusBadge({ status }) {
  const normalized =
    String(status).toLowerCase();

  let classes =
    "bg-amber-50 text-amber-600";

  if (normalized === "approved") {
    classes =
      "bg-emerald-50 text-emerald-600";
  }

  if (normalized === "rejected") {
    classes =
      "bg-red-50 text-red-600";
  }

  return (

    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        px-2.5
        py-1
        rounded-full
        text-xs
        font-medium
        ${classes}
      `}
    >

      <span className="h-1.5 w-1.5 rounded-full bg-current" />

      {status}

    </span>
  );
}


// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = parseLocalDate(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


// =====================================================
// SAFE DATE PARSER
// =====================================================

function parseLocalDate(value) {
  if (value instanceof Date) {
    return new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate()
    );
  }

  const stringValue = String(value);

  // PostgreSQL DATE: YYYY-MM-DD
  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      stringValue
    )
  ) {
    const [
      year,
      month,
      day,
    ] = stringValue
      .split("-")
      .map(Number);

    return new Date(
      year,
      month - 1,
      day
    );
  }

  const date = new Date(value);

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}