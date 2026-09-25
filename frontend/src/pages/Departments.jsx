import React, { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  X,
  Save,
  RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";
import AppLayout from "../components/AppLayout.jsx";
import api from "../api/axios";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    head: ""
  });

  // =====================================================
  // LOAD DEPARTMENTS
  // =====================================================

  const loadDepartments = async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/api/departments");

      const list = Array.isArray(data)
        ? data
        : data.departments || data.data || [];

      setDepartments(list);
    } catch (error) {
      console.error("Departments error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to load departments."
      );

      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD EMPLOYEES
  // =====================================================

  const loadEmployees = async () => {
    try {
      const { data } = await api.get("/users", {
        params: {
          page: 1,
          limit: 1000
        }
      });

      const list = Array.isArray(data)
        ? data
        : data.users || data.data || [];

      setEmployees(list);
    } catch (error) {
      console.error("Employees error:", error);
      setEmployees([]);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadDepartments();
    loadEmployees();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredDepartments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return departments;
    }

    return departments.filter((department) =>
      String(
        department.name ||
          department.department_name ||
          ""
      )
        .toLowerCase()
        .includes(query)
    );
  }, [departments, search]);

  // =====================================================
  // EMPLOYEE COUNT
  // =====================================================

  const getEmployeeCount = (departmentName) => {
    if (!departmentName) {
      return 0;
    }

    return employees.filter(
      (employee) =>
        String(employee.department || "")
          .trim()
          .toLowerCase() ===
        String(departmentName)
          .trim()
          .toLowerCase()
    ).length;
  };

  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const openAdd = () => {
    setEditing(null);

    setForm({
      name: "",
      description: "",
      head: ""
    });

    setShowForm(true);
  };

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const openEdit = (department) => {
    setEditing(department);

    setForm({
      name:
        department.name ||
        department.department_name ||
        "",

      description:
        department.description || "",

      head:
        department.head ||
        department.department_head ||
        ""
    });

    setShowForm(true);
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  // =====================================================
  // CLOSE FORM
  // =====================================================

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);

    setForm({
      name: "",
      description: "",
      head: ""
    });
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) {
      toast.error("Department name is required.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name,
        description: form.description.trim(),
        head: form.head.trim()
      };

      // UPDATE
      if (editing) {
        const id = editing.id ?? editing._id;

        await api.put(
          `/api/departments/${id}`,
          payload
        );

        toast.success(
          "Department updated successfully."
        );
      }

      // CREATE
      else {
        await api.post(
          "/api/departments",
          payload
        );

        toast.success(
          "Department added successfully."
        );
      }

      closeForm();

      await loadDepartments();
    } catch (error) {
      console.error(
        "Save department error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to save department."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const deleteDepartment = async (department) => {
    const id = department.id ?? department._id;

    if (!id) {
      toast.error("Department ID is missing.");
      return;
    }

    const name =
      department.name ||
      department.department_name ||
      "this department";

    const confirmed = window.confirm(
      `Delete ${name}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/api/departments/${id}`
      );

      toast.success(
        "Department deleted successfully."
      );

      await loadDepartments();
    } catch (error) {
      console.error(
        "Delete department error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to delete department."
      );
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <AppLayout title="Departments">

      <div className="max-w-[1600px] mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Departments
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage your organization's departments.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="btn-primary"
          >
            <Plus size={17} />
            Add Department
          </button>

        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">

          <SummaryCard
            icon={<Building2 size={19} />}
            label="Total Departments"
            value={departments.length}
            type="blue"
          />

          <SummaryCard
            icon={<Users size={19} />}
            label="Employees"
            value={employees.length}
            type="green"
          />

          <SummaryCard
            icon={<Building2 size={19} />}
            label="Active Departments"
            value={departments.length}
            type="purple"
          />

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="surface-card p-4 mb-5">

          <div className="relative max-w-md">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search departments..."
              className="input-field pl-10"
            />

          </div>

        </div>

        {/* =================================================
            ADD / EDIT FORM
        ================================================= */}

        {showForm && (
          <div className="surface-card p-5 sm:p-6 mb-5">

            <div className="flex items-center justify-between mb-5">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editing
                    ? "Edit Department"
                    : "Add Department"}
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Enter department information below.
                </p>
              </div>

              <button
                onClick={closeForm}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >

              {/* NAME */}

              <div>
                <label className="text-xs font-medium text-slate-600">
                  Department Name
                </label>

                <input
                  value={form.name}
                  onChange={(e) =>
                    updateForm(
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Engineering"
                  className="input-field mt-1"
                />
              </div>

              {/* HEAD */}

              <div>
                <label className="text-xs font-medium text-slate-600">
                  Department Head
                </label>

                <input
                  value={form.head}
                  onChange={(e) =>
                    updateForm(
                      "head",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Rahul Sharma"
                  className="input-field mt-1"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">

                <label className="text-xs font-medium text-slate-600">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    updateForm(
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Describe this department..."
                  rows={4}
                  className="input-field mt-1 resize-none"
                />

              </div>

              {/* BUTTONS */}

              <div className="md:col-span-2 flex gap-3">

                <button
                  type="button"
                  onClick={closeForm}
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />

                      {editing
                        ? "Save Changes"
                        : "Add Department"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>
        )}

        {/* =================================================
            DEPARTMENT DIRECTORY
        ================================================= */}

        <div className="surface-card overflow-hidden">

          <div className="p-5 border-b border-slate-200">

            <h2 className="font-semibold text-slate-900">
              Department Directory
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              {filteredDepartments.length} department
              {filteredDepartments.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>

          </div>

          {/* LOADING */}

          {loading ? (
            <div className="py-16 text-center">

              <RefreshCw
                size={25}
                className="mx-auto text-blue-600 animate-spin mb-3"
              />

              <p className="text-sm text-slate-500">
                Loading departments...
              </p>

            </div>
          ) : filteredDepartments.length === 0 ? (

            /* EMPTY */

            <div className="py-16 text-center">

              <Building2
                size={40}
                className="mx-auto text-slate-300 mb-3"
              />

              <p className="font-medium text-slate-700">
                No departments found
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Add your first department to get started.
              </p>

              <button
                onClick={openAdd}
                className="btn-primary mt-4"
              >
                <Plus size={16} />
                Add Department
              </button>

            </div>

          ) : (

            /* TABLE */

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>

                  <tr className="bg-slate-50 border-b border-slate-200">

                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                      Department
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                      Department Head
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                      Description
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">
                      Employees
                    </th>

                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredDepartments.map(
                    (department) => {

                      const id =
                        department.id ??
                        department._id;

                      const name =
                        department.name ||
                        department.department_name ||
                        "Unnamed";

                      const head =
                        department.head ||
                        department.department_head ||
                        "Not assigned";

                      return (
                        <tr
                          key={id}
                          className="border-b border-slate-100 hover:bg-slate-50/70 transition"
                        >

                          {/* DEPARTMENT */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">

                                <Building2
                                  size={18}
                                  className="text-blue-600"
                                />

                              </div>

                              <div>

                                <p className="font-semibold text-slate-800">
                                  {name}
                                </p>

                                <p className="text-xs text-slate-400">
                                  Department
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* HEAD */}

                          <td className="px-5 py-4 text-slate-600">
                            {head}
                          </td>

                          {/* DESCRIPTION */}

                          <td className="px-5 py-4 text-slate-500 max-w-[350px]">

                            <span className="line-clamp-2">
                              {department.description ||
                                "No description"}
                            </span>

                          </td>

                          {/* EMPLOYEES */}

                          <td className="px-5 py-4">

                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">

                              <Users size={13} />

                              {getEmployeeCount(name)}

                            </span>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-4">

                            <div className="flex justify-end gap-2">

                              <button
                                onClick={() =>
                                  openEdit(
                                    department
                                  )
                                }
                                className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                title="Edit"
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                onClick={() =>
                                  deleteDepartment(
                                    department
                                  )
                                }
                                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                                title="Delete"
                              >
                                <Trash2 size={16} />
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
    purple: "bg-purple-50 text-purple-600"
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