import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Globe2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

/* ============================================================
   GLOBAL PRESENCE
============================================================ */

function GlobalPresence() {
  return (
    <section className="relative w-full overflow-hidden bg-[#17377d] text-white">

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 py-20 sm:px-10 lg:px-16">

        {/* Heading */}
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Global Presence
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Engineering Without Borders
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-blue-100 sm:text-lg">
            Connecting people, technology and innovation across the globe.
            Our international presence enables us to deliver digital
            engineering solutions wherever our customers are.
          </p>
        </div>

        {/* MAP */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#193b82] shadow-2xl">

          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative min-h-[600px] lg:min-h-[680px]">

            <svg
              viewBox="0 0 1400 650"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid meet"
            >

              {/* North America */}
              <path
                d="M80 150 L130 90 L205 65 L280 75 L330 120 L315 170 L340 205 L305 235 L265 215 L245 255 L205 235 L185 205 L145 195 L115 165Z"
                fill="#2943b5"
              />

              {/* Greenland */}
              <path
                d="M350 55 L410 30 L465 55 L455 105 L405 130 L365 105Z"
                fill="#2943b5"
              />

              {/* Central America */}
              <path
                d="M255 245 L285 260 L300 300 L280 330 L265 305 L255 275Z"
                fill="#2943b5"
              />

              {/* South America */}
              <path
                d="M320 315 L370 330 L395 375 L380 430 L355 485 L320 540 L295 495 L305 450 L285 410 L295 365Z"
                fill="#2943b5"
              />

              {/* Europe */}
              <path
                d="M555 155 L600 125 L650 130 L690 150 L680 180 L645 195 L615 180 L580 195 L550 180Z"
                fill="#2943b5"
              />

              {/* Africa */}
              <path
                d="M590 225 L650 215 L700 250 L715 305 L690 365 L650 425 L615 400 L595 350 L570 305Z"
                fill="#2943b5"
              />

              {/* Asia */}
              <path
                d="M690 145 L760 110 L850 115 L930 135 L1010 165 L1080 195 L1050 240 L990 245 L950 275 L880 260 L820 235 L760 220 L700 190Z"
                fill="#2943b5"
              />

              {/* India */}
              <path
                d="M820 250 L850 260 L865 290 L845 330 L820 305 L810 275Z"
                fill="#3151c5"
              />

              {/* Southeast Asia */}
              <path
                d="M900 285 L950 300 L975 335 L950 350 L925 330 L900 315Z"
                fill="#2943b5"
              />

              {/* Japan */}
              <path
                d="M1045 240 L1060 255 L1050 280 L1035 265Z"
                fill="#2943b5"
              />

              {/* Australia */}
              <path
                d="M1010 420 L1080 395 L1150 410 L1180 450 L1150 485 L1080 500 L1025 470Z"
                fill="#2943b5"
              />

              {/* New Zealand */}
              <path
                d="M1190 470 L1210 490 L1195 510 L1180 495Z"
                fill="#2943b5"
              />

              {/* Connection lines */}
              <path
                d="M250 245 Q550 120 825 285"
                fill="none"
                stroke="#27b8ff"
                strokeWidth="2"
                strokeDasharray="7 8"
                opacity="0.5"
              />

              <path
                d="M825 285 Q950 210 1080 445"
                fill="none"
                stroke="#27b8ff"
                strokeWidth="2"
                strokeDasharray="7 8"
                opacity="0.5"
              />

              <path
                d="M825 285 Q700 190 600 160"
                fill="none"
                stroke="#27b8ff"
                strokeWidth="2"
                strokeDasharray="7 8"
                opacity="0.5"
              />

              <path
                d="M825 285 Q780 390 1050 445"
                fill="none"
                stroke="#27b8ff"
                strokeWidth="2"
                strokeDasharray="7 8"
                opacity="0.4"
              />

            </svg>

            {/* USA */}
            <div className="absolute left-[19%] top-[36%] group">
              <div className="relative">
                <div className="absolute -inset-2 animate-ping rounded-full bg-cyan-400/30" />
                <div className="relative h-4 w-4 rounded-full border-2 border-white bg-cyan-300 shadow-lg" />
              </div>

              <div className="absolute left-6 top-0 hidden whitespace-nowrap rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#17377d] shadow-xl group-hover:block">
                USA — Headquarters
              </div>
            </div>

            {/* Europe */}
            <div className="absolute left-[44%] top-[28%] group">
              <div className="relative">
                <div className="absolute -inset-2 animate-ping rounded-full bg-cyan-400/30" />
                <div className="relative h-4 w-4 rounded-full border-2 border-white bg-cyan-300 shadow-lg" />
              </div>

              <div className="absolute left-6 top-0 hidden whitespace-nowrap rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#17377d] shadow-xl group-hover:block">
                Europe — Munich
              </div>
            </div>

            {/* India */}
            <div className="absolute left-[59%] top-[44%] group">
              <div className="relative">
                <div className="absolute -inset-2 animate-ping rounded-full bg-orange-400/30" />
                <div className="relative h-5 w-5 rounded-full border-2 border-white bg-orange-400 shadow-xl" />
              </div>

              <div className="absolute left-7 top-0 hidden whitespace-nowrap rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#17377d] shadow-xl group-hover:block">
                India — Head Office
              </div>
            </div>

            {/* Singapore */}
            <div className="absolute left-[67%] top-[51%] group">
              <div className="relative">
                <div className="absolute -inset-2 animate-ping rounded-full bg-cyan-400/30" />
                <div className="relative h-4 w-4 rounded-full border-2 border-white bg-cyan-300 shadow-lg" />
              </div>

              <div className="absolute left-6 top-0 hidden whitespace-nowrap rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#17377d] shadow-xl group-hover:block">
                Singapore
              </div>
            </div>

            {/* Australia */}
            <div className="absolute left-[76%] top-[69%] group">
              <div className="relative">
                <div className="absolute -inset-2 animate-ping rounded-full bg-cyan-400/30" />
                <div className="relative h-4 w-4 rounded-full border-2 border-white bg-cyan-300 shadow-lg" />
              </div>

              <div className="absolute left-6 top-0 hidden whitespace-nowrap rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#17377d] shadow-xl group-hover:block">
                Australia
              </div>
            </div>

            {/* Right locations */}
            <div className="absolute right-6 top-8 bottom-8 hidden w-64 lg:block">
              <div className="flex h-full items-center border-l border-cyan-300/40 pl-7">

                <div className="space-y-7">

                  <div>
                    <h3 className="text-lg font-bold">USA</h3>
                    <p className="mt-1 text-sm text-orange-300">
                      • Maryland — Headquarters
                    </p>
                    <p className="mt-1 text-sm text-blue-100">Atlanta</p>
                    <p className="text-sm text-blue-100">Chicago</p>
                    <p className="text-sm text-blue-100">Dallas</p>
                    <p className="text-sm text-blue-100">Las Vegas</p>
                    <p className="text-sm text-blue-100">St. Louis</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">Canada</h3>
                    <p className="mt-1 text-sm text-blue-100">Toronto</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">Central America</h3>
                    <p className="mt-1 text-sm text-blue-100">
                      San José, Costa Rica
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">South America</h3>
                    <p className="mt-1 text-sm text-blue-100">Colombia</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">Europe</h3>
                    <p className="mt-1 text-sm text-blue-100">
                      Munich, Germany
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">India</h3>
                    <p className="mt-1 text-sm text-orange-300">
                      • Bengaluru — Head Office
                    </p>
                    <p className="mt-1 text-sm text-blue-100">Chennai</p>
                    <p className="text-sm text-blue-100">Dehradun</p>
                    <p className="text-sm text-blue-100">Gurugram</p>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
            <p className="text-3xl font-bold">20+</p>
            <p className="mt-1 text-sm text-blue-200">
              Years of Experience
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
            <p className="text-3xl font-bold">25+</p>
            <p className="mt-1 text-sm text-blue-200">
              Global Locations
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
            <p className="text-3xl font-bold">100+</p>
            <p className="mt-1 text-sm text-blue-200">
              Enterprise Clients
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
            <p className="text-3xl font-bold">24/7</p>
            <p className="mt-1 text-sm text-blue-200">
              Global Support
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}


/* ============================================================
   FOOTER
============================================================ */

function InfiniteFooter() {
  return (
    <footer className="w-full bg-[#17377d] text-white">

      <div className="mx-auto max-w-[1250px] px-8 py-16">

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}
          <div>

            <img
              src="/infinite-logo.png"
              alt="Infinite Computer Solutions"
              className="h-20 w-20 object-contain brightness-0 invert"
            />

            <h3 className="mt-5 max-w-[270px] text-xl font-bold leading-7">
              Take the first step towards
              <br />
              a digitally engineered
              <br />
              tomorrow
            </h3>

            <button
              type="button"
              onClick={() =>
                toast("Contact section coming soon.")
              }
              className="mt-6 inline-flex items-center gap-3 rounded-lg bg-[#ff5b35] px-8 py-4 font-semibold text-white transition-all hover:bg-[#ff704d] hover:-translate-y-0.5 hover:shadow-lg"
            >
              Get In Touch
              <span className="text-2xl leading-none">›</span>
            </button>

            <div className="mt-7 flex items-center gap-3">

              {["in", "𝕏", "◎", "f", "▶"].map(
                (icon, index) => (
                  <button
                    key={index}
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-sm font-semibold text-white/80 transition-all hover:border-white hover:bg-white/10 hover:text-white"
                  >
                    {icon}
                  </button>
                )
              )}

            </div>

          </div>


          {/* NAVIGATION */}
          <div>

            <h4 className="text-base font-bold uppercase tracking-wide">
              Navigation
            </h4>

            <div className="mt-5 space-y-4 text-sm text-blue-100">

              <p className="cursor-pointer text-[#ff5b35]">
                Home
              </p>

              <p className="cursor-pointer hover:text-white">
                Industries
              </p>

              <p className="cursor-pointer hover:text-white">
                Solutions
              </p>

              <p className="cursor-pointer hover:text-white">
                About Us
              </p>

              <p className="cursor-pointer hover:text-white">
                News & Events
              </p>

              <p className="cursor-pointer hover:text-white">
                Resources
              </p>

              <p className="cursor-pointer hover:text-white">
                Careers
              </p>

            </div>

          </div>


          {/* WHAT WE DO */}
          <div>

            <h4 className="text-base font-bold uppercase tracking-wide">
              What We Do
            </h4>

            <div className="mt-5 space-y-4 text-sm text-blue-100">

              <p className="cursor-pointer hover:text-white">
                Application Services
              </p>

              <p className="cursor-pointer hover:text-white">
                Artificial Intelligence
              </p>

              <p className="cursor-pointer hover:text-white">
                Cloud & Infrastructure
              </p>

              <p className="cursor-pointer hover:text-white">
                Cybersecurity
              </p>

              <p className="cursor-pointer hover:text-white">
                Data & Analytics
              </p>

              <p className="cursor-pointer hover:text-white">
                Digital Engineering Services
              </p>

              <p className="cursor-pointer hover:text-white">
                Intelligent Automation
              </p>

              <p className="cursor-pointer hover:text-white">
                Quality Engineering
              </p>

            </div>

          </div>


          {/* LEGAL */}
          <div>

            <h4 className="text-base font-bold uppercase tracking-wide">
              Legal
            </h4>

            <div className="mt-5 space-y-4 text-sm text-blue-100">

              <p className="cursor-pointer hover:text-white">
                Privacy Policy
              </p>

              <p className="cursor-pointer hover:text-white">
                Terms of Use
              </p>

              <p className="cursor-pointer hover:text-white">
                Vulnerability Disclosure Policy
              </p>

            </div>

          </div>

        </div>


        {/* DIVIDER */}
        <div className="mt-10 border-t border-white/15" />

        {/* COPYRIGHT */}
        <div className="pt-5 text-center">
          <p className="text-xs text-blue-100">
            © {new Date().getFullYear()} Infinite Computer Solutions.
            All Rights Reserved.
          </p>
        </div>

      </div>

    </footer>
  );
}


/* ============================================================
   LOGIN PAGE
============================================================ */

export default function Login() {

  const { login, loading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const onSubmit = async ({ email, password }) => {

    const result = await login(email, password);

    if (result.success) {

      toast.success("Welcome back!");

      navigate(
        location.state?.from?.pathname || "/dashboard",
        { replace: true }
      );

    } else {

      toast.error(
        result.message || "Invalid email or password."
      );

    }
  };


  return (
    <>
      {/* =====================================================
          LOGIN PAGE
      ====================================================== */}

      <div className="min-h-screen bg-white text-slate-900 flex">

        {/* LEFT SIDE */}
        <div
          className="
            hidden lg:flex
            lg:w-[54%]
            relative
            overflow-hidden
            bg-gradient-to-br
            from-[#e9f8ff]
            via-[#c7edff]
            to-[#8ed7f7]
            px-12
            py-10
            flex-col
          "
        >

          <div className="absolute inset-0 bg-white/10 pointer-events-none" />

          <div className="absolute -top-40 -left-32 h-[500px] w-[500px] rounded-full bg-white/50 blur-3xl pointer-events-none" />

          <div className="absolute -bottom-48 -right-40 h-[550px] w-[550px] rounded-full bg-[#38a9df]/20 blur-3xl pointer-events-none" />

          <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl pointer-events-none" />


          {/* LOGO */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex items-center gap-4"
          >

            <div className="h-[72px] w-[72px] rounded-2xl bg-white/95 backdrop-blur flex items-center justify-center shadow-xl shadow-slate-900/10 overflow-hidden">

              <img
                src="/infinite-logo.png"
                alt="Infinite Computer Solutions"
                className="h-16 w-16 object-contain"
              />

            </div>

            <div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Infinite
              </h1>

              <p className="text-sm font-medium tracking-wide text-slate-600">
                COMPUTER SOLUTIONS
              </p>

            </div>

          </motion.div>


          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.15,
            }}
            className="relative z-10 mt-12"
          >

            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/35 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">

              <Sparkles size={13} />

              DIGITAL ENGINEERING

            </div>


            <h2 className="mt-5 text-[52px] leading-[1.04] font-bold tracking-[-2px] text-slate-900">

              Digitally
              <br />

              <span className="text-[#087eb4]">
                Engineering,
              </span>

              <br />

              Tomorrow, Today.

            </h2>


            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600">
              Building future-ready enterprises through innovation
              and strategic partnerships.
            </p>


            <div className="mt-7 inline-flex items-center gap-3 rounded-xl border border-white/60 bg-white/35 backdrop-blur-md px-4 py-3 shadow-sm">

              <div className="h-9 w-9 rounded-lg bg-white/70 flex items-center justify-center">

                <ShieldCheck
                  size={19}
                  className="text-[#087eb4]"
                />

              </div>

              <div>

                <p className="text-xs font-semibold text-slate-700">
                  Secure Enterprise Access
                </p>

                <p className="text-[11px] text-slate-500 mt-0.5">
                  JWT authentication & role-based control
                </p>

              </div>

            </div>

          </motion.div>


          {/* COMPANY OVERVIEW */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.3,
            }}
            className="relative z-10 mt-auto pt-8"
          >

            <div className="border-t border-slate-900/10 pt-7">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500">
                    About Infinite
                  </p>

                  <h3 className="mt-1 text-2xl font-bold text-slate-900">
                    Company Overview
                  </h3>

                </div>

                <div className="h-10 w-10 rounded-full bg-white/50 backdrop-blur flex items-center justify-center">

                  <ArrowUpRight
                    size={18}
                    className="text-[#087eb4]"
                  />

                </div>

              </div>


              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
                Infinite is a global leader in digital engineering and IT
                services, with over two decades of experience helping clients
                turn digital transformation into business value. We partner
                with customers to optimize, modernize and scale their
                technology landscape – combining leading technologies,
                innovative platforms and accelerators with practical
                know-how. With an industry-first mindset and laser-focus on
                business outcomes, we are shaping the future with digital
                engineering excellence.
              </p>


              <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">

                <div className="rounded-xl border border-white/60 bg-white/35 backdrop-blur-md px-4 py-3">

                  <p className="text-2xl font-bold text-slate-900">
                    20+
                  </p>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Years of Experience
                  </p>

                </div>


                <div className="rounded-xl border border-white/60 bg-white/35 backdrop-blur-md px-4 py-3">

                  <div className="flex items-center gap-2">

                    <Globe2
                      size={17}
                      className="text-[#087eb4]"
                    />

                    <p className="text-2xl font-bold text-slate-900">
                      Global
                    </p>

                  </div>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Digital Engineering
                  </p>

                </div>

              </div>

            </div>


            <div className="mt-7 flex items-center justify-between">

              <p className="text-[11px] text-slate-500">
                © {new Date().getFullYear()} Infinite Computer Solutions
              </p>

              <p className="text-[11px] text-slate-500">
                All rights reserved.
              </p>

            </div>

          </motion.div>

        </div>


        {/* RIGHT LOGIN */}
        <div className="w-full lg:w-[46%] min-h-screen flex items-center justify-center px-6 sm:px-10 py-10 bg-white">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-md"
          >

            {/* MOBILE LOGO */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-10">

              <div className="h-16 w-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">

                <img
                  src="/infinite-logo.png"
                  alt="Infinite Computer Solutions"
                  className="h-12 w-12 object-contain"
                />

              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-900">
                  Infinite
                </h1>

                <p className="text-sm text-slate-500">
                  Computer Solutions
                </p>

              </div>

            </div>


            {/* HEADER */}
            <div className="mb-8">

              <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#168ac2]">
                Employee Portal
              </p>

              <h2 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to manage your team.
              </p>

            </div>


            {/* LOGIN CARD */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >

                {/* EMAIL */}
                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="you@company.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                    className={`w-full rounded-xl border ${
                      errors.email
                        ? "border-red-400 bg-red-50"
                        : "border-slate-200 bg-slate-50"
                    } px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#38a9df] focus:ring-4 focus:ring-[#38a9df]/10`}
                  />

                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-xs text-red-500"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}

                </div>


                {/* PASSWORD */}
                <div>

                  <div className="flex items-center justify-between mb-2">

                    <label className="text-sm font-medium text-slate-700">
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        toast("Password reset is not configured yet.")
                      }
                      className="text-xs font-medium text-[#168ac2] hover:text-[#0f6f9d]"
                    >
                      Forgot password?
                    </button>

                  </div>


                  <div className="relative">

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message:
                            "Password must be at least 6 characters",
                        },
                      })}
                      className={`w-full rounded-xl border ${
                        errors.password
                          ? "border-red-400 bg-red-50"
                          : "border-slate-200 bg-slate-50"
                      } px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#38a9df] focus:ring-4 focus:ring-[#38a9df]/10`}
                    />


                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#168ac2]"
                    >

                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}

                    </button>

                  </div>


                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-xs text-red-500"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}

                </div>


                {/* REMEMBER */}
                <label className="flex items-center gap-3 text-sm text-slate-500 cursor-pointer">

                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-[#168ac2]"
                  />

                  Remember me

                </label>


                {/* LOGIN */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#168ac2] hover:bg-[#0f7eaf] py-3.5 font-semibold text-white shadow-lg shadow-[#168ac2]/20 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
                >

                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}

                </button>

              </form>


              {/* SIGN UP */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center text-sm text-slate-500">

                Don't have an account?{" "}

                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="font-semibold text-[#168ac2] hover:text-[#0f6f9d]"
                >
                  Sign up
                </button>

              </div>

            </div>


            {/* SECURITY */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">

              <ShieldCheck size={15} />

              Secure employee management system

            </div>

          </motion.div>

        </div>

      </div>


      {/* =====================================================
          GLOBAL MAP
      ====================================================== */}

      <GlobalPresence />


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <InfiniteFooter />

    </>
  );
}