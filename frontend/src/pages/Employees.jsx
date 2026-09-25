import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Users,
  UserCheck,
  UserMinus
} from "lucide-react";
import toast from "react-hot-toast";

import AppLayout from "../components/AppLayout.jsx";
import EmployeeForm from "../components/EmployeeForm.jsx";
import EmployeeTable from "../components/EmployeeTable.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { employeesApi } from "../api/axios";

const PAGE_SIZE = 8;

export default function Employees() {

  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);


  // ============================================================
  // FETCH EMPLOYEES
  // ============================================================

  const fetchEmployees = useCallback(async () => {

    setLoading(true);

    try {

      const { data } = await employeesApi.list({
        search: search || undefined,
        page,
        limit: PAGE_SIZE
      });


      // Backend response:
      //
      // {
      //   users: [],
      //   totalUsers: 11,
      //   totalPages: 2,
      //   currentPage: 1
      // }

      const list = Array.isArray(data)
        ? data
        : data.users || data.data || [];


      setEmployees(list);


      // IMPORTANT:
      // Backend uses "totalUsers", not "total"
      const backendTotal =
        data.totalUsers ??
        data.total ??
        data.count ??
        list.length;


      setTotal(Number(backendTotal));


    } catch (err) {

      console.error("Fetch employees error:", err);

      toast.error(
        err?.response?.data?.message ||
        "Couldn't load employees. Is the backend running?"
      );

      setEmployees([]);

      setTotal(0);

    } finally {

      setLoading(false);

    }

  }, [search, page]);


  // ============================================================
  // LOAD EMPLOYEES
  // ============================================================

  useEffect(() => {

    fetchEmployees();

  }, [fetchEmployees]);


  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE)
  );


  // ============================================================
  // ADD EMPLOYEE
  // ============================================================

  const openAddForm = () => {

    setEditing(null);
    setShowForm(true);

  };


  // ============================================================
  // EDIT EMPLOYEE
  // ============================================================

  const openEditForm = (employee) => {

    setEditing(employee);
    setShowForm(true);

  };


  // ============================================================
  // SUBMIT EMPLOYEE
  // ============================================================

  const handleSubmit = async (values) => {

    setSubmitting(true);

    try {

      if (editing) {

        await employeesApi.update(
          editing.id ?? editing._id,
          values
        );

        toast.success(
          "Employee updated successfully."
        );

      } else {

        await employeesApi.create(values);

        toast.success(
          "Employee added successfully."
        );

        // After adding a new employee,
        // go to the last page so the new record
        // can be seen immediately.
        setPage(1);
      }


      setShowForm(false);
      setEditing(null);

      await fetchEmployees();


    } catch (err) {

      console.error("Employee save error:", err);

      toast.error(
        err?.response?.data?.message ||
        `Couldn't ${
          editing ? "update" : "add"
        } employee. Please try again.`
      );

    } finally {

      setSubmitting(false);

    }

  };


  // ============================================================
  // DELETE EMPLOYEE
  // ============================================================

  const confirmDelete = async () => {

    if (!deleteTarget) return;

    setDeleting(true);

    try {

      await employeesApi.remove(
        deleteTarget.id ?? deleteTarget._id
      );

      toast.success(
        `${deleteTarget.name || "Employee"} removed.`
      );

      setDeleteTarget(null);


      // If deleting the last item on a page,
      // move back one page.
      if (
        employees.length === 1 &&
        page > 1
      ) {

        setPage((currentPage) => currentPage - 1);

      } else {

        await fetchEmployees();

      }


    } catch (err) {

      console.error("Delete employee error:", err);

      toast.error(
        err?.response?.data?.message ||
        "Couldn't delete employee."
      );

    } finally {

      setDeleting(false);

    }

  };


  // ============================================================
  // COUNTS
  // ============================================================

  const activeCount = employees.filter(
    (employee) =>
      employee.status !== "inactive"
  ).length;


  const inactiveCount =
    employees.length - activeCount;


  // ============================================================
  // UI
  // ============================================================

  return (

    <AppLayout title="Employees">

      <div className="flex flex-col gap-6">


        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>

            <h2 className="text-2xl font-bold tracking-tight">
              Employees
            </h2>

            <p className="text-sm text-gray-600 mt-1">
              Manage your team's records, roles, and status.
            </p>

          </div>


          <button
            onClick={openAddForm}
            className="btn-primary self-start sm:self-auto"
          >

            <Plus size={17} />

            Add Employee

          </button>

        </div>


        {/* ======================================================
            SEARCH + COUNTS
        ====================================================== */}

        <div className="flex flex-wrap items-center gap-3">

          <div className="relative flex-1 min-w-[220px] max-w-sm">

            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"
            />

            <input
              value={search}
              onChange={(event) => {

                setPage(1);

                setSearch(event.target.value);

              }}
              placeholder="Search by name, email, or department..."
              className="w-full rounded-xl2 border border-border bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
            />

          </div>


          {/* TOTAL */}

          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full bg-blue-50 text-blue-700">

            <Users size={13} />

            {total} total

          </span>


          {/* ACTIVE */}

          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full bg-emerald-50 text-emerald-700">

            <UserCheck size={13} />

            {activeCount} active

          </span>


          {/* INACTIVE */}

          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full bg-gray-100 text-gray-700">

            <UserMinus size={13} />

            {inactiveCount} inactive

          </span>

        </div>


        {/* ======================================================
            EMPLOYEE FORM
        ====================================================== */}

        <AnimatePresence mode="wait">

          {showForm && (

            <EmployeeForm

              key={
                editing?.id ??
                editing?._id ??
                "new"
              }

              defaultValues={
                editing
                  ? {
                      ...editing,
                      id:
                        editing.id ??
                        editing._id
                    }
                  : null
              }

              onSubmit={handleSubmit}

              onCancel={() => {

                setShowForm(false);
                setEditing(null);

              }}

              submitting={submitting}

            />

          )}

        </AnimatePresence>


        {/* ======================================================
            TABLE
        ====================================================== */}

        <EmployeeTable

          employees={employees}

          loading={loading}

          page={page}

          totalPages={totalPages}

          onPageChange={setPage}

          onEdit={openEditForm}

          onDelete={setDeleteTarget}

          onAddNew={openAddForm}

       onEmployeeUpdated={(updatedEmployee) => {
  setEmployees((prev) =>
    prev.map((employee) =>
      (employee.id ?? employee._id) ===
      (updatedEmployee.id ?? updatedEmployee._id)
        ? { ...employee, ...updatedEmployee }
        : employee
    )
  );
}}
        />

      </div>


      {/* ========================================================
          DELETE CONFIRMATION
      ======================================================== */}

      <ConfirmModal

        open={Boolean(deleteTarget)}

        title="Delete employee"

        message={`This will permanently remove ${
          deleteTarget?.name ||
          "this employee"
        } from your records.`}

        loading={deleting}

        onConfirm={confirmDelete}

        onCancel={() =>
          setDeleteTarget(null)
        }

      />

    </AppLayout>

  );

}