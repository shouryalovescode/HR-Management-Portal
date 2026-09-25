import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock3,
  Users,
  Plus,
  Pencil,
  Trash2,
  RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";
import AppLayout from "../components/AppLayout.jsx";
import { employeesApi } from "../api/axios";
import api from "../api/axios";

export default function Attendance() {
  const today = new Date().toISOString().split("T")[0];

  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    employee_id: "",
    attendance_date: today,
    status: "present",
    check_in: "",
    check_out: "",
    notes: ""
  });

  // =====================================================
  // LOAD EMPLOYEES
  // =====================================================

  const loadEmployees = async () => {
    try {
      const { data } = await employeesApi.list({
        page: 1,
        limit: 1000
      });

      const list = Array.isArray(data)
        ? data
        : data.users || data.data || [];

      setEmployees(list);
    } catch (error) {
      console.error("Employees error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Unable to load employees."
      );
    }
  };

  // =====================================================
  // LOAD ATTENDANCE
  // =====================================================

  const loadAttendance = async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/attendance", {
        params: {
          date: selectedDate
        }
      });

      const list = Array.isArray(data)
        ? data
        : data.attendance || data.data || [];

      setAttendance(list);
    } catch (error) {
      console.error("Attendance error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to load attendance."
      );

      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [selectedDate]);

  // =====================================================
  // EMPLOYEE NAME
  // =====================================================

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(
      (item) =>
        Number(item.id ?? item._id) === Number(employeeId)
    );

    return employee?.name || "Unknown employee";
  };

  // =====================================================
  // SUMMARY
  // =====================================================

  const summary = useMemo(() => {
    return {
      total: attendance.length,

      present: attendance.filter(
        (item) => item.status === "present"
      ).length,

      absent: attendance.filter(
        (item) => item.status === "absent"
      ).length,

      late: attendance.filter(
        (item) => item.status === "late"
      ).length,

      halfDay: attendance.filter(
        (item) => item.status === "half-day"
      ).length
    };
  }, [attendance]);

  // =====================================================
  // OPEN ADD
  // =====================================================

  const openAdd = () => {
    setEditing(null);

    setForm({
      employee_id: "",
      attendance_date: selectedDate,
      status: "present",
      check_in: "",
      check_out: "",
      notes: ""
    });

    setShowForm(true);
  };

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const openEdit = (record) => {
    setEditing(record);

    setForm({
      employee_id: record.employee_id ?? "",
      attendance_date:
        record.attendance_date?.split("T")[0] ||
        selectedDate,
      status: record.status || "present",
      check_in: record.check_in || "",
      check_out: record.check_out || "",
      notes: record.notes || ""
    });

    setShowForm(true);
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const updateForm = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.employee_id) {
      toast.error("Please select an employee.");
      return;
    }

    if (!form.attendance_date) {
      toast.error("Please select a date.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        employee_id: Number(form.employee_id),
        attendance_date: form.attendance_date,
        status: form.status,
        check_in: form.check_in || null,
        check_out: form.check_out || null,
        notes: form.notes || null
      };

      if (editing) {
        await api.put(
          `/attendance/${editing.id}`,
          payload
        );

        toast.success(
          "Attendance updated successfully."
        );
      } else {
        await api.post("/attendance", payload);

        toast.success(
          "Attendance marked successfully."
        );
      }

      setShowForm(false);
      setEditing(null);

      await loadAttendance();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to save attendance."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this attendance record?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/attendance/${id}`);

      toast.success(
        "Attendance record deleted."
      );

      await loadAttendance();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to delete attendance."
      );
    }
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const statusStyle = (status) => {
    switch (status) {
      case "present":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "absent":
        return "bg-red-50 text-red-700 border-red-200";

      case "late":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "half-day":
        return "bg-orange-50 text-orange-700 border-orange-200";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <AppLayout title="Attendance">
      <div className="max-w-[1600px] mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Attendance
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Track and manage employee attendance.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="btn-primary"
          >
            <Plus size={17} />
            Mark Attendance
          </button>
        </div>

        {/* DATE + REFRESH */}
        <div className="surface-card p-4 mb-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <CalendarDays
                size={19}
                className="text-blue-600"
              />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Attendance date
              </p>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(e.target.value)
                }
                className="font-medium text-slate-800 outline-none bg-transparent"
              />
            </div>

          </div>

          <button
            onClick={loadAttendance}
            className="btn-secondary"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">

          <SummaryCard
            icon={<Users size={18} />}
            label="Records"
            value={summary.total}
          />

          <SummaryCard
            icon={<CheckCircle2 size={18} />}
            label="Present"
            value={summary.present}
            type="green"
          />

          <SummaryCard
            icon={<XCircle size={18} />}
            label="Absent"
            value={summary.absent}
            type="red"
          />

          <SummaryCard
            icon={<Clock3 size={18} />}
            label="Late"
            value={summary.late}
            type="yellow"
          />

          <SummaryCard
            icon={<Clock3 size={18} />}
            label="Half-day"
            value={summary.halfDay}
            type="orange"
          />

        </div>

        {/* FORM */}
        {showForm && (
          <div className="surface-card p-5 sm:p-6 mb-5">

            <div className="flex items-center justify-between mb-5">

              <div>
                <h2 className="font-semibold text-lg text-slate-900">
                  {editing
                    ? "Edit Attendance"
                    : "Mark Attendance"}
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Enter the attendance information below.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-700 text-xl"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >

              {/* EMPLOYEE */}
              <div>
                <label className="text-xs font-medium text-slate-600">
                  Employee
                </label>

                <select
                  value={form.employee_id}
                  onChange={(e) =>
                    updateForm(
                      "employee_id",
                      e.target.value
                    )
                  }
                  className="input-field mt-1"
                >
                  <option value="">
                    Select employee
                  </option>

                  {employees.map((employee) => (
                    <option
                      key={employee.id ?? employee._id}
                      value={employee.id ?? employee._id}
                    >
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE */}
              <div>
                <label className="text-xs font-medium text-slate-600">
                  Date
                </label>

                <input
                  type="date"
                  value={form.attendance_date}
                  onChange={(e) =>
                    updateForm(
                      "attendance_date",
                      e.target.value
                    )
                  }
                  className="input-field mt-1"
                />
              </div>

              {/* STATUS */}
              <div>
                <label className="text-xs font-medium text-slate-600">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    updateForm(
                      "status",
                      e.target.value
                    )
                  }
                  className="input-field mt-1"
                >
                  <option value="present">
                    Present
                  </option>

                  <option value="absent">
                    Absent
                  </option>

                  <option value="late">
                    Late
                  </option>

                  <option value="half-day">
                    Half-day
                  </option>
                </select>
              </div>

              {/* CHECK IN */}
              <div>
                <label className="text-xs font-medium text-slate-600">
                  Check-in
                </label>

                <input
                  type="time"
                  value={form.check_in}
                  onChange={(e) =>
                    updateForm(
                      "check_in",
                      e.target.value
                    )
                  }
                  className="input-field mt-1"
                />
              </div>

              {/* CHECK OUT */}
              <div>
                <label className="text-xs font-medium text-slate-600">
                  Check-out
                </label>

                <input
                  type="time"
                  value={form.check_out}
                  onChange={(e) =>
                    updateForm(
                      "check_out",
                      e.target.value
                    )
                  }
                  className="input-field mt-1"
                />
              </div>

              {/* NOTES */}
              <div>
                <label className="text-xs font-medium text-slate-600">
                  Notes
                </label>

                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) =>
                    updateForm(
                      "notes",
                      e.target.value
                    )
                  }
                  placeholder="Optional notes"
                  className="input-field mt-1"
                />
              </div>

              {/* BUTTONS */}
              <div className="md:col-span-2 flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1"
                >
                  {saving
                    ? "Saving..."
                    : editing
                    ? "Save Changes"
                    : "Mark Attendance"}
                </button>

              </div>

            </form>
          </div>
        )}

        {/* TABLE */}
        <div className="surface-card overflow-hidden">

          <div className="p-5 border-b border-slate-200">

            <h2 className="font-semibold text-slate-900">
              Attendance Records
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Records for {selectedDate}
            </p>

          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">
              Loading attendance...
            </div>
          ) : attendance.length === 0 ? (
            <div className="py-16 text-center">

              <CalendarDays
                size={38}
                className="mx-auto text-slate-300 mb-3"
              />

              <p className="font-medium text-slate-700">
                No attendance records
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Mark attendance for employees to see records here.
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
                      Date
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                      Status
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                      Check-in
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                      Check-out
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                      Notes
                    </th>

                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {attendance.map((record) => (

                    <tr
                      key={record.id}
                      className="border-b border-slate-100 hover:bg-slate-50/70"
                    >

                      <td className="px-5 py-4 font-medium text-slate-800">
                        {getEmployeeName(
                          record.employee_id
                        )}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {record.attendance_date?.split("T")[0] ||
                          record.attendance_date}
                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-medium capitalize ${statusStyle(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {record.check_in || "—"}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {record.check_out || "—"}
                      </td>

                      <td className="px-5 py-4 text-slate-500 max-w-[200px] truncate">
                        {record.notes || "—"}
                      </td>

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              openEdit(record)
                            }
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(record.id)
                            }
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

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
  type = "blue"
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    yellow: "bg-amber-50 text-amber-600",
    orange: "bg-orange-50 text-orange-600"
  };

  return (
    <div className="surface-card p-4">

      <div
        className={`h-9 w-9 rounded-lg flex items-center justify-center ${styles[type]}`}
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