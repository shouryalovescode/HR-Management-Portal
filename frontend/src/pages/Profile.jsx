import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Briefcase,
  Building2,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import AppLayout from "../components/AppLayout.jsx";
import { employeesApi } from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        if (!user?.email) {
          setProfile(user || null);
          return;
        }

        // Find the currently logged-in user in PostgreSQL
        const { data } = await employeesApi.list({
          search: user.email,
          page: 1,
          limit: 10,
        });

        const employees = Array.isArray(data)
          ? data
          : data?.users || data?.data || [];

        // Find exact email match
        const databaseUser = employees.find(
          (employee) =>
            String(employee.email || "").toLowerCase() ===
            String(user.email).toLowerCase()
        );

        if (databaseUser) {
          setProfile(databaseUser);
        } else {
          // Fallback to authentication data
          setProfile(user);
        }
      } catch (error) {
        console.error("Profile error:", error);

        toast.error(
          error?.response?.data?.message ||
            "Unable to load profile."
        );

        setProfile(user || null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <AppLayout title="Profile">
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Loader2
              size={20}
              className="animate-spin text-blue-600"
            />
            Loading profile...
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Profile">
      <div className="max-w-4xl mx-auto">

        {/* =========================
            PAGE HEADER
        ========================= */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View your employee information and account details.
          </p>
        </div>

        {/* =========================
            PROFILE HEADER
        ========================= */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
        >

          {/* Blue Header */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 relative">
            <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-16 left-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          </div>

          {/* Profile Identity */}
          <div className="px-6 sm:px-8 pb-7">

            <div className="-mt-12 relative z-10 flex flex-col sm:flex-row sm:items-end gap-4">

              <div className="
                h-24
                w-24
                rounded-2xl
                bg-white
                border-4
                border-white
                shadow-lg
                flex
                items-center
                justify-center
              ">
                <div className="
                  h-full
                  w-full
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                  text-2xl
                  font-bold
                ">
                  {getInitials(profile?.name)}
                </div>
              </div>

              <div className="pb-1">

                <h2 className="text-2xl font-bold text-slate-900">
                  {profile?.name || "User"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {profile?.email || "No email available"}
                </p>

              </div>

              <div className="sm:ml-auto pb-1">

                <span className="
                  inline-flex
                  items-center
                  gap-2
                  px-3
                  py-1.5
                  rounded-full
                  bg-emerald-50
                  text-emerald-600
                  text-xs
                  font-semibold
                ">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {String(profile?.status || "active")
                    .charAt(0)
                    .toUpperCase() +
                    String(profile?.status || "active").slice(1)}
                </span>

              </div>

            </div>
          </div>
        </motion.div>


        {/* =========================
            PERSONAL INFORMATION
        ========================= */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            shadow-sm
            p-6
            sm:p-8
            mt-5
          "
        >

          <div className="mb-6">
            <h3 className="font-semibold text-slate-900">
              Personal Information
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Information stored in the employee database.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* NAME */}
            <InfoItem
              icon={User}
              label="Full Name"
              value={profile?.name}
            />

            {/* EMAIL */}
            <InfoItem
              icon={Mail}
              label="Email Address"
              value={profile?.email}
            />

            {/* MOBILE */}
            <InfoItem
              icon={Phone}
              label="Mobile Number"
              value={profile?.mobile}
            />

            {/* AGE */}
            <InfoItem
              icon={Calendar}
              label="Age"
              value={profile?.age}
            />

            {/* DEPARTMENT */}
            <InfoItem
              icon={Building2}
              label="Department"
              value={profile?.department}
            />

            {/* DESIGNATION */}
            <InfoItem
              icon={Briefcase}
              label="Designation"
              value={profile?.designation}
            />

          </div>
        </motion.div>


        {/* =========================
            ACCOUNT INFORMATION
        ========================= */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            shadow-sm
            p-6
            sm:p-8
            mt-5
          "
        >

          <div className="mb-6">
            <h3 className="font-semibold text-slate-900">
              Account Information
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Authentication and access information.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* ROLE */}
            <InfoItem
              icon={ShieldCheck}
              label="Account Role"
              value={
                profile?.role
                  ? profile.role.charAt(0).toUpperCase() +
                    profile.role.slice(1)
                  : "User"
              }
            />

            {/* STATUS */}
            <InfoItem
              icon={ShieldCheck}
              label="Account Status"
              value={
                profile?.status
                  ? profile.status.charAt(0).toUpperCase() +
                    profile.status.slice(1)
                  : "Active"
              }
            />

          </div>

        </motion.div>


        {/* =========================
            SECURITY NOTICE
        ========================= */}
        <div className="
          mt-5
          flex
          items-center
          gap-3
          rounded-xl
          border
          border-blue-100
          bg-blue-50
          px-4
          py-3
          text-sm
          text-blue-700
        ">

          <ShieldCheck size={18} className="shrink-0" />

          <p>
            Your account is protected using JWT authentication
            and role-based access control.
          </p>

        </div>

      </div>
    </AppLayout>
  );
}


/* =========================
   INFO ITEM
========================= */

function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="
      rounded-xl
      border
      border-slate-200
      bg-slate-50
      p-4
    ">

      <div className="flex items-center gap-3">

        <div className="
          h-9
          w-9
          rounded-lg
          bg-white
          border
          border-slate-200
          flex
          items-center
          justify-center
          shrink-0
        ">
          <Icon
            size={17}
            className="text-blue-600"
          />
        </div>

        <div className="min-w-0">

          <p className="
            text-xs
            font-medium
            text-slate-500
          ">
            {label}
          </p>

          <p className="
            text-sm
            font-semibold
            text-slate-900
            mt-0.5
            truncate
          ">
            {value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
              ? value
              : "Not provided"}
          </p>

        </div>

      </div>

    </div>
  );
}