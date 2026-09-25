import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  X,
  Save,
  Loader2,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar
} from "lucide-react";

function Field({ label, error, icon: Icon, children }) {
  return (
    <div className="relative">
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
        )}

        {children}

        <label className="absolute -top-2 left-10 bg-white px-1 text-xs font-medium text-slate-700">
          {label}
        </label>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-red-500"
        >
          {error.message}
        </motion.p>
      )}
    </div>
  );
}

export default function EmployeeForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitting
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValues || {
      name: "",
      email: "",
      mobile: "",
      department: "",
      designation: "",
      age: "",
      status: "active"
    }
  });

  useEffect(() => {
    reset(
      defaultValues || {
        name: "",
        email: "",
        mobile: "",
        department: "",
        designation: "",
        age: "",
        status: "active"
      }
    );
  }, [defaultValues, reset]);

  const isEdit = Boolean(defaultValues?.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {isEdit ? "Edit employee" : "Add employee"}
          </h2>

          <p className="text-sm text-slate-600 mt-1">
            {isEdit
              ? "Update the employee's information below."
              : "Enter the employee's information below."}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
          aria-label="Close form"
        >
          <X size={19} />
        </button>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6"
        noValidate
      >
        {/* FULL NAME */}
        <Field
          label="Full name"
          error={errors.name}
          icon={User}
        >
          <input
            type="text"
            {...register("name", {
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters"
              }
            })}
            placeholder="Full name"
            className={`w-full rounded-xl border ${
              errors.name
                ? "border-red-400 bg-red-50"
                : "border-slate-300 bg-white"
            } pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#168ac2] focus:ring-4 focus:ring-[#168ac2]/10`}
          />
        </Field>

        {/* EMAIL */}
        <Field
          label="Email address"
          error={errors.email}
          icon={Mail}
        >
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address"
              }
            })}
            placeholder="Email address"
            className={`w-full rounded-xl border ${
              errors.email
                ? "border-red-400 bg-red-50"
                : "border-slate-300 bg-white"
            } pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#168ac2] focus:ring-4 focus:ring-[#168ac2]/10`}
          />
        </Field>

        {/* MOBILE */}
        <Field
          label="Mobile number"
          error={errors.mobile}
          icon={Phone}
        >
          <input
            type="tel"
            {...register("mobile", {
              required: "Mobile number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter a valid 10-digit mobile number"
              }
            })}
            placeholder="Mobile number"
            maxLength={10}
            className={`w-full rounded-xl border ${
              errors.mobile
                ? "border-red-400 bg-red-50"
                : "border-slate-300 bg-white"
            } pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#168ac2] focus:ring-4 focus:ring-[#168ac2]/10`}
          />
        </Field>

        {/* DEPARTMENT */}
        <Field
          label="Department"
          error={errors.department}
          icon={Building2}
        >
          <input
            type="text"
            {...register("department", {
              required: "Department is required",
              minLength: {
                value: 2,
                message: "Department must be at least 2 characters"
              }
            })}
            placeholder="Department"
            className={`w-full rounded-xl border ${
              errors.department
                ? "border-red-400 bg-red-50"
                : "border-slate-300 bg-white"
            } pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#168ac2] focus:ring-4 focus:ring-[#168ac2]/10`}
          />
        </Field>

        {/* DESIGNATION */}
        <Field
          label="Designation"
          error={errors.designation}
          icon={Briefcase}
        >
          <input
            type="text"
            {...register("designation", {
              required: "Designation is required",
              minLength: {
                value: 2,
                message: "Designation must be at least 2 characters"
              }
            })}
            placeholder="Designation"
            className={`w-full rounded-xl border ${
              errors.designation
                ? "border-red-400 bg-red-50"
                : "border-slate-300 bg-white"
            } pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#168ac2] focus:ring-4 focus:ring-[#168ac2]/10`}
          />
        </Field>

        {/* AGE */}
        <Field
          label="Age"
          error={errors.age}
          icon={Calendar}
        >
          <input
            type="number"
            {...register("age", {
              required: "Age is required",
              valueAsNumber: true,
              min: {
                value: 18,
                message: "Age must be at least 18"
              },
              max: {
                value: 100,
                message: "Enter a valid age"
              }
            })}
            placeholder="Age"
            className={`w-full rounded-xl border ${
              errors.age
                ? "border-red-400 bg-red-50"
                : "border-slate-300 bg-white"
            } pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#168ac2] focus:ring-4 focus:ring-[#168ac2]/10`}
          />
        </Field>

        {/* STATUS */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Status
          </label>

          <select
            {...register("status")}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#168ac2] focus:ring-4 focus:ring-[#168ac2]/10"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* BUTTONS */}
        <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-800 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#168ac2] hover:bg-[#0f7eaf] px-5 py-3 font-semibold text-white shadow-lg shadow-[#168ac2]/20 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                {isEdit ? "Save changes" : "Add employee"}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}