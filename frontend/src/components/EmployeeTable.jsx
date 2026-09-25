import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Loader2,
  ChevronDown,
} from "lucide-react";

import { TableRowSkeleton } from "./Skeleton.jsx";
import EmptyState from "./EmptyState.jsx";
import { employeesApi } from "../api/axios.js";

const ROLES = ["Supervisor", "Manager", "Executive"];

function initialsOf(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const avatarPalette = [
  "bg-primary-100 text-primary-700",
  "bg-fuchsia-100 text-fuchsia-700",
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
];

export default function EmployeeTable({
  employees = [],
  loading,
  page,
  totalPages,
  onPageChange,
  onDelete,
  onAddNew,
  onEmployeeUpdated,
}) {
  const [editingId, setEditingId] = useState(null);

  const [editValues, setEditValues] = useState({
    department: "",
    designation: "",
    role: "Executive",
  });

  const [savingId, setSavingId] = useState(null);

  // =========================================================
  // START EDIT
  // =========================================================

  const startEditing = (employee) => {
    const id = employee.id ?? employee._id;

    setEditingId(id);

    setEditValues({
      department: employee.department || "",
      designation: employee.designation || "",
      role: ROLES.includes(employee.role)
        ? employee.role
        : "Executive",
    });
  };

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const cancelEditing = () => {
    setEditingId(null);

    setEditValues({
      department: "",
      designation: "",
      role: "Executive",
    });
  };

  // =========================================================
  // SAVE EDIT
  // =========================================================

  const saveEditing = async (employee) => {
    const id = employee.id ?? employee._id;

    if (!id) {
      alert("Employee ID is missing.");
      return;
    }

    if (!editValues.department.trim()) {
      alert("Department is required.");
      return;
    }

    if (!editValues.designation.trim()) {
      alert("Designation is required.");
      return;
    }

    try {
      setSavingId(id);

      /*
       * IMPORTANT:
       * Your backend requires ALL employee fields.
       * Therefore we send the original employee data
       * plus the newly edited department/designation/role.
       */

const employeeData = {
  name: employee.name,
  email: employee.email,

  // Keep existing employee details
  age: employee.age,
  mobile: employee.mobile,

  // Save edited values
  department: editValues.department.trim(),
  designation: editValues.designation.trim(),
  role: editValues.role,

  // Keep existing status
  status: employee.status || "active",
};

      console.log("Updating employee:", id);
      console.log("Update data:", employeeData);

      const response = await employeesApi.update(
        id,
        employeeData
      );

      console.log("Update response:", response);

      const updatedEmployee =
        response?.data?.employee ||
        response?.data?.user ||
        response?.data;

      const finalEmployee = {
        ...employee,
        ...updatedEmployee,

        department: editValues.department.trim(),
        designation: editValues.designation.trim(),
        role: editValues.role,
      };

      if (onEmployeeUpdated) {
        onEmployeeUpdated(finalEmployee);
      }

      setEditingId(null);

      setEditValues({
        department: "",
        designation: "",
        role: "Executive",
      });
    } catch (error) {
      console.error(
        "UPDATE EMPLOYEE ERROR:",
        error
      );

      console.error(
        "Backend response:",
        error?.response?.data
      );

      alert(
        error?.response?.data?.message ||
          "Unable to update employee."
      );
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="surface-card overflow-hidden">

      {/* =====================================================
          TABLE
      ====================================================== */}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* =================================================
              HEADER
          ================================================= */}

          <thead className="sticky top-0 z-10 bg-gray-50/90 dark:bg-white/5 backdrop-blur">
            <tr className="text-left text-gray-400 text-xs uppercase tracking-wide">

              <th className="px-4 py-3.5 font-medium">
                Employee
              </th>

              <th className="px-4 py-3.5 font-medium">
                Department
              </th>

              <th className="px-4 py-3.5 font-medium">
                Designation
              </th>

              <th className="px-4 py-3.5 font-medium">
                Role
              </th>

              <th className="px-4 py-3.5 font-medium">
                Age
              </th>

              <th className="px-4 py-3.5 font-medium">
                Status
              </th>

              <th className="px-4 py-3.5 font-medium text-right">
                Actions
              </th>

            </tr>
          </thead>

          {/* =================================================
              BODY
          ================================================= */}

          <tbody className="divide-y divide-border dark:divide-border-dark">

            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <TableRowSkeleton
                  key={i}
                  columns={7}
                />
              ))}

            {!loading &&
              employees.map((employee, index) => {
                const id = employee.id ?? employee._id;

                const isEditing = editingId === id;
                const isSaving = savingId === id;

                return (
                  <motion.tr
                    key={id ?? index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: index * 0.03,
                    }}
                    className={`group transition-colors ${
                      isEditing
                        ? "bg-primary-50/40 dark:bg-primary-500/5"
                        : "hover:bg-primary-50/40 dark:hover:bg-white/5"
                    }`}
                  >

                    {/* =================================================
                        EMPLOYEE
                    ================================================== */}

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">

                        <div
                          className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                            avatarPalette[
                              index % avatarPalette.length
                            ]
                          }`}
                        >
                          {initialsOf(employee.name)}
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {employee.name}
                          </p>

                          <p className="text-xs text-gray-400 truncate">
                            {employee.email}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* =================================================
                        DEPARTMENT
                    ================================================== */}

                    <td className="px-4 py-3.5">

                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.department}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              department: e.target.value,
                            }))
                          }
                          className="w-full min-w-[140px] px-3 py-2 rounded-lg border border-primary-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary-200"
                        />
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          {employee.department || "—"}
                        </span>
                      )}

                    </td>

                    {/* =================================================
                        DESIGNATION
                    ================================================== */}

                    <td className="px-4 py-3.5">

                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.designation}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              designation: e.target.value,
                            }))
                          }
                          className="w-full min-w-[170px] px-3 py-2 rounded-lg border border-primary-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary-200"
                        />
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          {employee.designation || "—"}
                        </span>
                      )}

                    </td>

                    {/* =================================================
                        ROLE
                    ================================================== */}

                    <td className="px-4 py-3.5">

                      {isEditing ? (
                        <div className="relative min-w-[140px]">

                          <select
                            value={editValues.role}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                role: e.target.value,
                              }))
                            }
                            className="appearance-none w-full px-3 py-2 pr-8 rounded-lg border border-primary-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary-200 cursor-pointer"
                          >

                            {ROLES.map((role) => (
                              <option
                                key={role}
                                value={role}
                              >
                                {role}
                              </option>
                            ))}

                          </select>

                          <ChevronDown
                            size={14}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />

                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                          {employee.role || "Executive"}
                        </span>
                      )}

                    </td>

                    {/* =================================================
                        AGE
                    ================================================== */}

                    <td className="px-4 py-3.5 text-gray-500">
                      {employee.age || "—"}
                    </td>

                    {/* =================================================
                        STATUS
                    ================================================== */}

                    <td className="px-4 py-3.5">

                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                          employee.status === "inactive"
                            ? "bg-gray-100 text-gray-500"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >

                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            employee.status === "inactive"
                              ? "bg-gray-400"
                              : "bg-emerald-500"
                          }`}
                        />

                        {employee.status === "inactive"
                          ? "Inactive"
                          : "Active"}

                      </span>

                    </td>

                    {/* =================================================
                        ACTIONS
                    ================================================== */}

                    <td className="px-4 py-3.5">

                      <div className="flex items-center justify-end gap-1.5">

                        {isEditing ? (
                          <>
                            {/* SAVE */}

                            <button
                              type="button"
                              onClick={() =>
                                saveEditing(employee)
                              }
                              disabled={isSaving}
                              className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                              title="Save changes"
                            >
                              {isSaving ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <Check size={16} />
                              )}
                            </button>

                            {/* CANCEL */}

                            <button
                              type="button"
                              onClick={cancelEditing}
                              disabled={isSaving}
                              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                startEditing(employee)
                              }
                              className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                              title="Edit employee"
                            >
                              <Pencil size={15} />
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                onDelete(employee)
                              }
                              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Delete employee"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}

                      </div>

                    </td>

                  </motion.tr>
                );
              })}

          </tbody>
        </table>
      </div>

      {/* =====================================================
          EMPTY
      ====================================================== */}

      {!loading && employees.length === 0 && (
        <EmptyState
          actionLabel="Add employee"
          onAction={onAddNew}
        />
      )}

      {/* =====================================================
          PAGINATION
      ====================================================== */}

      {!loading && employees.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3.5 border-t border-border dark:border-border-dark">

          <p className="text-xs text-gray-400">
            Showing {employees.length} employees • Page{" "}
            {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() =>
                onPageChange(Math.max(1, page - 1))
              }
              disabled={page <= 1}
              className="p-2 rounded-lg border border-border text-gray-500 disabled:opacity-40 hover:border-primary-300 hover:text-primary-600 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>

            <button
              type="button"
              onClick={() =>
                onPageChange(
                  Math.min(totalPages, page + 1)
                )
              }
              disabled={page >= totalPages}
              className="p-2 rounded-lg border border-border text-gray-500 disabled:opacity-40 hover:border-primary-300 hover:text-primary-600 transition-colors"
            >
              <ChevronRight size={15} />
            </button>

          </div>

        </div>
      )}

    </div>
  );
}