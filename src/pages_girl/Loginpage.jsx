// ============================================================
// FILE: Loginpage.jsx
// DESCRIPTION: Unicode University — Secure Login Portal
// SUPPORTS: Admin (via env vars) + Student (via Supabase auth)
// FALLBACK: Admin can log in even when Supabase is down
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight,
  Shield, BookOpen, Users, Award, ChevronLeft, ChevronRight,
  AlertCircle, CheckCircle, Loader2, WifiOff,
} from "lucide-react";




/* ============================================================
   SECTION 1 — CONFIG & CONSTANTS
   ============================================================ */

// Admin credentials — stored in .env for security
const ADMIN_EMAIL    = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase();
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD?.trim();

// Warn in development if env vars are missing
if (import.meta.env.DEV) {
  if (!ADMIN_EMAIL)    console.warn("⚠️  VITE_ADMIN_EMAIL is not set in .env");
  if (!ADMIN_PASSWORD) console.warn("⚠️  VITE_ADMIN_PASSWORD is not set in .env");
}




/* ============================================================
   SECTION 2 — STATIC DATA
   ============================================================ */

// Feature carousel — rotates every 4 seconds
const features = [
  {
    icon: BookOpen,
    title: "Course Registration",
    description: "Register and manage your courses seamlessly each semester.",
  },
  {
    icon: Award,
    title: "Results & Transcripts",
    description: "Access your grades, CGPA trends, and download transcripts.",
  },
  {
    icon: Users,
    title: "Student Community",
    description: "Connect with peers, join groups, and collaborate on projects.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Enterprise-grade encryption protects all your academic data.",
  },
];

// Stats shown at the bottom of the branding panel
const stats = [
  { value: "15K+", label: "Students"      },
  { value: "500+", label: "Courses"       },
  { value: "98%",  label: "Satisfaction"  },
  { value: "50+",  label: "Departments"   },
];




/* ============================================================
   SECTION 3 — HELPER UTILITY
   ============================================================ */

/**
 * Checks if an error is a network/connectivity issue.
 * Used to decide when to use the local admin fallback login.
 */
function isNetworkError(error) {
  if (!error) return false;
  const msg = error.message?.toLowerCase() ?? "";
  return (
    msg.includes("failed to fetch")  ||
    msg.includes("network")          ||
    msg.includes("timeout")          ||
    msg.includes("err_connection")
  );
}




/* ============================================================
   SECTION 4 — MAIN LOGIN PAGE COMPONENT
   ============================================================ */
