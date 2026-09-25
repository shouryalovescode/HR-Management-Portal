import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Mail,
  Lock,
  User,
  Calendar,
  Phone,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "../api/axios";

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const password = watch("password");

  // =====================================================
  // SIGNUP
  // =====================================================

  const onSubmit = async (formData) => {
    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        age: Number(formData.age),
        mobile: formData.mobile.trim(),
      };

      const { data } = await authApi.signup(payload);

      toast.success(
        data?.message || "Account created successfully!"
      );

      // Redirect to login after successful signup
      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            signupSuccess: true,
          },
        });
      }, 700);
    } catch (error) {
      console.error("Signup error:", error);

      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 409) {
        toast.error(
          message || "An account with this email already exists."
        );
      } else if (status === 400) {
        toast.error(
          message || "Please check your entered information."
        );
      } else if (status === 401) {
        toast.error(
          message || "You are not authorized to perform this action."
        );
      } else if (status >= 500) {
        toast.error(
          "Server error. Please try again later."
        );
      } else if (!error?.response) {
        toast.error(
          "Unable to connect to the server. Please check your connection."
        );
      } else {
        toast.error(
          message || "Signup failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REUSABLE INPUT ERROR
  // =====================================================

  const FieldError = ({ error }) => {
    if (!error) return null;

    return (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-1.5 text-xs font-medium text-red-600"
      >
        {error.message}
      </motion.p>
    );
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex">

      {/* =====================================================
          LEFT BRAND SECTION
      ====================================================== */}

      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-[#dff4ff] via-[#b9e8ff] to-[#8ed7f7] p-12 flex-col justify-between">

        {/* Background effects */}

        <div className="absolute inset-0 bg-white/10 pointer-events-none" />

        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/50 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#4db8e8]/20 rounded-full blur-3xl pointer-events-none" />

        {/* =================================================
            LOGO
        ================================================== */}

        <div className="relative z-10 flex items-center gap-5">

          <div className="h-20 w-20 rounded-2xl bg-white flex items-center justify-center shadow-lg overflow-hidden">

            <img
              src="/infinite-logo.png"
              alt="Infinite Computer Solutions logo"
              className="h-16 w-16 object-contain"
            />

          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Infinite
            </h1>

            <p className="text-base text-slate-700">
              Computer Solutions
            </p>
          </div>

        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================== */}

        <div className="relative z-10 max-w-lg">

          <h2 className="text-4xl font-bold leading-tight tracking-tight text-slate-900">

            Build your future,
            <br />
            with us.

          </h2>

          <p className="mt-5 text-base leading-relaxed text-slate-700 max-w-md">

            Create your employee account and access a secure,
            modern workforce management platform.

          </p>

          {/* Benefits */}

          <div className="mt-8 space-y-4">

            <div className="flex items-center gap-3 text-sm text-slate-700">

              <div className="h-8 w-8 rounded-full bg-white/70 flex items-center justify-center">
                <CheckCircle2
                  size={17}
                  className="text-[#168ac2]"
                />
              </div>

              Secure employee management

            </div>

            <div className="flex items-center gap-3 text-sm text-slate-700">

              <div className="h-8 w-8 rounded-full bg-white/70 flex items-center justify-center">
                <CheckCircle2
                  size={17}
                  className="text-[#168ac2]"
                />
              </div>

              JWT protected authentication

            </div>

            <div className="flex items-center gap-3 text-sm text-slate-700">

              <div className="h-8 w-8 rounded-full bg-white/70 flex items-center justify-center">
                <CheckCircle2
                  size={17}
                  className="text-[#168ac2]"
                />
              </div>

              Role-based access control

            </div>

          </div>

        </div>

        {/* Footer */}

        <p className="relative z-10 text-xs text-slate-600">

          © {new Date().getFullYear()} Infinite Computer Solutions.
          All rights reserved.

        </p>

      </div>

      {/* =====================================================
          RIGHT SIGNUP SECTION
      ====================================================== */}

      <div className="w-full lg:w-[55%] flex items-center justify-center px-5 sm:px-8 py-8 bg-white overflow-y-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-xl"
        >

          {/* =================================================
              MOBILE LOGO
          ================================================== */}

          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">

            <div className="h-14 w-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">

              <img
                src="/infinite-logo.png"
                alt="Infinite Computer Solutions logo"
                className="h-11 w-11 object-contain"
              />

            </div>

            <div>

              <h1 className="text-xl font-bold text-slate-900">
                Infinite
              </h1>

              <p className="text-xs text-slate-600">
                Computer Solutions
              </p>

            </div>

          </div>

          {/* =================================================
              SIGNUP CARD
          ================================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/60">

            {/* Header */}

            <div className="mb-7">

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Register to access the employee management system.
              </p>

            </div>

            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >

              {/* =================================================
                  NAME
              ================================================== */}

              <div>

                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-slate-800 mb-2"
                >
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                  />

                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    aria-invalid={errors.name ? "true" : "false"}
                    {...register("name", {
                      required: "Full name is required.",

                      minLength: {
                        value: 2,
                        message:
                          "Name must be at least 2 characters.",
                      },

                      maxLength: {
                        value: 50,
                        message:
                          "Name cannot exceed 50 characters.",
                      },

                      pattern: {
                        value: /^[A-Za-z\s.'-]+$/,
                        message:
                          "Name can contain only letters and spaces.",
                      },

                      validate: (value) =>
                        value.trim().length >= 2 ||
                        "Please enter a valid name.",
                    })}
                    className={`w-full rounded-xl border ${
                      errors.name
                        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-300 bg-slate-50 focus:border-[#168ac2] focus:ring-[#38a9df]/10"
                    } pl-11 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 placeholder:text-slate-500`}
                  />

                </div>

                <FieldError error={errors.name} />

              </div>

              {/* =================================================
                  EMAIL
              ================================================== */}

              <div>

                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-800 mb-2"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                  />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    aria-invalid={errors.email ? "true" : "false"}
                    {...register("email", {
                      required: "Email is required.",

                      pattern: {
                        value:
                          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message:
                          "Please enter a valid email address.",
                      },

                      validate: (value) =>
                        value.trim().length > 0 ||
                        "Email is required.",
                    })}
                    className={`w-full rounded-xl border ${
                      errors.email
                        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-300 bg-slate-50 focus:border-[#168ac2] focus:ring-[#38a9df]/10"
                    } pl-11 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 placeholder:text-slate-500`}
                  />

                </div>

                <FieldError error={errors.email} />

              </div>

              {/* =================================================
                  AGE + MOBILE
              ================================================== */}

              <div className="grid sm:grid-cols-2 gap-5">

                {/* AGE */}

                <div>

                  <label
                    htmlFor="age"
                    className="block text-sm font-semibold text-slate-800 mb-2"
                  >
                    Age
                  </label>

                  <div className="relative">

                    <Calendar
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    />

                    <input
                      id="age"
                      type="number"
                      min="18"
                      max="100"
                      placeholder="18 - 100"
                      {...register("age", {
                        required: "Age is required.",

                        valueAsNumber: true,

                        validate: (value) => {
                          if (Number.isNaN(value)) {
                            return "Please enter a valid age.";
                          }

                          if (!Number.isInteger(value)) {
                            return "Age must be a whole number.";
                          }

                          if (value < 18 || value > 100) {
                            return "Age must be between 18 and 100.";
                          }

                          return true;
                        },
                      })}
                      className={`w-full rounded-xl border ${
                        errors.age
                          ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-300 bg-slate-50 focus:border-[#168ac2] focus:ring-[#38a9df]/10"
                      } pl-11 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 placeholder:text-slate-500`}
                    />

                  </div>

                  <FieldError error={errors.age} />

                </div>

                {/* MOBILE */}

                <div>

                  <label
                    htmlFor="mobile"
                    className="block text-sm font-semibold text-slate-800 mb-2"
                  >
                    Mobile Number
                  </label>

                  <div className="relative">

                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    />

                    <input
                      id="mobile"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      autoComplete="tel"
                      placeholder="9876543210"
                      {...register("mobile", {
                        required: "Mobile number is required.",

                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message:
                            "Enter a valid 10-digit mobile number.",
                        },

                        validate: (value) =>
                          /^[6-9]\d{9}$/.test(
                            value.trim()
                          ) ||
                          "Enter a valid 10-digit mobile number.",
                      })}
                      onInput={(event) => {
                        event.target.value =
                          event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                      }}
                      className={`w-full rounded-xl border ${
                        errors.mobile
                          ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-300 bg-slate-50 focus:border-[#168ac2] focus:ring-[#38a9df]/10"
                      } pl-11 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 placeholder:text-slate-500`}
                    />

                  </div>

                  <FieldError error={errors.mobile} />

                </div>

              </div>

              {/* =================================================
                  PASSWORD
              ================================================== */}

              <div>

                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-800 mb-2"
                >
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    placeholder="Minimum 6 characters"
                    aria-invalid={
                      errors.password
                        ? "true"
                        : "false"
                    }
                    {...register("password", {
                      required: "Password is required.",

                      minLength: {
                        value: 6,
                        message:
                          "Password must be at least 6 characters.",
                      },

                      maxLength: {
                        value: 100,
                        message:
                          "Password cannot exceed 100 characters.",
                      },
                    })}
                    className={`w-full rounded-xl border ${
                      errors.password
                        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-300 bg-slate-50 focus:border-[#168ac2] focus:ring-[#38a9df]/10"
                    } pl-11 pr-12 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 placeholder:text-slate-500`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#168ac2] transition"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

                <FieldError error={errors.password} />

              </div>

              {/* =================================================
                  CONFIRM PASSWORD
              ================================================== */}

              <div>

                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-slate-800 mb-2"
                >
                  Confirm Password
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                  />

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    aria-invalid={
                      errors.confirmPassword
                        ? "true"
                        : "false"
                    }
                    {...register("confirmPassword", {
                      required:
                        "Please confirm your password.",

                      validate: (value) =>
                        value === password ||
                        "Passwords do not match.",
                    })}
                    className={`w-full rounded-xl border ${
                      errors.confirmPassword
                        ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-300 bg-slate-50 focus:border-[#168ac2] focus:ring-[#38a9df]/10"
                    } pl-11 pr-12 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 placeholder:text-slate-500`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#168ac2] transition"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

                <FieldError
                  error={errors.confirmPassword}
                />

              </div>

              {/* =================================================
                  SUBMIT
              ================================================== */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#168ac2] hover:bg-[#0f7eaf] py-3.5 font-semibold text-white shadow-lg shadow-[#168ac2]/20 transition disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}

              </button>

            </form>

            {/* =================================================
                LOGIN LINK
            ================================================== */}

            <div className="mt-6 text-center">

              <p className="text-sm text-slate-600">

                Already have an account?{" "}

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-semibold text-[#168ac2] hover:text-[#0f6f9d] transition"
                >
                  Sign in
                </button>

              </p>

            </div>

          </div>

          {/* =================================================
              SECURITY MESSAGE
          ================================================== */}

          <div className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-slate-600">

            <ShieldCheck size={15} />

            Secure employee management system

          </div>

        </motion.div>

      </div>

    </div>
  );
}