export default function Loginpage() {

  const navigate = useNavigate();


  // ── 4A — FORM STATE ─────────────────────────────────────
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [loading,      setLoading]      = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState("");
  const [focusedField, setFocusedField] = useState(null);


  // ── 4B — UI STATE ───────────────────────────────────────
  const [currentFeature, setCurrentFeature] = useState(0);
  const [mousePosition,  setMousePosition]  = useState({ x: 0, y: 0 });
  const [isOffline,      setIsOffline]      = useState(!navigator.onLine);




  // ── 4C — ONLINE / OFFLINE DETECTION ─────────────────────
  useEffect(() => {
    const goOnline  = () => { setIsOffline(false); setError(""); };
    const goOffline = () => setIsOffline(true);

    window.addEventListener("online",  goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online",  goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);


  // ── 4D — AUTO-ROTATE FEATURE CAROUSEL ──────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);


  // ── 4E — MOUSE PARALLAX EFFECT ─────────────────────────
  useEffect(() => {
    const handleMouse = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth  - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);




  // ── 4F — REDIRECT AFTER SUCCESSFUL LOGIN ───────────────
  const redirectAfterLogin = (role, userEmail) => {
    localStorage.setItem("user", JSON.stringify({ email: userEmail, role }));

    setSuccess(
      role === "admin"
        ? "Login successful! Redirecting to Admin Dashboard..."
        : "Login successful! Redirecting..."
    );

    setTimeout(() => navigate(role === "admin" ? "/admin" : "/dashboard"), 1200);
  };




  // ── 4G — HANDLE LOGIN SUBMIT ───────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Guard: env vars not configured
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      setError(
        "Server configuration error: admin credentials not set. Contact IT support."
      );
      setLoading(false);
      return;
    }

    // Guard: device is offline
    if (isOffline) {
      setError("You appear to be offline. Please check your internet connection.");
      setLoading(false);
      return;
    }

    const trimmedEmail    = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Admin local check (no network needed if Supabase fails)
    const isAdminCredentials =
      trimmedEmail    === ADMIN_EMAIL &&
      trimmedPassword === ADMIN_PASSWORD;

    try {
      // Step 1: Attempt Supabase authentication
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email:    trimmedEmail,
        password: trimmedPassword,
      });

      // Step 2: Supabase is unreachable — fallback for admin
      if (authError && isNetworkError(authError)) {
        console.warn("⚠️  Supabase unreachable — using local credential check.");

        if (isAdminCredentials) {
          redirectAfterLogin("admin", trimmedEmail);
          return;
        }

        setError(
          "Cannot reach the server. Please check your internet connection or try again later."
        );
        return;
      }

      // Step 3: Supabase returned a known auth error
      if (authError) {
        const friendlyErrors = {
          "Invalid login credentials":
            "Incorrect email or password. Please try again.",
          "Email not confirmed":
            "Please verify your email address before logging in.",
          "Too many requests":
            "Too many login attempts. Please wait a few minutes.",
        };

        setError(
          friendlyErrors[authError.message] ??
            authError.message ??
            "Login failed. Please try again."
        );
        return;
      }

      // Step 4: Supabase auth succeeded
      const user = data?.user;

      if (!user) {
        setError("Login failed: no user returned. Please try again.");
        return;
      }

      // Determine role
      const userEmailNorm = user.email?.trim().toLowerCase();
      const role = userEmailNorm === ADMIN_EMAIL ? "admin" : "student";

      redirectAfterLogin(role, user.email);

    } catch (err) {
      // Catch-all: unexpected JavaScript errors
      console.error("❌ Unexpected login error:", err);

      if (isNetworkError(err)) {
        if (isAdminCredentials) {
          redirectAfterLogin("admin", trimmedEmail);
          return;
        }
        setError(
          "Cannot connect to the server. Please check your internet and try again."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };




  /* ==========================================================
     SECTION 4H — RENDER
     ========================================================== */
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 font-sans overflow-hidden">



      {/* ================================================
          LEFT PANEL — University Branding
          Only visible on desktop (lg screens and up)
          ================================================ */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between overflow-hidden">

        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#040e1d] via-[#07162d] to-[#0c2340]" />

        {/* Parallax decorative orbs — follow mouse movement */}
        <motion.div
          animate={{ x: mousePosition.x, y: mousePosition.y }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-screen filter blur-[120px] opacity-[0.07]" />
          <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[140px] opacity-[0.06]" />
          <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-cyan-400 rounded-full mix-blend-screen filter blur-[100px] opacity-[0.04]" />
        </motion.div>

        {/* Grid texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* ── Logo ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 p-8 flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <GraduationCap className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">Unicode</h2>
            <p className="text-blue-300/60 text-[10px] uppercase tracking-[0.2em] font-medium">
              University
            </p>
          </div>
        </motion.div>

        {/* ── Center content: headline + description ── */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* Animated accent line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-8"
            />

            <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white leading-tight mb-6">
              Your Academic
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Journey Starts
              </span>
              <br />
              Here.
            </h1>

            <p className="text-slate-400 text-lg max-w-lg leading-relaxed mb-10">
              Access course registration, results, timetables, and everything
              you need — all in one secure portal built for Unicode University
              students and staff.
            </p>
          </motion.div>

          {/* ── Feature Carousel ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="relative"
          >
            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 max-w-lg">

              {/* Animated feature card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-start gap-4"
                >
                  {/* This inline IIFE is your original logic — kept exactly as-is */}
                  {(() => {
                    const Icon = features[currentFeature].icon;
                    return (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="text-blue-400" size={22} />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-base mb-1">
                            {features[currentFeature].title}
                          </h3>
                          <p className="text-slate-400 text-sm leading-relaxed">
                            {features[currentFeature].description}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>

              {/* ── Carousel controls ── */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.06]">

                {/* Dot indicators */}
                <div className="flex gap-1.5">
                  {features.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentFeature(i)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === currentFeature
                          ? "w-8 bg-gradient-to-r from-blue-500 to-indigo-500"
                          : "w-1.5 bg-slate-600 hover:bg-slate-500"
                      }`}
                    />
                  ))}
                </div>

                {/* Prev / Next arrows */}
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      setCurrentFeature((p) =>
                        p === 0 ? features.length - 1 : p - 1
                      )
                    }
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentFeature((p) => (p + 1) % features.length)
                    }
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom stats row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="relative z-10 p-8 xl:px-20"
        >
          <div className="flex items-center gap-8 xl:gap-12">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.1 }}
              >
                <p className="text-2xl xl:text-3xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>




      {/* ================================================
          RIGHT PANEL — Login Form
          Full width on mobile, 45% on desktop
          ================================================ */}
      <div className="w-full lg:w-[45%] flex flex-col min-h-screen lg:min-h-0">


        {/* ── Mobile branding header (hidden on desktop) ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-gradient-to-br from-[#040e1d] via-[#07162d] to-[#0c2340] p-6 pb-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <GraduationCap className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-white font-bold leading-tight">Unicode University</h2>
              <p className="text-blue-300/50 text-[9px] uppercase tracking-[0.2em]">
                Student Portal
              </p>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            Welcome Back,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Scholar
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Sign in to access your academic portal.
          </p>
        </motion.div>


        {/* ── Form container — centered vertically ── */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 xl:p-20 -mt-6 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="w-full max-w-[420px]"
          >

            {/* Desktop header (hidden on mobile) */}
            <div className="hidden lg:block mb-10">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-3xl xl:text-4xl font-bold text-slate-900 mb-3"
              >
                Welcome back
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="text-slate-500"
              >
                Enter your credentials to access your portal.
              </motion.p>
            </div>


            {/* ── Offline Warning Banner ── */}
            <AnimatePresence>
              {isOffline && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <WifiOff size={18} className="text-amber-500 flex-shrink-0" />
                    <p className="text-sm text-amber-700 font-medium">
                      You&apos;re offline. Check your internet connection.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>


            {/* ── Error Message Banner ── */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                    <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-600 font-medium">{error}</p>

                      {/* Extra hint if it looks like a connection issue */}
                      {error.toLowerCase().includes("server") ||
                      error.toLowerCase().includes("connect") ? (
                        <p className="text-xs text-red-400 mt-1">
                          If this persists, the server may be temporarily down.
                          Try again in a few minutes.
                        </p>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>


            {/* ── Success Message Banner ── */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                    <p className="text-sm text-emerald-600 font-medium">{success}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>


            {/* ══════════════════════════════════════════
                LOGIN FORM
                ═══════════════════════════════════════ */}
            <form onSubmit={handleLogin} className="space-y-5">


              {/* ── Email Field ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  University Email
                </label>

                <div
                  className={`relative flex items-center rounded-xl border-2 transition-all duration-300 bg-white ${
                    focusedField === "email"
                      ? "border-blue-500 shadow-lg shadow-blue-500/10 ring-4 ring-blue-500/5"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {/* Mail icon */}
                  <div className="pl-4 pr-1">
                    <Mail
                      size={18}
                      className={`transition-colors duration-300 ${
                        focusedField === "email" ? "text-blue-500" : "text-slate-400"
                      }`}
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="student@unicode.edu"
                    className="w-full py-4 px-3 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="email"
                    required
                  />

                  {/* Green check when email looks valid */}
                  <AnimatePresence>
                    {email.includes("@") && email.includes(".") && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="pr-4"
                      >
                        <CheckCircle size={16} className="text-emerald-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>


              {/* ── Password Field ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>

                <div
                  className={`relative flex items-center rounded-xl border-2 transition-all duration-300 bg-white ${
                    focusedField === "password"
                      ? "border-blue-500 shadow-lg shadow-blue-500/10 ring-4 ring-blue-500/5"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {/* Lock icon */}
                  <div className="pl-4 pr-1">
                    <Lock
                      size={18}
                      className={`transition-colors duration-300 ${
                        focusedField === "password" ? "text-blue-500" : "text-slate-400"
                      }`}
                    />
                  </div>

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full py-4 px-3 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="current-password"
                    required
                  />

                  {/* Show / Hide password toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="pr-4 pl-1 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>


              {/* ── Forgot Password Link ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex justify-end"
              >
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition"
                >
                  Forgot password?
                </button>
              </motion.div>


              {/* ── Submit Button ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <motion.button
                  type="submit"
                  disabled={loading || !email || !password || !!success}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`
                    w-full relative overflow-hidden font-bold text-base py-4 rounded-xl
                    transition-all duration-300 flex items-center justify-center gap-2
                    disabled:cursor-not-allowed
                    ${
                      loading
                        ? "bg-blue-600 text-white"
                        : success
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                        : "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl shadow-slate-900/25 hover:shadow-2xl hover:shadow-slate-900/30 disabled:opacity-60"
                    }
                  `}
                >
                  {/* Animated shine effect — only when idle */}
                  {!loading && !success && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Authenticating...
                      </>
                    ) : success ? (
                      <>
                        <CheckCircle size={20} />
                        Success!
                      </>
                    ) : (
                      <>
                        Secure Login
                        <ArrowRight size={18} />
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </form>


            {/* ── IT Support Link ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-8 pt-6 border-t border-slate-100"
            >
              <p className="text-center text-sm text-slate-400">
                Having trouble?{" "}
                <button className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition">
                  Contact IT Support
                </button>
              </p>
            </motion.div>


            {/* ── SSL Security Badge ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 flex items-center justify-center gap-2 text-slate-400"
            >
              <Shield size={14} />
              <span className="text-xs">256-bit SSL encrypted connection</span>
            </motion.div>

          </motion.div>
        </div>


        {/* ── Mobile bottom stats row ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="lg:hidden px-6 pb-6"
        >
          <div className="grid grid-cols-4 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="text-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm"
              >
                <p className="text-lg font-bold text-slate-800">{s.value}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}